export interface SeoExample {
  title: string;
  body: string;
}

export interface SeoContent {
  intro: string;
  howItWorks: string;
  formula?: string;
  /** Deeper walkthrough of the math for a manual, by-hand calculation. */
  methodology?: string;
  /** Numbered steps for calculating this by hand, without the tool. */
  stepByStep?: string[];
  /** Situations where the standard formula needs adjusting or breaks down. */
  edgeCases?: string[];
  examples: SeoExample[];
  advantages: string[];
  commonMistakes: string[];
  useCases: string[];
  conclusion: string;
}
