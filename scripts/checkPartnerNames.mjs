#!/usr/bin/env node
// Partner and competitor names never appear in anything a client can read.
//
// George, 2026-09-07 (SOS): "δεν γίνεται να διαφημίζουμε με ποιους
// συνεργαζόμαστε, είτε με την Ιστίον, είτε με την FX, είτε με οποιαδήποτε
// central agency ... ούτε στο site ... ούτε Ιστίον, ούτε FX, ούτε FYLY,
// ούτε IYC, ούτε τίποτα". The same day an Instagram story carried a partner's
// office sign, lifted from a yacht's photo set, and three rendered pages
// named the houses. This guard scans every string literal that can render
// (catalogs under lib/, pages and components under app/) for the names, and
// ignores comments, so internal notes about who supplies which yacht stay
// where they belong.
//
// Run: node scripts/checkPartnerNames.mjs   (exit 1 on any hit)

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIRS = ["lib", "app"];
const SKIP = [
  /node_modules/,
  /\.next\//,
  /lib\/yachtAwards\.js$/,       // internal registry, PERMITTED_HOUSES is not rendered
  /lib\/ai-visibility\.js$/,     // competitor tracker list, not rendered
  /app\/api\//,                  // server routes, nothing rendered (extract-brochure names a supplier for parsing)
  /app\/components\/ContactDrawer\.jsx$/, // phone comments
  /lib\/newsletter\/validator\.js$/, // the newsletter's own blocklist of these names
  /lib\/competitorIntel\.js$/,   // competitor tracker, not rendered
];

// Word-bounded, case-insensitive. "FX" alone is too common (currency code,
// /api/fx), so it is matched only as "FX Yachting" or "FX Yachts".
// "Camper & Nicholsons" is deliberately absent: it is the shipyard that
// built NORTHWIND II in 1966, and a builder's name on a rate card is a fact.
const NAMES = [
  "boataround",
  "sail ionian",
  "12knots",
  "dream yacht",
  "sailogy",
  "click&boat",
  "clickandboat",

  "cloud9 concierge",
  "cloud 9 concierge",
  "sotheby",
  "arton capital",
  "suite sojourn",
  "onirikos",

  "istion", "fx yachting", "fx yachts", "fyly", "\\biyc\\b", "fraser", "burgess",
  "northrop", "edmiston", "mygreekcharter",
  "ionian-charter", "12knots", "thethoms", "valef", "yal'oou", "yaloou",
];
const RE = new RegExp("(" + NAMES.join("|") + ")", "i");

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const rel = relative(ROOT, p);
    if (SKIP.some((s) => s.test(rel))) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(js|jsx|mjs|ts|tsx|json)$/.test(name)) out.push(p);
  }
}

const files = [];
for (const d of DIRS) walk(join(ROOT, d), files);

const problems = [];
for (const f of files) {
  const src = readFileSync(f, "utf8");
  // Strip block and line comments so internal notes do not trip the guard.
  const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
  const lines = code.split("\n");
  lines.forEach((line, i) => {
    const m = line.match(RE);
    if (m) problems.push({ file: relative(ROOT, f), line: i + 1, hit: m[1], text: line.trim().slice(0, 140) });
  });
}

if (problems.length) {
  console.error(`Partner-name guard: ${problems.length} hit(s).\n`);
  for (const p of problems) console.error(`  • ${p.file}:${p.line}  [${p.hit}]\n      ${p.text}`);
  console.error("\nΚανένα όνομα συνεργάτη, central agent ή ανταγωνιστή σε κείμενο που διαβάζει πελάτης. Γράψε «the owner», «the central agent», «the global houses».");
  process.exit(1);
}
console.log(`Partner-name guard: clean (${files.length} files).`);
