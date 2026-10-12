import { requireRole } from "@/lib/session";
import { db } from "@/lib/db";
import { fail, ok, readBody } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const user = await requireRole(["EMPLOYER", "ADMIN"]);
    const body = await readBody(request);
    const candidateId = String(body.candidateId || "");
    await db.savedCandidate.upsert({ where: { employerId_candidateId: { employerId: user.id, candidateId } }, update: {}, create: { employerId: user.id, candidateId } });
    return ok(request, { message: "Candidate saved." }, "/employer/candidates");
  } catch (error) { return fail(error); }
}
