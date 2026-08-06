import { describe, it, expect } from "vitest";
import { monthlyPayment, amortizationSchedule, compoundInterest, presentValue, futureValueSeries } from "./finance";

describe("monthlyPayment", () => {
  it("matches the live-verified mortgage example ($320k @ 6.5% / 360mo -> $2,022.62)", () => {
    expect(monthlyPayment(320000, 6.5, 360)).toBeCloseTo(2022.62, 1);
  });

  it("returns principal / months when the rate is 0%", () => {
    expect(monthlyPayment(12000, 0, 12)).toBeCloseTo(1000, 6);
  });

  it("returns 0 for a non-positive term", () => {
    expect(monthlyPayment(10000, 5, 0)).toBe(0);
  });

  it("produces a higher payment for a shorter term at the same rate", () => {
    const shortTerm = monthlyPayment(20000, 8, 36);
    const longTerm = monthlyPayment(20000, 8, 60);
    expect(shortTerm).toBeGreaterThan(longTerm);
  });
});

describe("amortizationSchedule", () => {
  it("fully pays off the loan (balance reaches ~0 on the final row)", () => {
    const { rows } = amortizationSchedule(320000, 6.5, 360);
    expect(rows.length).toBe(360);
    expect(rows[rows.length - 1].balance).toBeCloseTo(0, 1);
  });

  it("matches the live-verified total interest for the $320k / 6.5% / 30yr example", () => {
    const { totalInterest } = amortizationSchedule(320000, 6.5, 360);
    expect(totalInterest).toBeCloseTo(408142.36, -1);
  });

  it("extra payments shorten the payoff time versus the base schedule", () => {
    const base = amortizationSchedule(320000, 6.5, 360);
    const extra = amortizationSchedule(320000, 6.5, 360, 200);
    expect(extra.payoffMonths).toBeLessThan(base.payoffMonths);
    expect(extra.totalInterest).toBeLessThan(base.totalInterest);
  });

  it("every row's interest + principal equals that row's payment", () => {
    const { rows } = amortizationSchedule(50000, 7, 60);
    for (const row of rows) {
      expect(row.principal + row.interest).toBeCloseTo(row.payment, 6);
    }
  });
});

describe("compoundInterest", () => {
  it("matches the standard compound interest formula for monthly compounding", () => {
    // $5,000 at 6% compounded monthly for 5 years: 5000 * (1.005)^60 = 6744.25
    expect(compoundInterest(5000, 6, 12, 5)).toBeCloseTo(6744.25, 1);
  });

  it("more frequent compounding produces a higher balance for the same nominal rate", () => {
    const annual = compoundInterest(10000, 6, 1, 10);
    const daily = compoundInterest(10000, 6, 365, 10);
    expect(daily).toBeGreaterThan(annual);
  });

  it("returns the principal unchanged at a 0% rate", () => {
    expect(compoundInterest(1000, 0, 12, 10)).toBeCloseTo(1000, 6);
  });
});

describe("presentValue", () => {
  it("matches the worked example: $20,000 in 10yr at 6% discount -> ~$11,168", () => {
    expect(presentValue(20000, 6, 10)).toBeCloseTo(11168, 0);
  });

  it("is the inverse of compound growth at the same rate", () => {
    const grown = 10000 * Math.pow(1.07, 15);
    expect(presentValue(grown, 7, 15)).toBeCloseTo(10000, 4);
  });
});

describe("futureValueSeries", () => {
  it("with zero contribution and zero rate, future value equals present value", () => {
    const { futureValue } = futureValueSeries(5000, 0, 0, 10);
    expect(futureValue).toBeCloseTo(5000, 6);
  });

  it("total contributions equal principal plus all monthly deposits", () => {
    const { totalContributions } = futureValueSeries(1000, 200, 7, 5);
    expect(totalContributions).toBeCloseTo(1000 + 200 * 60, 6);
  });

  it("future value minus total contributions equals total interest", () => {
    const { futureValue, totalContributions, totalInterest } = futureValueSeries(1000, 200, 7, 5);
    expect(futureValue - totalContributions).toBeCloseTo(totalInterest, 6);
  });
});
