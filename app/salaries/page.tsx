import Link from "next/link";
import { salaryBands, publishedTrades } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState } from "@/components/ui/States";
import { money } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Salaries", description: "Illustrative pay context and working calculators for skilled trades.", path: "/salaries" });

export default async function SalariesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const query = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || ""]));
  const result = await load(() => Promise.all([salaryBands(query), publishedTrades()]));
  return (
    <div className="shell page">
      <h1 className="page-title">Salary context</h1>
      <p>Bands stored in the database are estimates. They are not official government wage claims. Use the calculators for arithmetic you control.</p>
      <form className="filters glass" action="/salaries">
        <label>Trade<select name="trade" defaultValue={query.trade || ""}><option value="">Any</option>{result.ok ? result.data[1].map((trade) => <option key={trade.id} value={trade.slug}>{trade.name}</option>) : null}</select></label>
        <label>Country<select name="country" defaultValue={query.country || ""}><option value="">Any</option><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label>
        <label>Region<input name="region" defaultValue={query.region || ""} /></label>
        <label>Experience<select name="experience" defaultValue={query.experience || ""}><option value="">Any</option><option>Entry</option><option>Journeyman</option><option>Senior</option></select></label>
        <button className="btn" type="submit">Show bands</button>
      </form>
      {!result.ok ? <DatabaseNotice /> : result.data[0].length === 0 ? <EmptyState title="No bands for that filter" body="Add verified datasets later. The calculator still works without them." href="/calculators" action="Open calculators" /> : (
        <div className="table-wrap"><table><thead><tr><th>Trade</th><th>Place</th><th>Experience</th><th>Low</th><th>Mid</th><th>High</th><th>Note</th></tr></thead><tbody>
          {result.data[0].map((band) => <tr key={band.id}><td>{band.trade ? <Link href={`/salaries/${band.trade.slug}`}>{band.trade.name}</Link> : "Trade"}</td><td>{[band.city, band.region, band.country].filter(Boolean).join(", ")}</td><td>{band.experience}</td><td>{money(band.lowCents, band.currency)}</td><td>{money(band.midCents, band.currency)}</td><td>{money(band.highCents, band.currency)}</td><td>{band.sourceNote}</td></tr>)}
        </tbody></table></div>
      )}
    </div>
  );
}
