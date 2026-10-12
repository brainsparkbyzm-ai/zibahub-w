import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { publishedTrades } from "@/services/content";
import { ApiForm } from "@/components/forms/ApiForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/dashboard/profile");
  const trades = await publishedTrades();
  return (
    <div className="shell page" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Career profile</h1>
      <ApiForm action="/api/profile" submitLabel="Save profile">
        <label>Name<input name="name" defaultValue={user.name} required /></label>
        <label>Phone<input name="phone" defaultValue={user.phone || ""} /></label>
        <label>Headline<input name="headline" defaultValue={user.headline || ""} /></label>
        <label>Bio<textarea name="bio" defaultValue={user.bio || ""} /></label>
        <label>Country<input name="country" defaultValue={user.country || ""} /></label>
        <label>Region<input name="region" defaultValue={user.region || ""} /></label>
        <label>City<input name="city" defaultValue={user.city || ""} /></label>
        <label>Years of experience<input name="experienceYears" type="number" defaultValue={user.experienceYears ?? ""} /></label>
        <label>Trade<select name="tradeId" defaultValue={user.tradeId || ""}><option value="">None</option>{trades.map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}</select></label>
        <label>Skills, comma separated<input name="skills" defaultValue={user.skills.join(", ")} /></label>
        <label>Resume URL<input name="resumeUrl" defaultValue={user.resumeUrl || ""} /></label>
      </ApiForm>
    </div>
  );
}
