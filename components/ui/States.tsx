import Link from "next/link";

export function DatabaseNotice() {
  return (
    <div className="notice" role="status">
      <strong>Database is not connected.</strong>
      <p>Set DATABASE_URL, run migrations, then seed development data. Nothing here is being invented to fill the gap.</p>
    </div>
  );
}

export function EmptyState({ title, body, href, action }: { title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      <p>{body}</p>
      {href && action ? <p><Link className="btn" href={href}>{action}</Link></p> : null}
    </div>
  );
}

export function SampleBadge() {
  return <span className="badge">Sample</span>;
}
