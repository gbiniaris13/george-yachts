// lib/cost-cap.js
// =============================================================
// App-level spending cap for pay-per-use APIs (currently only
// Anthropic, but the pattern extends to any provider).
//
// How it works:
//   • KV counter per provider, per YYYY-MM. Stored in cents to
//     avoid floating-point drift.
//   • assertWithinCap() throws if the next call would exceed
//     the monthly cap. Wrap every AI call with it BEFORE making
//     the call (cheap protection).
//   • recordSpend() bumps the counter after a successful call.
//   • Telegram alert fires once at 80% and once at 100% per month,
//     idempotent via a flag key.
//
// Usage:
//   await assertWithinCap({ provider: "anthropic" });
//   const result = await fetch(ANTHROPIC_API, ...);
//   const cost = computeCostFromUsage(result.usage);
//   await recordSpend({ provider: "anthropic", amountUsd: cost });
//
// Defaults to €10/month per provider. Override via env or in
// the call. The cap is a HARD STOP — when exceeded the API
// throws and the caller is expected to surface a friendly
// "monthly cap reached, retry in N days" message to the user.
// =============================================================

import * as defaultKv from "./kv.js";

// Indirection so tests can swap in a fake KV without npm dep
// gymnastics. Production code always uses the real Upstash KV.
let kv = defaultKv;
export function _setKvForTesting(fake) {
  kv = fake;
}
export function _resetKvForTesting() {
  kv = defaultKv;
}
const kvGet = (k) => kv.kvGet(k);
const kvSet = (k, v, ttl) => kv.kvSet(k, v, ttl);

// €10/month default. EUR/USD parity-ish for the napkin estimate;
// since Anthropic bills in USD we conservatively treat the cap
// as USD too. That gives a small safety buffer vs the Euro.
const DEFAULT_CAP_CENTS = 10 * 100;

// MASTER KILL SWITCH. Defaults to FALSE so that even if the cap
// has a bug, no AI call can happen until the operator explicitly
// flips this to "true" in the env. This is the "Vercel went from
// €20 to €90" lesson: never trust defaults; require explicit
// opt-in for any pay-per-use feature.
function aiEnabled() {
  return String(process.env.AI_FEATURES_ENABLED || "").toLowerCase() === "true";
}

export class AiFeaturesDisabled extends Error {
  constructor() {
    super(
      "AI features are disabled (AI_FEATURES_ENABLED is not 'true'). " +
      "Set the env var explicitly to turn them on."
    );
    this.name = "AiFeaturesDisabled";
  }
}

// Telegram alert thresholds as percentages.
const ALERT_PERCENTS = [80, 100];

function monthKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function spendKey(provider) {
  return `cost-cap:${provider}:${monthKey()}:cents`;
}

function alertKey(provider, pct) {
  return `cost-cap:${provider}:${monthKey()}:alert:${pct}`;
}

function capFor(provider) {
  const envOverride = process.env[`COST_CAP_${provider.toUpperCase()}_CENTS`];
  if (envOverride) return parseInt(envOverride, 10) || DEFAULT_CAP_CENTS;
  return DEFAULT_CAP_CENTS;
}

export async function getMonthlySpendCents(provider) {
  const raw = await kvGet(spendKey(provider));
  if (raw == null) return 0;
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getUsage(provider) {
  const spent = await getMonthlySpendCents(provider);
  const cap = capFor(provider);
  return {
    provider,
    month: monthKey(),
    spent_cents: spent,
    spent_eur: (spent / 100).toFixed(2),
    cap_cents: cap,
    cap_eur: (cap / 100).toFixed(2),
    used_pct: cap === 0 ? 0 : Math.round((spent / cap) * 100),
    remaining_cents: Math.max(0, cap - spent),
  };
}

export class CostCapExceeded extends Error {
  constructor(provider, used, cap) {
    super(`Monthly cap reached for ${provider}: $${(used / 100).toFixed(2)} of $${(cap / 100).toFixed(2)}`);
    this.name = "CostCapExceeded";
    this.provider = provider;
    this.used = used;
    this.cap = cap;
  }
}

// Call BEFORE making an AI request. Throws if we're already over,
// or if the estimated cost would push us over. estimatedCostCents
// is optional; pass it for big-batch calls.
//
// Three-layer protection:
//   1. AI_FEATURES_ENABLED master switch (default false)
//   2. Monthly cap per provider (default €10)
//   3. Provider-side hard cap (set by operator in vendor console)
export async function assertWithinCap({ provider, estimatedCostCents = 0 } = {}) {
  if (!provider) throw new Error("[cost-cap] provider required");
  if (!aiEnabled()) throw new AiFeaturesDisabled();
  const used = await getMonthlySpendCents(provider);
  const cap = capFor(provider);
  if (used + estimatedCostCents >= cap) {
    throw new CostCapExceeded(provider, used, cap);
  }
}

// Call AFTER a successful API response with the actual cost.
// amountUsd is the dollar amount (Anthropic returns this in
// the `usage` object — convert to cents = $0.0012 → 0.12 cents
// → we round up to int cents to stay conservative).
export async function recordSpend({ provider, amountUsd }) {
  if (!provider) return;
  if (typeof amountUsd !== "number" || amountUsd < 0) return;
  // Always round UP so accumulation can never drift below true cost.
  const deltaCents = Math.max(1, Math.ceil(amountUsd * 100));

  // Atomic increment via Upstash INCRBY (kvIncr only does +1, so
  // we loop for now — most calls are sub-cent. For accuracy use
  // a real INCRBY when the volume grows.) Simpler: kvSet absolute.
  const current = await getMonthlySpendCents(provider);
  const next = current + deltaCents;
  // 35-day TTL so the counter naturally expires shortly after the
  // month closes; we never leak old data forever.
  await kvSet(spendKey(provider), String(next), 35 * 24 * 3600);

  // Fire-and-forget alert check — never block the API response.
  void maybeAlert({ provider, used: next, cap: capFor(provider) }).catch((e) =>
    console.error("[cost-cap] alert error:", e.message)
  );

  return { provider, spent_cents: next, cap_cents: capFor(provider) };
}

async function maybeAlert({ provider, used, cap }) {
  if (cap === 0) return;
  const pct = Math.round((used / cap) * 100);
  for (const threshold of ALERT_PERCENTS) {
    if (pct >= threshold) {
      const flag = alertKey(provider, threshold);
      const already = await kvGet(flag);
      if (already) continue;
      // Mark first so a race doesn't double-alert.
      await kvSet(flag, "1", 35 * 24 * 3600);
      await sendTelegramAlert({ provider, used, cap, threshold });
    }
  }
}

async function sendTelegramAlert({ provider, used, cap, threshold }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  const icon = threshold >= 100 ? "🛑" : "⚠️";
  const verb = threshold >= 100 ? "HARD CAP REACHED" : "approaching cap";
  const text =
    `${icon} ${verb} — ${provider}\n` +
    `Spent: $${(used / 100).toFixed(2)} of $${(cap / 100).toFixed(2)} (${Math.round((used / cap) * 100)}%)\n` +
    `Month: ${monthKey()}\n` +
    (threshold >= 100
      ? `All further ${provider} calls will be refused until the 1st of next month.`
      : `You have $${((cap - used) / 100).toFixed(2)} left this month.`);

  if (!token || !chat) {
    console.log("\n" + "═".repeat(60));
    console.log(`💰 COST-CAP ALERT (Telegram not configured):`);
    console.log(text);
    console.log("═".repeat(60) + "\n");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    });
  } catch (e) {
    console.error("[cost-cap] telegram error:", e.message);
  }
}
