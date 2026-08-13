#!/usr/bin/env node
//
// Per-page lastmod, computed rather than declared.
//
// WHY THIS EXISTS (2026-08-13)
//
// The URL Inspection API was run against all 476 sitemap URLs today. Google
// had re-crawled 44 of them since 6 August, the day the current wave of copy
// fixes started. Thirteen of our twenty highest-impression pages were last
// fetched in June or July, which means the cannibalisation fixes, the snippet
// rewrites and the exact-match FAQ work are all live and none of it has been
// seen. Seventy-three URLs are outside the index entirely, including
// /catamaran-charter-greece, whose head term draws 636 impressions a quarter
// and is currently answered by two other pages at positions 24 and 52.
//
// The sitemap itself is healthy: submitted, downloaded 12 August, zero errors.
// The problem is what it says. 469 of the 476 URLs carried the identical
// <lastmod> of 2026-08-08, because lib/contentFreshness.js tracks dates per
// content FAMILY and one family covers dozens of pages. Every one of those
// dates was honest on the day it was written. The aggregate still tells Google
// nothing: a sitemap where everything changes at once cannot answer the only
// question a crawler asks it, which is WHICH page changed. Google's own
// guidance is that lastmod is used when it is consistently accurate, and
// ignored when it is not.
//
// So the date stops being asserted and starts being derived. After a
// production build, this script hashes the rendered <main> of every prebuilt
// page. A page whose visible content is byte-identical to the last run keeps
// its previous date. A page whose content genuinely changed takes today's.
// Nothing to remember, nothing to bump by hand, and no way for a deploy that
// touched one file to claim that all 476 pages are fresh.
//
// STABILITY. The hash covers visible text only: <script>, <style> and
// <noscript> blocks are dropped, then tags, so build-volatile things that live
// in attributes (asset hashes under /_next/static, Sanity CDN image ids) never
// reach it. This matters more than it sounds. If the hash moved on every build
// we would have rebuilt the exact problem we are fixing, only harder to see.
//
// USE, and note that it is two builds, not one:
//
//   npm run build && node scripts/freshness.mjs && npm run build
//
// The first build produces the HTML this script reads. The script writes the
// manifest. The second build is the one whose sitemap actually carries the new
// dates, because app/sitemap.js imports the manifest at build time. Skipping
// the second build is harmless but pointless: the dates land one deploy late.
// On Vercel only one build runs, against the manifest committed here, which is
// the correct behaviour and the reason the file is in git.
//
//   node scripts/freshness.mjs --check       report only, writes nothing
//   node scripts/freshness.mjs --seed=x.xml  adopt an existing sitemap's dates
//   node scripts/freshness.mjs --date=Y-M-D  stamp a date other than today
//
// The manifest is committed. It is the record of when each page last really
// changed, so it must travel with the code rather than be regenerated blind.
//
// SANITY CHECK when you touch this file: run it twice against the same build.
// The second run must report zero changes. If it reports 483, something
// build-volatile has leaked into the hash and the whole mechanism is lying.

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_DIR = path.join(ROOT, ".next", "server", "app");
const MANIFEST = path.join(ROOT, "lib", "lastmodManifest.json");

const checkOnly = process.argv.includes("--check");
// Overridable so a rebuild of an old commit cannot stamp today's date on it.
const today =
  (process.argv.find((a) => a.startsWith("--date="))?.slice(7)) ||
  new Date().toISOString().slice(0, 10);

if (!fs.existsSync(BUILD_DIR)) {
  console.error(
    "Δεν υπάρχει build. Τρέξε πρώτα: npm run build\n" +
      `(έψαξα στο ${path.relative(ROOT, BUILD_DIR)})`
  );
  process.exit(1);
}

/** Every prebuilt .html under .next/server/app, as URL paths. */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/**
 * The visible text of a page's <main>, normalised.
 *
 * Falls back to <body> for the handful of routes that render without a <main>
 * (error pages, the odd tool). Returns null when neither is present, so a
 * malformed build cannot silently hash an empty string and mark everything
 * as changed.
 */
function contentOf(html) {
  const scoped =
    html.match(/<main[\s\S]*?<\/main>/i)?.[0] ||
    html.match(/<body[\s\S]*?<\/body>/i)?.[0];
  if (!scoped) return null;

  const text = scoped
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // A page with almost no text is a build artefact, not content. Hashing it
  // would churn the manifest on every unrelated deploy.
  return text.length < 200 ? null : text;
}

