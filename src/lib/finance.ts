export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  months: number,
  extraPerPeriod = 0
): { rows: { period: number; payment: number; principal: number; interest: number; balance: number }[]; totalInterest: number; payoffMonths: number } {
  const r = annualRatePct / 100 / 12;
  const payment = monthlyPayment(principal, annualRatePct, months) + extraPerPeriod;
  let balance = principal;
  let totalInterest = 0;
  const rows: { period: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  let period = 0;
  while (balance > 0.01 && period < 1200) {
    period++;
    const interest = balance * r;
    let principalPaid = payment - interest;
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    totalInterest += interest;
    rows.push({ period, payment: principalPaid + interest, principal: principalPaid, interest, balance: Math.max(balance, 0) });
    if (balance <= 0.01) break;
  }
  return { rows, totalInterest, payoffMonths: period };
}

export function futureValueSeries(
  presentValue: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
  contributionAtStart = false
): { futureValue: number; totalContributions: number; totalInterest: number } {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  let balance = presentValue;
  let contributions = presentValue;
  for (let i = 0; i < n; i++) {
    if (contributionAtStart) balance += monthlyContribution;
    balance *= 1 + r;
    if (!contributionAtStart) balance += monthlyContribution;
    contributions += monthlyContribution;
  }
  return { futureValue: balance, totalContributions: contributions, totalInterest: balance - contributions };
}

export function yearlyGrowthSeries(
  presentValue: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number
): { years: number[]; contributions: number[]; balances: number[] } {
  const r = annualRatePct / 100 / 12;
  let balance = presentValue;
  let contributions = presentValue;
  const yearsArr: number[] = [];
  const contribArr: number[] = [];
  const balArr: number[] = [];
  const totalMonths = Math.round(years * 12);
  for (let m = 1; m <= totalMonths; m++) {
    balance = balance * (1 + r) + monthlyContribution;
    contributions += monthlyContribution;
    if (m % 12 === 0) {
      yearsArr.push(m / 12);
      contribArr.push(contributions);
      balArr.push(balance);
    }
  }
  return { years: yearsArr, contributions: contribArr, balances: balArr };
}

export function compoundInterest(
  principal: number,
  annualRatePct: number,
  timesPerYear: number,
  years: number
): number {
  const r = annualRatePct / 100;
  return principal * Math.pow(1 + r / timesPerYear, timesPerYear * years);
}

export function presentValue(futureValue: number, annualRatePct: number, years: number): number {
  return futureValue / Math.pow(1 + annualRatePct / 100, years);
}

export function irrMonthlyToAnnual(effectiveMonthly: number): number {
  return (Math.pow(1 + effectiveMonthly, 12) - 1) * 100;
}
