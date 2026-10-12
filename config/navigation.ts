export const primaryNav = [
  { href: "/jobs", label: "Jobs" },
  { href: "/trades", label: "Trades" },
  { href: "/apprenticeships", label: "Apprenticeships" },
  { href: "/salaries", label: "Salaries" },
  { href: "/training", label: "Training" },
  { href: "/calculators", label: "Tools" },
  { href: "/employers", label: "Employers" },
  { href: "/guides", label: "Guides" },
] as const;

export const toolLinks = [
  { href: "/calculators", label: "Career calculators" },
  { href: "/tools", label: "Tools and workwear" },
  { href: "/search", label: "Search the directory" },
] as const;

export const guideCategories = [
  "Career Guides",
  "Trade Guides",
  "Certification Guides",
  "Salary Guides",
  "Interview Guides",
  "Tools Guides",
  "Apprenticeship Guides",
] as const;

export const productCategories = [
  "HVAC tools",
  "Electrical tools",
  "Plumbing tools",
  "Welding equipment",
  "Construction tools",
  "Mechanic tools",
  "Workwear",
  "Safety equipment",
  "Books",
  "Courses",
] as const;

export const experienceLevels = ["Entry", "Apprentice", "Journeyman", "Senior", "Lead", "Any"] as const;
export const employmentTypes = ["FULL_TIME","PART_TIME","CONTRACT","APPRENTICESHIP","TEMPORARY","SEASONAL"] as const;
export const locationTypes = ["ON_SITE","REMOTE","HYBRID"] as const;
