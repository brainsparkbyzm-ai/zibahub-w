import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminActions } from "@/components/admin/AdminActions";
import { ApiForm } from "@/components/forms/ApiForm";
import { formatDate, money } from "@/lib/format";
import { getJobPricing } from "@/lib/payments";

const contentStatuses = ["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED", "REJECTED"];

export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section === "users") {
    const rows = await db.user.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, name: true, email: true, role: true, status: true, emailVerifiedAt: true, createdAt: true } });
    return <Section title="Users"><table><tbody>{rows.map((row) => <tr key={row.id}><td>{row.name}<br />{row.email}</td><td>{row.role} · {row.status}<br />{row.emailVerifiedAt ? "Verified" : "Unverified"}</td><td><AdminActions id={row.id} entity="user" statuses={["ACTIVE", "SUSPENDED", "USER", "EMPLOYER", "ADMIN", "VERIFY"]} /></td></tr>)}</tbody></table></Section>;
  }
  if (section === "employers") {
    const rows = await db.company.findMany({ include: { owner: true }, orderBy: { createdAt: "desc" } });
    return <Section title="Employers"><table><tbody>{rows.map((row) => <tr key={row.id}><td>{row.name}<br />{row.owner.email} {row.isSeed ? "· sample" : ""}</td><td>{row.status}</td><td><AdminActions id={row.id} entity="company" statuses={contentStatuses} /></td></tr>)}</tbody></table></Section>;
  }
  if (section === "jobs") {
    const rows = await db.job.findMany({ include: { company: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return <Section title="Jobs"><table><tbody>{rows.map((row) => <tr key={row.id}><td>{row.title}<br />{row.company.name} {row.isSeed ? "· sample" : ""}</td><td>{row.status} · {row.tier}</td><td><AdminActions id={row.id} entity="job" statuses={["ACTIVE", "PAUSED", "CLOSED", "REJECTED", "PENDING"]} /></td></tr>)}</tbody></table></Section>;
  }
  if (section === "applications") {
    const rows = await db.application.findMany({ include: { user: true, job: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return <Section title="Applications"><table><tbody>{rows.map((row) => <tr key={row.id}><td>{row.user.name} → {row.job.title}</td><td>{row.status}</td><td>{formatDate(row.createdAt)}</td></tr>)}</tbody></table></Section>;
  }
  if (section === "trades") {
    const rows = await db.trade.findMany({ orderBy: { name: "asc" } });
    return <Section title="Trades"><ApiForm action="/api/admin" submitLabel="Add trade"><input type="hidden" name="action" value="trade" /><label>Name<input name="name" required /></label><label>Summary<input name="summary" required /></label><label>Description<textarea name="description" required /></label></ApiForm><table><tbody>{rows.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.status}</td><td><AdminActions id={row.id} entity="trade" statuses={contentStatuses} /></td></tr>)}</tbody></table></Section>;
  }
  if (section === "categories") {
    const rows = await db.category.findMany({ orderBy: { type: "asc" } });
    return <Section title="Categories"><ApiForm action="/api/admin" submitLabel="Add category"><input type="hidden" name="action" value="category" /><label>Type<input name="type" required /></label><label>Name<input name="name" required /></label></ApiForm>{rows.map((row) => <p key={row.id}>{row.type}: {row.name} <AdminActions id={row.id} entity="category" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "apprenticeships") {
    const rows = await db.apprenticeship.findMany({ orderBy: { createdAt: "desc" } });
    return <Section title="Apprenticeships"><ApiForm action="/api/admin" submitLabel="Add apprenticeship"><input type="hidden" name="action" value="apprenticeship" /><label>Title<input name="title" required /></label><label>Provider<input name="providerName" required /></label><label>Country<input name="country" required /></label><label>Description<textarea name="description" required /></label></ApiForm>{rows.map((row) => <p key={row.id}>{row.title} · {row.status} <AdminActions id={row.id} entity="apprenticeship" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "training" || section === "courses") {
    const providers = await db.trainingProvider.findMany();
    const courses = await db.course.findMany({ include: { provider: true } });
    return <Section title="Training"><h2>Providers</h2>{providers.map((row) => <p key={row.id}>{row.name} · {row.status} <AdminActions id={row.id} entity="provider" statuses={contentStatuses} /></p>)}<h2>Courses</h2><ApiForm action="/api/admin" submitLabel="Add course"><input type="hidden" name="action" value="course" /><label>Title<input name="title" required /></label><label>Description<textarea name="description" required /></label><label>Delivery<select name="delivery"><option>Online</option><option>In person</option><option>Hybrid</option></select></label></ApiForm>{courses.map((row) => <p key={row.id}>{row.title} · {row.status} <AdminActions id={row.id} entity="course" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "guides") {
    const rows = await db.guide.findMany({ orderBy: { updatedAt: "desc" } });
    return <Section title="Guides"><ApiForm action="/api/admin" submitLabel="Save guide"><input type="hidden" name="action" value="guide" /><label>Title<input name="title" required /></label><label>Category<input name="category" required /></label><label>Excerpt<textarea name="excerpt" required /></label><label>Content<textarea name="content" required /></label><label>SEO title<input name="seoTitle" /></label><label>SEO description<input name="seoDescription" /></label></ApiForm>{rows.map((row) => <p key={row.id}>{row.title} · {row.status} <AdminActions id={row.id} entity="guide" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "articles" || section === "guest-posts") {
    const posts = await db.guestPost.findMany({ orderBy: { createdAt: "desc" } });
    const articles = await db.article.findMany({ orderBy: { createdAt: "desc" } });
    return <Section title="Stories and submissions"><h2>Guest posts</h2>{posts.map((row) => <article key={row.id} className="card"><strong>{row.title}</strong><p>{row.companyName} · {row.status} · {row.sponsored ? "Sponsored" : "Editorial"}</p><p>{row.content.slice(0, 240)}</p><AdminActions id={row.id} entity="guest" statuses={["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "PUBLISHED"]} /></article>)}<h2>Articles</h2>{articles.map((row) => <p key={row.id}>{row.title} · {row.status} {row.sponsored ? "· sponsored" : ""} <AdminActions id={row.id} entity="article" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "products") {
    const rows = await db.affiliateProduct.findMany({ orderBy: { name: "asc" } });
    return <Section title="Affiliate products"><ApiForm action="/api/admin" submitLabel="Save product"><input type="hidden" name="action" value="product" /><label>Name<input name="name" required /></label><label>Category<input name="category" required /></label><label>Brand<input name="brand" /></label><label>Price display<input name="priceDisplay" /></label><label>Affiliate URL<input name="affiliateUrl" placeholder="Leave empty until you have a real link" /></label><label>Description<textarea name="description" required /></label></ApiForm>{rows.map((row) => <p key={row.id}>{row.name} · {row.affiliateUrl ? "link set" : "no link"} · {row.status} <AdminActions id={row.id} entity="product" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "clicks") {
    const rows = await db.affiliateClick.findMany({ include: { product: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return <Section title="Affiliate clicks">{rows.length === 0 ? <p>No clicks recorded.</p> : rows.map((row) => <p key={row.id}>{row.product.name} · {formatDate(row.createdAt)}</p>)}</Section>;
  }
  if (section === "ads") {
    const rows = await db.advertisement.findMany();
    return <Section title="Ads"><ApiForm action="/api/admin" submitLabel="Add ad"><input type="hidden" name="action" value="ad" /><label>Name<input name="name" required /></label><label>Placement<input name="placement" required /></label><label>Target URL<input name="targetUrl" /></label></ApiForm>{rows.map((row) => <p key={row.id}>{row.name} · {row.placement} · {row.status} <AdminActions id={row.id} entity="ad" statuses={contentStatuses} /></p>)}</Section>;
  }
  if (section === "reports" || section === "moderation") {
    const reports = await db.report.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    const pending = await db.job.findMany({ where: { status: "PENDING" }, take: 20 });
    return <Section title="Moderation"><h2>Pending jobs</h2>{pending.map((job) => <p key={job.id}>{job.title} <AdminActions id={job.id} entity="job" statuses={["ACTIVE", "REJECTED"]} /></p>)}<h2>Reports</h2>{reports.map((row) => <article key={row.id} className="card"><strong>{row.reason}</strong><p>{row.targetType} {row.targetId} · {row.status}</p><p>{row.details}</p><AdminActions id={row.id} entity="report" statuses={["REVIEWING", "RESOLVED", "DISMISSED"]} /></article>)}</Section>;
  }
  if (section === "payments") {
    const rows = await db.payment.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } });
    return <Section title="Payments">{rows.map((row) => <p key={row.id}>{row.user.email} · {money(row.amountCents, row.currency)} · {row.status} <AdminActions id={row.id} entity="payment" statuses={["SUCCEEDED", "FAILED", "CANCELED"]} /></p>)}</Section>;
  }
  if (section === "subscriptions") {
    const rows = await db.subscription.findMany({ include: { user: true } });
    return <Section title="Subscriptions">{rows.length === 0 ? <p>No subscriptions. Stripe subscription sync is ready for a configured webhook.</p> : rows.map((row) => <p key={row.id}>{row.user.email} · {row.plan} · {row.status}</p>)}</Section>;
  }
  if (section === "notifications") {
    const rows = await db.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { user: true } });
    return <Section title="Notifications"><ApiForm action="/api/admin" submitLabel="Send notice"><input type="hidden" name="action" value="notify" /><label>User email<input name="email" required /></label><label>Title<input name="title" required /></label><label>Body<textarea name="body" required /></label></ApiForm>{rows.map((row) => <p key={row.id}>{row.user.email}: {row.title}</p>)}</Section>;
  }
  if (section === "seo") {
    const setting = await db.siteSetting.findUnique({ where: { key: "seo" } });
    return <Section title="SEO"><p>Technical files: /robots.txt and /sitemap.xml. Job and article schema is omitted for sample records.</p><ApiForm action="/api/admin" submitLabel="Save SEO defaults"><input type="hidden" name="action" value="setting" /><input type="hidden" name="key" value="seo" /><label>Default description<textarea name="description" defaultValue={typeof setting?.value === "object" && setting.value && "description" in setting.value ? String(setting.value.description) : ""} /></label></ApiForm></Section>;
  }
  if (section === "settings") {
    const pricing = await getJobPricing();
    return <Section title="Site settings"><ApiForm action="/api/admin" submitLabel="Save pricing"><input type="hidden" name="action" value="pricing" /><label>Currency<input name="currency" defaultValue={pricing.currency} /></label><label>Featured cents<input name="FEATURED" type="number" defaultValue={pricing.FEATURED} /></label><label>Premium cents<input name="PREMIUM" type="number" defaultValue={pricing.PREMIUM} /></label></ApiForm><p>Free listings stay at 0. Do not put secret keys in these fields.</p></Section>;
  }
  if (section === "audit") {
    const rows = await db.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return <Section title="Audit log">{rows.map((row) => <p key={row.id}>{formatDate(row.createdAt)} · {row.actor?.email || "system"} · {row.action} · {row.entity} {row.entityId || ""}</p>)}</Section>;
  }
  notFound();
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h1 className="page-title">{title}</h1><div className="table-wrap">{children}</div></div>;
}
