import { SeoContent } from "./types";

export const conversionContent: Record<string, SeoContent> = {
  "length-converter": {
    intro:
      "Switching between metric and imperial length units trips up even experienced cooks, travelers, and students, since the conversion factors aren't round numbers. Our Length Converter instantly converts between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.",
    howItWorks:
      "Every unit is converted through a common base unit (meters) using precise conversion factors, so converting directly from, say, miles to centimeters is just as accurate as converting between more commonly paired units like feet and meters.",
    formula: "Value in meters = input × unit factor\nResult = value in meters ÷ target unit factor",
    examples: [
      { title: "Feet to meters", body: "6 feet converts to approximately 1.83 meters — a common conversion for height." },
      { title: "Miles to kilometers", body: "A 5-mile run is approximately 8.05 kilometers." },
    ],
    advantages: [
      "Covers all common metric and imperial length units in one tool",
      "Uses precise, internationally standardized conversion factors",
      "Instant results as you change the value or units",
      "No need to memorize awkward conversion ratios like 1 mile = 1.60934 km",
    ],
    commonMistakes: [
      "Confusing US and UK measurement customs, which mostly align for length but differ for volume",
      "Rounding conversion factors too early, causing small errors in longer distances",
      "Mixing up feet and meters, which look deceptively similar in casual use",
      "Not double-checking which unit a recipe, form, or manual is actually asking for",
    ],
    useCases: [
      "Converting recipe or DIY project measurements",
      "Understanding distances while traveling internationally",
      "Academic and engineering unit conversions",
      "Comparing height, distance, or size specifications across regions",
    ],
    conclusion:
      "Precise unit conversion matters more than it seems — small rounding errors compound over long distances or repeated calculations. Bookmark this tool for quick, accurate conversions, and check out our Weight and Volume converters for the same accuracy in other common units.",
  },
  "weight-converter": {
    intro:
      "From cooking to fitness tracking to shipping, weight conversions between metric and imperial units come up constantly — and the numbers rarely round out cleanly. Our Weight Converter handles milligrams, grams, kilograms, metric tons, ounces, pounds, and stone.",
    howItWorks:
      "Like our other converters, this tool converts your input through a common base unit (kilograms) using precise standard conversion factors, ensuring accuracy whether you're converting between closely related units or very different ones, like ounces to metric tons.",
    formula: "Value in kilograms = input × unit factor\nResult = value in kilograms ÷ target unit factor",
    examples: [
      { title: "Pounds to kilograms", body: "160 lb converts to approximately 72.6 kg — a common conversion for body weight." },
      { title: "Grams to ounces", body: "500 grams converts to approximately 17.6 ounces, useful for cooking measurements." },
    ],
    advantages: [
      "Covers the full range from milligrams to metric tons",
      "Includes stone, commonly used for body weight in the UK",
      "Precise conversion factors avoid compounding rounding errors",
      "Instant, no-signup conversion for quick everyday use",
    ],
    commonMistakes: [
      "Confusing a US ton (short ton) with a metric tonne — they aren't the same",
      "Mixing up mass (weight) with volume when converting cooking ingredients",
      "Rounding intermediate results before finishing a multi-step conversion",
      "Assuming 'stone' converts the same way across all English-speaking countries",
    ],
    useCases: [
      "Tracking body weight across different regional units",
      "Cooking and baking measurement conversions",
      "Shipping and freight weight calculations",
      "Academic, scientific, or engineering conversions",
    ],
    conclusion:
      "Accurate weight conversion matters whether you're stepping on a scale, packing a shipment, or following a recipe from another country. For temperature conversions in the kitchen, pair this with our Temperature Converter.",
  },
  "temperature-converter": {
    intro:
      "Temperature is the one common unit conversion that isn't a simple multiplication — Celsius, Fahrenheit, and Kelvin all use different starting points, not just different scales. Our Temperature Converter handles the correct formula for all three so you never have to remember it.",
    howItWorks:
      "Unlike length or weight, temperature scales have different zero points, so conversions require both a multiplication and an addition or subtraction step. The calculator converts your input to Celsius internally first, then applies the correct formula to reach your target scale.",
    formula: "°F = (°C × 9/5) + 32\n°C = (°F − 32) × 5/9\nK = °C + 273.15",
    examples: [
      { title: "Boiling point", body: "100°C, the boiling point of water at sea level, converts to exactly 212°F." },
      { title: "Body temperature", body: "A normal human body temperature of 37°C converts to 98.6°F." },
    ],
    advantages: [
      "Handles all three major temperature scales correctly, including the offset math",
      "Removes the need to memorize the Celsius-Fahrenheit formula",
      "Useful for cooking, weather, travel, and science alike",
      "Instant conversion as you change the input value",
    ],
    commonMistakes: [
      "Treating temperature conversion as a simple ratio like other unit conversions",
      "Forgetting Kelvin has no negative values (0 K is absolute zero)",
      "Mixing up the direction of the Celsius-Fahrenheit formula",
      "Not double-checking which scale a recipe or forecast is actually using",
    ],
    useCases: [
      "Cooking and oven temperature conversions",
      "Understanding weather forecasts while traveling internationally",
      "Science and engineering calculations",
      "Quick health-related temperature checks",
    ],
    conclusion:
      "Temperature conversion trips people up because it isn't just a multiplication — this tool gets the math exactly right every time. For other kitchen conversions, our Volume Converter covers cups, tablespoons, and milliliters.",
  },
  "volume-converter": {
    intro:
      "Recipes, fuel tanks, and containers all use different volume units depending on where you are in the world — cups and gallons versus liters and milliliters. Our Volume Converter handles milliliters, liters, teaspoons, tablespoons, fluid ounces, cups, pints, quarts, and gallons.",
    howItWorks:
      "The calculator converts your input through a common base unit (liters) using precise standard factors, so you can convert directly between any two supported units — including less common pairings like tablespoons to liters — without compounding errors.",
    formula: "Value in liters = input × unit factor\nResult = value in liters ÷ target unit factor",
    examples: [
      { title: "Cups to milliliters", body: "2 cups converts to approximately 480 milliliters — a common recipe conversion." },
      { title: "Gallons to liters", body: "A 10-gallon container holds approximately 37.85 liters." },
    ],
    advantages: [
      "Covers both cooking-scale units (teaspoons, cups) and larger units (gallons, liters)",
      "Precise conversion factors avoid errors in recipes or larger-scale measurements",
      "Instant results with no need to memorize awkward ratios",
      "Useful across cooking, automotive, and general measurement needs",
    ],
    commonMistakes: [
      "Confusing US customary cups/gallons with UK imperial cups/gallons, which differ slightly",
      "Mixing up fluid ounces (volume) with ounces (weight)",
      "Rounding early in multi-step recipe conversions, throwing off ratios",
      "Assuming a 'cup' is standardized globally when it varies by country",
    ],
    useCases: [
      "Converting recipes between US and metric measurements",
      "Fuel and liquid container capacity conversions",
      "Academic and scientific volume calculations",
      "Comparing product sizes labeled in different unit systems",
    ],
    conclusion:
      "Getting volume conversions right matters most in recipes, where small ratio errors can change a result significantly. Use this converter alongside our Weight Converter for full recipe conversions between measurement systems.",
  },
  "speed-converter": {
    intro:
      "Speed is measured differently depending on context and country — mph in the US, km/h almost everywhere else, knots at sea, and m/s in science. Our Speed Converter translates between all of them instantly.",
    howItWorks:
      "Every unit converts through a common base unit (meters per second) using precise conversion factors, so converting directly between any two speed units — even less common pairings like knots to feet per second — stays accurate.",
    examples: [
      { title: "Driving speeds", body: "60 mph converts to approximately 96.56 km/h — useful context when driving or renting a car in a country using metric speed limits." },
      { title: "Nautical speed", body: "20 knots (a common vessel speed) converts to approximately 23.02 mph, useful for comparing marine speeds to more familiar road speed references." },
    ],
    advantages: [
      "Covers mph, km/h, m/s, knots, and feet per second in one tool",
      "Uses precise conversion factors for accurate results across all unit pairs",
      "Useful for driving, aviation, marine, and scientific contexts",
      "Instant conversion as you change the value or units",
    ],
    commonMistakes: [
      "Assuming mph and km/h are close enough to round casually — the difference compounds over long distances",
      "Confusing knots (nautical miles per hour) with mph, which use different underlying distance units",
      "Not converting speed limits correctly when driving internationally",
      "Mixing up m/s (a common scientific and engineering unit) with km/h in physics calculations",
    ],
    useCases: [
      "Converting speed limits or driving speeds between mph and km/h",
      "Marine and aviation speed conversions involving knots",
      "Science and engineering calculations using m/s",
      "General travel and international driving reference",
    ],
    conclusion:
      "Speed units vary by country and context far more than most measurements, making a reliable converter genuinely useful for travel, driving, and technical work alike.",
  },
  "area-converter": {
    intro:
      "Area measurements span an unusually wide range of units depending on context — square feet for a room, acres for land, hectares internationally. Our Area Converter handles all of them in one tool.",
    howItWorks:
      "Every unit converts through a common base unit (square meters) using precise conversion factors, ensuring accuracy whether you're converting between closely related units like square feet and square meters, or very different scales like square inches and acres.",
    examples: [
      { title: "Home and property", body: "1,000 square feet converts to approximately 92.9 square meters — useful when comparing home sizes across countries using different standard units." },
      { title: "Land measurement", body: "A 5-acre property converts to approximately 2.02 hectares, the standard unit used internationally for land area." },
    ],
    advantages: [
      "Covers square meters, square feet, acres, hectares, and more in one tool",
      "Uses precise conversion factors across widely different unit scales",
      "Useful for real estate, land measurement, and construction contexts",
      "Instant results as you adjust value or units",
    ],
    commonMistakes: [
      "Confusing acres (a land measurement) with square feet when evaluating property size",
      "Not accounting for how dramatically different area units scale compared to their corresponding length units (doubling a length quadruples the area)",
      "Mixing up hectares (metric) with acres (imperial) when comparing international property listings",
      "Rounding conversion factors too early, compounding error across large area calculations",
    ],
    useCases: [
      "Comparing real estate listings across countries using different area units",
      "Land and property measurement conversions",
      "Construction and landscaping area calculations",
      "Academic and scientific area unit conversions",
    ],
    conclusion:
      "Area units span an unusually wide range from square inches to hectares, and getting the conversion right matters for real estate, land, and construction decisions where the numbers involved are often significant.",
  },
  "data-storage-converter": {
    intro:
      "Storage sizes from bits to terabytes span many orders of magnitude, and confusion between similar-looking units (MB vs Mb, GB vs GiB) is common. Our Data Storage Converter handles the standard decimal conversions clearly.",
    howItWorks:
      "The calculator converts through a common base unit (bits) using standard powers-of-1000 conversion factors between bits, bytes, kilobytes, megabytes, gigabytes, and terabytes — the convention most commonly used for storage device capacity and file size display.",
    examples: [
      { title: "File size context", body: "4 gigabytes converts to 4,000 megabytes, useful context when comparing file sizes or available storage." },
      { title: "Storage capacity planning", body: "Converting between units helps when comparing a device's advertised capacity against how much space specific files or media will actually require." },
    ],
    advantages: [
      "Covers bits, bytes, kilobytes, megabytes, gigabytes, and terabytes in one tool",
      "Uses standard, widely applied conversion factors",
      "Useful for understanding file sizes, storage capacity, and data transfer",
      "Fast conversion between any two data storage units",
    ],
    commonMistakes: [
      "Confusing bits (lowercase 'b', used for data transfer speeds) with bytes (uppercase 'B', used for file and storage sizes) — an 8x difference",
      "Not accounting for the difference between decimal (1000-based, common in storage marketing) and binary (1024-based, used by some operating systems) unit definitions",
      "Assuming advertised storage device capacity exactly matches usable capacity after formatting overhead",
      "Mixing up megabits per second (internet speed) with megabytes (file size) when estimating download times",
    ],
    useCases: [
      "Converting file sizes between different data storage units",
      "Understanding storage device capacity in different unit scales",
      "Comparing internet speeds (bits) against file sizes (bytes)",
      "General computing and technology reference",
    ],
    conclusion:
      "The bits-versus-bytes distinction trips up more people than any other part of data storage units — always double-check which one a given context (internet speed vs. file size) actually refers to.",
  },
  "pressure-converter": {
    intro:
      "Pressure gets measured in wildly different units depending on the field — PSI for tires, bar for many international gauges, atmospheres in science, mmHg in medicine. Our Pressure Converter handles all of them.",
    howItWorks:
      "Every unit converts through a common base unit (pascals) using precise conversion factors, ensuring accuracy across the full range of common pressure units used in engineering, weather, medicine, and everyday contexts like tire pressure.",
    examples: [
      { title: "Tire pressure", body: "32 PSI (a common car tire pressure) converts to approximately 2.21 bar, useful when a vehicle or gauge uses metric pressure units instead." },
      { title: "Weather and atmospheric pressure", body: "Standard atmospheric pressure (1 atm) converts to approximately 101.325 kilopascals, the standard reference used in many scientific and weather contexts." },
    ],
    advantages: [
      "Covers pascals, bar, PSI, atmospheres, and mmHg in one tool",
      "Uses precise conversion factors across all common pressure units",
      "Useful across automotive, medical, scientific, and weather contexts",
      "Instant, accurate results for any pressure unit conversion",
    ],
    commonMistakes: [
      "Using the wrong pressure unit for a specific gauge or specification, especially when working with international equipment",
      "Confusing gauge pressure (relative to atmospheric pressure) with absolute pressure, which are measured differently in some contexts",
      "Not double-checking tire pressure conversions before inflating, since over- or under-inflation affects safety and tire wear",
      "Mixing up mmHg (common in blood pressure and some scientific contexts) with other pressure units without converting first",
    ],
    useCases: [
      "Converting tire pressure between PSI and bar",
      "Scientific and engineering pressure unit conversions",
      "Medical and blood pressure unit reference",
      "Weather and atmospheric pressure conversions",
    ],
    conclusion:
      "Pressure units vary enormously by field and region — this converter bridges automotive, scientific, medical, and everyday pressure measurement in one reliable tool.",
  },
  "energy-converter": {
    intro:
      "Energy is measured in joules for physics, calories for nutrition, watt-hours for electricity, and BTU for heating and cooling — our Energy Converter translates between all of them.",
    howItWorks:
      "Every unit converts through a common base unit (joules) using precise conversion factors, ensuring accurate conversion whether you're working with nutritional calories, electrical watt-hours, or scientific joules.",
    examples: [
      { title: "Nutrition to physics units", body: "500 kilocalories (a typical meal's energy content) converts to approximately 2,092 kilojoules, the unit used on nutrition labels in many countries outside the US." },
      { title: "Electricity and heating", body: "Converting between watt-hours and BTU is useful when comparing an appliance's electrical energy use against a heating or cooling system's BTU rating." },
    ],
    advantages: [
      "Covers joules, calories, kilocalories, watt-hours, and BTU in one tool",
      "Uses precise conversion factors across scientific, nutritional, and energy units",
      "Useful for nutrition, physics, and home energy contexts alike",
      "Instant conversion between any two energy units",
    ],
    commonMistakes: [
      "Confusing calories (used loosely in US nutrition, technically kilocalories) with true calories (a much smaller scientific unit)",
      "Not recognizing that 'Calories' on US nutrition labels actually means kilocalories",
      "Mixing up energy units (joules, calories) with power units (watts), which measure energy per unit time rather than a fixed quantity",
      "Using the wrong BTU conversion when comparing HVAC system ratings across different unit conventions",
    ],
    useCases: [
      "Converting nutrition information between calories and joules",
      "Comparing electrical energy use across different unit systems",
      "HVAC and heating/cooling BTU conversions",
      "Physics and engineering energy unit conversions",
    ],
    conclusion:
      "Energy units bridge nutrition, physics, and home energy use in ways that make conversion genuinely useful across very different everyday contexts — from reading a nutrition label to sizing an air conditioner.",
  },
  "power-converter": {
    intro:
      "Power ratings appear in watts for electronics, kilowatts for appliances, horsepower for engines, and BTU per hour for HVAC systems — our Power Converter translates between all of them.",
    howItWorks:
      "Every unit converts through a common base unit (watts) using precise conversion factors, ensuring accurate results whether you're comparing an engine's horsepower to its kilowatt equivalent or an HVAC system's BTU rating to watts.",
    examples: [
      { title: "Vehicle engine power", body: "150 horsepower converts to approximately 111.9 kilowatts, useful when comparing vehicle specifications across countries using different standard power units." },
      { title: "Home appliances", body: "Comparing an appliance's wattage rating to a generator's kilowatt output helps determine what a specific generator can actually power." },
    ],
    advantages: [
      "Covers watts, kilowatts, horsepower, and BTU per hour in one tool",
      "Uses precise conversion factors across automotive, electrical, and HVAC units",
      "Useful for comparing engine, appliance, and HVAC power ratings",
      "Instant, accurate results for any power unit conversion",
    ],
    commonMistakes: [
      "Confusing power (watts, the rate of energy use) with energy (watt-hours, a fixed quantity) — related but different concepts",
      "Using mechanical horsepower conversions for electrical motor ratings, which sometimes use a slightly different horsepower definition",
      "Not accounting for real-world efficiency losses when converting rated power to actual usable output",
      "Mixing up kilowatts (power) with kilowatt-hours (energy) when reading a utility bill",
    ],
    useCases: [
      "Comparing vehicle or engine horsepower to kilowatt ratings",
      "Determining generator capacity needed for specific appliances",
      "HVAC system power rating comparisons",
      "Engineering and technical power unit conversions",
    ],
    conclusion:
      "Power ratings appear in different units depending on whether you're shopping for a car, a generator, or an air conditioner — this converter bridges all of them for direct comparison.",
  },
  "angle-converter": {
    intro:
      "Angles are measured in degrees for everyday use, radians for most mathematical and scientific calculations, and occasionally gradians in surveying — our Angle Converter translates between all three.",
    howItWorks:
      "The calculator applies the precise mathematical relationships between the three angle units — a full circle equals 360 degrees, 2π radians, or 400 gradians — to convert accurately between any two.",
    formula: "Radians = degrees × (π ÷ 180)\nGradians = degrees × (400 ÷ 360)",
    examples: [
      { title: "Degrees to radians", body: "90 degrees converts to exactly π/2 radians (approximately 1.5708), a conversion used constantly in trigonometry and calculus." },
      { title: "Radians in practice", body: "Most programming languages and scientific calculators default to radians for trig functions, making this conversion essential when working between degree-based specifications and radian-based code or formulas." },
    ],
    advantages: [
      "Covers degrees, radians, and gradians in one tool",
      "Uses precise mathematical conversion relationships",
      "Essential for trigonometry, calculus, and programming contexts",
      "Instant, accurate conversion for any angle value",
    ],
    commonMistakes: [
      "Forgetting many programming languages and calculator functions expect radians, not degrees, leading to wildly incorrect trig results",
      "Confusing gradians (used in surveying, 400 per full circle) with degrees (360 per full circle)",
      "Not converting angle units before combining values from different sources in a calculation",
      "Assuming π radians always equals exactly 180 degrees without accounting for rounding in practical calculations",
    ],
    useCases: [
      "Converting between degrees and radians for trigonometry or calculus",
      "Programming and scientific computing angle unit conversions",
      "Surveying calculations involving gradians",
      "General math and engineering angle reference",
    ],
    conclusion:
      "The degrees-to-radians conversion is one of the most frequently needed unit conversions in math and programming — getting it right avoids a whole category of subtle calculation errors.",
  },
  "time-converter": {
    intro:
      "Converting between seconds, minutes, hours, days, weeks, and years comes up constantly in scheduling, science, and everyday planning — our Time Converter handles all of them in one tool.",
    howItWorks:
      "Every unit converts through a common base unit (seconds) using precise conversion factors, correctly handling the full range from seconds up to years for accurate results across any time unit pairing.",
    examples: [
      { title: "Days to hours", body: "3 days converts to exactly 72 hours — a simple but frequently needed conversion for scheduling and project planning." },
      { title: "Long time periods", body: "Converting a duration in weeks or years down to total hours or seconds helps with more granular technical or scientific calculations." },
    ],
    advantages: [
      "Covers seconds, minutes, hours, days, weeks, and years in one tool",
      "Uses precise, consistent conversion factors across all time scales",
      "Useful for scheduling, science, and general planning purposes",
      "Instant results for any time unit pairing",
    ],
    commonMistakes: [
      "Assuming a year always equals exactly 365 days, when leap years add complexity to precise long-term conversions",
      "Not accounting for months, which vary in length and aren't included as a fixed conversion unit here",
      "Mixing up conversions when working across very different time scales (seconds versus years) without careful unit tracking",
      "Rounding intermediate conversion steps manually, introducing small errors versus a direct calculation",
    ],
    useCases: [
      "Converting durations between different time units for scheduling",
      "Scientific and technical calculations involving time unit conversions",
      "Project planning and duration estimation",
      "General reference for time unit relationships",
    ],
    conclusion:
      "Time unit conversion seems simple until larger units like years enter the picture — this handles the full range accurately and consistently.",
  },
  "frequency-converter": {
    intro:
      "Frequency units span from hertz for everyday sound and electronics up to gigahertz for computer processors and wireless signals — our Frequency Converter translates between all of them.",
    howItWorks:
      "Every unit converts through a common base unit (hertz) using standard powers-of-1000 conversion factors between hertz, kilohertz, megahertz, and gigahertz.",
    formula: "1 kHz = 1,000 Hz\n1 MHz = 1,000,000 Hz\n1 GHz = 1,000,000,000 Hz",
    examples: [
      { title: "Wireless signal frequency", body: "2.4 GHz (a common Wi-Fi frequency band) converts to 2,400 MHz, useful when comparing device specifications listed in different unit scales." },
      { title: "Audio frequency", body: "Human hearing spans roughly 20 Hz to 20,000 Hz (20 kHz), a range worth understanding when working with audio equipment specifications." },
    ],
    advantages: [
      "Covers hertz, kilohertz, megahertz, and gigahertz in one tool",
      "Uses standard, precise powers-of-1000 conversion factors",
      "Useful for electronics, computing, and wireless technology contexts",
      "Instant conversion between any two frequency units",
    ],
    commonMistakes: [
      "Confusing processor clock speed (GHz) with data transfer speed (which uses different units entirely)",
      "Not recognizing which frequency band a wireless device specification refers to (2.4 GHz vs 5 GHz Wi-Fi, for example)",
      "Mixing up frequency (cycles per second) with wavelength, which are inversely related but measured completely differently",
      "Assuming higher frequency always means better performance without considering the specific application context",
    ],
    useCases: [
      "Comparing computer processor or wireless device frequency specifications",
      "Audio equipment frequency range reference",
      "Electronics and engineering frequency unit conversions",
      "General technology specification comparisons",
    ],
    conclusion:
      "Frequency spans an enormous range from audible sound to wireless signals, and this converter bridges all of it for quick, accurate specification comparisons.",
  },
  "torque-converter": {
    intro:
      "Torque specifications for engines, tools, and fasteners appear in newton-meters internationally and pound-feet or pound-inches in the US — our Torque Converter translates between them.",
    howItWorks:
      "Every unit converts through a common base unit (newton-meters) using precise conversion factors, ensuring accuracy whether you're converting an engine's torque rating or a fastener's tightening specification.",
    examples: [
      { title: "Engine torque", body: "50 newton-meters converts to approximately 36.9 pound-feet, useful when comparing vehicle specifications listed in different regional unit conventions." },
      { title: "Fastener tightening specs", body: "Small fasteners are often specified in pound-inches rather than pound-feet, since the torque values involved are much smaller — this converter handles both scales accurately." },
    ],
    advantages: [
      "Covers newton-meters, pound-feet, and pound-inches in one tool",
      "Uses precise conversion factors for accurate mechanical specifications",
      "Essential for automotive, mechanical, and DIY torque specifications",
      "Instant, accurate results for any torque unit conversion",
    ],
    commonMistakes: [
      "Confusing pound-feet (larger torque values, like engine specs) with pound-inches (smaller torque values, like small fastener specs) — a 12x difference",
      "Using the wrong torque unit when setting a torque wrench, risking an under- or over-tightened fastener",
      "Not converting a manufacturer's specification correctly before applying it with tools calibrated in a different unit",
      "Assuming torque and horsepower are interchangeable, when they measure related but distinct mechanical properties",
    ],
    useCases: [
      "Converting engine or mechanical torque specifications between unit systems",
      "Setting a torque wrench correctly for a fastener specification listed in a different unit",
      "Automotive and mechanical engineering torque conversions",
      "DIY and repair projects involving manufacturer torque specifications",
    ],
    conclusion:
      "Getting torque units right matters for both correctly interpreting specifications and safely using tools like torque wrenches — a mismatched unit can mean a significantly over- or under-tightened fastener.",
  },
  "fuel-economy-converter": {
    intro:
      "Fuel economy is measured in miles per gallon in the US and liters per 100 kilometers in most of the rest of the world — and confusingly, these two units move in opposite directions (higher mpg is better, lower L/100km is better). Our Fuel Economy Converter translates between them.",
    howItWorks:
      "The calculator applies the standard conversion constant (235.215) that relates the two measurement systems, since mpg measures distance per unit of fuel while L/100km measures fuel per unit of distance — inverse relationships that this conversion handles correctly.",
    formula: "L/100km = 235.215 ÷ MPG (US)\nMPG (US) = 235.215 ÷ L/100km",
    examples: [
      { title: "US to metric", body: "30 mpg converts to approximately 7.84 L/100km — useful when comparing a US vehicle's fuel economy rating against international specifications." },
      { title: "Understanding the inverse relationship", body: "A lower L/100km number means better fuel economy (using less fuel per distance), while a higher mpg number means better fuel economy — the two scales move in opposite directions, which is easy to misread at a glance." },
    ],
    advantages: [
      "Correctly handles the inverse relationship between mpg and L/100km",
      "Uses the precise standard conversion constant for accurate results",
      "Useful for comparing vehicle specifications across US and international markets",
      "Fast conversion in either direction",
    ],
    commonMistakes: [
      "Forgetting mpg and L/100km move in opposite directions — a common source of confusion when comparing vehicles",
      "Assuming US mpg and UK/Imperial mpg are the same, when they're based on different gallon sizes and produce different results",
      "Not double-checking which direction a specific comparison requires before drawing a conclusion",
      "Comparing fuel economy ratings across different testing standards (EPA vs. WLTP, for example) without accounting for methodology differences",
    ],
    useCases: [
      "Comparing vehicle fuel economy specifications between US and international markets",
      "Understanding a car's fuel efficiency when shopping internationally",
      "General automotive research and vehicle comparison",
      "Converting a specific known fuel economy figure between unit systems",
    ],
    conclusion:
      "The inverse relationship between mpg and L/100km trips up even careful readers — remember lower is better for L/100km, while higher is better for mpg, and this converter handles the math correctly either way.",
  },
  "clothing-size-converter": {
    intro:
      "Women's clothing sizes vary significantly between US, UK, and EU sizing systems, making international shopping confusing without a reliable conversion. Our Clothing Size Converter translates between all three.",
    howItWorks:
      "The calculator applies standard, widely referenced offset conversions between US women's sizing and its UK and EU equivalents, based on commonly used international size chart conventions.",
    examples: [
      { title: "US to UK/EU", body: "A US women's size 8 converts to approximately a UK size 12 and an EU size 40, reflecting the significant numbering differences between these systems." },
      { title: "Why offsets vary by brand", body: "Beyond the base system conversion, individual brands and even individual garments can run larger or smaller than the standard chart, making this conversion a helpful starting point rather than a guarantee." },
    ],
    advantages: [
      "Converts between US, UK, and EU women's sizing in one step",
      "Uses standard, widely referenced conversion offsets",
      "Useful for shopping from international clothing retailers",
      "Fast way to estimate size before ordering across sizing systems",
    ],
    commonMistakes: [
      "Treating the converted size as an exact guarantee of fit rather than a helpful approximation",
      "Not accounting for significant brand-to-brand and even style-to-style sizing variation within the same labeled size",
      "Confusing US and UK sizing, which can differ by 4 or more size numbers for the same actual garment size",
      "Ordering based solely on a converted number without checking a specific brand's own size chart when one is available",
    ],
    useCases: [
      "Converting clothing sizes when shopping from international retailers",
      "Understanding an unfamiliar sizing system before ordering",
      "General reference for US, UK, and EU women's clothing size relationships",
      "Comparing sizing across different countries' standard conventions",
    ],
    conclusion:
      "This gives a solid standard conversion across sizing systems — for the most accurate fit, always check the specific brand's own size chart when available, since actual sizing varies considerably by manufacturer and garment style.",
  },
};
