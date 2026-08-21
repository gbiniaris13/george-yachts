#!/usr/bin/env node
/**
 * Award guard. Sibling of checkApaClaims.mjs and checkCredentialClaims.mjs.
 *
 * An award on this site is a claim about somebody else's boat, printed on a
 * broker's page. The way it goes wrong is never a typo. It is a sentence
 * that reads like an award, gets copied forward, and turns out to have been
 * about the builder, or about a chef who left two seasons ago.
 *
 * So this checks four things:
 *
 *   1. Nothing in NEVER_CLAIM has acquired an entry. Those yachts carry
 *      award-shaped text on an agent's page that is not their award.
 *   2. Every entry names the award, the organiser and the year. Any one
 *      missing and renderable() drops it silently at runtime; this says so
 *      out loud, because a silently dropped award looks like a bug later.
 *   3. Every entry says where it was read and when.
 *   4. No free-typed "award-winning" has appeared in yacht copy outside the
 *      registry. That phrase with nothing after it is the exact shape that
 *      meant the builder on ChristAl MiO and Majesty of Greece.
 *
 * Exit 1 on a real problem, so it can gate a push.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url).pathname;

const {
  YACHT_AWARDS,
  NEVER_CLAIM,
  WITHHELD,
  renderable,
} = await import(pathToFileURL(join(ROOT, "lib/yachtAwards.js")).href);

const problems = [];
const notes = [];

// ── 1. nothing forbidden has crept in ────────────────────────────────────
for (const slug of Object.keys(NEVER_CLAIM)) {
  if (YACHT_AWARDS[slug]) {
    problems.push(
      `${slug} has an award entry, but it is on the never-claim list: ${NEVER_CLAIM[slug]}`
    );
  }
}

// ── 2 & 3. every entry is complete and sourced ───────────────────────────
let total = 0;
for (const [slug, list] of Object.entries(YACHT_AWARDS)) {
  if (!Array.isArray(list) || list.length === 0) {
    problems.push(`${slug} has an empty award list; remove the key instead.`);
    continue;
  }
  list.forEach((e, i) => {
    total++;
    const where = `${slug}[${i}]`;
    if (!renderable(e)) {
      problems.push(
        `${where} is missing one of award / organiser / year, so it will never render. ` +
          `Either complete it or move it to WITHHELD with the reason.`
      );
    }
    if (!e.source || !String(e.source).trim()) {
      problems.push(`${where} has no source. Every claim says where it was read.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(e.checked || ""))) {
      problems.push(`${where} has no checked date in YYYY-MM-DD form.`);
    }
    if (e.kind !== "vessel" && e.kind !== "crew") {
      problems.push(
        `${where} has kind "${e.kind}". A prize the hull won is "vessel"; ` +
          `one a person won is "crew", and crew awards leave when the crew do.`
      );
    }
  });
}

// ── 4. no free-typed award language in yacht copy ────────────────────────
const VAGUE = /\baward[- ]winning\b|\baward winner\b|\bwon awards\b/i;
const SEARCH_DIRS = ["app/yachts", "app/components"];
const SKIP = new Set(["node_modules", ".next", ".git"]);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(full, out);
    else if ([".js", ".jsx"].includes(extname(name))) out.push(full);
  }
  return out;
}

for (const dir of SEARCH_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file);
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments may discuss it

        // A URL is not copy. /award-winning-yacht-charter-greece is a route,
        // and the first thing this guard did on the day it was written was
        // flag the link to it. Strip hrefs and bare paths before testing, so
        // the check still catches the sentence and stops arguing with the
        // address bar.
        const copy = line
          .replace(/\bhref\s*=\s*["'`][^"'`]*["'`]/g, "")
          .replace(/["'`]\/[A-Za-z0-9/_-]+["'`]/g, "")
          .replace(/\/[a-z0-9-]*award-winning[a-z0-9-]*/gi, "");

        if (!VAGUE.test(copy)) return;
        problems.push(
          `${rel}:${i + 1} writes award language into yacht copy by hand. ` +
            `Awards belong in lib/yachtAwards.js, where they carry a source: ` +
            `${line.trim().slice(0, 90)}`
        );
      });
  }
}

// ── report ───────────────────────────────────────────────────────────────
const withheld = Object.keys(WITHHELD).length;
if (problems.length === 0) {
  notes.push(
    `Award guard: clean. ${total} claims across ${Object.keys(YACHT_AWARDS).length} yachts, ` +
      `all sourced. ${withheld} held back, ${Object.keys(NEVER_CLAIM).length} on the never-claim list.`
  );
  console.log(notes.join("\n"));
  process.exit(0);
}

console.error(`Award guard: ${problems.length} problem(s).\n`);
problems.forEach((p) => console.error("  • " + p));
process.exit(1);
