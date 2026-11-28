import Link from "next/link";
import { listProducts } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { productCategories } from "@/config/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Tools and workwear", description: "Explore trade tools, workwear and equipment by category. Review product details and check compatibility and safety before purchase.", path: "/tools" });

export default async function ToolsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const category = Array.isArray(raw.category) ? raw.category[0] : raw.category;
  const result = await load(() => listProducts(category));
  return (
    <div className="shell page zh-directory-page zh-page-tools">
      <h1 className="page-title">Tools and workwear</h1>
      <p>Browse equipment categories used across HVAC, electrical, plumbing, welding, construction and mechanic roles. Product details may include a brand, price indication and trade category; check the manufacturer's specifications and workplace requirements before buying.</p>
      <p>Use this directory as a comparison starting point, not a substitute for task-specific safety guidance or employer-issued equipment standards. Affiliate destinations are only available when an administrator has configured a valid link.</p>
      <div className="chips">{productCategories.map((item) => <Link className="chip" key={item} href={`/tools?category=${encodeURIComponent(item)}`}>{item}</Link>)}</div>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No published products" body="Publish a product from the admin panel after the affiliate URL is set." /> : (
        <div className="grid-3">{result.data.map((product) => <article key={product.id} className="card"><h3><Link href={`/tools/${product.slug}`}>{product.name}</Link></h3><p>{product.brand} · {product.category} · {product.priceDisplay || "Price not listed"} {product.isSeed ? <SampleBadge /> : null}</p></article>)}</div>
      )}
    </div>
  );
}
