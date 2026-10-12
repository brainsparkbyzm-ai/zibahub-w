import { ApiForm } from "@/components/forms/ApiForm";
export default async function ResetPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const token = Array.isArray(raw.token) ? raw.token[0] : raw.token || "";
  return (
    <div className="shell page" style={{ maxWidth: 640 }}>
      <h1 className="page-title">Choose a new password</h1>
      <ApiForm action="/api/auth/reset" submitLabel="Update password">
        <input type="hidden" name="token" value={token} />
        <label>New password<input name="password" type="password" required minLength={10} /></label>
      </ApiForm>
    </div>
  );
}
