import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="zh-footer">
      <div className="zh-footer-brand">
        <Link href="/" className="zh-brand" aria-label="ZibaHub home">
          <LogoMark size={36} />
          <Wordmark />
        </Link>
      </div>
      <FooterCol title="Trade Directory" links={[["Electrician", "/jobs?q=Electrician"], ["HVAC Technician", "/jobs?q=HVAC"], ["Plumber", "/jobs?q=Plumber"], ["Welder", "/jobs?q=Welder"], ["Carpenter", "/jobs?q=Carpenter"], ["Construction", "/jobs?q=Construction"]]} split />
      <FooterCol title="Employers" links={[["Post a Job", "/employer/jobs/new"], ["Employer Solutions", "/employers"], ["Pricing", "/employer/billing"], ["Training Finder", "/training"], ["Success Stories", "/guides"], ["FAQ", "/guides"]]} />
      <FooterCol title="Career Tools" links={[["Salary Calculator", "/calculators"], ["Career Path Finder", "/trades"], ["Training Finder", "/training"], ["Resume Builder", "/dashboard/profile"]]} />
      <FooterCol title="Guides" links={[["Blog", "/guides"], ["Career Guides", "/guides?category=Career%20Guides"], ["Industry Insights", "/guides"], ["Help Center", "/guides"]]} />
      <FooterCol title="Company" links={[["About Us", "/"], ["Careers", "/jobs"], ["Contact", "/sponsored"], ["Privacy Policy", "/guides"], ["Terms", "/guides"]]} />
      <div className="zh-footer-meta">
        <div className="zh-flags" aria-label="United States, United Kingdom, and Canada">
          <span><FlagUS /> US</span>
          <span><FlagUK /> UK</span>
          <span><FlagCA /> Canada</span>
        </div>
        <small>© {new Date().getFullYear()} ZibaHub. All rights reserved.</small>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, split = false }: { title: string; links: string[][]; split?: boolean }) {
  return (
    <div className={split ? "zh-foot-col split" : "zh-foot-col"}>
      <strong>{title}</strong>
      {links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
    </div>
  );
}

function FlagUS() {
  return <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><rect width="16" height="12" rx="1" fill="#fff" /><rect width="16" height="1.2" y="0" fill="#b22234" /><rect width="16" height="1.2" y="2.4" fill="#b22234" /><rect width="16" height="1.2" y="4.8" fill="#b22234" /><rect width="16" height="1.2" y="7.2" fill="#b22234" /><rect width="16" height="1.2" y="9.6" fill="#b22234" /><rect width="7" height="6.4" fill="#3c3b6e" /></svg>;
}
function FlagUK() {
  return <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><rect width="16" height="12" rx="1" fill="#012169" /><path d="M0 0l16 12M16 0L0 12" stroke="#fff" strokeWidth="2.2" /><path d="M0 0l16 12M16 0L0 12" stroke="#c8102e" strokeWidth="1" /><path d="M8 0v12M0 6h16" stroke="#fff" strokeWidth="3.2" /><path d="M8 0v12M0 6h16" stroke="#c8102e" strokeWidth="1.6" /></svg>;
}
function FlagCA() {
  return <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><rect width="16" height="12" rx="1" fill="#fff" /><rect width="4" height="12" fill="#d52b1e" /><rect x="12" width="4" height="12" fill="#d52b1e" /><path d="M8 2.2l.7 2.1h2.1L9.2 5.6l.7 2.1L8 6.4 6.1 7.7l.7-2.1-1.6-1.3h2.1z" fill="#d52b1e" /></svg>;
}

