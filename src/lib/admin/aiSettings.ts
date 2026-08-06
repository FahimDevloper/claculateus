import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/app";
import { withTimeout } from "@/lib/firebase/withTimeout";

export type AiProvider = "openai" | "anthropic" | "gemini";

export interface AiSettings {
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  openaiModel: string;
  anthropicModel: string;
  geminiModel: string;
  defaultProvider: AiProvider;
}

// Providers regularly retire model names, so these are just starting defaults
// — override them in /admin/ai if a model ever comes back "404 not found".
export const DEFAULT_AI_SETTINGS: AiSettings = {
  openaiKey: "",
  anthropicKey: "",
  geminiKey: "",
  openaiModel: "gpt-4o-mini",
  anthropicModel: "claude-sonnet-5",
  geminiModel: "gemini-2.0-flash",
  defaultProvider: "openai",
};

const AI_SETTINGS_REF = doc(db, "ai_settings", "keys");

export async function getAiSettings(): Promise<AiSettings> {
  try {
    const snap = await withTimeout(getDoc(AI_SETTINGS_REF), 4000);
    if (!snap.exists()) return DEFAULT_AI_SETTINGS;
    return { ...DEFAULT_AI_SETTINGS, ...(snap.data() as Partial<AiSettings>) };
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export async function saveAiSettings(settings: AiSettings): Promise<void> {
  await withTimeout(setDoc(AI_SETTINGS_REF, settings, { merge: true }));
}

export function keyForProvider(settings: AiSettings, provider: AiProvider): string {
  if (provider === "openai") return settings.openaiKey;
  if (provider === "anthropic") return settings.anthropicKey;
  return settings.geminiKey;
}

export function modelForProvider(settings: AiSettings, provider: AiProvider): string {
  if (provider === "openai") return settings.openaiModel || DEFAULT_AI_SETTINGS.openaiModel;
  if (provider === "anthropic") return settings.anthropicModel || DEFAULT_AI_SETTINGS.anthropicModel;
  return settings.geminiModel || DEFAULT_AI_SETTINGS.geminiModel;
}

export const AI_PROVIDER_LABELS: Record<AiProvider, string> = {
  openai: "OpenAI (GPT)",
  anthropic: "Anthropic (Claude)",
  gemini: "Google (Gemini)",
};
