import { Calculators } from "@/features/calculators/Calculators";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Calculators", description: "Working pay, overtime, take-home, and training cost calculators.", path: "/calculators" });

export default function CalculatorsPage() {
  return (
    <div className="shell page">
      <h1 className="page-title">Trade calculators</h1>
      <p>Every figure below is calculated from the inputs on this page. Assumptions are written next to the result.</p>
      <Calculators />
    </div>
  );
}
