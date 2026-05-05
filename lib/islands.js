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
  {
    slug: "rhodes",
    name: "Rhodes",
    region: "Dodecanese (south-east)",
    tagline: "Medieval old town, Symi at lunch, the Anatolian coast within tender range",
    whyVisit: `Rhodes is the Dodecanese flagship — geographically closer to Turkey than to Athens, culturally a millennia-deep layer cake of Knights Hospitaller, Ottoman, and Italian colonial influences. The medieval old town inside the Knights' walls is the largest inhabited UNESCO World Heritage walled city in Europe, and its restaurants stay open later than anywhere else in Greek waters. From a yacht-charter perspective, Rhodes is a basing decision: it's far from Athens (~250 NM, a full day-and-night repositioning), but once you're there the entire Dodecanese unfolds in tight succession — Symi (45 minutes by tender), Tilos, Halki, Kos, Kalymnos all within day-sail range. For UHNW clients who want a charter that feels like leaving the Cyclades crowd entirely without giving up Greek waters, Rhodes is the answer.`,
    yachtFilter: 'cruisingRegion match "*Dodecanese*" || cruisingRegion match "*Rhodes*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["la-pellegrina-1", "kos-52", "ariela"],
    seasonality: `Rhodes's southern latitude means **the season runs longer than the Cyclades** — May through October all viable, with **June and late September** the consensus sweet spots. **July and August** stay manageable because the heat is offset by reliable afternoon sea breezes and the island's size disperses visitors. **Winter** charters are technically possible (the harbour's protected) but most yachts reposition to the Cyclades by late October.`,
    insiderTips: [
      "Anchor in Mandraki Harbour at the foot of the old town for one night — the medieval walls glow gold from the deck at sunset.",
      "Symi is 45 minutes by tender from Rhodes harbour. Lunch at Yialos, swim at Pedi, return for dinner in Rhodes.",
      "Lindos, on the east coast, is the iconic acropolis-and-white-village postcard. Anchor at St Paul's Bay below it.",
      "Halki, an hour west, is the quietest of all Dodecanese — almost no tourism, restored neoclassical mansions, the calmest evening you'll find.",
      "Skip Faliraki entirely — that's the package-tour zone. Stay south of the city for everything that matters.",
    ],
    faq: [
      {
        q: "Is Rhodes too far from Athens for a one-week charter?",
        a: "Tight but possible on faster yachts — La Pellegrina 1 or M/Y One can position to Rhodes in under 24 hours of motoring. For most charters, a two-week itinerary works better, OR fly clients into Rhodes International (RHO) and board there directly.",
      },
      {
        q: "Can I board a yacht directly in Rhodes?",
        a: "Yes — Mandraki Harbour and Rodos Marina (south of the city) both accommodate charter yachts. Several yachts in the fleet will reposition to Rhodes for charter starts at no extra cost during peak weeks.",
      },
      {
        q: "What's the day-trip range from Rhodes?",
        a: "Symi (45 min by tender), Halki (1.5 hrs), Tilos (3 hrs), Kos (3.5 hrs). For longer arcs: Patmos (5-6 hrs), Astypalaia (5 hrs). The Anatolian Turkish coast is technically reachable but requires a separate cruising permit.",
      },
      {
        q: "What about the Turkish coast?",
        a: "Symi sits halfway between Rhodes and the Datça peninsula; charter yachts on Greek flag stay in Greek waters by default. Crossing into Turkish waters requires a transit log and isn't worth the paperwork for most one-week charters.",
      },
      {
        q: "Are there yachts based in Rhodes year-round?",
        a: "Currently no permanent fleet based on Rhodes; yachts reposition seasonally. For a Rhodes-based charter, plan 3-4 months ahead so the right yacht repositions.",
      },
    ],
    cta: "Match me to a yacht for Rhodes →",
  },
  {
    slug: "skiathos",
    name: "Skiathos",
    region: "Sporades (north-west Aegean)",
    tagline: "The greenest islands in Greece — Skiathos, Skopelos, Alonissos and the National Marine Park",
    whyVisit: `Skiathos is the Aegean's mainland-Mediterranean answer to the Cyclades — pine-forested, lush, almost Italian in vegetation, and centred on the only Sporades airport with international flights. The harbour is small and beautiful (Old Port for charm, New Port for serious yachts), the Bourtzi peninsula juts into the bay like a green ship anchored permanently in town. From here, the Sporades archipelago unfolds in tight succession: Skopelos (the Mamma Mia island, 45 min by tender), Alonissos (gateway to the National Marine Park), and the deserted islets of Kyra Panagia and Gioura, where Mediterranean monk seals still breed. UHNW charter clients often pair the Sporades with a Mt. Pelion mainland day — restaurants in Damouchari, drives through the chestnut forests, then back to the yacht for a Sporades sunset that stays lit until nearly 21:30 in June.`,
    yachtFilter: 'cruisingRegion match "*Sporad*" || cruisingRegion match "*Skiathos*" || cruisingRegion match "*Greece*"',
    itineraryYachts: ["la-pellegrina-1", "ariela", "summer-fun"],
    seasonality: `Skiathos's northern latitude means **the calendar shifts north**: peak season is **late June through August**, with September lovely but cooler than the Cyclades. **May and early June** have the green still vivid (the meltemi hasn't dried it out yet) and water cold but swimmable. The **National Marine Park** has access restrictions June-October to protect the monk-seal breeding sites — your captain will know which Class A and Class B zones you can enter on which dates.`,
    insiderTips: [
      "Anchor at Lalaria Beach (north Skiathos) for the white-pebble photos — accessible only by boat, no land access.",
      "Skopelos's Agios Ioannis chapel-on-a-rock is the Mamma Mia wedding scene. Worth the photo, not the climb in August heat.",
      "Alonissos's National Marine Park requires a permit for some zones; have the captain arrange in advance.",
      "Kyra Panagia and Gioura — the deserted islets — are worth a full day. You may see monk seals; behave like a guest.",
      "Tsougria Island is 1 NM south of Skiathos chora — perfect lunch anchorage, sandy bay, taverna ashore.",
    ],
    faq: [
      {
        q: "How does Skiathos compare to the Cyclades?",
        a: "Greener, smaller distances between islands, fewer yachts, no meltemi. The Cyclades have the iconic Greek aesthetic; the Sporades have the Mediterranean-forest aesthetic. Many second-time charterers try one then the other.",
      },
      {
        q: "Can I fly directly into Skiathos?",
        a: "Yes — Skiathos National Airport (JSI) has summer connections from London, Paris, Amsterdam, and most major European hubs. Boarding a yacht at Skiathos New Port saves the 8-10 hour repositioning leg from Athens.",
      },
      {
        q: "Are there yachts based in the Sporades?",
        a: "Currently no permanent Sporades-based fleet; yachts reposition seasonally from Athens. For a Sporades charter, plan 2-3 months ahead and the right yacht will reposition to Skiathos at no extra cost.",
      },
      {
        q: "Is the Marine Park accessible by yacht?",
        a: "Yes, but with rules — Alonissos National Marine Park has Zone A (no entry June-October) and Zone B (permit required). Your captain handles the paperwork; you'll just want to know which anchorages are off-limits during which weeks.",
      },
      {
        q: "What about Mt. Pelion?",
        a: "The mainland Pelion peninsula is 45 minutes by tender from Skiathos. Damouchari (the Mamma Mia village), Tsagarada, and Mylopotamos beach are all worth a half-day inland excursion — chestnut forests, traditional villages, mountain tavernas.",
      },
    ],
    cta: "Match me to a yacht for Skiathos →",
  },
];

export function getIslandBySlug(slug) {
  return ISLANDS.find((i) => i.slug === slug) || null;
}
