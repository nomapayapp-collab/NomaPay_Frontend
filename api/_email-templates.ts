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
  subject: "¡Bienvenido/a a NomaPay! 🌎",

  text: "Hola {{USER_NAME}}, ¡bienvenido/a a NomaPay! Ya sos parte de una nueva forma de cobrar y mover tu dinero estés donde estés.",

  html: `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Bienvenido — NomaPay</title>
</head>

<body style="margin:0; padding:0; background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); font-family:Arial, Helvetica, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#0F1330; background-image:radial-gradient(120% 90% at 15% 0%, rgba(123,59,255,.55), rgba(18,224,212,.18) 45%, transparent 75%); padding:40px 16px;">

    <tr>
      <td align="center">

        <table role="presentation" width="480" cellpadding="0" cellspacing="0"
          style="width:480px; max-width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img
                src="https://noma-pay-frontend.vercel.app/email-logo.png"
                width="160"
                height="100"
                alt="NomaPay"
                style="display:block; width:160px; height:100px; border:0; outline:none;"
              />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#171C3D; border-radius:16px; padding:36px 32px;">

              <!-- Eyebrow -->
              <p style="margin:0 0 10px 0; font-size:11px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#C9AEFF;">
                Bienvenido/a a NomaPay
              </p>

              <!-- Title -->
              <h1 style="margin:0 0 16px 0; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.25;">
                ¡Qué bueno tenerte acá! 🌎
              </h1>

              <!-- Intro -->
              <p style="margin:0 0 28px 0; font-size:15px; line-height:1.6; color:#C3C7DE;">
                Hola {{USER_NAME}}, gracias por sumarte a NomaPay.
                Creamos una cuenta pensada para que puedas
                <strong style="color:#FFFFFF;">cobrar global y vivir local</strong>,
                estés donde estés.
              </p>

              <!-- Features title -->
              <p style="margin:0 0 14px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                Con NomaPay podés
              </p>

              <!-- Feature 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td valign="top" width="32"
                    style="font-size:18px; color:#12E0D4;">
                    ●
                  </td>

                  <td valign="top"
                    style="font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Cobrar desde cualquier lugar</strong><br />
                    Recibí tu dinero estés donde estés.
                  </td>
                </tr>
              </table>

              <!-- Feature 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td valign="top" width="32"
                    style="font-size:18px; color:#12E0D4;">
                    ●
                  </td>

                  <td valign="top"
                    style="font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Mover tu dinero con libertad</strong><br />
                    Gestioná tus fondos desde una sola cuenta.
                  </td>
                </tr>
              </table>

              <!-- Feature 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td valign="top" width="32"
                    style="font-size:18px; color:#12E0D4;">
                    ●
                  </td>

                  <td valign="top"
                    style="font-size:14px; line-height:1.5; color:#C3C7DE;">
                    <strong style="color:#FFFFFF;">Trabajar con distintas monedas</strong><br />
                    Operá con USD, BRL y ARS.
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                style="border-top:1px solid rgba(255,255,255,0.10); margin:0 0 20px 0;">
                <tr>
                  <td></td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin:0; font-size:14px; line-height:1.6; color:#C3C7DE;">
                Esperamos acompañarte en cada lugar desde el que elijas trabajar,
                viajar y vivir.
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
                Gracias por elegir NomaPay.
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

  // Resumen semanal de actividad — desglosado por las 3 monedas de la cuenta.
  weekly_summary: {
    subject: "Tu resumen semanal — NomaPay",
    text: "ARS: balance {{ARS_BALANCE}}, entradas {{ARS_ENTRADAS_MONTO}} ({{ARS_ENTRADAS_DETALLE}}), salidas {{ARS_SALIDAS_MONTO}} ({{ARS_SALIDAS_DETALLE}}), cambios {{ARS_CAMBIOS_MONTO}} ({{ARS_CAMBIOS_DETALLE}}). USD: balance {{USD_BALANCE}}, entradas {{USD_ENTRADAS_MONTO}} ({{USD_ENTRADAS_DETALLE}}), salidas {{USD_SALIDAS_MONTO}} ({{USD_SALIDAS_DETALLE}}), cambios {{USD_CAMBIOS_MONTO}} ({{USD_CAMBIOS_DETALLE}}). BRL: balance {{BRL_BALANCE}}, entradas {{BRL_ENTRADAS_MONTO}} ({{BRL_ENTRADAS_DETALLE}}), salidas {{BRL_SALIDAS_MONTO}} ({{BRL_SALIDAS_DETALLE}}), cambios {{BRL_CAMBIOS_MONTO}} ({{BRL_CAMBIOS_DETALLE}}).",
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

              <h1 style="margin:0 0 8px 0; font-size:26px; font-weight:700; color:#FFFFFF; line-height:1.25;">
                Tu resumen semanal
              </h1>

              <p style="margin:0 0 28px 0; font-size:13.5px; line-height:1.5; color:#C3C7DE;">
                Así estuvo tu semana en tus 3 monedas.
              </p>

              <!-- ===== ARS ===== -->
              <p style="margin:0 0 4px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                ARS · Peso argentino
              </p>
              <p style="margin:0 0 16px 0; font-size:28px; font-weight:700; color:#FFFFFF;">
                {{ARS_BALANCE}}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Entradas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#12E0D4;">+{{ARS_ENTRADAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{ARS_ENTRADAS_DETALLE}}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Salidas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FF9CC4;">−{{ARS_SALIDAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{ARS_SALIDAS_DETALLE}}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Cambios</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FFFFFF;">{{ARS_CAMBIOS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{ARS_CAMBIOS_DETALLE}}</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 4px 0; font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#9BA3C7;">
                      Tu mejor día
                    </p>
                    <p style="margin:0 0 3px 0; font-size:15px; font-weight:700; color:#FFFFFF;">
                      {{ARS_MEJOR_DIA}}
                    </p>
                    <p style="margin:0 0 8px 0; font-size:12.5px; line-height:1.5; color:#C3C7DE;">
                      {{ARS_MEJOR_DIA_DETALLE}}
                    </p>
                    <p style="margin:0; font-size:12.5px; line-height:1.5; color:#C3C7DE; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
                      {{ARS_COMPARACION}}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ===== USD ===== -->
              <p style="margin:0 0 4px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                USD · Dólar
              </p>
              <p style="margin:0 0 16px 0; font-size:28px; font-weight:700; color:#FFFFFF;">
                {{USD_BALANCE}}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Entradas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#12E0D4;">+{{USD_ENTRADAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{USD_ENTRADAS_DETALLE}}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Salidas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FF9CC4;">−{{USD_SALIDAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{USD_SALIDAS_DETALLE}}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Cambios</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FFFFFF;">{{USD_CAMBIOS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{USD_CAMBIOS_DETALLE}}</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px; margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 4px 0; font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#9BA3C7;">
                      Tu mejor día
                    </p>
                    <p style="margin:0 0 3px 0; font-size:15px; font-weight:700; color:#FFFFFF;">
                      {{USD_MEJOR_DIA}}
                    </p>
                    <p style="margin:0 0 8px 0; font-size:12.5px; line-height:1.5; color:#C3C7DE;">
                      {{USD_MEJOR_DIA_DETALLE}}
                    </p>
                    <p style="margin:0; font-size:12.5px; line-height:1.5; color:#C3C7DE; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
                      {{USD_COMPARACION}}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ===== BRL ===== -->
              <p style="margin:0 0 4px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#9BA3C7;">
                BRL · Real
              </p>
              <p style="margin:0 0 16px 0; font-size:28px; font-weight:700; color:#FFFFFF;">
                {{BRL_BALANCE}}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Entradas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#12E0D4;">+{{BRL_ENTRADAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{BRL_ENTRADAS_DETALLE}}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Salidas</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FF9CC4;">−{{BRL_SALIDAS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{BRL_SALIDAS_DETALLE}}</p>
                  </td>
                  <td width="2%"></td>
                  <td width="32%" valign="top" style="background-color:#0F1330; border-radius:12px; padding:14px 12px;">
                    <p style="margin:0 0 6px 0; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#9BA3C7;">Cambios</p>
                    <p style="margin:0 0 4px 0; font-size:16px; font-weight:700; color:#FFFFFF;">{{BRL_CAMBIOS_MONTO}}</p>
                    <p style="margin:0; font-size:11px; color:#9BA3C7;">{{BRL_CAMBIOS_DETALLE}}</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F1330; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 4px 0; font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#9BA3C7;">
                      Tu mejor día
                    </p>
                    <p style="margin:0 0 3px 0; font-size:15px; font-weight:700; color:#FFFFFF;">
                      {{BRL_MEJOR_DIA}}
                    </p>
                    <p style="margin:0 0 8px 0; font-size:12.5px; line-height:1.5; color:#C3C7DE;">
                      {{BRL_MEJOR_DIA_DETALLE}}
                    </p>
                    <p style="margin:0; font-size:12.5px; line-height:1.5; color:#C3C7DE; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
                      {{BRL_COMPARACION}}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Botón -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td align="center" bgcolor="#7B3BFF" style="border-radius:12px; background-color:#7B3BFF; background-image:linear-gradient(135deg, #7B3BFF 0%, #5A1FE0 100%);">
                    <a href="{{MOVIMIENTOS_LINK}}" style="display:inline-block; padding:15px 32px; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Ver mis movimientos
                    </a>
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
                Te enviamos este resumen automático porque activaste los avisos semanales para {{USER_EMAIL}}.<br />
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