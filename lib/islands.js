// G.1 (Roberto brief, May 2026)  -  Island landing-page definitions.
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
    whyVisit: `Mykonos is where the Aegean's social tempo lives  -  the most direct international flights, the deepest concentration of beach clubs and chef-led tavernas, and the only Cycladic port where a UHNW client can land at 14:00 and be on a yacht by 16:30. The smart play isn't to stay in Mykonos every night; it's to use Mykonos as a base  -  sleep at anchor in Ornos away from the chora crush, day-trip to Delos for the world's most cinematic archaeological site, hop to Naoussa on Paros for dinner, and return for the south-shore beach clubs when you actually want the noise. Most of our Mykonos charters spend two nights in the chora's orbit and the rest of the week in quieter Cycladic anchorages.`,
    yachtFilter: 'cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["fos", "genny", "above-beyond"],
    seasonality: `**June and early July** are Mykonos's sweetest weeks  -  warm enough to swim, before the Meltemi peaks, before the August surge. **Late July through August** is when Mykonos becomes Mykonos in the public imagination: peak prices, peak crowds, the south-shore beach clubs at full intensity. **September** gives you 80% of August's experience at 15-25% lower yacht rates and zero-queue restaurants. October dives into shoulder-season territory  -  yachts are still cruising but the chora starts to wind down.`,
    insiderTips: [
      "Anchor in Ornos Bay rather than the New Port  -  quieter, cleaner water, 15-minute tender to the chora.",
      "Lunch at SantAnna or Nammos requires the captain's tender shuttling, but it's a fraction of the cost of staying ashore.",
      "Delos closes at 15:00  -  a 09:00 anchor, a 90-minute walk, and you're back at sea before the day-trippers arrive.",
      "The yacht-set dinner is in Naoussa on Paros, not on Mykonos  -  90 minutes by tender, well worth it.",
      "If you're charter-hopping island to island, sleep on Tinos one night. It's twenty minutes from Mykonos, completely different rhythm.",
    ],
    faq: [
      {
        q: "How long does it take to get to Mykonos by yacht from Athens?",
        a: "Roughly 6–8 hours under sail or motor at typical cruising speeds. Most Mykonos charters either start with a positioning leg from Athens (Day 1) or fly clients directly into Mykonos and board there.",
      },
      {
        q: "Can I board a yacht directly in Mykonos?",
        a: "Yes  -  several yachts in the fleet (Fo's, Madicon if repositioned) base in or near Mykonos for the high season, and most yachts will reposition to Mykonos for charter starts at no extra cost during peak weeks.",
      },
      {
        q: "Is Mykonos worth visiting in September?",
        a: "Often more so than August. The water is warmer than June, the meltemi has eased, the prices on the yacht side drop 15-25%, and the restaurants stop being impossible to book. The party-week energy goes  -  but most of our charter clients consider that a feature, not a bug.",
      },
      {
        q: "How many yachts in the George Yachts fleet are good for Mykonos?",
        a: "Most of the Cyclades fleet works for a Mykonos-based charter. The matching question is more about group size, layout (catamaran vs motor yacht), and budget than geography  -  Mykonos is reachable for any of the Cyclades-based yachts.",
      },
      {
        q: "What's the typical cost of a Mykonos-based charter?",
        a: "Per yacht, anywhere from €15,000/week (smaller catamaran in shoulder season) to €235,000/week (50m motor yacht like La Pellegrina 1 in peak August). Per person on shared Explorer Fleet boats, from €4,200/week. Mykonos itself doesn't change the yacht rate  -  what changes the rate is the week of the year.",
      },
    ],
    cta: "Match me to a yacht for Mykonos →",
  },
  {
    slug: "santorini",
    name: "Santorini",
    region: "Cyclades (south)",
    tagline: "From the volcanic caldera to Folegandros, Ios, and the Small Cyclades",
    whyVisit: `Santorini is the only Greek island that justifies a charter to itself  -  the volcanic caldera is the most cinematic setting in the Mediterranean, and the only place to actually see it properly is from the water. Land tourists see Oia from a balcony for fifteen minutes at sunset, in a crowd of two hundred. Charter clients see the caldera at anchor for an entire evening, fly the drone, swim off the swim platform, eat dinner with the volcano in view, and wake up with the same view at 07:00 before the cruise ships arrive. Use Santorini as a starting point and the entire Southern Cyclades opens up  -  Folegandros at 35 NM, Ios at 30 NM, Sikinos and the Small Cyclades all within day-sail range.`,
    yachtFilter: 'cruisingRegion match "*Santorini*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["madicon", "genny", "la-pellegrina-1"],
    seasonality: `**June and September** are the consensus best months  -  full caldera in season, low cruise-ship density, comfortable temperatures. **July and August** are spectacular but Santorini's port (Vlyhada) and the caldera anchorages get crowded; the trade-off is heat and energy. **October** quietens dramatically; sunsets stay extraordinary, water stays swimmable on calm days. Boarding directly in Santorini saves the 95 NM positioning leg from Athens  -  one of the strongest arguments for a Santorini-based charter.`,
    insiderTips: [
      "Vlyhada Marina is the only protected port  -  book months in advance for July-August.",
      "Anchor below Oia for sunset, not below the chora. The chora's caldera-side is too steep for a comfortable swim.",
      "The drone shot of the caldera from the foredeck is the single most-shared image from a Santorini charter. Plan for it.",
      "Folegandros at 35 NM is the most-overlooked next stop  -  vertical chora, fortress town, no cruise ships.",
      "Skip the Akrotiri archaeological site if it's a hot day; do it as a half-day from a different port.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Santorini directly?",
        a: "Yes  -  Vlyhada Marina is the boarding point. Several yachts in the fleet base in or reposition to Santorini for high-season charters.",
      },
      {
        q: "How many days should a Santorini-based charter run?",
        a: "Seven days is the sweet spot  -  Day 1 in the caldera, Days 2-6 exploring the Southern Cyclades (Folegandros, Sikinos, Ios, Naxos, Small Cyclades), Day 7 back to Santorini for disembarkation. A 10-day charter adds Anafi or Astypalaia.",
      },
      {
        q: "Is the caldera too rough to anchor in?",
        a: "It can be in strong meltemi. Most yachts will tuck behind Oia's lee or move to a cove on the eastern side overnight, then return to the caldera for the sunset hours.",
      },
      {
        q: "Can I see the volcano from the yacht?",
        a: "Yes  -  Nea Kameni (the active volcanic islet) sits in the middle of the caldera. Most yachts will anchor near it briefly so you can tender across; the crater walk takes about 90 minutes.",
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
    whyVisit: `Paros has quietly become the most balanced Cycladic base  -  close enough to Mykonos for the social calendar, far enough to keep its character, and surrounded by the best collection of secondary anchorages in the central Aegean. Naoussa is the dinner town, with Barbarossa, Mario's, and a handful of yacht-set restaurants around the small harbour. Antiparos is twenty minutes by tender  -  Tom Hanks's island, quieter than Mykonos by a wide margin, and the gateway to Despotiko (uninhabited islet, lunch in glass-clear water). For UHNW families that want Cyclades aesthetics without Mykonos prices, Paros is the structural answer.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["fos", "genny", "above-beyond"],
    seasonality: `**June** is Paros's quiet sweet spot  -  restaurants open, water swimmable, no crowd. **July and August** are full but never as intense as Mykonos. **September** is the most underrated month; the meltemi has eased, the water is at peak temperature, and Naoussa's restaurants are bookable same-day. Off-season (May, October) the chora is mostly closed but Naoussa stays partially open.`,
    insiderTips: [
      "Naoussa harbour mooring is competitive in August  -  anchor outside in Plastira Bay and tender in.",
      "Lunch at Despotiko is a Cycladic ritual  -  anchor at the islet, swim, eat aboard, late afternoon Antiparos.",
      "Skip the standard Plaka beach lunch and head to Apollonas in the north  -  quieter, family-run.",
      "If the meltemi is up, Paros's east coast (Piso Livadi, Drios) gives shelter Naoussa can't.",
      "From Paros, Naxos chora is 18 NM east  -  the most-photographed unfinished kouros is a 30-minute drive from there.",
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
        a: "Yes  -  most charters spend at least one full day with Antiparos as a base, anchored at Despotiko for lunch and in the Antiparos chora for the night.",
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
    whyVisit: `Corfu is the case for a calmer week. The Ionian's water is glass-flat compared to the Cycladic Aegean, the islands are forested rather than volcanic, the cuisine leans Italian (a Venetian inheritance), and the entire week happens on shorter legs  -  Paxos at 45 NM, Antipaxos and Sivota at 15-20 NM. Corfu's international airport has summer connections from most of Europe; clients can land at 11:00 and be on board by 13:00. The trade-off: it's not the Cyclades. The Ionian doesn't deliver the postcard-Aegean aesthetic  -  but for families with younger children, sailors who want short days, and groups who'd rather drift than transit, the Ionian is the structurally better choice.`,
    yachtFilter: 'cruisingRegion match "*Ionian*" || cruisingRegion match "*Corfu*"',
    itineraryYachts: ["perseids", "my-angel", "perseids"],
    seasonality: `Ionian charters extend later than Cycladic ones. **June through early October** is comfortable. **July-August** is full but never as crowded as Mykonos or Santorini  -  the Ionian is a half-step quieter at every time of year. The meltemi doesn't reach the Ionian, so August's afternoon wind question never applies. **Late September** is the consensus sweet spot.`,
    insiderTips: [
      "Corfu Town's Old Fortress is best seen at sunset from the water  -  anchor briefly off Garitsa Bay before heading north.",
      "Paxos's Lakka and Loggos harbours are tighter than Gaios  -  book mooring early, August is competitive.",
      "Antipaxos's Voutoumi beach is the photo every Ionian charter ends up taking  -  Caribbean-blue water, white sand.",
      "From Corfu, the Albanian coast (Saranda, Butrint) is two hours away  -  a same-day visa-on-arrival visit changes a lot of charters' character.",
      "Don't skip the mainland  -  Sivota Mourtos and Parga are the Ionian's secret stops, fjord-like swimming and Venetian castle towns.",
    ],
    faq: [
      {
        q: "How does the Ionian compare to the Cyclades?",
        a: "Calmer water, shorter legs, greener islands, more Italian-influenced cuisine, no meltemi. The Cyclades have higher visual drama and the iconic Greek aesthetic; the Ionian has comfort and ease. Most second-time charterers try one then the other.",
      },
      {
        q: "Can I do a one-way Corfu-to-Athens charter?",
        a: "Possible but uncommon  -  most clients do a Corfu round-trip or repositioning legs are quoted separately. The straight line is roughly 350 NM, which is 4-5 days of motoring without proper stops.",
      },
      {
        q: "Are there yachts in the fleet that home-port in Corfu?",
        a: "S/CAT Perseids is the Corfu-based yacht in the Explorer Fleet. Several Private Fleet yachts will reposition to Corfu at no extra cost for charter starts.",
      },
      {
        q: "Is the Ionian good for sailing?",
        a: "Better than the Cyclades for inexperienced sailors  -  calmer water, shorter passages. Worse for sailing purists who want the meltemi's reliable beam reaches.",
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
    tagline: "The no-cars island in the Saronic  -  90 minutes from Athens, a different century when you arrive",
    whyVisit: `Hydra is the Saronic's centerpiece  -  a no-cars, no-motorcycles island where every road is a stairway and every dock is a working port. The chora is an amphitheatre of 18th-century stone houses, the harbour is preserved by law, and the donkeys still do most of the cargo work. For UHNW clients that want the gentlest possible charter  -  short legs, no airport hassle, a quick weekend escape that feels like a real one  -  Hydra and the Saronic deliver. The week is shorter (5 days is the sweet spot, not 7), the legs between islands are 12-25 NM, and the entire trip starts where you land at Athens International.`,
    yachtFilter: 'cruisingRegion match "*Saronic*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["majesty-of-greece", "alia", "alena"],
    seasonality: `Saronic charters work from **May through October**  -  the Gulf is sheltered by the mainland, doesn't get the meltemi at full strength, and the sea temperature warms earlier and stays warmer longer than the Cyclades. **June** is the value sweet spot. **July-August** is full but the Saronic stays civilised compared to the Cyclades. **September** is consensus best.`,
    insiderTips: [
      "Anchor north of the chora at Mandraki, not in the harbour itself. Quieter, deeper water, full chora view.",
      "Donkey-led walk from harbour to Sunset Bar is a Hydra tradition  -  book the donkey through the harbour office.",
      "Lunch at the Sunset Bar overlooking the strait is the Saronic's most-photographed meal.",
      "Day-trip Dokos islet (10 NM) for a swim  -  uninhabited, the clearest water in the Saronic.",
      "Spetses is the next stop south, 18 NM. Old Harbor restaurants are the Saronic's best dinner.",
    ],
    faq: [
      {
        q: "How long does it take to get to Hydra from Athens by yacht?",
        a: "Roughly 4-5 hours under cruising speed. Most Saronic charters board in Alimos in the morning, lunch at sea, and arrive at Hydra by mid-afternoon.",
      },
      {
        q: "Can I land at Hydra by ferry and meet the yacht there?",
        a: "Yes  -  Hellenic Seaways runs hydrofoils from Athens (Piraeus) to Hydra year-round, 90 minutes one-way. Meeting the yacht at Hydra is a common pattern for shorter weekend charters.",
      },
      {
        q: "Is a Saronic charter worth it for less than 7 days?",
        a: "More than worth it  -  the Saronic is the only Greek cruising ground where 5-day charters work cleanly. The legs are short, the airport is close, and the islands stack up against each other in tight succession.",
      },
      {
        q: "Are there yachts in the fleet ideal for the Saronic?",
        a: "The smaller catamarans (Alia, Alena, Majesty of Greece) are perfect for Saronic loops  -  short legs, easy mooring, gentle pace. Larger motor yachts work too but can feel oversized for the islands.",
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
    whyVisit: `Milos is the Cyclades' geological masterpiece  -  a volcanic island whose coastline reads like a sculpture park carved by wind, water, and mineral chemistry. Sarakiniko's white moonscape on the north shore is the single most-photographed anchorage in Greece for a reason: at noon the rocks glow chalk-white against impossibly blue water, at golden hour they turn pink, and there's no land equivalent of standing at anchor in the middle of it. South of the island, Kleftiko's pirate caves are unreachable by car  -  only yachts get the tour. Charter from a yacht based in Athens (45-50 NM) or anchor here as part of a Southern Cyclades loop. The island itself is deliberately underdeveloped on the tourism side; it stays human even in August.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["summer-fun", "crazy-horse", "imladris"],
    seasonality: `**June and September** are the consensus best months for Milos  -  water at peak temperature, restaurants un-mobbed, the meltemi gentle enough that the south-coast caves at Kleftiko stay accessible. **July and August** are full but Milos absorbs crowds better than Mykonos because the 70+ named beaches spread visitors across the whole coastline. **October** drops dramatically; sunsets stay extraordinary, water still swimmable on calm days. The volcanic geology means anchorages stay sheltered even when neighbouring islands get blown out.`,
    insiderTips: [
      "Arrive at Sarakiniko before 09:00 or after 18:00  -  the cruise ships drop tenders at noon and 14:00.",
      "Kleftiko caves on the south coast are tender-only access; have the captain time it to mid-morning when the light is still side-lit, not overhead.",
      "Anchor for the night at Provatas or Firopotamos rather than Adamas port  -  quieter, cleaner water.",
      "The chora (Plaka) sits 200m above the harbour  -  golf-cart up for sunset, walk down through Tripiti's catacombs.",
      "Lunch at O! Hamos in Pollonia  -  Milos's Greece-on-a-plate restaurant, unchanged for 30 years.",
    ],
    faq: [
      {
        q: "How long does it take to reach Milos by yacht?",
        a: "Roughly 8-10 hours from Athens (Alimos) at typical cruising speeds  -  most Cyclades-based charters anchor at Milos as part of a 4-7 day loop rather than a one-night stop.",
      },
      {
        q: "Is Sarakiniko worth the hype?",
        a: "Yes, with timing. The geology is genuinely unique  -  volcanic tuff carved into a moonscape  -  and from a yacht at anchor you experience it the way the photographers do, not the way day-trippers do. Visit either side of midday to avoid the cruise-ship surge.",
      },
      {
        q: "What about Kleftiko?",
        a: "Kleftiko's pirate caves are on the south-west coast and have no land access  -  only yachts and rental tenders reach them. The light at mid-morning is the most cinematic; afternoon onwards the caves fall into shadow.",
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
  // 2026-05-08  -  Boss directive: those regions are no longer
  // surfaced anywhere on the site. Re-add only on explicit owner
  // direction.

  // ─────────────────────────────────────────────────────────────
  // Phase 5 (2026-05-08, Boss SEO/AI directive)  -  4 new island
  // landing pages added to expand topical coverage. Each lives at
  // /yacht-charter-<slug> and ships with full schema + FAQ +
  // insider tips. Total islands live: 10.
  // ─────────────────────────────────────────────────────────────

  {
    slug: "folegandros",
    name: "Folegandros",
    region: "Cyclades (south-west)",
    tagline: "The vertical chora above the sea  -  Santorini's quieter, more dignified neighbour",
    whyVisit: `Folegandros is the Cycladic island UHNW charterers ask for once they've done Santorini. The chora sits on a 200-metre cliff above the sea, fortified since the Venetians, and is reached only by a switchback road from the port at Karavostasis. There are no cruise-ship piers  -  too vertical, too narrow  -  which means the island stays at the scale and tempo it had thirty years ago. From the water, the whole north coast is sheer cliff: anchoring requires the right yacht (smaller draft helps) and a captain who has been here before. The reward is Vardia Bay for the swim, Agali for the secluded lunch, and the chora at sunset with maybe forty other people in the whole town. Folegandros is what charter clients quietly recommend to their closest friends and tell no one else.`,
    yachtFilter: 'cruisingRegion match "*Folegandros*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "above-beyond", "madicon"],
    seasonality: `**Mid-June through mid-September** is the operational window  -  outside that, the chora restaurants close and the port becomes weather-exposed. **July** is the peak quality month: warm, calm enough most days, low crowd density even in the chora. **August** brings the Athenian holiday crowd to the chora at night but the anchorages remain quiet. **September** is the broker consensus  -  water still 22-24°C, restaurants still open, light golden. The Meltemi runs strongest on the north coast; experienced captains slip behind the island's south flank during peak wind days.`,
    insiderTips: [
      "Anchor in Agali Bay for the protected lunch swim  -  sandy bottom, small taverna ashore, water clearer than most of the Cyclades.",
      "Dinner in the chora at Pounta or Eva's Garden, not at the seafront. The chora is a 15-minute drive from the port  -  pre-arrange a transfer.",
      "Vardia sunset point above the chora is the photograph everyone takes; arrive 30 minutes before sunset to claim space.",
      "The Panagia Church walk above the chora takes 25 minutes uphill. Worth it before dinner, not in midday August.",
      "If the Meltemi is strong from the north, the captain will move you to Livadi or Aspropounta on the south coast  -  both protected, both swimmable.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Folegandros?",
        a: "No  -  Karavostasis is a tender port, not a yacht marina. Folegandros is always a stop within a charter starting in Athens, Santorini, or Milos. Plan it as Days 3-5 in a Southern Cyclades loop.",
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
        a: "About 35 NM  -  4-5 hours under sail, 2.5-3 hours under motor. Most charters do it as a half-day passage, arriving Folegandros for lunch and the afternoon at Agali.",
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
    tagline: "The Ionian's accessible centre  -  Porto Katsiki beach, Lefkada Town, and the Inner Ionian loop",
    whyVisit: `Lefkada is the only Greek island connected to the mainland by bridge  -  which sounds like a downside until you realise it means a 3.5-hour drive from Athens delivers you to a fully-equipped yacht harbour at Lefkada Town. No flight, no ferry, no positioning leg. From there, the entire Inner Ionian opens in tight succession: Meganisi at 6 NM, Ithaca at 22 NM, Kefalonia at 30 NM, the Lefkadian west coast (Porto Katsiki, Egremni, Kathisma) at day-sail range. The water is calm, the wind is forgiving, the distances between anchorages are short. Lefkada is what we recommend to first-time charterers, to families with young children, to anyone who wants the Greek summer without the Cycladic weather chess. The trade-off: less photographic drama than the Cyclades  -  green hills instead of white villages. Many clients consider that an upgrade.`,
    yachtFilter: 'cruisingRegion match "*Lefkada*" || cruisingRegion match "*Ionian*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["kimata", "huayra", "alteya"],
    seasonality: `**Late May through mid-October**  -  the Ionian's calendar runs longer than the Aegean's. **June** is the green-hill peak: hillsides still verdant from spring rains, water 22°C, low crowds. **July-August** is the family-charter peak  -  calm waters, light afternoon thermal winds, every cove busy but not crowded. **September** is the gentle-water peak  -  water 24°C, mosquito season ending, restaurants still open. **October** is the local-favourite month: 18-22°C, restaurants quiet, the bridge-traffic from Athens dropping to weekend-only.`,
    insiderTips: [
      "Porto Katsiki has no road access from Lefkada Town that any yacht client would willingly take  -  visit it by yacht for the morning, drone the cliff shot, swim.",
      "Vassiliki on the south coast is the only place in Greek waters with reliable mid-afternoon thermal wind  -  perfect for kite-surfing days if the charter party wants water-sport time.",
      "Lefkada Town has a small but excellent yacht harbour with shore-side restaurants  -  useful for a halfway-week night ashore.",
      "Meganisi is the secret island next door  -  three villages, zero tourist buses, Atherinos Bay the most protected anchorage in the Ionian.",
      "The Lefkada-to-Ithaca route passes Skorpios (Onassis's island) on the way; ask the captain to give it a slow pass.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Lefkada?",
        a: "Yes  -  Lefkada Marina is a proper deep-water marina. Drive 3.5 hours from Athens, or fly to Preveza Airport (PVK, 20 minutes by road from the marina) and board there. Skips the Athens-to-Ionian repositioning leg entirely.",
      },
      {
        q: "How does the Ionian compare to the Cyclades?",
        a: "Calmer water, shorter distances between islands, less wind, greener landscape, more family-friendly. The Cyclades have the iconic Greek aesthetic; the Ionian has the Italian-influenced one  -  pine-clad hills, pastel architecture, lower-key restaurants. Many second-time charterers try one, then the other.",
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
        a: "Kimata, Huayra, Serenissima, and several catamarans (Alteya, Summer Star) home-port in the Ionian. Most other yachts will reposition to Lefkada for charter starts at no extra cost  -  typically a 24-hour journey from Athens.",
      },
    ],
    cta: "Match me to a yacht for Lefkada →",
  },

  {
    slug: "spetses",
    name: "Spetses",
    region: "Saronic Gulf",
    tagline: "Horse-drawn carriages, cricket on the lawn, the closest Greece gets to a private members' club",
    whyVisit: `Spetses is the Saronic island the Athenian shipping families chose in the 1830s and never left. No private cars are allowed in the chora  -  transfers are by horse-drawn carriage or pre-arranged transport  -  and the island's social scene revolves around three institutions: Poseidonion Grand Hotel (the original 1914 belle-époque hotel), Anargyrios College (private school with manicured cricket lawns), and Spetses Town's harbour-side tavernas (Patralis, Liotrivi). The energy is unlike anywhere else in Greek waters: cosmopolitan but quiet, English-speaking but not touristic, old-money but not stiff. From a yacht, you can have the whole island at the scale of a day trip: lunch at Patralis, swim at Agia Paraskevi, dinner at the Poseidonion, sleep at anchor offshore. Most of our Saronic charters spend two nights in Spetses' orbit and use it as the social hub of the trip.`,
    yachtFilter: 'cruisingRegion match "*Spetses*" || cruisingRegion match "*Saronic*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["gigreca", "nadamas", "la-pellegrina-1"],
    seasonality: `**May through October**  -  Saronic is the longest-season Greek charter region. **June and September** are the broker consensus best: warm water, low crowds, full restaurant operations. **July-August** Spetses becomes the Athenian weekend destination  -  busier on weekends, quieter Mon-Wed. **October** is the local-favourite month  -  restaurants stay open, the cricket lawn turns dramatic, Athenian shipping families come down for autumn weekends.`,
    insiderTips: [
      "Anchor off Agia Paraskevi (south coast) for the protected morning swim  -  pine trees to the waterline, perfect sand bottom.",
      "Lunch at Patralis on the harbour: order the orzo with lobster (astakomakaronada), not the international menu.",
      "Pre-book the Poseidonion's restaurant for one dinner  -  book a table in the garden, not the dining room.",
      "The horse-drawn carriage from the Old Harbour to Anargyrios College is the tourist photograph; the locals walk it in 20 minutes.",
      "Bekiris Cave at the southern tip is a yacht-only swim spot  -  the captain anchors offshore, you swim into the cave through a low entrance.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Spetses?",
        a: "Yes, but most charters start in Athens (Alimos or Flisvos Marina, 45 minutes from Athens International Airport) and reach Spetses on Day 2 or 3. Direct boarding in Spetses is possible  -  the Old Harbour accommodates yachts up to 40m  -  but the airport-to-yacht logistics make Athens easier.",
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
    whyVisit: `Kefalonia is the Ionian island the cinematographers picked for Captain Corelli's Mandolin and Mamma Mia 2  -  for a reason. Dramatic mountains plunge straight into the sea, Myrtos Beach is the most photographed beach in Greece outside the Cyclades, and Fiskardo (the only village that survived the 1953 earthquake) is the closest you'll find to a perfectly preserved Venetian harbour in Greek waters. From a yacht, Fiskardo is the obvious base: the harbour itself is small and elegant (med-mooring on the quay, restaurants ten metres from the swim platform), and the route options open in three directions  -  Ithaca 8 NM east, Lefkada 30 NM north, Zakynthos 35 NM south. The island has the deepest restaurant culture in the Ionian: Captain Tassia's in Fiskardo is the legendary cooking name; Kefalonian wines (Robola, Mavrodaphne) get serious attention in the tavernas; the fish is brought to your table for selection. Many of our Ionian charterers spend two nights in Fiskardo and don't want to leave.`,
    yachtFilter: 'cruisingRegion match "*Kefalonia*" || cruisingRegion match "*Ionian*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["huayra", "kimata", "summer-star"],
    seasonality: `**May through October**  -  full Ionian operational season. **June** is the green-mountain peak (Kefalonia's mountains stay verdant longer than the Aegean islands'). **July-August** is the family-charter peak: warm water, calm seas, Fiskardo busy but never crowded. **September** is the broker consensus  -  water 24°C, wine season starting (vineyards visible), restaurants still operating fully. **October** quietens but the restaurant scene stays  -  the local population winters in Kefalonia, unlike Cycladic islands that empty.`,
    insiderTips: [
      "Med-moor in Fiskardo harbour itself, not the larger anchorage outside  -  the experience of stepping off the swim platform straight into the village is the whole point.",
      "Dinner at Tassia's Restaurant on Fiskardo's quay  -  Tassia is a Cordon Bleu-trained Kefalonian who has been there since the 80s. Book ahead.",
      "Myrtos Beach is reached by yacht (the road descent is hair-raising and the parking is brutal in August). Anchor off, tender to shore for the swim.",
      "Assos village above the harbour  -  30 minutes by tender then a steep walk  -  has the best sunset photograph on Kefalonia. The Venetian fortress at the top is open until sunset.",
      "Kefalonian wines (Robola, Mavrodaphne) are not exported well  -  order them in the tavernas. The Gentilini and Foivos labels are the broker picks.",
    ],
    faq: [
      {
        q: "Can I board a yacht in Kefalonia?",
        a: "Yes  -  Argostoli (the island capital) has a small but functional yacht marina, and Fiskardo accommodates med-mooring for yachts up to 45m. Kefalonia Airport (EFL) has summer connections from London, Manchester, Athens. Boarding in Kefalonia saves the 8-10 hour positioning leg from Athens.",
      },
      {
        q: "How does Kefalonia compare to Lefkada?",
        a: "Kefalonia has more dramatic landscape (proper mountains, vertical coastlines), more developed restaurant culture, and more famous beaches (Myrtos). Lefkada has easier access from Athens (bridge), more sheltered anchorages, and the Inner Ionian cluster of small islands. Both are 30 NM apart and most Ionian charters include both.",
      },
      {
        q: "Is Kefalonia good for a 7-day base charter?",
        a: "Yes  -  Fiskardo Day 1, Ithaca Day 2, Sami / Antisamos Day 3, Myrtos / Assos Day 4-5, Zakynthos (Navagio shipwreck) Day 6, back to Fiskardo Day 7. About 180 NM total.",
      },
      {
        q: "Are the Kefalonian beaches accessible by tender?",
        a: "Yes  -  Myrtos, Antisamos, Foki, Emblisi, Petani are all yacht-tender-accessible. Most have no shore facilities (no taverna, no umbrellas) which is exactly the point.",
      },
      {
        q: "Which yachts in the fleet visit Kefalonia regularly?",
        a: "Huayra, Kimata, and the Ionian-based catamarans (Summer Star, Alteya) include Kefalonia in every Ionian itinerary. Larger yachts (La Pellegrina 1, Above & Beyond) reach Kefalonia from Athens on extended 10-14 day Western Greece charters.",
      },
    ],
    cta: "Match me to a yacht for Kefalonia →",
  },

  // ═════════════════════════════════════════════════════════════
  // 2026-05-11 (Phase 7 SEO strategy doc)  -  9 more destinations
  // added to push the per-island programmatic surface from 10 to
  // 19. These are the highest-search Greek destinations missing
  // from the original Roberto-brief 10, prioritised by genuine
  // charter relevance (we don't add destinations we wouldn't take
  // a client to). Same fields as the original 10; same template.
  // ═════════════════════════════════════════════════════════════

  {
    slug: "naxos",
    name: "Naxos",
    region: "Cyclades",
    tagline: "The largest Cycladic island. Beaches that don't quit, mountain villages that don't perform, the most underrated Cycladic charter destination.",
    whyVisit: `Naxos is the **Cycladic island that doesn't try too hard**. It is the largest, the greenest, the most agricultural, and the most genuinely lived-in. While Mykonos performs and Santorini photographs, Naxos quietly delivers some of the best Cycladic charter experiences: the **9-kilometre stretch of west-coast beaches** (Agios Prokopios, Plaka, Mikri Vigla) that rival any in the Mediterranean, the **mountain villages** of Filoti and Apiranthos where lunch is served on stone-tiled terraces by people who have run the place for three generations, and the **chora** with its 13th-century Venetian kastro looming over the harbour. From the water, Naxos works as a 3-day base on a Cycladic loop or a 7-day standalone. The yacht crowd is meaningfully thinner here than on Paros next door, the food is honest, and the anchorages are wide. Most repeat Cycladic charterers add Naxos to their itinerary by year 2.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Naxos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**May, June, September** are the sweet spots. Naxos's beaches are warm enough in June for full days at anchor; the meltemi tempers by September while the water stays warm. **July-August** is busy but never crowded the way Mykonos is  -  Naxos absorbs visitors better than smaller islands. The **mountain villages** are at their best in May and October when the air is cool and the agricultural rhythm visible.`,
    insiderTips: [
      "Anchor at Plaka beach for lunch, not the chora  -  the village is better visited by tender than by yacht-staying.",
      "Apollonas (north coast) is a 50-minute drive from chora and home to the famous Kouros statue. Worth a day trip if you have one.",
      "Filoti for dinner once during the week. Family-run tavernas with menu boards that change daily.",
      "Naxian local cheese (graviera, arseniko) is the best Cycladic cheese. Ask the chef to source.",
      "Mikri Vigla has the best wind for kitesurfing. If your group has anyone interested, drop them there for the afternoon.",
    ],
    faq: [
      { q: "Is Naxos worth a Cycladic charter stop?", a: "Yes, especially as a 2-3 day component of a longer week. Naxos has the best beaches in the Cyclades, the most authentic village experience, and significantly less crowd than Mykonos or Santorini. We include it in 70% of Cycladic charter itineraries." },
      { q: "Can a yacht anchor close to the chora?", a: "Yes. The chora harbour itself is small (mostly ferry traffic) but anchorages at Agios Prokopios and Plaka beaches are 10-15 minutes by tender to the chora." },
      { q: "How does Naxos compare to Paros for charter?", a: "Both worth visiting. Paros (Naoussa specifically) has the higher-energy fine-dining scene and more polished marinas. Naxos has the better beaches, deeper interior, and authentic agricultural village experience." },
      { q: "What's the best beach on Naxos?", a: "Plaka and Mikri Vigla on the west coast for swimming and lunch; Agios Prokopios is more developed (taverna access); Pyrgaki is the quietest at the south end." },
      { q: "Are there fine dining restaurants on Naxos?", a: "A few  -  Apostolis on Plaka beach is the best-known yacht-friendly option, Axiotissa for traditional Cycladic, Vasilis Garden for elevated farm-to-table. Less density than Mykonos but quality is high." },
    ],
    cta: "Match me to a yacht for Naxos →",
  },

  {
    slug: "rhodes",
    name: "Rhodes",
    region: "Dodecanese",
    tagline: "The largest Dodecanese island. Medieval walled town, Lindos acropolis, the bridge to the Turkish Aegean.",
    whyVisit: `Rhodes is **Greek charter's gateway to the Dodecanese and the Turkish Aegean**. It sits at the south-eastern edge of Greek waters, 11 nm from the Turkish coast, and is the natural starting point for charters that want to explore the eastern islands (Symi, Patmos, Kos) or cross into Turkish waters for the Bodrum-Marmaris loop. The **Old Town** is one of the best-preserved medieval cities in Europe (UNESCO-listed since 1988), the **Lindos acropolis** is a 30-minute drive from Rhodes town and one of the most photographed archaeological sites in Greece, and the **Anthony Quinn Bay** anchorage on the east coast is a cinematic stop. From a yacht perspective, Rhodes works as a base for 7-14 day Dodecanese charters or as a one-way endpoint after a Cyclades-to-Dodecanese itinerary from Athens.`,
    yachtFilter: 'cruisingRegion match "*Rhodes*" || cruisingRegion match "*Dodecanese*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `Rhodes has the **longest charter season in Greek waters**  -  May through late October are all viable, with September and early October offering the warmest water in the country (24-26°C) and the gentlest weather. The **meltemi reaches Rhodes** in July-August but is meaningfully softer here than in the central Cyclades.`,
    insiderTips: [
      "Anchor at Mandraki harbour for the Old Town view; sleep at Anthony Quinn Bay or Faliraki for quieter water.",
      "Lindos by car at dawn (07:00) is the magic time. Avoid the cruise-ship arrival window 10:00-15:00.",
      "Symi day-trip from Rhodes is 90 minutes each way. Worth it  -  Symi is one of the most beautiful harbours in Greece.",
      "Turkish cross-charter to Bodrum or Marmaris from Rhodes is 4-6 hours. Brief us 6 weeks ahead if you want this.",
      "Lindos has a few fine-dining restaurants. Mavrikos for traditional, Melenos for the rooftop view at sunset.",
    ],
    faq: [
      { q: "Where does a yacht charter typically start in Rhodes?", a: "Mandraki marina in Rhodes town is the standard departure port. Faliraki and Lindos are also possible boarding points for yachts repositioned." },
      { q: "Can we combine Rhodes with Turkish coast charter?", a: "Yes. Rhodes to Bodrum or Marmaris is 4-6 hours by yacht. Cross-charter requires Turkish entry paperwork (6 weeks lead time) but is a popular pattern. We coordinate." },
      { q: "What's the best Dodecanese itinerary from Rhodes?", a: "Common 7-day loop: Rhodes-Symi-Tilos-Nisyros-Kos-Patmos-back to Rhodes. About 180 nm total. The Symi and Patmos anchorages are the highlights." },
      { q: "Is Rhodes too touristy for a luxury charter?", a: "The Old Town and main beaches are tourist-dense, yes. But the yacht charter experience anchors away from the crowds  -  Anthony Quinn Bay, the south coast, Symi day trips. A Rhodes-based charter feels meaningfully more private than a hotel stay in Rhodes town." },
      { q: "When is the best time to charter from Rhodes?", a: "Late May to mid-July for fewer crowds and reliable weather; mid-September to mid-October for the warmest water of the year. August is busy but yacht charters still operate comfortably." },
    ],
    cta: "Match me to a yacht for Rhodes →",
  },

  {
    slug: "skiathos",
    name: "Skiathos",
    region: "Sporades",
    tagline: "Northern Aegean's quietest island group. 60 beaches, pine-fringed water, Mamma Mia anchorages.",
    whyVisit: `Skiathos is the **gateway to the Sporades** and the most overlooked Greek charter destination from a UHNW perspective. The island has **60 beaches** across 49 square kilometres, almost all of them yacht-tender-accessible, almost none of them on the typical Greek charter itinerary. The water reads green-blue rather than the Cycladic Aegean blue, the coast is pine-fringed in a way that feels closer to the Croatian Adriatic, and the **Mamma Mia anchorages on Skopelos** (the church on the rock, the beach at Kastani) are a 90-minute hop from Skiathos. From a yacht perspective, Skiathos works as a base for a 7-day Sporades loop covering Skiathos, Skopelos, Alonissos, and the National Marine Park around them.`,
    yachtFilter: 'cruisingRegion match "*Sporades*" || cruisingRegion match "*Skiathos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**June, July, September** are the prime Sporades weeks. The Sporades miss the strongest of the meltemi (which sits south in the Cyclades) so wind is gentler. Water warms to 23-25°C by July. Most yacht traffic is local Greek charter; UHNW international charterers are still relatively rare here, which is part of the appeal.`,
    insiderTips: [
      "Lalaria beach on Skiathos's north coast is yacht-tender-accessible only. White pebbles, no shore access  -  perfect for a private swim morning.",
      "Skopelos's church of Agios Ioannis on the rock (Mamma Mia chapel) is 30 minutes by tender from a Skopelos anchorage. Photogenic; small island walk to it.",
      "Alonissos National Marine Park has Mediterranean monk seal sightings if you're lucky. Approach quietly and let the captain handle distance.",
      "Skiathos chora has a small but solid restaurant scene. Marmita and Karnayio are the yacht-set picks.",
      "The Sporades are quieter than the Cyclades by orders of magnitude. If anchorage privacy is the priority, choose here over Mykonos.",
    ],
    faq: [
      { q: "Where do yachts depart from for the Sporades?", a: "Skiathos is the primary departure port (small but functional marina). Volos on the mainland is also possible. Athens-departure charters reaching the Sporades typically need 10+ days for a comfortable round trip." },
      { q: "Is Skiathos crowded in August?", a: "The chora can be busy, but the surrounding anchorages and Skopelos/Alonissos are consistently quieter than Cycladic equivalents. Yacht charter feels meaningfully more private here." },
      { q: "Can we visit the Marine Park?", a: "Yes. The Alonissos Marine Park is open to yachts; some areas require slower transit or anchoring restrictions. The captain handles compliance. Monk seal sightings happen but are not guaranteed." },
      { q: "What's the Sporades typical 7-day itinerary?", a: "Skiathos (day 1-2), Skopelos (day 3-4), Alonissos and Marine Park (day 5-6), back to Skiathos via Skantzoura (day 7). About 100 nm total with anchorage time daily." },
      { q: "How do we get to Skiathos to board?", a: "Skiathos airport has direct seasonal flights from London, Amsterdam, Vienna and other European cities (May-October). Athens-Skiathos by air is 50 minutes; Athens-Volos by road then ferry is 4 hours." },
    ],
    cta: "Match me to a yacht for the Sporades →",
  },

  {
    slug: "zakynthos",
    name: "Zakynthos",
    region: "Ionian",
    tagline: "Navagio Beach and Blue Caves on the wild west coast. Charter-cinematic, family-friendly, criminally photogenic.",
    whyVisit: `Zakynthos (Zante) sits at the southern end of the Ionian and delivers the **most-photographed beach in the Mediterranean: Navagio (Shipwreck) Beach**. The crescent of white cliffs around a 1980s shipwreck on white sand has been on more brochure covers than most countries. Beyond Navagio, the **Blue Caves** on the north coast are the second classic anchorage, and the south-coast pine-fringed beaches give you a quieter family pace. Zakynthos works as a 2-3 day standalone within a longer Ionian charter (Lefkada-Kefalonia-Zakynthos-back) or as a destination for short 4-night charters from the local marina.`,
    yachtFilter: 'cruisingRegion match "*Ionian*" || cruisingRegion match "*Zakynthos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**May to October** is the active charter window. The Ionian's gentle wind pattern holds through summer; Zakynthos's western anchorages (Navagio, Blue Caves) are exposed to north-westerly afternoon thermals, so morning anchoring (08:00-12:00) is the right rhythm. **June and September** are the sweetest weeks.`,
    insiderTips: [
      "Navagio beach at 08:00 before the day-trip boats arrive. By 11:00 it's crowded; by 14:00 it's a circus. Plan dawn.",
      "Blue Caves anchorage on the north coast  -  small tender entry, low ceilings, water that photographs cobalt at midday. Bring underwater cameras.",
      "Marathonisi (Turtle Island) south coast  -  loggerhead turtles nest here. Tender approach respectful and slow. Distance enforced.",
      "Zakynthos chora is functional rather than charming. Spend nights anchored at south-coast beaches (Porto Limnionas, Keri).",
      "Bochali viewpoint at sunset gives the panoramic shot of the bay. Tender to town, taxi up, dinner at Bochali Plaza.",
    ],
    faq: [
      { q: "Can we anchor at Navagio Beach overnight?", a: "Not comfortably. Navagio is open to north-westerly swell and gets uncomfortable after the morning. Standard pattern: arrive at dawn for swimming and photography, leave by noon for a sheltered anchorage." },
      { q: "Is Zakynthos better as a standalone or part of a larger Ionian charter?", a: "Best as a 2-3 day component of a Lefkada or Kefalonia-based charter. Standalone Zakynthos charters work for short (4-night) breaks but the larger Ionian loop gives more variety." },
      { q: "When can we see the turtles?", a: "Loggerhead turtles nest on Zakynthos's south coast (Marathonisi, Laganas Bay) from May through August. Snorkelling encounters are possible from anchored yachts with the captain's coordination. The National Park has visitor rules; the captain handles." },
      { q: "Is Navagio safe to visit by yacht?", a: "Yes for daytime anchoring. The cliffs above have been unstable historically (a section collapsed in 2018); the beach itself is sometimes closed by Greek authorities. Check with the captain at booking; we have current information." },
      { q: "What's the best month for Zakynthos charter?", a: "June and September. May and October are also excellent if your group is comfortable with slightly cooler swimming. August has the most crowd at Navagio but the best Marine Park visibility." },
    ],
    cta: "Match me to a yacht for Zakynthos →",
  },

  {
    slug: "ithaca",
    name: "Ithaca",
    region: "Ionian",
    tagline: "Odysseus's home. The quietest, most-mythical Ionian island. UHNW-favoured for the privacy.",
    whyVisit: `Ithaca is **Odysseus's home in Homer**, the destination of the world's most famous voyage, and quietly one of the most exclusive charter destinations in the Greek Ionian. The island is small (96 sq km), low-population (3,200 year-round), and almost entirely free of mass tourism. The **harbour of Vathy** is sheltered, the **village of Kioni** in the north has the most-photographed Ionian taverna scenes, and **Frikes** anchorage gives access to the quietest beaches in the entire Ionian. From a yacht perspective, Ithaca works as a 2-day component of any Ionian charter (Lefkada, Kefalonia, Ithaca are typically clustered together) and is the destination repeat clients ask to return to most often.`,
    yachtFilter: 'cruisingRegion match "*Ionian*" || cruisingRegion match "*Ithaca*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**May to October** with **June and September** as the sweet spots. Ithaca is even quieter than Kefalonia next door  -  the lack of an airport (you fly into Kefalonia or arrive by yacht) keeps mass tourism away. Even peak August feels uncrowded by Greek charter standards.`,
    insiderTips: [
      "Anchor at Kioni harbour for at least one evening. The taverna scene around the bay is the most picturesque in the Ionian.",
      "Vathy is the main harbour but Kioni is the more photogenic stop. Most charters do both.",
      "The drive from Vathy to the Cathedral of Ithaca (top of the island) is 30 minutes and gives the panoramic view of the Ithaca-Kefalonia channel.",
      "Loizos and Trehantiri are the yacht-set restaurants in Vathy. Family-run, traditional, excellent.",
      "Ithaca and Kefalonia together make the strongest Ionian charter; don't choose between them.",
    ],
    faq: [
      { q: "How do we get to Ithaca?", a: "Ithaca has no airport. You arrive by yacht (typical charter pattern from Lefkada or Kefalonia) or by ferry from Kefalonia (Sami port, 20 minutes by sea) which connects to Kefalonia airport." },
      { q: "Is Ithaca worth a full charter day?", a: "Yes  -  at least 2 days as part of a larger Ionian charter. Vathy harbour, Kioni for dinner, Frikes for quieter water. Most Ionian charters include Ithaca as a 2-3 day stop." },
      { q: "What's the best anchorage on Ithaca?", a: "Kioni harbour for the evening (small, sheltered, restaurant access). Vathy for boarding and provisioning. Sarakiniko Bay on the east coast for quiet daytime anchoring." },
      { q: "Is Ithaca too quiet for a one-week charter?", a: "Alone, possibly  -  Ithaca is small. As part of a 7-day Ionian loop (Lefkada-Kefalonia-Ithaca-back) it's the perfect quiet center of the trip." },
      { q: "Are there fine dining restaurants on Ithaca?", a: "Not in the strict sense. Family-run tavernas dominate (Loizos, Trehantiri, Mythos in Vathy; Calypso in Kioni). Quality is high; ambition is traditional rather than experimental." },
    ],
    cta: "Match me to a yacht for Ithaca →",
  },

  {
    slug: "paxos",
    name: "Paxos",
    region: "Ionian",
    tagline: "Small island, big reputation. The Ionian's quietest and most exclusive 25-sq-km charter destination.",
    whyVisit: `Paxos is **27 square kilometres of Ionian island** between Corfu and Lefkada, with three villages (Gaios, Lakka, Loggos), a population of 2,300, and a charter scene that punches far above its size. The **west coast cliffs** drop 200 metres into the sea with caves and grottos accessible only by tender. The **east coast** is a string of olive groves, ferries to Corfu, and tavernas that have served the yacht set for decades. From a yacht perspective, Paxos works as a 2-3 day component of a Corfu or Lefkada-based charter, and is the most-requested standalone destination for couples wanting the smallest, quietest, most exclusive Ionian week.`,
    yachtFilter: 'cruisingRegion match "*Ionian*" || cruisingRegion match "*Paxos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**May to October** active charter. Paxos is at its sweetest in **late June through early September**: warm water, gentle wind, the island is at its peak energy without being crowded. Even in August, anchorages stay calm.`,
    insiderTips: [
      "Anchor at Lakka in the north for one night  -  small natural harbour, restaurant scene, water-as-pool calm.",
      "Antipaxos (5 nm south) has two of the best swimming beaches in the Mediterranean: Voutoumi and Vrika. Day trip from Paxos.",
      "Tender into the Blue Cave on the west coast at midday for the cobalt water reflection. Captain-led; tide-dependent.",
      "Gaios has the only proper marina, used for provisioning. Sleep at anchor elsewhere.",
      "Paxos is small enough to drive around in 90 minutes. Rent a car for one day if you want the inland feel.",
    ],
    faq: [
      { q: "Is Paxos worth visiting on a 7-day Ionian charter?", a: "Yes, as a 2-3 day component. Paxos is small enough that a full week here would lose variety, but skipping it on an Ionian charter is the most-regretted decision repeat clients describe." },
      { q: "What's the best anchorage on Paxos?", a: "Lakka in the north for the village evening (best dinner ambience), Mongonisi for the sheltered swimming, Antipaxos's Voutoumi for the beach day. Standard pattern: 3 anchorages, 3 nights." },
      { q: "How do we get to Paxos?", a: "Paxos has no airport. Standard charter pattern: fly to Corfu, drive 30 minutes to Corfu town port, transfer by yacht (3-4 hours south) or by ferry. Most charters that include Paxos arrive by yacht from Corfu or Lefkada." },
      { q: "Is Paxos very crowded in August?", a: "By Ionian standards, yes  -  Paxos is small and the August demand is high. By Mykonos standards, no  -  Paxos in August is still meaningfully quieter than any Cycladic equivalent. Book yacht stays 4-6 months ahead for August." },
      { q: "Can we visit Antipaxos by yacht?", a: "Yes. Antipaxos is 5 nm south of Paxos with two main beaches (Voutoumi, Vrika) that are yacht-anchorage-friendly. Day trip from Paxos is the standard pattern. No overnight infrastructure on Antipaxos." },
    ],
    cta: "Match me to a yacht for Paxos →",
  },

  {
    slug: "symi",
    name: "Symi",
    region: "Dodecanese",
    tagline: "Greek charter's most photogenic harbour. Neoclassical mansions, Italian-Greek fusion, the eastern Aegean's quietest stop.",
    whyVisit: `Symi is **the most-photographed harbour in Greek charter** and one of the smallest islands in the Dodecanese. The **chora amphitheatre of neoclassical mansions** climbing up the hillside is one of the most cinematic harbour entries in the Mediterranean  -  sailing in at sunset is genuinely cinema-grade. The **20-minute drive to Panormitis monastery** at the south end is the cultural highlight. From a yacht perspective, Symi sits 4 nm off the Turkish coast and works as a 2-day component of a Rhodes or Dodecanese-based charter, often combined with Patmos and Kos for the full Dodecanese loop.`,
    yachtFilter: 'cruisingRegion match "*Dodecanese*" || cruisingRegion match "*Symi*" || cruisingRegion match "*Rhodes*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**May to October** active. Symi gets meaningful summer heat (peak August can hit 38°C) but the sea breeze in the harbour keeps yacht anchorages comfortable. **June and September** are the most pleasant months.`,
    insiderTips: [
      "Sail into the harbour at sunset for the photograph. The amphitheatre lights up gradually as the sun drops; the timing matters.",
      "Eat at Tholos (overlooking the bay) or Manos on the harbour. Both have decades of yacht-set history.",
      "Panormitis monastery on the south coast is worth a half-day. Drive (30 minutes) or yacht around (60 minutes).",
      "Pedi village (5 minutes from chora) has the quieter beach scene and yacht-friendlier anchorage.",
      "Symi-to-Bodrum (Turkish coast) is 90 minutes by yacht. Brief us 6 weeks ahead if cross-border charter is on the brief.",
    ],
    faq: [
      { q: "How do we get to Symi?", a: "Symi has no airport. You arrive by yacht (from Rhodes, 90 minutes) or by ferry from Rhodes (1 hour). Most charters that include Symi base from Rhodes or do Rhodes-Symi-Kos-Patmos as a 7-day Dodecanese loop." },
      { q: "Is the Symi harbour anchorage safe at night?", a: "Yes. The harbour is well-sheltered; northerly winds (rare in summer) are the only issue. Standard anchorage with stern-to mooring works well." },
      { q: "What makes Symi special?", a: "The harbour visual is unmatched  -  the neoclassical mansion amphitheatre is the most photogenic Greek harbour. The Italian-Greek architectural fusion (Symi was Italian-administered 1912-1947) is unusual. And the island stays uncrowded even in August due to its small population." },
      { q: "Can we day-trip to Symi from Rhodes?", a: "Yes. Day-trip yachts from Rhodes reach Symi in 90 minutes, allow 4-5 hours on the island, and return. Better to overnight: the sunset arrival is the experience." },
      { q: "Are there fine dining restaurants on Symi?", a: "Tholos is the destination restaurant (overlooking the harbour, traditional Symi cuisine, excellent). Manos and Mythos on the harbour are the yacht-set classics. No Michelin-tier dining; the value is in the setting and the food's honesty." },
    ],
    cta: "Match me to a yacht for Symi →",
  },

  {
    slug: "crete-chania",
    name: "Crete (Chania)",
    region: "Crete",
    tagline: "Greek charter's largest island, smallest charter community. Chania's Venetian harbour is the gateway to the southern Aegean.",
    whyVisit: `Crete is **the largest Greek island** (8,300 sq km) and the most under-chartered by international UHNW visitors despite world-class anchorages and the most diverse coastline in Greek waters. **Chania** on the north-west coast is the most polished departure point: a **Venetian harbour** that rivals any in the Mediterranean for visual quality, a **food scene** that has matured into one of the best in Greece, and **west-coast anchorages** (Balos lagoon, Elafonisi pink beach, Falasarna) that photograph at a level that competes with the Caribbean. From a yacht perspective, Chania-departure charters work as 7-14 day standalone weeks exploring Crete's north and west coasts, or as part of a longer routing connecting Crete to the southern Cyclades or Peloponnese.`,
    yachtFilter: 'cruisingRegion match "*Crete*" || cruisingRegion match "*Chania*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `Crete has **one of the longest charter seasons in Greek waters**  -  late April to mid-November are all viable. The southern coast (Sfakia, Loutro, Agia Roumeli) is exposed to Africa-side weather and is best in **September-October**. The northern coast (Chania, Rethymno, Heraklion) is standard summer charter season. The west coast (Balos, Elafonisi) is meltemi-exposed in peak July-August but anchorages can be selected accordingly.`,
    insiderTips: [
      "Balos lagoon at dawn (07:00 arrival) is the destination photograph. By 10:00 the day-boat traffic from Chania port arrives.",
      "Elafonisi's pink sand reads more vivid in early morning light. Plan as a morning anchorage with afternoon transit south.",
      "Chania's Venetian harbour for dinner  -  multiple options, ranging from traditional (To Karnayio) to elevated (Salis, Tamam). Worth at least one evening per Crete charter.",
      "South-coast Loutro is accessible only by foot or sea. Yacht charter visitors are rare; the village is one of the most authentic remaining in Greek waters.",
      "The Samaria Gorge (one of the longest in Europe) is a half-day excursion from a Crete-based charter. Day-hike-only; we coordinate.",
    ],
    faq: [
      { q: "Where do yachts depart from in Crete?", a: "Chania's Venetian harbour (small but historic) for smaller yachts; Souda Bay marina (larger, 15 minutes east of Chania) for larger yachts. Heraklion and Agios Nikolaos are alternative east-coast departure points." },
      { q: "Can we visit the Cyclades on a Crete-based charter?", a: "Yes, as a 10-14 day routing. Crete-Santorini is 60 nm, Santorini-Ios-Folegandros and onward is a natural extension. We coordinate the longer itineraries." },
      { q: "Is Crete crowded in summer?", a: "Chania town and the iconic anchorages (Balos, Elafonisi) are busy in peak August. The yacht charter experience anchors away from crowds; even in August, Crete charter feels much more private than Cycladic equivalents." },
      { q: "What's the best month for a Crete charter?", a: "Late May to mid-July for west and north coast; September-October for the south coast (when the heat softens). The shoulder months give the most variety of accessible coastline." },
      { q: "How long do Crete charters typically run?", a: "Crete is large enough to support 10-14 day standalone charters. 7-day Crete-only charters work for the west coast loop (Chania to Falasarna to Balos to Gramvoussa); 14 days lets you reach the south coast and Heraklion as well." },
    ],
    cta: "Match me to a yacht for Crete →",
  },

  {
    slug: "sifnos",
    name: "Sifnos",
    region: "Cyclades",
    tagline: "Greek charter's food destination. Cycladic island that's quieter than Paros and serves better food than most of Mykonos.",
    whyVisit: `Sifnos is **the Cyclades' food island**. Greek charter veterans know that Sifnos has produced more Greek chefs per capita than any other Aegean island, and the local cuisine (specifically the **chickpea soup baked overnight, the mastelo lamb, the local cheese**) has shaped modern Greek fine dining. The **chora of Apollonia** and the **harbour of Kamares** are both yacht-friendly, the **west coast cliffs** at Vroulidia and Cherronisos are some of the quietest Cycladic anchorages, and the **walking trails** between villages (4-6 km each, well-maintained, dotted with churches) offer a quieter shore experience than any other Cycladic island. From a yacht perspective, Sifnos works as a 2-3 day stop on a Cycladic loop or as a primary destination for charterers who care about food more than scene.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Sifnos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: [],
    seasonality: `**May to October** active. Sifnos has minimal mass tourism even in peak August; the food scene is sophisticated year-round but at its peak in **June and September** when the local produce is at its best. Meltemi can be strong at the harbour of Kamares (July-August); anchorages on the leeward east coast (Faros, Platis Gialos) stay calm.`,
    insiderTips: [
      "Eat at Omega3 in Platis Gialos  -  modern Cycladic cuisine, easily the best meal on the island.",
      "Cherronisos (north coast)  -  small anchorage, single excellent taverna (Margarita's), one of the quietest evening experiences in the Cyclades.",
      "Apollonia chora is best at dusk. Park the tender at Kamares harbour, taxi up (15 minutes), walk the chora streets, dinner at To Liotrivi.",
      "The Mastelo lamb dish at Lebesis (Artemonas) is the food experience repeat clients ask to return for.",
      "Kastro on the east coast is the oldest village on Sifnos. 2-hour walk along the cliffs from Apollonia, or 30-minute drive. Worth a half-day.",
    ],
    faq: [
      { q: "Is Sifnos worth a full charter day?", a: "Yes, especially for food-focused charters. 2-3 days is the right allocation as part of a Cycladic loop. Sifnos alone for a full week is possible but most charters combine with Milos, Serifos, or Folegandros for variety." },
      { q: "Where do yachts anchor at Sifnos?", a: "Kamares is the main harbour (sheltered, north-west coast). Platis Gialos on the south-east coast is the secondary anchorage. Vroulidia and Cherronisos on the north for quieter overnight stays." },
      { q: "What's special about Sifnos food?", a: "Sifnos has historically been Greece's source of professional chefs. Local cuisine is characterised by overnight-baked dishes (revithada chickpeas, mastelo lamb), strong cheese tradition (manoura, xinomyzithra), and the highest concentration of fine traditional cooking in the Cyclades. Modern Sifnian cuisine (Omega3, Cantina) builds on this base." },
      { q: "How crowded is Sifnos in August?", a: "Much less than Mykonos, Paros, or Santorini. Sifnos has limited mass-tourism infrastructure and the visitors who come are usually returning food-focused travelers. Yacht charter anchorages are consistently uncrowded." },
      { q: "Can we combine Sifnos with Milos?", a: "Yes  -  they are 25 nm apart and natural pairing destinations. Common pattern: Sifnos (food, chora), Milos (volcanic anchorages, beaches), as a 4-5 day component of a longer Cycladic charter." },
    ],
    cta: "Match me to a yacht for Sifnos →",
  },

  // ─────────────────────────────────────────────────────────────
  // Phase 7 Round 14 (2026-05-12)  -  7 high-traffic islands to close
  // toward the strategy doc's 50-destination target. Each ships with
  // the same full data shape used by /island/[slug] template.
  // ─────────────────────────────────────────────────────────────

  // Cyclades
  {
    slug: "ios",
    name: "Ios",
    region: "Cyclades",
    tagline: "Manganari Bay's white sand, Hora's hilltop chora, and the easiest stop on a Mykonos → Santorini downwind run",
    whyVisit: `Ios sits exactly midway between Mykonos and Santorini in the southern Cyclades  -  a 30 nautical mile reach from each, which makes it the natural overnight on the great Aegean downwind sail. Most charter clients pass through Ios and miss what's actually there. Charter clients who slow down find Manganari Bay on the south coast (the cleanest white-sand anchorage in the Cyclades, accessible only by yacht or a long winding road), the dramatic Hora climbing the hillside above the main harbour, and a UHNW-discovered restaurant scene that's matured fast since 2021. Ios in 2026 is what Paros was in 2018  -  high-quality without the saturation, with anchorages still empty enough to feel private. The yacht-set come here for the swimming and a single perfect dinner ashore, then continue south to Santorini at dawn.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Ios*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "above-beyond", "madicon"],
    seasonality: `**June and September** are Ios's strongest charter months  -  water 22-24°C, Hora atmospheric without August's youth-travel surge, Manganari anchorage uncrowded. **July and August** Ios attracts its traditional young-traveler crowd in the Hora; the yacht-set anchorages (Manganari, Tris Klisies) stay quiet because they're accessible only by yacht. **May and October** are workable for hardier charterers but the Hora restaurant scene contracts.`,
    insiderTips: [
      "Manganari Beach is the must-anchor. Arrive early afternoon for the lunch swim, stay for dinner on board with the bay turning gold at sunset.",
      "Tris Klisies on the south-east coast is the discovery anchorage  -  three small protected bays, completely empty most weeks, sandy bottom.",
      "Hora dinner: Katogi or Lord Byron, both UHNW-set. Reserve 48 hours ahead in August; walking the chora paths after dinner is the experience.",
      "Skip the Hora's main square nightlife  -  that's the backpacker scene. The yacht-set rooftops are further into the warren of streets.",
      "Ios → Santorini is 30 nm with prevailing Meltemi astern: 3.5 hours under motor, 4 hours under sail. Plan dawn departure for the Santorini caldera arrival in afternoon light.",
    ],
    faq: [
      { q: "How long does it take to sail Mykonos to Ios?", a: "30 nautical miles, roughly 3.5 hours under motor or 4-5 hours under sail with the Meltemi astern. Most southbound Cycladic charters anchor at Ios as the Mykonos-Santorini overnight." },
      { q: "Is Ios just a backpacker destination?", a: "The Hora's main square is, but that's a small slice. The yacht-set anchorages (Manganari, Tris Klisies) are accessible only by yacht and stay quiet. The newer restaurant scene serving the UHNW discoverers is in the upper chora and on the south coast." },
      { q: "Can we anchor overnight at Manganari?", a: "Yes  -  sandy bottom, protected from the Meltemi, water depth 3-8m. The southern Cyclades's best overnight anchorage. Tender to shore for taverna dinner; the rest of the bay sleeps." },
      { q: "What's the best yacht type for Ios?", a: "Motor yacht with stabilisers handles the Mykonos-Ios passage smoothest in peak Meltemi. Catamaran is the family-friendly alternative. Sailing yachts handle the downwind run elegantly but anchoring at Manganari is easier on motor or catamaran." },
      { q: "Can we visit Ios in shoulder season?", a: "May and October work but check restaurant openings  -  most of the Hora high-end places open mid-June and close mid-September. The anchorages themselves are accessible year-round." },
    ],
    cta: "Match me to a yacht for Ios →",
  },

  {
    slug: "antiparos",
    name: "Antiparos",
    region: "Cyclades",
    tagline: "The discreet Cycladic island for UHNW visitors avoiding Mykonos energy  -  Soros Bay, Despotiko archaeology, and the Paros ferry's tomorrow problem",
    whyVisit: `Antiparos is the small island west of Paros, separated by a 1-kilometre channel and reached by a 7-minute car ferry from Paros's Pounta port. For UHNW visitors who want the Cycladic light and the Aegean swimming but explicitly do NOT want the Mykonos scene, Antiparos has emerged as the de-facto answer over the past decade. Tom Hanks, the Pichaaras, and a quiet cluster of European old money have summer houses here. The Chora is a single white-washed village, 12 minutes end-to-end on foot, with three restaurants worth dressing for and the deepest concentration of "I'm seeing a friend" UHNW Cycladic moments outside private islands. From a yacht standpoint, Antiparos is mostly about three anchorages: Soros (south coast, white sand, the photograph), Despotiko (the uninhabited island west of Antiparos, Mycenaean sanctuary on shore, blue-water lunch anchorage), and Faneromeni (the south-east cove with the chapel). Charter weeks based on Paros that include 2-3 days in Antiparos waters consistently get the best photography and the quietest swims.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Antiparos*" || cruisingRegion match "*Paros*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "above-beyond", "fos"],
    seasonality: `**June and September** are Antiparos's perfect months. **July and August** the Chora restaurants book 2-3 weeks ahead, but the yacht anchorages (Soros, Despotiko, Faneromeni) stay manageable because they're south-facing and protected from the Meltemi crowd-funnel. **May and October** the island contracts to local-only  -  beautiful but limited dining.`,
    insiderTips: [
      "Soros Beach anchorage: pure white sand, 2-4m depth, sandy holding. The Cyclades's most photographed anchorage and the lunch break of every Paros-based charter.",
      "Despotiko is 5 nautical miles west of Antiparos. Anchor in 4-6m sand, walk the archaeological site on shore (free admission, no guards), swim in the channel.",
      "Antiparos Chora is a 12-minute walk end-to-end. Reserve Yiouli, Captain Pipinos, or Begleri for dinner. The yacht-set bar is at Margarita's after dinner.",
      "The Pounta-Antiparos car ferry runs every 30 minutes day, hourly evening. Brief your captain on schedule if doing a Paros-day-trip option.",
      "If you have a 30m+ motor yacht, anchor at Despotiko then have the captain tender you to Antiparos Chora for evening  -  better than mediterranean-mooring inside the small Antiparos harbour.",
    ],
    faq: [
      { q: "Is Antiparos as crowded as Mykonos?", a: "No, materially less. Antiparos is a deliberate alternative for UHNW visitors who want the Cycladic light without the Mykonos scene. The Chora is small (2,000 year-round population) and the yacht-anchorage geography keeps boat traffic dispersed." },
      { q: "Can we get to Antiparos from Mykonos by yacht?", a: "Yes  -  30 nautical miles south of Mykonos, roughly 3 hours by motor yacht. Most charter weeks build it in via a Mykonos-Paros leg, with Antiparos as the next-day swim anchorage." },
      { q: "What's special about Despotiko?", a: "Uninhabited island west of Antiparos with an actively excavated Mycenaean sanctuary on shore (700+ BCE, dedicated to Apollo). Open archaeological site with no admission, surrounded by the bluest swimming water in the central Cyclades. Lunch anchorage of choice for yacht clients." },
      { q: "What yacht type suits Antiparos?", a: "Catamaran is the natural fit  -  shallow draft accesses Soros and Despotiko at 2-3m depth without anchor concerns. Motor yachts work but anchor in deeper water (6-10m) and tender in. Sailing yachts handle the Paros-Antiparos passages elegantly." },
      { q: "Is Antiparos worth a full charter base or just a day visit?", a: "Day visit / 2-day anchor for most. Antiparos is geographically small and a week here without exploring the wider Cyclades would feel limited. A 7-day Paros-based charter with 2-3 days in Antiparos waters is the optimal mix." },
    ],
    cta: "Match me to a yacht for Antiparos →",
  },

  {
    slug: "tinos",
    name: "Tinos",
    region: "Cyclades",
    tagline: "Twenty minutes from Mykonos but a different country  -  marble villages, Greece's best food, and the quiet old-money Cycladic island",
    whyVisit: `Tinos is 20 nautical miles west of Mykonos and shares the same Aegean waters, but the temperament is opposite. Where Mykonos is Cycladic theatre, Tinos is Cycladic monastic. 40 marble-trade villages cling to the central mountain, the food scene now competes with Athens for the strongest in Greece (most of the famous Athens chefs come from Tinos), and the island has zero internationally-branded hotels. For Mykonos-based charterers, Tinos is the most under-priced single-day anchor in the Cyclades  -  Mykonos to Tinos is 90 minutes by motor yacht, the contrast is total. The yacht-anchorage choice is between the main town harbour (atmospheric quay-side dining, mediterranean-mooring), or a string of small bays on the north and east coasts. Skip the religious-pilgrimage side of Tinos (a Greek-Orthodox phenomenon worth one-visit but not a yacht agenda) and focus on the inland villages: Pyrgos for marble craft, Volax for the boulder landscape, Tarambados for the food.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Tinos*" || cruisingRegion match "*Mykonos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "fos", "above-beyond"],
    seasonality: `**June through September** all work for Tinos. **Late July and August** can attract the religious-pilgrimage crowd around the 15 August Panagia feast (Greek-Orthodox Assumption); the chora gets crowded for 3-4 days. Yacht anchorages stay clear because the pilgrims arrive by ferry. **May and October** are quiet, beautiful, the food scene contracts mildly but the headline restaurants stay open.`,
    insiderTips: [
      "Tinos town quay has mediterranean-mooring slots  -  book via the harbourmaster 24h ahead in season. Dinner at Marathia or Itan Ena Mikro Karavi (yacht-set choices, walk from quay).",
      "Pyrgos village inland is the marble-craft centre  -  half-day excursion via taxi, 25 minutes from the town. The marble work explains why Tinos became wealthy independent of tourism.",
      "Volax village in the central mountain has the strangest landscape in Greece  -  house-size granite boulders scattered as if dropped. Worth a 90-minute side trip.",
      "Anchorage option 2: Panormos Bay (north coast). Smaller, quieter, no quay services. The captain handles fuel/water in Tinos town the next day.",
      "Tinos honey, capers, fava, and louza (cured pork) are the food souvenirs. Brief the chef to provision from the Saturday morning market in the town.",
    ],
    faq: [
      { q: "How far is Tinos from Mykonos by yacht?", a: "12 nautical miles, roughly 90 minutes by motor yacht. The shortest cross-Aegean island hop and one of the easiest Mykonos day trips." },
      { q: "Is Tinos worth a stop on a Cycladic charter?", a: "Yes for food-focused charters, yes for couples who want the Mykonos-anchor + Tinos-quiet alternation. Less so for energy-seeking groups (Tinos is intentionally quiet)." },
      { q: "Can we visit during the 15 August pilgrimage?", a: "Best to plan around it. The pilgrimage crowd is 30,000+ for 3-4 days; the chora is essentially un-restaurant-able. Yacht clients should anchor elsewhere those nights." },
      { q: "What's the food story on Tinos?", a: "Tinos exports chefs. Most of the founding figures of modern Athens dining (Tudou, Spondi, CTC) are Tinian. Local cuisine is heavy on lamb, slow-cooked vegetable dishes, and serious cheese (the island's gouda and graviera compete with Naxian)." },
      { q: "Can we combine Tinos with Mykonos in one week?", a: "Yes  -  typical pattern is 2 Mykonos nights, 1-2 Tinos nights, 2 Paros/Naxos nights, 1 return-leg night. The Mykonos-Tinos hop is short enough to be a same-morning move." },
    ],
    cta: "Match me to a yacht for Tinos →",
  },

  {
    slug: "andros",
    name: "Andros",
    region: "Cyclades",
    tagline: "The northern Cycladic island closest to Athens  -  green hills, shipowner old-money, and the easiest Athens-departure 4-day charter",
    whyVisit: `Andros sits at the northernmost point of the Cyclades, just 50 nautical miles from Athens  -  closer than Mykonos. For Athens-based or short-time visitors, Andros is the cleanest 3-4 day yacht-charter destination in Greek waters. It is also the most under-discovered. Andros is greener than the rest of the Cyclades because it catches more Aegean rain; the central spine has actual forest and mountain springs. The island has been the historical summering home for Greek shipowner families since the 1960s; visiting Andros today means encountering quiet old wealth in the chora, in restored Venetian houses, and in the contemporary art museum (the Goulandris Foundation, one of Greece's strongest private museums). For yacht clients, the anchorages cluster on the south-east coast: Korthi (the main town's harbour), Batsi (the small marina village, easy berthing), Niborio (the deep northern bay), and Apothikes (the wild north-east anchorage). The aesthetic combination of green hillsides + Aegean swimming + old-money discretion is unique in Greek waters.`,
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Andros*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["fos", "genny", "madicon"],
    seasonality: `**June through September** all work. **May and October** are surprisingly viable because Andros's geography keeps water temperatures warmer than the open central Cyclades and the island stays green into late October.`,
    insiderTips: [
      "Andros Chora (Hora) is one of the most architecturally distinguished in the Cyclades  -  neoclassical mansions from shipowner Andriot families, three small museums, an exceptional waterfront promenade.",
      "Goulandris Foundation: contemporary art museum in the Chora, world-class collection (Picasso, Modigliani, etc.). Open in summer only. Worth a half-day shore excursion.",
      "Batsi village marina is the easiest yacht berth  -  small, friendly, walking distance to 4-5 good restaurants. Reserve 48 hours ahead in August.",
      "The mountain hike from Apoikia to Stenies (3 hours) crosses springs and forest, ends in a famous taverna. Have the captain repositions to Stenies bay for evening pickup.",
      "Andros's local product is sausage and goat cheese. The Saturday market at Batsi is the place. The chef provisions there for the rest of the charter.",
    ],
    faq: [
      { q: "Is Andros faster to reach than Mykonos?", a: "Yes  -  50 nautical miles from Athens vs Mykonos's 90 nm. For a short 3-4 day charter from Athens, Andros is the obvious closest destination." },
      { q: "Is Andros developed for tourism?", a: "Less than the rest of the Cyclades. The shipowner-family summering tradition kept the island intentionally low-density. There are no international hotel chains; the high-end accommodation is in restored Venetian mansions or small luxury inns." },
      { q: "Why is Andros greener than other Cycladic islands?", a: "Geography. Andros catches more Aegean rain than the southern Cyclades, has a central mountain spine that retains moisture, and has historical reforestation by the shipowner families. The landscape is closer to the Ionian than to Mykonos or Santorini." },
      { q: "Can we do Andros + Mykonos in one week?", a: "Yes. Athens → Andros (4-5 hours) → Tinos (2 hours) → Mykonos (1.5 hours) is a clean 7-day Cycladic loop. Andros gives you the green-island contrast against Mykonos's exposed Aegean character." },
      { q: "What yacht type suits Andros?", a: "Motor yacht works best for the Athens-Andros transit and provides anchor stability on the south-east coast. Catamaran is family-friendly. Sailing yachts handle the prevailing Meltemi astern beautifully." },
    ],
    cta: "Match me to a yacht for Andros →",
  },

  // Dodecanese
  {
    slug: "kos",
    name: "Kos",
    region: "Dodecanese",
    tagline: "Cosmopolitan Dodecanese hub  -  Hippocrates's island, Turkish coast across the channel, the late-season yacht base after Rhodes",
    whyVisit: `Kos is the second-largest Dodecanese island after Rhodes, 75 nautical miles north of Rhodes and just 3 nautical miles from the Turkish coast at Bodrum. As a yacht-charter base, Kos has three advantages: an international airport with direct flights from northern Europe in summer, a deep marina (Kos Marina) with 250+ berths that's actually engineered for yachts above 25m, and proximity to the Turkish-coast cruising grounds (Bodrum, Gocek) for clients who want to mix Greek and Turkish waters. The island itself has the strongest archaeological credentials in the Dodecanese after Rhodes  -  the Asklepieion sanctuary where Hippocrates trained as a physician, the Roman agora ruins in the town centre, and the medieval Knights Templar castle at the harbour. Charter weeks from Kos typically combine 2-3 days local (Kos town, Kefalos bay south-west, Therma hot-springs anchorage) with 3-4 days touring the smaller Dodecanese (Nisyros volcano, Tilos, Symi). Late-season is Kos's strongest argument  -  water stays 22°C through mid-October, longer than any Aegean group except Rhodes.`,
    yachtFilter: 'cruisingRegion match "*Dodecanese*" || cruisingRegion match "*Kos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "above-beyond", "madicon"],
    seasonality: `**June through October** all work for Kos. **October specifically** is one of Greece's two latest-season viable charter destinations (along with Rhodes). Water still 22°C, thermal wind gentle, all the Kos restaurants open through mid-October. **April and May** the water is cool (18-20°C) but the island is beautifully green and crowd-free.`,
    insiderTips: [
      "Kos Marina is the proper deep-water berthing  -  book via the marina office. Avoid the historic main harbour for anything above 25m (depth + space issues).",
      "The Asklepieion is a 20-minute taxi from the town and is one of the most peaceful Greek archaeological sites. Half-day shore excursion.",
      "Therma hot-springs anchorage on the south-east coast  -  anchor in 4-5m, swim to natural hot spring that flows into the sea. The combination of cool Aegean + hot spring is unusual in Greek waters.",
      "Bodrum (Turkey) is 3 nautical miles east  -  a same-morning cross-border excursion for clients who want the Ottoman castle + bazaar. Customs takes 30 minutes each way; brief the captain.",
      "Kefalos Bay on the south-west coast is the lunch-anchor  -  sandy bottom, protected from north wind, walking distance to a few south-coast tavernas.",
    ],
    faq: [
      { q: "Can we charter Kos with a Turkish-coast leg?", a: "Yes. Bodrum (Turkey) is 3 nautical miles east of Kos and accepts charter yachts via standard customs clearance. Most charter weeks add 1-2 nights on the Turkish coast for the cultural contrast. VAT treatment shifts if non-Greek time exceeds 30% of the charter  -  brief George at booking." },
      { q: "Is Kos better than Rhodes as a charter base?", a: "Different briefs. Rhodes is closer to Symi and the deeper Dodecanese history. Kos is closer to the Turkish coast and has a more international tourism scene. For multi-island Dodecanese charters, Rhodes is the better base; for Greece-Turkey combined weeks, Kos." },
      { q: "How does the Kos late-season compare to Cyclades?", a: "Materially warmer. Kos's southern Aegean position keeps water at 22°C through mid-October when the Cyclades has already dropped to 19-20°C. Rhodes and Kos are the two genuine late-season Greek charter bases." },
      { q: "Direct flights to Kos in 2026?", a: "Kos airport (KGS) has direct flights in summer from London, Manchester, Berlin, Munich, Vienna, Amsterdam, Brussels. Reach via Athens (40-minute flight) outside summer." },
      { q: "What yacht type for Kos?", a: "Motor yacht is best for the deeper Dodecanese-and-Turkey range and the Therma anchorage swim format. Sailing yachts work for clients who want the slower-paced southern Aegean sailing. Catamaran is family-friendly for the Kos-Nisyros volcano excursion." },
    ],
    cta: "Match me to a yacht for Kos →",
  },

  // Sporades
  {
    slug: "skopelos",
    name: "Skopelos",
    region: "Sporades",
    tagline: "Mamma Mia island  -  green Sporades pines, sandy bays, and the family-friendly Northern Aegean alternative to the Cyclades",
    whyVisit: `Skopelos is the middle of the three main Sporades islands (after Skiathos, before Alonissos) and the most-photographed because the 2008 Mamma Mia movie was filmed largely here. Charter clients arrive expecting the movie set and discover something better: a green Aegean island unlike anything in the Cyclades, with pine forests running to the water's edge, several long sandy beaches (rare in Greek waters), and a working monastery on a cliff (the Mamma Mia chapel, Agios Ioannis) that is genuinely beautiful regardless of the movie. The yacht anchorages are on the south coast: Stafylos (the photogenic small bay), Velanio (clothing-optional, sheltered), Limnonari (the long sandy bay), Panormos (a deep north-coast bay sometimes used for overnight). For families with school-age children, Skopelos is the strongest single-island Greek destination  -  the beaches are sandy (not Cycladic pebble), the water is calm (sheltered Sporades), the chora is small and walkable, and the cultural overlay (the movie) gives kids a story-hook. Weather-wise, the Sporades doesn't get the Meltemi (different wind system in the northern Aegean), so 7-knot afternoon breezes are typical.`,
    yachtFilter: 'cruisingRegion match "*Sporades*" || cruisingRegion match "*Skopelos*" || cruisingRegion match "*Skiathos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["genny", "madicon", "fos"],
    seasonality: `**June through September**, all work. **July and August** Skopelos gets a family-charter peak driven by the Mamma Mia association but the island absorbs it gracefully  -  the beaches are long and the population doubles rather than 10×. **May and October** are quiet and beautiful with mild weather but reduced restaurant scene.`,
    insiderTips: [
      "Agios Ioannis Kastri (the Mamma Mia chapel) is a 100-step climb from a small bay on the north-east coast. Anchor offshore, tender in, climb at sunset for the photograph everyone wants.",
      "Stafylos beach on the south coast is the iconic small-cove anchorage  -  sandy, sheltered, 2-3m depth, 200m of beach.",
      "Glossa village on the north-west coast is the discreet alternative to the main chora  -  12 minutes walk end-to-end, two excellent tavernas (Agnandi, Old Glossa), zero crowd.",
      "Skopelos plum-and-cheese pies and rosehip jam are the food souvenirs. Buy in the chora's Saturday market.",
      "Combine Skopelos + Skiathos in a 7-day Sporades charter  -  Skiathos for evening dining, Skopelos for daytime swimming and the Mamma Mia photography.",
    ],
    faq: [
      { q: "Where is the Mamma Mia chapel?", a: "Agios Ioannis Kastri, on a rocky promontory on the north-east coast of Skopelos. Reach by yacht (anchor offshore, tender in) or by 30-minute drive from the chora. The climb to the top is 100+ steps but the view is the photograph in the film." },
      { q: "Is Skopelos a good family destination?", a: "Excellent. Sandy beaches (rare in Greek waters), calm Sporades water (no Meltemi), short distances between anchorages, and the cultural overlay of the Mamma Mia association giving kids a story-hook. The strongest single-island Greek family-charter destination." },
      { q: "How far is Skopelos from Athens?", a: "120 nautical miles, roughly a 12-hour overnight passage. Most charters fly clients to Skiathos airport (60 minutes from Athens by air) and board the yacht at Skiathos marina or Skopelos itself." },
      { q: "What's the difference between the three Sporades islands?", a: "Skiathos is the busiest (international airport, scene), Skopelos is the family-friendly middle one (sandy beaches, Mamma Mia), Alonissos is the wild quiet one (national marine park, hiking). A 7-day Sporades charter typically hits all three." },
      { q: "Is there a Meltemi in the Sporades?", a: "No. The Sporades is in the northern Aegean and gets a different wind system  -  gentler easterly thermals, less intense than the Cyclades Meltemi. Sailing is consistent but never overwhelming." },
    ],
    cta: "Match me to a yacht for Skopelos →",
  },

  {
    slug: "patmos",
    name: "Patmos",
    region: "Dodecanese",
    tagline: "The most beautiful island in the Greek world  -  UHNW-discreet, the Apocalypse cave, and Greece's most architecturally preserved hilltop chora",
    whyVisit: `Patmos is consistently rated by Greek and international travel writers as the most beautiful island in Greek waters  -  and unlike Mykonos or Santorini, it hasn't been overrun. Three reasons: religious-pilgrimage status (the Cave of the Apocalypse where the Apostle John wrote Revelation; the 11th-century Monastery of Saint John dominating the hilltop) constrains development; UNESCO World Heritage protection limits new construction; and the deliberate UHNW-family stewardship since the 1970s has kept the island's character intact. The Chora is the most architecturally preserved hilltop village in the Aegean  -  narrow lanes, white-washed walls, the medieval monastery walls visible from every viewpoint. Around it are several anchorages: Skala (the main port and yacht-base), Grikos Bay (the south-east UHNW summer-house bay), Vagia (the north quiet anchorage). For charter clients, Patmos is the choice when the brief is "the most beautiful Greek island, with discretion"  -  a different conversation from "the most fun" or "the most photogenic". The yacht-set who summer here include some old-money names that other Cycladic destinations don't see.`,
    yachtFilter: 'cruisingRegion match "*Dodecanese*" || cruisingRegion match "*Patmos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["fos", "genny", "madicon"],
    seasonality: `**June and September** are the best Patmos months  -  perfect weather, the religious pilgrimage crowd absent, the chora quiet enough to walk. **July and August** Greek-domestic and European old-money visitors are present but never in numbers; the chora restaurants book 5-7 days ahead. **Easter and the 15 August Panagia feast** the religious-pilgrimage crowd intensifies; yacht clients should plan around these dates if seeking discretion.`,
    insiderTips: [
      "The Monastery of Saint John is the architectural anchor  -  a 30-minute uphill walk from Skala. The view from the monastery terrace at sunset is one of the great Aegean panoramas.",
      "Grikos Bay is the UHNW-summer-house anchorage. Anchor in 5-8m, tender into the village for dinner at Benetos or Patelas  -  both have UHNW-set regulars.",
      "Chora dinner: Lampi or Kafenes. Both small, both essential, both need 48-hour bookings in summer.",
      "Skala harbour has mediterranean-mooring; for larger yachts anchor in the bay and tender in. The harbour is the practical base but the chora (3 km uphill) is the experience.",
      "The Cave of the Apocalypse is between Skala and the chora  -  a quiet 20-minute visit, then continue uphill. Worth fitting in even for non-religious visitors.",
    ],
    faq: [
      { q: "Is Patmos religious-pilgrimage destination?", a: "Yes for Greek Orthodox visitors (the Cave of the Apocalypse, the Monastery of Saint John). For yacht clients, the religious history is the architectural anchor that's kept the island preserved  -  the visit itself can be cultural rather than religious." },
      { q: "How does Patmos compare to Mykonos?", a: "Opposite registers. Mykonos is energetic, photographed, and scene-driven. Patmos is contemplative, architectural, and discretion-driven. UHNW visitors who 'graduate' from Mykonos often land here. Both have their place." },
      { q: "How far is Patmos from Athens?", a: "150 nautical miles east, roughly a 12-14 hour overnight passage. Most charters fly clients to Kos or Samos and reposition the yacht to meet them at Patmos's Skala harbour. Direct flights to Patmos itself: none (no airport)." },
      { q: "Is Patmos overcrowded in summer?", a: "Materially less than Mykonos or Santorini. UNESCO protection + religious-pilgrimage timing creates natural pacing. The chora can feel busy in late July-August around dinner hour, but the yacht anchorages and the hilltop monastery walks stay quiet." },
      { q: "What's the best yacht type for Patmos?", a: "Motor yacht with stabilisers is the most versatile (the Skala approach can be exposed in late afternoon Meltemi from the north). Sailing yachts handle the open passages elegantly. For families, catamaran works at the Grikos Bay anchorage." },
    ],
    cta: "Match me to a yacht for Patmos →",
  },
];

export function getIslandBySlug(slug) {
  return ISLANDS.find((i) => i.slug === slug) || null;
}