function urlPathOf(file) {
  const rel = path.relative(BUILD_DIR, file).replace(/\.html$/, "");
  if (rel === "index" || rel === "page") return "/";
  return "/" + rel.replace(/\/(index|page)$/, "");
}

const previous = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  : { generated: null, pages: {} };
const prevPages = previous.pages || {};

// SEEDING, and why it is not simply "today".
//
// On the very first run every page is unknown, so every page would take
// today's date and we would publish 476 identical lastmods one more time,
// having built a machine whose whole purpose is to stop doing that.
//
// The honest starting point is what we already publish. --seed reads a copy of
// the live sitemap and adopts each URL's current lastmod as its baseline, with
// no hash attached. The first real run then compares content against the build
// and moves only the pages that genuinely changed. That makes the next sitemap
// say "these three changed on the 13th, the other 473 have not moved since the
// 8th", which is precisely the sentence a crawler can act on, and it is true.
const seedArg = process.argv.find((a) => a.startsWith("--seed="))?.slice(7);
if (seedArg) {
  if (!fs.existsSync(seedArg)) {
    console.error(`Το αρχείο seed δεν υπάρχει: ${seedArg}`);
    process.exit(1);
  }
  const xml = fs.readFileSync(seedArg, "utf8");
  let seeded = 0;
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lm = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (!loc || !lm) continue;
    const url = loc.replace(/^https?:\/\/[^/]+/, "") || "/";
    if (prevPages[url]) continue;
    // No hash: the first content pass will attach one. Until then the page is
    // treated as "content unknown, date as published".
    prevPages[url] = { hash: null, lastmod: lm.slice(0, 10) };
    seeded++;
  }
  console.log(`Seed από ${path.basename(seedArg)}: ${seeded} ημερομηνίες υιοθετήθηκαν\n`);
}

const pages = {};
const changed = [];
const added = [];
let baselined = 0;
let skipped = 0;

for (const file of walk(BUILD_DIR).sort()) {
  const url = urlPathOf(file);
  const text = contentOf(fs.readFileSync(file, "utf8"));
  if (text === null) {
    skipped++;
    continue;
  }
  const hash = crypto.createHash("sha1").update(text).digest("hex").slice(0, 16);
  const before = prevPages[url];

  if (!before) {
    pages[url] = { hash, lastmod: today };
    added.push(url);
  } else if (before.hash === null) {
    // Seeded entry meeting its content for the first time. We learn what the
    // page looks like without claiming it changed today, because we have no
    // evidence that it did and inventing one would be the original sin here.
    pages[url] = { hash, lastmod: before.lastmod };
    baselined++;
  } else if (before.hash !== hash) {
    pages[url] = { hash, lastmod: today };
    changed.push(url);
  } else {
    pages[url] = before;
  }
}

// A URL that disappears from the build keeps nothing: it is either retired or
// renamed, and in both cases a stale entry would keep asserting freshness for
// a page that no longer exists.
const dropped = Object.keys(prevPages).filter((u) => !(u in pages));

const out = { generated: today, pages };

console.log(`ΦΡΕΣΚΑΔΑ ΑΝΑ ΣΕΛΙΔΑ  (${today})`);
console.log(`  σελίδες στο build      ${Object.keys(pages).length}`);
console.log(`  νέες                   ${added.length}`);
console.log(`  άλλαξε το περιεχόμενο  ${changed.length}`);
console.log(`  αμετάβλητες            ${Object.keys(pages).length - added.length - changed.length - baselined}`);
if (baselined) console.log(`  πήραν αποτύπωμα πρώτη φορά ${baselined} (κράτησαν την ημερομηνία τους)`);
if (dropped.length) console.log(`  έφυγαν από το build    ${dropped.length}`);
if (skipped) console.log(`  χωρίς κείμενο (αγνοήθηκαν) ${skipped}`);

const show = (label, list) => {
  if (!list.length) return;
  console.log(`\n  ${label}`);
  for (const u of list.slice(0, 40)) console.log(`    ${u}`);
  if (list.length > 40) console.log(`    ... και άλλες ${list.length - 40}`);
};
show("ΝΕΕΣ:", added);
show("ΑΛΛΑΞΑΝ:", changed);
show("ΕΦΥΓΑΝ:", dropped);

if (checkOnly) {
  console.log("\n--check: δεν γράφτηκε τίποτα.");
  process.exit(0);
}

fs.writeFileSync(MANIFEST, JSON.stringify(out, null, 1) + "\n");
console.log(`\nΓράφτηκε ${path.relative(ROOT, MANIFEST)}`);
