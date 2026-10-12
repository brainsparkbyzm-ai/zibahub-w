import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { JobList } from "@/components/jobs/JobList";
import { EmptyState, DatabaseNotice } from "@/components/ui/States";
import { load } from "@/lib/safe";

export default async function SavedJobsPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/sign-in?next=/jobs/saved");
  const result = await load(() => db.savedJob.findMany({ where: { userId: user.id }, include: { job: { include: { company: true, trade: true } } }, orderBy: { createdAt: "desc" } }));
  return (
    <div className="shell page">
      <h1 className="page-title">Saved jobs</h1>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="Nothing saved" body="Open a job and save it. The list is yours, not a sample." href="/jobs" action="Browse jobs" /> : <JobList jobs={result.data.map((row) => row.job)} />}
    </div>
  );
}
