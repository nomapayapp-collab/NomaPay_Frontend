import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // Solo nuestro backend puede llamar a este endpoint (no queda abierto a cualquiera).
  if (req.headers["x-internal-secret"] !== process.env.MAIL_INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { to, subject, text, html } = req.body ?? {}

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields: to, subject, text" })
  }

  const from = process.env.SES_FROM_EMAIL
  if (!from) {
    return res.status(500).json({ error: "Server misconfigured: SES_FROM_EMAIL missing" })
  }

  try {
    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: { Data: text },
          ...(html ? { Html: { Data: html } } : {}),
        },
      },
    })

    const result = await ses.send(command)
    return res.status(200).json({ ok: true, messageId: result.MessageId })
  } catch (err) {
    const name = err instanceof Error ? err.name : "UnknownError"
    const message = err instanceof Error ? err.message : "Failed to send email"
    console.error("SES send error:", name, message)
    return res.status(500).json({ ok: false, error: name, message })
  }
}