import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

const links = [
  ["/employer", "Overview"],
  ["/employer/profile", "Company"],
  ["/employer/jobs", "Jobs"],
  ["/employer/jobs/new", "Post a job"],
  ["/employer/applications", "Applications"],
  ["/employer/analytics", "Analytics"],
  ["/employer/billing", "Billing"],
  ["/employer/candidates", "Candidates"],
  ["/employer/settings", "Settings"],
];

export default async function EmployerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/employer");
  if (user.role !== "EMPLOYER" && user.role !== "ADMIN") redirect("/dashboard");
  return (
    <div className="shell page split">
      <aside className="side card">
        {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </aside>
      <div>{children}</div>
    </div>
  );
}
