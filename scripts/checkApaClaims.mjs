#!/usr/bin/env node
/**
 * The APA guard.
 *
 * 2026-08-08. George's correction: "Δεν είναι λάθος αυτό. Κάνε έρευνα στην
 * MYBA και θα δεις. Το APA διαφοροποιείται ανάλογα με το νάβλο." He was right.
 * The research (lib/apaFacts.js, sources in code) established that the MYBA
 * Charter Agreement fixes the mechanism and never states a percentage, and that
 * the real span is about 20% on a sailing yacht to 40% on a motor yacht.
 *
 * The correction reached the pillar article that same day. It did not reach the
 * glossary, the FAQ, the how-it-works page, the comparison table, the pricing
 * PDF, the calculator label or the estimator constant, and an audit that evening
 * found twenty-seven surviving statements of a "standard" or "typical" rate
 * across seventeen files. The glossary was the worst of them, because
 * /glossary/apa is precisely the page an AI engine reads for a definition, and
 * it was still handing out 25-35% as the norm.
 *
 * So this guard exists for the same reason scripts/checkCredentialClaims.mjs
 * does: a fact that took research to establish should not be able to drift back
 * quietly. It fails on any UNIVERSAL claim of a typical APA rate. It stays
 * silent on type-specific bands that sit inside the researched span, because
 * those are not errors, they are the point.
 *
 *   node scripts/checkApaClaims.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SEARCH_DIRS = ["app", "lib"];
const EXTS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", "scripts"]);

// The honest span. Anything presented as universal must live inside it and must
// not be presented as "the standard".
const MIN = 20;
const MAX = 40;

// A universal claim looks like a "typical/usual/standard" qualifier sitting near
// the word APA with a percentage range attached, and no yacht type named.
const QUALIFIER = /\b(typical(?:ly)?|usual(?:ly)?|standard|normally|generally|the standard)\b/i;
const RANGE = /\b(\d{2})\s*(?:-|–|—|to)\s*(\d{2})\s*(?:%|percent)/i;
// Plurals matter here: the first run of this guard flagged "APA (typically
// 25-30% for catamarans" as an unqualified claim, because \bcatamaran\b does
// not match "catamarans". A guard that cries wolf on correct copy gets switched
// off, so every type takes an optional trailing s.
const TYPE_NAMED =
  /\b(motor[ -]yachts?|sailing[ -]yachts?|catamarans?|power cats?|gulets?|superyachts?|monohulls?|by yacht type|by type|καταμαράν|ιστιοπλοϊκ|μηχανοκίνητ)\b/i;

// Lines that are talking about something else that also carries a percentage.
const NOT_APA_TOPIC = /\b(gratuity|tip|VAT VAT|deposit|commission|utilisation|occupancy)\b/i;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.has(extname(entry))) out.push(full);
  }
  return out;
}

const problems = [];

for (const dir of SEARCH_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const lines = readFileSync(file, "utf-8").split("\n");
    lines.forEach((line, i) => {
      if (!/\bAPA\b/.test(line)) return;
      // Comments explain the rule; they are allowed to quote the old numbers.
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;

      // Look only at the stretch of text around each APA mention, so a
      // gratuity percentage later in the same paragraph is not blamed on it.
      for (const m of line.matchAll(/\bAPA\b/g)) {
        const window = line.slice(Math.max(0, m.index - 90), m.index + 190);
        if (NOT_APA_TOPIC.test(window)) continue;
        const range = window.match(RANGE);
        if (!range) continue;

        const lo = Number(range[1]);
        const hi = Number(range[2]);
        // 10-15 is the gratuity convention, not an APA claim.
        if (hi <= 15) continue;

        const typed = TYPE_NAMED.test(window);
        const qualified = QUALIFIER.test(window);

        if (!typed && qualified) {
          problems.push({
            file: file.replace(ROOT, ""),
            line: i + 1,
            why: `states a "${range[0]}" APA as typical without naming a yacht type. There is no standard rate; say ${MIN}-${MAX}% by yacht type, or name the type.`,
            text: window.trim().slice(0, 150),
          });
        } else if (!typed && (lo < MIN || hi > MAX)) {
          // Deliberately "inside the span" rather than "equal to the span".
          //
          // The strict version was tried and rejected the same evening. It
          // demanded that any sentence naming no yacht type say exactly 20-40,
          // and it immediately flagged twenty-four lines, nearly all of them
          // correct: a negotiation scenario ("for a simple itinerary the
          // captain may accept 25-28%"), a country comparison ("Greece 25-30%,
          // Croatia 22-28%"), and prose on the motor-yacht article where the
          // type is the page rather than the sentence. Those are not the error
          // this guard exists to catch.
          //
          // A guard that fires on correct copy gets switched off, and then it
          // catches nothing at all. The real failure mode is a bare "typically
          // X%" presented as the standard, and the branch above catches that.
          problems.push({
            file: file.replace(ROOT, ""),
            line: i + 1,
            why: `universal APA range ${range[0]} falls outside the researched ${MIN}-${MAX}% span.`,
            text: window.trim().slice(0, 150),
          });
        }
      }
    });
  }
}

if (problems.length === 0) {
  console.log("APA guard: clean. No universal 'standard rate' claims.");
  process.exit(0);
}

console.error(`APA guard: ${problems.length} problem(s).\n`);
for (const p of problems) {
  console.error(`  ${p.file}:${p.line}`);
  console.error(`    ${p.why}`);
  console.error(`    ...${p.text}...\n`);
}
console.error(
  "The MYBA contract sets how the APA works, not what it costs. See lib/apaFacts.js.",
);
process.exit(1);
