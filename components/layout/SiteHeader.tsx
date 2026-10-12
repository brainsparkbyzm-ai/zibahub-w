import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { getCurrentUser } from "@/lib/session";
import { MobileNav } from "@/components/layout/MobileNav";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/trades", label: "Trades" },
  { href: "/apprenticeships", label: "Apprenticeships" },
  { href: "/salaries", label: "Salaries" },
  { href: "/training", label: "Training" },
  { href: "/guides", label: "Guides" },
];

export async function SiteHeader() {
  let user: Awaited<ReturnType<typeof getCurrentUser>> = null;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }
  const accountHref = user?.role === "ADMIN" ? "/admin" : user?.role === "EMPLOYER" ? "/employer" : "/dashboard";
  return (
    <header className="zh-header">
      <div className="zh-nav">
        <Link href="/" className="zh-brand" aria-label="ZibaHub home">
          <LogoMark />
          <Wordmark />
        </Link>
        <nav className="zh-nav-links" aria-label="Primary">
          {links.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="zh-nav-actions">
          <Link className="zh-tool" href="/search" aria-label="Search">
            <SearchIcon />
            <span>Search</span>
          </Link>
          <Link className="zh-tool" href="/jobs/saved" aria-label="Saved jobs">
            <HeartIcon />
            <span>Saved</span>
          </Link>
          {user ? (
            <Link className="zh-signin" href={accountHref}>{user.name.split(" ")[0]}</Link>
          ) : (
            <Link className="zh-signin" href="/sign-in">Sign In</Link>
          )}
          <Link className="zh-post" href="/employer/jobs/new">Post a Job</Link>
          <MobileNav signedIn={Boolean(user)} />
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
    </svg>
  );
}
