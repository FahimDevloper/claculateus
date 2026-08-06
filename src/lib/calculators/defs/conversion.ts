import { CalculatorDefinition, FaqItem } from "../types";
import { formatNumber, num, str } from "@/lib/format";
import { unitCategories, convertUnit, convertTemperature } from "@/lib/units";

function makeConverter(opts: {
  slug: string;
  title: string;
  category: keyof typeof unitCategories;
  description: string;
  keywords: string[];
  defaultFrom: string;
  defaultTo: string;
  defaultValue?: number;
  popular?: boolean;
  faqs?: FaqItem[];
}): CalculatorDefinition {
  const cat = unitCategories[opts.category];
  return {
    slug: opts.slug,
    title: opts.title,
    category: "conversion",
    popular: opts.popular,
    description: opts.description,
    keywords: opts.keywords,
    faqs: opts.faqs,
    fields: [
      { id: "value", label: "Value", type: "number", defaultValue: opts.defaultValue ?? 1, width: "full" },
      { id: "from", label: "From", type: "select", defaultValue: opts.defaultFrom, options: cat.units, width: "half" },
      { id: "to", label: "To", type: "select", defaultValue: opts.defaultTo, options: cat.units, width: "half" },
    ],
    compute: (v) => {
      const result = convertUnit(opts.category, num(v.value), str(v.from), str(v.to));
      const toLabel = cat.units.find((u) => u.value === v.to)?.label ?? "";
      const fromLabel = cat.units.find((u) => u.value === v.from)?.label ?? "";
      return {
        items: [{ label: toLabel, value: formatNumber(result, 6), emphasis: true }],
        table: {
          headers: [fromLabel, toLabel],
          rows: [1, 5, 10, 25, 50, 100].map((mult) => [formatNumber(mult, 2), formatNumber(convertUnit(opts.category, mult, str(v.from), str(v.to)), 4)]),
        },
      };
    },
  };
}

