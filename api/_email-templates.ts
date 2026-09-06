export const EMAIL_TEMPLATES: Record<string, { subject: string; text: string; html: string }> = {
  reset_password: {
    subject: "Recuperá tu contraseña — NomaPay",
    text: "Para restablecer tu contraseña, entrá a: {{RESET_LINK}}",
    html: `/* acá pegás el HTML de recuperar contraseña que ya armamos, con {{RESET_LINK}} */`,
  },
  // transaction_sent, transaction_received, transaction_deposit, transaction_exchange, weekly_summary:
  // los vas sumando acá con sus {{VARIABLES}} a medida que termines cada uno en Stripo.
}