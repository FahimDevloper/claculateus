import { SeoContent } from "./types";

export const mathContent: Record<string, SeoContent> = {
  scientific: {
    intro:
      "From basic arithmetic to trigonometry, logarithms, and exponents, our Scientific Calculator handles it all in one clean interface — with memory functions, keyboard support, and a full calculation history saved right in your browser. It's built to work as well on a phone during homework as it does on a desktop during a work session.",
    howItWorks:
      "The calculator supports both a Basic mode for everyday arithmetic and a Scientific mode with trigonometric functions (sine, cosine, tangent), logarithms (natural and base-10), exponents, roots, and factorials. You can switch between degrees and radians for trig functions, use memory buttons to store and recall values, and every calculation is automatically logged to a history panel you can export as a CSV.",
    examples: [
      { title: "Basic arithmetic", body: "12 × 8 = 96 — standard order-of-operations arithmetic with instant results as you type." },
      { title: "Scientific function", body: "sin(30°) in Degree mode returns 0.5, matching the well-known trigonometric identity." },
    ],
    advantages: [
      "Combines basic and scientific modes in a single, fast interface",
      "Full keyboard support for quick, mouse-free calculation",
      "Calculation history with CSV export for record-keeping",
      "Memory functions (M+, M−, MR, MC) just like a physical scientific calculator",
    ],
    commonMistakes: [
      "Forgetting to switch between Degree and Radian mode before a trig calculation",
      "Not clearing memory (MC) between unrelated calculations",
      "Assuming factorial works for negative or non-integer numbers (it doesn't)",
      "Overlooking the history panel, which can save time on repeated similar calculations",
    ],
    useCases: [
      "Homework and coursework involving trigonometry or logarithms",
      "Quick everyday arithmetic without opening a separate app",
      "Engineering or scientific estimates on the go",
      "Any calculation where you want a record of past results",
    ],
    conclusion:
      "A good calculator should get out of your way and just work — that's the goal here, whether you're doing quick mental-math verification or a multi-step scientific calculation. Try the Finance and Convert tabs on the same tool for loan payments and unit conversions without leaving the page.",
  },
  percentage: {
    intro:
      "Percentages show up everywhere — discounts, tips, grades, statistics — but the mental math isn't always straightforward, especially for 'what percent' and 'percent change' questions. Our Percentage Calculator handles three common calculations: finding a percentage of a number, finding what percent one number is of another, and finding the percent change between two values.",
    howItWorks:
      "Each of the three modes uses a different but related formula. 'X% of Y' multiplies Y by X divided by 100. 'X is what % of Y' divides X by Y and multiplies by 100. 'Percent change from X to Y' finds the difference between the two values relative to the starting value, which is especially useful for tracking increases or decreases over time.",
    formula: "X% of Y = (X ÷ 100) × Y\nX is what % of Y = (X ÷ Y) × 100\n% change = ((Y − X) ÷ X) × 100",
    examples: [
      { title: "Percentage of a value", body: "20% of 80 = 16 — useful for quickly finding a discount or tip amount." },
      { title: "Percent change", body: "A price moving from $80 to $100 is a +25% change, calculated as (100−80)/80 × 100." },
    ],
    advantages: [
      "Covers three distinct percentage questions in one tool",
      "Clear labeling so you always know which calculation you're running",
      "Instant results with no manual formula lookup needed",
      "Useful across finance, school, shopping, and everyday situations",
    ],
    commonMistakes: [
      "Confusing 'percent change' with 'percentage points' (they aren't the same thing)",
      "Using the wrong base number when calculating a percent change (always the starting value)",
      "Rounding too early in multi-step calculations, causing small errors to compound",
      "Mixing up 'X% of Y' with 'X is what % of Y' — they answer different questions",
    ],
    useCases: [
      "Calculating discounts, markups, and tips",
      "Tracking percentage change in prices, weight, or performance over time",
      "Grading and test score calculations",
      "Quick checks for statistics or reporting",
    ],
    conclusion:
      "Percentages are simple in concept but easy to fumble under time pressure — having a reliable, instant calculator removes that friction. If you're working specifically with discounts or sales prices, our dedicated Discount Calculator adds a few extra conveniences on top of this one.",
  },
  standard: {
    intro:
      "Sometimes you just need a fast, no-frills calculator for everyday arithmetic — no scrolling through scientific functions you don't need. Our Standard Calculator is built for exactly that: quick addition, subtraction, multiplication, and division.",
    howItWorks:
      "The calculator works like any handheld basic calculator, evaluating operations in the order you enter them with support for memory functions (M+, M−, MR, MC) to store and recall values across multiple calculations.",
    examples: [
      { title: "Quick math", body: "Adding up a grocery bill, splitting a total, or checking basic arithmetic — the standard calculator handles it instantly without any extra clutter." },
      { title: "Using memory", body: "Storing a subtotal with M+, continuing other calculations, then recalling it with MR to add back in — useful for multi-step everyday math." },
    ],
    advantages: [
      "Clean, fast interface for everyday arithmetic without scientific function clutter",
      "Memory functions for multi-step calculations",
      "Instant results with no page reloads or delays",
      "Works great on both desktop and mobile",
    ],
    commonMistakes: [
      "Forgetting to clear memory (MC) between unrelated calculation sessions",
      "Using a scientific calculator interface when all you need is basic arithmetic, adding unnecessary complexity",
      "Not double-checking order of operations when chaining several calculations together",
      "Losing track of a running total when memory functions aren't used for multi-step math",
    ],
    useCases: [
      "Quick everyday arithmetic — bills, totals, basic math",
      "Multi-step calculations using memory functions",
      "A faster alternative to reaching for a phone's calculator app",
      "Basic classroom or homework arithmetic",
    ],
    conclusion:
      "For everyday math, simple is better — this calculator skips the scientific functions most people never need. If you do need trigonometry, logarithms, or exponents, our Scientific Calculator has the full function set.",
  },
  average: {
    intro:
      "Mean, median, and mode all describe the 'center' of a data set, but they answer slightly different questions and can tell very different stories about the same numbers. Our Mean, Median & Mode Calculator takes a list of numbers and instantly returns all three, along with range, count, and sum.",
    howItWorks:
      "The mean is the sum of all values divided by how many there are — the number most people mean by 'average.' The median is the middle value when the numbers are sorted (or the average of the two middle values for an even-sized set), which resists being skewed by outliers. The mode is the value that appears most often, useful for categorical or repeated data.",
    formula: "Mean = (sum of values) ÷ (count of values)\nMedian = middle value of sorted data\nMode = most frequently occurring value",
    examples: [
      { title: "Mixed data set", body: "For 4, 8, 15, 16, 23, 42: the mean is 18, the median is 15.5, and there's no repeated value so no mode." },
      { title: "Why median matters", body: "For 10, 12, 13, 14, 90, the mean (27.8) is pulled upward by the outlier 90, while the median (13) better represents the 'typical' value." },
    ],
    advantages: [
      "Calculates mean, median, mode, range, count, and sum in one step",
      "Handles any list of numbers, comma or space separated",
      "Median calculation correctly resists distortion from outliers",
      "Useful for statistics coursework as well as everyday data analysis",
    ],
    commonMistakes: [
      "Using the mean when an outlier-heavy data set would be better represented by the median",
      "Forgetting that a data set can have more than one mode, or none at all",
      "Not sorting data before manually estimating the median (this calculator does it automatically)",
      "Confusing range (max minus min) with standard deviation, which measures spread differently",
    ],
    useCases: [
      "Statistics homework and coursework",
      "Analyzing survey or performance data",
      "Comparing typical values while accounting for outliers",
      "Quick data summaries for reports or presentations",
    ],
    conclusion:
      "Choosing the right 'average' — mean, median, or mode — depends entirely on your data and what question you're trying to answer. This calculator gives you all three at once so you can decide which best represents your numbers, and our Standard Deviation Calculator is a natural next step for understanding how spread out your data really is.",
  },
  fraction: {
    intro:
      "Adding, subtracting, multiplying, or dividing fractions by hand means finding common denominators and simplifying results — easy to get wrong under time pressure. Our Fraction Calculator handles all four operations and automatically simplifies the answer.",
    howItWorks:
      "The calculator applies the standard fraction arithmetic rules for whichever operation you choose — common denominators for addition and subtraction, direct multiplication of numerators and denominators for multiplication, and cross-multiplication for division — then simplifies the result using the greatest common factor.",
    formula: "Addition: a/b + c/d = (ad + bc) / bd\nMultiplication: a/b × c/d = ac / bd\nDivision: a/b ÷ c/d = ad / bc",
    examples: [
      { title: "Adding fractions", body: "1/2 + 1/3 combines to 5/6 after finding the common denominator and simplifying." },
      { title: "Dividing fractions", body: "1/2 ÷ 1/3 cross-multiplies to 3/2, correctly flipping the second fraction before multiplying." },
    ],
    advantages: [
      "Handles all four operations with automatic simplification",
      "Shows both the simplified fraction and its decimal equivalent",
      "Eliminates manual common-denominator and simplification errors",
      "Fast enough for homework, cooking measurements, or any fraction math",
    ],
    commonMistakes: [
      "Forgetting to find a common denominator before adding or subtracting fractions by hand",
      "Not flipping the second fraction when dividing (multiplying by the reciprocal)",
      "Leaving an unsimplified fraction as a final answer",
      "Entering a zero denominator, which makes the fraction undefined",
    ],
    useCases: [
      "Homework and classroom fraction arithmetic",
      "Cooking and baking measurement conversions",
      "DIY and construction measurements often expressed in fractions",
      "Quick verification of manually calculated fraction problems",
    ],
    conclusion:
      "Fraction arithmetic follows consistent rules, but they're easy to mix up under pressure — this handles all four operations correctly and simplifies automatically every time.",
  },
  ratio: {
    intro:
      "Simplifying a ratio to its lowest terms makes comparisons and proportions much easier to read — the same way 8:12 is clearer as 2:3. Our Ratio Simplifier finds that simplest form instantly.",
    howItWorks:
      "The calculator finds the greatest common factor between both numbers in the ratio and divides both sides by it, producing the equivalent ratio in its lowest possible whole-number terms.",
    formula: "Simplified ratio = (A ÷ GCF) : (B ÷ GCF)",
    examples: [
      { title: "Simple simplification", body: "A ratio of 8:12 simplifies to 2:3 after dividing both sides by their greatest common factor of 4." },
      { title: "Already in lowest terms", body: "A ratio of 5:7 stays as 5:7, since 5 and 7 share no common factors other than 1." },
    ],
    advantages: [
      "Instantly finds the true simplest form of any ratio",
      "Uses the same greatest-common-factor math as fraction simplification",
      "Useful for recipes, scale models, mixing ratios, and financial ratios",
      "Works for any two positive whole numbers",
    ],
    commonMistakes: [
      "Assuming a ratio is already simplified without checking for a common factor",
      "Confusing a ratio (A:B) with a fraction (A/B) — related concepts, but used differently in context",
      "Not applying the same simplification consistently when scaling a ratio up or down",
      "Entering non-integer values, which this simplified form assumes are whole numbers",
    ],
    useCases: [
      "Simplifying recipe or mixing ratios to their clearest form",
      "Scale model and map ratio calculations",
      "Comparing financial or statistical ratios in simplest terms",
      "Classroom math involving ratios and proportions",
    ],
    conclusion:
      "A simplified ratio is easier to understand, compare, and scale than one left in its original form. Our Proportion Calculator handles the related task of solving for a missing value across two equivalent ratios.",
  },
  "standard-deviation": {
    intro:
      "Standard deviation measures how spread out a set of numbers is from their average — a small value means the data clusters tightly, a large value means it's spread widely. Our Standard Deviation Calculator finds both population and sample standard deviation from any list of numbers.",
    howItWorks:
      "The calculator finds the mean of your numbers, then the squared difference of each number from that mean, averages those squared differences (dividing by n for population, or n-1 for sample — Bessel's correction, which adjusts for the bias of estimating from a sample), and takes the square root to return to the original units.",
    formula: "Population variance = Σ(x − mean)² ÷ n\nSample variance = Σ(x − mean)² ÷ (n − 1)\nStd. deviation = √variance",
    examples: [
      { title: "Tightly clustered data", body: "The numbers 4, 8, 15, 16, 23, 42 have a specific standard deviation reflecting their spread around the mean of about 18." },
      { title: "Sample vs. population", body: "Sample standard deviation (dividing by n−1) is always slightly larger than population standard deviation (dividing by n) for the same dataset — the correction accounts for extra uncertainty when estimating from a sample rather than measuring an entire population." },
    ],
    advantages: [
      "Calculates both population and sample standard deviation, a frequently confused distinction",
      "Shows variance alongside standard deviation for statistics coursework",
      "Works with any comma or space separated list of numbers",
      "Also shows the mean used in the calculation for transparency",
    ],
    commonMistakes: [
      "Using population standard deviation when the data is actually a sample (or vice versa) — this changes which formula applies",
      "Confusing variance (squared units) with standard deviation (original units) when reporting results",
      "Not entering enough data points — standard deviation needs at least two values to be meaningful",
      "Misinterpreting a low standard deviation as meaning the mean itself is more 'correct' rather than just less variable",
    ],
    useCases: [
      "Statistics coursework and homework involving spread of data",
      "Analyzing variability in a dataset, from test scores to measurements",
      "Quality control and process consistency analysis",
      "Foundational input for further statistical calculations like z-scores",
    ],
    conclusion:
      "Standard deviation is the standard way to quantify how spread out data really is — a concept that becomes much clearer once you can compute it instantly and compare across different datasets. Our Z-Score Calculator builds directly on this to show how far any individual value sits from the mean.",
  },
  probability: {
    intro:
      "Probability of a single event is one of the foundational building blocks of statistics — the ratio of favorable outcomes to total possible outcomes. Our Probability Calculator finds it, along with the equivalent odds format, instantly.",
    howItWorks:
      "The calculator divides your number of favorable outcomes by total possible outcomes to find probability as a decimal and percentage, and separately expresses the same relationship as odds (favorable to unfavorable outcomes).",
    formula: "Probability = favorable outcomes ÷ total outcomes\nOdds = favorable : (total − favorable)",
    examples: [
      { title: "Rolling a die", body: "Rolling a specific number on a standard six-sided die has 1 favorable outcome out of 6 total, giving a probability of about 16.67% and odds of 1:5." },
      { title: "Drawing a card", body: "Drawing a heart from a standard 52-card deck (13 favorable outcomes) gives a probability of 25% and odds of 13:39, which simplifies to 1:3." },
    ],
    advantages: [
      "Shows probability as decimal, percentage, and odds all at once",
      "Simple two-input calculation for any basic probability scenario",
      "Useful foundation for understanding more complex probability concepts",
      "Fast way to check homework or real-world probability questions",
    ],
    commonMistakes: [
      "Confusing probability (a ratio out of total outcomes) with odds (a ratio of favorable to unfavorable outcomes) — they're related but not the same number",
      "Not accounting for whether outcomes are truly equally likely, which this basic formula assumes",
      "Applying single-event probability incorrectly to multiple independent events, which requires multiplying individual probabilities",
      "Forgetting probability must always fall between 0 and 1 (or 0% and 100%)",
    ],
    useCases: [
      "Basic probability homework and coursework",
      "Understanding odds and probability in games of chance",
      "Quick real-world probability estimates",
      "Foundational concept-building for more advanced statistics",
    ],
    conclusion:
      "This handles the foundational single-event case — for counting the number of ways to arrange or select items (often needed before calculating more complex probabilities), our Permutation and Combination calculators pick up where this leaves off.",
  },
  permutation: {
    intro:
      "When the order of selection matters — like ranking the top three finishers in a race — you need permutations, not combinations. Our Permutation Calculator finds nPr, the number of ordered arrangements of r items chosen from a set of n.",
    howItWorks:
      "The calculator multiplies n by each successively smaller integer down to (n − r + 1), the standard permutation formula that counts ordered arrangements without repetition.",
    formula: "P(n, r) = n! ÷ (n − r)!",
    examples: [
      { title: "Race finishing order", body: "Choosing an ordered 1st, 2nd, and 3rd place from 10 racers gives P(10,3) = 720 possible ordered outcomes." },
      { title: "Why order matters", body: "The same 10 racers choosing an unordered group of 3 finalists (see our Combination Calculator) gives a much smaller number, since permutations count every different ordering of the same group separately." },
    ],
    advantages: [
      "Correctly calculates ordered arrangements, distinct from combinations",
      "Handles large n and r values efficiently",
      "Clear error handling when r exceeds n",
      "Standard tool for probability and statistics coursework",
    ],
    commonMistakes: [
      "Using permutations when combinations are actually needed (or vice versa) — the key question is always whether order matters",
      "Forgetting permutations grow extremely fast, producing very large numbers even for modest n and r",
      "Confusing nPr notation with other combinatorics notation",
      "Not validating that r doesn't exceed n before calculating",
    ],
    useCases: [
      "Calculating ordered arrangements for probability and statistics problems",
      "Determining possible outcomes when order matters (rankings, sequences, passwords)",
      "Combinatorics and discrete math coursework",
      "Real-world scenario analysis involving ordered selections",
    ],
    conclusion:
      "The order-matters-or-not question is the single most important thing to get right in combinatorics — permutations count ordered arrangements, while our Combination Calculator counts unordered selections from the same set.",
  },
  combination: {
    intro:
      "When you're selecting a group where order doesn't matter — like picking 3 team members from 10 candidates — combinations, not permutations, give the right count. Our Combination Calculator finds nCr, the number of unordered selections.",
    howItWorks:
      "The calculator divides the permutation count by r factorial (the number of ways to reorder the same selected group), since combinations treat every reordering of the same group as identical.",
    formula: "C(n, r) = n! ÷ (r! × (n − r)!)",
    examples: [
      { title: "Choosing a team", body: "Selecting an unordered group of 3 people from 10 candidates gives C(10,3) = 120 possible combinations — much smaller than the 720 permutations of the same numbers, since order doesn't matter here." },
      { title: "Lottery-style selection", body: "Choosing 6 numbers from 49 (a common lottery format) gives C(49,6) = 13,983,816 — illustrating just how large combination counts can get even from a modest range." },
    ],
    advantages: [
      "Correctly calculates unordered selections, distinct from permutations",
      "Handles large n and r values efficiently",
      "Useful for probability calculations involving groups or subsets",
      "Standard tool across statistics, probability, and combinatorics",
    ],
    commonMistakes: [
      "Using combinations when order actually matters (or vice versa)",
      "Forgetting combinations are always smaller than or equal to the corresponding permutation count",
      "Miscounting n or r, especially in multi-step probability problems combining several combination calculations",
      "Not validating that r doesn't exceed n before calculating",
    ],
    useCases: [
      "Calculating unordered group selections for probability problems",
      "Lottery and card game odds calculations",
      "Team or committee selection counting problems",
      "Combinatorics and discrete math coursework",
    ],
    conclusion:
      "Combinations answer 'how many different groups' while permutations answer 'how many different orderings' — getting that distinction right is the key to solving most combinatorics problems correctly. Our Probability Calculator can then use these counts to find the actual probability of a specific outcome.",
  },
  "random-number": {
    intro:
      "Whether you need a random number for a game, a raffle, a statistical sample, or just to make a quick decision, our Random Number Generator produces genuinely random integers within any range you specify.",
    howItWorks:
      "The generator uses a uniform random distribution to produce integers between your minimum and maximum (inclusive), generating as many numbers as you request in a single batch, up to 50 at a time.",
    examples: [
      { title: "Single random pick", body: "Generating one number between 1 and 100 gives an equal 1-in-100 chance for every integer in that range." },
      { title: "Multiple numbers at once", body: "Generating 5 numbers between 1 and 100 produces 5 independent random picks, which may include repeats since each generation is independent." },
    ],
    advantages: [
      "Fast, uniform random number generation for any integer range",
      "Generates multiple numbers in a single batch",
      "No account or app download needed",
      "Useful for games, raffles, sampling, and decision-making",
    ],
    commonMistakes: [
      "Assuming generated numbers will never repeat within a batch — each number is generated independently, so repeats are possible",
      "Using this for cryptographic or security purposes, which requires specialized cryptographically secure random number generation, not general-purpose randomness",
      "Setting a minimum greater than the maximum, which produces an error",
      "Requesting far more numbers than needed for the actual use case",
    ],
    useCases: [
      "Picking a random winner or raffle number",
      "Generating random samples for games or classroom activities",
      "Quick random decision-making",
      "Basic statistical sampling for coursework",
    ],
    conclusion:
      "This generator is great for games, raffles, and everyday random picks — for anything security-sensitive like passwords or cryptographic keys, use a purpose-built cryptographically secure generator instead.",
  },
  triangle: {
    intro:
      "Given just the three side lengths of a triangle, you can find its area, perimeter, and all three interior angles using classic geometric formulas. Our Triangle Calculator does all of that in one step.",
    howItWorks:
      "The calculator uses Heron's formula to find area directly from the three side lengths, then applies the law of cosines to solve for each interior angle — checking first that the three sides can actually form a valid triangle (the triangle inequality: any two sides must sum to more than the third).",
    formula: "Area (Heron's formula) = √(s(s−a)(s−b)(s−c)), where s = (a+b+c)/2\nAngle A = arccos((b² + c² − a²) / 2bc)",
    examples: [
      { title: "Scalene triangle", body: "Sides of 5, 6, and 7 form a valid triangle with an area of about 14.7 square units and three distinct interior angles." },
      { title: "Invalid triangle", body: "Sides of 2, 3, and 10 fail the triangle inequality (2 + 3 is less than 10), so no actual triangle can be formed with those measurements." },
    ],
    advantages: [
      "Solves for area, perimeter, and all three angles from just the three sides",
      "Validates the triangle inequality automatically, catching impossible inputs",
      "Uses reliable, well-established geometric formulas",
      "Works for any valid triangle — scalene, isosceles, or equilateral",
    ],
    commonMistakes: [
      "Entering side lengths that don't satisfy the triangle inequality, producing no valid triangle",
      "Confusing this general three-sides calculator with the specialized Right Triangle Calculator, which only needs two legs",
      "Not double-checking measurement units are consistent across all three sides",
      "Rounding intermediate values manually, which can introduce small errors compared to the calculator's precise computation",
    ],
    useCases: [
      "Finding a triangle's area and angles from its three side lengths",
      "Geometry homework and coursework",
      "Construction, design, and land surveying calculations",
      "Verifying whether three given measurements can form a real triangle",
    ],
    conclusion:
      "Given just three side lengths, this reveals everything else about a triangle's geometry using proven classical formulas. For the special case of a right triangle solved from its two legs, our Right Triangle Calculator gives a simpler, faster path.",
  },
  "right-triangle": {
    intro:
      "Right triangles show up constantly in construction, design, and geometry problems, and knowing just the two legs is enough to find everything else. Our Right Triangle Calculator finds the hypotenuse, area, and perimeter instantly.",
    howItWorks:
      "The calculator applies the Pythagorean theorem to find the hypotenuse from the two legs, then calculates area (half the product of the two legs, since a right triangle is exactly half of a rectangle) and perimeter (the sum of all three sides).",
    formula: "Hypotenuse c = √(a² + b²)\nArea = ½ × a × b",
    examples: [
      { title: "3-4-5 triangle", body: "Legs of 3 and 4 produce a hypotenuse of exactly 5 — the classic 3-4-5 right triangle, a common reference case." },
      { title: "Different proportions", body: "Legs of 6 and 8 (a scaled-up 3-4-5 triangle) produce a hypotenuse of 10, area of 24, and perimeter of 24 — showing how proportional scaling affects each measurement differently." },
    ],
    advantages: [
      "Finds hypotenuse, area, and perimeter all from just the two legs",
      "Uses the reliable, simple Pythagorean theorem",
      "Faster than the general Triangle Calculator when you specifically have a right triangle",
      "Useful for construction, design, and geometry applications",
    ],
    commonMistakes: [
      "Confusing which sides are the legs versus the hypotenuse when entering values",
      "Using this calculator for a non-right triangle, where the Pythagorean theorem doesn't apply",
      "Not double-checking units are consistent between the two leg measurements",
      "Forgetting area for a right triangle is always half of the two legs multiplied together, not the full product",
    ],
    useCases: [
      "Finding the hypotenuse of a right triangle from its two legs",
      "Construction and carpentry measurements involving right angles",
      "Geometry homework and coursework",
      "Quick area and perimeter calculations for right-angled shapes",
    ],
    conclusion:
      "The Pythagorean theorem is one of the most useful and reliable formulas in practical geometry — this handles the common case of solving for the hypotenuse. Our Pythagorean Theorem Calculator also lets you solve for either leg instead, if that's the missing measurement you need.",
  },
  pythagorean: {
    intro:
      "The Pythagorean theorem is the foundational relationship between a right triangle's three sides, and it's just as useful for finding a missing leg as it is for finding the hypotenuse. Our Pythagorean Theorem Calculator solves for whichever side you're missing.",
    howItWorks:
      "The calculator rearranges the Pythagorean theorem (a² + b² = c²) algebraically depending on which side you're solving for — adding the two known legs' squares and taking the square root for the hypotenuse, or subtracting one leg's square from the hypotenuse's square and taking the square root for a missing leg.",
    formula: "c = √(a² + b²)\na = √(c² − b²)\nb = √(c² − a²)",
    examples: [
      { title: "Solving for the hypotenuse", body: "Legs of 3 and 4 solve directly to a hypotenuse of 5, using the standard forward direction of the theorem." },
      { title: "Solving for a missing leg", body: "A hypotenuse of 10 and one known leg of 6 solves backward to find the other leg equals 8 — the reverse application of the same fundamental relationship." },
    ],
    advantages: [
      "Solves for any of the three sides, not just the hypotenuse",
      "Validates inputs to prevent invalid results (like a negative number under a square root)",
      "Uses the single most fundamental relationship in right-triangle geometry",
      "Works for any right triangle regardless of size",
    ],
    commonMistakes: [
      "Trying to solve for a leg when the hypotenuse entered is smaller than the other known leg, which is mathematically impossible",
      "Confusing which side is the hypotenuse (always opposite the right angle, and always the longest side)",
      "Applying this theorem to a non-right triangle, where it doesn't hold",
      "Mixing up units between the different side measurements",
    ],
    useCases: [
      "Finding any missing side of a right triangle",
      "Construction, carpentry, and design measurements",
      "Geometry homework across all three solve-for variations",
      "Verifying whether a triangle with given measurements is actually a right triangle",
    ],
    conclusion:
      "This flexible solve-for-any-side version of the Pythagorean theorem covers more scenarios than a fixed hypotenuse-only calculator. For area and perimeter calculated directly from the two legs, our Right Triangle Calculator handles that in one step.",
  },
  circle: {
    intro:
      "Every measurement of a circle — area, circumference, diameter — can be derived from just the radius, thanks to the constant relationship defined by π. Our Circle Calculator finds all three instantly.",
    howItWorks:
      "The calculator applies the standard circle formulas directly to your radius: area uses π times radius squared, circumference uses 2π times radius, and diameter is simply twice the radius.",
    formula: "Area = πr²\nCircumference = 2πr\nDiameter = 2r",
    examples: [
      { title: "Standard circle", body: "A circle with radius 5 has an area of about 78.54 square units and a circumference of about 31.42 units." },
      { title: "Scaling relationship", body: "Doubling the radius to 10 doesn't just double the area — it quadruples it to about 314.16 square units, since area scales with the square of the radius." },
    ],
    advantages: [
      "Calculates all three key circle measurements from a single input",
      "Uses precise π rather than a rounded approximation like 3.14",
      "Instant results for any radius value",
      "Useful across geometry, construction, and design applications",
    ],
    commonMistakes: [
      "Confusing radius with diameter, which are exactly half and double of each other — a very common input error",
      "Forgetting area scales with the square of the radius, not linearly",
      "Rounding π too early in manual calculations, introducing small errors",
      "Using circumference and area formulas interchangeably, which are different measurements entirely",
    ],
    useCases: [
      "Geometry homework involving circle measurements",
      "Construction and design projects involving circular elements",
      "Quick area or circumference checks for circular objects",
      "Understanding the mathematical relationships between a circle's measurements",
    ],
    conclusion:
      "All circle measurements trace back to the same radius through consistent, elegant relationships defined by π. Our Area Calculator also covers circles alongside other common shapes if you need a broader shape comparison tool.",
  },
  area: {
    intro:
      "Finding the area of a shape is one of the most common practical math tasks — from flooring projects to garden planning. Our Area Calculator handles squares, rectangles, circles, and triangles in one flexible tool.",
    howItWorks:
      "The calculator applies the correct formula for your selected shape — side squared for a square, length times width for a rectangle, π times radius squared for a circle, or half base times height for a triangle — using the same two input fields relabeled per shape.",
    examples: [
      { title: "Rectangle", body: "A 5 by 8 rectangle has an area of 40 square units — a straightforward length times width calculation." },
      { title: "Circle", body: "A circle with radius 5 has an area of about 78.54 square units, using the π × r² formula instead." },
    ],
    advantages: [
      "Covers four of the most common shapes in one calculator",
      "Applies the correct formula automatically based on your shape selection",
      "Fast for everyday projects — flooring, painting, gardening, and more",
      "Simple two-input interface regardless of which shape you choose",
    ],
    commonMistakes: [
      "Selecting the wrong shape for the actual measurement inputs available",
      "Mixing up which input field represents which dimension for a given shape",
      "Not converting all measurements to the same unit before calculating",
      "Confusing area (square units) with perimeter (linear units) when planning materials",
    ],
    useCases: [
      "Flooring, tiling, painting, and other home improvement material estimates",
      "Garden and landscaping planning",
      "Geometry homework across multiple common shapes",
      "Quick area checks for any square, rectangle, circle, or triangle",
    ],
    conclusion:
      "For three-dimensional shapes instead of flat area, our Volume Calculator applies the same kind of shape-specific formula approach to cubes, spheres, cylinders, cones, and rectangular prisms.",
  },
  volume: {
    intro:
      "Volume calculations come up in everything from shipping and storage to cooking and construction — our Volume Calculator covers the five most common three-dimensional shapes in one tool.",
    howItWorks:
      "The calculator applies the correct volume formula for your selected shape — a cube's side cubed, a sphere's radius-based formula, a cylinder's circular base times height, a cone's third-scaled cylinder formula, or a rectangular prism's length times width times depth.",
    formula: "Cube: V = a³\nSphere: V = (4/3)πr³\nCylinder: V = πr²h\nCone: V = (1/3)πr²h\nPrism: V = l×w×h",
    examples: [
      { title: "Cylinder", body: "A cylinder with radius 4 and height 10 has a volume of about 502.65 cubic units." },
      { title: "Cone vs. cylinder", body: "A cone with the same radius and height has exactly one-third the volume of the equivalent cylinder — about 167.55 cubic units — since the cone formula includes that extra 1/3 factor." },
    ],
    advantages: [
      "Covers five common shapes in one flexible calculator",
      "Applies the correct shape-specific formula automatically",
      "Useful for shipping, storage, construction, and design calculations",
      "Consistent interface across all shapes, adapting labels to each one",
    ],
    commonMistakes: [
      "Selecting the wrong shape for the available measurements",
      "Confusing radius with diameter for sphere, cylinder, or cone inputs",
      "Not converting all measurements to consistent units before calculating",
      "Mixing up volume (cubic units) with surface area (square units) when estimating material needs",
    ],
    useCases: [
      "Shipping and storage container volume estimates",
      "Construction and design material volume calculations",
      "Cooking and recipe scaling involving container volumes",
      "Geometry homework across multiple 3D shapes",
    ],
    conclusion:
      "Volume tells you how much a shape can hold or how much material fills it — for the outer surface measurement of the same shapes instead, our Surface Area Calculator covers cubes, spheres, and cylinders.",
  },
  "surface-area": {
    intro:
      "Surface area — the total area covering the outside of a 3D shape — matters for anything from painting a surface to calculating material needed to wrap or coat an object. Our Surface Area Calculator covers cubes, spheres, and cylinders.",
    howItWorks:
      "The calculator applies the correct surface area formula for your selected shape — six times the side squared for a cube, four times π times radius squared for a sphere, or the combined formula accounting for both circular ends and the curved side for a cylinder.",
    formula: "Cube: SA = 6a²\nSphere: SA = 4πr²\nCylinder: SA = 2πr² + 2πrh",
    examples: [
      { title: "Cube", body: "A cube with 4-unit sides has a surface area of 96 square units — six identical square faces, each 16 square units." },
      { title: "Cylinder", body: "A cylinder with radius 4 and height 10 has a surface area of about 351.86 square units, combining the two circular ends and the curved lateral surface." },
    ],
    advantages: [
      "Covers three common shapes with accurate shape-specific formulas",
      "Distinguishes surface area (outer covering) from volume (interior capacity)",
      "Useful for painting, coating, and material estimation projects",
      "Fast, precise calculations for any size shape",
    ],
    commonMistakes: [
      "Confusing surface area with volume, which measure fundamentally different things (covering versus capacity)",
      "Forgetting a cylinder's surface area includes both circular ends, not just the curved side",
      "Using radius when diameter was measured, or vice versa",
      "Not accounting for material waste or overlap when estimating actual coating or wrapping needs from the raw surface area",
    ],
    useCases: [
      "Estimating paint, coating, or wrapping material needed for an object",
      "Geometry homework involving 3D shape surface area",
      "Manufacturing and packaging material calculations",
      "Comparing surface area to volume ratios for design or scientific purposes",
    ],
    conclusion:
      "Surface area and volume answer different questions about the same shape — covering versus capacity — and it's worth being clear on which one a specific project actually needs. Our Volume Calculator handles the capacity side for the same common shapes.",
  },
  slope: {
    intro:
      "The slope of a line tells you its steepness and direction — essential for algebra, graphing, construction grading, and countless other applications. Our Slope Calculator finds it, along with the full line equation, from any two points.",
    howItWorks:
      "The calculator finds the rise (change in y) divided by the run (change in x) between your two points to get the slope, then uses the point-slope relationship to find the y-intercept and express the full equation in slope-intercept form.",
    formula: "Slope (m) = (y2 − y1) ÷ (x2 − x1)\nEquation: y = mx + b",
    examples: [
      { title: "Positive slope", body: "Points (1,2) and (4,8) produce a slope of 2, meaning y increases by 2 for every 1-unit increase in x, with an equation of y = 2x." },
      { title: "Vertical line", body: "Two points with the same x-coordinate (like (3,1) and (3,7)) have an undefined slope, since a vertical line has no defined rise-over-run relationship." },
    ],
    advantages: [
      "Finds both slope and the complete line equation in one step",
      "Correctly flags undefined slope for vertical lines",
      "Works for any two coordinate points, positive or negative",
      "Standard tool for algebra and coordinate geometry",
    ],
    commonMistakes: [
      "Mixing up which point is (x1,y1) versus (x2,y2), which flips the sign of the slope if done inconsistently",
      "Forgetting a vertical line has an undefined (not zero) slope",
      "Confusing a horizontal line's slope (always 0) with an undefined slope",
      "Not double-checking coordinate signs when points include negative values",
    ],
    useCases: [
      "Algebra and coordinate geometry homework",
      "Finding the equation of a line through two known points",
      "Construction and engineering grade or pitch calculations",
      "Graphing and data trend analysis",
    ],
    conclusion:
      "Slope is one of the most foundational concepts in algebra and shows up constantly in real-world grade and rate-of-change calculations. Our Distance Between Two Points Calculator handles a related coordinate geometry question — the straight-line distance between the same two points.",
  },
  "distance-2d": {
    intro:
      "Finding the straight-line distance between two points on a coordinate plane is a direct application of the Pythagorean theorem — our Distance Calculator handles it instantly for any two points.",
    howItWorks:
      "The calculator finds the difference in x-coordinates and y-coordinates between your two points, then applies the Pythagorean theorem to those differences (treating them as the two legs of a right triangle) to find the straight-line distance.",
    formula: "Distance = √((x2 − x1)² + (y2 − y1)²)",
    examples: [
      { title: "Simple case", body: "The points (0,0) and (3,4) have a distance of exactly 5 — the classic 3-4-5 right triangle applied to coordinate geometry." },
      { title: "Points with negative coordinates", body: "The formula works identically for negative coordinates — the squared differences make the sign of each coordinate irrelevant to the final distance." },
    ],
    advantages: [
      "Direct, precise application of the Pythagorean theorem to coordinate geometry",
      "Works for any two points, including negative coordinates",
      "Fast enough for repeated distance checks across multiple point pairs",
      "Standard tool for geometry, mapping, and design applications",
    ],
    commonMistakes: [
      "Mixing up which point is which when calculating the coordinate differences",
      "Forgetting the formula works the same regardless of coordinate sign, since differences are squared",
      "Confusing straight-line (Euclidean) distance with grid-based (Manhattan) distance, which is calculated differently",
      "Not accounting for the actual scale of the coordinate system (units per grid square) when interpreting the result",
    ],
    useCases: [
      "Coordinate geometry homework and coursework",
      "Mapping and design applications involving point-to-point distances",
      "Game development and physics calculations",
      "Verifying distances in scaled drawings or blueprints",
    ],
    conclusion:
      "This is the Pythagorean theorem applied directly to coordinate points — the same fundamental relationship used in our Right Triangle and Pythagorean Theorem calculators, just reframed for coordinate geometry. Our Midpoint Calculator finds the related halfway point between the same two coordinates.",
  },
  midpoint: {
    intro:
      "The midpoint between two coordinate points is simply the average of their x-coordinates and the average of their y-coordinates — a simple but frequently needed calculation in geometry and design. Our Midpoint Calculator finds it instantly.",
    howItWorks:
      "The calculator averages the x-coordinates of your two points and separately averages the y-coordinates, producing the exact coordinate point that sits halfway between them.",
    formula: "Midpoint = ((x1 + x2) ÷ 2, (y1 + y2) ÷ 2)",
    examples: [
      { title: "Simple case", body: "The points (0,0) and (6,8) have a midpoint of (3,4) — exactly halfway between them on both axes." },
      { title: "Points with negative coordinates", body: "The points (-4,2) and (6,-8) have a midpoint of (1,-3), showing the averaging works the same regardless of coordinate sign." },
    ],
    advantages: [
      "Simple, precise calculation for any two coordinate points",
      "Works identically regardless of positive or negative coordinates",
      "Useful across geometry, design, and mapping applications",
      "Fast enough for repeated midpoint checks across multiple point pairs",
    ],
    commonMistakes: [
      "Averaging x and y coordinates across the wrong points if labels get mixed up",
      "Confusing midpoint (a specific coordinate) with distance (a single number representing length)",
      "Not double-checking signs carefully when coordinates include negative values",
      "Assuming midpoint calculations extend to three points, when the formula specifically applies to exactly two",
    ],
    useCases: [
      "Coordinate geometry homework and coursework",
      "Finding the center point of a line segment for design or construction",
      "Mapping applications needing a halfway point between two locations",
      "Game development and computer graphics calculations",
    ],
    conclusion:
      "Midpoint calculations are simple but come up constantly in geometry and design work. Our Distance Between Two Points Calculator handles the complementary question — how far apart the same two points actually are.",
  },
  quadratic: {
    intro:
      "Solving a quadratic equation by hand means either factoring (which doesn't always work cleanly) or applying the quadratic formula (which handles every case). Our Quadratic Equation Solver applies that formula to find the roots of any equation in the form ax² + bx + c = 0.",
    howItWorks:
      "The calculator computes the discriminant (b² − 4ac) to determine the nature of the roots — two real roots if positive, one repeated real root if exactly zero, or two complex roots if negative — then applies the quadratic formula accordingly.",
    formula: "x = (−b ± √(b² − 4ac)) ÷ 2a",
    examples: [
      { title: "Two real roots", body: "x² − 3x + 2 = 0 has a positive discriminant, producing two real roots: x = 2 and x = 1." },
      { title: "Complex roots", body: "An equation with a negative discriminant, like x² + x + 1 = 0, has no real solutions — the calculator returns the two complex roots instead." },
    ],
    advantages: [
      "Handles all three cases — two real roots, one repeated root, or complex roots — automatically",
      "Uses the reliable, universal quadratic formula rather than factoring, which doesn't always work cleanly",
      "Validates that 'a' isn't zero, since that would make the equation linear, not quadratic",
      "Fast, precise results for any coefficient values",
    ],
    commonMistakes: [
      "Entering a = 0, which turns the equation linear and makes the quadratic formula inapplicable",
      "Sign errors when entering negative coefficients for b or c",
      "Expecting only real number solutions when the discriminant is negative — complex roots are a valid, correct answer",
      "Confusing the two roots' signs when the discriminant produces a plus-or-minus result",
    ],
    useCases: [
      "Algebra homework and coursework involving quadratic equations",
      "Physics and engineering problems modeled by quadratic relationships",
      "Verifying manually factored or completed-square solutions",
      "Understanding the relationship between the discriminant and root type",
    ],
    conclusion:
      "The quadratic formula works for every quadratic equation, unlike factoring, which only works cleanly for some — this handles all three root-type cases automatically and correctly every time.",
  },
  exponent: {
    intro:
      "Raising a number to a power — whether it's a small whole number exponent or something more unusual like a negative or fractional one — is a fundamental operation across math and science. Our Exponent Calculator handles any base and exponent combination.",
    howItWorks:
      "The calculator applies standard exponentiation to your base and exponent values, correctly handling positive, negative, zero, and fractional exponents according to the standard mathematical rules for each case.",
    formula: "Result = base^exponent",
    examples: [
      { title: "Standard positive exponent", body: "2 raised to the 10th power equals 1,024 — doubling ten times over." },
      { title: "Negative exponent", body: "2 raised to the -3 power equals 0.125 (or 1/8), since a negative exponent represents the reciprocal of the positive-exponent result." },
    ],
    advantages: [
      "Handles positive, negative, zero, and fractional exponents correctly",
      "Fast, precise results for any base and exponent combination",
      "Useful across algebra, science, and finance calculations involving exponential growth",
      "Simple two-input interface",
    ],
    commonMistakes: [
      "Forgetting a negative exponent means a reciprocal, not a negative result",
      "Confusing a fractional exponent with a root operation, though they're mathematically related (x^(1/2) equals the square root of x)",
      "Not accounting for how quickly results grow (or shrink) with larger exponents",
      "Mixing up base and exponent when entering values",
    ],
    useCases: [
      "Algebra and pre-calculus homework involving exponents",
      "Science calculations involving exponential relationships",
      "Understanding exponential growth and decay concepts",
      "Quick verification of manually calculated exponent problems",
    ],
    conclusion:
      "Exponents follow consistent, learnable rules across positive, negative, and fractional cases — this calculator applies them correctly every time. Our Nth Root Calculator handles the closely related inverse operation.",
  },
  log: {
    intro:
      "Logarithms answer the question 'what power do I need to raise this base to get this number' — the inverse of exponentiation. Our Logarithm Calculator finds the log in any base, plus the commonly used natural log and log base 10.",
    howItWorks:
      "The calculator uses the change-of-base formula to compute the logarithm in your specified base from natural logarithms, which most computing systems calculate directly, then also shows the natural log (base e) and common log (base 10) for reference.",
    formula: "log_b(x) = ln(x) ÷ ln(b)",
    examples: [
      { title: "Log base 10", body: "log₁₀(100) = 2, since 10 raised to the power of 2 equals 100." },
      { title: "Custom base", body: "log₂(8) = 3, since 2 raised to the power of 3 equals 8 — useful in computer science contexts involving binary." },
    ],
    advantages: [
      "Calculates logarithms in any base, not just the common base-10 or natural log",
      "Shows natural log and log base 10 alongside the custom-base result for reference",
      "Validates inputs to prevent invalid operations (negative or zero values, base of 1)",
      "Useful across algebra, science, and computer science applications",
    ],
    commonMistakes: [
      "Attempting to take the log of a negative number or zero, which is undefined for real numbers",
      "Using a base of 1, which makes the logarithm undefined (any power of 1 is always 1)",
      "Confusing natural log (ln, base e) with common log (base 10) — they're different functions with different bases",
      "Not recognizing logarithms and exponents as inverse operations of each other",
    ],
    useCases: [
      "Algebra and pre-calculus homework involving logarithms",
      "Science calculations involving pH, decibels, or other log-scale measurements",
      "Computer science calculations involving binary (log base 2)",
      "Understanding the inverse relationship between logs and exponents",
    ],
    conclusion:
      "Logarithms are the mathematical inverse of exponents, and understanding one deepens understanding of the other. Our Exponent Calculator handles the forward direction — raising a base to a given power — that logarithms undo.",
  },
  root: {
    intro:
      "Beyond the familiar square root, many problems call for cube roots or other nth roots — our Nth Root Calculator handles any root of any number, not just the square root.",
    howItWorks:
      "The calculator raises your value to the power of 1 divided by n (the root you're finding), which is mathematically equivalent to taking the nth root — with special handling for negative values under even roots, which have no real solution.",
    formula: "nth root of x = x^(1/n)",
    examples: [
      { title: "Cube root", body: "The cube root of 27 is exactly 3, since 3 cubed equals 27." },
      { title: "Even root of a negative number", body: "The square root of a negative number has no real solution, since no real number squared produces a negative result — the calculator flags this case explicitly." },
    ],
    advantages: [
      "Handles any root, not just the common square and cube roots",
      "Correctly flags invalid inputs, like even roots of negative numbers",
      "Handles negative values under odd roots correctly (which do have real solutions)",
      "Fast, precise results for any value and root combination",
    ],
    commonMistakes: [
      "Trying to take an even root (square root, 4th root, etc.) of a negative number, which has no real solution",
      "Confusing nth roots with exponents, though they're mathematically related as inverse operations",
      "Not recognizing that odd roots (cube root, 5th root, etc.) of negative numbers do have valid real solutions",
      "Rounding intermediate steps manually, introducing small errors versus the calculator's precise computation",
    ],
    useCases: [
      "Algebra and pre-calculus homework involving roots beyond square root",
      "Science and engineering calculations involving root relationships",
      "Verifying manually calculated root problems",
      "Understanding the inverse relationship between roots and exponents",
    ],
    conclusion:
      "Roots and exponents are inverse operations of each other, and this calculator handles the full range of root calculations beyond just the common square root. Our Exponent Calculator covers the reverse direction if you need to raise a number to a power instead.",
  },
  factorial: {
    intro:
      "Factorial — the product of every positive integer up to a given number — grows explosively fast and shows up constantly in probability, combinatorics, and statistics. Our Factorial Calculator finds it instantly for any non-negative integer.",
    howItWorks:
      "The calculator multiplies every integer from 1 up to your entered number together to find the factorial, with special handling for 0! (defined as 1 by mathematical convention) and validation to prevent inputs too large to compute reliably.",
    formula: "n! = n × (n−1) × (n−2) × ... × 2 × 1",
    examples: [
      { title: "Small factorial", body: "5! = 5 × 4 × 3 × 2 × 1 = 120." },
      { title: "Explosive growth", body: "10! already equals 3,628,800 — factorials grow so fast that even modest numbers produce enormous results very quickly." },
    ],
    advantages: [
      "Handles factorial calculation instantly for any valid non-negative integer",
      "Correctly defines 0! as 1, a common point of confusion",
      "Formats large results with proper number separators for readability",
      "Foundational tool for permutation, combination, and probability calculations",
    ],
    commonMistakes: [
      "Forgetting 0! equals 1 by mathematical definition, not 0",
      "Attempting negative or non-integer factorial inputs, which aren't defined by this basic formula",
      "Underestimating how quickly factorials grow — by n=170, results exceed what standard floating-point numbers can represent precisely",
      "Confusing factorial notation (n!) with other mathematical notations",
    ],
    useCases: [
      "Probability and combinatorics homework involving factorial calculations",
      "Foundational calculations for permutations and combinations",
      "Statistics coursework involving factorial-based formulas",
      "Understanding how quickly factorial growth accelerates",
    ],
    conclusion:
      "Factorials are the building block behind both permutations and combinations — our Permutation and Combination calculators apply this same underlying concept to count ordered and unordered arrangements respectively.",
  },
  "gcf-lcm": {
    intro:
      "Greatest common factor and least common multiple are two related but different concepts that come up constantly in fraction simplification, scheduling problems, and number theory. Our GCF and LCM Calculator finds both at once for any list of numbers.",
    howItWorks:
      "The calculator uses the Euclidean algorithm to find the greatest common factor across all entered numbers, then uses the relationship between GCF and LCM (their product equals the product of the two numbers) to find the least common multiple as well.",
    formula: "GCF: found via the Euclidean algorithm\nLCM(a,b) = (a × b) ÷ GCF(a,b)",
    examples: [
      { title: "GCF and LCM together", body: "The numbers 12, 18, and 30 have a GCF of 6 and an LCM of 180 — the largest number that divides all three evenly, and the smallest number all three divide into evenly." },
      { title: "Coprime numbers", body: "Numbers with no common factors other than 1 (like 7 and 9) have a GCF of 1 and an LCM equal to their simple product, 63." },
    ],
    advantages: [
      "Calculates both GCF and LCM together, since they're often needed in tandem",
      "Handles any list of two or more positive integers, not just pairs",
      "Uses the efficient Euclidean algorithm for reliable results even with large numbers",
      "Useful for fraction simplification and scheduling problems alike",
    ],
    commonMistakes: [
      "Confusing GCF (greatest common factor, used for simplifying) with LCM (least common multiple, used for finding common denominators)",
      "Entering non-integer or negative values, which this calculation assumes are positive whole numbers",
      "Not recognizing that GCF is always less than or equal to the smallest input number",
      "Forgetting LCM is always greater than or equal to the largest input number",
    ],
    useCases: [
      "Simplifying fractions using the greatest common factor",
      "Finding common denominators using the least common multiple",
      "Scheduling problems involving recurring events at different intervals",
      "Number theory homework and coursework",
    ],
    conclusion:
      "GCF and LCM are two sides of the same underlying number relationship, and having both at once saves a step in problems that need either. Our Fraction Calculator uses this same GCF logic internally to automatically simplify fraction results.",
  },
  "long-division": {
    intro:
      "Long division by hand is a multi-step process that's easy to make small errors in — our Long Division Calculator gives the quotient, remainder, and decimal result instantly for any two integers.",
    howItWorks:
      "The calculator performs integer division to find the whole-number quotient, calculates the remainder as what's left over, and separately provides the full decimal result for comparison — three different but related ways to express the same division.",
    formula: "Quotient = ⌊dividend ÷ divisor⌋\nRemainder = dividend mod divisor",
    examples: [
      { title: "With a remainder", body: "987 divided by 7 gives a quotient of 141 with no remainder, since 7 divides evenly into 987." },
      { title: "Non-even division", body: "988 divided by 7 gives a quotient of 141 with a remainder of 1, since 7 × 141 = 987, leaving 1 left over." },
    ],
    advantages: [
      "Shows quotient, remainder, and full decimal result together",
      "Fast, error-free alternative to manual long division",
      "Validates against division by zero",
      "Useful for checking manually worked long division problems",
    ],
    commonMistakes: [
      "Confusing the quotient (whole number result) with the full decimal result",
      "Making arithmetic errors during manual long division that this tool catches instantly",
      "Attempting to divide by zero, which is mathematically undefined",
      "Not double-checking which number is the dividend versus the divisor",
    ],
    useCases: [
      "Checking manually worked long division homework problems",
      "Quick division calculations needing both quotient and remainder",
      "Elementary and middle school math coursework",
      "Verifying divisibility and remainder patterns",
    ],
    conclusion:
      "Long division follows a consistent process, but it's easy to slip up on a step — this gives an instant, error-free check for the quotient, remainder, and decimal result all at once.",
  },
  "matrix-2x2": {
    intro:
      "For a 2x2 matrix, the determinant, trace, and inverse can all be found with straightforward formulas — no need for more complex row-reduction methods used for larger matrices. Our 2x2 Matrix Calculator finds all three instantly.",
    howItWorks:
      "The calculator computes the determinant (ad − bc) directly from the four matrix entries, the trace (a + d, the sum of the diagonal entries), and — if the determinant isn't zero — the inverse matrix using the standard 2x2 inverse formula.",
    formula: "Determinant = ad − bc\nTrace = a + d\nInverse = (1/det) × [[d, −b], [−c, a]]",
    examples: [
      { title: "Standard matrix", body: "A matrix with entries a=4, b=7, c=2, d=6 has a determinant of 10 (4×6 − 7×2), a trace of 10, and a valid inverse since the determinant is non-zero." },
      { title: "Singular matrix", body: "A matrix where ad equals bc has a determinant of exactly 0, meaning no inverse exists — the calculator correctly omits the inverse for this case." },
    ],
    advantages: [
      "Calculates determinant, trace, and inverse (when it exists) in one step",
      "Correctly identifies when a matrix has no inverse (a zero determinant)",
      "Uses the direct 2x2-specific formulas, faster than general matrix methods",
      "Useful for linear algebra coursework and applications",
    ],
    commonMistakes: [
      "Entering matrix values in the wrong position (a, b, c, d correspond to specific row-column positions)",
      "Expecting an inverse to exist for every matrix — a zero determinant means the matrix is singular and has no inverse",
      "Confusing determinant with trace, which are different single-number summaries of the same matrix",
      "Applying this 2x2-specific approach to larger matrices, which require different, more general methods",
    ],
    useCases: [
      "Linear algebra homework involving 2x2 matrix operations",
      "Verifying manually calculated determinant, trace, or inverse results",
      "Understanding when a matrix is invertible versus singular",
      "Quick matrix calculations for engineering or physics applications",
    ],
    conclusion:
      "2x2 matrices have clean, direct formulas that larger matrices don't share — this calculator takes advantage of that simplicity for instant, reliable results.",
  },
  "base-converter": {
    intro:
      "Numbers can be represented in different bases — binary, octal, decimal, and hexadecimal are the most common in computing — and converting between them is essential for programming and computer science work. Our Number Base Converter handles all four at once.",
    howItWorks:
      "The calculator parses your input value according to your selected source base, then converts that underlying numeric value into each target base's representation — binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16).",
    examples: [
      { title: "Decimal to other bases", body: "The decimal number 255 converts to 11111111 in binary, 377 in octal, and FF in hexadecimal — all representing the exact same underlying quantity." },
      { title: "Binary to decimal", body: "The binary number 1010 (entered with binary as the source base) converts to 10 in decimal — a common conversion in programming and computer science contexts." },
    ],
    advantages: [
      "Converts to all four common bases at once, not just one target base",
      "Handles binary, octal, decimal, and hexadecimal — the bases most relevant to computing",
      "Validates input against the selected source base, catching invalid entries",
      "Fast, essential tool for programming and computer science work",
    ],
    commonMistakes: [
      "Entering digits invalid for the selected base (like using '8' or '9' in an octal number)",
      "Confusing hexadecimal's letter digits (A-F representing 10-15) with decimal digits",
      "Not selecting the correct source base before entering a value",
      "Assuming a number 'looks like' a certain base just from its digits, without explicitly specifying the source base",
    ],
    useCases: [
      "Programming and computer science coursework involving number base conversions",
      "Converting between binary, hex, and decimal for low-level programming work",
      "Computer science education and understanding number representation",
      "Quick verification of manually converted base representations",
    ],
    conclusion:
      "Number base conversion is a foundational computer science skill, and having all four common bases converted at once saves repeated lookups. This handles the most common bases used across programming and digital systems work.",
  },
  "scientific-notation": {
    intro:
      "Very large or very small numbers are much easier to read and work with in scientific notation than as long strings of digits. Our Scientific Notation Converter transforms any standard number into that compact mantissa-and-exponent format.",
    howItWorks:
      "The calculator finds the appropriate power-of-10 exponent for your number, then divides by that power of 10 to find the mantissa (a number between 1 and 10), expressing the original value as mantissa times 10 raised to that exponent.",
    formula: "Number = mantissa × 10^exponent, where 1 ≤ mantissa < 10",
    examples: [
      { title: "Large number", body: "1,230,000 converts to 1.23 × 10⁶ in scientific notation — much more compact and readable than the full number." },
      { title: "Small number", body: "A very small number like 0.000452 converts to 4.52 × 10⁻⁴, using a negative exponent to represent numbers less than 1." },
    ],
    advantages: [
      "Converts any number, large or small, into standard scientific notation",
      "Correctly handles both positive exponents (large numbers) and negative exponents (small numbers)",
      "Useful across science, engineering, and math coursework",
      "Makes very large or very small numbers much easier to read and compare",
    ],
    commonMistakes: [
      "Forgetting the mantissa must always be between 1 and 10 in proper scientific notation",
      "Confusing the sign of the exponent — positive for numbers greater than 10, negative for numbers less than 1",
      "Not recognizing scientific notation as equivalent to, not different from, the original number's value",
      "Rounding the mantissa inconsistently when comparing multiple scientific notation values",
    ],
    useCases: [
      "Science and engineering coursework involving very large or small measurements",
      "Converting calculator or computer output into readable scientific notation",
      "Comparing the relative size of very large or very small numbers",
      "Chemistry, physics, and astronomy calculations involving extreme values",
    ],
    conclusion:
      "Scientific notation makes extreme numbers manageable and comparable — a skill used constantly across the sciences. This conversion handles the math so you can focus on interpreting the result.",
  },
  rounding: {
    intro:
      "Rounding a number seems simple until you need floor, ceiling, and standard rounding all compared side by side — our Rounding Calculator shows all three at your chosen decimal precision.",
    howItWorks:
      "The calculator applies standard rounding (to the nearest value), floor (always rounding down), and ceiling (always rounding up) to your number at your specified number of decimal places, showing all three results together for comparison.",
    examples: [
      { title: "Standard case", body: "3.14159 rounded to 2 decimal places gives 3.14 (standard rounding), with a floor of 3.14 and ceiling of 3.15 at that same precision." },
      { title: "Why the three differ", body: "For a number like 3.145 rounded to 2 places, standard rounding, floor, and ceiling can each produce a different result — useful to see explicitly when precision matters for a specific application." },
    ],
    advantages: [
      "Shows standard rounding, floor, and ceiling together for direct comparison",
      "Works for any number of decimal places",
      "Useful for understanding exactly how different rounding methods diverge",
      "Fast, precise results for any input number",
    ],
    commonMistakes: [
      "Assuming standard rounding, floor, and ceiling always produce the same result — they only match in specific cases",
      "Not choosing the appropriate rounding method for a given context (financial calculations often specifically require one method over another)",
      "Confusing decimal place rounding with significant figure rounding, which are related but distinct concepts",
      "Rounding intermediate calculation steps manually, which can introduce cumulative errors versus rounding only the final result",
    ],
    useCases: [
      "Understanding the difference between standard rounding, floor, and ceiling",
      "Financial and scientific calculations requiring a specific rounding method",
      "Homework and coursework involving rounding precision",
      "Verifying manually rounded calculations",
    ],
    conclusion:
      "The right rounding method depends on context — standard rounding for most everyday purposes, floor or ceiling when a specific direction is required. Our Significant Figures Calculator handles the related but distinct concept of rounding to a specific number of significant digits.",
  },
  "prime-check": {
    intro:
      "A prime number has exactly two factors — 1 and itself — and checking whether a number is prime is a fundamental building block of number theory. Our Prime Number Checker tests any number and shows its factors if it isn't prime.",
    howItWorks:
      "The calculator tests for factors up to the square root of your number (since any factor larger than the square root would have a corresponding factor smaller than it, already found), listing all factor pairs found — if none exist, the number is prime.",
    examples: [
      { title: "Prime number", body: "97 has no factors other than 1 and itself, confirming it's prime." },
      { title: "Composite number", body: "91 might look prime at a glance, but it factors as 7 × 13, revealing it's actually composite, not prime." },
    ],
    advantages: [
      "Efficiently checks primality by testing only up to the square root of the number",
      "Shows the actual factors when a number isn't prime, not just a yes/no answer",
      "Fast even for larger numbers, thanks to the square-root optimization",
      "Useful for number theory coursework and general curiosity",
    ],
    commonMistakes: [
      "Assuming a number 'looks prime' just because it's odd or has no obvious small factors",
      "Forgetting that 1 is not considered prime by mathematical definition (primes must have exactly two distinct factors)",
      "Not recognizing that even numbers greater than 2 can never be prime, since they're always divisible by 2",
      "Confusing prime numbers with coprime numbers, which is an entirely different concept",
    ],
    useCases: [
      "Number theory homework and coursework",
      "Quickly checking whether a specific number is prime",
      "Cryptography and computer science education involving prime numbers",
      "General mathematical curiosity and exploration",
    ],
    conclusion:
      "Primality testing is foundational to number theory and has real applications in cryptography, where large prime numbers underpin modern encryption. This handles the check efficiently for any number you're curious about.",
  },
  "sig-fig": {
    intro:
      "Significant figures indicate the precision of a measurement, and correctly counting or rounding to them matters throughout science and engineering. Our Significant Figures Calculator counts the sig figs in a number and rounds to any target count.",
    howItWorks:
      "The calculator applies standard significant figure counting rules — all non-zero digits are significant, zeros between non-zero digits are significant, leading zeros are not, and trailing zeros after a decimal point are significant — then rounds to your target number of sig figs using standard precision rounding.",
    examples: [
      { title: "Counting sig figs", body: "0.004520 has 4 significant figures — the leading zeros don't count, but the trailing zero after the decimal does." },
      { title: "Rounding to sig figs", body: "Rounding 0.004520 to 2 significant figures gives 0.0045 — keeping only the first two significant digits." },
    ],
    advantages: [
      "Correctly applies standard significant figure counting rules, including tricky leading/trailing zero cases",
      "Rounds to any target number of significant figures, not just decimal places",
      "Useful for chemistry, physics, and engineering coursework where precision matters",
      "Fast way to check manually counted significant figures",
    ],
    commonMistakes: [
      "Counting leading zeros as significant, when they never are",
      "Forgetting trailing zeros after a decimal point are significant, unlike trailing zeros in a whole number without a decimal shown",
      "Confusing significant figure rounding with simple decimal place rounding, which are different concepts",
      "Not applying sig fig rules consistently across multi-step scientific calculations",
    ],
    useCases: [
      "Chemistry and physics coursework involving measurement precision",
      "Engineering calculations requiring appropriate significant figure rounding",
      "Verifying manually counted significant figures",
      "Understanding measurement precision in scientific contexts",
    ],
    conclusion:
      "Significant figures communicate how precise a measurement actually is — rounding to the wrong number of sig figs can imply false precision or lose real precision. Our Rounding Calculator handles the related but distinct concept of decimal-place-based rounding.",
  },
  "half-life": {
    intro:
      "Radioactive decay, drug elimination, and other exponential decay processes all follow the same half-life pattern — a fixed proportion decays in each equal time interval. Our Half-Life Calculator finds the remaining quantity after any elapsed time.",
    howItWorks:
      "The calculator applies the standard exponential decay formula, raising one-half to the power of elapsed time divided by half-life, and multiplying by the initial quantity to find how much remains.",
    formula: "Remaining = initial × 0.5^(elapsed ÷ half-life)",
    examples: [
      { title: "Multiple half-lives elapsed", body: "100 units with a half-life of 5 time units, after 12 time units have elapsed, leaves about 21.76 units remaining — a bit less than a quarter, since 12 time units is a bit more than 2 full half-lives." },
      { title: "Exactly one half-life", body: "The same 100 units after exactly 5 time units (one full half-life) leaves exactly 50 units — half the original amount, by definition." },
    ],
    advantages: [
      "Applies the precise exponential decay formula rather than a rough approximation",
      "Shows both remaining quantity and percentage remaining",
      "Works for any half-life and elapsed time combination, in any consistent time units",
      "Useful across chemistry, physics, pharmacology, and other decay-related fields",
    ],
    commonMistakes: [
      "Assuming decay is linear rather than exponential — the amount lost per unit time actually decreases over time, not staying constant",
      "Mixing time units between half-life and elapsed time (both must be in the same units)",
      "Confusing half-life with the total time for complete decay, when technically a substance never fully reaches zero in this model",
      "Not accounting for real-world half-life values, which vary enormously — from fractions of a second to billions of years",
    ],
    useCases: [
      "Chemistry and physics coursework involving radioactive decay",
      "Pharmacology calculations involving drug elimination half-life",
      "Understanding exponential decay processes generally",
      "Verifying manually calculated decay problems",
    ],
    conclusion:
      "Half-life decay is exponential, not linear — a distinction that surprises many people encountering it for the first time. This calculator applies the precise formula so you can see exactly how much remains at any point in the decay process.",
  },
  density: {
    intro:
      "Density — mass per unit volume — is a fundamental physical property used to identify materials and calculate weight-to-size relationships. Our Density Calculator finds it instantly from mass and volume.",
    howItWorks:
      "The calculator divides your entered mass by volume to find density in grams per cubic centimeter, the standard unit for comparing common material densities.",
    formula: "Density = mass ÷ volume",
    examples: [
      { title: "Water reference point", body: "500 grams of a substance occupying 200 cubic centimeters has a density of 2.5 g/cm³ — notably denser than water, which has a density of 1 g/cm³." },
      { title: "Identifying materials", body: "Comparing a calculated density against known reference values (water at 1 g/cm³, aluminum at about 2.7 g/cm³, gold at about 19.3 g/cm³) can help identify an unknown material." },
    ],
    advantages: [
      "Simple, direct calculation from mass and volume",
      "Uses the standard g/cm³ unit for easy comparison against reference material densities",
      "Useful for science coursework and material identification",
      "Fast way to check manually calculated density problems",
    ],
    commonMistakes: [
      "Using inconsistent units between mass and volume measurements",
      "Confusing density (mass per volume) with specific gravity (density relative to water), which are related but different measurements",
      "Not accounting for temperature effects on density for materials where it matters significantly",
      "Assuming a substance is uniform throughout when it may have air pockets or varying composition",
    ],
    useCases: [
      "Chemistry and physics coursework involving density calculations",
      "Material identification using known density reference values",
      "Verifying manually calculated density problems",
      "Understanding buoyancy and material property concepts",
    ],
    conclusion:
      "Density is one of the most useful physical properties for identifying and comparing materials — a quick calculation here, checked against reference density tables, can often identify an unknown substance.",
  },
  interpolation: {
    intro:
      "When you have two known data points but need to estimate a value somewhere between them, linear interpolation provides a straightforward, widely used method. Our Linear Interpolation Calculator finds that estimated value instantly.",
    howItWorks:
      "The calculator finds the linear relationship (a straight line) between your two known points, then evaluates that line at your target x-value to estimate the corresponding y-value — assuming the relationship between the two known points is approximately linear.",
    formula: "y = y1 + ((y2 − y1) × (x − x1)) ÷ (x2 − x1)",
    examples: [
      { title: "Estimating a middle value", body: "Given points (0,0) and (10,100), interpolating at x=4 gives an estimated y-value of 40, following the straight-line relationship between the two known points." },
      { title: "Real-world application", body: "If a table only lists values at every 10 units of x, interpolation estimates the value at any point in between, like x=4, without needing the full underlying dataset." },
    ],
    advantages: [
      "Provides a quick, reasonable estimate between two known data points",
      "Simple, widely applicable formula used across science, engineering, and finance",
      "Fast way to fill in gaps in a lookup table or dataset",
      "Works for any two known points and any target x-value",
    ],
    commonMistakes: [
      "Using linear interpolation when the actual underlying relationship is significantly non-linear, which introduces real error",
      "Extrapolating far beyond the range of the two known points, where linear interpolation becomes much less reliable",
      "Mixing up which point is (x1,y1) versus (x2,y2)",
      "Treating an interpolated estimate as an exact measured value rather than an approximation",
    ],
    useCases: [
      "Estimating values between known data points in a table or dataset",
      "Engineering and scientific calculations involving lookup tables",
      "Finance and statistics applications requiring intermediate value estimates",
      "Filling gaps in incomplete datasets with reasonable estimates",
    ],
    conclusion:
      "Linear interpolation is a simple, practical tool for estimating between known points — just remember it assumes a straight-line relationship, which works well for closely-spaced points but becomes less reliable the further you stray from the known data.",
  },
  "percentage-error": {
    intro:
      "Comparing an experimental or measured value against a known true value is a core part of scientific method — percentage error quantifies exactly how far off a measurement was. Our Percentage Error Calculator finds it instantly.",
    howItWorks:
      "The calculator finds the absolute difference between your experimental and true values, divides by the absolute true value, and multiplies by 100 to express the discrepancy as a percentage.",
    formula: "Percentage error = |experimental − true| ÷ |true| × 100",
    examples: [
      { title: "Small error", body: "A measured value of 97 against a true value of 100 gives a 3% percentage error — a relatively small, often acceptable discrepancy depending on the context." },
      { title: "Larger error", body: "A measured value of 85 against the same true value of 100 gives a 15% percentage error — significant enough to warrant investigating the source of the discrepancy." },
    ],
    advantages: [
      "Standardizes measurement discrepancies as a comparable percentage, regardless of the underlying units or scale",
      "Simple, widely used formula across all experimental sciences",
      "Fast way to evaluate the quality of a measurement or experimental result",
      "Useful for lab reports and coursework requiring error analysis",
    ],
    commonMistakes: [
      "Confusing percentage error with percentage difference, which uses a different (averaged) denominator",
      "Forgetting the formula uses absolute value, so error is always reported as a positive percentage",
      "Not investigating the source of a large percentage error, treating it only as a number to report rather than a signal to check methodology",
      "Comparing percentage errors across experiments with very different acceptable tolerance levels without context",
    ],
    useCases: [
      "Lab report and coursework error analysis",
      "Evaluating the accuracy of experimental measurements",
      "Comparing measurement quality across different experimental trials",
      "Quality control and manufacturing tolerance checks",
    ],
    conclusion:
      "Percentage error puts any measurement discrepancy into a standardized, comparable format — useful for evaluating experimental accuracy and identifying when something in a methodology needs a second look.",
  },
  "z-score": {
    intro:
      "A z-score tells you exactly how many standard deviations a value sits from the mean — a standardized way to compare data points from different distributions. Our Z-Score Calculator finds it instantly from a value, mean, and standard deviation.",
    howItWorks:
      "The calculator subtracts the mean from your value, then divides by the standard deviation, producing a standardized score that expresses distance from the mean in standard deviation units rather than raw units.",
    formula: "z = (x − μ) ÷ σ",
    examples: [
      { title: "Above the mean", body: "A test score of 85 with a class mean of 75 and standard deviation of 8 gives a z-score of 1.25 — 1.25 standard deviations above average." },
      { title: "Comparing across distributions", body: "A z-score allows fair comparison between, say, a test score and a height measurement, even though they use completely different units and scales — both get converted to the same standardized measure." },
    ],
    advantages: [
      "Standardizes any value relative to its distribution's mean and spread",
      "Enables fair comparison across values from different distributions or units",
      "Foundational for further statistical analysis, like finding percentiles from a normal distribution",
      "Simple, direct formula requiring just three inputs",
    ],
    commonMistakes: [
      "Confusing z-score with the raw value itself — a z-score is always relative to a specific mean and standard deviation",
      "Applying z-scores to data that isn't approximately normally distributed, where standard z-score interpretation becomes less meaningful",
      "Not accounting for whether the standard deviation used is from a sample or a full population, which can differ slightly",
      "Forgetting a negative z-score simply means the value is below the mean, not that something is wrong",
    ],
    useCases: [
      "Statistics coursework involving standardized scores",
      "Comparing values across different distributions or scales",
      "Identifying outliers relative to a dataset's mean and spread",
      "Foundational calculation for further normal distribution analysis",
    ],
    conclusion:
      "Z-scores are the standard way statisticians compare values across different distributions — this calculator handles the core formula, which depends on accurately knowing the mean and standard deviation from our Standard Deviation Calculator.",
  },
  "weighted-average": {
    intro:
      "A regular average treats every value equally, but a weighted average lets some values count more than others — essential for grade calculations, portfolio returns, and any scenario where different values carry different importance. Our Weighted Average Calculator handles it directly.",
    howItWorks:
      "The calculator multiplies each value by its corresponding weight, sums those products, and divides by the total of all weights — giving more influence to values with larger weights, unlike a simple average that treats every value identically.",
    formula: "Weighted average = Σ(value × weight) ÷ Σ(weight)",
    examples: [
      { title: "Grade calculation", body: "Scores of 90, 80, and 70 weighted at 0.5, 0.3, and 0.2 respectively (representing an exam, midterm, and homework) produce a weighted average of 83 — different from the simple average of 80, since the highest score carries the most weight." },
      { title: "Equal weights matching simple average", body: "If all weights are set equal to each other, the weighted average produces the exact same result as a simple average, confirming the formula's consistency." },
    ],
    advantages: [
      "Correctly accounts for different importance levels across values",
      "Works for any number of values and corresponding weights",
      "Validates that value and weight counts match before calculating",
      "Useful across grading, finance, statistics, and quality scoring applications",
    ],
    commonMistakes: [
      "Entering a different number of values and weights, which makes the calculation impossible to perform correctly",
      "Confusing weighted average with simple average when the underlying values genuinely have different importance",
      "Using weights that don't logically represent the true relative importance of each value",
      "Not normalizing weights to sum to a meaningful total (though the formula handles any consistent weight scale correctly)",
    ],
    useCases: [
      "Calculating a final grade from weighted categories (exams, homework, participation)",
      "Portfolio return calculations weighted by investment size",
      "Quality scoring systems with different-weighted criteria",
      "Any scenario where some values should count more than others",
    ],
    conclusion:
      "Weighted averages more accurately reflect real-world scenarios where not every value carries equal importance — grading, investing, and quality scoring all rely on this same underlying principle.",
  },
  proportion: {
    intro:
      "Solving a proportion — finding the missing value in A/B = C/D — is a foundational algebra skill used constantly in scaling recipes, maps, and real-world ratios. Our Proportion Calculator solves for the missing fourth value instantly.",
    howItWorks:
      "The calculator applies cross-multiplication to the proportion equation, solving algebraically for the unknown fourth value given the other three known values in the A/B = C/D relationship.",
    formula: "A/B = C/D  →  D = (B × C) ÷ A",
    examples: [
      { title: "Simple proportion", body: "Given 3/4 = 9/D, cross-multiplying and solving gives D = 12, maintaining the same ratio relationship as 3/4." },
      { title: "Real-world scaling", body: "If a recipe scaled for 3 people uses 4 cups of an ingredient, scaling to 9 people (keeping the same proportion) requires 12 cups — the exact same math as the abstract example." },
    ],
    advantages: [
      "Solves for the missing value using reliable cross-multiplication algebra",
      "Applicable to countless real-world scaling scenarios, not just abstract math",
      "Fast, precise results for any three known values",
      "Useful for recipe scaling, map reading, unit conversion, and more",
    ],
    commonMistakes: [
      "Setting up the proportion with values in the wrong position, which produces an incorrect ratio relationship",
      "Not verifying the original ratio makes logical sense for the real-world scenario being modeled",
      "Confusing a proportion (two equal ratios) with a simple ratio (one relationship)",
      "Rounding intermediate results manually rather than letting the calculator handle the full precision",
    ],
    useCases: [
      "Scaling recipes up or down while maintaining ingredient ratios",
      "Map and scale drawing calculations",
      "Algebra homework and coursework involving proportions",
      "Any real-world scenario requiring maintaining a consistent ratio at a different scale",
    ],
    conclusion:
      "Proportions are one of the most practically useful algebra concepts, showing up constantly outside the classroom in recipes, maps, and scaling problems. Our Ratio Simplifier handles the related task of reducing a single ratio to its simplest form.",
  },
  trigonometry: {
    intro:
      "Given one side and one angle of a right triangle, trigonometry lets you solve for every other side and angle — a foundational skill for construction, navigation, and physics. Our Right Triangle Trig Calculator handles that full solve in one step.",
    howItWorks:
      "The calculator uses the tangent function to find the opposite side from the known adjacent side and angle, then uses the cosine function to find the hypotenuse — solving the complete right triangle from just one side and one non-right angle.",
    formula: "Opposite = adjacent × tan(angle)\nHypotenuse = adjacent ÷ cos(angle)",
    examples: [
      { title: "Standard solve", body: "A known adjacent side of 10 with a 35-degree angle produces an opposite side of about 7.0 and a hypotenuse of about 12.2, fully solving the triangle." },
      { title: "Real-world application", body: "Knowing the distance to the base of a building (adjacent side) and the angle of elevation to its top lets you calculate the building's height (opposite side) without direct measurement." },
    ],
    advantages: [
      "Solves the complete right triangle from just one side and one angle",
      "Uses standard trigonometric functions correctly and precisely",
      "Useful for construction, navigation, surveying, and physics applications",
      "Fast alternative to manually applying trig functions with a scientific calculator",
    ],
    commonMistakes: [
      "Confusing which side is adjacent versus opposite relative to the known angle",
      "Entering the angle in radians when the calculator expects degrees, or vice versa",
      "Using the wrong trig function for the specific sides and angle known (sine, cosine, and tangent each relate different side pairs)",
      "Forgetting the third angle can be found by subtracting the known angle and 90° from 180°",
    ],
    useCases: [
      "Construction and surveying calculations involving angles and distances",
      "Physics problems involving right-triangle relationships",
      "Navigation calculations involving angles of elevation or depression",
      "Trigonometry homework and coursework",
    ],
    conclusion:
      "Right-triangle trigonometry is one of the most practically applied areas of math, from measuring inaccessible heights to navigation calculations. This handles the complete solve from minimal starting information — just one side and one angle.",
  },
};
