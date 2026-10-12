import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    await readBody(request);
    await db.notification.updateMany({ where: { userId: user.id, readAt: null }, data: { readAt: new Date() } });
    return ok(request, { message: "Marked read." }, "/dashboard/notifications");
  } catch (error) { return fail(error); }
}
