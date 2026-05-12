// Glossary / Definitions Hub — Phase 7 Round 15 (2026-05-12).
// Single source of truth for the 30 UHNW yacht-charter definitions
// that power /glossary and /glossary/[slug].
//
// Why this exists: definition pages are the highest-leverage content
// type for both Google featured snippets AND AI-engine citations
// (ChatGPT, Perplexity, Claude, Gemini). When a UHNW buyer asks "what
// is APA in yacht charter" the LLM looks for an authoritative,
// well-structured, schema-marked definition source. This file gives
// us 30 of those at one stroke.
//
// Data contract per entry:
//   slug             string  — URL slug at /glossary/[slug]
//   term             string  — canonical display name
//   alsoKnownAs      [string] — synonyms / acronyms — improves rankings
//                                for variations of the same query
//   category         string  — pricing | charter-types | yacht-types
//                                | operations | crew | specs | legal
//   shortDefinition  string  — ≤220 chars. Featured-snippet target.
//                                Must answer the "what is X" query in
//                                one declarative sentence.
//   longDefinition   string  — 200-400 words of expanded context with
//                                concrete numbers, real-world examples.
//   whyItMatters     string  — UHNW-specific framing: why a buyer
//                                cares about this term.
//   examples         [{title, body}] — 1-2 realistic scenarios
//   faq              [{q, a}] — 4-6 follow-up questions
//   relatedTerms     [string] — slugs of 3-5 related definitions
//   relatedPages     [{title, url}] — internal links to existing pages
//   seoTitle         string
//   seoDescription   string
//   canonical        string

