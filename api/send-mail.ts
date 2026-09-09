// api/send-mail.ts
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { EMAIL_TEMPLATES } from "./_email-templates.js"

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

function fillTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/{{(\w+)}}/g, (_, key) => variables[key] ?? "")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" })
  if (req.headers["x-internal-secret"] !== process.env.MAIL_INTERNAL_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { to, type, variables } = req.body ?? {}
  if (!to || !type) return res.status(400).json({ error: "Missing required fields: to, type" })

  const template = EMAIL_TEMPLATES[type]
  if (!template) return res.status(400).json({ error: `Unknown email type: ${type}` })

  const from = process.env.SES_FROM_EMAIL
  if (!from) return res.status(500).json({ error: "Server misconfigured: SES_FROM_EMAIL missing" })

  const vars = variables ?? {}
  const html = fillTemplate(template.html, vars)
  const text = fillTemplate(template.text, vars)
  const subject = fillTemplate(template.subject, vars)

  try {
    const command = new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [to] },
      Message: { Subject: { Data: subject }, Body: { Text: { Data: text }, Html: { Data: html } } },
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