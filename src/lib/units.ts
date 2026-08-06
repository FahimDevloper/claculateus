export interface UnitOption {
  value: string;
  label: string;
}

export interface UnitCategory {
  units: UnitOption[];
  factors: Record<string, number>; // multiply by factor to get base unit
}

export const unitCategories: Record<string, UnitCategory> = {
  length: {
    units: [
      { value: "mm", label: "Millimeters (mm)" }, { value: "cm", label: "Centimeters (cm)" }, { value: "m", label: "Meters (m)" }, { value: "km", label: "Kilometers (km)" },
      { value: "in", label: "Inches (in)" }, { value: "ft", label: "Feet (ft)" }, { value: "yd", label: "Yards (yd)" }, { value: "mi", label: "Miles (mi)" },
    ],
    factors: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 },
  },
  weight: {
    units: [
      { value: "mg", label: "Milligrams (mg)" }, { value: "g", label: "Grams (g)" }, { value: "kg", label: "Kilograms (kg)" }, { value: "tonne", label: "Metric Tons (t)" },
      { value: "oz", label: "Ounces (oz)" }, { value: "lb", label: "Pounds (lb)" }, { value: "st", label: "Stone (st)" },
    ],
    factors: { mg: 0.000001, g: 0.001, kg: 1, tonne: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029 },
  },
  volume: {
    units: [
      { value: "ml", label: "Milliliters (ml)" }, { value: "l", label: "Liters (L)" }, { value: "tsp", label: "Teaspoons" }, { value: "tbsp", label: "Tablespoons" },
      { value: "floz", label: "Fluid Ounces" }, { value: "cup", label: "Cups" }, { value: "pt", label: "Pints" }, { value: "qt", label: "Quarts" }, { value: "gal", label: "Gallons (US)" },
    ],
    factors: { ml: 0.001, l: 1, tsp: 0.00492892, tbsp: 0.0147868, floz: 0.0295735, cup: 0.24, pt: 0.473176, qt: 0.946353, gal: 3.78541 },
  },
  speed: {
    units: [
      { value: "mps", label: "Meters/sec" }, { value: "kmh", label: "Kilometers/hour" }, { value: "mph", label: "Miles/hour" }, { value: "knot", label: "Knots" }, { value: "fps", label: "Feet/sec" },
    ],
    factors: { mps: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444, fps: 0.3048 },
  },
  area: {
    units: [
      { value: "sqm", label: "Square Meters" }, { value: "sqft", label: "Square Feet" }, { value: "sqyd", label: "Square Yards" }, { value: "sqkm", label: "Square Kilometers" },
      { value: "sqmi", label: "Square Miles" }, { value: "acre", label: "Acres" }, { value: "hectare", label: "Hectares" },
    ],
    factors: { sqm: 1, sqft: 0.092903, sqyd: 0.836127, sqkm: 1000000, sqmi: 2589988.11, acre: 4046.86, hectare: 10000 },
  },
  dataStorage: {
    units: [
      { value: "bit", label: "Bits" }, { value: "byte", label: "Bytes" }, { value: "kb", label: "Kilobytes (KB)" }, { value: "mb", label: "Megabytes (MB)" },
      { value: "gb", label: "Gigabytes (GB)" }, { value: "tb", label: "Terabytes (TB)" },
    ],
    factors: { bit: 0.125, byte: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 },
  },
  pressure: {
    units: [
      { value: "pa", label: "Pascals (Pa)" }, { value: "kpa", label: "Kilopascals (kPa)" }, { value: "bar", label: "Bar" }, { value: "psi", label: "PSI" }, { value: "atm", label: "Atmospheres" }, { value: "mmhg", label: "mmHg" },
    ],
    factors: { pa: 1, kpa: 1000, bar: 100000, psi: 6894.76, atm: 101325, mmhg: 133.322 },
  },
  energy: {
    units: [
      { value: "j", label: "Joules (J)" }, { value: "kj", label: "Kilojoules (kJ)" }, { value: "cal", label: "Calories (cal)" }, { value: "kcal", label: "Kilocalories (kcal)" },
      { value: "wh", label: "Watt-hours (Wh)" }, { value: "kwh", label: "Kilowatt-hours (kWh)" }, { value: "btu", label: "BTU" },
    ],
    factors: { j: 1, kj: 1000, cal: 4.184, kcal: 4184, wh: 3600, kwh: 3600000, btu: 1055.06 },
  },
  power: {
    units: [
      { value: "w", label: "Watts (W)" }, { value: "kw", label: "Kilowatts (kW)" }, { value: "hp", label: "Horsepower (hp)" }, { value: "btuh", label: "BTU/hour" },
    ],
    factors: { w: 1, kw: 1000, hp: 745.7, btuh: 0.293071 },
  },
  angle: {
    units: [{ value: "deg", label: "Degrees" }, { value: "rad", label: "Radians" }, { value: "grad", label: "Gradians" }],
    factors: { deg: 1, rad: 57.29578, grad: 0.9 },
  },
  time: {
    units: [
      { value: "sec", label: "Seconds" }, { value: "min", label: "Minutes" }, { value: "hr", label: "Hours" }, { value: "day", label: "Days" }, { value: "week", label: "Weeks" }, { value: "year", label: "Years" },
    ],
    factors: { sec: 1, min: 60, hr: 3600, day: 86400, week: 604800, year: 31557600 },
  },
  frequency: {
    units: [{ value: "hz", label: "Hertz (Hz)" }, { value: "khz", label: "Kilohertz (kHz)" }, { value: "mhz", label: "Megahertz (MHz)" }, { value: "ghz", label: "Gigahertz (GHz)" }],
    factors: { hz: 1, khz: 1000, mhz: 1000000, ghz: 1000000000 },
  },
  torque: {
    units: [{ value: "nm", label: "Newton-meters (Nm)" }, { value: "lbft", label: "Pound-feet (lb·ft)" }, { value: "lbin", label: "Pound-inches (lb·in)" }],
    factors: { nm: 1, lbft: 1.35582, lbin: 0.112985 },
  },
};

export function convertUnit(category: string, value: number, from: string, to: string): number {
  const cat = unitCategories[category];
  if (!cat) return NaN;
  const base = value * cat.factors[from];
  return base / cat.factors[to];
}

export function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "c") celsius = value;
  else if (from === "f") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;

  if (to === "c") return celsius;
  if (to === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}
