export const EMAIL_TEMPLATES: Record<string, { subject: string; text: string; html: string }> = {
  reset_password: {
    subject: "Recuperá tu contraseña — NomaPay",
    text: "Para restablecer tu contraseña, entrá a: {{RESET_LINK}}",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Recuperar contraseña — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0B0F24; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F24; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Wordmark -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="font-size:22px; font-weight:700; letter-spacing:0.02em;">
                <span style="color:#FFFFFF;">NOMA</span><span style="color:#FF2E88;">PAY</span>
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <p style="margin:0 0 10px 0; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#C9AEFF;">
                Seguridad de la cuenta
              </p>

              <h1 style="margin:0 0 16px 0; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.25;">
                Recuperá tu contraseña
              </h1>

              <p style="margin:0 0 28px 0; font-size:15px; line-height:1.6; color:#C3C7DE;">
                Hola {{USER_NAME}}, recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste vos, tocá el botón y elegí una nueva.
              </p>

              <!-- Botón -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" bgcolor="#6633F2" style="border-radius:12px; background-color:#6633F2; background-image:linear-gradient(135deg, #6633F2 0%, #4A55D8 100%);">
                    <a href="{{RESET_LINK}}" style="display:inline-block; padding:15px 32px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Elegir una contraseña nueva
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alerta de vencimiento -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border:1px solid rgba(255,210,63,0.3); background-color:rgba(255,246,220,0.08); border-radius:12px; padding:14px 16px; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                    El link vence en <strong style="color:#FFD23F;">30 minutos</strong> y se puede usar <strong style="color:#FFD23F;">una sola vez</strong>.
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                Si el botón no funciona
              </p>
              <p style="margin:0 0 24px 0; font-size:13px; word-break:break-all;">
                <a href="{{RESET_LINK}}" style="color:#C9AEFF; text-decoration:underline;">{{RESET_LINK}}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.10); margin-bottom:20px;">
                <tr><td style="padding-top:20px;"></td></tr>
              </table>

              <p style="margin:0; font-size:13px; line-height:1.6; color:#C3C7DE;">
                Si no pediste el cambio, podés ignorar este mail: tu contraseña actual sigue siendo válida. Si sospechás que alguien más intentó entrar,
                <a href="mailto:soporte@nomapay.app" style="color:#C9AEFF; text-decoration:underline;">escribinos</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global. Viví local.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Te enviamos este mail porque se pidió un cambio de contraseña para {{USER_EMAIL}}.<br />
                Nunca te vamos a pedir tu contraseña ni un código por mail.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  },
  // transaction_deposit, transaction_exchange, weekly_summary:
  // los vas sumando acá con sus {{VARIABLES}} a medida que termines cada uno en Stripo.

  // NOTA para el equipo: este template vivía en un export separado
  // (TRANSACTION_SENT) que send-mail.ts nunca leía, así que cada mail de
  // transferencia tiraba "Unknown email type" — lo movimos acá adentro de
  // EMAIL_TEMPLATES (que es el mapa que de verdad usa el handler) para que
  // funcione. NO tocamos el asunto/texto ni los nombres de variables
  // ({{ESTADO_COLOR}}, {{ESTADO_TEXTO}}, {{MONTO}}, {{MONEDA}},
  // {{NUMERO_OPERACION}}, {{DETALLE_HTML}}) — quedan pendientes de terminar
  // en Stripo. Ojo: el asunto/texto de acá abajo todavía dicen "Recuperá tu
  // contraseña", copiados del template de reset_password.
  transaction_sent: {
    subject: "Recuperá tu contraseña — NomaPay",
    text: "Para restablecer tu contraseña, entrá a: {{RESET_LINK}}",
    html: `<!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comprobante — NomaPay</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0B0F24; font-family: Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F24; padding:40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

              <!-- Wordmark -->
              <tr>
                <td align="center" style="padding-bottom:28px;">
                  <span style="font-size:22px; font-weight:700; letter-spacing:0.02em;">
                    <span style="color:#FFFFFF;">NOMA</span><span style="color:#FF2E88;">PAY</span>
                  </span>
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

                  <!-- Círculo de estado -->
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                    <tr>
                      <td align="center" valign="middle" width="64" height="64" bgcolor="{{ESTADO_COLOR}}" style="border-radius:32px; font-size:30px; color:#FFFFFF; line-height:64px; text-align:center;">
                        {{ESTADO_ICONO}}
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                    {{ESTADO_TEXTO}}
                  </p>

                  <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF; text-align:center;">
                    {{MONTO}} {{MONEDA}}
                  </p>

                  <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                    Operación N° {{NUMERO_OPERACION}}
                  </p>

                  <!-- Detalle (lo arma el back según el estado) -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                    <tr>
                      <td style="padding:18px 20px; font-size:14px; line-height:1.9; color:#C3C7DE;">
                        {{DETALLE_HTML}}
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top:28px;">
                  <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                    NomaPay — Cobrá global. Viví local.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`,
  },

  // El back también manda type: "transaction_received" (mail al que RECIBE
  // la transferencia) y ese template todavía no existía en ningún lado, así
  // que sin esto el mail al receptor también tiraba "Unknown email type".
  // De mínima lo agregamos con el mismo HTML/variables que transaction_sent
  // para que no rompa — el equipo de diseño lo tiene que diferenciar en
  // Stripo (por ahora dice lo mismo para "enviaste" y "recibiste").
  transaction_received: {
    subject: "Recuperá tu contraseña — NomaPay",
    text: "Para restablecer tu contraseña, entrá a: {{RESET_LINK}}",
    html: `<!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comprobante — NomaPay</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0B0F24; font-family: Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F24; padding:40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

              <!-- Wordmark -->
              <tr>
                <td align="center" style="padding-bottom:28px;">
                  <span style="font-size:22px; font-weight:700; letter-spacing:0.02em;">
                    <span style="color:#FFFFFF;">NOMA</span><span style="color:#FF2E88;">PAY</span>
                  </span>
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

                  <!-- Círculo de estado -->
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                    <tr>
                      <td align="center" valign="middle" width="64" height="64" bgcolor="{{ESTADO_COLOR}}" style="border-radius:32px; font-size:30px; color:#FFFFFF; line-height:64px; text-align:center;">
                        {{ESTADO_ICONO}}
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                    {{ESTADO_TEXTO}}
                  </p>

                  <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF; text-align:center;">
                    {{MONTO}} {{MONEDA}}
                  </p>

                  <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                    Operación N° {{NUMERO_OPERACION}}
                  </p>

                  <!-- Detalle (lo arma el back según el estado) -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                    <tr>
                      <td style="padding:18px 20px; font-size:14px; line-height:1.9; color:#C3C7DE;">
                        {{DETALLE_HTML}}
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top:28px;">
                  <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                    NomaPay — Cobrá global. Viví local.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`,
  },
}
