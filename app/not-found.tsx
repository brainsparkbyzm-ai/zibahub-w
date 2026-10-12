import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell page">
      <p className="kicker">404</p>
      <h1 className="page-title">That page is not in the directory.</h1>
      <p><Link className="btn" href="/jobs">Browse jobs</Link></p>
    </div>
  );
}
