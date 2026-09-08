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

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIRS = ["lib", "app"];

/**
 * Files at the root that reach the public even though they are not pages.
 *
 * On 8 September a partner's asset domain spent four hours inside the
 * Content-Security-Policy in next.config.mjs, which is a header served to
 * every visitor and a file in a public repository, and this guard reported
 * the site clean the whole time because it only ever walked lib and app.
 * A rule that is absolute has to be checked everywhere the name can reach a
 * stranger, not only where the copy lives.
 */
const ROOT_FILES = [
  "next.config.mjs",
  "middleware.js",
  "vercel.json",
  "robots.txt",
  "public/robots.txt",
  "public/llms.txt",
];
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

/**
 * Lines that carry a name because the name is already public and removing
 * it would break something, rather than because anybody chose to write it.
 *
 * There is exactly one: the redirect that catches an old blog URL and sends
 * it to the index. The slug was live, it has been linked, and a 301 has to
 * keep the address it is answering. Deleting the line would not delete the
 * name from the internet, it would only turn a working redirect into a 404,
 * which is the opposite of the rule about never dropping a URL that has
 * been seen. The destination names nobody.
 */
const ALLOWED_LINES = [
  /source:\s*"\/blog\/[^"]*",\s*destination:\s*"\/blog"/,
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
for (const f of ROOT_FILES) {
  const full = join(ROOT, f);
  if (existsSync(full)) files.push(full);
}

const problems = [];
for (const f of files) {
  const src = readFileSync(f, "utf8");
  // Strip block and line comments so internal notes do not trip the guard.
  //
  // 2026-09-08 — the opening pattern now has to be preceded by whitespace or
  // by punctuation. Without that condition a Content-Security-Policy with a
  // wildcard host in it, "https://*.sanity.io", reads as the start of a block
  // comment, because the slash and the star are adjacent. Everything from
  // there to the next star-slash in the file was being deleted before the
  // search ran, which on next.config.mjs meant the whole security header
  // block. A partner's asset domain sat inside that blind spot for four
  // hours today while this guard reported the site clean.
  const code = src
    .replace(/(^|[\s;,{(])\/\*(?:(?!\*\/)[\s\S])*?\*\//g, "$1")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
  const lines = code.split("\n");
  lines.forEach((line, i) => {
    const m = line.match(RE);
    if (m && ALLOWED_LINES.some((rx) => rx.test(line))) return;
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
