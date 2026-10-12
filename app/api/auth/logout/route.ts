import { logoutUser } from "@/services/auth";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try { await readBody(request); await logoutUser(); return ok(request, { message: "Signed out." }, "/"); }
  catch (error) { return fail(error); }
}
