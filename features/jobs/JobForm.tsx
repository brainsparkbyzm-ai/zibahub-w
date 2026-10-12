import { ApiForm } from "@/components/forms/ApiForm";

type Trade = { id: string; name: string };
type Defaults = Record<string, string>;

export function JobForm({ action, trades, defaults = {} }: { action: string; trades: Trade[]; defaults?: Defaults }) {
  return (
    <ApiForm action={action} submitLabel="Save job">
      <label>Title<input name="title" required defaultValue={defaults.title || ""} /></label>
      <label>Description<textarea name="description" required minLength={40} defaultValue={defaults.description || ""} /></label>
      <label>Trade<select name="tradeId" defaultValue={defaults.tradeId || ""}><option value="">Unspecified</option>{trades.map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}</select></label>
      <label>Country<select name="country" defaultValue={defaults.country || "United States"}><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label>
      <label>Region<input name="region" defaultValue={defaults.region || ""} /></label>
      <label>City<input name="city" defaultValue={defaults.city || ""} /></label>
      <label>Minimum pay, major units<input name="salaryMin" type="number" defaultValue={defaults.salaryMin || ""} /></label>
      <label>Maximum pay, major units<input name="salaryMax" type="number" defaultValue={defaults.salaryMax || ""} /></label>
      <label>Currency<input name="salaryCurrency" defaultValue={defaults.salaryCurrency || "USD"} maxLength={3} /></label>
      <label>Pay period<select name="salaryType" defaultValue={defaults.salaryType || "ANNUAL"}><option value="ANNUAL">Annual</option><option value="HOURLY">Hourly</option><option value="DAILY">Daily</option></select></label>
      <label>Employment<select name="employmentType" defaultValue={defaults.employmentType || "FULL_TIME"}><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="CONTRACT">Contract</option><option value="APPRENTICESHIP">Apprenticeship</option><option value="TEMPORARY">Temporary</option><option value="SEASONAL">Seasonal</option></select></label>
      <label>Experience<input name="experience" defaultValue={defaults.experience || ""} /></label>
      <label>Skills<input name="skills" defaultValue={defaults.skills || ""} /></label>
      <label>Requirements<textarea name="requirements" defaultValue={defaults.requirements || ""} /></label>
      <label>Benefits<textarea name="benefits" defaultValue={defaults.benefits || ""} /></label>
      <label>Location type<select name="locationType" defaultValue={defaults.locationType || "ON_SITE"}><option value="ON_SITE">On site</option><option value="HYBRID">Hybrid</option><option value="REMOTE">Remote</option></select></label>
      <label>Application method<select name="applicationMethod" defaultValue={defaults.applicationMethod || "ONSITE"}><option value="ONSITE">On ZibaHub</option><option value="URL">External URL</option><option value="EMAIL">Email</option></select></label>
      <label>URL or email<input name="applicationTarget" defaultValue={defaults.applicationTarget || ""} /></label>
      <label>Expiry<input name="expiresAt" type="date" defaultValue={defaults.expiresAt || ""} /></label>
      <label>Placement<select name="tier" defaultValue={defaults.tier || "FREE"}><option value="FREE">Free</option><option value="FEATURED">Featured</option><option value="PREMIUM">Premium</option></select></label>
    </ApiForm>
  );
}
