import { ApiForm } from "@/components/forms/ApiForm";
import { SUPPORTED_JOB_COUNTRIES } from "@/config/markets";

type Trade = { id: string; name: string };
type Defaults = Record<string, string>;

export function JobForm({ action, trades, defaults = {} }: { action: string; trades: Trade[]; defaults?: Defaults }) {
  return (
    <ApiForm action={action} submitLabel="Save job">
      <p className="notice">New listings start as Free and wait for admin approval. Featured or Premium placement can be requested separately from Billing.</p>
      <label>Title<input name="title" required defaultValue={defaults.title || ""} /></label>
      <label>Description<textarea name="description" required minLength={40} defaultValue={defaults.description || ""} /></label>
      <label>Trade<select name="tradeId" defaultValue={defaults.tradeId || ""}><option value="">Unspecified</option>{trades.map((trade) => <option key={trade.id} value={trade.id}>{trade.name}</option>)}</select></label>
      <label>Country<select name="country" defaultValue={defaults.country || "United States"}>{SUPPORTED_JOB_COUNTRIES.map((country) => <option key={country}>{country}</option>)}</select></label>
      <label>Region<input name="region" defaultValue={defaults.region || ""} /></label>
      <label>City<input name="city" defaultValue={defaults.city || ""} /></label>
      <label>Minimum pay, major units<input name="salaryMin" type="number" min="0" step="0.01" defaultValue={defaults.salaryMin || ""} /></label>
      <label>Maximum pay, major units<input name="salaryMax" type="number" min="0" step="0.01" defaultValue={defaults.salaryMax || ""} /></label>
      <label>Salary currency<select name="salaryCurrency" defaultValue={defaults.salaryCurrency || "USD"}><option value="USD">USD — US Dollar</option><option value="CAD">CAD — Canadian Dollar</option><option value="GBP">GBP — British Pound</option><option value="EUR">EUR — Euro</option><option value="CHF">CHF — Swiss Franc</option><option value="PLN">PLN — Polish Złoty</option><option value="SEK">SEK — Swedish Krona</option><option value="NOK">NOK — Norwegian Krone</option><option value="DKK">DKK — Danish Krone</option><option value="CZK">CZK — Czech Koruna</option><option value="HUF">HUF — Hungarian Forint</option><option value="RON">RON — Romanian Leu</option></select></label>
      <label>Pay period<select name="salaryType" defaultValue={defaults.salaryType || "ANNUAL"}><option value="ANNUAL">Annual</option><option value="HOURLY">Hourly</option><option value="DAILY">Daily</option></select></label>
      <label>Employment<select name="employmentType" defaultValue={defaults.employmentType || "FULL_TIME"}><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="CONTRACT">Contract</option><option value="APPRENTICESHIP">Apprenticeship</option><option value="TEMPORARY">Temporary</option><option value="SEASONAL">Seasonal</option></select></label>
      <label>Experience<input name="experience" defaultValue={defaults.experience || ""} /></label>
      <label>Skills<input name="skills" defaultValue={defaults.skills || ""} /></label>
      <label>Requirements<textarea name="requirements" defaultValue={defaults.requirements || ""} /></label>
      <label>Benefits<textarea name="benefits" defaultValue={defaults.benefits || ""} /></label>
      <label>Location type<select name="locationType" defaultValue={defaults.locationType || "ON_SITE"}><option value="ON_SITE">On site</option><option value="HYBRID">Hybrid</option><option value="REMOTE">Remote</option></select></label>
      <label>Application method<select name="applicationMethod" defaultValue={defaults.applicationMethod || "ONSITE"}><option value="ONSITE">On ZibaHub</option><option value="URL">External URL</option><option value="EMAIL">Email</option></select></label>
      <label>Application URL or email<input name="applicationTarget" type="text" maxLength={240} placeholder="Required for external application methods" defaultValue={defaults.applicationTarget || ""} /></label>
      <label>Expiry<input name="expiresAt" type="date" defaultValue={defaults.expiresAt || ""} /></label>
    </ApiForm>
  );
}
