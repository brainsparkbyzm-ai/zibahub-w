import { publishedTrades } from "@/services/content";
import { JobForm } from "@/features/jobs/JobForm";
export default async function NewJobPage() {
  const trades = await publishedTrades().catch(() => []);
  return <div><h1 className="page-title">Post a job</h1><JobForm action="/api/employer/jobs" trades={trades} /></div>;
}
