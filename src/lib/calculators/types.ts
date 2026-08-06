export type CategorySlug =
  | "financial"
  | "tax"
  | "health"
  | "math"
  | "everyday"
  | "conversion";

export interface CategoryMeta {
  slug: CategorySlug;
  title: string;
  tagline: string;
  description: string;
  icon: string;
}

export type FieldType =
  | "number"
  | "select"
  | "text"
  | "radio"
  | "date"
  | "checkbox";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  defaultValue?: number | string | boolean;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  placeholder?: string;
  help?: string;
  width?: "full" | "half" | "third";
  /** Hidden behind a "Show advanced options" toggle by default. */
  advanced?: boolean;
}

export type FieldValues = Record<string, number | string | boolean>;

export interface ResultItem {
  label: string;
  value: string;
  emphasis?: boolean;
  help?: string;
}

export interface ChartSeries {
  name: string;
  data: number[];
  color?: "primary" | "accent" | "accent2" | "warning" | "danger" | "success";
}

export interface ChartSpec {
  type: "line" | "bar" | "donut";
  labels: string[];
  series: ChartSeries[];
  valuePrefix?: string;
}

export interface ComputeResult {
  items: ResultItem[];
  note?: string;
  error?: string;
  table?: { headers: string[]; rows: (string | number)[][] };
  chart?: ChartSpec;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PresetDef {
  label: string;
  values: Partial<FieldValues>;
}

export interface CalculatorDefinition {
  slug: string;
  title: string;
  shortTitle?: string;
  category: CategorySlug;
  description: string;
  intro?: string;
  keywords?: string[];
  fields: FieldDef[];
  compute: (values: FieldValues) => ComputeResult;
  faqs?: FaqItem[];
  custom?: boolean;
  popular?: boolean;
  /** Optional quick-start scenarios that pre-fill field values. */
  presets?: PresetDef[];
}
