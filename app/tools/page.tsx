import Link from "next/link";
import { listProducts } from "@/services/content";
import { load } from "@/lib/safe";
import { DatabaseNotice, EmptyState, SampleBadge } from "@/components/ui/States";
import { productCategories } from "@/config/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Tools and workwear", description: "Admin-controlled affiliate marketplace for trade tools.", path: "/tools" });

export default async function ToolsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const category = Array.isArray(raw.category) ? raw.category[0] : raw.category;
  const result = await load(() => listProducts(category));
  return (
    <div className="shell page">
      <h1 className="page-title">Tools and workwear</h1>
      <p>Clicks are tracked only when an admin has saved an affiliate URL. No merchant link is invented.</p>
      <div className="chips">{productCategories.map((item) => <Link className="chip" key={item} href={`/tools?category=${encodeURIComponent(item)}`}>{item}</Link>)}</div>
      {!result.ok ? <DatabaseNotice /> : result.data.length === 0 ? <EmptyState title="No published products" body="Publish a product from the admin panel after the affiliate URL is set." /> : (
        <div className="grid-3">{result.data.map((product) => <article key={product.id} className="card"><h3><Link href={`/tools/${product.slug}`}>{product.name}</Link></h3><p>{product.brand} · {product.category} · {product.priceDisplay || "Price not listed"} {product.isSeed ? <SampleBadge /> : null}</p></article>)}</div>
      )}
    </div>
  );
}
