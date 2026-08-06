import { SeoContent } from "./types";

export const taxContent: Record<string, SeoContent> = {
  "state-income-tax": {
    intro:
      "Federal tax gets most of the attention, but state income tax can take just as big a bite out of your paycheck — and it varies enormously depending on where you live. Someone earning $75,000 in Texas or Florida pays $0 in state income tax; the same salary in California or Oregon can mean thousands of dollars a year. Our State Income Tax Calculator gives you a fast, representative estimate for your state so you're not caught off guard.",
    howItWorks:
      "The calculator applies a single representative flat rate for the state you select to your taxable income. This is a deliberate simplification: nine states charge no income tax at all, most others use progressive brackets similar to the federal system, and a handful (like Pennsylvania and Illinois) really do use one flat rate for everyone. Using one representative rate per state keeps the estimate fast and comparable across all 50 states plus DC, at the cost of some precision for states with steep brackets.",
    examples: [
      { title: "No-tax state", body: "$75,000 income in Texas, Florida, Nevada, Washington, or Tennessee → $0 state income tax." },
      { title: "High-tax state", body: "The same $75,000 in California (9.3% representative rate) comes out to roughly $6,975 in estimated state tax; in Oregon (9.9%) it's about $7,425." },
    ],
    advantages: [
      "Instantly compares your state against all 50 states plus DC",
      "Makes the real cost difference of relocating for work immediately visible",
      "No sign-up or personal detail beyond income and state required",
      "Useful alongside our Federal Income Tax Calculator for a fuller picture",
    ],
    commonMistakes: [
      "Assuming every state uses the same bracket structure as the federal government",
      "Forgetting that some cities and counties add their own local income tax on top",
      "Not checking whether your state offers different treatment for retirement income",
      "Using a flat-rate estimate as an exact figure instead of a starting point",
    ],
    useCases: [
      "Comparing take-home pay before relocating for a new job",
      "Estimating total tax burden alongside federal tax",
      "Sanity-checking a state tax bill or withholding amount",
      "Understanding why identical salaries feel very different across states",
    ],
    conclusion:
      "State income tax is one of the biggest hidden variables in take-home pay, and it's entirely location-dependent. Use this alongside our Federal Income Tax Calculator to see your full tax picture, and check your state's department of revenue for exact bracket and deduction rules before filing.",
  },
  "payroll-tax": {
    intro:
      "Every paycheck, a chunk disappears before it ever reaches your bank account — that's payroll tax, officially known as FICA (Federal Insurance Contributions Act). It funds Social Security and Medicare, and it's separate from the federal and state income tax withheld from the same paycheck. Our Payroll Tax Calculator breaks down exactly how much of your wages go to each program.",
    howItWorks:
      "FICA has two parts. Social Security tax is 6.2% of wages up to an annual wage base ($176,100 for 2025) — earn more than that and the Social Security portion stops for the rest of the year. Medicare tax is 1.45% of all wages with no cap, plus an Additional Medicare surtax of 0.9% on wages above $200,000 (single) or $250,000 (married). The calculator applies all three pieces to your entered annual wages.",
    formula: "Social Security = min(wages, $176,100) × 6.2%\nMedicare = wages × 1.45%\nAdditional Medicare = max(wages − threshold, 0) × 0.9%",
    examples: [
      { title: "Typical salary", body: "$80,000 in wages → $4,960 Social Security + $1,160 Medicare = $6,120 total FICA, with no Additional Medicare surtax." },
      { title: "High earner", body: "$250,000 in wages (single) → Social Security caps at $10,918, Medicare is $3,625, plus $450 Additional Medicare surtax on the $50,000 over the threshold." },
    ],
    advantages: [
      "Shows the Social Security wage base cap most people don't know exists",
      "Separately breaks out the Additional Medicare surtax for high earners",
      "Helps reconcile the FICA line items on your actual pay stub",
      "Useful for both employees and employers estimating payroll costs",
    ],
    commonMistakes: [
      "Not realizing Social Security tax stops once you hit the annual wage base",
      "Forgetting employers pay a matching 6.2%/1.45% share on top (except the surtax)",
      "Confusing FICA with federal income tax — they're calculated completely separately",
      "Missing that self-employed people pay both halves themselves via SE tax",
    ],
    useCases: [
      "Verifying FICA withholding on a pay stub is correct",
      "Estimating total payroll cost as an employer",
      "Understanding why a raise stops increasing your Social Security withholding at high income",
      "Comparing W-2 payroll tax against self-employment tax",
    ],
    conclusion:
      "FICA is a flat, largely unavoidable tax that funds Social Security and Medicare, and understanding the wage base cap and Additional Medicare surtax explains a lot about why paychecks look the way they do at different income levels. If you're self-employed instead of a W-2 employee, our 1099 Tax Calculator applies the equivalent self-employment tax to your situation.",
  },
  "capital-gains-tax": {
    intro:
      "Selling an investment for more than you paid triggers capital gains tax — but how much you owe depends heavily on one factor: how long you held it. Our Capital Gains Tax Calculator estimates federal tax on both short-term and long-term gains, using your total income to find the correct rate.",
    howItWorks:
      "Short-term gains (assets held one year or less) are taxed as ordinary income at your marginal tax rate, so the calculator finds the tax on your income with and without the gain and takes the difference. Long-term gains (held over a year) get preferential rates of 0%, 15%, or 20% depending on your total taxable income — for 2025, single filers pay 0% up to $48,350, 15% up to $533,400, and 20% above that (roughly double those thresholds for married filing jointly).",
    formula: "Short-term: tax = federalTax(income + gain) − federalTax(income)\nLong-term: tax = gain × rate, where rate ∈ {0%, 15%, 20%} based on total income",
    examples: [
      { title: "Long-term gain, middle income", body: "$20,000 long-term gain with $80,000 other income (single) → total income of $100,000 falls in the 15% bracket, so tax owed is about $3,000." },
      { title: "Short-term gain", body: "The same $20,000 gain held less than a year is taxed at your ordinary marginal rate instead — often costing meaningfully more than the long-term rate would." },
    ],
    advantages: [
      "Clearly separates short-term (ordinary rate) from long-term (preferential rate) treatment",
      "Uses your full income picture to find the correct long-term bracket",
      "Shows the effective rate on just the gain, not your whole income",
      "Makes the tax benefit of holding an investment past one year concrete",
    ],
    commonMistakes: [
      "Selling a winning investment one day before the one-year mark and losing the long-term rate",
      "Forgetting that capital gains stack on top of ordinary income when determining your bracket",
      "Not accounting for state capital gains tax, which many states charge as ordinary income",
      "Ignoring the Net Investment Income Tax (an extra 3.8% for high earners) that isn't included here",
    ],
    useCases: [
      "Deciding whether to sell an investment now or wait for long-term treatment",
      "Estimating tax owed before filing after selling stock, crypto, or property",
      "Comparing the tax cost of short-term trading versus long-term investing",
      "Tax-planning around large one-time gains",
    ],
    conclusion:
      "The one-year holding period is one of the most valuable thresholds in the entire tax code — crossing it can cut your tax rate on a gain by more than half. Run your numbers here before deciding when to sell, and pair this with our Effective Tax Rate Calculator to see how a large gain shifts your overall tax picture.",
  },
  "gift-tax": {
    intro:
      "Giving someone a large sum of money or valuable property can technically trigger IRS gift tax rules — but in practice, almost nobody ever pays gift tax directly. Our Gift Tax Calculator checks a gift against the annual exclusion so you know whether it's fully covered or needs to be reported.",
    howItWorks:
      "Every year, the IRS lets you give any number of people up to the annual exclusion amount each ($19,000 per recipient for 2025) with zero tax consequences and no paperwork. Give more than that to one person in a year, and the excess doesn't necessarily trigger tax — it just counts against your much larger lifetime gift and estate exemption (currently just under $14 million) and requires filing IRS Form 709.",
    examples: [
      { title: "Under the exclusion", body: "A $15,000 gift to your child is entirely covered by the $19,000 annual exclusion — no form, no tax." },
      { title: "Over the exclusion", body: "A $50,000 gift to one person means $31,000 counts against your lifetime exemption and Form 709 should be filed, but no tax is due unless your lifetime gifts exceed roughly $14 million." },
    ],
    advantages: [
      "Instantly shows whether a gift needs to be reported at all",
      "Uses the current 2025 annual exclusion amount",
      "Clarifies the difference between 'reportable' and 'taxable' — most people confuse the two",
      "Useful for estate planning and family financial gifts alike",
    ],
    commonMistakes: [
      "Assuming any gift over the annual exclusion means immediate tax owed (it almost never does)",
      "Not realizing the exclusion applies per recipient, so gifts to multiple people don't stack",
      "Forgetting that spouses can each give the annual exclusion amount, effectively doubling it",
      "Overlooking that tuition and medical expenses paid directly to a provider don't count as gifts at all",
    ],
    useCases: [
      "Checking if a large family gift needs to be reported to the IRS",
      "Planning annual gifting as part of an estate strategy",
      "Understanding the difference between the annual exclusion and lifetime exemption",
      "Deciding whether to split a large gift across multiple years",
    ],
    conclusion:
      "For the vast majority of gifts, the annual exclusion means there's nothing to report and nothing to pay. Even gifts above it typically just use up part of a lifetime exemption most people will never come close to reaching. If you're planning significant lifetime gifting or estate transfers, a qualified estate attorney or CPA can help structure it properly.",
  },
  "tax-refund-estimator": {
    intro:
      "Waiting until you file to find out if you owe money or get a refund is stressful — our Tax Refund Estimator gives you that answer months ahead of time using your income and what's already been withheld from your paychecks.",
    howItWorks:
      "The calculator computes your estimated federal tax liability using the 2025 tax brackets for your filing status, then compares that against the total federal tax you've had withheld from your paychecks so far (or expect to have withheld for the full year). If withholding is higher than your liability, you're owed a refund; if it's lower, you'll owe the difference when you file.",
    examples: [
      { title: "Refund expected", body: "$70,000 income (single) with $9,000 withheld → estimated tax liability is about $8,232, meaning a refund of roughly $768." },
      { title: "Amount owed", body: "The same income with only $7,000 withheld falls short of the $8,232 liability, meaning about $1,232 would be owed at filing time." },
    ],
    advantages: [
      "Gives an early warning if you're under-withheld, avoiding a surprise tax bill",
      "Helps you decide whether to adjust your W-4 withholding mid-year",
      "Uses actual 2025 bracket math, not a rough percentage guess",
      "Takes seconds — no need to wait for tax season or software",
    ],
    commonMistakes: [
      "Only checking withholding once a year instead of after major income changes",
      "Forgetting additional income (freelance work, investments) that isn't withheld from at all",
      "Assuming last year's refund will repeat if your income or withholding changed",
      "Not accounting for tax credits (child tax credit, education credits, etc.) this estimate doesn't include",
    ],
    useCases: [
      "Checking mid-year whether you're on track for a refund or a bill",
      "Deciding whether to update your W-4 after a raise or new job",
      "Planning cash flow around an expected refund or tax payment",
      "Sanity-checking a refund number from tax software",
    ],
    conclusion:
      "This estimate covers your core federal income tax liability against withholding — it doesn't include credits like the Child Tax Credit or Earned Income Tax Credit, which can meaningfully increase a refund. Think of it as a directional check, and pair it with our Effective Tax Rate and Marginal Tax Rate calculators for a fuller picture of your tax situation.",
  },
  "w2-tax": {
    intro:
      "Your W-2 shows gross wages, but what actually lands in your bank account is a smaller number after federal income tax and FICA are taken out. Our W-2 Tax Calculator estimates that real take-home pay from your Box 1 wages.",
    howItWorks:
      "The calculator subtracts your filing status's standard deduction from your gross wages to find taxable income, runs that through the 2025 federal tax brackets to find income tax owed, then separately calculates FICA payroll tax (Social Security + Medicare) on your gross wages. Net pay is gross wages minus both.",
    formula: "Taxable income = wages − standard deduction\nNet pay = wages − federal income tax − FICA tax",
    examples: [
      { title: "Single filer", body: "$75,000 in wages (single) → taxable income of $60,000 after the $15,000 standard deduction, about $7,182 in federal income tax, plus $5,738 FICA, for an estimated net pay near $62,080." },
      { title: "Married filer", body: "The same $75,000 filed jointly benefits from the larger $30,000 standard deduction, lowering taxable income to $45,000 and reducing the federal tax owed noticeably." },
    ],
    advantages: [
      "Combines both federal income tax and FICA in one estimate, unlike most simple calculators",
      "Applies the correct 2025 standard deduction automatically for your filing status",
      "Useful for sanity-checking your actual pay stub or an offer letter's stated salary",
      "Shows exactly how much of your gross salary reaches your bank account",
    ],
    commonMistakes: [
      "Comparing a job offer's gross salary directly to your current take-home pay",
      "Forgetting state income tax, which this estimate doesn't include",
      "Not accounting for pre-tax deductions like 401(k) contributions or health insurance premiums, which lower taxable wages further",
      "Assuming Box 1 wages equal your full salary — pre-tax benefits are already excluded from Box 1",
    ],
    useCases: [
      "Estimating real take-home pay from a job offer's salary",
      "Understanding the gap between gross salary and net pay",
      "Budgeting based on realistic after-tax income",
      "Checking that payroll withholding roughly matches expected tax liability",
    ],
    conclusion:
      "The gap between gross salary and take-home pay surprises a lot of people, especially at higher income levels. This estimate covers federal tax and FICA — for a complete picture, subtract your state income tax using our State Income Tax Calculator and any pre-tax benefit deductions your employer offers.",
  },
  "1099-tax": {
    intro:
      "Freelancers and independent contractors don't have an employer withholding taxes automatically — and they face a tax most W-2 employees never think about: self-employment tax. Our 1099 Tax Calculator estimates your total federal tax bill, including both income tax and self-employment tax, from your net self-employment income.",
    howItWorks:
      "Self-employment tax replaces the employee/employer split of FICA — as a 1099 worker, you effectively pay both halves, totaling 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of your net earnings (a small adjustment the IRS allows to approximate the 'employer half' not being separately taxed). You also get to deduct half of your SE tax from your taxable income before calculating federal income tax on what remains.",
    formula: "SE tax = net income × 92.35% × 15.3%\nTaxable income = net income − (SE tax ÷ 2) − standard deduction\nTotal tax = SE tax + federal income tax on taxable income",
    methodology:
      "The 92.35% factor exists because W-2 employees only pay FICA tax on their gross wages, while the 'employer half' (7.65%) is paid separately by the employer and never appears in the employee's taxable pay. Since a 1099 worker has no employer to split with, the IRS lets you shrink the taxable base to 92.35% of net earnings (100% − 7.65%) so self-employed and W-2 workers land at roughly the same effective FICA burden.\n\nThe 15.3% rate itself splits into 12.4% for Social Security (capped at the annual Social Security wage base — earnings above that cap owe no additional Social Security portion, only the 2.9% Medicare portion, which has no cap) and 2.9% for Medicare. On top of SE tax, you calculate regular federal income tax using the standard progressive tax brackets, but only after subtracting half of your SE tax as an above-the-line deduction — a rule meant to mirror how W-2 employees never pay income tax on their employer's FICA contribution either.",
    stepByStep: [
      "Start with net self-employment income (revenue minus deductible business expenses).",
      "Multiply net income by 92.35% to get the SE-taxable base.",
      "Multiply that base by 15.3% to get your total self-employment tax.",
      "Divide your SE tax by 2 — this half is deductible from taxable income.",
      "Subtract the SE tax deduction and the standard (or itemized) deduction from net income to get taxable income.",
      "Apply the federal income tax brackets to that taxable income.",
      "Add federal income tax to SE tax for your total estimated federal tax bill.",
    ],
    edgeCases: [
      "Net self-employment income under $400 in a year is exempt from self-employment tax entirely, per IRS rules.",
      "Once your combined W-2 and self-employment earnings exceed the annual Social Security wage base, only the 2.9% Medicare portion applies to the remaining self-employment income.",
      "High earners (above roughly $200,000 single / $250,000 married) owe an additional 0.9% Medicare surtax that this simplified formula doesn't include — check with a tax professional near that threshold.",
      "This estimate doesn't account for state income tax, which is calculated entirely separately and varies significantly by state.",
      "A net loss (negative net income) owes no self-employment tax, but you'll need to track it for other tax purposes like loss carryforwards.",
    ],
    examples: [
      { title: "Solo freelancer", body: "$80,000 net self-employment income (single) → about $11,304 in self-employment tax, plus roughly $8,700 in federal income tax on the reduced taxable income, for a total near $20,000." },
      { title: "Side income", body: "A smaller $20,000 in net freelance income still owes SE tax on the full amount — self-employment tax doesn't have a minimum threshold the way some deductions do." },
    ],
    advantages: [
      "Combines self-employment tax and federal income tax into one total estimate",
      "Correctly applies the 92.35% adjustment and the half-SE-tax deduction most simple calculators skip",
      "Helps freelancers set aside the right amount for quarterly payments",
      "Shows net income after tax, not just the tax bill in isolation",
    ],
    commonMistakes: [
      "Forgetting self-employment tax entirely and budgeting only for income tax",
      "Not setting aside money throughout the year, leading to a large bill at filing time",
      "Missing deductible business expenses that would lower net self-employment income",
      "Confusing gross revenue with net income — SE tax applies to profit, not revenue",
    ],
    useCases: [
      "Estimating total tax owed as a freelancer or gig worker",
      "Deciding how much to set aside from each payment for taxes",
      "Comparing 1099 take-home pay against an equivalent W-2 salary",
      "Planning quarterly estimated tax payments",
    ],
    conclusion:
      "Self-employment tax is the single biggest tax surprise for new freelancers — it's an extra 15.3% most W-2 employees never see directly. Once you know your estimated total, use our Quarterly Estimated Tax Calculator to split it into the four IRS-required payments and avoid an underpayment penalty.",
  },
  "quarterly-estimated-tax": {
    intro:
      "The IRS expects freelancers and self-employed workers to pay tax as they earn it, not just once a year — that's what quarterly estimated payments are for. Our Quarterly Estimated Tax Calculator takes your expected annual self-employment income and splits your total tax liability into four payments.",
    howItWorks:
      "The calculator first estimates your total annual tax liability the same way our 1099 Tax Calculator does — self-employment tax plus federal income tax on your net earnings — then divides that total by four to produce an equal quarterly payment amount, matching how the IRS structures its estimated tax due dates.",
    examples: [
      { title: "Consistent freelance income", body: "$80,000 in expected net self-employment income (single) produces roughly $20,000 in total annual tax, or about $5,000 due each quarter." },
      { title: "Part-time side income", body: "$25,000 in net side income still requires quarterly payments if you expect to owe $1,000 or more for the year — even modest freelance income can trigger the requirement." },
    ],
    advantages: [
      "Turns an intimidating annual tax bill into four manageable payments",
      "Uses the same accurate SE tax + income tax math as our full 1099 calculator",
      "Helps you avoid the IRS underpayment penalty for not paying tax throughout the year",
      "Useful for budgeting cash flow around known payment dates",
    ],
    commonMistakes: [
      "Not making any estimated payments and getting hit with a penalty at filing time",
      "Paying based on last year's income when this year's income has changed significantly",
      "Missing a due date — payments are typically due mid-April, mid-June, mid-September, and mid-January",
      "Forgetting to include income tax and only setting aside money for self-employment tax",
    ],
    useCases: [
      "Planning quarterly tax payments as a freelancer or independent contractor",
      "Budgeting cash flow around four known tax due dates",
      "Avoiding IRS underpayment penalties",
      "Estimating payments after a change in freelance income",
    ],
    conclusion:
      "Missing estimated payments doesn't just delay your tax bill — it can add IRS penalties and interest on top. Mark the four due dates on your calendar, and revisit this calculator whenever your income changes meaningfully during the year so your payments stay accurate.",
  },
  "bonus-tax": {
    intro:
      "A bonus feels like free money until the paycheck arrives smaller than expected — bonuses are typically withheld at a flat federal rate that's often higher than your regular paycheck's rate. Our Bonus Tax Calculator shows what actually lands in your account.",
    howItWorks:
      "The IRS allows employers to withhold supplemental wages like bonuses at a flat 22% federal rate (for bonuses under $1 million) instead of using your regular W-4 withholding formula. The calculator applies that 22% flat rate plus standard FICA payroll tax to your bonus amount to estimate your net bonus payout.",
    formula: "Net bonus = bonus − (bonus × 22%) − FICA tax on the bonus",
    examples: [
      { title: "Typical bonus", body: "A $5,000 bonus → $1,100 federal withholding (22%) + $382.50 FICA = about $3,517.50 net." },
      { title: "Larger bonus", body: "A $20,000 bonus follows the same flat rates → roughly $4,400 federal withholding + $1,530 FICA, netting about $14,070." },
    ],
    advantages: [
      "Explains why bonus withholding often looks higher than your regular paycheck's rate",
      "Separates the flat federal withholding from FICA payroll tax",
      "Helps you plan around the actual net amount rather than the sticker figure",
      "Useful for negotiating or timing bonus payouts",
    ],
    commonMistakes: [
      "Assuming the 22% flat withholding is your final tax rate — it's just what's withheld upfront",
      "Not realizing your actual tax liability on the bonus is reconciled (and can be refunded) when you file",
      "Forgetting bonuses over $1 million use a different, higher withholding rate on the excess",
      "Spending the full bonus amount before checking what's actually left after withholding",
    ],
    useCases: [
      "Estimating the real take-home amount from an upcoming bonus",
      "Understanding why a bonus paycheck's withholding looks unusually high",
      "Planning large purchases or savings goals around a net bonus figure",
      "Comparing bonus withholding against regular paycheck withholding",
    ],
    conclusion:
      "The 22% flat rate is just withholding, not your final tax bill — your actual liability depends on your total annual income and is reconciled when you file. If the flat rate over-withholds relative to your real bracket, that difference typically comes back as part of your refund.",
  },
  "overtime-tax": {
    intro:
      "Overtime pay often gets a bad reputation for being 'taxed more' — in reality it's taxed at the same rates as your regular income, but because it stacks on top of your regular wages, it can push some of your earnings into a higher bracket. Our Overtime Tax Calculator shows the real impact.",
    howItWorks:
      "The calculator computes your estimated federal tax with your regular wages alone, then again with overtime pay added on top, and reports the difference as the extra tax attributable to the overtime. Because tax brackets are progressive, this extra income is taxed at your marginal rate — the rate that applies to your last dollar earned, not your average rate.",
    examples: [
      { title: "Overtime within the same bracket", body: "$60,000 regular wages plus $6,000 overtime (single) both fall within the 22% bracket, so the extra tax on the overtime is roughly $1,320, leaving about $4,680 in extra take-home pay." },
      { title: "Overtime crossing into a higher bracket", body: "If regular wages were closer to the top of the 22% bracket, some of the overtime could spill into the 24% bracket, slightly increasing the marginal rate applied to the last portion." },
    ],
    advantages: [
      "Shows the true marginal tax rate applied to overtime, not a flat guess",
      "Clarifies that overtime is never taxed at a special 'overtime rate' — that's a common myth",
      "Helps estimate real extra take-home pay before deciding to pick up extra shifts",
      "Uses your actual regular wages as the baseline for an accurate comparison",
    ],
    commonMistakes: [
      "Believing overtime is taxed at a punitive special rate — it's simply added to your regular income",
      "Confusing higher withholding on an overtime-heavy paycheck with a higher actual tax rate",
      "Not accounting for FICA tax, which also applies to overtime pay",
      "Assuming all overtime is taxed at your top marginal rate when only the portion crossing into a new bracket is",
    ],
    useCases: [
      "Estimating real take-home pay before accepting overtime shifts",
      "Understanding why an overtime paycheck's withholding looks disproportionately high",
      "Comparing the after-tax value of overtime pay versus a shift differential or bonus",
      "Explaining the progressive tax system to someone confused by a big paycheck's withholding",
    ],
    conclusion:
      "Overtime pay is taxed exactly like regular income — the myth of a special 'overtime tax rate' comes from employer withholding tables, not the actual tax code. Your paycheck may withhold more than usual, but any over-withholding is reconciled (and typically refunded) when you file your return.",
  },
  "effective-tax-rate": {
    intro:
      "'What tax bracket am I in?' and 'what percentage of my income actually goes to tax?' are two very different questions — the first is your marginal rate, the second is your effective rate, and confusing the two leads to a lot of bad financial decisions. Our Effective Tax Rate Calculator shows both, clearly separated.",
    howItWorks:
      "The calculator runs your taxable income through the 2025 federal brackets to find your total tax owed, then divides that total by your income to get your effective (average) rate. Your marginal rate — the rate on your last dollar earned — is reported separately, since it's almost always higher than your effective rate.",
    formula: "Effective rate = total tax ÷ total income\nMarginal rate = the tax bracket rate applied to your last dollar of income",
    examples: [
      { title: "Middle income", body: "$90,000 taxable income (single) → about $15,246 in federal tax, an effective rate near 16.9%, even though the marginal rate on the last dollar earned is 22%." },
      { title: "Why they diverge", body: "Only the income within each bracket is taxed at that bracket's rate — the first $11,600 is taxed at 10% regardless of total income, which is why effective rate always lags behind marginal rate." },
    ],
    advantages: [
      "Corrects the common misconception that your whole income is taxed at your top bracket",
      "Makes the real average cost of taxes on your income clear",
      "Useful for comparing your actual tax burden year over year",
      "Pairs naturally with our Marginal Tax Rate Calculator for the full bracket breakdown",
    ],
    commonMistakes: [
      "Believing a raise that pushes you into a higher bracket lowers your overall take-home pay (it never does — only the income above the threshold is taxed at the new rate)",
      "Comparing your effective rate to someone else's marginal rate, or vice versa",
      "Forgetting this effective rate covers federal tax only, not state tax or FICA",
      "Assuming effective rate stays constant as income changes — it rises as you move through more brackets",
    ],
    useCases: [
      "Understanding your true average federal tax burden",
      "Correcting the 'raises push you into a bracket where you earn less' myth for someone",
      "Comparing tax efficiency across different income scenarios",
      "Contextualizing a marginal rate shown elsewhere on the site",
    ],
    conclusion:
      "Your marginal rate tells you what the next dollar you earn is taxed at; your effective rate tells you what you actually paid on average. Both numbers matter for different decisions — use our Marginal Tax Rate Calculator when you want the full bracket-by-bracket breakdown behind this number.",
  },
  "marginal-tax-rate": {
    intro:
      "The US federal tax system is progressive, meaning different slices of your income are taxed at different rates — not your entire income at one flat rate. Our Marginal Tax Rate Calculator shows exactly how much tax comes from each bracket, up to your income level, in a clear table.",
    howItWorks:
      "The calculator walks through the 2025 federal tax brackets for your filing status in order, calculating how much of your income falls into each bracket and the tax owed from that slice alone. Your marginal rate is simply the rate of the highest bracket your income reaches — the rate that would apply to one more dollar earned.",
    examples: [
      { title: "Single filer at $150,000", body: "Income moves through the 10%, 12%, 22%, and 24% brackets — the last dollar earned falls in the 24% bracket, making that your marginal rate, even though your effective rate is meaningfully lower." },
      { title: "Reading the table", body: "The breakdown shows exactly how much tax comes from the 10% bracket, how much from the 12% bracket, and so on — useful for seeing precisely where your tax bill comes from." },
    ],
    advantages: [
      "Shows a full bracket-by-bracket table, not just a single summary number",
      "Makes the progressive tax system concrete instead of abstract",
      "Helps you understand exactly how much more tax an additional dollar of income would cost",
      "Useful for decisions like whether extra freelance income or a bonus is 'worth it' after tax",
    ],
    commonMistakes: [
      "Thinking your marginal rate applies to your entire income (it only applies to income within that top bracket)",
      "Making decisions based on marginal rate alone without considering effective rate",
      "Forgetting state tax brackets work similarly and stack on top of federal brackets",
      "Assuming crossing into a new bracket is something to avoid — it never reduces your take-home pay",
    ],
    useCases: [
      "Seeing exactly how tax brackets apply to your specific income",
      "Deciding whether additional income (bonus, freelance work, overtime) is worth pursuing after tax",
      "Understanding your full federal tax bill, bracket by bracket",
      "Explaining the progressive tax system with real numbers",
    ],
    conclusion:
      "Once you see the bracket table broken down this way, the progressive tax system stops being confusing — every dollar you earn is taxed at the rate for the bracket it falls into, nothing more. Pair this with our Effective Tax Rate Calculator to see how it all averages out.",
  },
  "llc-tax": {
    intro:
      "A single-member LLC is, by IRS default, a 'disregarded entity' — meaning it's taxed exactly like a sole proprietorship unless you elect otherwise. Our LLC Tax Calculator estimates your total federal tax under that default pass-through treatment.",
    howItWorks:
      "Since LLC profit passes straight through to your personal return, the math is identical to self-employment tax: 15.3% self-employment tax on 92.35% of net profit, plus federal income tax on your profit minus half your SE tax and your standard deduction. This calculator assumes default sole-proprietorship taxation — LLCs that elect S-Corp or C-Corp status should use those dedicated calculators instead.",
    examples: [
      { title: "Default taxation", body: "$100,000 net business profit (single, default LLC taxation) → roughly $14,130 self-employment tax plus federal income tax on the reduced taxable base, for a substantial total tax bill." },
      { title: "Why some LLCs elect S-Corp", body: "The same $100,000 profit taxed as an S-Corp (see our S-Corp Tax Calculator) can reduce payroll tax by only applying it to a 'reasonable salary' portion rather than the full profit." },
    ],
    advantages: [
      "Uses accurate default pass-through tax treatment, not a flat guess",
      "Shows the full self-employment tax burden LLC owners often underestimate",
      "Useful for deciding whether an S-Corp election could save money (compare against our S-Corp calculator)",
      "Applies current 2025 SE tax and bracket figures",
    ],
    commonMistakes: [
      "Assuming an LLC automatically provides tax savings compared to being unincorporated — by default, it doesn't",
      "Not setting aside money for self-employment tax throughout the year",
      "Missing deductible business expenses that would lower net profit before this calculation",
      "Confusing LLC legal liability protection (real) with LLC tax savings (only via an election)",
    ],
    useCases: [
      "Estimating total tax owed for a default-taxed single-member LLC",
      "Deciding whether to explore an S-Corp election for tax savings",
      "Planning quarterly estimated payments for an LLC's owner",
      "Comparing LLC tax treatment against sole proprietorship (they're identical by default)",
    ],
    conclusion:
      "An LLC's main benefit is legal — separating personal and business liability — not automatic tax savings, since the IRS taxes it just like a sole proprietorship by default. If your profit is high enough that payroll tax savings could be meaningful, compare this result against our S-Corp Tax Calculator and talk to a CPA about whether an election makes sense.",
  },
  "s-corp-tax": {
    intro:
      "Electing S-Corp status is one of the most common tax strategies for profitable small business owners — the appeal is that only your 'reasonable salary' is subject to payroll tax, while the rest of the profit can be taken as distributions that avoid it. Our S-Corp Tax Calculator estimates how much that split could save.",
    howItWorks:
      "The calculator splits your net business profit into a salary (subject to FICA payroll tax, both employee and employer shares since you effectively pay both as the owner) and distributions (not subject to payroll tax). It compares the resulting payroll tax against what you'd owe as a sole proprietor paying full self-employment tax on all of it, showing the estimated savings.",
    formula: "Payroll tax = FICA on salary × 2 (employee + employer share)\nSavings = self-employment tax on full profit − payroll tax on salary alone",
    examples: [
      { title: "Meaningful savings", body: "$150,000 net profit with an $80,000 reasonable salary → payroll tax applies only to the $80,000, while $70,000 in distributions avoids it, saving several thousand dollars versus paying self-employment tax on the full $150,000." },
      { title: "Salary set too low", body: "Setting salary far below what's 'reasonable' for the work performed increases the tax savings shown here, but also increases audit risk — the IRS specifically scrutinizes unreasonably low S-Corp salaries." },
    ],
    advantages: [
      "Quantifies the actual dollar savings of an S-Corp election, not just a general claim that it 'saves money'",
      "Separately shows payroll tax on salary and untaxed distribution income",
      "Helps evaluate whether profit is high enough to justify the added S-Corp administrative cost and complexity",
      "Uses accurate FICA math including both employee and employer shares",
    ],
    commonMistakes: [
      "Setting an unreasonably low salary purely to maximize distributions — this is a well-known IRS audit trigger",
      "Forgetting S-Corps have real added costs: separate tax filings, payroll processing, and often a CPA",
      "Assuming S-Corp election helps at low profit levels — the administrative overhead can exceed the tax savings",
      "Not researching what a 'reasonable salary' looks like for your specific role and industry",
    ],
    useCases: [
      "Deciding whether an S-Corp election is worth the added complexity for your business",
      "Setting a defensible reasonable-salary figure",
      "Estimating payroll tax savings compared to sole proprietor or default LLC taxation",
      "Planning owner compensation structure for a profitable small business",
    ],
    conclusion:
      "S-Corp elections can genuinely save real money once profit is high enough, but the 'reasonable salary' requirement is not optional — the IRS actively audits S-Corps with implausibly low owner salaries. Use this estimate as a starting point for a conversation with a CPA, who can help you set a defensible salary and confirm an S-Corp election makes sense for your numbers.",
  },
  "corporate-tax": {
    intro:
      "C-Corporations pay a flat federal corporate income tax rate — one of the simplest calculations in the entire tax code, thanks to the 2017 tax reform that replaced the old graduated corporate brackets with a single rate. Our Corporate Tax Calculator applies it directly.",
    howItWorks:
      "Since 2018, federal corporate income tax has been a flat 21% on net taxable corporate income, with no brackets to navigate. The calculator simply multiplies your entered net income by 21% to find federal tax owed, and shows after-tax income as the remainder.",
    formula: "Federal corporate tax = net taxable income × 21%",
    examples: [
      { title: "Mid-size corporation", body: "$500,000 in net taxable income → $105,000 in federal corporate tax, leaving $395,000 after-tax." },
      { title: "Smaller corporation", body: "$50,000 in net taxable income → $10,500 federal tax, at the exact same 21% rate — the flat rate applies equally regardless of size." },
    ],
    advantages: [
      "Reflects the simple, flat post-2017 corporate tax structure accurately",
      "No brackets to navigate — one multiplication gives an exact federal estimate",
      "Useful for comparing C-Corp taxation against pass-through entities like S-Corps or LLCs",
      "Shows after-tax income clearly alongside the tax figure",
    ],
    commonMistakes: [
      "Forgetting this is federal tax only — state corporate tax is separate and varies significantly by state",
      "Not accounting for the fact that C-Corp profits distributed as dividends face a second layer of tax at the shareholder level ('double taxation')",
      "Assuming the flat 21% rate applies to pass-through entities like LLCs or S-Corps — it doesn't, they're taxed on the owner's personal return instead",
      "Overlooking available deductions and credits that reduce net taxable income before this calculation applies",
    ],
    useCases: [
      "Estimating federal tax liability for a C-Corporation",
      "Comparing C-Corp taxation against S-Corp or LLC pass-through taxation",
      "Financial modeling and business planning for incorporated companies",
      "Understanding the impact of the 2017 flat-rate corporate tax reform",
    ],
    conclusion:
      "The flat 21% federal rate makes C-Corp tax estimation straightforward, but remember it's only part of the picture — state corporate tax and the 'double taxation' on distributed dividends both add to the real total. A CPA familiar with your state and distribution plans can help model the complete picture.",
  },
  "customs-duty": {
    intro:
      "Importing goods internationally almost always means paying customs duty — a tax charged on the declared value of the shipment when it crosses the border. Our Customs Duty Calculator gives a quick estimate once you know the applicable duty rate.",
    howItWorks:
      "The calculator adds your declared goods value and shipping/insurance costs together to find the total dutiable value, then applies your entered duty rate as a percentage to find the duty owed. The result is added back to find your total landed cost — what the shipment actually costs once it clears customs.",
    formula: "Dutiable value = declared value + shipping & insurance\nDuty = dutiable value × duty rate\nLanded cost = dutiable value + duty",
    examples: [
      { title: "Standard shipment", body: "$2,000 in declared goods, $100 shipping, 5% duty rate → $2,100 dutiable value, $105 in duty, for a total landed cost of $2,205." },
      { title: "Higher duty rate", body: "The same shipment at a 15% duty rate (common for certain product categories) triples the duty owed to $315, a meaningful jump in total cost." },
    ],
    advantages: [
      "Separates dutiable value (goods + shipping) from the final landed cost clearly",
      "Works for any duty rate, so it adapts to different product categories and countries",
      "Helps budget for the true cost of an international purchase or shipment before it arrives",
      "Quick enough to check multiple duty rate scenarios in seconds",
    ],
    commonMistakes: [
      "Forgetting that duty rates vary enormously by product category (HS code) and country of origin",
      "Not including shipping and insurance in the dutiable value, which most customs authorities require",
      "Assuming a rate found online for one product category applies to a different one",
      "Overlooking additional fees like merchandise processing fees or broker charges that aren't pure duty",
    ],
    useCases: [
      "Budgeting the true landed cost of an international purchase before ordering",
      "Estimating import costs for a small business bringing in inventory",
      "Comparing total cost across suppliers in different countries with different duty rates",
      "Sanity-checking a customs bill after a shipment arrives",
    ],
    conclusion:
      "Duty rates are set by each country's customs authority based on the specific product classification, so this calculator is only as accurate as the rate you enter. Check your country's official customs tariff schedule (or ask your freight forwarder) for the exact rate on your product before finalizing an international purchase.",
  },
};
