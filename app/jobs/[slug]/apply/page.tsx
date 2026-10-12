import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPublicJob } from "@/services/jobs";
import { getCurrentUser } from "@/lib/session";
import { ApiForm } from "@/components/forms/ApiForm";

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect(`/sign-in?next=/jobs/${slug}/apply`);
  const job = await getPublicJob(slug);
  if (!job || job.applicationMethod !== "ONSITE") notFound();
  return (
    <div className="shell page">
      <p className="kicker">Application</p>
      <h1 className="page-title">Apply for {job.title}</h1>
      {!user.emailVerifiedAt ? <div className="notice">Verify your email before this application can be submitted. <Link href="/verify-email">Verification</Link></div> : null}
      <ApiForm action={`/api/jobs/${slug}/apply`} submitLabel="Submit application">
        <label>Cover letter<textarea name="coverLetter" required minLength={20} placeholder="Why this role, and where you have done the work." /></label>
      </ApiForm>
    </div>
  );
}
