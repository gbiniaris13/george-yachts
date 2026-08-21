#!/usr/bin/env node
/**
 * One price model, one product.
 *
 * George, 2026-08-21: "όλες οι τιμές στο site είναι per week, όχι per person"
 * and "στο site δεν θέλω πλέον να υπάρχει τύπου bare boat και υποψία bare
 * boat δηλαδή skipper included or available".
 *
 * Both had crept in everywhere, and neither is the kind of thing anybody
 * notices reintroducing. A per-person figure looks helpful. "Skipper
 * available" looks like flexibility. So this fails the build rather than
 * relying on memory:
 *
 *   1. No per-person or per-guest price anywhere in copy.
 *   2. No arithmetic that divides a weekly rate by the number of berths.
 *   3. No skipper-only or bareboat arrangement offered as a product.
 *
 * What it deliberately does NOT flag: George's own licence, a colleague's
 * licence, and the factual VAT rule that bareboat arrangements are invoiced
 * at 24%. Removing the last one would make the VAT pages wrong, and a guard
 * that forces a lie is worse than no guard.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SEARCH_DIRS = ["app", "lib"];
const SKIP = new Set(["node_modules", ".next", ".git", ".vercel", ".claude", "cabin"]);

const RULES = [
  {
    id: "per-person price",
    re: /(per[- ]person|per[- ]guest|\/\s?person|\bp\/p\b)/i,
    // "personal", "personally", "per person" inside a crew brief about
    // allergies, and the cabin app's per-guest forms are not prices.
    // Three families of false positive, all worth keeping out by name:
    // the cabin app's per-guest forms, which are about allergies and not
    // money; the words "personal" and "personally"; and any sentence that
    // exists precisely to say there is NO per-person rate.
    // Things that are genuinely priced per head and are not charter fees:
    // shore catering for a wedding, a wine-pairing menu, a dive, and the
    // APA worksheet's own line items, which really are itemised "food per
    // guest per day". Banning those would make the pages wrong.
    //
    // And things that are not money at all: amenity, room and deck space
    // per guest, plus any sentence that exists to say pricing is per yacht.
    exempt: /catering|wedding reception|pairing menu|per dive|per night beyond|food per guest per day|amenity per guest|room per person|space per guest|day-tripper|per-yacht, not per-guest|priced per yacht|schema\.org\/Person|itemProp="author"|personal|allerg|dietary|unsubscrib|preference sheet|life aboard|guest list|no per-person|not? per[- ]person|never (quote |print )?a per[- ]person|per yacht, per week|per yacht per week|(space|room|accommodation|cabin space|square met|m2|m²|deck space|covers?) per guest|per guest than/i,
    fix: 'Quote the week for the yacht. "€19,500 a week", never "€2,400 per person".',
  },
  {
    id: "berth arithmetic",
    // base / guests, base / sleeps, base / berths — the division that
    // manufactured the per-person figure in the first place.
    re: /\/\s*\(?\s*(guests|sleeps|berths|pax)\b|parseInt\([^)]*sleeps[^)]*\)\s*\)?\s*;?\s*$/i,
    exempt: /never|no longer|used to|section 5/i,
    fix: "A berth is not a unit anybody can buy. The yacht goes as one yacht.",
  },
  {
    id: "skipper as a product",
    re: /skipper (included|available|optional|mandatory|only)|(with|without) (a )?skipper|skippered (charter|yacht|fleet|cat)|skipper[- ]led/i,
    // George is a licensed sailing skipper and so is a colleague. Those are
    // credentials, not an offer.
    exempt: /alsoKnownAs|is not something (george yachts|this house) brokers|not through us|sailing skipper|skipper'?s licence|skipper'?s license|Olympiacos|licensed skipper|became a skipper|Day Skipper|Yachtmaster|charter-skipper certification|skipper'?s pick/i,
    fix: "This house writes crewed weeks. A skipper-only arrangement is not on the menu.",
  },
  {
    id: "bareboat as a product",
    re: /\b(we|george yachts)\b[^.]{0,60}\bbareboat\b|bareboat (from|starts|available|option)/i,
    exempt: /do not|does not|don'?t|doesn'?t|never|not from us|rather than|instead of|24%|24 percent|short, static/i,
    fix: "Bareboat may be explained, never offered.",
  },
];

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) walk(full, out);
    else if ([".js", ".jsx"].includes(extname(name))) out.push(full);
  }
  return out;
}

const problems = [];
for (const dir of SEARCH_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    if (rel.includes("/cabin/") || rel.endsWith("checkPricingCopy.mjs")) continue;

    // lib/glossarySeo.js is a dictionary of this market's vocabulary, and
    // several of its entries define products this house does not broker:
    // bareboat, day hire, cabin charter on a gulet. Cabin charter IS priced
    // per person, by the operators who sell it, and the entry says in as
    // many words that it is "not a UHNW product" and that "the product
    // George Yachts brokers is exclusively whole-yacht". Forcing that
    // sentence to lie would be a worse outcome than the rule it satisfies.
    //
    // So the pricing rule is lifted here and only here. The two rules about
    // OFFERING a skipper-only or bareboat arrangement still apply: a
    // definition may explain them, this house may not sell them.
    const isGlossary = rel === "lib/glossarySeo.js";

    // lib/retiredYachts.js records WHY each withdrawn yacht was withdrawn,
    // and the reason is the crew field it carried: "Skipper available".
    // Quoting the evidence for a removal is the opposite of offering it, and
    // nothing in that file is ever rendered. Without this the guard would
    // push somebody to delete the only record of why seven boats went.
    if (rel === "lib/retiredYachts.js") continue;
    // Comments may discuss all of this; that is how the reasoning survives a
    // handover. A single-line test is not enough: the notes in this codebase
    // are JSX blocks, {/* ... */}, whose continuation lines start with a bare
    // word and were being flagged for quoting the very rule they explain.
    let inBlock = false;
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      const opens = /\{?\s*\/\*/.test(line);
      const closes = /\*\/\s*\}?/.test(line);
      if (inBlock) {
        if (closes) inBlock = false;
        return;
      }
      if (opens && !closes) { inBlock = true; return; }
      if (/^\s*(\/\/|\*|\/\*|\{\s*\/\*)/.test(line)) return;
      for (const rule of RULES) {
        if (isGlossary && (rule.id === "per-person price" || rule.id === "berth arithmetic")) continue;
        if (!rule.re.test(line)) continue;
        if (rule.exempt && rule.exempt.test(line)) continue;
        // Show the match in its own context. These lines are often 600
        // characters of SEO prose and printing the first 120 shows the
        // opening of a sentence that has nothing to do with the hit.
        const m = rule.re.exec(line);
        const at = m ? m.index : 0;
        const around = line.slice(Math.max(0, at - 60), at + (m ? m[0].length : 0) + 60).trim();
        problems.push(`${rel}:${i + 1}  [${rule.id}]\n      …${around}…`);
      }
    });
  }
}

if (problems.length === 0) {
  console.log("Pricing guard: clean. One price model, per yacht per week, and no skipper-only or bareboat offer.");
  process.exit(0);
}
console.error(`Pricing guard: ${problems.length} problem(s).\n`);
problems.forEach((p) => console.error("  • " + p));
process.exit(1);
