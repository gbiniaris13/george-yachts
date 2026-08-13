#!/usr/bin/env node
//
// The snippet guard: nothing we hand-write may be long enough for Google to cut.
//
// WHY (2026-08-13). An Ahrefs crawl reported "Meta description too long" on 9
// pages, and the live HTML confirmed it: the APA money page and the Sporades
// page were both publishing 179 characters. Google renders roughly 155 to 160
// on desktop, so the last quarter of both sentences existed only in our source
// and never in a search result.
//
// The 2026-08-06 sweep (project_snippet_hygiene_sweep) already fixed the worse
// sin, descriptions that ended mid-word because a generator used a raw .slice().
// It did not add anything that stops a NEW one being written too long by hand,
// which is exactly what happened afterwards. This is that stop.
//
// WHERE THE LIMIT COMES FROM, and why it is not 155.
// Ahrefs flags at about 165, Google truncates around 155 to 160 by pixel width
// rather than by character count, and 43 of our descriptions currently sit
// between 156 and 164. Those are deliberate, carefully written sentences that
// usually render in full. Failing on all of them would make this guard noise,
// and the lesson from the APA guard on 2026-08-11 is exact: a guard that cries
// wolf gets switched off, and then it protects nothing. So it fails at 165, the
// point where truncation stops being a maybe, and it WARNS between 156 and 164
// so the drift is visible without blocking anyone.
//
// It reads only what we type. Sanity excerpts are capped at render time in
// app/blog/[slug]/page.jsx, which is the right place for them.
//
// Run: node scripts/checkSnippetLengths.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIB = path.join(ROOT, "lib");

const DESC_FAIL = 165;
const DESC_WARN = 156;
// Titles get " | George Yachts" (16 chars) appended by the layout, and Google
// renders about 60. lib/seoTitle.js drops the brand past 70, so a bare title
// over 70 is one that will lose its brand in the result.
const TITLE_FAIL = 70;

const FIELDS = /(seoDescription|metaDescription|seoTitle)\s*:\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"/g;

const failures = [];
const warnings = [];

for (const file of fs.readdirSync(LIB).filter((f) => f.endsWith(".js"))) {
  const full = path.join(LIB, file);
  const src = fs.readFileSync(full, "utf8");
  for (const m of src.matchAll(FIELDS)) {
    const field = m[1];
    // Unescape so the measurement matches what a reader sees, not what the
    // source file spells. A description full of \" is not longer for Google.
    const text = m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const line = src.slice(0, m.index).split("\n").length;
    const where = `lib/${file}:${line}`;

    if (field === "seoTitle") {
      if (text.length > TITLE_FAIL) {
        failures.push({ where, field, len: text.length, limit: TITLE_FAIL, text });
      }
      continue;
    }
    if (text.length >= DESC_FAIL) {
      failures.push({ where, field, len: text.length, limit: DESC_FAIL, text });
    } else if (text.length >= DESC_WARN) {
      warnings.push({ where, field, len: text.length, text });
    }
  }
}

const show = (r) =>
  console.log(
    `  ${String(r.len).padStart(3)}  ${r.where}\n       ${r.text.slice(0, 120)}${r.text.length > 120 ? "..." : ""}`
  );

if (warnings.length) {
  console.log(`Snippet guard: ${warnings.length} περιγραφές στη ζώνη 156-164 (ανεκτό, όχι σφάλμα)`);
}

if (failures.length) {
  console.log(`\nSnippet guard: ΚΟΠΗΚΑΝ ${failures.length}\n`);
  failures.forEach(show);
  console.log(
    "\nΗ Google δείχνει περίπου 155 ως 160 χαρακτήρες. Ό,τι είναι πιο πάνω\n" +
      "υπάρχει μόνο στον κώδικά μας. Ξαναγράψ' το πιο σύντομο, με ολόκληρες\n" +
      "προτάσεις, ποτέ με αποσιωπητικά στη μέση φράσης."
  );
  process.exit(1);
}

console.log("Snippet guard: clean. Καμία περιγραφή δεν κόβεται, κανένας τίτλος δεν χάνει το brand.");
