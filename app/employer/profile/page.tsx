import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { ApiForm } from "@/components/forms/ApiForm";

export default async function CompanyProfilePage() {
  const user = await getCurrentUser();
  const company = user ? await db.company.findUnique({ where: { ownerId: user.id } }) : null;
  return (
    <div>
      <h1 className="page-title">Company profile</h1>
      <ApiForm action="/api/employer/company" submitLabel="Save company">
        <label>Name<input name="name" required defaultValue={company?.name || ""} /></label>
        <label>Website<input name="website" defaultValue={company?.website || ""} /></label>
        <label>Description<textarea name="description" defaultValue={company?.description || ""} /></label>
        <label>Country<input name="country" defaultValue={company?.country || ""} /></label>
        <label>Region<input name="region" defaultValue={company?.region || ""} /></label>
        <label>City<input name="city" defaultValue={company?.city || ""} /></label>
        <label>Size<input name="size" defaultValue={company?.size || ""} /></label>
        <label>Logo URL<input name="logoUrl" defaultValue={company?.logoUrl || ""} placeholder="https://… image under 2 MB, https only" /></label>
      </ApiForm>
      <p>New profiles stay pending until an admin publishes them.</p>
    </div>
  );
}
