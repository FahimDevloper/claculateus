export interface SeoExample {
  title: string;
  body: string;
}

export interface SeoContent {
  intro: string;
  howItWorks: string;
  formula?: string;
  examples: SeoExample[];
  advantages: string[];
  commonMistakes: string[];
  useCases: string[];
  conclusion: string;
}
