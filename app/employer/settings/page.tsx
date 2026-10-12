import { getCurrentUser } from "@/lib/session";
export default async function EmployerSettings() {
  const user = await getCurrentUser();
  return <div><h1 className="page-title">Employer settings</h1><p>{user?.email}. Company changes are on the profile page. Account sign-out is in candidate settings.</p></div>;
}
