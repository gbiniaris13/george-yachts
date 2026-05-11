// G.1 (Roberto brief, May 2026) — Island landing-page definitions.
//
// Routes: /yacht-charter-mykonos, /yacht-charter-santorini, etc.
// Each island ships with: hero, whyVisit copy, yacht filter, sample
// itineraries (3 from the existing fleet's sampleItinerary data),
// seasonality copy, insider tips, FAQ.
//
// Boss/Roberto can edit these in code today; long-term path is to
// migrate to a Sanity `island` doctype (schema already drafted in
// gy-sanity-studio/schemas/island.ts) so non-engineering edits are
// possible without a deploy.

export const ISLANDS = [
  {
    slug: "mykonos",
    name: "Mykonos",
    region: "Cyclades",
    tagline: "Personally curated routes from Mykonos to Delos, Paros, and the Small Cyclades",
    whyVisit: `Mykonos is where the Aegean's social tempo lives — the most direct international flights, the deepest concentration of beach clubs and chef-led tavernas, and the only Cycladic port where a UHNW client can land at 14:00 and be on a yacht by 16:30. The smart play isn't to stay in Mykonos every night; it's to use Mykonos as a base — sleep at anchor in Ornos away from the chora crush, day-trip to Delos for the world's most cinematic archaeological site, hop to Naoussa on Paros for dinner, and return for the south-shore beach clubs when you actually want the noise. Most of our Mykonos charters spend two nights in the chora's orbit and the rest of the week in quieter Cycladic anchorages.`,
    yachtFilter: 'cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["fos", "genny", "above-beyond"],
    seasonality: `**June and early July** are Mykonos's sweetest weeks — warm enough to swim, before the Meltemi peaks, before the August surge. **Late July through August** is when Mykonos becomes Mykonos in the public imagination: peak prices, peak crowds, the south-shore beach clubs at full intensity. **September** gives you 80% of August's experience at 15-25% lower yacht rates and zero-queue restaurants. October dives into shoulder-season territory — yachts are still cruising but the chora starts to wind down.`,
    insiderTips: [
      "Anchor in Ornos Bay rather than the New Port — quieter, cleaner water, 15-minute tender to the chora.",
      "Lunch at SantAnna or Nammos requires the captain's tender shuttling, but it's a fraction of the cost of staying ashore.",
      "Delos closes at 15:00 — a 09:00 anchor, a 90-minute walk, and you're back at sea before the day-trippers arrive.",
      "The yacht-set dinner is in Naoussa on Paros, not on Mykonos — 90 minutes by tender, well worth it.",
      "If you're charter-hopping island to island, sleep on Tinos one night. It's twenty minutes from Mykonos, completely different rhythm.",
    ],
    faq: [
      {
        q: "How long does it take to get to Mykonos by yacht from Athens?",
        a: "Roughly 6–8 hours under sail or motor at typical cruising speeds. Most Mykonos charters either start with a positioning leg from Athens (Day 1) or fly clients directly into Mykonos and board there.",
      },
      {
        q: "Can I board a yacht directly in Mykonos?",
        a: "Yes — several yachts in the fleet (Fo's, Madicon if repositioned) base in or near Mykonos for the high season, and most yachts will reposition to Mykonos for charter starts at no extra cost during peak weeks.",
      },
      {
        q: "Is Mykonos worth visiting in September?",
        a: "Often more so than August. The water is warmer than June, the meltemi has eased, the prices on the yacht side drop 15-25%, and the restaurants stop being impossible to book. The party-week energy goes — but most of our charter clients consider that a feature, not a bug.",
      },
      {
        q: "How many yachts in the George Yachts fleet are good for Mykonos?",
        a: "Most of the Cyclades fleet works for a Mykonos-based charter. The matching question is more about group size, layout (catamaran vs motor yacht), and budget than geography — Mykonos is reachable for any of the Cyclades-based yachts.",
      },
      {
        q: "What's the typical cost of a Mykonos-based charter?",
        a: "Per yacht, anywhere from €15,000/week (smaller catamaran in shoulder season) to €235,000/week (50m motor yacht like La Pellegrina 1 in peak August). Per person on shared Explorer Fleet boats, from €4,200/week. Mykonos itself doesn't change the yacht rate — what changes the rate is the week of the year.",
      },
    ],
    cta: "Match me to a yacht for Mykonos →",
  },
  {
    slug: "santorini",
    name: "Santorini",
    region: "Cyclades (south)",
    tagline: "From the volcanic caldera to Folegandros, Ios, and the Small Cyclades",
    whyVisit: `Santorini is the only Greek island that justifies a charter to itself — the volcanic caldera is the most cinematic setting in the Mediterranean, and the only place to actually see it properly is from the water. Land tourists see Oia from a balcony for fifteen minutes at sunset, in a crowd of two hundred. Charter clients see the caldera at anchor for an entire evening, fly the drone, swim off the swim platform, eat dinner with the volcano in view, and wake up with the same view at 07:00 before the cruise ships arrive. Use Santorini as a starting point and the entire Southern Cyclades opens up — Folegandros at 35 NM, Ios at 30 NM, Sikinos and the Small Cyclades all within day-sail range.`,
    yachtFilter: 'cruisingRegion match "*Santorini*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["madicon", "genny", "la-pellegrina-1"],
    seasonality: `**June and September** are the consensus best months — full caldera in season, low cruise-ship density, comfortable temperatures. **July and August** are spectacular but Santorini's port (Vlyhada) and the caldera anchorages get crowded; the trade-off is heat and energy. **October** quietens dramatically; sunsets stay extraordinary, water stays swimmable on calm days. Boarding directly in Santorini saves the 95 NM positioning leg from Athens — one of the strongest arguments for a Santorini-based charter.`,
    insiderTips: [
      "Vlyhada Marina is the only protected port — book months in advance for July-August.",
      "Anchor below Oia for sunset, not below the chora. The chora's caldera-side is too steep for a comfortable swim.",
      "The drone shot of the caldera from the foredeck is the single most-shared image from a Santorini charter. Plan for it.",
      "Folegandros at 35 NM is the most-overlooked next stop — vertical chora, fortress town, no cruise ships.",
      "Skip the Akrotiri archaeological site if it's a hot day; do it as a half-day from a different port.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Santorini directly?",
        a: "Yes — Vlyhada Marina is the boarding point. Several yachts in the fleet base in or reposition to Santorini for high-season charters.",
      },
      {
        q: "How many days should a Santorini-based charter run?",
        a: "Seven days is the sweet spot — Day 1 in the caldera, Days 2-6 exploring the Southern Cyclades (Folegandros, Sikinos, Ios, Naxos, Small Cyclades), Day 7 back to Santorini for disembarkation. A 10-day charter adds Anafi or Astypalaia.",
      },
      {
        q: "Is the caldera too rough to anchor in?",
        a: "It can be in strong meltemi. Most yachts will tuck behind Oia's lee or move to a cove on the eastern side overnight, then return to the caldera for the sunset hours.",
      },
      {
        q: "Can I see the volcano from the yacht?",
        a: "Yes — Nea Kameni (the active volcanic islet) sits in the middle of the caldera. Most yachts will anchor near it briefly so you can tender across; the crater walk takes about 90 minutes.",
      },
      {
        q: "Are there yachts in the fleet that home-port in Santorini?",
        a: "S/CAT Madicon is currently the Santorini-based yacht in the fleet. Other yachts will reposition to Santorini at no extra cost for charter starts.",
      },
    ],
    cta: "Match me to a yacht for Santorini →",
  },
  {
    slug: "paros",
    name: "Paros",
    region: "Cyclades (central)",
    tagline: "From Naoussa's lantern-lit harbour to Antiparos, Despotiko, and the wider Cyclades",
    whyVisit: `Paros has quietly become the most balanced Cycladic base — close enough to Mykonos for the social calendar, far enough to keep its character, and surrounded by the best collection of secondary anchorages in the central Aegean. Naoussa is the dinner town, with Barbarossa, Mario's, and a handful of yacht-set restaurants around the small harbour. Antiparos is twenty minutes by tender — Tom Hanks's island, quieter than Mykonos by a wide margin, and the gateway to Despotiko (uninhabited islet, lunch in glass-clear water). For UHNW families that want Cyclades aesthetics without Mykonos prices, Paros is the structural answer.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["fos", "genny", "above-beyond"],
    seasonality: `**June** is Paros's quiet sweet spot — restaurants open, water swimmable, no crowd. **July and August** are full but never as intense as Mykonos. **September** is the most underrated month; the meltemi has eased, the water is at peak temperature, and Naoussa's restaurants are bookable same-day. Off-season (May, October) the chora is mostly closed but Naoussa stays partially open.`,
    insiderTips: [
      "Naoussa harbour mooring is competitive in August — anchor outside in Plastira Bay and tender in.",
      "Lunch at Despotiko is a Cycladic ritual — anchor at the islet, swim, eat aboard, late afternoon Antiparos.",
      "Skip the standard Plaka beach lunch and head to Apollonas in the north — quieter, family-run.",
      "If the meltemi is up, Paros's east coast (Piso Livadi, Drios) gives shelter Naoussa can't.",
      "From Paros, Naxos chora is 18 NM east — the most-photographed unfinished kouros is a 30-minute drive from there.",
    ],
    faq: [
      {
        q: "How does Paros compare to Mykonos for a yacht base?",
        a: "Paros is calmer, less expensive on land, and has better secondary anchorages. Mykonos has the international airport advantage and the higher-tier beach clubs. For a 7-day charter, most of our clients move between both.",
      },
      {
        q: "Can I board a yacht in Paros?",
        a: "Most yachts in the fleet position from Athens or Mykonos rather than basing on Paros, but disembarking in Paros (Naoussa) is straightforward and there's a regional airport with summer connections.",
      },
      {
        q: "What's the best week of the year for Paros?",
        a: "Mid-September. Meltemi has eased, water is at maximum temperature, restaurants are bookable, prices on the yacht side drop 15-25% from August.",
      },
      {
        q: "Is Antiparos worth a separate stop?",
        a: "Yes — most charters spend at least one full day with Antiparos as a base, anchored at Despotiko for lunch and in the Antiparos chora for the night.",
      },
      {
        q: "Are there family-friendly anchorages near Paros?",
        a: "Plaka and Pounta on the south coast offer shallow, sandy water ideal for younger swimmers. Most of the Cyclades fleet's catamarans are well-equipped for families.",
      },
    ],
    cta: "Match me to a yacht for Paros →",
  },
  {
    slug: "corfu",
    name: "Corfu",
    region: "Ionian (north)",
    tagline: "Northern Ionian charters from Corfu's Venetian capital to Paxos, Antipaxos, and the mainland coast",
    whyVisit: `Corfu is the case for a calmer week. The Ionian's water is glass-flat compared to the Cycladic Aegean, the islands are forested rather than volcanic, the cuisine leans Italian (a Venetian inheritance), and the entire week happens on shorter legs — Paxos at 45 NM, Antipaxos and Sivota at 15-20 NM. Corfu's international airport has summer connections from most of Europe; clients can land at 11:00 and be on board by 13:00. The trade-off: it's not the Cyclades. The Ionian doesn't deliver the postcard-Aegean aesthetic — but for families with younger children, sailors who want short days, and groups who'd rather drift than transit, the Ionian is the structurally better choice.`,
    yachtFilter: 'cruisingRegion match "*Ionian*" || cruisingRegion match "*Corfu*"',
    itineraryYachts: ["perseids", "my-angel", "perseids"],
    seasonality: `Ionian charters extend later than Cycladic ones. **June through early October** is comfortable. **July-August** is full but never as crowded as Mykonos or Santorini — the Ionian is a half-step quieter at every time of year. The meltemi doesn't reach the Ionian, so August's afternoon wind question never applies. **Late September** is the consensus sweet spot.`,
    insiderTips: [
      "Corfu Town's Old Fortress is best seen at sunset from the water — anchor briefly off Garitsa Bay before heading north.",
      "Paxos's Lakka and Loggos harbours are tighter than Gaios — book mooring early, August is competitive.",
      "Antipaxos's Voutoumi beach is the photo every Ionian charter ends up taking — Caribbean-blue water, white sand.",
      "From Corfu, the Albanian coast (Saranda, Butrint) is two hours away — a same-day visa-on-arrival visit changes a lot of charters' character.",
      "Don't skip the mainland — Sivota Mourtos and Parga are the Ionian's secret stops, fjord-like swimming and Venetian castle towns.",
    ],
    faq: [
      {
        q: "How does the Ionian compare to the Cyclades?",
        a: "Calmer water, shorter legs, greener islands, more Italian-influenced cuisine, no meltemi. The Cyclades have higher visual drama and the iconic Greek aesthetic; the Ionian has comfort and ease. Most second-time charterers try one then the other.",
      },
      {
        q: "Can I do a one-way Corfu-to-Athens charter?",
        a: "Possible but uncommon — most clients do a Corfu round-trip or repositioning legs are quoted separately. The straight line is roughly 350 NM, which is 4-5 days of motoring without proper stops.",
      },
      {
        q: "Are there yachts in the fleet that home-port in Corfu?",
        a: "S/CAT Perseids is the Corfu-based yacht in the Explorer Fleet. Several Private Fleet yachts will reposition to Corfu at no extra cost for charter starts.",
      },
      {
        q: "Is the Ionian good for sailing?",
        a: "Better than the Cyclades for inexperienced sailors — calmer water, shorter passages. Worse for sailing purists who want the meltemi's reliable beam reaches.",
      },
      {
        q: "What's the best week for an Ionian charter?",
        a: "Mid-September to early October. The water is at peak temperature, the meltemi (which doesn't reach the Ionian anyway) has eased on the Aegean side, and Ionian restaurants stay open later than Cycladic ones.",
      },
    ],
    cta: "Match me to a yacht for Corfu →",
  },
  {
    slug: "hydra",
    name: "Hydra",
    region: "Saronic Gulf",
    tagline: "The no-cars island in the Saronic — 90 minutes from Athens, a different century when you arrive",
    whyVisit: `Hydra is the Saronic's centerpiece — a no-cars, no-motorcycles island where every road is a stairway and every dock is a working port. The chora is an amphitheatre of 18th-century stone houses, the harbour is preserved by law, and the donkeys still do most of the cargo work. For UHNW clients that want the gentlest possible charter — short legs, no airport hassle, a quick weekend escape that feels like a real one — Hydra and the Saronic deliver. The week is shorter (5 days is the sweet spot, not 7), the legs between islands are 12-25 NM, and the entire trip starts where you land at Athens International.`,
    yachtFilter: 'cruisingRegion match "*Saronic*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["majesty-of-greece", "alia", "alena"],
    seasonality: `Saronic charters work from **May through October** — the Gulf is sheltered by the mainland, doesn't get the meltemi at full strength, and the sea temperature warms earlier and stays warmer longer than the Cyclades. **June** is the value sweet spot. **July-August** is full but the Saronic stays civilised compared to the Cyclades. **September** is consensus best.`,
    insiderTips: [
      "Anchor north of the chora at Mandraki, not in the harbour itself. Quieter, deeper water, full chora view.",
      "Donkey-led walk from harbour to Sunset Bar is a Hydra tradition — book the donkey through the harbour office.",
      "Lunch at the Sunset Bar overlooking the strait is the Saronic's most-photographed meal.",
      "Day-trip Dokos islet (10 NM) for a swim — uninhabited, the clearest water in the Saronic.",
      "Spetses is the next stop south, 18 NM. Old Harbor restaurants are the Saronic's best dinner.",
    ],
    faq: [
      {
        q: "How long does it take to get to Hydra from Athens by yacht?",
        a: "Roughly 4-5 hours under cruising speed. Most Saronic charters board in Alimos in the morning, lunch at sea, and arrive at Hydra by mid-afternoon.",
      },
      {
        q: "Can I land at Hydra by ferry and meet the yacht there?",
        a: "Yes — Hellenic Seaways runs hydrofoils from Athens (Piraeus) to Hydra year-round, 90 minutes one-way. Meeting the yacht at Hydra is a common pattern for shorter weekend charters.",
      },
      {
        q: "Is a Saronic charter worth it for less than 7 days?",
        a: "More than worth it — the Saronic is the only Greek cruising ground where 5-day charters work cleanly. The legs are short, the airport is close, and the islands stack up against each other in tight succession.",
      },
      {
        q: "Are there yachts in the fleet ideal for the Saronic?",
        a: "The smaller catamarans (Alia, Alena, Majesty of Greece) are perfect for Saronic loops — short legs, easy mooring, gentle pace. Larger motor yachts work too but can feel oversized for the islands.",
      },
      {
        q: "What's the difference between Hydra and Spetses?",
        a: "Hydra is no-cars and no-motorcycles, with a stricter preserved-aesthetic vibe. Spetses allows golf carts and bicycles, has a more open chora, and feels more residential. Most Saronic charters spend a night in each.",
      },
    ],
    cta: "Match me to a yacht for Hydra →",
  },
  {
    slug: "milos",
    name: "Milos",
    region: "Cyclades (south-west)",
    tagline: "The volcanic island of Sarakiniko, Kleftiko, and the most photographed swim spots in the Aegean",
    whyVisit: `Milos is the Cyclades' geological masterpiece — a volcanic island whose coastline reads like a sculpture park carved by wind, water, and mineral chemistry. Sarakiniko's white moonscape on the north shore is the single most-photographed anchorage in Greece for a reason: at noon the rocks glow chalk-white against impossibly blue water, at golden hour they turn pink, and there's no land equivalent of standing at anchor in the middle of it. South of the island, Kleftiko's pirate caves are unreachable by car — only yachts get the tour. Charter from a yacht based in Athens (45-50 NM) or anchor here as part of a Southern Cyclades loop. The island itself is deliberately underdeveloped on the tourism side; it stays human even in August.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["summer-fun", "crazy-horse", "imladris"],
    seasonality: `**June and September** are the consensus best months for Milos — water at peak temperature, restaurants un-mobbed, the meltemi gentle enough that the south-coast caves at Kleftiko stay accessible. **July and August** are full but Milos absorbs crowds better than Mykonos because the 70+ named beaches spread visitors across the whole coastline. **October** drops dramatically; sunsets stay extraordinary, water still swimmable on calm days. The volcanic geology means anchorages stay sheltered even when neighbouring islands get blown out.`,
    insiderTips: [
      "Arrive at Sarakiniko before 09:00 or after 18:00 — the cruise ships drop tenders at noon and 14:00.",
      "Kleftiko caves on the south coast are tender-only access; have the captain time it to mid-morning when the light is still side-lit, not overhead.",
      "Anchor for the night at Provatas or Firopotamos rather than Adamas port — quieter, cleaner water.",
      "The chora (Plaka) sits 200m above the harbour — golf-cart up for sunset, walk down through Tripiti's catacombs.",
      "Lunch at O! Hamos in Pollonia — Milos's Greece-on-a-plate restaurant, unchanged for 30 years.",
    ],
    faq: [
      {
        q: "How long does it take to reach Milos by yacht?",
        a: "Roughly 8-10 hours from Athens (Alimos) at typical cruising speeds — most Cyclades-based charters anchor at Milos as part of a 4-7 day loop rather than a one-night stop.",
      },
      {
        q: "Is Sarakiniko worth the hype?",
        a: "Yes, with timing. The geology is genuinely unique — volcanic tuff carved into a moonscape — and from a yacht at anchor you experience it the way the photographers do, not the way day-trippers do. Visit either side of midday to avoid the cruise-ship surge.",
      },
      {
        q: "What about Kleftiko?",
        a: "Kleftiko's pirate caves are on the south-west coast and have no land access — only yachts and rental tenders reach them. The light at mid-morning is the most cinematic; afternoon onwards the caves fall into shadow.",
      },
      {
        q: "Is Milos a good base for a charter, or just a stop?",
        a: "Best as a stop within a Southern Cyclades loop (Folegandros / Sifnos / Kimolos / Polyaigos). Milos has no major marina suitable for boarding most yachts; charters typically begin in Athens or Santorini and visit Milos as Day 3-5.",
      },
      {
        q: "Are there yachts in the fleet that visit Milos regularly?",
        a: "Most of the Cyclades fleet does. Summer Fun, Crazy Horse, and Imladris all include Milos in their default routes; Genny, Above & Beyond, and La Pellegrina 1 reach it comfortably as part of longer Cycladic itineraries.",
      },
    ],
    cta: "Match me to a yacht for Milos →",
  },
  // Rhodes (Dodecanese) + Skiathos (Sporades) entries retired
  // 2026-05-08 — Boss directive: those regions are no longer
  // surfaced anywhere on the site. Re-add only on explicit owner
  // direction.

  // ─────────────────────────────────────────────────────────────
  // Phase 5 (2026-05-08, Boss SEO/AI directive) — 4 new island
  // landing pages added to expand topical coverage. Each lives at
  // /yacht-charter-<slug> and ships with full schema + FAQ +
  // insider tips. Total islands live: 10.
  // ─────────────────────────────────────────────────────────────

  {
    slug: "folegandros",
    name: "Folegandros",
    region: "Cyclades (south-west)",
    tagline: "The vertical chora above the sea — Santorini's quieter, more dignified neighbour",
    whyVisit: `Folegandros is the Cycladic island UHNW charterers ask for once they've done Santorini. The chora sits on a 200-metre cliff above the sea, fortified since the Venetians, and is reached only by a switchback road from the port at Karavostasis. There are no cruise-ship piers — too vertical, too narrow — which means the island stays at the scale and tempo it had thirty years ago. From the water, the whole north coast is sheer cliff: anchoring requires the right yacht (smaller draft helps) and a captain who has been here before. The reward is Vardia Bay for the swim, Agali for the secluded lunch, and the chora at sunset with maybe forty other people in the whole town. Folegandros is what charter clients quietly recommend to their closest friends and tell no one else.`,
    yachtFilter: 'cruisingRegion match "*Folegandros*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "above-beyond", "madicon"],
    seasonality: `**Mid-June through mid-September** is the operational window — outside that, the chora restaurants close and the port becomes weather-exposed. **July** is the peak quality month: warm, calm enough most days, low crowd density even in the chora. **August** brings the Athenian holiday crowd to the chora at night but the anchorages remain quiet. **September** is the broker consensus — water still 22-24°C, restaurants still open, light golden. The Meltemi runs strongest on the north coast; experienced captains slip behind the island's south flank during peak wind days.`,
    insiderTips: [
      "Anchor in Agali Bay for the protected lunch swim — sandy bottom, small taverna ashore, water clearer than most of the Cyclades.",
      "Dinner in the chora at Pounta or Eva's Garden, not at the seafront. The chora is a 15-minute drive from the port — pre-arrange a transfer.",
      "Vardia sunset point above the chora is the photograph everyone takes; arrive 30 minutes before sunset to claim space.",
      "The Panagia Church walk above the chora takes 25 minutes uphill. Worth it before dinner, not in midday August.",
      "If the Meltemi is strong from the north, the captain will move you to Livadi or Aspropounta on the south coast — both protected, both swimmable.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Folegandros?",
        a: "No — Karavostasis is a tender port, not a yacht marina. Folegandros is always a stop within a charter starting in Athens, Santorini, or Milos. Plan it as Days 3-5 in a Southern Cyclades loop.",
      },
      {
        q: "How does Folegandros compare to Santorini?",
        a: "Same volcanic Cycladic aesthetic, one-tenth of the visitors, no cruise ships. The chora sits higher and more dramatically. Santorini wins for the caldera; Folegandros wins for the silence. Many of our return charterers do Santorini once for the photographs, then Folegandros every subsequent summer.",
      },
      {
        q: "Is Folegandros good for families with young children?",
        a: "Mixed. The chora is vertical and walkable only by older children. The swim anchorages (Agali, Vardia, Livadi) are excellent for kids. Best for families with children 8+; younger ones tire quickly on the chora climbs.",
      },
      {
        q: "What's the typical sail time from Santorini to Folegandros?",
        a: "About 35 NM — 4-5 hours under sail, 2.5-3 hours under motor. Most charters do it as a half-day passage, arriving Folegandros for lunch and the afternoon at Agali.",
      },
      {
        q: "Are there yachts in the fleet that include Folegandros in their itineraries?",
        a: "All our Cyclades and Southern-Cyclades yachts can call at Folegandros. Genny, Above & Beyond, and Madicon include it as standard on 7-day Southern Cyclades loops. Smaller catamarans handle the anchorages most comfortably.",
      },
    ],
    cta: "Match me to a yacht for Folegandros →",
  },

  {
    slug: "lefkada",
    name: "Lefkada",
    region: "Ionian (centre)",
    tagline: "The Ionian's accessible centre — Porto Katsiki beach, Lefkada Town, and the Inner Ionian loop",
    whyVisit: `Lefkada is the only Greek island connected to the mainland by bridge — which sounds like a downside until you realise it means a 3.5-hour drive from Athens delivers you to a fully-equipped yacht harbour at Lefkada Town. No flight, no ferry, no positioning leg. From there, the entire Inner Ionian opens in tight succession: Meganisi at 6 NM, Ithaca at 22 NM, Kefalonia at 30 NM, the Lefkadian west coast (Porto Katsiki, Egremni, Kathisma) at day-sail range. The water is calm, the wind is forgiving, the distances between anchorages are short. Lefkada is what we recommend to first-time charterers, to families with young children, to anyone who wants the Greek summer without the Cycladic weather chess. The trade-off: less photographic drama than the Cyclades — green hills instead of white villages. Many clients consider that an upgrade.`,
    yachtFilter: 'cruisingRegion match "*Lefkada*" || cruisingRegion match "*Ionian*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["kimata", "huayra", "alteya"],
    seasonality: `**Late May through mid-October** — the Ionian's calendar runs longer than the Aegean's. **June** is the green-hill peak: hillsides still verdant from spring rains, water 22°C, low crowds. **July-August** is the family-charter peak — calm waters, light afternoon thermal winds, every cove busy but not crowded. **September** is the gentle-water peak — water 24°C, mosquito season ending, restaurants still open. **October** is the local-favourite month: 18-22°C, restaurants quiet, the bridge-traffic from Athens dropping to weekend-only.`,
    insiderTips: [
      "Porto Katsiki has no road access from Lefkada Town that any yacht client would willingly take — visit it by yacht for the morning, drone the cliff shot, swim.",
      "Vassiliki on the south coast is the only place in Greek waters with reliable mid-afternoon thermal wind — perfect for kite-surfing days if the charter party wants water-sport time.",
      "Lefkada Town has a small but excellent yacht harbour with shore-side restaurants — useful for a halfway-week night ashore.",
      "Meganisi is the secret island next door — three villages, zero tourist buses, Atherinos Bay the most protected anchorage in the Ionian.",
      "The Lefkada-to-Ithaca route passes Skorpios (Onassis's island) on the way; ask the captain to give it a slow pass.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Lefkada?",
        a: "Yes — Lefkada Marina is a proper deep-water marina. Drive 3.5 hours from Athens, or fly to Preveza Airport (PVK, 20 minutes by road from the marina) and board there. Skips the Athens-to-Ionian repositioning leg entirely.",
      },
      {
        q: "How does the Ionian compare to the Cyclades?",
        a: "Calmer water, shorter distances between islands, less wind, greener landscape, more family-friendly. The Cyclades have the iconic Greek aesthetic; the Ionian has the Italian-influenced one — pine-clad hills, pastel architecture, lower-key restaurants. Many second-time charterers try one, then the other.",
      },
      {
        q: "Is the Ionian suitable for first-time charterers?",
        a: "It's the broker consensus best region for a first crewed-yacht charter. Sheltered water, short hops, predictable weather, less weather-aware planning required. The Cyclades demand a captain who knows the Meltemi; the Ionian forgives more.",
      },
      {
        q: "What's a typical 7-day Lefkada itinerary?",
        a: "Lefkada Town → Meganisi (Atherinos) → Ithaca (Kioni) → Kefalonia (Fiskardo) → back via Meganisi → Lefkada west coast (Porto Katsiki / Egremni) → Lefkada Town. About 150 NM total, mostly day-sails of 1-3 hours.",
      },
      {
        q: "Which yachts in the fleet operate from Lefkada?",
        a: "Kimata, Huayra, Serenissima, and several catamarans (Alteya, Summer Star) home-port in the Ionian. Most other yachts will reposition to Lefkada for charter starts at no extra cost — typically a 24-hour journey from Athens.",
      },
    ],
    cta: "Match me to a yacht for Lefkada →",
  },

  {
    slug: "spetses",
    name: "Spetses",
    region: "Saronic Gulf",
    tagline: "Horse-drawn carriages, cricket on the lawn, the closest Greece gets to a private members' club",
    whyVisit: `Spetses is the Saronic island the Athenian shipping families chose in the 1830s and never left. No private cars are allowed in the chora — transfers are by horse-drawn carriage or pre-arranged transport — and the island's social scene revolves around three institutions: Poseidonion Grand Hotel (the original 1914 belle-époque hotel), Anargyrios College (private school with manicured cricket lawns), and Spetses Town's harbour-side tavernas (Patralis, Liotrivi). The energy is unlike anywhere else in Greek waters: cosmopolitan but quiet, English-speaking but not touristic, old-money but not stiff. From a yacht, you can have the whole island at the scale of a day trip: lunch at Patralis, swim at Agia Paraskevi, dinner at the Poseidonion, sleep at anchor offshore. Most of our Saronic charters spend two nights in Spetses' orbit and use it as the social hub of the trip.`,
    yachtFilter: 'cruisingRegion match "*Spetses*" || cruisingRegion match "*Saronic*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["gigreca", "nadamas", "la-pellegrina-1"],
    seasonality: `**May through October** — Saronic is the longest-season Greek charter region. **June and September** are the broker consensus best: warm water, low crowds, full restaurant operations. **July-August** Spetses becomes the Athenian weekend destination — busier on weekends, quieter Mon-Wed. **October** is the local-favourite month — restaurants stay open, the cricket lawn turns dramatic, Athenian shipping families come down for autumn weekends.`,
    insiderTips: [
      "Anchor off Agia Paraskevi (south coast) for the protected morning swim — pine trees to the waterline, perfect sand bottom.",
      "Lunch at Patralis on the harbour: order the orzo with lobster (astakomakaronada), not the international menu.",
      "Pre-book the Poseidonion's restaurant for one dinner — book a table in the garden, not the dining room.",
      "The horse-drawn carriage from the Old Harbour to Anargyrios College is the tourist photograph; the locals walk it in 20 minutes.",
      "Bekiris Cave at the southern tip is a yacht-only swim spot — the captain anchors offshore, you swim into the cave through a low entrance.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Spetses?",
        a: "Yes, but most charters start in Athens (Alimos or Flisvos Marina, 45 minutes from Athens International Airport) and reach Spetses on Day 2 or 3. Direct boarding in Spetses is possible — the Old Harbour accommodates yachts up to 40m — but the airport-to-yacht logistics make Athens easier.",
      },
      {
        q: "How does Spetses compare to Hydra?",
        a: "Spetses is bigger (population 4,000 vs Hydra's 2,000), more cosmopolitan (international school presence, English widely spoken), and has more dining range. Hydra is more authentic, more car-free (no motorbikes either, donkeys only), more artist-colony. Both are 90 minutes apart by yacht; many Saronic charters do both.",
      },
      {
        q: "Is Spetses good for short charters from Athens?",
        a: "Best-in-class for 3-5 day charters from Athens. Day 1 Athens → Aegina or Poros lunch → Spetses for dinner. Day 2-3 Spetses + Hydra. Day 4-5 return via the inner Saronic. Total 120 NM, mostly day-sails.",
      },
      {
        q: "Are there yachts in the fleet based in Spetses?",
        a: "Gigreca and Nadamas summer in the Saronic, with Spetses as a regular call. La Pellegrina 1 and the larger motor yachts include Spetses on flexible-itinerary weeks.",
      },
      {
        q: "What's the typical cost of a Saronic charter starting in Athens?",
        a: "Saronic charters typically run 5 days rather than 7 (shorter distances, less to explore), so total cost is lower. Expect €18,000-€35,000 for a mid-range catamaran for 5 nights, €40,000-€80,000 for a motor yacht. Per-yacht-per-week rates are the same as Cycladic charters; the duration is what varies.",
      },
    ],
    cta: "Match me to a yacht for Spetses →",
  },

  {
    slug: "kefalonia",
    name: "Kefalonia",
    region: "Ionian (south)",
    tagline: "Fiskardo's Venetian elegance, Myrtos's white-pebble beach, Captain Tassia's wine cellar",
    whyVisit: `Kefalonia is the Ionian island the cinematographers picked for Captain Corelli's Mandolin and Mamma Mia 2 — for a reason. Dramatic mountains plunge straight into the sea, Myrtos Beach is the most photographed beach in Greece outside the Cyclades, and Fiskardo (the only village that survived the 1953 earthquake) is the closest you'll find to a perfectly preserved Venetian harbour in Greek waters. From a yacht, Fiskardo is the obvious base: the harbour itself is small and elegant (med-mooring on the quay, restaurants ten metres from the swim platform), and the route options open in three directions — Ithaca 8 NM east, Lefkada 30 NM north, Zakynthos 35 NM south. The island has the deepest restaurant culture in the Ionian: Captain Tassia's in Fiskardo is the legendary cooking name; Kefalonian wines (Robola, Mavrodaphne) get serious attention in the tavernas; the fish is brought to your table for selection. Many of our Ionian charterers spend two nights in Fiskardo and don't want to leave.`,
    yachtFilter: 'cruisingRegion match "*Kefalonia*" || cruisingRegion match "*Ionian*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["huayra", "kimata", "summer-star"],
    seasonality: `**May through October** — full Ionian operational season. **June** is the green-mountain peak (Kefalonia's mountains stay verdant longer than the Aegean islands'). **July-August** is the family-charter peak: warm water, calm seas, Fiskardo busy but never crowded. **September** is the broker consensus — water 24°C, wine season starting (vineyards visible), restaurants still operating fully. **October** quietens but the restaurant scene stays — the local population winters in Kefalonia, unlike Cycladic islands that empty.`,
    insiderTips: [
      "Med-moor in Fiskardo harbour itself, not the larger anchorage outside — the experience of stepping off the swim platform straight into the village is the whole point.",
      "Dinner at Tassia's Restaurant on Fiskardo's quay — Tassia is a Cordon Bleu-trained Kefalonian who has been there since the 80s. Book ahead.",
      "Myrtos Beach is reached by yacht (the road descent is hair-raising and the parking is brutal in August). Anchor off, tender to shore for the swim.",
      "Assos village above the harbour — 30 minutes by tender then a steep walk — has the best sunset photograph on Kefalonia. The Venetian fortress at the top is open until sunset.",
      "Kefalonian wines (Robola, Mavrodaphne) are not exported well — order them in the tavernas. The Gentilini and Foivos labels are the broker picks.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Kefalonia?",
        a: "Yes — Argostoli (the island capital) has a small but functional yacht marina, and Fiskardo accommodates med-mooring for yachts up to 45m. Kefalonia Airport (EFL) has summer connections from London, Manchester, Athens. Boarding in Kefalonia saves the 8-10 hour positioning leg from Athens.",
      },
      {
        q: "How does Kefalonia compare to Lefkada?",
        a: "Kefalonia has more dramatic landscape (proper mountains, vertical coastlines), more developed restaurant culture, and more famous beaches (Myrtos). Lefkada has easier access from Athens (bridge), more sheltered anchorages, and the Inner Ionian cluster of small islands. Both are 30 NM apart and most Ionian charters include both.",
      },
      {
        q: "Is Kefalonia good for a 7-day base charter?",
        a: "Yes — Fiskardo Day 1, Ithaca Day 2, Sami / Antisamos Day 3, Myrtos / Assos Day 4-5, Zakynthos (Navagio shipwreck) Day 6, back to Fiskardo Day 7. About 180 NM total.",
      },
      {
        q: "Are the Kefalonian beaches accessible by tender?",
        a: "Yes — Myrtos, Antisamos, Foki, Emblisi, Petani are all yacht-tender-accessible. Most have no shore facilities (no taverna, no umbrellas) which is exactly the point.",
      },
      {
        q: "Which yachts in the fleet visit Kefalonia regularly?",
        a: "Huayra, Kimata, and the Ionian-based catamarans (Summer Star, Alteya) include Kefalonia in every Ionian itinerary. Larger yachts (La Pellegrina 1, Above & Beyond) reach Kefalonia from Athens on extended 10-14 day Western Greece charters.",
      },
    ],
    cta: "Match me to a yacht for Kefalonia →",
  },
];

export function getIslandBySlug(slug) {
  return ISLANDS.find((i) => i.slug === slug) || null;
}
