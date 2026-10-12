import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

const links = ["users","employers","jobs","applications","trades","categories","apprenticeships","training","courses","guides","articles","guest-posts","products","clicks","ads","reports","moderation","payments","subscriptions","notifications","seo","settings","audit"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return (
    <div className="shell page split">
      <aside className="side card">
        <Link href="/admin">Dashboard</Link>
        {links.map((link) => <Link key={link} href={`/admin/${link}`}>{link}</Link>)}
      </aside>
      <div>{children}</div>
    </div>
  );
}
