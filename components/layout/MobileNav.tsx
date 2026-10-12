"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  ["/jobs", "Jobs"],
  ["/trades", "Trades"],
  ["/apprenticeships", "Apprenticeships"],
  ["/salaries", "Salaries"],
  ["/training", "Training"],
  ["/guides", "Guides"],
  ["/search", "Search"],
  ["/jobs/saved", "Saved jobs"],
  ["/employers", "Employers"],
  ["/calculators", "Tools"],
];

export function MobileNav({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button className="zh-menu" type="button" aria-expanded={open} aria-controls="zh-mobile-nav" onClick={() => setOpen((value) => !value)}>
        Menu
      </button>
      {open ? (
        <div id="zh-mobile-nav" className="zh-drawer" role="dialog" aria-label="Mobile navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link href={signedIn ? "/dashboard" : "/sign-in"} onClick={() => setOpen(false)}>{signedIn ? "Account" : "Sign In"}</Link>
          <Link href="/employer/jobs/new" onClick={() => setOpen(false)}>Post a Job</Link>
        </div>
      ) : null}
    </>
  );
}
