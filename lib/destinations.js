// Chapter 07 + 09 (Boss-spec, 2026-05-08) — Three Greek Worlds.
//
// Single source of truth for the three destination regions George
// Yachts specialises in (Cyclades / Ionian / Saronic). Used by:
//
//   • <ThreeGreekWorlds /> — homepage 3-card section
//   • app/destinations/[region]/page.jsx — per-region detail pages
//
// Boss directive — surfaced nowhere on these pages: yacht counts
// per region, prices per region, restaurants, hotels, generic
// sightseeing copy. The brand message everywhere is the same:
// "we know these waters better than anyone, our job is to put you
// on the right yacht." All editorial below is in George's voice
// (broker knowledge + nautical specifics + selected historical
// detail) — not travel-guide copy.
//
// Content updated 2026-05-08 (Chapter 09) with Boss's expanded
// research on each region. Major additions:
//   • Cyclades — Delos & Nea Kameni added; Sarakiniko expanded
//     with Catacombs of Milos + Venus de Milo context.
//   • Ionian — Papanikolis Cave (WWII submarine hideout),
//     Atokos (wild boar island), Skorpios (Onassis history).
//   • Saronic — Dokos Island (4500-year-old shipwreck);
//     Hydra cannon emplacements + 1821 revolution context;
//     Spetses + Bouboulina history; Epidavros theatre detail.
//
// Boss's note about Sanity CMS: a destinationPage schema is the
// natural next step so the broker can edit the picks from Sanity
// Studio. For now this static module IS the source of truth and
// the pages render server-side from it. Schema migration is
// trivial when Boss says go — the shape below maps 1:1 to a
// Sanity document type.

