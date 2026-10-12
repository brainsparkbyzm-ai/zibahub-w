import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { publishedTrades } from "@/services/content";
import { JobForm } from "@/features/jobs/JobForm";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const job = await db.job.findFirst({ where: { id, company: { ownerId: user?.id || "" } } });
  if (!job) notFound();
  const trades = await publishedTrades();
  return (
    <div>
      <h1 className="page-title">Edit job</h1>
      <JobForm action={`/api/employer/jobs/${job.id}`} trades={trades} defaults={{
        title: job.title, description: job.description, tradeId: job.tradeId || "", country: job.country, region: job.region || "", city: job.city || "",
        salaryMin: job.salaryMin ? String(job.salaryMin / 100) : "", salaryMax: job.salaryMax ? String(job.salaryMax / 100) : "", salaryCurrency: job.salaryCurrency,
        salaryType: job.salaryType, employmentType: job.employmentType, experience: job.experience || "", skills: job.skills.join(", "),
        requirements: job.requirements || "", benefits: job.benefits || "", locationType: job.locationType, applicationMethod: job.applicationMethod,
        applicationTarget: job.applicationTarget || "", tier: job.tier,
      }} />
      <form action={`/api/employer/jobs/${job.id}/status`} method="post" style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn-line" name="status" value="PAUSED" type="submit">Pause</button>
        <button className="btn-line" name="status" value="CLOSED" type="submit">Close</button>
        <button className="btn-line" name="status" value="PENDING" type="submit">Resubmit</button>
      </form>
    </div>
  );
}
