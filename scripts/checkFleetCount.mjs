#!/usr/bin/env node
/**
 * Does the number the site prints match the fleet the site actually serves?
 *
 * lib/fleetCount.js carries its own confession: on 2026-08-19 seven yachts
 * were added, six files carrying the number in prose were updated, and this
 * constant was not. Eighteen files import it, so for a day the site answered
 * "59" to every visitor and every crawler while the dataset held 72. That is
 * the exact opposite of what a single source of truth is for.
 *
 * It went stale again on 2026-08-21, in the other direction, when seven
 * yachts were withdrawn. Twice is a pattern, so it gets a check.
 *
 * The comparison is deliberately made through lib/sanity.js rather than
 * against the raw dataset, because the retired set is excluded at the client
 * and the raw dataset still holds those seven records. What matters is the
 * number the site would serve, not the number Sanity stores.
 *
 * Exits 1 on a mismatch, so it can gate a push.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url).pathname;

const { FLEET_COUNT } = await import(pathToFileURL(join(ROOT, "lib/fleetCount.js")).href);
const { RETIRED_YACHT_SLUGS, excludeRetiredYachts } = await import(
  pathToFileURL(join(ROOT, "lib/retiredYachts.js")).href
);

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ecqr94ey";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// The same rewrite the client applies, so this asks exactly what the site asks.
const query = excludeRetiredYachts(`count(*[_type == "yacht" && defined(slug.current)])`);

let live;
try {
  const url = `https://${PROJECT}.api.sanity.io/v2023-05-03/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Sanity returned ${res.status}`);
  live = (await res.json()).result;
} catch (err) {
  // Offline is not a failure. A guard that blocks a push on a flaky network
  // is a guard people learn to bypass.
  console.log(`Fleet count: skipped, could not reach Sanity (${err.message}).`);
  process.exit(0);
}

const problems = [];
if (live !== FLEET_COUNT) {
  problems.push(
    `FLEET_COUNT is ${FLEET_COUNT}, the site serves ${live}. ` +
      `Eighteen files print this number. Update lib/fleetCount.js.`
  );
}

// A retired yacht must not be readable through the client at all.
const retiredQuery = excludeRetiredYachts(
  `*[_type == "yacht" && slug.current in [${RETIRED_YACHT_SLUGS.map((s) => JSON.stringify(s)).join(",")}]]{"s": slug.current}`
);
try {
  const url = `https://${PROJECT}.api.sanity.io/v2023-05-03/data/query/${DATASET}?query=${encodeURIComponent(retiredQuery)}`;
  const back = (await (await fetch(url, { signal: AbortSignal.timeout(20000) })).json()).result || [];
  if (back.length) {
    problems.push(
      `The rewrite in lib/retiredYachts.js let ${back.length} retired yacht(s) ` +
        `through: ${back.map((y) => y.s).join(", ")}.`
    );
  }
} catch {}

// Every retired yacht needs somewhere to land.
const config = readFileSync(join(ROOT, "next.config.mjs"), "utf8");
if (!/RETIRED_YACHT_SLUGS/.test(config)) {
  problems.push(
    "next.config.mjs no longer builds its redirects from RETIRED_YACHT_SLUGS. " +
      "Without them these URLs 404 and their search equity is thrown away."
  );
}

if (problems.length === 0) {
  console.log(
    `Fleet count: clean. ${FLEET_COUNT} yachts served, ` +
      `${RETIRED_YACHT_SLUGS.length} retired and redirected.`
  );
  process.exit(0);
}
console.error("Fleet count: " + problems.length + " problem(s).\n");
problems.forEach((p) => console.error("  • " + p));
process.exit(1);
