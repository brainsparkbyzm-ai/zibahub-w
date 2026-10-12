import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { ApiForm } from "@/components/forms/ApiForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard/settings");
  return (
    <div className="shell page" style={{ maxWidth: 680 }}>
      <h1 className="page-title">Settings</h1>
      <p>Signed in as {user.email}. Role: {user.role}.</p>
      <ApiForm action="/api/auth/logout" submitLabel="Sign out"><input type="hidden" name="confirm" value="1" /></ApiForm>
    </div>
  );
}
