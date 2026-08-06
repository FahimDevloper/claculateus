import { SeoContent } from "./types";

export const taxContent: Record<string, SeoContent> = {
  "state-income-tax": {
    intro:
      "Federal tax gets most of the attention, but state income tax can take just as big a bite out of your paycheck — and it varies enormously depending on where you live. Someone earning $75,000 in Texas or Florida pays $0 in state income tax; the same salary in California or Oregon can mean thousands of dollars a year. Our State Income Tax Calculator gives you a fast, representative estimate for your state so you're not caught off guard.",
    howItWorks:
      "The calculator applies a single representative flat rate for the state you select to your taxable income. This is a deliberate simplification: nine states charge no income tax at all, most others use progressive brackets similar to the federal system, and a handful (like Pennsylvania and Illinois) really do use one flat rate for everyone. Using one representative rate per state keeps the estimate fast and comparable across all 50 states plus DC, at the cost of some precision for states with steep brackets.",
    methodology:
      "State income tax structures fall into three broad groups. No-tax states (currently Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming) rely on sales tax, property tax, or other revenue instead. Flat-tax states apply one percentage to all taxable income regardless of amount. Progressive-bracket states — the majority — tax income in slices the same way the federal system does, with the rate rising as income climbs through each bracket. This calculator's representative rate approximates the effective rate a typical earner would pay in a bracket-based state, rather than modeling every state's exact bracket table.",
    stepByStep: [
      "Identify your state and whether it uses no tax, a flat rate, or progressive brackets.",
      "For flat-tax and no-tax states, the calculation is direct: multiply income by the flat rate, or by zero.",
      "For progressive-bracket states, find your income's position within that state's published brackets.",
      "Apply each bracket's rate only to the income within that bracket, summing the results (the same logic as federal tax).",
      "Subtract any state-specific standard deduction or exemption before applying brackets, if your state offers one.",
    ],
    edgeCases: [
      "Some cities (like New York City and Philadelphia) layer a local income tax on top of the state tax, which this state-level estimate doesn't include.",
      "A handful of states tax retirement income (pensions, Social Security) differently than wage income — some exempt it entirely.",
      "Moving mid-year generally means filing part-year returns in two states, each taxing only the income earned while you were a resident.",
      "Remote workers can sometimes owe tax to both their home state and the state where their employer is based, depending on each state's rules.",
    ],
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
    methodology:
      "FICA is intentionally split into two differently-behaved taxes. Social Security tax exists to fund a benefit with a maximum payout, so it's capped at the wage base — once your year-to-date wages cross that line, Social Security withholding simply stops for the rest of the year. Medicare has no such cap because it funds a healthcare program without an equivalent per-person benefit ceiling, so it applies to every dollar of wages, plus an extra 0.9% surtax on income above the high-earner threshold that was added by the Affordable Care Act specifically to help fund Medicare expansion.",
    stepByStep: [
      "Take your gross wages for the year (or the period you're calculating).",
      "Apply 6.2% Social Security tax to wages up to the annual wage base cap, and stop applying it above that cap.",
      "Apply 1.45% Medicare tax to all wages with no cap.",
      "If wages exceed the Additional Medicare threshold for your filing status, apply an extra 0.9% to only the amount above that threshold.",
      "Sum the three components for total FICA (employee side).",
    ],
    edgeCases: [
      "If you switch employers mid-year, each employer withholds Social Security tax independently up to the cap — you may end up over-withheld and can claim the excess back as a credit when filing.",
      "The Additional Medicare surtax threshold is based on total household income for married filers, not per-employer, so employers can't always withhold it correctly on their own.",
      "Self-employed workers pay both the employee and employer share of FICA (as self-employment tax) since there's no separate employer to split it with.",
      "The Social Security wage base is adjusted for inflation most years, so the cap used in a manual calculation should always be checked against the current year's published figure.",
    ],
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
    methodology:
      "Short-term gains get no special treatment at all — the IRS simply adds the gain to your ordinary income and taxes the whole stack through the regular progressive brackets, which is why the calculator computes tax with and without the gain and reports the difference. Long-term gains instead sit on their own separate rate schedule with just three tiers (0%, 15%, 20%), and which tier applies is still determined by your total income — the gain effectively 'stacks on top' of your ordinary income to see which long-term bracket it falls into, even though it's taxed at the long-term rate rather than your ordinary marginal rate.",
    stepByStep: [
      "Determine whether the asset was held for one year or less (short-term) or more than one year (long-term).",
      "For short-term gains: calculate tax on your ordinary income alone, then calculate tax on ordinary income plus the gain, and subtract to isolate the tax attributable to the gain.",
      "For long-term gains: add the gain to your other taxable income to find which long-term bracket (0%, 15%, or 20%) it falls into.",
      "Multiply the gain by that bracket's rate to get long-term capital gains tax owed.",
    ],
    edgeCases: [
      "Capital losses can offset capital gains dollar-for-dollar, and up to $3,000 of net losses can offset ordinary income each year, with any excess carried forward to future years.",
      "High earners may also owe the 3.8% Net Investment Income Tax on top of regular capital gains tax once modified adjusted gross income crosses IRS thresholds.",
      "Collectibles (art, precious metals, some cryptocurrencies) and certain small business stock can have different long-term rates than the standard 0/15/20% schedule.",
      "Many states tax capital gains as ordinary income with no preferential long-term rate, so the total tax bill is often higher than the federal estimate alone suggests.",
    ],
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
    methodology:
      "The gift tax system exists mainly to prevent people from avoiding estate tax by giving away their wealth before death. It works as two connected limits: a small annual exclusion that resets every year and requires no paperwork, and a much larger lifetime exemption that's shared between gifts made while alive and your estate at death. Only the amount above the annual exclusion, per recipient, per year, ever touches the lifetime exemption — and only once someone's total lifetime gifts (plus their taxable estate) exceed that lifetime exemption does actual gift or estate tax become due.",
    stepByStep: [
      "Identify the total value of the gift and the recipient.",
      "Compare the gift amount to the current annual exclusion per recipient.",
      "If the gift is at or below the exclusion, no reporting or tax is required.",
      "If the gift exceeds the exclusion, calculate the excess amount above the exclusion.",
      "That excess is reported on Form 709 and subtracted from your remaining lifetime exemption — no tax is due unless your cumulative lifetime gifts exceed the full exemption.",
    ],
    edgeCases: [
      "Payments made directly to a school for tuition or directly to a medical provider for someone's care don't count as gifts at all, regardless of amount.",
      "Married couples can 'split' a gift, effectively doubling the annual exclusion available for a single recipient even if the money comes from one spouse.",
      "Gifts of appreciating assets (like stock) use the fair market value at the time of the gift, not the original purchase price, for exclusion purposes.",
      "The lifetime exemption is scheduled to change based on legislation, so a gift plan built around today's exemption amount should be revisited if tax law changes.",
    ],
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
    methodology:
      "A refund isn't a bonus from the government — it's simply the return of your own money that was withheld in excess of what you actually owed. Withholding is calculated by your employer using IRS formulas driven by your W-4 elections, which are only an estimate of your full-year tax liability. Your actual liability is the amount produced by running your real annual income through the tax brackets after deductions. The gap between what was withheld throughout the year and what you actually owe is what determines whether you get a refund or a bill.",
    stepByStep: [
      "Total your expected income for the year from all sources subject to withholding.",
      "Subtract your standard deduction (or itemized deductions, if higher) to find taxable income.",
      "Run taxable income through the federal tax brackets for your filing status to find total tax liability.",
      "Total the federal tax withheld from your paychecks so far, plus any expected for the rest of the year.",
      "Subtract liability from total withholding: a positive number is your estimated refund, a negative number is what you'll owe.",
    ],
    edgeCases: [
      "This estimate doesn't include tax credits (Child Tax Credit, Earned Income Tax Credit, education credits), which directly reduce tax owed and can turn an estimated bill into an actual refund.",
      "Freelance or investment income with no withholding at all can create a surprise bill even when paycheck withholding looks correct.",
      "A large change in income partway through the year (new job, raise, bonus) can throw off a refund estimate based on year-to-date withholding pace.",
      "Owing more than $1,000 at filing time can trigger an IRS underpayment penalty unless you meet certain safe-harbor withholding thresholds throughout the year.",
    ],
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
    methodology:
      "This calculator combines two entirely separate tax systems that both apply to the same W-2 wages. Federal income tax is progressive and deduction-based — it's reduced by your standard deduction before the brackets apply, and it funds general government spending. FICA payroll tax is flat and has no deduction at all — it applies to gross wages directly (up to the Social Security cap) and funds Social Security and Medicare specifically. Because they're calculated independently and then both subtracted from gross wages, understanding each piece separately is the key to reconciling a real pay stub.",
    stepByStep: [
      "Start with gross wages (Box 1 on a W-2, or your expected annual salary).",
      "Subtract the standard deduction for your filing status to get taxable income.",
      "Apply the federal tax brackets to taxable income to find federal income tax owed.",
      "Separately, apply FICA tax (6.2% Social Security up to the wage base, plus 1.45% Medicare) to gross wages.",
      "Subtract both federal income tax and FICA tax from gross wages to estimate net take-home pay.",
    ],
    edgeCases: [
      "Pre-tax deductions like 401(k) contributions and health insurance premiums reduce Box 1 wages below your stated salary before this calculation even starts.",
      "This estimate excludes state and local income tax entirely, which can be a significant additional deduction depending on where you live.",
      "Your actual paycheck withholding depends on your W-4 elections and may not exactly match your true annual tax liability — a mismatch shows up as a refund or bill at filing time.",
      "Bonuses and other supplemental wages are often withheld at a different flat rate than regular wages, so a single paycheck's net pay can look different from this steady-state estimate.",
    ],
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
    methodology:
      "The IRS runs on a pay-as-you-go system: tax is meant to be paid as income is earned, not settled entirely at filing time. W-2 employees satisfy this automatically through paycheck withholding, but self-employed workers have no employer to withhold anything, so the IRS requires quarterly estimated payments instead. The 'safe harbor' rule generally means you avoid a penalty if you pay at least 90% of the current year's tax liability (or 100–110% of last year's, depending on income) across the four due dates, which is why this calculator's even quarterly split is a reasonable default even though real income often fluctuates throughout the year.",
    stepByStep: [
      "Estimate total annual net self-employment income for the year.",
      "Calculate total self-employment tax (15.3% on 92.35% of net income) and federal income tax on the reduced taxable base, exactly as in the 1099 Tax Calculator.",
      "Add both together for total estimated annual tax liability.",
      "Divide that total by four to get the standard even quarterly payment.",
      "Adjust individual quarters up or down if income is seasonal or uneven rather than steady throughout the year.",
    ],
    edgeCases: [
      "If your income is seasonal, the IRS allows the 'annualized income installment method' to pay unevenly across quarters rather than a flat even split, which can reduce or eliminate penalties.",
      "Underpaying even one quarter can trigger a penalty for that quarter specifically, even if the full year's tax is eventually paid in full.",
      "State estimated tax payments are usually a separate requirement with their own due dates and rules, not covered by this federal-only estimate.",
      "A significant income change partway through the year should prompt recalculating remaining payments rather than continuing with the original even split.",
    ],
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
    methodology:
      "The IRS created the flat supplemental-wage withholding rate specifically because bonuses don't fit neatly into the regular per-paycheck withholding formula, which assumes a steady salary spread evenly across the year. Rather than trying to recalculate your entire W-4 withholding around a one-time payment, employers can simply withhold a flat 22% (or a higher flat rate above the $1 million threshold in a year) and let the difference between withholding and your true liability sort itself out when you file. This is why bonus paychecks often feel over-withheld — the flat rate doesn't know your actual marginal tax bracket.",
    stepByStep: [
      "Start with the gross bonus amount.",
      "Multiply by 22% to find the flat federal withholding (for bonuses under $1 million in the year).",
      "Calculate FICA tax on the bonus the same way as regular wages (6.2% Social Security up to the cap, 1.45% Medicare).",
      "Subtract both the federal withholding and FICA from the gross bonus to find the net amount received.",
    ],
    edgeCases: [
      "Bonuses that push total supplemental wages over $1 million in a calendar year are withheld at 37% on the excess, not 22%.",
      "Some employers use the 'aggregate method' instead, combining the bonus with your regular paycheck and withholding based on your normal W-4 — this can produce a different (sometimes higher) withholding amount than the flat 22% method.",
      "The 22% withheld is not your final tax rate — if your actual marginal rate is lower, the excess comes back as part of your refund when you file.",
      "State supplemental wage withholding rates are separate from the federal 22% and vary by state, sometimes significantly.",
    ],
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
    methodology:
      "The confusion around overtime taxation comes from how payroll systems withhold, not from the actual tax code. When a paycheck suddenly includes a lot of overtime, payroll software often annualizes that single paycheck (treating it as if you earned that much every pay period all year) to estimate withholding, which produces a much higher withholding rate on that one paycheck than your true annual tax rate. The tax code itself, however, just adds overtime pay to your regular wages and taxes the combined total through the normal brackets — there is no special overtime tax rate anywhere in the law.",
    stepByStep: [
      "Calculate estimated annual federal tax using regular wages alone.",
      "Add the overtime pay to regular wages and recalculate federal tax on the combined total.",
      "Subtract the first result from the second to isolate the tax specifically attributable to the overtime.",
      "Divide that tax by the overtime amount to see the effective marginal rate applied to just the extra pay.",
    ],
    edgeCases: [
      "If regular wages already sit near the top of a tax bracket, overtime pay can push part of it into a higher bracket, raising the marginal rate on just that portion.",
      "FICA tax also applies to overtime pay at the same flat rates as regular wages, and should be added on top of this federal income tax estimate for a full picture.",
      "A single paycheck's withholding (often calculated using an annualized estimate) can look much higher than the actual tax owed on that overtime once the full year is averaged out.",
      "Nonexempt employees' overtime rate itself (time-and-a-half or double-time) is a separate wage-and-hour law question, unrelated to how that pay is taxed once earned.",
    ],
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
    methodology:
      "Effective rate is a blended average across every bracket your income passes through, while marginal rate is a single data point — the rate on the bracket your last dollar landed in. Because the US system is progressive, lower brackets always pull the effective rate down below the marginal rate: the first slice of everyone's income, no matter how high their total earnings, is taxed at the lowest bracket's rate. The gap between the two numbers grows as income rises and passes through more brackets, which is exactly why a high earner's marginal rate (say 37%) can look alarming while their effective rate sits far lower.",
    stepByStep: [
      "Calculate total federal tax owed by running taxable income through all applicable brackets.",
      "Divide total tax owed by total taxable income to get the effective (average) rate.",
      "Separately, identify which bracket the last dollar of income falls into — that bracket's rate is the marginal rate.",
      "Compare the two: the marginal rate will always be equal to or higher than the effective rate.",
    ],
    edgeCases: [
      "Both figures here reflect federal income tax only — adding FICA and state tax to the numerator would produce a higher, more complete effective rate.",
      "Tax credits (as opposed to deductions) reduce tax owed dollar-for-dollar and lower effective rate more than deductions of the same size would.",
      "A raise that increases your marginal rate never decreases your take-home pay — only the income within the new, higher bracket is taxed at that rate, not your entire income.",
      "Effective rate calculated on gross income versus taxable income (after deductions) will produce noticeably different numbers, so it's worth being clear about which base is being used.",
    ],
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
    methodology:
      "Progressive brackets work like a series of buckets stacked on top of each other, each with its own capacity and rate. Your income fills the lowest bucket first, then spills into the next one once the first is full, and so on, with each bucket taxed only at its own rate regardless of how many buckets you eventually fill. This is fundamentally different from a flat tax, where one rate would apply to the entire amount at once — under a bracket system, moving into a new bracket only ever affects the portion of income that falls above the previous bracket's threshold.",
    stepByStep: [
      "List the tax brackets and thresholds for your filing status, in ascending order.",
      "Starting from the lowest bracket, calculate how much of your income falls within each bracket's range.",
      "Multiply the income within each bracket by that bracket's rate to get the tax owed from that slice.",
      "Sum the tax owed across all brackets for your total federal tax liability.",
      "The rate of the highest bracket reached is your marginal rate.",
    ],
    edgeCases: [
      "Bracket thresholds differ significantly by filing status (single, married filing jointly, married filing separately, head of household), so the same income can land in different brackets depending on how you file.",
      "Bracket thresholds are typically adjusted for inflation each year, so a bracket table from a prior year can misstate current thresholds.",
      "Long-term capital gains and qualified dividends use an entirely separate rate schedule (0/15/20%) rather than these ordinary income brackets.",
      "Some tax credits phase out gradually as income rises within a bracket, creating an effective marginal rate on that income that's higher than the stated bracket rate alone would suggest.",
    ],
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
    methodology:
      "The IRS doesn't actually have an 'LLC tax' — the LLC is a state-law legal structure, and the federal government taxes it based on whichever tax classification the owner chooses or defaults into. A single-member LLC defaults to being a 'disregarded entity,' meaning the IRS taxes it exactly as if the LLC didn't exist for federal tax purposes and the business income simply flowed onto the owner's personal return via Schedule C, subject to self-employment tax on the full profit. This is the single biggest reason profitable LLC owners eventually consider an S-Corp election — under default treatment, 100% of profit is exposed to self-employment tax, with no way to shelter any of it in distributions.",
    stepByStep: [
      "Start with net LLC profit (revenue minus deductible business expenses).",
      "Calculate self-employment tax: 92.35% of net profit, then 15.3% of that base.",
      "Subtract half the self-employment tax and your standard deduction from net profit to find taxable income.",
      "Apply federal income tax brackets to that taxable income.",
      "Add self-employment tax and federal income tax together for total estimated federal tax.",
    ],
    edgeCases: [
      "Multi-member LLCs default to partnership taxation rather than disregarded-entity taxation, which involves filing a separate partnership return (Form 1065) even though the tax math per member is similar.",
      "An LLC can elect S-Corp or C-Corp taxation via IRS filing without changing its legal LLC status at all — the election only changes federal tax treatment.",
      "State-level LLC taxes and annual franchise fees are separate from this federal estimate and vary significantly by state.",
      "Business losses in early years can offset other income on the owner's personal return, subject to passive activity and at-risk limitation rules.",
    ],
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
    methodology:
      "The tax mechanics behind an S-Corp election come down to a single distinction the IRS draws between wages and distributions. Wages paid to an owner-employee are subject to FICA payroll tax exactly like any other employee's paycheck (with the S-Corp itself paying the employer half, though economically that cost still comes from the same business). Distributions of remaining profit to a shareholder, by contrast, are not wages at all under the tax code and so never touch FICA. The entire strategy hinges on legitimately splitting profit into a reasonable salary (taxed) and distributions (not taxed for payroll purposes) rather than taking it all as one lump sum the way a sole proprietor must.",
    stepByStep: [
      "Determine total net business profit for the year.",
      "Set a reasonable salary for the owner's role, based on what a similar employee would be paid in the market.",
      "Calculate FICA payroll tax on that salary, doubled to represent both the employee and employer shares (both ultimately come from the business).",
      "The remainder of profit after salary is taken as distributions, which avoid payroll tax entirely.",
      "Compare total payroll tax under the S-Corp split against what self-employment tax would have been on the full profit as a sole proprietor, to see the estimated savings.",
    ],
    edgeCases: [
      "The IRS actively audits S-Corps with salaries that look artificially low relative to the work performed — 'reasonable compensation' is a real legal requirement, not an optional guideline.",
      "S-Corps require running actual payroll, filing a separate corporate tax return, and often more bookkeeping than sole-proprietor taxation, all of which cost money that should be weighed against the payroll tax savings.",
      "At low profit levels, the administrative overhead of an S-Corp can exceed any tax savings, making the election net-negative.",
      "Distributions are still subject to regular federal income tax — the savings here are specifically payroll/self-employment tax, not income tax as a whole.",
    ],
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
    methodology:
      "Before the Tax Cuts and Jobs Act of 2017, C-Corporations were taxed on a graduated bracket system with a top rate of 35%, similar in spirit to individual income tax. The 2017 reform replaced that entirely with one flat rate for every C-Corp, regardless of size or profit level, specifically to simplify corporate tax planning and make US corporate rates more competitive internationally. Net taxable income for this purpose means revenue minus all allowable business deductions, depreciation, and other adjustments — it's a business-level profit figure calculated well before the tax itself is applied.",
    stepByStep: [
      "Calculate total corporate revenue for the tax year.",
      "Subtract all allowable business deductions, including operating expenses, depreciation, and interest, to find net taxable income.",
      "Multiply net taxable income by the flat 21% federal rate to get federal corporate tax owed.",
      "Subtract the tax from net taxable income to find after-tax corporate profit.",
    ],
    edgeCases: [
      "State corporate income tax is entirely separate from this federal calculation and ranges from 0% in some states to well over 9% in others.",
      "Profit distributed to shareholders as dividends is taxed again at the individual level — this 'double taxation' is a defining feature of C-Corp structure that pass-through entities avoid.",
      "Certain industries and corporate structures qualify for specific credits and deductions (R&D credit, Section 199A in limited cases, etc.) that reduce net taxable income below what a simple revenue-minus-expenses calculation would show.",
      "Net operating losses from prior years can typically offset current-year taxable income, subject to specific carryforward limitation rules.",
    ],
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
    methodology:
      "Customs duty is calculated on the 'dutiable value' of a shipment, not just the price of the goods themselves — most customs authorities, including US Customs and Border Protection, use a CIF-style basis (Cost, Insurance, and Freight) that folds shipping and insurance costs into the base before applying the duty rate. The duty rate itself is set by tariff schedules tied to a product's Harmonized System (HS) classification code and its country of origin, which is why identical-looking products can face very different duty rates depending on exactly how they're classified and where they were made.",
    stepByStep: [
      "Determine the declared value of the goods being imported.",
      "Add shipping and insurance costs to the declared value to find the dutiable value.",
      "Look up the applicable duty rate for the product's HS classification and country of origin.",
      "Multiply the dutiable value by the duty rate to find duty owed.",
      "Add the duty back to the dutiable value to find the total landed cost.",
    ],
    edgeCases: [
      "Many countries offer a 'de minimis' threshold below which small shipments owe no duty at all — this threshold varies enormously by country and changes periodically.",
      "Trade agreements between specific countries can reduce or eliminate duty on qualifying goods, which a generic duty-rate lookup won't reflect.",
      "Additional fees like merchandise processing fees, harbor maintenance fees, or anti-dumping duties can apply on top of standard duty and aren't included in this simplified estimate.",
      "Misclassifying a product's HS code (even unintentionally) can result in incorrect duty being charged and potential penalties on customs audit.",
    ],
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
