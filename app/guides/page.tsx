import Link from "next/link";
import { listGuides } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { guideCategories } from "@/config/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Guides", description: "Read practical trade career guides on apprenticeships, certifications, salaries, interviews and choosing your next skilled-trade role.", path: "/guides" });

export default async function GuidesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const category = Array.isArray(raw.category) ? raw.category[0] : raw.category;
  const result = await load(() => listGuides(category));
  return (
    <div className="shell page zh-directory-page zh-page-guides">
      <h1 className="page-title">Guides</h1>
      <p>Use these guides to understand trade career options, compare training routes and prepare for the next step in your working life. Topics include career planning, trade skills, certification, pay, interviews, tools and apprenticeships.</p>
      <p>Requirements are not identical across the United States, the United Kingdom and Canada. Check the regulator or recognised industry body for the place where you plan to work, and use the <Link href="/trades">trade directory</Link>, <Link href="/apprenticeships">apprenticeship listings</Link> and <Link href="/salaries">salary context</Link> alongside each guide.</p>
      <div className="chips">{guideCategories.map((item) => <Link key={item} className="chip" href={`/guides?category=${encodeURIComponent(item)}`}>{item}</Link>)}</div>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No published guides" body="Drafts stay in the admin panel until they are published." /> : (
        <div className="list">{result.data.map((guide) => <article key={guide.id} className="card"><span className="badge">{guide.category}</span><h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3><p>{guide.excerpt} {guide.isSeed ? <SampleBadge /> : null}</p></article>)}</div>
      )}
    </div>
  );
}
