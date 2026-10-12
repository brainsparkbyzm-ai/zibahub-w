import { listJobs } from "@/services/jobs";
import { fail } from "@/lib/http";
export async function GET(request: Request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const data = await listJobs(params);
    return Response.json({ ok: true, data: { total: data.total, page: data.page, pages: data.pages, jobs: data.jobs.map((job) => ({ slug: job.slug, title: job.title, country: job.country, city: job.city })) } });
  } catch (error) { return fail(error); }
}