export const DESTINATIONS = {
  cyclades: {
    slug: "cyclades",
    label: "Cyclades",
    cardTitle: "Volcanic Drama",
    cardSubline:
      "Whitewashed cliffs. Deep blue caldera. The Aegean at its most iconic.",
    heroImage: "/images/destinations/cyclades.jpg",
    heroAlt: "Cyclades - Santorini blue-dome church above the caldera",
    pageTagline:
      "Whitewashed cliffs over the deepest blue in the Aegean.",
    intro: [
      "The Cyclades earn their reputation in stages. From a charter point of view they are the most demanding of the three regions we work - the meltemi sets up between mid-July and late August, and a captain who has not put a season in these channels has no business taking guests through them at force 6.",
      "We brief every charter on the Cyclades around three things: the yacht's stabiliser package, the captain's wind logbook, and the anchorage list. The right boat in the wrong forecast turns Folegandros into the worst day of your week. The wrong boat in the right forecast still does. Our job is to match both.",
      "What we love about these waters: the sheer geological theatre. Milos at first light, Sifnos in flat afternoon water, Santorini's caldera approached from the south so it reveals itself in stages - these are the moments the photographs you've seen don't actually capture. They earn themselves only at sea level, only off a yacht.",
    ],
    insiderPicks: [
      {
        name: "Sarakiniko, Milos",
        note: "Best at first light before the day-trip boats arrive. Anchor 8-12 m, sand and weed mix, holds well in northerlies. White volcanic rock formations that read as another planet. Nearby: the Catacombs of Milos - third most important early Christian site in the world after Rome and the Holy Land, carved into volcanic rock in the 1st century AD. The Venus de Milo was found 200 metres away. Neither of these is on any charter brochure. Both are worth a morning.",
      },
      {
        name: "Polyaigos (south coast)",
        note: "Uninhabited islet between Milos and Folegandros. Three protected coves on the south face - pick by wind direction. 6-10 m, sand patches, no traffic.",
      },
      {
        name: "Vourkari, Kea",
        note: "First stop on the standard Cyclades loop from Athens. Small harbour, well protected from the meltemi. Restaurant at the head of the quay knows the captains by name.",
      },
      {
        name: "Kolona, Kythnos",
        note: "Double-sided beach connecting two coves. Anchor in either, swim across, walk back. The captain's favourite swim of the week - every time.",
      },
      {
        name: "Apollonia, Sifnos",
        note: "Hora is a 12-minute drive from the harbour at Kamares. Best gastronomy on the Cyclades route. George has a standing arrangement at Tselementes - call ahead via the broker.",
      },
      {
        name: "Delos - The Island Where No One Can Be Born or Die",
        note: "One nautical mile southwest of Mykonos. The most sacred island in the ancient Greek world - birthplace of Apollo and Artemis, twin children of Zeus. In 426 BC, the Athenians issued a decree that remains in force today in a different form: no one may be born on Delos, no one may die there. Pregnant women and the terminally ill were transported to the neighbouring island of Rheneia. All graves were exhumed and removed. The island was to remain untouched by the human cycle of birth and death - a place suspended outside mortal time, kept pure for Apollo. Today, no one lives on Delos permanently. The decree is no longer law, but it is still physical reality: no one is born there, no one dies there. The archaeological site is one of the most significant in the Mediterranean - temples, mosaics, the Terrace of the Lions carved from Naxian marble in the 7th century BC, the Sacred Lake where Leto gave birth. Accessible only by day boat from Mykonos or by private tender. From a yacht anchored off the north coast at dusk, after the day visitors have gone, the silence has a quality that is difficult to describe. Some places hold their history in the stones. Delos holds it in the air.",
      },
      {
        name: "Nea Kameni, Santorini",
        note: "The caldera approach from the south is the standard route. But what most guests don't do: tender across to Nea Kameni, the active volcanic island in the caldera centre, and walk to the crater rim. The ground is warm underfoot. The sulphur smell is real. Then swim in the thermal springs of Palaia Kameni - water at 30-35°C, iron and mineral-rich, colour of rust where it meets the sea. This is not a postcard moment. It is a geological event. Accessible only by private tender from your anchorage - no crowds, no queues.",
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
    heroAlt: "Ionian - emerald shallow water, sailing yacht in the bay",
    pageTagline:
      "Venetian harbours under the green hills of the western coast.",
    intro: [
      "The Ionian is the family-charter region. Lighter wind in the summer, dramatically clearer water, distances between anchorages an hour or two under sail rather than four - and the green is a real green, the kind of forest cover the rest of the Aegean stops having north of Skiathos.",
      "From a brokerage perspective the Ionian rewards a different yacht profile. Catamarans hold better here because the wind doesn't fight you to the same degree, and the protected anchorages on Antipaxos, Lefkada's east coast, and Ithaca's small harbours suit a shoal draft. We push more catamaran charters in the Ionian than in the Cyclades for exactly that reason.",
      "What we love about these waters: the tavernas haven't been replaced yet. Sivota on the mainland still has three good tavernas and one harbour-master who walks the quay at 19:00. Frikes on Ithaca still has a waterline of fishing boats. And between Lefkada and Ithaca, the Ionian holds two stories that no other sea in Greece can tell.",
    ],
    insiderPicks: [
      {
        name: "Lakka, Paxos",
        note: "First swim of every Ionian week. The water clarity is unmatched - 12 m of visibility from the bow at midday. Anchor on the south side of the bay, 6-8 m, sand.",
      },
      {
        name: "Voutoumi, Antipaxos",
        note: "Anchor only - no quay. White-pebble bottom in 3-6 m, the colour of the water reads as photoshop until you see it in person. One taverna at the top of the path.",
      },
      {
        name: "Sivota, Mainland",
        note: "Quietest mainland stop on the route. Three tavernas on the quay, harbour-master walks the line at 19:00 to assign berths. Charter-friendly.",
      },
      {
        name: "Papanikolis Cave, Meganisi",
        note: "12 nautical miles from Nydri. The second largest sea cave in Greece - 120 metres long, 60 metres wide - accessible only by tender or small boat. During World War II, the Greek submarine Papanikolis used this cave as a hidden base after raids on the Italian fleet in the Adriatic. The crew would kill the engines, drift inside in total silence, and wait. The cave still holds that quality of silence. Enter by tender at low speed. Bring a torch. At the far end, a small white-sand beach that exists only for those who come by sea.",
      },
      {
        name: "Atokos",
        note: "Uninhabited private island between Lefkada and Ithaca. Part of the Natura 2000 network. Two anchorages: One House Bay (white pebbles, 4-6 m, sand, one stone chapel) and Wild Boar Beach (steep cliffs, deeper holding, shaded by trees). A resident population of wild boars descends to the beach and into the water - families, piglets, the occasional solo animal swimming 50 metres offshore. A TikTok video of two swimmers being chased reached 4 million views in 72 hours. From a private yacht at anchor, with no one else in the bay, the experience is entirely different.",
      },
      {
        name: "Skorpios",
        note: "Private island between Lefkada and Meganisi. Aristotle Onassis bought it in 1963, imported over 200 species of trees from around the world, and built harbour facilities on the north side for his yacht Christina O. He married Jacqueline Kennedy here on 20 October 1968. Maria Callas and Frank Sinatra, Grace Kelly and Prince Rainier, Winston Churchill - the guest list reads as a summary of the 20th century. The island is privately owned and landing is not permitted, but the anchorage off the southwest cove - where Jackie's beach-hut once stood - is one of the most charged pieces of water in the Ionian. Anchor in 6-8 m, sand. The history is free.",
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
    heroAlt: "Saronic - sailing yachts off Hydra, Aegean blue",
    pageTagline:
      "Athens within reach, yet worlds away - the ceremonial Aegean week.",
    intro: [
      "The Saronic Gulf is the closest of the three regions to Athens, and the most ceremonial. From Marina Zeas you can be at anchor off Aegina by lunch, in Hydra harbour by dinner, and back at the marina the following Friday without putting more than 20 nm under the keel on any one day. It's the right week for a guest list that wants the experience of a Greek charter without the meltemi forecast review.",
      "It's also the right week for the most demanding guest list. The boats that work the Saronic earn a different reputation - quieter, more discreet, more personal-service-led. Our flagships do a disproportionate share of their summer here for exactly that reason: the islands suit them, and the islands are kind to them.",
      "What we love about these waters: Hydra. There are no cars - not one. No motorbikes, no taxis, no delivery vans. The donkeys carry the luggage from the quay, exactly as they did in 1821, when Hydra committed 130 warships, 2,400 cannons, and 5,400 men to the Greek War of Independence - more naval firepower than any other island in Greece. The cannon emplacements still overlook the harbour. The families who paid for the revolution still have their mansions on the hill. Leonard Cohen lived here. Maria Callas visited. Sophia Loren filmed here. The island has always known how to attract people who notice things.",
    ],
    insiderPicks: [
      {
        name: "Hydra (main harbour)",
        note: "Stern-to on the south quay. Holding 8-12 m, sand. The donkeys handle the luggage; the captain handles the bookings. No engines on the island past the harbour mouth. The harbour is overlooked by 18th-century cannon emplacements - the same guns that covered the fleet during the 1821 Revolution.",
      },
      {
        name: "Bisti Beach, Hydra",
        note: "South-coast Hydra anchorage, no road access. 6-8 m, sand and weed, well protected from northerlies. Accessible only by tender. Lunch on board, swim, total quiet.",
      },
      {
        name: "Dokos Island",
        note: "Between Hydra and the Peloponnese. The world's oldest known shipwreck lies on the seabed here - a Late Bronze Age vessel, approximately 4,500 years old, predating the Trojan War. The wreck is a protected archaeological site. Anchoring above it in 8-12 m is unrestricted. Few guests know they are sleeping above the oldest seafaring evidence in the Mediterranean.",
      },
      {
        name: "Inner channel, Poros",
        note: "Anchorage between Poros town and the Peloponnese mainland. 4-6 m, mud and sand, holds in any wind. The narrowest navigable passage in the Saronic.",
      },
      {
        name: "Old harbour, Spetses",
        note: "Use the Dapia harbour, not the new ferry quay. Stern-to in 3-5 m, sand. Walk to town in 4 minutes. Spetses contributed its entire merchant fleet to the 1821 Revolution. The island's heroine, Laskarina Bouboulina, financed and commanded her own warships at her own expense. Her house is now a museum.",
      },
      {
        name: "Epidavros (bay below the theatre)",
        note: "Half-day sail from Spetses. Late-lunch anchorage at the foot of the 4th-century-BC theatre - optional shore excursion: 25 minutes by car to the actual stage. Acoustics still beat any concert hall built since. Seats 14,000. Still in use.",
      },
    ],
  },
};

export const REGION_SLUGS = Object.keys(DESTINATIONS);

export function getDestination(slug) {
  return DESTINATIONS[slug] || null;
}
