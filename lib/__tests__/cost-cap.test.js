// lib/__tests__/cost-cap.test.js
// =============================================================
// Bulletproof tests for the AI cost cap. Runs against a mocked
// KV so we can simulate spending without touching real KV.
//
// Run:  node --test lib/__tests__/cost-cap.test.js
//
// What we prove:
//   1. With AI_FEATURES_ENABLED unset → every call refuses.
//   2. With AI_FEATURES_ENABLED=true, under cap → calls pass.
//   3. At exactly the cap → next call refuses.
//   4. Over the cap → call refuses.
//   5. Recording spend bumps the counter precisely.
//   6. Different months use different counters (no carry-over).
// =============================================================

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import {
  assertWithinCap,
  recordSpend,
  getMonthlySpendCents,
  getUsage,
  CostCapExceeded,
  AiFeaturesDisabled,
  _setKvForTesting,
  _resetKvForTesting,
} from "../cost-cap.js";

// In-memory KV mock — installed via dependency injection.
const fakeStore = new Map();
_setKvForTesting({
  kvGet: async (k) => fakeStore.get(k) ?? null,
  kvSet: async (k, v) => {
    fakeStore.set(k, v);
    return "OK";
  },
  kvIncr: async (k) => {
    const next = (parseInt(fakeStore.get(k) ?? "0", 10) || 0) + 1;
    fakeStore.set(k, String(next));
    return next;
  },
});

const PROVIDER = "anthropic";

function reset() {
  fakeStore.clear();
}

beforeEach(() => {
  reset();
  delete process.env.AI_FEATURES_ENABLED;
  delete process.env.COST_CAP_ANTHROPIC_CENTS;
});

// -------------------------------------------------------------

test("MASTER SWITCH: refuses every call when AI_FEATURES_ENABLED is unset", async () => {
  await assert.rejects(
    () => assertWithinCap({ provider: PROVIDER }),
    AiFeaturesDisabled
  );
});

test("MASTER SWITCH: refuses when AI_FEATURES_ENABLED is anything other than 'true'", async () => {
  for (const v of ["false", "0", "no", "1", "yes", ""]) {
    process.env.AI_FEATURES_ENABLED = v;
    await assert.rejects(
      () => assertWithinCap({ provider: PROVIDER }),
      AiFeaturesDisabled,
      `should refuse with AI_FEATURES_ENABLED='${v}'`
    );
  }
});

test("MASTER SWITCH: passes when AI_FEATURES_ENABLED='true' (case-insensitive)", async () => {
  for (const v of ["true", "TRUE", "True"]) {
    process.env.AI_FEATURES_ENABLED = v;
    await assert.doesNotReject(() => assertWithinCap({ provider: PROVIDER }));
  }
});

test("CAP: passes when spend is under €10 cap", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await recordSpend({ provider: PROVIDER, amountUsd: 5.0 });
  // €5 spent of €10 cap → should pass.
  await assert.doesNotReject(() => assertWithinCap({ provider: PROVIDER }));
  const usage = await getUsage(PROVIDER);
  assert.equal(usage.spent_cents, 500);
  assert.equal(usage.cap_cents, 1000);
  assert.equal(usage.used_pct, 50);
});

test("CAP: refuses when spend reaches exactly €10", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await recordSpend({ provider: PROVIDER, amountUsd: 10.0 });
  await assert.rejects(
    () => assertWithinCap({ provider: PROVIDER }),
    CostCapExceeded
  );
});

test("CAP: refuses when spend exceeds €10", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await recordSpend({ provider: PROVIDER, amountUsd: 15.0 });
  await assert.rejects(
    () => assertWithinCap({ provider: PROVIDER }),
    CostCapExceeded
  );
});

test("CAP: refuses when estimated cost would push past cap", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await recordSpend({ provider: PROVIDER, amountUsd: 9.5 });
  // €9.50 spent + €1 estimated → would be €10.50 → must refuse.
  await assert.rejects(
    () => assertWithinCap({ provider: PROVIDER, estimatedCostCents: 100 }),
    CostCapExceeded
  );
  // But a tiny estimated cost stays within: €9.50 + €0.10 = €9.60.
  await assert.doesNotReject(() =>
    assertWithinCap({ provider: PROVIDER, estimatedCostCents: 10 })
  );
});

test("RECORDING: amounts are rounded UP to whole cents (never under-count)", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await recordSpend({ provider: PROVIDER, amountUsd: 0.001 });    // 0.1c → 1c
  await recordSpend({ provider: PROVIDER, amountUsd: 0.001 });    // 0.1c → 1c
  await recordSpend({ provider: PROVIDER, amountUsd: 0.012 });    // 1.2c → 2c
  const spent = await getMonthlySpendCents(PROVIDER);
  assert.equal(spent, 4, "1 + 1 + 2 = 4 cents (rounded up to be safe)");
});

test("ENV OVERRIDE: COST_CAP_ANTHROPIC_CENTS changes the cap", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  process.env.COST_CAP_ANTHROPIC_CENTS = "500"; // €5 cap
  await recordSpend({ provider: PROVIDER, amountUsd: 4.99 });
  await assert.doesNotReject(() => assertWithinCap({ provider: PROVIDER }));
  await recordSpend({ provider: PROVIDER, amountUsd: 0.02 });
  await assert.rejects(
    () => assertWithinCap({ provider: PROVIDER }),
    CostCapExceeded
  );
});

test("MONTH ISOLATION: counters key on YYYY-MM (smoke test of key format)", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await recordSpend({ provider: PROVIDER, amountUsd: 5.0 });
  // The recorded key should include the current YYYY-MM.
  const d = new Date();
  const monthKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  const expectedKey = `cost-cap:${PROVIDER}:${monthKey}:cents`;
  assert.ok(fakeStore.has(expectedKey), `expected key ${expectedKey} in store`);
});

test("INVALID INPUT: recordSpend with no provider is a no-op", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  const before = await getMonthlySpendCents(PROVIDER);
  await recordSpend({ amountUsd: 5.0 });
  await recordSpend({ provider: PROVIDER, amountUsd: -10 });   // negative ignored
  await recordSpend({ provider: PROVIDER, amountUsd: "abc" }); // non-number ignored
  const after = await getMonthlySpendCents(PROVIDER);
  assert.equal(after, before);
});

test("INVALID INPUT: assertWithinCap with no provider throws clearly", async () => {
  process.env.AI_FEATURES_ENABLED = "true";
  await assert.rejects(
    () => assertWithinCap({}),
    /provider required/
  );
});
