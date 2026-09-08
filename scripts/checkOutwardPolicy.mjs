#!/usr/bin/env node
/**
 * Nothing in the newsletter may ask Sanity for a yacht without the gate.
 *
 * ── What happened ────────────────────────────────────────────────────────
 *
 * On 8 September the auto-newsletter proposed a fleet update naming ten of
 * the twenty-seven hulls that are licensed for this website and nothing
 * else. Nothing was sent: the gate sat in lib/newsletter/sanity-yachts.js,
 * which composes a body, and it refused. But the gate was not in
 * content-selector.js, which decides what to write about, nor in
 * auto-bridge.js, which is the letter that goes to travel advisors and is
 * therefore the B2B channel George named first when he set the rule. So the
 * same batch would have been proposed again on every run, and the whole
 * newsletter would have stayed jammed behind ten yachts that can never go
 * out.
 *
 * Three files, one of them gated. That is not a rule, it is a habit, and
 * this makes it a rule: any file under lib/newsletter that asks Sanity for
 * a yacht has to call the gate in the same file.
 *
 * It also checks that the list can actually be read, and that the two
 * copies agree. A gate that clears nobody is safe and invisible, which is
 * exactly the state this site was in for a day.
 *
 * Run: node scripts/checkOutwardPolicy.mjs
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const DIR = join(ROOT, "lib", "newsletter");
const GATE = /filterOutwardAllowed|outwardBlockReason/;
const ASKS_FOR_A_YACHT = /_type\s*==\s*"yacht"/;

const problems = [];

for (const name of readdirSync(DIR)) {
  if (!name.endsWith(".js")) continue;
  const src = readFileSync(join(DIR, name), "utf8");
  if (!ASKS_FOR_A_YACHT.test(src)) continue;
  if (!GATE.test(src)) {
    problems.push(
      `lib/newsletter/${name} queries yachts and never calls the outward gate. ` +
        `Import filterOutwardAllowed from lib/socialPolicy and filter before anything ` +
        `downstream sees the rows.`,
    );
  }
}

// The list itself. Read straight from the database rather than through the
// module, because the module caches and returns null on every failure, and
// the difference between "nobody is cleared" and "the row is missing" is
// the whole point of this check.
async function readPolicy(url, key) {
  if (!url || !key) return { ok: false, why: "not configured" };
  try {
    const res = await fetch(
      `${url}/rest/v1/settings?select=value&key=eq.yacht_social_policy_v1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) return { ok: false, why: `HTTP ${res.status}` };
    const rows = await res.json();
    if (!rows?.length) return { ok: false, why: "no row" };
    const raw = rows[0].value;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const list = parsed?.allowed;
    if (!Array.isArray(list) || !list.length) return { ok: false, why: "empty list" };
    return { ok: true, allowed: new Set(list.map((s) => String(s).trim().toLowerCase())) };
  } catch (err) {
    return { ok: false, why: err.message };
  }
}

const site = await readPolicy(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const crm = await readPolicy(process.env.GYC_SUPABASE_URL, process.env.GYC_SUPABASE_SERVICE_ROLE_KEY);
const notes = [];

if (!site.ok && !crm.ok) {
  notes.push(
    `the policy could not be read (site: ${site.why}, CRM: ${crm.why}). ` +
      `Nothing will go out naming any yacht until it can. Safe, but the newsletter is stopped.`,
  );
} else if (site.ok && crm.ok) {
  const only = (a, b) => [...a].filter((s) => !b.has(s));
  const a = only(site.allowed, crm.allowed);
  const b = only(crm.allowed, site.allowed);
  if (a.length || b.length) {
    problems.push(
      `the two copies of the list disagree. Only in the site's database: ` +
        `${a.join(", ") || "none"}. Only in the CRM: ${b.join(", ") || "none"}. ` +
        `The CRM is where the list is edited, so copy it across.`,
    );
  } else {
    notes.push(`both copies of the list agree, ${site.allowed.size} yachts cleared to leave the site.`);
  }
} else {
  const one = site.ok ? site : crm;
  notes.push(`${one.allowed.size} yachts cleared to leave the site (one copy readable).`);
}

if (problems.length) {
  console.error(`Outward policy guard: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  • ${p}`);
  process.exit(1);
}
console.log("Outward policy guard: clean. Every newsletter yacht query passes the gate.");
for (const n of notes) console.log(`  · ${n}`);
