import MultiModeCalculator, { ModeTab } from "../MultiModeCalculator";

const TABS: ModeTab[] = [
  { id: "payment", label: "Monthly Payment", defSlug: "mortgage" },
  { id: "affordability", label: "Affordability", defSlug: "house-affordability" },
  { id: "refinance", label: "Refinance", defSlug: "refinance" },
  { id: "rent-vs-buy", label: "Rent vs Buy", defSlug: "rent-vs-buy" },
  { id: "extra-payments", label: "Extra Payments", defSlug: "mortgage-payoff" },
  { id: "amortization", label: "Amortization", defSlug: "amortization" },
];

export default function MortgageSuite() {
  return <MultiModeCalculator tabs={TABS} tabPillId="mortgage-suite-pill" />;
}
