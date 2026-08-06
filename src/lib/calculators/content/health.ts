import { SeoContent } from "./types";

export const healthContent: Record<string, SeoContent> = {
  bmi: {
    intro:
      "Body Mass Index (BMI) is one of the most widely used screening tools for weight-related health, used by doctors, insurers, and public health organizations worldwide. Our BMI Calculator gives you an instant result in either imperial or metric units, along with the weight category it falls into.",
    howItWorks:
      "BMI is calculated by dividing your weight in kilograms by the square of your height in meters. It's a screening measure, not a diagnosis — it doesn't distinguish between muscle mass and fat mass, which is why an athlete and a sedentary person of the same height and weight can have identical BMI but very different body compositions.",
    formula: "BMI = weight (kg) ÷ height (m)²",
    methodology:
      "Belgian mathematician Adolphe Quetelet devised this formula in the 1830s while studying population averages, not individual health — a detail often left out of modern discussions of BMI. Dividing by height squared (rather than height alone) was an empirical choice: across a population, body weight tends to scale roughly with the square of height, which made this ratio useful for comparing groups. It was never designed to assess a single person's individual body composition.\n\nFor imperial units, the formula becomes BMI = 703 × weight (lb) ÷ height (in)². The constant 703 is simply the unit-conversion factor that makes the imperial formula produce the same result as the metric one (it converts pounds to kilograms and inches to meters within a single multiplication).",
    stepByStep: [
      "Convert your height to meters (divide inches by 39.37, or centimeters by 100).",
      "Square your height in meters (multiply it by itself).",
      "Convert your weight to kilograms if needed (divide pounds by 2.205).",
      "Divide your weight in kilograms by your squared height in meters.",
      "Compare the result to the standard categories: under 18.5 is underweight, 18.5–24.9 is normal weight, 25–29.9 is overweight, and 30+ is obese.",
    ],
    edgeCases: [
      "Athletes and heavily muscled individuals often score 'overweight' or 'obese' by BMI despite low body fat, since the formula can't distinguish muscle from fat.",
      "Older adults tend to carry more fat at the same BMI as younger adults due to natural muscle loss with age, so the same number can mean different things across age groups.",
      "BMI categories were developed primarily from studies of adult populations and don't apply the same way to children or teenagers, who use age- and sex-specific percentile charts instead.",
      "Different ethnic groups have been shown to carry different health risks at the same BMI — some public health bodies use adjusted thresholds for South and East Asian populations, for example.",
      "Pregnancy substantially changes weight in ways unrelated to fat gain, making standard BMI categories inapplicable during that time.",
    ],
    examples: [
      { title: "Example calculation", body: "A person who is 5'8\" (1.73m) and weighs 160 lb (72.6 kg) has a BMI of about 24.3 — within the 'normal weight' range of 18.5–24.9." },
      { title: "Metric example", body: "A person who is 175 cm and 80 kg has a BMI of about 26.1, which falls in the 'overweight' range of 25–29.9." },
    ],
    advantages: [
      "Quick, free screening tool used consistently by medical professionals",
      "Works in both imperial and metric units",
      "Useful for tracking trends in your own weight over time",
      "No account or personal data storage required",
    ],
    commonMistakes: [
      "Treating BMI as a precise diagnosis rather than a general screening number",
      "Not accounting for muscle mass, which can inflate BMI in athletes",
      "Using outdated height or weight measurements",
      "Comparing BMI across very different body types without context",
    ],
    useCases: [
      "General health screening and tracking over time",
      "Understanding standard weight categories used by doctors",
      "Setting a baseline before starting a fitness or nutrition plan",
      "Quick reference before a medical appointment",
    ],
    conclusion:
      "BMI is a useful starting point for understanding weight-related health, but it's only one data point. Body fat percentage, waist-to-hip ratio, and overall fitness matter too — try our Body Fat and Ideal Weight calculators for a fuller picture, and talk to a healthcare provider for personalized advice.",
  },
  calorie: {
    intro:
      "Whether your goal is to lose weight, gain weight, or simply maintain where you are, it starts with knowing how many calories your body actually needs. Our Calorie Calculator estimates your daily calorie needs using your age, sex, height, weight, and activity level, then shows targets for maintenance, mild loss, more aggressive loss, and mild gain.",
    howItWorks:
      "The calculator first estimates your Basal Metabolic Rate (BMR) — the calories your body burns at complete rest — using the Mifflin-St Jeor equation, which is considered one of the more accurate formulas available. It then multiplies that by an activity multiplier ranging from sedentary to athlete to estimate your Total Daily Energy Expenditure (TDEE), the number of calories you burn in an average day.",
    formula: "Men: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + 5\nWomen: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age − 161\nTDEE = BMR × activity multiplier",
    examples: [
      { title: "Moderately active", body: "A 30-year-old man, 5'8\", 180 lb, with moderate exercise has a TDEE of roughly 2,750 calories/day to maintain his current weight." },
      { title: "Weight loss target", body: "The same person aiming for steady weight loss would target around 2,200 calories/day — a 20% deficit — for the 'weight loss' option shown by the calculator." },
    ],
    advantages: [
      "Uses the Mifflin-St Jeor equation, widely regarded as one of the more accurate BMR formulas",
      "Shows multiple targets (maintain, mild loss, loss, mild gain) instead of just one number",
      "Adjusts for five different activity levels",
      "Free to recalculate anytime your weight or activity changes",
    ],
    commonMistakes: [
      "Overestimating activity level, which inflates the calorie target",
      "Not adjusting the target as your weight changes over weeks or months",
      "Treating the number as exact rather than a solid starting estimate",
      "Ignoring that very low-calorie targets can be unsustainable or unhealthy without guidance",
    ],
    useCases: [
      "Setting a daily calorie target for weight loss or gain",
      "Understanding maintenance calories before starting a diet plan",
      "Adjusting nutrition goals after a change in activity level",
      "Pairing with a macro plan for more detailed nutrition tracking",
    ],
    conclusion:
      "Calorie needs are individual and change over time, so treat this as a well-informed starting point rather than a fixed rule. Track your results over a few weeks and adjust as needed — and check out our Macro and TDEE calculators for more detailed nutrition planning.",
  },
  "bmi-prime": {
    intro:
      "BMI Prime takes the familiar BMI number and reframes it as a simple ratio to the upper limit of the normal range, making it instantly clear how far above or below that threshold you are. Our BMI Prime Calculator computes it from your height and weight.",
    howItWorks:
      "The calculator first computes standard BMI (weight in kg divided by height in meters squared), then divides that by 25 — the upper bound of the 'normal' BMI category — to produce BMI Prime. A value under 1.0 means your BMI falls under 25; a value at or above 1.0 means it's at or above 25.",
    formula: "BMI Prime = BMI ÷ 25",
    examples: [
      { title: "Within normal range", body: "A BMI of 22 produces a BMI Prime of 0.88 — meaningfully under 1.0, indicating a comfortable margin within the normal BMI category." },
      { title: "At the threshold", body: "A BMI of 25 produces a BMI Prime of exactly 1.0, marking the boundary between the normal and overweight BMI categories." },
    ],
    advantages: [
      "Converts BMI into an intuitive ratio — anything under 1.0 is 'under the normal-range ceiling'",
      "Makes it easy to see at a glance how much margin exists relative to the BMI 25 threshold",
      "Uses the same standard BMI formula, just reframed as a ratio",
      "Quick, single-number way to track BMI trend over time",
    ],
    commonMistakes: [
      "Treating BMI Prime (or BMI itself) as a direct measure of body fat percentage or health",
      "Not accounting for BMI's known limitations for very muscular or very lean individuals",
      "Using BMI Prime as a diagnostic tool rather than the general screening indicator it's designed to be",
      "Forgetting the underlying BMI 25 threshold itself is a population-level guideline, not a personal target",
    ],
    useCases: [
      "Getting an intuitive ratio-based view of BMI status",
      "Tracking BMI trend relative to the normal-range threshold over time",
      "Quick screening alongside standard BMI",
      "Understanding how close your BMI sits to the boundary of the normal range",
    ],
    conclusion:
      "BMI Prime is really just BMI expressed differently — for the standard measurement and category breakdown, our BMI Calculator gives the more commonly referenced version of the same underlying number.",
  },
  bmr: {
    intro:
      "Basal Metabolic Rate is the number of calories your body burns just staying alive — breathing, circulating blood, maintaining organ function — before any activity is factored in. Our BMR Calculator estimates it using the widely used Mifflin-St Jeor equation.",
    howItWorks:
      "The calculator applies the Mifflin-St Jeor formula, which uses your weight, height, age, and sex to estimate resting energy expenditure — the most accurate widely available equation for BMR in typical adults without needing body composition testing.",
    formula: "Men: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + 5\nWomen: BMR = 10×weight(kg) + 6.25×height(cm) − 5×age − 161",
    examples: [
      { title: "Typical adult", body: "A 30-year-old at 160 lb and 5'8\" has an estimated BMR in the mid-1,500s calories per day — the baseline before any activity is added." },
      { title: "Building toward total needs", body: "BMR alone isn't your full calorie need — multiplying by an activity factor (see our TDEE Calculator) accounts for exercise and daily movement on top of this baseline." },
    ],
    advantages: [
      "Uses the Mifflin-St Jeor equation, generally considered more accurate than older formulas like Harris-Benedict",
      "Fast estimate without needing specialized body composition equipment",
      "Foundational number for calorie planning, weight loss, or muscle gain goals",
      "Works for any adult height, weight, age, and sex combination",
    ],
    commonMistakes: [
      "Confusing BMR with total daily calorie needs — BMR excludes all activity, which typically adds 20-90% more calories",
      "Eating below BMR for extended periods, which can be counterproductive and unsustainable",
      "Not adjusting BMR estimates as weight changes significantly over time",
      "Assuming BMR is identical to Resting Metabolic Rate, though the two are very close in practice",
    ],
    useCases: [
      "Establishing a calorie baseline before setting a weight loss or gain target",
      "Understanding how much of daily calorie burn comes from basic bodily function alone",
      "Comparing BMR across different body weights or after body composition changes",
      "Foundational input for more detailed nutrition and fitness planning",
    ],
    conclusion:
      "BMR is the floor, not the full picture — add your activity level using our TDEE Calculator to find your true total daily calorie needs, or use our Calorie Calculator for a complete maintain/lose/gain breakdown in one step.",
  },
  tdee: {
    intro:
      "Total Daily Energy Expenditure is the real number that matters for weight management — it's your BMR plus everything you burn through daily activity and exercise combined. Our TDEE Calculator computes that full total from your stats and activity level.",
    howItWorks:
      "The calculator first estimates your BMR using the Mifflin-St Jeor equation, then multiplies it by an activity multiplier ranging from 1.2 (sedentary) to 1.9 (athlete) to account for calories burned through daily movement and exercise, producing your total daily calorie expenditure.",
    formula: "TDEE = BMR × activity multiplier",
    examples: [
      { title: "Moderately active", body: "A BMR of 1,550 with a moderate exercise multiplier (1.55) produces a TDEE around 2,403 calories/day — the number needed to maintain current weight." },
      { title: "Sedentary vs. athlete", body: "The same BMR at a sedentary multiplier (1.2) gives a TDEE of only 1,860, while an athlete multiplier (1.9) pushes it to 2,945 — nearly 1,100 calories of difference from activity level alone." },
    ],
    advantages: [
      "Combines BMR and activity into one complete daily calorie estimate",
      "Adjustable activity multiplier to match your real lifestyle, not a generic guess",
      "The correct baseline number for setting weight loss, maintenance, or gain calorie targets",
      "Uses the well-regarded Mifflin-St Jeor formula as its foundation",
    ],
    commonMistakes: [
      "Overestimating activity level, which inflates TDEE and leads to underestimating actual calorie needs for a goal",
      "Not recalculating TDEE after significant weight change, since it shifts as body weight changes",
      "Confusing TDEE with BMR, leading to under-eating relative to actual total needs",
      "Treating the estimate as exact rather than a starting point to adjust based on real-world results",
    ],
    useCases: [
      "Finding your daily maintenance calorie level as a baseline for weight goals",
      "Setting a realistic calorie deficit or surplus relative to actual total needs",
      "Understanding how much activity level alone changes daily calorie needs",
      "Foundational number for nutrition and fitness planning",
    ],
    conclusion:
      "TDEE is the number that should anchor any calorie-based goal, whether that's weight loss, maintenance, or muscle gain. Our Calorie Calculator builds directly on this to show specific maintain, lose, and gain targets in one place.",
  },
  "army-body-fat": {
    intro:
      "The U.S. Army uses its own circumference-based body fat formula, distinct from the Navy method, as part of its body composition standards. Our Army Body Fat Calculator applies that specific formula for anyone who needs the Army-standard estimate.",
    howItWorks:
      "The calculator uses circumference measurements (neck, waist, and for women, hip) combined with height in the Army's published logarithmic formula, which differs numerically from the Navy method even though both rely on similar measurements.",
    examples: [
      { title: "Male estimate", body: "A neck, waist, and height measurement plugged into the Army formula produces a body fat percentage used specifically for Army body composition standards." },
      { title: "Comparing to the Navy method", body: "The same measurements run through our Body Fat Calculator (Navy method) can produce a slightly different percentage — the two formulas use different coefficients even with the same inputs." },
    ],
    advantages: [
      "Uses the specific formula referenced by Army body composition standards",
      "Circumference-based, so no specialized equipment is needed to estimate",
      "Useful for anyone specifically needing the Army-standard calculation method",
      "Fast estimate from a small number of tape-measure inputs",
    ],
    commonMistakes: [
      "Measuring circumferences inconsistently (too tight, wrong location) which skews the result significantly",
      "Assuming this matches other body fat methods exactly — different formulas produce different numbers from the same measurements",
      "Using this as an official record instead of an estimate — official Army assessments follow specific measurement protocols",
      "Not accounting for measurement error, which compounds across multiple circumference inputs",
    ],
    useCases: [
      "Estimating body fat percentage using the Army-specific method",
      "Preparing for or tracking progress toward Army body composition standards",
      "Comparing against other circumference-based estimation methods",
      "General fitness tracking using a specific, referenced formula",
    ],
    conclusion:
      "Circumference-based formulas are estimates, not precise measurements — for a formula tuned to different assumptions, our standard Body Fat Calculator (Navy method) may produce a different result from the same inputs.",
  },
  "ideal-weight": {
    intro:
      "The Devine formula has been used in clinical settings for decades — originally to calculate medication dosing — and has become a common reference point for 'ideal' body weight estimates based on height alone. Our Ideal Weight Calculator applies it directly.",
    howItWorks:
      "The calculator uses the Devine formula, which starts with a base weight for 5 feet of height and adds a fixed amount for each inch over that, with different base and increment values for men and women.",
    formula: "Men: 50 kg + 2.3 kg per inch over 5 feet\nWomen: 45.5 kg + 2.3 kg per inch over 5 feet",
    examples: [
      { title: "Average height", body: "A 5'8\" man has an estimated ideal weight around 73.4 kg (162 lb) under the Devine formula." },
      { title: "Comparing to a healthy range", body: "This single-number estimate is narrower than the broader healthy BMI-based weight range — our Healthy Weight Range Calculator shows that fuller range instead of one specific number." },
    ],
    advantages: [
      "Uses a well-established, widely referenced clinical formula",
      "Simple calculation requiring only height and sex",
      "Useful as a reference point, even though it's not a strict target",
      "Consistent, reproducible result for tracking purposes",
    ],
    commonMistakes: [
      "Treating 'ideal weight' as a precise target rather than a rough clinical reference point",
      "Not accounting for body composition, frame size, or muscle mass, none of which factor into this formula",
      "Comparing this single number against a healthy BMI range, which is inherently a range, not one number",
      "Using this formula for children or for medication dosing purposes it wasn't intended for by a layperson",
    ],
    useCases: [
      "Getting a reference point for a clinically-used ideal weight formula",
      "General health and fitness benchmarking",
      "Comparing against BMI-based healthy weight ranges",
      "Understanding the origin of a commonly cited weight formula",
    ],
    conclusion:
      "'Ideal weight' is a clinical reference concept, not a personal mandate — body composition, muscle mass, and frame size all matter more for real health assessment. Our Healthy Weight Range Calculator offers a broader, BMI-based range that may be more useful for general reference.",
  },
  "healthy-weight": {
    intro:
      "Instead of a single 'ideal' number, a healthy weight range based on BMI gives a more realistic target — since a healthy weight genuinely varies across a range for any given height. Our Healthy Weight Range Calculator finds that full range from your height alone.",
    howItWorks:
      "The calculator finds the weight corresponding to a BMI of 18.5 (the low end of 'normal') and a BMI of 24.9 (the high end) at your specific height, giving the full weight range considered within the normal BMI category.",
    formula: "Low weight = 18.5 × height(m)²\nHigh weight = 24.9 × height(m)²",
    examples: [
      { title: "Average height", body: "A 5'8\" person has a healthy weight range of roughly 121-163 lb under standard BMI category boundaries." },
      { title: "Taller height", body: "A 6'0\" person's range shifts notably higher, roughly 140-189 lb — showing how much height affects the healthy range for the same BMI boundaries." },
    ],
    advantages: [
      "Gives a full range rather than one arbitrary 'ideal' number",
      "Based on the same widely used BMI category boundaries clinicians reference",
      "Shows results in both kilograms and pounds for convenience",
      "More realistic than a single-point target for most people's use",
    ],
    commonMistakes: [
      "Treating the low end of the range as automatically 'better' than the high end",
      "Not accounting for BMI's known limitations for muscular or very lean individuals",
      "Using this range as a strict target rather than a general reference point",
      "Ignoring that healthy weight also depends on factors BMI doesn't capture, like body composition and overall health markers",
    ],
    useCases: [
      "Finding a general healthy weight range for a given height",
      "Setting a realistic weight goal range rather than one specific number",
      "Understanding how the standard BMI category boundaries translate into actual weight",
      "General health reference alongside other fitness metrics",
    ],
    conclusion:
      "A range is a more honest reflection of 'healthy' than a single number could ever be — and even this range has limits for muscular or very lean individuals. Pair it with our BMI Calculator to see exactly where your current weight falls within it.",
  },
  "lean-body-mass": {
    intro:
      "Lean body mass — everything in your body except fat — is a more useful number than total weight alone for tracking fitness progress, since it reflects muscle, bone, and organs together. Our Lean Body Mass Calculator estimates it using the Boer formula.",
    howItWorks:
      "The calculator applies the Boer formula, which uses your weight and height with different coefficients for men and women, to estimate lean mass without needing body fat measurement equipment like calipers or a DEXA scan.",
    formula: "Men: LBM = 0.407×weight(kg) + 0.267×height(cm) − 19.2\nWomen: LBM = 0.252×weight(kg) + 0.473×height(cm) − 48.3",
    examples: [
      { title: "Estimating lean mass", body: "A 160 lb (72.6 kg), 5'8\" (173 cm) man has an estimated lean body mass around 58.6 kg, meaning roughly 14 kg is estimated fat mass." },
      { title: "Tracking over time", body: "Recalculating after weight changes shows whether the change came primarily from lean mass or fat mass — useful feedback during a diet or training program." },
    ],
    advantages: [
      "Estimates lean mass without needing specialized body composition equipment",
      "Shows both lean mass and estimated fat mass for a fuller picture",
      "Useful for tracking whether weight changes are coming from muscle or fat",
      "Simple two-measurement input (weight and height)",
    ],
    commonMistakes: [
      "Treating this formula-based estimate as equivalent to a DEXA scan or other direct measurement",
      "Not tracking trend over time, which is more informative than any single measurement",
      "Assuming lean mass changes track linearly with weight changes during a diet or bulk",
      "Comparing lean mass estimates across different formulas, which can produce different absolute numbers",
    ],
    useCases: [
      "Estimating lean body mass without specialized equipment",
      "Tracking whether weight changes reflect muscle or fat loss/gain",
      "Setting protein intake targets, which are often based on lean mass",
      "General fitness and body composition tracking",
    ],
    conclusion:
      "Lean mass estimates are most useful as a trend over time rather than a single precise figure — recalculate periodically to see the direction your body composition is heading. Our Protein Intake Calculator can help set nutrition targets that support maintaining or building that lean mass.",
  },
  macro: {
    intro:
      "Once you know your daily calorie target, the next question is how to split it between protein, carbs, and fat — the three macronutrients that make up every calorie you eat. Our Macro Calculator handles that split based on your goal.",
    howItWorks:
      "The calculator applies a percentage split (balanced, low-carb, or high-protein) to your total calorie target, then converts each macronutrient's calorie share into grams using their known caloric density — 4 calories per gram for protein and carbs, 9 calories per gram for fat.",
    formula: "Protein (g) = (calories × protein%) ÷ 4\nCarbs (g) = (calories × carb%) ÷ 4\nFat (g) = (calories × fat%) ÷ 9",
    examples: [
      { title: "Balanced split", body: "A 2,200-calorie target on a balanced 40/30/30 split (carb/fat/protein) comes to about 165g protein, 220g carbs, and 73g fat." },
      { title: "Low-carb split", body: "The same 2,200 calories on a low-carb 25/30/45 split shifts significantly toward protein and away from carbs, at about 248g protein and 138g carbs." },
    ],
    advantages: [
      "Converts an abstract calorie target into concrete daily gram targets",
      "Offers multiple preset splits for different dietary approaches",
      "Correctly applies the different caloric density of fat versus protein and carbs",
      "Useful for meal planning and tracking with any nutrition app",
    ],
    commonMistakes: [
      "Not adjusting the calorie target itself first — macro splits only make sense once total calories are set correctly",
      "Treating a percentage-based split as a fixed rule rather than a flexible starting point",
      "Forgetting fat's higher caloric density (9 cal/g) when eyeballing portions instead of tracking precisely",
      "Choosing an extreme macro split without a specific reason tied to a health or performance goal",
    ],
    useCases: [
      "Converting a calorie target into daily protein, carb, and fat gram goals",
      "Comparing balanced, low-carb, and high-protein approaches for the same calorie level",
      "Meal planning and food tracking",
      "Adjusting macronutrient ratios for specific training or health goals",
    ],
    conclusion:
      "The right macro split depends on personal preference, training goals, and how your body responds — there's no single universally 'correct' ratio. Use our Calorie Calculator first to nail down your total target, then apply this split to translate it into a daily eating plan.",
  },
  "fat-intake": {
    intro:
      "Dietary fat is essential — for hormone production, nutrient absorption, and cell function — but too much or too little both create problems. Our Daily Fat Intake Calculator finds a healthy range based on your total daily calories.",
    howItWorks:
      "The calculator applies the commonly recommended 25-35% of total calories from fat, then converts that percentage range into grams using fat's caloric density of 9 calories per gram.",
    formula: "Fat range (g) = (calories × 25% to 35%) ÷ 9",
    examples: [
      { title: "Standard calorie target", body: "A 2,200-calorie diet supports a recommended fat intake of roughly 61-86 grams per day." },
      { title: "Higher calorie target", body: "A 3,000-calorie diet scales the range up proportionally to about 83-117 grams per day." },
    ],
    advantages: [
      "Uses the widely recommended 25-35% of calories from fat guideline",
      "Converts a percentage range directly into a practical daily gram target",
      "Scales automatically with your total calorie needs",
      "Simple single-input calculation",
    ],
    commonMistakes: [
      "Cutting fat intake too aggressively, which can impair hormone production and nutrient absorption",
      "Not distinguishing between healthier unsaturated fats and less healthy saturated or trans fats within the total",
      "Treating this as a rigid target rather than a general healthy range",
      "Forgetting fat has more than double the calories per gram of protein or carbs when estimating portions",
    ],
    useCases: [
      "Setting a daily fat intake target as part of a balanced diet",
      "Meal planning and macro tracking",
      "Understanding how fat fits into an overall calorie and macro plan",
      "General nutrition education",
    ],
    conclusion:
      "Fat is a necessary part of a balanced diet within this range — the type of fat consumed matters as much as the total amount. Our Macro Calculator can help balance fat alongside protein and carb targets in one complete plan.",
  },
  "protein-intake": {
    intro:
      "Protein needs vary significantly based on activity level — someone strength training regularly needs substantially more than a sedentary person. Our Protein Intake Calculator estimates a target based on your body weight and activity level.",
    howItWorks:
      "The calculator applies a protein factor per kilogram of body weight based on activity level — roughly 0.8 g/kg for sedentary individuals, 1.4 g/kg for moderately active people, and up to 2.0 g/kg for athletes and those strength training regularly.",
    formula: "Protein (g/day) = weight(kg) × activity factor",
    examples: [
      { title: "Moderately active", body: "A 160 lb (72.6 kg) moderately active person has a recommended protein target around 102g/day." },
      { title: "Athlete or strength training", body: "The same body weight at the athlete factor (2.0 g/kg) nearly doubles the target to about 145g/day, reflecting the higher protein needs of regular strength training." },
    ],
    advantages: [
      "Scales protein recommendation to activity level, not a flat one-size-fits-all number",
      "Based on commonly cited sports nutrition research ranges",
      "Simple calculation from just body weight and activity category",
      "Useful starting point for meal planning and tracking",
    ],
    commonMistakes: [
      "Using a sedentary protein factor while training intensely, which can leave protein intake too low for recovery and muscle maintenance",
      "Assuming more protein is always better beyond what activity level and goals actually require",
      "Not adjusting the target after a significant change in training intensity or body weight",
      "Confusing total protein needs with protein per meal, which is a separate consideration",
    ],
    useCases: [
      "Setting a daily protein target based on activity level",
      "Planning meals and food tracking to hit a protein goal",
      "Adjusting nutrition around a new training program",
      "General fitness and nutrition planning",
    ],
    conclusion:
      "Protein needs genuinely scale with activity level — a target that works for a sedentary lifestyle likely falls short during regular strength training. Our Macro Calculator can help fit this protein target into a complete daily macro plan alongside carbs and fat.",
  },
  "water-intake": {
    intro:
      "Water needs depend on both body weight and activity level, not a flat 'eight glasses a day' rule that ignores individual differences. Our Water Intake Calculator estimates a personalized daily target based on your weight and exercise.",
    howItWorks:
      "The calculator applies a base hydration factor (33 mL per kg of body weight) to your weight, then adds extra water for exercise minutes beyond a baseline, since sweat losses during activity increase overall fluid needs.",
    formula: "Base water (L) = weight(kg) × 0.033\nExtra for exercise = (exercise minutes ÷ 30) × 0.35 L",
    examples: [
      { title: "Sedentary baseline", body: "A 160 lb (72.6 kg) person with no exercise has a baseline recommendation around 2.4 L/day." },
      { title: "With regular exercise", body: "The same person exercising 30 minutes daily adds another 0.35 L, bringing the total to about 2.75 L/day (roughly 93 oz)." },
    ],
    advantages: [
      "Personalizes the recommendation to body weight instead of a generic flat number",
      "Accounts for extra fluid needs from exercise",
      "Shows results in both liters and ounces for convenience",
      "More accurate starting point than the commonly cited 'eight glasses' rule",
    ],
    commonMistakes: [
      "Relying on the generic 'eight 8-ounce glasses' rule, which doesn't account for body size or activity",
      "Not increasing intake on hot days or during illness, both of which raise fluid needs further",
      "Forgetting that food (especially fruits and vegetables) also contributes meaningfully to total fluid intake",
      "Overhydrating significantly beyond need, which can in rare cases cause its own health issues",
    ],
    useCases: [
      "Setting a personalized daily water intake target",
      "Adjusting hydration needs around exercise or activity level",
      "General health and wellness planning",
      "Understanding why generic hydration advice may not fit your specific situation",
    ],
    conclusion:
      "This gives a solid personalized baseline, but real fluid needs also shift with climate, altitude, and health status — treat this as a starting point and adjust based on thirst and urine color, two reliable everyday indicators of hydration status.",
  },
  pace: {
    intro:
      "Whether you're training for a race or just tracking a run, knowing your exact pace per mile (or kilometer) helps set realistic goals and compare performance across different distances. Our Running Pace Calculator converts your distance and time into pace and speed instantly.",
    howItWorks:
      "The calculator converts your total time into minutes, divides by distance to find your pace per mile, and separately calculates speed in miles per hour — two different but related ways of expressing the same run.",
    formula: "Pace (min/mi) = total minutes ÷ distance (mi)\nSpeed (mph) = distance (mi) ÷ total hours",
    examples: [
      { title: "5K training run", body: "A 5-mile run completed in 45 minutes works out to a 9:00/mile pace and a speed of about 6.67 mph." },
      { title: "Comparing paces", body: "Running the same distance in 40 minutes instead drops the pace to 8:00/mile — useful for tracking improvement or planning race goal pace." },
    ],
    advantages: [
      "Shows both pace per mile and speed in mph for different training contexts",
      "Fast, precise calculation from any distance and time combination",
      "Useful for setting and tracking training paces toward a race goal",
      "Works for any distance, from a short run to a full marathon",
    ],
    commonMistakes: [
      "Comparing paces across runs with very different terrain or elevation without adjusting expectations",
      "Not accounting for pace naturally varying across a long run versus a short, fast effort",
      "Confusing pace (time per distance) with speed (distance per time) when comparing to others' stated numbers",
      "Setting an overly ambitious goal pace without a realistic training base to support it",
    ],
    useCases: [
      "Calculating pace and speed from a completed run's distance and time",
      "Setting a target pace for an upcoming race",
      "Tracking pace improvement over a training cycle",
      "Converting between pace and speed for different training contexts",
    ],
    conclusion:
      "Consistent pace tracking over time is one of the best ways to see real training progress, even when race day performance varies with weather and course conditions. Pair this with our Calories Burned Calculator to see the full picture of a specific run's effort.",
  },
  "vo2-max": {
    intro:
      "VO2 max — the maximum rate your body can use oxygen during intense exercise — is one of the best single indicators of cardiovascular fitness. Our VO2 Max Calculator estimates it using a simple non-exercise method based on resting and estimated maximum heart rate.",
    howItWorks:
      "The calculator uses a widely referenced non-exercise formula that relates your estimated maximum heart rate (220 minus age) to your resting heart rate, producing an estimated VO2 max without requiring a lab treadmill test.",
    formula: "VO2 max ≈ 15.3 × (max HR ÷ resting HR)",
    examples: [
      { title: "Well-conditioned individual", body: "A 30-year-old with a resting heart rate of 55 bpm has a higher estimated VO2 max than someone the same age with a 75 bpm resting rate — a lower resting heart rate generally correlates with better cardiovascular fitness." },
      { title: "Tracking fitness improvement", body: "As cardiovascular fitness improves through training, resting heart rate often decreases, which this formula reflects as a rising estimated VO2 max." },
    ],
    advantages: [
      "Estimates VO2 max without needing lab equipment or a maximal exercise test",
      "Uses easily measurable inputs — resting heart rate and age",
      "Useful for tracking cardiovascular fitness trends over time",
      "Quick way to get a general fitness benchmark",
    ],
    commonMistakes: [
      "Treating this non-exercise estimate as precisely equivalent to a lab-measured VO2 max test",
      "Measuring resting heart rate inconsistently (right after waking versus after coffee or activity)",
      "Not accounting for how factors beyond cardiovascular fitness (stress, sleep, illness) can temporarily affect resting heart rate",
      "Comparing your estimate directly against elite athlete benchmarks without context for your own training history",
    ],
    useCases: [
      "Estimating cardiovascular fitness level without lab testing",
      "Tracking VO2 max trend over a training program",
      "General fitness benchmarking",
      "Understanding the relationship between resting heart rate and cardiovascular fitness",
    ],
    conclusion:
      "This non-exercise estimate is a useful trend indicator, not a lab-precise measurement — for an exact figure, a supervised graded exercise test with gas analysis is the gold standard. Our Target Heart Rate Calculator can help design training zones to actually improve this number over time.",
  },
  "one-rep-max": {
    intro:
      "Testing a true one-rep max in the gym carries real injury risk, which is why lifters typically estimate it from a lighter set instead. Our One Rep Max Calculator uses the well-established Epley formula to estimate your 1RM from any weight and rep count.",
    howItWorks:
      "The calculator applies the Epley formula, which estimates how much weight you could lift for a single rep based on the weight and rep count from a submaximal set — a set with more than one rep, but done to or near failure.",
    formula: "1RM = weight × (1 + reps ÷ 30)",
    examples: [
      { title: "Standard estimate", body: "Lifting 185 lb for 5 reps produces an estimated 1RM of about 216 lb." },
      { title: "Using percentages for programming", body: "From that estimated 216 lb max, the calculator also shows what 80% (about 173 lb, roughly a 5-rep set) and 70% (about 151 lb, roughly a 10-rep set) look like — useful for structuring training percentages." },
    ],
    advantages: [
      "Estimates 1RM without the injury risk of actually testing a true maximal single lift",
      "Uses the widely trusted Epley formula, one of the most common in strength training",
      "Shows practical percentage-based training weights alongside the estimated max",
      "Works for any exercise where you can safely perform a submaximal set to near-failure",
    ],
    commonMistakes: [
      "Using a set that wasn't taken close to failure, which underestimates the true 1RM",
      "Using very high rep counts (15+), where 1RM formulas become progressively less accurate",
      "Treating the estimate as exact rather than a close approximation for programming purposes",
      "Not adjusting the estimate as strength changes over a training program",
    ],
    useCases: [
      "Estimating 1RM without performing a risky maximal single-rep test",
      "Calculating percentage-based training weights for strength programs",
      "Tracking strength progress over time using consistent rep-range testing",
      "Programming training intensity for major compound lifts",
    ],
    conclusion:
      "The Epley formula is a solid estimate for most rep ranges under about 10-12, but accuracy declines at higher rep counts — for the most reliable estimate, test with a challenging set of 3-6 reps taken close to failure.",
  },
  "target-heart-rate": {
    intro:
      "Training at the right heart rate intensity matters for hitting specific fitness goals, whether that's fat-burning, aerobic base-building, or high-intensity conditioning. Our Target Heart Rate Calculator finds your training zones using the Karvonen formula, which accounts for your resting heart rate for a more personalized result than age alone.",
    howItWorks:
      "The calculator finds your heart rate reserve (max heart rate minus resting heart rate), then calculates target zones as percentages of that reserve added back to your resting heart rate — a more individualized approach than simply taking a percentage of max heart rate alone.",
    formula: "Target HR = ((max HR − resting HR) × intensity%) + resting HR",
    examples: [
      { title: "Moderate intensity zone", body: "A 30-year-old with a 65 bpm resting heart rate has a moderate-intensity target zone (50-70% of heart rate reserve) of roughly 143-158 bpm." },
      { title: "Vigorous intensity zone", body: "The same person's vigorous zone (70-85%) jumps to roughly 158-176 bpm — useful for structuring higher-intensity interval training." },
    ],
    advantages: [
      "Uses the Karvonen method, which accounts for resting heart rate rather than just age-based max HR",
      "Provides both moderate and vigorous training zones for different workout goals",
      "More personalized than simple age-based heart rate zone calculators",
      "Useful for structuring workouts to a specific target intensity",
    ],
    commonMistakes: [
      "Using an inaccurate resting heart rate measurement, which skews the entire calculation",
      "Relying on age-predicted max heart rate (220 minus age) as if it were measured precisely — it's a population average with real individual variation",
      "Training exclusively in one zone without varying intensity across a training program",
      "Not adjusting resting heart rate periodically as fitness improves over time",
    ],
    useCases: [
      "Structuring workouts around specific heart rate training zones",
      "Setting a moderate-intensity zone for steady-state cardio training",
      "Setting a vigorous zone for higher-intensity interval training",
      "Personalizing heart rate training more precisely than age-based methods alone",
    ],
    conclusion:
      "The Karvonen method's use of resting heart rate makes it a meaningfully better personalization than simple age-based zones. For a more granular five-zone breakdown across the full training intensity spectrum, our Heart Rate Training Zones Calculator provides that fuller picture.",
  },
  "heart-rate-zones": {
    intro:
      "Training zones from easy recovery pace to maximum effort each serve a different physiological purpose, and structuring workouts across all five zones is a core principle of effective endurance training. Our Heart Rate Training Zones Calculator breaks down all five zones based on your estimated maximum heart rate.",
    howItWorks:
      "The calculator estimates your maximum heart rate (220 minus age) and calculates five percentage-based zones from it — warm-up, fat-burn, aerobic, anaerobic, and max effort — each representing a different training intensity and physiological adaptation.",
    examples: [
      { title: "Zone breakdown", body: "A 30-year-old (max HR 190) has Zone 2 (fat-burn, 60-70%) around 114-133 bpm and Zone 4 (anaerobic, 80-90%) around 152-171 bpm — very different training intensities serving different purposes." },
      { title: "Using zones in training", body: "Most endurance training plans spend the majority of time in Zone 2-3 (aerobic base-building) with smaller amounts of high-intensity Zone 4-5 work mixed in." },
    ],
    advantages: [
      "Provides the full five-zone breakdown, not just one or two target ranges",
      "Each zone corresponds to a specific, well-understood training purpose",
      "Simple single-input calculation using just age",
      "Useful reference for structuring a varied, effective training program",
    ],
    commonMistakes: [
      "Training almost exclusively in high-intensity zones, a common mistake that leads to burnout and plateaus",
      "Relying on age-predicted max heart rate without adjusting based on real-world observed max effort readings",
      "Not distinguishing between zones based on training goal — fat-burn zone training isn't automatically better for weight loss than higher-intensity work",
      "Ignoring that a heart rate monitor's accuracy varies, especially for wrist-based sensors during high-intensity intervals",
    ],
    useCases: [
      "Structuring a training program across all five heart rate zones",
      "Understanding what intensity a specific zone actually represents",
      "Planning interval workouts targeting specific zones",
      "General endurance training guidance",
    ],
    conclusion:
      "Most effective training plans spend the bulk of time in the lower aerobic zones, with focused high-intensity work layered in strategically — training entirely in one zone tends to produce worse results than a varied approach. Our Target Heart Rate Calculator offers a resting-heart-rate-adjusted alternative for a more personalized moderate/vigorous split.",
  },
  "calories-burned": {
    intro:
      "Different activities burn calories at very different rates, and duration and body weight both matter for the total. Our Calories Burned Calculator estimates energy expenditure for common activities using the standard MET (Metabolic Equivalent of Task) method.",
    howItWorks:
      "The calculator uses each activity's established MET value (a measure of how many times more energy an activity requires compared to resting), multiplies it by your body weight and duration, to estimate total calories burned during that session.",
    formula: "Calories = MET × weight(kg) × (minutes ÷ 60)",
    examples: [
      { title: "Jogging", body: "A 160 lb (72.6 kg) person jogging (MET 6) for 30 minutes burns approximately 218 calories." },
      { title: "Higher-intensity activity", body: "The same person doing 30 minutes of HIIT (MET 8.5) instead burns approximately 309 calories — meaningfully more for the same duration." },
    ],
    advantages: [
      "Uses the standard, research-based MET method for activity-specific estimates",
      "Accounts for body weight, which significantly affects calorie burn for the same activity",
      "Covers a range of common activities from walking to HIIT",
      "Fast way to estimate the calorie cost of a specific workout",
    ],
    commonMistakes: [
      "Treating MET-based estimates as precisely accurate — real calorie burn varies with fitness level, effort, terrain, and individual metabolism",
      "Overestimating calories burned and then over-eating to 'compensate,' which can undermine a calorie deficit goal",
      "Not accounting for the afterburn effect (EPOC) from high-intensity exercise, which continues burning calories after the session ends",
      "Comparing calorie burn across very different activities without considering the different fitness benefits each provides",
    ],
    useCases: [
      "Estimating calories burned during a specific workout session",
      "Comparing calorie cost across different activity types",
      "Balancing exercise calorie burn against dietary calorie intake",
      "General fitness and weight management planning",
    ],
    conclusion:
      "MET-based estimates are a reasonable approximation, not an exact reading — wearable devices with heart rate tracking tend to be somewhat more personalized, though still imperfect. Use this as a general guide rather than a precise calorie-for-calorie accounting tool.",
  },
  "steps-to-calories": {
    intro:
      "Step count is one of the easiest activity metrics to track, thanks to phones and wearables — but converting steps into calories burned and distance covered makes that number more meaningful. Our Steps to Calories Calculator does both conversions.",
    howItWorks:
      "The calculator applies a simplified calorie-per-step estimate scaled to body weight, and separately estimates walking distance using an average stride-length-based conversion factor, giving both calories burned and approximate distance from a raw step count.",
    examples: [
      { title: "10,000 step goal", body: "A 160 lb (72.6 kg) person hitting the common 10,000-step goal burns approximately 264 calories and covers roughly 4.7 miles." },
      { title: "Scaling with body weight", body: "The same 10,000 steps burns more calories for a heavier person and fewer for a lighter person, since more body mass requires more energy to move the same distance." },
    ],
    advantages: [
      "Converts an easily tracked metric (steps) into more meaningful calorie and distance figures",
      "Scales calorie estimate to body weight for more personalized accuracy",
      "Quick way to contextualize a daily step count goal",
      "Useful alongside phone or wearable step tracking",
    ],
    commonMistakes: [
      "Treating step-based calorie estimates as precise — actual burn varies with pace, terrain, and individual stride efficiency",
      "Assuming all steps are equal — brisk walking or stair climbing burns meaningfully more per step than a slow stroll",
      "Comparing step counts across people with very different stride lengths without adjusting for the difference",
      "Focusing only on step count while ignoring other important activity, like strength training",
    ],
    useCases: [
      "Converting a daily step count into estimated calories burned and distance covered",
      "Contextualizing progress toward a step count goal like 10,000 steps",
      "General activity tracking alongside phone or wearable step counters",
      "Comparing calorie burn across different daily step totals",
    ],
    conclusion:
      "Step count is a great low-effort activity metric to track consistently, even if the calorie conversion is approximate. Pair it with our Calories Burned Calculator for more precise estimates of dedicated workout sessions beyond everyday walking.",
  },
  "waist-to-hip": {
    intro:
      "Waist-to-hip ratio measures how body fat is distributed, which research suggests may be a more informative health indicator than weight or BMI alone for certain health risks. Our Waist-to-Hip Ratio Calculator finds your ratio and compares it against standard risk thresholds.",
    howItWorks:
      "The calculator divides your waist circumference by your hip circumference to find the ratio, then compares it against sex-specific thresholds (0.90 for men, 0.85 for women) commonly cited as marking increased health risk associated with central (abdominal) body fat.",
    formula: "Waist-to-hip ratio = waist circumference ÷ hip circumference",
    examples: [
      { title: "Lower risk category", body: "A 32-inch waist and 38-inch hip measurement gives a ratio of 0.84 — below the commonly cited 0.85 threshold for women, indicating lower relative risk by this measure." },
      { title: "Higher risk category", body: "The same waist measurement with a smaller 34-inch hip measurement raises the ratio to 0.94, moving into the higher-risk category for this particular indicator." },
    ],
    advantages: [
      "Reflects fat distribution, which BMI alone doesn't capture at all",
      "Uses established, commonly cited risk thresholds",
      "Simple two-measurement calculation using just a tape measure",
      "Useful complementary metric alongside BMI and weight",
    ],
    commonMistakes: [
      "Measuring waist and hip circumference inconsistently between check-ins, which skews trend tracking",
      "Treating this ratio as a complete health assessment on its own rather than one data point among several",
      "Not measuring at the correct anatomical locations (waist at the narrowest point, hips at the widest point)",
      "Comparing your ratio directly to someone with a very different body frame without context",
    ],
    useCases: [
      "Assessing body fat distribution alongside BMI or weight",
      "Tracking changes in body composition over time",
      "General health risk screening related to abdominal fat",
      "Complementing other body composition metrics for a fuller picture",
    ],
    conclusion:
      "Waist-to-hip ratio adds useful context that weight and BMI alone miss, but it's still just one piece of a larger health picture. Our Body Fat Calculator using the Navy circumference method offers another angle on body composition using similar simple measurements.",
  },
  "body-adiposity": {
    intro:
      "The Body Adiposity Index was developed as an alternative to BMI that estimates body fat percentage using hip circumference and height, without requiring a weight measurement at all. Our Body Adiposity Index Calculator applies that formula directly.",
    howItWorks:
      "The calculator divides hip circumference (in meters) by height (in meters) raised to the power of 1.5, then subtracts 18 — the BAI formula, designed specifically to estimate body fat percentage across different populations without needing a scale.",
    formula: "BAI = (hip circumference in meters ÷ height in meters^1.5) − 18",
    examples: [
      { title: "Standard measurement", body: "A hip circumference of 38 inches (0.97 m) and height of 5'8\" (1.73 m) produces a BAI estimate reflecting an approximate body fat percentage." },
      { title: "Why it skips weight", body: "Because BAI doesn't use weight at all, it can sometimes differ meaningfully from BMI-based body fat estimates, particularly for people with body compositions that don't fit typical assumptions." },
    ],
    advantages: [
      "Doesn't require a weight measurement, only hip circumference and height",
      "Was specifically developed and validated as a body fat percentage estimator, unlike BMI which was never designed for that",
      "Simple two-measurement calculation",
      "Useful alternative perspective alongside BMI and other body composition metrics",
    ],
    commonMistakes: [
      "Measuring hip circumference inconsistently between check-ins",
      "Treating BAI as more accurate than direct body fat measurement methods like DEXA scanning",
      "Using BAI in isolation without cross-checking against other body composition indicators",
      "Assuming BAI works equally well across all body types and ethnicities — like most formulas, it has known limitations",
    ],
    useCases: [
      "Estimating body fat percentage without needing a scale",
      "Cross-checking body composition estimates against BMI-based methods",
      "General body composition tracking using just a tape measure",
      "Research and educational purposes comparing different body fat estimation methods",
    ],
    conclusion:
      "BAI offers a useful, weight-free alternative perspective on body composition, though like all formula-based estimates it has known accuracy limitations across different body types. Our Body Fat Calculator (Navy method) provides another circumference-based estimate for comparison.",
  },
  bac: {
    intro:
      "Blood alcohol content estimation using the Widmark formula is a long-standing method for approximating intoxication level from drinks consumed, body weight, and time elapsed — useful for education, but never a substitute for simply not driving after drinking. Our BAC Calculator applies that formula for informational purposes only.",
    howItWorks:
      "The calculator estimates total alcohol consumed in grams from your number of standard drinks, applies the Widmark formula using your body weight and a sex-specific distribution ratio (accounting for average differences in body water percentage), then subtracts an estimated elimination rate based on hours elapsed since the first drink.",
    examples: [
      { title: "Educational example", body: "3 standard drinks over 2 hours for someone weighing 170 lb produces an estimated BAC — illustrating how weight, drink count, and time all factor into the calculation." },
      { title: "Why individual variation matters", body: "Two people with identical inputs can have meaningfully different actual BAC due to metabolism, food intake, medication, and other factors this simplified formula can't capture." },
    ],
    advantages: [
      "Illustrates the core factors that influence BAC — drinks, weight, sex, and time",
      "Useful for understanding alcohol education and the Widmark formula's mechanics",
      "Shows how BAC decreases over time due to metabolic elimination",
      "Accounts for average physiological differences by sex in the distribution ratio",
    ],
    commonMistakes: [
      "Treating any BAC estimate as accurate enough to decide whether it's safe to drive — it is never safe to drive after drinking, regardless of estimated BAC",
      "Forgetting that food intake, medication, and individual metabolism all cause real BAC to differ from this estimate, sometimes significantly",
      "Using this tool as a substitute for a breathalyzer or professional judgment in any real decision-making situation",
      "Not accounting for the wide range of what counts as a 'standard drink' across different beverage types and pour sizes",
    ],
    useCases: [
      "Educational understanding of how BAC is estimated and what factors influence it",
      "Alcohol safety education and awareness",
      "Understanding the Widmark formula's mechanics",
      "General reference — never for deciding whether it's safe to drive",
    ],
    conclusion:
      "This tool is strictly educational — never use any BAC estimate, from this calculator or any other, to decide whether you're safe to drive. If you've been drinking, arrange a ride, use a rideshare service, or call someone sober — every time, no exceptions.",
  },
  "pregnancy-due-date": {
    intro:
      "The standard method doctors use to estimate a due date is based on the first day of your last menstrual period, not the actual conception date — a common point of confusion for expecting parents. Our Pregnancy Due Date Calculator uses that same standard method.",
    howItWorks:
      "The calculator adds 280 days (40 weeks) to the first day of your last menstrual period, following Naegele's rule — the standard clinical method for estimating a due date, which assumes a typical 28-day cycle with ovulation around day 14.",
    examples: [
      { title: "Standard estimate", body: "A last period starting on a given date produces an estimated due date exactly 280 days later — the standard 40-week pregnancy estimate used clinically." },
      { title: "Current gestational age", body: "The calculator also shows how many weeks pregnant you currently are, based on the same last-period starting point, useful for tracking pregnancy milestones." },
    ],
    advantages: [
      "Uses the same standard method (Naegele's rule) doctors use for initial due date estimates",
      "Also shows current gestational age based on the same starting point",
      "Simple single-input calculation from a known date",
      "Useful early estimate before a dating ultrasound provides a more precise figure",
    ],
    commonMistakes: [
      "Treating the estimated due date as a guaranteed delivery date — only about 5% of babies are born on their exact due date",
      "Not accounting for irregular or non-28-day cycles, which this standard method assumes",
      "Confusing the last menstrual period date with the actual conception date, which typically occurs about two weeks later",
      "Relying on this estimate over an ultrasound-confirmed due date once one is available, which is generally more accurate",
    ],
    useCases: [
      "Getting an early estimated due date based on last menstrual period",
      "Tracking current gestational age week by week",
      "Preparing for early prenatal appointments and planning",
      "Cross-checking against an ultrasound-based due date estimate",
    ],
    conclusion:
      "This gives the same standard estimate used at an initial prenatal visit — an ultrasound in the first trimester typically refines this into a more precise, personalized due date. Our Conception Date Calculator can estimate the likely conception date working backward from a due date instead.",
  },
  ovulation: {
    intro:
      "Understanding your fertile window is central to both trying to conceive and natural family planning — our Ovulation Calculator estimates it from your last period and typical cycle length.",
    howItWorks:
      "The calculator estimates ovulation as occurring 14 days before your next expected period (based on your average cycle length), then marks the five days leading up to and including that date as your estimated fertile window, since sperm can survive several days awaiting ovulation.",
    examples: [
      { title: "Standard 28-day cycle", body: "A last period starting on a given date with a 28-day cycle length produces an estimated ovulation date and a roughly 5-day fertile window ending on that date." },
      { title: "Longer cycle", body: "A 32-day cycle shifts the estimated ovulation date later relative to the last period, since ovulation timing is estimated based on days before the next period, not a fixed day of the cycle." },
    ],
    advantages: [
      "Accounts for your specific average cycle length, not just a generic 28-day assumption",
      "Shows both the estimated ovulation date and the broader fertile window",
      "Useful for both conception planning and general cycle awareness",
      "Simple calculation from information most people already track",
    ],
    commonMistakes: [
      "Treating the estimate as precise when actual ovulation timing varies cycle to cycle, even for people with generally regular cycles",
      "Not accounting for irregular cycles, where this standard estimation method becomes much less reliable",
      "Relying solely on calendar-based estimation instead of combining with other fertility awareness methods (basal body temperature, ovulation predictor kits) for more accuracy",
      "Forgetting stress, illness, and other factors can shift ovulation timing in any given cycle",
    ],
    useCases: [
      "Estimating a fertile window for conception planning",
      "General menstrual cycle awareness and tracking",
      "Complementing other fertility awareness methods",
      "Understanding how cycle length affects estimated ovulation timing",
    ],
    conclusion:
      "Calendar-based estimation is a useful starting point, but combining it with ovulation predictor kits or basal body temperature tracking gives a much more reliable picture for anyone actively trying to conceive or avoid pregnancy. Cycles vary naturally, so treat this as an estimate, not a guarantee.",
  },
  conception: {
    intro:
      "Sometimes the question isn't 'when is my due date' but the reverse — working backward from a known or estimated due date to figure out the likely conception date. Our Conception Date Calculator handles that reverse calculation.",
    howItWorks:
      "The calculator subtracts 266 days (38 weeks, the typical length of pregnancy counted from conception rather than last menstrual period) from your due date to estimate the likely conception date.",
    examples: [
      { title: "Working backward from a due date", body: "A due date on a given date implies an estimated conception date 266 days earlier — useful for various personal, medical, or legal reference purposes." },
      { title: "Relationship to last menstrual period", body: "Conception typically occurs about two weeks after the start of the last menstrual period, which is why due dates calculated from LMP (adding 280 days) and from conception (adding 266 days) both point to a consistent overall pregnancy timeline." },
    ],
    advantages: [
      "Provides the reverse calculation that many other pregnancy tools don't offer",
      "Simple single-input calculation from a known or estimated due date",
      "Useful for various personal or reference purposes",
      "Consistent with the standard 266-day conception-to-due-date pregnancy length",
    ],
    commonMistakes: [
      "Treating the estimated conception date as precise to the day — actual conception timing varies within a fertile window, not a single exact point",
      "Confusing this calculation with the last-menstrual-period-based due date method, which uses a different (280-day) reference point",
      "Using this for any medical or legal purpose without professional confirmation, since it's an estimate based on average pregnancy length",
      "Not accounting for irregular cycles, which affect the precision of any date-based pregnancy estimate",
    ],
    useCases: [
      "Estimating a likely conception date from a known due date",
      "General pregnancy timeline reference and planning",
      "Personal record-keeping and milestone tracking",
      "Cross-referencing against last-menstrual-period-based due date calculations",
    ],
    conclusion:
      "This gives a reasonable estimate based on average pregnancy length, though actual conception can occur across a several-day fertile window rather than one precise date. Our Pregnancy Due Date Calculator handles the more common forward direction — estimating a due date from your last period.",
  },
  "pregnancy-weight-gain": {
    intro:
      "Recommended pregnancy weight gain isn't one universal number — it depends on your pre-pregnancy BMI, following guidelines from the Institute of Medicine. Our Pregnancy Weight Gain Calculator finds your specific recommended range.",
    howItWorks:
      "The calculator first computes your pre-pregnancy BMI from your height and weight, then applies the IOM's BMI-specific weight gain guidelines — lower BMI categories are recommended to gain more, while higher BMI categories are recommended to gain less, since starting nutritional reserves differ.",
    examples: [
      { title: "Normal pre-pregnancy BMI", body: "A pre-pregnancy BMI in the normal range (18.5-24.9) has a recommended total gain of 25-35 lb (11.5-16 kg) over the full pregnancy." },
      { title: "Higher pre-pregnancy BMI", body: "A pre-pregnancy BMI in the obese range (30+) has a lower recommended total gain of 11-20 lb (5-9 kg), reflecting different nutritional starting points." },
    ],
    advantages: [
      "Uses official IOM guidelines rather than a generic one-size-fits-all recommendation",
      "Personalizes the range to your specific pre-pregnancy BMI category",
      "Shows both the BMI calculation and the resulting recommended range together",
      "Useful reference point for discussions with a healthcare provider",
    ],
    commonMistakes: [
      "Using current (already pregnant) weight instead of pre-pregnancy weight to calculate the starting BMI",
      "Treating the recommended range as a strict target rather than a general guideline to discuss with a healthcare provider",
      "Not accounting for individual factors (multiples, health conditions) that can shift recommendations from the general guideline",
      "Comparing weight gain trajectory to someone else's pregnancy without accounting for different starting BMI categories",
    ],
    useCases: [
      "Understanding the recommended weight gain range for your specific pre-pregnancy BMI",
      "General pregnancy health and nutrition planning reference",
      "Preparing informed questions for a prenatal care provider",
      "Tracking pregnancy weight gain against general guidelines",
    ],
    conclusion:
      "These are general IOM guidelines, not individualized medical advice — always discuss your specific pregnancy weight gain plan with your prenatal care provider, especially if you have any underlying health conditions or are expecting multiples.",
  },
  sleep: {
    intro:
      "Waking up mid-sleep-cycle tends to feel far groggier than waking at the end of one, since sleep moves through roughly 90-minute cycles of varying depth. Our Sleep Calculator works backward from a wake-up time to suggest bedtimes aligned with complete cycles.",
    howItWorks:
      "The calculator subtracts whole 90-minute sleep cycles (plus an estimated 15 minutes to actually fall asleep) from your desired wake-up time, showing several bedtime options corresponding to different numbers of complete sleep cycles.",
    examples: [
      { title: "5 cycles (7.5 hours)", body: "For a 7:00 AM wake-up time, going to bed at approximately 11:15 PM completes 5 full 90-minute sleep cycles, a commonly recommended target for adults." },
      { title: "6 cycles (9 hours)", body: "The same wake-up time with an earlier 9:45 PM bedtime completes 6 full cycles — more total sleep, useful during periods of higher recovery need." },
    ],
    advantages: [
      "Suggests bedtimes aligned to complete sleep cycles, not just a flat 8-hour target",
      "Shows multiple options so you can choose based on how much time you have available",
      "Simple, practical way to apply sleep cycle science to real bedtime planning",
      "Useful for shift workers or anyone with a variable wake-up schedule",
    ],
    commonMistakes: [
      "Treating exactly 90 minutes as a precise, unvarying cycle length — real sleep cycles vary somewhat by individual and night",
      "Choosing the shortest option regularly just to have more waking hours, at the expense of adequate total sleep",
      "Not accounting for the actual time it takes you personally to fall asleep, which varies from person to person",
      "Ignoring sleep quality factors (screen time, caffeine, room temperature) that matter as much as timing",
    ],
    useCases: [
      "Choosing a bedtime aligned with complete sleep cycles for a specific wake-up time",
      "Planning sleep schedules around shift work or irregular hours",
      "Understanding why some wake-up times feel groggier than others",
      "General sleep hygiene planning",
    ],
    conclusion:
      "Sleep cycle timing is a useful heuristic, but total sleep duration and consistent sleep habits matter just as much as hitting an exact cycle boundary. Most adults need 7-9 hours consistently — use this as a planning tool, not a rigid rule.",
  },
  "caloric-deficit": {
    intro:
      "Losing weight at a specific, sustainable rate requires knowing exactly how large a calorie deficit to target — too small and progress stalls, too large and it becomes unsustainable. Our Caloric Deficit Calculator finds the daily calorie target for your specific weight loss goal.",
    howItWorks:
      "The calculator estimates your maintenance calories (TDEE) using the Mifflin-St Jeor formula and your activity level, then subtracts a daily deficit calculated from your weekly weight loss goal, using the standard approximation that one pound of fat corresponds to roughly 3,500 calories.",
    formula: "Daily deficit = (lb/week goal × 3,500) ÷ 7\nDaily calorie target = TDEE − daily deficit",
    examples: [
      { title: "1 lb/week goal", body: "A TDEE of 2,400 calories with a 1 lb/week loss goal requires a 500-calorie daily deficit, for a target of 1,900 calories/day." },
      { title: "More aggressive goal", body: "The same TDEE with a 2 lb/week goal requires a 1,000-calorie daily deficit — a much larger cut that may be harder to sustain and could risk inadequate nutrition depending on total calorie level." },
    ],
    advantages: [
      "Calculates a specific, personalized daily calorie target rather than a generic 'eat less' suggestion",
      "Scales the deficit to your actual weight loss rate goal",
      "Built on the same reliable TDEE foundation as our other calorie calculators",
      "Makes the trade-off between faster loss and a larger daily deficit concrete",
    ],
    commonMistakes: [
      "Choosing an overly aggressive weekly loss goal that creates an unsustainable, overly restrictive daily calorie target",
      "Not adjusting the target as weight (and therefore TDEE) changes over the course of a diet",
      "Treating the 3,500-calorie-per-pound rule as perfectly precise rather than a useful approximation",
      "Ignoring that very low calorie targets can risk inadequate nutrition and should be discussed with a professional",
    ],
    useCases: [
      "Setting a daily calorie target for a specific weight loss rate goal",
      "Understanding the size of deficit needed for different loss-rate goals",
      "Planning a sustainable, realistic weight loss approach",
      "Adjusting calorie targets as a diet progresses",
    ],
    conclusion:
      "A moderate deficit (around 500 calories/day, roughly 1 lb/week) tends to be more sustainable long-term than aggressive cuts. Once you have your target, our Weight Loss Timeline Calculator can project roughly how long it will take to reach a specific goal weight.",
  },
  "weight-loss-timeline": {
    intro:
      "Once you know your daily calorie deficit, the natural next question is how long it will actually take to reach your goal weight. Our Weight Loss Timeline Calculator projects that timeline using the standard calorie-to-pounds relationship.",
    howItWorks:
      "The calculator finds how much weight you need to lose (current minus goal weight), converts your daily calorie deficit into an expected weekly rate of loss using the standard 3,500-calories-per-pound approximation, then divides total weight to lose by that weekly rate to estimate total weeks needed.",
    formula: "Weekly loss (lb) = (daily deficit × 7) ÷ 3,500\nWeeks to goal = weight to lose ÷ weekly loss",
    examples: [
      { title: "Moderate deficit", body: "Losing 25 lb (from 200 to 175) at a 500-calorie daily deficit (1 lb/week) takes an estimated 25 weeks, or roughly 6 months." },
      { title: "Larger deficit", body: "The same 25 lb goal at a 750-calorie daily deficit shortens the timeline to about 16.7 weeks — faster, but a bigger daily commitment to sustain." },
    ],
    advantages: [
      "Converts an abstract deficit into a concrete, motivating timeline",
      "Uses the same reliable calorie-to-pounds approximation as other weight loss tools",
      "Makes it easy to compare how different deficit sizes change the timeline",
      "Useful for setting realistic expectations before starting a weight loss plan",
    ],
    commonMistakes: [
      "Expecting perfectly linear weight loss week to week — real progress fluctuates due to water retention, hormones, and other factors",
      "Choosing too large a deficit to reach a goal faster, risking unsustainability and muscle loss alongside fat loss",
      "Not recalculating as weight (and TDEE) changes meaningfully partway through the timeline",
      "Treating the estimate as a guarantee rather than a reasonable, adjustable projection",
    ],
    useCases: [
      "Estimating how long it will take to reach a specific goal weight",
      "Comparing timelines across different calorie deficit sizes",
      "Setting realistic expectations before starting a weight loss plan",
      "Tracking whether actual progress is roughly on pace with the projection",
    ],
    conclusion:
      "Real-world weight loss rarely follows a perfectly straight line, but this projection gives a realistic ballpark for planning purposes. Our Caloric Deficit Calculator can help you first determine the right deficit size before projecting the full timeline here.",
  },
  "smoking-cost": {
    intro:
      "Beyond the well-known health risks, smoking carries a substantial and often underestimated financial cost that compounds significantly over years. Our Smoking Cost Calculator puts a concrete dollar figure on that cost.",
    howItWorks:
      "The calculator multiplies your daily pack consumption by the price per pack and by 365 days to find annual cost, then multiplies by your chosen number of years to find the total cost over that period.",
    formula: "Annual cost = packs/day × price/pack × 365\nTotal cost = annual cost × years",
    examples: [
      { title: "One pack a day", body: "One pack a day at $9/pack costs $3,285/year, or $32,850 over 10 years — money that could otherwise go toward savings, debt payoff, or other goals." },
      { title: "Lighter smoking habit", body: "Even a lighter half-pack-a-day habit at the same price still adds up to over $16,000 across the same 10-year period." },
    ],
    advantages: [
      "Puts a concrete, motivating dollar figure on an often-underestimated ongoing cost",
      "Shows both annual and total cost over a chosen time period",
      "Works for any consumption level and price point",
      "Useful additional motivation alongside the well-documented health reasons to quit",
    ],
    commonMistakes: [
      "Underestimating total lifetime cost by only thinking about the price of a single pack in isolation",
      "Not accounting for how this money could otherwise grow if invested — see our Compound Interest Calculator for that comparison",
      "Ignoring the significant indirect costs of smoking, like higher health and life insurance premiums",
      "Focusing only on the financial angle while underweighting the more serious health costs",
    ],
    useCases: [
      "Understanding the true long-term financial cost of a smoking habit",
      "Building additional motivation to quit alongside health considerations",
      "Estimating potential savings from quitting for financial planning purposes",
      "General awareness and education around the cost of smoking",
    ],
    conclusion:
      "The financial cost alone, set aside entirely from the health risks, is often enough to make quitting one of the higher-return financial decisions available. If you're ready to quit, resources like smokefree.gov offer free, evidence-based support.",
  },
  "alcohol-calories": {
    intro:
      "Alcoholic drinks carry calories that are easy to lose track of, especially with cocktails that mix multiple caloric ingredients. Our Alcohol Calories Calculator estimates the calorie content of common drink types.",
    howItWorks:
      "The calculator applies typical calorie estimates for standard servings of common drink types — beer, wine, a spirit shot, or a mixed cocktail — and multiplies by the number of drinks to find total calories consumed.",
    examples: [
      { title: "A few beers", body: "2 beers at approximately 150 calories each totals about 300 calories — roughly equivalent to a candy bar." },
      { title: "Cocktails add up faster", body: "2 cocktails at approximately 200 calories each totals about 400 calories, and many mixed drinks with sugary additions can run considerably higher than this baseline estimate." },
    ],
    advantages: [
      "Covers common drink categories with representative calorie estimates",
      "Fast way to see how alcohol calories add up across a night out",
      "Useful for factoring alcohol into an overall daily calorie count",
      "Simple selection-based interface, no need to look up exact nutrition labels",
    ],
    commonMistakes: [
      "Underestimating cocktail calories, which vary enormously based on specific ingredients and pour sizes",
      "Forgetting alcohol calories don't provide the same satiety as food calories, making it easy to under-account for them",
      "Not accounting for mixers (soda, juice, syrups) that add significant calories beyond the alcohol itself",
      "Treating this as a precise measurement rather than a reasonable estimate for common serving sizes",
    ],
    useCases: [
      "Estimating calories from alcohol consumption for overall daily tracking",
      "Comparing calorie content across different drink types",
      "General awareness of how alcohol fits into a calorie or diet goal",
      "Planning around alcohol calories when tracking nutrition",
    ],
    conclusion:
      "Alcohol calories are easy to overlook but can add up to a meaningful portion of daily intake, especially with mixed drinks. If weight management is a goal, being mindful of both drink type and frequency makes a real difference alongside food tracking.",
  },
  "child-height-predictor": {
    intro:
      "Predicting how tall a child will grow up to be is imprecise, but the mid-parental height method offers a reasonable estimate based on both parents' heights. Our Child Height Predictor applies that widely used formula.",
    howItWorks:
      "The calculator averages both parents' heights, then adds or subtracts an adjustment (about 2.5 inches) depending on the child's sex, since the formula accounts for typical height differences between men and women — this mid-parental height method is a long-standing, commonly cited estimation approach.",
    examples: [
      { title: "Estimating for a son", body: "A mother at 5'4\" and father at 5'10\" produces an estimated adult height for a son around 5'10\", following the standard adjustment for boys." },
      { title: "Estimating for a daughter", body: "The same parents' heights produce a lower estimated adult height for a daughter, reflecting the formula's sex-specific adjustment." },
    ],
    advantages: [
      "Uses the long-established, widely referenced mid-parental height method",
      "Simple calculation requiring only both parents' heights and the child's sex",
      "Provides a reasonable general estimate without requiring medical imaging or bone age assessment",
      "Useful as a general reference point, even with its inherent uncertainty",
    ],
    commonMistakes: [
      "Treating the estimate as precise — actual adult height depends on genetics, nutrition, health, and other factors well beyond parental height alone",
      "Using this in place of a pediatrician's growth chart tracking, which is far more clinically relevant for monitoring a child's development",
      "Not accounting for the wide normal range around any mid-parental height estimate",
      "Assuming height is purely genetic when nutrition and overall childhood health also play meaningful roles",
    ],
    useCases: [
      "Getting a general reference estimate for a child's likely adult height",
      "Satisfying general curiosity using a well-known estimation method",
      "Understanding how the mid-parental height method works",
      "Complementing (not replacing) pediatric growth chart tracking",
    ],
    conclusion:
      "This is a rough estimate with real uncertainty built in — a pediatrician's growth chart tracking over time is far more useful for actually monitoring a child's healthy development than any one-time height prediction formula.",
  },
  "body-fat": {
    intro:
      "Body fat percentage tells you more about your body composition than weight or BMI alone, since it separates fat mass from muscle, bone, and water. Our Body Fat Calculator uses the U.S. Navy circumference method, a well-established estimation technique that only requires a tape measure.",
    howItWorks:
      "The U.S. Navy method estimates body fat percentage from a handful of circumference measurements — neck, waist, and (for women) hips — combined with height. It uses logarithms of these measurements in a formula validated against more expensive methods like hydrostatic weighing, making it one of the more practical at-home estimation techniques available.",
    formula: "Men: %BF = 495 / (1.0324 − 0.19077×log10(waist−neck) + 0.15456×log10(height)) − 450\nWomen: %BF = 495 / (1.29579 − 0.35004×log10(waist+hip−neck) + 0.22100×log10(height)) − 450",
    examples: [
      { title: "Male example", body: "A man with a 15\" neck, 34\" waist, and 68\" height gets an estimated body fat percentage in the mid-teens — typical of an active, fit individual." },
      { title: "Measurement matters", body: "A waist measurement taken too loosely or too high above the navel can shift the result by several percentage points, so consistent technique matters." },
    ],
    advantages: [
      "Only requires a tape measure — no special equipment needed",
      "Validated method used by the U.S. Navy for decades",
      "More informative than BMI for understanding actual body composition",
      "Useful for tracking body composition changes over time, not just weight",
    ],
    commonMistakes: [
      "Measuring waist and neck inconsistently between sessions",
      "Not measuring at the same time of day, which can affect results slightly",
      "Treating the estimate as lab-grade precise rather than a solid approximation",
      "Comparing results between very different measurement techniques (like calipers vs. this method)",
    ],
    useCases: [
      "Tracking body composition changes during a fitness program",
      "Getting a more complete picture than BMI provides",
      "Setting realistic body composition goals",
      "Checking progress alongside weight and strength measurements",
    ],
    conclusion:
      "Body fat percentage, tracked consistently over time using the same method, is one of the more useful numbers for judging real fitness progress. Use this calculator every few weeks with careful, consistent measurements, and pair it with our Lean Body Mass and Ideal Weight calculators for additional context.",
  },
};
