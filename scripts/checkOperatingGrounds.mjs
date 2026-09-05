#!/usr/bin/env node
// Operating-grounds guard (George, 5/9/2026): the house arranges crewed
// weeks from Athens (Cyclades, Saronic) and from Lefkada or Corfu (Ionian).
// Not Rhodes, not the Dodecanese, not Skiathos or the Sporades, not Crete.
// Their pages stay as guides with the OutsideGroundsNote; what must never
// appear again is copy that offers embarkation, delivery or a "George
// Yachts week" in those waters. Run before every push, like the pricing
// and credential guards.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["lib", "app"];
const EXT = /\.(js|jsx|mjs|ts|tsx)$/;
const SKIP = /node_modules|\.next|OutsideGroundsNote\.jsx|checkOperatingGrounds\.mjs|lastmodManifest\.json/;

// Phrases that present an outside ground as our embarkation, delivery or product.
// Guide pages may describe how a Dodecanese or Sporades week works for the
// sailor planning it ("Day 1: embark Rhodes") because the OutsideGroundsNote
// on those pages says the house does not arrange it. What the guard forbids
// is the house's own voice offering it: "we", "our", "George Yachts", the
// embarkation lists of our money pages, and a Rhodes delivery "quoted".
const PATTERNS = [
  /(Rhodes|Skiathos) for the (Dodecanese|Sporades)/i,
  /Embark(?:ation)?:[^.]{0,80}\b(Rhodes|Skiathos|Kos|Chania|Heraklion)\b/,
  /from (Athens|Lefkada|Corfu)[^.]{0,40}\bor (Rhodes|Skiathos)\b/i,
  /\b(we|our|George Yachts)\b[^.]{0,60}\b(board|boards|boarding|embark|embarks|embarkation)[^.]{0,40}\b(Rhodes|Skiathos|Kos|Chania)\b/i,
  /delivery[^.]{0,60}\b(Rhodes|Dodecanese|Sporades|Skiathos|Crete)\b[^.]{0,40}quoted/i,
  /\b(we|George Yachts)\b (arrange|run|offer|operate)[^.]{0,40}\b(weeks?|charters?) (from|in|out of) (Rhodes|the Dodecanese|Skiathos|the Sporades|Crete)/i,
  /Operating grounds:[^.]*\b(Dodecanese|Sporades)\b(?![^.]*\bnot\b)/i,
];

let hits = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (SKIP.test(p)) continue;
    const st = statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!EXT.test(name)) continue;
    const src = readFileSync(p, "utf8");
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      if (/^\s*\/\//.test(line)) return; // comments may describe history
      // A FAQ question is the reader's voice ("How do we get to Rhodes to
      // board?"); only the answer can offer anything. Test from the answer on.
      const aIdx = line.indexOf(" a: \"");
      const scope = aIdx >= 0 ? line.slice(aIdx) : line;
      for (const re of PATTERNS) {
        const m = scope.match(re);
        if (m) {
          hits++;
          console.log(`${p}:${i + 1}: ${m[0].slice(0, 90)}`);
          console.log(`    Why this is wrong: George Yachts works Athens, Cyclades, Saronic and Ionian only; Rhodes, the Dodecanese, the Sporades and Crete are guides, never a product.`);
          break;
        }
      }
    });
  }
}
for (const r of ROOTS) walk(r);
if (hits) {
  console.error(`\nOperating grounds guard: ${hits} line(s) offer a ground the house does not work.`);
  process.exit(1);
}
console.log("Operating grounds guard: clean. Athens, Cyclades, Saronic, Ionian; nothing offered from Rhodes, the Dodecanese, the Sporades or Crete.");
