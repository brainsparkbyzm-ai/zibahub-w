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
      <h1 className="page-title">My jobs</h1>
      {jobs.length === 0 ? <EmptyState title="No jobs posted" body="A new job is pending until an admin publishes it." href="/employer/jobs/new" action="Post a job" /> : (
        <table><thead><tr><th>Title</th><th>Status</th><th>Tier</th><th></th></tr></thead><tbody>
          {jobs.map((job) => <tr key={job.id}><td>{job.title}</td><td>{titleCaseEnum(job.status)}</td><td>{job.tier}</td><td><Link href={`/employer/jobs/${job.id}/edit`}>Edit</Link></td></tr>)}
        </tbody></table>
      )}
    </div>
  );
}
