// lib/anthropic-client.js
// =============================================================
// Thin wrapper around the Anthropic Messages API that enforces
// the monthly cost cap before each call and records actual cost
// after each successful response.
//
// Use this for EVERY Anthropic call across the codebase. Never
// call api.anthropic.com directly — it bypasses the cap.
//
// Pricing (as of 2026-05, claude-haiku-4-5):
//   input  : $1   / MTok
//   output : $5   / MTok
// We compute exact dollars from usage and increment the cap.
// =============================================================

import { assertWithinCap, recordSpend } from "./cost-cap";

const PROVIDER = "anthropic";
const ENDPOINT = "https://api.anthropic.com/v1/messages";
const VERSION_HEADER = "2023-06-01";

// Per-million-tokens pricing. Keep in sync with Anthropic's
// pricing page; haiku is our default. Override `model` to use
// sonnet ($3 in / $15 out) when accuracy matters.
const PRICING = {
  "claude-haiku-4-5": { in_per_mtok: 1, out_per_mtok: 5 },
  "claude-sonnet-4-6": { in_per_mtok: 3, out_per_mtok: 15 },
  "claude-opus-4-7":   { in_per_mtok: 15, out_per_mtok: 75 },
};

function dollarsFromUsage(model, usage = {}) {
  const p = PRICING[model] || PRICING["claude-haiku-4-5"];
  const inTok = usage.input_tokens ?? 0;
  const outTok = usage.output_tokens ?? 0;
  return (inTok / 1_000_000) * p.in_per_mtok + (outTok / 1_000_000) * p.out_per_mtok;
}

export async function anthropicMessage({
  model = "claude-haiku-4-5",
  max_tokens = 1024,
  system,
  messages,
  // Optional: pre-estimate cost in cents to refuse very large
  // calls early when we're near the cap.
  estimatedCostCents = 0,
} = {}) {
  // 1. Cap check — throws CostCapExceeded if we'd go over.
  await assertWithinCap({ provider: PROVIDER, estimatedCostCents });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("[anthropic] ANTHROPIC_API_KEY is not set");
  }

  // 2. Make the call.
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": VERSION_HEADER,
      "content-type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens, system, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[anthropic] ${res.status}: ${text.slice(0, 300)}`);
  }
  const j = await res.json();

  // 3. Record actual spend.
  const usd = dollarsFromUsage(model, j.usage);
  await recordSpend({ provider: PROVIDER, amountUsd: usd });

  return j;
}
