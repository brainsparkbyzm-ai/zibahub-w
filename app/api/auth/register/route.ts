import { registerSchema } from "@/validation/auth";
import { registerUser } from "@/services/auth";
import { fail, ok, readBody } from "@/lib/http";
import { clientIp } from "@/lib/origin";

export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return Response.json({ ok: false, error: { message: parsed.error.issues[0]?.message || "Check the form." } }, { status: 400 });
    const result = await registerUser(parsed.data, { ip: clientIp(request), userAgent: request.headers.get("user-agent") });
    const message = result.email.sent ? "Account created. Check your email to verify it." : "Account created. Email is not configured, so no message was sent. Use this one-time verification link: " + result.email.devLink;
    return ok(request, { message }, result.email.sent ? "/dashboard" : undefined);
  } catch (error) { return fail(error); }
}
