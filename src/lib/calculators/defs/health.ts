import { CalculatorDefinition } from "../types";
import { formatNumber, formatPercent, num, str } from "@/lib/format";

const genderField = { id: "gender", label: "Sex", type: "radio" as const, defaultValue: "male", options: [
  { value: "male", label: "Male" }, { value: "female", label: "Female" },
], width: "full" as const };

const unitField = { id: "units", label: "Units", type: "radio" as const, defaultValue: "imperial", options: [
  { value: "imperial", label: "Imperial (lb, in)" }, { value: "metric", label: "Metric (kg, cm)" },
], width: "full" as const };

function toKg(weight: number, units: string) { return units === "metric" ? weight : weight * 0.453592; }
function toCm(height: number, units: string) { return units === "metric" ? height : height * 2.54; }

export const healthCalculators: CalculatorDefinition[] = [
  {
    slug: "bmi",
    title: "BMI Calculator",
    category: "health",
    popular: true,
    description: "Calculate your Body Mass Index (BMI) and see which weight category you fall into.",
    keywords: ["bmi calculator", "body mass index"],
    fields: [
      unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const m = toCm(num(v.height), str(v.units)) / 100;
      const bmi = kg / (m * m);
      const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
      return {
        items: [
          { label: "Your BMI", value: formatNumber(bmi, 1), emphasis: true },
          { label: "Category", value: category },
        ],
        chart: {
          type: "bar",
          labels: ["Underweight (<18.5)", "Normal (18.5–24.9)", "Overweight (25–29.9)", "Obese (30+)", "Your BMI"],
          series: [{ name: "BMI", data: [18.5, 22.2, 27.5, 32, bmi], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Is BMI accurate for everyone?", a: "BMI is a useful screening tool but doesn't account for muscle mass, so athletes and very muscular people may show a higher BMI than their body fat suggests." }],
  },
  {
    slug: "bmi-prime",
    title: "BMI Prime Calculator",
    category: "health",
    description: "Calculate BMI Prime — the ratio of your BMI to the upper limit of normal BMI (25).",
    keywords: ["bmi prime calculator"],
    fields: [unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const m = toCm(num(v.height), str(v.units)) / 100;
      const bmi = kg / (m * m);
      return {
        items: [{ label: "BMI Prime", value: formatNumber(bmi / 25, 2), emphasis: true }],
        note: "A BMI Prime under 1.0 indicates a BMI under 25.",
        chart: { type: "bar", labels: ["Threshold (1.0)", "Your BMI Prime"], series: [{ name: "BMI Prime", data: [1.0, bmi / 25], color: "primary" }] },
      };
    },
    faqs: [{ q: "What's the point of BMI Prime over regular BMI?", a: "BMI Prime expresses your BMI as a simple ratio to the upper healthy limit (25), so a value of exactly 1.0 always means the boundary of \"normal,\" regardless of units — it's easier to compare across different scales at a glance." }],
  },
  {
    slug: "calorie",
    title: "Calorie Calculator",
    category: "health",
    popular: true,
    description: "Estimate your daily calorie needs to maintain, lose or gain weight.",
    keywords: ["calorie calculator", "tdee"],
    presets: [
      { label: "Sedentary office worker", values: { age: 32, weight: 170, height: 67, activity: "1.2" } },
      { label: "Active adult", values: { age: 30, weight: 160, height: 68, activity: "1.55" } },
      { label: "Athlete in training", values: { age: 25, weight: 175, height: 71, activity: "1.9" } },
    ],
    fields: [
      genderField, unitField,
      { id: "age", label: "Age", type: "number", defaultValue: 30, width: "half" },
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
      { id: "activity", label: "Activity Level", type: "select", defaultValue: "1.55", options: [
        { value: "1.2", label: "Sedentary" }, { value: "1.375", label: "Light exercise" }, { value: "1.55", label: "Moderate exercise" }, { value: "1.725", label: "Heavy exercise" }, { value: "1.9", label: "Athlete" },
      ], width: "full" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const cm = toCm(num(v.height), str(v.units));
      const bmr = v.gender === "male"
        ? 10 * kg + 6.25 * cm - 5 * num(v.age) + 5
        : 10 * kg + 6.25 * cm - 5 * num(v.age) - 161;
      const tdee = bmr * num(v.activity);
      return {
        items: [
          { label: "Maintain Weight", value: `${formatNumber(tdee, 0)} cal/day`, emphasis: true },
          { label: "Mild Weight Loss (-10%)", value: `${formatNumber(tdee * 0.9, 0)} cal/day` },
          { label: "Weight Loss (-20%)", value: `${formatNumber(tdee * 0.8, 0)} cal/day` },
          { label: "Mild Weight Gain (+10%)", value: `${formatNumber(tdee * 1.1, 0)} cal/day` },
          { label: "Basal Metabolic Rate", value: `${formatNumber(bmr, 0)} cal/day` },
        ],
        chart: {
          type: "bar",
          labels: ["BMR", "Loss (-20%)", "Mild Loss (-10%)", "Maintain", "Mild Gain (+10%)"],
          series: [{ name: "Calories/day", data: [bmr, tdee * 0.8, tdee * 0.9, tdee, tdee * 1.1], color: "primary" }],
        },
      };
    },
    faqs: [
      { q: "How many calories should I eat to lose weight?", a: "A deficit of about 500 calories/day below your maintenance level typically produces roughly 1 lb of weight loss per week. This calculator's -10% and -20% figures give you a mild and moderate deficit to choose from." },
      { q: "What's the difference between BMR and TDEE?", a: "BMR is the calories you'd burn at complete rest. TDEE adds your activity level on top of BMR, giving your actual maintenance calories for a normal day." },
    ],
  },
  {
    slug: "bmr",
    title: "BMR Calculator",
    category: "health",
    description: "Calculate your Basal Metabolic Rate — calories burned at complete rest.",
    keywords: ["bmr calculator", "basal metabolic rate"],
    fields: [genderField, unitField,
      { id: "age", label: "Age", type: "number", defaultValue: 30, width: "half" },
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const cm = toCm(num(v.height), str(v.units));
      const bmr = v.gender === "male" ? 10 * kg + 6.25 * cm - 5 * num(v.age) + 5 : 10 * kg + 6.25 * cm - 5 * num(v.age) - 161;
      return {
        items: [{ label: "Basal Metabolic Rate", value: `${formatNumber(bmr, 0)} cal/day`, emphasis: true }],
        table: {
          headers: ["Activity Level", "Total Daily Calories"],
          rows: [
            ["Sedentary", formatNumber(bmr * 1.2, 0)], ["Light exercise", formatNumber(bmr * 1.375, 0)], ["Moderate exercise", formatNumber(bmr * 1.55, 0)],
            ["Heavy exercise", formatNumber(bmr * 1.725, 0)], ["Athlete", formatNumber(bmr * 1.9, 0)],
          ],
        },
      };
    },
    faqs: [{ q: "What formula does this use?", a: "The Mifflin-St Jeor equation, generally considered the most accurate BMR formula for most people, more so than the older Harris-Benedict equation." }],
  },
  {
    slug: "tdee",
    title: "TDEE Calculator",
    category: "health",
    description: "Calculate your Total Daily Energy Expenditure based on activity level.",
    keywords: ["tdee calculator"],
    fields: [genderField, unitField,
      { id: "age", label: "Age", type: "number", defaultValue: 30, width: "half" },
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
      { id: "activity", label: "Activity Level", type: "select", defaultValue: "1.55", options: [
        { value: "1.2", label: "Sedentary" }, { value: "1.375", label: "Light exercise" }, { value: "1.55", label: "Moderate exercise" }, { value: "1.725", label: "Heavy exercise" }, { value: "1.9", label: "Athlete" },
      ], width: "full" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const cm = toCm(num(v.height), str(v.units));
      const bmr = v.gender === "male" ? 10 * kg + 6.25 * cm - 5 * num(v.age) + 5 : 10 * kg + 6.25 * cm - 5 * num(v.age) - 161;
      return {
        items: [{ label: "TDEE", value: `${formatNumber(bmr * num(v.activity), 0)} cal/day`, emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Sedentary", "Light", "Moderate", "Heavy", "Athlete"],
          series: [{ name: "TDEE (cal/day)", data: [1.2, 1.375, 1.55, 1.725, 1.9].map((f) => Math.round(bmr * f)), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Should I eat exactly my TDEE every day?", a: "TDEE is your maintenance level — eat at it to hold steady weight, below it to lose, above it to gain. It's an estimate, so treat it as a starting point and adjust based on your real-world results over a few weeks." }],
  },
  {
    slug: "body-fat",
    title: "Body Fat Calculator",
    category: "health",
    popular: true,
    description: "Estimate body fat percentage using the U.S. Navy circumference method.",
    keywords: ["body fat calculator", "body fat percentage"],
    fields: [genderField, unitField,
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
      { id: "neck", label: "Neck", type: "number", unit: "in", defaultValue: 15, width: "half" },
      { id: "waist", label: "Waist", type: "number", unit: "in", defaultValue: 34, width: "half" },
      { id: "hip", label: "Hip (women only)", type: "number", unit: "in", defaultValue: 38, width: "half" },
    ],
    compute: (v) => {
      const height = toCm(num(v.height), str(v.units));
      const neck = toCm(num(v.neck), str(v.units));
      const waist = toCm(num(v.waist), str(v.units));
      const hip = toCm(num(v.hip), str(v.units));
      let bf: number;
      if (v.gender === "male") {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      } else {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;
      }
      const bands = v.gender === "male" ? [3.5, 9.5, 15.5, 21, 28] : [11.5, 17, 22.5, 28, 35];
      return {
        items: [{ label: "Estimated Body Fat", value: formatPercent(bf, 1), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Essential", "Athletic", "Fitness", "Average", "Obese", "You"],
          series: [{ name: "Body Fat %", data: [...bands, bf], color: "primary" }],
        },
      };
    },
    faqs: [
      { q: "How accurate is the Navy circumference method?", a: "It's typically within 3-4% of body fat measured by DEXA scan for most people — accurate enough to track trends, but not a medical-grade measurement." },
      { q: "Where exactly should I measure my waist and neck?", a: "Measure your neck just below the larynx, and your waist at the narrowest point (for men) or at the belly button level (for women), keeping the tape snug but not compressing the skin." },
    ],
  },
  {
    slug: "army-body-fat",
    title: "Army Body Fat Calculator",
    category: "health",
    description: "Estimate body fat percentage using the U.S. Army circumference-based method.",
    keywords: ["army body fat calculator"],
    fields: [genderField, unitField,
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
      { id: "neck", label: "Neck", type: "number", unit: "in", defaultValue: 15, width: "half" },
      { id: "waist", label: "Waist", type: "number", unit: "in", defaultValue: 34, width: "half" },
      { id: "hip", label: "Hip (women only)", type: "number", unit: "in", defaultValue: 38, width: "half" },
    ],
    compute: (v) => {
      const height = toCm(num(v.height), str(v.units));
      const neck = toCm(num(v.neck), str(v.units));
      const waist = toCm(num(v.waist), str(v.units));
      const hip = toCm(num(v.hip), str(v.units));
      let bf: number;
      if (v.gender === "male") {
        bf = 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
      } else {
        bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
      }
      const bands = v.gender === "male" ? [3.5, 9.5, 15.5, 21, 28] : [11.5, 17, 22.5, 28, 35];
      return {
        items: [{ label: "Estimated Body Fat", value: formatPercent(bf, 1), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Essential", "Athletic", "Fitness", "Average", "Obese", "You"],
          series: [{ name: "Body Fat %", data: [...bands, bf], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "How is this different from the Navy method?", a: "It uses different regression coefficients calibrated on military personnel data, but the same underlying measurements (neck, waist, and hip for women). Results are usually close to the Navy method but not identical." }],
  },
  {
    slug: "ideal-weight",
    title: "Ideal Weight Calculator",
    category: "health",
    description: "Estimate your ideal body weight using the Devine formula.",
    keywords: ["ideal weight calculator"],
    fields: [genderField, unitField,
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
    ],
    compute: (v) => {
      const cm = toCm(num(v.height), str(v.units));
      const inches = cm / 2.54;
      const overFive = Math.max(inches - 60, 0);
      const kg = v.gender === "male" ? 50 + 2.3 * overFive : 45.5 + 2.3 * overFive;
      const lb = kg / 0.453592;
      const isMale = v.gender === "male";
      const robinson = isMale ? 52 + 1.9 * overFive : 49 + 1.7 * overFive;
      const miller = isMale ? 56.2 + 1.41 * overFive : 53.1 + 1.36 * overFive;
      const hamwi = isMale ? 48 + 2.7 * overFive : 45.5 + 2.2 * overFive;
      return {
        items: [{ label: "Ideal Weight", value: `${formatNumber(kg, 1)} kg (${formatNumber(lb, 1)} lb)`, emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Devine", "Robinson", "Miller", "Hamwi"],
          series: [{ name: "Ideal Weight (kg)", data: [kg, robinson, miller, hamwi], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Is the Devine formula the only \"ideal weight\" formula?", a: "No — Robinson, Miller, and Hamwi formulas also exist and give slightly different results. Devine is the most widely used, originally developed for medication dosing rather than as a fitness target." }],
  },
  {
    slug: "healthy-weight",
    title: "Healthy Weight Range Calculator",
    shortTitle: "Healthy Weight",
    category: "health",
    description: "Find the healthy weight range for your height based on normal BMI (18.5–24.9).",
    keywords: ["healthy weight calculator"],
    fields: [unitField, { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "full" }],
    compute: (v) => {
      const m = toCm(num(v.height), str(v.units)) / 100;
      const lowKg = 18.5 * m * m, highKg = 24.9 * m * m;
      const toLb = (kg: number) => kg / 0.453592;
      return {
        items: [
          { label: "Healthy Weight Range", value: `${formatNumber(lowKg, 1)}–${formatNumber(highKg, 1)} kg`, emphasis: true },
          { label: "In Pounds", value: `${formatNumber(toLb(lowKg), 1)}–${formatNumber(toLb(highKg), 1)} lb` },
        ],
        chart: { type: "bar", labels: ["Low End (BMI 18.5)", "High End (BMI 24.9)"], series: [{ name: "Weight (kg)", data: [lowKg, highKg], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why is there a range instead of one target number?", a: "\"Normal\" BMI itself spans 18.5–24.9, so any weight within that range at your height counts as healthy by this measure — there's no single \"correct\" weight." }],
  },
  {
    slug: "lean-body-mass",
    title: "Lean Body Mass Calculator",
    category: "health",
    description: "Estimate your lean body mass using the Boer formula.",
    keywords: ["lean body mass calculator"],
    fields: [genderField, unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const cm = toCm(num(v.height), str(v.units));
      const lbm = v.gender === "male" ? 0.407 * kg + 0.267 * cm - 19.2 : 0.252 * kg + 0.473 * cm - 48.3;
      return {
        items: [
          { label: "Lean Body Mass", value: `${formatNumber(lbm, 1)} kg`, emphasis: true },
          { label: "Body Fat Mass", value: `${formatNumber(kg - lbm, 1)} kg` },
        ],
        chart: { type: "donut", labels: ["Lean Mass", "Fat Mass"], series: [{ name: "Total Weight", data: [lbm, Math.max(kg - lbm, 0)] }] },
      };
    },
    faqs: [{ q: "What's the difference between lean body mass and muscle mass?", a: "Lean body mass includes everything that isn't fat — muscle, bone, organs, and water — so it's always higher than muscle mass alone. It's a broader (and easier to estimate) measure." }],
  },
  {
    slug: "macro",
    title: "Macro Calculator",
    category: "health",
    description: "Calculate your daily protein, carb and fat targets based on calorie goal.",
    keywords: ["macro calculator", "macronutrients"],
    presets: [
      { label: "Balanced, 2200 cal", values: { calories: 2200, goal: "balanced" } },
      { label: "Low carb, 2000 cal", values: { calories: 2000, goal: "lowcarb" } },
      { label: "High protein, 2500 cal", values: { calories: 2500, goal: "highprotein" } },
    ],
    fields: [
      { id: "calories", label: "Daily Calorie Target", type: "number", unit: "cal", defaultValue: 2200, width: "half" },
      { id: "goal", label: "Goal", type: "select", defaultValue: "balanced", options: [
        { value: "balanced", label: "Balanced (40/30/30)" }, { value: "lowcarb", label: "Low Carb (25/45/30)" }, { value: "highprotein", label: "High Protein (35/40/25)" },
      ], width: "half" },
    ],
    compute: (v) => {
      const cal = num(v.calories);
      const splits: Record<string, [number, number, number]> = {
        balanced: [0.4, 0.3, 0.3], lowcarb: [0.25, 0.3, 0.45], highprotein: [0.35, 0.25, 0.4],
      };
      const [carbPct, fatPct, proteinPct] = splits[str(v.goal, "balanced")] ?? splits.balanced;
      return {
        items: [
          { label: "Protein", value: `${formatNumber((cal * proteinPct) / 4, 0)} g`, emphasis: true },
          { label: "Carbs", value: `${formatNumber((cal * carbPct) / 4, 0)} g` },
          { label: "Fat", value: `${formatNumber((cal * fatPct) / 9, 0)} g` },
        ],
        chart: {
          type: "donut",
          labels: ["Protein", "Carbs", "Fat"],
          series: [{ name: "Calories", data: [cal * proteinPct, cal * carbPct, cal * fatPct] }],
        },
      };
    },
    faqs: [{ q: "Why do protein and carbs use 4 calories/gram but fat uses 9?", a: "Those are each macronutrient's real energy density — protein and carbohydrates provide about 4 calories per gram, while fat provides about 9, more than double, which is why fat-heavy foods are calorie-dense in small portions." }],
  },
  {
    slug: "fat-intake",
    title: "Daily Fat Intake Calculator",
    shortTitle: "Fat Intake",
    category: "health",
    description: "Calculate a healthy daily fat intake range based on total calories.",
    keywords: ["fat intake calculator"],
    fields: [{ id: "calories", label: "Daily Calories", type: "number", unit: "cal", defaultValue: 2200, width: "full" }],
    compute: (v) => {
      const cal = num(v.calories);
      return {
        items: [{ label: "Recommended Fat Intake", value: `${formatNumber((cal * 0.25) / 9, 0)}–${formatNumber((cal * 0.35) / 9, 0)} g/day`, emphasis: true }],
        chart: { type: "bar", labels: ["Low End (25%)", "High End (35%)"], series: [{ name: "Grams/day", data: [(cal * 0.25) / 9, (cal * 0.35) / 9], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why 25-35% of calories from fat?", a: "This is the range recommended by the Dietary Guidelines for Americans for most adults — enough to support hormone production and nutrient absorption without displacing protein and carbs." }],
  },
  {
    slug: "protein-intake",
    title: "Protein Intake Calculator",
    category: "health",
    description: "Calculate your recommended daily protein intake based on body weight and activity.",
    keywords: ["protein intake calculator"],
    fields: [unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "activity", label: "Activity Level", type: "select", defaultValue: "moderate", options: [
        { value: "sedentary", label: "Sedentary" }, { value: "moderate", label: "Moderately Active" }, { value: "athlete", label: "Athlete / Strength Training" },
      ], width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const factor = v.activity === "athlete" ? 2.0 : v.activity === "moderate" ? 1.4 : 0.8;
      return {
        items: [{ label: "Recommended Protein", value: `${formatNumber(kg * factor, 0)} g/day`, emphasis: true }],
        chart: { type: "bar", labels: ["Sedentary", "Moderately Active", "Athlete"], series: [{ name: "Grams/day", data: [kg * 0.8, kg * 1.4, kg * 2.0], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why does protein need scale with body weight rather than calories?", a: "Muscle maintenance and repair scale with lean body mass, not total energy intake, so protein recommendations are typically given per kilogram of body weight rather than as a percentage of calories." }],
  },
  {
    slug: "water-intake",
    title: "Water Intake Calculator",
    category: "health",
    description: "Estimate your recommended daily water intake based on body weight.",
    keywords: ["water intake calculator", "how much water should i drink"],
    fields: [unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "activity", label: "Exercise", type: "number", unit: "min/day", defaultValue: 30, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const baseLiters = kg * 0.033;
      const extra = (num(v.activity) / 30) * 0.35;
      const total = baseLiters + extra;
      return {
        items: [
          { label: "Recommended Water Intake", value: `${formatNumber(total, 1)} L/day`, emphasis: true },
          { label: "In Ounces", value: `${formatNumber(total * 33.814, 0)} oz/day` },
        ],
        chart: { type: "donut", labels: ["Base (Body Weight)", "Extra (Exercise)"], series: [{ name: "Liters", data: [baseLiters, extra] }] },
      };
    },
    faqs: [{ q: "Does this include water from food and other drinks?", a: "No — this is a target for direct water intake specifically. You get additional fluid from food (especially fruits and vegetables) and other beverages, so your total daily fluid need is somewhat higher than this number alone." }],
  },
  {
    slug: "pace",
    title: "Running Pace Calculator",
    category: "health",
    description: "Calculate your running pace per mile or kilometer from distance and time.",
    keywords: ["running pace calculator", "pace calculator"],
    fields: [
      { id: "distance", label: "Distance", type: "number", unit: "mi", defaultValue: 5, width: "half" },
      { id: "hours", label: "Hours", type: "number", defaultValue: 0, width: "third" },
      { id: "minutes", label: "Minutes", type: "number", defaultValue: 45, width: "third" },
      { id: "seconds", label: "Seconds", type: "number", defaultValue: 0, width: "third" },
    ],
    compute: (v) => {
      const totalMinutes = num(v.hours) * 60 + num(v.minutes) + num(v.seconds) / 60;
      const pace = totalMinutes / num(v.distance);
      const paceMin = Math.floor(pace), paceSec = Math.round((pace - paceMin) * 60);
      const speed = num(v.distance) / (totalMinutes / 60);
      const fmtTime = (mins: number) => {
        const h = Math.floor(mins / 60), m = Math.floor(mins % 60), s = Math.round((mins % 1) * 60);
        return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
      };
      return {
        items: [
          { label: "Pace", value: `${paceMin}:${String(paceSec).padStart(2, "0")} /mi`, emphasis: true },
          { label: "Speed", value: `${formatNumber(speed, 2)} mph` },
        ],
        table: {
          headers: ["Race Distance", "Predicted Finish Time"],
          rows: [
            ["5K (3.1 mi)", fmtTime(pace * 3.10686)],
            ["10K (6.2 mi)", fmtTime(pace * 6.21371)],
            ["Half Marathon", fmtTime(pace * 13.1094)],
            ["Marathon", fmtTime(pace * 26.2188)],
          ],
        },
      };
    },
    faqs: [{ q: "How do I use this to plan a race pace?", a: "Enter your goal distance and target finish time to see the per-mile pace you need to hold — a useful sanity check that your goal is realistic for your current training." }],
  },
  {
    slug: "vo2-max",
    title: "VO2 Max Calculator",
    category: "health",
    description: "Estimate VO2 max from resting and maximum heart rate (non-exercise method).",
    keywords: ["vo2 max calculator"],
    fields: [
      { id: "restingHr", label: "Resting Heart Rate", type: "number", unit: "bpm", defaultValue: 62, width: "half" },
      { id: "age", label: "Age", type: "number", defaultValue: 30, width: "half" },
    ],
    compute: (v) => {
      const hrMax = 220 - num(v.age);
      const vo2max = 15.3 * (hrMax / num(v.restingHr));
      return {
        items: [{ label: "Estimated VO2 Max", value: `${formatNumber(vo2max, 1)} ml/kg/min`, emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Below Average", "Average", "Good", "Excellent", "You"],
          series: [{ name: "VO2 Max (ml/kg/min)", data: [30, 40, 50, 60, vo2max], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "How accurate is a non-exercise VO2 max estimate?", a: "This resting-heart-rate method is a rough estimate, less accurate than a lab or treadmill test, but useful for tracking your own trend over time as fitness improves and resting heart rate drops." }],
  },
  {
    slug: "one-rep-max",
    title: "One Rep Max Calculator",
    shortTitle: "1RM Calculator",
    category: "health",
    description: "Estimate your one-rep max using the Epley formula.",
    keywords: ["one rep max calculator", "1rm calculator"],
    presets: [
      { label: "Bench press set", values: { weight: 185, reps: 5 } },
      { label: "Squat set", values: { weight: 225, reps: 8 } },
    ],
    fields: [
      { id: "weight", label: "Weight Lifted", type: "number", unit: "lb", defaultValue: 185, width: "half" },
      { id: "reps", label: "Reps Completed", type: "number", defaultValue: 5, width: "half" },
    ],
    compute: (v) => {
      const orm = num(v.weight) * (1 + num(v.reps) / 30);
      return {
        items: [
          { label: "Estimated 1-Rep Max", value: `${formatNumber(orm, 0)} lb`, emphasis: true },
          { label: "80% (5 reps)", value: `${formatNumber(orm * 0.8, 0)} lb` },
          { label: "70% (10 reps)", value: `${formatNumber(orm * 0.7, 0)} lb` },
        ],
        table: {
          headers: ["% of 1RM", "Weight", "Typical Reps"],
          rows: [[100, formatNumber(orm, 0), 1], [90, formatNumber(orm * 0.9, 0), 4], [80, formatNumber(orm * 0.8, 0), 8], [70, formatNumber(orm * 0.7, 0), 12], [60, formatNumber(orm * 0.6, 0), 15]],
        },
      };
    },
    faqs: [{ q: "How accurate is the Epley formula?", a: "It's a well-tested estimate but gets less reliable above about 10 reps — for the most accurate 1RM estimate, use a set of 1-5 reps close to failure." }],
  },
  {
    slug: "target-heart-rate",
    title: "Target Heart Rate Calculator",
    category: "health",
    description: "Calculate your target heart rate training zones using the Karvonen formula.",
    keywords: ["target heart rate calculator"],
    fields: [
      { id: "age", label: "Age", type: "number", defaultValue: 30, width: "half" },
      { id: "restingHr", label: "Resting Heart Rate", type: "number", unit: "bpm", defaultValue: 65, width: "half" },
    ],
    compute: (v) => {
      const hrMax = 220 - num(v.age);
      const reserve = hrMax - num(v.restingHr);
      const zone = (low: number, high: number) => `${Math.round(reserve * low + num(v.restingHr))}–${Math.round(reserve * high + num(v.restingHr))} bpm`;
      return {
        items: [
          { label: "Moderate (50–70%)", value: zone(0.5, 0.7), emphasis: true },
          { label: "Vigorous (70–85%)", value: zone(0.7, 0.85) },
          { label: "Max Heart Rate", value: `${hrMax} bpm` },
        ],
        chart: {
          type: "bar",
          labels: ["Resting", "Moderate Low", "Moderate High", "Vigorous Low", "Vigorous High", "Max"],
          series: [{ name: "BPM", data: [num(v.restingHr), reserve * 0.5 + num(v.restingHr), reserve * 0.7 + num(v.restingHr), reserve * 0.7 + num(v.restingHr), reserve * 0.85 + num(v.restingHr), hrMax], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Why does this use resting heart rate when heart-rate-zones doesn't?", a: "This is the Karvonen method, which factors in your heart rate reserve (max minus resting) for a more personalized zone than the simple percent-of-max method used by the basic heart rate zones calculator." }],
  },
  {
    slug: "heart-rate-zones",
    title: "Heart Rate Training Zones Calculator",
    shortTitle: "HR Training Zones",
    category: "health",
    description: "Calculate your 5 heart-rate training zones based on maximum heart rate.",
    keywords: ["heart rate zones calculator"],
    fields: [{ id: "age", label: "Age", type: "number", defaultValue: 30, width: "full" }],
    compute: (v) => {
      const hrMax = 220 - num(v.age);
      const z = (lo: number, hi: number) => `${Math.round(hrMax * lo)}–${Math.round(hrMax * hi)} bpm`;
      return {
        items: [
          { label: "Zone 1 – Warm Up (50–60%)", value: z(0.5, 0.6) },
          { label: "Zone 2 – Fat Burn (60–70%)", value: z(0.6, 0.7) },
          { label: "Zone 3 – Aerobic (70–80%)", value: z(0.7, 0.8), emphasis: true },
          { label: "Zone 4 – Anaerobic (80–90%)", value: z(0.8, 0.9) },
          { label: "Zone 5 – Max Effort (90–100%)", value: z(0.9, 1.0) },
        ],
        chart: {
          type: "bar",
          labels: ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"],
          series: [{ name: "BPM (midpoint)", data: [0.55, 0.65, 0.75, 0.85, 0.95].map((f) => Math.round(hrMax * f)), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Which zone should I train in most?", a: "For general fitness, most training time is typically spent in Zones 2-3 (aerobic base building), with Zones 4-5 reserved for shorter, harder interval sessions." }],
  },
  {
    slug: "calories-burned",
    title: "Calories Burned Calculator",
    category: "health",
    description: "Estimate calories burned during exercise based on activity, weight and duration.",
    keywords: ["calories burned calculator"],
    presets: [
      { label: "30-min jog", values: { minutes: 30, activity: "6" } },
      { label: "45-min cycling", values: { minutes: 45, activity: "7.5" } },
      { label: "20-min HIIT", values: { minutes: 20, activity: "8.5" } },
    ],
    fields: [unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
      { id: "minutes", label: "Duration", type: "number", unit: "min", defaultValue: 30, width: "half" },
      { id: "activity", label: "Activity", type: "select", defaultValue: "6", options: [
        { value: "3.5", label: "Walking (slow)" }, { value: "6", label: "Jogging" }, { value: "9.8", label: "Running (fast)" }, { value: "7.5", label: "Cycling" }, { value: "8", label: "Swimming" }, { value: "8.5", label: "HIIT" }, { value: "3", label: "Yoga" },
      ], width: "full" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const met = num(v.activity);
      const calories = (met * kg * num(v.minutes)) / 60;
      const activities: [string, number][] = [["Walking", 3.5], ["Yoga", 3], ["Jogging", 6], ["Cycling", 7.5], ["Swimming", 8], ["HIIT", 8.5], ["Running", 9.8]];
      return {
        items: [{ label: "Calories Burned", value: `${formatNumber(calories, 0)} cal`, emphasis: true }],
        chart: {
          type: "bar",
          labels: activities.map(([name]) => name),
          series: [{ name: "Calories Burned", data: activities.map(([, m]) => Math.round((m * kg * num(v.minutes)) / 60)), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What's a MET value?", a: "MET (Metabolic Equivalent of Task) measures how much energy an activity uses relative to sitting still. A MET of 6 means you burn roughly 6x more energy than at rest — it's the standard way exercise science compares activity intensity." }],
  },
  {
    slug: "steps-to-calories",
    title: "Steps to Calories Calculator",
    category: "health",
    description: "Convert your daily step count into an estimated calories burned.",
    keywords: ["steps to calories calculator"],
    fields: [unitField,
      { id: "steps", label: "Steps", type: "number", defaultValue: 10000, width: "half" },
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 160, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const calories = num(v.steps) * 0.0005 * kg;
      return {
        items: [
          { label: "Calories Burned", value: `${formatNumber(calories, 0)} cal`, emphasis: true },
          { label: "Approx. Distance", value: `${formatNumber((num(v.steps) * 0.000473), 1)} mi` },
        ],
        table: {
          headers: ["Steps", "Calories Burned"],
          rows: [5000, 7500, 10000, 15000, 20000].map((s) => [formatNumber(s, 0), formatNumber(s * 0.0005 * kg, 0)]),
        },
      };
    },
    faqs: [{ q: "Is 10,000 steps a scientifically-backed goal?", a: "It originated from a 1960s Japanese pedometer marketing campaign rather than clinical research, but studies do show meaningful health benefits well below 10,000 — even 7,000-8,000 steps/day is associated with lower mortality risk." }],
  },
  {
    slug: "waist-to-hip",
    title: "Waist-to-Hip Ratio Calculator",
    shortTitle: "Waist-to-Hip Ratio",
    category: "health",
    description: "Calculate your waist-to-hip ratio, a marker of health risk related to body fat distribution.",
    keywords: ["waist to hip ratio calculator"],
    fields: [genderField,
      { id: "waist", label: "Waist", type: "number", unit: "in", defaultValue: 32, width: "half" },
      { id: "hip", label: "Hip", type: "number", unit: "in", defaultValue: 38, width: "half" },
    ],
    compute: (v) => {
      const ratio = num(v.waist) / num(v.hip);
      const threshold = v.gender === "male" ? 0.9 : 0.85;
      const risk = ratio < threshold ? "Lower risk" : "Higher risk";
      return {
        items: [
          { label: "Waist-to-Hip Ratio", value: formatNumber(ratio, 2), emphasis: true },
          { label: "Risk Category", value: risk },
        ],
        chart: { type: "bar", labels: ["Risk Threshold", "Your Ratio"], series: [{ name: "Ratio", data: [threshold, ratio], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why does waist-to-hip ratio matter for health risk?", a: "It's a proxy for where you carry fat. Apple-shaped (abdominal) fat storage is more strongly linked to cardiovascular and metabolic risk than pear-shaped (hip/thigh) storage, even at the same total body weight." }],
  },
  {
    slug: "body-adiposity",
    title: "Body Adiposity Index Calculator",
    shortTitle: "Body Adiposity Index",
    category: "health",
    description: "Estimate body fat percentage using hip circumference and height (BAI method).",
    keywords: ["body adiposity index calculator"],
    fields: [unitField,
      { id: "hip", label: "Hip Circumference", type: "number", unit: "in", defaultValue: 38, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
    ],
    compute: (v) => {
      const hipM = toCm(num(v.hip), str(v.units)) / 100;
      const heightM = toCm(num(v.height), str(v.units)) / 100;
      const bai = hipM / Math.pow(heightM, 1.5) - 18;
      return {
        items: [{ label: "Body Adiposity Index", value: formatPercent(bai, 1), emphasis: true }],
        table: {
          headers: ["Hip Circumference", "BAI"],
          rows: [-4, -2, 0, 2, 4].map((delta) => {
            const hip2 = num(v.hip) + delta;
            const hipM2 = toCm(hip2, str(v.units)) / 100;
            return [`${formatNumber(hip2, 1)} in`, formatPercent(hipM2 / Math.pow(heightM, 1.5) - 18, 1)];
          }),
        },
      };
    },
    faqs: [{ q: "Why use hip circumference instead of weight?", a: "BAI was designed as a scale-free alternative to BMI, useful in situations where an accurate scale isn't available — though most research since has found it no more accurate than BMI, just measured differently." }],
  },
  {
    slug: "bac",
    title: "Blood Alcohol Calculator (BAC)",
    shortTitle: "BAC Calculator",
    category: "health",
    description: "Estimate blood alcohol content using the Widmark formula. For education only — never drive after drinking.",
    keywords: ["bac calculator", "blood alcohol calculator"],
    fields: [genderField, unitField,
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 170, width: "half" },
      { id: "drinks", label: "Standard Drinks", type: "number", defaultValue: 3, width: "half" },
      { id: "hours", label: "Hours Since First Drink", type: "number", defaultValue: 2, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const grams = num(v.drinks) * 14;
      const r = v.gender === "male" ? 0.68 : 0.55;
      const bac = (grams / (kg * 1000 * r)) * 100 - 0.015 * num(v.hours);
      const bac0 = (grams / (kg * 1000 * r)) * 100;
      const hoursToZero = Math.min(bac0 / 0.015, 24);
      const timePoints = Array.from({ length: 9 }, (_, i) => (hoursToZero * i) / 8);
      return {
        items: [{ label: "Estimated BAC", value: formatNumber(Math.max(bac, 0), 3), emphasis: true }],
        note: "Educational estimate only. Never drive after drinking — actual BAC varies by metabolism, food intake and more.",
        chart: {
          type: "line",
          labels: timePoints.map((t) => `${formatNumber(t, 1)}h`),
          series: [{ name: "BAC", data: timePoints.map((t) => Number(Math.max(bac0 - 0.015 * t, 0).toFixed(4))), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What counts as a \"standard drink\"?", a: "In the US, a standard drink is about 14 grams of pure alcohol — roughly a 12oz beer, a 5oz glass of wine, or a 1.5oz shot of spirits, even though they're different volumes." }],
  },
  {
    slug: "pregnancy-due-date",
    title: "Pregnancy Due Date Calculator",
    shortTitle: "Due Date Calculator",
    category: "health",
    description: "Estimate your baby's due date from your last menstrual period.",
    keywords: ["pregnancy due date calculator", "due date calculator"],
    fields: [{ id: "lmp", label: "First Day of Last Period", type: "date", width: "full" }],
    compute: (v) => {
      if (!v.lmp) return { items: [] };
      const lmp = new Date(String(v.lmp));
      const due = new Date(lmp.getTime() + 280 * 86400000);
      const today = new Date();
      const weeks = Math.floor((today.getTime() - lmp.getTime()) / (7 * 86400000));
      return {
        items: [
          { label: "Estimated Due Date", value: due.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), emphasis: true },
          { label: "Current Gestational Age", value: weeks >= 0 && weeks <= 45 ? `${weeks} weeks` : "—" },
        ],
        table: {
          headers: ["Milestone", "Date"],
          rows: [
            ["2nd Trimester Begins (Wk 13)", new Date(lmp.getTime() + 13 * 7 * 86400000).toLocaleDateString("en-US")],
            ["3rd Trimester Begins (Wk 27)", new Date(lmp.getTime() + 27 * 7 * 86400000).toLocaleDateString("en-US")],
            ["Full Term (Wk 39)", new Date(lmp.getTime() + 39 * 7 * 86400000).toLocaleDateString("en-US")],
            ["Due Date (Wk 40)", due.toLocaleDateString("en-US")],
          ],
        },
      };
    },
    faqs: [{ q: "How is the due date calculated from my last period?", a: "Naegele's rule adds 280 days (40 weeks) to the first day of your last menstrual period, assuming a typical 28-day cycle with ovulation around day 14 — your doctor may adjust this based on an ultrasound." }],
  },
  {
    slug: "ovulation",
    title: "Ovulation Calculator",
    category: "health",
    description: "Estimate your fertile window and next ovulation date.",
    keywords: ["ovulation calculator"],
    fields: [
      { id: "lmp", label: "First Day of Last Period", type: "date", width: "half" },
      { id: "cycleLength", label: "Average Cycle Length", type: "number", unit: "days", defaultValue: 28, width: "half" },
    ],
    compute: (v) => {
      if (!v.lmp) return { items: [] };
      const lmp = new Date(String(v.lmp));
      const ovulation = new Date(lmp.getTime() + (num(v.cycleLength) - 14) * 86400000);
      const fertileStart = new Date(ovulation.getTime() - 5 * 86400000);
      const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        items: [
          { label: "Estimated Ovulation Date", value: fmt(ovulation), emphasis: true },
          { label: "Fertile Window", value: `${fmt(fertileStart)} – ${fmt(ovulation)}` },
        ],
        table: {
          headers: ["Cycle", "Predicted Ovulation"],
          rows: [0, 1, 2].map((i) => [i === 0 ? "This Cycle" : `+${i} Cycle${i > 1 ? "s" : ""}`, fmt(new Date(ovulation.getTime() + i * num(v.cycleLength) * 86400000))]),
        },
      };
    },
    faqs: [{ q: "How accurate is this if my cycle isn't exactly 28 days?", a: "The calculator adjusts for your actual average cycle length, but ovulation timing can still vary cycle to cycle — tracking basal body temperature or using ovulation test strips gives a more precise real-time signal." }],
  },
  {
    slug: "conception",
    title: "Conception Date Calculator",
    category: "health",
    description: "Estimate the likely conception date from your due date.",
    keywords: ["conception date calculator"],
    fields: [{ id: "dueDate", label: "Due Date", type: "date", width: "full" }],
    compute: (v) => {
      if (!v.dueDate) return { items: [] };
      const due = new Date(String(v.dueDate));
      const conception = new Date(due.getTime() - 266 * 86400000);
      return {
        items: [{ label: "Estimated Conception Date", value: conception.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), emphasis: true }],
        table: {
          headers: ["Milestone", "Date"],
          rows: [
            ["Conception (est.)", conception.toLocaleDateString("en-US")],
            ["2nd Trimester Begins", new Date(conception.getTime() + 91 * 86400000).toLocaleDateString("en-US")],
            ["3rd Trimester Begins", new Date(conception.getTime() + 175 * 86400000).toLocaleDateString("en-US")],
            ["Due Date", due.toLocaleDateString("en-US")],
          ],
        },
      };
    },
    faqs: [{ q: "Why 266 days back from the due date?", a: "266 days is the average length of pregnancy counted from actual conception (as opposed to 280 days counted from the last menstrual period, which includes about two weeks before ovulation)." }],
  },
  {
    slug: "pregnancy-weight-gain",
    title: "Pregnancy Weight Gain Calculator",
    category: "health",
    description: "See the recommended pregnancy weight gain range based on your pre-pregnancy BMI (IOM guidelines).",
    keywords: ["pregnancy weight gain calculator"],
    fields: [unitField,
      { id: "weight", label: "Pre-Pregnancy Weight", type: "number", unit: "lb", defaultValue: 140, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 65, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const m = toCm(num(v.height), str(v.units)) / 100;
      const bmi = kg / (m * m);
      let range = "11.5–16 kg (25–35 lb)";
      let lowKg = 11.5, highKg = 16;
      if (bmi < 18.5) { range = "12.5–18 kg (28–40 lb)"; lowKg = 12.5; highKg = 18; }
      else if (bmi >= 25 && bmi < 30) { range = "7–11.5 kg (15–25 lb)"; lowKg = 7; highKg = 11.5; }
      else if (bmi >= 30) { range = "5–9 kg (11–20 lb)"; lowKg = 5; highKg = 9; }
      return {
        items: [{ label: "Recommended Total Gain", value: range, emphasis: true }, { label: "Pre-Pregnancy BMI", value: formatNumber(bmi, 1) }],
        chart: { type: "bar", labels: ["Low End", "High End"], series: [{ name: "Gain (kg)", data: [lowKg, highKg], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why does the recommended range depend on starting BMI?", a: "The Institute of Medicine guidelines recommend less total weight gain for people who start pregnancy at a higher BMI and more for those starting underweight, since the total (starting weight + gain) matters for maternal and infant health outcomes." }],
  },
  {
    slug: "sleep",
    title: "Sleep Calculator",
    category: "health",
    description: "Find the ideal bedtime or wake-up time based on 90-minute sleep cycles.",
    keywords: ["sleep calculator", "bedtime calculator"],
    fields: [
      { id: "wakeTime", label: "Wake-Up Time", type: "text", defaultValue: "07:00", placeholder: "HH:MM", width: "full" },
    ],
    compute: (v) => {
      const [h, m] = String(v.wakeTime || "07:00").split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return { items: [], error: "Enter a time like 07:00" };
      const wake = new Date();
      wake.setHours(h, m, 0, 0);
      const cycles = [6, 5, 4, 3];
      const items = cycles.map((c) => {
        const bedtime = new Date(wake.getTime() - (c * 90 + 15) * 60000);
        return { label: `${c} cycles (${(c * 1.5).toFixed(1)} hrs)`, value: bedtime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), emphasis: c === 5 };
      });
      return {
        items,
        chart: {
          type: "bar",
          labels: cycles.map((c) => `${c} cycles`),
          series: [{ name: "Hours of Sleep", data: cycles.map((c) => c * 1.5), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Why 90-minute cycles?", a: "A full sleep cycle (light, deep, and REM sleep) lasts roughly 90 minutes. Waking up at the end of a cycle rather than in the middle of deep sleep tends to feel less groggy, even with the same total sleep time." }],
  },
  {
    slug: "caloric-deficit",
    title: "Caloric Deficit Calculator",
    category: "health",
    description: "Calculate the daily calorie deficit needed to lose weight at your target rate.",
    keywords: ["caloric deficit calculator", "weight loss calculator"],
    presets: [
      { label: "Gradual loss (0.5 lb/wk)", values: { lossPerWeek: 0.5 } },
      { label: "Standard loss (1 lb/wk)", values: { lossPerWeek: 1 } },
      { label: "Aggressive loss (2 lb/wk)", values: { lossPerWeek: 2 } },
    ],
    fields: [genderField, unitField,
      { id: "age", label: "Age", type: "number", defaultValue: 30, width: "half" },
      { id: "weight", label: "Weight", type: "number", unit: "lb", defaultValue: 180, width: "half" },
      { id: "height", label: "Height", type: "number", unit: "in", defaultValue: 68, width: "half" },
      { id: "activity", label: "Activity Level", type: "select", defaultValue: "1.55", options: [
        { value: "1.2", label: "Sedentary" }, { value: "1.375", label: "Light exercise" }, { value: "1.55", label: "Moderate exercise" }, { value: "1.725", label: "Heavy exercise" },
      ], width: "half" },
      { id: "lossPerWeek", label: "Weight Loss Goal", type: "number", unit: "lb/week", defaultValue: 1, step: 0.25, width: "half" },
    ],
    compute: (v) => {
      const kg = toKg(num(v.weight), str(v.units));
      const cm = toCm(num(v.height), str(v.units));
      const bmr = v.gender === "male" ? 10 * kg + 6.25 * cm - 5 * num(v.age) + 5 : 10 * kg + 6.25 * cm - 5 * num(v.age) - 161;
      const tdee = bmr * num(v.activity);
      const dailyDeficit = (num(v.lossPerWeek) * 3500) / 7;
      return {
        items: [
          { label: "Daily Calorie Target", value: `${formatNumber(tdee - dailyDeficit, 0)} cal/day`, emphasis: true },
          { label: "Daily Deficit", value: `${formatNumber(dailyDeficit, 0)} cal` },
          { label: "Maintenance Calories", value: `${formatNumber(tdee, 0)} cal/day` },
        ],
        chart: { type: "bar", labels: ["Daily Target", "Maintenance"], series: [{ name: "Calories/day", data: [tdee - dailyDeficit, tdee], color: "primary" }] },
      };
    },
    faqs: [{ q: "Why 3,500 calories per pound?", a: "That's the commonly-cited energy value of a pound of body fat. It's a simplification — actual weight loss also involves water and lean mass changes — but it's a reasonable planning estimate for steady, moderate deficits." }],
  },
  {
    slug: "weight-loss-timeline",
    title: "Weight Loss Timeline Calculator",
    category: "health",
    description: "Estimate how many weeks it will take to reach your goal weight at a given calorie deficit.",
    keywords: ["weight loss timeline calculator", "weight loss calculator"],
    fields: [unitField,
      { id: "currentWeight", label: "Current Weight", type: "number", unit: "lb", defaultValue: 200, width: "half" },
      { id: "goalWeight", label: "Goal Weight", type: "number", unit: "lb", defaultValue: 175, width: "half" },
      { id: "dailyDeficit", label: "Daily Calorie Deficit", type: "number", unit: "cal", defaultValue: 500, width: "half" },
    ],
    compute: (v) => {
      const toLose = Math.max(num(v.currentWeight) - num(v.goalWeight), 0);
      const weeklyLoss = (num(v.dailyDeficit) * 7) / 3500;
      const weeks = weeklyLoss > 0 ? toLose / weeklyLoss : Infinity;
      const chartWeeks = Math.max(1, Math.min(isFinite(weeks) ? Math.ceil(weeks) : 1, 104));
      const weightData: number[] = [];
      const weightLabels: string[] = [];
      for (let w = 0; w <= chartWeeks; w++) {
        weightLabels.push(`Wk ${w}`);
        weightData.push(Number(Math.max(num(v.currentWeight) - weeklyLoss * w, num(v.goalWeight)).toFixed(1)));
      }
      return {
        items: [
          { label: "Estimated Time to Goal", value: isFinite(weeks) ? `${formatNumber(weeks, 1)} weeks` : "—", emphasis: true },
          { label: "Weight to Lose", value: `${formatNumber(toLose, 1)} lb` },
          { label: "Estimated Weekly Loss", value: `${formatNumber(weeklyLoss, 2)} lb/week` },
        ],
        chart: {
          type: "line",
          labels: weightLabels,
          series: [{ name: "Projected Weight", data: weightData, color: "primary" }],
          valuePrefix: "",
        },
      };
    },
    faqs: [{ q: "Will my weight loss really be linear like this estimate?", a: "No — real-world weight loss usually slows over time as your maintenance calories drop with your body weight, and water-weight fluctuations add noise week to week. Treat this as a rough planning estimate, not a guarantee." }],
  },
  {
    slug: "smoking-cost",
    title: "Smoking Cost Calculator",
    category: "health",
    description: "Calculate how much money smoking costs you over time.",
    keywords: ["smoking cost calculator", "cost of smoking"],
    fields: [
      { id: "packsPerDay", label: "Packs per Day", type: "number", defaultValue: 1, step: 0.1, width: "half" },
      { id: "pricePerPack", label: "Price per Pack", type: "number", unit: "$", defaultValue: 9, width: "half" },
      { id: "years", label: "Time Period", type: "number", unit: "years", defaultValue: 10, width: "half" },
    ],
    compute: (v) => {
      const annual = num(v.packsPerDay) * num(v.pricePerPack) * 365;
      const yearsN = Math.max(1, Math.round(num(v.years)));
      return {
        items: [
          { label: "Total Cost", value: `$${formatNumber(annual * num(v.years), 0)}`, emphasis: true },
          { label: "Annual Cost", value: `$${formatNumber(annual, 0)}` },
        ],
        chart: {
          type: "line",
          labels: Array.from({ length: yearsN }, (_, i) => `Yr ${i + 1}`),
          series: [{ name: "Cumulative Cost", data: Array.from({ length: yearsN }, (_, i) => Math.round(annual * (i + 1))), color: "primary" }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Does this include health costs from smoking?", a: "No — this is just the direct cost of buying cigarettes. It doesn't include the substantial additional costs many smokers face from higher health insurance premiums and healthcare expenses." }],
  },
  {
    slug: "alcohol-calories",
    title: "Alcohol Calories Calculator",
    category: "health",
    description: "Estimate the calories in your alcoholic drinks.",
    keywords: ["alcohol calories calculator"],
    fields: [
      { id: "drinkType", label: "Drink", type: "select", defaultValue: "beer", options: [
        { value: "beer", label: "Beer (12oz, ~150 cal)" }, { value: "wine", label: "Wine (5oz, ~125 cal)" }, { value: "spirit", label: "Spirit shot (1.5oz, ~97 cal)" }, { value: "cocktail", label: "Cocktail (~200 cal)" },
      ], width: "half" },
      { id: "count", label: "Number of Drinks", type: "number", defaultValue: 2, width: "half" },
    ],
    compute: (v) => {
      const calMap: Record<string, number> = { beer: 150, wine: 125, spirit: 97, cocktail: 200 };
      const total = (calMap[str(v.drinkType, "beer")] ?? 150) * num(v.count);
      return {
        items: [{ label: "Total Calories", value: `${formatNumber(total, 0)} cal`, emphasis: true }],
        chart: {
          type: "bar",
          labels: ["Beer (12oz)", "Wine (5oz)", "Spirit (1.5oz)", "Cocktail"],
          series: [{ name: "Calories per Drink", data: [150, 125, 97, 200], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Do these calorie estimates vary a lot by brand?", a: "Yes — actual calories depend heavily on ABV and serving size (a craft IPA can have double the calories of a light beer). These figures are reasonable averages, not exact values for any specific drink." }],
  },
  {
    slug: "child-height-predictor",
    title: "Child Height Predictor",
    category: "health",
    description: "Estimate a child's adult height using the mid-parental height method.",
    keywords: ["child height predictor", "adult height calculator"],
    fields: [genderField, unitField,
      { id: "motherHeight", label: "Mother's Height", type: "number", unit: "in", defaultValue: 64, width: "half" },
      { id: "fatherHeight", label: "Father's Height", type: "number", unit: "in", defaultValue: 70, width: "half" },
    ],
    compute: (v) => {
      const motherCm = toCm(num(v.motherHeight), str(v.units));
      const fatherCm = toCm(num(v.fatherHeight), str(v.units));
      const cm = v.gender === "male" ? (motherCm + fatherCm) / 2 + 6.5 : (motherCm + fatherCm) / 2 - 6.5;
      const inches = cm / 2.54;
      return {
        items: [{ label: "Predicted Adult Height", value: `${formatNumber(cm, 1)} cm (${Math.floor(inches / 12)}'${Math.round(inches % 12)}")`, emphasis: true }],
        note: "A rough statistical estimate — actual adult height depends on many other factors.",
        chart: {
          type: "bar",
          labels: ["Mother", "Father", "Predicted Child"],
          series: [{ name: "Height (cm)", data: [motherCm, fatherCm, cm], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "How reliable is the mid-parental height method?", a: "It's a widely-used pediatric estimate, generally accurate to within a few inches, but genetics, nutrition, and health during childhood all influence actual adult height." }],
  },
];
