import { AiProvider, AiSettings, keyForProvider, modelForProvider } from "./aiSettings";

export class AiGenerateError extends Error {}

// Runs entirely in the admin's own browser session using a key they entered
// themselves in /admin/ai — the same trust model as every other admin feature
// in this app (no server layer exists here; Firestore rules are the boundary).
// Usage and cost are billed to whichever provider account the key belongs to.

async function callOpenAi(key: string, model: string, system: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    }),
  });
  if (!res.ok) throw new AiGenerateError(`OpenAI error (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new AiGenerateError("OpenAI returned an unexpected response.");
  return text;
}

async function callAnthropic(key: string, model: string, system: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new AiGenerateError(`Anthropic error (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (typeof text !== "string") throw new AiGenerateError("Anthropic returned an unexpected response.");
  return text;
}

async function callGemini(key: string, model: string, system: string, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  if (!res.ok) throw new AiGenerateError(`Gemini error (${res.status}): ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new AiGenerateError("Gemini returned an unexpected response.");
  return text;
}

export async function generateWithAi(
  settings: AiSettings,
  provider: AiProvider,
  system: string,
  prompt: string
): Promise<string> {
  const key = keyForProvider(settings, provider).trim();
  if (!key) {
    throw new AiGenerateError(
      `No API key set for this provider. Add one in Admin → AI Settings first.`
    );
  }
  const model = modelForProvider(settings, provider);
  if (provider === "openai") return callOpenAi(key, model, system, prompt);
  if (provider === "anthropic") return callAnthropic(key, model, system, prompt);
  return callGemini(key, model, system, prompt);
}
