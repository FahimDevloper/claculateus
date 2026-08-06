import MultiModeCalculator, { ModeTab } from "../MultiModeCalculator";

const TABS: ModeTab[] = [
  { id: "retirement", label: "Retirement", defSlug: "retirement" },
  { id: "fire", label: "FIRE", defSlug: "fire-number" },
  { id: "401k", label: "401(k)", defSlug: "401k" },
  { id: "roth-ira", label: "Roth IRA", defSlug: "roth-ira" },
  { id: "ira", label: "Traditional IRA", defSlug: "ira" },
  { id: "pension", label: "Pension", defSlug: "pension" },
  { id: "social-security", label: "Social Security", defSlug: "social-security" },
  { id: "annuity", label: "Annuity", defSlug: "annuity" },
];

export default function RetirementSuite() {
  return <MultiModeCalculator tabs={TABS} tabPillId="retirement-suite-pill" />;
}
