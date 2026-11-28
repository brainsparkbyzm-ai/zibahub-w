import { ApiForm } from "@/components/forms/ApiForm";
import { guideCategories } from "@/config/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Guest Posts & Sponsored Content",
  description: "Submit an original skilled-trades, careers or employer story for editorial review.",
  path: "/sponsored",
});

export default function SponsoredPage() {
  return (
    <div className="shell page">
      <p className="kicker">Guest posts and sponsored content</p>
      <h1 className="page-title">Write for ZibaHub</h1>
      <p>Share an original, useful story for skilled-trades professionals, apprentices or employers. Every submission is reviewed before publication; sending this form does not guarantee acceptance.</p>
      <p>Choose sponsored content when the submission includes paid promotion or a placement request. Any sponsored article we publish will be clearly labelled. Our team will contact you about available placement terms before publication; this form does not take payment.</p>
      <ApiForm action="/api/guest-posts" submitLabel="Submit for editorial review">
        <label>Company or organisation<input name="companyName" required maxLength={120} /></label>
        <label>Contact name<input name="contactName" required maxLength={80} /></label>
        <label>Contact email<input name="contactEmail" type="email" required /></label>
        <label>Article title<input name="title" required minLength={6} maxLength={160} /></label>
        <label>Category<select name="category" required>{guideCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Website (optional)<input name="website" type="url" placeholder="https://" /></label>
        <label>Preferred publication date (optional)<input name="requestedDate" type="date" /></label>
        <label>Submission type<select name="sponsored" defaultValue="true"><option value="true">Sponsored or paid placement</option><option value="false">Editorial guest post</option></select></label>
        <label>Full article<textarea name="content" required minLength={80} maxLength={20000} rows={12} placeholder="Submit original content relevant to skilled trades, training, hiring or career development." /></label>
      </ApiForm>
    </div>
  );
}
