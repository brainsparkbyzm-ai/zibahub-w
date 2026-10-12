import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/States";

export default async function CandidatesPage() {
  const user = await getCurrentUser();
  const applicants = user ? await db.application.findMany({ where: { job: { company: { ownerId: user.id } }, status: { in: ["SHORTLISTED", "REVIEWING"] } }, include: { user: true, job: true } }) : [];
  const saved = user ? await db.savedCandidate.findMany({ where: { employerId: user.id }, include: { candidate: true } }) : [];
  return (
    <div>
      <h1 className="page-title">Candidates</h1>
      <h2>In review</h2>
      {applicants.length === 0 ? <EmptyState title="No shortlisted candidates" body="Update an application status to reviewing or shortlisted." /> : applicants.map((row) => (
        <article key={row.id} className="card"><strong>{row.user.name}</strong><p>{row.job.title} · {row.user.headline || "No headline"}</p>
          <form action="/api/employer/candidates" method="post"><input type="hidden" name="candidateId" value={row.user.id} /><button className="btn-line" type="submit">Save candidate</button></form>
        </article>
      ))}
      <h2>Saved</h2>
      {saved.map((row) => <p key={row.id}>{row.candidate.name} · {row.candidate.email}</p>)}
    </div>
  );
}
