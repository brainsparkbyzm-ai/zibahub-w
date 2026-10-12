import { emailSchema } from "@/validation/auth";
import { requestPasswordReset } from "@/services/auth";
import { fail, readBody } from "@/lib/http";
import { clientIp } from "@/lib/origin";
export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    const parsed = emailSchema.safeParse(body);
    if (!parsed.success) return Response.json({ ok: false, error: { message: "Enter a valid email." } }, { status: 400 });
    const result = await requestPasswordReset(parsed.data.email, clientIp(request));
    const message = result.configured ? "If that account exists, a reset email was sent." : "Email is not configured, so no message was sent. If the account exists, use this one-time link: " + (result.devLink || "account not found, no link issued.");
    return Response.json({ ok: true, message });
  } catch (error) { return fail(error); }
}
