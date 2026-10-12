import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { AppError } from "@/lib/errors";
import { fail, ok, readBody } from "@/lib/http";
import type { ApplicationStatus } from "@prisma/client";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const { id } = await context.params;
    const body = await readBody(request);
    const status = String(body.status || "") as ApplicationStatus;
    const application = await db.application.findFirst({ where: { id, job: { company: { ownerId: user.id } } }, include: { job: true } });
    if (!application) throw new AppError(404, "not_found", "Application not found.");
    await db.application.update({ where: { id }, data: { status } });
    await notify({ userId: application.userId, type: "APPLICATION_STATUS", title: "Application updated", body: `${application.job.title} is now ${status.toLowerCase()}.`, href: "/dashboard/applications" });
    return ok(request, { message: "Application updated." }, "/employer/applications");
  } catch (error) { return fail(error); }
}
