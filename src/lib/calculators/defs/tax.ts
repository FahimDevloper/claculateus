import { CalculatorDefinition } from "../types";
import { formatCurrency, formatPercent, formatNumber, num, str } from "@/lib/format";
import {
  federalTaxBreakdown,
  ficaTax,
  longTermCapitalGainsRate,
  STANDARD_DEDUCTION_2025,
  STATE_TAX_RATES,
  SE_TAX_RATE,
  SE_NET_EARNINGS_FACTOR,
  SUPPLEMENTAL_WAGE_WITHHOLDING_RATE,
  CORPORATE_TAX_RATE_2025,
  GIFT_ANNUAL_EXCLUSION_2025,
  FilingStatus,
} from "@/lib/tax";

const filingStatusField = {
  id: "filingStatus", label: "Filing Status", type: "select" as const, defaultValue: "single", options: [
    { value: "single", label: "Single" }, { value: "married", label: "Married Filing Jointly" },
  ], width: "half" as const,
};

export const taxCalculators: CalculatorDefinition[] = [
  {
    slug: "state-income-tax",
    title: "State Income Tax Calculator",
    shortTitle: "State Income Tax",
    category: "tax",
    popular: true,
    description: "Estimate your state income tax using a representative rate for your state.",
    keywords: ["state income tax calculator"],
    presets: [
      { label: "Median income", values: { income: 55000 } },
      { label: "Six figures", values: { income: 120000 } },
      { label: "No state tax (e.g. TX/FL)", values: { income: 75000, state: "TX" } },
    ],
    fields: [
      { id: "income", label: "Taxable Income", type: "number", unit: "$", defaultValue: 75000, width: "half" },
      { id: "state", label: "State", type: "select", defaultValue: "CA", options: STATE_TAX_RATES.map((s) => ({ value: s.code, label: s.name })), width: "half" },
    ],
    compute: (v) => {
      const state = STATE_TAX_RATES.find((s) => s.code === v.state) ?? STATE_TAX_RATES[0];
      const tax = (num(v.income) * state.rate) / 100;
      return {
        items: [
          { label: `Estimated ${state.name} Tax`, value: formatCurrency(tax), emphasis: true },
          { label: "Effective Rate Used", value: formatPercent(state.rate, 2) },
        ],
        note: "Simplified flat-rate estimate. Many states use progressive brackets, local surtaxes, or have no income tax — check your state's tax authority for exact figures.",
        chart: { type: "donut", labels: ["After-Tax Income", "State Tax"], series: [{ name: "Income", data: [num(v.income) - tax, tax] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Why is this a flat-rate estimate instead of exact?", a: "Many states use progressive brackets like the federal system, with different rates for different income levels, plus some have local city or county taxes on top. A single representative rate keeps this fast, but check your state's tax authority for exact figures." }],
  },
  {
    slug: "payroll-tax",
    title: "Payroll Tax Calculator",
    category: "tax",
    description: "Calculate FICA payroll taxes (Social Security and Medicare) withheld from an employee's paycheck.",
    keywords: ["payroll tax calculator", "fica calculator"],
    presets: [
      { label: "Entry-level wages", values: { wages: 40000 } },
      { label: "Median wages", values: { wages: 65000 } },
      { label: "High earner", values: { wages: 200000 } },
    ],
    fields: [
      { id: "wages", label: "Annual Gross Wages", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const fica = ficaTax(num(v.wages), str(v.filingStatus, "single") as FilingStatus);
      return {
        items: [
          { label: "Total FICA Tax", value: formatCurrency(fica.total), emphasis: true },
          { label: "Social Security (6.2%)", value: formatCurrency(fica.socialSecurity) },
          { label: "Medicare (1.45%)", value: formatCurrency(fica.medicare) },
          { label: "Additional Medicare (0.9%)", value: formatCurrency(fica.additionalMedicare) },
        ],
        note: "Your employer pays a matching amount separately (except the Additional Medicare surtax).",
        chart: {
          type: "donut",
          labels: ["Social Security", "Medicare", "Additional Medicare"],
          series: [{ name: "FICA Tax", data: [fica.socialSecurity, fica.medicare, fica.additionalMedicare] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [
      { q: "Why is there an Additional Medicare tax?", a: "High earners pay an extra 0.9% Medicare tax on wages above $200,000 (single) or $250,000 (married filing jointly) — this portion is not matched by your employer." },
      { q: "Does Social Security tax apply to all my wages?", a: "No — Social Security tax only applies up to an annual wage base cap that adjusts yearly. Wages above the cap are still subject to Medicare tax, just not Social Security." },
    ],
  },
  {
    slug: "capital-gains-tax",
    title: "Capital Gains Tax Calculator",
    category: "tax",
    popular: true,
    description: "Estimate federal tax owed on short-term or long-term capital gains.",
    keywords: ["capital gains tax calculator"],
    presets: [
      { label: "Stock sale, long-term", values: { gain: 15000, otherIncome: 70000, holding: "long" } },
      { label: "Quick flip, short-term", values: { gain: 8000, otherIncome: 70000, holding: "short" } },
      { label: "High earner, long-term", values: { gain: 50000, otherIncome: 250000, holding: "long" } },
    ],
    fields: [
      { id: "gain", label: "Capital Gain Amount", type: "number", unit: "$", defaultValue: 20000, width: "half" },
      { id: "otherIncome", label: "Other Taxable Income", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      { id: "holding", label: "Holding Period", type: "radio", defaultValue: "long", options: [
        { value: "short", label: "Short-term (≤ 1 year)" }, { value: "long", label: "Long-term (> 1 year)" },
      ], width: "full" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const gain = num(v.gain), otherIncome = num(v.otherIncome);
      if (v.holding === "short") {
        const withGain = federalTaxBreakdown(otherIncome + gain, status);
        const without = federalTaxBreakdown(otherIncome, status);
        const tax = withGain.tax - without.tax;
        return {
          items: [
            { label: "Estimated Tax on Gain", value: formatCurrency(tax), emphasis: true },
            { label: "Effective Rate on Gain", value: formatPercent((tax / gain) * 100, 1) },
          ],
          note: "Short-term gains are taxed as ordinary income at your marginal rate.",
          chart: { type: "donut", labels: ["Net Gain After Tax", "Tax"], series: [{ name: "Gain", data: [gain - tax, tax] }], valuePrefix: "$" },
        };
      }
      const rate = longTermCapitalGainsRate(otherIncome + gain, status);
      const tax = gain * rate;
      return {
        items: [
          { label: "Estimated Tax on Gain", value: formatCurrency(tax), emphasis: true },
          { label: "Long-Term Capital Gains Rate", value: formatPercent(rate * 100, 0) },
        ],
        note: "2025 long-term rates are 0%, 15%, or 20% depending on total taxable income.",
        chart: { type: "donut", labels: ["Net Gain After Tax", "Tax"], series: [{ name: "Gain", data: [gain - tax, tax] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Why does holding period matter so much?", a: "Assets held over a year qualify for long-term capital gains rates (0/15/20%), typically much lower than ordinary income tax rates that apply to short-term gains — this is one of the biggest tax planning levers for investors." }],
  },
  {
    slug: "gift-tax",
    title: "Gift Tax Calculator",
    category: "tax",
    description: "Check whether a gift exceeds the annual exclusion and how much counts against your lifetime exemption.",
    keywords: ["gift tax calculator"],
    presets: [
      { label: "Under the exclusion", values: { giftAmount: 15000 } },
      { label: "Above the exclusion", values: { giftAmount: 40000 } },
    ],
    fields: [
      { id: "giftAmount", label: "Gift Amount (per recipient)", type: "number", unit: "$", defaultValue: 25000, width: "full" },
    ],
    compute: (v) => {
      const taxable = Math.max(num(v.giftAmount) - GIFT_ANNUAL_EXCLUSION_2025, 0);
      return {
        items: [
          { label: "Amount Above Annual Exclusion", value: formatCurrency(taxable), emphasis: true },
          { label: "2025 Annual Exclusion", value: formatCurrency(GIFT_ANNUAL_EXCLUSION_2025) },
        ],
        note: taxable > 0
          ? "This excess typically doesn't trigger tax immediately — it reduces your lifetime gift/estate exemption and requires filing Form 709."
          : "This gift is fully covered by the annual exclusion — no gift tax return needed.",
        chart: {
          type: "donut",
          labels: ["Covered by Exclusion", "Above Exclusion"],
          series: [{ name: "Gift Amount", data: [Math.min(num(v.giftAmount), GIFT_ANNUAL_EXCLUSION_2025), taxable] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [
      { q: "Does the annual exclusion apply per gift or per recipient?", a: "Per recipient, per year. You can give the annual exclusion amount to as many different people as you like without touching your lifetime exemption." },
      { q: "Who pays gift tax — the giver or the recipient?", a: "The giver is responsible for gift tax, not the recipient. In practice, most people never pay it directly since the lifetime exemption is very large — the annual exclusion excess just reduces that lifetime amount." },
    ],
  },
  {
    slug: "tax-refund-estimator",
    title: "Tax Refund Estimator",
    category: "tax",
    popular: true,
    description: "Estimate whether you'll owe money or get a refund based on your withholding.",
    keywords: ["tax refund calculator", "tax refund estimator"],
    presets: [
      { label: "Typical W-2 employee", values: { income: 70000, withheld: 9000, filingStatus: "single" } },
      { label: "Married, dual income", values: { income: 130000, withheld: 16000, filingStatus: "married" } },
      { label: "Under-withheld", values: { income: 90000, withheld: 7000, filingStatus: "single" } },
    ],
    fields: [
      { id: "income", label: "Total Taxable Income", type: "number", unit: "$", defaultValue: 70000, width: "half" },
      { id: "withheld", label: "Federal Tax Withheld (from W-2s)", type: "number", unit: "$", defaultValue: 9000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const { tax } = federalTaxBreakdown(num(v.income), status);
      const diff = num(v.withheld) - tax;
      return {
        items: [
          { label: diff >= 0 ? "Estimated Refund" : "Estimated Amount Owed", value: formatCurrency(Math.abs(diff)), emphasis: true },
          { label: "Estimated Tax Liability", value: formatCurrency(tax) },
          { label: "Total Withheld", value: formatCurrency(num(v.withheld)) },
        ],
        chart: { type: "bar", labels: ["Tax Liability", "Total Withheld"], series: [{ name: "Amount", data: [tax, num(v.withheld)], color: "primary" }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Where do I find my total withheld amount?", a: "It's in Box 2 of your W-2 form (\"Federal income tax withheld\"). If you have multiple jobs, add up Box 2 from each W-2." }],
  },
  {
    slug: "w2-tax",
    title: "W-2 Tax Calculator",
    shortTitle: "W-2 Tax",
    category: "tax",
    description: "Estimate total federal tax (income tax + FICA) for a W-2 employee.",
    keywords: ["w2 tax calculator", "w-2 calculator"],
    presets: [
      { label: "Entry-level salary", values: { wages: 45000, filingStatus: "single" } },
      { label: "Median salary", values: { wages: 65000, filingStatus: "single" } },
      { label: "Dual-income household", values: { wages: 140000, filingStatus: "married" } },
    ],
    fields: [
      { id: "wages", label: "Box 1 Wages (W-2)", type: "number", unit: "$", defaultValue: 75000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const taxable = Math.max(num(v.wages) - STANDARD_DEDUCTION_2025[status], 0);
      const { tax } = federalTaxBreakdown(taxable, status);
      const fica = ficaTax(num(v.wages), status);
      const net = num(v.wages) - tax - fica.total;
      return {
        items: [
          { label: "Estimated Net Pay", value: formatCurrency(net), emphasis: true },
          { label: "Federal Income Tax", value: formatCurrency(tax) },
          { label: "FICA (SS + Medicare)", value: formatCurrency(fica.total) },
          { label: "Taxable Income (after standard deduction)", value: formatCurrency(taxable) },
        ],
        chart: {
          type: "donut",
          labels: ["Net Pay", "Federal Income Tax", "FICA"],
          series: [{ name: "Gross Wages", data: [net, tax, fica.total] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [
      { q: "Why is my taxable income lower than my W-2 wages?", a: "The standard deduction reduces your taxable income before federal tax brackets apply. This calculator doesn't account for pre-tax deductions like 401(k) contributions or health insurance premiums, which would lower taxable wages further." },
    ],
  },
  {
    slug: "1099-tax",
    title: "1099 Tax Calculator",
    shortTitle: "1099 Tax",
    category: "tax",
    popular: true,
    description: "Estimate total tax owed as an independent contractor, including self-employment tax.",
    keywords: ["1099 tax calculator", "independent contractor tax"],
    presets: [
      { label: "Freelancer, part-time", values: { netIncome: 30000, filingStatus: "single" } },
      { label: "Full-time contractor", values: { netIncome: 80000, filingStatus: "single" } },
      { label: "High-earning consultant", values: { netIncome: 180000, filingStatus: "married" } },
    ],
    fields: [
      { id: "netIncome", label: "Net Self-Employment Income", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const netIncome = num(v.netIncome);
      const seTaxableIncome = netIncome * SE_NET_EARNINGS_FACTOR;
      const seTax = seTaxableIncome * SE_TAX_RATE;
      const taxableForIncomeTax = Math.max(netIncome - seTax / 2 - STANDARD_DEDUCTION_2025[status], 0);
      const { tax: incomeTax } = federalTaxBreakdown(taxableForIncomeTax, status);
      const totalTax = seTax + incomeTax;
      return {
        items: [
          { label: "Total Estimated Tax", value: formatCurrency(totalTax), emphasis: true },
          { label: "Self-Employment Tax", value: formatCurrency(seTax) },
          { label: "Estimated Federal Income Tax", value: formatCurrency(incomeTax) },
          { label: "Estimated Net After Tax", value: formatCurrency(netIncome - totalTax) },
        ],
        chart: {
          type: "donut",
          labels: ["Net After Tax", "Self-Employment Tax", "Federal Income Tax"],
          series: [{ name: "Net Income", data: [netIncome - totalTax, seTax, incomeTax] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why is self-employment tax calculated on 92.35% of income, not 100%?", a: "This factor accounts for the employer-equivalent portion of SE tax being deductible before the SE tax itself is calculated — it mirrors how a W-2 employee's FICA is only based on their gross wages, not wages plus employer match." }],
  },
  {
    slug: "quarterly-estimated-tax",
    title: "Quarterly Estimated Tax Calculator",
    shortTitle: "Quarterly Estimated Tax",
    category: "tax",
    description: "Split your estimated annual tax liability into four quarterly payments.",
    keywords: ["quarterly estimated tax calculator", "quarterly taxes"],
    presets: [
      { label: "New freelancer", values: { netIncome: 40000, filingStatus: "single" } },
      { label: "Established contractor", values: { netIncome: 100000, filingStatus: "single" } },
    ],
    fields: [
      { id: "netIncome", label: "Expected Annual Net Self-Employment Income", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const netIncome = num(v.netIncome);
      const seTax = netIncome * SE_NET_EARNINGS_FACTOR * SE_TAX_RATE;
      const taxableForIncomeTax = Math.max(netIncome - seTax / 2 - STANDARD_DEDUCTION_2025[status], 0);
      const { tax: incomeTax } = federalTaxBreakdown(taxableForIncomeTax, status);
      const total = seTax + incomeTax;
      return {
        items: [
          { label: "Each Quarterly Payment", value: formatCurrency(total / 4), emphasis: true },
          { label: "Total Estimated Annual Tax", value: formatCurrency(total) },
        ],
        note: "US quarterly estimated payments are typically due mid-April, mid-June, mid-September, and mid-January.",
        table: {
          headers: ["Quarter", "Due Date", "Payment"],
          rows: [
            ["Q1", "April 15", formatCurrency(total / 4)],
            ["Q2", "June 15", formatCurrency(total / 4)],
            ["Q3", "September 15", formatCurrency(total / 4)],
            ["Q4", "January 15 (next year)", formatCurrency(total / 4)],
          ],
        },
      };
    },
    faqs: [
      { q: "What happens if I underpay my quarterly estimated taxes?", a: "The IRS can charge an underpayment penalty, calculated roughly as interest on the shortfall for each period it was outstanding. Paying at least 90% of your current year's liability (or 100-110% of last year's) generally avoids the penalty." },
    ],
  },
  {
    slug: "bonus-tax",
    title: "Bonus Tax Calculator",
    category: "tax",
    description: "Estimate the taxes withheld from a bonus using the IRS supplemental wage flat rate.",
    keywords: ["bonus tax calculator", "bonus tax rate"],
    presets: [
      { label: "Small bonus", values: { bonus: 1500 } },
      { label: "Year-end bonus", values: { bonus: 10000 } },
    ],
    fields: [{ id: "bonus", label: "Bonus Amount", type: "number", unit: "$", defaultValue: 5000, width: "full" }],
    compute: (v) => {
      const bonus = num(v.bonus);
      const federalWithholding = bonus * SUPPLEMENTAL_WAGE_WITHHOLDING_RATE;
      const fica = ficaTax(bonus);
      const net = bonus - federalWithholding - fica.total;
      return {
        items: [
          { label: "Estimated Net Bonus", value: formatCurrency(net), emphasis: true },
          { label: "Federal Withholding (22% flat rate)", value: formatCurrency(federalWithholding) },
          { label: "FICA Withholding", value: formatCurrency(fica.total) },
        ],
        note: "Bonuses under $1M are typically withheld at a flat 22% federal rate — your actual tax liability is reconciled when you file.",
        chart: {
          type: "donut",
          labels: ["Net Bonus", "Federal Withholding", "FICA"],
          series: [{ name: "Gross Bonus", data: [net, federalWithholding, fica.total] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [
      { q: "Will I get the extra withholding back if my real tax rate is lower than 22%?", a: "Yes — the 22% flat rate is just withholding, not your final tax bill. If your marginal rate is lower, the difference comes back as part of your refund when you file." },
    ],
  },
  {
    slug: "overtime-tax",
    title: "Overtime Tax Calculator",
    category: "tax",
    description: "Estimate the tax impact of overtime pay added to your regular wages.",
    keywords: ["overtime tax calculator"],
    presets: [
      { label: "Occasional overtime", values: { regularWages: 60000, overtimePay: 3000 } },
      { label: "Regular overtime", values: { regularWages: 60000, overtimePay: 12000 } },
    ],
    fields: [
      { id: "regularWages", label: "Regular Annual Wages", type: "number", unit: "$", defaultValue: 60000, width: "half" },
      { id: "overtimePay", label: "Additional Overtime Pay", type: "number", unit: "$", defaultValue: 6000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const withOT = federalTaxBreakdown(Math.max(num(v.regularWages) + num(v.overtimePay) - STANDARD_DEDUCTION_2025[status], 0), status);
      const withoutOT = federalTaxBreakdown(Math.max(num(v.regularWages) - STANDARD_DEDUCTION_2025[status], 0), status);
      const extraTax = withOT.tax - withoutOT.tax;
      return {
        items: [
          { label: "Extra Federal Tax from Overtime", value: formatCurrency(extraTax), emphasis: true },
          { label: "Extra Take-Home from Overtime", value: formatCurrency(num(v.overtimePay) - extraTax) },
          { label: "Marginal Rate Applied", value: formatPercent(withOT.marginalRate * 100, 0) },
        ],
        chart: { type: "donut", labels: ["Extra Take-Home", "Extra Tax"], series: [{ name: "Overtime Pay", data: [num(v.overtimePay) - extraTax, extraTax] }], valuePrefix: "$" },
      };
    },
    faqs: [
      { q: "Does overtime pay get taxed at a higher rate than regular pay?", a: "No — there's no special 'overtime tax rate.' It's taxed the same as any other wages, at your marginal rate. It can feel like it's taxed more because it's stacked on top of your regular income and taxed at your highest bracket." },
    ],
  },
  {
    slug: "effective-tax-rate",
    title: "Effective Tax Rate Calculator",
    category: "tax",
    description: "Calculate your effective (average) federal tax rate, as opposed to your marginal bracket.",
    keywords: ["effective tax rate calculator"],
    presets: [
      { label: "Median income", values: { income: 55000 } },
      { label: "Upper-middle income", values: { income: 150000 } },
      { label: "High earner", values: { income: 400000 } },
    ],
    fields: [
      { id: "income", label: "Taxable Income", type: "number", unit: "$", defaultValue: 90000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const { tax, marginalRate, brackets } = federalTaxBreakdown(num(v.income), status);
      return {
        items: [
          { label: "Effective Tax Rate", value: formatPercent((tax / num(v.income)) * 100, 2), emphasis: true },
          { label: "Marginal Tax Rate", value: formatPercent(marginalRate * 100, 0) },
          { label: "Total Federal Tax", value: formatCurrency(tax) },
        ],
        note: "Your effective rate is always lower than your marginal rate, since only income above each bracket threshold is taxed at that bracket's rate.",
        table: {
          headers: ["Bracket", "Rate", "Taxed in Bracket", "Tax from Bracket"],
          rows: brackets.map((b) => [
            `${formatCurrency(b.bracketFloor)} – ${b.bracketCeiling === Infinity ? "∞" : formatCurrency(b.bracketCeiling)}`,
            formatPercent(b.rate * 100, 0),
            formatCurrency(b.amountTaxedAtRate),
            formatCurrency(b.taxFromBracket),
          ]),
        },
      };
    },
    faqs: [
      { q: "Why is my effective rate so much lower than my tax bracket?", a: "Your marginal bracket only applies to your last dollar of income. Every dollar before that is taxed at the lower rates of the brackets below it, which pulls your average (effective) rate well below your top marginal rate." },
    ],
  },
  {
    slug: "marginal-tax-rate",
    title: "Marginal Tax Rate Calculator",
    shortTitle: "Marginal Tax Rate",
    category: "tax",
    description: "See exactly how much tax you pay in each bracket, up to your income level.",
    keywords: ["marginal tax rate calculator"],
    presets: [
      { label: "Median income", values: { income: 55000 } },
      { label: "Upper-middle income", values: { income: 150000 } },
      { label: "High earner", values: { income: 400000 } },
    ],
    fields: [
      { id: "income", label: "Taxable Income", type: "number", unit: "$", defaultValue: 150000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const { tax, marginalRate, brackets } = federalTaxBreakdown(num(v.income), status);
      return {
        items: [
          { label: "Marginal Tax Rate", value: formatPercent(marginalRate * 100, 0), emphasis: true },
          { label: "Total Tax Across All Brackets", value: formatCurrency(tax) },
        ],
        table: {
          headers: ["Bracket", "Rate", "Taxed in Bracket", "Tax from Bracket"],
          rows: brackets.map((b) => [
            `${formatCurrency(b.bracketFloor)} – ${b.bracketCeiling === Infinity ? "∞" : formatCurrency(b.bracketCeiling)}`,
            formatPercent(b.rate * 100, 0),
            formatCurrency(b.amountTaxedAtRate),
            formatCurrency(b.taxFromBracket),
          ]),
        },
      };
    },
    faqs: [
      { q: "What does 'marginal' mean in marginal tax rate?", a: "It's the tax rate applied to your next dollar of income — not your whole income. The US uses a progressive bracket system, so different portions of your income are taxed at different rates, and the marginal rate is just the rate on the top slice." },
    ],
  },
  {
    slug: "llc-tax",
    title: "LLC Tax Calculator",
    category: "tax",
    description: "Estimate taxes for a single-member LLC taxed as a pass-through entity (sole proprietorship default).",
    keywords: ["llc tax calculator"],
    presets: [
      { label: "Side business", values: { netProfit: 30000 } },
      { label: "Full-time LLC", values: { netProfit: 100000 } },
    ],
    fields: [
      { id: "netProfit", label: "Net Business Profit", type: "number", unit: "$", defaultValue: 100000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const netProfit = num(v.netProfit);
      const seTax = netProfit * SE_NET_EARNINGS_FACTOR * SE_TAX_RATE;
      const taxableIncome = Math.max(netProfit - seTax / 2 - STANDARD_DEDUCTION_2025[status], 0);
      const { tax: incomeTax } = federalTaxBreakdown(taxableIncome, status);
      const total = seTax + incomeTax;
      return {
        items: [
          { label: "Total Estimated Tax", value: formatCurrency(total), emphasis: true },
          { label: "Self-Employment Tax", value: formatCurrency(seTax) },
          { label: "Estimated Income Tax", value: formatCurrency(incomeTax) },
        ],
        note: "Assumes default pass-through taxation. LLCs electing S-Corp or C-Corp status should use those calculators instead.",
        chart: { type: "donut", labels: ["Self-Employment Tax", "Income Tax"], series: [{ name: "Total Tax", data: [seTax, incomeTax] }], valuePrefix: "$" },
      };
    },
    faqs: [
      { q: "Do I pay self-employment tax on all of my LLC's profit?", a: "By default, yes — a single-member LLC's entire net profit is subject to self-employment tax, unlike an S-Corp where only the salary portion is. That's the main reason profitable LLCs sometimes elect S-Corp taxation." },
    ],
  },
  {
    slug: "s-corp-tax",
    title: "S-Corp Tax Calculator",
    category: "tax",
    description: "Compare payroll tax savings from splitting income between a reasonable salary and distributions.",
    keywords: ["s corp tax calculator", "s-corp calculator"],
    presets: [
      { label: "Moderate profit", values: { netProfit: 150000, salary: 80000 } },
      { label: "High profit, modest salary", values: { netProfit: 300000, salary: 100000 } },
    ],
    fields: [
      { id: "netProfit", label: "Total Net Business Profit", type: "number", unit: "$", defaultValue: 150000, width: "half" },
      { id: "salary", label: "Reasonable Owner Salary", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      filingStatusField,
    ],
    compute: (v) => {
      const status = str(v.filingStatus, "single") as FilingStatus;
      const netProfit = num(v.netProfit), salary = Math.min(num(v.salary), netProfit);
      const distributions = netProfit - salary;
      const payrollTax = ficaTax(salary, status).total * 2; // employee + employer share
      const taxableIncome = Math.max(netProfit - STANDARD_DEDUCTION_2025[status], 0);
      const { tax: incomeTax } = federalTaxBreakdown(taxableIncome, status);
      const total = payrollTax + incomeTax;

      const seTaxIfSoleProp = netProfit * SE_NET_EARNINGS_FACTOR * SE_TAX_RATE;
      const savings = seTaxIfSoleProp - payrollTax;

      return {
        items: [
          { label: "Estimated Payroll Tax Savings vs. Sole Proprietor", value: formatCurrency(Math.max(savings, 0)), emphasis: true },
          { label: "Salary Payroll Tax (employee + employer)", value: formatCurrency(payrollTax) },
          { label: "Distributions (not subject to payroll tax)", value: formatCurrency(distributions) },
          { label: "Estimated Income Tax", value: formatCurrency(incomeTax) },
          { label: "Total Estimated Tax", value: formatCurrency(total) },
        ],
        note: "The IRS requires S-Corp owner-employees to take a 'reasonable' salary for services performed — distributions alone can trigger an audit.",
        chart: {
          type: "bar",
          labels: ["Sole Proprietor SE Tax", "S-Corp Payroll Tax"],
          series: [{ name: "Tax on Salary Portion", data: [seTaxIfSoleProp, payrollTax], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [
      { q: "What counts as a 'reasonable salary' for an S-Corp owner?", a: "The IRS looks at what similar businesses pay for similar work in your industry and region — there's no fixed formula. Setting salary too low relative to distributions is one of the most common S-Corp audit triggers." },
    ],
  },
  {
    slug: "corporate-tax",
    title: "Corporate Tax Calculator",
    category: "tax",
    description: "Calculate federal corporate income tax for a C-Corporation at the flat 21% rate.",
    keywords: ["corporate tax calculator", "c corp tax"],
    presets: [
      { label: "Small corporation", values: { netIncome: 150000 } },
      { label: "Mid-size corporation", values: { netIncome: 1000000 } },
    ],
    fields: [{ id: "netIncome", label: "Net Taxable Corporate Income", type: "number", unit: "$", defaultValue: 500000, width: "full" }],
    compute: (v) => {
      const tax = num(v.netIncome) * CORPORATE_TAX_RATE_2025;
      return {
        items: [
          { label: "Federal Corporate Tax", value: formatCurrency(tax), emphasis: true },
          { label: "After-Tax Income", value: formatCurrency(num(v.netIncome) - tax) },
        ],
        note: "US federal corporate tax is a flat 21% rate. State corporate tax is separate and varies by state.",
        chart: { type: "donut", labels: ["After-Tax Income", "Federal Tax"], series: [{ name: "Net Income", data: [num(v.netIncome) - tax, tax] }], valuePrefix: "$" },
      };
    },
    faqs: [
      { q: "Is 21% the total tax rate on corporate income?", a: "It's the federal rate on the corporation's own income. If profits are later paid out as dividends, shareholders pay tax again on those dividends personally — this 'double taxation' is a key difference from pass-through entities like S-Corps and LLCs." },
    ],
  },
  {
    slug: "customs-duty",
    title: "Customs Duty Calculator",
    category: "tax",
    description: "Estimate the customs duty owed on an imported shipment.",
    keywords: ["customs duty calculator", "import duty calculator"],
    presets: [
      { label: "Low-duty goods", values: { value: 2000, dutyRate: 2, shipping: 100 } },
      { label: "High-duty goods", values: { value: 2000, dutyRate: 15, shipping: 100 } },
    ],
    fields: [
      { id: "value", label: "Declared Value of Goods", type: "number", unit: "$", defaultValue: 2000, width: "half" },
      { id: "dutyRate", label: "Duty Rate", type: "number", unit: "%", defaultValue: 5, step: 0.1, width: "half" },
      { id: "shipping", label: "Shipping & Insurance", type: "number", unit: "$", defaultValue: 100, width: "half" },
    ],
    compute: (v) => {
      const dutiableValue = num(v.value) + num(v.shipping);
      const duty = (dutiableValue * num(v.dutyRate)) / 100;
      return {
        items: [
          { label: "Estimated Customs Duty", value: formatCurrency(duty), emphasis: true },
          { label: "Total Landed Cost", value: formatCurrency(dutiableValue + duty) },
        ],
        note: "Actual duty rates depend on the product's HS classification and country of origin — check your country's customs authority for exact rates.",
        chart: {
          type: "donut",
          labels: ["Goods Value", "Shipping & Insurance", "Duty"],
          series: [{ name: "Total Landed Cost", data: [num(v.value), num(v.shipping), duty] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [
      { q: "What counts as 'dutiable value'?", a: "Most countries calculate duty on the CIF value — the cost of goods plus international shipping and insurance — rather than just the item's sale price, which is why shipping is included in this calculator." },
    ],
  },
];
