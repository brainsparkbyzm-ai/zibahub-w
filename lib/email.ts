import nodemailer from "nodemailer";

export function emailConfig() {
  const host = process.env.SMTP_HOST;
  const from = process.env.EMAIL_FROM;
  if (!host || !from) return { configured: false as const };
  return {
    configured: true as const,
    host,
    from,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };
}

export async function sendTransactionalEmail(input: { to: string; subject: string; text: string }) {
  const config = emailConfig();
  if (!config.configured) return { sent: false as const, reason: "not_configured" as const };
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
  });
  await transport.sendMail({ from: config.from, to: input.to, subject: input.subject, text: input.text });
  return { sent: true as const };
}
