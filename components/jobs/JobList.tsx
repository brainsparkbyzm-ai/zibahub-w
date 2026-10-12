import Link from "next/link";
import { salaryRange, titleCaseEnum, formatDate } from "@/lib/format";
import { SampleBadge } from "@/components/ui/States";

type JobCard = {
  slug: string;
  title: string;
  city: string | null;
  region: string | null;
  country: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryType: string;
  employmentType: string;
  locationType: string;
  tier: string;
  isSeed: boolean;
  postedAt: Date;
  company: { name: string; isSeed?: boolean };
  trade?: { name: string } | null;
};

export function JobList({ jobs }: { jobs: JobCard[] }) {
  return (
    <div className="list">
      {jobs.map((job) => {
        const isPremium = job.tier === "PREMIUM";
        const isFeatured = job.tier === "FEATURED";
        const locationText = [job.city, job.region, job.country].filter(Boolean).join(", ");

        return (
          <article
            key={job.slug}
            className={`card card-interactive job-row ${isPremium ? "job-row-premium" : ""}`}
            style={{
              borderColor: isPremium
                ? "rgba(196, 92, 18, 0.35)"
                : isFeatured
                ? "rgba(15, 110, 120, 0.28)"
                : "rgba(228, 222, 212, 0.78)",
              background: isPremium
                ? "linear-gradient(180deg, rgba(255, 252, 248, 0.96) 0%, rgba(255, 248, 240, 0.90) 100%)"
                : "var(--glass-card)",
            }}
          >
            <div style={{ display: "grid", gap: 8 }}>
              {/* Top metadata row */}
              <div className="meta" style={{ gap: 8 }}>
                {isPremium ? (
                  <span className="badge premium">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    Premium
                  </span>
                ) : isFeatured ? (
                  <span className="badge arc">Featured</span>
                ) : null}

                {job.isSeed || job.company.isSeed ? <SampleBadge /> : null}

                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--ink-secondary)",
                    background: "rgba(28,25,22,0.04)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  {job.trade?.name || "Skilled Trade"}
                </span>

                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  Posted {formatDate(job.postedAt)}
                </span>
              </div>

              {/* Title & Employer */}
              <div>
                <h3 style={{ fontSize: 22, margin: "2px 0 6px", fontWeight: 600, letterSpacing: "-0.03em" }}>
                  <Link
                    href={`/jobs/${job.slug}`}
                    style={{ color: "var(--ink)" }}
                    className="job-title-link"
                  >
                    {job.title}
                  </Link>
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 13.5, color: "var(--muted)" }}>
                  <span style={{ fontWeight: 600, color: "var(--ink-secondary)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    {job.company.name}
                  </span>

                  {locationText && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {locationText}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                <span className="chip" style={{ fontSize: 11.5, padding: "3px 9px", background: "rgba(255,255,255,0.7)" }}>
                  {titleCaseEnum(job.employmentType)}
                </span>
                <span className="chip" style={{ fontSize: 11.5, padding: "3px 9px", background: "rgba(255,255,255,0.7)" }}>
                  {titleCaseEnum(job.locationType)}
                </span>
              </div>
            </div>

            {/* Right side salary & action CTA */}
            <div style={{ textAlign: "right", display: "grid", gap: 10, justifyItems: "end" }}>
              <div style={{ display: "grid", gap: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>
                  Compensation
                </span>
                <strong className="salary-tag" style={{ color: "var(--ink)", fontSize: 18 }}>
                  {salaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryType)}
                </strong>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Link
                  className="btn btn-amber"
                  href={`/jobs/${job.slug}`}
                  style={{ minHeight: 36, padding: "0 16px", fontSize: 13 }}
                >
                  View Role
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