export const conversionCalculators: CalculatorDefinition[] = [
  makeConverter({
    slug: "length-converter", title: "Length Converter", category: "length", popular: true,
    description: "Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards and miles.",
    keywords: ["length converter", "cm to inches", "feet to meters"],
    defaultFrom: "ft", defaultTo: "m", defaultValue: 6,
    faqs: [{ q: "How many centimeters are in an inch?", a: "1 inch = 2.54 centimeters exactly — this is the internationally defined conversion factor used throughout this calculator." }],
  }),
  makeConverter({
    slug: "weight-converter", title: "Weight Converter", category: "weight", popular: true,
    description: "Convert between milligrams, grams, kilograms, ounces, pounds and stone.",
    keywords: ["weight converter", "kg to lb", "pounds to kilograms"],
    defaultFrom: "lb", defaultTo: "kg", defaultValue: 160,
    faqs: [{ q: "How many pounds are in a kilogram?", a: "1 kilogram = 2.20462 pounds. To convert kg to lb, multiply by 2.20462; to go the other way, divide by 2.20462." }],
  }),
  {
    slug: "temperature-converter",
    title: "Temperature Converter",
    category: "conversion",
    popular: true,
    description: "Convert temperatures between Celsius, Fahrenheit and Kelvin.",
    keywords: ["temperature converter", "celsius to fahrenheit", "fahrenheit to celsius"],
    fields: [
      { id: "value", label: "Value", type: "number", defaultValue: 100, width: "full" },
      { id: "from", label: "From", type: "select", defaultValue: "c", options: [{ value: "c", label: "Celsius (°C)" }, { value: "f", label: "Fahrenheit (°F)" }, { value: "k", label: "Kelvin (K)" }], width: "half" },
      { id: "to", label: "To", type: "select", defaultValue: "f", options: [{ value: "c", label: "Celsius (°C)" }, { value: "f", label: "Fahrenheit (°F)" }, { value: "k", label: "Kelvin (K)" }], width: "half" },
    ],
    compute: (v) => {
      const result = convertTemperature(num(v.value), str(v.from), str(v.to));
      return {
        items: [{ label: "Converted Temperature", value: formatNumber(result, 2), emphasis: true }],
        table: {
          headers: ["From", "To"],
          rows: [-40, 0, 20, 37, 100].map((t) => [formatNumber(t, 0), formatNumber(convertTemperature(t, str(v.from), str(v.to)), 2)]),
        },
      };
    },
    faqs: [{ q: "What's the formula to convert Celsius to Fahrenheit?", a: "°F = (°C × 9/5) + 32. To go the other way: °C = (°F − 32) × 5/9." }],
  },
  makeConverter({
    slug: "volume-converter", title: "Volume Converter", category: "volume", popular: true,
    description: "Convert between milliliters, liters, teaspoons, tablespoons, cups, pints, quarts and gallons.",
    keywords: ["volume converter", "cups to ml", "gallons to liters"],
    faqs: [{ q: "How many milliliters are in a cup?", a: "1 US cup = 236.588 milliliters. Note that a UK/imperial cup is a slightly different size — this calculator uses US customary units." }],
    defaultFrom: "cup", defaultTo: "ml", defaultValue: 2,
  }),
  makeConverter({
    slug: "speed-converter", title: "Speed Converter", category: "speed",
    description: "Convert between mph, km/h, m/s, knots and feet per second.",
    keywords: ["speed converter", "mph to kmh"],
    defaultFrom: "mph", defaultTo: "kmh", defaultValue: 60,
    faqs: [{ q: "How do I convert mph to km/h?", a: "Multiply mph by 1.60934 to get km/h. For a quick mental estimate, multiply by 1.6." }],
  }),
  makeConverter({
    slug: "area-converter", title: "Area Converter", category: "area",
    description: "Convert between square meters, square feet, acres, hectares and more.",
    keywords: ["area converter", "sq ft to sq m", "acres to hectares"],
    defaultFrom: "sqft", defaultTo: "sqm", defaultValue: 1000,
    faqs: [{ q: "How many square feet are in an acre?", a: "1 acre = 43,560 square feet — a common reference point for lot sizes and land measurements in the US." }],
  }),
  makeConverter({
    slug: "data-storage-converter", title: "Data Storage Converter", category: "dataStorage",
    description: "Convert between bits, bytes, kilobytes, megabytes, gigabytes and terabytes.",
    keywords: ["data storage converter", "mb to gb", "gb to tb"],
    defaultFrom: "gb", defaultTo: "mb", defaultValue: 4,
    faqs: [{ q: "Is 1 GB equal to 1000 MB or 1024 MB?", a: "This calculator uses the binary convention (1 GB = 1024 MB), which matches how operating systems typically report storage. Some manufacturers use the decimal convention (1 GB = 1000 MB) instead, which is why a \"1TB\" drive often shows less than 1TB in your OS." }],
  }),
  makeConverter({
    slug: "pressure-converter", title: "Pressure Converter", category: "pressure",
    description: "Convert between pascals, bar, PSI, atmospheres and mmHg.",
    keywords: ["pressure converter", "psi to bar"],
    defaultFrom: "psi", defaultTo: "bar", defaultValue: 32,
    faqs: [{ q: "How many PSI is one bar?", a: "1 bar ≈ 14.5038 PSI. Standard atmospheric pressure at sea level is about 1.01325 bar, or roughly 14.7 PSI." }],
  }),
  makeConverter({
    slug: "energy-converter", title: "Energy Converter", category: "energy",
    description: "Convert between joules, calories, kilocalories, watt-hours and BTU.",
    keywords: ["energy converter", "calories to joules", "kwh to btu"],
    defaultFrom: "kcal", defaultTo: "kj", defaultValue: 500,
    faqs: [{ q: "Is a food \"calorie\" the same as a scientific calorie?", a: "No — a food Calorie (capital C) is actually a kilocalorie (1000 small calories). This calculator's \"kcal\" unit is what's printed on nutrition labels." }],
  }),
  makeConverter({
    slug: "power-converter", title: "Power Converter", category: "power",
    description: "Convert between watts, kilowatts, horsepower and BTU per hour.",
    keywords: ["power converter", "hp to kw", "watts to horsepower"],
    defaultFrom: "hp", defaultTo: "kw", defaultValue: 150,
    faqs: [{ q: "How many kilowatts is one horsepower?", a: "1 mechanical horsepower ≈ 0.7457 kilowatts. This is the conversion commonly used for car and engine specifications." }],
  }),
  makeConverter({
    slug: "angle-converter", title: "Angle Converter", category: "angle",
    description: "Convert between degrees, radians and gradians.",
    keywords: ["angle converter", "degrees to radians"],
    defaultFrom: "deg", defaultTo: "rad", defaultValue: 90,
    faqs: [{ q: "How do I convert degrees to radians?", a: "Multiply degrees by π/180. A full circle is 360° or 2π radians, so 90° equals π/2 radians." }],
  }),
  makeConverter({
    slug: "time-converter", title: "Time Converter", category: "time",
    description: "Convert between seconds, minutes, hours, days, weeks and years.",
    keywords: ["time converter", "days to hours"],
    defaultFrom: "day", defaultTo: "hr", defaultValue: 3,
    faqs: [{ q: "How many hours are in a year?", a: "A standard (non-leap) year has 8,760 hours (365 days × 24 hours). A leap year has 8,784." }],
  }),
  makeConverter({
    slug: "frequency-converter", title: "Frequency Converter", category: "frequency",
    description: "Convert between hertz, kilohertz, megahertz and gigahertz.",
    keywords: ["frequency converter", "hz to khz"],
    defaultFrom: "ghz", defaultTo: "mhz", defaultValue: 2.4,
    faqs: [{ q: "What does GHz mean for a CPU or Wi-Fi signal?", a: "Gigahertz measures cycles per second — 1 GHz = 1 billion cycles/second. A 2.4 GHz Wi-Fi band and a 2.4 GHz CPU clock both use the same unit, just measuring very different things (radio wave frequency vs. processor cycles)." }],
  }),
  makeConverter({
    slug: "torque-converter", title: "Torque Converter", category: "torque",
    description: "Convert between newton-meters, pound-feet and pound-inches.",
    keywords: ["torque converter", "nm to lb-ft"],
    defaultFrom: "nm", defaultTo: "lbft", defaultValue: 50,
    faqs: [{ q: "How do I convert newton-meters to pound-feet?", a: "Divide newton-meters by 1.3558 (or multiply by about 0.7376) to get pound-feet — a common conversion when comparing US and metric torque specs for engines and tools." }],
  }),
  {
    slug: "fuel-economy-converter",
    title: "Fuel Economy Converter",
    category: "conversion",
    description: "Convert fuel economy between miles per gallon (US) and liters per 100 km.",
    keywords: ["fuel economy converter", "mpg to l/100km"],
    fields: [
      { id: "value", label: "Value", type: "number", defaultValue: 30, width: "full" },
      { id: "direction", label: "Convert", type: "select", defaultValue: "mpg-to-l100km", options: [
        { value: "mpg-to-l100km", label: "MPG (US) → L/100km" }, { value: "l100km-to-mpg", label: "L/100km → MPG (US)" },
      ], width: "full" },
    ],
    compute: (v) => {
      const value = num(v.value);
      if (value === 0) return { items: [], error: "Value cannot be zero." };
      const result = v.direction === "mpg-to-l100km" ? 235.215 / value : 235.215 / value;
      return {
        items: [{ label: "Result", value: formatNumber(result, 2), emphasis: true }],
        table: {
          headers: v.direction === "mpg-to-l100km" ? ["MPG", "L/100km"] : ["L/100km", "MPG"],
          rows: [15, 20, 25, 30, 40, 50].map((x) => [formatNumber(x, 0), formatNumber(235.215 / x, 2)]),
        },
      };
    },
    faqs: [{ q: "Why is the MPG-to-L/100km formula the same both directions?", a: "MPG and L/100km are both inversely related to distance-per-fuel, so the same 235.215 constant divided by the value converts either direction — it's a reciprocal relationship, not a linear one." }],
  },
  {
    slug: "clothing-size-converter",
    title: "Clothing Size Converter",
    category: "conversion",
    description: "Convert women's clothing sizes between US, UK and EU sizing.",
    keywords: ["clothing size converter", "size chart"],
    fields: [{ id: "usSize", label: "US Size (Women's)", type: "number", defaultValue: 8, width: "full" }],
    compute: (v) => {
      const us = num(v.usSize);
      return {
        items: [
          { label: "UK Size", value: formatNumber(us + 4, 0), emphasis: true },
          { label: "EU Size", value: formatNumber(us + 32, 0) },
        ],
        note: "Approximate conversion; sizing varies by brand.",
        table: {
          headers: ["US", "UK", "EU"],
          rows: [us - 2, us - 1, us, us + 1, us + 2].map((size) => [formatNumber(size, 0), formatNumber(size + 4, 0), formatNumber(size + 32, 0)]),
        },
      };
    },
    faqs: [{ q: "Why do my UK/EU sizes not match what a store's size chart says?", a: "Clothing sizing isn't standardized between brands — this calculator gives the common offset (UK ≈ US + 4, EU ≈ US + 32), but always check the specific brand's own size chart when possible." }],
  },
];
