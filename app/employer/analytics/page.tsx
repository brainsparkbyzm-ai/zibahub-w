import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  const jobs = user ? await db.job.findMany({ where: { company: { ownerId: user.id } }, include: { _count: { select: { applications: true } } } }) : [];
  const max = Math.max(1, ...jobs.map((job) => job.viewCount));
  return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <div className="bars">
        {jobs.map((job) => <div key={job.id}><span>{job.title} · {job.viewCount} views · {job._count.applications} applications</span><div className="bar"><span style={{ width: `${(job.viewCount / max) * 100}%` }} /></div></div>)}
      </div>
      {jobs.length === 0 ? <p>Post a job to see views and applications.</p> : null}
    </div>
  );
}