export const GLOSSARY_TERMS = [
  // ─────────────────────────────────────────────────────────────
  // PRICING & CONTRACTS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "apa",
    term: "APA (Advance Provisioning Allowance)",
    alsoKnownAs: ["Advance Provisioning Allowance", "Provisioning Allowance"],
    category: "pricing",
    shortDefinition:
      "APA is an upfront sum — typically 25–35% of the base charter fee — paid before embarkation to cover the yacht's running expenses during your charter: fuel, food, drink, port fees, and laundry.",
    longDefinition:
      "The Advance Provisioning Allowance is the single most misunderstood line item in yacht chartering. It is not a deposit, a tip, or a tax. It is a working float held by the captain in trust to pay the operating expenses of the yacht while it is under your command. " +
      "On a Greek charter in 2026, APA is normally set at **30% of the base charter fee** under the MYBA contract — though it can range from 25% to 40% depending on the yacht's fuel consumption profile (a 60-metre superyacht doing 20 knots burns dramatically more than a 24-metre sailing yacht under canvas). " +
      "What APA covers: diesel, gasoline for the tender, drinking water, food and beverages provisioned to your preferences, port and marina fees, harbour clearance, customs costs, communications, and laundry. What APA does NOT cover: the crew gratuity (separate), personal expenses ashore, dive certifications, and any third-party services the captain books on your behalf (e.g. a private chef ashore). " +
      "At the end of the charter the captain produces a full reconciliation. If you spent less than the APA, the balance is refunded in cash or wire. If you spent more, you settle the difference on the day of disembarkation. UHNW buyers should expect to see every receipt — a serious captain hands over a folder, not a verbal summary.",
    whyItMatters:
      "APA is the difference between a quoted charter price and the actual cash you will commit. A €120,000 weekly charter in the Cyclades comes with €36,000 of APA before you board — a 30% addition to your budget. If your broker is not framing APA, season, and gratuity in the same conversation as the base fee, you are not talking to a UHNW broker.",
    examples: [
      {
        title: "Motor yacht, 35m, Mykonos → Santorini, 7 nights",
        body: "Base charter fee: €105,000. APA at 30%: €31,500 wired 14 days before embarkation. Actual consumption: €27,800. Refund on disembarkation: €3,700 cash.",
      },
      {
        title: "Sailing yacht, 28m, Ionian, 7 nights, low-consumption profile",
        body: "Base charter fee: €58,000. APA at 25%: €14,500 wired 14 days before embarkation. Actual consumption: €13,200. Refund: €1,300.",
      },
    ],
    faq: [
      {
        q: "Is APA refundable if I spend less than the deposit?",
        a: "Yes. Any APA not consumed during the charter is refunded to you at disembarkation, either in cash or via bank wire within 7 days. The captain provides a full receipt-backed reconciliation.",
      },
      {
        q: "Can the captain ask for additional APA mid-charter?",
        a: "Yes, if the yacht's consumption exceeds the initial estimate (long passages, heavy guest hospitality, premium spirits). A professional captain flags this 24–48 hours in advance and shows the running ledger before requesting a top-up.",
      },
      {
        q: "Is APA the same on a sailing yacht as on a motor yacht?",
        a: "No. Sailing yachts consume less fuel and typically operate on 25% APA. Motor yachts run 30% as standard, and high-performance motor yachts (planing hulls, large displacement above 50 metres) can require 35% or more.",
      },
      {
        q: "Who controls how APA is spent?",
        a: "The captain spends APA in line with your stated preferences, agreed in the preference sheet before embarkation. You can request specific wines, brands, dietary restrictions, fuel limits — the captain is bound by your direction but has full discretion within it.",
      },
      {
        q: "Is APA paid to the broker or directly to the yacht?",
        a: "Under MYBA contract, APA is wired to a designated escrow or yacht-management account, never to the broker personally. George Yachts uses MYBA-standard escrow flow on every Greek charter we contract.",
      },
    ],
    relatedTerms: ["gratuity", "myba-contract", "charter-fee", "greek-vat", "provisioning"],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Charter cost calculator", url: "/cost-calculator" },
    ],
    seoTitle: "What is APA in Yacht Charter? Advance Provisioning Allowance Explained (2026)",
    seoDescription:
      "APA is an upfront 25–35% sum that covers your charter's running costs — fuel, food, port fees. Full breakdown with real Greek-charter numbers from George Yachts.",
    canonical: "https://georgeyachts.com/glossary/apa",
  },

  {
    slug: "gratuity",
    term: "Gratuity (Crew Tip)",
    alsoKnownAs: ["Crew Gratuity", "Yacht Tip", "Crew Tip"],
    category: "pricing",
    shortDefinition:
      "Gratuity is a separate cash tip paid to the yacht's crew at the end of a successful charter, customarily 5–20% of the base charter fee. It is not included in the charter fee or the APA.",
    longDefinition:
      "Crew gratuity is the most personal cost line of a yacht charter and the one most often left out of comparison spreadsheets. Under MYBA convention, a charter guest tips the crew between **5% and 20% of the base charter fee** — never of the total invoiced amount (which includes APA, VAT, delivery). " +
      "What sets the percentage: service quality, crew size, charter length, and the guest's personal benchmark. In the Greek market in 2026 the median tip is **10–12%**. Tips below 7% are read by the crew as a signal of dissatisfaction; tips above 18% are reserved for charters where the crew has gone significantly beyond standard MYBA service. " +
      "How to pay: cash to the captain at disembarkation, in euros, in a sealed envelope. The captain distributes among the crew according to his internal arrangement (typically equal shares for senior crew, with deckhands and stewardesses receiving a slightly lower allocation). High-end charterers sometimes split the tip — e.g. an envelope for the captain personally and another for the rest of the crew — but this is gauche unless the captain has been notably distinct from the rest. " +
      "Bank transfer is acceptable on long charters or where cash logistics are difficult, but cash on the morning of disembarkation is the convention and what crews remember.",
    whyItMatters:
      "Gratuity is the line item that determines whether the crew remembers your name and gives you priority next season. A €100,000 charter where you tip €5,000 will be remembered as cheap regardless of how charming you were at dinner. The Greek charter community is small — captains talk to each other, and a reputation for fair gratuity opens doors to yachts that are nominally booked out.",
    examples: [
      {
        title: "Standard charter, €150,000 base fee, 7 nights, 6-person crew",
        body: "Gratuity at 12%: €18,000 in cash. Distributed by the captain — typically €4,000 each to captain + chef, €2,500 each to mate + chief stewardess, €2,500 split among 2 deckhands.",
      },
      {
        title: "Exceptional service, €250,000 base fee, 10 nights, 8-person crew",
        body: "Gratuity at 18%: €45,000. Reserved for charters where guests felt the crew transformed the experience — bespoke shore excursions, private chef interventions, surprise birthday set-pieces.",
      },
    ],
    faq: [
      {
        q: "Is the gratuity included in the charter fee?",
        a: "No. The base charter fee covers the yacht and its crew's salaries. Gratuity is a separate, voluntary tip paid by the charterer to the crew at the end of the charter.",
      },
      {
        q: "What's the standard tip for a Greek yacht charter?",
        a: "10–12% of the base charter fee is the 2026 Greek-market median. 5–7% signals dissatisfaction. 15%+ signals exceptional service.",
      },
      {
        q: "Do I tip in cash or by bank transfer?",
        a: "Cash in euros on the morning of disembarkation is convention. Bank transfer is acceptable on long charters but loses the personal moment with the captain.",
      },
      {
        q: "Do I tip the crew individually or as a group?",
        a: "One envelope to the captain, who distributes among the crew. Tipping individual crew members directly is considered poor form and undermines the captain's authority.",
      },
      {
        q: "Is gratuity taxable in Greece?",
        a: "Crew gratuities are not subject to VAT and are received personally by the crew, not the yacht's operating company. They are declared by the crew on their personal income tax in their flag jurisdiction.",
      },
    ],
    relatedTerms: ["apa", "myba-contract", "charter-fee", "captain", "stewardess"],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
    ],
    seoTitle: "Yacht Charter Crew Gratuity: How Much to Tip the Crew (2026 Guide)",
    seoDescription:
      "Crew gratuity is 5–20% of the base charter fee, paid in cash at disembarkation. Greek-market 2026 median is 10–12%. Full etiquette guide from George Yachts.",
    canonical: "https://georgeyachts.com/glossary/gratuity",
  },

  {
    slug: "delivery-fee",
    term: "Delivery Fee",
    alsoKnownAs: ["Repositioning Fee", "Yacht Delivery Charge", "Positioning Fee"],
    category: "pricing",
    shortDefinition:
      "A delivery fee is a charge billed when the yacht must travel from its home base to your chosen embarkation port — and back afterwards — usually invoiced at the yacht's daily running cost or a flat negotiated rate.",
    longDefinition:
      "Most yachts in Greece are based in three home ports: Athens (Alimos, Lavrion, Olympic Marine), Corfu, and Rhodes. If your itinerary embarks elsewhere — say, you want to start from Mykonos — the yacht has to travel there before you board and return after you disembark. That cost is the delivery fee. " +
      "Two common models. **(1) Time charter at daily rate**: the yacht runs to your start point and you pay 1/7th of the weekly charter fee per delivery day. A 24-hour passage from Athens to Mykonos at a yacht's €150,000/week rate costs about €21,500 each way. " +
      "**(2) Negotiated flat fee**: smaller and mid-tier yachts often quote a fixed delivery — e.g. €4,000 each way from Athens to Mykonos. Always cheaper than the time-charter model but only available with operators that have flexible scheduling. " +
      "When delivery is waived: if the yacht is already in your start port (often the case in peak season as the fleet redistributes), or if your itinerary ends back at the home base, the delivery may be cancelled or halved. A good broker checks the yacht's pre/post-charter calendar before quoting and negotiates the waiver.",
    whyItMatters:
      "Delivery is the cost line where unsophisticated brokers cost their clients €15–30k unnecessarily. A UHNW buyer should be told before signing where the yacht is positioned and whether the delivery can be eliminated by adjusting the embarkation port by 30 nautical miles. That conversation separates a transactional broker from a relationship broker.",
    examples: [
      {
        title: "Yacht based Athens, charter embarks Mykonos",
        body: "Time at sea: ~10 hours each way at 18 knots. Delivery cost at daily rate: €4,300 one-way → €8,600 return. Often negotiable down to €5,500 flat on mid-tier yachts.",
      },
      {
        title: "Yacht based Corfu, charter embarks Kefalonia",
        body: "Time at sea: ~6 hours each way. Often waived entirely on Ionian-based yachts since the fleet expects to reposition for charters across the chain.",
      },
    ],
    faq: [
      {
        q: "Is the delivery fee always charged?",
        a: "No. If the yacht is already positioned at your embarkation port, or if your start and end are at its home base, delivery is typically waived.",
      },
      {
        q: "Can I negotiate a delivery fee?",
        a: "Yes — and you should. Delivery is one of the most negotiable items in a charter contract. A skilled broker can often eliminate or halve it by adjusting embarkation timing or routing.",
      },
      {
        q: "Does the delivery fee come with VAT?",
        a: "Yes. In Greece in 2026 delivery is invoiced at the same 12% reduced VAT rate as the charter fee, provided the trip is within Greek waters.",
      },
      {
        q: "Who pays the fuel for the delivery passage?",
        a: "The fuel cost for delivery is part of the delivery fee under a flat-rate model, or drawn from the APA if the delivery is treated as a charter day.",
      },
    ],
    relatedTerms: ["apa", "charter-fee", "embarkation", "greek-vat", "myba-contract"],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
    ],
    seoTitle: "What is a Yacht Charter Delivery Fee? (2026 Greek Market Guide)",
    seoDescription:
      "Delivery fees cover the cost of repositioning the yacht to your embarkation port. Often negotiable, sometimes waivable. Real Greek-market numbers from George Yachts.",
    canonical: "https://georgeyachts.com/glossary/delivery-fee",
  },

  {
    slug: "greek-vat",
    term: "Greek VAT on Yacht Charters",
    alsoKnownAs: ["Greek Charter VAT", "VAT 12%", "Greek Yacht Tax"],
    category: "pricing",
    shortDefinition:
      "Greek yacht charters are taxed at a reduced VAT rate of 12% (half the standard 24% Greek VAT rate), applied to the base charter fee. This rate applies as long as the charter remains within Greek waters.",
    longDefinition:
      "Greece applies a **reduced VAT rate of 12% on yacht charters** under EU Directive 2006/112/EC, half of the standard 24% Greek VAT. The reduced rate is one of the most favourable yacht-charter VAT regimes in the Mediterranean — comparable to Croatia's 13% and meaningfully below Italy's 22% (although Italy has historically allowed a French-style reduction for time spent in international waters). " +
      "**What VAT applies to:** the base charter fee, the delivery fee, and any extras invoiced through the yacht's operating company. **What VAT does NOT apply to:** the APA reconciliation (the spend itself carries its own VAT in the captain's receipts), the gratuity, and any direct payments to external vendors (a private chef ashore, a helicopter transfer arranged outside the yacht). " +
      "**Critical rule:** the 12% rate only holds if the charter is consumed within Greek territorial waters. If you cross into Turkish, Italian, or Albanian waters mid-charter, the time spent outside Greece is theoretically not subject to Greek VAT — but the operator must declare the proportionality at the end. In practice, intra-Greece charters (which is what 95% of Greek charters are) keep the simple 12% calculation. " +
      "Compared to: France (10% reduced rate but only on time spent in French waters), Spain (21% standard), Monaco (no VAT on charters embarking Monaco — the major reason luxury fleets repositioning there in shoulder seasons).",
    whyItMatters:
      "VAT is a real €15–40k line item on a luxury charter. UHNW buyers compare jurisdictions and Greece is structurally cheaper than France, Spain, and Italy on this single point. A broker who is fuzzy on Greek VAT is signalling either inexperience or laziness — both unacceptable at this price point.",
    examples: [
      {
        title: "Standard €150,000 charter, all-Greek itinerary",
        body: "VAT at 12%: €18,000. Total invoice: €168,000 + APA + gratuity.",
      },
      {
        title: "Same charter, but two days spent in Turkish waters",
        body: "VAT proportionality: 5/7 days in Greek waters = €12,857 VAT applied to that portion. The remaining 2 days may attract Turkish VAT through the operator's flag arrangement. Most brokers structure itineraries to stay all-Greek for cleaner compliance.",
      },
    ],
    faq: [
      {
        q: "Is Greek VAT really 12% or is it 13%?",
        a: "12% as of 2026. The rate is fixed at half the standard Greek VAT (24%), and Greek standard VAT has been 24% since 2016.",
      },
      {
        q: "Is VAT included in the charter quote?",
        a: "Some brokers quote pre-VAT (cleaner for comparison), some quote inclusive. Always ask: 'Is this number gross or net of VAT?' The 12% difference matters at scale.",
      },
      {
        q: "Can I reclaim Greek VAT as a non-EU resident?",
        a: "Generally no on charter services consumed in Greece. VAT recovery on services for personal consumption is not available under EU rules, regardless of resident status.",
      },
      {
        q: "Does the APA also get VAT?",
        a: "The APA itself does not. The expenses paid from APA do — every receipt the captain provides will show local VAT on fuel, food, port fees, all already paid by the time you settle the reconciliation.",
      },
      {
        q: "Is there a way to legally reduce Greek VAT on a charter?",
        a: "By structuring the itinerary to include international-waters time you can in theory reduce the VAT-applicable portion. In practice the legal complexity rarely justifies the savings unless the charter is 14+ days. Most clean answer: charter in Greece and accept the 12%.",
      },
    ],
    relatedTerms: ["apa", "charter-fee", "delivery-fee", "myba-contract"],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Greek yacht charter vs Mediterranean alternatives 2026", url: "/blog" },
    ],
    seoTitle: "Greek Yacht Charter VAT 2026: The 12% Rate Explained",
    seoDescription:
      "Greece taxes yacht charters at 12% VAT — half the standard rate, and structurally cheaper than France, Spain, and Italy. Full breakdown with international comparisons.",
    canonical: "https://georgeyachts.com/glossary/greek-vat",
  },

  {
    slug: "myba-contract",
    term: "MYBA Charter Contract",
    alsoKnownAs: ["MYBA Agreement", "MYBA Standard", "MYBA Form"],
    category: "legal",
    shortDefinition:
      "The MYBA Charter Agreement is the industry-standard contract for luxury yacht charters worldwide, published by the Mediterranean Yacht Brokers Association. It governs deposit, APA, cancellation, liability, and crew obligations.",
    longDefinition:
      "MYBA — the **Mediterranean Yacht Brokers Association** — publishes the standard form charter agreement that 90%+ of luxury charters in the Mediterranean use. The MYBA form is the equivalent of an ISDA in finance: a known, predictable, lawyer-tested document that protects both charterer and yacht owner, and that no serious broker would deviate from without explicit reason. " +
      "**What MYBA covers:** the base charter fee, the deposit schedule (50% on contract signing, 50% 30 days before embarkation is most common), the APA percentage, the duration, the cruising area, exclusions (e.g. 'no waters east of longitude X'), force majeure, owner's cancellation rights, weather-day mechanics, and the post-charter inventory reconciliation. " +
      "**Why MYBA over a bespoke contract:** every UHNW charterer's legal counsel knows MYBA. Reviewing a non-MYBA contract triples legal review time and costs. Owners refuse to charter outside MYBA because the form protects their asset under a known liability regime. The form has been refined for 40 years through real-world disputes — most edge cases are pre-resolved. " +
      "**MYBA vs alternatives:** YACOA (Yacht Charter Operators Association) publishes a similar form used in some non-Mediterranean markets. Caribbean brokers occasionally use the CYBA (Charter Yacht Brokers Association) form. For Greece in 2026, MYBA is the standard George Yachts uses on every charter — anything else should raise a question.",
    whyItMatters:
      "MYBA is the moat between you and a six-figure problem. If something goes wrong — a force majeure cancellation, a mid-charter weather event, an injury aboard — the MYBA form has the answer. Without it, you are in court in a foreign jurisdiction. UHNW charterers should ask one question before any contract signing: 'Is this MYBA-standard?' If the answer is anything but yes, walk.",
    examples: [
      {
        title: "Standard deposit schedule on a €200,000 charter",
        body: "Contract signing: 50% (€100,000). 30 days before embarkation: 50% balance + 30% APA = €160,000. Total wired before boarding: €260,000.",
      },
      {
        title: "Force majeure clause activation",
        body: "If a government-imposed shutdown or extreme weather event prevents charter, MYBA Clause 19 governs whether the charter is postponed, refunded, or partially refunded. Most 2020 COVID charters were postponed without penalty under this clause.",
      },
    ],
    faq: [
      {
        q: "Is the MYBA contract negotiable?",
        a: "Some clauses yes — the cancellation schedule, the cruising area, the inclusion or exclusion of specific items. The core liability framework is rarely modified because doing so undermines the protections that make MYBA valuable.",
      },
      {
        q: "Who drafts the MYBA contract?",
        a: "The broker drafts using MYBA's published template, populating with the specific yacht, dates, fees, and itinerary. Both charterer and yacht owner (or their representatives) sign.",
      },
      {
        q: "Do I need a lawyer to review a MYBA contract?",
        a: "If the charter is over €100,000, a lawyer familiar with MYBA can spot non-standard amendments in under an hour. Below €50,000 most brokers consider it overkill. George Yachts recommends legal review on any charter above €200,000.",
      },
      {
        q: "What happens if the yacht is double-booked?",
        a: "MYBA's Clause 6 addresses this: if the yacht is unable to deliver, the owner refunds 100% of deposits and APA, and is liable for the charterer's reasonable costs of finding equivalent alternative chartering — capped per the clause. In practice serious brokers prevent double-booking via the yacht's central calendar.",
      },
      {
        q: "Is MYBA recognised in Greek courts?",
        a: "Yes. MYBA contracts are typically governed by English law with arbitration in London, but Greek courts recognise the choice-of-law clause for charter disputes. The form is well-tested across European jurisdictions.",
      },
    ],
    relatedTerms: ["apa", "gratuity", "charter-fee", "delivery-fee"],
    relatedPages: [
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
      { title: "Charter timeline", url: "/charter-timeline" },
    ],
    seoTitle: "MYBA Charter Contract: The Standard Yacht Charter Agreement Explained",
    seoDescription:
      "MYBA is the industry-standard yacht charter contract used on 90%+ of Mediterranean luxury charters. Full breakdown of clauses, deposits, and protections.",
    canonical: "https://georgeyachts.com/glossary/myba-contract",
  },

  {
    slug: "charter-fee",
    term: "Charter Fee (Base Fee)",
    alsoKnownAs: ["Base Charter Rate", "Weekly Rate", "Charter Hire Fee"],
    category: "pricing",
    shortDefinition:
      "The charter fee is the base weekly rate paid for the use of the yacht and its crew. It excludes APA, VAT, delivery fees, and crew gratuity — all of which are billed separately.",
    longDefinition:
      "When a yacht is quoted at '€150,000 per week,' that figure is the **charter fee** alone. It is the cost of renting the vessel and retaining its full crew for seven days within an agreed cruising area. The charter fee includes the yacht itself, the crew's wages, insurance, normal maintenance and consumables (linens, cleaning products, basic galley equipment), and use of the standard onboard amenities (tenders, water toys, sun beds). " +
      "**What the charter fee does NOT include — the four other cost buckets:** (1) APA at 25–35% of the charter fee, covering fuel, food, drink, and port fees; (2) Greek VAT at 12% of the charter fee + delivery; (3) Delivery fee if the yacht must reposition; (4) Crew gratuity at 5–20% of the charter fee, paid at disembarkation. " +
      "**Charter-fee anatomy by yacht type, Greek market 2026 (weekly, base only):** motor yachts 30–60m: €60,000–€450,000; sailing yachts 25–45m: €25,000–€180,000; catamarans 20–30m: €18,000–€90,000; gulets 25–35m: €25,000–€70,000; superyachts 50m+: €350,000–€1,500,000+. " +
      "**Seasonal multipliers on the base fee:** July–August carries the highest rate (the published number). June and early September normally discount 15–25%. Late September drops 30–40%. Off-season (April, October) can be 50% below peak. May and shoulder-September are the sweet spot for value-quality balance.",
    whyItMatters:
      "Comparing two yachts by charter fee alone misleads UHNW buyers. A yacht quoted €120,000/week with a 35% APA, 12% VAT, and obligatory €15k delivery costs €189,600 fully loaded — versus a €130,000/week yacht with 25% APA, no delivery, same VAT = €178,150. The 'cheaper' yacht is more expensive once you add everything.",
    examples: [
      {
        title: "Full cost breakdown of a 'mid-market' €100,000 charter",
        body: "Charter fee: €100,000. VAT 12%: €12,000. APA 30%: €30,000. Delivery (Athens to Mykonos return): €8,000. Gratuity 12%: €12,000. **Fully loaded: €162,000** — 62% above the headline weekly rate.",
      },
      {
        title: "Same yacht, no delivery (already in Mykonos), shoulder pricing",
        body: "Charter fee (June discount): €82,000. VAT 12%: €9,840. APA 30%: €24,600. Gratuity 12%: €9,840. **Fully loaded: €126,280** — €36k saved by understanding the timing.",
      },
    ],
    faq: [
      {
        q: "Why isn't APA included in the charter fee?",
        a: "Because APA covers consumables that vary wildly between charterers — a guest list of 12 vs 4, premium spirits vs house wine, long passages vs short hops. Pooling APA with the base fee would force every charter to pay average — which means light users subsidise heavy users.",
      },
      {
        q: "Are the crew's wages included in the charter fee?",
        a: "Yes. The crew is paid by the yacht owner from the charter fee. Crew gratuity at the end is additional and goes directly to the crew.",
      },
      {
        q: "Is the charter fee negotiable?",
        a: "On standard yachts in peak season (July–August), rarely. On shoulder-season dates and on yachts with open calendars, yes — 10–15% discount is common with the right approach. A broker who never tries to negotiate is not advocating for you.",
      },
      {
        q: "What's the difference between weekly charter fee and daily rate?",
        a: "Most luxury charters are quoted weekly because a 7-night charter is the operational standard. Some yachts offer daily rates for 3–5 night charters at a 10–15% premium to weekly/7. Anything under 3 days is a 'day charter' (different product entirely).",
      },
    ],
    relatedTerms: ["apa", "gratuity", "delivery-fee", "greek-vat", "myba-contract"],
    relatedPages: [
      { title: "Complete 2026 Greek charter pricing guide", url: "/greek-yacht-charter-2026-complete-pricing-guide" },
      { title: "Charter cost calculator", url: "/cost-calculator" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Yacht Charter Fee: What's Included and What's Not (2026 Guide)",
    seoDescription:
      "The charter fee is only one of five cost buckets in a yacht charter. Full breakdown of fee, APA, VAT, delivery, and gratuity with Greek-market 2026 numbers.",
    canonical: "https://georgeyachts.com/glossary/charter-fee",
  },

  // ─────────────────────────────────────────────────────────────
  // CHARTER TYPES
  // ─────────────────────────────────────────────────────────────
  {
    slug: "crewed-charter",
    term: "Crewed Charter",
    alsoKnownAs: ["Fully Crewed Charter", "Term Charter", "Full Service Charter"],
    category: "charter-types",
    shortDefinition:
      "A crewed charter is a yacht hire that includes a professional crew — captain, chef, deckhands, stewards — who run the vessel and serve the guests. It is the standard model for luxury Mediterranean chartering.",
    longDefinition:
      "On a crewed charter, the yacht arrives at your embarkation port with a full professional crew aboard. The captain handles navigation, mooring, and the safety of the vessel. The chef plans the menu in advance based on your preference sheet and cooks every meal. Stewardesses serve, manage your cabins, and tend bar. Deckhands operate tenders and water toys, dive lessons, fishing tackle. " +
      "**Crew sizes by yacht length (typical Greek-market 2026):** 24–30m: 3–4 crew; 30–40m: 5–7 crew; 40–50m: 8–10 crew; 50–60m: 11–14 crew; 60m+: 15–25+ crew. Above 50 metres you typically gain a dedicated purser, masseur, dive instructor, and second chef. " +
      "**What a crewed charter is NOT:** it is not a hotel-on-water with rigid service. The crew tailors every day to your preferences. You set the itinerary at the morning briefing (or via preference sheet pre-charter), choose the menu, decide whether to anchor for swimming or push to the next port. The captain advises on weather and routing but the guest principal directs. " +
      "**Crewed vs bareboat:** crewed is the UHNW standard. Bareboat (you skipper, no crew) is a different product targeting experienced sailors on small sailing yachts and catamarans, typically 40–55 feet. A crewed superyacht and a bareboat are not in the same market.",
    whyItMatters:
      "Crewed chartering is what makes a yacht week feel like a luxury hotel without the constraints. UHNW buyers comparing 'yacht charter vs villa' usually find that a crewed yacht — with chef-quality food, full bar, and the ability to move between islands daily — at €150k/week is comparable to a five-star villa at €40k/week once you add catering, drivers, transfers, and staff.",
    examples: [
      {
        title: "Standard 7-night crewed charter, 35m motor yacht",
        body: "Crew of 6 (captain, chef, mate, 2 stewardesses, deckhand). Daily routine: 8am breakfast on demand, morning swim or shore excursion, lunch aboard or ashore, afternoon water-toy session, sunset cocktails, dinner aboard at 8:30pm. Guest principal sets every variable.",
      },
      {
        title: "Premium crewed superyacht, 60m, family charter",
        body: "Crew of 14 including a masseur, certified PADI dive instructor, and a children's-program stewardess. Family of 8 sees customised activities for adults and children running in parallel without compromising either.",
      },
    ],
    faq: [
      {
        q: "Do I tip the crew on a crewed charter?",
        a: "Yes. Crew gratuity of 5–20% of the base charter fee is paid in cash at disembarkation. See our Gratuity glossary entry for the full convention.",
      },
      {
        q: "Can I bring my own chef on a crewed charter?",
        a: "Technically yes, but the yacht's chef will refuse to cook in parallel and the dynamic becomes awkward. If you have a specific dietary need or want your private chef for special meals, brief the yacht's chef well in advance — most accommodate.",
      },
      {
        q: "Does the crew live on the yacht with us?",
        a: "Yes. Crew quarters are separate from guest cabins, usually in the bow or amidships below deck. Guests rarely see the crew off-duty.",
      },
      {
        q: "Can the captain refuse to take us somewhere?",
        a: "Yes — the captain has final authority for safety. If wind, sea state, or guest fitness levels make a passage unsafe, the captain redirects. Force majeure clauses in MYBA address this.",
      },
    ],
    relatedTerms: ["bareboat-charter", "captain", "stewardess", "yacht-chef", "myba-contract"],
    relatedPages: [
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "What is a Crewed Yacht Charter? The Luxury Charter Standard Explained",
    seoDescription:
      "A crewed yacht charter includes professional captain, chef, and stewards. The 2026 luxury standard in the Mediterranean. Full guide with crew sizes by yacht length.",
    canonical: "https://georgeyachts.com/glossary/crewed-charter",
  },

  {
    slug: "bareboat-charter",
    term: "Bareboat Charter",
    alsoKnownAs: ["Bareboat Hire", "Self-Skippered Charter", "No-Crew Charter"],
    category: "charter-types",
    shortDefinition:
      "A bareboat charter is a yacht hire without a professional crew — the charterer or a friend skippers the vessel themselves. It requires recognised sailing certifications and is limited to smaller sailing yachts and catamarans.",
    longDefinition:
      "Bareboat chartering puts the charterer in the captain's chair. You collect the yacht from the base, you navigate, you cook, you anchor every evening. The yacht-management company hands over the keys after a technical briefing and you bring it back at the end of the week. " +
      "**Certifications required in Greece:** at least one person aboard must hold an internationally recognised sailing qualification — typically RYA Day Skipper or above, ASA 104, IYT Bareboat, or equivalent. A second crew member must hold at least Competent Crew or hold a Greek-recognised radio operator's licence. The Greek Coast Guard checks these documents on departure. " +
      "**What yachts are available bareboat:** sailing yachts 30–55 feet, catamarans 38–50 feet, motor yachts under 50 feet (rare in Greece). Above these sizes, bareboat is not offered — the yacht's value and complexity require professional crewing. " +
      "**Bareboat vs crewed cost:** a bareboat 45-foot sailing yacht in the Cyclades in July is around €5,000–€8,000/week. The same yacht crewed would be €15,000–€20,000/week. The cost saving is real, but only if the charterer is genuinely qualified and willing to do the work — bareboat is a vacation that includes labour.",
    whyItMatters:
      "Bareboat is a different product than crewed chartering. UHNW buyers who say 'I want to bareboat' usually want a low-stress crewed week on a smaller yacht — in which case they should book a 50-foot crewed cat with 2 crew at €12k/week, not a bareboat 45-foot at €7k. Asking the right qualifying question is the broker's job.",
    examples: [
      {
        title: "Standard bareboat, 45-foot sailing yacht, Cyclades, 7 nights",
        body: "Charter fee: €6,500. APA: not applicable (you provision yourself). Fuel/marina fees: ~€1,200. Total trip cost: ~€8,000 + your time and effort.",
      },
      {
        title: "Bareboat catamaran, 48 feet, Ionian, 7 nights",
        body: "Charter fee: €7,800. Insurance waiver: €500. Linen/cleaning: €450. Total: ~€8,700 for a yacht that crewed would be €18,000+.",
      },
    ],
    faq: [
      {
        q: "Can I bareboat charter a superyacht?",
        a: "No. Above 50 feet, yachts are exclusively crewed. The skipper certifications required for vessels above this size (Yachtmaster Offshore minimum, often Master 200 commercial) are not held by typical charterers.",
      },
      {
        q: "What licences do I need to bareboat in Greece?",
        a: "At minimum: RYA Day Skipper or equivalent ICC for the skipper, plus VHF radio licence. A crew member with Competent Crew is also normally required.",
      },
      {
        q: "Is bareboat insurance included?",
        a: "Basic hull insurance is included but with a substantial deductible (€2,000–€5,000). Insurance waiver to reduce the deductible is sold separately at €300–€800 per week.",
      },
      {
        q: "Can I hire a skipper for a bareboat yacht?",
        a: "Yes — this is called a 'skippered charter.' You pay a daily skipper fee (~€200–€250/day in Greece) on top of the bareboat fee. Effectively a crewed charter without the chef and stewards.",
      },
    ],
    relatedTerms: ["crewed-charter", "day-charter", "cabin-charter", "sailing-yacht"],
    relatedPages: [
      { title: "Sailing yacht charter Greece", url: "/sailing-yacht-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Bareboat Yacht Charter Greece: Requirements, Costs, and How It Works",
    seoDescription:
      "Bareboat chartering means renting a yacht without crew — you skipper. Requires sailing certifications. Full guide to Greek bareboat market and pricing from George Yachts.",
    canonical: "https://georgeyachts.com/glossary/bareboat-charter",
  },

  {
    slug: "day-charter",
    term: "Day Charter",
    alsoKnownAs: ["Daily Yacht Charter", "Day Hire", "Single-Day Charter"],
    category: "charter-types",
    shortDefinition:
      "A day charter is a yacht hire of 8–12 hours typically embarking and disembarking the same day from the same port. Daily rates run from €2,500 for small motor boats to €25,000+ for luxury yachts.",
    longDefinition:
      "Day chartering is the entry tier of yacht chartering — useful for testing the market, anchoring an event (birthday, proposal, corporate offsite), or supplementing a land-based holiday. Embark at 10am, cruise to a swim spot, lunch aboard or at a beach taverna, return by 7pm. " +
      "**Day charter pricing in Greece, 2026:** small motor boats (8–12 metres): €600–€2,500/day. Mid-size motor yachts (15–24 metres): €3,500–€8,000/day. Luxury motor yachts (24–40 metres): €10,000–€30,000/day. Superyachts (40m+): €25,000–€80,000+/day with significant minimums in peak. " +
      "**What's included on a typical day charter:** crew (captain + 1 deckhand for smaller, 4+ crew for luxury), fuel for a normal day's running (~4 hours), basic food and drink onboard, snorkelling gear, water toys on larger yachts. **What's extra:** premium catering (€80–€200 per guest), additional fuel for longer routes, marina fees if mooring elsewhere. " +
      "**Day-charter limitations vs term charter:** you cannot sleep aboard, the menu is fixed not bespoke, you cannot island-hop in any meaningful way (the yacht must return to base by evening), and the experience is fundamentally a long lunch rather than an immersion.",
    whyItMatters:
      "Day charter is the product UHNW buyers ask for when they don't know they want a 3-day or 5-day charter. A €15,000 day charter, repeated 3 times in a week, costs more than a €38,000 mid-tier crewed 4-night charter with proper bespoke service. A good broker asks 'How many days are you in Greece?' before answering 'How much for a day?'",
    examples: [
      {
        title: "Mid-tier day charter, 22m motor yacht, Athens Riviera",
        body: "Embark 10am Vouliagmeni, anchor at Cape Sounion, lunch served aboard, return by 7pm. Cost: €4,500 + €600 fuel + €700 catering for 8 guests = €5,800.",
      },
      {
        title: "Luxury day charter, 35m motor yacht, Mykonos, July",
        body: "Day rate: €15,000. Catering for 10: €2,400. Fuel: €1,200. Total: €18,600 for 8 hours. Same yacht 7-night charter: €105,000 base — equivalent of 5.6 day charters and dramatically better value.",
      },
    ],
    faq: [
      {
        q: "Can I sleep aboard on a day charter?",
        a: "No. A day charter explicitly excludes overnight accommodation. If you need overnight, you book a 'mini-cruise' or 'short break' charter — typically 2–3 nights minimum.",
      },
      {
        q: "What's the difference between day charter and term charter?",
        a: "Day charter: same-day embarkation and disembarkation. Term charter: minimum 1 night aboard, typically 7 nights, with bespoke service and itinerary.",
      },
      {
        q: "Is a day charter cheaper than a week charter divided by 7?",
        a: "No. A day charter typically costs 1/4 to 1/3 of a weekly rate, not 1/7. The day rate prices in the crew time, fuel inefficiency, and the lost-opportunity cost to the operator.",
      },
      {
        q: "Can I do a day charter on a superyacht?",
        a: "Some superyachts accept day charters, but with very high minimums (€60,000+) and only in off-peak periods. In July–August superyachts are typically locked into 7-night contracts and don't entertain day charters.",
      },
    ],
    relatedTerms: ["crewed-charter", "bareboat-charter", "charter-fee", "tender"],
    relatedPages: [
      { title: "Full fleet", url: "/charter-yacht-greece" },
      { title: "Charter cost calculator", url: "/cost-calculator" },
    ],
    seoTitle: "Day Yacht Charter Greece: Pricing and What's Included (2026)",
    seoDescription:
      "Day yacht charters run 8–12 hours from €2,500 to €80,000+ depending on yacht size. Full guide to day-charter economics from George Yachts.",
    canonical: "https://georgeyachts.com/glossary/day-charter",
  },

  {
    slug: "cabin-charter",
    term: "Cabin Charter",
    alsoKnownAs: ["Per-Cabin Charter", "Cabin Booking", "Shared Charter"],
    category: "charter-types",
    shortDefinition:
      "A cabin charter is a yacht booking where the charterer rents one or more cabins (not the entire yacht), sharing the vessel with other unrelated guests. Common on gulets and a small subset of catamarans.",
    longDefinition:
      "Cabin chartering inverts the standard yacht-charter business model. Instead of one party paying for the whole yacht, multiple unrelated parties each pay for their cabins and share the saloons, sun decks, and dining. It is closer to a cruise ship cabin than a yacht charter in the traditional sense. " +
      "**Where cabin charter operates in Greece:** principally on **gulets** (traditional Turkish-built wooden yachts, 25–35 metres, 6–8 cabins), and on a handful of larger catamarans and small expedition vessels. Almost no luxury motor yacht offers cabin charter — the model conflicts with privacy expectations. " +
      "**Cabin-charter pricing in Greece, 2026:** gulet cabins €700–€2,200 per person per week in peak season, including meals and a fixed group itinerary. The price per cabin is dramatically lower than chartering the whole yacht, but the experience is fundamentally different: you do not control the route, the menu, the music, or who you eat dinner with. " +
      "**Cabin charter vs villa share:** cabin chartering is the yacht-world equivalent of booking a single room in a boutique hotel rather than renting the whole villa. Right for solo travellers, young couples on tight budgets, and anyone whose priority is exposure to a region rather than privacy or curation.",
    whyItMatters:
      "Cabin chartering is not a UHNW product. If a buyer is comparing cabin charter to whole-boat charter, they are not yet in the luxury charter market. The product George Yachts brokers is exclusively whole-yacht (term) chartering. Knowing the difference protects the buyer from booking the wrong product for their expectations.",
    examples: [
      {
        title: "Gulet cabin charter, 8 cabins, Bodrum–Symi–Rhodes, 7 nights",
        body: "Per-person rate: €1,400 including breakfast, lunch, dinner aboard. Whole-boat charter of the same gulet: €11,200 base + extras. Cabin model attracts ~8 unrelated guests.",
      },
    ],
    faq: [
      {
        q: "Can I cabin-charter a superyacht?",
        a: "No. Superyacht owners do not allow cabin chartering — the privacy mismatch is total. Cabin charter is a gulet-and-small-catamaran product.",
      },
      {
        q: "Who sets the itinerary on a cabin charter?",
        a: "The operator sets a fixed published itinerary in advance. As a cabin charterer you choose the dates and route from their published options, not bespoke routing.",
      },
      {
        q: "Will I share meals with strangers?",
        a: "Yes. All meals are served at a common table. If you want private dining, you need whole-yacht (term) charter, not cabin charter.",
      },
      {
        q: "Is cabin charter the cheapest way to experience a luxury yacht?",
        a: "It is the cheapest way to spend nights on a yacht, but it is not a 'luxury yacht experience' — the service, food, and privacy levels are categorically different from term chartering on a comparable yacht.",
      },
    ],
    relatedTerms: ["crewed-charter", "day-charter", "gulet", "charter-fee"],
    relatedPages: [
      { title: "Gulet charter Greece", url: "/gulet-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Cabin Yacht Charter: What It Is, Who It's For, and Pricing (2026)",
    seoDescription:
      "Cabin charter is renting a single cabin on a shared yacht, common on gulets. Full breakdown of pricing, limitations, and when it's the right choice.",
    canonical: "https://georgeyachts.com/glossary/cabin-charter",
  },

  // ─────────────────────────────────────────────────────────────
  // YACHT TYPES
  // ─────────────────────────────────────────────────────────────
  {
    slug: "superyacht",
    term: "Superyacht",
    alsoKnownAs: ["Luxury Yacht", "Mega Yacht"],
    category: "yacht-types",
    shortDefinition:
      "A superyacht is any private yacht of 24 metres (78 feet) or longer. Above 50 metres the term 'megayacht' is sometimes used, and above 80 metres the vessel is regulated as a commercial-passenger ship in many flag states.",
    longDefinition:
      "The 24-metre threshold for 'superyacht' status is not a marketing convention — it is a regulatory line. At 24m and above (gross tonnage typically 200+ GT) a yacht falls under the **Large Yacht Code (LY3)** in MCA-registered jurisdictions, requires a commercial-grade captain, must hold expanded liability insurance, and is subject to safety equipment requirements (life raft capacity, fire suppression, navigation redundancy) that smaller yachts are not. " +
      "**Superyacht size brackets, market vocabulary 2026:** 24–35m — 'small superyacht' or 'compact superyacht'; 35–50m — 'mid-size superyacht'; 50–70m — 'megayacht'; 70–100m — 'large megayacht' or 'gigayacht'; 100m+ — 'gigayacht' exclusively. " +
      "**What distinguishes a superyacht from a yacht in chartering terms:** dedicated crew quarters (so guests never share corridors with crew), full beam master suite, multiple decks, on-board tender garage, swim platform, water-toy storage, often a beach club and spa. Below 24m many of these are compressed or absent. " +
      "**Superyacht charter market, Greece 2026:** ~80 yachts available, weekly base rates €120,000 to €1,800,000+. The largest single-week charter ever brokered in Greece is reputed to be €2.4M for a 95m gigayacht in 2024.",
    whyItMatters:
      "Calling a yacht a 'superyacht' commits to a service standard, a regulatory regime, and a price ceiling. UHNW buyers who say 'superyacht' usually mean 'discreet, private, with full crew' — but the term has technical meaning. Knowing where the line is matters for legal review, insurance disclosure, and matching expectations.",
    examples: [
      {
        title: "Lower-end superyacht: 28m motor yacht",
        body: "Crew of 5, 5 cabins (1 master, 4 doubles), weekly rate €80,000–€140,000 depending on age and refit status. Comfortably hosts 10 guests.",
      },
      {
        title: "Upper-end megayacht: 75m motor yacht",
        body: "Crew of 18, 8 cabins, full beach club + helipad, weekly rate €750,000–€1,200,000. Limited Greek fleet — most yachts at this size base in Monaco/Antibes.",
      },
    ],
    faq: [
      {
        q: "What's the difference between a superyacht and a megayacht?",
        a: "Convention only. 'Superyacht' covers 24m+; 'megayacht' is informally used for 50m+. There is no regulatory definition of 'megayacht' — both are superyachts under maritime law.",
      },
      {
        q: "Is every 24m+ yacht a 'superyacht' for charter purposes?",
        a: "Not necessarily for marketing — older or workmanlike 24m yachts may not present as 'luxury'. But regulatorily, yes, every 24m+ vessel is a superyacht under MCA and equivalent codes.",
      },
      {
        q: "Are superyachts more expensive per metre than smaller yachts?",
        a: "Generally yes. Cost per metre scales superlinearly because crew size, fuel, and complexity scale faster than length. A 60m superyacht does not cost 2x a 30m — it costs 5–8x.",
      },
      {
        q: "How fast can a superyacht charter book in peak season?",
        a: "The top 20 Greek superyachts in July–August are typically committed 12–18 months in advance. Booking by January for the following July is the realistic window. The fleet's deeper tier (40–55m, lower mileage) has more late availability.",
      },
    ],
    relatedTerms: ["megayacht", "motor-yacht", "sailing-yacht", "captain", "myba-contract"],
    relatedPages: [
      { title: "Superyacht charter Greece", url: "/superyacht-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "What is a Superyacht? Definition, Sizes, and Charter Market (2026)",
    seoDescription:
      "A superyacht is any yacht 24m or longer — a regulatory line, not just marketing. Full breakdown of size brackets, costs, and how to charter one in Greece.",
    canonical: "https://georgeyachts.com/glossary/superyacht",
  },

  {
    slug: "megayacht",
    term: "Megayacht",
    alsoKnownAs: ["Gigayacht (100m+)", "Large Superyacht"],
    category: "yacht-types",
    shortDefinition:
      "A megayacht is an informal market term for a superyacht of 50 metres or more. Above 100 metres the term 'gigayacht' applies. Megayachts represent the top 5% of the global charter fleet.",
    longDefinition:
      "'Megayacht' has no regulatory definition — it is a market term that captures the visual and operational distinctiveness of yachts above 50 metres. Above this length a yacht has multiple guest decks, a dedicated beach club, often a helipad, owner's apartment with private terrace, a tender garage that swallows two large tenders plus jet skis and water toys, and crew quarters separated by a deck and a half from guest spaces. " +
      "**Megayacht charter economics 2026:** weekly rates €450,000 to €1,800,000 in the 50–80m range. APA scales to 25–30% (the absolute APA number can hit €450,000+). Crews of 12–25. Charter availability in Greece is shallow — most yachts at this size keep a French Riviera home base and only enter Greek waters for booked charters. " +
      "**Why megayachts cluster in the Mediterranean rather than the Caribbean:** the Mediterranean has shorter port-to-port distances (so the yacht uses less fuel proportionally), better marina infrastructure for vessels above 60m, and the UHNW client base that books these yachts is summered in Europe. The Caribbean megayacht season is shorter and yacht counts thinner. " +
      "**Megayacht service standard:** the differentiator vs a 35m superyacht is not the food (both have a chef-quality kitchen) but the service ratios. A 70m megayacht with 16 crew serving 12 guests means a 1.3:1 staff-to-guest ratio — closer to a five-star hotel than a yacht.",
    whyItMatters:
      "Megayacht is a different market than mid-tier chartering. UHNW buyers comparing a 35m superyacht to a 60m megayacht should know they are comparing two different products — the 60m delivers fundamentally more privacy, more amenity, and more service redundancy, not just 'more boat.'",
    examples: [
      {
        title: "Standard megayacht charter, 60m, 7 nights, peak Greek summer",
        body: "Charter fee: €650,000. APA 30%: €195,000. VAT 12%: €78,000. Gratuity 12%: €78,000. Total fully loaded: €1,001,000.",
      },
      {
        title: "Gigayacht charter, 100m+, 7 nights",
        body: "Charter fee €2,200,000+. Limited Greek fleet — typically chartered through Monaco-based central agents. APA can exceed €600,000.",
      },
    ],
    faq: [
      {
        q: "What's the largest megayacht available for charter in Greece?",
        a: "As of 2026 the largest yachts regularly available in Greek waters are in the 70–95m range. Yachts above 100m can be chartered to Greece on request but typically position from Monaco or Naples on a delivery basis.",
      },
      {
        q: "How many guests can a megayacht host?",
        a: "Under the 12-passenger rule, no charter-licensed yacht hosts more than 12 overnight guests regardless of size. A 70m megayacht with cabins for 16 guests will only sleep 12 on a charter — the extra cabins are for crew overflow or private-use owner family.",
      },
      {
        q: "Are megayachts faster than mid-size superyachts?",
        a: "Generally not. Most megayachts cruise at 12–15 knots, the same speed as a mid-size displacement-hull motor yacht. Speed comes from planing-hull design, which is rare above 50m due to fuel inefficiency at scale.",
      },
      {
        q: "Can I charter a megayacht for less than a week?",
        a: "Some owners accept 4–5 night charters in shoulder seasons. In July–August megayachts are essentially weekly-only. Short charters below 7 nights run at a 25–40% premium per day vs the weekly rate.",
      },
    ],
    relatedTerms: ["superyacht", "twelve-passenger-rule", "captain", "motor-yacht"],
    relatedPages: [
      { title: "Superyacht charter Greece", url: "/superyacht-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Megayacht Charter: What Defines a Megayacht and How to Charter One",
    seoDescription:
      "A megayacht is an informal term for 50m+ superyachts. Weekly rates €450k–€1.8M+. Full breakdown of the megayacht charter market in Greece 2026.",
    canonical: "https://georgeyachts.com/glossary/megayacht",
  },

  {
    slug: "motor-yacht",
    term: "Motor Yacht",
    alsoKnownAs: ["Power Yacht", "M/Y"],
    category: "yacht-types",
    shortDefinition:
      "A motor yacht is a yacht propelled entirely by engines, with no sailing capability. Motor yachts dominate the luxury charter market because they offer more space, higher speed, and better stabilisation than equivalent-length sailing yachts.",
    longDefinition:
      "Motor yachts are the default luxury charter platform. Without a mast taking up centre-of-vessel volume, a motor yacht of any length has roughly 30–40% more usable interior space than a sailing yacht of the same length. Engines (twin diesel typically, increasingly hybrid-diesel-electric on new builds) provide consistent speed regardless of wind, which means itineraries can be planned to the hour. " +
      "**Hull types:** **displacement hulls** (most yachts above 30m) cruise at 12–15 knots, very fuel efficient, exceptional stability — the standard for week-long charters. **Semi-displacement** and **planing hulls** (some yachts in the 24–40m range, common on Sunseekers, Princesses, Pershings) reach 25–35 knots top speed but burn dramatically more fuel and are less stable at anchor. " +
      "**Why most luxury charterers prefer motor yachts to sailing yachts:** speed flexibility (Mykonos to Santorini in 4 hours instead of 12), interior volume, full air-conditioning capacity, stabilisation systems (gyroscopic stabilisers — Seakeeper, Quantum — eliminate roll at anchor), and the absence of the technical complexity of sailing. " +
      "**When sailing yachts win over motor yachts:** smaller groups (under 8 guests), buyers who want the sailing experience itself, slower-paced itineraries, and budget-conscious charters (sailing yachts run 30–40% cheaper for equivalent length).",
    whyItMatters:
      "Motor yacht vs sailing yacht is the first technical choice a buyer makes after setting budget and dates. UHNW first-time charterers default to motor without knowing why — usually correctly. Experienced sailing-cruise buyers know what they want. The buyer who is genuinely undecided should be qualified into motor for groups of 8+ and for any itinerary with fixed shore-side commitments (weddings, restaurants booked at specific times).",
    examples: [
      {
        title: "Mid-tier motor yacht charter, 30m, 7 nights, Cyclades",
        body: "Charter fee: €110,000. 5 cabins, 4 crew. Cruise speed 13 knots, top speed 16 knots. Stabilisers fitted (zero roll at anchor). Total fully loaded: ~€175,000.",
      },
      {
        title: "High-speed motor yacht, 24m planing hull, Athens Riviera",
        body: "Charter fee: €55,000. Top speed 32 knots, range to Hydra in 90 minutes. Burns 200 litres/hour at cruise — higher APA proportionally. Right for buyers who want Athens Riviera + Saronic in 4 nights.",
      },
    ],
    faq: [
      {
        q: "Are motor yachts louder than sailing yachts?",
        a: "Under engine power yes — but most luxury motor yachts have excellent insulation. Onboard noise levels at 13 knots are typically 55–60 dBA in the saloon, equivalent to a quiet office. At anchor (engines off, generator running) you hear nothing.",
      },
      {
        q: "Do motor yachts go everywhere sailing yachts go?",
        a: "Mostly yes, and faster. Some shallow anchorages (Donousa, parts of Antiparos) suit sailing yachts with shallower draft. Most published charter anchorages accommodate both.",
      },
      {
        q: "Are motor yachts more expensive than sailing yachts to charter?",
        a: "Yes — typically 30–40% more for the same length. The premium covers higher build cost, larger crew (often), and more onboard amenity.",
      },
      {
        q: "What's the most fuel-efficient motor yacht for chartering?",
        a: "Displacement-hull yachts of 30–45m running at 11–13 knots are the efficiency sweet spot. Planing-hull yachts can burn 3–4x the fuel for marginal speed gain, which is why most luxury charterers prefer displacement.",
      },
    ],
    relatedTerms: ["sailing-yacht", "catamaran-charter", "superyacht", "displacement-hull", "flybridge"],
    relatedPages: [
      { title: "Motor yacht charter Greece", url: "/motor-yacht-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Motor Yacht Charter Greece: Why It's the Luxury Default (2026 Guide)",
    seoDescription:
      "Motor yachts dominate luxury chartering — more space, more speed, full stabilisation. Full guide to motor yacht charter options in Greek waters.",
    canonical: "https://georgeyachts.com/glossary/motor-yacht",
  },

  {
    slug: "sailing-yacht",
    term: "Sailing Yacht",
    alsoKnownAs: ["S/Y", "Sailboat", "Sailing Vessel"],
    category: "yacht-types",
    shortDefinition:
      "A sailing yacht is a yacht equipped with masts and sails as its primary propulsion. Modern luxury sailing yachts also have auxiliary engines and full hotel-grade amenity. They charter at 30–40% lower rates than equivalent-length motor yachts.",
    longDefinition:
      "Modern luxury sailing yachts are not the spartan sailboats of decades past. A 45m sailing yacht charters with a full air-conditioned interior, owner's suite with private terrace, professional chef galley, and the same stabilisation and entertainment systems as a comparable motor yacht. The mast and sail plan add an aesthetic and an experience — the option to cross the Aegean under canvas at 9 knots with the engines off — that no motor yacht can replicate. " +
      "**Sailing-yacht categories:** **performance sailing yachts** (Wally, Baltic, Hoek) emphasise speed and sailing purity, often with smaller guest accommodation relative to length. **Cruising sailing yachts** (Oyster, Swan, Royal Huisman cruisers) prioritise comfort and amenity, accept lower performance. **Sailing catamarans** are technically sailing yachts but treated as a separate category. " +
      "**Sailing-yacht charter economics:** weekly rates from €25,000 (28m) to €450,000+ (60m+ performance sailing yacht). APA typically 25% — sailing reduces fuel consumption significantly. Crew sizes similar to motor yachts of the same length. " +
      "**Why sailing yachts are a different product:** the experience is the sailing. A weekend at anchor on a sailing yacht with the boom hoisted and the boat heeling 10 degrees under canvas is a sensory experience absent from motor yachts. Buyers who specifically want this experience will pay the time penalty (slower passages) for the trade.",
    whyItMatters:
      "Sailing yacht vs motor yacht is partly about money (sailing is cheaper) and partly about temperament. Buyers who want the sailing experience know it. Buyers who don't know they want it should be steered toward motor yachts — a forced sailing experience without preference leaves charterers grumbling about slow passages.",
    examples: [
      {
        title: "Cruising sailing yacht, 30m, 7 nights, Ionian",
        body: "Charter fee: €58,000. 4 crew, 4 cabins. Average passages 30–40nm/day at 7–8 knots under canvas. Total fully loaded: ~€90,000 — 40% cheaper than equivalent motor yacht.",
      },
      {
        title: "Performance sailing yacht, 50m, 7 nights, Cyclades",
        body: "Charter fee: €260,000. 9 crew, 5 cabins. Cruise speed under sail 12–15 knots, can pass cruising motor yachts. Premium-segment sailing yachting.",
      },
    ],
    faq: [
      {
        q: "Do I need to know how to sail to charter a sailing yacht?",
        a: "On a crewed sailing yacht, no. The professional crew handles every aspect of sailing — you can be entirely a passenger. If you want to take the helm, the captain will teach you in a few hours.",
      },
      {
        q: "Are sailing yachts safer or less safe than motor yachts?",
        a: "Equally safe under professional crewing. Sailing yachts handle heavy weather differently (more comfortable in big seas with sails balancing the boat) but both vessel types meet the same MCA safety standards above 24m.",
      },
      {
        q: "Can a sailing yacht do an island-hopping itinerary like a motor yacht?",
        a: "Yes, with slightly longer passages. Mykonos–Santorini in a motor yacht: 4 hours. Same passage in a sailing yacht at 8 knots: 9 hours. Itineraries need to compress 1–2 stops or extend the charter to give the sailing yacht equivalent coverage.",
      },
      {
        q: "What about catamarans — are they sailing yachts?",
        a: "Sailing catamarans yes — they're a sub-category. Power catamarans (engine-only) are motor yachts. The catamaran-vs-monohull distinction is separate from sailing-vs-motor.",
      },
    ],
    relatedTerms: ["motor-yacht", "catamaran-charter", "superyacht", "captain"],
    relatedPages: [
      { title: "Sailing yacht charter Greece", url: "/sailing-yacht-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Sailing Yacht Charter Greece: When to Choose Sail Over Power (2026)",
    seoDescription:
      "Sailing yachts charter at 30–40% lower rates than equivalent motor yachts and offer the sailing experience itself. Full guide to luxury sailing yacht chartering in Greece.",
    canonical: "https://georgeyachts.com/glossary/sailing-yacht",
  },

  {
    slug: "catamaran-charter",
    term: "Catamaran",
    alsoKnownAs: ["Cat", "Multihull", "Power Catamaran", "Sailing Catamaran"],
    category: "yacht-types",
    shortDefinition:
      "A catamaran is a twin-hulled yacht offering exceptional stability, shallow draft, and large deck areas. Modern luxury catamarans (sailing or power) are popular with families and groups who want minimal roll and access to shallow anchorages.",
    longDefinition:
      "Catamarans solve three problems that monohull yachts have: roll, draft, and deck space. With two hulls separated by 8–12 metres of bridge deck, a catamaran rolls almost imperceptibly at anchor or under sail, sits in 1.5m of water (vs 2.5–3m for a monohull of equivalent length), and offers a saloon and aft deck the width of the entire vessel — typically 50% more usable horizontal space than a monohull of the same length. " +
      "**Two sub-categories:** **sailing catamarans** (Lagoon, Sunreef, Privilege) — twin masts not standard, single tall mast with the rig spanning the bridge deck. Cruise at 8–11 knots under sail. **Power catamarans** (Sunreef Power, Aquila, Silent Yachts) — twin diesel or electric powered, no mast. Cruise at 10–18 knots. " +
      "**Why families pick catamarans:** the stability eliminates seasickness in lower-tolerance guests. The shallow draft opens anchorages (Donousa, parts of Lipsi, Skiathos shallows) that monohulls cannot enter. The deck space accommodates large groups socially without crowding. " +
      "**Why luxury solo couples often prefer monohulls:** a catamaran has a different aesthetic. The wide beam makes the yacht look more like a modern beach villa than a classic yacht. Buyers who care about the traditional silhouette tend to choose monohulls.",
    whyItMatters:
      "Catamaran is the answer for groups of 8–12 where seasickness is a concern (children, parents) and where the itinerary prioritises swimming and anchoring over passage-making. Knowing when to recommend a catamaran vs a monohull is one of the most predictive broker-client fit signals.",
    examples: [
      {
        title: "Sailing catamaran, 22m, 7 nights, Cyclades family charter",
        body: "Charter fee: €38,000. 4 cabins, 3 crew. Almost zero roll — kids sleep through anchor moves. Total fully loaded: ~€62,000.",
      },
      {
        title: "Luxury power catamaran, 28m Sunreef, 7 nights, Saronic",
        body: "Charter fee: €95,000. 5 cabins, 5 crew. 16-knot cruise. Sits in 1.3m draft — accesses anchorages around Spetses that monohulls cannot. Total fully loaded: ~€150,000.",
      },
    ],
    faq: [
      {
        q: "Are catamarans more expensive than monohulls?",
        a: "Roughly equivalent. New-build catamarans cost slightly more per metre, but charter rates land in the same range as comparable monohulls for the same length.",
      },
      {
        q: "Do catamarans handle heavy weather?",
        a: "Modern luxury catamarans handle Force 6 perfectly well. They're stable but slower to recover from very large breaking seas — meaning storm tactics are different from monohulls. Professional crews know the differences.",
      },
      {
        q: "Can a catamaran go everywhere a monohull goes?",
        a: "Plus a few places monohulls cannot (shallow anchorages). The only limitation is marina pricing — some marinas charge catamarans 1.5x monohull rates because they occupy a wider berth.",
      },
      {
        q: "Sailing or power catamaran — which to choose?",
        a: "Sailing catamarans for buyers who want the sailing experience and lower running cost. Power catamarans for buyers who prioritise speed, deck space, and zero noise (electric power cats run silent at anchor).",
      },
    ],
    relatedTerms: ["sailing-yacht", "motor-yacht", "draft", "superyacht"],
    relatedPages: [
      { title: "Catamaran charter Greece", url: "/catamaran-charter-greece" },
      { title: "Power catamaran charter Greece", url: "/power-catamaran-charter-greece" },
    ],
    seoTitle: "Catamaran Yacht Charter Greece: Why Families Choose Cats (2026)",
    seoDescription:
      "Catamarans offer maximum stability, shallow draft, and huge deck space. Ideal for families and groups. Full guide to sailing and power catamaran charter in Greek waters.",
    canonical: "https://georgeyachts.com/glossary/catamaran-charter",
  },

  {
    slug: "gulet",
    term: "Gulet",
    alsoKnownAs: ["Turkish Gulet", "Traditional Gulet", "Wooden Yacht"],
    category: "yacht-types",
    shortDefinition:
      "A gulet is a traditional wooden-hulled yacht originating from the Bodrum and Marmaris regions of Turkey. Gulets range 20–45 metres, are typically two-masted, and offer a romantic, slow-paced charter experience at moderate prices.",
    longDefinition:
      "Gulets are the Mediterranean equivalent of a Caribbean schooner — a traditional working-vessel design (originally sponge-diving boats) rebuilt over the last 40 years as luxury charter yachts. A gulet's hull is solid wood (mahogany, teak, larch), the deck space is generous, the interior is typically wood-panelled cabins with en-suite bathrooms, and the deck features include large dining tables on the aft deck and sun cushions on the foredeck. " +
      "**Gulet sizes and pricing, Greece 2026:** small gulets (20–24m, 6–8 guests): €15,000–€25,000/week. Mid-size (25–32m, 8–12 guests): €25,000–€55,000/week. Large luxury gulets (33–45m, 10–16 guests, but capped at 12 charter guests): €45,000–€140,000/week. " +
      "**Where gulets sail:** historically Turkish waters (Bodrum–Marmaris–Antalya), increasingly the Greek Dodecanese (Symi, Rhodes, Kos, Patmos) and Sporades. Greek gulets are typically Greek-flagged and Greek-crewed, distinguishing them from Turkish gulets in flag, regulation, and cruising area. " +
      "**The gulet aesthetic:** slower than sailing yachts (cruise speed 6–8 knots under engine, sails are largely decorative on most gulets), wider beam than monohulls, lower freeboard. The experience is closer to a floating beach villa than a yacht-charter experience.",
    whyItMatters:
      "Gulets occupy a specific market position: more space and lower cost than monohull sailing yachts, more authentic-Mediterranean character than modern motor yachts, but slower and with less modern amenity. Right for buyers who prioritise atmosphere and budget over speed and contemporary luxury.",
    examples: [
      {
        title: "Mid-size luxury gulet, 32m, 7 nights, Dodecanese",
        body: "Charter fee: €42,000. 6 cabins, 5 crew. Cruise speed 7 knots — itinerary covers Rhodes, Symi, Kos at slower pace. Total fully loaded: ~€68,000.",
      },
      {
        title: "Large luxury gulet, 42m, 7 nights, with full amenities",
        body: "Charter fee: €98,000. 8 cabins, 7 crew, jacuzzi on aft deck, water toys, AC throughout. Total fully loaded: ~€155,000.",
      },
    ],
    faq: [
      {
        q: "Are gulets sailing yachts?",
        a: "Technically yes — most gulets have masts and sails. In practice the sails are seldom used at full power; gulets cruise primarily under engine. The sailing is more aesthetic than functional on most modern gulets.",
      },
      {
        q: "Are Greek gulets better than Turkish gulets?",
        a: "Different markets. Greek gulets are Greek-flagged, must comply with Greek MCA-equivalent regulations, and offer Greek itineraries. Turkish gulets often offer lower prices but cannot pick up or drop off in Greek ports without complex flag-state paperwork.",
      },
      {
        q: "Can a gulet do a 5-day charter?",
        a: "Yes, gulets are flexible on duration. 5-night charters run at a slight per-night premium to 7-night, typically 10–15% more per day.",
      },
      {
        q: "Is a gulet more comfortable than a sailing yacht?",
        a: "More social space yes — gulet decks are vast. Cabin comfort is comparable. Sailing performance is significantly lower — if you want the sailing experience, choose a sailing yacht, not a gulet.",
      },
    ],
    relatedTerms: ["sailing-yacht", "cabin-charter", "captain", "charter-fee"],
    relatedPages: [
      { title: "Gulet charter Greece", url: "/gulet-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Gulet Charter Greece: Traditional Yacht Charters in the Aegean (2026)",
    seoDescription:
      "Gulets are traditional wooden yachts offering spacious decks, moderate prices, and authentic Mediterranean atmosphere. Full guide from George Yachts.",
    canonical: "https://georgeyachts.com/glossary/gulet",
  },

  {
    slug: "trawler-yacht",
    term: "Trawler Yacht",
    alsoKnownAs: ["Long-Range Cruiser", "Expedition Yacht"],
    category: "yacht-types",
    shortDefinition:
      "A trawler yacht is a displacement-hull motor yacht designed for long-range, fuel-efficient cruising. They cruise at 10–12 knots, carry large fuel reserves, and prioritise range and seakeeping over speed.",
    longDefinition:
      "Trawler yachts evolved from commercial fishing-trawler design — a deep displacement hull, large fuel tanks (often 8,000–20,000 litres), and engines tuned for economy rather than peak speed. The result is a yacht that can cross the Mediterranean non-stop, weather heavy seas comfortably, and burn 30–50% less fuel per nautical mile than a comparable planing-hull motor yacht. " +
      "**Trawler-yacht market in Greece 2026:** a small but growing segment. Brands: Nordhavn, Marlow, Selene, Outer Reef. Yachts typically 18–30m, weekly charter rates €30,000–€95,000 — lower than equivalent-length performance motor yachts because the build cost is lower and the running cost on the operator is dramatically lower. " +
      "**Why trawler yachts are gaining popularity:** rising fuel costs (Greek diesel hit €1.70/litre in 2025), longer charter itineraries (UHNW buyers wanting 14-day Greece-to-Turkey-to-Croatia tours need range), and the environmental optics (lower fuel burn = lower carbon visible footprint). " +
      "**Trawler vs standard motor yacht:** trawlers sacrifice speed (12 knots vs 16–20 knots) for range and economy. On a 7-night Greek itinerary the speed deficit costs you 1–2 hours per passage day, usually irrelevant. On a 14-night two-country itinerary the range advantage matters significantly.",
    whyItMatters:
      "Trawler yachts are an under-marketed segment. Buyers who care about fuel-efficiency optics, long-range comfort, or who genuinely cruise rather than island-hop have an entire yacht category that brokers rarely lead with. Knowing they exist opens better options for specific buyer profiles.",
    examples: [
      {
        title: "Nordhavn 60 charter, 7 nights, Cyclades + Dodecanese",
        body: "Charter fee: €52,000. APA at 22% (low-consumption profile): €11,440. 4 cabins, 4 crew, 18,000-litre tank means no refuelling needed on the entire 7-night trip.",
      },
    ],
    faq: [
      {
        q: "Are trawler yachts slower than other motor yachts?",
        a: "Yes — typically 10–12 knots cruise vs 14–18 for planing or semi-displacement motor yachts. On Greek charter distances this difference is rarely material.",
      },
      {
        q: "Are trawler yachts more comfortable in heavy weather?",
        a: "Yes. Deep displacement hulls and lower beam-to-length ratios make trawler yachts notably more comfortable in Force 5–6 conditions than equivalent planing-hull yachts.",
      },
      {
        q: "Why are trawler yachts cheaper to charter?",
        a: "Lower build cost per metre (less complex engineering than high-performance planing hulls), lower fuel consumption (lower APA), and smaller crew requirements. The savings pass through to charter rates.",
      },
    ],
    relatedTerms: ["motor-yacht", "displacement-hull", "apa", "captain"],
    relatedPages: [
      { title: "Motor yacht charter Greece", url: "/motor-yacht-charter-greece" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Trawler Yacht Charter: Long-Range, Fuel-Efficient Luxury (2026 Guide)",
    seoDescription:
      "Trawler yachts cruise at 10–12 knots with massive fuel range and lower APA. The fuel-efficient alternative to planing motor yachts.",
    canonical: "https://georgeyachts.com/glossary/trawler-yacht",
  },

  // ─────────────────────────────────────────────────────────────
  // OPERATIONS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "twelve-passenger-rule",
    term: "12-Passenger Rule",
    alsoKnownAs: ["12-Pax Rule", "SOLAS 12 Rule", "Charter Passenger Limit"],
    category: "operations",
    shortDefinition:
      "The 12-passenger rule limits any commercially chartered yacht to a maximum of 12 paying guests aboard at any time, regardless of the yacht's size. The rule is set by the SOLAS Convention and enforced globally by flag states and port authorities.",
    longDefinition:
      "The Safety of Life at Sea (SOLAS) Convention — the foundational maritime safety treaty — classifies any vessel carrying more than 12 paying passengers as a 'passenger ship' subject to dramatically stricter regulation: structural fire protection equivalent to cruise ships, lifeboat capacity for every soul aboard with required davit launching, additional crew certifications, and commercial-passenger insurance regimes. " +
      "Yacht charters worldwide stop at 12 passengers because crossing that line transforms the yacht into a different regulatory category. A 70-metre superyacht with cabins for 18 guests will charter with a maximum of 12 guests aboard — the additional cabins are either kept empty, used for crew overflow, or available only on private (non-charter) use by the owner. " +
      "**Operational consequences for chartering:** if you have 14 guests in your party, you have two options. (1) Charter two yachts simultaneously for a 'flotilla' itinerary — common for weddings and milestone events. (2) Add 'day guests' for selected occasions: people who join the yacht for a daytime event (lunch, sundowner) but disembark by midnight. The 12-pax rule applies to overnight passengers, not to day visitors. " +
      "**Why the rule matters for itinerary design:** a 12-guest superyacht charter must have everyone aboard from embarkation through disembarkation. Adding or swapping guests mid-charter (a relative joining for two nights) requires they count against the 12 cap whenever aboard. This is a real operational constraint that needs design in advance.",
    whyItMatters:
      "The 12-passenger rule is the single hardest constraint in luxury chartering — it cannot be negotiated, paid around, or worked around. Buyers planning charters for groups of 13+ should hear about the rule in their first conversation with a broker. Discovering it after signing a contract is a brand-damaging surprise.",
    examples: [
      {
        title: "Multi-yacht flotilla, group of 18",
        body: "Two yachts chartered simultaneously: a 35m motor yacht (10 guests) and a 28m sailing yacht (8 guests). Itinerary synchronised so groups dine together on alternating yachts. Cost ~€280,000 base for the pair.",
      },
      {
        title: "Day-guest addition for a birthday at anchor",
        body: "12 overnight guests aboard a 40m motor yacht. For the birthday dinner at anchor in Schinoussa, 8 additional day guests arrive by tender from a shore-side villa, dine aboard, return to the villa for the night. Fully compliant with the 12-pax rule.",
      },
    ],
    faq: [
      {
        q: "Can I get an exemption from the 12-passenger rule?",
        a: "No. The rule is a flag-state and IMO regulation, not a yacht-operator policy. It applies universally to commercial yacht charter worldwide.",
      },
      {
        q: "Does the 12-passenger rule include children?",
        a: "Yes. Every soul aboard counts as a passenger regardless of age. A family of 4 adults + 4 children + 4 grandparents = 12, at capacity.",
      },
      {
        q: "Does the rule apply to private (non-charter) use?",
        a: "No — private use of an owner's yacht is not subject to the 12-pax limit. The owner can host as many guests as the yacht's safety equipment supports. The 12-pax rule only applies when the yacht is being commercially chartered.",
      },
      {
        q: "How does the rule work on a day charter?",
        a: "The 12-passenger rule applies equally to day charters. Yachts offering day-charter formats may also be limited by local port regulations to fewer than 12 in some jurisdictions.",
      },
      {
        q: "Can I charter a yacht for 14 if I 'rotate' guests through?",
        a: "No. The rule is about peak number aboard at any moment, not total exposure across the week. Two guests stepping ashore so two others can board still means 12 cap held at any time. Pre-plan this carefully.",
      },
    ],
    relatedTerms: ["crewed-charter", "captain", "myba-contract", "embarkation"],
    relatedPages: [
      { title: "Greek yacht charter for large groups (10+ guests) 2026", url: "/greek-yacht-charter-large-groups-10-plus-guests-2026" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "The 12-Passenger Rule in Yacht Charter Explained (SOLAS & Charter Limits)",
    seoDescription:
      "Every commercially chartered yacht caps at 12 overnight guests under SOLAS rules. Full explanation, multi-yacht solutions, and day-guest mechanics.",
    canonical: "https://georgeyachts.com/glossary/twelve-passenger-rule",
  },

  {
    slug: "embarkation",
    term: "Embarkation",
    alsoKnownAs: ["Boarding", "Boarding Day", "Charter Start"],
    category: "operations",
    shortDefinition:
      "Embarkation is the formal start of a yacht charter — the moment guests board the yacht at the agreed port. Standard MYBA embarkation time is 5pm on Day 1 of the charter, with disembarkation by 9am on the final day.",
    longDefinition:
      "Embarkation in luxury chartering has a specific ceremonial structure. The captain meets you at the gangway, the crew is mustered in service uniform on deck, your luggage is taken to your cabins. You are given a glass of champagne in the saloon. The captain provides a 15-minute safety briefing — emergency exits, lifejackets, fire procedures, man-overboard signals — then a quick tour of the yacht. By 7pm you are settled with a first dinner aboard. " +
      "**Standard MYBA timing:** embarkation 5pm Day 1, disembarkation 9am final day. This gives the crew time to prepare the yacht in the morning of embarkation and time to clean and restock after disembarkation. Earlier embarkation (e.g. 11am) or later disembarkation (e.g. 5pm) are negotiable additions at the broker level. " +
      "**Embarkation logistics:** the port and time are set in the MYBA contract 30+ days before. Last-minute changes (e.g. moving from Athens to Mykonos a week before embarkation) are possible but trigger delivery fees and require captain consent. A reputable broker confirms the embarkation port in writing 14 days before. " +
      "**What happens before embarkation:** the captain receives the guest preference sheet 14 days out (dietary needs, sleep preferences, music, alcohol, allergies). The chef provisions accordingly. The yacht is fuelled, watered, cleaned, and prepared. By the morning of embarkation the yacht is in the embarkation port and ready.",
    whyItMatters:
      "Embarkation is the moment of first impression — yacht, crew, brand. Late embarkation, missed delivery, or a yacht that arrives unprepared signals operator-level incompetence and colours the rest of the week. Charterers should expect — and broker should guarantee — embarkation precision.",
    examples: [
      {
        title: "Standard embarkation, Mykonos Old Port",
        body: "5pm: guests arrive at the marina by car. Captain greets at gangway. Crew in service whites on deck. Luggage to cabins by deckhand. Champagne in saloon. Safety briefing 15 min. By 6:30pm dinner reservation on Delos confirmed by stewardess.",
      },
      {
        title: "Early embarkation request, paid premium",
        body: "Guest requests 11am embarkation for an in-port lunch aboard before departure. Crew prepares yacht earlier, operator charges €1,500 premium for the extra crew time. Embarkation completed by 10:30am.",
      },
    ],
    faq: [
      {
        q: "Can I embark earlier than 5pm?",
        a: "Often yes, on request 7+ days before charter. Operators charge a small premium (€500–€2,000) for the crew time. Same-day-of-charter early embarkation is rarely possible.",
      },
      {
        q: "What if my flight is late on embarkation day?",
        a: "The yacht waits. The captain will not depart without all guests aboard. Late arrivals occasionally push first-night dinner from aboard to a restaurant ashore.",
      },
      {
        q: "Where do I leave my luggage on embarkation day?",
        a: "Crew receive luggage at the gangway and place in your cabin. Hard-shell suitcases stay in cabin storage. Liquids/valuables you hand-carry.",
      },
      {
        q: "Can I embark at a different port than the contract specifies?",
        a: "Yes, with 14+ days notice and likely a delivery fee. Last-minute port changes are difficult — the yacht's pre-charter positioning is planned weeks in advance.",
      },
    ],
    relatedTerms: ["delivery-fee", "captain", "myba-contract", "charter-fee"],
    relatedPages: [
      { title: "Charter timeline", url: "/charter-timeline" },
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
    ],
    seoTitle: "Yacht Charter Embarkation: What Happens on Boarding Day",
    seoDescription:
      "Embarkation is 5pm Day 1 of your charter. Full breakdown of MYBA embarkation timing, ceremony, and what to expect on your first hours aboard.",
    canonical: "https://georgeyachts.com/glossary/embarkation",
  },

  {
    slug: "provisioning",
    term: "Provisioning",
    alsoKnownAs: ["Yacht Provisioning", "Pre-Charter Provisioning"],
    category: "operations",
    shortDefinition:
      "Provisioning is the pre-charter stocking of the yacht with food, drink, and consumables according to the guest's preference sheet. It is paid from APA, organised by the captain and chef, and arranged 48–72 hours before embarkation.",
    longDefinition:
      "A 7-night charter for 10 guests can require €15,000–€30,000 of provisioning — fine wines, premium spirits, fresh produce daily, specialty ingredients flown in, dietary-restriction proteins, infant formula, premium teas. The provisioning happens before embarkation: the chef walks the markets in Athens or Mykonos, sources from specialist butchers and fishmongers, fills the yacht's deep-freezer and dry stores. " +
      "**The provisioning workflow:** guest submits a preference sheet 14 days before charter listing dietary needs, allergies, alcohol preferences (specific Champagne houses, whisky brands, wine styles), favourite ingredients, no-go foods, and special celebration items (a particular cake for a birthday). Chef builds a per-meal plan and a shopping list. Captain orders consumables and signs off on the budget. Provisioning happens 48–72 hours before embarkation so produce is fresh. " +
      "**Provisioning quality benchmarks:** at the UHNW level, provisioning includes vintage Champagne (Krug, Dom Pérignon, Cristal), single-vineyard Burgundy, premium spirits (Macallan 25+, Patrón, Casa Dragones), fresh truffles in season, A5 Wagyu, hand-dived scallops, organic produce. **The chef's quality is judged on provisioning before any meal is cooked** — a chef who skimps on ingredients cannot recover with technique. " +
      "**Compliance and customs:** Greek customs allow yacht provisioning duty-free under certain conditions, particularly for yachts under foreign flags. This can save 12% VAT on alcohol provisioning specifically. Captains handle the paperwork; charterers benefit invisibly.",
    whyItMatters:
      "Provisioning is where a charter's food quality is determined — long before any pan hits the stove. UHNW buyers who care about food and wine should hand the chef a detailed preference sheet 21 days before charter, not 7. The extra time lets the chef source the rarities and the best produce.",
    examples: [
      {
        title: "Standard 7-night provisioning, 8 guests, 30m motor yacht",
        body: "Wine: €4,200 (15 bottles each Champagne, Burgundy, Bordeaux, white). Spirits: €1,800. Food: €6,500 (mix of pre-loaded staples and daily fresh sourcing). Other consumables: €800. Total provisioning from APA: €13,300.",
      },
      {
        title: "UHNW provisioning, 7 nights, 10 guests, 50m superyacht",
        body: "Wine including vintage Champagne (Salon 2002, Dom Pérignon P2): €18,000. Spirits including Macallan 30: €4,800. Food: €15,500 (including A5 Wagyu, white truffle from Alba). Total: €38,300.",
      },
    ],
    faq: [
      {
        q: "Who pays for provisioning?",
        a: "The charterer, through the APA. The captain spends APA on provisioning before the charter and reconciles every receipt at disembarkation.",
      },
      {
        q: "Can I bring my own wine on a charter?",
        a: "Yes — and many UHNW charterers do. There is no corkage fee. The crew will store and serve your wine as part of the yacht's service. Bring a list to the chef in advance so the menu pairs.",
      },
      {
        q: "What happens to unused provisioning?",
        a: "Captain reconciles. Unopened alcohol can be returned to suppliers for credit (deducted from your APA reconciliation). Perishable food consumed during the charter or kept by crew with your permission.",
      },
      {
        q: "Are provisioning prices marked up by the yacht?",
        a: "No. Honest captains pass through supplier invoices at cost. Mark-up on provisioning is unethical and ground for non-payment of APA. Reputable brokers vet captains who comply with this norm.",
      },
    ],
    relatedTerms: ["apa", "yacht-chef", "captain", "greek-vat"],
    relatedPages: [
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
      { title: "Charter timeline", url: "/charter-timeline" },
    ],
    seoTitle: "Yacht Charter Provisioning: How Food and Drink Are Stocked Aboard",
    seoDescription:
      "Provisioning stocks the yacht with food, wine, and consumables before charter. Full breakdown of preference sheets, budgets, and quality benchmarks at UHNW level.",
    canonical: "https://georgeyachts.com/glossary/provisioning",
  },

  {
    slug: "tender",
    term: "Tender",
    alsoKnownAs: ["Yacht Tender", "Chase Boat", "Dinghy"],
    category: "operations",
    shortDefinition:
      "A tender is a small boat carried aboard a yacht for transferring guests between the yacht and shore, water-sports use, and exploration of shallow anchorages. Luxury yachts carry 1–4 tenders ranging 4–14 metres.",
    longDefinition:
      "When a yacht anchors offshore (most beautiful anchorages in Greece are too shallow or unprotected for direct yacht docking), the tender is your shore connection. Crew run the tender between yacht and beach restaurants, town piers, or villa transfers — typically 5–15 minute hops. Larger yachts carry multiple tenders: a fast 'limousine tender' (8–12m, enclosed cabin) for VIP transfers, a chase boat (10–14m, open) for water sports, and a small RIB (4–6m) for utility runs. " +
      "**Tender capabilities and typical sizes:** small yacht (24–30m) carries one 4–6m RIB tender; mid-yacht (30–45m) carries one 8–10m tender + one 4–5m RIB; superyacht (45m+) carries 2–4 tenders including a limousine tender of 10–14m. Top-end megayachts have full tender garages with submarine-style launch doors. " +
      "**Tender pricing implications:** larger tenders mean longer-range shore visits (e.g. visit Despotiko from a yacht anchored at Antiparos — 30-minute tender ride each way) and faster runs that don't blow guests around. Smaller tenders limit shore options to within 1nm of anchor. " +
      "**Tender operator:** always a deckhand or captain — never the charterer. UHNW charterers can drive their own jetski or wakeboard boat with the operator alongside, but the primary guest-transfer tender is crew-driven. Insurance and competence considerations are absolute.",
    whyItMatters:
      "The tender is the difference between an anchorage that feels remote and one that feels accessible. Buyers planning many shore-side dinners or beach club visits should ask about tender size and capability — a 4m RIB makes for choppier transfers than an 8m enclosed limousine tender. On a romance-or-impression charter this matters.",
    examples: [
      {
        title: "Standard tender, 6m RIB, mid-tier 30m motor yacht",
        body: "Capacity: 6 passengers, top speed 35 knots, range 30nm. Suitable for short hops yacht-to-shore at protected anchorages. Open boat — wear sunglasses, expect spray.",
      },
      {
        title: "Limousine tender, 12m, 55m superyacht",
        body: "Capacity: 12 passengers, enclosed cabin with leather seating and AC, top speed 40 knots. The tender is itself a yacht-grade experience. Guests step from a luxury saloon into a luxury launch.",
      },
    ],
    faq: [
      {
        q: "Can I drive the tender myself?",
        a: "Generally no for the primary guest-transfer tender — crew operates. Smaller utility RIBs and toys (jetskis) can be guest-operated under crew supervision.",
      },
      {
        q: "Does using the tender cost extra?",
        a: "Tender use is included in the charter fee. Fuel for tender runs is drawn from APA, but the costs are minimal (€20–€50 per typical shore run).",
      },
      {
        q: "What's a 'chase boat'?",
        a: "A chase boat is a larger, faster tender (10–14m) used for water sports — towing wakeboards, water skiers, paragliders. Mid-and-top tier superyachts carry a chase boat in addition to the standard guest tender.",
      },
      {
        q: "How long are typical tender rides?",
        a: "Most yacht-to-shore transfers in Greek anchorages are 3–10 minutes. Longer rides to specific destinations (e.g. an island visit) can be 20–40 minutes — comfortable in a larger limousine tender, less so in a small RIB.",
      },
    ],
    relatedTerms: ["water-toys", "captain", "embarkation", "motor-yacht"],
    relatedPages: [
      { title: "Full fleet", url: "/charter-yacht-greece" },
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
    ],
    seoTitle: "What is a Yacht Tender? Sizes, Uses, and Why It Matters (2026)",
    seoDescription:
      "Tenders are small boats carried by yachts for shore transfers and water sports. Full breakdown of sizes, capabilities, and how to compare yachts on tender quality.",
    canonical: "https://georgeyachts.com/glossary/tender",
  },

  {
    slug: "water-toys",
    term: "Water Toys",
    alsoKnownAs: ["Toys", "Yacht Toys", "Water Sports Equipment"],
    category: "operations",
    shortDefinition:
      "Water toys are the on-board recreational equipment carried on a charter yacht: jet skis, paddleboards, kayaks, towables, e-foils, inflatable slides, and snorkelling gear. The toy inventory varies dramatically by yacht.",
    longDefinition:
      "On a luxury charter the water-toy inventory is one of the under-marketed differentiators. A typical 30m motor yacht carries the basics: 2 stand-up paddleboards, 2 kayaks, snorkel masks for all guests, a few towables, sometimes 1 jet ski. A 50m superyacht stocks 2–3 jet skis, 1–2 e-foils (€15k+ each — electric hydrofoil surfboards, the trending toy of 2024–2026), an inflatable swimming platform, water trampoline, slide, towables, paddleboards, kayaks, full diving gear, and sometimes a Seabob (underwater scooter, €15k+). " +
      "**Toys to expect at each yacht tier (Greek market 2026):** small yacht (24–30m): basic kit, no jet ski usually. Mid-yacht (30–45m): 1 jet ski, paddleboards, kayaks, towables, full snorkel kit, occasionally a Seabob. Superyacht (45m+): the full menu — multiple jet skis, e-foils, Seabob, dive gear with PADI-instructor crew member, water slide, inflatable trampoline, wakeboarding setup, sometimes parasailing. " +
      "**Toy quality matters:** newer jet skis (Yamaha or Sea-Doo, 2024+ models) ride dramatically better than 5-year-old units. E-foils require calm seas and instruction — first-timers fall a lot. Most luxury yachts will brief guests on toys on the first morning at anchor. " +
      "**Insurance and risk:** toy use is at guest risk under MYBA. The captain has the right to ground toys in heavy seas, with inexperienced operators, or after sundown. UHNW buyers occasionally bring their own kit (specialist surfboards, kitesurfing gear) — crew accommodate.",
    whyItMatters:
      "Water toys are the activity-density driver of a charter. A yacht with a deep toy inventory and a crew that runs activities all day creates a different vacation than a yacht with a meagre kit and a crew that only serves meals. Families with teenage children should specifically vet toy inventories before contracting.",
    examples: [
      {
        title: "Mid-tier yacht toy kit, 35m motor yacht",
        body: "1 jet ski (Yamaha 2024), 2 stand-up paddleboards, 2 kayaks, 1 Seabob, 4 towable inflatables, snorkel kit for 12, fishing rods. Adequate for an active 7-night family charter.",
      },
      {
        title: "Premium superyacht toy kit, 55m motor yacht",
        body: "3 jet skis, 2 e-foils, 1 Seabob, inflatable water trampoline (12m), water slide, snorkel kit, dive gear (PADI-certified mate runs lessons), wakeboarding, parasailing equipment. €250k+ inventory.",
      },
    ],
    faq: [
      {
        q: "Are water toys included in the charter fee?",
        a: "Use is included. Fuel for jet skis and chase-boat-towed activities is drawn from APA but the marginal cost is small.",
      },
      {
        q: "Can children use the toys?",
        a: "Yes — under crew supervision and within age-appropriate equipment. Most yachts have kids' life jackets and children's snorkel kits. Jet ski age limits are typically 16+, though some yachts permit younger with a parent on the same craft.",
      },
      {
        q: "What's an e-foil and is it worth trying?",
        a: "An e-foil is an electric-powered hydrofoil surfboard — it lifts above the water as you accelerate and offers a near-flying sensation. Yes, worth trying, but expect to fall many times before getting up. Lessons take 1–2 hours.",
      },
      {
        q: "Can I bring my own water sports equipment?",
        a: "Yes — most yachts welcome guest equipment (specialist surfboards, kitesurfing kit, freediving gear). Brief the captain in advance so storage is allocated.",
      },
    ],
    relatedTerms: ["tender", "captain", "stewardess", "embarkation"],
    relatedPages: [
      { title: "Full fleet", url: "/charter-yacht-greece" },
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
    ],
    seoTitle: "Yacht Water Toys: What to Expect at Every Yacht Tier (2026 Guide)",
    seoDescription:
      "Water toys range from basic paddleboards to e-foils, jet skis, and Seabobs. Full breakdown of toy inventories by yacht size and what to ask before booking.",
    canonical: "https://georgeyachts.com/glossary/water-toys",
  },

  // ─────────────────────────────────────────────────────────────
  // CREW
  // ─────────────────────────────────────────────────────────────
  {
    slug: "captain",
    term: "Captain",
    alsoKnownAs: ["Master", "Skipper", "Yacht Captain"],
    category: "crew",
    shortDefinition:
      "The captain is the senior officer aboard a yacht — responsible for navigation, safety, crew discipline, and ultimately the conduct of the entire charter. On commercial yachts over 24m, the captain must hold an MCA-certified Master license appropriate to the yacht's tonnage and area of operation.",
    longDefinition:
      "The captain is the single most important variable in a yacht charter. The yacht is just a platform — the captain decides whether your week feels like a curated experience or a logistical inconvenience. A great captain anticipates guest moods, predicts weather problems before they bite, suggests anchorages you would never find, manages the crew so service is silent, and disappears when not needed. " +
      "**Captain qualifications under MCA (UK) and equivalent codes — required for commercial Greek charters:** Yachtmaster Offshore minimum for yachts under 24m commercial. Master 200 (for yachts up to 200 GT) typical for yachts 24–35m. Master 500 for yachts to 500 GT (35–50m typical). Master 3000 for larger superyachts. All certifications require sea-time logged and specific exam regimens. " +
      "**Captain compensation 2026 Greek market:** standard captain salary on a 30–40m yacht: €8,000–€14,000/month plus accommodation aboard. Senior captains on 60m+ yachts: €15,000–€25,000/month plus profit-share on owner business. Captain gratuity from charterers adds 40–60% to gross take in a good year. " +
      "**What separates a great captain from a competent captain:** anticipation. A competent captain executes your stated itinerary. A great captain reads the wind, sees the swell coming from the south, and recommends Schinoussa instead of Koufonisia 30 minutes before the spray would have hit. The yacht is the chassis — the captain is the experience.",
    whyItMatters:
      "Vetting the captain matters more than vetting the yacht. A first-class yacht with a second-class captain delivers a mediocre week. A solid yacht with an exceptional captain delivers a transformative week. UHNW brokers know specific captains by reputation and will steer you toward a yacht because of who's at the helm, not despite it.",
    examples: [
      {
        title: "Captain on a 35m motor yacht, 7 nights, Cyclades",
        body: "Greek-flag yacht, captain holds Master 500, 18 years experience including 7 in Greek waters. Speaks Greek, English, basic Italian. Spends 30 minutes daily with charter principal reviewing options. Adjusts itinerary 4 times in the week without ever asking permission unnecessarily.",
      },
    ],
    faq: [
      {
        q: "Does the captain join us for meals?",
        a: "Captain often joins for one dinner mid-charter on request — a tradition in Mediterranean chartering. Otherwise captain eats with crew. Not insistent but customary for UHNW charterers to invite the captain for at least one shared meal.",
      },
      {
        q: "Who picks the captain on a charter?",
        a: "The yacht's owner. The captain comes with the yacht. UHNW brokers can sometimes negotiate a 'captain swap' to a specific senior person, but it's rare and usually for repeat clients.",
      },
      {
        q: "What if I don't get along with the captain?",
        a: "First, talk to your broker, who has direct lines to the operator. Most personality conflicts resolve with one conversation about communication style. Mid-charter captain replacement is technically possible but rarely happens — usually the issue is style not substance.",
      },
      {
        q: "Can the captain go ashore with us?",
        a: "Captains generally stay with the yacht or go ashore for crew business only. Some guest principals invite the captain to specific dinners — accepted with discretion.",
      },
    ],
    relatedTerms: ["crewed-charter", "stewardess", "yacht-chef", "myba-contract", "embarkation"],
    relatedPages: [
      { title: "Charter timeline", url: "/charter-timeline" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Yacht Captain: The Most Important Variable in Your Charter (2026)",
    seoDescription:
      "The captain is the single most important factor in a yacht charter. Full breakdown of qualifications, compensation, and what to expect from a top-tier captain.",
    canonical: "https://georgeyachts.com/glossary/captain",
  },

  {
    slug: "stewardess",
    term: "Stewardess",
    alsoKnownAs: ["Yacht Stewardess", "Stew", "Chief Stewardess"],
    category: "crew",
    shortDefinition:
      "A stewardess is the interior crew member responsible for guest service: serving meals, tending bar, managing cabins, laundry, and ensuring the interior runs to five-star hotel standards. Larger yachts carry multiple stewardesses headed by a Chief Stewardess.",
    longDefinition:
      "Stewardesses are the visible face of yacht-charter service. They greet you, serve every meal, mix every drink, turn down every bed, fold every napkin into the right swan, manage your laundry overnight, and remember your preferences after the first morning. On a well-run yacht the stewardesses know which guest takes black coffee, which guest wants milk warmed, and which guest will not say it but really wants the cabin temperature 19°C not 21°C. " +
      "**Stewardess hierarchy on larger yachts:** Chief Stewardess (manages interior, manages the team, owns the guest-experience relationship), Second Stewardess (supports service, takes over chief role when needed), Junior Stewardesses (general service). On a 60m yacht there may be 5–7 stewardesses including service, cabin, and laundry specialists. " +
      "**Stewardess training and qualifications 2026:** STCW basic safety training (mandatory), Food Safety, often G.U.E.S.T. Programme certifications (silver service, wine service, floristry, butler service). Specialist chiefs often have sommelier qualifications. Many come from luxury hotel backgrounds — Four Seasons, Aman, Ritz-Carlton — bringing five-star hotel service into a yacht context. " +
      "**Stewardess compensation:** €3,000–€7,000/month for junior, €5,500–€9,000 for chief on a 30–45m, €7,500–€14,000 for chief on a 50m+ superyacht. Heavy reliance on gratuity to reach competitive total compensation. Top stewardesses move yachts based on captain relationships and gratuity history.",
    whyItMatters:
      "Stewardesses define whether the charter feels like a hotel or a friend's beach house. UHNW buyers typically care most about the chief stewardess — she's the one ensuring the preference sheet is honoured, the music is right, and the small things are remembered. Asking 'who's the chief stew' is as relevant a vetting question as 'who's the captain.'",
    examples: [
      {
        title: "Mid-yacht service, 35m motor yacht",
        body: "Crew of 5: captain, chef, mate, deckhand, 2 stewardesses. Chief stew manages morning briefing with chef, dinner service, evening turndown. Junior stew supports breakfast and lunch service, manages laundry overnight.",
      },
    ],
    faq: [
      {
        q: "Do I tip the stewardesses separately from the rest of the crew?",
        a: "No — one gratuity envelope to the captain, who distributes among the entire crew including stewardesses.",
      },
      {
        q: "Can I request a specific stewardess from a previous charter?",
        a: "Sometimes possible if she's still on the same yacht. Across yachts is more difficult — stewardesses change yachts seasonally and your broker would need to know which yacht she's now on.",
      },
      {
        q: "What's a typical stewardess work pattern?",
        a: "Service starts at first guest movement (typically 7–9am) and runs through the final guest action of the evening (often midnight or later). Stewardesses get downtime in the afternoon when guests are off-yacht. Long-charter weeks are physically demanding.",
      },
    ],
    relatedTerms: ["captain", "yacht-chef", "crewed-charter", "provisioning"],
    relatedPages: [
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Yacht Stewardess: The Five-Star Interior Service Role Explained (2026)",
    seoDescription:
      "Stewardesses run yacht interior service to hotel standards — meals, bar, cabins, laundry. Full breakdown of the role, hierarchy, and what defines top-tier stew service.",
    canonical: "https://georgeyachts.com/glossary/stewardess",
  },

  {
    slug: "yacht-chef",
    term: "Yacht Chef",
    alsoKnownAs: ["Yacht Chef", "Onboard Chef", "Private Chef"],
    category: "crew",
    shortDefinition:
      "A yacht chef is a professional cook based aboard the yacht for the duration of the charter, preparing every meal for guests and crew. Top yacht chefs come from Michelin-starred land restaurants and produce restaurant-quality cuisine in a 4m² galley.",
    longDefinition:
      "Yacht chefs are arguably the hardest-working professionals in luxury hospitality. A yacht chef on a 12-guest charter prepares 3 meals daily for 12 guests + 6 crew, often plus snacks, plus pre-charter provisioning, all in a galley a fraction of the size of a land restaurant kitchen, on a moving platform, with single-source-supply constraints. Top yacht chefs hold Michelin-restaurant experience and command salaries equivalent to executive chefs ashore. " +
      "**Yacht chef tiers and what to expect:** **Standard chef** (yachts under 30m): solid hotel-restaurant background, executes guest preference sheet competently. **Premium chef** (yachts 30–50m): often ex-Michelin, builds bespoke menus, can host themed dinners. **Top-tier chef** (yachts 50m+): Michelin-starred experience, can prepare 10-course tasting menus, recipe specialisation (Asian fusion, French haute, raw cuisine). Some yacht chefs have followings — UHNW charterers book a yacht because the chef is aboard. " +
      "**Yacht chef compensation 2026:** €5,500–€9,000/month for solid chef, €9,000–€18,000 for premium chef, €18,000–€30,000+ for celebrity-yacht chef. Heavy gratuity multiplier. Top chefs move between yachts seasonally. " +
      "**What to brief the chef pre-charter:** dietary restrictions (allergies, religious, lifestyle), favourite ingredients (truffles, lobster, specific fish), no-go items, beverage preferences, special occasion meals (a particular cake, a recreation of a favourite restaurant dish), and broad style preference (light Mediterranean, Asian fusion, Italian-only, etc.).",
    whyItMatters:
      "On any luxury charter, food is 40% of the experience. A weak chef will sink an otherwise great week. A great chef can elevate a mediocre yacht into a memorable trip. Ask your broker about the chef by name and credentials — they should know. Anonymous 'we have a great chef' answers are not acceptable at this price point.",
    examples: [
      {
        title: "Standard chef on 30m motor yacht",
        body: "Greek-trained chef, 12 years experience including 5 in luxury Athens hotels. Bills herself as 'Mediterranean with Asian accents.' Prepares lunch and dinner aboard daily; breakfasts to order. Guest preference sheet executed faithfully.",
      },
      {
        title: "Premium chef on 50m superyacht",
        body: "French chef, 4 years at a 2-star in Lyon before yachting. Charter principal requested daily-bespoke menus and the chef proposes per-day options. Wine pairings prepared by chief stew (sommelier-certified). Charter rated 10/10 on the post-trip survey.",
      },
    ],
    faq: [
      {
        q: "Can the chef accommodate dietary restrictions?",
        a: "Yes — at UHNW level all serious dietary restrictions (vegan, kosher, halal, allergies, FODMAP, IF/keto, paleo) are routine. Brief the chef 14+ days in advance with specifics.",
      },
      {
        q: "Can we eat ashore some nights?",
        a: "Yes — chef will plan around restaurant nights. Brief the captain by the morning of the day so the chef doesn't over-provision.",
      },
      {
        q: "Do I need to provide menus or does the chef plan?",
        a: "Chef plans entirely from the preference sheet. Some guests want input on specific meals — share preferences via the broker, and the chef will incorporate or suggest alternatives.",
      },
      {
        q: "Is the chef separate from the captain in decision-making?",
        a: "Chef reports operationally to the captain but has independent authority over the galley and menu. Disputes between captain and chef are managed by the chief stewardess.",
      },
    ],
    relatedTerms: ["captain", "stewardess", "provisioning", "apa", "crewed-charter"],
    relatedPages: [
      { title: "How a Greek yacht charter works", url: "/how-it-works" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Yacht Chef: How Charter Cuisine Achieves Michelin Standards (2026)",
    seoDescription:
      "Top yacht chefs deliver restaurant-quality cuisine in a 4m² galley. Full breakdown of chef tiers, compensation, and how to vet a charter chef.",
    canonical: "https://georgeyachts.com/glossary/yacht-chef",
  },

  // ─────────────────────────────────────────────────────────────
  // SPECS
  // ─────────────────────────────────────────────────────────────
  {
    slug: "loa",
    term: "LOA (Length Overall)",
    alsoKnownAs: ["Length Overall", "Overall Length"],
    category: "specs",
    shortDefinition:
      "LOA is the total length of a yacht from the foremost point of the bow to the aftmost point of the stern, measured horizontally. It is the standard specification used for charter pricing, marina fees, and regulatory categorisation.",
    longDefinition:
      "When a yacht is described as '40 metres,' the figure refers to LOA. Every charter price, marina fee, and regulatory threshold uses LOA. It is the defining specification of a yacht as a commercial object. " +
      "**LOA vs LWL (Length at Waterline):** LOA includes bowsprit, swim platform, anchor pulpit. LWL excludes overhanging structures and is shorter, sometimes by 2–4 metres on larger yachts. LWL matters for sailing performance calculations; LOA matters for commerce. " +
      "**LOA-based price scaling in Greek charter 2026 (motor yachts, mid-tier):** 24m: ~€60k/week base; 30m: ~€95k/week; 35m: ~€140k/week; 40m: ~€220k/week; 50m: ~€420k/week. Price scales superlinearly because every additional metre adds crew, fuel, and complexity. " +
      "**LOA and marina fees:** Greek marinas charge by LOA, typically €5–€18 per metre per night in summer. A 40m yacht at €12/m pays €480/night in marina. Anchoring is free in most Greek waters except a few protected bays.",
    whyItMatters:
      "LOA is the headline number for any yacht — but it's not the whole story. A 40m yacht with 8m beam has more interior volume than a 45m yacht with 6.5m beam. UHNW buyers should look at LOA, beam, draft, and GT (gross tonnage) together for a complete picture of what 'size' actually means aboard.",
    examples: [
      {
        title: "40m yacht spec breakdown",
        body: "LOA: 40.20m. LWL: 36.50m. Beam: 8.40m. Draft: 2.30m. Gross tonnage: 350 GT. Cabins: 5 (1 master, 4 doubles). Sleeps: 10 guests + 8 crew.",
      },
    ],
    faq: [
      {
        q: "Why is LOA different from waterline length?",
        a: "LOA includes overhanging structures — bowsprit, swim platform, anchor pulpit. LWL is the length actually displacing water. The difference can be 2–4m on bigger yachts.",
      },
      {
        q: "Does LOA include the radar arch on top of the flybridge?",
        a: "No — LOA is a horizontal measurement at hull level. Air draft (the vertical equivalent, height of the highest fixed point above the waterline) is a separate spec that matters for bridge clearances.",
      },
      {
        q: "Is LOA the same as 'length of yacht'?",
        a: "Yes for charter/commerce purposes. In casual conversation 'a 40-metre yacht' always means 40m LOA.",
      },
    ],
    relatedTerms: ["beam", "draft", "superyacht", "motor-yacht"],
    relatedPages: [
      { title: "Yacht size visualizer", url: "/yacht-size-visualizer" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "What is LOA? Length Overall in Yachting Explained",
    seoDescription:
      "LOA is the total length of a yacht from bow to stern. Full breakdown of how LOA drives charter pricing and what other specs matter alongside it.",
    canonical: "https://georgeyachts.com/glossary/loa",
  },

  {
    slug: "beam",
    term: "Beam",
    alsoKnownAs: ["Yacht Beam", "Vessel Beam", "Maximum Beam"],
    category: "specs",
    shortDefinition:
      "Beam is the maximum width of a yacht's hull, measured at the widest point. Wider beam means more interior volume, more deck space, and greater stability — but higher marina fees and limited access to narrow harbours.",
    longDefinition:
      "Beam matters as much as length for a yacht's actual feel aboard. A 40m yacht with 8.5m beam has approximately 30% more interior volume than a 40m yacht with 6.8m beam — meaning bigger cabins, wider corridors, and a saloon that doesn't feel cramped. Modern luxury motor yachts have been getting beamier (8–9m on a 40m yacht is now standard) because volume drives charter rates more than length per se. " +
      "**Beam by yacht type, typical 2026:** 30m motor yacht: 7.0m. 30m sailing yacht: 6.8m. 30m catamaran: 11–13m (catamarans have 2 hulls separated). 40m motor yacht: 8.5m. 50m motor yacht: 9.5m. 60m+ megayacht: 10.5m+. " +
      "**Where beam matters for itinerary:** narrow harbours (Hydra Town, parts of Symi) cap yachts by beam, not length. A 30m yacht with 6.5m beam slots in. A 30m beamy modern yacht with 7.2m beam doesn't fit and must anchor outside the harbour, tender in. This is a real chartering constraint in the Saronic and Dodecanese.",
    whyItMatters:
      "Beam is the silent spec that determines whether your master cabin feels palatial or cramped. UHNW buyers should ask about beam alongside LOA — and at viewing, walk the saloon to feel the width. A beamy yacht is a different product than a narrow yacht of the same length.",
    examples: [
      {
        title: "Beamy vs narrow at the same LOA",
        body: "Yacht A: 40m LOA, 9m beam. Interior volume ~580 m³. Master cabin 28 m². Yacht B: 40m LOA, 7.2m beam. Interior volume ~430 m³. Master cabin 20 m². Same length, different yacht.",
      },
    ],
    faq: [
      {
        q: "Why do catamarans have such wide beams?",
        a: "Catamarans have two hulls — beam is measured across both, including the open bridge deck between them. A 25m catamaran might have 11m beam, which would be physically impossible for a monohull.",
      },
      {
        q: "Do beamier yachts roll more or less?",
        a: "Less. Wider beam increases initial stability — the yacht resists tipping more strongly. This is why catamarans (extreme beam) roll almost imperceptibly.",
      },
      {
        q: "Is there a maximum beam for Greek marinas?",
        a: "Most Greek marinas accept yachts up to 9.5m beam without issue. Above 10m (rare on monohulls, common on catamarans) some marinas charge double fees because the yacht occupies two berths.",
      },
    ],
    relatedTerms: ["loa", "draft", "catamaran-charter", "flybridge"],
    relatedPages: [
      { title: "Yacht size visualizer", url: "/yacht-size-visualizer" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Yacht Beam: How Width Affects Interior Volume and Comfort",
    seoDescription:
      "Beam is the width of a yacht — and it drives interior volume more than length does. Full breakdown of how beam affects charter comfort and itinerary options.",
    canonical: "https://georgeyachts.com/glossary/beam",
  },

  {
    slug: "draft",
    term: "Draft",
    alsoKnownAs: ["Draught", "Yacht Draft", "Vessel Draft"],
    category: "specs",
    shortDefinition:
      "Draft is the vertical distance between the waterline and the deepest point of a yacht's hull (typically the keel or rudder). Deeper draft means more sailing stability but limits access to shallow anchorages.",
    longDefinition:
      "Draft is the constraint that determines where a yacht can anchor or moor. A yacht with 3m draft cannot enter the gorgeous shallow anchorage at Donousa (1.8m water in places); a yacht with 1.5m draft can. This single specification opens or closes whole categories of Greek anchorages. " +
      "**Draft by yacht type, typical:** small motor yachts (24–30m): 1.8–2.3m. Large motor yachts (40–55m): 2.4–3.2m. Sailing yachts (most): 2.5–4.5m (deeper because of the keel for sailing performance). Catamarans: 1.2–1.5m (no keel — flat bottom). Trawler yachts: 2.0–2.8m. " +
      "**Greek anchorages where draft matters most:** Donousa, parts of Antiparos (Despotiko channel), Lipsi, Skiathos shallows, parts of Spetses harbour. Catamarans access all of these; deep-draft sailing yachts cannot. " +
      "**Draft trade-off:** sailing yachts have deep draft because the keel provides sailing performance and counterbalance to the mast. Motor yachts can have shallower drafts because they don't need that. But all yachts above 35m typically have 2.4m+ draft to provide enough underwater volume for crew quarters and machinery.",
    whyItMatters:
      "If your itinerary includes specific shallow anchorages (Donousa, Despotiko, parts of the Sporades), draft is the single most important spec. A buyer asking about the perfect itinerary in the Small Cyclades needs a catamaran or a shallow-draft motor yacht — period.",
    examples: [
      {
        title: "Yacht-anchorage compatibility, Donousa",
        body: "Donousa main anchorage: 1.8–4m depths. Yachts up to 1.6m draft: anchor close to beach. 1.6–2.5m draft: anchor middle. 2.5m+ draft: anchor far outside or skip Donousa entirely.",
      },
    ],
    faq: [
      {
        q: "Why do sailing yachts have deeper draft than motor yachts?",
        a: "The deep keel of a sailing yacht provides counterbalance to the mast (preventing tipping under sail) and improves windward sailing performance. Motor yachts don't have sails, so they don't need deep keels — only enough hull depth for stability and machinery.",
      },
      {
        q: "How shallow can catamarans go?",
        a: "Most luxury catamarans have 1.2–1.5m draft. Some performance catamarans with retractable daggerboards can reduce to under 1m. This is the major reason families with shallow-anchorage preference choose catamarans.",
      },
      {
        q: "Does draft change when the yacht is loaded?",
        a: "Slightly. A fully fuelled, fully provisioned yacht with 12 guests aboard sits a few centimetres deeper than the empty figure. Specs usually quote 'full load' draft, which is the safest planning number.",
      },
    ],
    relatedTerms: ["loa", "beam", "catamaran-charter", "sailing-yacht"],
    relatedPages: [
      { title: "Yacht size visualizer", url: "/yacht-size-visualizer" },
      { title: "Full fleet", url: "/charter-yacht-greece" },
    ],
    seoTitle: "Yacht Draft Explained: How Deep Does a Yacht Sit and Why It Matters",
    seoDescription:
      "Draft determines which anchorages a yacht can enter. Full breakdown of draft by yacht type and Greek anchorages where draft is the deciding spec.",
    canonical: "https://georgeyachts.com/glossary/draft",
  },

  {
    slug: "flybridge",
    term: "Flybridge",
    alsoKnownAs: ["Fly Deck", "Sun Deck", "Upper Deck"],
    category: "specs",
    shortDefinition:
      "The flybridge is the upper outdoor deck of a motor yacht, typically above the main saloon, used for sunbathing, dining, helm operation, and entertaining. It is one of the most-used spaces on a yacht in the Mediterranean season.",
    longDefinition:
      "The flybridge is where most of life on a Mediterranean yacht happens. Breakfast on the flybridge with the morning sun. Lunch on the flybridge looking at Schinoussa. Sunset cocktails on the flybridge facing the Cyclades sunset. Dinner on the flybridge under the stars. On a well-designed yacht the flybridge is the heart of the charter, not the saloon. " +
      "**What a typical flybridge contains:** open dining table seating 8–12, sunpads on the foredeck section, a wet bar, often a jacuzzi or pool, a secondary helm station (so the captain can navigate while social activity continues below), shade structures (bimini or hardtop), occasionally a flat-screen TV. " +
      "**Flybridge vs sun deck terminology:** on smaller motor yachts (under 30m) the term 'flybridge' is standard. On larger superyachts (40m+) with multiple upper decks, the topmost deck is often called the 'sun deck' or 'sky lounge', and 'flybridge' refers specifically to a covered/semi-covered helm-and-lounge area on the second-from-top deck. Terminology varies by builder. " +
      "**Why the flybridge is the most-used space:** the Mediterranean sun and breeze make outdoor living the default 9 months of the year. A yacht with an enclosed saloon and weak flybridge feels cramped quickly. A yacht with a generous flybridge feels twice as big as it is.",
    whyItMatters:
      "When viewing yacht photos or virtual tours, the flybridge is the space to evaluate most carefully. Square footage, shade options, dining capacity, jacuzzi presence — these are the variables that drive day-to-day comfort. A weak flybridge condemns a charter to indoor living.",
    examples: [
      {
        title: "Standard flybridge, 35m motor yacht",
        body: "Open dining table for 10. Sunpads forward. Wet bar. Bimini shade. Spa pool seating 6. Secondary helm with full instruments. About 60 m² of total useable space.",
      },
      {
        title: "Sun deck on a 55m superyacht",
        body: "Two zones: forward sun deck with massive sunpads + jacuzzi for 8. Aft sun deck with full dining for 12 + outdoor cinema screen. Hard-top shade with retractable louvers. About 120 m² total.",
      },
    ],
    faq: [
      {
        q: "Do all motor yachts have flybridges?",
        a: "Most do. Some 'sportfishers' or pure-performance motor yachts have minimal or no flybridge to reduce weight and air resistance. For luxury chartering, a meaningful flybridge is essentially mandatory.",
      },
      {
        q: "Can sailing yachts have flybridges?",
        a: "Rarely. A flybridge would interfere with the boom and rigging. Sailing yachts have other forms of upper-deck space (cockpit, deckhouse roof) but not a flybridge as such.",
      },
      {
        q: "Is the flybridge usable in bad weather?",
        a: "Only with a hardtop or bimini cover. Open flybridges become unusable in rain or strong wind. Yachts with retractable awnings or fully-enclosed flybridges (with side curtains) can be used in more conditions.",
      },
    ],
    relatedTerms: ["motor-yacht", "loa", "beam", "tender"],
    relatedPages: [
      { title: "Full fleet", url: "/charter-yacht-greece" },
      { title: "Yacht size visualizer", url: "/yacht-size-visualizer" },
    ],
    seoTitle: "What is a Yacht Flybridge? The Most-Used Space on a Motor Yacht",
    seoDescription:
      "The flybridge is the upper outdoor deck where most of Mediterranean yacht life happens. Full breakdown of what to look for and how it differs from a sun deck.",
    canonical: "https://georgeyachts.com/glossary/flybridge",
  },

  {
    slug: "stabilizers",
    term: "Stabilizers (Stabilisers)",
    alsoKnownAs: ["Gyroscopic Stabilizer", "Seakeeper", "Fin Stabilizer", "Zero-Speed Stabilizer"],
    category: "specs",
    shortDefinition:
      "Stabilizers are mechanical or gyroscopic systems that counteract a yacht's roll, eliminating the side-to-side motion that causes seasickness. Modern luxury yachts use 'zero-speed' stabilizers that work at anchor as well as underway.",
    longDefinition:
      "Roll — the side-to-side motion of a yacht as waves push the hull — is the single largest comfort variable on a yacht. A yacht without stabilizers at anchor in a moderate swell rolls 5–8 degrees, enough to make seasickness-prone guests miserable and to topple wine glasses. A yacht with modern zero-speed stabilizers rolls less than 1 degree in the same conditions — imperceptible. " +
      "**Two stabilizer technologies on modern luxury yachts:** **(1) Fin stabilizers** — underwater fins on either side of the hull that pivot to counter roll. Highly effective underway, less effective at anchor on older systems. Modern fin systems (e.g. Quantum XT, CMC) now include zero-speed mode. **(2) Gyroscopic stabilizers** (Seakeeper is the dominant brand) — internal spinning gyroscopes whose angular momentum counters roll. Effective at any speed including dead-stopped at anchor. Standard on most luxury yachts 30m and above built after 2015. " +
      "**Why stabilizers matter for charter selection:** a yacht's roll characteristics define the daily experience. Lunch on the aft deck at anchor without stabilizers means sliding plates and bracing for swells. With Seakeeper engaged, the same lunch is identical to lunch in a five-star hotel restaurant. " +
      "**Stabilizer status questions a UHNW buyer should ask:** Does the yacht have stabilizers? Are they zero-speed capable (operate at anchor)? Are they fin or gyroscopic? When were they last serviced? On older yachts without modern stabilization, the roll problem is real and chronic — newer builds (2018+) almost universally have stabilization that approaches the comfort of a much larger vessel.",
    whyItMatters:
      "Stabilizers are the single most cost-effective comfort upgrade in luxury chartering. A 35m yacht with zero-speed gyroscopic stabilization feels like a 50m without. Comparing two yachts of similar length: the one with modern stabilizers delivers a noticeably better week, and a smart broker will surface this spec before price.",
    examples: [
      {
        title: "Stabilizer absence — older 32m motor yacht",
        body: "Yacht built 2008, fin stabilizers underway only. At anchor in a 1m swell: 4–6 degrees of roll. Guest with mild motion sensitivity feels unwell by Day 2. Lunch on the flybridge requires hands on stemware.",
      },
      {
        title: "Stabilizer excellence — modern 35m motor yacht",
        body: "Yacht built 2021, twin Seakeeper 35 gyroscopes. At anchor in the same 1m swell: less than 1 degree of roll. Guests don't feel motion at all. Plates stay where placed. Stabilizers run silently — no noise penalty.",
      },
    ],
    faq: [
      {
        q: "Do all luxury yachts have stabilizers?",
        a: "Most yachts above 30m built after 2015 do. Older yachts vary widely — some retrofitted, some not. Ask specifically about model and year. 'Has stabilizers' is not enough — ask 'is it zero-speed capable?'",
      },
      {
        q: "Are stabilizers noisy?",
        a: "Modern systems are essentially silent in the guest spaces. Some older fin systems and large gyroscopes produce a faint low hum noticeable only when actively engaged. New yachts have addressed this fully.",
      },
      {
        q: "Do stabilizers consume a lot of fuel?",
        a: "Gyroscopic stabilizers consume electricity (3–10 kW depending on size), which means the generator runs slightly more. The fuel cost increment over a full charter is typically €200–€500 — negligible compared to the comfort gain.",
      },
      {
        q: "Can I turn the stabilizers off?",
        a: "Yes — but rarely necessary. The captain may turn them off in flat-calm conditions to save fuel and noise, but most guests want them on whenever there's any swell. Sailing yachts under sail can sometimes disengage stabilizers since the sails themselves dampen roll.",
      },
    ],
    relatedTerms: ["motor-yacht", "draft", "beam", "captain"],
    relatedPages: [
      { title: "Full fleet", url: "/charter-yacht-greece" },
      { title: "Yacht size visualizer", url: "/yacht-size-visualizer" },
    ],
    seoTitle: "Yacht Stabilizers Explained: Why They Define the Charter Experience",
    seoDescription:
      "Stabilizers eliminate yacht roll — the single largest comfort variable on a charter. Full breakdown of Seakeeper vs fin stabilizers and what to ask before booking.",
    canonical: "https://georgeyachts.com/glossary/stabilizers",
  },
];

// ── Helper lookups (mirrors articleSeo.js / islands.js style) ────

export function getGlossaryTermBySlug(slug) {
  return GLOSSARY_TERMS.find((t) => t.slug === slug) || null;
}

export function getGlossaryByCategory(category) {
  return GLOSSARY_TERMS.filter((t) => t.category === category);
}

export const GLOSSARY_CATEGORIES = [
  { slug: "pricing", label: "Pricing & Contracts" },
  { slug: "charter-types", label: "Charter Types" },
  { slug: "yacht-types", label: "Yacht Types" },
  { slug: "operations", label: "Operations" },
  { slug: "crew", label: "Crew" },
  { slug: "specs", label: "Specifications" },
  { slug: "legal", label: "Legal" },
];
