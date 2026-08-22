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
  HONOURS,
  TIERS,
  renderable,
  honoursFor,
  PLACED_BY,
  PERMITTED_HOUSES,
} = await import(pathToFileURL(join(ROOT, "lib/yachtAwards.js")).href);

const problems = [];
const notes = [];

const VAGUE = /\baward[- ]winning\b|\baward winner\b|\bwon awards\b/i;

// ── 1. nothing forbidden has crept in ────────────────────────────────────
// NEVER_CLAIM is keyed by the claim now, not by the slug, because a yacht can
// carry a builder's boast on her agent's page AND a placing her own crew won.
// What must never happen is the boast becoming the claim, so the test is that
// the forbidden WORDING has not turned up in the registry.
for (const [id, entry] of Object.entries(NEVER_CLAIM)) {
  const { slug, reason } = entry;
  if (!slug || !reason) {
    problems.push(`NEVER_CLAIM["${id}"] needs both a slug and a reason.`);
    continue;
  }
  for (const e of YACHT_AWARDS[slug] || []) {
    if (VAGUE.test(String(e.award || "")) || /builder|shipyard|model/i.test(String(e.competition || ""))) {
      problems.push(
        `${slug} has an award entry that reads like the forbidden claim ` +
          `"${id}": ${reason}`
      );
    }
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
    // Structure added 2026-08-21 so the page can print a rank marker and a
    // bracket without regexing the organiser's own wording at render time.
    if (![1, 2, 3].includes(e.rank)) {
      problems.push(
        `${where} has rank ${JSON.stringify(e.rank)}. Every placing on this ` +
          `site is a 1, a 2 or a 3, printed as itself. There is no fourth value.`
      );
    }
    if (!e.competition || !String(e.competition).trim()) {
      problems.push(
        `${where} names no competition. "1st Place Diamond" alone does not ` +
          `tell a reader what was won.`
      );
    }
    if (e.tier && !Object.prototype.hasOwnProperty.call(TIERS, e.tier)) {
      problems.push(
        `${where} has tier "${e.tier}", which lib/yachtAwards.js TIERS cannot ` +
          `explain. A bracket the page cannot define should be null.`
      );
    }
    if (e.kind !== "vessel" && e.kind !== "crew") {
      problems.push(
        `${where} has kind "${e.kind}". A prize the hull won is "vessel"; ` +
          `one a person won is "crew", and crew awards leave when the crew do.`
      );
    }
  });
}

// ── 3b. honours are held to the same standard as placings ────────────────
// They sit outside the placing count on purpose, which makes them easier to
// let slip. Same three facts, same source, same date.
let honourCount = 0;
for (const [slug, list] of Object.entries(HONOURS || {})) {
  if (!Array.isArray(list) || list.length === 0) {
    problems.push(`HONOURS["${slug}"] is empty; remove the key instead.`);
    continue;
  }
  if (honoursFor(slug).length !== list.length) {
    problems.push(
      `HONOURS["${slug}"] holds an entry missing one of award / organiser / ` +
        `year, so it will silently vanish at render time.`
    );
  }
  list.forEach((e, i) => {
    honourCount++;
    if (!e.source || !String(e.source).trim()) {
      problems.push(`HONOURS["${slug}"][${i}] has no source.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(e.checked || ""))) {
      problems.push(`HONOURS["${slug}"][${i}] has no checked date in YYYY-MM-DD form.`);
    }
    if (YACHT_AWARDS[slug]?.some((a) => a.year === e.year && a.award === e.award)) {
      problems.push(
        `HONOURS["${slug}"][${i}] duplicates a placing in YACHT_AWARDS, which ` +
          `would count it twice in the totals.`
      );
    }
  });
}

// ── 3c. every awarded yacht comes from a house we may place ──────────────
// The permission question. A yacht outside FX, FYLY or Istion is one we have
// no right to publish, and an award is the most quotable thing on the site,
// so it is the worst place for that mistake to sit unnoticed.
for (const slug of [...Object.keys(YACHT_AWARDS), ...Object.keys(HONOURS || {})]) {
  const house = PLACED_BY[slug];
  if (!house) {
    problems.push(
      `${slug} carries a distinction but no entry in PLACED_BY. Record which ` +
        `of ${PERMITTED_HOUSES.join(", ")} shows her, and how that was checked.`
    );
  } else if (!PERMITTED_HOUSES.includes(house)) {
    problems.push(
      `${slug} is recorded as placed by "${house}", which is not one of ` +
        `${PERMITTED_HOUSES.join(", ")}. We have no permission to publish her.`
    );
  }
}

// ── 4. no free-typed award language in yacht copy ────────────────────────
const SEARCH_DIRS = ["app/yachts", "app/components"];

/**
 * The two files allowed to write the phrase, each with the reason.
 *
 * The rule exists to stop a sentence that reads like an award and turns out
 * to be about the builder. It is not there to stop a heading that sits
 * directly on top of twenty-five placings, each naming its competition, its
 * bracket, its organiser and its year, and each carrying a source. In those
 * two files the phrase is the summary of the evidence underneath it.
 *
 * Everywhere else it stays banned, which is the whole fleet.
 */
const PHRASE_ALLOWED = new Map([
  ["app/components/AwardedFleet.jsx",
   "the homepage band; the phrase heads a list of every sourced placing"],
  // 2026-08-21. A navigation label, not a claim about a hull. It is the
  // anchor text of the footer link to /award-winning-yacht-charter-greece,
  // whose entire content is the sourced register: sixteen yachts, thirty-two
  // placings, each with its competition, organiser, year and source.
  //
  // The rule this guard enforces is that award language must not float free
  // of its evidence. Here the words ARE the route to the evidence, one click
  // away on every page of the site, which is the opposite of the failure it
  // was written to catch. Anything in this file that describes a specific
  // yacht is still caught, because the exemption is per file and this file
  // names no yachts.
  ["app/components/Footer.jsx",
   "anchor text of the sitewide link to the sourced awards register"],
  // 2026-08-22, same reasoning as the footer: the main menu's link to the
  // register. Anchor text pointing AT the evidence, naming no yacht.
  ["app/components/NavDrawerSystem.jsx",
   "main-menu anchor text of the link to the sourced awards register"],
]);
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
    if (PHRASE_ALLOWED.has(rel)) {
      notes.push(`Award guard: phrase allowed in ${rel} (${PHRASE_ALLOWED.get(rel)}).`);
      continue;
    }
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
    `Award guard: clean. ${total} placings across ${Object.keys(YACHT_AWARDS).length} yachts, ` +
      `plus ${honourCount} honour(s) held apart. All sourced. ${withheld} held back, ` +
      `${Object.keys(NEVER_CLAIM).length} on the never-claim list.`
  );
  console.log(notes.join("\n"));
  process.exit(0);
}

console.error(`Award guard: ${problems.length} problem(s).\n`);
problems.forEach((p) => console.error("  • " + p));
process.exit(1);
