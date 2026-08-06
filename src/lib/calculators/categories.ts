import { CategoryMeta } from "./types";

export const categories: CategoryMeta[] = [
  {
    slug: "financial",
    title: "Financial",
    tagline: "Loans, mortgages, investing & budgeting",
    description:
      "Mortgage, loan, investment, retirement and budgeting calculators to help you plan every financial decision with confidence.",
    icon: "wallet",
  },
  {
    slug: "tax",
    title: "Tax",
    tagline: "Federal, state, payroll & business tax",
    description:
      "A complete US tax center — federal and state income tax, payroll, self-employment, capital gains, and business tax calculators.",
    icon: "receipt",
  },
  {
    slug: "health",
    title: "Health & Fitness",
    tagline: "Body metrics, nutrition & training",
    description:
      "BMI, calorie, body fat, macros and training calculators built on established health formulas.",
    icon: "heart",
  },
  {
    slug: "math",
    title: "Math",
    tagline: "Algebra, geometry, statistics & more",
    description:
      "Scientific, statistics, geometry and algebra calculators for school, work, and everyday problem solving.",
    icon: "sigma",
  },
  {
    slug: "everyday",
    title: "Everyday",
    tagline: "Time, dates, grades & daily tools",
    description:
      "Age, date, time, GPA, tip and other practical calculators for everyday tasks.",
    icon: "sparkles",
  },
  {
    slug: "conversion",
    title: "Conversion",
    tagline: "Length, weight, temperature & units",
    description:
      "Convert between units of length, weight, temperature, volume, speed and more, instantly.",
    icon: "arrows",
  },
];

export function getCategory(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}
