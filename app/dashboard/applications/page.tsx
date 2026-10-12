import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { formatDate, titleCaseEnum } from "@/lib/format";
import { EmptyState } from "@/components/ui/States";

export default async function ApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard/applications");
  const rows = await db.application.findMany({ where: { userId: user.id }, include: { job: { include: { company: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <div className="shell page">
      <h1 className="page-title">Applications</h1>
      {rows.length === 0 ? <EmptyState title="No applications" body="Apply from an open job that accepts applications on ZibaHub." href="/jobs" action="Find a job" /> : (
        <div className="table-wrap"><table><thead><tr><th>Role</th><th>Employer</th><th>Status</th><th>Sent</th></tr></thead><tbody>
          {rows.map((row) => <tr key={row.id}><td><Link href={`/jobs/${row.job.slug}`}>{row.job.title}</Link></td><td>{row.job.company.name}</td><td>{titleCaseEnum(row.status)}</td><td>{formatDate(row.createdAt)}</td></tr>)}
        </tbody></table></div>
      )}
    </div>
  );
}
