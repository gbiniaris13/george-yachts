// Use-case landing page data (8 occasions).
//
// 2026-05-11 — Phase 7 SEO strategy doc execution. Each entry powers
// a /[occasion]-yacht-charter-greece/ landing page. Targets long-tail
// occasion-driven search ("honeymoon yacht charter greece"), which
// converts at 4 to 8x the rate of generic head-term searches.

export const USE_CASES = [
  // ─────────────────────────────────────────────────────────────
  {
    slug: "honeymoon",
    urlPath: "/honeymoon-yacht-charter-greece",
    eyebrow: "Honeymoon Charters",
    h1: "Honeymoon Yacht Charter Greece",
    tagline: "Seven days. One couple. The most beautiful waters in the Mediterranean.",
    seoTitle: "Honeymoon Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Private honeymoon yacht charter in Greek waters. Crewed sailing yachts, catamarans, and motor yachts for couples. Curated romantic itineraries. From €18K/week.",
    canonical: "https://georgeyachts.com/honeymoon-yacht-charter-greece",
    touristType: ["Honeymooners", "Couples"],

    whyTitle: "Why a yacht honeymoon in Greece",
    whyBody:
      "A yacht honeymoon does what a hotel honeymoon cannot. The view from your bed changes every morning. The restaurant is curated to your taste by a chef who lives 30 feet away. The crew remembers what time you drink coffee on day three. By day five, the boat has rearranged itself around you. " +
      "Greek waters are particular about romance. **The Cyclades give you cinematic sunsets and white-and-blue villages stitched into the cliffs.** Mykonos and Santorini handle the high notes. Folegandros, Sifnos, and Antiparos give you the quiet between. **The Ionian gives you the opposite mood**: lush, green, sheltered, slow, with anchorages so calm you forget you are at sea. " +
      "We curate honeymoon weeks around three boat formats. **Sailing catamarans** (45 to 60 feet) for couples who want the rhythm of sail and an outdoor-living format with chef and hostess on board. **30-metre motor yachts** for couples who want air-conditioned suites with sea-view showers. **Classic sailing yachts** (50 to 70 foot sloops or ketches) for couples who want the romance of a single-mast cutter and a captain who can teach a winch in an afternoon. Tell us what you'd want from a perfect Sunday morning at home. We match from there.",

    bestFor: [
      "Couples wanting a full week alone with a discrete crew",
      "Honeymoons after Mykonos or Athens weddings (boat as recovery week)",
      "May, June, and September dates with quieter anchorages",
      "Couples who want chef-prepared meals, not restaurants",
      "Multi-leg honeymoons combining boat with a final hotel night",
    ],

    yachtFilter: '_type == "yacht" && sleeps <= 4 && defined(slug.current)',
    yachtsHeadline: "Yachts that suit honeymoons",
    featuredHeading: "Two-cabin and intimate yacht selections",

    whenTitle: "When to book a honeymoon yacht week",
    whenBody:
      "**May, June, and September** are the honeymoon-ideal months. Warm water (22 to 25°C), reliable weather, quieter anchorages, lower charter rates than peak August. **July and August** work for honeymoons that include Mykonos as a stop, but the Meltemi adds wind that some couples find dramatic and others find too much. **Late September and October** are the most romantic shoulder months: warm air, swimming-temperature water, almost no charter traffic. Book 4 to 6 months ahead for May-June dates, 8 to 12 months ahead for August.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Brief us on dietary preferences and quirks. The chef will plan around them, not despite them.",
      "Two anchorage nights in a row is the magic interval. Ask the captain to identify them.",
      "Sailing yachts and small motor yachts can carry a private photographer for one day. Day three is the sweet spot, when you've relaxed but the suntan still reads as a fresh tan.",
      "Crew tip on honeymoons is convention 12 to 18% of base rate, paid in cash to the captain on the last morning.",
      "If your wedding is in Greece, a four-night yacht week starting Monday after a Saturday wedding works perfectly. Most honeymoon-week clients book seven full days.",
    ],

    faq: [
      {
        q: "How long should a honeymoon yacht charter be?",
        a: "Seven nights is the standard and the most cost-effective. Some couples do four-night charters as part of a longer trip; some do ten or fourteen nights to fully decompress. Short charters (under four nights) are less common because the boat-setup time eats into the experience. We recommend seven for first-time charterers."
      },
      {
        q: "What's the most romantic yacht for a honeymoon?",
        a: "It depends on rhythm. A 50-foot classic sailing yacht with a two-person crew gives intimate quiet sailing days with deck dinners under stars. A 30-metre motor yacht gives a hotel-suite experience with master cabin and stabilised platform. A 55-foot sailing catamaran splits the difference. We'll match by listening to how you want a Sunday morning to feel."
      },
      {
        q: "How much should we budget for a honeymoon yacht charter?",
        a: "Weekly rates start around €18,000 for a 50-foot sailing yacht with captain and cook. Mid-range two-cabin motor yachts run €40,000 to €70,000. A 30-metre with full crew is €100,000+. Add 25 to 30% for APA (which covers food, drink, fuel, dockage) plus 12 to 24% Greek VAT depending on itinerary. Most honeymoon charters settle between €60,000 and €110,000 all-in."
      },
      {
        q: "Will the crew be discreet?",
        a: "Yes. Honeymoon-experienced crews give couples maximum privacy: meals are served on time then crew retreats, master cabin is serviced once daily in the morning while you swim, evening service is brief and warm rather than lingering. Brief us at booking on any preferences and we'll match a crew style."
      },
      {
        q: "Can we get married on the yacht in Greek waters?",
        a: "Legally, no. Greek law requires civil weddings to be performed by a Greek registrar on Greek soil. The yacht can host the reception and the photography but not the legal ceremony. Couples often marry the day before in Athens or on an island, then board the yacht for the honeymoon. We handle the logistics."
      },
    ],

    ctaTitle: "Let's plan your honeymoon.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=honeymoon",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "family",
    urlPath: "/family-yacht-charter-greece",
    eyebrow: "Family Yacht Charters",
    h1: "Family Yacht Charter Greece",
    tagline: "Multi-generational holidays at the speed of the sea. Children love it. Grandparents return.",
    seoTitle: "Family Yacht Charter Greece 2026 | Multi-Generational | George Yachts",
    seoDescription: "Family yacht charter in Greek waters. Crewed catamarans and motor yachts for 4-12. Child-safe platforms, chef catering. From €25K.",
    canonical: "https://georgeyachts.com/family-yacht-charter-greece",
    touristType: ["Families", "Multi-generational groups"],

    whyTitle: "Why a yacht works for the whole family",
    whyBody:
      "A family yacht week solves the **three problems of a family hotel holiday**: the children get bored after two days at the pool, the grandparents struggle with hot pavements and crowds, and the parents end up coordinating five people's schedules instead of relaxing. " +
      "On a yacht, the day rebuilds itself around the boat. Children swim off the platform from breakfast onwards. Grandparents read on shaded decks with one perfect view per afternoon. Parents are free to enjoy or escape into a private cabin as the mood takes them. By day three the family has found its rhythm. By day six nobody wants to leave. " +
      "We match families on **boat format first**. Catamarans and motor yachts above 50 feet suit families with children. The flat decks, no-heel sailing, and shallow draft (catamarans) or stabilisers (motor yachts) keep the boat usable in all sea states. **For multi-generational charters of 8 to 12 family members**, we typically recommend a 30 to 40 metre motor yacht with separate guest zones, two tenders for parallel activities, and a chef who can produce both adult dinners and child-friendly lunches.",

    bestFor: [
      "Families with children aged 5 to 16",
      "Multi-generational charters with grandparents joining",
      "Two-family charters with parents who know each other well",
      "Saronic itineraries from Athens for first-time chartering families",
      "Two-week+ charters where the boat becomes the family's home",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 6 && (subtitle match "*catamaran*" || length match "*m*")',
    yachtsHeadline: "Yachts that suit families",
    featuredHeading: "Family-ready yachts for 2026",

    whenTitle: "When to book a family yacht charter",
    whenBody:
      "**Last week of June through mid-September** is the family charter window: warm water, long days, school holidays in alignment with Greek summer. Within that window: **mid-July to mid-August** is peak (highest rates, most demand), **late June and late August** are sweet spots, and **early September** is the secret-best week for many families (warm water, less crowd, lower rates, schools not yet back in northern Europe). Book 6 to 9 months ahead for the peak window.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Catamarans are usually the right answer for families. The wide deck, low heel, and shallow draft suit children of all ages.",
      "Brief the chef on each child's likes and dislikes by name. By day three, lunch becomes the child's favourite meal of the week.",
      "Inflatable toys (paddleboard, banana, kayak, slide) are included on most boats above 25 metres. Confirm at booking.",
      "Saronic itineraries (Athens to Hydra to Spetses to Poros) suit first-time family charters. Short legs, sheltered water, easy access if a child needs medical care.",
      "Two cabins per family is the right ratio. Parents in master, children in second cabin. Booking three families on one boat is a logistics test worth thinking about twice.",
    ],

    faq: [
      {
        q: "Can young children safely charter a yacht?",
        a: "Yes, on the right format. We recommend catamarans for families with children under 8. Above 8, both catamarans and motor yachts work well. Sailing monohulls heel under sail which disorients young children. All charter yachts carry life jackets for children; brief us on ages at booking and the boat will be properly equipped."
      },
      {
        q: "How does the chef handle picky eaters?",
        a: "Greek charter chefs are universally accommodating. Children's preferences (pizza, pasta, plain grilled fish) are accommodated alongside adult meals. The galley produces both menus in parallel. Brief us on dietary specifics at least three weeks before charter."
      },
      {
        q: "Can we get school-uniform children off the boat for half-days?",
        a: "Yes. Captains can structure days as morning-boat afternoon-shore or vice versa. The boat anchors near a beach or town, tenders run children and one parent to land for a few hours of swimming or shopping, then back to the boat for dinner. Common pattern, no extra cost."
      },
      {
        q: "How big a boat do we need for 8 family members?",
        a: "Minimum 60-foot catamaran or 25-metre motor yacht. The legal cap of 12 guests gives margin, but for comfort an 8-person charter on a 60-foot is the floor; 75-foot or 30-metre is the sweet spot. Children under 5 are often counted as half-guest by some boats; ask."
      },
      {
        q: "What about teenagers — will they be bored?",
        a: "If the boat has wakeboarding, jet skis, a tender they can drive, and a captain who treats them as adults, teenagers love charter weeks. Brief us at booking on teen ages and interests; we'll match boats with the right toy fleet and crew personality."
      },
    ],

    ctaTitle: "Plan your family yacht week.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=family",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "corporate",
    urlPath: "/corporate-yacht-charter-greece",
    eyebrow: "Corporate Charters",
    h1: "Corporate Yacht Charter Greece",
    tagline: "Off-sites that decision-makers remember. The boat does the team-building for you.",
    seoTitle: "Corporate Yacht Charter Greece 2026 | Team Off-Sites | George Yachts",
    seoDescription: "Corporate yacht charter for executive retreats, off-sites, client hosting. 4-12 guests. Wi-Fi, A/V, conference space. From €40K.",
    canonical: "https://georgeyachts.com/corporate-yacht-charter-greece",
    touristType: ["Corporate executives", "Private equity", "Family offices"],

    whyTitle: "Why a yacht for corporate hosting",
    whyBody:
      "A corporate yacht charter does what a hotel conference room and a chartered restaurant cannot. **The boat removes the option of leaving early.** It removes the distraction of phone signals. It removes the schedule fragmentation of a multi-venue off-site. What you get instead is **six to twelve people on a single platform for three to five days**, with a rhythm built around the discussion you came for, not the venue. " +
      "We host two patterns of corporate charter. **Executive off-sites** with 4 to 8 senior team members, typically 3 to 4 nights, focused on strategy, planning, or sensitive decisions that benefit from neutral ground. **Client hosting** with one principal and 4 to 6 prospects or partners, typically 2 to 3 nights, focused on relationship building rather than agenda. " +
      "On the practical side, the yachts we represent carry **Starlink Wi-Fi**, conference-grade A/V on the salon TV (with proper microphone pickup for screen calls), private-cabin access for individual work, and chef-managed catering that respects the work mode of the charter. The crew operates more discreetly than on a leisure week. The boat does what a luxury hotel cannot: it sets the pace.",

    bestFor: [
      "Executive off-sites of 4 to 8 senior members",
      "Founder and PE-firm decision retreats",
      "Sales kick-offs for elite teams (3 to 4 nights)",
      "Family office multi-generational planning weeks",
      "Confidential transaction discussions in neutral water",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 6 && length match "*m*"',
    yachtsHeadline: "Yachts suitable for corporate hosting",
    featuredHeading: "Conference-capable yachts for 2026",

    whenTitle: "When to charter for corporate use",
    whenBody:
      "Corporate charters concentrate in **May, June, and September**: warm enough water for swimming breaks, mild enough for outdoor dining, and the rate structure is 20 to 35% below peak July-August. **July and August** are not preferred for corporate use due to crowded anchorages and heat. **Winter charters** are rare; we'd recommend a hotel for January or February planning weeks instead. **Mid-week starts (Tuesday or Wednesday)** are typical for corporate charters, distinct from the Saturday-to-Saturday leisure pattern.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Brief us on the agenda before recommending a yacht. Workshop-heavy weeks need salon-table seating for 8; relationship weeks need foredeck lounging. Different boats.",
      "Starlink Wi-Fi has changed corporate charters since 2024. Confirm presence at booking; speed is sufficient for video calls when anchored.",
      "Crew turnover for corporate guests is faster than leisure. Same captain all week, hostess and chef may rotate at midweek to reset service.",
      "Greek charter VAT is the only sticking point with corporate accounting. Have the contract reviewed by tax counsel before signing.",
      "Multi-yacht corporate charters (one boat principal, second boat staff) are possible. Lead time 8 weeks minimum.",
    ],

    faq: [
      {
        q: "Can we hold actual meetings on a yacht?",
        a: "Yes. The salon table on most yachts above 25 metres seats 6 to 10 with screen sharing, microphone pickup, and high-speed Wi-Fi. Anchored mode is the workhorse: yacht drops anchor in a sheltered bay, guests work for the morning, swim at lunch, work for the afternoon. Brief us on agenda and we'll structure the week."
      },
      {
        q: "Is corporate yacht charter tax-deductible?",
        a: "Generally yes for client hosting and business off-sites, with country-specific rules. We provide the necessary contracts and invoicing for tax purposes. Consult your tax adviser; we work with several international corporate-charter advisers if helpful."
      },
      {
        q: "How is confidentiality handled?",
        a: "Crew sign NDAs as standard. The yacht itself is mobile and not on any public schedule, which suits sensitive transactions or family-office discussions. Phone reception in Greek anchorages is excellent (4G coverage is good in the Cyclades); we recommend turning off geo-location if confidentiality is highest priority."
      },
      {
        q: "What about gym access, training, fitness?",
        a: "Most yachts above 25 metres have basic on-deck gym equipment (treadmill, weights, yoga mats). Above 35 metres, full gyms with Peloton, rowing machine, and free weights are common. For yoga or pilates instructors to fly in mid-charter, we coordinate with the captain at booking."
      },
      {
        q: "Can the yacht stay in one location for the duration?",
        a: "Yes, if preferred. Some corporate charters anchor for the entire week in a single sheltered bay (Hydra, Spetses, Mykonos roadstead). The boat becomes a floating private hotel. Marina fees apply for harbour stays; anchorage is free. Most charters combine: anchored for working days, moving for evening dinners."
      },
    ],

    ctaTitle: "Plan your corporate charter.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=corporate",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "wedding",
    urlPath: "/wedding-yacht-charter-greece",
    eyebrow: "Wedding Charters",
    h1: "Wedding Yacht Charter Greece",
    tagline: "Greek-island weddings, hosted on the water. Receptions, after-parties, photography weeks.",
    seoTitle: "Wedding Yacht Charter Greece 2026 | Wedding Receptions | George Yachts",
    seoDescription: "Wedding yacht charter in Greek waters. Reception yachts for 12 to 60 guests, multi-boat fleets for larger weddings, photography platforms. Bespoke planning.",
    canonical: "https://georgeyachts.com/wedding-yacht-charter-greece",
    touristType: ["Wedding parties", "Bridal couples"],

    whyTitle: "Why a yacht for a Greek wedding",
    whyBody:
      "Greek weddings on yachts are not legal ceremonies (Greek law requires a civil ceremony on Greek soil), but they are a perfect format for **reception, after-party, photography day, and honeymoon launch**. " +
      "Three common patterns. **Reception on board** — a 30 to 40 metre yacht anchored off Mykonos or Santorini hosting 30 to 60 guests for dinner, dancing, and a 02:00 send-off to the tender that returns guests to their hotels. **Multi-yacht flotilla** — two to four yachts chartered together for a wedding week, with the bride and groom on the flagship and other yachts hosting family groups. **Photography day** — a 60 to 80 foot yacht chartered for a single day of bride-and-groom photography in iconic anchorages (Antiparos, Folegandros, Hydra), with the wedding itself happening at a land-based venue. " +
      "We handle the **boat logistics**: yacht selection, crew briefing, marina coordination with hotel-side wedding planners, on-water photography permits where required. We do not replace your wedding planner. **The wedding planner runs the day**; we run the yacht. The two roles work in parallel and we are accustomed to that working relationship.",

    bestFor: [
      "Mykonos, Santorini, Athens, or Crete weddings using yacht for reception",
      "Multi-day wedding weeks with a yacht-day or yacht-night element",
      "Photo day for couples married elsewhere wanting Greek-water imagery",
      "After-party charters for the wedding morning-after celebration",
      "Multi-yacht charters distributing 20 to 50 guests across two to four boats",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 8 && (subtitle match "*motor*" || subtitle match "*catamaran*")',
    yachtsHeadline: "Yachts suitable for wedding events",
    featuredHeading: "Wedding-ready yachts for 2026",

    whenTitle: "When to plan a wedding yacht charter",
    whenBody:
      "**Bookings open 12 to 18 months ahead** for peak summer dates (June, July, August, early September). Late September and October still have availability 6 months out but the Greek-island wedding rush is starting to extend into these months. The optimal weather window for outdoor reception receptions is **mid-May to early October**. For January to April weddings, we recommend a hotel venue instead and a yacht photography day at the next available shoulder-month opportunity.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "We work alongside your wedding planner; we do not replace one. Brief us early so we can support, not duplicate.",
      "Marina permits for evening reception anchoring near hotels (Mykonos, Santorini, Hydra) require 4-week minimum lead time. Don't leave to the last week.",
      "Wedding-day yacht charters that include the legal ceremony are not possible in Greek waters. Civil weddings must be performed by a registrar on Greek soil. The yacht serves before or after.",
      "On-yacht catering for receptions of 30+ guests requires advance crew augmentation. Build that into the budget.",
      "Photographers and drone operators need maritime-photography permits for some Greek waters. We handle this; brief us 4 weeks before.",
    ],

    faq: [
      {
        q: "Can we get legally married on a yacht in Greek waters?",
        a: "Greek law requires civil weddings to be performed by an authorised registrar on Greek soil. The yacht can host the reception, photography, and after-party but not the legal ceremony. Couples typically marry the day before or morning-of in a Greek city hall, then board the yacht for celebration."
      },
      {
        q: "How many guests can a yacht host for a wedding reception?",
        a: "The 12-guest cap on commercial charter is for overnight guests. For a daytime or evening event with guests boarding for hours rather than overnight, larger numbers are possible: 30 guests on a 30-metre yacht, 60+ on a 40-metre+ yacht with the right crew augmentation. We coordinate with the captain and event team on capacity per event."
      },
      {
        q: "What's the cost of a wedding yacht charter?",
        a: "Single-day yacht charter for a wedding event (photography day, evening reception): from €15,000 for a 60-foot catamaran to €60,000+ for a 35-metre motor yacht, plus catering, crew gratuity, and APA. Multi-day yacht weeks for weddings: from €40,000 to €300,000+ depending on yacht size and duration. Multi-yacht flotillas for 50+ guest weddings: typically €150,000 to €500,000."
      },
      {
        q: "Can the yacht stay docked during the reception?",
        a: "Marina dockage is rarely the right choice for a reception. Anchored offshore with tender service to guests is preferred: privacy, lighting control, no marina noise. Marina dockage is preferred for boarding guest groups before sailing out for the reception. We handle the logistics."
      },
      {
        q: "Do you organise wedding photography on the yacht?",
        a: "We coordinate with photographers and wedding planners. We don't supply photographers ourselves. Many established Greek-island wedding photographers are familiar with yacht photography conventions and we can recommend three to four on request."
      },
    ],

    ctaTitle: "Plan your wedding yacht charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=wedding",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "birthday",
    urlPath: "/birthday-yacht-charter-greece",
    eyebrow: "Birthday Charters",
    h1: "Birthday Yacht Charter Greece",
    tagline: "Milestone birthdays at sea. 40, 50, 60. Or the children's special weekend.",
    seoTitle: "Birthday Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Birthday yacht charter in Greek waters. Milestone birthdays (40, 50, 60) and family birthday weekends. Crewed catamarans and motor yachts. From €20K.",
    canonical: "https://georgeyachts.com/birthday-yacht-charter-greece",
    touristType: ["Birthday parties", "Milestone celebrations"],

    whyTitle: "Why a yacht for a milestone birthday",
    whyBody:
      "Milestone birthdays land differently when the celebration moves to the water. **The boat does the thing land-based venues struggle with**: it gives a single platform for the whole weekend or week, eliminates the fragmentation of dinner-venue / hotel / morning-after-coffee logistics, and creates the kind of memory that the guests still reference five years later. " +
      "We see two patterns. **Multi-day milestone weeks** (40th, 50th, 60th birthdays) where the principal and 6 to 10 close friends or family take a single yacht for 5 to 7 nights, with the actual birthday day designed around a curated experience (specific anchorage, dinner the chef has been preparing for days, guest surprises arranged via the crew). **Birthday weekends** (the principal's milestone celebrated with a Friday-to-Sunday yacht charter, often part of a longer trip). " +
      "For children's birthdays — typically 13, 16, 18 — yachts in Greek waters work brilliantly when family and a small group of friends share the boat. The format reads as gift rather than holiday: the children remember the boat, not the cake.",

    bestFor: [
      "40th, 50th, 60th milestone birthday charters with 6 to 10 close guests",
      "Children's milestone birthdays (13, 16, 18) with family and small friend group",
      "Late-summer birthday weeks where school holidays align",
      "Surprise charters arranged by spouse for principal's milestone year",
      "Multi-couple birthday weekends sharing a single yacht",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 6',
    yachtsHeadline: "Yachts suited to birthday celebrations",
    featuredHeading: "Birthday-week yachts for 2026",

    whenTitle: "When to plan a birthday yacht charter",
    whenBody:
      "Book **4 to 8 months in advance** for the principal's birthday month if it falls between May and October. **Surprise charters** arranged by a spouse should be set up 6 months ahead minimum for full optionality. **Children's milestone birthdays** (13, 16, 18) typically land in July or August when school is out; book 6 to 9 months ahead. **Winter birthdays** (November to March) work less well on Greek charter yachts due to weather; we'd recommend a hotel celebration with a yacht photo day at the next available shoulder month.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Brief the chef on the principal's tastes a month in advance. The birthday dinner becomes the high point of the week if the chef has time to plan it.",
      "Surprise gifts arranged via the crew (a specific bottle of wine, a private cellist on the foredeck at sunset, an inscribed photo book of the week) read as effortless on a yacht.",
      "For milestone birthdays with 8+ guests, a yacht above 30 metres gives the separate-cabin privacy that some couples need on the morning after.",
      "Children's birthday charters (under 18) work brilliantly when the parents pre-brief the captain on which surprises to host and when.",
      "We've coordinated some elaborate birthday surprises (yacht renamed temporarily for the week, family arriving from three countries on day three, a hot-air balloon meeting the yacht at sunrise). Tell us what you want.",
    ],

    faq: [
      {
        q: "Can we have a band or DJ on the yacht?",
        a: "Yes. Bands of 3 to 5 musicians are easily accommodated on yachts above 25 metres. DJs setting up on the swim platform or sun deck are standard. We can recommend Greek-based musicians or coordinate flying performers in. Sound limits at anchorage near villages exist; the captain handles compliance."
      },
      {
        q: "Can we charter a yacht for one day only?",
        a: "For special events (birthday lunch, sunset celebration), single-day charters from a fixed marina are possible on some catamarans and smaller motor yachts. Larger crewed yachts (above 30 metres) require minimum 3-day charters. Day charters for milestone events typically cost €8,000 to €25,000 plus catering and gratuity."
      },
      {
        q: "Can the cake and decorations be arranged in advance?",
        a: "Yes. Brief us 4 to 6 weeks ahead. We coordinate with the captain, chef, and hostess to have everything in place before the principal boards. Surprise charters with a fully-decorated arrival are a frequent request. The crew is excellent at this."
      },
      {
        q: "How discreet can the birthday surprise be?",
        a: "Very. Crews sign NDAs and routinely manage surprise elements without telling the principal. We've kept entire charters as surprise weekend trips where the principal didn't know until boarding. Lead time matters: 4 weeks minimum for full discretion."
      },
      {
        q: "Can guests fly in mid-charter?",
        a: "Yes. Guests joining for 2 to 3 days of a longer charter is common. They board at a Cycladic island (Mykonos, Santorini, Paros) via helicopter or commercial ferry. We coordinate the rendezvous; brief us at booking on planned guest joins."
      },
    ],

    ctaTitle: "Plan a milestone yacht charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=birthday",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "anniversary",
    urlPath: "/anniversary-yacht-charter-greece",
    eyebrow: "Anniversary Charters",
    h1: "Anniversary Yacht Charter Greece",
    tagline: "Twenty years. Thirty years. Fifty years. The Aegean understands what you've built.",
    seoTitle: "Anniversary Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Anniversary yacht charter in Greek waters. 10th, 25th, 50th milestone anniversaries hosted at sea. Couple's-only and family anniversaries. From €18K.",
    canonical: "https://georgeyachts.com/anniversary-yacht-charter-greece",
    touristType: ["Couples", "Anniversary families"],

    whyTitle: "Why a yacht for a milestone anniversary",
    whyBody:
      "Anniversary charters are quieter than birthday weeks. **The conversation is between the couple, not the guests**, and the boat respects that. Where a birthday wants party energy and a captive audience, an anniversary wants room to be remembered well. The crew is briefed for it. The menu is curated. The pace is slow. " +
      "We see three patterns. **Couple-only anniversaries** (typically 10th, 20th, 25th, 50th) where two people charter a small motor yacht or sailing yacht for 5 to 7 nights, with the actual anniversary day designed around a single anchorage and a chef-prepared dinner the cabin steward has helped stage. **Anniversary with family** (typically 25th and 50th) where the parents host their adult children and grandchildren for a week, often combining with a milestone gift announcement. **Renewal of vows** charters, performed on land but with the yacht as the surrounding week. " +
      "We pay attention to **rituals that read like remembering**. A specific wine on the night you met. The same hotel room above a particular island that the couple stayed in 25 years ago, now visited from the water. A morning swim before the family wakes, then breakfast on the foredeck where the parents can talk privately. The boat lets this happen.",

    bestFor: [
      "10th, 20th, 25th, 30th, 50th anniversary celebrations",
      "Couples returning to Greece after a previous honeymoon there",
      "Multi-generational anniversaries with adult children joining",
      "Renewal of vows held at a land venue with a yacht week",
      "Surprise anniversary trips arranged for the spouse's milestone year",
    ],

    yachtFilter: '_type == "yacht" && sleeps <= 6',
    yachtsHeadline: "Yachts suited to anniversary trips",
    featuredHeading: "Intimate yachts for 2026",

    whenTitle: "When to plan an anniversary yacht charter",
    whenBody:
      "**May, June, September** are the optimal anniversary months: warm enough water for swimming, mild evenings, quieter anchorages, and rates below peak July-August. Book 4 to 7 months in advance. For **late September and October** anniversaries, book 6 months ahead. The Saturday-to-Saturday convention is standard; some anniversary clients prefer a Wednesday-to-Wednesday charter that includes both weekend days at sea.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "If the original honeymoon was in Greek waters, ask us about retracing the itinerary on the milestone anniversary. Photos at the same anchorages, 25 years apart, are powerful.",
      "Surprise anniversary trips arranged by a spouse are common. Lead time 6 months for full optionality. We coordinate without the principal knowing.",
      "Brief the chef on memorable dishes from past meals. The chef will recreate them on the right night.",
      "Family anniversary weeks (parents plus adult children) benefit from a separate-cabin format. A 30-metre motor yacht with one master forward, separate guest cabins midships, and crew zone aft suits this.",
      "Vow renewal on land plus yacht week is a frequent combination. We coordinate with land-side wedding planners; brief us on planned guests and dates 4+ months ahead.",
    ],

    faq: [
      {
        q: "How long should an anniversary yacht charter be?",
        a: "Five to seven nights is standard. Some couples do a three-night charter as part of a longer trip. The seven-night format suits couples who want to fully decompress and revisit favourite anchorages from past trips. For 25th and 50th milestone anniversaries that include family, ten to fourteen nights is common."
      },
      {
        q: "What's the difference between a honeymoon charter and an anniversary charter?",
        a: "The boat is often the same. The brief is different. Anniversary weeks are slower-paced, the chef plans around remembered preferences, and the crew gives more space to private conversation. We brief crews specifically for anniversary versus honeymoon."
      },
      {
        q: "Can we charter the same yacht we had on a previous trip?",
        a: "If the yacht is still in our fleet and available, yes. Continuity is a frequent anniversary request. Brief us at booking on the previous yacht name; we'll check availability. If the yacht is no longer chartering, we'll find the closest equivalent."
      },
      {
        q: "How much does an anniversary yacht charter cost?",
        a: "Couple-only charters: €18,000 to €60,000/week for the right boat for two. Family anniversary charters (4 to 8 guests): €40,000 to €120,000/week. Add 25 to 30% APA and 12 to 24% Greek VAT depending on itinerary. Most anniversary charters settle between €35,000 and €90,000 all-in."
      },
      {
        q: "Can we have something engraved or personalised on the boat?",
        a: "Yes for things the boat carries: a wine glass, a photo book, a menu printed for the dinner, a bottle labelled with the anniversary date. The yacht itself cannot be modified for the week. Brief us 6 weeks ahead for any personalisation."
      },
    ],

    ctaTitle: "Plan your anniversary yacht week.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=anniversary",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "group",
    urlPath: "/group-yacht-charter-greece",
    eyebrow: "Group Charters",
    h1: "Group Yacht Charter Greece",
    tagline: "Eight, ten, twelve guests. One yacht. Or two. The format that makes group trips actually work.",
    seoTitle: "Group Yacht Charter Greece 2026 | 8-12 Guest Yachts | George Yachts",
    seoDescription: "Group yacht charter in Greek waters for 8 to 12 guests. Multi-cabin motor yachts, catamarans, and gulets. Multi-yacht flotillas for larger groups. From €25K.",
    canonical: "https://georgeyachts.com/group-yacht-charter-greece",
    touristType: ["Friend groups", "Multi-family", "Extended celebrations"],

    whyTitle: "Why a group yacht charter works",
    whyBody:
      "Group trips on land usually fail in one of three ways: nobody can agree on the restaurant, somebody ends up paying for everybody, or the group fragments into pairs by day three. A yacht charter solves all three by giving the group a single platform with food, drinks, transport, and accommodation included. **By day two, the group functions as one trip rather than four.** " +
      "We work with three group sizes. **8-guest groups** typically charter a 70 to 80-foot catamaran or a 25-metre motor yacht with 4 cabins. **10-guest groups** typically need a 30-metre motor yacht or a large gulet. **12-guest groups** hit the legal cap on a single yacht — Greek law caps commercial charter at 12 guests regardless of vessel size — and require either a 35+ metre yacht or, more commonly, a two-yacht flotilla. " +
      "**Multi-yacht flotillas** (two or three yachts cruising together) are how we handle 14 to 30 guest groups. The yachts dock and anchor together where possible, but each guest still has their own bed and bathroom and the budget per person stays reasonable. Our office handles the multi-yacht coordination; the captains know each other and have run shared itineraries before.",

    bestFor: [
      "8 to 12 friends sharing a single yacht for a week",
      "Multi-family charters with 2 to 3 families combining",
      "Stag and hen weeks with extended guest counts",
      "Group milestone celebrations (significant birthday with friends)",
      "Two- or three-yacht flotillas for 14 to 30 guest groups",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 10',
    yachtsHeadline: "Yachts that suit groups",
    featuredHeading: "Group-ready yachts for 2026",

    whenTitle: "When to book a group yacht charter",
    whenBody:
      "Group charters book **6 to 12 months ahead** for peak summer dates. The complexity of aligning 8 to 12 schedules means the booking conversation should start as soon as the trip is decided. **June and September** are the sweet-spot months for groups (warm enough, less crowded, lower rates). **July and August** for groups with school-age children or hospitality-industry guests who only have summer dates. **Multi-yacht flotillas** book 9 to 12 months ahead minimum.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Twelve guests is the legal maximum on any single commercial charter yacht in Greek waters. Above 12, you need two yachts. There's no way around the regulation.",
      "Cabin allocation is the most-debated part of group planning. Decide it before booking. Master cabin is typically the principal or birthday person; couples take double cabins; singles take twins.",
      "Group dynamics work best when the boat is sized for n+1 cabins. A group of 8 on an 8-cabin boat doesn't have a 'quiet cabin' for someone to retreat to.",
      "Mid-charter guest changes (some guests leaving on day 4, others joining) are possible at most major Cycladic islands. Brief us at booking.",
      "Multi-yacht flotillas need one charter principal who decides for the group. Splitting decision-making across two captains and 14 guests produces friction we've seen.",
    ],

    faq: [
      {
        q: "How many guests can one yacht carry in Greek waters?",
        a: "Twelve. The Greek charter regulation caps overnight commercial charter at 12 guests regardless of vessel size. Day charters (boarding for hours, not nights) can sometimes accommodate more under different licensing. For overnight charter for 13+ guests, we recommend a two-yacht flotilla."
      },
      {
        q: "What's a yacht flotilla?",
        a: "Two or more yachts chartered together that cruise the same itinerary, anchor in the same bays, and often raft alongside each other for shared social time. The yachts are typically a primary (with the principal or birthday person) and a secondary (with extended family or friends). Pricing is per-yacht, not per-guest."
      },
      {
        q: "How much does a 10-guest yacht charter cost?",
        a: "A suitable 10-guest yacht (typically 27 to 35 metres or a 75-foot+ catamaran with 5 cabins) costs €60,000 to €180,000 per week before APA and VAT. Most 10-guest groups settle between €90,000 and €140,000 all-in for a 7-night charter. Split across 10 guests, that's typically €9,000 to €14,000 per guest."
      },
      {
        q: "Can guests have separate transportation needs?",
        a: "Yes. Some guests fly in on day one; others meet the yacht mid-week at a Cycladic island; some leave early via commercial ferry or helicopter. The yacht meets guests at agreed islands; we coordinate with the captain on rendezvous points. Some shuffling adds APA cost (additional fuel) but is otherwise routine."
      },
      {
        q: "What about dietary preferences across a large group?",
        a: "Brief us on each guest's preferences and restrictions at booking. The chef plans menus that work for the group. Vegetarian, gluten-free, kosher, halal: all manageable with notice. The chef will produce parallel options where needed."
      },
    ],

    ctaTitle: "Plan your group yacht charter.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=group",
  },

  // ─────────────────────────────────────────────────────────────
  {
    slug: "photoshoot",
    urlPath: "/photoshoot-yacht-charter-greece",
    eyebrow: "Photoshoot Charters",
    h1: "Photoshoot Yacht Charter Greece",
    tagline: "Day charters for editorial, brand, and commercial photography in Greek waters.",
    seoTitle: "Photoshoot Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Yacht photoshoot charter in Greek waters. Day and multi-day charters for editorial, fashion, brand, and lifestyle photography. Drone permits, location scouting.",
    canonical: "https://georgeyachts.com/photoshoot-yacht-charter-greece",
    touristType: ["Photographers", "Production teams", "Brand agencies"],

    whyTitle: "Why a yacht photoshoot in Greece",
    whyBody:
      "Greek waters are the most-photographed Mediterranean backdrop after the Cote d'Azur for a reason. **The light is different**: harder, brighter, with the kind of midday saturation that brand work needs and the kind of golden-hour softness that editorial covers. The water reads as photo-grade Aegean blue across the Cyclades, jade-green across the Ionian, and Caribbean clear in shallow bays everywhere. " +
      "We charter for **three types of production**. **Editorial fashion** for magazine covers and feature spreads, typically 1 to 3 day charters with a model, stylist, photographer, and small crew on a 60 to 80-foot catamaran or motor yacht in a single iconic anchorage. **Brand and commercial** for resort, watch, jewellery, and beauty brands, typically 2 to 5 day shoots with larger crews and a director, often involving multiple boats or yacht-and-tender combinations. **Lifestyle and influencer** for content creators, typically 2 to 4 days on a smaller yacht with the principal and partner, content shot organically as the charter unfolds. " +
      "We handle **the logistics that ruin a shoot if missed**: drone permits for commercial photography (required in Greek waters by the Hellenic Coast Guard), location scouting with the captain for the right rocks and the right hour, marina coordination for daily boarding and de-boarding of crew, catering for production crew (often different from guest catering), and discreet on-board crew during sensitive shots.",

    bestFor: [
      "Magazine editorial shoots (1 to 3 days)",
      "Brand commercial shoots for fashion, beauty, resort, watch brands",
      "Lifestyle content creation by influencer principals",
      "Wedding photography day for couples married elsewhere",
      "Music video, short film, and feature film maritime sequences",
    ],

    yachtFilter: '_type == "yacht" && (subtitle match "*motor*" || subtitle match "*catamaran*")',
    yachtsHeadline: "Yachts that photograph well",
    featuredHeading: "Photoshoot-ready yachts for 2026",

    whenTitle: "When to charter for photography",
    whenBody:
      "**Late May through mid-July** and **mid-September through mid-October** offer the best light and least crowded anchorages. Peak August has the brightest, most saturated colours but most marinas are booked. Winter shoots (November to March) work for specific moody-light projects but the water is too cold for swim shots and most charter yachts winter in marinas (limited fleet available). Lead time: **2 to 6 weeks minimum** for editorial day charters, **8 to 12 weeks** for brand commercial shoots with permits.",

    insiderTitle: "Notes from George",
    insiderTips: [
      "Drone shots over the yacht and over Greek waters require permits from the Hellenic Coast Guard. We handle the application; brief us 4 weeks before.",
      "Golden hour in Greek summer is 19:30 to 20:30. Plan the shoot rhythm around it; many productions miss this by an hour.",
      "Sailing yacht hero shots require wind. Check 7-day forecasts before locking the date; the captain can advise.",
      "The cleanest white-fibreglass yachts photograph best. Older teak-deck yachts read as character pieces but photograph more like vintage editorial.",
      "If the shoot involves swimwear or nude figure work, brief us on crew composition. We staff with sensitivity to the production's needs.",
    ],

    faq: [
      {
        q: "Can we charter a yacht for one day for a photoshoot?",
        a: "Yes. Day charters from a fixed marina (Mykonos, Athens, Santorini, Hydra) for photography are standard. Cost typically €5,000 to €18,000 per day depending on yacht size, plus crew gratuity. Multi-day shoots are 30 to 50% cheaper per day on a 5-day basis vs single-day."
      },
      {
        q: "Are commercial photography permits required?",
        a: "For most editorial and lifestyle photography, no specific maritime permit is required. For drone photography in Greek waters, yes (4-week lead time, we coordinate). For commercial brand photography intended for advertising, location-specific permits may apply (Mykonos, Santorini); we handle these case by case."
      },
      {
        q: "How is the crew compensated for a photoshoot charter?",
        a: "Daily rate plus tip. Photoshoot crews are tipped 15 to 25% of the day rate (higher than leisure tipping convention) due to the intensity of the work. Pay in cash to the captain on the final day. Lunch for crew is typically catered separately from the production catering."
      },
      {
        q: "Can the boat stay still and be photographed from a tender or drone?",
        a: "Yes. Hero shots of the yacht under sail or at anchor require the photographer to be in a tender or with a drone. We provide an additional crewed tender for photo work at €500 to €1,200 per day. Drone work is licensed (see above)."
      },
      {
        q: "Will the crew appear in the photographs?",
        a: "Brief us at booking. Most productions prefer crew not visible in hero shots; the crew dresses neutrally and stays out of frame. For lifestyle content where the crew is part of the story, brief us specifically and we'll select a crew comfortable being filmed."
      },
    ],

    ctaTitle: "Plan your yacht photoshoot.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=photoshoot",
  },

  // ═════════════════════════════════════════════════════════════
  // 2026-05-11 (Phase 7 Round 4) — 6 more use cases to complete
  // Tier 5 (14 / 14). Strategy doc Section 2.1 listed all 14.
  // ═════════════════════════════════════════════════════════════

  {
    slug: "bachelor-party",
    urlPath: "/bachelor-party-yacht-charter-greece",
    eyebrow: "Bachelor Party Charters",
    h1: "Bachelor Party Yacht Charter Greece",
    tagline: "Mykonos energy, your private yacht, the kind of weekend nobody photographs but everyone remembers.",
    seoTitle: "Bachelor Party Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Bachelor party yacht charter in Greek waters. Mykonos-departure weekends, full-week itineraries, multi-yacht flotillas for larger groups. Discreet, premium.",
    canonical: "https://georgeyachts.com/bachelor-party-yacht-charter-greece",
    touristType: ["Bachelor parties", "Friend groups"],

    whyTitle: "Why Greek waters work for a bachelor weekend",
    whyBody:
      "A yacht-based bachelor party solves the three things land-based versions get wrong: **everyone sleeps in the same place** (no 4 AM cab logistics), **the venue is the trip** (no negotiating which club, which dinner, which after-hours), and **privacy is absolute** (whatever happens, happens with the group). The yacht does the heavy lifting; the chef and crew handle service so the group can focus on the celebration. " +
      "**Mykonos is the obvious departure**. Anchor off Ornos, tender into the chora for dinner, beach club afternoon at Scorpios or Nammos, evening back on the yacht for either a quiet conversation under stars or the kind of after-party the boat can host privately. Repeat the rhythm for 3-4 nights. **The Cyclades opens up beyond Mykonos** for a longer week with Paros, Antiparos, and Folegandros adding genuine variety. " +
      "We host two patterns. **Long weekends (3-4 nights)** for 6-10 guests on a single 60-80 foot yacht, typically catamaran or motor yacht. **Full weeks (7 nights)** for the closer crew that wants more islands and more variety. **Multi-yacht flotillas** (2-3 boats) for groups of 14-24 are common for bachelor weekends combining different friend groups.",

    bestFor: [
      "Long weekends 3-4 nights from Mykonos",
      "Full weeks for 6-10 close friends",
      "Multi-yacht flotillas for 14-24 guests",
      "Late summer (August) for peak Mykonos energy",
      "September shoulder for groups wanting calm + still alive energy",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 6 && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Mykonos*")',
    yachtsHeadline: "Bachelor-party-ready yachts",
    featuredHeading: "Mykonos-based party yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**June, July, August, September** are the bachelor-party months. **July-August** peak Mykonos energy. **June, September** suit slightly older groups (32+) wanting calm-but-alive. **Long-weekend dates** (Thursday-Sunday) book 4-6 months ahead in peak summer; **full weeks** book 6-9 months ahead.",

    insiderTips: [
      "Brief us on the bachelor's preferences early. Chef plans dinner around what he actually loves rather than the standard menu.",
      "Anchored offshore parties don't have the same noise restrictions as marina dockage. The captain handles compliance.",
      "Tip convention for bachelor parties is the higher end of the range: 15-20% of base rate, paid in cash to the captain at end.",
      "If the bachelor's groom-side family will visit during the trip, brief us — the boat handles 'parent surprise visit' day differently.",
      "Multi-yacht flotillas (2 boats) work great when the bachelor group and the bride-side group are both at the trip but separate. Different yachts, same anchorages.",
    ],

    faq: [
      { q: "How much does a bachelor party yacht charter cost?", a: "Long weekends (3-4 nights): €15-€40K base depending on yacht. Full week (7 nights): €30-€85K. Multi-yacht flotilla: €60-€180K total. Add 25-30% APA and 12-24% Greek VAT. Per-person cost typically €1,800-€5,000 for 8 guests on a 7-night charter." },
      { q: "Can we bring our own DJ?", a: "Yes. DJs joining the yacht for 2-3 nights are common. We coordinate sound equipment, deck setup, and tender service. Brief us 4 weeks ahead." },
      { q: "What about noise restrictions?", a: "Anchored offshore (Ornos, Super Paradise back beach, Rhenia) gives effectively no noise limits. Marina dockage in Mykonos has noise rules after midnight; not the right choice for the party night." },
      { q: "Can we day-charter the bachelor's day-of?", a: "Yes. Single-day yacht charters for the bachelor day are popular. Cost €5-€15K per day depending on yacht plus catering and gratuity. We coordinate with the wedding planner if there's one." },
      { q: "Is the crew discreet about what happens on board?", a: "Crews sign NDAs as standard. For bachelor parties specifically, we brief the crew on extra discretion. Nothing said about the trip outside the boat." },
    ],

    ctaTitle: "Plan your bachelor party yacht charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=bachelor-party",
  },

  {
    slug: "bachelorette",
    urlPath: "/bachelorette-yacht-charter-greece",
    eyebrow: "Bachelorette Charters",
    h1: "Bachelorette Yacht Charter Greece",
    tagline: "Mykonos-cinematic, content-creator ready, private yacht for the bride and her closest people.",
    seoTitle: "Bachelorette Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Bachelorette yacht charter in Greek waters. Mykonos and Cyclades routes, content-creator-ready yachts, full crew including stylist coordination.",
    canonical: "https://georgeyachts.com/bachelorette-yacht-charter-greece",
    touristType: ["Bachelorette parties", "Bride's friends"],

    whyTitle: "Why bachelorette trips on yachts have replaced Las Vegas",
    whyBody:
      "Bachelorette trips have shifted dramatically since 2022. The Las Vegas formula (hotel, club, brunch) has lost its energy among UHNW brides who've seen everything. Mykonos and the Cyclades, on a private yacht, with chef-prepared dinners and beach-club afternoons, is **the new format**. The bride gets a week of memorable cinema rather than a weekend of recovery. " +
      "**The yacht is the content set**. Every angle photographs. The bride's mornings on the foredeck, the beach-club arrivals via tender, the sunset dinners — content creators in the group can produce a full week of material that will define the bride's social-media bachelorette. We work with photographers and content creators who specialise in yacht-week shoots; brief us at booking. " +
      "Two patterns dominate. **Long weekends (3-4 nights)** with 6-10 friends on a 60-80 foot catamaran from Mykonos. **Full weeks (7 nights)** with closer bachelorette parties (6-8 friends) doing the full Cycladic loop. The Greek bachelorette is now an established UHNW pattern with established yacht-charter conventions.",

    bestFor: [
      "Brides who want content over chaos",
      "Multi-night trips with 6-10 close friends",
      "Trips with a photographer or content creator joining",
      "June, September shoulder weeks with quieter Mykonos",
      "Bachelorettes preceding Greek-island weddings (yacht then wedding)",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 6 && (cruisingRegion match "*Cyclades*" || cruisingRegion match "*Mykonos*")',
    yachtsHeadline: "Bachelorette-ready yachts",
    featuredHeading: "Mykonos-based yachts for 2026",

    whenTitle: "When to book",
    whenBody: "Bachelorette season runs **May to October**. **June and September** are the sweet spots — Mykonos energy still on, less crowding for the content shoots, rates 20-30% off August peak. Book **6-9 months ahead** for full-week charters in peak August.",

    insiderTips: [
      "Brief us on whether a photographer is joining. The yacht's setup (where to anchor, when to tender, sunset angles) shifts when there's content production.",
      "The Bridal-shower-day dinner setup on the foredeck is the photograph of the trip. Plan it for day 3 or 4 when the group has settled in.",
      "Mykonos beach clubs (Nammos, SantAnna, Scorpios) accept reservations via the yacht's captain. Easier than the guest making them.",
      "Multi-tender for parallel activities matters on bachelorette charters. One tender to the beach club, one for the photographer's drone shots.",
      "If the bride is content-conscious, ask about boats with a 'beach-club platform' (extended swim platform) — the visual is unmatched.",
    ],

    faq: [
      { q: "How much does a bachelorette yacht charter cost?", a: "Long weekends: €15-€40K. Full week: €30-€85K. Per person for 8 guests on a 7-night charter: typically €1,800-€5,500. Add APA and VAT." },
      { q: "Can we bring a photographer?", a: "Yes. Photographers and content creators joining for the trip are common. Sometimes they're part of the bachelorette group; sometimes they're hired professionals flying in. We coordinate." },
      { q: "What about wedding-week tie-ins?", a: "Common pattern: bachelorette yacht week, week before the wedding. The bride sometimes hosts a second smaller yacht event on the wedding day itself. We coordinate with wedding planners." },
      { q: "Sound-system / playlist setup?", a: "All charter yachts above 25 metres have sound systems compatible with phone Bluetooth. Specific DJ-grade setups for the bachelorette night are easy to add via portable rigs; we coordinate." },
      { q: "Do you have boats decorated for bachelorette?", a: "Decoration is added pre-charter on the bride-side request. Champagne, flowers, banners, balloons — common requests. Brief us 2-3 weeks before; the crew handles the setup before boarding." },
    ],

    ctaTitle: "Plan your bachelorette yacht week.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=bachelorette",
  },

  {
    slug: "retreat",
    urlPath: "/retreat-yacht-charter-greece",
    eyebrow: "Retreat Charters",
    h1: "Retreat Yacht Charter Greece",
    tagline: "Executive retreats, founder weeks, wellness pauses. The boat handles logistics so you focus on the conversation.",
    seoTitle: "Retreat Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Retreat yacht charter in Greek waters. Executive off-sites, founder retreats, wellness pauses. Catamarans + motor yachts with chef, Wi-Fi, quiet anchorages.",
    canonical: "https://georgeyachts.com/retreat-yacht-charter-greece",
    touristType: ["Executives", "Founders", "Wellness retreat groups"],

    whyTitle: "Why a retreat on a yacht works better than a venue",
    whyBody:
      "Retreats live or die on **focus**. A land-based venue (hotel, conference centre, even a luxury private estate) keeps fighting the outside world: guests leave for shops, take excursions, find ways to break the focus. A yacht **removes the option**. Everyone sleeps in the same place. There's nowhere to go that isn't the trip. " +
      "**Two retreat formats** dominate our bookings. **Executive off-sites** (4-8 senior team members, 3-4 nights, strategy or planning focus) typically book a 25-35 metre motor yacht with Starlink Wi-Fi, conference-grade salon table, and a chef who respects the work rhythm. **Wellness retreats** (6-12 guests, 5-7 nights, slower pace) typically book sailing catamarans for the quieter rhythm; we coordinate yoga instructors and wellness practitioners flying in. " +
      "The yacht offers **what a land retreat can't**: the agenda happens at the boat's pace. Morning swim before breakfast. Conversation flows because nobody's looking at a watch. Phone reception is excellent in Greek anchorages so the work can happen, but the social pull of the city is gone.",

    bestFor: [
      "Founder and executive off-sites (4-8 people, 3-4 nights)",
      "Wellness retreats with yoga or meditation focus (6-12 guests, 5-7 nights)",
      "Strategy retreats for senior decision-makers requiring focus",
      "Sales kick-offs for elite teams",
      "Confidential planning weeks for family offices",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 6 && length match "*m*"',
    yachtsHeadline: "Retreat-capable yachts",
    featuredHeading: "Conference + wellness yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**May, June, September** are the retreat-ideal months — warm enough for outdoor activities, mild enough for outdoor dining, rates 20-35% below peak. **Mid-week starts** (Monday or Tuesday) are typical for corporate retreats. Wellness retreats often run **full weeks Sunday-Saturday** to align with weekly schedules.",

    insiderTips: [
      "Brief us on the agenda before recommending a yacht. Workshop-heavy retreats need salon-table seating; wellness retreats need foredeck space for yoga.",
      "Starlink Wi-Fi has changed corporate retreats. Confirm at booking; speed is sufficient for video calls when anchored.",
      "Anchored mode is the workhorse for retreats. Drop anchor in a sheltered bay (Hydra, Spetses, Folegandros) and stay 2-3 days while the agenda runs.",
      "Wellness retreats benefit from sailing catamarans (quieter at anchor, no generator noise). Corporate retreats benefit from motor yachts (stabilisers, faster transit between days).",
      "Crew gratuity for retreats: 12-15% of base, paid by the principal in cash at end of charter.",
    ],

    faq: [
      { q: "How much does a retreat yacht charter cost?", a: "Executive off-sites (3-4 nights, 25m yacht for 6-8): €25-€60K base. Wellness retreats (7 nights, 65-foot catamaran for 10): €30-€55K base. Plus APA 25-30% and Greek VAT." },
      { q: "Can we hold workshops on the yacht?", a: "Yes. The salon table on yachts above 25 metres seats 6-10 with screen-sharing capability. Anchored mode is best for workshop days. Brief us on the agenda at booking." },
      { q: "Is yacht charter tax-deductible for corporate retreats?", a: "Generally yes for documented corporate purposes. We provide compliant contracts and invoicing. Consult your tax adviser; we work with corporate-charter accountants on request." },
      { q: "Can yoga or wellness instructors fly in mid-charter?", a: "Yes. Coordinate with us 4 weeks ahead. The instructor boards at a Cycladic island (Mykonos, Paros most common) or directly at the marina at start." },
      { q: "How is confidentiality handled?", a: "Crews sign NDAs as standard. For confidential corporate or family-office retreats, additional NDAs available at no charge. The yacht itself is mobile and off public schedules — useful for sensitive discussions." },
    ],

    ctaTitle: "Plan your retreat.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=retreat",
  },

  {
    slug: "friends-trip",
    urlPath: "/friends-trip-yacht-charter-greece",
    eyebrow: "Friends Trip Charters",
    h1: "Friends Trip Yacht Charter Greece",
    tagline: "The annual-trip yacht week. 6-12 friends, one platform, no logistics arguments.",
    seoTitle: "Friends Trip Yacht Charter Greece 2026 | Group Travel | George Yachts",
    seoDescription: "Yacht charter for friend groups in Greek waters. 6-12 person trips with shared cabins, chef-prepared meals, full Cycladic or Ionian itineraries.",
    canonical: "https://georgeyachts.com/friends-trip-yacht-charter-greece",
    touristType: ["Friend groups"],

    whyTitle: "Why annual friends trips end up on yachts",
    whyBody:
      "Annual friend-group trips have a predictable failure mode: by year three, the logistics have killed the magic. Who's booking the villa, who's renting the cars, why are we eating dinner at this restaurant when half of us wanted the other one. **A yacht week solves all of it**. Same platform, same crew, same chef, same captain managing the calendar. The friends focus on each other rather than the plan. " +
      "**The group economics work surprisingly well**. A 75-foot catamaran for 8 friends at €40K base rate plus 30% APA settles around €52K all-in for the week. Per friend: €6,500 for accommodation, all meals, all transport between islands, chef-led dining, no restaurant bills. Comparable to a luxury hotel week but without the fragmentation. " +
      "Two formats dominate. **Same-friend-group yearly trips** (6-10 people, 7 nights, often the same yacht and crew year after year) build their own tradition; we have groups returning for their 5th year. **One-off larger friend reunions** (10-16 people, 7-10 nights, often timed to a milestone like 40th birthdays) typically need multi-yacht flotillas.",

    bestFor: [
      "Annual friend-group trips (6-10 people, year-after-year)",
      "Milestone reunions (10-16 people, two-yacht flotilla)",
      "30-something or 40-something friend groups consolidating travel time",
      "Friends who've done the villa/hotel cycle and want the next format",
      "International friend groups meeting in Greece from different cities",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 8',
    yachtsHeadline: "Friends-trip yachts",
    featuredHeading: "Group-friendly yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**Late June through early September** is the friends-trip peak (everyone's holiday schedules align). **September** is the smartest week for friend groups in their 30s+ (warmer water than June, fewer crowds, lower rates). Book **6-9 months ahead** for peak August.",

    insiderTips: [
      "Decide the cabin layout BEFORE booking. The arguments don't happen on the boat if they're resolved before.",
      "Plan one beach-day, one village-evening, one boat-only day every two days. The cadence keeps the trip varied without overstuffing.",
      "Brief the chef on each guest's preferences. By day 3, lunch becomes the meal of the day.",
      "Cocktail hour at sunset is the social rhythm of a friends week. Brief the hostess on signature drink preferences.",
      "Tip convention is 12-15% of base rate, split. Decide upfront how the group splits the gratuity; saves awkwardness at end.",
    ],

    faq: [
      { q: "How many friends fit on one yacht?", a: "Greek charter law caps at 12 guests for any commercial yacht. So 6-12 friends max on a single yacht. For 13+, multi-yacht flotilla is required." },
      { q: "How much per person?", a: "8 friends on a 75-foot catamaran at €40-€55K all-in: €5,000-€7,500/person for a 7-night charter. 10 friends on a 30-metre motor yacht at €90-€140K all-in: €9,000-€14,000/person." },
      { q: "Can friends have separate flight arrival times?", a: "Yes. Yachts can meet guests at agreed Cycladic islands mid-charter (Mykonos, Paros, Naxos all have direct flights). Brief us on planned arrivals at booking." },
      { q: "What about different dietary preferences?", a: "Chefs accommodate the full range. Vegetarian, vegan, gluten-free, kosher, halal, allergies — brief us 3+ weeks ahead." },
      { q: "Should we rent one yacht or split into two?", a: "One yacht is cheaper and more cohesive. Two yachts (multi-yacht flotilla) makes sense for 13+ guests, or when different couples want very different cabin layouts." },
    ],

    ctaTitle: "Plan your friends trip.",
    ctaPrimary: "Find a yacht",
    ctaPrimaryHref: "/yacht-finder?usecase=group",
  },

  {
    slug: "proposal",
    urlPath: "/proposal-yacht-charter-greece",
    eyebrow: "Proposal Charters",
    h1: "Proposal Yacht Charter Greece",
    tagline: "Single-day or full-week charters built around the moment. The crew handles every detail except the ring.",
    seoTitle: "Proposal Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Proposal yacht charter in Greek waters. Day charters and longer weeks built around an engagement. Photographers, chef-prepared meals, anchored at sunset.",
    canonical: "https://georgeyachts.com/proposal-yacht-charter-greece",
    touristType: ["Engagement", "Couples"],

    whyTitle: "Why proposals on yachts work",
    whyBody:
      "Engagement proposals on yachts have become **a category of their own** in Greek charter. The reasons are practical: the setting can't be beaten (sunset at anchor below Oia or off Hydra), the privacy is absolute (no other diners watching), and the crew handles every detail in advance so the partner doesn't suspect anything until the moment. " +
      "**We host two patterns**. **Day charters** (the most common): a 60-80 foot motor yacht chartered for 6-10 hours, with the proposal scheduled for sunset at a specific anchorage, photographer aboard for the moment, chef preparing dinner for the post-proposal celebration. **Full-week charters** with the proposal scheduled for day 3 or 4: the partner doesn't know what's coming, the moment is built into the week, the rest of the trip becomes the engagement celebration. " +
      "We have planned over 40 yacht proposals in Greek waters since 2022. Crews are excellent at maintaining the surprise. Photographers are pre-arranged via the brokerage. The ring is the only thing we don't supply.",

    bestFor: [
      "Single-day proposal charters (most common)",
      "Engagement weeks with proposal built into day 3-4",
      "Sunset proposals at specific anchorages (Oia, Hydra, Folegandros)",
      "Proposals with photographer aboard for the moment",
      "Multi-yacht arrangements for proposal day + family celebration following",
    ],

    yachtFilter: '_type == "yacht" && sleeps <= 4',
    yachtsHeadline: "Intimate yachts for proposals",
    featuredHeading: "Two-cabin yachts for 2026",

    whenTitle: "When to plan",
    whenBody: "**June, September, October** are the cinematic-light months for sunset proposals — golden hour stretches longer, water is calm, weather predictable. **May and October** are quietest. Book **6-8 weeks ahead** for day charters, **4-6 months** for full-week charters around the proposal.",

    insiderTips: [
      "Brief us on the partner's preferences early. We coordinate the surprise without leaving any trace in shared accounts (no email confirmations to a shared inbox).",
      "Photographer aboard is the deciding factor for the memory. We pre-arrange via trusted yacht-photography photographers.",
      "Sunset proposals work best at anchored yachts in specific anchorages: Santorini caldera below Oia, Folegandros cliff, Hydra harbour mouth, Lakka on Paxos.",
      "Post-proposal celebration: the chef prepares the proposal-night dinner as a 4-course tasting that emerges after the moment. Brief on favourite dishes 4 weeks ahead.",
      "We've coordinated proposals where the family flies in to meet the yacht the day after. Lead time 6-8 weeks for complex multi-family setups.",
    ],

    faq: [
      { q: "How much does a proposal yacht charter cost?", a: "Single-day charter for proposal: €5-€18K depending on yacht size and amenities, plus catering, photographer, gratuity. Full-week charter with built-in proposal: €60-€140K all-in (the proposal is part of an honeymoon-equivalent week)." },
      { q: "Can the crew keep the surprise?", a: "Yes. We brief crews specifically on proposal surprises. The partner doesn't know until the moment. Crew can sign supplementary NDAs if you want extra-formal commitment." },
      { q: "What if the partner says no?", a: "We've never had this happen in 40+ proposals but the question deserves an answer. The yacht continues the charter normally; the crew adapts. The cost of the day is the same regardless of the answer." },
      { q: "Can we get married on the yacht after a proposal?", a: "Legally no in Greek waters (Greek law requires civil ceremony on Greek soil). But yacht-based wedding receptions are common after a separate legal ceremony. See our wedding yacht charter page." },
      { q: "Best anchorages for a proposal?", a: "Santorini caldera below Oia at sunset (the cliché but unmatched). Folegandros cliff at sunset (less cliché, equally cinematic). Hydra harbour mouth at sunset (Saronic option). Lakka on Paxos (Ionian option, very intimate)." },
    ],

    ctaTitle: "Plan your proposal yacht charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=proposal",
  },

  {
    slug: "milestone-celebration",
    urlPath: "/milestone-celebration-yacht-charter-greece",
    eyebrow: "Milestone Celebrations",
    h1: "Milestone Celebration Yacht Charter Greece",
    tagline: "Significant birthdays, anniversaries, retirements, family reunions. The boat hosts the moment that matters.",
    seoTitle: "Milestone Celebration Yacht Charter Greece 2026 | George Yachts",
    seoDescription: "Yacht charter for milestone celebrations in Greek waters. Major birthdays, anniversaries, retirements, family reunions. Bespoke planning, crew-coordinated.",
    canonical: "https://georgeyachts.com/milestone-celebration-yacht-charter-greece",
    touristType: ["Multi-generational families", "Couples celebrating milestones"],

    whyTitle: "Why milestone moments land better on yachts",
    whyBody:
      "Milestone celebrations carry weight that ordinary trips don't. A 60th birthday, a 25th anniversary, a parent's retirement, a milestone year that brings the extended family together. Land-based celebrations get **fragmented** by logistics: guests scatter to hotels, the party venue is rented for hours not days, by the morning after everyone's gone home. " +
      "**A yacht charter week consolidates the moment**. The whole family stays on the same boat. The milestone day is built into day 3 or 4 (the day the celebration itself becomes the high point). The chef plans the day's meals as memorable courses. Photographers join for the day if you want. The rest of the week is the family time the milestone earned. " +
      "We host milestone celebrations on **30-50 metre yachts** for families of 8-12. Multi-yacht flotillas for 14+ guests. The boat handles the platform; the family handles the meaning. Crew briefs we run on milestone celebrations are some of the most detailed in our book — every preference accounted for, every surprise pre-arranged.",

    bestFor: [
      "Major birthdays (50, 60, 70) with extended family aboard",
      "Significant anniversaries (25, 50) celebrated by multiple generations",
      "Retirement parties hosted by family for principal",
      "Family reunions timed to a milestone year",
      "Multi-yacht arrangements for 14-30 guest milestone events",
    ],

    yachtFilter: '_type == "yacht" && sleeps >= 8',
    yachtsHeadline: "Milestone-ready yachts",
    featuredHeading: "Family-celebration yachts for 2026",

    whenTitle: "When to book",
    whenBody: "**4-9 months ahead** for milestone celebration weeks. **Specific anniversary or birthday dates** book 6-12 months out depending on flexibility. **Multi-yacht flotillas** require 9-12 months minimum. Most milestones happen **June through September**; off-peak months (May, October) suit older principals preferring milder weather.",

    insiderTips: [
      "Brief us on the principal's specific memories and preferences 4-6 weeks before. The chef builds around them.",
      "Photo book of the family year, presented at the milestone dinner, is a frequent request. Lead time 8 weeks for the album to be made.",
      "Surprise elements (family member flying in on day 4, restored wine from the milestone year, hand-written letters in each cabin) require 6-week lead time minimum.",
      "Crew gratuity for milestone celebrations is typically the high end: 15-18% of base rate, paid by the principal in cash.",
      "Family videographers joining for the milestone day are common. We coordinate with trusted yacht-event videographers; brief us at booking.",
    ],

    faq: [
      { q: "How much does a milestone yacht week cost?", a: "30-metre yacht for 8-12 family members: €120-€280K base for 7 nights, plus 30% APA and 12-24% Greek VAT. Multi-yacht flotilla for 14-24 guests: €250-€500K total. Per family member typically €15-€35K for a 7-night charter." },
      { q: "Can we surprise the principal?", a: "Yes. We've coordinated some elaborate milestone surprises: principal arriving thinking it's just a couples' trip, family flying in on day 4, the boat decorated overnight by the crew. Crews are excellent at this; lead time 6 weeks." },
      { q: "Photographers / videographers?", a: "We coordinate with trusted yacht-event photographers and videographers. Day rate plus travel typically €1,500-€4,000 for a single milestone day. Multi-day coverage 30-50% lower per day." },
      { q: "Can we have a band or music for the milestone night?", a: "Yes. Acoustic ensembles (3-5 musicians) accommodate easily on yachts above 25 metres. Specific Greek-island musicians: we recommend three based on the genre preference. Brief at booking." },
      { q: "What about a custom cake?", a: "Yes. Bespoke cakes ordered from Mykonos, Santorini, or Athens patisseries delivered to the yacht at the milestone anchorage. Brief 3-4 weeks ahead with design preferences." },
    ],

    ctaTitle: "Plan your milestone yacht charter.",
    ctaPrimary: "Speak with George",
    ctaPrimaryHref: "/inquiry?topic=milestone",
  },
];

export function getUseCaseBySlug(slug) {
  return USE_CASES.find((u) => u.slug === slug) || null;
}
