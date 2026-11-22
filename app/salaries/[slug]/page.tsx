import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { money } from "@/lib/format";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trade = await db.trade.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { salaryBands: true },
  });

  if (!trade) {
    return pageMeta({
      title: "Salary Guide Not Found | ZibaHub",
      description: "Explore skilled-trade salary guides and pay estimates on ZibaHub.",
      path: `/salaries/${slug}`,
    });
  }

  const countries = [...new Set(trade.salaryBands.map((band) => band.country))];
  const description = `Explore ${trade.name} salary estimates, experience levels and pay ranges${countries.length ? ` in ${countries.join(", ")}` : ""}. Compare skilled-trade pay on ZibaHub.`;

  return pageMeta({
    title: `${trade.name} Salary Guide | Pay Ranges | ZibaHub`,
    description: description.slice(0, 160),
    path: `/salaries/${slug}`,
  });
}
export default async function TradeSalaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trade = await db.trade.findFirst({ where: { slug, status: "PUBLISHED" }, include: { salaryBands: true } });
  if (!trade) notFound();
  return (
    <div className="shell page">
      <h1 className="page-title">{trade.name} pay context</h1>
      <p>These rows are stored estimates. {trade.salaryBands.some((band) => band.isSeed) ? "Sample rows are not a wage survey." : ""}</p>
      <div className="list">{trade.salaryBands.map((band) => <article key={band.id} className="card"><strong>{band.country}</strong> · {band.experience}<p>{money(band.lowCents, band.currency)} – {money(band.highCents, band.currency)}. {band.sourceNote}</p></article>)}</div>
      <Link className="btn" href="/calculators">Run a calculator</Link>
    </div>
  );
}

