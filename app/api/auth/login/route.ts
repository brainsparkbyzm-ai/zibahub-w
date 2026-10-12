import { loginSchema } from "@/validation/auth";
import { loginUser } from "@/services/auth";
import { fail, ok, readBody } from "@/lib/http";
import { clientIp } from "@/lib/origin";

export async function POST(request: Request) {
  try {
    const body = await readBody(request);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return Response.json({ ok: false, error: { message: "Enter a valid email and password." } }, { status: 400 });
    const user = await loginUser(parsed.data, { ip: clientIp(request), userAgent: request.headers.get("user-agent") });
    const redirect = user.role === "ADMIN" ? "/admin" : user.role === "EMPLOYER" ? "/employer" : "/dashboard";
    return ok(request, { message: "Signed in." }, redirect);
  } catch (error) { return fail(error); }
}
