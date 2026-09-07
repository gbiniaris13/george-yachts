// "Best yachts for X" series - Phase 7 Round 35 (2026-05-12).
// Technical brief Priority 5B.
//
// 10 high-intent comparison/recommendation pages. Each names yacht
// specs (not specific vessels - avoids outdated info) for a given
// use case. Schema: Article + ItemList + FAQPage.

// 2026-09-07: fleet composition is imported from lib/fleetCount.js, the one
// place it is written, so no page here can drift from the served fleet.
import { FLEET_COUNT, CATAMARAN_COUNT, FLEET_COMPOSITION } from "@/lib/fleetCount";

export const BEST_YACHTS_PAGES = [
  {
    slug: "best-yachts-greece-large-groups",
    urlPath: "/best-yachts-greece-large-groups",
    eyebrow: "Large groups (10-12 guests)",
    h1: "Best Yachts in Greece for Large Groups",
    tagline: "The SOLAS 12-guest cap is the hard line. Here are the yacht specs that deliver the right experience at that cap.",
    quickAnswerQ: "What's the best yacht in Greece for a group of 10-12?",
    quickAnswerA: "For 10 to 12 guests, target a 35 to 40 metre motor yacht with five cabins and stabilisers, a superyacht above 50 metres, or a 23 to 24 metre catamaran with five or six cabins. On the Greek Charter Index 2026 those bands list at EUR 60,000 to 120,000, EUR 162,500 to 235,000 and EUR 49,000 to 90,000 a week net base. The 12-guest cap means a bigger yacht still sleeps twelve: the extra size buys amenity per guest, not more guests. For groups of 13 or more, a two-yacht flotilla is the answer.",
    yachts: [
      { spec: "35-40m motor yacht with 5 cabins", weekly: "€60,000-120,000 (Greek Charter Index 2026)", why: "The most balanced spec: five to seven crew, stabilisers, a proper galley." },
      { spec: "Superyacht above 50m, 6 cabins", weekly: "€162,500-235,000", why: "A sixth cabin for split occupancy or single-room comfort; nine or more crew." },
      { spec: "Sailing or power catamaran 23-24m, 5-6 cabins", weekly: "€49,000-90,000", why: "The full twelve on one platform, deck space the width of the boat." },
      { spec: "Power catamaran 20-22m, 4-5 cabins", weekly: "€34,000-69,000", why: "Zero roll at anchor, shallow draft, and the passages shrink." },
    ],
    faq: [
      { q: "Why not bigger yacht for 12 guests?", a: "You can. Above 50 metres the Index lists EUR 162,500 to 235,000 a week net base, and what the size buys is service ratio, a beach club, sometimes a helipad, never a thirteenth guest. Worth it for a milestone week." },
      { q: "Can I add day guests for events?", a: "Yes. The 12-cap is overnight only. Day events can host 18-24 additional guests via tender from shore. Standard practice for dinners, lunches, sundowners." },
      { q: "What if my group is 14-16?", a: "Multi-yacht flotilla: two yachts in parallel formation, alternating dinner host, shared itinerary. Each yacht is priced from its own rate card, one price per yacht per week, so the cost is two Index bands side by side. Common arrangement for weddings and milestone events." },
    ],
    seoTitle: "Best Yachts in Greece for Large Groups 10-12 Guests",
    seoDescription: "Best yachts for 10-12 guests in Greece: 35-40m motor yachts, 23-24m catamarans, superyachts above 50m, with Index 2026 rates. The 12-guest cap, explained.",
  },
  {
    slug: "best-yachts-greece-families-children",
    urlPath: "/best-yachts-greece-families-children",
    eyebrow: "Families with children",
    // 2026-08-22. Τρεις σελίδες του site απαντούν «yacht charter Greece with
    // children» και η Google το ξέρει: σερβίρει το άρθρο των 5.427 λέξεων
    // /blog/yacht-charter-greece-with-young-children στη θέση 4,5 και αφήνει
    // αυτήν εδώ και την /yacht-charter-greece-family-with-children να
    // μοιράζονται 85 εμφανίσεις στις θέσεις 37 και 39. Αυτή η σελίδα δεν
    // είναι ο οδηγός, είναι Η ΕΠΙΛΟΓΗ ΣΚΑΦΩΝ: ποιες καμπίνες, ποια
    // καταστρώματα, ποιο μέγεθος για ποια οικογένεια. Το h1 το λέει.
    h1: "Family Yachts in the Greek Fleet: Cabins, Decks and Size",
    tagline: "Catamarans dominate the family chartering market for good reason. Here's the full spec landscape for kids of every age.",
    quickAnswerQ: "What's the best yacht for a family with young children in Greece?",
    // 2026-09-07 (plan #10, depth): 225 → ~1,200 words of checkable facts.
    // The AI-shaped queries this page already draws ("best charter yachts in
    // Greece for families with young children", "top Greece superyacht charter
    // experts for UHNW families") get direct answers. Rates = Index 2026,
    // depths = anchorage guides, desk counts = the Helm log since 30 May.
    quickAnswerA: "Catamarans win for families with children under ten: they barely roll at anchor, so children sleep through the night and through anchor moves, their draft is often under two metres, so they anchor close to sandy beaches monohulls cannot reach, and they carry far more level deck space at the same length. For older children a 35 to 40 metre motor yacht with stabilisers and a full water-toy inventory works better. On the Greek Charter Index 2026 a fully crewed sailing catamaran for eight starts at EUR 10,900 a week, per yacht, before VAT and APA. Under ten, we route the Ionian, which the Meltemi does not reach.",
    keyFacts: [
      "Fully crewed sailing catamaran for eight guests: from EUR 10,900 a week at 14 metres; 16 to 19 metres EUR 18,900 to 27,500; 20 to 22 metres EUR 31,500 to 43,500 (Greek Charter Index 2026).",
      "Two families on one platform: a 23 to 24 metre catamaran, five or six cabins, EUR 49,000 to 90,000 a week; the six-cabin layout carries the twelve guests most Greek charter yachts are licensed for.",
      `Of the ${FLEET_COUNT} yachts we represent, ${CATAMARAN_COUNT} are catamarans, ${FLEET_COMPOSITION.sailingCat} sailing and ${FLEET_COMPOSITION.powerCat} power.`,
      "Children's swimming in the Ionian: Antipaxos Voutoumi 5 to 10 metres over sand, Paxos Lakka 3 to 4 metres over sand, Corfu Agni Bay 5 to 10 metres, all from the verified anchorage guides.",
      "One in six enquiries on this desk this season came from a family (12 of 68 requests logged since 30 May 2026); the most common party is six guests.",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026 and anchorage guides", href: "/greek-charter-index-2026" },
    yachts: [
      { spec: "Sailing catamaran 12-16m", weekly: "€10,900-22,000 (Greek Charter Index 2026)", why: "One family of up to eight, the crewed floor, the Ionian at sailing pace." },
      { spec: "Sailing catamaran 16-19m", weekly: "€18,900-27,500 (Greek Charter Index 2026)", why: "Four cabins, family-friendly pace, a sailing week for older children." },
      { spec: "Power catamaran 20-22m", weekly: "€34,000-69,000 (Greek Charter Index 2026)", why: "Zero roll, shallow draft, a large level deck for children's activities, motor-yacht pace between islands." },
      { spec: "Sailing or power catamaran 23-24m", weekly: "€49,000-90,000 (Greek Charter Index 2026)", why: "Two families on one platform: five or six cabins, up to twelve guests, every catamaran advantage at flagship size." },
      { spec: "Motor yacht 35-40m with stabilisers", weekly: "€60,000-120,000 (Greek Charter Index 2026)", why: "Space, amenity, a larger crew and a stewardess who runs the children's day; the fuel sits in a 30 to 40% APA." },
    ],
    faq: [
      { q: "Cyclades or Ionian for kids?", a: "Ionian for children under ten. The Meltemi, the summer north wind, blows hardest through the central Cyclades on July and August afternoons and favours larger, faster, more powerful yachts; the Ionian is sheltered from it, the passages between Corfu, Paxos and Antipaxos are short, and the anchorages are sand in three to ten metres with village tavernas ashore. The Cyclades reward older children who enjoy a breezy sail, ideally on a catamaran of 20 metres or more. The same yacht carries the same rate card to either sea." },
      { q: "What are the best charter yachts in Greece for families with young children?", a: "A crewed catamaran of 16 to 24 metres with four to six cabins, or a motor yacht of 35 to 40 metres with stabilisers. The catamaran wins for children under ten: no roll at anchor, a shallow draft that reaches the sandy beaches, a level deck, and a crew of two to six. The motor yacht wins when the family wants more cabins, a larger crew and the full toy inventory. The named yachts we rank are on our catamaran page; this page is the spec landscape." },
      { q: "How much does a family yacht charter in Greece cost?", a: "Per yacht per week before VAT and APA, on the Greek Charter Index 2026: a fully crewed sailing catamaran from EUR 10,900 at 14 metres, EUR 18,900 to 27,500 at 16 to 19 metres, EUR 31,500 to 43,500 at 20 to 22 metres, EUR 56,000 to 90,000 at 23 to 24 metres; a power catamaran EUR 14,000 to 28,000 up to 17 metres, EUR 34,000 to 69,000 at 20 to 22 metres, EUR 49,000 to 90,000 at 23 to 24 metres; a motor yacht of 35 to 40 metres EUR 60,000 to 120,000. Add VAT at 5.2 to 12% by certification, APA of 20 to 30% on a catamaran or 30 to 40% on a motor yacht, and a customary 10 to 15% crew gratuity on the base. One price for the whole family, never divided by heads." },
      { q: "What about teenage water toys?", a: "Teenagers want e-foils (12 and up), Seabobs (10 and up) and jet skis (16 and up, where the yacht carries them and the harbour allows them). Brief George at least two weeks ahead so the yacht stocks the right kit for your children's ages; toys carried by the yacht are included, toys hired in are priced on request." },
      { q: "Can crew handle infant routines?", a: "Yes. Nap timing, bottle preparation and baby-monitor support are routine for a family crew, and the chef writes the children's menu from your brief. High chairs, travel cots and children's lifejackets go on the preference sheet and the yacht sources them before you board. Brief the specifics at least two weeks ahead so the right stewardess is on board." },
      { q: "Which yachts suit a multi-generational or UHNW family?", a: "Three generations want cabins, privacy and a crew that runs two programmes at once. On the Index that is the 23 to 24 metre catamaran with five or six cabins, EUR 49,000 to 90,000 a week, or a 35 to 40 metre motor yacht with stabilisers and five to seven crew, EUR 60,000 to 120,000; above that, the two yachts over 50 metres run EUR 162,500 to 235,000 with twelve or more guests and a crew that includes a dedicated children's stewardess. Every rate is per yacht per week before VAT and APA, and the yacht is chosen for the ages on board, not the other way round." },
      { q: "How far ahead should a family book for the school holidays?", a: "For July and August, six to twelve months ahead, and the five and six cabin catamarans go first because there are fewer of them than any brochure suggests. If your dates are fixed to the school calendar, treat any available family yacht as a same-week decision. On this desk, 26 of the 57 dated enquiries received between 30 May and 6 September 2026 were already for 2027." },
      { q: "What if a child gets seasick?", a: "Choose the hull for it: a catamaran barely rolls to begin with, and a motor yacht with gyroscopic stabilisers takes most of the roll out at anchor as well as under way. Then let the itinerary do the rest. In the Ionian the passages are short and mostly in the morning calm; the longest leg of our family loop, Corfu Town to Paxos, is 35 nautical miles, and every other passage is under 20." },
    ],
    seoTitle: "Family Yachts in Greece: Cabin Plans, Deck Space, Sizes",
    seoDescription: "Best family yacht specs Greece: catamarans, stabilised motor yachts. Ionian vs Cyclades. Real pricing. Family-tested by George Yachts.",
  },
  {
    slug: "best-yachts-greece-couples",
    urlPath: "/best-yachts-greece-couples",
    eyebrow: "Couples / honeymoon",
    h1: "Best Yachts in Greece for Couples",
    tagline: "For two guests, the right yacht is intimate, fast, and romantic without the overhead of bigger-yacht logistics.",
    quickAnswerQ: "What's the best yacht for a couple's Greek charter?",
    quickAnswerA: "For a couple, target a 22 to 24 metre motor yacht (three crew, EUR 21,000 to 33,000 a week net base on the Greek Charter Index 2026), a 24 to 31 metre sailing yacht (EUR 24,000 to 49,000) or a 12 to 16 metre sailing catamaran with the boat to yourselves (EUR 10,900 to 22,000). Smaller crews mean more privacy, faster Cyclades passages, and shorter pre-charter logistics. Honeymoons typically combine 1-2 nights Santorini caldera with 4-5 nights smaller Cyclades.",
    yachts: [
      { spec: "Motor yacht 22-24m, the master yours", weekly: "€21,000-33,000 (Greek Charter Index 2026)", why: "Maximum intimacy, fast passages, three crew" },
      { spec: "Motor yacht 26-31m, 4 cabins for two", weekly: "€40,000-65,000", why: "Room to spread out, separate dining areas, stabilisers at anchor" },
      { spec: "Sailing yacht 24-31m", weekly: "€24,000-49,000", why: "Sailing into the sunset, lower fuel, a romantic pace" },
      { spec: "Sailing catamaran 12-16m", weekly: "€10,900-22,000", why: "Stability and space, for couples who get queasy or want value" },
    ],
    faq: [
      { q: "Why not a bigger yacht for a couple?", a: "You can - 35m+ yachts for a couple deliver more amenity per guest. But the crew-to-guest ratio gets odd (5-6 crew for 2 guests can feel intrusive). Most couples find 24-30m the sweet spot for privacy + service." },
      { q: "Best month for a couples' Greek charter?", a: "Late June or early September. Same warm water, rates at the low end of each Index band, Meltemi quieter, less yacht traffic at the iconic anchorages." },
      { q: "Can the yacht arrange a proposal or anniversary setup?", a: "Yes - flowers, photographer, custom champagne label, surprise anchor timing. Brief George 21+ days ahead." },
    ],
    seoTitle: "Best Yachts in Greece for Couples + Honeymoon",
    seoDescription: "Best yachts for a couple in Greece: 22-24m motor yachts from EUR 21,000 a week, catamarans from 10,900, Index 2026. Romantic itineraries, proposal logistics.",
  },
  {
    slug: "best-yachts-greece-corporate-events",
    urlPath: "/best-yachts-greece-corporate-events",
    eyebrow: "Corporate / events",
    h1: "Best Yachts in Greece for Corporate Events",
    tagline: "Off-sites, client hosting, board retreats. The yacht specs that signal seriousness without overspending.",
    quickAnswerQ: "What's the best yacht in Greece for a corporate event?",
    quickAnswerA: "For corporate events, target a 35 to 40 metre motor yacht (five cabins, up to 12 guests, EUR 60,000 to 120,000 a week net base on the Greek Charter Index 2026) or a superyacht above 50 metres for upper-tier client hosting (EUR 162,500 to 235,000). Aft decks at anchor work as meeting spaces. Starlink + 4G/5G connectivity across the archipelago. MYBA-standard NDAs available. One price per yacht per week, before APA, VAT at the certified rate and gratuity.",
    yachts: [
      { spec: "Motor yacht 35-40m", weekly: "€60,000-120,000 (Greek Charter Index 2026)", why: "Standard corporate spec, 12-guest cap, meeting-ready aft deck" },
      { spec: "Superyacht above 50m", weekly: "€162,500-235,000", why: "Premium client hosting, board-meeting privacy, nine or more crew" },
      { spec: "Sailing or power catamaran 23-24m", weekly: "€49,000-90,000", why: "Deck space the width of the boat for working sessions" },
    ],
    faq: [
      { q: "Can we run a board meeting onboard?", a: "Yes - aft decks at anchor are excellent meeting spaces. Starlink + 4G/5G connectivity throughout. Captain holds calm anchorage on request." },
      { q: "Are corporate charters tax-deductible?", a: "Depends on jurisdiction and use case. Client-hosting is typically marketing/BD spend; off-sites are training/development. Consult your tax advisor. George provides MYBA-standard invoices." },
      { q: "Can we bring extra event staff (DJ, photographer)?", a: "Yes - via George's vendor network. Standard yacht crew handles base service; specialty staff coordinated separately." },
    ],
    seoTitle: "Best Yachts in Greece for Corporate Events + Off-Sites",
    seoDescription: "Best corporate charter yachts in Greece: 35-40m motor yachts EUR 60,000-120,000 a week, superyachts above 50m, on the Index 2026. Meeting-ready aft decks, NDAs.",
  },
  {
    slug: "best-yachts-greece-stabilizers-smooth-sailing",
    urlPath: "/best-yachts-greece-stabilizers-smooth-sailing",
    eyebrow: "Smoothest yachts",
    h1: "Best Yachts in Greece with Stabilizers",
    tagline: "The yachts that eliminate roll entirely. For motion-sensitive guests or wind-day comfort on the Cyclades.",
    quickAnswerQ: "Which yacht specs in Greece have the best stabilisers?",
    quickAnswerA: "Zero-speed gyroscopic stabilisers take most of the roll out of a motor yacht at anchor as well as under way, which is what matters in a meltemi week in the Cyclades. Catamarans barely roll to begin with and need none. The stabiliser fit is a yacht-by-yacht fact, stated on each rate card and confirmed before the shortlist; the Index band is the same with or without it, EUR 40,000 to 65,000 at 26 to 31 metres and 60,000 to 120,000 at 35 to 40.",
    yachts: [
      { spec: "Motor yacht 26-31m with stabilisers", weekly: "€40,000-65,000 (Greek Charter Index 2026)", why: "Modern build, stabilised at anchor, the motion-sensitive party's answer" },
      { spec: "Motor yacht 35-40m with stabilisers", weekly: "€60,000-120,000", why: "Maximum comfort in a meltemi week, five to seven crew" },
      { spec: "Crewed catamaran 12-24m", weekly: "€10,900-90,000", why: "Naturally roll-resistant, no stabiliser needed" },
    ],
    faq: [
      { q: "Do stabilisers consume fuel?", a: "Gyroscopic systems run on the generator, so the yacht burns a little more fuel at anchor with them on. The cost sits inside the APA and is small against a week's fuel; the comfort gain is not." },
      { q: "Are stabilisers retrofitted on older yachts?", a: "Some - Seakeeper retrofits became common 2018+. Pre-2015 yachts often still have fin-only systems (effective underway, less so at anchor). Always ask specifically." },
      { q: "Can stabilisers handle Meltemi?", a: "Modern gyro systems handle 25-knot Meltemi easily at anchor. In severe conditions (30+ knots), captain may relocate to sheltered anchorage anyway." },
    ],
    seoTitle: "Best Yachts in Greece with Stabilizers | Seakeeper Spec",
    seoDescription: "Best stabilised charter yachts in Greece: 26-40m motor yachts with gyroscopic stabilisers from EUR 40,000 a week, Index 2026, and the catamarans that need none.",
  },
  {
    slug: "best-sailing-yachts-greece",
    urlPath: "/best-sailing-yachts-greece",
    eyebrow: "Sailing yachts",
    h1: "Best Sailing Yachts in Greece",
    tagline: "Modern luxury sailing yachts offer the sailing experience itself at a lower band than a motor yacht of the same length. Here is the spec landscape.",
    quickAnswerQ: "What's the best sailing yacht charter in Greece?",
    quickAnswerA: "For sailing yachts in Greece, target a 24 to 31 metre crewed sailing yacht for the balance of amenity and sailing experience: EUR 24,000 to 49,000 a week net base on the Greek Charter Index 2026, against 40,000 to 65,000 for a motor yacht of similar length. Performance sailing yachts (Wally, Baltic) prioritise speed but have less guest space. The Ionian Sea (no Meltemi) suits relaxed sailing; the Cyclades for charterers who want wind.",
    yachts: [
      { spec: "Sailing yacht 24-31m (cruising spec)", weekly: "€24,000-49,000 (Greek Charter Index 2026)", why: "The crewed sailing yacht band on the Index, family-friendly" },
      { spec: "Sailing catamaran 20-22m", weekly: "€31,500-43,500", why: "The sailing experience with a table that stays set" },
      { spec: "Sailing catamaran 23-24m", weekly: "€56,000-90,000", why: "The largest crewed sailing platforms on the Index, up to 12 guests" },
      { spec: "Sailing catamaran 16-19m", weekly: "€18,900-27,500", why: "Family-friendly stability at a sailing pace" },
    ],
    faq: [
      { q: "Do I need to know how to sail?", a: "No - crewed sailing yachts have professional crew handling every aspect of sailing. Guests can be entirely passengers. Captain teaches the helm in 1-2 hours if interested." },
      { q: "Sailing vs motor yacht for the same length?", a: "Sailing yachts are 30-40% cheaper for equivalent length. Pay-off: slower passages (8-10 knots cruise vs 13-16), less interior volume (mast takes vertical space). Right for buyers who specifically want the sailing experience." },
      { q: "Ionian vs Cyclades for sailing?", a: "Ionian for relaxed family sailing (no Meltemi, calm waters). Cyclades for charterers who want wind sailing experience (real downwind passages in Meltemi)." },
    ],
    seoTitle: "Best Sailing Yacht Charter Greece | 30-60m Specs",
    seoDescription: "Best crewed sailing yachts in Greece: 24-31m sailing yachts EUR 24,000-49,000 a week, sailing catamarans from 18,900, Index 2026. Where the wind is.",
  },
  {
    slug: "best-catamarans-greece-charter",
    // 2026-09-04 (US first): 1,123 US impressions at position 46; the numbers go first.
    keyFacts: [
      "ALTEYA, Sunreef 70 Power, 8 guests: EUR 49,000 to 69,000 a week, net base",
      "Genny and Above & Beyond, Sunreef 80, 8 to 10 guests: EUR 56,000 to 79,000",
      "Ad Astra and ChristAl MiO 80, Fountaine Pajot Thira 80, up to 12 guests: EUR 65,000 to 90,000",
      "Entry to fully crewed: Endless Beauty, Fountaine Pajot MY 44, EUR 14,000 to 17,500; the Index band for 12 to 16m sailing catamarans is EUR 10,900 to 22,000"
    ],
    urlPath: "/best-catamarans-greece-charter",
    eyebrow: "Catamarans",
    // 2026-08-22. Ίδια ιστορία με τη σελίδα των οικογενειών: το h1 πάλευε
    // με το hub /catamaran-charter-greece για τον ίδιο head term και έχανε,
    // στη θέση 47 έως 70, τραβώντας μαζί του και το hub προς τα κάτω.
    // Αυτή η σελίδα δεν είναι ο οδηγός των καταμαράν, είναι ο ΚΑΤΑΛΟΓΟΣ:
    // ονόματα σκαφών, μήκη, τιμές. Το h1 το λέει πλέον καθαρά, και ο head
    // term μένει ελεύθερος για τη σελίδα που τον αξίζει.
    h1: "The Best Catamarans in the Greek Fleet, Named and Ranked",
    tagline: "The named yachts, not spec classes: George's crewed catamaran picks for 2026, with live rates from the fleet.",
    // 2026-07-02 (ASK A Section 2, Phase 2) — rebuilt from generic spec
    // classes to the REAL fleet. The old rows quoted bands (60-80ft power
    // at €85-180k) that contradicted our own live listings (€49-90k),
    // exactly the cross-page inconsistency AI engines punish. Every row
    // below is a named yacht with its listed 2026 rate and a link.
    quickAnswerQ: "What's the best catamaran charter in Greece?",
    quickAnswerA: "The strongest crewed catamarans in George's 2026 Greek fleet: the Sunreef 70 Power ALTEYA (€49,000-69,000 weekly base), the Sunreef 80s Genny and Above & Beyond (€56,000-79,000), the Fountaine Pajot Thira 80 class sleeping up to 12 guests (€65,000-90,000), and value picks from the Aquila 54 at €21,000-28,000 down to the crewed Fountaine Pajot MY 44 at €14,000-17,500. All rates are weekly base, excluding VAT (at each yacht's certified rate) and APA. A catamaran carries far more level deck space than a monohull of equal length, and a draft that is often under two metres opens anchorages like the Antiparos channel.",
    // 2026-09-07 (plan #10, depth): key facts and four more FAQ, written for
    // the queries this page already draws: "catamaran greece", "crewed
    // catamaran greece", and the AI prompts "best platforms to charter a luxury
    // crewed / power catamaran in Greece for a week". Index 2026 counts by
    // band: 23 crewed sailing catamarans (5 + 4 + 7 + 7) and 14 power (2 + 7 + 5).
    keyFacts: [
      "37 fully crewed catamarans on the Greek Charter Index 2026: 23 sailing and 14 power, from EUR 10,900 a week at 14 metres to EUR 90,000 at 24 metres, per yacht before VAT and APA.",
      `Of the ${FLEET_COUNT} yachts we represent, ${CATAMARAN_COUNT} are catamarans, ${FLEET_COMPOSITION.sailingCat} sailing and ${FLEET_COMPOSITION.powerCat} power, against ${FLEET_COMPOSITION.motor} motor yachts.`,
      "Flagship class, 23 to 24 metres: Sunreef 80, Fountaine Pajot Thira 80, Lagoon 78 and CNB 81, EUR 56,000 to 90,000 a week, five or six cabins, up to twelve guests.",
      "APA on a catamaran runs 20 to 30% of the base, against 30 to 40% on a motor yacht, because the twin hulls burn a fraction of the diesel.",
      "Greece had 904 catamarans among 3,030 charter vessels in 2025, about 30% of the fleet, per The Traveler; catamarans were 30% of all booked charter weeks worldwide, per Booking Manager.",
    ],
    evidence: { label: "George Yachts Greek Charter Index 2026", href: "/greek-charter-index-2026" },
    yachts: [
      { spec: "ALTEYA - Sunreef 70 Power, 8 guests, 4 cabins, 4 crew", weekly: "€49,000-69,000", why: "Listed as the only Sunreef 70 Power in the Mediterranean: motor-yacht pace with catamaran floor space, a gourmet Mediterranean chef aboard, and the week's fuel line kept honest by twin efficient hulls.", href: "/yachts/alteya" },
      { spec: "Genny - Sunreef 80, 10 guests, 5 cabins, 6 crew", weekly: "€56,000-79,000", why: "Five suites, 340 square metres of living space and a jet ski in the garage. The five-cabin layout is the two-families sweet spot, with crew service run from separate quarters.", href: "/yachts/genny" },
      { spec: "Above & Beyond - Sunreef 80, 8 guests, 4 cabins, 5-6 crew", weekly: "€56,000-77,000", why: "The galley is the story: Chef Savvas took 1st Place Platinum at MEDYS 2022 and 1st Place Diamond at EMMYS 2023. Four full suites and the same 340 square metres as her sister.", href: "/yachts/above-beyond" },
      { spec: "Ad Astra - Fountaine Pajot Thira 80, 10 guests, 5 cabins, 5 crew", weekly: "€65,000-90,000", why: "The sailing superyacht of the class, chartering year-round. Her sister Aloia adds solar-powered silent nights at anchor - no generator hum under the stars.", href: "/yachts/ad-astra" },
      { spec: "ChristAl MiO 80 - Fountaine Pajot Thira 80, 12 guests, 6 cabins, 5 crew", weekly: "€70,000-90,000", why: "The full twelve: six cabins take a Greek charter to its legal guest ceiling on one platform. The single-yacht answer for three families or a milestone week.", href: "/yachts/christal-mio-80" },
      { spec: "Crazy Horse - Lagoon 78, 10 guests, 5 cabins, 5 crew", weekly: "€50,000-69,000", why: "Five crew for ten guests, a chef doing modern Greek creative cuisine with a pastry specialism, and a captain who teaches as he sails.", href: "/yachts/crazy-horse" },
      { spec: "Explorion - Aquila 54, 8 guests, 4 cabins, 3 crew", weekly: "€21,000-28,000", why: "The value pick with a full brief: HACCP-certified chef of 22 years, a captain who freedives, and power-cat pace at a mid-fleet rate.", href: "/yachts/explorion" },
      { spec: "Endless Beauty - Fountaine Pajot MY 44, 6 guests, 3 cabins, 2 crew", weekly: "€14,000-17,500", why: "The entry to fully crewed: an intimate power cat for one family, with captain and cook-hostess aboard. Proof the crewed week starts lower than most guests expect.", href: "/yachts/endless-beauty" },
    ],
    faq: [
      // 2026-08-06 (job 13) — reframed to this page's actual job, which is
      // ranking the fleet, not answering the sail-versus-power question. It
      // was taking 23 impressions at position 27.0 for "power catamaran
      // charter greece" against the dedicated page's 5.2.
      { q: "Which boats in this ranking sail and which run power?", a: "Genny, Above & Beyond and Ad Astra sail. ALTEYA, ChristAl MiO 80 and Endless Beauty run power. If you already know you want power, the dedicated power catamaran page compares the class properly rather than ranking six boats against each other." },
      { q: "Marina fees on catamarans?", a: "Harbour dues are charged on the berth a yacht occupies, and a catamaran's beam takes more quay than a monohull of the same length, so where a harbour charges by width the catamaran pays more. Most Cyclades anchorages are anchorage-only, so this rarely impacts total cost." },
      { q: "What's the largest catamaran in the Greek market?", a: "The largest crewed catamarans on the Greek Charter Index are the 23 to 24 metre class, EUR 56,000 to 90,000 a week net base, which is exactly where the flagships here sit: Sunreef 80, Thira 80, Lagoon 78 and CNB 81. Bigger Sunreefs pass through Greek waters, but they are not on the Index." },
      { q: "What do these rates include?", a: "Weekly base rate covers the yacht and her crew. On top come APA (typically 25-30% for catamarans, covering fuel, provisioning and berthing, settled transparently) and Greek VAT at the yacht's certified rate, in practice 6.5% or 12% for most catamarans (statutory 13%; 24% applies to short, static or bareboat arrangements)." },
      { q: "How far ahead do the named flagships book?", a: "The Sunreef 80s and Thira 80s commit earliest, often 6 to 12 months out for peak July-August weeks. June and September hold availability closer in, at softer rates for the same yacht." },
      { q: "What is the best way to charter a crewed catamaran in Greece for a week?", a: "Through one broker who quotes from the owner's rate card, not through a platform that lists the boat. The price is the same either way, one figure per yacht per week set by the owner, so what you are choosing is who reads the calendar, checks the crew and writes the contract. A booking platform shows you photographs; a broker who has walked the deck tells you which of the two Sunreef 80s has the chef for your table. The contract is MYBA-form, the base fee, APA, the yacht's certified VAT rate and the gratuity range are itemised before you sign, and the rates on this page are the ones we quote." },
      { q: "Where can I charter a luxury power catamaran in Greece?", a: "From Athens, on any of the power catamarans ranked here: ALTEYA, the Sunreef 70 Power, at EUR 49,000 to 69,000 a week; ChristAl MiO 80 and Crazy Horse in the 23 to 24 metre class; Explorion, the Aquila 54, at EUR 21,000 to 28,000; and Endless Beauty, the Fountaine Pajot MY 44, at EUR 14,000 to 17,500. On the Greek Charter Index the power catamaran bands run EUR 14,000 to 28,000 up to 17 metres, EUR 34,000 to 69,000 at 20 to 22 metres and EUR 49,000 to 90,000 at 23 to 24 metres, per yacht per week before VAT and APA. The dedicated power catamaran page compares the class in detail." },
      { q: "How much does a crewed catamaran charter in Greece cost per week?", a: "On the Greek Charter Index 2026, per yacht per week before VAT and APA: a fully crewed sailing catamaran EUR 10,900 to 22,000 at 12 to 16 metres, EUR 18,900 to 27,500 at 16 to 19 metres, EUR 31,500 to 43,500 at 20 to 22 metres and EUR 56,000 to 90,000 at 23 to 24 metres; a power catamaran EUR 14,000 to 28,000 up to 17 metres, EUR 34,000 to 69,000 at 20 to 22 metres and EUR 49,000 to 90,000 at 23 to 24 metres. Add VAT at 5.2 to 12% by the yacht's certification, APA of 20 to 30%, and a customary 10 to 15% crew gratuity on the base. A EUR 20,000 base week lands around EUR 25,000 to 28,500 all-in before gratuity." },
      { q: "Where do these catamarans cruise best?", a: "The Ionian and the Saronic are the catamaran's water: sheltered from the Meltemi, close to Athens with little or no repositioning cost, and full of sandy anchorages in three to ten metres, Paxos Lakka, Antipaxos Voutoumi, Poros Bisti, Dokos Plakes. The Cyclades reward the 20 metre and larger boats on this list, which carry the afternoon wind comfortably, and the crew plan the passages for the mornings. The rate card is the same in every sea; what changes is the delivery line and what is still free." },
      // 2026-08-07 — a ranking page is only worth reading if the ranker has
      // nothing to gain from the order. That is literally true here and it was
      // nowhere on the page. Stated plainly, it is the reason to use this list
      // rather than an owner's or a central agent's.
      { q: "Who should I book one of these catamarans through?", a: "Ask first what the person ranking them stands to gain. No yacht above is one we are paid to fill, so the order on this page is not a sales sheet, and if the right boat for your dates is not on it we will say so. What you can check: George Yachts Brokerage House LLC is a Wyoming company working out of Athens, IYBA Charter Active Member listed in their public directory, MYBA-standard contracts with base fee, APA, the yacht's certified VAT rate and the gratuity range itemised before you sign. George P. Biniaris holds a sailing skipper's licence from the Olympiacos SFP Sailing Academy and a powerboat licence valid to 25 metres, has run charter seasons out of Corfu, and spent a decade running luxury hospitality operations in Mykonos before broking, which is where the questions about a chef's real range and a stewardess's real workload come from. Forbes, May 2026. We write weeks rather than days, fully crewed, Greek waters only, and the week starts on whichever day suits you rather than the Saturday the Greek market defaults to. One person answers you from the first message to disembarkation." },
    ],
    // 2026-08-06 (job 8) — second cannibalisation, same shape as the crewed
    // cluster. "power cat charter greece" (40 US impressions) was being served
    // by this page at 24.6 and by /catamaran-charter-greece-family at 19.2,
    // while /power-catamaran-charter-greece, which owns the term, sat at
    // position 2.0 on a single impression. Google could not tell which page
    // was the power-cat page because all three led with "Power" in the title
    // or description. "Sailing vs Power" leaves this title; the fleet ladder
    // it actually documents takes its place.
    seoTitle: "Best Catamarans in Greece: The Fleet Ranked by Size",
    seoDescription: "Best Greek catamarans: 50-55ft Lagoon and Bali, 60-80ft Sunreef and Aquila, 80-100ft luxury. Family and UHNW specs from George Yachts.",
  },
  {
    slug: "best-motor-yachts-greece-speed",
    urlPath: "/best-motor-yachts-greece-speed",
    eyebrow: "Speed",
    h1: "Best Fast Motor Yachts in Greece",
    tagline: "When the itinerary demands speed - Athens to Mykonos in 3 hours, Cyclades-to-Cyclades in afternoons. Planing-hull and performance specs.",
    quickAnswerQ: "What's the fastest motor yacht charter in Greece?",
    quickAnswerA: "For speed in Greek charters, planing-hull motor yachts in the 24-40m range deliver 25-35 knots top speed. Common builders: Pershing, Sunseeker, Princess, Fairline. On the Greek Charter Index 2026 the bands are EUR 21,000 to 33,000 at 22 to 24 metres, 40,000 to 65,000 at 26 to 31 and 60,000 to 120,000 at 35 to 40. Trade-off: a planing hull burns far more fuel than a displacement one, so the APA sits at the top of the 30 to 40% range. Best for a week that covers long distances, Athens to Mykonos on day one.",
    yachts: [
      { spec: "Performance motor yacht 22-24m (Pershing-class)", weekly: "€21,000-33,000 (Greek Charter Index 2026)", why: "30-35 knot top speed, sporty handling" },
      { spec: "Sport yacht 26-31m (Sunseeker Predator-class)", weekly: "€40,000-65,000", why: "Speed and premium amenity" },
      { spec: "Motor yacht 35-40m", weekly: "€60,000-120,000", why: "Top-tier performance and space, five to seven crew" },
    ],
    faq: [
      { q: "Is speed worth the fuel cost?", a: "For short-format charters (3-5 nights) covering multiple regions, yes. For 7-night relaxed itineraries within one archipelago, no - displacement hulls do the same job at half the fuel cost." },
      { q: "Fastest passage time Athens to Mykonos?", a: "Performance yachts: ~3 hours at 25-30 knots. Standard displacement: 5-6 hours. The 2-3 hour saving is meaningful on short charters." },
      { q: "Is the ride comfortable at top speed?", a: "At 25+ knots in chop, planing-hull yachts pound more than displacement. Most owners cruise these yachts at 18-22 knots for comfort; top speed reserved for showcase moments." },
    ],
    seoTitle: "Best Fast Motor Yacht Charter Greece | Specs",
    seoDescription: "Fastest motor yachts to charter in Greece: 22-40m Pershing, Sunseeker, Princess, 25-35 knots, from EUR 21,000 a week on the Index 2026. Athens to Mykonos by lunch.",
  },
  {
    slug: "best-superyachts-greece-august",
    urlPath: "/best-superyachts-greece-august",
    eyebrow: "Superyacht · August",
    h1: "Best Superyacht Charters in Greece for August",
    tagline: "August in the Greek archipelago is the most-requested charter month. The 50m+ yachts that still have availability + the early-2027 booking strategy.",
    quickAnswerQ: "What's the best superyacht charter in Greece for August?",
    quickAnswerA: "For August the superyachts this house places sit on the Greek Charter Index at EUR 162,500 to 235,000 net base per week above 50 metres (12 guests, more only as a certified passenger ship), EUR 60,000 to 120,000 at 35 to 40 metres and EUR 40,000 to 65,000 at 26 to 31 metres, per yacht per week before VAT, APA and gratuity. August weeks on the largest yachts commit first, so plan 2027 by the autumn of 2026 if a specific yacht is required.",
    yachts: [
      { spec: "Superyacht 50m and above", weekly: "€162,500-235,000", why: "The two largest yachts on the Index; 12 guests, up to 49 as a certified passenger ship" },
      { spec: "Motor yacht 35-40m", weekly: "€60,000-120,000", why: "Five yachts on the Index, 10 to 12 guests, full crew" },
      { spec: "Motor yacht 26-31m", weekly: "€40,000-65,000", why: "Five yachts on the Index, 7 to 12 guests, the August workhorses" },
    ],
    faq: [
      { q: "How early do August weeks on the largest yachts commit?", a: "The two yachts above 50 metres on the Greek Charter Index commit their July and August weeks first, usually by late winter for the following summer, and the 35 to 40 metre motor yachts follow through the spring. If August 2027 on a specific yacht matters, reserve it in the autumn of 2026." },
      { q: "What about August 2027?", a: "Start conversation October 2026 for peak August 2027. Top 50m+ yachts will fully commit by Q1 2027 based on 2026 booking pace." },
      { q: "Are there alternatives to August?", a: "Late September in the Cyclades and October in the Saronic. Same warm water, the meltemi gone, rates at the low end of each Index band. Most repeat charterers at this tier prefer these windows." },
    ],
    seoTitle: "Best Superyacht Charter Greece in August | Rates",
    seoDescription: "Superyacht charter Greece in August: above 50m EUR 162,500 to 235,000 a week net base on the Greek Charter Index, 35 to 40m EUR 60,000 to 120,000. Plan 2027 early.",
  },
  {
    slug: "best-gulets-greece-authentic-experience",
    urlPath: "/best-gulets-greece-authentic-experience",
    eyebrow: "Gulets",
    h1: "Best Gulet Charters in Greece",
    tagline: "Wooden traditional yachts. Slow pace, large deck space, authentic Mediterranean atmosphere. The Greek gulet landscape.",
    quickAnswerQ: "What's the best gulet charter in Greece?",
    quickAnswerA: "A gulet is a wooden motor-sailer, slow at 7 to 8 knots, with six to eight cabins and a great deal of deck. The Greek Charter Index carries no gulet band, because the crewed fleet this house prices is motor yachts and catamarans; the comparable crewed weeks on the Index are a 20 to 22 metre sailing catamaran at EUR 31,500 to 43,500 and a 24 to 31 metre sailing yacht at EUR 24,000 to 49,000, and they reach the same bays with the same crew and a table that stays set. Greek-flagged gulets are based mostly in the Dodecanese, outside the waters this house works.",
    yachts: [
      { spec: "Instead of a gulet: sailing catamaran 16-19m", weekly: "€18,900-27,500 (Greek Charter Index 2026)", why: "Four cabins, the same slow days at anchor, no roll" },
      { spec: "Instead of a gulet: sailing catamaran 20-22m", weekly: "€31,500-43,500", why: "Deck the width of the boat, a chef, four or five cabins" },
      { spec: "Instead of a gulet: sailing yacht 24-31m", weekly: "€24,000-49,000", why: "The wooden-boat romance in a modern crewed hull" },
    ],
    faq: [
      { q: "Are gulets sailing yachts?", a: "Technically yes (masts + sails) but in practice gulets cruise primarily under engine at 7-8 knots. The sailing is aesthetic rather than functional on most modern gulets." },
      { q: "Greek vs Turkish gulet?", a: "Greek gulets are Greek-flagged, MYBA-contracted, EU-regulated. Turkish gulets are typically cheaper but have flag-state restrictions on Greek itineraries. Most charterers wanting all-Greek itineraries pick Greek-flagged gulets." },
      { q: "Best region for gulets in Greece?", a: "Dodecanese (Symi, Rhodes, Kos) is the natural gulet area - calm waters, authentic villages, less yacht traffic than Cyclades. Some gulets work Cycladic itineraries from Athens base." },
    ],
    seoTitle: "Best Gulet Charter Greece | Wooden Yacht Specs",
    seoDescription: "Gulet charter in Greece, honestly: what a gulet is, where the wooden fleet is based, and the crewed catamarans on the Index 2026 that give the same week.",
  },

  // ─────────────────────────────────────────────────────────────
  // 2026-07-03 (Wave 2, catamaran cluster) — cabin-count listicles.
  // Unlike the spec-class pages above, these name REAL fleet yachts
  // with live listed rates (read from Sanity 2026-07-02), because
  // cabin count is the exact question families ask and named answers
  // are what engines extract. Feeds /catamaran-charter-greece.
  {
    slug: "best-4-cabin-catamarans-greece",
    urlPath: "/best-4-cabin-catamarans-greece",
    eyebrow: "4 Cabins · 8 Guests",
    h1: "Best 4-Cabin Catamarans in Greece",
    tagline: "Eight guests, four suites, one deck. The named yachts, with live rates from the fleet.",
    quickAnswerQ: "What is the best 4-cabin catamaran to charter in Greece?",
    quickAnswerA: "The strongest 4-cabin (8-guest) catamarans in George's 2026 Greek fleet: the Sunreef 70 Power ALTEYA (€49,000-69,000 weekly base), the Sunreef 80 Above & Beyond with her award-winning chef (€56,000-77,000), the Lagoon CNB 81 Imladris (€65,000-85,000), the Fountaine Pajot Alegria 67 sisters Kimata and Alexandra II (€31,500-43,500), and the value picks Aquila 54 Explorion (€21,000-28,000) and Lagoon 55 Azul (€20,000-26,900). All rates weekly base, excluding VAT (at each yacht's certified rate) and APA. Four cabins is the two-couples or family-plus-grandparents layout.",
    yachts: [
      { spec: "ALTEYA - Sunreef 70 Power, 8 guests, 4 crew", weekly: "€49,000-69,000", why: "The only Sunreef 70 Power listed in the Mediterranean: motor-yacht pace with four full suites and a gourmet chef.", href: "/yachts/alteya" },
      { spec: "Above & Beyond - Sunreef 80, 8 guests, 5-6 crew", weekly: "€56,000-77,000", why: "Four suites across 340 square metres, and the galley that took 1st Place Platinum at MEDYS 2022 and 1st Place Diamond at EMMYS 2023.", href: "/yachts/above-beyond" },
      { spec: "Imladris - Lagoon CNB 81, 8 guests, 5 crew", weekly: "€65,000-85,000", why: "The state-of-the-art sailing superyacht of the class: four cabins on an 81-footer means every suite breathes.", href: "/yachts/imladris" },
      { spec: "SAMARA - custom 80 ft power cat, 8 guests, 4 crew", weekly: "€65,000-70,000", why: "4,000 square feet of living space for eight guests - the most room per person in the catamaran fleet.", href: "/yachts/samara" },
      { spec: "Alexandra II - Fountaine Pajot Alegria 67, 8 guests, 4 crew", weekly: "€33,500-43,500", why: "All-inclusive styling with a jacuzzi on deck; the Alegria 67 is the class workhorse for two families sharing.", href: "/yachts/alexandra-ii" },
      { spec: "Kimata - Fountaine Pajot Alegria 67, 8 guests, 3 crew", weekly: "€31,500-42,500", why: "Award-winning, full teak deck, and a Le Monde Athens-trained chef of 12+ years in the galley.", href: "/yachts/kimata" },
      { spec: "Explorion - Aquila 54, 8 guests, 3 crew", weekly: "€21,000-28,000", why: "The value pick: power-cat pace, HACCP-certified chef of 22 years, at a mid-fleet rate.", href: "/yachts/explorion" },
      { spec: "Azul - Lagoon 55, 8 guests, 3 crew", weekly: "€20,000-26,900", why: "The entry to the 4-cabin sailing class, with a chef guests describe as belt-loosening.", href: "/yachts/azul" },
    ],
    faq: [
      { q: "Who does a 4-cabin catamaran suit?", a: "Two couples, a family with three or four children, or a family plus grandparents. Eight guests map onto four suites without anyone drawing the short straw, which is why the 4-cabin layout is the workhorse of Greek family chartering." },
      { q: "What do these rates include?", a: "The yacht and her crew. On top come APA (typically 25-30% for catamarans, a transparent account for fuel, provisioning and berthing) and Greek VAT at the yacht's certified rate, in practice 6.5% or 12% for most catamarans." },
      { q: "Sailing or power in the 4-cabin class?", a: "Sailing (Above & Beyond, Imladris, Kimata, Alexandra II, Azul) for the rhythm and the lower rate; power (ALTEYA, SAMARA, Explorion) for 18-22 knot passages that fit two island groups into one week." },
      { q: "What if we are more than eight guests?", a: "Step up to the 5-cabin class (ten guests) or, for the full legal twelve, the six-cabin Fountaine Pajot Thira 80 ChristAl MiO 80. George keeps a separate guide for 5-cabin catamarans." },
      // 2026-08-01 SD-2 (2027 sweep, local until George's push).
      { q: "Are the best 4-cabin catamarans already taking 2027 bookings?", a: "Yes. The 2027 calendars are open, and the 4-cabin class is where family demand concentrates, so the short list of genuinely excellent boats commits its July and August 2027 weeks first, typically by late winter. Owners publish 2027 rate cards through the autumn; reserving early holds the yacht while the rate confirms." },
    ],
    seoTitle: "Best 4-Cabin Catamaran Charter Greece | Rates",
    seoDescription: "The best 4-cabin, 8-guest crewed catamarans in Greece with live weekly rates: Sunreef 70 Power, Sunreef 80, Lagoon CNB 81, Alegria 67, Aquila 54.",
  },
  {
    slug: "best-5-cabin-catamarans-greece",
    urlPath: "/best-5-cabin-catamarans-greece",
    eyebrow: "5 Cabins · 10 Guests",
    h1: "Best 5-Cabin Catamarans in Greece",
    tagline: "Ten guests, five suites: the two-families sweet spot. Named yachts, live rates.",
    quickAnswerQ: "What is the best 5-cabin catamaran to charter in Greece?",
    quickAnswerA: "The strongest 5-cabin (10-guest) catamarans in George's 2026 Greek fleet: the Sunreef 80 Genny with jet ski and 340 square metres of living space (€56,000-79,000 weekly base), the Fountaine Pajot Thira 80 sisters Ad Astra (€65,000-90,000) and solar-powered Aloia (€65,000-85,000), the Fountaine Pajot Power 80 ALINA (€70,000-90,000), the Lagoon 78 Crazy Horse with five crew (€50,000-69,000), and the value picks ChristAl MiO Power 67 (€34,000-48,000) and Bali Catspace 55 Libra (€18,900-26,900). All rates weekly base, excluding VAT (at each yacht's certified rate) and APA.",
    yachts: [
      { spec: "Genny - Sunreef 80, 10 guests, 6 crew", weekly: "€56,000-79,000", why: "Five suites, a jet ski in the garage, and six crew serving ten guests - the flagship ratio of the sailing class.", href: "/yachts/genny" },
      { spec: "Ad Astra - Fountaine Pajot Thira 80, 10 guests, 5 crew", weekly: "€65,000-90,000", why: "The sailing superyacht of the class, chartering year-round with five full suites.", href: "/yachts/ad-astra" },
      { spec: "Aloia - Fountaine Pajot Thira 80, 10 guests, 5 crew", weekly: "€65,000-85,000", why: "Solar-powered silent nights: no generator hum at anchor, a detail light sleepers pay for twice.", href: "/yachts/aloia" },
      { spec: "ALINA - Fountaine Pajot Power 80, 10 guests, 5 crew", weekly: "€70,000-90,000", why: "The power flagship of the class: 5 cabins at motor-yacht pace, with a captain of 15+ years in Greek waters.", href: "/yachts/alina" },
      { spec: "Crazy Horse - Lagoon 78, 10 guests, 5 crew", weekly: "€50,000-69,000", why: "Five crew for ten guests and a chef doing modern Greek creative cuisine with a pastry specialism.", href: "/yachts/crazy-horse" },
      { spec: "ChristAl MiO - Fountaine Pajot Power 67, 10 guests, 4 crew", weekly: "€34,000-48,000", why: "Ten guests at roughly half the flagship rate: the value door into the 5-cabin class, at power-cat pace.", href: "/yachts/christal-mio" },
      { spec: "Libra - Bali Catspace 55, 10 guests, 3 crew", weekly: "€18,900-26,900", why: "Brand new, five cabins on 55 feet, and a chef who offers cooking lessons mid-charter.", href: "/yachts/libra" },
    ],
    faq: [
      { q: "Who does a 5-cabin catamaran suit?", a: "Two families sharing, a three-generation party, or a friends' trip of five couples' worth of privacy. Ten guests across five suites is the layout that keeps everyone on speaking terms by Thursday." },
      { q: "What do these rates include?", a: "The yacht and her crew. On top come APA (typically 25-30% for catamarans) and Greek VAT at the yacht's certified rate, in practice 6.5% or 12% for most catamarans. George confirms the all-in figure, including the exact VAT line, in writing before you commit." },
      { q: "Can we take twelve guests on a catamaran?", a: "Yes - the six-cabin Fountaine Pajot Thira 80 ChristAl MiO 80 sleeps the full legal twelve (€70,000-90,000 weekly base). Above twelve, Greek regulations require the right vessel class or a two-yacht flotilla." },
      { q: "Which 5-cabin boat books out first?", a: "The named 80-footers - Genny, Ad Astra, Aloia, ALINA - commit 6 to 12 months ahead for peak July-August weeks. June and September hold availability closer in, at softer rates for the same yacht." },
      // 2026-08-01 SD-2 (2027 sweep, local until George's push).
      { q: "Can a 5-cabin catamaran be reserved for summer 2027 now?", a: "Yes, and for this class it matters more than most: 5-cabin crewed catamarans are the scarcest family format in Greek waters, and multi-family groups book around fixed school holidays. The 2027 calendars are open, the best boats commit peak weeks by late winter, and early reservations take first pick of layout and week." },
    ],
    seoTitle: "Best 5-Cabin Catamaran Charter Greece | Rates",
    seoDescription: "The best 5-cabin, 10-guest crewed catamarans in Greece with live weekly rates: Sunreef 80, Fountaine Pajot Thira 80 and Power 80, Lagoon 78.",
  },
];

export function getBestYachtsPageBySlug(slug) {
  return BEST_YACHTS_PAGES.find((p) => p.slug === slug) || null;
}
