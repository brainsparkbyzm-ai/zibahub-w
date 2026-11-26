import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { fail, ok, readBody } from "@/lib/http";
import type { ApplicationStatus } from "@prisma/client";

const allowedTransitions: Record<ApplicationStatus, readonly ApplicationStatus[]> = {
  SUBMITTED: ["REVIEWING", "REJECTED"],
  REVIEWING: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["HIRED", "REJECTED"],
  REJECTED: [],
  HIRED: [],
  WITHDRAWN: [],
};

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole(["EMPLOYER"]);
    const { id } = await context.params;
    const body = await readBody(request);
    if (body.status !== "REVIEWING" && body.status !== "SHORTLISTED" && body.status !== "REJECTED" && body.status !== "HIRED") {
      throw new AppError(400, "bad_status", "Unsupported application status.");
    }
    const status = body.status as ApplicationStatus;
    const application = await db.application.findFirst({
      where: { id, job: { company: { ownerId: user.id, status: "PUBLISHED" } } },
      include: { job: true },
    });
    if (!application) throw new AppError(404, "not_found", "Application not found.");
    if (!allowedTransitions[application.status].includes(status)) {
      throw new AppError(409, "invalid_transition", "This application status transition is not allowed.");
    }

    const updated = await db.application.updateMany({
      where: {
        id,
        status: application.status,
        job: { company: { ownerId: user.id, status: "PUBLISHED" } },
      },
      data: { status },
    });
    if (updated.count !== 1) {
      throw new AppError(409, "application_changed", "This application was updated by another request. Refresh and try again.");
    }
    await notify({
      userId: application.userId,
      type: "APPLICATION_STATUS",
      title: "Application updated",
      body: `${application.job.title} is now ${status.toLowerCase()}.`,
      href: "/dashboard/applications",
    });
    await audit(user.id, "application.status_changed", "Application", id, {
      from: application.status,
      to: status,
    });
    return ok(request, { message: "Application updated." }, "/employer/applications");
  } catch (error) {
    return fail(error);
  }
}
