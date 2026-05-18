// lib/__tests__/ai-usage-guard.test.js
// =============================================================
// Build-time guard: fails if anyone tries to call Anthropic
// (or any other pay-per-use AI provider) directly instead of
// going through lib/anthropic-client.js, which enforces the
// monthly cost cap. Defence-in-depth alongside the runtime cap.
//
// Run:  node --test lib/__tests__/ai-usage-guard.test.js
//
// Allowlist: lib/anthropic-client.js and lib/cost-cap.js are the
// ONLY files allowed to mention api.anthropic.com or the
// @anthropic-ai/sdk package. Anything else fails the test.
// =============================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..");
const SCAN_DIRS = ["app", "lib", "middleware.js", "next.config.mjs"];
const ALLOWED_FILES = new Set([
  "lib/anthropic-client.js",
  "lib/gemini-client.js",
  "lib/cost-cap.js",
  "lib/__tests__/ai-usage-guard.test.js",
  "lib/__tests__/cost-cap.test.js",
]);

const FORBIDDEN_PATTERNS = [
  { name: "Anthropic REST endpoint", re: /api\.anthropic\.com/i },
  { name: "Anthropic SDK import", re: /['"]@anthropic-ai\/sdk['"]/ },
  { name: "OpenAI SDK import", re: /['"]openai['"]/ },
  { name: "OpenAI REST endpoint", re: /api\.openai\.com/i },
  { name: "Google AI / Gemini endpoint", re: /generativelanguage\.googleapis\.com/i },
];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === ".next" || name === ".git") continue;
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      yield* walk(full);
    } else if (
      st.isFile() &&
      /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(name)
    ) {
      yield full;
    }
  }
}

function findViolations() {
  const violations = [];
  for (const dirOrFile of SCAN_DIRS) {
    const target = join(ROOT, dirOrFile);
    let st;
    try { st = statSync(target); } catch { continue; }
    const files = st.isDirectory() ? Array.from(walk(target)) : [target];
    for (const file of files) {
      const rel = relative(ROOT, file);
      if (ALLOWED_FILES.has(rel)) continue;
      let content;
      try { content = readFileSync(file, "utf8"); } catch { continue; }
      for (const { name, re } of FORBIDDEN_PATTERNS) {
        if (re.test(content)) {
          violations.push({ file: rel, pattern: name });
        }
      }
    }
  }
  return violations;
}

test("AI USAGE GUARD: no direct Anthropic / OpenAI / Gemini calls outside lib/anthropic-client.js", () => {
  const violations = findViolations();
  if (violations.length > 0) {
    const msg =
      "Found direct AI provider usage that bypasses the cost cap. " +
      "Route every AI call through lib/anthropic-client.js so the " +
      "€10/month cap applies.\n\n" +
      violations.map((v) => `  • ${v.file}  →  ${v.pattern}`).join("\n");
    assert.fail(msg);
  }
});
