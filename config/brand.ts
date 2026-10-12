export const brand = {
  name: "ZibaHub",
  legalName: "ZibaHub",
  tagline: "Careers for the skilled trades.",
  description:
    "ZibaHub is a marketplace for skilled-trade jobs, apprenticeships, training, salaries, and employer hiring across the United States, the United Kingdom, and Canada.",
  url: process.env.APP_URL || "http://localhost:3000",
  colors: {
    paper: "#f4f0e8",
    ink: "#1b1915",
    amber: "#c45c12",
    arc: "#0f6e78",
  },
  countries: ["United States", "United Kingdom", "Canada"] as const,
};

export type BrandCountry = (typeof brand.countries)[number];
