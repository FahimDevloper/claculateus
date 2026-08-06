import { CalculatorDefinition } from "../types";
import { formatCurrency, formatNumber, formatPercent, formatDuration, num } from "@/lib/format";
import { monthlyPayment, amortizationSchedule, futureValueSeries, compoundInterest, presentValue, yearlyGrowthSeries } from "@/lib/finance";

export const financialCalculators: CalculatorDefinition[] = [
  {
    slug: "mortgage",
    title: "Mortgage Calculator",
    category: "financial",
    popular: true,
    description: "Estimate your monthly mortgage payment including principal, interest, taxes, insurance, PMI and HOA.",
    keywords: ["mortgage", "home loan", "monthly payment", "amortization"],
    presets: [
      { label: "Starter home", values: { homePrice: 320000, downPayment: 32000, loanTerm: "30", interestRate: 6.5 } },
      { label: "Move-up buyer", values: { homePrice: 650000, downPayment: 130000, loanTerm: "30", interestRate: 6.25 } },
      { label: "Low down payment", values: { homePrice: 400000, downPayment: 20000, loanTerm: "30", interestRate: 6.75 } },
      { label: "15-year payoff", values: { homePrice: 400000, downPayment: 80000, loanTerm: "15", interestRate: 5.9 } },
    ],
    fields: [
      { id: "homePrice", label: "Home Price", type: "number", unit: "$", defaultValue: 400000, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      { id: "loanTerm", label: "Loan Term", type: "select", defaultValue: "30", options: [
        { value: "30", label: "30 years" }, { value: "20", label: "20 years" }, { value: "15", label: "15 years" }, { value: "10", label: "10 years" },
      ], width: "half" },
      { id: "interestRate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 6.5, step: 0.01, width: "half" },
      { id: "propertyTax", label: "Property Tax", type: "number", unit: "%/yr", defaultValue: 1.1, step: 0.01, width: "half", advanced: true },
      { id: "homeInsurance", label: "Home Insurance", type: "number", unit: "$/yr", defaultValue: 1800, width: "half", advanced: true },
      { id: "pmi", label: "PMI", type: "number", unit: "%/yr", defaultValue: 0.5, step: 0.01, width: "half", advanced: true },
      { id: "hoa", label: "HOA Dues", type: "number", unit: "$/mo", defaultValue: 0, width: "half", advanced: true },
    ],
    compute: (v) => {
      const price = num(v.homePrice), down = num(v.downPayment), rate = num(v.interestRate);
      const months = num(v.loanTerm) * 12;
      const principal = Math.max(price - down, 0);
      const pi = monthlyPayment(principal, rate, months);
      const monthlyTax = (price * num(v.propertyTax)) / 100 / 12;
      const monthlyIns = num(v.homeInsurance) / 12;
      const ltv = price > 0 ? down / price : 1;
      const monthlyPmi = ltv < 0.2 ? (principal * num(v.pmi)) / 100 / 12 : 0;
      const monthlyHoa = num(v.hoa);
      const total = pi + monthlyTax + monthlyIns + monthlyPmi + monthlyHoa;
      const totalInterest = pi * months - principal;
      const schedule = amortizationSchedule(principal, rate, months);
      const yearly = schedule.rows.filter((r) => r.period % 12 === 0);
      return {
        items: [
          { label: "Total Monthly Payment", value: formatCurrency(total), emphasis: true },
          { label: "Principal & Interest", value: formatCurrency(pi) },
          { label: "Property Tax", value: formatCurrency(monthlyTax) },
          { label: "Home Insurance", value: formatCurrency(monthlyIns) },
          { label: "PMI", value: formatCurrency(monthlyPmi) },
          { label: "HOA", value: formatCurrency(monthlyHoa) },
          { label: "Loan Amount", value: formatCurrency(principal) },
          { label: "Total Interest Paid", value: formatCurrency(totalInterest) },
        ],
        note: "PMI is estimated to drop off automatically once you reach 20% equity.",
        chart: {
          type: "donut",
          labels: ["Principal & Interest", "Property Tax", "Home Insurance", "PMI", "HOA"],
          series: [{ name: "Monthly Payment", data: [pi, monthlyTax, monthlyIns, monthlyPmi, monthlyHoa] }],
          valuePrefix: "$",
        },
        table: {
          headers: ["Year", "Balance Remaining"],
          rows: yearly.slice(0, 30).map((r) => [r.period / 12, formatCurrency(r.balance)]),
        },
      };
    },
    faqs: [
      { q: "How is my monthly mortgage payment calculated?", a: "It combines principal & interest (based on loan amount, rate, and term), plus 1/12th of your annual property tax, home insurance, PMI, and HOA dues." },
      { q: "When does PMI go away?", a: "Lenders typically remove PMI once your loan-to-value ratio drops below 80%, i.e. you've paid down 20% of the home's value." },
    ],
  },
  {
    slug: "mortgage-payoff",
    title: "Mortgage Payoff Calculator",
    category: "financial",
    description: "See how much faster you can pay off your mortgage — and how much interest you'll save — with extra monthly payments.",
    keywords: ["mortgage payoff", "extra payment", "payoff early"],
    presets: [
      { label: "Modest extra ($100/mo)", values: { extra: 100 } },
      { label: "Aggressive extra ($500/mo)", values: { extra: 500 } },
    ],
    fields: [
      { id: "balance", label: "Remaining Balance", type: "number", unit: "$", defaultValue: 300000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 6.5, step: 0.01, width: "half" },
      { id: "remainingYears", label: "Remaining Term", type: "number", unit: "years", defaultValue: 25, width: "half" },
      { id: "extra", label: "Extra Monthly Payment", type: "number", unit: "$", defaultValue: 200, width: "half" },
    ],
    compute: (v) => {
      const balance = num(v.balance), rate = num(v.rate), months = num(v.remainingYears) * 12, extra = num(v.extra);
      const base = amortizationSchedule(balance, rate, months, 0);
      const withExtra = amortizationSchedule(balance, rate, months, extra);
      const monthsSaved = base.payoffMonths - withExtra.payoffMonths;
      const interestSaved = base.totalInterest - withExtra.totalInterest;
      const yearLabels: string[] = [];
      const baseBalances: number[] = [];
      const extraBalances: number[] = [];
      for (let y = 1; y * 12 <= Math.max(base.payoffMonths, 1); y++) {
        const idx = y * 12 - 1;
        yearLabels.push(`Yr ${y}`);
        baseBalances.push(Math.round(base.rows[idx] ? base.rows[idx].balance : 0));
        extraBalances.push(Math.round(withExtra.rows[idx] ? withExtra.rows[idx].balance : 0));
      }
      return {
        items: [
          { label: "Interest Saved", value: formatCurrency(interestSaved), emphasis: true },
          { label: "Time Saved", value: formatDuration(monthsSaved) },
          { label: "New Payoff Time", value: formatDuration(withExtra.payoffMonths) },
          { label: "Original Payoff Time", value: formatDuration(base.payoffMonths) },
          { label: "Total Interest (with extra)", value: formatCurrency(withExtra.totalInterest) },
          { label: "Total Interest (original)", value: formatCurrency(base.totalInterest) },
        ],
        chart: {
          type: "line",
          labels: yearLabels,
          series: [
            { name: "Original Balance", data: baseBalances, color: "accent" },
            { name: "With Extra Payment", data: extraBalances, color: "primary" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Does it matter when I make extra payments during the month?", a: "This calculator assumes extra payments go directly toward principal each month, which is how most lenders apply them by default — always confirm with your servicer that extra payments are applied to principal, not just future payments." }],
  },
  {
    slug: "refinance",
    title: "Refinance Calculator",
    category: "financial",
    description: "Compare your current mortgage to a new refinanced loan and see your monthly savings and break-even point.",
    keywords: ["refinance", "refi", "break even"],
    fields: [
      { id: "currentBalance", label: "Current Loan Balance", type: "number", unit: "$", defaultValue: 300000, width: "half" },
      { id: "currentRate", label: "Current Rate", type: "number", unit: "%", defaultValue: 7.2, step: 0.01, width: "half" },
      { id: "currentRemaining", label: "Years Remaining", type: "number", unit: "years", defaultValue: 27, width: "half" },
      { id: "newRate", label: "New Rate", type: "number", unit: "%", defaultValue: 6.2, step: 0.01, width: "half" },
      { id: "newTerm", label: "New Term", type: "number", unit: "years", defaultValue: 30, width: "half" },
      { id: "closingCosts", label: "Closing Costs", type: "number", unit: "$", defaultValue: 4000, width: "half" },
    ],
    compute: (v) => {
      const bal = num(v.currentBalance);
      const currentPI = monthlyPayment(bal, num(v.currentRate), num(v.currentRemaining) * 12);
      const newPI = monthlyPayment(bal, num(v.newRate), num(v.newTerm) * 12);
      const monthlySavings = currentPI - newPI;
      const breakEvenMonths = monthlySavings > 0 ? num(v.closingCosts) / monthlySavings : Infinity;
      return {
        items: [
          { label: "Monthly Savings", value: formatCurrency(monthlySavings), emphasis: true },
          { label: "New Payment", value: formatCurrency(newPI) },
          { label: "Current Payment", value: formatCurrency(currentPI) },
          { label: "Break-Even Point", value: isFinite(breakEvenMonths) ? formatDuration(breakEvenMonths) : "Never (no savings)" },
        ],
        chart: { type: "bar", labels: ["Current Payment", "New Payment"], series: [{ name: "Monthly P&I", data: [currentPI, newPI], color: "primary" }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "What's a good break-even point for refinancing?", a: "A common rule of thumb is refinancing makes sense if you'll stay in the home longer than the break-even period — if you plan to move or sell before then, the closing costs may outweigh the savings." }],
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs Buy Calculator",
    category: "financial",
    description: "Compare the long-term cost of renting versus buying a home.",
    keywords: ["rent vs buy", "renting", "buying a home"],
    fields: [
      { id: "homePrice", label: "Home Price", type: "number", unit: "$", defaultValue: 400000, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      { id: "mortgageRate", label: "Mortgage Rate", type: "number", unit: "%", defaultValue: 6.5, step: 0.01, width: "half" },
      { id: "years", label: "Years You'll Stay", type: "number", unit: "years", defaultValue: 7, width: "half" },
      { id: "monthlyRent", label: "Comparable Monthly Rent", type: "number", unit: "$", defaultValue: 2200, width: "half" },
      { id: "appreciation", label: "Home Appreciation", type: "number", unit: "%/yr", defaultValue: 3, step: 0.1, width: "half", advanced: true },
    ],
    compute: (v) => {
      const price = num(v.homePrice), down = num(v.downPayment), years = num(v.years);
      const principal = price - down;
      const pi = monthlyPayment(principal, num(v.mortgageRate), 30 * 12);
      const ownCostMonthly = pi + (price * 0.011) / 12 + (price * 0.005) / 12;
      const totalOwnCost = ownCostMonthly * 12 * years + down;
      const futureHomeValue = price * Math.pow(1 + num(v.appreciation) / 100, years);
      const netOwnCost = totalOwnCost - (futureHomeValue - price);
      const totalRentCost = num(v.monthlyRent) * 12 * years;
      return {
        items: [
          { label: "Net Cost to Buy", value: formatCurrency(netOwnCost), emphasis: true },
          { label: "Total Cost to Rent", value: formatCurrency(totalRentCost), emphasis: true },
          { label: "Estimated Home Value (end)", value: formatCurrency(futureHomeValue) },
          { label: "Gross Cost to Own", value: formatCurrency(totalOwnCost) },
        ],
        note: netOwnCost < totalRentCost ? "Buying looks cheaper over this period." : "Renting looks cheaper over this period.",
        chart: {
          type: "bar",
          labels: ["Net Cost to Buy", "Total Cost to Rent"],
          series: [{ name: `Cost Over ${years} Years`, data: [Math.round(netOwnCost), Math.round(totalRentCost)], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does how long I'll stay matter so much?", a: "Buying has large upfront costs (down payment, closing costs) that get amortized over however long you own the home — staying longer spreads those costs over more years and lets home appreciation work in your favor, tilting the math toward buying." }],
  },
  {
    slug: "house-affordability",
    title: "How Much House Can I Afford",
    shortTitle: "House Affordability",
    category: "financial",
    description: "Estimate the home price you can afford based on your income, debts and down payment.",
    keywords: ["house affordability", "how much house can i afford"],
    fields: [
      { id: "annualIncome", label: "Annual Gross Income", type: "number", unit: "$", defaultValue: 100000, width: "half" },
      { id: "monthlyDebts", label: "Other Monthly Debts", type: "number", unit: "$", defaultValue: 400, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 40000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 6.5, step: 0.01, width: "half" },
      { id: "term", label: "Loan Term", type: "number", unit: "years", defaultValue: 30, width: "half" },
      { id: "dti", label: "Target DTI", type: "number", unit: "%", defaultValue: 36, width: "half", advanced: true },
    ],
    compute: (v) => {
      const monthlyIncome = num(v.annualIncome) / 12;
      const maxMonthlyDebt = (monthlyIncome * num(v.dti)) / 100;
      const maxPI = Math.max(maxMonthlyDebt - num(v.monthlyDebts), 0);
      const months = num(v.term) * 12;
      const r = num(v.rate) / 100 / 12;
      const maxLoan = r === 0 ? maxPI * months : (maxPI * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
      const maxHome = maxLoan + num(v.downPayment);
      return {
        items: [
          { label: "Estimated Home Price", value: formatCurrency(maxHome), emphasis: true },
          { label: "Max Loan Amount", value: formatCurrency(maxLoan) },
          { label: "Max Monthly P&I", value: formatCurrency(maxPI) },
        ],
        chart: { type: "donut", labels: ["Max Loan Amount", "Down Payment"], series: [{ name: "Home Price", data: [maxLoan, num(v.downPayment)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "What is DTI and why does it matter for affordability?", a: "DTI (debt-to-income ratio) is the share of your gross monthly income going to debt payments. Lenders typically cap it around 36-43% for a mortgage approval, which is why this calculator uses it to work backward to a maximum home price." }],
  },
  {
    slug: "down-payment",
    title: "Down Payment Calculator",
    category: "financial",
    description: "Calculate how much down payment you need and how long it will take to save it.",
    keywords: ["down payment", "save for a house"],
    fields: [
      { id: "homePrice", label: "Home Price", type: "number", unit: "$", defaultValue: 400000, width: "half" },
      { id: "downPercent", label: "Down Payment", type: "number", unit: "%", defaultValue: 20, width: "half" },
      { id: "currentSavings", label: "Current Savings", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "monthlySavings", label: "Monthly Savings", type: "number", unit: "$", defaultValue: 1200, width: "half" },
    ],
    compute: (v) => {
      const needed = (num(v.homePrice) * num(v.downPercent)) / 100;
      const remaining = Math.max(needed - num(v.currentSavings), 0);
      const months = num(v.monthlySavings) > 0 ? remaining / num(v.monthlySavings) : Infinity;
      return {
        items: [
          { label: "Down Payment Needed", value: formatCurrency(needed), emphasis: true },
          { label: "Still Need to Save", value: formatCurrency(remaining) },
          { label: "Time to Reach Goal", value: isFinite(months) ? formatDuration(months) : "—" },
        ],
        chart: { type: "donut", labels: ["Current Savings", "Still Need"], series: [{ name: "Down Payment Goal", data: [Math.min(num(v.currentSavings), needed), remaining] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Do I need a full 20% down payment?", a: "No — many loan programs allow 3-5% down (or 0% for VA/USDA loans), but putting down less than 20% typically means paying PMI until you build 20% equity. Use the Mortgage Calculator to see how down payment size affects your monthly payment." }],
  },
  {
    slug: "loan",
    title: "Loan Calculator",
    category: "financial",
    popular: true,
    description: "Calculate monthly payments, total interest and total cost for any fixed-rate loan.",
    keywords: ["loan calculator", "monthly payment"],
    presets: [
      { label: "Personal loan", values: { amount: 15000, rate: 11, term: 4 } },
      { label: "Debt consolidation", values: { amount: 25000, rate: 13.5, term: 5 } },
      { label: "Small business", values: { amount: 75000, rate: 9.5, term: 7 } },
    ],
    fields: [
      { id: "amount", label: "Loan Amount", type: "number", unit: "$", defaultValue: 20000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 8, step: 0.01, width: "half" },
      { id: "term", label: "Loan Term", type: "number", unit: "years", defaultValue: 5, width: "half" },
    ],
    compute: (v) => {
      const amount = num(v.amount), months = num(v.term) * 12;
      const payment = monthlyPayment(amount, num(v.rate), months);
      const total = payment * months;
      const schedule = amortizationSchedule(amount, num(v.rate), months);
      const yearly = schedule.rows.filter((r) => r.period % 12 === 0);
      const yearlyPrincipal = yearly.map((_, i) => schedule.rows.slice(i * 12, i * 12 + 12).reduce((s, row) => s + row.principal, 0));
      const yearlyInterest = yearly.map((_, i) => schedule.rows.slice(i * 12, i * 12 + 12).reduce((s, row) => s + row.interest, 0));
      return {
        items: [
          { label: "Monthly Payment", value: formatCurrency(payment), emphasis: true },
          { label: "Total Paid", value: formatCurrency(total) },
          { label: "Total Interest", value: formatCurrency(total - amount) },
        ],
        chart: {
          type: "bar",
          labels: yearly.map((r) => `Yr ${r.period / 12}`),
          series: [
            { name: "Principal", data: yearlyPrincipal, color: "primary" },
            { name: "Interest", data: yearlyInterest, color: "accent2" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "How is the monthly payment calculated?", a: "It uses the standard amortization formula, which spreads the loan amount plus interest into equal payments over the term, so early payments are interest-heavy and later ones are principal-heavy." }],
  },
  {
    slug: "loan-payoff",
    title: "Loan Payoff Calculator",
    category: "financial",
    description: "Find out how much faster you can pay off any loan with extra payments.",
    keywords: ["loan payoff", "extra payments"],
    fields: [
      { id: "balance", label: "Current Balance", type: "number", unit: "$", defaultValue: 15000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 9, step: 0.01, width: "half" },
      { id: "payment", label: "Current Monthly Payment", type: "number", unit: "$", defaultValue: 400, width: "half" },
      { id: "extra", label: "Extra Payment", type: "number", unit: "$", defaultValue: 100, width: "half" },
    ],
    compute: (v) => {
      const balance = num(v.balance), rate = num(v.rate), payment = num(v.payment), extra = num(v.extra);
      const r = rate / 100 / 12;
      function payoffMonths(pmt: number) {
        if (pmt <= balance * r) return Infinity;
        return Math.log(pmt / (pmt - balance * r)) / Math.log(1 + r);
      }
      const base = payoffMonths(payment);
      const withExtra = payoffMonths(payment + extra);
      const capYears = isFinite(base) ? Math.max(1, Math.min(Math.ceil(base / 12), 40)) : 40;
      function simulate(pmt: number) {
        let bal = balance;
        const balances: number[] = [];
        for (let y = 1; y <= capYears; y++) {
          for (let m = 0; m < 12; m++) {
            if (bal <= 0.01) break;
            const interest = bal * r;
            let principalPaid = Math.max(pmt - interest, 0);
            if (principalPaid > bal) principalPaid = bal;
            bal -= principalPaid;
          }
          balances.push(Math.round(Math.max(bal, 0)));
        }
        return balances;
      }
      const baseBalances = simulate(payment);
      const extraBalances = simulate(payment + extra);
      return {
        items: [
          { label: "Time Saved", value: isFinite(base) && isFinite(withExtra) ? formatDuration(base - withExtra) : "—", emphasis: true },
          { label: "New Payoff Time", value: isFinite(withExtra) ? formatDuration(withExtra) : "Never at this payment", },
          { label: "Original Payoff Time", value: isFinite(base) ? formatDuration(base) : "Never at this payment" },
        ],
        chart: {
          type: "line",
          labels: baseBalances.map((_, i) => `Yr ${i + 1}`),
          series: [
            { name: "Original Balance", data: baseBalances, color: "accent" },
            { name: "With Extra Payment", data: extraBalances, color: "primary" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does it say \"never\" at my current payment?", a: "If your monthly payment doesn't cover the interest accruing on the balance, the loan will never pay off — you'd need to increase your payment above the interest-only amount shown by that threshold." }],
  },
  {
    slug: "amortization",
    title: "Amortization Schedule Calculator",
    shortTitle: "Amortization",
    category: "financial",
    description: "Generate a full month-by-month amortization schedule for any loan.",
    keywords: ["amortization schedule", "loan schedule"],
    fields: [
      { id: "amount", label: "Loan Amount", type: "number", unit: "$", defaultValue: 250000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 6.5, step: 0.01, width: "half" },
      { id: "term", label: "Loan Term", type: "number", unit: "years", defaultValue: 30, width: "half" },
    ],
    compute: (v) => {
      const { rows, totalInterest } = amortizationSchedule(num(v.amount), num(v.rate), num(v.term) * 12);
      const yearly = rows.filter((r) => r.period % 12 === 0).slice(0, 30);
      return {
        items: [
          { label: "Monthly Payment", value: formatCurrency(rows[0]?.payment ?? 0), emphasis: true },
          { label: "Total Interest", value: formatCurrency(totalInterest) },
          { label: "Total Paid", value: formatCurrency(num(v.amount) + totalInterest) },
        ],
        chart: {
          type: "line",
          labels: yearly.map((r) => `Yr ${r.period / 12}`),
          series: [{ name: "Remaining Balance", data: yearly.map((r) => r.balance), color: "primary" }],
          valuePrefix: "$",
        },
        table: {
          headers: ["Year", "Payment", "Principal", "Interest", "Balance"],
          rows: yearly.map((r) => [r.period / 12, formatCurrency(r.payment), formatCurrency(r.principal), formatCurrency(r.interest), formatCurrency(r.balance)]),
        },
      };
    },
    faqs: [{ q: "Why is more of my early payments going to interest?", a: "That's how amortization works — interest is calculated on the current balance each month, which is highest at the start. As the balance shrinks, more of each fixed payment goes toward principal." }],
  },
  {
    slug: "auto-loan",
    title: "Auto Loan Calculator",
    category: "financial",
    popular: true,
    description: "Estimate your monthly car payment including sales tax and trade-in value.",
    keywords: ["auto loan", "car payment", "car loan"],
    presets: [
      { label: "New car", values: { price: 42000, downPayment: 5000, tradeIn: 0, salesTax: 7, rate: 6.5, term: 60 } },
      { label: "Used car", values: { price: 22000, downPayment: 3000, tradeIn: 0, salesTax: 7, rate: 8.5, term: 48 } },
      { label: "Trading in", values: { price: 38000, downPayment: 2000, tradeIn: 8000, salesTax: 7, rate: 7, term: 60 } },
    ],
    fields: [
      { id: "price", label: "Vehicle Price", type: "number", unit: "$", defaultValue: 35000, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "tradeIn", label: "Trade-In Value", type: "number", unit: "$", defaultValue: 0, width: "half", advanced: true },
      { id: "salesTax", label: "Sales Tax", type: "number", unit: "%", defaultValue: 7, step: 0.1, width: "half", advanced: true },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 7.5, step: 0.01, width: "half" },
      { id: "term", label: "Loan Term", type: "number", unit: "months", defaultValue: 60, width: "half" },
    ],
    compute: (v) => {
      const price = num(v.price);
      const taxed = price * (1 + num(v.salesTax) / 100);
      const principal = Math.max(taxed - num(v.downPayment) - num(v.tradeIn), 0);
      const payment = monthlyPayment(principal, num(v.rate), num(v.term));
      const total = payment * num(v.term);
      return {
        items: [
          { label: "Monthly Payment", value: formatCurrency(payment), emphasis: true },
          { label: "Loan Amount", value: formatCurrency(principal) },
          { label: "Total Interest", value: formatCurrency(total - principal) },
          { label: "Total Cost", value: formatCurrency(total + num(v.downPayment) + num(v.tradeIn)) },
        ],
        chart: {
          type: "donut",
          labels: ["Loan Principal", "Total Interest", "Down Payment", "Trade-In"],
          series: [{ name: "Total Cost", data: [principal, total - principal, num(v.downPayment), num(v.tradeIn)] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Is sales tax applied before or after my trade-in value?", a: "This varies by state — many states tax only the difference between the vehicle price and trade-in value, which lowers your tax bill. This calculator applies tax to the full price first for a conservative estimate; check your state's rule for exact figures." }],
  },
  {
    slug: "auto-lease",
    title: "Auto Lease Calculator",
    category: "financial",
    description: "Estimate your monthly car lease payment from MSRP, residual value and money factor.",
    keywords: ["car lease", "lease payment", "money factor"],
    fields: [
      { id: "price", label: "Negotiated Price", type: "number", unit: "$", defaultValue: 32000, width: "half" },
      { id: "residualPercent", label: "Residual Value", type: "number", unit: "%", defaultValue: 55, width: "half" },
      { id: "moneyFactor", label: "Money Factor", type: "number", defaultValue: 0.002, step: 0.0001, width: "half", advanced: true },
      { id: "term", label: "Lease Term", type: "number", unit: "months", defaultValue: 36, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 2000, width: "half" },
    ],
    compute: (v) => {
      const price = num(v.price) - num(v.downPayment);
      const residual = (num(v.price) * num(v.residualPercent)) / 100;
      const depreciation = (price - residual) / num(v.term);
      const rentCharge = (price + residual) * num(v.moneyFactor);
      const monthly = depreciation + rentCharge;
      return {
        items: [
          { label: "Monthly Lease Payment", value: formatCurrency(monthly), emphasis: true },
          { label: "Depreciation Fee", value: formatCurrency(depreciation) },
          { label: "Rent Charge (finance fee)", value: formatCurrency(rentCharge) },
          { label: "Residual Value", value: formatCurrency(residual) },
        ],
        chart: { type: "donut", labels: ["Depreciation Fee", "Rent Charge"], series: [{ name: "Monthly Payment", data: [depreciation, rentCharge] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "What is a \"money factor\"?", a: "It's the lease equivalent of an interest rate, expressed as a small decimal. Multiply it by 2400 to get the approximate equivalent APR (e.g., 0.002 × 2400 = 4.8%)." }],
  },
  {
    slug: "payment",
    title: "Payment Calculator",
    category: "financial",
    description: "Solve for the monthly payment of a loan given amount, rate and term.",
    keywords: ["payment calculator", "monthly payment"],
    fields: [
      { id: "amount", label: "Loan Amount", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 6, step: 0.01, width: "half" },
      { id: "term", label: "Term", type: "number", unit: "months", defaultValue: 36, width: "half" },
    ],
    compute: (v) => {
      const payment = monthlyPayment(num(v.amount), num(v.rate), num(v.term));
      return {
        items: [
          { label: "Monthly Payment", value: formatCurrency(payment), emphasis: true },
          { label: "Total Paid", value: formatCurrency(payment * num(v.term)) },
        ],
        chart: { type: "donut", labels: ["Principal", "Interest"], series: [{ name: "Total Paid", data: [num(v.amount), payment * num(v.term) - num(v.amount)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "How is this different from the Loan Calculator?", a: "It's functionally the same calculation with term in months rather than years — useful for shorter-term loans like personal loans or equipment financing that are often quoted in months." }],
  },
  {
    slug: "interest-rate",
    title: "Interest Rate Calculator",
    category: "financial",
    description: "Find the interest rate implied by a loan amount, payment and term.",
    keywords: ["interest rate calculator", "find rate"],
    fields: [
      { id: "amount", label: "Loan Amount", type: "number", unit: "$", defaultValue: 20000, width: "half" },
      { id: "payment", label: "Monthly Payment", type: "number", unit: "$", defaultValue: 420, width: "half" },
      { id: "term", label: "Term", type: "number", unit: "months", defaultValue: 60, width: "half" },
    ],
    compute: (v) => {
      const amount = num(v.amount), payment = num(v.payment), term = num(v.term);
      let lo = 0, hi = 1;
      for (let i = 0; i < 100; i++) {
        const mid = (lo + hi) / 2;
        const pmt = monthlyPayment(amount, mid * 100, term);
        if (pmt > payment) hi = mid; else lo = mid;
      }
      const annualRate = ((lo + hi) / 2) * 100;
      return {
        items: [
          { label: "Estimated Interest Rate", value: formatPercent(annualRate, 2), emphasis: true },
        ],
        table: {
          headers: ["Rate", "Resulting Payment"],
          rows: [-1, -0.5, 0, 0.5, 1].map((delta) => [`${formatNumber(annualRate + delta, 2)}%`, formatCurrency(monthlyPayment(amount, annualRate + delta, term))]),
        },
      };
    },
    faqs: [{ q: "How does this work backward to find the rate?", a: "It uses binary search — repeatedly testing candidate rates and checking whether the resulting payment is too high or too low, narrowing in until it converges on the rate that produces your actual payment." }],
  },
  {
    slug: "simple-interest",
    title: "Simple Interest Calculator",
    category: "financial",
    description: "Calculate simple interest earned or owed on a principal amount.",
    keywords: ["simple interest"],
    fields: [
      { id: "principal", label: "Principal", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "rate", label: "Annual Rate", type: "number", unit: "%", defaultValue: 5, step: 0.01, width: "half" },
      { id: "years", label: "Time", type: "number", unit: "years", defaultValue: 3, width: "half" },
    ],
    compute: (v) => {
      const interest = (num(v.principal) * num(v.rate) * num(v.years)) / 100;
      const yearsN = Math.max(1, Math.round(num(v.years)));
      return {
        items: [
          { label: "Total Interest", value: formatCurrency(interest), emphasis: true },
          { label: "Total Amount", value: formatCurrency(num(v.principal) + interest) },
        ],
        chart: {
          type: "line",
          labels: Array.from({ length: yearsN + 1 }, (_, i) => `Yr ${i}`),
          series: [{ name: "Total Amount", data: Array.from({ length: yearsN + 1 }, (_, i) => Math.round(num(v.principal) + (num(v.principal) * num(v.rate) * i) / 100)), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What's the difference between simple and compound interest?", a: "Simple interest is calculated only on the original principal every period. Compound interest is calculated on the principal plus previously earned interest, so it grows faster over time — see the Compound Interest Calculator to compare." }],
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    category: "financial",
    popular: true,
    description: "See how your money grows over time with compound interest and regular contributions.",
    keywords: ["compound interest", "interest calculator"],
    presets: [
      { label: "Starter saver", values: { principal: 1000, monthly: 100, rate: 6, years: 20 } },
      { label: "Steady investor", values: { principal: 10000, monthly: 300, rate: 7, years: 25 } },
      { label: "Aggressive grower", values: { principal: 25000, monthly: 500, rate: 9, years: 30 } },
    ],
    fields: [
      { id: "principal", label: "Initial Amount", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "monthly", label: "Monthly Contribution", type: "number", unit: "$", defaultValue: 200, width: "half" },
      { id: "rate", label: "Annual Interest Rate", type: "number", unit: "%", defaultValue: 7, step: 0.01, width: "half" },
      { id: "years", label: "Time", type: "number", unit: "years", defaultValue: 20, width: "half" },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.principal), num(v.monthly), num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.principal), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Future Value", value: formatCurrency(futureValue), emphasis: true },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Interest Earned", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does compound interest grow so much faster over long time horizons?", a: "Each period's interest gets added to the balance and starts earning interest itself — this compounding effect accelerates over time, which is why starting early matters more than the exact contribution amount for long-term growth." }],
  },
  {
    slug: "interest",
    title: "Interest Calculator",
    category: "financial",
    description: "General-purpose interest calculator for savings or loans with monthly compounding.",
    keywords: ["interest calculator"],
    fields: [
      { id: "principal", label: "Principal", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "rate", label: "Annual Rate", type: "number", unit: "%", defaultValue: 6, step: 0.01, width: "half" },
      { id: "years", label: "Time", type: "number", unit: "years", defaultValue: 5, width: "half" },
      { id: "compounding", label: "Compounding", type: "select", defaultValue: "12", options: [
        { value: "1", label: "Annually" }, { value: "4", label: "Quarterly" }, { value: "12", label: "Monthly" }, { value: "365", label: "Daily" },
      ], width: "half", advanced: true },
    ],
    compute: (v) => {
      const fv = compoundInterest(num(v.principal), num(v.rate), num(v.compounding), num(v.years));
      const yearsN = Math.max(1, Math.round(num(v.years)));
      return {
        items: [
          { label: "Final Balance", value: formatCurrency(fv), emphasis: true },
          { label: "Interest Earned", value: formatCurrency(fv - num(v.principal)) },
        ],
        chart: {
          type: "line",
          labels: Array.from({ length: yearsN + 1 }, (_, i) => `Yr ${i}`),
          series: [{ name: "Balance", data: Array.from({ length: yearsN + 1 }, (_, i) => Math.round(compoundInterest(num(v.principal), num(v.rate), num(v.compounding), i))), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Does compounding frequency actually make a big difference?", a: "It matters, but less than you'd expect — going from annual to daily compounding at the same stated rate typically adds a fraction of a percent to your effective yield, much less impactful than the rate itself or the time invested." }],
  },
  {
    slug: "savings",
    title: "Savings Calculator",
    category: "financial",
    description: "Project the growth of your savings account with regular deposits.",
    keywords: ["savings calculator", "savings goal"],
    fields: [
      { id: "initial", label: "Initial Deposit", type: "number", unit: "$", defaultValue: 1000, width: "half" },
      { id: "monthly", label: "Monthly Deposit", type: "number", unit: "$", defaultValue: 300, width: "half" },
      { id: "rate", label: "Annual Interest Rate", type: "number", unit: "%", defaultValue: 4, step: 0.01, width: "half" },
      { id: "years", label: "Time", type: "number", unit: "years", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.initial), num(v.monthly), num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.initial), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Ending Balance", value: formatCurrency(futureValue), emphasis: true },
          { label: "Total Deposited", value: formatCurrency(totalContributions) },
          { label: "Interest Earned", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Deposited", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Is this the same math as the Compound Interest Calculator?", a: "Yes, functionally — this one is just framed around a savings goal with deposits rather than general investment growth, showing the same future value projection with monthly contributions." }],
  },
  {
    slug: "cd",
    title: "Certificate of Deposit (CD) Calculator",
    shortTitle: "CD Calculator",
    category: "financial",
    description: "Calculate the maturity value of a certificate of deposit.",
    keywords: ["cd calculator", "certificate of deposit"],
    fields: [
      { id: "deposit", label: "Deposit Amount", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "rate", label: "APY", type: "number", unit: "%", defaultValue: 4.5, step: 0.01, width: "half" },
      { id: "term", label: "Term", type: "number", unit: "months", defaultValue: 12, width: "half" },
      { id: "compounding", label: "Compounding", type: "select", defaultValue: "12", options: [
        { value: "1", label: "Annually" }, { value: "4", label: "Quarterly" }, { value: "12", label: "Monthly" }, { value: "365", label: "Daily" },
      ], width: "half", advanced: true },
    ],
    compute: (v) => {
      const years = num(v.term) / 12;
      const maturity = compoundInterest(num(v.deposit), num(v.rate), num(v.compounding), years);
      return {
        items: [
          { label: "Maturity Value", value: formatCurrency(maturity), emphasis: true },
          { label: "Interest Earned", value: formatCurrency(maturity - num(v.deposit)) },
        ],
        chart: { type: "donut", labels: ["Deposit", "Interest Earned"], series: [{ name: "Maturity Value", data: [num(v.deposit), maturity - num(v.deposit)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Can I withdraw from a CD before it matures?", a: "Usually yes, but early withdrawal typically triggers a penalty (often a few months of interest) — this calculator shows the maturity value assuming you hold it for the full term." }],
  },
  {
    slug: "retirement",
    title: "Retirement Calculator",
    category: "financial",
    popular: true,
    description: "Estimate your retirement nest egg based on savings rate, growth and years to retirement.",
    keywords: ["retirement calculator", "retirement savings"],
    presets: [
      { label: "Just starting (30s)", values: { currentAge: 30, retireAge: 65, currentSavings: 15000, monthlyContribution: 400, rate: 7, withdrawalRate: 4 } },
      { label: "Mid-career (40s)", values: { currentAge: 45, retireAge: 65, currentSavings: 150000, monthlyContribution: 900, rate: 6.5, withdrawalRate: 4 } },
      { label: "Catching up (50s)", values: { currentAge: 55, retireAge: 67, currentSavings: 300000, monthlyContribution: 1500, rate: 6, withdrawalRate: 3.5 } },
    ],
    fields: [
      { id: "currentAge", label: "Current Age", type: "number", defaultValue: 30, width: "half" },
      { id: "retireAge", label: "Retirement Age", type: "number", defaultValue: 65, width: "half" },
      { id: "currentSavings", label: "Current Savings", type: "number", unit: "$", defaultValue: 20000, width: "half" },
      { id: "monthlyContribution", label: "Monthly Contribution", type: "number", unit: "$", defaultValue: 500, width: "half" },
      { id: "rate", label: "Expected Annual Return", type: "number", unit: "%", defaultValue: 7, step: 0.1, width: "half" },
      { id: "withdrawalRate", label: "Safe Withdrawal Rate", type: "number", unit: "%", defaultValue: 4, step: 0.1, width: "half", advanced: true },
    ],
    compute: (v) => {
      const years = Math.max(num(v.retireAge) - num(v.currentAge), 0);
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.currentSavings), num(v.monthlyContribution), num(v.rate), years);
      const annualIncome = (futureValue * num(v.withdrawalRate)) / 100;
      const growth = yearlyGrowthSeries(num(v.currentSavings), num(v.monthlyContribution), num(v.rate), years);
      return {
        items: [
          { label: "Projected Nest Egg", value: formatCurrency(futureValue), emphasis: true },
          { label: "Sustainable Annual Income", value: formatCurrency(annualIncome) },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Growth", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Age ${num(v.currentAge) + y}`),
          series: [
            { name: "Nest Egg", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What withdrawal rate should I use?", a: "4% is the traditional \"safe withdrawal rate\" rule of thumb from the Trinity Study, designed to make savings last 30 years. Some planners now suggest 3-3.5% for extra safety given longer lifespans and market uncertainty." }],
  },
  {
    slug: "401k",
    title: "401(k) Calculator",
    category: "financial",
    description: "Project your 401(k) balance at retirement including employer match.",
    keywords: ["401k calculator", "retirement plan"],
    presets: [
      { label: "Early career", values: { salary: 55000, contributionPercent: 6, matchPercent: 3, currentBalance: 5000, years: 35 } },
      { label: "Maxing the match", values: { salary: 90000, contributionPercent: 10, matchPercent: 5, currentBalance: 60000, years: 20 } },
    ],
    fields: [
      { id: "salary", label: "Annual Salary", type: "number", unit: "$", defaultValue: 80000, width: "half" },
      { id: "contributionPercent", label: "Your Contribution", type: "number", unit: "%", defaultValue: 8, width: "half" },
      { id: "matchPercent", label: "Employer Match", type: "number", unit: "% (up to)", defaultValue: 4, width: "half" },
      { id: "currentBalance", label: "Current Balance", type: "number", unit: "$", defaultValue: 15000, width: "half" },
      { id: "years", label: "Years to Retirement", type: "number", defaultValue: 30, width: "half" },
      { id: "rate", label: "Expected Return", type: "number", unit: "%", defaultValue: 7, step: 0.1, width: "half" },
    ],
    compute: (v) => {
      const monthlyOwn = (num(v.salary) * num(v.contributionPercent)) / 100 / 12;
      const matchPct = Math.min(num(v.contributionPercent), num(v.matchPercent));
      const monthlyMatch = (num(v.salary) * matchPct) / 100 / 12;
      const totalMonthly = monthlyOwn + monthlyMatch;
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.currentBalance), totalMonthly, num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.currentBalance), totalMonthly, num(v.rate), num(v.years));
      return {
        items: [
          { label: "Projected Balance", value: formatCurrency(futureValue), emphasis: true },
          { label: "Monthly Employer Match", value: formatCurrency(monthlyMatch) },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Growth", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Am I leaving money on the table if I contribute less than the match percentage?", a: "Yes — employer match up to that percentage is essentially free money. Most financial advisors recommend contributing at least enough to capture the full match before prioritizing other savings goals." }],
  },
  {
    slug: "pension",
    title: "Pension Calculator",
    category: "financial",
    description: "Estimate a defined-benefit pension payout based on years of service and final salary.",
    keywords: ["pension calculator"],
    fields: [
      { id: "finalSalary", label: "Final Average Salary", type: "number", unit: "$", defaultValue: 75000, width: "half" },
      { id: "yearsOfService", label: "Years of Service", type: "number", defaultValue: 25, width: "half" },
      { id: "multiplier", label: "Benefit Multiplier", type: "number", unit: "%", defaultValue: 1.8, step: 0.01, width: "half", advanced: true },
    ],
    compute: (v) => {
      const annual = (num(v.finalSalary) * num(v.yearsOfService) * num(v.multiplier)) / 100;
      return {
        items: [
          { label: "Estimated Annual Pension", value: formatCurrency(annual), emphasis: true },
          { label: "Estimated Monthly Pension", value: formatCurrency(annual / 12) },
        ],
        table: {
          headers: ["Multiplier", "Estimated Annual Pension"],
          rows: [1.5, 1.8, 2.0, 2.5].map((m) => [`${formatNumber(m, 2)}%`, formatCurrency((num(v.finalSalary) * num(v.yearsOfService) * m) / 100)]),
        },
      };
    },
    faqs: [{ q: "What's a typical benefit multiplier?", a: "It varies by pension plan, commonly ranging from 1.5% to 2.5% per year of service — check your specific plan documents for the exact multiplier, since it directly drives your benefit amount." }],
  },
  {
    slug: "social-security",
    title: "Social Security Estimator",
    shortTitle: "Social Security",
    category: "financial",
    description: "Rough estimate of monthly Social Security benefits based on average indexed earnings and claiming age.",
    keywords: ["social security calculator"],
    fields: [
      { id: "avgMonthlyEarnings", label: "Avg. Monthly Earnings (career)", type: "number", unit: "$", defaultValue: 6000, width: "half" },
      { id: "claimAge", label: "Claiming Age", type: "select", defaultValue: "67", options: [
        { value: "62", label: "62 (early)" }, { value: "67", label: "67 (full)" }, { value: "70", label: "70 (delayed)" },
      ], width: "half" },
    ],
    compute: (v) => {
      const aime = num(v.avgMonthlyEarnings);
      const bendPoint1 = 1174, bendPoint2 = 7078;
      let pia = 0;
      if (aime <= bendPoint1) pia = aime * 0.9;
      else if (aime <= bendPoint2) pia = bendPoint1 * 0.9 + (aime - bendPoint1) * 0.32;
      else pia = bendPoint1 * 0.9 + (bendPoint2 - bendPoint1) * 0.32 + (aime - bendPoint2) * 0.15;
      const claimAge = num(v.claimAge);
      const adjusted = claimAge === 62 ? pia * 0.7 : claimAge === 70 ? pia * 1.24 : pia;
      return {
        items: [
          { label: "Estimated Monthly Benefit", value: formatCurrency(adjusted), emphasis: true },
          { label: "Primary Insurance Amount", value: formatCurrency(pia) },
        ],
        note: "Simplified estimate using published bend-point formula; actual benefits depend on your full 35-year earnings record.",
        chart: {
          type: "bar",
          labels: ["Age 62", "Age 67 (Full)", "Age 70"],
          series: [{ name: "Monthly Benefit", data: [pia * 0.7, pia, pia * 1.24], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does claiming age change my benefit so much?", a: "Claiming before your full retirement age (67 for most people) permanently reduces your benefit; delaying past it up to age 70 permanently increases it via delayed retirement credits — that's why 62 vs 70 shows such a large difference." }],
  },
  {
    slug: "annuity",
    title: "Annuity Calculator",
    category: "financial",
    description: "Calculate the future value of a fixed annuity with regular contributions.",
    keywords: ["annuity calculator"],
    fields: [
      { id: "initial", label: "Initial Deposit", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "monthly", label: "Monthly Deposit", type: "number", unit: "$", defaultValue: 300, width: "half" },
      { id: "rate", label: "Annual Rate", type: "number", unit: "%", defaultValue: 5, step: 0.01, width: "half" },
      { id: "years", label: "Accumulation Period", type: "number", unit: "years", defaultValue: 15, width: "half" },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.initial), num(v.monthly), num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.initial), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Future Value", value: formatCurrency(futureValue), emphasis: true },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Interest", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What's the difference between this and a savings account?", a: "A fixed annuity is an insurance product with a guaranteed rate over a set accumulation period, generally less liquid than a savings account but often offering higher guaranteed rates in exchange for that reduced flexibility." }],
  },
  {
    slug: "annuity-payout",
    title: "Annuity Payout Calculator",
    category: "financial",
    description: "Calculate how much you can withdraw from an annuity balance over a fixed period.",
    keywords: ["annuity payout"],
    fields: [
      { id: "balance", label: "Annuity Balance", type: "number", unit: "$", defaultValue: 250000, width: "half" },
      { id: "rate", label: "Annual Rate", type: "number", unit: "%", defaultValue: 4, step: 0.01, width: "half" },
      { id: "years", label: "Payout Period", type: "number", unit: "years", defaultValue: 20, width: "half" },
    ],
    compute: (v) => {
      const payment = monthlyPayment(num(v.balance), num(v.rate), num(v.years) * 12);
      const schedule = amortizationSchedule(num(v.balance), num(v.rate), num(v.years) * 12);
      const yearly = schedule.rows.filter((r) => r.period % 12 === 0);
      return {
        items: [
          { label: "Monthly Payout", value: formatCurrency(payment), emphasis: true },
          { label: "Total Payout", value: formatCurrency(payment * num(v.years) * 12) },
        ],
        chart: {
          type: "line",
          labels: yearly.map((r) => `Yr ${r.period / 12}`),
          series: [{ name: "Remaining Balance", data: yearly.map((r) => Math.round(r.balance)), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Will the balance be fully depleted at the end of the payout period?", a: "Yes — this calculates a fixed monthly payout that exactly amortizes the balance to zero over the period you specify, similar to a mortgage running in reverse." }],
  },
  {
    slug: "roth-ira",
    title: "Roth IRA Calculator",
    category: "financial",
    description: "Project the tax-free growth of a Roth IRA account.",
    keywords: ["roth ira calculator"],
    fields: [
      { id: "currentBalance", label: "Current Balance", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "monthly", label: "Monthly Contribution", type: "number", unit: "$", defaultValue: 500, width: "half" },
      { id: "rate", label: "Expected Return", type: "number", unit: "%", defaultValue: 7, step: 0.1, width: "half" },
      { id: "years", label: "Years to Grow", type: "number", defaultValue: 30, width: "half" },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.currentBalance), num(v.monthly), num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.currentBalance), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Tax-Free Balance at Retirement", value: formatCurrency(futureValue), emphasis: true },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Growth", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why is the entire balance tax-free?", a: "Roth IRA contributions are made with after-tax dollars, so qualified withdrawals in retirement — both contributions and growth — come out completely tax-free, unlike a traditional IRA where withdrawals are taxed as income." }],
  },
  {
    slug: "ira",
    title: "Traditional IRA Calculator",
    shortTitle: "IRA Calculator",
    category: "financial",
    description: "Project the tax-deferred growth of a traditional IRA account.",
    keywords: ["ira calculator", "traditional ira"],
    fields: [
      { id: "currentBalance", label: "Current Balance", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "monthly", label: "Monthly Contribution", type: "number", unit: "$", defaultValue: 500, width: "half" },
      { id: "rate", label: "Expected Return", type: "number", unit: "%", defaultValue: 7, step: 0.1, width: "half" },
      { id: "years", label: "Years to Grow", type: "number", defaultValue: 30, width: "half" },
      { id: "taxRate", label: "Tax Rate at Withdrawal", type: "number", unit: "%", defaultValue: 22, width: "half", advanced: true },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.currentBalance), num(v.monthly), num(v.rate), num(v.years));
      const afterTax = futureValue * (1 - num(v.taxRate) / 100);
      const growth = yearlyGrowthSeries(num(v.currentBalance), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Balance Before Tax", value: formatCurrency(futureValue), emphasis: true },
          { label: "Estimated After-Tax Value", value: formatCurrency(afterTax) },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Growth", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does a traditional IRA get taxed at withdrawal?", a: "Traditional IRA contributions are typically tax-deductible going in (pre-tax), so the IRS collects tax when you withdraw in retirement — the tradeoff is a tax break now versus a tax-free Roth IRA later." }],
  },
  {
    slug: "investment",
    title: "Investment Calculator",
    category: "financial",
    popular: true,
    description: "Project the growth of a lump-sum and recurring investment over time.",
    keywords: ["investment calculator"],
    presets: [
      { label: "Conservative", values: { initial: 5000, monthly: 200, rate: 5, years: 15 } },
      { label: "Balanced", values: { initial: 5000, monthly: 250, rate: 8, years: 15 } },
      { label: "Aggressive growth", values: { initial: 10000, monthly: 500, rate: 10, years: 20 } },
    ],
    fields: [
      { id: "initial", label: "Initial Investment", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "monthly", label: "Monthly Addition", type: "number", unit: "$", defaultValue: 250, width: "half" },
      { id: "rate", label: "Expected Annual Return", type: "number", unit: "%", defaultValue: 8, step: 0.1, width: "half" },
      { id: "years", label: "Time Horizon", type: "number", unit: "years", defaultValue: 15, width: "half" },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.initial), num(v.monthly), num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.initial), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Future Value", value: formatCurrency(futureValue), emphasis: true },
          { label: "Total Invested", value: formatCurrency(totalContributions) },
          { label: "Total Growth", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Portfolio Value", data: growth.balances, color: "primary" },
            { name: "Invested", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What return rate should I assume?", a: "Historically the S&P 500 has averaged around 7-10% annually before inflation over long periods, though any single year can vary widely — using a conservative estimate (6-8%) is safer for planning than assuming best-case returns." }],
  },
  {
    slug: "roi",
    title: "ROI Calculator",
    category: "financial",
    description: "Calculate return on investment as a percentage and annualized rate.",
    keywords: ["roi calculator", "return on investment"],
    fields: [
      { id: "initial", label: "Initial Investment", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "final", label: "Final Value", type: "number", unit: "$", defaultValue: 14500, width: "half" },
      { id: "years", label: "Holding Period", type: "number", unit: "years", defaultValue: 3, width: "half" },
    ],
    compute: (v) => {
      const initial = num(v.initial), final = num(v.final), years = num(v.years);
      const roi = ((final - initial) / initial) * 100;
      const annualized = years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : 0;
      return {
        items: [
          { label: "Total ROI", value: formatPercent(roi, 2), emphasis: true },
          { label: "Annualized Return (CAGR)", value: formatPercent(annualized, 2) },
          { label: "Net Gain", value: formatCurrency(final - initial) },
        ],
        chart: { type: "bar", labels: ["Initial Investment", "Final Value"], series: [{ name: "Value", data: [initial, final], color: "primary" }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Why does annualized return differ from total ROI?", a: "Total ROI is the overall percentage gain across the whole period. Annualized return (CAGR) spreads that gain evenly across each year, so a 45% total gain over 3 years shows a lower annualized rate — useful for comparing investments held for different lengths of time." }],
  },
  {
    slug: "cagr",
    title: "CAGR Calculator",
    category: "financial",
    description: "Calculate the compound annual growth rate between two values.",
    keywords: ["cagr calculator", "compound annual growth rate"],
    fields: [
      { id: "begin", label: "Beginning Value", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "end", label: "Ending Value", type: "number", unit: "$", defaultValue: 25000, width: "half" },
      { id: "years", label: "Number of Years", type: "number", defaultValue: 8, width: "half" },
    ],
    compute: (v) => {
      const cagr = (Math.pow(num(v.end) / num(v.begin), 1 / num(v.years)) - 1) * 100;
      const yearsN = Math.max(1, Math.round(num(v.years)));
      return {
        items: [{ label: "CAGR", value: formatPercent(cagr, 2), emphasis: true }],
        chart: {
          type: "line",
          labels: Array.from({ length: yearsN + 1 }, (_, i) => `Yr ${i}`),
          series: [{ name: "Value", data: Array.from({ length: yearsN + 1 }, (_, i) => Math.round(num(v.begin) * Math.pow(1 + cagr / 100, i))), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "How is CAGR different from average annual return?", a: "CAGR (compound annual growth rate) accounts for compounding and smooths out volatility between the start and end values, while a simple average of yearly returns can be misleading when returns vary a lot year to year." }],
  },
  {
    slug: "stock-average",
    title: "Stock Average Calculator",
    shortTitle: "Stock Average",
    category: "financial",
    description: "Calculate your average cost basis across multiple stock purchases.",
    keywords: ["stock average calculator", "average cost basis", "dollar cost average"],
    fields: [
      { id: "shares1", label: "Shares (Purchase 1)", type: "number", defaultValue: 100, width: "half" },
      { id: "price1", label: "Price (Purchase 1)", type: "number", unit: "$", defaultValue: 50, width: "half" },
      { id: "shares2", label: "Shares (Purchase 2)", type: "number", defaultValue: 50, width: "half" },
      { id: "price2", label: "Price (Purchase 2)", type: "number", unit: "$", defaultValue: 40, width: "half" },
    ],
    compute: (v) => {
      const totalShares = num(v.shares1) + num(v.shares2);
      const totalCost = num(v.shares1) * num(v.price1) + num(v.shares2) * num(v.price2);
      const avg = totalShares > 0 ? totalCost / totalShares : 0;
      return {
        items: [
          { label: "Average Cost per Share", value: formatCurrency(avg), emphasis: true },
          { label: "Total Shares", value: formatNumber(totalShares, 4) },
          { label: "Total Cost", value: formatCurrency(totalCost) },
        ],
        chart: {
          type: "bar",
          labels: ["Purchase 1", "Purchase 2", "Average"],
          series: [{ name: "Price per Share", data: [num(v.price1), num(v.price2), avg], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why would I want to average down on a stock?", a: "Buying more shares at a lower price reduces your average cost basis, meaning the stock needs to rise less from its current price for you to break even — though it also means committing more capital to a position that's already declined." }],
  },
  {
    slug: "rule-of-72",
    title: "Rule of 72 Calculator",
    category: "financial",
    description: "Quickly estimate how many years it takes to double your money at a given interest rate.",
    keywords: ["rule of 72"],
    fields: [{ id: "rate", label: "Annual Interest Rate", type: "number", unit: "%", defaultValue: 6, step: 0.1, width: "full" }],
    compute: (v) => {
      const rate = num(v.rate);
      const years = rate > 0 ? 72 / rate : Infinity;
      return {
        items: [{ label: "Years to Double", value: isFinite(years) ? formatNumber(years, 1) : "—", emphasis: true }],
        table: {
          headers: ["Rate", "Years to Double"],
          rows: [2, 4, 6, 8, 10, 12].map((r) => [`${r}%`, formatNumber(72 / r, 1)]),
        },
      };
    },
    faqs: [{ q: "How accurate is the Rule of 72?", a: "It's a mental-math approximation, most accurate for rates between roughly 6-10%. For very high or low rates, the true doubling time (calculated with logarithms) diverges slightly from the 72/rate estimate." }],
  },
  {
    slug: "present-value",
    title: "Present Value Calculator",
    category: "financial",
    description: "Calculate the present value of a future sum of money.",
    keywords: ["present value calculator"],
    fields: [
      { id: "futureValue", label: "Future Value", type: "number", unit: "$", defaultValue: 20000, width: "half" },
      { id: "rate", label: "Discount Rate", type: "number", unit: "%", defaultValue: 6, step: 0.1, width: "half" },
      { id: "years", label: "Years", type: "number", defaultValue: 10, width: "half" },
    ],
    compute: (v) => ({
      items: [{ label: "Present Value", value: formatCurrency(presentValue(num(v.futureValue), num(v.rate), num(v.years))), emphasis: true }],
      chart: { type: "bar", labels: ["Present Value", "Future Value"], series: [{ name: "Amount", data: [presentValue(num(v.futureValue), num(v.rate), num(v.years)), num(v.futureValue)], color: "primary" }], valuePrefix: "$" },
    }),
    faqs: [{ q: "What does \"discount rate\" mean here?", a: "It's the rate used to translate a future dollar amount into today's equivalent value — reflecting the idea that money available now is worth more than the same amount received later, since it could be invested in the meantime." }],
  },
  {
    slug: "future-value",
    title: "Future Value Calculator",
    category: "financial",
    description: "Calculate the future value of a present sum with compound interest.",
    keywords: ["future value calculator"],
    fields: [
      { id: "presentValue", label: "Present Value", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 6, step: 0.1, width: "half" },
      { id: "years", label: "Years", type: "number", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const yearsN = Math.max(1, Math.round(num(v.years)));
      return {
        items: [{ label: "Future Value", value: formatCurrency(compoundInterest(num(v.presentValue), num(v.rate), 1, num(v.years))), emphasis: true }],
        chart: {
          type: "line",
          labels: Array.from({ length: yearsN + 1 }, (_, i) => `Yr ${i}`),
          series: [{ name: "Value", data: Array.from({ length: yearsN + 1 }, (_, i) => Math.round(compoundInterest(num(v.presentValue), num(v.rate), 1, i))), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Is this the opposite of the Present Value Calculator?", a: "Yes — this projects a lump sum forward in time with compound growth, while Present Value works backward from a future amount to find its value today." }],
  },
  {
    slug: "net-worth",
    title: "Net Worth Calculator",
    category: "financial",
    description: "Calculate your net worth from your total assets and liabilities.",
    keywords: ["net worth calculator"],
    fields: [
      { id: "cash", label: "Cash & Savings", type: "number", unit: "$", defaultValue: 15000, width: "half" },
      { id: "investments", label: "Investments", type: "number", unit: "$", defaultValue: 40000, width: "half" },
      { id: "realEstate", label: "Real Estate Value", type: "number", unit: "$", defaultValue: 350000, width: "half" },
      { id: "otherAssets", label: "Other Assets", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "mortgage", label: "Mortgage Owed", type: "number", unit: "$", defaultValue: 280000, width: "half" },
      { id: "otherDebt", label: "Other Debt", type: "number", unit: "$", defaultValue: 12000, width: "half" },
    ],
    compute: (v) => {
      const assets = num(v.cash) + num(v.investments) + num(v.realEstate) + num(v.otherAssets);
      const liabilities = num(v.mortgage) + num(v.otherDebt);
      return {
        items: [
          { label: "Net Worth", value: formatCurrency(assets - liabilities), emphasis: true },
          { label: "Total Assets", value: formatCurrency(assets) },
          { label: "Total Liabilities", value: formatCurrency(liabilities) },
        ],
        chart: {
          type: "donut",
          labels: ["Cash & Savings", "Investments", "Real Estate", "Other Assets"],
          series: [{ name: "Assets", data: [num(v.cash), num(v.investments), num(v.realEstate), num(v.otherAssets)] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Should I include my car or personal belongings as assets?", a: "You can, but many people exclude depreciating personal-use items (cars, furniture, electronics) since they're not really available to fund retirement or emergencies — real estate and investments are typically the assets that matter most for tracking net worth over time." }],
  },
  {
    slug: "budget",
    title: "Budget Calculator (50/30/20)",
    shortTitle: "Budget Calculator",
    category: "financial",
    description: "Split your take-home income into needs, wants and savings using the 50/30/20 rule.",
    keywords: ["budget calculator", "50 30 20 rule"],
    fields: [{ id: "income", label: "Monthly Take-Home Pay", type: "number", unit: "$", defaultValue: 5000, width: "full" }],
    compute: (v) => {
      const income = num(v.income);
      return {
        items: [
          { label: "Needs (50%)", value: formatCurrency(income * 0.5), emphasis: true },
          { label: "Wants (30%)", value: formatCurrency(income * 0.3) },
          { label: "Savings & Debt (20%)", value: formatCurrency(income * 0.2) },
        ],
        chart: { type: "donut", labels: ["Needs", "Wants", "Savings & Debt"], series: [{ name: "Monthly Income", data: [income * 0.5, income * 0.3, income * 0.2] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "What counts as \"needs\" vs \"wants\"?", a: "Needs are essentials you can't easily cut — rent, groceries, utilities, minimum debt payments. Wants are discretionary — dining out, entertainment, subscriptions. The 50/30/20 rule is a starting guideline, not a strict rule, so adjust based on your actual cost of living." }],
  },
  {
    slug: "emergency-fund",
    title: "Emergency Fund Calculator",
    category: "financial",
    description: "Calculate how much you should keep in an emergency fund based on your monthly expenses.",
    keywords: ["emergency fund calculator"],
    fields: [
      { id: "monthlyExpenses", label: "Essential Monthly Expenses", type: "number", unit: "$", defaultValue: 3000, width: "half" },
      { id: "months", label: "Months of Coverage", type: "number", defaultValue: 6, width: "half" },
      { id: "current", label: "Current Emergency Savings", type: "number", unit: "$", defaultValue: 2000, width: "half" },
    ],
    compute: (v) => {
      const target = num(v.monthlyExpenses) * num(v.months);
      return {
        items: [
          { label: "Target Fund", value: formatCurrency(target), emphasis: true },
          { label: "Still Needed", value: formatCurrency(Math.max(target - num(v.current), 0)) },
        ],
        chart: { type: "donut", labels: ["Current Savings", "Still Needed"], series: [{ name: "Target Fund", data: [Math.min(num(v.current), target), Math.max(target - num(v.current), 0)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "How many months of expenses should I keep?", a: "3-6 months is the standard recommendation for most people, with more (6-12 months) suggested if you're self-employed or in a volatile industry, and less (3 months) if you have very stable dual income and good job security." }],
  },
  {
    slug: "debt-to-income",
    title: "Debt-to-Income Ratio Calculator",
    shortTitle: "Debt-to-Income",
    category: "financial",
    description: "Calculate your debt-to-income ratio, a key metric lenders use to assess affordability.",
    keywords: ["debt to income ratio", "dti calculator"],
    fields: [
      { id: "monthlyDebt", label: "Total Monthly Debt Payments", type: "number", unit: "$", defaultValue: 1800, width: "half" },
      { id: "grossIncome", label: "Gross Monthly Income", type: "number", unit: "$", defaultValue: 6000, width: "half" },
    ],
    compute: (v) => {
      const dti = (num(v.monthlyDebt) / num(v.grossIncome)) * 100;
      const rating = dti <= 36 ? "Healthy" : dti <= 43 ? "Borderline" : "High";
      return {
        items: [
          { label: "Debt-to-Income Ratio", value: formatPercent(dti, 1), emphasis: true },
          { label: "Rating", value: rating },
        ],
        chart: { type: "bar", labels: ["Lender Threshold (36%)", "Your DTI"], series: [{ name: "DTI %", data: [36, dti], color: "primary" }] },
      };
    },
    faqs: [{ q: "What DTI do lenders typically want?", a: "Most mortgage lenders prefer a DTI at or below 36%, though some loan programs allow up to 43-50% with compensating factors like a large down payment or excellent credit." }],
  },
  {
    slug: "debt-payoff",
    title: "Debt Payoff Calculator",
    category: "financial",
    description: "Find out how long it will take to pay off a debt and the total interest paid.",
    keywords: ["debt payoff calculator"],
    presets: [
      { label: "Minimum-ish payment", values: { balance: 8000, rate: 19.99, payment: 200 } },
      { label: "Aggressive payoff", values: { balance: 8000, rate: 19.99, payment: 500 } },
    ],
    fields: [
      { id: "balance", label: "Debt Balance", type: "number", unit: "$", defaultValue: 8000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 19.99, step: 0.01, width: "half" },
      { id: "payment", label: "Monthly Payment", type: "number", unit: "$", defaultValue: 300, width: "half" },
    ],
    compute: (v) => {
      const r = num(v.rate) / 100 / 12;
      const minPayment = num(v.balance) * r;
      if (num(v.payment) <= minPayment) {
        return { items: [], error: "Your monthly payment must be higher than the interest charged each month." };
      }
      const months = Math.log(num(v.payment) / (num(v.payment) - num(v.balance) * r)) / Math.log(1 + r);
      const totalPaid = num(v.payment) * months;
      const capYears = Math.max(1, Math.min(Math.ceil(months / 12), 40));
      let bal = num(v.balance);
      const balances: number[] = [];
      for (let y = 1; y <= capYears; y++) {
        for (let m = 0; m < 12; m++) {
          if (bal <= 0.01) break;
          const interest = bal * r;
          let principalPaid = num(v.payment) - interest;
          if (principalPaid > bal) principalPaid = bal;
          bal -= principalPaid;
        }
        balances.push(Math.round(Math.max(bal, 0)));
      }
      return {
        items: [
          { label: "Time to Pay Off", value: formatDuration(months), emphasis: true },
          { label: "Total Interest Paid", value: formatCurrency(totalPaid - num(v.balance)) },
          { label: "Total Paid", value: formatCurrency(totalPaid) },
        ],
        chart: {
          type: "line",
          labels: balances.map((_, i) => `Yr ${i + 1}`),
          series: [{ name: "Remaining Balance", data: balances, color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What happens if my payment barely covers the interest?", a: "If your payment is at or below the monthly interest charge, the balance never shrinks — the calculator flags this since it would technically take forever to pay off at that payment level." }],
  },
  {
    slug: "debt-consolidation",
    title: "Debt Consolidation Calculator",
    category: "financial",
    description: "Compare your combined debt payments to a single consolidated loan payment.",
    keywords: ["debt consolidation calculator"],
    fields: [
      { id: "totalDebt", label: "Total Debt Balance", type: "number", unit: "$", defaultValue: 18000, width: "half" },
      { id: "currentAvgRate", label: "Current Avg. Rate", type: "number", unit: "%", defaultValue: 22, step: 0.1, width: "half" },
      { id: "newRate", label: "Consolidation Loan Rate", type: "number", unit: "%", defaultValue: 12, step: 0.1, width: "half" },
      { id: "term", label: "New Loan Term", type: "number", unit: "years", defaultValue: 4, width: "half" },
    ],
    compute: (v) => {
      const months = num(v.term) * 12;
      const currentPayment = monthlyPayment(num(v.totalDebt), num(v.currentAvgRate), months);
      const newPayment = monthlyPayment(num(v.totalDebt), num(v.newRate), months);
      return {
        items: [
          { label: "New Monthly Payment", value: formatCurrency(newPayment), emphasis: true },
          { label: "Current-Style Payment", value: formatCurrency(currentPayment) },
          { label: "Monthly Savings", value: formatCurrency(currentPayment - newPayment) },
        ],
        chart: {
          type: "bar",
          labels: ["Current-Style Payment", "New Monthly Payment"],
          series: [{ name: "Monthly Payment", data: [Math.round(currentPayment), Math.round(newPayment)], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Is debt consolidation always a good idea?", a: "It helps most when the new rate is meaningfully lower than your current average rate — otherwise you may just be stretching payments over a longer term without real savings. Watch for origination fees on the new loan too." }],
  },
  {
    slug: "credit-card-payoff",
    title: "Credit Card Payoff Calculator",
    category: "financial",
    description: "Find out how long it will take to pay off your credit card balance.",
    keywords: ["credit card payoff calculator"],
    presets: [
      { label: "Small balance, steady payment", values: { balance: 2500, apr: 22.99, payment: 150 } },
      { label: "Larger balance, high APR", values: { balance: 8000, apr: 26.99, payment: 300 } },
    ],
    fields: [
      { id: "balance", label: "Credit Card Balance", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "apr", label: "APR", type: "number", unit: "%", defaultValue: 24.99, step: 0.01, width: "half" },
      { id: "payment", label: "Monthly Payment", type: "number", unit: "$", defaultValue: 200, width: "half" },
    ],
    compute: (v) => {
      const r = num(v.apr) / 100 / 12;
      const minPayment = num(v.balance) * r;
      if (num(v.payment) <= minPayment) {
        return { items: [], error: "Payment is too low to ever pay off this balance — increase it above the monthly interest charge." };
      }
      const months = Math.log(num(v.payment) / (num(v.payment) - num(v.balance) * r)) / Math.log(1 + r);
      const totalPaid = num(v.payment) * months;
      const capYears = Math.max(1, Math.min(Math.ceil(months / 12), 40));
      let bal = num(v.balance);
      const balances: number[] = [];
      for (let y = 1; y <= capYears; y++) {
        for (let m = 0; m < 12; m++) {
          if (bal <= 0.01) break;
          const interest = bal * r;
          let principalPaid = num(v.payment) - interest;
          if (principalPaid > bal) principalPaid = bal;
          bal -= principalPaid;
        }
        balances.push(Math.round(Math.max(bal, 0)));
      }
      return {
        items: [
          { label: "Time to Pay Off", value: formatDuration(months), emphasis: true },
          { label: "Total Interest", value: formatCurrency(totalPaid - num(v.balance)) },
        ],
        chart: {
          type: "line",
          labels: balances.map((_, i) => `Yr ${i + 1}`),
          series: [{ name: "Remaining Balance", data: balances, color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does paying only the minimum take so long?", a: "Credit card minimum payments are often just 1-3% of the balance, barely above the interest accruing — increasing your payment even modestly can cut years off the payoff time and save substantial interest." }],
  },
  {
    slug: "credit-card-interest",
    title: "Credit Card Interest Calculator",
    category: "financial",
    description: "Estimate the monthly interest charge on a credit card balance.",
    keywords: ["credit card interest calculator"],
    fields: [
      { id: "balance", label: "Average Daily Balance", type: "number", unit: "$", defaultValue: 3000, width: "half" },
      { id: "apr", label: "APR", type: "number", unit: "%", defaultValue: 24.99, step: 0.01, width: "half" },
    ],
    compute: (v) => {
      const monthly = (num(v.balance) * num(v.apr)) / 100 / 12;
      return {
        items: [
          { label: "Estimated Monthly Interest", value: formatCurrency(monthly), emphasis: true },
          { label: "Estimated Annual Interest", value: formatCurrency(monthly * 12) },
        ],
        table: {
          headers: ["Balance", "Monthly Interest"],
          rows: [0.5, 1, 1.5, 2].map((mult) => [formatCurrency(num(v.balance) * mult), formatCurrency((num(v.balance) * mult * num(v.apr)) / 100 / 12)]),
        },
      };
    },
    faqs: [{ q: "What's \"average daily balance\"?", a: "Most card issuers calculate interest based on your balance averaged across each day of the billing cycle, not just your statement balance — carrying a lower balance for more of the cycle reduces the interest charged even if your end-of-month balance is the same." }],
  },
  {
    slug: "personal-loan",
    title: "Personal Loan Calculator",
    category: "financial",
    description: "Estimate the monthly payment on a personal loan.",
    keywords: ["personal loan calculator"],
    presets: [
      { label: "Good credit", values: { amount: 12000, rate: 8.5, term: 48, originationFee: 1 } },
      { label: "Fair credit", values: { amount: 12000, rate: 15, term: 48, originationFee: 5 } },
    ],
    fields: [
      { id: "amount", label: "Loan Amount", type: "number", unit: "$", defaultValue: 12000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 11, step: 0.01, width: "half" },
      { id: "term", label: "Term", type: "number", unit: "months", defaultValue: 48, width: "half" },
      { id: "originationFee", label: "Origination Fee", type: "number", unit: "%", defaultValue: 3, step: 0.1, width: "half", advanced: true },
    ],
    compute: (v) => {
      const payment = monthlyPayment(num(v.amount), num(v.rate), num(v.term));
      const fee = (num(v.amount) * num(v.originationFee)) / 100;
      return {
        items: [
          { label: "Monthly Payment", value: formatCurrency(payment), emphasis: true },
          { label: "Origination Fee", value: formatCurrency(fee) },
          { label: "Amount Received", value: formatCurrency(num(v.amount) - fee) },
          { label: "Total Interest", value: formatCurrency(payment * num(v.term) - num(v.amount)) },
        ],
        chart: {
          type: "donut",
          labels: ["Amount Received", "Origination Fee", "Total Interest"],
          series: [{ name: "Total Cost", data: [num(v.amount) - fee, fee, payment * num(v.term) - num(v.amount)] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Does the origination fee reduce how much I actually receive?", a: "Yes — most personal loan origination fees are deducted upfront from the loan proceeds, so you receive less than the full loan amount even though you're still required to repay the full amount plus interest." }],
  },
  {
    slug: "student-loan",
    title: "Student Loan Calculator",
    category: "financial",
    description: "Estimate your monthly student loan payment and total interest.",
    keywords: ["student loan calculator"],
    fields: [
      { id: "amount", label: "Loan Balance", type: "number", unit: "$", defaultValue: 30000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 5.5, step: 0.01, width: "half" },
      { id: "term", label: "Repayment Term", type: "number", unit: "years", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const months = num(v.term) * 12;
      const payment = monthlyPayment(num(v.amount), num(v.rate), months);
      return {
        items: [
          { label: "Monthly Payment", value: formatCurrency(payment), emphasis: true },
          { label: "Total Interest", value: formatCurrency(payment * months - num(v.amount)) },
          { label: "Total Paid", value: formatCurrency(payment * months) },
        ],
        chart: { type: "donut", labels: ["Principal", "Total Interest"], series: [{ name: "Total Paid", data: [num(v.amount), payment * months - num(v.amount)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Does this account for income-driven repayment plans?", a: "No — this calculates a standard fixed monthly payment. Income-driven plans (like SAVE or IBR) base payments on your income instead, which can result in a very different monthly amount and payoff timeline." }],
  },
  {
    slug: "student-loan-payoff",
    title: "Student Loan Payoff Calculator",
    category: "financial",
    description: "See how extra payments speed up your student loan payoff.",
    keywords: ["student loan payoff"],
    fields: [
      { id: "balance", label: "Current Balance", type: "number", unit: "$", defaultValue: 25000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 5.5, step: 0.01, width: "half" },
      { id: "payment", label: "Current Monthly Payment", type: "number", unit: "$", defaultValue: 270, width: "half" },
      { id: "extra", label: "Extra Payment", type: "number", unit: "$", defaultValue: 100, width: "half" },
    ],
    compute: (v) => {
      const r = num(v.rate) / 100 / 12;
      function months(pmt: number) {
        if (pmt <= num(v.balance) * r) return Infinity;
        return Math.log(pmt / (pmt - num(v.balance) * r)) / Math.log(1 + r);
      }
      const base = months(num(v.payment));
      const extra = months(num(v.payment) + num(v.extra));
      const capYears = Math.max(1, Math.min(isFinite(base) ? Math.ceil(base / 12) : 40, 40));
      function simulate(pmt: number) {
        let bal = num(v.balance);
        const balances: number[] = [];
        for (let y = 1; y <= capYears; y++) {
          for (let m = 0; m < 12; m++) {
            if (bal <= 0.01) break;
            const interest = bal * r;
            let principalPaid = Math.max(pmt - interest, 0);
            if (principalPaid > bal) principalPaid = bal;
            bal -= principalPaid;
          }
          balances.push(Math.round(Math.max(bal, 0)));
        }
        return balances;
      }
      const baseBalances = simulate(num(v.payment));
      const extraBalances = simulate(num(v.payment) + num(v.extra));
      return {
        items: [
          { label: "Time Saved", value: isFinite(base) && isFinite(extra) ? formatDuration(base - extra) : "—", emphasis: true },
          { label: "New Payoff Time", value: isFinite(extra) ? formatDuration(extra) : "—" },
        ],
        chart: {
          type: "line",
          labels: baseBalances.map((_, i) => `Yr ${i + 1}`),
          series: [
            { name: "Original Balance", data: baseBalances, color: "accent" },
            { name: "With Extra Payment", data: extraBalances, color: "primary" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Should I pay off student loans early or invest instead?", a: "It often comes down to comparing your loan's interest rate to expected investment returns — if your rate is high (well above typical long-term market returns), paying it down faster usually wins; at low rates, investing may come out ahead, though guaranteed debt payoff has less risk than markets." }],
  },
  {
    slug: "college-cost",
    title: "College Cost Calculator",
    category: "financial",
    description: "Project the future cost of college given today's cost and years until enrollment.",
    keywords: ["college cost calculator"],
    fields: [
      { id: "currentCost", label: "Current Annual Cost", type: "number", unit: "$", defaultValue: 28000, width: "half" },
      { id: "years", label: "Years Until Enrollment", type: "number", defaultValue: 10, width: "half" },
      { id: "inflation", label: "College Inflation Rate", type: "number", unit: "%", defaultValue: 5, step: 0.1, width: "half", advanced: true },
      { id: "duration", label: "Program Length", type: "number", unit: "years", defaultValue: 4, width: "half" },
    ],
    compute: (v) => {
      const futureAnnual = num(v.currentCost) * Math.pow(1 + num(v.inflation) / 100, num(v.years));
      const durationN = Math.max(1, Math.round(num(v.duration)));
      const yearlyCosts = Array.from({ length: durationN }, (_, i) => num(v.currentCost) * Math.pow(1 + num(v.inflation) / 100, num(v.years) + i));
      const total = yearlyCosts.reduce((s, c) => s + c, 0);
      return {
        items: [
          { label: "Total Cost (all years)", value: formatCurrency(total), emphasis: true },
          { label: "Cost in First Year", value: formatCurrency(futureAnnual) },
        ],
        chart: {
          type: "bar",
          labels: yearlyCosts.map((_, i) => `Year ${i + 1}`),
          series: [{ name: "Annual Cost", data: yearlyCosts.map((c) => Math.round(c)), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why has college inflation historically run higher than general inflation?", a: "Tuition costs have historically risen faster than the overall Consumer Price Index for decades, driven by factors like reduced state funding and expanded services — the default 5% rate reflects that faster-than-general-inflation trend, though it can vary a lot by school and year." }],
  },
  {
    slug: "income-tax",
    title: "Income Tax Estimator",
    shortTitle: "Income Tax",
    category: "tax",
    description: "Estimate your US federal income tax using 2025 marginal tax brackets.",
    keywords: ["income tax calculator", "tax estimator"],
    fields: [
      { id: "income", label: "Taxable Income", type: "number", unit: "$", defaultValue: 75000, width: "half" },
      { id: "filingStatus", label: "Filing Status", type: "select", defaultValue: "single", options: [
        { value: "single", label: "Single" }, { value: "married", label: "Married Filing Jointly" },
      ], width: "half" },
    ],
    compute: (v) => {
      const income = num(v.income);
      const single = [
        [11600, 0.1], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37],
      ];
      const married = [
        [23200, 0.1], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37],
      ];
      const brackets = v.filingStatus === "married" ? married : single;
      let tax = 0, lower = 0, marginalRate = 0;
      const bracketRows: (string | number)[][] = [];
      for (const [upper, rate] of brackets) {
        if (income > lower) {
          const taxedInBracket = Math.min(income, upper as number) - lower;
          const taxFromBracket = taxedInBracket * (rate as number);
          tax += taxFromBracket;
          marginalRate = rate as number;
          bracketRows.push([
            `${formatCurrency(lower)} – ${upper === Infinity ? "∞" : formatCurrency(upper as number)}`,
            formatPercent((rate as number) * 100, 0),
            formatCurrency(taxedInBracket),
            formatCurrency(taxFromBracket),
          ]);
        }
        lower = upper as number;
        if (income <= upper) break;
      }
      const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
      return {
        items: [
          { label: "Estimated Federal Tax", value: formatCurrency(tax), emphasis: true },
          { label: "Effective Tax Rate", value: formatPercent(effectiveRate, 1) },
          { label: "Marginal Tax Rate", value: formatPercent(marginalRate * 100, 0) },
          { label: "After-Tax Income", value: formatCurrency(income - tax) },
        ],
        note: "Simplified estimate using 2025 IRS brackets; does not include deductions, credits or state tax.",
        table: {
          headers: ["Bracket", "Rate", "Taxed in Bracket", "Tax from Bracket"],
          rows: bracketRows,
        },
      };
    },
    faqs: [{ q: "Does this account for the standard deduction?", a: "No — this estimates tax on the taxable income you enter directly. If you're starting from gross income, subtract the standard deduction ($14,600 single / $29,200 married for 2024) or your itemized deductions first." }],
  },
  {
    slug: "salary",
    title: "Salary Calculator",
    category: "financial",
    description: "Convert between hourly, weekly, monthly and annual salary.",
    keywords: ["salary calculator", "hourly to salary"],
    fields: [
      { id: "hourlyRate", label: "Hourly Rate", type: "number", unit: "$", defaultValue: 28, width: "half" },
      { id: "hoursPerWeek", label: "Hours per Week", type: "number", defaultValue: 40, width: "half" },
    ],
    compute: (v) => {
      const weekly = num(v.hourlyRate) * num(v.hoursPerWeek);
      return {
        items: [
          { label: "Annual Salary", value: formatCurrency(weekly * 52), emphasis: true },
          { label: "Monthly", value: formatCurrency((weekly * 52) / 12) },
          { label: "Weekly", value: formatCurrency(weekly) },
          { label: "Daily (8hr)", value: formatCurrency(num(v.hourlyRate) * 8) },
        ],
        table: {
          headers: ["Hours/Week", "Annual Salary"],
          rows: [20, 30, 40, 50, 60].map((h) => [h, formatCurrency(num(v.hourlyRate) * h * 52)]),
        },
      };
    },
    faqs: [{ q: "Does this account for unpaid time off?", a: "This assumes you work every week of the year at the stated hours — if you have unpaid vacation or holidays, your actual annual earnings will be somewhat lower than the figure shown." }],
  },
  {
    slug: "take-home-paycheck",
    title: "Take-Home Paycheck Calculator",
    shortTitle: "Take-Home Pay",
    category: "financial",
    description: "Estimate your net paycheck after federal tax, FICA and pre-tax deductions.",
    keywords: ["paycheck calculator", "take home pay"],
    presets: [
      { label: "Entry-level salary", values: { grossAnnual: 48000, payFrequency: "24", preTaxDeductions: 2000 } },
      { label: "Median salary", values: { grossAnnual: 70000, payFrequency: "24", preTaxDeductions: 3000 } },
      { label: "Six figures", values: { grossAnnual: 120000, payFrequency: "24", preTaxDeductions: 5000 } },
    ],
    fields: [
      { id: "grossAnnual", label: "Gross Annual Salary", type: "number", unit: "$", defaultValue: 70000, width: "half" },
      { id: "payFrequency", label: "Pay Frequency", type: "select", defaultValue: "24", options: [
        { value: "52", label: "Weekly" }, { value: "26", label: "Bi-Weekly" }, { value: "24", label: "Semi-Monthly" }, { value: "12", label: "Monthly" },
      ], width: "half" },
      { id: "preTaxDeductions", label: "Pre-Tax Deductions", type: "number", unit: "$/yr", defaultValue: 3000, width: "half" },
    ],
    compute: (v) => {
      const taxable = Math.max(num(v.grossAnnual) - num(v.preTaxDeductions), 0);
      const brackets: [number, number][] = [[11600, 0.1], [47150, 0.12], [100525, 0.22], [191950, 0.24], [Infinity, 0.32]];
      let tax = 0, lower = 0;
      for (const [upper, rate] of brackets) {
        if (taxable > lower) tax += (Math.min(taxable, upper) - lower) * rate;
        lower = upper;
        if (taxable <= upper) break;
      }
      const fica = num(v.grossAnnual) * 0.0765;
      const net = num(v.grossAnnual) - tax - fica - num(v.preTaxDeductions);
      const perCheck = net / num(v.payFrequency);
      return {
        items: [
          { label: "Take-Home Pay per Check", value: formatCurrency(perCheck), emphasis: true },
          { label: "Annual Net Pay", value: formatCurrency(net) },
          { label: "Est. Federal Tax", value: formatCurrency(tax) },
          { label: "FICA (Social Security + Medicare)", value: formatCurrency(fica) },
        ],
        note: "Simplified estimate — excludes state tax, filing status nuances, and credits.",
        chart: {
          type: "donut",
          labels: ["Net Pay", "Federal Tax", "FICA", "Pre-Tax Deductions"],
          series: [{ name: "Gross Salary", data: [net, tax, fica, num(v.preTaxDeductions)] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why is FICA a flat 7.65%?", a: "That's the combined employee share of Social Security (6.2%) and Medicare (1.45%) for W-2 employees — your employer pays a matching amount separately, which isn't reflected in your paycheck deduction." }],
  },
  {
    slug: "hourly-to-salary",
    title: "Hourly to Salary Calculator",
    category: "financial",
    description: "Convert an hourly wage into equivalent annual salary.",
    keywords: ["hourly to salary calculator"],
    fields: [
      { id: "hourlyRate", label: "Hourly Rate", type: "number", unit: "$", defaultValue: 25, width: "half" },
      { id: "hoursPerWeek", label: "Hours per Week", type: "number", defaultValue: 40, width: "half" },
      { id: "weeksPerYear", label: "Weeks Worked per Year", type: "number", defaultValue: 50, width: "half", advanced: true },
    ],
    compute: (v) => ({
      items: [
        { label: "Annual Salary", value: formatCurrency(num(v.hourlyRate) * num(v.hoursPerWeek) * num(v.weeksPerYear)), emphasis: true },
      ],
      table: {
        headers: ["Weeks Worked/Year", "Annual Salary"],
        rows: [48, 50, 52].map((w) => [w, formatCurrency(num(v.hourlyRate) * num(v.hoursPerWeek) * w)]),
      },
    }),
    faqs: [{ q: "Why 50 weeks instead of 52?", a: "The default assumes 2 weeks of unpaid time off — a common baseline for hourly workers without paid vacation. Adjust to 52 if you work every week of the year without exception." }],
  },
  {
    slug: "self-employment-tax",
    title: "Self-Employment Tax Calculator",
    category: "tax",
    description: "Estimate self-employment tax (Social Security + Medicare) on your net earnings.",
    keywords: ["self employment tax calculator"],
    fields: [{ id: "netEarnings", label: "Net Self-Employment Earnings", type: "number", unit: "$", defaultValue: 60000, width: "full" }],
    compute: (v) => {
      const taxable = num(v.netEarnings) * 0.9235;
      const tax = taxable * 0.153;
      return {
        items: [
          { label: "Self-Employment Tax", value: formatCurrency(tax), emphasis: true },
          { label: "Taxable Earnings (92.35%)", value: formatCurrency(taxable) },
          { label: "Deductible Half (for income tax)", value: formatCurrency(tax / 2) },
        ],
        chart: { type: "donut", labels: ["Net After SE Tax", "SE Tax"], series: [{ name: "Net Earnings", data: [num(v.netEarnings) - tax, tax] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Why is only 92.35% of my earnings taxed?", a: "This factor accounts for the fact that a W-2 employee's employer-paid FICA share isn't itself subject to FICA — the 92.35% adjustment approximates that same treatment for self-employed people, and half of the resulting SE tax is deductible on your income tax return." }],
  },
  {
    slug: "sales-tax",
    title: "Sales Tax Calculator",
    category: "tax",
    popular: true,
    description: "Calculate sales tax and total price for a purchase.",
    keywords: ["sales tax calculator"],
    presets: [
      { label: "No sales tax state", values: { price: 100, rate: 0 } },
      { label: "Average US rate", values: { price: 100, rate: 7.25 } },
      { label: "High-tax city (e.g. NYC)", values: { price: 100, rate: 8.875 } },
    ],
    fields: [
      { id: "price", label: "Price Before Tax", type: "number", unit: "$", defaultValue: 100, width: "half" },
      { id: "rate", label: "Sales Tax Rate", type: "number", unit: "%", defaultValue: 7.25, step: 0.01, width: "half" },
    ],
    compute: (v) => {
      const tax = (num(v.price) * num(v.rate)) / 100;
      return {
        items: [
          { label: "Total Price", value: formatCurrency(num(v.price) + tax), emphasis: true },
          { label: "Sales Tax", value: formatCurrency(tax) },
        ],
        chart: { type: "donut", labels: ["Price Before Tax", "Sales Tax"], series: [{ name: "Total Price", data: [num(v.price), tax] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Why does sales tax vary so much by location?", a: "Sales tax is set at the state level, and many states also allow county and city governments to add their own local sales tax on top, which is why the effective rate can vary widely even within the same state." }],
  },
  {
    slug: "vat",
    title: "VAT Calculator",
    category: "tax",
    description: "Add or remove VAT from a price.",
    keywords: ["vat calculator", "value added tax"],
    fields: [
      { id: "amount", label: "Amount", type: "number", unit: "$", defaultValue: 100, width: "half" },
      { id: "rate", label: "VAT Rate", type: "number", unit: "%", defaultValue: 20, step: 0.1, width: "half" },
      { id: "direction", label: "Direction", type: "radio", defaultValue: "add", options: [
        { value: "add", label: "Add VAT (net → gross)" }, { value: "remove", label: "Remove VAT (gross → net)" },
      ], width: "full" },
    ],
    compute: (v) => {
      const amount = num(v.amount), rate = num(v.rate);
      if (v.direction === "remove") {
        const net = amount / (1 + rate / 100);
        return {
          items: [{ label: "Net Amount", value: formatCurrency(net), emphasis: true }, { label: "VAT", value: formatCurrency(amount - net) }],
          chart: { type: "donut", labels: ["Net Amount", "VAT"], series: [{ name: "Gross Amount", data: [net, amount - net] }], valuePrefix: "$" },
        };
      }
      const vat = (amount * rate) / 100;
      return {
        items: [{ label: "Gross Amount", value: formatCurrency(amount + vat), emphasis: true }, { label: "VAT", value: formatCurrency(vat) }],
        chart: { type: "donut", labels: ["Net Amount", "VAT"], series: [{ name: "Gross Amount", data: [amount, vat] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "What's the difference between adding and removing VAT?", a: "\"Add VAT\" starts from a net (pre-tax) price and calculates the VAT-inclusive gross price. \"Remove VAT\" does the reverse — starting from a gross price that already includes VAT and backing out the net amount and the VAT portion." }],
  },
  {
    slug: "property-tax",
    title: "Property Tax Calculator",
    category: "tax",
    description: "Estimate your annual and monthly property tax bill.",
    keywords: ["property tax calculator"],
    fields: [
      { id: "assessedValue", label: "Assessed Home Value", type: "number", unit: "$", defaultValue: 350000, width: "half" },
      { id: "rate", label: "Tax Rate", type: "number", unit: "%", defaultValue: 1.1, step: 0.01, width: "half" },
    ],
    compute: (v) => {
      const annual = (num(v.assessedValue) * num(v.rate)) / 100;
      return {
        items: [
          { label: "Annual Property Tax", value: formatCurrency(annual), emphasis: true },
          { label: "Monthly Equivalent", value: formatCurrency(annual / 12) },
        ],
        table: {
          headers: ["Tax Rate", "Annual Property Tax"],
          rows: [-0.3, -0.15, 0, 0.15, 0.3].map((delta) => [`${formatNumber(num(v.rate) + delta, 2)}%`, formatCurrency((num(v.assessedValue) * (num(v.rate) + delta)) / 100)]),
        },
      };
    },
    faqs: [{ q: "Is assessed value the same as market value?", a: "Not always — many jurisdictions assess property below full market value, or reassess only periodically, so your assessed value (found on your tax bill) can lag behind what the home would actually sell for." }],
  },
  {
    slug: "tax-bracket",
    title: "Marginal Tax Bracket Calculator",
    shortTitle: "Tax Bracket",
    category: "tax",
    description: "Find your 2025 US federal marginal tax bracket.",
    keywords: ["tax bracket calculator"],
    fields: [
      { id: "income", label: "Taxable Income", type: "number", unit: "$", defaultValue: 90000, width: "half" },
      { id: "filingStatus", label: "Filing Status", type: "select", defaultValue: "single", options: [
        { value: "single", label: "Single" }, { value: "married", label: "Married Filing Jointly" },
      ], width: "half" },
    ],
    compute: (v) => {
      const single = [11600, 47150, 100525, 191950, 243725, 609350];
      const married = [23200, 94300, 201050, 383900, 487450, 731200];
      const rates = [10, 12, 22, 24, 32, 35, 37];
      const thresholds = v.filingStatus === "married" ? married : single;
      const income = num(v.income);
      let bracketIndex = thresholds.findIndex((t) => income <= t);
      if (bracketIndex === -1) bracketIndex = rates.length - 1;
      let lower = 0;
      const rows = rates.map((rate, i) => {
        const upper = thresholds[i] ?? Infinity;
        const row = [`${formatCurrency(lower)} – ${upper === Infinity ? "∞" : formatCurrency(upper)}`, `${rate}%`];
        lower = upper;
        return row;
      });
      return {
        items: [{ label: "Marginal Tax Bracket", value: `${rates[bracketIndex]}%`, emphasis: true }],
        table: { headers: ["Income Range", "Rate"], rows },
      };
    },
    faqs: [{ q: "Does being in a higher bracket mean all my income is taxed at that rate?", a: "No — only the portion of income within that top bracket is taxed at that rate. Income in lower brackets is still taxed at their respective (lower) rates, which is why your effective rate is always below your marginal bracket." }],
  },
  {
    slug: "rental-property",
    title: "Rental Property ROI Calculator",
    shortTitle: "Rental ROI",
    category: "financial",
    description: "Calculate cap rate and cash-on-cash return for a rental property investment.",
    keywords: ["rental property calculator", "cap rate", "cash on cash return"],
    presets: [
      { label: "Modest cash flow", values: { purchasePrice: 250000, downPayment: 50000, monthlyRent: 2200, monthlyExpenses: 500, mortgagePayment: 1100 } },
      { label: "High leverage", values: { purchasePrice: 300000, downPayment: 30000, monthlyRent: 2400, monthlyExpenses: 600, mortgagePayment: 1600 } },
    ],
    fields: [
      { id: "purchasePrice", label: "Purchase Price", type: "number", unit: "$", defaultValue: 250000, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 50000, width: "half" },
      { id: "monthlyRent", label: "Monthly Rent", type: "number", unit: "$", defaultValue: 2200, width: "half" },
      { id: "monthlyExpenses", label: "Monthly Expenses (excl. mortgage)", type: "number", unit: "$", defaultValue: 500, width: "half" },
      { id: "mortgagePayment", label: "Monthly Mortgage Payment", type: "number", unit: "$", defaultValue: 1100, width: "half" },
    ],
    compute: (v) => {
      const annualNOI = (num(v.monthlyRent) - num(v.monthlyExpenses)) * 12;
      const capRate = (annualNOI / num(v.purchasePrice)) * 100;
      const annualCashFlow = annualNOI - num(v.mortgagePayment) * 12;
      const cashOnCash = (annualCashFlow / num(v.downPayment)) * 100;
      const monthlyCashFlow = annualCashFlow / 12;
      return {
        items: [
          { label: "Cash-on-Cash Return", value: formatPercent(cashOnCash, 2), emphasis: true },
          { label: "Cap Rate", value: formatPercent(capRate, 2) },
          { label: "Annual Cash Flow", value: formatCurrency(annualCashFlow) },
          { label: "Net Operating Income", value: formatCurrency(annualNOI) },
        ],
        chart: {
          type: "donut",
          labels: ["Mortgage Payment", "Other Expenses", "Cash Flow"],
          series: [{ name: "Monthly Rent Breakdown", data: [num(v.mortgagePayment), num(v.monthlyExpenses), Math.max(monthlyCashFlow, 0)] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What's the difference between cap rate and cash-on-cash return?", a: "Cap rate measures the property's return as if bought with all cash, based on NOI relative to purchase price — useful for comparing properties. Cash-on-cash return factors in your actual down payment and mortgage, showing the return specifically on the cash you invested." }],
  },
  {
    slug: "break-even",
    title: "Break-Even Point Calculator",
    shortTitle: "Break-Even Point",
    category: "financial",
    description: "Calculate how many units you need to sell to break even.",
    keywords: ["break even calculator"],
    fields: [
      { id: "fixedCosts", label: "Fixed Costs", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "pricePerUnit", label: "Price per Unit", type: "number", unit: "$", defaultValue: 40, width: "half" },
      { id: "costPerUnit", label: "Variable Cost per Unit", type: "number", unit: "$", defaultValue: 15, width: "half" },
    ],
    compute: (v) => {
      const margin = num(v.pricePerUnit) - num(v.costPerUnit);
      const units = margin > 0 ? num(v.fixedCosts) / margin : Infinity;
      return {
        items: [
          { label: "Break-Even Units", value: isFinite(units) ? formatNumber(Math.ceil(units), 0) : "—", emphasis: true },
          { label: "Break-Even Revenue", value: isFinite(units) ? formatCurrency(units * num(v.pricePerUnit)) : "—" },
        ],
        ...(isFinite(units) ? { chart: { type: "bar" as const, labels: ["Fixed Costs", "Break-Even Revenue"], series: [{ name: "Amount", data: [num(v.fixedCosts), units * num(v.pricePerUnit)], color: "primary" as const }], valuePrefix: "$" } } : {}),
      };
    },
    faqs: [{ q: "Why does it show \"—\" sometimes?", a: "If your variable cost per unit is equal to or greater than your price per unit, you lose money on every sale regardless of volume — there's no break-even point to reach, so the calculator flags this instead of showing an infinite number." }],
  },
  {
    slug: "margin",
    title: "Profit Margin Calculator",
    shortTitle: "Profit Margin",
    category: "financial",
    description: "Calculate gross profit margin from cost and revenue.",
    keywords: ["profit margin calculator"],
    fields: [
      { id: "revenue", label: "Revenue", type: "number", unit: "$", defaultValue: 150, width: "half" },
      { id: "cost", label: "Cost", type: "number", unit: "$", defaultValue: 90, width: "half" },
    ],
    compute: (v) => {
      const profit = num(v.revenue) - num(v.cost);
      const margin = num(v.revenue) > 0 ? (profit / num(v.revenue)) * 100 : 0;
      return {
        items: [
          { label: "Profit Margin", value: formatPercent(margin, 2), emphasis: true },
          { label: "Profit", value: formatCurrency(profit) },
        ],
        chart: { type: "donut", labels: ["Cost", "Profit"], series: [{ name: "Revenue", data: [num(v.cost), Math.max(profit, 0)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "How is profit margin different from markup?", a: "Margin is profit as a percentage of the selling price (revenue). Markup is profit as a percentage of the cost. The same dollar profit produces a lower margin percentage than markup percentage — see the Markup Calculator to convert between them." }],
  },
  {
    slug: "markup",
    title: "Markup Calculator",
    category: "financial",
    description: "Calculate the selling price from cost and desired markup percentage.",
    keywords: ["markup calculator"],
    fields: [
      { id: "cost", label: "Cost", type: "number", unit: "$", defaultValue: 90, width: "half" },
      { id: "markup", label: "Markup", type: "number", unit: "%", defaultValue: 40, width: "half" },
    ],
    compute: (v) => {
      const price = num(v.cost) * (1 + num(v.markup) / 100);
      return {
        items: [
          { label: "Selling Price", value: formatCurrency(price), emphasis: true },
          { label: "Profit", value: formatCurrency(price - num(v.cost)) },
        ],
        chart: { type: "donut", labels: ["Cost", "Profit"], series: [{ name: "Selling Price", data: [num(v.cost), price - num(v.cost)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Is a 40% markup the same as a 40% profit margin?", a: "No — a 40% markup on a $90 cost gives a $126 price, which is actually a 28.6% profit margin, not 40%. Markup and margin are calculated on different bases (cost vs. price), so they're never equal except at 0%." }],
  },
  {
    slug: "commission",
    title: "Commission Calculator",
    category: "financial",
    description: "Calculate commission earned on a sale.",
    keywords: ["commission calculator"],
    fields: [
      { id: "saleAmount", label: "Sale Amount", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "rate", label: "Commission Rate", type: "number", unit: "%", defaultValue: 6, step: 0.1, width: "half" },
    ],
    compute: (v) => ({
      items: [{ label: "Commission Earned", value: formatCurrency((num(v.saleAmount) * num(v.rate)) / 100), emphasis: true }],
      table: {
        headers: ["Commission Rate", "Commission Earned"],
        rows: [3, 5, 6, 8, 10].map((r) => [`${r}%`, formatCurrency((num(v.saleAmount) * r) / 100)]),
      },
    }),
    faqs: [{ q: "Does this account for tiered commission structures?", a: "No — this applies a single flat rate to the full sale amount. If your commission structure has different rates for different sale tiers, calculate each tier separately and add the results together." }],
  },
  {
    slug: "inflation",
    title: "Inflation Calculator",
    category: "financial",
    description: "Calculate how inflation affects the purchasing power of money over time.",
    keywords: ["inflation calculator"],
    fields: [
      { id: "amount", label: "Amount", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "rate", label: "Annual Inflation Rate", type: "number", unit: "%", defaultValue: 3, step: 0.1, width: "half" },
      { id: "years", label: "Years", type: "number", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const future = num(v.amount) * Math.pow(1 + num(v.rate) / 100, num(v.years));
      const purchasingPower = num(v.amount) / Math.pow(1 + num(v.rate) / 100, num(v.years));
      const yearsN = Math.max(1, Math.round(num(v.years)));
      return {
        items: [
          { label: "Equivalent Future Amount", value: formatCurrency(future), emphasis: true },
          { label: "Today's Purchasing Power (in future)", value: formatCurrency(purchasingPower) },
        ],
        chart: {
          type: "line",
          labels: Array.from({ length: yearsN + 1 }, (_, i) => `Yr ${i}`),
          series: [{ name: "Purchasing Power", data: Array.from({ length: yearsN + 1 }, (_, i) => Math.round(num(v.amount) / Math.pow(1 + num(v.rate) / 100, i))), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What's a typical inflation rate to assume?", a: "The US Federal Reserve targets about 2% annual inflation long-term, though actual rates have varied significantly — 3% is a reasonable middle-ground planning assumption that accounts for periods running above target." }],
  },
  {
    slug: "bond-yield",
    title: "Bond Yield Calculator",
    category: "financial",
    description: "Calculate the current yield of a bond from its coupon and market price.",
    keywords: ["bond yield calculator", "current yield"],
    fields: [
      { id: "faceValue", label: "Face Value", type: "number", unit: "$", defaultValue: 1000, width: "half" },
      { id: "couponRate", label: "Annual Coupon Rate", type: "number", unit: "%", defaultValue: 5, step: 0.01, width: "half" },
      { id: "marketPrice", label: "Current Market Price", type: "number", unit: "$", defaultValue: 950, width: "half" },
    ],
    compute: (v) => {
      const annualCoupon = (num(v.faceValue) * num(v.couponRate)) / 100;
      const currentYield = (annualCoupon / num(v.marketPrice)) * 100;
      return {
        items: [
          { label: "Current Yield", value: formatPercent(currentYield, 2), emphasis: true },
          { label: "Annual Coupon Payment", value: formatCurrency(annualCoupon) },
        ],
        chart: { type: "bar", labels: ["Coupon Rate", "Current Yield"], series: [{ name: "Rate", data: [num(v.couponRate), currentYield], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why is current yield different from the coupon rate?", a: "Coupon rate is fixed at issuance based on face value, but bonds trade above or below face value in the market — current yield reflects the coupon payment relative to what you'd actually pay today, which is why it diverges from the coupon rate when the market price isn't exactly the face value." }],
  },
  {
    slug: "estate-tax",
    title: "Estate Tax Estimator",
    shortTitle: "Estate Tax",
    category: "tax",
    description: "Rough estimate of US federal estate tax exposure above the lifetime exemption.",
    keywords: ["estate tax calculator"],
    fields: [
      { id: "estateValue", label: "Gross Estate Value", type: "number", unit: "$", defaultValue: 8000000, width: "half" },
      { id: "exemption", label: "Lifetime Exemption", type: "number", unit: "$", defaultValue: 13990000, width: "half", advanced: true },
    ],
    compute: (v) => {
      const taxable = Math.max(num(v.estateValue) - num(v.exemption), 0);
      const tax = taxable * 0.4;
      return {
        items: [
          { label: "Estimated Estate Tax", value: formatCurrency(tax), emphasis: true },
          { label: "Taxable Estate", value: formatCurrency(taxable) },
        ],
        note: "Simplified flat 40% top-rate estimate above the exemption; actual tax uses a graduated schedule.",
        chart: { type: "donut", labels: ["Covered by Exemption", "Taxable Estate"], series: [{ name: "Gross Estate", data: [Math.min(num(v.estateValue), num(v.exemption)), taxable] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Does the federal exemption mean most estates owe nothing?", a: "Yes — the federal lifetime exemption is very high (well into eight figures per person), so the vast majority of estates owe no federal estate tax. Some states have their own separate, often much lower, estate or inheritance tax thresholds to check as well." }],
  },
  {
    slug: "heloc",
    title: "HELOC Payment Calculator",
    shortTitle: "HELOC Calculator",
    category: "financial",
    description: "Estimate interest-only and fully-amortizing payments on a home equity line of credit.",
    keywords: ["heloc calculator", "home equity line of credit"],
    fields: [
      { id: "balance", label: "HELOC Balance", type: "number", unit: "$", defaultValue: 40000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 9, step: 0.01, width: "half" },
      { id: "repayTerm", label: "Repayment Term", type: "number", unit: "years", defaultValue: 15, width: "half" },
    ],
    compute: (v) => {
      const balance = num(v.balance), rate = num(v.rate);
      const interestOnly = (balance * rate) / 100 / 12;
      const amortizing = monthlyPayment(balance, rate, num(v.repayTerm) * 12);
      return {
        items: [
          { label: "Interest-Only Payment", value: formatCurrency(interestOnly), emphasis: true },
          { label: "Fully-Amortizing Payment", value: formatCurrency(amortizing) },
        ],
        chart: {
          type: "bar",
          labels: ["Interest-Only", "Fully-Amortizing"],
          series: [{ name: "Monthly Payment", data: [Math.round(interestOnly), Math.round(amortizing)], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What's the difference between the draw period and repayment period?", a: "Most HELOCs have an initial draw period (often 10 years) where you can borrow and typically pay interest-only, followed by a repayment period where the balance must be fully amortized — this calculator shows both payment types so you can see the jump between them." }],
  },
  {
    slug: "car-affordability",
    title: "Car Affordability Calculator",
    category: "financial",
    description: "Estimate the car price you can afford based on your budget and loan terms.",
    keywords: ["car affordability calculator", "how much car can i afford"],
    fields: [
      { id: "monthlyBudget", label: "Monthly Payment Budget", type: "number", unit: "$", defaultValue: 450, width: "half" },
      { id: "downPayment", label: "Down Payment", type: "number", unit: "$", defaultValue: 3000, width: "half" },
      { id: "rate", label: "Interest Rate", type: "number", unit: "%", defaultValue: 7, step: 0.01, width: "half" },
      { id: "term", label: "Loan Term", type: "number", unit: "months", defaultValue: 60, width: "half" },
    ],
    compute: (v) => {
      const r = num(v.rate) / 100 / 12;
      const months = num(v.term);
      const maxLoan = r === 0 ? num(v.monthlyBudget) * months : (num(v.monthlyBudget) * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
      return {
        items: [
          { label: "Estimated Car Price You Can Afford", value: formatCurrency(maxLoan + num(v.downPayment)), emphasis: true },
          { label: "Max Loan Amount", value: formatCurrency(maxLoan) },
        ],
        chart: { type: "donut", labels: ["Max Loan Amount", "Down Payment"], series: [{ name: "Car Price", data: [maxLoan, num(v.downPayment)] }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Should my monthly budget include insurance and maintenance?", a: "This calculator estimates the car price your loan payment budget supports — it's wise to separately budget for insurance, fuel, and maintenance on top of the loan payment so your total transportation cost stays affordable." }],
  },
  {
    slug: "lease-vs-buy-car",
    title: "Lease vs Buy Car Calculator",
    category: "financial",
    description: "Compare the total cost of leasing versus buying a car over the same period.",
    keywords: ["lease vs buy calculator", "car lease vs buy"],
    fields: [
      { id: "leasePayment", label: "Monthly Lease Payment", type: "number", unit: "$", defaultValue: 400, width: "half" },
      { id: "buyPayment", label: "Monthly Loan Payment", type: "number", unit: "$", defaultValue: 550, width: "half" },
      { id: "years", label: "Time Period", type: "number", unit: "years", defaultValue: 3, width: "half" },
      { id: "resaleValue", label: "Estimated Resale Value (if buying)", type: "number", unit: "$", defaultValue: 14000, width: "half", advanced: true },
    ],
    compute: (v) => {
      const leaseCost = num(v.leasePayment) * 12 * num(v.years);
      const buyCost = num(v.buyPayment) * 12 * num(v.years) - num(v.resaleValue);
      return {
        items: [
          { label: "Total Lease Cost", value: formatCurrency(leaseCost), emphasis: true },
          { label: "Net Buy Cost", value: formatCurrency(buyCost), emphasis: true },
        ],
        note: buyCost < leaseCost ? "Buying looks cheaper net of resale value." : "Leasing looks cheaper over this period.",
        chart: {
          type: "bar",
          labels: ["Total Lease Cost", "Net Buy Cost"],
          series: [{ name: `Cost Over ${num(v.years)} Years`, data: [Math.round(leaseCost), Math.round(buyCost)], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Does this account for owning the car after the loan is paid off?", a: "It compares costs only over the time period you specify — if you'd keep driving the car mortgage-free after that period, buying's true value is understated here since ownership continues to pay off with no more payments." }],
  },
  {
    slug: "529-plan",
    title: "529 College Savings Plan Calculator",
    shortTitle: "529 Plan Calculator",
    category: "financial",
    description: "Project the growth of a 529 college savings plan with regular contributions.",
    keywords: ["529 plan calculator", "college savings calculator"],
    fields: [
      { id: "currentBalance", label: "Current Balance", type: "number", unit: "$", defaultValue: 5000, width: "half" },
      { id: "monthly", label: "Monthly Contribution", type: "number", unit: "$", defaultValue: 250, width: "half" },
      { id: "rate", label: "Expected Return", type: "number", unit: "%", defaultValue: 6, step: 0.1, width: "half" },
      { id: "years", label: "Years Until College", type: "number", defaultValue: 15, width: "half" },
    ],
    compute: (v) => {
      const { futureValue, totalContributions, totalInterest } = futureValueSeries(num(v.currentBalance), num(v.monthly), num(v.rate), num(v.years));
      const growth = yearlyGrowthSeries(num(v.currentBalance), num(v.monthly), num(v.rate), num(v.years));
      return {
        items: [
          { label: "Projected Balance at College", value: formatCurrency(futureValue), emphasis: true },
          { label: "Total Contributions", value: formatCurrency(totalContributions) },
          { label: "Total Growth", value: formatCurrency(totalInterest) },
        ],
        chart: {
          type: "line",
          labels: growth.years.map((y) => `Yr ${y}`),
          series: [
            { name: "Balance", data: growth.balances, color: "primary" },
            { name: "Contributions", data: growth.contributions, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Are 529 plan withdrawals tax-free?", a: "Yes, for qualified education expenses (tuition, fees, room and board, books) — earnings grow tax-deferred and come out tax-free when used for qualifying costs, similar to how a Roth IRA works for retirement." }],
  },
  {
    slug: "fire-number",
    title: "FIRE Number Calculator",
    category: "financial",
    description: "Calculate your Financial Independence, Retire Early (FIRE) number using the 4% rule.",
    keywords: ["fire calculator", "financial independence calculator"],
    fields: [
      { id: "annualExpenses", label: "Annual Expenses", type: "number", unit: "$", defaultValue: 50000, width: "half" },
      { id: "withdrawalRate", label: "Withdrawal Rate", type: "number", unit: "%", defaultValue: 4, step: 0.1, width: "half", advanced: true },
      { id: "currentSavings", label: "Current Investments", type: "number", unit: "$", defaultValue: 100000, width: "half" },
      { id: "monthlyInvestment", label: "Monthly Investment", type: "number", unit: "$", defaultValue: 2000, width: "half" },
      { id: "rate", label: "Expected Return", type: "number", unit: "%", defaultValue: 7, step: 0.1, width: "half" },
    ],
    compute: (v) => {
      const fireNumber = (num(v.annualExpenses) / num(v.withdrawalRate)) * 100;
      let balance = num(v.currentSavings);
      let months = 0;
      const monthlyRate = num(v.rate) / 100 / 12;
      while (balance < fireNumber && months < 1200) {
        balance = balance * (1 + monthlyRate) + num(v.monthlyInvestment);
        months++;
      }
      const chartYears = Math.max(1, Math.min(Math.ceil(months / 12) || 1, 40));
      const yearlyBalances: number[] = [];
      let simBalance = num(v.currentSavings);
      for (let y = 1; y <= chartYears; y++) {
        for (let m = 0; m < 12; m++) {
          simBalance = simBalance * (1 + monthlyRate) + num(v.monthlyInvestment);
        }
        yearlyBalances.push(Math.round(simBalance));
      }
      return {
        items: [
          { label: "FIRE Number", value: formatCurrency(fireNumber), emphasis: true },
          { label: "Years to FIRE", value: months < 1200 ? formatNumber(months / 12, 1) : "50+" },
        ],
        chart: {
          type: "line",
          labels: yearlyBalances.map((_, i) => `Yr ${i + 1}`),
          series: [
            { name: "Projected Balance", data: yearlyBalances, color: "primary" },
            { name: "FIRE Number", data: yearlyBalances.map(() => Math.round(fireNumber)), color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "What is the FIRE number based on?", a: "It's your annual expenses divided by your withdrawal rate — derived from the same \"safe withdrawal rate\" logic as traditional retirement planning (see the Retirement Calculator's FAQ), just applied to reach financial independence at any age rather than a fixed retirement age." }],
  },
  {
    slug: "payback-period",
    title: "Payback Period Calculator",
    category: "financial",
    description: "Calculate how long it takes to recover the cost of an investment from its cash flows.",
    keywords: ["payback period calculator"],
    fields: [
      { id: "initialCost", label: "Initial Investment", type: "number", unit: "$", defaultValue: 50000, width: "half" },
      { id: "annualCashFlow", label: "Annual Cash Flow", type: "number", unit: "$", defaultValue: 12000, width: "half" },
    ],
    compute: (v) => {
      const years = num(v.initialCost) / num(v.annualCashFlow);
      return {
        items: [{ label: "Payback Period", value: `${formatNumber(years, 2)} years`, emphasis: true }],
        chart: { type: "bar", labels: ["Initial Investment", "Annual Cash Flow"], series: [{ name: "Amount", data: [num(v.initialCost), num(v.annualCashFlow)], color: "primary" }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Does payback period account for the time value of money?", a: "No — this is a simple payback period, which just divides cost by annual cash flow. A \"discounted payback period\" would additionally weight future cash flows less than near-term ones, which this calculator doesn't do." }],
  },
  {
    slug: "dividend-yield",
    title: "Dividend Yield Calculator",
    category: "financial",
    description: "Calculate the dividend yield of a stock from its annual dividend and share price.",
    keywords: ["dividend yield calculator"],
    fields: [
      { id: "annualDividend", label: "Annual Dividend per Share", type: "number", unit: "$", defaultValue: 2.4, width: "half" },
      { id: "sharePrice", label: "Share Price", type: "number", unit: "$", defaultValue: 80, width: "half" },
    ],
    compute: (v) => ({
      items: [{ label: "Dividend Yield", value: formatPercent((num(v.annualDividend) / num(v.sharePrice)) * 100, 2), emphasis: true }],
      chart: { type: "bar", labels: ["S&P 500 Average (~1.5%)", "This Stock"], series: [{ name: "Dividend Yield %", data: [1.5, (num(v.annualDividend) / num(v.sharePrice)) * 100], color: "primary" }] },
    }),
    faqs: [{ q: "Is a higher dividend yield always better?", a: "Not necessarily — a very high yield can sometimes signal a falling share price (which mechanically raises yield) or an unsustainable payout that may get cut. Yield is one data point, not a complete picture of a stock's health." }],
  },
  {
    slug: "dividend-reinvestment",
    title: "Dividend Reinvestment Calculator",
    shortTitle: "DRIP Calculator",
    category: "financial",
    description: "Project portfolio growth when dividends are automatically reinvested.",
    keywords: ["drip calculator", "dividend reinvestment calculator"],
    fields: [
      { id: "initial", label: "Initial Investment", type: "number", unit: "$", defaultValue: 10000, width: "half" },
      { id: "yieldPercent", label: "Dividend Yield", type: "number", unit: "%", defaultValue: 3, step: 0.1, width: "half" },
      { id: "priceGrowth", label: "Annual Price Growth", type: "number", unit: "%", defaultValue: 6, step: 0.1, width: "half" },
      { id: "years", label: "Years", type: "number", defaultValue: 20, width: "half" },
    ],
    compute: (v) => {
      const totalReturn = num(v.yieldPercent) + num(v.priceGrowth);
      const fv = compoundInterest(num(v.initial), totalReturn, 1, num(v.years));
      const withoutReinvestment = compoundInterest(num(v.initial), num(v.priceGrowth), 1, num(v.years));
      const yearsN = Math.max(1, Math.round(num(v.years)));
      const withData: number[] = [];
      const withoutData: number[] = [];
      for (let y = 1; y <= yearsN; y++) {
        withData.push(Math.round(compoundInterest(num(v.initial), totalReturn, 1, y)));
        withoutData.push(Math.round(compoundInterest(num(v.initial), num(v.priceGrowth), 1, y)));
      }
      return {
        items: [
          { label: "Value With Reinvestment", value: formatCurrency(fv), emphasis: true },
          { label: "Value Without Reinvestment", value: formatCurrency(withoutReinvestment) },
        ],
        chart: {
          type: "line",
          labels: withData.map((_, i) => `Yr ${i + 1}`),
          series: [
            { name: "With Reinvestment", data: withData, color: "primary" },
            { name: "Without Reinvestment", data: withoutData, color: "accent" },
          ],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why does reinvesting dividends make such a big difference long-term?", a: "Reinvested dividends buy more shares, which then generate their own dividends — compounding on top of price growth. Historically, a large share of the S&P 500's total long-term return has come specifically from reinvested dividends rather than price appreciation alone." }],
  },
  {
    slug: "credit-utilization",
    title: "Credit Utilization Calculator",
    category: "financial",
    description: "Calculate your credit utilization ratio, a major factor in your credit score.",
    keywords: ["credit utilization calculator"],
    fields: [
      { id: "balance", label: "Total Credit Card Balances", type: "number", unit: "$", defaultValue: 2500, width: "half" },
      { id: "limit", label: "Total Credit Limits", type: "number", unit: "$", defaultValue: 10000, width: "half" },
    ],
    compute: (v) => {
      const util = (num(v.balance) / num(v.limit)) * 100;
      const rating = util <= 10 ? "Excellent" : util <= 30 ? "Good" : util <= 50 ? "Fair" : "Poor";
      return {
        items: [
          { label: "Credit Utilization", value: formatPercent(util, 1), emphasis: true },
          { label: "Rating", value: rating },
        ],
        note: "Experts generally recommend staying under 30%.",
        chart: { type: "bar", labels: ["Recommended Max (30%)", "Your Utilization"], series: [{ name: "Utilization %", data: [30, util], color: "primary" }] },
      };
    },
    faqs: [{ q: "Does credit utilization reset each month?", a: "It's recalculated based on whatever balance is reported to the credit bureaus, typically around your statement closing date — so paying down balances before that date (not just the due date) can improve your reported utilization." }],
  },
  {
    slug: "loan-comparison",
    title: "Loan Comparison Calculator",
    shortTitle: "Loan Comparison",
    category: "financial",
    description: "Compare two loan offers side by side to see which one actually costs less.",
    keywords: ["loan comparison calculator", "compare loans"],
    fields: [
      { id: "amountA", label: "Loan A — Amount", type: "number", unit: "$", defaultValue: 25000, width: "half" },
      { id: "rateA", label: "Loan A — Rate", type: "number", unit: "%", defaultValue: 7.5, step: 0.01, width: "half" },
      { id: "termA", label: "Loan A — Term", type: "number", unit: "years", defaultValue: 5, width: "half" },
      { id: "feesA", label: "Loan A — Fees", type: "number", unit: "$", defaultValue: 0, width: "half", advanced: true },
      { id: "amountB", label: "Loan B — Amount", type: "number", unit: "$", defaultValue: 25000, width: "half" },
      { id: "rateB", label: "Loan B — Rate", type: "number", unit: "%", defaultValue: 6.9, step: 0.01, width: "half" },
      { id: "termB", label: "Loan B — Term", type: "number", unit: "years", defaultValue: 6, width: "half" },
      { id: "feesB", label: "Loan B — Fees", type: "number", unit: "$", defaultValue: 500, width: "half", advanced: true },
    ],
    compute: (v) => {
      const monthsA = num(v.termA) * 12, monthsB = num(v.termB) * 12;
      const paymentA = monthlyPayment(num(v.amountA), num(v.rateA), monthsA);
      const paymentB = monthlyPayment(num(v.amountB), num(v.rateB), monthsB);
      const totalA = paymentA * monthsA + num(v.feesA);
      const totalB = paymentB * monthsB + num(v.feesB);
      const cheaper = totalA < totalB ? "Loan A" : totalB < totalA ? "Loan B" : "Both are equal";
      return {
        items: [
          { label: "Lower Total Cost", value: cheaper, emphasis: true },
          { label: "Loan A Monthly Payment", value: formatCurrency(paymentA) },
          { label: "Loan A Total Cost", value: formatCurrency(totalA) },
          { label: "Loan B Monthly Payment", value: formatCurrency(paymentB) },
          { label: "Loan B Total Cost", value: formatCurrency(totalB) },
          { label: "Difference in Total Cost", value: formatCurrency(Math.abs(totalA - totalB)) },
        ],
        chart: {
          type: "bar",
          labels: ["Loan A", "Loan B"],
          series: [{ name: "Total Cost", data: [totalA, totalB], color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Why might a loan with a lower rate cost more overall?", a: "A longer term or higher fees can outweigh a lower rate — this is exactly why the calculator compares total cost (all payments plus fees) rather than just the rate or monthly payment alone." }],
  },
];
