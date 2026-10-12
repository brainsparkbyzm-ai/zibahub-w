import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { brand } from "@/config/brand";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: { default: "ZibaHub", template: "%s · ZibaHub" },
  description: brand.description,
  applicationName: "ZibaHub",
  keywords: ["skilled trades jobs", "trade careers", "HVAC jobs", "electrician jobs", "plumber jobs", "construction jobs", "apprenticeships", "trade salaries", "ZibaHub"],
  openGraph: { siteName: "ZibaHub", type: "website", title: "ZibaHub — Skilled Trades Jobs, Careers & Tools", description: brand.description },
  twitter: { card: "summary_large_image", title: "ZibaHub — Skilled Trades Jobs, Careers & Tools", description: brand.description },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ZibaHub",
    url: brand.url,
    description: brand.description,
  };
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="zh-app">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
