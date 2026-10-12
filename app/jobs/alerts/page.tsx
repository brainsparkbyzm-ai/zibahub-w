import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { publishedTrades } from "@/services/content";
import { ApiForm } from "@/components/forms/ApiForm";
import { load } from "@/lib/safe";
import { DatabaseNotice } from "@/components/ui/States";

export default async function AlertsPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect("/sign-in?next=/jobs/alerts");
  const result = await load(() => Promise.all([db.jobAlert.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }), publishedTrades()]));
  return (
    <div className="shell page">
      <h1 className="page-title">Job alerts</h1>
      <p>Instant alerts run when a matching job is published. Daily and weekly digests run from the protected cron route.</p>
      {!result.ok ? <DatabaseNotice /> : (
        <>
          <ApiForm action="/api/alerts" submitLabel="Create alert">
            <label>Name<input name="name" required placeholder="Texas electrical" /></label>
            <label>Keywords<input name="keywords" /></label>
            <label>Country<select name="country" defaultValue=""><option value="">Any</option><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label>
            <label>Trade<select name="tradeId" defaultValue=""><option value="">Any</option>{result.data[1].map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}</select></label>
            <label>Minimum annual pay<input name="salaryMin" type="number" /></label>
            <label>Frequency<select name="frequency" defaultValue="DAILY"><option value="INSTANT">Instant</option><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option></select></label>
          </ApiForm>
          <div className="list" style={{ marginTop: 16 }}>
            {result.data[0].map((alert) => <article key={alert.id} className="card"><strong>{alert.name}</strong><p>{alert.frequency} · {alert.active ? "Active" : "Paused"}</p></article>)}
          </div>
        </>
      )}
    </div>
  );
}
