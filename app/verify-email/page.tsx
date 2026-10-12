import { ApiForm } from "@/components/forms/ApiForm";
export default async function VerifyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const token = Array.isArray(raw.token) ? raw.token[0] : raw.token || "";
  return (
    <div className="shell page" style={{ maxWidth: 680 }}>
      <h1 className="page-title">Email verification</h1>
      {token ? <ApiForm action="/api/auth/verify" submitLabel="Verify email"><input type="hidden" name="token" value={token} /></ApiForm> : <p>Open the link from your email. If no email provider is configured, the registration response includes the configuration state and a one-time link for the person who just created the account.</p>}
      <ApiForm action="/api/auth/verify" submitLabel="Resend verification">
        <input type="hidden" name="resend" value="1" />
      </ApiForm>
    </div>
  );
}
