// Chapter 03 (Boss-spec yacht-page rebuild, 2026-05-08) —
// region-aware default 7-day sample itineraries.
//
// The yacht detail page already renders a "Sample 7-Day Route"
// section when `yacht.sampleItinerary.days[]` is populated in
// Sanity. Boss directive for Chapter 03: this section must show
// on EVERY yacht, not just those with a hand-curated route.
//
// Solution: when no Sanity itinerary exists, fall back to one of
// the four default routes below — picked by `yacht.cruisingRegion`.
// Each is a Boss-approved classic for its region (the routes a
// human broker would actually suggest as "your typical first
// week"). Per-day notes are intentionally written in George's
// editorial voice so they read as a personal recommendation, not
// a tour-operator brochure.
//
// Schema must mirror the Sanity-supplied shape so the existing
// rendering code in YachtPageContent.jsx stays untouched:
//   sampleItinerary: {
//     totalDistance: "≈ 110 nm",
//     days: [
//       { day: 1, from: "Athens", to: "Aegina", note: "..." },
//       ...
//     ],
//   }
//
// Per-yacht override always wins. To customise a yacht's route,
// populate the Sanity field — these defaults only kick in when it's
// empty.

export const DEFAULT_ITINERARIES = {
  saronic: {
    totalDistance: "≈ 95 nautical miles",
    days: [
      { day: 1, from: "Athens (Marina Zeas)", to: "Aegina",
        note: "A short shake-down sail across the gulf. Lunch on board, then Aegina town for an early evening walk through the pistachio orchards before dinner waterside." },
      { day: 2, from: "Aegina", to: "Poros",
        note: "Slow morning, mid-day departure. Anchor in the inner channel between Poros and the Peloponnese — protected, photogenic, the captain's favourite swim of the week." },
      { day: 3, from: "Poros", to: "Hydra",
        note: "Three hours under sail. No cars on Hydra — the donkeys carry the luggage from the quay. Sundowners at Sunset, dinner at Castello." },
      { day: 4, from: "Hydra", to: "Spetses",
        note: "Spetses earns its reputation slowly. The old harbour at dusk, the boutique town in the morning — and the channel between Spetses and the mainland is where the captain opens her up properly." },
      { day: 5, from: "Spetses", to: "Ermioni",
        note: "A quieter day. Lunch at Bisti Beach (anchorage only — no cars). Late-afternoon arrival at Ermioni, the Peloponnese fishing village that hasn't decided yet if it wants to be discovered." },
      { day: 6, from: "Ermioni", to: "Epidavros",
        note: "Half-day sail to the bay below the ancient theatre. Late lunch on board, then the optional shore excursion: 25 minutes to the 4th-century-BC stage where the acoustics still beat any concert hall built since." },
      { day: 7, from: "Epidavros", to: "Athens",
        note: "A four-hour sail home. Captain plans the timing so the last anchorage is the southern coast of Attica — final lunch, final swim, then back to Marina Zeas as the city lights come on." },
    ],
  },

  cyclades: {
    totalDistance: "≈ 180 nautical miles",
    days: [
      { day: 1, from: "Athens (Marina Zeas)", to: "Kea",
        note: "An overnight sail-and-anchor. Kea is the closest Cycladic island and the captain's favourite first night — Vourkari harbour, no crowds, the meltemi forecast review with the chef over dinner." },
      { day: 2, from: "Kea", to: "Kythnos",
        note: "Kythnos's Kolona — the double-sided beach connecting two coves — is the most-photographed anchorage in the Aegean for a reason. Swim across, walk back." },
      { day: 3, from: "Kythnos", to: "Serifos",
        note: "Six hours under sail. Dinner at Stou Stratou in Hora; the captain has a standing arrangement with the chef." },
      { day: 4, from: "Serifos", to: "Sifnos",
        note: "Half-day sail. Sifnos is the gastronomy capital of the Cyclades — Boss's recommendation: dinner at Tselementes in Apollonia, then the late drink at Omega 3." },
      { day: 5, from: "Sifnos", to: "Milos",
        note: "Milos is the geological theatre of the Aegean. Sarakiniko at dusk for the white-rock photography, Kleftiko the next morning at first light, before the day-trip boats arrive." },
      { day: 6, from: "Milos", to: "Folegandros",
        note: "Folegandros is the quietest of the Cyclades. The Hora sits 200 m above the sea on a cliff edge — sundowners on the church terrace, then dinner at Pounta." },
      { day: 7, from: "Folegandros", to: "Santorini",
        note: "Final approach to Santorini from the south so the caldera reveals itself in stages. Anchor at Ammoudi for the last lunch; disembark at Athinios in the late afternoon for the helicopter or ferry transfer." },
    ],
  },

  ionian: {
    totalDistance: "≈ 130 nautical miles",
    days: [
      { day: 1, from: "Corfu (Gouvia)", to: "Paxos",
        note: "Three-hour sail south. Lakka bay for the afternoon swim — the water clarity is unmatched in the Ionian. Dinner ashore at Diogenis." },
      { day: 2, from: "Paxos", to: "Antipaxos",
        note: "Half-hour hop. Antipaxos has two beaches — Voutoumi and Vrika — and exactly one taverna. Lunch on board, then an afternoon at the taverna's terrace as the sun goes down." },
      { day: 3, from: "Antipaxos", to: "Sivota (Mainland)",
        note: "Five hours under sail. Sivota is George's favourite quiet stop on the mainland — small harbour, three good tavernas, no megaphone announcements." },
      { day: 4, from: "Sivota", to: "Lefkada (Vasiliki)",
        note: "Lefkada is connected to the mainland by a swing bridge that opens on the hour. Vasiliki is the windsurfing capital of Europe — afternoon thermals make it the most reliable sail of the week." },
      { day: 5, from: "Lefkada", to: "Kefalonia (Fiscardo)",
        note: "The captain favours Fiscardo — the Venetian harbour escaped the 1953 earthquake, so the architecture is the original. Tassia's restaurant, table reserved." },
      { day: 6, from: "Kefalonia", to: "Ithaca",
        note: "Two-hour crossing. Vathy in the afternoon — Homer's home. The smaller anchorages on the east coast (Kioni, Frikes) for the morning." },
      { day: 7, from: "Ithaca", to: "Corfu",
        note: "A long sail north — the captain plans an early start so guests sleep in. Lunch under sail, last swim at Erikoussa, evening arrival back at Gouvia." },
    ],
  },

  // Sporades default itinerary retired 2026-05-08 — Boss directive:
  // Sporades + Dodecanese are no longer surfaced anywhere on the
  // site. Yachts whose cruisingRegion still matches "sporades" fall
  // back to the saronic loop via the final fallback below.
};

/**
 * Resolve the right itinerary for a yacht. Per-yacht Sanity field
 * always wins; otherwise we look up the default by cruisingRegion.
 * Returns null only when the yacht has no usable region and no
 * Sanity data — in that case the section won't render at all
 * (existing component behaviour stays correct).
 */
export function resolveSampleItinerary(yacht) {
  if (
    yacht?.sampleItinerary &&
    Array.isArray(yacht.sampleItinerary.days) &&
    yacht.sampleItinerary.days.length > 0
  ) {
    return { ...yacht.sampleItinerary, source: "sanity" };
  }
  const region = (yacht?.cruisingRegion || "").toLowerCase();
  // Match against substring so "Cyclades + Saronic" → first match wins.
  const slug = ["saronic", "cyclades", "ionian"].find((s) =>
    region.includes(s),
  );
  if (slug && DEFAULT_ITINERARIES[slug]) {
    return { ...DEFAULT_ITINERARIES[slug], source: "default", region: slug };
  }
  // Final fallback — the Saronic loop is the most universally
  // applicable since it starts and ends in Athens (every yacht's
  // legal home port).
  return { ...DEFAULT_ITINERARIES.saronic, source: "default", region: "saronic" };
}
