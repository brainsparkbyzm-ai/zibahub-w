import { verifyEmail, resendVerification } from "@/services/auth";
import { requireUser } from "@/lib/session";
import { fail, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    if (body.resend) {
      const user = await requireUser();
      const result = await resendVerification(user.id);
      const message = result.alreadyVerified ? "Already verified." : result.sent ? "Verification email sent." : "Email is not configured. One-time link: " + result.devLink;
      return Response.json({ ok: true, message });
    }
    await verifyEmail(String(body.token || ""));
    return Response.json({ ok: true, message: "Email verified.", redirect: "/dashboard" });
  } catch (error) { return fail(error); }
}
