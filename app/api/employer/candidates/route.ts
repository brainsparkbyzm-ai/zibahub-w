import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { audit } from "@/lib/audit";
import { fail, ok, readBody } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const user = await requireRole(["EMPLOYER"]);
    const body = await readBody(request);
    const candidateId = typeof body.candidateId === "string" ? body.candidateId.trim() : "";
    if (!candidateId) throw new AppError(400, "invalid_candidate", "A candidate ID is required.");

    const company = await db.company.findFirst({
      where: { ownerId: user.id, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!company) throw new AppError(403, "company_not_approved", "An approved company profile is required.");

    const candidate = await db.user.findFirst({
      where: { id: candidateId, role: "USER", status: "ACTIVE" },
      select: { id: true },
    });
    if (!candidate) throw new AppError(404, "not_found", "Candidate not found.");

    await db.savedCandidate.upsert({
      where: { employerId_candidateId: { employerId: user.id, candidateId: candidate.id } },
      update: {},
      create: { employerId: user.id, candidateId: candidate.id },
    });
    await audit(user.id, "candidate.saved", "User", candidate.id, { companyId: company.id });
    return ok(request, { message: "Candidate saved." }, "/employer/candidates");
  } catch (error) {
    return fail(error);
  }
}
