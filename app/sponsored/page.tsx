import { ApiForm } from "@/components/forms/ApiForm";
import { guideCategories } from "@/config/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Sponsored content", description: "Submit a guest or sponsored story for review.", path: "/sponsored" });

export default function SponsoredPage() {
  return (
    <div className="shell page">
      <h1 className="page-title">Submit a story</h1>
      <p>Submissions start as submitted. They are not published until an admin reviews them.</p>
      <ApiForm action="/api/guest-posts" submitLabel="Submit for review">
        <label>Company<input name="companyName" required /></label>
        <label>Contact name<input name="contactName" required /></label>
        <label>Contact email<input name="contactEmail" type="email" required /></label>
        <label>Title<input name="title" required /></label>
        <label>Category<select name="category">{guideCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Website<input name="website" type="url" /></label>
        <label>Requested date<input name="requestedDate" type="date" /></label>
        <label>Sponsored<select name="sponsored" defaultValue="true"><option value="true">Yes, label as sponsored</option><option value="false">Editorial submission</option></select></label>
        <label>Content<textarea name="content" required minLength={80} /></label>
      </ApiForm>
    </div>
  );
}
