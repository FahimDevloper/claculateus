import MultiModeCalculator, { ModeTab } from "../MultiModeCalculator";

const TABS: ModeTab[] = [
  { id: "amortized", label: "Amortized Payment", defSlug: "loan" },
  { id: "extra-payment", label: "Extra Payment", defSlug: "loan-payoff" },
  { id: "amortization", label: "Amortization Schedule", defSlug: "amortization" },
  { id: "comparison", label: "Compare Two Loans", defSlug: "loan-comparison" },
];

export default function LoanSuite() {
  return <MultiModeCalculator tabs={TABS} tabPillId="loan-suite-pill" />;
}
