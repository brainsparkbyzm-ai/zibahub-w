import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { sendTransactionalEmail, emailConfig } from "@/lib/email";
import { hashPassword, hashToken, randomToken, verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { clearSession, createSession } from "@/lib/session";
import { uniqueSlug } from "@/lib/format";
import { brand } from "@/config/brand";
import type { z } from "zod";
import { loginSchema, registerSchema, resetSchema } from "@/validation/auth";

export async function registerUser(input: z.infer<typeof registerSchema>, meta: { ip: string; userAgent: string | null }) {
  await rateLimit(`register:${meta.ip}`, 8, 60 * 60 * 1000);
  const email = input.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "email_taken", "An account with that email already exists.");
  const user = await db.user.create({
    data: {
      email,
      name: input.name,
      role: input.role,
      passwordHash: await hashPassword(input.password),
    },
  });
  if (input.role === "EMPLOYER") {
    const name = input.companyName?.trim() || `${input.name} Hiring`;
    await db.company.create({
      data: { ownerId: user.id, name, slug: uniqueSlug(name), status: "PENDING", description: "Company profile is waiting for details." },
    });
  }
  await audit(user.id, "user.register", "User", user.id, { role: user.role });
  const verification = await issueVerification(user.id, user.email);
  await createSession(user, meta);
  return { userId: user.id, email: verification };
}

export async function loginUser(input: z.infer<typeof loginSchema>, meta: { ip: string; userAgent: string | null }) {
  await rateLimit(`login:${meta.ip}`, 12, 15 * 60 * 1000);
  const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
    throw new AppError(401, "invalid_credentials", "Email or password is incorrect.");
  }
  if (user.status !== "ACTIVE") throw new AppError(403, "suspended", "This account is suspended.");
  await createSession(user, meta);
  await audit(user.id, "user.login", "User", user.id);
  return { id: user.id, role: user.role };
}

export async function logoutUser() {
  await clearSession();
}

async function issueVerification(userId: string, email: string) {
  const token = randomToken();
  await db.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });
  const link = `${brand.url}/verify-email?token=${token}`;
  const mail = await sendTransactionalEmail({
    to: email,
    subject: "Verify your ZibaHub email",
    text: `Confirm your email: ${link}\nThis link expires in 24 hours.`,
  });
  return { sent: mail.sent, configured: emailConfig().configured, devLink: mail.sent ? null : link };
}

export async function requestPasswordReset(email: string, ip: string) {
  await rateLimit(`reset:${ip}`, 6, 60 * 60 * 1000);
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return { sent: false, configured: emailConfig().configured, neutral: true };
  const token = randomToken();
  await db.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 1000 * 60 * 30) },
  });
  const link = `${brand.url}/reset-password?token=${token}`;
  const mail = await sendTransactionalEmail({
    to: user.email,
    subject: "Reset your ZibaHub password",
    text: `Reset your password: ${link}\nThis link expires in 30 minutes. If you did not ask for this, ignore it.`,
  });
  await audit(user.id, "user.password_reset_requested", "User", user.id);
  return { sent: mail.sent, configured: emailConfig().configured, neutral: true, devLink: mail.sent ? null : link };
}

export async function resetPassword(input: z.infer<typeof resetSchema>) {
  const row = await db.passwordResetToken.findUnique({ where: { tokenHash: hashToken(input.token) } });
  if (!row || row.usedAt || row.expiresAt < new Date()) throw new AppError(400, "invalid_token", "This reset link is invalid or expired.");
  await db.user.update({ where: { id: row.userId }, data: { passwordHash: await hashPassword(input.password) } });
  await db.passwordResetToken.update({ where: { id: row.id }, data: { usedAt: new Date() } });
  await db.session.deleteMany({ where: { userId: row.userId } });
  await audit(row.userId, "user.password_reset", "User", row.userId);
}

export async function verifyEmail(token: string) {
  const row = await db.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!row || row.usedAt || row.expiresAt < new Date()) throw new AppError(400, "invalid_token", "This verification link is invalid or expired.");
  await db.user.update({ where: { id: row.userId }, data: { emailVerifiedAt: new Date() } });
  await db.emailVerificationToken.update({ where: { id: row.id }, data: { usedAt: new Date() } });
  await audit(row.userId, "user.email_verified", "User", row.userId);
}

export async function resendVerification(userId: string) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "not_found", "Account not found.");
  if (user.emailVerifiedAt) return { alreadyVerified: true, sent: false, configured: emailConfig().configured, devLink: null };
  const result = await issueVerification(user.id, user.email);
  return { alreadyVerified: false, ...result };
}
