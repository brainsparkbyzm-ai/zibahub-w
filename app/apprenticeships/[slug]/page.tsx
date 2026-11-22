import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { SampleBadge } from "@/components/ui/States";
import { pageMeta } from "@/lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await db.apprenticeship.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { trade: true },
  });

  if (!item) {
    return pageMeta({
      title: "Apprenticeship Not Found | ZibaHub",
      description: "Explore skilled-trade apprenticeships and career opportunities on ZibaHub.",
      path: `/apprenticeships/${slug}`,
    });
  }

  const description = (item.description || `Explore the ${item.title} apprenticeship programme on ZibaHub.`)
    .replace(/[#*_`>\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return pageMeta({
    title: `${item.title} | Apprenticeship | ZibaHub`,
    description: description || `Explore the ${item.title} apprenticeship programme on ZibaHub.`,
    path: `/apprenticeships/${slug}`,
  });
}
export default async function ApprenticeshipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await db.apprenticeship.findFirst({ where: { slug, status: "PUBLISHED" }, include: { trade: true } });
  if (!item) notFound();
  return (
    <div className="shell page">
      <p className="kicker">{item.trade?.name || "Apprenticeship"}</p>
      <h1 className="page-title">{item.title}</h1>
      <p>{item.providerName} · {[item.city, item.country].filter(Boolean).join(", ")} · {item.duration || "Duration not listed"} · {item.paid ? "Paid" : "Unpaid"} {item.isSeed ? <SampleBadge /> : null}</p>
      {item.isSeed ? <div className="notice">Sample programme. Not a verified opening.</div> : null}
      <article className="prose card" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.description) }} />
      {item.requirements ? <section className="card"><h2>Entry requirements</h2><p>{item.requirements}</p></section> : null}
      {item.wageNote ? <p>{item.wageNote}</p> : null}
      {item.applicationUrl ? <p><a className="btn" href={item.applicationUrl} rel="nofollow noopener noreferrer">Provider application</a></p> : <p>No external application URL is configured.</p>}
    </div>
  );
}

