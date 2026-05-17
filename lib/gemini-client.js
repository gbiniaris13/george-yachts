// lib/gemini-client.js
// =============================================================
// Thin wrapper around Google Gemini (via the OpenAI-compatible
// generativelanguage.googleapis.com endpoint OR the native v1beta
// endpoint). Enforces the monthly cost cap before each call and
// records actual cost after each successful response.
//
// Use this for EVERY Gemini call across the codebase. Never call
// generativelanguage.googleapis.com directly — that bypasses the
// cap and the build-time guard test will fail.
//
// Pricing (gemini-2.5-flash, USD per 1M tokens):
//   input  : $0.075
//   output : $0.30
// Other models (pro, ultra) cost more; keep flash as default.
// =============================================================

import { assertWithinCap, recordSpend } from "./cost-cap.js";

const PROVIDER = "gemini";

const PRICING = {
  "gemini-2.5-flash":   { in_per_mtok: 0.075, out_per_mtok: 0.30 },
  "gemini-1.5-flash-latest": { in_per_mtok: 0.075, out_per_mtok: 0.30 },
  "gemini-2.5-pro":     { in_per_mtok: 1.25,  out_per_mtok: 5.00 },
};

function dollarsFromUsage(model, usage = {}) {
  const p = PRICING[model] || PRICING["gemini-2.5-flash"];
  const inTok = usage.prompt_token_count ?? usage.input_tokens ?? usage.promptTokenCount ?? 0;
  const outTok = usage.candidates_token_count ?? usage.output_tokens ?? usage.candidatesTokenCount ?? 0;
  return (inTok / 1_000_000) * p.in_per_mtok + (outTok / 1_000_000) * p.out_per_mtok;
}

// Native v1beta call: POST /v1beta/models/{model}:generateContent
export async function geminiGenerateContent({
  model = "gemini-2.5-flash",
  apiKey,
  contents,
  systemInstruction,
  generationConfig,
  estimatedCostCents = 0,
} = {}) {
  await assertWithinCap({ provider: PROVIDER, estimatedCostCents });
  const key = apiKey || process.env.GOOGLE_GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!key) throw new Error("[gemini] no API key (GOOGLE_GEMINI_API_KEY or AI_API_KEY)");

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}` +
    `:generateContent?key=${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents, systemInstruction, generationConfig }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[gemini] ${res.status}: ${text.slice(0, 300)}`);
  }
  const j = await res.json();
  const usd = dollarsFromUsage(model, j.usageMetadata || j.usage || {});
  await recordSpend({ provider: PROVIDER, amountUsd: usd });
  return j;
}

// Streaming variant for SSE chat. Cap is checked BEFORE opening
// the stream (the protective step). Cost is recorded with a
// conservative flat estimate at the end — true usage isn't always
// in the OpenAI-compat Gemini stream. Caller pipes the upstream
// response through to the client.
export async function geminiOpenAiStream({
  model = "gemini-2.5-flash",
  apiKey,
  baseURL,
  messages,
  temperature,
  max_tokens,
  estimatedCostCents = 1, // conservative: assume ~$0.01 per chat
} = {}) {
  await assertWithinCap({ provider: PROVIDER, estimatedCostCents });
  const key = apiKey || process.env.AI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) throw new Error("[gemini] no API key (AI_API_KEY or GOOGLE_GEMINI_API_KEY)");

  const base = baseURL || process.env.AI_BASE_URL ||
    "https://generativelanguage.googleapis.com/v1beta/openai";

  const res = await fetch(`${base.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens, stream: true }),
  });

  // Record a flat conservative estimate right away — exact usage
  // figures from streaming OpenAI-compat Gemini aren't reliable.
  // Slight over-counting is the safe side of the trade.
  void recordSpend({ provider: PROVIDER, amountUsd: 0.01 });

  return res;
}

// OpenAI-compatible shim (for code that uses the OpenAI SDK pointed
// at Gemini). Same cap, same recording. Pass through the OpenAI
// chat.completions response shape so callers don't change.
export async function geminiOpenAiChat({
  model = "gemini-2.5-flash",
  apiKey,
  baseURL,
  messages,
  response_format,
  estimatedCostCents = 0,
} = {}) {
  await assertWithinCap({ provider: PROVIDER, estimatedCostCents });
  const key = apiKey || process.env.AI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) throw new Error("[gemini] no API key (AI_API_KEY or GOOGLE_GEMINI_API_KEY)");

  const base = baseURL || process.env.AI_BASE_URL ||
    "https://generativelanguage.googleapis.com/v1beta/openai";

  const res = await fetch(`${base.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages, response_format }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[gemini] ${res.status}: ${text.slice(0, 300)}`);
  }
  const j = await res.json();
  const usd = dollarsFromUsage(model, j.usage || {});
  await recordSpend({ provider: PROVIDER, amountUsd: usd });
  return j;
}
