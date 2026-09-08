#!/usr/bin/env node
/**
 * Every sample week, checked against the boat that is supposed to sail it.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 *
 * On 8 September the fleet was measured for the first time and both
 * failures were live at once. ABOVE AND BEYOND, a ten knot catamaran, had a
 * ninety five mile leg in her week, which is nine and a half hours under
 * way. SEA U, a twenty five knot motor yacht, had a longest leg of thirty
 * miles, seventy minutes, a boat capable of the Cyclades being shown a week
 * she would finish by Wednesday. Eight itineraries demanded more than six
 * hours on a single leg and six wasted the hull entirely.
 *
 * Nobody wrote those on purpose. They were written per boat, by hand, over
 * two years, and never checked against the one number that decides whether
 * a week is possible. So this is checked at the same place everything else
 * is: before the commit.
 *
 * ── What fails the build ─────────────────────────────────────────────────
 *
 *   • A leg longer than the boat can cover in the hours a guest will sit
 *     still for. Four and a half at sail, three and a half under power.
 *   • A week that does not come back to the port it left.
 *   • A day that starts somewhere other than where the day before ended.
 *   • A port named that is not on the chart in lib/cruisingGrounds.js,
 *     which is how a yacht ends up sold a week in waters this house does
 *     not work. The two hulls that lie outside the operating grounds are
 *     named here, so they pass on purpose and not by omission.
 *
 * ── What is reported and not fatal ───────────────────────────────────────
 *
 *   • A yacht with no week at all.
 *   • A week that uses less than a third of what the boat could do, which
 *     is the SEA U failure and is worth seeing even when it is deliberate.
 *
 * Run: node scripts/checkItineraries.mjs
 */

import { PORTS } from "../lib/cruisingGrounds.js";
import { cruisingKnots, propulsionOf } from "../lib/itineraryPlanner.js";
import { RETIRED_YACHT_SLUGS } from "../lib/retiredYachts.js";

const PROJECT = "ecqr94ey";
const DATASET = "production";

const CEILING = { sail: 4.5, power: 3.5 };

/**
 * The two hulls whose home port is outside Athens, the Saronic, the
 * Cyclades and the Ionian. Their weeks were written before this house
 * settled on its grounds and they are George's to move or to retire, not
 * this script's. They are listed so the guard stays silent about them on
 * purpose rather than by accident.
 */
const OUTSIDE_THE_GROUNDS = new Set(["mary", "shero"]);

const QUERY = `*[_type == "yacht" && defined(slug.current)]{
  "slug": slug.current, name, category, cruiseSpeed, homePort,
  "days": sampleItinerary.days[]{day, from, to, distance}
}`;

const PORT_NAMES = new Set(Object.values(PORTS).map((p) => p.name));

async function main() {
  const url =
    `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`;

  let rows = [];
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    rows = (await res.json()).result || [];
  } catch (err) {
    console.error(`Itinerary guard: could not read the fleet (${err.message}).`);
    process.exit(1);
  }

  const fatal = [];
  const notes = [];
  let checked = 0;

  // Retired hulls only. They redirect, so nothing renders their week.
  //
  // The monohulls were skipped here for about an hour on 8 September, on the
  // reasoning that they are held back from the fleet lists. That reasoning
  // was wrong and worth writing down: being absent from a list is not being
  // absent from the site. All seven answer with a 200, all seven are in
  // sitemap.xml, and a guest arriving from a search engine reads the same
  // page as anybody else. HUAYRA was sitting there with a fifty five mile
  // leg at seven knots, seven hours and fifty minutes under way, which is
  // exactly the failure this guard was written to end. Hidden from a list is
  // not hidden from Google.
  const retired = new Set(RETIRED_YACHT_SLUGS);
  const skipped = rows.filter((y) => retired.has(y.slug));
  if (skipped.length) {
    notes.push(`${skipped.length} retired record(s) not checked, because they redirect.`);
  }

  for (const y of rows) {
    if (retired.has(y.slug)) continue;
    const days = y.days || [];
    if (!days.length) {
      notes.push(`${y.slug}: no sample week.`);
      continue;
    }
    if (OUTSIDE_THE_GROUNDS.has(y.slug)) {
      notes.push(
        `${y.slug}: home port ${y.homePort || "unrecorded"} is outside the operating grounds, so her week is left as it was written.`,
      );
      continue;
    }

    checked += 1;
    const knots = cruisingKnots(y.cruiseSpeed);
    const ceiling = CEILING[propulsionOf(y.category)];

    if (!knots) {
      notes.push(`${y.slug}: has a week but no cruising speed, so nothing can be checked against it.`);
    }

    let longest = 0;
    for (const [i, d] of days.entries()) {
      const nm = parseInt(String(d.distance || "").match(/\d+/)?.[0] || "0", 10);
      longest = Math.max(longest, nm);

      if (knots && nm) {
        const hours = nm / knots;
        if (hours > ceiling + 0.05) {
          fatal.push(
            `${y.slug}: day ${d.day}, ${d.from} to ${d.to}, is ${nm} NM. At ${knots} knots that is ` +
              `${hours.toFixed(1)} hours under way, past the ${ceiling} hour ceiling for this hull. ` +
              `That is a delivery, not a charter day.`,
          );
        }
      }

      for (const port of [d.from, d.to]) {
        if (port && !PORT_NAMES.has(port)) {
          fatal.push(
            `${y.slug}: day ${d.day} names "${port}", which is not on the chart in lib/cruisingGrounds.js. ` +
              `Either it is a typo or the yacht is being sold water this house does not work.`,
          );
        }
      }

      if (i > 0 && d.from !== days[i - 1].to) {
        fatal.push(
          `${y.slug}: day ${d.day} starts at ${d.from} but day ${d.day - 1} ended at ${days[i - 1].to}.`,
        );
      }
    }

    if (days[days.length - 1].to !== days[0].from) {
      fatal.push(
        `${y.slug}: the week leaves ${days[0].from} and ends at ${days[days.length - 1].to}. ` +
          `Guests disembark where they boarded.`,
      );
    }

    if (knots && longest && longest / knots < ceiling / 3) {
      notes.push(
        `${y.slug}: longest leg is ${longest} NM, ${(longest / knots).toFixed(1)} hours at ${knots} knots. ` +
          `The week uses very little of the boat.`,
      );
    }
  }

  if (fatal.length) {
    console.error(`Itinerary guard: ${fatal.length} problem(s).\n`);
    for (const f of fatal) console.error(`  • ${f}`);
    process.exit(1);
  }

  console.log(`Itinerary guard: clean. ${checked} week(s) checked against the boat that sails them.`);
  for (const n of notes) console.log(`  · ${n}`);
}

main();
