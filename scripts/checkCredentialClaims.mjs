#!/usr/bin/env node
/**
 * Credential guard.
 *
 * The house sells verification: several pages tell a reader exactly how to
 * check a broker's claims. That only works if our own claims survive the same
 * test. George P. Biniaris holds a skipper's licence from the Olympiacos SFP
 * Sailing Academy and a powerboat licence. He is not a captain and has never
 * claimed to be. It would be very easy for a future edit to round that up,
 * because "former captain" sounds better in a sentence, and it would quietly
 * invalidate every verification page on the site.
 *
 * Run: node scripts/checkCredentialClaims.mjs
 * Exits non-zero if a forbidden claim appears anywhere in the source.
 *
 * Written 2026-08-07.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SKIP = new Set(["node_modules", ".next", ".git", "out", "public", "scripts"]);
const EXTS = new Set([".js", ".jsx", ".ts", ".tsx", ".md", ".json"]);

// Each rule is a claim we must never make about the founder, with the reason
// it is false, so whoever trips it understands rather than just deletes.
const FORBIDDEN = [
  { re: /\bformer captain\b/i, why: "He holds a skipper's licence, not a captain's ticket." },
  { re: /\bex[- ]captain\b/i, why: "He holds a skipper's licence, not a captain's ticket." },
  { re: /\bcaptain George\b/i, why: "He is a licensed skipper and a broker, not a captain." },
  { re: /\bGeorge,? (?:a|the) captain\b/i, why: "He is a licensed skipper, not a captain." },
  { re: /\bcertified captain\b/i, why: "No captain certification is held." },
  { re: /\bmaster mariner\b/i, why: "No such qualification is held." },
  { re: /\bMYBA member\b/i, why: "The house is an IYBA member. MYBA is the contract standard we use, not a membership we hold." },
];

// A line that forbids a claim contains the claim. The first run of this guard
// flagged four such lines, every one of them an instruction not to say the
// thing. Comment lines and negated sentences are guidance, not copy.
const isComment = (line) => /^\s*(\/\/|\*|\/\*|#)/.test(line);
const isNegated = (line) =>
  /\b(never|not|no|avoid|forbidden|don't|do not|instead of|rather than|wrong)\b/i.test(line);

const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!EXTS.has(extname(name))) continue;

    const text = readFileSync(full, "utf8");
    for (const { re, why } of FORBIDDEN) {
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        // Skip the rule table in this file itself.
        if (full.endsWith("checkCredentialClaims.mjs")) return;
        if (isComment(line) || isNegated(line)) return;
        if (re.test(line)) {
          hits.push({ file: full.replace(ROOT, ""), line: i + 1, text: line.trim().slice(0, 140), why });
        }
      });
    }
  }
}

walk(join(ROOT, "app"));
walk(join(ROOT, "lib"));

if (hits.length === 0) {
  console.log("Credential claims clean. Skipper, never captain.");
  process.exit(0);
}

console.error(`\n${hits.length} forbidden credential claim(s):\n`);
for (const h of hits) {
  console.error(`  ${h.file}:${h.line}`);
  console.error(`    ${h.text}`);
  console.error(`    Why this is wrong: ${h.why}\n`);
}
process.exit(1);
