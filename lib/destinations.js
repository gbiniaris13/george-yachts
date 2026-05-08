// Chapter 07 (Boss-spec, 2026-05-08) — Three Greek Worlds.
//
// Single source of truth for the three destination regions George
// Yachts specialises in (Cyclades / Ionian / Saronic). Used by:
//
//   • <ThreeGreekWorlds /> — the homepage 3-card section that
//     replaces the old RegionalYachtMap
//   • app/destinations/[region]/page.jsx — the per-region detail
//     pages
//
// Boss directive on what NOT to surface: yacht counts per region,
// prices per region, restaurants, hotels, sightseeing copy. The
// brand message everywhere is the same — we know these waters
// better than anyone, our job is to put you on the right yacht.
// All editorial below is in George's voice (broker knowledge,
// nautical specifics) — not travel-guide copy.

export const DESTINATIONS = {
  cyclades: {
    slug: "cyclades",
    label: "Cyclades",
    cardTitle: "Volcanic Drama",
    cardSubline:
      "Whitewashed cliffs. Deep blue caldera. The Aegean at its most iconic.",
    heroImage: "/images/regions/cyclades/1.jpg",
    heroAlt: "Cyclades — sailing yachts at anchor, deep Aegean blue",
    pageTagline:
      "Whitewashed cliffs over the deepest blue in the Aegean.",
    intro: [
      "The Cyclades earn their reputation in stages. From a charter point of view they are the most demanding of the three regions we work — the meltemi sets up between mid-July and late August, and a captain who has not put a season in these channels has no business taking guests through them at force 6.",
      "We brief every charter on the Cyclades around three things: the yacht's stabiliser package, the captain's wind logbook, and the anchorage list. The right boat in the wrong forecast turns Folegandros into the worst day of your week. The wrong boat in the right forecast still does. Our job is to match both.",
      "What we love about these waters: the sheer geological theatre. Milos at first light, Sifnos in flat afternoon water, Santorini's caldera approached from the south so it reveals itself in stages — these are the moments the photographs you've seen don't actually capture. They earn themselves only at sea level, only off a yacht.",
    ],
    insiderPicks: [
      {
        name: "Sarakiniko, Milos",
        note: "Best at first light before the day-trip boats. Anchor 8–12 m, sand and weed mix, holds well in northerlies. White rock formations that read as another planet.",
      },
      {
        name: "Polyaigos (south coast)",
        note: "Uninhabited islet between Milos and Folegandros. Three protected coves on the south face — pick by wind direction. 6–10 m, sand patches, no traffic.",
      },
      {
        name: "Vourkari, Kea",
        note: "First stop on the standard Cyclades loop from Athens. Small harbour, well protected from the meltemi. Restaurant at the head of the quay knows the captains by name.",
      },
      {
        name: "Kolona, Kythnos",
        note: "Double-sided beach connecting two coves. Anchor in either, swim across, walk back. The captain's favourite swim of the week — every time.",
      },
      {
        name: "Apollonia, Sifnos",
        note: "Hora is a 12-minute drive from the harbour at Kamares. Best gastronomy on the Cyclades route. Boss has a standing arrangement at Tselementes — call ahead via the broker.",
      },
      {
        name: "Ammoudi Bay, Santorini",
        note: "The only sensible final-night anchorage on Santorini if you've come up from Folegandros — beneath the Oia cliffs, sunset directly over the bow.",
      },
    ],
  },

  ionian: {
    slug: "ionian",
    label: "Ionian",
    cardTitle: "Emerald Bays",
    cardSubline:
      "Venetian harbours. Lush green hills. The most dramatic coastline in Greece.",
    heroImage: "/images/regions/ionian/1.jpg",
    heroAlt: "Ionian — emerald shallow water, sailing yacht in the bay",
    pageTagline:
      "Venetian harbours under the green hills of the western coast.",
    intro: [
      "The Ionian is the family-charter region. Lighter wind in the summer, dramatically clearer water, distances between anchorages an hour or two under sail rather than four — and the green is a real green, the kind of forest cover the rest of the Aegean stops having north of Skiathos.",
      "From a brokerage perspective the Ionian rewards a different yacht profile. Catamarans hold better here because the wind doesn't fight you to the same degree, and the protected anchorages on Antipaxos / Lefkada's east coast / Ithaca's small harbours suit a shoal draft. We push more catamaran charters in the Ionian than in the Cyclades for exactly that reason.",
      "What we love about these waters: the tavernas haven't been replaced yet. Sivota on the mainland still has three good tavernas and one harbour-master who walks the quay at 19:00. Frikes on Ithaca still has a waterline of fishing boats. Fiscardo escaped the 1953 earthquake intact, so the Venetian harbour is the original one — the architecture is what Corfu used to be before it became a destination.",
    ],
    insiderPicks: [
      {
        name: "Lakka, Paxos",
        note: "First swim of every Ionian week. The water clarity is unmatched — 12 m of visibility from the bow at midday. Anchor on the south side of the bay, 6–8 m, sand.",
      },
      {
        name: "Voutoumi, Antipaxos",
        note: "Anchor only — no quay. White-pebble bottom in 3–6 m, the colour of the water reads as photoshop until you see it in person. One taverna at the top of the path.",
      },
      {
        name: "Sivota, Mainland",
        note: "Quietest mainland stop on the route. Three tavernas on the quay, harbour-master walks the line at 19:00 to assign berths. Charter-friendly.",
      },
      {
        name: "Vasiliki, Lefkada",
        note: "Windsurfing capital of Europe — afternoon thermals make this the most reliable sail of the week. Tucked-in anchorage on the east of the bay if guests prefer flat water.",
      },
      {
        name: "Fiscardo, Kefalonia",
        note: "Original Venetian harbour — escaped the 1953 earthquake. Stern-to on the west quay; book ahead at Tassia's via the broker.",
      },
      {
        name: "Kioni, Ithaca",
        note: "East-coast Ithaca, three tavernas at the head of the inlet. Anchor 4–8 m, holding is mediocre — short stay, lunch only.",
      },
    ],
  },

  saronic: {
    slug: "saronic",
    label: "Saronic",
    cardTitle: "Timeless Elegance",
    cardSubline:
      "Car-free islands. Neoclassical mansions. Athens within reach, yet worlds away.",
    heroImage: "/images/regions/saronic/1.jpg",
    heroAlt: "Saronic — sailing yachts off Hydra, Aegean blue",
    pageTagline:
      "Athens within reach, yet worlds away — the ceremonial Aegean week.",
    intro: [
      "The Saronic Gulf is the closest of the three regions to Athens, and the most ceremonial. From Marina Zeas you can be at anchor off Aegina by lunch, in Hydra harbour by dinner, and back at the marina the following Friday without putting more than 20 nm under the keel on any one day. It's the right week for a guest list that wants the experience of a Greek charter without the meltemi forecast review.",
      "It's also the right week for the most demanding guest list. The boats that work the Saronic earn a different reputation — quieter, more discreet, more personal-service-led. Our flagships do a disproportionate share of their summer here for exactly that reason: the islands suit them, and the islands are kind to them.",
      "What we love about these waters: Hydra. There are no cars. The donkeys carry the luggage from the quay. The harbour-master assigns berths in the morning by walking past your stern with a clipboard. The light at Sunset bar — the actual bar called Sunset, on the western promontory — is what photographers wait the entire summer for.",
    ],
    insiderPicks: [
      {
        name: "Hydra (main harbour)",
        note: "Stern-to on the south quay. Holding 8–12 m, sand. The donkeys handle the luggage; the captain handles the bookings (Castello, Sunset). No engines on the island past the harbour mouth.",
      },
      {
        name: "Bisti Beach, Hydra",
        note: "South-coast Hydra anchorage, no road access. 6–8 m, sand and weed, well protected from northerlies. Lunch on board, swim, no shore landing needed.",
      },
      {
        name: "Inner channel, Poros",
        note: "Anchorage between Poros town and the Peloponnese mainland. 4–6 m, mud and sand, holds in any wind. The captain's favourite swim of the Saronic week.",
      },
      {
        name: "Old harbour, Spetses",
        note: "Use the old (Dapia) harbour, not the new ferry quay. Stern-to in 3–5 m, sand. Walk to town in 4 minutes. Last drink at La Luz.",
      },
      {
        name: "Ermioni, Peloponnese",
        note: "Quiet fishing-village mainland stop between Hydra and Spetses. Two protected coves either side of the village; pick by wind. Charter-friendly.",
      },
      {
        name: "Epidavros (bay below the theatre)",
        note: "Half-day sail from Spetses. Late-lunch anchorage at the foot of the 4th-century-BC theatre — optional shore excursion: 25 minutes by car to the actual stage. Acoustics still beat any concert hall built since.",
      },
    ],
  },
};

export const REGION_SLUGS = Object.keys(DESTINATIONS);

export function getDestination(slug) {
  return DESTINATIONS[slug] || null;
}
