import { z } from "zod";
import { subscribeNewsletter } from "@/services/content";
import { fail, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const parsed = z.object({ email: z.string().email() }).safeParse(await readBody(request));
    if (!parsed.success) return Response.json({ ok: false, error: { message: "Enter a valid email." } }, { status: 400 });
    await subscribeNewsletter(parsed.data.email);
    return Response.json({ ok: true, message: "Saved." });
  } catch (error) { return fail(error); }
}
