import { ComponentType } from "react";
import ScientificCalculator from "@/components/calculators/ScientificCalculator";
import StandardCalculator from "@/components/calculators/StandardCalculator";
import MortgageSuite from "@/components/calculators/suites/MortgageSuite";
import LoanSuite from "@/components/calculators/suites/LoanSuite";
import RetirementSuite from "@/components/calculators/suites/RetirementSuite";

export const customComponents: Record<string, ComponentType> = {
  scientific: ScientificCalculator,
  standard: StandardCalculator,
  mortgage: MortgageSuite,
  loan: LoanSuite,
  retirement: RetirementSuite,
};
