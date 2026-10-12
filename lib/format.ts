const currencySymbols: Record<string, string> = { USD: "$", GBP: "£", CAD: "CA$" };

export function money(cents: number | null | undefined, currency = "USD") {
  if (cents == null) return "Not listed";
  const symbol = currencySymbols[currency] || `${currency} `;
  return `${symbol}${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function salaryRange(min?: number | null, max?: number | null, currency = "USD", type = "ANNUAL") {
  const label = type === "HOURLY" ? "/hr" : type === "DAILY" ? "/day" : "/yr";
  if (min == null && max == null) return "Pay not listed";
  if (min != null && max != null) return `${money(min, currency)}–${money(max, currency)}${label}`;
  if (min != null) return `From ${money(min, currency)}${label}`;
  return `Up to ${money(max, currency)}${label}`;
}

export function titleCaseEnum(value: string) {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function slugify(input: string) {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
  return base || "item";
}

export function uniqueSlug(input: string) {
  return `${slugify(input)}-${Math.random().toString(36).slice(2, 7)}`;
}
