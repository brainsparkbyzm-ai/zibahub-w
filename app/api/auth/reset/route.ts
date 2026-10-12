import { resetSchema } from "@/validation/auth";
import { resetPassword } from "@/services/auth";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const parsed = resetSchema.safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: "Reset link or password is invalid." } }, { status: 400 });
    await resetPassword(parsed.data);
    return ok(request, { message: "Password updated. Sign in again." }, "/sign-in");
  } catch (error) { return fail(error); }
}
