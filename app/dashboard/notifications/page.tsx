import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { EmptyState } from "@/components/ui/States";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard/notifications");
  const rows = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div className="shell page">
      <h1 className="page-title">Notifications</h1>
      <form action="/api/notifications/read" method="post"><button className="btn-line" type="submit">Mark all read</button></form>
      {rows.length === 0 ? <EmptyState title="No notifications" body="Applications, alerts, and admin messages show up here." /> : rows.map((row) => <article key={row.id} className="card"><strong>{row.title}</strong><p>{row.body}</p><p className="meta">{formatDate(row.createdAt)} {row.readAt ? "Read" : "Unread"} {row.href ? <Link href={row.href}>Open</Link> : null}</p></article>)}
    </div>
  );
}
