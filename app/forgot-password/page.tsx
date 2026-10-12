import { ApiForm } from "@/components/forms/ApiForm";
export default function ForgotPage() {
  return (
    <div className="shell page" style={{ maxWidth: 640 }}>
      <h1 className="page-title">Reset password</h1>
      <p>If email is not configured, the response will say so instead of pretending a message was sent. An admin can also verify and assist from the admin panel.</p>
      <ApiForm action="/api/auth/forgot" submitLabel="Request reset">
        <label>Email<input name="email" type="email" required /></label>
      </ApiForm>
    </div>
  );
}
