import { Calculators } from "@/features/calculators/Calculators";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Calculators", description: "Estimate skilled-trade pay, overtime, take-home amounts and training costs with calculators that show their inputs and assumptions.", path: "/calculators" });

export default function CalculatorsPage() {
  return (
    <div className="shell page zh-directory-page zh-page-calculators">
      <h1 className="page-title">Trade calculators</h1>
      <p>Estimate pay, overtime, take-home amounts and training costs using the inputs shown. Each result is calculated from your entries, with assumptions displayed beside the figure.</p>
      <p>These calculators are planning tools, not payroll, tax or financial advice. Actual take-home pay depends on local tax rules, benefits, deductions, overtime agreements and employment status. Check the assumptions for the country and pay period you select.</p>
      <Calculators />
    </div>
  );
}
