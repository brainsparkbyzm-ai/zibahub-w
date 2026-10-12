import { metrics } from "@/services/content";
import { money } from "@/lib/format";
import { DatabaseNotice } from "@/components/ui/States";
import { load } from "@/lib/safe";

export default async function AdminHome() {
  const result = await load(metrics);
  if (!result.ok) return <DatabaseNotice />;
  const cards = [
    ["Users", result.data.users],
    ["Employers", result.data.employers],
    ["Jobs", result.data.jobs],
    ["Applications", result.data.applications],
    ["Job views", result.data.views],
    ["Affiliate clicks", result.data.clicks],
    ["Guest posts", result.data.posts],
    ["Open reports", result.data.reports],
    ["Active subscriptions", result.data.subscriptions],
  ] as const;
  const max = Math.max(1, ...cards.map((card) => card[1]));
  return (
    <div>
      <h1 className="page-title">Admin</h1>
      <p>Counts come from the database. Revenue includes only payments marked succeeded.</p>
      <div className="grid-3">{cards.map(([label, value]) => <article key={label} className="metric card"><b>{value}</b>{label}</article>)}</div>
      <p>Succeeded revenue: {money(result.data.revenueCents)}</p>
      <div className="bars">{cards.map(([label, value]) => <div key={label}><span>{label}</span><div className="bar"><span style={{ width: `${(value / max) * 100}%` }} /></div></div>)}</div>
    </div>
  );
}
