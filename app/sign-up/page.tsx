import { ApiForm } from "@/components/forms/ApiForm";
import { pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Create account", description: "Create a ZibaHub candidate or employer account.", path: "/sign-up" });
export default function SignUpPage() {
  return (
    <div className="shell page" style={{ maxWidth: 680 }}>
      <h1 className="page-title">Create account</h1>
      <ApiForm action="/api/auth/register" submitLabel="Create account">
        <label>Name<input name="name" required minLength={2} /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" required minLength={10} /></label>
        <label>Account<select name="role" defaultValue="USER"><option value="USER">Candidate</option><option value="EMPLOYER">Employer</option></select></label>
        <label>Company name, if hiring<input name="companyName" /></label>
      </ApiForm>
      <p>Password needs 10 characters, a letter, and a number. Admin accounts are not created from this form.</p>
    </div>
  );
}
