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
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
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
                  <td align="center" bgcolor="#7B3BFF" style="border-radius:12px; background-color:#7B3BFF; background-image:linear-gradient(135deg, #7B3BFF 0%, #5A1FE0 100%);">
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
                <a href="mailto:nomapayapp@gmail.com" style="color:#C9AEFF; text-decoration:underline;">escribinos</a>.
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

  // Transferencia enviada, EXITOSA. 
  transaction_sent: {
    subject: "Transferencia enviada — NomaPay",
    text: "Enviaste {{MONTO}} {{MONEDA}} a {{CONTRAPARTE}}. Operación N° {{NUMERO_OPERACION}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Comprobante — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <!-- Círculo de estado: éxito -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td align="center" valign="middle" width="64" height="64" bgcolor="#12E0D4" style="border-radius:32px; font-size:28px; color:#FFFFFF; line-height:64px; text-align:center; font-family: Arial, sans-serif;">
                    &#10003;
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                Transferencia enviada
              </p>

              <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF; text-align:center;">
                {{MONTO}} {{MONEDA}}
              </p>

              <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                N° de operación {{NUMERO_OPERACION}}
              </p>

              <!-- Detalle -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Para</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{CONTRAPARTE}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Alias</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{ALIAS}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Comisión</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#12E0D4; font-size:14px; font-weight:600;" align="right">{{COMISION}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Desde</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{ORIGEN}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#9BA3C7; font-size:14px;">Fecha</td>
                        <td style="color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{FECHA}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global. Viví local.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Este es un comprobante automático de tu cuenta NomaPay.
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

  // Transferencia enviada, RECHAZADA. Solo se le manda a quien envía (nunca
  // al destinatario).
  transaction_sent_rejected: {
    subject: "No pudimos enviar tu transferencia — NomaPay",
    text: "No pudimos enviar {{MONTO}} {{MONEDA}} a {{CONTRAPARTE}}. {{MOTIVO_MENSAJE}} Referencia {{NUMERO_OPERACION}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Comprobante — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <!-- Círculo de estado: rechazada -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td align="center" valign="middle" width="64" height="64" bgcolor="#FF2E88" style="border-radius:32px; font-size:28px; color:#FFFFFF; line-height:64px; text-align:center; font-family: Arial, sans-serif;">
                    &#10005;
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                No pudimos enviar el dinero
              </p>

              <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF; text-align:center;">
                {{MONTO}} {{MONEDA}}
              </p>

              <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                N° de operación {{NUMERO_OPERACION}}
              </p>

              <!-- Motivo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="border:1px solid rgba(255,46,136,0.35); background-color:rgba(255,46,136,0.10); border-radius:12px; padding:16px 18px;">
                    <p style="margin:0 0 4px 0; font-size:12px; font-weight:700; letter-spacing:0.04em; color:#FF9CC4;">
                      Motivo
                    </p>
                    <p style="margin:0; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                      {{MOTIVO_MENSAJE}} No se descontó nada de tu saldo.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Detalle -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Para</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{CONTRAPARTE}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#9BA3C7; font-size:14px;">Fecha</td>
                        <td style="color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{FECHA}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global. Viví local.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Este es un comprobante automático de tu cuenta NomaPay. Si el problema persiste, escribinos a
                <a href="mailto:nomapayapp@gmail.com" style="color:#C9AEFF; text-decoration:underline;">nomapayapp@gmail.com</a>.
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

  // Transferencia recibida, EXITOSA 
  transaction_received: {
    subject: "Recibiste una transferencia — NomaPay",
    text: "Recibiste {{MONTO}} {{MONEDA}} de {{CONTRAPARTE}}. Operación N° {{NUMERO_OPERACION}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Comprobante — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <!-- Círculo de estado: éxito -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td align="center" valign="middle" width="64" height="64" bgcolor="#12E0D4" style="border-radius:32px; font-size:28px; color:#FFFFFF; line-height:64px; text-align:center; font-family: Arial, sans-serif;">
                    &#10003;
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                Recibiste una transferencia
              </p>

              <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF; text-align:center;">
                {{MONTO}} {{MONEDA}}
              </p>

              <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                N° de operación {{NUMERO_OPERACION}}
              </p>

              <!-- Detalle -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">De</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{CONTRAPARTE}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Destino</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{DESTINO}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#9BA3C7; font-size:14px;">Fecha</td>
                        <td style="color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{FECHA}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global. Viví local.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Este es un comprobante automático de tu cuenta NomaPay.
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

  // Mail de bienvenida / confirmación de email al registrarse.
  welcome: {
    subject: "Confirmá tu email y activá tu cuenta — NomaPay",
    text: "Hola {{USER_NAME}}, confirmá tu email para activar tu cuenta de NomaPay: {{CONFIRM_LINK}}",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Bienvenida — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <p style="margin:0 0 10px 0; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#C9AEFF;">
                Bienvenida a NomaPay
              </p>

              <h1 style="margin:0 0 16px 0; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.25;">
                Confirmá tu email y activá tu cuenta
              </h1>

              <p style="margin:0 0 28px 0; font-size:15px; line-height:1.6; color:#C3C7DE;">
                Hola {{USER_NAME}}, creamos tu cuenta con <strong style="color:#FFFFFF;">{{USER_EMAIL}}</strong>. Nos falta un paso: confirmá que este email es tuyo para poder cobrar y mover tu dinero.
              </p>

              <!-- Botón -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" bgcolor="#7B3BFF" style="border-radius:12px; background-color:#7B3BFF; background-image:linear-gradient(135deg, #7B3BFF 0%, #5A1FE0 100%);">
                    <a href="{{CONFIRM_LINK}}" style="display:inline-block; padding:15px 32px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Confirmar mi email
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Alerta de vencimiento -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border:1px solid rgba(255,210,63,0.3); background-color:rgba(255,246,220,0.08); border-radius:12px; padding:14px 16px; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                    El link vence en <strong style="color:#FFD23F;">24 horas</strong> y se puede usar <strong style="color:#FFD23F;">una sola vez</strong>. Si vence, pedí uno nuevo desde la app.
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 14px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                Qué sigue después
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td valign="top" width="26" style="padding-bottom:16px; font-size:14px; font-weight:700; color:#C9AEFF;">1</td>
                  <td valign="top" style="padding-bottom:16px; font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Te damos tus datos de cuenta</strong> — alias, CBU y la opción de elegir tu divisa favorita.
                  </td>
                </tr>
                <tr>
                  <td valign="top" width="26" style="padding-bottom:16px; font-size:14px; font-weight:700; color:#C9AEFF;">2</td>
                  <td valign="top" style="padding-bottom:16px; font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Ya tenés tus cuentas disponibles</strong> — en USD, BRL y ARS, a tu nombre.
                  </td>
                </tr>
                <tr>
                  <td valign="top" width="26" style="padding-bottom:4px; font-size:14px; font-weight:700; color:#C9AEFF;">3</td>
                  <td valign="top" style="padding-bottom:4px; font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Cobrás y cambiás</strong> — recibís, convertís al tipo de cambio del día y retirás.
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.10); margin:16px 0 20px 0;">
                <tr><td style="padding-top:20px;"></td></tr>
              </table>

              <p style="margin:0; font-size:13px; line-height:1.6; color:#C3C7DE;">
                Si no creaste esta cuenta, no hagas nada: sin confirmar el email la cuenta se borra sola en 7 días. Ante cualquier duda escribinos a
                <a href="mailto:nomapayapp@gmail.com" style="color:#C9AEFF; text-decoration:underline;">nomapayapp@gmail.com</a>.
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
                Recibís este mail porque alguien usó {{USER_EMAIL}} para registrarse.<br />
                Nunca te vamos a pedir tu contraseña por mail.
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

  // Confirmación de baja / eliminación de cuenta.
  account_deletion: {
    subject: "Eliminamos tu cuenta — NomaPay",
    text: "Hola {{USER_NAME}}, la cuenta de {{USER_EMAIL}} se eliminó con éxito. Podés reactivarla hasta el {{REACTIVATION_DEADLINE}}. N° de solicitud {{TICKET_ID}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cuenta eliminada — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <p style="margin:0 0 10px 0; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#12E0D4;">
                Cuenta cerrada
              </p>

              <h1 style="margin:0 0 16px 0; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.25;">
                Eliminamos tu cuenta
              </h1>

              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#C3C7DE;">
                Hola {{USER_NAME}}, la cuenta de <strong style="color:#FFFFFF;">{{USER_EMAIL}}</strong> se eliminó con éxito. Ya no vas a poder ingresar ni recibir pagos con tus datos de cobro.
              </p>

              <!-- Detalle -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:18px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Fecha de baja</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{DELETED_AT}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Saldo al cerrar</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{FINAL_BALANCE}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#9BA3C7; font-size:14px;">N° de solicitud</td>
                        <td style="color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{TICKET_ID}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 14px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                Qué pasa con tus datos
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.07); font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Dimos de baja tus datos de cobro</strong> — Tu CBU y cuentas en USD, BRL y ARS dejaron de funcionar.
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.07); font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Borramos tu perfil y tus sesiones</strong> — Nombre, contactos guardados y dispositivos vinculados.
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px; font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Guardamos tu historial de operaciones 10 años</strong> — nos obliga la normativa financiera. Queda cifrado y nadie lo usa para publicidad.
                  </td>
                </tr>
              </table>

              <!-- Alerta de reactivación -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border:1px solid rgba(255,210,63,0.3); background-color:rgba(255,246,220,0.08); border-radius:12px; padding:16px 18px;">
                    <p style="margin:0 0 4px 0; font-size:12px; font-weight:700; letter-spacing:0.04em; color:#FFD23F;">
                      Te quedan 30 días para volver
                    </p>
                    <p style="margin:0; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                      Si te arrepentís, hasta el <strong style="color:#FFFFFF;">{{REACTIVATION_DEADLINE}}</strong> podemos reactivar la cuenta con el mismo email. Pasada esa fecha la baja es definitiva y habría que empezar de cero.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Botón -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center" bgcolor="#7B3BFF" style="border-radius:12px; background-color:#7B3BFF; background-image:linear-gradient(135deg, #7B3BFF 0%, #5A1FE0 100%);">
                    <a href="{{REACTIVATION_LINK}}" style="display:inline-block; padding:15px 32px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Reactivar mi cuenta
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.10); margin-bottom:20px;">
                <tr><td style="padding-top:20px;"></td></tr>
              </table>

              <p style="margin:0; font-size:13px; line-height:1.6; color:#C3C7DE;">
                Si no pediste esta baja, escribinos ya a
                <a href="mailto:nomapay@gmail.com" style="color:#C9AEFF; text-decoration:underline;">nomapay@gmail.com</a> con el número de solicitud.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Este es el último mail que te enviamos: ya te sacamos de todas las listas. Gracias por haber estado.
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

  // Resumen semanal de actividad.
  weekly_summary: {
    subject: "Tu resumen semanal — NomaPay",
    text: "Tu balance total es {{BALANCE_TOTAL}}. Entradas {{ENTRADAS_TOTAL}}, salidas {{SALIDAS_TOTAL}}, cambios de moneda {{CAMBIOS_TOTAL}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Resumen semanal — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <p style="margin:0 0 10px 0; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#C9AEFF;">
                {{RANGO_FECHAS}}
              </p>

              <h1 style="margin:0 0 20px 0; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.25;">
                Tu resumen semanal
              </h1>

              <p style="margin:0 0 4px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                Balance total
              </p>
              <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF;">
                {{BALANCE_TOTAL}}
              </p>

              <!-- Tiles -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Entradas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#12E0D4;">+{{ENTRADAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{ENTRADAS_COUNT}} movimientos</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Salidas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FF9CC4;">−{{SALIDAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{SALIDAS_COUNT}} movimiento</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Cambios</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FFFFFF;">{{CAMBIOS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{CAMBIOS_COUNT}} operaciones</p>
                  </td>
                </tr>
              </table>

              <!-- Tu mejor día -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 6px 0; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#9BA3C7;">
                      Tu mejor día
                    </p>
                    <p style="margin:0 0 4px 0; font-size:17px; font-weight:700; color:#FFFFFF;">
                      {{MEJOR_DIA}}
                    </p>
                    <p style="margin:0; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                      {{MEJOR_DIA_DETALLE}}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                Esta semana
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Entradas</td>
                  <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{ENTRADAS_TOTAL}}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Salidas</td>
                  <td style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{SALIDAS_TOTAL}}</td>
                </tr>
                <tr>
                  <td style="padding-top:12px; color:#9BA3C7; font-size:14px;">Cambios de moneda</td>
                  <td style="padding-top:12px; color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{CAMBIOS_TOTAL}}</td>
                </tr>
              </table>

              <!-- Botón -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center" bgcolor="#7B3BFF" style="border-radius:12px; background-color:#7B3BFF; background-image:linear-gradient(135deg, #7B3BFF 0%, #5A1FE0 100%);">
                    <a href="{{MOVIMIENTOS_LINK}}" style="display:inline-block; padding:15px 32px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Ver mis movimientos
                    </a>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.10); margin-bottom:20px;">
                <tr><td style="padding-top:20px;"></td></tr>
              </table>

              <p style="margin:0; font-size:13px; line-height:1.6; color:#C3C7DE;">
                {{TEXTO_COMPARACION}}
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
                Te enviamos este resumen porque activaste los avisos semanales para {{USER_EMAIL}}.<br />
                Podés <a href="{{PREFERENCIAS_LINK}}" style="color:#C9AEFF; text-decoration:underline;">cambiar la frecuencia o darte de baja</a> cuando quieras.
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

  // Conversión de divisas EXITOSA. 
  exchange_success: {
    subject: "Conversión realizada — NomaPay",
    text: "Convertiste {{MONTO_ORIGEN}} {{MONEDA_ORIGEN}} a {{MONTO_FINAL}} {{MONEDA_DESTINO}}. Operación N° {{NUMERO_OPERACION}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Comprobante — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <!-- Círculo de estado: éxito -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td align="center" valign="middle" width="64" height="64" bgcolor="#12E0D4" style="border-radius:32px; font-size:28px; color:#FFFFFF; line-height:64px; text-align:center; font-family: Arial, sans-serif;">
                    &#10003;
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                Conversión realizada
              </p>

              <p style="margin:0 0 6px 0; font-size:30px; font-weight:700; color:#FFFFFF; text-align:center;">
                {{MONTO_ORIGEN}} {{MONEDA_ORIGEN}}
              </p>

              <p style="margin:0 0 24px 0; font-size:15px; color:#12E0D4; text-align:center;">
                → {{MONTO_FINAL}} {{MONEDA_DESTINO}}
              </p>

              <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                N° de operación {{NUMERO_OPERACION}}
              </p>

              <!-- Detalle -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Convertiste</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{MONTO_ORIGEN}} {{MONEDA_ORIGEN}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Recibiste</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{MONTO_FINAL}} {{MONEDA_DESTINO}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Tipo de cambio</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{TASA_CAMBIO}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Comisión</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#12E0D4; font-size:14px; font-weight:600;" align="right">{{COMISION}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#9BA3C7; font-size:14px;">Fecha</td>
                        <td style="color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{FECHA}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global. Viví local.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Este es un comprobante automático de tu cuenta NomaPay.
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

  // Conversión de divisas RECHAZADA. 
  exchange_rejected: {
    subject: "No pudimos hacer tu conversión — NomaPay",
    text: "No pudimos convertir {{MONTO_ORIGEN}} {{MONEDA_ORIGEN}} a {{MONEDA_DESTINO}}. {{MOTIVO_MENSAJE}} Referencia {{NUMERO_OPERACION}}.",
    html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Comprobante — NomaPay</title>
</head>
<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img src="https://noma-pay-frontend.vercel.app/email-logo.png" width="160" height="100" alt="NomaPay" style="display:block; width:160px; height:100px; border:0; outline:none;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <!-- Círculo de estado: rechazada -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td align="center" valign="middle" width="64" height="64" bgcolor="#FF2E88" style="border-radius:32px; font-size:28px; color:#FFFFFF; line-height:64px; text-align:center; font-family: Arial, sans-serif;">
                    &#10005;
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0; font-size:19px; font-weight:700; color:#FFFFFF; text-align:center;">
                No pudimos convertir tu dinero
              </p>

              <p style="margin:0 0 24px 0; font-size:34px; font-weight:700; color:#FFFFFF; text-align:center;">
                {{MONTO_ORIGEN}} {{MONEDA_ORIGEN}}
              </p>

              <p style="margin:0 0 24px 0; font-size:13px; color:#9BA3C7; text-align:center;">
                N° de operación {{NUMERO_OPERACION}}
              </p>

              <!-- Motivo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="border:1px solid rgba(255,46,136,0.35); background-color:rgba(255,46,136,0.10); border-radius:12px; padding:16px 18px;">
                    <p style="margin:0 0 4px 0; font-size:12px; font-weight:700; letter-spacing:0.04em; color:#FF9CC4;">
                      Motivo
                    </p>
                    <p style="margin:0; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                      {{MOTIVO_MENSAJE}} No se descontó nada de tu saldo.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Detalle -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px 0 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#9BA3C7; font-size:14px;">Ibas a convertir a</td>
                        <td style="padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.07); color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{MONEDA_DESTINO}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 20px 18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#9BA3C7; font-size:14px;">Fecha</td>
                        <td style="color:#FFFFFF; font-size:14px; font-weight:600;" align="right">{{FECHA}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 6px 0; font-size:13px; font-weight:700; color:#C3C7DE;">
                NomaPay — Cobrá global. Viví local.
              </p>
              <p style="margin:0; font-size:11.5px; line-height:1.6; color:#9BA3C7;">
                Este es un comprobante automático de tu cuenta NomaPay. Si el problema persiste, escribinos a
                <a href="mailto:nomapayapp@gmail.com" style="color:#C9AEFF; text-decoration:underline;">nomapayapp@gmail.com</a>.
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