// Shared TouristTrip JSON-LD builder + itinerary-prose parser.
//
// 2026-06-26. GEO lever: TouristTrip with an itinerary ItemList of stops makes
// a day-by-day route machine-extractable for "plan a 7-day Cyclades motor trip"
// prompts in ChatGPT / Perplexity / AI Overviews. The proven shape already
// lives inline in BottomFunnelPage.jsx and app/island/[slug]/page.jsx; this is
// the single shared builder so SeoLanding (40 duration pages + 2 itinerary
// articles) and any future caller emit one consistent TouristTrip.

const ORG = {
  "@type": "Organization",
  "@id": "https://georgeyachts.com/#organization",
  name: "George Yachts Brokerage House",
  url: "https://georgeyachts.com",
};

// Turn a prose itinerary ("Day 1: ... Day 2: ..." or "Days 1-2 ... Day 3 ...")
// into structured stops [{ day, body }]. Handles both colon and space formats
// and "Day N" / "Days N-M" ranges. Returns [] when nothing parses (the caller
// then emits no TouristTrip - no fabricated stops).
export function parseItineraryProse(text) {
  if (!text || typeof text !== "string") return [];
  const re = /\b(Days?\s+\d+(?:\s*[-–]\s*\d+)?)\s*:?\s*/g;
  const markers = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    markers.push({ label: m[1].replace(/\s+/g, " ").trim(), start: m.index, contentStart: re.lastIndex });
  }
  if (!markers.length) return [];
  const stops = [];
  for (let i = 0; i < markers.length; i++) {
    const end = i + 1 < markers.length ? markers[i + 1].start : text.length;
    const body = text.slice(markers[i].contentStart, end).replace(/[\s.;,]+$/, "").trim();
    if (body) stops.push({ day: markers[i].label, body });
  }
  return stops;
}

// Build the TouristTrip JSON-LD object. Returns null when there are no stops,
// so callers can `{trip && <script .../>}` without guarding twice.
export function buildTouristTrip({ name, description, url, stops, touristType, region }) {
  if (!Array.isArray(stops) || !stops.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#trip`,
    name,
    ...(description ? { description } : {}),
    url,
    touristType: touristType && touristType.length ? touristType : ["Yacht charterers", "Ultra-high-net-worth travellers"],
    provider: ORG,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", "@id": "https://georgeyachts.com/#organization" },
    },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: stops.length,
      itemListElement: stops.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: region ? `${region}: ${s.day}` : s.day,
          description: s.body,
        },
      })),
    },
  };
}
