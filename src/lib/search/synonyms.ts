// Maps common alternate phrasings to the terms actually used in our calculator
// titles/keywords, so searches like "gratuity" or "take home pay" still find
// the right tool. This is a hand-built synonym dictionary, not AI-generated —
// keeps search fast and fully client-side with no external API calls.
const SYNONYM_GROUPS: string[][] = [
  ["mortgage", "home loan", "house payment"],
  ["loan", "borrow", "borrowing"],
  ["tip", "gratuity"],
  ["bmi", "body mass index"],
  ["salary", "wage", "paycheck", "take home pay", "net pay"],
  ["gpa", "grade point average"],
  ["percentage", "percent", "%"],
  ["retirement", "401k", "pension", "nest egg"],
  ["car loan", "auto loan", "vehicle loan"],
  ["interest", "apr", "rate"],
  ["weight", "mass"],
  ["calories", "calorie", "kcal", "energy"],
  ["convert", "conversion", "converter"],
  ["age", "how old", "birthday"],
  ["discount", "sale", "percent off", "markdown"],
  ["tax", "irs", "taxes"],
  ["investment", "investing", "portfolio", "stocks"],
  ["due date", "pregnancy", "conception"],
  ["body fat", "fat percentage"],
  ["date", "days between", "date difference"],
  ["standard deviation", "variance", "stdev"],
  ["fraction", "fractions"],
  ["temperature", "celsius", "fahrenheit"],
  ["time zone", "timezone"],
  ["password", "passcode"],
  ["scientific calculator", "sci calc", "trig"],
  ["down payment", "deposit"],
  ["credit card", "credit"],
  ["estate tax", "inheritance tax"],
  ["capital gains", "stock gains", "investment gains"],
  ["self employed", "freelance", "1099", "contractor"],
  ["w2", "w-2", "employee"],
];

const synonymIndex: Map<string, Set<string>> = new Map();
for (const group of SYNONYM_GROUPS) {
  const all = new Set(group);
  for (const term of group) {
    const existing = synonymIndex.get(term) ?? new Set<string>();
    all.forEach((t) => existing.add(t));
    synonymIndex.set(term, existing);
  }
}

/** Given a raw query, returns the query plus any synonym terms that should also match. */
export function expandQuery(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const expanded = new Set<string>([q]);
  for (const [term, group] of synonymIndex) {
    if (q.includes(term)) {
      group.forEach((t) => expanded.add(t));
    }
  }
  return [...expanded];
}
