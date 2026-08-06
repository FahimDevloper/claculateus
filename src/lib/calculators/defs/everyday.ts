import { CalculatorDefinition } from "../types";
import { formatCurrency, formatNumber, formatInteger, num, str } from "@/lib/format";

const DAY_MS = 86400000;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseDate(s: unknown): Date | null {
  if (!s) return null;
  const d = new Date(String(s) + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

export const everydayCalculators: CalculatorDefinition[] = [
  {
    slug: "age",
    title: "Age Calculator",
    category: "everyday",
    popular: true,
    description: "Calculate your exact age in years, months and days from your date of birth.",
    keywords: ["age calculator", "how old am i"],
    fields: [{ id: "dob", label: "Date of Birth", type: "date", width: "full" }],
    compute: (v) => {
      const dob = parseDate(v.dob);
      if (!dob) return { items: [] };
      const today = new Date();
      let years = today.getFullYear() - dob.getFullYear();
      let months = today.getMonth() - dob.getMonth();
      let days = today.getDate() - dob.getDate();
      if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((today.getTime() - dob.getTime()) / DAY_MS);
      const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
      const daysToNext = Math.ceil((nextBirthday.getTime() - today.getTime()) / DAY_MS);
      return {
        items: [
          { label: "Your Age", value: `${years} years, ${months} months, ${days} days`, emphasis: true },
          { label: "Total Days Alive", value: formatInteger(totalDays) },
          { label: "Days Until Next Birthday", value: formatInteger(daysToNext) },
        ],
        table: {
          headers: ["Unit", "Value"],
          rows: [
            ["Years", formatInteger(years)],
            ["Months (total)", formatInteger(years * 12 + months)],
            ["Weeks (approx.)", formatInteger(Math.floor(totalDays / 7))],
            ["Days", formatInteger(totalDays)],
            ["Hours (approx.)", formatInteger(totalDays * 24)],
          ],
        },
      };
    },
    faqs: [
      { q: "How is age in months and days calculated?", a: "We count full years first, then full months since your last birthday, then the remaining days — the same way you'd count it by hand on a calendar." },
      { q: "Does this account for leap years?", a: "Yes — the calculation uses actual calendar dates, so leap years are automatically handled correctly." },
    ],
  },
  {
    slug: "date-difference",
    title: "Date Difference Calculator",
    shortTitle: "Days Between Dates",
    category: "everyday",
    popular: true,
    description: "Calculate the exact number of days, weeks and months between two dates.",
    keywords: ["date calculator", "days between dates"],
    fields: [
      { id: "start", label: "Start Date", type: "date", width: "half" },
      { id: "end", label: "End Date", type: "date", width: "half" },
    ],
    compute: (v) => {
      const start = parseDate(v.start), end = parseDate(v.end);
      if (!start || !end) return { items: [] };
      const days = Math.round((end.getTime() - start.getTime()) / DAY_MS);
      return {
        items: [
          { label: "Total Days", value: formatInteger(Math.abs(days)), emphasis: true },
          { label: "Weeks", value: formatNumber(Math.abs(days) / 7, 1) },
          { label: "Months (approx.)", value: formatNumber(Math.abs(days) / 30.44, 1) },
          { label: "Years (approx.)", value: formatNumber(Math.abs(days) / 365.25, 2) },
        ],
        chart: {
          type: "bar",
          labels: ["Weeks", "Months", "Years"],
          series: [{ name: "Approx. Count", data: [Math.abs(days) / 7, Math.abs(days) / 30.44, Math.abs(days) / 365.25], color: "primary" }],
        },
      };
    },
    faqs: [
      { q: "Are the month and year figures exact?", a: "Total days is exact. Months and years are approximations (using 30.44 and 365.25 days respectively) since calendar months and years vary in length." },
      { q: "Does the count include or exclude the start date?", a: "It's a pure difference between the two calendar dates — if you need an inclusive day count (counting both the start and end day), add 1 to the total." },
    ],
  },
  {
    slug: "date-add",
    title: "Add or Subtract Days Calculator",
    shortTitle: "Date Add/Subtract",
    category: "everyday",
    description: "Add or subtract days, weeks or months from a date.",
    keywords: ["date calculator", "add days to date"],
    fields: [
      { id: "start", label: "Start Date", type: "date", width: "half" },
      { id: "direction", label: "Direction", type: "select", defaultValue: "add", options: [{ value: "add", label: "Add" }, { value: "subtract", label: "Subtract" }], width: "half" },
      { id: "days", label: "Days", type: "number", defaultValue: 30, width: "half" },
    ],
    compute: (v) => {
      const start = parseDate(v.start);
      if (!start) return { items: [] };
      const delta = num(v.days) * (v.direction === "subtract" ? -1 : 1);
      const result = new Date(start.getTime() + delta * DAY_MS);
      return {
        items: [{ label: "Resulting Date", value: result.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }), emphasis: true }],
        table: {
          headers: ["Date", "Days from Start"],
          rows: [["Start Date", start.toLocaleDateString("en-US")], [v.direction === "subtract" ? `-${num(v.days)} days` : `+${num(v.days)} days`, result.toLocaleDateString("en-US")]],
        },
      };
    },
    faqs: [{ q: "Does this account for months and years, not just days?", a: "This calculator works purely in days — for adding months or years directly, multiply roughly by 30 or 365, or use the Days Between Dates calculator to check your target range." }],
  },
  {
    slug: "day-of-week",
    title: "Day of the Week Calculator",
    category: "everyday",
    description: "Find out what day of the week any date falls on.",
    keywords: ["day of the week calculator"],
    fields: [{ id: "date", label: "Date", type: "date", width: "full" }],
    compute: (v) => {
      const d = parseDate(v.date);
      if (!d) return { items: [] };
      return {
        items: [{ label: "Day of the Week", value: DAYS[d.getDay()], emphasis: true }],
        table: {
          headers: ["Date", "Day"],
          rows: [-2, -1, 0, 1, 2].map((offset) => {
            const dd = new Date(d.getTime() + offset * DAY_MS);
            return [dd.toLocaleDateString("en-US"), DAYS[dd.getDay()]];
          }),
        },
      };
    },
    faqs: [{ q: "Can this tell me the day of the week for a date far in the past or future?", a: "Yes — it uses standard JavaScript date calculations based on the Gregorian calendar, which is accurate for any date within the browser's supported range, including dates decades or centuries away." }],
  },
  {
    slug: "day-counter",
    title: "Day of the Year Counter",
    shortTitle: "Day Counter",
    category: "everyday",
    description: "Find which day number of the year a given date is, and how many days remain.",
    keywords: ["day counter", "day of the year"],
    fields: [{ id: "date", label: "Date", type: "date", width: "full" }],
    compute: (v) => {
      const d = parseDate(v.date);
      if (!d) return { items: [] };
      const start = new Date(d.getFullYear(), 0, 1);
      const dayOfYear = Math.floor((d.getTime() - start.getTime()) / DAY_MS) + 1;
      const isLeap = (d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) || d.getFullYear() % 400 === 0;
      const total = isLeap ? 366 : 365;
      return {
        items: [
          { label: "Day of the Year", value: `${dayOfYear} of ${total}`, emphasis: true },
          { label: "Days Remaining", value: formatInteger(total - dayOfYear) },
        ],
        chart: {
          type: "donut",
          labels: ["Days Elapsed", "Days Remaining"],
          series: [{ name: "Year Progress", data: [dayOfYear, total - dayOfYear] }],
        },
      };
    },
    faqs: [{ q: "Why does the total sometimes show 366 instead of 365?", a: "That happens in leap years, which add February 29th — the calculator automatically checks whether the entered year is a leap year to get the total right." }],
  },
  {
    slug: "countdown",
    title: "Countdown Calculator",
    category: "everyday",
    description: "Count down the days, hours and minutes to any future date and time.",
    keywords: ["countdown calculator", "days until"],
    fields: [{ id: "target", label: "Target Date", type: "date", width: "full" }],
    compute: (v) => {
      const target = parseDate(v.target);
      if (!target) return { items: [] };
      const now = new Date();
      const diffMs = target.getTime() - now.getTime();
      if (diffMs < 0) return { items: [{ label: "Status", value: "This date has already passed", emphasis: true }] };
      const days = Math.floor(diffMs / DAY_MS);
      const hours = Math.floor((diffMs % DAY_MS) / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      return {
        items: [
          { label: "Time Remaining", value: `${days} days, ${hours} hours`, emphasis: true },
          { label: "Total Hours", value: formatInteger(diffMs / 3600000) },
        ],
        table: {
          headers: ["Unit", "Remaining"],
          rows: [["Days", formatInteger(days)], ["Hours", formatInteger(hours)], ["Minutes", formatInteger(minutes)], ["Total Hours", formatInteger(diffMs / 3600000)], ["Total Minutes", formatInteger(diffMs / 60000)]],
        },
      };
    },
    faqs: [{ q: "Does this update automatically as time passes?", a: "The countdown is calculated at the moment you enter the date — reload the page or re-enter the date to refresh it with the current time remaining." }],
  },
  {
    slug: "time-duration",
    title: "Time Duration Calculator",
    category: "everyday",
    description: "Calculate the duration between two times of day.",
    keywords: ["time duration calculator", "hours between times"],
    fields: [
      { id: "start", label: "Start Time", type: "text", defaultValue: "09:00", placeholder: "HH:MM", width: "half" },
      { id: "end", label: "End Time", type: "text", defaultValue: "17:30", placeholder: "HH:MM", width: "half" },
    ],
    compute: (v) => {
      const parse = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + (m || 0); };
      let start = parse(str(v.start)), end = parse(str(v.end));
      if (isNaN(start) || isNaN(end)) return { items: [], error: "Enter valid times like 09:00" };
      let diff = end - start;
      if (diff < 0) diff += 24 * 60;
      return {
        items: [
          { label: "Duration", value: `${Math.floor(diff / 60)}h ${diff % 60}m`, emphasis: true },
          { label: "Total Minutes", value: formatInteger(diff) },
        ],
        chart: {
          type: "bar",
          labels: ["Start (min of day)", "End (min of day)", "Duration (min)"],
          series: [{ name: "Minutes", data: [start, end, diff], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What if my end time is earlier than my start time?", a: "The calculator assumes you mean the duration crosses midnight (e.g., 22:00 to 06:00 is treated as an 8-hour overnight span) rather than a negative duration." }],
  },
  {
    slug: "time-zone",
    title: "Time Zone Converter",
    category: "everyday",
    description: "Convert a time from one UTC offset to another.",
    keywords: ["time zone converter"],
    fields: [
      { id: "time", label: "Time", type: "text", defaultValue: "14:00", placeholder: "HH:MM", width: "third" },
      { id: "fromOffset", label: "From (UTC offset)", type: "number", defaultValue: -5, step: 0.5, width: "third" },
      { id: "toOffset", label: "To (UTC offset)", type: "number", defaultValue: 1, step: 0.5, width: "third" },
    ],
    compute: (v) => {
      const [h, m] = str(v.time).split(":").map(Number);
      if (isNaN(h)) return { items: [], error: "Enter a valid time like 14:00" };
      let totalMinutes = h * 60 + (m || 0) + (num(v.toOffset) - num(v.fromOffset)) * 60;
      let dayShift = 0;
      while (totalMinutes < 0) { totalMinutes += 1440; dayShift--; }
      while (totalMinutes >= 1440) { totalMinutes -= 1440; dayShift++; }
      const hh = Math.floor(totalMinutes / 60), mm = totalMinutes % 60;
      const baseMinutes = h * 60 + (m || 0);
      const rows = [-2, -1, 0, 1, 2].map((offsetDelta) => {
        const targetOffset = num(v.toOffset) + offsetDelta;
        let tm = baseMinutes + (targetOffset - num(v.fromOffset)) * 60;
        while (tm < 0) tm += 1440;
        while (tm >= 1440) tm -= 1440;
        return [`UTC${targetOffset >= 0 ? "+" : ""}${targetOffset}`, `${String(Math.floor(tm / 60)).padStart(2, "0")}:${String(Math.floor(tm % 60)).padStart(2, "0")}`];
      });
      return {
        items: [
          { label: "Converted Time", value: `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}${dayShift !== 0 ? (dayShift > 0 ? " (+1 day)" : " (-1 day)") : ""}`, emphasis: true },
        ],
        table: { headers: ["Offset", "Time"], rows },
      };
    },
    faqs: [{ q: "How do I find my UTC offset?", a: "It's the number of hours your local time differs from UTC (e.g., US Eastern is -5 in winter, -4 during daylight saving). A quick web search for \"[your city] UTC offset\" will give you the current value." }],
  },
  {
    slug: "work-hours",
    title: "Work Hours Calculator",
    category: "everyday",
    description: "Calculate total hours worked from clock-in and clock-out times, minus breaks.",
    keywords: ["work hours calculator", "timesheet calculator"],
    fields: [
      { id: "start", label: "Clock In", type: "text", defaultValue: "09:00", placeholder: "HH:MM", width: "third" },
      { id: "end", label: "Clock Out", type: "text", defaultValue: "17:30", placeholder: "HH:MM", width: "third" },
      { id: "breakMinutes", label: "Break", type: "number", unit: "min", defaultValue: 30, width: "third" },
      { id: "hourlyRate", label: "Hourly Rate (optional)", type: "number", unit: "$", defaultValue: 0, width: "half", advanced: true },
    ],
    compute: (v) => {
      const parse = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + (m || 0); };
      let diff = parse(str(v.end)) - parse(str(v.start)) - num(v.breakMinutes);
      if (diff < 0) diff += 24 * 60;
      const hours = diff / 60;
      const items = [
        { label: "Total Hours Worked", value: `${Math.floor(diff / 60)}h ${diff % 60}m`, emphasis: true },
        { label: "Decimal Hours", value: formatNumber(hours, 2) },
      ];
      if (num(v.hourlyRate) > 0) items.push({ label: "Pay for This Shift", value: formatCurrency(hours * num(v.hourlyRate)) });
      return {
        items,
        chart: {
          type: "donut",
          labels: ["Hours Worked", "Break"],
          series: [{ name: "Shift", data: [diff, num(v.breakMinutes)] }],
        },
      };
    },
    faqs: [{ q: "Does this handle overnight shifts that cross midnight?", a: "Yes — if your clock-out time is earlier than clock-in (like 22:00 to 06:00), the calculator automatically treats it as spanning into the next day." }],
  },
  {
    slug: "overtime",
    title: "Overtime Pay Calculator",
    category: "everyday",
    description: "Calculate total pay including overtime for hours worked beyond a standard week.",
    keywords: ["overtime calculator", "overtime pay calculator"],
    fields: [
      { id: "hourlyRate", label: "Regular Hourly Rate", type: "number", unit: "$", defaultValue: 22, width: "half" },
      { id: "hoursWorked", label: "Hours Worked This Week", type: "number", defaultValue: 46, width: "half" },
      { id: "standardHours", label: "Standard Hours", type: "number", defaultValue: 40, width: "half" },
      { id: "otMultiplier", label: "Overtime Multiplier", type: "number", defaultValue: 1.5, step: 0.1, width: "half", advanced: true },
    ],
    compute: (v) => {
      const regularHours = Math.min(num(v.hoursWorked), num(v.standardHours));
      const otHours = Math.max(num(v.hoursWorked) - num(v.standardHours), 0);
      const regularPay = regularHours * num(v.hourlyRate);
      const otPay = otHours * num(v.hourlyRate) * num(v.otMultiplier);
      return {
        items: [
          { label: "Total Pay", value: formatCurrency(regularPay + otPay), emphasis: true },
          { label: "Regular Pay", value: formatCurrency(regularPay) },
          { label: "Overtime Pay", value: formatCurrency(otPay) },
          { label: "Overtime Hours", value: formatNumber(otHours, 1) },
        ],
        chart: {
          type: "donut",
          labels: ["Regular Pay", "Overtime Pay"],
          series: [{ name: "Total Pay", data: [regularPay, otPay] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "Is time-and-a-half (1.5x) always the overtime rate?", a: "In the US, federal law (FLSA) requires at least 1.5x for non-exempt employees working over 40 hours/week, but some states or union contracts require higher rates — adjust the multiplier field to match your situation." }],
  },
  {
    slug: "time-card",
    title: "Weekly Time Card Calculator",
    shortTitle: "Time Card",
    category: "everyday",
    description: "Total up hours worked across a 5-day work week from daily clock in/out times.",
    keywords: ["time card calculator", "timesheet calculator"],
    fields: [
      { id: "mon", label: "Mon (in-out, e.g. 9:00-17:00)", type: "text", defaultValue: "9:00-17:00", width: "half" },
      { id: "tue", label: "Tue", type: "text", defaultValue: "9:00-17:00", width: "half" },
      { id: "wed", label: "Wed", type: "text", defaultValue: "9:00-17:00", width: "half" },
      { id: "thu", label: "Thu", type: "text", defaultValue: "9:00-17:00", width: "half" },
      { id: "fri", label: "Fri", type: "text", defaultValue: "9:00-16:00", width: "half" },
      { id: "hourlyRate", label: "Hourly Rate (optional)", type: "number", unit: "$", defaultValue: 0, width: "half", advanced: true },
    ],
    compute: (v) => {
      const parseRange = (s: string) => {
        const m = s.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
        if (!m) return 0;
        const start = Number(m[1]) * 60 + Number(m[2]);
        let end = Number(m[3]) * 60 + Number(m[4]);
        if (end < start) end += 1440;
        return end - start;
      };
      const days = ["mon", "tue", "wed", "thu", "fri"];
      const dailyMinutes = days.map((d) => parseRange(str(v[d])));
      const totalMinutes = dailyMinutes.reduce((sum, m) => sum + m, 0);
      const hours = totalMinutes / 60;
      const items = [
        { label: "Total Weekly Hours", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, emphasis: true },
        { label: "Decimal Hours", value: formatNumber(hours, 2) },
      ];
      if (num(v.hourlyRate) > 0) items.push({ label: "Weekly Pay", value: formatCurrency(hours * num(v.hourlyRate)) });
      return {
        items,
        chart: {
          type: "bar",
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          series: [{ name: "Hours", data: dailyMinutes.map((m) => Number((m / 60).toFixed(2))), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What format should I use for each day's hours?", a: "Enter clock-in and clock-out separated by a dash, like \"9:00-17:00\". Leave a day blank (or use the same time for in/out) if you didn't work that day." }],
  },
  {
    slug: "gpa",
    title: "GPA Calculator",
    category: "everyday",
    popular: true,
    description: "Calculate your grade point average from letter grades and credit hours.",
    keywords: ["gpa calculator"],
    presets: [
      { label: "Strong semester", values: { grades: "A, A-, A, B+, A", credits: "3, 4, 3, 3, 2" } },
      { label: "Mixed semester", values: { grades: "B+, C+, A-, B, C", credits: "3, 4, 3, 3, 2" } },
    ],
    fields: [
      { id: "grades", label: "Grades (comma separated)", type: "text", defaultValue: "A, B+, A-, B, C+", width: "full" },
      { id: "credits", label: "Credit Hours (matching order)", type: "text", defaultValue: "3, 4, 3, 3, 2", width: "full" },
    ],
    compute: (v) => {
      const scale: Record<string, number> = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, "D-": 0.7, F: 0 };
      const grades = str(v.grades).split(",").map((g) => g.trim().toUpperCase());
      const credits = str(v.credits).split(",").map((c) => parseFloat(c.trim()));
      if (grades.length !== credits.length || grades.length === 0) return { items: [], error: "Enter the same number of grades and credit hours." };
      let totalPoints = 0, totalCredits = 0;
      for (let i = 0; i < grades.length; i++) {
        const points = scale[grades[i]];
        if (points === undefined || isNaN(credits[i])) return { items: [], error: `Unrecognized grade "${grades[i]}" or credit value.` };
        totalPoints += points * credits[i];
        totalCredits += credits[i];
      }
      return {
        items: [
          { label: "GPA", value: formatNumber(totalPoints / totalCredits, 3), emphasis: true },
          { label: "Total Credit Hours", value: formatNumber(totalCredits, 1) },
        ],
        table: {
          headers: ["Grade", "Credits", "Grade Points"],
          rows: grades.map((g, i) => [g, formatNumber(credits[i], 1), formatNumber(scale[g] * credits[i], 2)]),
        },
      };
    },
    faqs: [
      { q: "What GPA scale does this use?", a: "The standard U.S. 4.0 scale (A = 4.0, A- = 3.7, B+ = 3.3, and so on down to F = 0), which is what most U.S. colleges and high schools use." },
      { q: "How do I calculate my cumulative GPA across multiple semesters?", a: "List every grade and its credit hours from all semesters together in the two fields — the calculator weights every course by its credit hours regardless of which semester it's from." },
    ],
  },
  {
    slug: "final-grade",
    title: "Final Grade Calculator",
    category: "everyday",
    description: "Calculate the score you need on your final exam to reach your target grade.",
    keywords: ["final grade calculator", "what do i need on my final"],
    fields: [
      { id: "currentGrade", label: "Current Grade", type: "number", unit: "%", defaultValue: 85, width: "third" },
      { id: "finalWeight", label: "Final Exam Weight", type: "number", unit: "%", defaultValue: 20, width: "third" },
      { id: "desiredGrade", label: "Desired Final Grade", type: "number", unit: "%", defaultValue: 90, width: "third" },
    ],
    compute: (v) => {
      const w = num(v.finalWeight) / 100;
      const needed = (num(v.desiredGrade) - num(v.currentGrade) * (1 - w)) / w;
      return {
        items: [
          { label: "Score Needed on Final", value: needed > 100 ? `${formatNumber(needed, 1)}% (not achievable)` : needed < 0 ? "0% (already achieved)" : `${formatNumber(needed, 1)}%`, emphasis: true },
        ],
        chart: {
          type: "bar",
          labels: ["Current Grade", "Desired Grade", "Needed on Final"],
          series: [{ name: "Percent", data: [num(v.currentGrade), num(v.desiredGrade), Math.max(0, Math.min(needed, 100))], color: "primary" }],
        },
      };
    },
    faqs: [{ q: "What does it mean if the score needed is over 100%?", a: "It means your desired final grade isn't mathematically possible given your current grade and the final's weight — even a perfect score on the final wouldn't get you there." }],
  },
  {
    slug: "grade",
    title: "Grade Calculator",
    category: "everyday",
    description: "Calculate your test or assignment grade as a percentage and letter grade.",
    keywords: ["grade calculator"],
    fields: [
      { id: "earned", label: "Points Earned", type: "number", defaultValue: 88, width: "half" },
      { id: "total", label: "Total Points Possible", type: "number", defaultValue: 100, width: "half" },
    ],
    compute: (v) => {
      const pct = (num(v.earned) / num(v.total)) * 100;
      const letter = pct >= 93 ? "A" : pct >= 90 ? "A-" : pct >= 87 ? "B+" : pct >= 83 ? "B" : pct >= 80 ? "B-" : pct >= 77 ? "C+" : pct >= 73 ? "C" : pct >= 70 ? "C-" : pct >= 60 ? "D" : "F";
      return {
        items: [{ label: "Percentage", value: `${formatNumber(pct, 1)}%`, emphasis: true }, { label: "Letter Grade", value: letter }],
        chart: { type: "donut", labels: ["Points Earned", "Points Missed"], series: [{ name: "Points", data: [num(v.earned), Math.max(num(v.total) - num(v.earned), 0)] }] },
      };
    },
    faqs: [{ q: "What letter grade scale does this use?", a: "A standard US scale where 93%+ is an A, 90-92% is A-, and so on down to below 60% being an F — though exact cutoffs vary by school, so check your syllabus for the official scale." }],
  },
  {
    slug: "tip",
    title: "Tip Calculator",
    category: "everyday",
    popular: true,
    description: "Calculate the tip amount and total bill, split evenly among any number of people.",
    keywords: ["tip calculator"],
    presets: [
      { label: "Solo, standard tip", values: { bill: 35, tipPercent: 18, people: 1 } },
      { label: "Group dinner", values: { bill: 180, tipPercent: 20, people: 4 } },
      { label: "Great service", values: { bill: 60, tipPercent: 25, people: 2 } },
    ],
    fields: [
      { id: "bill", label: "Bill Amount", type: "number", unit: "$", defaultValue: 85, width: "half" },
      { id: "tipPercent", label: "Tip", type: "number", unit: "%", defaultValue: 18, width: "half" },
      { id: "people", label: "Split Between", type: "number", defaultValue: 1, width: "half" },
    ],
    compute: (v) => {
      const tip = (num(v.bill) * num(v.tipPercent)) / 100;
      const total = num(v.bill) + tip;
      const people = Math.max(num(v.people), 1);
      return {
        items: [
          { label: "Total Per Person", value: formatCurrency(total / people), emphasis: true },
          { label: "Tip Amount", value: formatCurrency(tip) },
          { label: "Total Bill", value: formatCurrency(total) },
          { label: "Tip Per Person", value: formatCurrency(tip / people) },
        ],
        chart: { type: "donut", labels: ["Bill", "Tip"], series: [{ name: "Total", data: [num(v.bill), tip] }], valuePrefix: "$" },
      };
    },
    faqs: [
      { q: "What's a standard tip percentage in the US?", a: "15-20% is standard at restaurants, with 18-20% typical for good service. Some people tip on the pre-tax subtotal, others on the total after tax — this calculator uses the bill amount you enter as the base." },
    ],
  },
  {
    slug: "bill-split",
    title: "Bill Split Calculator",
    category: "everyday",
    description: "Split a restaurant bill evenly among a group, including tax and tip.",
    keywords: ["bill split calculator", "split the bill"],
    fields: [
      { id: "subtotal", label: "Subtotal", type: "number", unit: "$", defaultValue: 120, width: "half" },
      { id: "taxPercent", label: "Tax", type: "number", unit: "%", defaultValue: 8, width: "half" },
      { id: "tipPercent", label: "Tip", type: "number", unit: "%", defaultValue: 18, width: "half" },
      { id: "people", label: "Number of People", type: "number", defaultValue: 4, width: "half" },
    ],
    compute: (v) => {
      const total = num(v.subtotal) * (1 + num(v.taxPercent) / 100 + num(v.tipPercent) / 100);
      const people = Math.max(num(v.people), 1);
      return {
        items: [
          { label: "Each Person Pays", value: formatCurrency(total / people), emphasis: true },
          { label: "Total Bill", value: formatCurrency(total) },
        ],
        chart: {
          type: "donut",
          labels: ["Subtotal", "Tax", "Tip"],
          series: [{ name: "Total Bill", data: [num(v.subtotal), num(v.subtotal) * (num(v.taxPercent) / 100), num(v.subtotal) * (num(v.tipPercent) / 100)] }],
          valuePrefix: "$",
        },
      };
    },
    faqs: [{ q: "How is this different from the Tip Calculator?", a: "This one adds tax into the split as well as tip, so it's better suited to restaurant bills where sales tax is itemized separately from the pre-tax subtotal." }],
  },
  {
    slug: "discount",
    title: "Discount Calculator",
    category: "everyday",
    popular: true,
    description: "Calculate the sale price and savings after applying a percentage discount.",
    keywords: ["discount calculator", "percent off calculator"],
    presets: [
      { label: "Clearance (50% off)", values: { price: 80, discount: 50 } },
      { label: "Seasonal sale (25% off)", values: { price: 80, discount: 25 } },
      { label: "Small discount (10% off)", values: { price: 80, discount: 10 } },
    ],
    fields: [
      { id: "price", label: "Original Price", type: "number", unit: "$", defaultValue: 80, width: "half" },
      { id: "discount", label: "Discount", type: "number", unit: "%", defaultValue: 25, width: "half" },
    ],
    compute: (v) => {
      const savings = (num(v.price) * num(v.discount)) / 100;
      return {
        items: [
          { label: "Sale Price", value: formatCurrency(num(v.price) - savings), emphasis: true },
          { label: "You Save", value: formatCurrency(savings) },
        ],
        chart: { type: "donut", labels: ["Sale Price", "You Save"], series: [{ name: "Original Price", data: [num(v.price) - savings, savings] }], valuePrefix: "$" },
      };
    },
    faqs: [
      { q: "How do I calculate the original price from a sale price?", a: "Divide the sale price by (1 − discount/100). For example, a $60 item at 25% off means the original price was $60 / 0.75 = $80." },
    ],
  },
  {
    slug: "unit-price",
    title: "Unit Price Calculator",
    category: "everyday",
    description: "Compare two package sizes to find which gives you a better price per unit.",
    keywords: ["unit price calculator", "price per unit"],
    fields: [
      { id: "priceA", label: "Price A", type: "number", unit: "$", defaultValue: 4.99, width: "half" },
      { id: "quantityA", label: "Quantity A", type: "number", defaultValue: 12, width: "half" },
      { id: "priceB", label: "Price B", type: "number", unit: "$", defaultValue: 8.49, width: "half" },
      { id: "quantityB", label: "Quantity B", type: "number", defaultValue: 24, width: "half" },
    ],
    compute: (v) => {
      const unitA = num(v.priceA) / num(v.quantityA);
      const unitB = num(v.priceB) / num(v.quantityB);
      const better = unitA < unitB ? "A" : unitB < unitA ? "B" : "Equal";
      return {
        items: [
          { label: "Better Value", value: better === "Equal" ? "Both equal" : `Option ${better}`, emphasis: true },
          { label: "Unit Price A", value: `${formatCurrency(unitA, { decimals: 4 })}/unit` },
          { label: "Unit Price B", value: `${formatCurrency(unitB, { decimals: 4 })}/unit` },
        ],
        chart: { type: "bar", labels: ["Option A", "Option B"], series: [{ name: "Price per Unit", data: [unitA, unitB], color: "primary" }], valuePrefix: "$" },
      };
    },
    faqs: [{ q: "Do the quantities need to be in the same unit?", a: "Yes — compare ounces to ounces or count to count, not ounces to count, otherwise the per-unit price isn't a fair comparison between the two options." }],
  },
  {
    slug: "fuel-cost",
    title: "Fuel Cost Calculator",
    category: "everyday",
    description: "Calculate the fuel cost for a trip based on distance, fuel economy and gas price.",
    keywords: ["fuel cost calculator", "gas cost calculator"],
    fields: [
      { id: "distance", label: "Distance", type: "number", unit: "mi", defaultValue: 300, width: "third" },
      { id: "mpg", label: "Fuel Economy", type: "number", unit: "mpg", defaultValue: 28, width: "third" },
      { id: "pricePerGallon", label: "Price per Gallon", type: "number", unit: "$", defaultValue: 3.5, width: "third" },
    ],
    compute: (v) => {
      const gallons = num(v.distance) / num(v.mpg);
      return {
        items: [
          { label: "Total Fuel Cost", value: formatCurrency(gallons * num(v.pricePerGallon)), emphasis: true },
          { label: "Gallons Needed", value: formatNumber(gallons, 2) },
        ],
        table: {
          headers: ["Distance", "Fuel Cost"],
          rows: [0.5, 1, 2, 5].map((mult) => [`${formatNumber(num(v.distance) * mult, 0)} mi`, formatCurrency((num(v.distance) * mult / num(v.mpg)) * num(v.pricePerGallon))]),
        },
      };
    },
    faqs: [{ q: "Should I use my car's rated MPG or my actual average?", a: "Your actual observed MPG (calculated from a fill-up, e.g., with the Gas Mileage Calculator) is usually more accurate than the EPA-rated figure, since real-world driving conditions affect fuel economy." }],
  },
  {
    slug: "gas-mileage",
    title: "Gas Mileage / MPG Calculator",
    shortTitle: "MPG Calculator",
    category: "everyday",
    description: "Calculate your vehicle's fuel efficiency in miles per gallon.",
    keywords: ["gas mileage calculator", "mpg calculator"],
    fields: [
      { id: "miles", label: "Miles Driven", type: "number", defaultValue: 320, width: "half" },
      { id: "gallons", label: "Gallons Used", type: "number", defaultValue: 11.5, width: "half" },
    ],
    compute: (v) => ({
      items: [{ label: "Fuel Economy", value: `${formatNumber(num(v.miles) / num(v.gallons), 2)} mpg`, emphasis: true }],
      chart: { type: "bar", labels: ["Your Vehicle", "US Average (~25 mpg)"], series: [{ name: "MPG", data: [num(v.miles) / num(v.gallons), 25], color: "primary" }] },
    }),
    faqs: [{ q: "How do I get accurate numbers for this calculator?", a: "Fill your tank completely, reset your trip odometer, drive normally, then fill up again and note the miles driven and gallons it took to refill — that's your real-world MPG for that tank." }],
  },
  {
    slug: "trip-cost",
    title: "Trip Cost Calculator",
    category: "everyday",
    description: "Estimate total fuel cost for a road trip.",
    keywords: ["trip cost calculator", "road trip cost"],
    fields: [
      { id: "distance", label: "Round-Trip Distance", type: "number", unit: "mi", defaultValue: 600, width: "third" },
      { id: "mpg", label: "Fuel Economy", type: "number", unit: "mpg", defaultValue: 26, width: "third" },
      { id: "pricePerGallon", label: "Gas Price", type: "number", unit: "$/gal", defaultValue: 3.6, width: "third" },
    ],
    compute: (v) => ({
      items: [{ label: "Estimated Fuel Cost", value: formatCurrency((num(v.distance) / num(v.mpg)) * num(v.pricePerGallon)), emphasis: true }],
      table: {
        headers: ["Gas Price", "Trip Cost"],
        rows: [-0.5, -0.25, 0, 0.25, 0.5].map((delta) => {
          const price = Math.max(num(v.pricePerGallon) + delta, 0.1);
          return [`$${formatNumber(price, 2)}/gal`, formatCurrency((num(v.distance) / num(v.mpg)) * price)];
        }),
      },
    }),
    faqs: [{ q: "Does this include tolls or other trip expenses?", a: "No — this is fuel cost only. Budget separately for tolls, parking, food, and lodging when planning your total trip budget." }],
  },
  {
    slug: "speed-distance-time",
    title: "Speed, Distance & Time Calculator",
    shortTitle: "Speed/Distance/Time",
    category: "everyday",
    description: "Solve for speed, distance or time given the other two values.",
    keywords: ["speed distance time calculator"],
    fields: [
      { id: "solveFor", label: "Solve For", type: "select", defaultValue: "time", options: [
        { value: "speed", label: "Speed" }, { value: "distance", label: "Distance" }, { value: "time", label: "Time" },
      ], width: "full" },
      { id: "distance", label: "Distance", type: "number", unit: "mi", defaultValue: 120, width: "third" },
      { id: "speed", label: "Speed", type: "number", unit: "mph", defaultValue: 60, width: "third" },
      { id: "time", label: "Time", type: "number", unit: "hrs", defaultValue: 2, width: "third" },
    ],
    compute: (v) => {
      if (v.solveFor === "speed") {
        const speed = num(v.distance) / num(v.time);
        return {
          items: [{ label: "Speed", value: `${formatNumber(speed, 2)} mph`, emphasis: true }],
          table: { headers: ["Quantity", "Value"], rows: [["Distance", `${formatNumber(num(v.distance), 2)} mi`], ["Time", `${formatNumber(num(v.time), 2)} hrs`], ["Speed", `${formatNumber(speed, 2)} mph`]] },
        };
      }
      if (v.solveFor === "distance") {
        const distance = num(v.speed) * num(v.time);
        return {
          items: [{ label: "Distance", value: `${formatNumber(distance, 2)} mi`, emphasis: true }],
          table: { headers: ["Quantity", "Value"], rows: [["Speed", `${formatNumber(num(v.speed), 2)} mph`], ["Time", `${formatNumber(num(v.time), 2)} hrs`], ["Distance", `${formatNumber(distance, 2)} mi`]] },
        };
      }
      const time = num(v.distance) / num(v.speed);
      return {
        items: [{ label: "Time", value: `${formatNumber(time, 2)} hrs`, emphasis: true }],
        table: { headers: ["Quantity", "Value"], rows: [["Distance", `${formatNumber(num(v.distance), 2)} mi`], ["Speed", `${formatNumber(num(v.speed), 2)} mph`], ["Time", `${formatNumber(time, 2)} hrs`]] },
      };
    },
    faqs: [{ q: "What's the formula this is based on?", a: "The classic distance = speed × time relationship, rearranged depending on which variable you're solving for: speed = distance/time, or time = distance/speed." }],
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    category: "everyday",
    description: "Generate a strong, random password with customizable length and character sets.",
    keywords: ["password generator", "random password"],
    fields: [
      { id: "length", label: "Length", type: "number", defaultValue: 16, min: 4, max: 64, width: "half" },
      { id: "symbols", label: "Include Symbols", type: "checkbox", defaultValue: true, width: "half" },
      { id: "numbers", label: "Include Numbers", type: "checkbox", defaultValue: true, width: "half" },
      { id: "uppercase", label: "Include Uppercase", type: "checkbox", defaultValue: true, width: "half" },
    ],
    compute: (v) => {
      let chars = "abcdefghijklmnopqrstuvwxyz";
      if (v.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (v.numbers) chars += "0123456789";
      if (v.symbols) chars += "!@#$%^&*()_+-=[]{}";
      const length = Math.min(Math.max(Math.round(num(v.length)), 4), 64);
      let password = "";
      for (let i = 0; i < length; i++) password += chars[Math.floor(Math.random() * chars.length)];
      const poolLabels = ["Lowercase"];
      const poolSizes = [26];
      if (v.uppercase) { poolLabels.push("Uppercase"); poolSizes.push(26); }
      if (v.numbers) { poolLabels.push("Numbers"); poolSizes.push(10); }
      if (v.symbols) { poolLabels.push("Symbols"); poolSizes.push(18); }
      return {
        items: [{ label: "Generated Password", value: password, emphasis: true }],
        chart: { type: "donut", labels: poolLabels, series: [{ name: "Character Pool Size", data: poolSizes }] },
      };
    },
    faqs: [{ q: "Is this password generated securely?", a: "It uses your browser's Math.random(), which is fine for everyday password variety but isn't cryptographically secure. For highly sensitive accounts, consider a dedicated password manager with a cryptographically secure generator." }],
  },
  {
    slug: "random-name-picker",
    title: "Random Name Picker",
    category: "everyday",
    description: "Pick a random name from a list — great for raffles, team assignments and giveaways.",
    keywords: ["random name picker", "random picker"],
    fields: [{ id: "names", label: "Names (comma separated)", type: "text", defaultValue: "Alex, Sam, Jordan, Taylor, Casey", width: "full" }],
    compute: (v) => {
      const names = str(v.names).split(",").map((n) => n.trim()).filter(Boolean);
      if (names.length === 0) return { items: [], error: "Enter at least one name." };
      return {
        items: [{ label: "Selected Name", value: names[Math.floor(Math.random() * names.length)], emphasis: true }],
        table: { headers: ["Name", "Chance of Selection"], rows: names.map((n) => [n, `${formatNumber(100 / names.length, 1)}%`]) },
      };
    },
    faqs: [{ q: "Does every name have an equal chance of being picked?", a: "Yes — each name in your list has exactly the same probability of being selected, with no weighting or bias toward any particular entry." }],
  },
  {
    slug: "dice-roller",
    title: "Dice Roller",
    category: "everyday",
    description: "Roll any number of virtual dice with any number of sides.",
    keywords: ["dice roller", "roll dice online"],
    fields: [
      { id: "count", label: "Number of Dice", type: "number", defaultValue: 2, width: "half" },
      { id: "sides", label: "Sides per Die", type: "number", defaultValue: 6, width: "half" },
    ],
    compute: (v) => {
      const count = Math.min(Math.max(Math.round(num(v.count)), 1), 20);
      const sides = Math.max(Math.round(num(v.sides)), 2);
      const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
      return {
        items: [
          { label: "Rolls", value: rolls.join(", "), emphasis: true },
          { label: "Total", value: String(rolls.reduce((a, b) => a + b, 0)) },
        ],
        chart: { type: "bar", labels: rolls.map((_, i) => `Die ${i + 1}`), series: [{ name: "Result", data: rolls, color: "primary" }] },
      };
    },
    faqs: [{ q: "Can I simulate non-standard dice, like a d20?", a: "Yes — set \"Sides per Die\" to any number (20, 100, etc.) to simulate polyhedral or custom dice used in tabletop games." }],
  },
  {
    slug: "coin-flip",
    title: "Coin Flip Simulator",
    category: "everyday",
    description: "Flip one or more virtual coins and see the results.",
    keywords: ["coin flip", "flip a coin"],
    fields: [{ id: "count", label: "Number of Flips", type: "number", defaultValue: 1, width: "full" }],
    compute: (v) => {
      const count = Math.min(Math.max(Math.round(num(v.count)), 1), 100);
      const flips = Array.from({ length: count }, () => (Math.random() < 0.5 ? "H" : "T"));
      const heads = flips.filter((f) => f === "H").length;
      return {
        items: [
          { label: "Result", value: flips.join(", "), emphasis: true },
          { label: "Heads / Tails", value: `${heads} / ${count - heads}` },
        ],
        chart: { type: "donut", labels: ["Heads", "Tails"], series: [{ name: "Flips", data: [heads, count - heads] }] },
      };
    },
    faqs: [{ q: "Why doesn't a large number of flips come out exactly 50/50?", a: "Randomness naturally fluctuates in the short run — the ratio only converges close to 50/50 as the number of flips gets very large (the \"law of large numbers\"), so noticeable deviation over a few dozen or hundred flips is completely normal." }],
  },
  {
    slug: "lottery-odds",
    title: "Lottery Odds Calculator",
    category: "everyday",
    description: "Calculate your odds of winning a lottery based on the number pool and picks.",
    keywords: ["lottery odds calculator"],
    fields: [
      { id: "pool", label: "Total Numbers in Pool", type: "number", defaultValue: 69, width: "half" },
      { id: "picks", label: "Numbers You Pick", type: "number", defaultValue: 5, width: "half" },
    ],
    compute: (v) => {
      const n = Math.round(num(v.pool)), r = Math.round(num(v.picks));
      let combos = 1;
      for (let i = 0; i < r; i++) combos = (combos * (n - i)) / (i + 1);
      combos = Math.round(combos);
      function combosFor(rr: number) {
        let c = 1;
        for (let i = 0; i < rr; i++) c = (c * (n - i)) / (i + 1);
        return Math.round(c);
      }
      return {
        items: [
          { label: "Odds of Winning", value: `1 in ${combos.toLocaleString("en-US")}`, emphasis: true },
        ],
        table: {
          headers: ["Numbers Picked", "Odds"],
          rows: [r - 1, r, r + 1].filter((rr) => rr >= 1 && rr <= n).map((rr) => [rr, `1 in ${combosFor(rr).toLocaleString("en-US")}`]),
        },
      };
    },
    faqs: [{ q: "Does the order I pick numbers matter?", a: "No — this calculator assumes standard lottery rules where only the set of numbers matters, not the order drawn, which is why it uses combinations (nCr) rather than permutations." }],
  },
  {
    slug: "word-counter",
    title: "Word & Character Counter",
    shortTitle: "Word Counter",
    category: "everyday",
    description: "Count the words, characters and sentences in any text.",
    keywords: ["word counter", "character counter"],
    fields: [{ id: "text", label: "Text", type: "text", defaultValue: "Type or paste your text here.", width: "full" }],
    compute: (v) => {
      const text = str(v.text);
      const words = text.trim().length ? text.trim().split(/\s+/).length : 0;
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
      const letters = (text.match(/[a-zA-Z]/g) || []).length;
      const spaces = (text.match(/\s/g) || []).length;
      const other = text.length - letters - spaces;
      return {
        items: [
          { label: "Words", value: formatInteger(words), emphasis: true },
          { label: "Characters (with spaces)", value: formatInteger(text.length) },
          { label: "Characters (no spaces)", value: formatInteger(text.replace(/\s/g, "").length) },
          { label: "Sentences", value: formatInteger(sentences) },
        ],
        chart: { type: "donut", labels: ["Letters", "Spaces", "Other"], series: [{ name: "Characters", data: [letters, spaces, Math.max(other, 0)] }] },
      };
    },
    faqs: [{ q: "How is a \"word\" counted?", a: "Any sequence of non-whitespace characters separated by spaces counts as a word — so hyphenated terms or numbers count as one word each, similar to how most word processors count." }],
  },
  {
    slug: "reading-time",
    title: "Reading Time Calculator",
    category: "everyday",
    description: "Estimate how long it will take to read a piece of text out loud or silently.",
    keywords: ["reading time calculator"],
    fields: [
      { id: "words", label: "Word Count", type: "number", defaultValue: 1500, width: "half" },
      { id: "wpm", label: "Reading Speed", type: "number", unit: "wpm", defaultValue: 200, width: "half" },
    ],
    compute: (v) => ({
      items: [{ label: "Estimated Reading Time", value: `${formatNumber(num(v.words) / num(v.wpm), 1)} min`, emphasis: true }],
      chart: {
        type: "bar",
        labels: ["Slow (150 wpm)", "Average (200 wpm)", "Fast (250 wpm)", "Your Speed"],
        series: [{ name: "Minutes", data: [num(v.words) / 150, num(v.words) / 200, num(v.words) / 250, num(v.words) / num(v.wpm)], color: "primary" }],
      },
    }),
    faqs: [{ q: "What's a typical reading speed?", a: "About 200-250 words per minute is average for adult silent reading in English. Speaking/reading aloud is usually slower, around 130-150 wpm." }],
  },
  {
    slug: "text-case",
    title: "Text Case Converter",
    category: "everyday",
    description: "Convert text to uppercase, lowercase, title case or sentence case.",
    keywords: ["text case converter", "capitalize text"],
    fields: [{ id: "text", label: "Text", type: "text", defaultValue: "the quick brown fox", width: "full" }],
    compute: (v) => {
      const text = str(v.text);
      const title = text.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
      const sentence = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      return {
        items: [
          { label: "UPPERCASE", value: text.toUpperCase(), emphasis: true },
          { label: "lowercase", value: text.toLowerCase() },
          { label: "Title Case", value: title },
          { label: "Sentence case", value: sentence },
        ],
        table: {
          headers: ["Case", "Character Count"],
          rows: [["UPPERCASE", formatInteger(text.length)], ["lowercase", formatInteger(text.length)], ["Title Case", formatInteger(title.length)], ["Sentence case", formatInteger(sentence.length)]],
        },
      };
    },
    faqs: [{ q: "What's the difference between Title Case and Sentence case?", a: "Title Case capitalizes the first letter of every word (common for headlines). Sentence case only capitalizes the first letter of the whole text, like a normal sentence." }],
  },
  {
    slug: "roman-numeral",
    title: "Roman Numeral Converter",
    category: "everyday",
    description: "Convert between numbers and Roman numerals.",
    keywords: ["roman numeral converter"],
    fields: [{ id: "number", label: "Number (1-3999)", type: "number", defaultValue: 1994, width: "full" }],
    compute: (v) => {
      const n = Math.round(num(v.number));
      if (n < 1 || n > 3999) return { items: [], error: "Enter a number between 1 and 3999." };
      const vals: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
      let remaining = n, result = "";
      const breakdown: (string | number)[][] = [];
      for (const [value, symbol] of vals) {
        let count = 0;
        while (remaining >= value) { result += symbol; remaining -= value; count++; }
        if (count > 0) breakdown.push([symbol, value, count]);
      }
      return {
        items: [{ label: "Roman Numeral", value: result, emphasis: true }],
        table: { headers: ["Symbol", "Value", "Count"], rows: breakdown },
      };
    },
    faqs: [{ q: "Why can't I convert numbers above 3999?", a: "Standard Roman numerals don't have a symbol beyond M (1000), so the largest cleanly representable number using basic notation is 3999 (MMMCMXCIX). Larger numbers require special overline notation not covered here." }],
  },
  {
    slug: "leap-year",
    title: "Leap Year Checker",
    category: "everyday",
    description: "Check whether a given year is a leap year.",
    keywords: ["leap year checker", "is it a leap year"],
    fields: [{ id: "year", label: "Year", type: "number", defaultValue: 2028, width: "full" }],
    compute: (v) => {
      const year = Math.round(num(v.year));
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return {
        items: [{ label: "Result", value: isLeap ? `${year} is a leap year` : `${year} is not a leap year`, emphasis: true }],
        table: {
          headers: ["Year", "Leap Year?"],
          rows: [-2, -1, 0, 1, 2].map((offset) => {
            const y = year + offset;
            return [y, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? "Yes" : "No"];
          }),
        },
      };
    },
    faqs: [{ q: "What's the actual leap year rule?", a: "A year is a leap year if it's divisible by 4, EXCEPT century years (divisible by 100) unless they're also divisible by 400. That's why 2000 was a leap year but 1900 wasn't." }],
  },
  {
    slug: "shoe-size",
    title: "Shoe Size Converter",
    category: "everyday",
    description: "Convert shoe sizes between US, UK and EU sizing.",
    keywords: ["shoe size converter", "shoe size chart"],
    fields: [
      { id: "usSize", label: "US Size (Men's)", type: "number", defaultValue: 10, step: 0.5, width: "full" },
    ],
    compute: (v) => {
      const us = num(v.usSize);
      return {
        items: [
          { label: "UK Size", value: formatNumber(us - 0.5, 1), emphasis: true },
          { label: "EU Size", value: formatNumber(us + 33, 1) },
          { label: "CM", value: formatNumber(us * 0.847 + 17.6, 1) },
        ],
        note: "Approximate conversion for men's sizing; brands vary.",
        table: {
          headers: ["US", "UK", "EU", "CM"],
          rows: [us - 1, us - 0.5, us, us + 0.5, us + 1].map((size) => [formatNumber(size, 1), formatNumber(size - 0.5, 1), formatNumber(size + 33, 1), formatNumber(size * 0.847 + 17.6, 1)]),
        },
      };
    },
    faqs: [{ q: "Does this work for women's shoe sizes too?", a: "This calculator uses men's sizing conversions. Women's US sizes typically run about 1.5 sizes larger than the equivalent men's size in UK sizing — check a brand-specific chart for precise women's conversions." }],
  },
  {
    slug: "concrete",
    title: "Concrete Calculator",
    category: "everyday",
    description: "Calculate how much concrete you need for a slab in cubic yards and 80lb bags.",
    keywords: ["concrete calculator"],
    fields: [
      { id: "length", label: "Length", type: "number", unit: "ft", defaultValue: 10, width: "third" },
      { id: "width", label: "Width", type: "number", unit: "ft", defaultValue: 10, width: "third" },
      { id: "depth", label: "Depth", type: "number", unit: "in", defaultValue: 4, width: "third" },
    ],
    compute: (v) => {
      const cubicFeet = num(v.length) * num(v.width) * (num(v.depth) / 12);
      const cubicYards = cubicFeet / 27;
      const bags80lb = cubicFeet / 0.6;
      return {
        items: [
          { label: "Concrete Needed", value: `${formatNumber(cubicYards, 2)} yd³`, emphasis: true },
          { label: "80lb Bags Needed", value: formatInteger(Math.ceil(bags80lb)) },
        ],
        table: {
          headers: ["Depth", "Cubic Yards", "80lb Bags"],
          rows: [2, 4, 6, 8].map((d) => {
            const cf = num(v.length) * num(v.width) * (d / 12);
            return [`${d} in`, formatNumber(cf / 27, 2), formatInteger(Math.ceil(cf / 0.6))];
          }),
        },
      };
    },
    faqs: [{ q: "Should I order extra concrete beyond the calculated amount?", a: "Yes — most contractors add 5-10% extra to account for spillage, uneven subgrade, and forming losses. This calculator gives the theoretical minimum, not a buffer." }],
  },
  {
    slug: "paint",
    title: "Paint Calculator",
    category: "everyday",
    description: "Calculate how many gallons of paint you need for a room.",
    keywords: ["paint calculator"],
    fields: [
      { id: "wallArea", label: "Total Wall Area", type: "number", unit: "sq ft", defaultValue: 400, width: "half" },
      { id: "coats", label: "Number of Coats", type: "number", defaultValue: 2, width: "half" },
      { id: "coverage", label: "Coverage per Gallon", type: "number", unit: "sq ft", defaultValue: 350, width: "half", advanced: true },
    ],
    compute: (v) => {
      const gallons = (num(v.wallArea) * num(v.coats)) / num(v.coverage);
      return {
        items: [{ label: "Gallons Needed", value: formatNumber(gallons, 2), emphasis: true }],
        chart: {
          type: "bar",
          labels: ["1 Coat", "2 Coats", "3 Coats"],
          series: [{ name: "Gallons", data: [1, 2, 3].map((c) => Number(((num(v.wallArea) * c) / num(v.coverage)).toFixed(2))), color: "primary" }],
        },
      };
    },
    faqs: [{ q: "Why do I need 2 coats for most paint jobs?", a: "A single coat often shows brush marks, roller texture, or the underlying color/primer through thin spots — two coats give more even coverage and truer color, especially over a darker existing wall color." }],
  },
  {
    slug: "mulch",
    title: "Mulch & Soil Calculator",
    category: "everyday",
    description: "Calculate how many cubic yards of mulch or soil you need for a garden bed.",
    keywords: ["mulch calculator", "soil calculator"],
    fields: [
      { id: "length", label: "Length", type: "number", unit: "ft", defaultValue: 20, width: "third" },
      { id: "width", label: "Width", type: "number", unit: "ft", defaultValue: 10, width: "third" },
      { id: "depth", label: "Depth", type: "number", unit: "in", defaultValue: 3, width: "third" },
    ],
    compute: (v) => {
      const cubicFeet = num(v.length) * num(v.width) * (num(v.depth) / 12);
      return {
        items: [{ label: "Volume Needed", value: `${formatNumber(cubicFeet / 27, 2)} yd³`, emphasis: true }, { label: "Cubic Feet", value: formatNumber(cubicFeet, 1) }],
        table: {
          headers: ["Depth", "Cubic Yards"],
          rows: [2, 3, 4, 6].map((d) => [`${d} in`, formatNumber((num(v.length) * num(v.width) * (d / 12)) / 27, 2)]),
        },
      };
    },
    faqs: [{ q: "How deep should I apply mulch?", a: "2-4 inches is typical for most garden beds — deep enough to suppress weeds and retain moisture, but not so deep it smothers plant roots or promotes rot against stems." }],
  },
  {
    slug: "tile",
    title: "Tile Calculator",
    category: "everyday",
    description: "Calculate how many tiles you need to cover a floor or wall, including waste.",
    keywords: ["tile calculator"],
    fields: [
      { id: "areaLength", label: "Room Length", type: "number", unit: "ft", defaultValue: 12, width: "third" },
      { id: "areaWidth", label: "Room Width", type: "number", unit: "ft", defaultValue: 10, width: "third" },
      { id: "tileSize", label: "Tile Size", type: "number", unit: "sq in", defaultValue: 144, width: "third" },
      { id: "waste", label: "Waste Allowance", type: "number", unit: "%", defaultValue: 10, width: "half", advanced: true },
    ],
    compute: (v) => {
      const areaSqFt = num(v.areaLength) * num(v.areaWidth);
      const tileSqFt = num(v.tileSize) / 144;
      const tilesNeeded = (areaSqFt / tileSqFt) * (1 + num(v.waste) / 100);
      return {
        items: [
          { label: "Tiles Needed", value: formatInteger(Math.ceil(tilesNeeded)), emphasis: true },
          { label: "Total Area", value: `${formatNumber(areaSqFt, 1)} sq ft` },
        ],
        table: {
          headers: ["Waste Allowance", "Tiles Needed"],
          rows: [0, 5, 10, 15, 20].map((w) => [`${w}%`, formatInteger(Math.ceil((areaSqFt / tileSqFt) * (1 + w / 100)))]),
        },
      };
    },
    faqs: [{ q: "Why include a waste allowance?", a: "Cutting tiles to fit edges, corners, and around fixtures always produces some unusable offcuts, plus a few tiles may crack during installation — a 10% allowance is a common rule of thumb to avoid running short mid-job." }],
  },
  {
    slug: "zodiac-sign",
    title: "Zodiac Sign Calculator",
    category: "everyday",
    description: "Find your Western zodiac sign from your date of birth.",
    keywords: ["zodiac sign calculator", "star sign calculator"],
    fields: [{ id: "date", label: "Date of Birth", type: "date", width: "full" }],
    compute: (v) => {
      const d = parseDate(v.date);
      if (!d) return { items: [] };
      const month = d.getMonth() + 1, day = d.getDate();
      const signs: [number, number, string][] = [
        [1, 19, "Capricorn"], [2, 18, "Aquarius"], [3, 20, "Pisces"], [4, 19, "Aries"], [5, 20, "Taurus"], [6, 20, "Gemini"],
        [7, 22, "Cancer"], [8, 22, "Leo"], [9, 22, "Virgo"], [10, 22, "Libra"], [11, 21, "Scorpio"], [12, 21, "Sagittarius"], [12, 31, "Capricorn"],
      ];
      const sign = signs.find(([m, dd]) => month < m || (month === m && day <= dd));
      return {
        items: [{ label: "Zodiac Sign", value: sign ? sign[2] : "Capricorn", emphasis: true }],
        table: {
          headers: ["Sign", "Date Range"],
          rows: [
            ["Capricorn", "Dec 22 – Jan 19"], ["Aquarius", "Jan 20 – Feb 18"], ["Pisces", "Feb 19 – Mar 20"], ["Aries", "Mar 21 – Apr 19"],
            ["Taurus", "Apr 20 – May 20"], ["Gemini", "May 21 – Jun 20"], ["Cancer", "Jun 21 – Jul 22"], ["Leo", "Jul 23 – Aug 22"],
            ["Virgo", "Aug 23 – Sep 22"], ["Libra", "Sep 23 – Oct 22"], ["Scorpio", "Oct 23 – Nov 21"], ["Sagittarius", "Nov 22 – Dec 21"],
          ],
        },
      };
    },
    faqs: [{ q: "Does this use tropical or sidereal astrology?", a: "This uses the tropical Western zodiac (the standard system used in most newspapers and apps), based on fixed calendar date ranges rather than actual current star positions." }],
  },
  {
    slug: "pace-converter",
    title: "Pace Converter",
    category: "everyday",
    description: "Convert running pace between minutes per mile and minutes per kilometer.",
    keywords: ["pace converter", "min per mile to min per km"],
    fields: [
      { id: "minutes", label: "Minutes", type: "number", defaultValue: 8, width: "third" },
      { id: "seconds", label: "Seconds", type: "number", defaultValue: 30, width: "third" },
      { id: "direction", label: "Convert", type: "select", defaultValue: "mile-to-km", options: [
        { value: "mile-to-km", label: "Per Mile → Per KM" }, { value: "km-to-mile", label: "Per KM → Per Mile" },
      ], width: "third" },
    ],
    compute: (v) => {
      const totalSeconds = num(v.minutes) * 60 + num(v.seconds);
      const factor = v.direction === "mile-to-km" ? 1 / 1.60934 : 1.60934;
      const converted = totalSeconds * factor;
      const mm = Math.floor(converted / 60), ss = Math.round(converted % 60);
      const fmt = (secs: number) => `${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, "0")}`;
      return {
        items: [{ label: "Converted Pace", value: `${mm}:${String(ss).padStart(2, "0")}`, emphasis: true }],
        table: {
          headers: v.direction === "mile-to-km" ? ["Per Mile", "Per KM"] : ["Per KM", "Per Mile"],
          rows: [360, 420, 480, 540, 600].map((s) => [fmt(s), fmt(s * factor)]),
        },
      };
    },
    faqs: [{ q: "Why is pace per km faster-looking than pace per mile?", a: "A kilometer is shorter than a mile (0.621 mi), so it takes less time to cover — the same running speed always produces a smaller \"minutes per km\" number than \"minutes per mile.\"" }],
  },
  {
    slug: "number-to-words",
    title: "Number to Words Converter",
    category: "everyday",
    description: "Convert a number into its written English words form.",
    keywords: ["number to words converter", "spell out number"],
    fields: [{ id: "number", label: "Number", type: "number", defaultValue: 1234, width: "full" }],
    compute: (v) => {
      const n = Math.round(num(v.number));
      if (n < 0 || n > 999999999) return { items: [], error: "Enter a number between 0 and 999,999,999." };
      const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
      const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
      function threeDigits(num3: number): string {
        let s = "";
        if (num3 >= 100) { s += ones[Math.floor(num3 / 100)] + " hundred "; num3 %= 100; }
        if (num3 >= 20) { s += tens[Math.floor(num3 / 10)] + " "; num3 %= 10; }
        if (num3 > 0) s += ones[num3] + " ";
        return s.trim();
      }
      if (n === 0) return { items: [{ label: "In Words", value: "zero", emphasis: true }] };
      const groups = [[1000000000, "billion"], [1000000, "million"], [1000, "thousand"], [1, "ones"]] as const;
      let remaining = n, words = "";
      const breakdown: (string | number)[][] = [];
      for (const [value, label] of groups) {
        if (remaining >= value) {
          const count = Math.floor(remaining / value);
          words += threeDigits(count) + (label !== "ones" ? ` ${label} ` : " ");
          breakdown.push([label === "ones" ? "Ones" : label.charAt(0).toUpperCase() + label.slice(1), count]);
          remaining %= value;
        }
      }
      return {
        items: [{ label: "In Words", value: words.trim().replace(/\s+/g, " "), emphasis: true }],
        table: { headers: ["Group", "Value"], rows: breakdown },
      };
    },
    faqs: [{ q: "Can this spell out decimals or negative numbers?", a: "No — this converts whole non-negative numbers up to 999,999,999. For decimals or negatives, you'd need to spell those parts out manually (e.g., \"negative\" or \"point\")." }],
  },
];
