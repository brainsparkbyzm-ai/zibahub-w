import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SampleBadge } from "@/components/ui/States";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.affiliateProduct.findFirst({ where: { slug, status: "PUBLISHED" }, include: { _count: { select: { clicks: true } } } });
  if (!product) notFound();
  return (
    <div className="shell page">
      <p className="kicker">{product.category}</p>
      <h1 className="page-title">{product.name}</h1>
      <p>{product.brand} · {product.priceDisplay || "Price not listed"} · {product.rating ? `${product.rating} rating` : "No rating stored"} {product.isSeed ? <SampleBadge /> : null}</p>
      <p>{product.description}</p>
      <p>{product._count.clicks} tracked click{product._count.clicks === 1 ? "" : "s"}.</p>
      {product.affiliateUrl ? <a className="btn btn-amber" href={`/api/affiliate/go/${product.slug}`}>Open merchant link</a> : <div className="notice">Affiliate link is not configured. This page will not send you to a made-up store.</div>}
    </div>
  );
}
