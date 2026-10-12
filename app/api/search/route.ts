import { globalSearch } from "@/services/content";
import { fail } from "@/lib/http";
export async function GET(request: Request) {
  try {
    const q = new URL(request.url).searchParams.get("q") || "";
    return Response.json({ ok: true, data: await globalSearch(q) });
  } catch (error) { return fail(error); }
}
