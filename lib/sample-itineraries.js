/**
 * The sample week a yacht page falls back to when Sanity holds nothing.
 *
 * ── What was here before, and what it was doing ──────────────────────────
 *
 * Three hard-coded routes, one for the Saronic, one for the Cyclades and
 * one for the Ionian, chosen by the yacht's cruisingRegion field. Two
 * things were wrong with that, and both were live until 8 September.
 *
 * The first is that cruisingRegion reads " Greece" on all one hundred and
 * nine records in the dataset. It has never matched "saronic", "cyclades"
 * or "ionian" for a single yacht, so the lookup always failed and every
 * yacht without a Sanity itinerary landed on the final fallback, which was
 * the Saronic sailing loop. A twenty eight knot motor yacht was being shown
 * the same seven days as a seven knot catamaran, described as time under
 * sail.
 *
 * The second is that the day objects carried the text in a field called
 * note, and YachtPageContent.jsx reads narrative. So the copy never
 * reached a page at all: those thirty three yachts rendered a route with
 * port names, distances and not one word of description.
 *
 * ── What happens now ─────────────────────────────────────────────────────
 *
 * The fallback is not a stored route any more, it is the same planner the
 * fleet's real weeks were built with on 8 September. Given a home port, a
 * cruising speed and a hull type it lays out a circuit that the boat can
 * actually sail, from the chart of real distances in lib/cruisingGrounds.js,
 * and writes it in the same voice. A yacht added tomorrow with nothing in
 * the itinerary field gets a week that fits her rather than a week that fits
 * a catamaran somebody had in mind two years ago.
 *
 * When the yacht has no cruising speed on record it returns null and the
 * section does not render, which is the honest outcome. A route nobody can
 * check against the boat is what this file used to publish.
 */

import { planWeek } from "./itineraryPlanner.js";
import { buildDays } from "./itineraryNarrative.js";
import { PORTS } from "./cruisingGrounds.js";

/** Turn a home port as written on the page back into a chart key. */
function portKey(homePort) {
  if (!homePort) return null;
  const want = String(homePort).trim().toLowerCase();
  for (const [key, port] of Object.entries(PORTS)) {
    if (port.name.toLowerCase() === want) return key;
  }
  // The field is free text in the Studio, so accept the obvious variants
  // rather than dropping a yacht's whole itinerary over a bracket.
  if (want.includes("alimos")) return "alimos";
  if (want.includes("flisvos") || want.includes("floisvos") || want.includes("faliro")) return "flisvos";
  if (want.includes("zea") || want.includes("piraeus")) return "zea";
  if (want.includes("lavrio")) return "lavrio";
  if (want.includes("peramos")) return "neaperamos";
  if (want.includes("lefkada")) return "lefkada";
  if (want.includes("preveza")) return "preveza";
  if (want.includes("corfu") || want.includes("gouvia")) return "gouvia";
  if (want.includes("zakynthos")) return "zakynthos";
  if (want.includes("athens")) return "alimos";
  return null;
}

/**
 * Resolve the right itinerary for a yacht.
 *
 * The Sanity field always wins, because that is where a week a human wrote
 * or approved lives. Everything below it is generated.
 */
export function resolveSampleItinerary(yacht) {
  if (
    yacht?.sampleItinerary &&
    Array.isArray(yacht.sampleItinerary.days) &&
    yacht.sampleItinerary.days.length > 0
  ) {
    return { ...yacht.sampleItinerary, source: "sanity" };
  }

  // Athens is the fallback home port and not a guess about this hull: it is
  // where the house delivers, and it is what the yacht's own page says when
  // homePort has not been filled in yet.
  const base = portKey(yacht?.homePort) || "alimos";
  const plan = planWeek({
    base,
    cruiseSpeed: yacht?.cruiseSpeed,
    category: yacht?.category,
    slug: yacht?.slug || yacht?.name || "",
  });
  if (!plan) return null;

  const days = buildDays({
    ports: plan.ports,
    legs: plan.legs,
    knots: plan.knots,
    portName: (k) => PORTS[k].name,
    slug: yacht?.slug || yacht?.name || "",
  });

  return {
    days,
    totalDistance: `${plan.total} NM`,
    source: "planned",
    region: PORTS[base].ground,
  };
}
