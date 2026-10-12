import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function EmployerHome() {
  const user = await getCurrentUser();
  const company = user ? await db.company.findUnique({ where: { ownerId: user.id }, include: { _count: { select: { jobs: true } } } }) : null;
  const applications = company ? await db.application.count({ where: { job: { companyId: company.id } } }) : 0;
  return (
    <div>
      <h1 className="page-title">Hiring desk</h1>
      {!company ? <div className="notice">No company profile yet. <Link href="/employer/profile">Create one</Link></div> : <p>{company.name} is {company.status.toLowerCase()}. {company._count.jobs} jobs, {applications} applications.</p>}
      <Link className="btn btn-amber" href="/employer/jobs/new">Post a job</Link>
    </div>
  );
}
