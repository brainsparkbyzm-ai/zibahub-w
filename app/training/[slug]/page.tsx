import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";
import { money } from "@/lib/format";
import { SampleBadge } from "@/components/ui/States";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await db.course.findFirst({ where: { slug, status: "PUBLISHED" }, include: { provider: true, trade: true } });
  if (!course) notFound();
  return (
    <div className="shell page">
      <p className="kicker">{course.trade?.name || "Training"}</p>
      <h1 className="page-title">{course.title}</h1>
      <p>{course.provider?.name} · {course.delivery} · {course.duration || "Duration not listed"} · {course.priceCents != null ? money(course.priceCents, course.currency) : "Price not listed"} {course.isSeed ? <SampleBadge /> : null}</p>
      {course.certification ? <p>Certification: {course.certification}</p> : null}
      <article className="prose card" dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }} />
      {course.affiliateUrl ? <p><a className="btn" href={`/api/affiliate/course/${course.slug}`}>Continue to provider</a></p> : course.url ? <p><a className="btn" href={course.url} rel="nofollow noopener noreferrer">Provider site</a></p> : <div className="notice">No provider or affiliate URL is configured.</div>}
    </div>
  );
}
