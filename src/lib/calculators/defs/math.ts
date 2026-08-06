import { CalculatorDefinition } from "../types";
import { formatNumber, formatInteger, num, str } from "@/lib/format";

function parseNumberList(s: string): number[] {
  return s
    .split(/[,\s]+/)
    .map((x) => parseFloat(x))
    .filter((x) => !isNaN(x));
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export const mathCalculators: CalculatorDefinition[] = [
  {
    slug: "scientific",
    title: "Scientific Calculator",
    category: "math",
    popular: true,
    custom: true,
    description: "A full-featured online scientific calculator with trig, log, exponent and memory functions.",
    keywords: ["scientific calculator", "online calculator"],
    fields: [],
    compute: () => ({ items: [] }),
    faqs: [{ q: "Does this calculator use degrees or radians for trig functions?", a: "There's a DEG/RAD toggle in the calculator — check which mode is active before running sin, cos, or tan, since the same input gives very different results in each mode." }],
  },
  {
    slug: "standard",
    title: "Standard Calculator",
    category: "math",
    custom: true,
    description: "A simple, fast standard calculator for everyday arithmetic.",
    keywords: ["standard calculator", "basic calculator", "online calculator"],
    fields: [],
    compute: () => ({ items: [] }),
    faqs: [{ q: "Does this calculator follow order of operations?", a: "Basic calculators like this one typically evaluate left to right as you press keys, rather than applying full algebraic order of operations (PEMDAS) — for expressions needing that, use the Scientific Calculator instead." }],
  },
  {
    slug: "percentage",
    title: "Percentage Calculator",
    category: "math",
    popular: true,
    description: "Calculate percentages, percentage of a value, and percentage change between two numbers.",
    keywords: ["percentage calculator", "percent calculator"],
    fields: [
      { id: "mode", label: "Calculation", type: "radio", defaultValue: "of", options: [
        { value: "of", label: "X% of Y" }, { value: "isPercent", label: "X is what % of Y" }, { value: "change", label: "% change from X to Y" },
      ], width: "full" },
      { id: "x", label: "X", type: "number", defaultValue: 20, width: "half" },
      { id: "y", label: "Y", type: "number", defaultValue: 80, width: "half" },
    ],
    compute: (v) => {
      const x = num(v.x), y = num(v.y);
      if (v.mode === "isPercent") {
        return {
          items: [{ label: `${x} is what % of ${y}`, value: `${formatNumber((x / y) * 100, 2)}%`, emphasis: true }],
          chart: { type: "donut", labels: ["X", "Remainder of Y"], series: [{ name: "Y", data: [x, Math.max(y - x, 0)] }] },
        };
      }
      if (v.mode === "change") {
        const change = ((y - x) / x) * 100;
        return {
          items: [{ label: `% change from ${x} to ${y}`, value: `${change >= 0 ? "+" : ""}${formatNumber(change, 2)}%`, emphasis: true }],
          chart: { type: "bar", labels: ["X", "Y"], series: [{ name: "Value", data: [x, y], color: "primary" }] },
        };
      }
      return {
        items: [{ label: `${x}% of ${y}`, value: formatNumber((x / 100) * y, 2), emphasis: true }],
        chart: { type: "donut", labels: ["Portion", "Remainder"], series: [{ name: "Y", data: [(x / 100) * y, y - (x / 100) * y] }] },
      };
    },
    faqs: [
      { q: "What's the formula for percentage change?", a: "Percentage change = ((new value − old value) / old value) × 100. A positive result means an increase; negative means a decrease." },
      { q: "How do I find what percent one number is of another?", a: "Divide the part by the whole and multiply by 100: (X / Y) × 100. For example, 20 is 25% of 80." },
    ],
  },
  {
    slug: "fraction",
    title: "Fraction Calculator",
    category: "math",
    description: "Add, subtract, multiply or divide two fractions and simplify the result.",
    keywords: ["fraction calculator"],
    fields: [
      { id: "num1", label: "Numerator 1", type: "number", defaultValue: 1, width: "third" },
      { id: "den1", label: "Denominator 1", type: "number", defaultValue: 2, width: "third" },
      { id: "op", label: "Operation", type: "select", defaultValue: "+", options: [
        { value: "+", label: "+" }, { value: "-", label: "−" }, { value: "*", label: "×" }, { value: "/", label: "÷" },
      ], width: "third" },
      { id: "num2", label: "Numerator 2", type: "number", defaultValue: 1, width: "third" },
      { id: "den2", label: "Denominator 2", type: "number", defaultValue: 3, width: "third" },
    ],
    compute: (v) => {
      const n1 = num(v.num1), d1 = num(v.den1), n2 = num(v.num2), d2 = num(v.den2);
      if (d1 === 0 || d2 === 0) return { items: [], error: "Denominator cannot be zero." };
      let rn: number, rd: number;
      switch (v.op) {
        case "-": rn = n1 * d2 - n2 * d1; rd = d1 * d2; break;
        case "*": rn = n1 * n2; rd = d1 * d2; break;
        case "/": rn = n1 * d2; rd = d1 * n2; break;
        default: rn = n1 * d2 + n2 * d1; rd = d1 * d2;
      }
      const g = gcd(rn, rd) || 1;
      const sign = rd < 0 ? -1 : 1;
      return {
        items: [
          { label: "Result", value: `${(sign * rn) / g} / ${(sign * rd) / g}`, emphasis: true },
          { label: "Decimal", value: formatNumber(rn / rd, 4) },
        ],
        chart: {
          type: "bar",
          labels: ["Fraction 1", "Fraction 2", "Result"],
          series: [{ name: "Decimal Value", data: [n1 / d1, n2 / d2, rn / rd], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Why is the result already simplified?", a: "The calculator divides both the numerator and denominator by their greatest common factor, so you always get the fraction in lowest terms rather than an unreduced form." }],
  },
  {
    slug: "ratio",
    title: "Ratio Simplifier",
    shortTitle: "Ratio Calculator",
    category: "math",
    description: "Simplify a ratio between two numbers to its lowest terms.",
    keywords: ["ratio calculator", "simplify ratio"],
    fields: [
      { id: "a", label: "A", type: "number", defaultValue: 8, width: "half" },
      { id: "b", label: "B", type: "number", defaultValue: 12, width: "half" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b);
      const g = gcd(a, b) || 1;
      return {
        items: [{ label: "Simplified Ratio", value: `${a / g} : ${b / g}`, emphasis: true }],
        chart: { type: "bar", labels: ["A", "B"], series: [{ name: "Value", data: [a, b], color: "primary" }] },
      };
    },
    faqs: [{ q: "How is a ratio simplified?", a: "Both numbers are divided by their greatest common factor (GCF) — the same way you'd reduce a fraction — so 8:12 simplifies to 2:3 since 4 is the GCF." }],
  },
  {
    slug: "average",
    title: "Mean, Median & Mode Calculator",
    shortTitle: "Average Calculator",
    category: "math",
    popular: true,
    description: "Calculate the mean, median, mode and range of a list of numbers.",
    keywords: ["average calculator", "mean median mode calculator"],
    fields: [{ id: "numbers", label: "Numbers (comma or space separated)", type: "text", defaultValue: "4, 8, 15, 16, 23, 42", width: "full" }],
    compute: (v) => {
      const nums = parseNumberList(str(v.numbers));
      if (nums.length === 0) return { items: [], error: "Enter at least one number." };
      const sorted = [...nums].sort((a, b) => a - b);
      const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      const freq = new Map<number, number>();
      nums.forEach((n) => freq.set(n, (freq.get(n) ?? 0) + 1));
      const maxFreq = Math.max(...freq.values());
      const modes = maxFreq > 1 ? [...freq.entries()].filter(([, c]) => c === maxFreq).map(([n]) => n) : [];
      return {
        items: [
          { label: "Mean", value: formatNumber(mean, 4), emphasis: true },
          { label: "Median", value: formatNumber(median, 4) },
          { label: "Mode", value: modes.length ? modes.join(", ") : "No mode" },
          { label: "Range", value: formatNumber(sorted[sorted.length - 1] - sorted[0], 4) },
          { label: "Count", value: String(nums.length) },
          { label: "Sum", value: formatNumber(nums.reduce((s, n) => s + n, 0), 4) },
        ],
        chart: {
          type: "bar",
          labels: nums.map((_, i) => `#${i + 1}`),
          series: [{ name: "Value", data: nums, color: "primary" }],
        },
      };
    },
    faqs: [
      { q: "What's the difference between mean, median and mode?", a: "Mean is the sum divided by the count. Median is the middle value when sorted. Mode is the value that appears most often. All three are measures of \"center,\" but they respond differently to outliers." },
      { q: "Why does my data have no mode?", a: "If every number in your list appears exactly once, there's no value that repeats more than any other, so there's no mode." },
    ],
  },
  {
    slug: "standard-deviation",
    title: "Standard Deviation Calculator",
    category: "math",
    description: "Calculate population and sample standard deviation and variance for a list of numbers.",
    keywords: ["standard deviation calculator", "variance calculator"],
    fields: [{ id: "numbers", label: "Numbers (comma or space separated)", type: "text", defaultValue: "4, 8, 15, 16, 23, 42", width: "full" }],
    compute: (v) => {
      const nums = parseNumberList(str(v.numbers));
      if (nums.length < 2) return { items: [], error: "Enter at least two numbers." };
      const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
      const sqDiffs = nums.map((n) => (n - mean) ** 2);
      const popVar = sqDiffs.reduce((s, n) => s + n, 0) / nums.length;
      const sampleVar = sqDiffs.reduce((s, n) => s + n, 0) / (nums.length - 1);
      return {
        items: [
          { label: "Sample Std. Deviation", value: formatNumber(Math.sqrt(sampleVar), 4), emphasis: true },
          { label: "Population Std. Deviation", value: formatNumber(Math.sqrt(popVar), 4) },
          { label: "Sample Variance", value: formatNumber(sampleVar, 4) },
          { label: "Population Variance", value: formatNumber(popVar, 4) },
          { label: "Mean", value: formatNumber(mean, 4) },
        ],
        chart: {
          type: "bar",
          labels: nums.map((_, i) => `#${i + 1}`),
          series: [{ name: "Value", data: nums, color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Should I use sample or population standard deviation?", a: "Use sample standard deviation (dividing by n−1) when your numbers are a sample from a larger group. Use population standard deviation (dividing by n) only when your list IS the entire population you care about." }],
  },
  {
    slug: "probability",
    title: "Probability Calculator",
    category: "math",
    description: "Calculate the probability of a single event given favorable and total outcomes.",
    keywords: ["probability calculator"],
    fields: [
      { id: "favorable", label: "Favorable Outcomes", type: "number", defaultValue: 1, width: "half" },
      { id: "total", label: "Total Outcomes", type: "number", defaultValue: 6, width: "half" },
    ],
    compute: (v) => {
      const p = num(v.favorable) / num(v.total);
      return {
        items: [
          { label: "Probability", value: formatNumber(p, 4), emphasis: true },
          { label: "As Percentage", value: `${formatNumber(p * 100, 2)}%` },
          { label: "Odds", value: `${num(v.favorable)}:${num(v.total) - num(v.favorable)}` },
        ],
        chart: {
          type: "donut",
          labels: ["Favorable", "Unfavorable"],
          series: [{ name: "Outcomes", data: [num(v.favorable), num(v.total) - num(v.favorable)] }],
        },
      };
    },
    faqs: [{ q: "What's the difference between probability and odds?", a: "Probability is favorable outcomes divided by total outcomes (e.g., 1/6 for rolling a specific number on a die). Odds compare favorable to unfavorable outcomes directly (1:5 for the same die roll)." }],
  },
  {
    slug: "permutation",
    title: "Permutation Calculator (nPr)",
    shortTitle: "Permutation Calculator",
    category: "math",
    description: "Calculate the number of permutations (ordered arrangements) of r items from a set of n.",
    keywords: ["permutation calculator", "npr calculator"],
    fields: [
      { id: "n", label: "n (set size)", type: "number", defaultValue: 10, width: "half" },
      { id: "r", label: "r (chosen)", type: "number", defaultValue: 3, width: "half" },
    ],
    compute: (v) => {
      const n = Math.round(num(v.n)), r = Math.round(num(v.r));
      if (r > n || n < 0 || r < 0) return { items: [], error: "r cannot be greater than n." };
      let result = 1;
      const steps: number[] = [];
      for (let i = 0; i < r; i++) { steps.push(n - i); result *= n - i; }
      let running = 1;
      return {
        items: [{ label: `P(${n}, ${r})`, value: formatInteger(result), emphasis: true }],
        table: {
          headers: ["Step", "Multiply By", "Running Total"],
          rows: steps.map((s, i) => { running *= s; return [i + 1, formatInteger(s), formatInteger(running)]; }),
        },
      };
    },
    faqs: [{ q: "What's the difference between permutations and combinations?", a: "Permutations count arrangements where order matters (ABC differs from BCA). Combinations count selections where order doesn't matter (ABC and BCA are the same group) — that's why nPr is always ≥ nCr for the same n and r." }],
  },
  {
    slug: "combination",
    title: "Combination Calculator (nCr)",
    shortTitle: "Combination Calculator",
    category: "math",
    description: "Calculate the number of combinations (unordered selections) of r items from a set of n.",
    keywords: ["combination calculator", "ncr calculator"],
    fields: [
      { id: "n", label: "n (set size)", type: "number", defaultValue: 10, width: "half" },
      { id: "r", label: "r (chosen)", type: "number", defaultValue: 3, width: "half" },
    ],
    compute: (v) => {
      const n = Math.round(num(v.n)), r = Math.round(num(v.r));
      if (r > n || n < 0 || r < 0) return { items: [], error: "r cannot be greater than n." };
      let result = 1;
      const rows: (string | number)[][] = [];
      for (let i = 0; i < r; i++) {
        result = (result * (n - i)) / (i + 1);
        rows.push([i + 1, `× ${n - i} ÷ ${i + 1}`, formatNumber(result, 2)]);
      }
      return {
        items: [{ label: `C(${n}, ${r})`, value: formatInteger(Math.round(result)), emphasis: true }],
        table: { headers: ["Step", "Operation", "Running Total"], rows },
      };
    },
    faqs: [{ q: "When would I use combinations instead of permutations?", a: "Use combinations whenever the order of selection doesn't matter — like choosing a 5-person committee from 20 people, or picking lottery numbers where the drawn order doesn't change your win." }],
  },
  {
    slug: "random-number",
    title: "Random Number Generator",
    category: "math",
    description: "Generate one or more random integers within a range.",
    keywords: ["random number generator"],
    fields: [
      { id: "min", label: "Minimum", type: "number", defaultValue: 1, width: "third" },
      { id: "max", label: "Maximum", type: "number", defaultValue: 100, width: "third" },
      { id: "count", label: "How Many", type: "number", defaultValue: 5, width: "third" },
    ],
    compute: (v) => {
      const min = Math.round(num(v.min)), max = Math.round(num(v.max)), count = Math.min(Math.max(Math.round(num(v.count)), 1), 50);
      if (min > max) return { items: [], error: "Minimum must be less than maximum." };
      const results = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
      return {
        items: [{ label: "Random Numbers", value: results.join(", "), emphasis: true }],
        chart: {
          type: "bar",
          labels: results.map((_, i) => `#${i + 1}`),
          series: [{ name: "Value", data: results, color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Can the same number appear twice in the results?", a: "Yes — each number is generated independently, so duplicates are possible (and expected) when the range is small relative to how many numbers you're generating, just like independent dice rolls." }],
  },
  {
    slug: "triangle",
    title: "Triangle Calculator",
    category: "math",
    description: "Calculate the area, perimeter and angles of a triangle from its three side lengths.",
    keywords: ["triangle calculator"],
    fields: [
      { id: "a", label: "Side a", type: "number", defaultValue: 5, width: "third" },
      { id: "b", label: "Side b", type: "number", defaultValue: 6, width: "third" },
      { id: "c", label: "Side c", type: "number", defaultValue: 7, width: "third" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      if (a + b <= c || a + c <= b || b + c <= a) return { items: [], error: "These sides can't form a triangle." };
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      const toDeg = (rad: number) => (rad * 180) / Math.PI;
      const angleA = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
      const angleB = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
      const angleC = 180 - angleA - angleB;
      return {
        items: [
          { label: "Area", value: formatNumber(area, 3), emphasis: true },
          { label: "Perimeter", value: formatNumber(a + b + c, 3) },
          { label: "Angle A", value: `${formatNumber(angleA, 2)}°` },
          { label: "Angle B", value: `${formatNumber(angleB, 2)}°` },
          { label: "Angle C", value: `${formatNumber(angleC, 2)}°` },
        ],
        chart: {
          type: "bar",
          labels: ["Angle A", "Angle B", "Angle C"],
          series: [{ name: "Degrees", data: [angleA, angleB, angleC], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Why does the calculator sometimes say the sides can't form a triangle?", a: "The triangle inequality requires each side to be shorter than the sum of the other two. If a side is too long relative to the others, no triangle exists with those measurements." }],
  },
  {
    slug: "right-triangle",
    title: "Right Triangle Calculator",
    category: "math",
    description: "Calculate the hypotenuse, area and perimeter of a right triangle from its two legs.",
    keywords: ["right triangle calculator"],
    fields: [
      { id: "a", label: "Leg a", type: "number", defaultValue: 3, width: "half" },
      { id: "b", label: "Leg b", type: "number", defaultValue: 4, width: "half" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b);
      const c = Math.sqrt(a * a + b * b);
      return {
        items: [
          { label: "Hypotenuse (c)", value: formatNumber(c, 4), emphasis: true },
          { label: "Area", value: formatNumber(0.5 * a * b, 4) },
          { label: "Perimeter", value: formatNumber(a + b + c, 4) },
        ],
        chart: {
          type: "bar",
          labels: ["Leg a", "Leg b", "Hypotenuse c"],
          series: [{ name: "Length", data: [a, b, c], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Which side is the hypotenuse?", a: "The hypotenuse is always the longest side, opposite the right angle. In this calculator, sides a and b are the two legs, and the result c is always the hypotenuse." }],
  },
  {
    slug: "pythagorean",
    title: "Pythagorean Theorem Calculator",
    category: "math",
    description: "Solve for any missing side of a right triangle using the Pythagorean theorem.",
    keywords: ["pythagorean theorem calculator"],
    fields: [
      { id: "solveFor", label: "Solve For", type: "select", defaultValue: "c", options: [
        { value: "c", label: "Hypotenuse (c)" }, { value: "a", label: "Leg a" }, { value: "b", label: "Leg b" },
      ], width: "full" },
      { id: "a", label: "a", type: "number", defaultValue: 3, width: "third" },
      { id: "b", label: "b", type: "number", defaultValue: 4, width: "third" },
      { id: "c", label: "c", type: "number", defaultValue: 5, width: "third" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      if (v.solveFor === "a") {
        if (c <= b) return { items: [], error: "c must be greater than b." };
        const solvedA = Math.sqrt(c * c - b * b);
        return {
          items: [{ label: "a", value: formatNumber(solvedA, 4), emphasis: true }],
          chart: { type: "bar", labels: ["a", "b", "c"], series: [{ name: "Length", data: [solvedA, b, c], color: "primary" }] },
        };
      }
      if (v.solveFor === "b") {
        if (c <= a) return { items: [], error: "c must be greater than a." };
        const solvedB = Math.sqrt(c * c - a * a);
        return {
          items: [{ label: "b", value: formatNumber(solvedB, 4), emphasis: true }],
          chart: { type: "bar", labels: ["a", "b", "c"], series: [{ name: "Length", data: [a, solvedB, c], color: "primary" }] },
        };
      }
      const solvedC = Math.sqrt(a * a + b * b);
      return {
        items: [{ label: "c", value: formatNumber(solvedC, 4), emphasis: true }],
        chart: { type: "bar", labels: ["a", "b", "c"], series: [{ name: "Length", data: [a, b, solvedC], color: "primary" }] },
      };
    },
    faqs: [{ q: "What's the Pythagorean theorem formula?", a: "a² + b² = c², where c is the hypotenuse of a right triangle and a, b are the two legs. This calculator rearranges it to solve for whichever side you're missing." }],
  },
  {
    slug: "circle",
    title: "Circle Calculator",
    category: "math",
    description: "Calculate the area, circumference and diameter of a circle from its radius.",
    keywords: ["circle calculator", "area of a circle"],
    fields: [{ id: "radius", label: "Radius", type: "number", defaultValue: 5, width: "full" }],
    compute: (v) => {
      const r = num(v.radius);
      return {
        items: [
          { label: "Area", value: formatNumber(Math.PI * r * r, 4), emphasis: true },
          { label: "Circumference", value: formatNumber(2 * Math.PI * r, 4) },
          { label: "Diameter", value: formatNumber(2 * r, 4) },
        ],
        table: {
          headers: ["Radius", "Area", "Circumference"],
          rows: [0.5, 1, 2, 5].map((mult) => [formatNumber(r * mult, 2), formatNumber(Math.PI * (r * mult) ** 2, 2), formatNumber(2 * Math.PI * r * mult, 2)]),
        },
      };
    },
    faqs: [{ q: "What's the formula for a circle's area?", a: "Area = πr², where r is the radius. Circumference (the distance around the circle) is 2πr." }],
  },
  {
    slug: "area",
    title: "Area Calculator",
    category: "math",
    description: "Calculate the area of a square, rectangle, circle or triangle.",
    keywords: ["area calculator"],
    fields: [
      { id: "shape", label: "Shape", type: "select", defaultValue: "rectangle", options: [
        { value: "square", label: "Square" }, { value: "rectangle", label: "Rectangle" }, { value: "circle", label: "Circle" }, { value: "triangle", label: "Triangle" },
      ], width: "full" },
      { id: "a", label: "Side / Length / Radius / Base", type: "number", defaultValue: 5, width: "half" },
      { id: "b", label: "Width / Height (if applicable)", type: "number", defaultValue: 8, width: "half" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b);
      let area = 0;
      if (v.shape === "square") area = a * a;
      else if (v.shape === "rectangle") area = a * b;
      else if (v.shape === "circle") area = Math.PI * a * a;
      else area = 0.5 * a * b;
      return {
        items: [{ label: "Area", value: formatNumber(area, 4), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Square", "Rectangle", "Circle", "Triangle"],
          series: [{ name: "Area (same inputs)", data: [a * a, a * b, Math.PI * a * a, 0.5 * a * b], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Which fields do I fill in for a triangle's area?", a: "For a triangle, enter the base in the first field and the height (measured perpendicular to that base) in the second — the calculator uses the ½ × base × height formula." }],
  },
  {
    slug: "volume",
    title: "Volume Calculator",
    category: "math",
    description: "Calculate the volume of a cube, sphere, cylinder, cone or rectangular prism.",
    keywords: ["volume calculator"],
    fields: [
      { id: "shape", label: "Shape", type: "select", defaultValue: "cylinder", options: [
        { value: "cube", label: "Cube" }, { value: "sphere", label: "Sphere" }, { value: "cylinder", label: "Cylinder" }, { value: "cone", label: "Cone" }, { value: "prism", label: "Rectangular Prism" },
      ], width: "full" },
      { id: "a", label: "Side / Radius / Length", type: "number", defaultValue: 4, width: "third" },
      { id: "b", label: "Height / Width", type: "number", defaultValue: 10, width: "third" },
      { id: "c", label: "Depth (prism only)", type: "number", defaultValue: 6, width: "third" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      let volume = 0;
      if (v.shape === "cube") volume = a * a * a;
      else if (v.shape === "sphere") volume = (4 / 3) * Math.PI * a ** 3;
      else if (v.shape === "cylinder") volume = Math.PI * a * a * b;
      else if (v.shape === "cone") volume = (1 / 3) * Math.PI * a * a * b;
      else volume = a * b * c;
      return {
        items: [{ label: "Volume", value: formatNumber(volume, 4), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Cube", "Sphere", "Cylinder", "Cone", "Prism"],
          series: [{ name: "Volume (same inputs)", data: [a * a * a, (4 / 3) * Math.PI * a ** 3, Math.PI * a * a * b, (1 / 3) * Math.PI * a * a * b, a * b * c], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Which fields matter for each shape?", a: "It varies: cube and sphere only use the first field (side/radius); cylinder and cone use the first two (radius, height); rectangular prism uses all three (length, width, depth)." }],
  },
  {
    slug: "surface-area",
    title: "Surface Area Calculator",
    category: "math",
    description: "Calculate the surface area of a cube, sphere or cylinder.",
    keywords: ["surface area calculator"],
    fields: [
      { id: "shape", label: "Shape", type: "select", defaultValue: "cylinder", options: [
        { value: "cube", label: "Cube" }, { value: "sphere", label: "Sphere" }, { value: "cylinder", label: "Cylinder" },
      ], width: "full" },
      { id: "a", label: "Side / Radius", type: "number", defaultValue: 4, width: "half" },
      { id: "b", label: "Height (cylinder only)", type: "number", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b);
      let sa = 0;
      if (v.shape === "cube") sa = 6 * a * a;
      else if (v.shape === "sphere") sa = 4 * Math.PI * a * a;
      else sa = 2 * Math.PI * a * a + 2 * Math.PI * a * b;
      return {
        items: [{ label: "Surface Area", value: formatNumber(sa, 4), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Cube", "Sphere", "Cylinder"],
          series: [{ name: "Surface Area (same inputs)", data: [6 * a * a, 4 * Math.PI * a * a, 2 * Math.PI * a * a + 2 * Math.PI * a * b], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What's the difference between surface area and volume?", a: "Surface area measures the total area covering the outside of a 3D shape (useful for paint or wrapping), while volume measures the space it occupies inside (useful for capacity)." }],
  },
  {
    slug: "slope",
    title: "Slope Calculator",
    category: "math",
    description: "Calculate the slope and equation of a line through two points.",
    keywords: ["slope calculator"],
    fields: [
      { id: "x1", label: "x1", type: "number", defaultValue: 1, width: "third" },
      { id: "y1", label: "y1", type: "number", defaultValue: 2, width: "third" },
      { id: "x2", label: "x2", type: "number", defaultValue: 4, width: "third" },
      { id: "y2", label: "y2", type: "number", defaultValue: 8, width: "third" },
    ],
    compute: (v) => {
      const x1 = num(v.x1), y1 = num(v.y1), x2 = num(v.x2), y2 = num(v.y2);
      if (x2 === x1) return { items: [{ label: "Slope", value: "Undefined (vertical line)", emphasis: true }] };
      const slope = (y2 - y1) / (x2 - x1);
      const intercept = y1 - slope * x1;
      const lo = Math.min(x1, x2), hi = Math.max(x1, x2);
      const span = hi - lo || 1;
      const points = Array.from({ length: 6 }, (_, i) => lo - span * 0.2 + (span * 1.4 * i) / 5);
      return {
        items: [
          { label: "Slope (m)", value: formatNumber(slope, 4), emphasis: true },
          { label: "Equation", value: `y = ${formatNumber(slope, 3)}x ${intercept >= 0 ? "+" : "-"} ${formatNumber(Math.abs(intercept), 3)}` },
        ],
        chart: {
          type: "line",
          labels: points.map((x) => formatNumber(x, 2)),
          series: [{ name: "y", data: points.map((x) => Number((slope * x + intercept).toFixed(4))), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What does a negative slope mean?", a: "A negative slope means the line goes downward as x increases — y decreases. A positive slope goes upward, and a slope of 0 is a flat horizontal line." }],
  },
  {
    slug: "distance-2d",
    title: "Distance Between Two Points Calculator",
    shortTitle: "Distance Calculator",
    category: "math",
    description: "Calculate the straight-line distance between two points on a plane.",
    keywords: ["distance calculator", "distance between two points"],
    fields: [
      { id: "x1", label: "x1", type: "number", defaultValue: 0, width: "third" },
      { id: "y1", label: "y1", type: "number", defaultValue: 0, width: "third" },
      { id: "x2", label: "x2", type: "number", defaultValue: 3, width: "third" },
      { id: "y2", label: "y2", type: "number", defaultValue: 4, width: "third" },
    ],
    compute: (v) => {
      const dx = num(v.x2) - num(v.x1), dy = num(v.y2) - num(v.y1);
      return {
        items: [{ label: "Distance", value: formatNumber(Math.sqrt(dx * dx + dy * dy), 4), emphasis: true }],
        chart: { type: "bar", labels: ["Δx", "Δy", "Distance"], series: [{ name: "Length", data: [Math.abs(dx), Math.abs(dy), Math.sqrt(dx * dx + dy * dy)], color: "primary" }] },
      };
    },
    faqs: [{ q: "What formula does this use?", a: "The distance formula, derived from the Pythagorean theorem: √((x2−x1)² + (y2−y1)²) — essentially treating the horizontal and vertical gaps as the legs of a right triangle." }],
  },
  {
    slug: "midpoint",
    title: "Midpoint Calculator",
    category: "math",
    description: "Calculate the midpoint between two coordinate points.",
    keywords: ["midpoint calculator"],
    fields: [
      { id: "x1", label: "x1", type: "number", defaultValue: 0, width: "third" },
      { id: "y1", label: "y1", type: "number", defaultValue: 0, width: "third" },
      { id: "x2", label: "x2", type: "number", defaultValue: 6, width: "third" },
      { id: "y2", label: "y2", type: "number", defaultValue: 8, width: "third" },
    ],
    compute: (v) => ({
      items: [{ label: "Midpoint", value: `(${formatNumber((num(v.x1) + num(v.x2)) / 2, 3)}, ${formatNumber((num(v.y1) + num(v.y2)) / 2, 3)})`, emphasis: true }],
      table: {
        headers: ["Point", "x", "y"],
        rows: [
          ["Point 1", formatNumber(num(v.x1), 3), formatNumber(num(v.y1), 3)],
          ["Point 2", formatNumber(num(v.x2), 3), formatNumber(num(v.y2), 3)],
          ["Midpoint", formatNumber((num(v.x1) + num(v.x2)) / 2, 3), formatNumber((num(v.y1) + num(v.y2)) / 2, 3)],
        ],
      },
    }),
    faqs: [{ q: "How is the midpoint calculated?", a: "It's simply the average of the two x-coordinates and the average of the two y-coordinates: ((x1+x2)/2, (y1+y2)/2)." }],
  },
  {
    slug: "quadratic",
    title: "Quadratic Equation Solver",
    shortTitle: "Quadratic Calculator",
    category: "math",
    description: "Solve any quadratic equation ax² + bx + c = 0 for its real or complex roots.",
    keywords: ["quadratic formula calculator", "quadratic equation solver"],
    presets: [
      { label: "Two real roots", values: { a: 1, b: -3, c: 2 } },
      { label: "One repeated root", values: { a: 1, b: -4, c: 4 } },
      { label: "Complex roots", values: { a: 1, b: 2, c: 5 } },
    ],
    fields: [
      { id: "a", label: "a", type: "number", defaultValue: 1, width: "third" },
      { id: "b", label: "b", type: "number", defaultValue: -3, width: "third" },
      { id: "c", label: "c", type: "number", defaultValue: 2, width: "third" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      if (a === 0) return { items: [], error: "a cannot be zero in a quadratic equation." };
      const disc = b * b - 4 * a * c;
      const vertexX = -b / (2 * a);
      const span = Math.max(Math.sqrt(Math.abs(disc)) / Math.abs(a), 2) * 1.5 || 4;
      const curvePoints = Array.from({ length: 9 }, (_, i) => vertexX - span + (span * 2 * i) / 8);
      const curveChart = {
        type: "line" as const,
        labels: curvePoints.map((x) => formatNumber(x, 2)),
        series: [{ name: "y = ax² + bx + c", data: curvePoints.map((x) => Number((a * x * x + b * x + c).toFixed(4))), color: "primary" as const }],
      };
      if (disc > 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);
        return { items: [{ label: "x₁", value: formatNumber(x1, 4), emphasis: true }, { label: "x₂", value: formatNumber(x2, 4) }], chart: curveChart };
      }
      if (disc === 0) {
        return { items: [{ label: "x", value: formatNumber(-b / (2 * a), 4), emphasis: true }], chart: curveChart };
      }
      const re = -b / (2 * a), im = Math.sqrt(-disc) / (2 * a);
      return {
        items: [
          { label: "x₁", value: `${formatNumber(re, 3)} + ${formatNumber(im, 3)}i`, emphasis: true },
          { label: "x₂", value: `${formatNumber(re, 3)} - ${formatNumber(im, 3)}i` },
        ],
        chart: curveChart,
      };
    },
    faqs: [{ q: "Why did I get complex (imaginary) roots?", a: "That happens when the discriminant (b² − 4ac) is negative — the parabola never crosses the x-axis, so there's no real solution, only complex ones involving i = √−1." }],
  },
  {
    slug: "exponent",
    title: "Exponent Calculator",
    category: "math",
    description: "Calculate the result of raising a base number to a power.",
    keywords: ["exponent calculator", "power calculator"],
    fields: [
      { id: "base", label: "Base", type: "number", defaultValue: 2, width: "half" },
      { id: "exp", label: "Exponent", type: "number", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const base = num(v.base), exp = num(v.exp);
      const steps = Math.min(Math.max(Math.round(Math.abs(exp)), 1), 12);
      const dir = exp >= 0 ? 1 : -1;
      const points = Array.from({ length: steps + 1 }, (_, i) => (i * exp) / steps);
      return {
        items: [{ label: "Result", value: formatNumber(Math.pow(base, exp), 6), emphasis: true }],
        chart: {
          type: "line",
          labels: points.map((k) => formatNumber(k, 2)),
          series: [{ name: `${base}^x`, data: points.map((k) => Number(Math.pow(base, k).toFixed(6))), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What does a negative exponent mean?", a: "A negative exponent means take the reciprocal: base^(-n) = 1/(base^n). For example, 2^-3 = 1/8." }],
  },
  {
    slug: "log",
    title: "Logarithm Calculator",
    category: "math",
    description: "Calculate the logarithm of a number in any base, including natural log.",
    keywords: ["log calculator", "logarithm calculator"],
    fields: [
      { id: "value", label: "Value", type: "number", defaultValue: 100, width: "half" },
      { id: "base", label: "Base", type: "number", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const value = num(v.value), base = num(v.base);
      if (value <= 0 || base <= 0 || base === 1) return { items: [], error: "Value must be positive and base must be positive and not 1." };
      return {
        items: [
          { label: `log_${base}(${value})`, value: formatNumber(Math.log(value) / Math.log(base), 6), emphasis: true },
          { label: "ln (natural log)", value: formatNumber(Math.log(value), 6) },
          { label: "log₁₀", value: formatNumber(Math.log10(value), 6) },
        ],
        chart: {
          type: "bar",
          labels: [`log base ${base}`, "ln (base e)", "log base 10"],
          series: [{ name: "Result", data: [Math.log(value) / Math.log(base), Math.log(value), Math.log10(value)], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What's the difference between log and ln?", a: "\"log\" (base 10) tells you the power of 10 that produces your number. \"ln\" (natural log, base e ≈ 2.71828) is used throughout calculus and science — this calculator shows both plus your custom base." }],
  },
  {
    slug: "root",
    title: "Nth Root Calculator",
    category: "math",
    description: "Calculate the nth root of any number, including square and cube roots.",
    keywords: ["root calculator", "square root calculator", "nth root"],
    fields: [
      { id: "value", label: "Value", type: "number", defaultValue: 27, width: "half" },
      { id: "n", label: "Root (n)", type: "number", defaultValue: 3, width: "half" },
    ],
    compute: (v) => {
      const value = num(v.value), n = num(v.n);
      if (value < 0 && n % 2 === 0) return { items: [], error: "Even roots of negative numbers are not real." };
      const result = value < 0 ? -Math.pow(-value, 1 / n) : Math.pow(value, 1 / n);
      return {
        items: [{ label: `${n}th Root of ${value}`, value: formatNumber(result, 6), emphasis: true }],
        table: {
          headers: ["Root (n)", "Result"],
          rows: [2, 3, 4, 5].map((rn) => [rn, value < 0 && rn % 2 === 0 ? "Not real" : formatNumber(value < 0 ? -Math.pow(-value, 1 / rn) : Math.pow(value, 1 / rn), 6)]),
        },
      };
    },
    faqs: [{ q: "Why can't I take an even root of a negative number?", a: "No real number squared (or raised to any even power) gives a negative result, so even roots of negatives (like √-4) aren't real numbers — they require complex numbers, which this calculator doesn't compute." }],
  },
  {
    slug: "factorial",
    title: "Factorial Calculator",
    category: "math",
    description: "Calculate the factorial of a non-negative integer.",
    keywords: ["factorial calculator"],
    fields: [{ id: "n", label: "n", type: "number", defaultValue: 10, width: "full" }],
    compute: (v) => {
      const n = Math.round(num(v.n));
      if (n < 0 || n > 170) return { items: [], error: "Enter an integer between 0 and 170." };
      let result = 1;
      const rows: (string | number)[][] = [[0, "1"], [1, "1"]];
      for (let i = 2; i <= n; i++) {
        result *= i;
        if (i <= 10 || i === n) rows.push([i, result.toLocaleString("en-US")]);
      }
      return {
        items: [{ label: `${n}!`, value: result.toLocaleString("en-US"), emphasis: true }],
        table: { headers: ["n", "n!"], rows: rows.slice(0, 12) },
      };
    },
    faqs: [{ q: "Why is the limit 170?", a: "170! is the largest factorial that fits in a standard double-precision floating point number without overflowing to Infinity — 171! and beyond exceed JavaScript's numeric range." }],
  },
  {
    slug: "gcf-lcm",
    title: "GCF and LCM Calculator",
    category: "math",
    description: "Find the greatest common factor and least common multiple of a list of numbers.",
    keywords: ["gcf calculator", "lcm calculator", "greatest common factor"],
    fields: [{ id: "numbers", label: "Numbers (comma separated)", type: "text", defaultValue: "12, 18, 30", width: "full" }],
    compute: (v) => {
      const nums = parseNumberList(str(v.numbers)).map((n) => Math.round(Math.abs(n))).filter((n) => n > 0);
      if (nums.length < 2) return { items: [], error: "Enter at least two positive integers." };
      const gcfAll = nums.reduce((a, b) => gcd(a, b));
      const lcmAll = nums.reduce((a, b) => (a * b) / gcd(a, b));
      return {
        items: [
          { label: "GCF", value: formatInteger(gcfAll), emphasis: true },
          { label: "LCM", value: formatInteger(lcmAll), emphasis: true },
        ],
        chart: {
          type: "bar",
          labels: nums.map((_, i) => `#${i + 1}`),
          series: [{ name: "Input Value", data: nums, color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What are GCF and LCM used for?", a: "GCF (greatest common factor) is used to simplify fractions or split items into equal groups. LCM (least common multiple) is used to find a common denominator or figure out when repeating events line up again." }],
  },
  {
    slug: "long-division",
    title: "Long Division Calculator",
    category: "math",
    description: "Divide two numbers and see the quotient and remainder.",
    keywords: ["long division calculator"],
    fields: [
      { id: "dividend", label: "Dividend", type: "number", defaultValue: 987, width: "half" },
      { id: "divisor", label: "Divisor", type: "number", defaultValue: 7, width: "half" },
    ],
    compute: (v) => {
      const dividend = Math.round(num(v.dividend)), divisor = Math.round(num(v.divisor));
      if (divisor === 0) return { items: [], error: "Cannot divide by zero." };
      const quotient = Math.trunc(dividend / divisor);
      const remainder = dividend % divisor;
      return {
        items: [
          { label: "Quotient", value: formatInteger(quotient), emphasis: true },
          { label: "Remainder", value: formatInteger(remainder) },
          { label: "Decimal Result", value: formatNumber(dividend / divisor, 6) },
        ],
        table: {
          headers: ["Quotient × Divisor", "+ Remainder", "= Dividend"],
          rows: [[formatInteger(quotient * divisor), formatInteger(Math.abs(remainder)), formatInteger(dividend)]],
        },
      };
    },
    faqs: [{ q: "What's the relationship between quotient, remainder, and decimal result?", a: "Quotient × divisor + remainder always equals the dividend. The decimal result is just the quotient continued past the decimal point instead of stopping at the remainder." }],
  },
  {
    slug: "matrix-2x2",
    title: "2x2 Matrix Calculator",
    shortTitle: "Matrix Calculator",
    category: "math",
    description: "Calculate the determinant, trace and inverse of a 2x2 matrix.",
    keywords: ["matrix calculator", "determinant calculator"],
    fields: [
      { id: "a", label: "a (row 1, col 1)", type: "number", defaultValue: 4, width: "half" },
      { id: "b", label: "b (row 1, col 2)", type: "number", defaultValue: 7, width: "half" },
      { id: "c", label: "c (row 2, col 1)", type: "number", defaultValue: 2, width: "half" },
      { id: "d", label: "d (row 2, col 2)", type: "number", defaultValue: 6, width: "half" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c), d = num(v.d);
      const det = a * d - b * c;
      const items = [
        { label: "Determinant", value: formatNumber(det, 4), emphasis: true },
        { label: "Trace", value: formatNumber(a + d, 4) },
      ];
      if (det !== 0) {
        items.push({ label: "Inverse", value: `[[${formatNumber(d / det, 3)}, ${formatNumber(-b / det, 3)}], [${formatNumber(-c / det, 3)}, ${formatNumber(a / det, 3)}]]` });
      }
      return {
        items,
        table: {
          headers: ["Row", "Col 1", "Col 2"],
          rows: [["Row 1", formatNumber(a, 3), formatNumber(b, 3)], ["Row 2", formatNumber(c, 3), formatNumber(d, 3)]],
        },
      };
    },
    faqs: [{ q: "What does it mean if there's no inverse shown?", a: "A 2x2 matrix only has an inverse if its determinant is nonzero. When the determinant is 0, the matrix is \"singular\" and has no inverse — that's why the Inverse row disappears in that case." }],
  },
  {
    slug: "base-converter",
    title: "Number Base Converter",
    shortTitle: "Base Converter",
    category: "math",
    description: "Convert numbers between binary, octal, decimal and hexadecimal.",
    keywords: ["base converter", "binary to decimal", "hex converter"],
    presets: [
      { label: "Decimal → all", values: { value: "255", fromBase: "10" } },
      { label: "Binary → all", values: { value: "11111111", fromBase: "2" } },
      { label: "Hex → all", values: { value: "FF", fromBase: "16" } },
    ],
    fields: [
      { id: "value", label: "Value", type: "text", defaultValue: "255", width: "half" },
      { id: "fromBase", label: "From Base", type: "select", defaultValue: "10", options: [
        { value: "2", label: "Binary (2)" }, { value: "8", label: "Octal (8)" }, { value: "10", label: "Decimal (10)" }, { value: "16", label: "Hex (16)" },
      ], width: "half" },
    ],
    compute: (v) => {
      const parsed = parseInt(str(v.value), num(v.fromBase));
      if (isNaN(parsed)) return { items: [], error: "Enter a valid number for the selected base." };
      return {
        items: [
          { label: "Binary", value: parsed.toString(2), emphasis: true },
          { label: "Octal", value: parsed.toString(8) },
          { label: "Decimal", value: parsed.toString(10) },
          { label: "Hexadecimal", value: parsed.toString(16).toUpperCase() },
        ],
        chart: {
          type: "bar",
          labels: ["Binary", "Octal", "Decimal", "Hex"],
          series: [{ name: "Digit Count", data: [parsed.toString(2).length, parsed.toString(8).length, parsed.toString(10).length, parsed.toString(16).length], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Why does hexadecimal use letters?", a: "Hex is base 16, but our number system only has 10 digits (0-9), so hex borrows A-F to represent values 10-15 in a single digit — that's why FF equals 255 in decimal." }],
  },
  {
    slug: "scientific-notation",
    title: "Scientific Notation Converter",
    category: "math",
    description: "Convert a standard number into scientific notation.",
    keywords: ["scientific notation converter"],
    fields: [{ id: "value", label: "Number", type: "number", defaultValue: 1230000, width: "full" }],
    compute: (v) => {
      const value = num(v.value);
      if (value === 0) return { items: [{ label: "Scientific Notation", value: "0 × 10⁰", emphasis: true }] };
      const exp = Math.floor(Math.log10(Math.abs(value)));
      const mantissa = value / Math.pow(10, exp);
      return {
        items: [{ label: "Scientific Notation", value: `${formatNumber(mantissa, 4)} × 10^${exp}`, emphasis: true }],
        table: {
          headers: ["Multiplier", "Value", "Scientific Notation"],
          rows: [0.01, 0.1, 1, 10, 100].map((mult) => {
            const v2 = value * mult;
            const e2 = Math.floor(Math.log10(Math.abs(v2)));
            const m2 = v2 / Math.pow(10, e2);
            return [`× ${mult}`, formatNumber(v2, 4), `${formatNumber(m2, 4)} × 10^${e2}`];
          }),
        },
      };
    },
    faqs: [{ q: "What's the rule for the mantissa in scientific notation?", a: "The mantissa (the number before ×10^n) is always between 1 and 10 — the exponent is chosen so that condition holds, which is why very large or small numbers get very different exponents." }],
  },
  {
    slug: "rounding",
    title: "Rounding Calculator",
    category: "math",
    description: "Round a number to a given number of decimal places using round, floor or ceiling.",
    keywords: ["rounding calculator", "round number"],
    fields: [
      { id: "value", label: "Number", type: "number", defaultValue: 3.14159, step: 0.00001, width: "half" },
      { id: "decimals", label: "Decimal Places", type: "number", defaultValue: 2, width: "half" },
    ],
    compute: (v) => {
      const value = num(v.value), decimals = Math.round(num(v.decimals));
      const factor = Math.pow(10, decimals);
      return {
        items: [
          { label: "Rounded", value: formatNumber(Math.round(value * factor) / factor, decimals), emphasis: true },
          { label: "Floor", value: formatNumber(Math.floor(value * factor) / factor, decimals) },
          { label: "Ceiling", value: formatNumber(Math.ceil(value * factor) / factor, decimals) },
        ],
        chart: {
          type: "bar",
          labels: ["Original", "Rounded", "Floor", "Ceiling"],
          series: [{ name: "Value", data: [value, Math.round(value * factor) / factor, Math.floor(value * factor) / factor, Math.ceil(value * factor) / factor], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What's the difference between round, floor, and ceiling?", a: "Round goes to the nearest value. Floor always rounds down (toward negative infinity), and ceiling always rounds up (toward positive infinity), regardless of which is closer." }],
  },
  {
    slug: "prime-check",
    title: "Prime Number Checker",
    category: "math",
    description: "Check whether a number is prime and see its factors if it isn't.",
    keywords: ["prime number checker", "is it a prime number"],
    fields: [{ id: "n", label: "Number", type: "number", defaultValue: 97, width: "full" }],
    compute: (v) => {
      const n = Math.round(num(v.n));
      if (n < 2) return { items: [{ label: "Result", value: "Not prime", emphasis: true }] };
      const factors: number[] = [];
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) { factors.push(i); if (i !== n / i) factors.push(n / i); }
      }
      const isPrime = factors.length === 0;
      const testPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].filter((p) => p <= n);
      return {
        items: [
          { label: "Result", value: isPrime ? "Prime ✓" : "Not Prime", emphasis: true },
          ...(isPrime ? [] : [{ label: "Factors", value: factors.sort((a, b) => a - b).join(", ") }]),
        ],
        table: {
          headers: ["Divisor", "Divides Evenly?"],
          rows: testPrimes.map((p) => [p, n % p === 0 ? "Yes" : "No"]),
        },
      };
    },
    faqs: [{ q: "Is 1 a prime number?", a: "No — by definition, a prime number has exactly two distinct positive divisors (1 and itself). Since 1 only has one divisor, it's neither prime nor composite." }],
  },
  {
    slug: "sig-fig",
    title: "Significant Figures Calculator",
    shortTitle: "Sig Fig Calculator",
    category: "math",
    description: "Count the significant figures in a number and round to a chosen number of sig figs.",
    keywords: ["significant figures calculator", "sig fig calculator"],
    fields: [
      { id: "value", label: "Number", type: "text", defaultValue: "0.004520", width: "half" },
      { id: "sigFigs", label: "Round to Sig Figs", type: "number", defaultValue: 2, width: "half" },
    ],
    compute: (v) => {
      const raw = str(v.value).trim();
      const num2 = parseFloat(raw);
      if (isNaN(num2)) return { items: [], error: "Enter a valid number." };
      const digitsOnly = raw.replace(/^-?0+(?=\.)|^-?0+(?=[1-9])|[^0-9]/g, "");
      const trimmedLeadingZeros = digitsOnly.replace(/^0+(?=\d)/, "");
      const count = trimmedLeadingZeros.length || 1;
      const rounded = Number(num2.toPrecision(Math.max(1, Math.round(num(v.sigFigs)))));
      return {
        items: [
          { label: "Significant Figures", value: String(count), emphasis: true },
          { label: "Rounded Value", value: String(rounded) },
        ],
        table: {
          headers: ["Sig Figs", "Rounded Value"],
          rows: [1, 2, 3, 4, 5].map((sf) => [sf, String(Number(num2.toPrecision(sf)))]),
        },
      };
    },
    faqs: [{ q: "Do trailing zeros count as significant figures?", a: "Trailing zeros after a decimal point are significant (2.50 has 3 sig figs), but trailing zeros in a whole number without a decimal point are ambiguous (200 could have 1, 2, or 3) — this calculator treats digits based on the text you enter." }],
  },
  {
    slug: "half-life",
    title: "Half-Life Calculator",
    category: "math",
    description: "Calculate the remaining quantity of a substance after radioactive or exponential decay.",
    keywords: ["half life calculator"],
    fields: [
      { id: "initial", label: "Initial Quantity", type: "number", defaultValue: 100, width: "third" },
      { id: "halfLife", label: "Half-Life", type: "number", unit: "time units", defaultValue: 5, width: "third" },
      { id: "elapsed", label: "Elapsed Time", type: "number", unit: "time units", defaultValue: 12, width: "third" },
    ],
    compute: (v) => {
      const remaining = num(v.initial) * Math.pow(0.5, num(v.elapsed) / num(v.halfLife));
      const timeSpan = Math.max(num(v.elapsed) * 1.5, num(v.halfLife) * 4, 1);
      const points = 10;
      const decayData: number[] = [];
      const decayLabels: string[] = [];
      for (let i = 0; i <= points; i++) {
        const t = (timeSpan / points) * i;
        decayLabels.push(formatNumber(t, 1));
        decayData.push(Number((num(v.initial) * Math.pow(0.5, t / num(v.halfLife))).toFixed(4)));
      }
      return {
        items: [
          { label: "Remaining Quantity", value: formatNumber(remaining, 4), emphasis: true },
          { label: "Percent Remaining", value: `${formatNumber((remaining / num(v.initial)) * 100, 2)}%` },
        ],
        chart: {
          type: "line",
          labels: decayLabels,
          series: [{ name: "Remaining Quantity", data: decayData, color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What's the formula behind half-life decay?", a: "Remaining quantity = initial × 0.5^(elapsed time / half-life). Each time one full half-life passes, exactly half of the remaining quantity decays away." }],
  },
  {
    slug: "density",
    title: "Density Calculator",
    category: "math",
    description: "Calculate density from mass and volume, or solve for mass or volume.",
    keywords: ["density calculator"],
    fields: [
      { id: "mass", label: "Mass", type: "number", unit: "g", defaultValue: 500, width: "half" },
      { id: "volume", label: "Volume", type: "number", unit: "cm³", defaultValue: 200, width: "half" },
    ],
    compute: (v) => ({
      items: [{ label: "Density", value: `${formatNumber(num(v.mass) / num(v.volume), 4)} g/cm³`, emphasis: true }],
      chart: {
        type: "bar",
        labels: ["This Object", "Water"],
        series: [{ name: "Density (g/cm³)", data: [num(v.mass) / num(v.volume), 1], color: "primary" }],
      },
    }),
    faqs: [{ q: "How do I know if an object will float in water?", a: "Water has a density of about 1 g/cm³. An object floats if its density is less than that, and sinks if it's greater — this is why ice (about 0.92 g/cm³) floats but a rock doesn't." }],
  },
  {
    slug: "interpolation",
    title: "Linear Interpolation Calculator",
    shortTitle: "Interpolation Calculator",
    category: "math",
    description: "Estimate an unknown value between two known data points using linear interpolation.",
    keywords: ["linear interpolation calculator"],
    fields: [
      { id: "x1", label: "x1", type: "number", defaultValue: 0, width: "third" },
      { id: "y1", label: "y1", type: "number", defaultValue: 0, width: "third" },
      { id: "x2", label: "x2", type: "number", defaultValue: 10, width: "third" },
      { id: "y2", label: "y2", type: "number", defaultValue: 100, width: "third" },
      { id: "x", label: "Target x", type: "number", defaultValue: 4, width: "third" },
    ],
    compute: (v) => {
      const x1 = num(v.x1), y1 = num(v.y1), x2 = num(v.x2), y2 = num(v.y2), x = num(v.x);
      if (x2 === x1) return { items: [], error: "x1 and x2 must be different." };
      const y = y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
      return {
        items: [{ label: "Interpolated y", value: formatNumber(y, 4), emphasis: true }],
        table: {
          headers: ["Point", "x", "y"],
          rows: [["Known 1", formatNumber(x1, 3), formatNumber(y1, 3)], ["Target", formatNumber(x, 3), formatNumber(y, 3)], ["Known 2", formatNumber(x2, 3), formatNumber(y2, 3)]],
        },
      };
    },
    faqs: [{ q: "What is linear interpolation used for?", a: "It estimates a value between two known data points assuming a straight line connects them — common in engineering tables, graphing, and filling gaps in measured data." }],
  },
  {
    slug: "percentage-error",
    title: "Percentage Error Calculator",
    category: "math",
    description: "Calculate the percentage error between an experimental value and a true value.",
    keywords: ["percentage error calculator", "percent error"],
    fields: [
      { id: "trueValue", label: "True (Accepted) Value", type: "number", defaultValue: 100, width: "half" },
      { id: "experimental", label: "Experimental (Measured) Value", type: "number", defaultValue: 97, width: "half" },
    ],
    compute: (v) => {
      const trueValue = num(v.trueValue), exp = num(v.experimental);
      const error = (Math.abs(exp - trueValue) / Math.abs(trueValue)) * 100;
      return {
        items: [{ label: "Percentage Error", value: `${formatNumber(error, 3)}%`, emphasis: true }],
        chart: { type: "bar", labels: ["True Value", "Experimental Value"], series: [{ name: "Value", data: [trueValue, exp], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why does the formula use absolute value?", a: "Percentage error measures the size of the discrepancy regardless of direction — using absolute value means a measurement that's too high and one that's too low by the same amount both show the same percentage error." }],
  },
  {
    slug: "z-score",
    title: "Z-Score Calculator",
    category: "math",
    description: "Calculate the z-score (standard score) of a value given the mean and standard deviation.",
    keywords: ["z score calculator", "standard score calculator"],
    fields: [
      { id: "value", label: "Value (x)", type: "number", defaultValue: 85, width: "third" },
      { id: "mean", label: "Mean (μ)", type: "number", defaultValue: 75, width: "third" },
      { id: "stdDev", label: "Standard Deviation (σ)", type: "number", defaultValue: 8, width: "third" },
    ],
    compute: (v) => {
      const z = (num(v.value) - num(v.mean)) / num(v.stdDev);
      const mean = num(v.mean), sd = num(v.stdDev);
      return {
        items: [{ label: "Z-Score", value: formatNumber(z, 4), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["-2σ", "-1σ", "Mean", "+1σ", "+2σ", "Your Value"],
          series: [{ name: "Value", data: [mean - 2 * sd, mean - sd, mean, mean + sd, mean + 2 * sd, num(v.value)], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "How do I interpret a z-score?", a: "A z-score tells you how many standard deviations a value is from the mean. A z-score of 0 means exactly average; +2 means notably above average (roughly top 2.5% in a normal distribution); -2 means notably below." }],
  },
  {
    slug: "weighted-average",
    title: "Weighted Average Calculator",
    category: "math",
    description: "Calculate a weighted average from a list of values and their corresponding weights.",
    keywords: ["weighted average calculator"],
    fields: [
      { id: "values", label: "Values (comma separated)", type: "text", defaultValue: "90, 80, 70", width: "full" },
      { id: "weights", label: "Weights (comma separated)", type: "text", defaultValue: "0.5, 0.3, 0.2", width: "full" },
    ],
    compute: (v) => {
      const values = parseNumberList(str(v.values));
      const weights = parseNumberList(str(v.weights));
      if (values.length !== weights.length || values.length === 0) return { items: [], error: "Enter the same number of values and weights." };
      const totalWeight = weights.reduce((s, w) => s + w, 0);
      const weightedSum = values.reduce((s, val, i) => s + val * weights[i], 0);
      return {
        items: [{ label: "Weighted Average", value: formatNumber(weightedSum / totalWeight, 4), emphasis: true }],
        table: {
          headers: ["Value", "Weight", "Contribution"],
          rows: values.map((val, i) => [formatNumber(val, 3), formatNumber(weights[i], 3), formatNumber((val * weights[i]) / totalWeight, 3)]),
        },
      };
    },
    faqs: [{ q: "Do the weights need to add up to 1?", a: "No — the calculator normalizes by dividing by the total weight, so weights like 2, 3, 5 work exactly the same as 0.2, 0.3, 0.5. Only the relative proportions matter." }],
  },
  {
    slug: "proportion",
    title: "Proportion Calculator",
    category: "math",
    description: "Solve for the missing value in a proportion, A/B = C/D.",
    keywords: ["proportion calculator", "solve for x"],
    fields: [
      { id: "a", label: "A", type: "number", defaultValue: 3, width: "third" },
      { id: "b", label: "B", type: "number", defaultValue: 4, width: "third" },
      { id: "c", label: "C", type: "number", defaultValue: 9, width: "third" },
    ],
    compute: (v) => {
      const a = num(v.a), b = num(v.b), c = num(v.c);
      const d = (b * c) / a;
      return {
        items: [{ label: "D (A/B = C/D)", value: formatNumber(d, 4), emphasis: true }],
        chart: { type: "bar", labels: ["A", "B", "C", "D"], series: [{ name: "Value", data: [a, b, c, d], color: "primary" }] },
      };
    },
    faqs: [{ q: "How do I solve a proportion by hand?", a: "Cross-multiply: A × D = B × C, then divide to isolate the unknown. This calculator does exactly that — solving D = (B × C) / A." }],
  },
  {
    slug: "trigonometry",
    title: "Right Triangle Trig Calculator",
    shortTitle: "Trig Calculator",
    category: "math",
    description: "Solve a right triangle's sides and angles given one side and one angle.",
    keywords: ["trigonometry calculator", "right triangle solver", "sin cos tan calculator"],
    fields: [
      { id: "side", label: "Known Side (adjacent to angle)", type: "number", defaultValue: 10, width: "half" },
      { id: "angle", label: "Known Angle", type: "number", unit: "degrees", defaultValue: 35, width: "half" },
    ],
    compute: (v) => {
      const side = num(v.side), angleDeg = num(v.angle);
      const angleRad = (angleDeg * Math.PI) / 180;
      const opposite = side * Math.tan(angleRad);
      const hypotenuse = side / Math.cos(angleRad);
      return {
        items: [
          { label: "Opposite Side", value: formatNumber(opposite, 4), emphasis: true },
          { label: "Hypotenuse", value: formatNumber(hypotenuse, 4) },
          { label: "Other Angle", value: `${formatNumber(90 - angleDeg, 2)}°` },
        ],
        chart: {
          type: "bar",
          labels: ["Adjacent", "Opposite", "Hypotenuse"],
          series: [{ name: "Length", data: [side, opposite, hypotenuse], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Which trig functions does this use?", a: "It uses tangent (opposite = adjacent × tan(angle)) to find the opposite side, and cosine (hypotenuse = adjacent / cos(angle)) to find the hypotenuse, since the known side is treated as adjacent to the given angle." }],
  },
];
