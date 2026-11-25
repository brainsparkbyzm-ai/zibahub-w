import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { titleCaseEnum } from "@/lib/format";
import { EmptyState } from "@/components/ui/States";

export default async function EmployerJobs() {
  const user = await getCurrentUser();
  const jobs = user ? await db.job.findMany({ where: { company: { ownerId: user.id } }, orderBy: { createdAt: "desc" } }) : [];
  return (
    <div>
      <div className="jobs-hero">
        <div><h1 className="page-title">My jobs</h1><p className="jobs-intro">Manage your job listings, review their status, and create new opportunities for candidates.</p></div>
        <Link className="btn btn-amber" href="/employer/jobs/new">Post a job</Link>
      </div>
      {jobs.length === 0 ? <EmptyState title="No jobs posted" body="Create your first listing with the Post a job button above. New jobs are submitted for admin review before publication." /> : (
        <table><thead><tr><th>Title</th><th>Status</th><th>Tier</th><th></th></tr></thead><tbody>
          {jobs.map((job) => <tr key={job.id}><td>{job.title}</td><td>{titleCaseEnum(job.status)}</td><td>{job.tier}</td><td><Link href={`/employer/jobs/${job.id}/edit`}>Edit</Link></td></tr>)}
        </tbody></table>
      )}
    </div>
  );
}
