import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { titleCaseEnum } from "@/lib/format";
import { EmptyState } from "@/components/ui/States";

export default async function EmployerApplications() {
  const user = await getCurrentUser();
  const rows = user ? await db.application.findMany({ where: { job: { company: { ownerId: user.id } } }, include: { job: true, user: true }, orderBy: { createdAt: "desc" } }) : [];
  return (
    <div>
      <h1 className="page-title">Applications</h1>
      {rows.length === 0 ? <EmptyState title="No applicants yet" body="Applications appear after a verified candidate applies on ZibaHub." /> : (
        <table><thead><tr><th>Candidate</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>
          {rows.map((row) => <tr key={row.id}><td>{row.user.name}<br />{row.user.email}</td><td>{row.job.title}</td><td>{titleCaseEnum(row.status)}</td><td>
            <form action={`/api/employer/applications/${row.id}`} method="post">
              <select name="status" defaultValue={row.status}>
                {["SUBMITTED","REVIEWING","SHORTLISTED","REJECTED","HIRED"].map((status) => <option key={status}>{status}</option>)}
              </select>
              <button className="btn-line" type="submit">Update</button>
            </form>
          </td></tr>)}
        </tbody></table>
      )}
    </div>
  );
}
