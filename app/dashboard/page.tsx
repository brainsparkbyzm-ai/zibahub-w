import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard");
  const [saved, applications, alerts, unread] = await Promise.all([
    db.savedJob.count({ where: { userId: user.id } }),
    db.application.count({ where: { userId: user.id } }),
    db.jobAlert.count({ where: { userId: user.id, active: true } }),
    db.notification.count({ where: { userId: user.id, readAt: null } }),
  ]);
  return (
    <div className="shell page">
      <h1 className="page-title">Hello, {user.name.split(" ")[0]}</h1>
      {!user.emailVerifiedAt ? <div className="notice">Email is not verified. Applications stay blocked until it is. <Link href="/verify-email">Verify</Link></div> : null}
      <div className="grid-3">
        <Link className="metric card" href="/jobs/saved"><b>{saved}</b>Saved jobs</Link>
        <Link className="metric card" href="/dashboard/applications"><b>{applications}</b>Applications</Link>
        <Link className="metric card" href="/jobs/alerts"><b>{alerts}</b>Active alerts</Link>
        <Link className="metric card" href="/dashboard/notifications"><b>{unread}</b>Unread notices</Link>
      </div>
      <p><Link href="/dashboard/profile">Profile</Link> · <Link href="/dashboard/settings">Settings</Link></p>
    </div>
  );
}
