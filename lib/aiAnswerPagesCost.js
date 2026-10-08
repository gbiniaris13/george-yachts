// The cost and place answer pages (George, 7 October 2026, evening).
//
// The third wave of the answer pages: the questions people put to ChatGPT
// and to Google about what a week costs and where it goes, in the words
// they use. "How much does it cost to charter a yacht in Athens" had 428
// United States impressions in 28 days at position 9.7 and no page of its
// own; "how much does it cost to rent a sailboat for a week" and "how much
// does a catamaran vacation cost" were answered by the engines with other
// houses. The guest-count pages answer the question every brief contains
// ("we are four", "we are twelve") with the one fact the market hides: the
// price is per yacht, and a party of four pays the same as a party of eight.
//
// Every figure is a rate card this house holds (lib/charterIndex2026.js) or
// arithmetic on it; the dollar page uses the European Central Bank reference
// rate of 6 October 2026, USD 1 = EUR 0.887, and says so. Boarding ports are
// Athens, Corfu and Lefkada (George, 8 September 2026); any other port is a
// repositioning quoted on its own line.

import { FLEET_COUNT, CATAMARAN_COUNT, FLEET_COMPOSITION } from "@/lib/fleetCount";
import { answerPage, WHATSAPP_US, REACH, WHEN_2027, FROM_ALL_IN } from "@/lib/aiAnswerPages";

const USD_NOTE = "at the European Central Bank reference rate of 6 October 2026, USD 1 = EUR 0.887";
const ENTRY_LINE = "a 15 metre crewed catamaran for eight at EUR 17,000 base, " + FROM_ALL_IN;
const CAT_FILTER = '_type == "yacht" && category in ["sailing-catamarans", "power-catamarans"]';
const ALL_FILTER = '_type == "yacht" && category in ["sailing-catamarans", "power-catamarans", "motor-yachts"]';
const IONIAN_FILTER = 'cruisingRegion match "*Ionian*" || cruisingRegion match "*Corfu*" || cruisingRegion match "*Lefkada*" || cruisingRegion match "*Greece*"';
const SIX_CABIN = '_type == "yacht" && slug.current in ["christal-mio-80", "summer-fun", "cant-remember", "kintaro", "kokomo-nights", "meli", "project-steel", "noema", "pareaki-ii", "la-pellegrina-1"]';
const SMALL_PARTY = '_type == "yacht" && slug.current in ["sea-ya", "why-not", "sea-u", "just-marie-2", "babalu", "azul", "sahana", "nova", "kimata", "lady-m", "serenity", "above-beyond"]';

export const AI_ANSWER_PAGES_COST = [
  answerPage({
    slug: "how-much-does-it-cost-to-charter-a-yacht-in-athens",
    eyebrow: "From the capital",
    h1: "How Much Does It Cost to Charter a Yacht in Athens?",
    tagline: "Athens is where the crewed fleet lives, at Alimos and Flisvos, which makes it the cheapest place in Greece to board and the one with the most choice.",
    quickAnswer: {
      question: "How much does it cost to charter a yacht in Athens?",
      answer:
        "A fully crewed yacht charter from Athens costs from about EUR 22,000 a week all in. " + ENTRY_LINE + ". A 20 metre crewed motor yacht for six to eight from about EUR 24,000 all in with the APA at 30 to 40 percent on a motor yacht; a 20 metre catamaran with a chef and a foredeck jacuzzi about EUR 40,000 to 45,000; a 27 metre motor yacht with a chef about EUR 50,000. Athens is where the yachts are based, so boarding at Alimos or Flisvos carries no repositioning, and the Saronic week to Hydra, Spetses and Poros, or the Cyclades, starts on any day you choose. One price per yacht per week, never by the head. " + REACH,
    },
    keyFacts: [
      "The crewed fleet of Greece is based in Athens, at Alimos marina and Flisvos marina, twenty minutes from the airport; boarding there carries no delivery or repositioning line",
      "Entry from Athens: " + ENTRY_LINE + "; the APA on a catamaran at 20 to 25 percent for a Saronic week, VAT from 5.2 percent",
      "Motor yachts from Athens: from about EUR 24,000 all in at 20 metres, about EUR 50,000 at 27 metres with a chef, from about EUR 67,000 at 33 metres; the APA on a motor yacht at 30 to 40 percent",
      "The Athens weeks: the Saronic, Aegina, Poros, Hydra, Spetses and the Peloponnese coves, no leg over three hours; the western Cyclades, Kythnos, Serifos, Sifnos, Milos; the Mykonos loop at motor yacht speed",
      FLEET_COUNT + " fully crewed yachts on the list, " + CATAMARAN_COUNT + " catamarans and " + FLEET_COMPOSITION.motor + " motor yachts, nearly all of them based in Athens, every one with her rate card on her own page",
      "Any day of the week; the five-night Saronic week is the shortest programme this house writes, priced pro rata on the same yacht",
    ],
    seoTitle: "How Much Does It Cost to Charter a Yacht in Athens? 2027 Rates",
    seoDescription: "What it costs to charter a crewed yacht from Athens: from about EUR 22,000 a week all in on a catamaran, EUR 24,000 on a motor yacht, no repositioning.",
    touristType: ["First-time charterers", "American families", "Groups of couples"],
    whyTitle: "Why Athens is the cheapest place to board",
    whyBody:
      "**The yachts live here.** Alimos is the largest charter marina in Greece and Flisvos is where the larger motor yachts berth; between them they hold nearly the whole crewed fleet of Greece. A week that boards in Athens starts on the yacht's own pontoon with no delivery leg, which on a boarding in Mykonos or Santorini can be a day's running and a line on the proposal. From the airport it is twenty minutes. " +
      "**The Saronic is at the door.** Aegina is an hour away, Poros two, Hydra three, Spetses four at catamaran speed and two by motor yacht; the Peloponnese coast across the strait is empty coves and fish tavernas. A week in the Saronic spends the low end of the APA because the legs are short and the anchorages are free, and it has no Meltemi. It is the right first week and the right short week. " +
      "**The Cyclades are a morning away.** Kea and Kythnos are the first night out; from there the western Cyclades or the Mykonos loop. A motor yacht reaches Mykonos in four hours. This house writes both weeks with the all-in figure for the route you choose and meets you on the pontoon at Alimos.",
    bestFor: [
      "A first charter in the Saronic, three hours from the airport to the first swim",
      "Families with young children who want calm water and short legs",
      "Americans landing in Athens who want to board the same afternoon",
      "A party that wants the Cyclades without paying a delivery to get there",
    ],
    yachtFilter: ALL_FILTER,
    yachtsHeadline: "The crewed yachts based in Athens",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the Athens weeks go for 2027",
    whenBody: "The Saronic runs from May to October; the entry catamarans and the 20 to 25 metre motor yachts are the most requested yachts on the list and their July and August weeks go first. " + WHEN_2027,
    insiderTips: [
      "Board at Alimos in the afternoon and sleep at Aegina; the first swim is before dinner.",
      "A Saronic week spends the low end of the APA; a Cyclades week from Athens the high end; the same yacht, a different number, and the broker should show both.",
      "Flisvos is the marina for the motor yachts over 30 metres and the quieter boarding.",
      "The five-night Saronic week exists for parties with a Sunday flight; it is priced pro rata on the same yacht.",
    ],
    faq: [
      { q: "How much does it cost to charter a yacht in Athens?", a: "From about EUR 22,000 a week all in for a 15 metre crewed catamaran for eight, about EUR 24,000 for a 20 metre crewed motor yacht, about EUR 40,000 to 45,000 for a 20 metre catamaran with a chef, about EUR 50,000 for a 27 metre motor yacht with a chef; per yacht per week, with the APA and the VAT worked in." },
      { q: "Where do yachts board in Athens?", a: "Alimos marina for most of the crewed fleet and Flisvos marina for the larger motor yachts, both twenty minutes from the airport, with no repositioning line." },
      { q: "Where does a week from Athens go?", a: "The Saronic, Aegina, Poros, Hydra, Spetses and the Peloponnese coves, with no leg over three hours; or the western Cyclades; or the Mykonos loop at motor yacht speed." },
      { q: "Can we charter for less than a week from Athens?", a: "The five-night Saronic week is the shortest programme this house writes, priced pro rata on the same yacht; day charters are a different market." },
      { q: "Does the week have to start on a Saturday?", a: "No; a crewed yacht from Athens starts on any day you choose." },
      { q: "How do I get a quote for an Athens week?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the month and the party; two or three real yachts with their rate cards and the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "From Alimos, on the day you choose.",
  }),

  answerPage({
    slug: "how-much-does-it-cost-to-charter-a-yacht-in-mykonos",
    eyebrow: "The island everyone asks for",
    h1: "How Much Does It Cost to Charter a Yacht in Mykonos?",
    tagline: "The base fee is the same as in Athens. What Mykonos adds is a delivery leg, the dearest berth in Greece in August, and the Meltemi. All three can be written down.",
    quickAnswer: {
      question: "How much does it cost to charter a yacht in Mykonos?",
      answer:
        "A fully crewed yacht charter from Mykonos costs the same as from Athens: from EUR 17,000 a week base for a 15 metre catamaran, about EUR 22,000 all in. A 20 metre motor yacht starts at EUR 17,500 base, about EUR 24,000 all in, plus the yacht's positioning to Mykonos. All in, a Mykonos week on a 20 metre catamaran with a chef lands about EUR 42,000 to 48,000, and on a 27 metre motor yacht about EUR 52,000 to 58,000, before a crew gratuity of 10 to 15 percent of the base. Most parties board in Athens instead and reach Mykonos on the second day. " + REACH,
    },
    keyFacts: [
      "The base fee does not change with the port: a crewed yacht quotes one Greece-wide rate card, from EUR 17,000 a week for a 15 metre catamaran and EUR 17,500 for a 20 metre motor yacht",
      "What Mykonos adds: a delivery from Athens, 95 nautical miles, a day for a catamaran and four to five hours for a motor yacht, quoted on its own line; and a higher APA, at the top of a catamaran's 20 to 30 percent and a motor yacht's 30 to 40, for the berth and the crossings",
      "The berth: Mykonos new port and the Tourlos marina in August are the dearest nights in Greece; one night in and six at anchor is how the captains spend the week",
      "From Mykonos in a week: Delos and Rhenia for the swim, Tinos, Paros and Antiparos, Naxos and the Small Cyclades, Ios; the Meltemi from mid-July shapes the order",
      "The alternative most parties choose: board in Athens, sleep at Kea or Kythnos, and arrive in Mykonos on the second afternoon with no delivery line",
      "One price per yacht per week, never by the head; the all-in figure, with the delivery, the VAT and the APA estimate for a Mykonos week, is written on every proposal from this house",
    ],
    seoTitle: "How Much Does It Cost to Charter a Yacht in Mykonos? 2027",
    seoDescription: "What a crewed yacht charter in Mykonos costs: the same base as Athens, from EUR 17,000 a week, plus the delivery and a higher APA for the berth.",
    touristType: ["Groups of couples", "Celebration parties", "American charterers"],
    whyTitle: "Where the Mykonos money goes",
    whyBody:
      "**Not into the base fee.** The owners of the crewed yachts of Greece quote one rate card for the yacht wherever she goes; Mykonos does not have a tariff. A party comparing a Mykonos quote against an Athens quote for the same yacht should see the same base, and if it does not, the difference has a name. " +
      "**Into the delivery and the APA.** Boarding in Mykonos means the yacht has made her way from Athens for you, 95 nautical miles, which is a line on the proposal. And a Mykonos week spends more: the berth at the new port or Tourlos in August is the dearest in Greece, the crossings to Paros and Naxos are long, and the Meltemi from mid-July makes them longer under sail. The APA estimate for a Mykonos week should sit at the top of the range for the yacht type, and a house that writes it there is being honest. " +
      "**The way around it.** Board in Athens, sleep at Kea the first night, and be in Mykonos for the second afternoon with no delivery, then spend the week in the islands around it, Delos and Rhenia, Paros, Naxos, the Small Cyclades, with one night on the Mykonos quay and the rest at anchor. This house writes both versions and says which it would choose for your party.",
    bestFor: [
      "A party that wants one night on the Mykonos quay and six in the islands around it",
      "Celebration weeks, a fortieth or a fiftieth, that start in Mykonos",
      "Americans flying into Mykonos who want to board there and understand the delivery line",
      "Anyone comparing a Mykonos quote against an Athens quote for the same yacht",
    ],
    yachtFilter: 'cruisingRegion match "*Mykonos*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    yachtsHeadline: "The crewed yachts that run the Mykonos loop",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the Mykonos weeks go for 2027",
    whenBody: "Mykonos in late July and August is the most requested week in Greece on the 20 to 24 metre catamarans with a chef and the 30 metre motor yachts; they go a year ahead. " + WHEN_2027,
    insiderTips: [
      "Ask for the delivery on its own line and the base unchanged; that is the honest Mykonos quote.",
      "One night at the quay, six at anchor; Rhenia and the south coast bays are the Mykonos week.",
      "The first ten days of July are the calm window before the Meltemi; September is the other.",
      "Delos is a morning by tender from Rhenia, before the day boats arrive at eleven.",
    ],
    faq: [
      { q: "How much does it cost to charter a yacht in Mykonos?", a: "The same base fee as from Athens, from EUR 17,000 a week for a 15 metre crewed catamaran, plus the delivery from Athens on its own line and a higher APA for the berth and the crossings; about EUR 42,000 to 48,000 all in on a 20 metre catamaran with a chef and EUR 52,000 to 58,000 on a 27 metre motor yacht." },
      { q: "Is it cheaper to board in Athens and sail to Mykonos?", a: "Yes, by the delivery line; a yacht that boards in Athens reaches Mykonos on the second afternoon with a night at Kea or Kythnos on the way." },
      { q: "Why is the APA higher for a Mykonos week?", a: "The berth at the new port or Tourlos in August is the dearest in Greece, the crossings to Paros and Naxos are long, and the Meltemi makes them longer; the estimate sits at the top of the range for the yacht type." },
      { q: "What islands go with Mykonos in a week?", a: "Delos and Rhenia, Tinos, Paros and Antiparos, Naxos and the Small Cyclades, Ios; the captain shapes the order to the wind." },
      { q: "Can we stay on the quay in Mykonos every night?", a: "You can, at the cost of the dearest berth in Greece every night; the captains recommend one night on the quay and the rest at anchor off Rhenia and the south coast." },
      { q: "How do I get a Mykonos quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with the base, the delivery, the VAT and the APA estimate for a Mykonos week come back within twenty-four hours." },
    ],
    ctaTitle: "A Mykonos week, with the delivery on its own line.",
  }),

  answerPage({
    slug: "how-much-does-it-cost-to-charter-a-yacht-in-santorini",
    eyebrow: "The caldera",
    h1: "How Much Does It Cost to Charter a Yacht in Santorini?",
    tagline: "Santorini has no marina to speak of and the most photographed anchorage in Greece. The week that includes it is priced from Athens or Paros, with the caldera as the destination.",
    quickAnswer: {
      question: "How much does it cost to charter a yacht in Santorini?",
      answer:
        "A fully crewed yacht charter that includes Santorini costs the same as from Athens: from EUR 17,000 a week base for a 15 metre catamaran, about EUR 22,000 all in. A 20 metre motor yacht starts at EUR 17,500 base, about EUR 24,000 all in. Santorini has no marina for crewed yachts beyond the small harbour at Vlychada, so the yachts anchor in the caldera below Oia and Fira and at the Red Beach. All in, a week on a 20 metre catamaran with a chef that reaches Santorini lands about EUR 42,000 to 48,000, and on a 27 metre motor yacht about EUR 52,000 to 58,000. " + REACH,
    },
    keyFacts: [
      "The base fee does not change with the island: one Greece-wide rate card per yacht, from EUR 17,000 a week for a 15 metre crewed catamaran and EUR 17,500 for a 20 metre motor yacht",
      "Santorini is 130 nautical miles from Athens, a motor yacht's seven hours and a catamaran's two days; a week that includes it runs from Athens through the Cyclades or boards in Paros or Santorini with the delivery on its own line",
      "No marina: Vlychada's harbour on the south coast takes small yachts; the crewed yachts anchor in the caldera, off Oia and Fira, at the Red Beach and off Thirasia, and go ashore by tender",
      "A week with Santorini in it: Athens to Sifnos, Milos, Folegandros, Santorini, Ios and Paros on a motor yacht; or Paros, Naxos, Ios, Santorini and back on a catamaran",
      "The APA for a Santorini week sits at the top of the range, a catamaran's 20 to 30 percent and a motor yacht's 30 to 40, for the distance; the caldera itself is a free anchorage",
      "One price per yacht per week, never by the head; the all-in figure for a week that reaches Santorini is written on every proposal from this house",
    ],
    seoTitle: "How Much Does It Cost to Charter a Yacht in Santorini? 2027",
    seoDescription: "What a crewed yacht charter to Santorini costs: the same base as Athens, from EUR 17,000 a week, the distance in the APA, and where the yachts anchor.",
    touristType: ["Honeymooners", "Groups of couples", "American charterers"],
    whyTitle: "How to put Santorini in a week honestly",
    whyBody:
      "**It is far, and there is nowhere to tie up.** Santorini sits at the southern edge of the Cyclades, 130 nautical miles from Athens, and its one harbour at Vlychada is for small boats. The crewed yachts anchor in the caldera, which is the point: the view from the water below Oia at six in the evening is the reason the island is on the brief. But a week that boards in Santorini has to bring the yacht there first, and a week that spends two days each way getting there has no week left. " +
      "**The two honest versions.** On a motor yacht from Athens: Sifnos the first night, Milos, Folegandros, Santorini on the fourth day with a night in the caldera, Ios, Paros and home. On a catamaran: board in Paros with the delivery on its own line, Naxos, Ios, Santorini for two nights, Folegandros, back to Paros. Both are weekly, fully crewed, and the base fee on each is the yacht's own. " +
      "**What this house writes.** The base unchanged, the delivery if there is one on its own line, the APA estimate at the top of the range for the distance, the VAT at the yacht's rate, the gratuity range, and the caldera on the fourth evening, within twenty-four hours.",
    bestFor: [
      "Honeymooners who want the caldera from the water at sunset",
      "A party that wants the southern Cyclades, Milos, Folegandros and Santorini, in one week",
      "Americans flying out of Santorini who want the week to end there",
      "Anyone who was quoted a \"Santorini charter\" without the delivery and wonders where it went",
    ],
    yachtFilter: 'cruisingRegion match "*Santorini*" || cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    yachtsHeadline: "The crewed yachts that reach Santorini in a week",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the Santorini weeks go for 2027",
    whenBody: "Santorini is a September island on the water: the Meltemi is gone, the caldera has room and the cards step down; July and August weeks on the 30 metre motor yachts that make the distance go a year ahead. " + WHEN_2027,
    insiderTips: [
      "Ask the captain for the caldera at six in the evening and Thirasia at eight in the morning; the hours between are the day boats'.",
      "The Red Beach and the White Beach on the south coast are the swims; the caldera is deep and for the view.",
      "On a catamaran, board in Paros rather than Athens and spend the saved days in the Small Cyclades.",
      "A Santorini week spends the top of the APA for the distance; the anchorage itself costs nothing.",
    ],
    faq: [
      { q: "How much does it cost to charter a yacht in Santorini?", a: "The same base fee as from Athens, from EUR 17,000 a week for a 15 metre crewed catamaran, with the distance in the APA and the delivery on its own line if the week boards there; about EUR 42,000 to 48,000 all in on a 20 metre catamaran with a chef and EUR 52,000 to 58,000 on a 27 metre motor yacht." },
      { q: "Is there a marina in Santorini?", a: "Only the small harbour at Vlychada on the south coast; the crewed yachts anchor in the caldera below Oia and Fira, at the Red Beach and off Thirasia, and go ashore by tender." },
      { q: "Can we board in Santorini?", a: "Yes, with the delivery from Athens or Paros quoted on its own line; most parties board in Athens or Paros and reach the caldera on the third or fourth day." },
      { q: "How far is Santorini from Athens by yacht?", a: "About 130 nautical miles: seven hours on a motor yacht at 20 knots, two days on a catamaran with a night in the western Cyclades on the way." },
      { q: "Which islands go with Santorini in a week?", a: "Milos, Folegandros, Ios, Paros, Naxos and the Small Cyclades; the captain shapes the order to the wind and the distance." },
      { q: "How do I get a Santorini quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with the base, the delivery if any, the VAT and the APA estimate come back within twenty-four hours." },
    ],
    ctaTitle: "The caldera on the fourth evening, in writing.",
  }),

  answerPage({
    slug: "how-much-does-it-cost-to-charter-a-yacht-in-corfu",
    eyebrow: "The Ionian, from the north",
    h1: "How Much Does It Cost to Charter a Yacht in Corfu?",
    tagline: "Green islands, no Meltemi, Paxos and Antipaxos an hour away: the Ionian week from Corfu costs the same base as Athens and spends less of the APA.",
    quickAnswer: {
      question: "How much does it cost to charter a yacht in Corfu?",
      answer:
        "A fully crewed yacht charter from Corfu costs from about EUR 22,000 a week all in on a 15 metre catamaran. A 20 metre motor yacht is about EUR 24,000 all in, the same rate cards as from Athens. The Ionian week from Corfu spends the low end of the APA, 20 to 25 percent on a catamaran, because the legs are short, Paxos and Antipaxos an hour south, Parga and Sivota on the mainland, Lefkada and Meganisi two to three hours, and there is no Meltemi. " + REACH,
    },
    keyFacts: [
      "The base fee is the yacht's, not the port's: from EUR 17,000 a week for a 15 metre crewed catamaran and EUR 17,500 for a 20 metre motor yacht on the current rate cards",
      "Boarding: Gouvia marina on Corfu, ten minutes from the airport; a yacht based in the Ionian carries no delivery, one repositioned from Athens carries it on its own line",
      "The Corfu week: Paxos and Antipaxos, Parga and Sivota on the mainland, Mourtos and the Syvota islets, Lefkada's west coast, Meganisi and its coves; no leg over three hours",
      "The APA sits at the low end for the type, 20 to 25 percent on a catamaran and 30 to 35 on a motor yacht, because the Ionian legs are short and the anchorages are free",
      "No Meltemi: the Ionian has a light afternoon breeze from the north-west and flat mornings; it is the sheltered Greece and the family Greece",
      "One price per yacht per week, never by the head; this house boards in Athens, Corfu and Lefkada on any day you choose",
    ],
    seoTitle: "How Much Does It Cost to Charter a Yacht in Corfu? 2027 Rates",
    seoDescription: "What a crewed yacht charter from Corfu costs: the same base as Athens, from about EUR 22,000 a week all in, with a lower APA for the short Ionian legs.",
    touristType: ["Families", "Couples", "British and American charterers"],
    whyTitle: "Why the Ionian week spends less",
    whyBody:
      "**The legs are short and the wind is kind.** From Gouvia the first swim is at Paxos in an hour and a half, Antipaxos's white cliffs are twenty minutes beyond, and the mainland coast at Parga and Sivota is across a strait. Nothing in a Corfu week is more than three hours away, the Ionian has no Meltemi, and a catamaran under sail in the afternoon breeze burns almost nothing. That is why the APA sits at the low end of the range here, and why the Ionian is the family's Greece. " +
      "**The base is the yacht's.** A yacht based in the Ionian, and there is a power catamaran based at Gouvia on this list, boards with no delivery line; a yacht repositioned from Athens carries the delivery across the Peloponnese, through the Corinth canal or round the cape, on its own line. The base does not change. " +
      "**The week from Corfu.** Paxos's Gaios and Lakka, Antipaxos's Voutoumi, Parga under the castle, the Syvota islets, Lefkada's west coast beaches, Meganisi's coves for the last nights, and back; or south to Ithaca and Fiskardo for a party that wants to move. This house writes it with the all-in figure and meets you at Gouvia.",
    bestFor: [
      "Families with young children who want calm water and short legs",
      "A first charter in the sheltered Greece, ten minutes from the airport to the marina",
      "Couples who want Antipaxos at noon and Gaios at eight",
      "Anyone who has done the Cyclades and wants the green islands",
    ],
    yachtFilter: IONIAN_FILTER,
    yachtsHeadline: "The crewed yachts that run the Ionian from Corfu",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the Corfu weeks go for 2027",
    whenBody: "The Ionian runs from May to early October with the calmest water in Greece; the yachts based there are few and their July and August weeks go early. " + WHEN_2027,
    insiderTips: [
      "Ask whether the yacht is based in the Ionian or repositioned from Athens; the delivery is the only line that changes between the two quotes.",
      "Antipaxos at noon, Gaios at eight: the first full day from Corfu.",
      "The Syvota islets and Mourtos on the mainland are the quiet anchorages when Paxos fills in August.",
      "The Ionian's afternoon breeze is for sailing; book a sailing catamaran here and a power catamaran or motor yacht for the Cyclades.",
    ],
    faq: [
      { q: "How much does it cost to charter a yacht in Corfu?", a: "From about EUR 22,000 a week all in on a 15 metre crewed catamaran and about EUR 24,000 on a 20 metre motor yacht, the same base fees as from Athens, with the APA at the low end for the type because the Ionian legs are short; a delivery line applies only to a yacht repositioned from Athens." },
      { q: "Where do yachts board in Corfu?", a: "Gouvia marina, ten minutes from the airport; the yachts based in the Ionian live there and carry no delivery." },
      { q: "What does a week from Corfu reach?", a: "Paxos and Antipaxos, Parga and Sivota, the Syvota islets, Lefkada's west coast, Meganisi, and for a party that moves, Ithaca and Fiskardo on Kefalonia; no leg over three hours." },
      { q: "Is the Ionian windy?", a: "No; it has no Meltemi, a light afternoon breeze from the north-west and flat mornings. It is the sheltered Greece." },
      { q: "Is Corfu cheaper than Athens for a charter?", a: "The base is the same; the APA is lower for the short legs; the delivery is an extra line only for a yacht repositioned from Athens. For a yacht based in the Ionian, the Corfu week is the cheaper of the two all in." },
      { q: "How do I get a Corfu quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with their rate cards and the all-in Ionian week come back within twenty-four hours." },
    ],
    ctaTitle: "The Ionian from Gouvia, in writing.",
  }),

  answerPage({
    slug: "how-much-does-it-cost-to-charter-a-yacht-in-lefkada",
    eyebrow: "The Ionian, from the middle",
    h1: "How Much Does It Cost to Charter a Yacht in Lefkada?",
    tagline: "Lefkada is joined to the mainland by a bridge and to the best cruising in the Ionian by an hour's sail: Meganisi, Kalamos, Ithaca and Kefalonia from one marina.",
    quickAnswer: {
      question: "How much does it cost to charter a yacht in Lefkada?",
      answer:
        "A fully crewed yacht charter from Lefkada costs from about EUR 22,000 a week all in on a 15 metre catamaran. A 20 metre motor yacht is about EUR 24,000 all in, the same rate cards as from Athens. There is no Meltemi; the Ionian breeze gets up at two and dies at six. This house boards in Athens, Corfu and Lefkada on any day you choose. " + REACH,
    },
    keyFacts: [
      "The base fee is the yacht's, not the port's: from EUR 17,000 a week for a 15 metre crewed catamaran and EUR 17,500 for a 20 metre motor yacht",
      "Boarding: Lefkada marina in the town, forty minutes from Preveza airport by the bridge; a yacht repositioned from Athens carries the delivery on its own line",
      "The Lefkada week: the Inland Sea, Meganisi's coves, Abelike and Atherinos, Kalamos and Kastos, Atokos, Ithaca's Kioni and Vathi, Fiskardo on Kefalonia, Lefkada's west coast beaches, Egremni and Porto Katsiki; no leg over two hours",
      "The APA sits at the low end for the type because the legs are an hour and the anchorages are free; a sailing catamaran in the Ionian breeze burns almost nothing",
      "No Meltemi: the Ionian is the sheltered Greece, with flat mornings and a breeze from two to six that the sailing catamarans are built for",
      "One price per yacht per week, never by the head; the Lefkada week is written with the all-in figure on every proposal from this house",
    ],
    seoTitle: "How Much Does It Cost to Charter a Yacht in Lefkada? 2027 Rates",
    seoDescription: "What a crewed yacht charter from Lefkada costs: the same base as Athens, from about EUR 22,000 a week all in, with Meganisi, Ithaca and Kefalonia in reach.",
    touristType: ["Families", "Sailing parties", "Couples"],
    whyTitle: "Why Lefkada is the sailing catamaran's Greece",
    whyBody:
      "**The Inland Sea.** Between Lefkada, Meganisi, Kalamos and the mainland lies a stretch of water the sailors call the Inland Sea: flat, green, sheltered on every side, with a breeze that arrives at two and leaves at six. A sailing catamaran crosses it in an hour under sail, anchors in a Meganisi cove with the bow to the pines, and the APA for the day is the cook's shopping. That is why the Ionian week from Lefkada spends the low end of the range, and why it is the week this house writes for families and for parties who want to sail rather than motor. " +
      "**Everything is an hour.** Meganisi's Abelike and Atherinos, Kalamos and Kastos, Atokos's One House Bay, Kioni on Ithaca, Fiskardo on Kefalonia; and on the outside, the west coast of Lefkada with Egremni and Porto Katsiki, the cliffs and the white sand. Nothing is more than two hours away. " +
      "**The base is the yacht's.** A yacht repositioned from Athens carries the delivery on its own line; the base fee does not change. This house writes the Lefkada week with the delivery if any, the APA at the low end for the type, the VAT at the yacht's rate and the gratuity range, and meets you at the marina.",
    bestFor: [
      "Families who want an hour between anchorages and flat water",
      "Sailing parties who want the afternoon breeze and the sails up",
      "Couples who want Kioni on Ithaca and Fiskardo on Kefalonia in one week",
      "A first charter in the sheltered Greece, forty minutes from Preveza airport",
    ],
    yachtFilter: IONIAN_FILTER,
    yachtsHeadline: "The crewed yachts that run the Ionian from Lefkada",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the Lefkada weeks go for 2027",
    whenBody: "The Ionian runs from May to early October; the sailing catamarans that suit it are the most requested yachts for families and their July and August weeks go early. " + WHEN_2027,
    insiderTips: [
      "Sails up at two, anchor down at six: the Ionian day for a sailing catamaran.",
      "Meganisi has three coves on its north side; ask the captain which one is empty.",
      "Egremni and Porto Katsiki on Lefkada's west coast are for the calm morning before the breeze.",
      "Ask whether the yacht is repositioned from Athens; the delivery is the only line that changes.",
    ],
    faq: [
      { q: "How much does it cost to charter a yacht in Lefkada?", a: "From about EUR 22,000 a week all in on a 15 metre crewed catamaran and about EUR 24,000 on a 20 metre motor yacht, the same base fees as from Athens, with the APA at the low end for the type because the legs are an hour; a delivery line applies to a yacht repositioned from Athens." },
      { q: "Where do yachts board in Lefkada?", a: "Lefkada marina in the town, forty minutes from Preveza airport across the bridge." },
      { q: "What does a week from Lefkada reach?", a: "The Inland Sea, Meganisi, Kalamos and Kastos, Atokos, Ithaca, Fiskardo on Kefalonia, and Lefkada's west coast beaches; nothing over two hours away." },
      { q: "Is Lefkada good for sailing?", a: "It is the sailing catamaran's Greece: flat water, a breeze from two to six, no Meltemi, and an anchorage every hour." },
      { q: "Can we end in Corfu instead?", a: "Yes; a one-way week from Lefkada to Corfu through Paxos and Antipaxos is written with the repositioning on its own line." },
      { q: "How do I get a Lefkada quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with their rate cards and the all-in Ionian week come back within twenty-four hours." },
    ],
    ctaTitle: "The Inland Sea, under sail, in writing.",
  }),

  answerPage({
    slug: "how-much-does-it-cost-to-rent-a-sailboat-for-a-week",
    eyebrow: "Under sail, with a crew",
    h1: "How Much Does It Cost to Rent a Sailboat for a Week?",
    tagline: "The honest answer depends on one word: crewed. A sailboat with a captain and a cook in Greece for a week, worked all in.",
    quickAnswer: {
      question: "How much does it cost to rent a sailboat for a week?",
      answer:
        "A fully crewed sailboat in Greece costs from about EUR 22,000 for the week all in. " + ENTRY_LINE + ", and the crewed sailing monohulls on the list, 24 to 31 metres for six to nine guests, run EUR 24,000 to 55,000 a week base, about EUR 30,000 to 78,000 all in with the APA at 20 to 30 percent on a sailing yacht and Greek VAT from 5.2 percent. A bareboat, which you sail yourself with a recognised licence, is a different market and is not something this house brokers; it writes fully crewed weeks, one price per yacht, never by the head. " + REACH,
    },
    keyFacts: [
      "Two kinds of sailboat week: bareboat, which you sail yourself with a recognised licence and which is not something this house brokers; and fully crewed, with a captain and a cook-hostess or more, from EUR 17,000 a week base",
      "The fully crewed sailing catamarans: from EUR 17,000 base for a 15 metre for eight, " + FROM_ALL_IN + "; EUR 31,500 to 48,000 with a chef at 20 metres; EUR 56,000 to 90,000 at 24 metres",
      "The fully crewed sailing monohulls: six on the list from 24 to 31 metres, six to nine guests, EUR 24,000 to 55,000 base, with the APA at 20 to 30 percent on a sailing yacht; the classic yacht's week",
      "All in on a EUR 24,000 monohull base: APA at 20 to 30 percent (EUR 4,800 to 7,200) plus VAT at 5.2 to 12 percent (EUR 1,250 to 2,880) = EUR 30,000 to 34,000, before a gratuity of EUR 2,400 to 3,600",
      "Where the sailing is: the Ionian from Lefkada or Corfu for the afternoon breeze and flat mornings; the Saronic from Athens for the sheltered first week; the Cyclades in June and September",
      "One price per yacht per week whoever boards; weekly, any day of the week; up to twelve guests by law",
    ],
    seoTitle: "How Much Does It Cost to Rent a Sailboat for a Week? Crewed, Greece",
    seoDescription: "What it costs to rent a sailboat for a week in Greece, fully crewed: from about EUR 22,000 all in on a catamaran and EUR 30,000 on a classic monohull.",
    touristType: ["Sailing parties", "Couples", "American charterers"],
    whyTitle: "Why \"a sailboat for a week\" has two answers",
    whyBody:
      "**Bareboat or crewed.** A bareboat is a yacht you sail yourself; in Greece it requires a recognised skipper's certificate and a second competent crew member on the crew list, the price is the yacht alone, and it is not something this house brokers. A fully crewed yacht carries a captain, a cook-hostess or a chef and a deckhand, and the week is a holiday rather than a passage: the entry is EUR 17,000 base for a 15 metre catamaran for eight, about EUR 22,000 all in. " +
      "**The crewed sailboat in Greece is mostly a catamaran.** " + CATAMARAN_COUNT + " of the crewed yachts on this list are catamarans, from the 15 metre Lagoons to the 24 metre Sunreefs with a chef; six are classic sailing monohulls of 24 to 31 metres, an Admiral, a Perini Navi and a Comar among them, for a party that wants the heel and the wake. Both sail best in the Ionian, where the breeze arrives at two, and in the Cyclades in June and September. " +
      "**What this house writes.** The fully crewed week on two or three real sailboats, the base, the APA at 20 to 30 percent on a sailing yacht estimated for the route, the VAT at the yacht's rate and the gratuity range, within twenty-four hours.",
    bestFor: [
      "Sailing parties who want the sails up and someone else in the galley",
      "Couples who want a classic monohull and a crew of three",
      "Americans comparing a crewed sailboat week in Greece against the Caribbean",
      "Anyone who has bareboated and wants to be a guest this time",
    ],
    yachtFilter: '_type == "yacht" && category in ["sailing-catamarans", "sailing-monohulls"]',
    yachtsHeadline: "The crewed sailing yachts and catamarans on the list",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the sailboats go for 2027",
    whenBody: "The sailing catamarans are the most requested yachts in Greece and the five-cabin ones go a year ahead for late July and August; the monohulls hold longer. " + WHEN_2027,
    insiderTips: [
      "Ask whether a quote is for a bareboat or a crewed yacht before you compare; they are different products at different prices.",
      "The Ionian is the sailor's Greece: breeze from two to six, flat water, an anchorage every hour.",
      "A monohull heels and a catamaran does not; a party with anyone who has been seasick should choose the catamaran.",
      "The APA on a sailing week sits at the low end of 20 to 30 percent because the engines run little.",
    ],
    faq: [
      { q: "How much does it cost to rent a sailboat for a week?", a: "Fully crewed in Greece, from about EUR 22,000 all in for a 15 metre catamaran for eight, and EUR 30,000 to 78,000 for the classic monohulls of 24 to 31 metres, with the APA at 20 to 30 percent on a sailing yacht and VAT from 5.2 percent. A bareboat is a different market and not one this house brokers." },
      { q: "What is the difference between bareboat and crewed?", a: "Bareboat you sail yourself, with a recognised licence; crewed carries a captain and a cook-hostess or chef, and the week is a holiday. This house writes crewed weeks only." },
      { q: "Do I need a licence for a crewed sailboat?", a: "No; the captain holds it. A bareboat in Greece needs a recognised skipper's certificate and a second competent crew member on the list." },
      { q: "Catamaran or monohull?", a: "A catamaran for space, flat anchorages and the nets; a monohull for the heel, the wake and the look. Both are on the list, fully crewed." },
      { q: "Where is the best sailing in Greece?", a: "The Ionian, from Lefkada or Corfu, for the afternoon breeze and flat water; the Cyclades in June and September for the longer passages; the Saronic from Athens for a sheltered first week." },
      { q: "How do I get a crewed sailboat quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real sailboats with their rate cards and the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "A sailboat for a week, with the crew, in writing.",
  }),

  answerPage({
    slug: "how-much-does-it-cost-to-sail-around-greece",
    eyebrow: "The whole country, one week at a time",
    h1: "How Much Does It Cost to Sail Around Greece?",
    tagline: "Greece is three cruising grounds and six thousand islands; nobody sails around it in a week. What a week in each costs, fully crewed, and how to choose.",
    quickAnswer: {
      question: "How much does it cost to sail around Greece?",
      answer:
        "Sailing around Greece on a fully crewed yacht costs from about EUR 22,000 for a week all in. The entry is a 15 metre crewed catamaran for 8 guests at EUR 17,000 base, with APA and VAT on top. Greece is too large to sail around in a week, so a week is written in one of three grounds: the Saronic from Athens, Hydra, Spetses and the Peloponnese coast; the Cyclades from Athens, Mykonos, Paros, Milos and Santorini; or the Ionian from Corfu or Lefkada, Paxos, Meganisi, Ithaca and Kefalonia. Two weeks join two of them. A motor yacht covers more of Greece in a week, from about EUR 24,000 all in at 20 metres, with the APA at 30 to 40 percent on a motor yacht for the fuel. " + REACH,
    },
    keyFacts: [
      "One rate card per yacht for all of Greece: the base does not change with the cruising ground, from EUR 17,000 a week for a 15 metre crewed catamaran and EUR 17,500 for a 20 metre motor yacht",
      "Three grounds, one week each: the Saronic, two hours from Athens, sheltered, the first week; the Cyclades, the islands in the photographs, the Meltemi in July and August; the Ionian, green and calm, from Corfu or Lefkada",
      "What changes between them is the APA, low in the Saronic and the Ionian where the legs are short, higher in the Cyclades, and the delivery, which applies only to boarding away from the yacht's base",
      "Two weeks join two grounds: Athens through the Cyclades, or the Saronic round the Peloponnese to the Ionian through the Corinth canal; priced as two weeks on the same yacht",
      "A catamaran at 7 knots sees five or six islands in a week; a motor yacht at 20 knots sees eight, with the APA at 30 to 40 percent on a motor yacht against 20 to 30 on a catamaran",
      "Fully crewed, weekly, any day of the week, from Athens, Corfu or Lefkada; one price per yacht, never by the head",
    ],
    seoTitle: "How Much Does It Cost to Sail Around Greece? A Crewed Week",
    seoDescription: "What it costs to sail around Greece on a crewed yacht: from about EUR 22,000 a week all in, the same base in the Saronic, the Cyclades or the Ionian.",
    touristType: ["First-time charterers", "American charterers", "Two-week parties"],
    whyTitle: "How to sail around Greece in a week, which is to say, how not to",
    whyBody:
      "**Greece is three countries by water.** The Saronic is Athens' own gulf, two hours from the marina, sheltered, with Hydra and Spetses as its jewels. The Cyclades are the white islands of the photographs, Mykonos, Paros, Naxos, Milos, Santorini, a morning apart by motor yacht and an afternoon by sail, with the Meltemi from mid-July. The Ionian is the green west, Corfu, Paxos, Lefkada, Ithaca, Kefalonia, flat water and an afternoon breeze. From the Saronic to the Ionian is a passage of two days; from Athens to Santorini is 130 miles. Nobody does all three in a week, and the house that offers to is selling a delivery. " +
      "**One ground per week is the whole holiday.** Five or six islands, a swim before breakfast, a different bay every night, the crew learning what you like by the second day. A second week joins a second ground, Athens through the Cyclades, or round the Peloponnese through the Corinth canal to the Ionian, on the same yacht at the same base. " +
      "**What this house writes.** The ground that fits your party and your month, two or three real yachts, the base, the APA estimated for that ground, the VAT at the yacht's rate, the gratuity range, within twenty-four hours, and the honest advice that the Saronic is the first week and the Cyclades the second.",
    bestFor: [
      "A first charter choosing between the three grounds",
      "Two-week parties who want the Cyclades and the Ionian",
      "Americans who want to see \"Greece\" and need to be told which Greece",
      "Anyone comparing a catamaran's five islands against a motor yacht's eight",
    ],
    yachtFilter: ALL_FILTER,
    yachtsHeadline: "The crewed yachts that sail Greece",
    featuredHeading: "A selection, largest first",
    whenTitle: "When to decide the ground for 2027",
    whenBody: "The Cyclades weeks in July and August are the first to go; the Saronic and the Ionian hold longer, and June and September are 15 to 25 percent below peak on most cards. " + WHEN_2027,
    insiderTips: [
      "Choose the ground before the yacht; the APA, the delivery and the right captain all follow from it.",
      "A first week is the Saronic; a second the Cyclades; the Ionian for families and sailors at any time.",
      "Two weeks on one yacht through the Corinth canal is the only way to sail \"around\" Greece, and it is a good one.",
      "A motor yacht sees more islands; a catamaran sees fewer and anchors flatter. Say which you want and the list halves.",
    ],
    faq: [
      { q: "How much does it cost to sail around Greece?", a: "From about EUR 22,000 for a fully crewed week all in on a 15 metre catamaran for eight, the same base in any of the three cruising grounds; from about EUR 24,000 on a 20 metre motor yacht. Greece is sailed one ground per week, not around." },
      { q: "Can you sail around Greece in a week?", a: "No; Greece is three cruising grounds, the Saronic, the Cyclades and the Ionian, each a week, and Athens to Santorini alone is 130 miles. A week is written in one ground; two weeks join two." },
      { q: "Which part of Greece should I sail first?", a: "The Saronic from Athens for a first week: sheltered, two hours from the marina, Hydra and Spetses. The Cyclades for the islands in the photographs; the Ionian for families and sailors." },
      { q: "Does the price change between the Cyclades and the Ionian?", a: "The base does not; the APA is higher in the Cyclades for the longer legs and the Mykonos berth, and a delivery applies only to boarding away from the yacht's base." },
      { q: "How many islands does a week see?", a: "Five or six on a catamaran, eight on a motor yacht at 20 knots; the captain shapes the order to the wind." },
      { q: "How do I start?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the month, the party and whether you want to sail or to cover ground; two or three real yachts with the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "One Greece per week, in writing.",
  }),

  answerPage({
    slug: "where-are-the-best-yacht-destinations-in-the-mediterranean",
    eyebrow: "The Mediterranean, honestly",
    h1: "Where Are the Best Yacht Destinations in the Mediterranean?",
    tagline: "Greece, Croatia, Italy, the French Riviera, the Balearics and Turkey each have a case. This is a Greek house; here is the case for Greece and a fair word on the others.",
    quickAnswer: {
      question: "Where are the best yacht destinations in the Mediterranean?",
      answer:
        "Greece is the best yacht destination in the Mediterranean for a crewed week: 3 cruising grounds from Athens, from EUR 17,000 per yacht. The best yacht destinations in the Mediterranean are Greece, for the islands, the water and the three cruising grounds in one country; Croatia, for the Dalmatian coast and its sheltered channels; Italy, for the Amalfi coast and Sardinia's Costa Smeralda; the French Riviera, for Saint-Tropez and Monaco and the yachts that go with them; the Balearics, for Mallorca, Menorca and Ibiza; and Turkey, for the Turquoise Coast and the gulets. Greece takes roughly 30 percent of Mediterranean summer charter bookings, the largest share of any one country, and a fully crewed week there starts at about EUR 22,000 all in, " + ENTRY_LINE + ". " + REACH,
    },
    keyFacts: [
      "Greece: three cruising grounds, the Saronic, the Cyclades and the Ionian, six thousand islands, water at 24 to 26 degrees in summer, and roughly 30 percent of Mediterranean summer charter bookings; crewed weeks from about EUR 22,000 all in",
      "Croatia: the Dalmatian coast from Split to Dubrovnik, Hvar, Vis and the Kornati, sheltered channels and medieval towns; a sailing ground close in character to the Ionian",
      "Italy: the Amalfi coast and Capri from Naples, the Aeolian islands, Sardinia's Costa Smeralda and the Maddalena archipelago; the restaurants and the yachts of the Italian summer",
      "The French Riviera: Saint-Tropez, Cannes, Antibes and Monaco, the superyacht shore of the Mediterranean, with Corsica a night's passage south",
      "The Balearics: Mallorca, Menorca, Ibiza and Formentera, the clearest water in the western Mediterranean and the beach clubs to go with it",
      "Turkey: the Turquoise Coast from Bodrum to Fethiye, the gulets, the Lycian ruins at the water's edge, and a warmer, longer season",
    ],
    seoTitle: "Best Yacht Destinations in the Mediterranean: Greece and the Rest",
    seoDescription: "Where the best yacht destinations in the Mediterranean are: Greece's three cruising grounds, Croatia, Italy, the Riviera, the Balearics and Turkey.",
    touristType: ["American charterers", "First-time Mediterranean charterers", "Repeat charterers"],
    whyTitle: "The case for Greece, from a house that only sells Greece",
    whyBody:
      "**Declare the interest first.** This house represents crewed yachts in Greek waters and nowhere else, so read what follows as the case for Greece made by someone who has chosen it, not as a survey. The others are good; some of them are very good; the Dalmatian coast in June and the Costa Smeralda in September are among the best weeks a yacht can give. " +
      "**Why Greece, for a week.** Three cruising grounds in one country, each a different holiday: the sheltered Saronic two hours from Athens, the white Cyclades, the green Ionian. The water is the warmest in the Mediterranean in September and clear everywhere. The islands are inhabited, so every night has a taverna and every morning a bakery, and they are many, so every night can be a different one. The crewed fleet is the largest in the Mediterranean and based in one marina, Alimos, which makes the choice wide and the boarding cheap. And the all-in week, at about EUR 22,000 for eight guests at the entry, is written on four lines by this house before you decide. " +
      "**Why the others, fairly.** Croatia for sheltered sailing and medieval harbours; Italy for the food and the glamour; the Riviera for the superyacht summer; the Balearics for the water and the clubs; Turkey for the gulet and the long season. A party that has done two of them should do Greece next; a party that has done Greece should do it again in a different ground.",
    bestFor: [
      "Americans choosing a first Mediterranean charter",
      "Parties who have done Croatia or Italy and want the next sea",
      "Families comparing calm water across the Mediterranean",
      "Anyone who wants the case for Greece made honestly",
    ],
    yachtFilter: ALL_FILTER,
    yachtsHeadline: "The crewed yachts this house represents in Greece",
    featuredHeading: "A selection, largest first",
    whenTitle: "When to decide on Greece for 2027",
    whenBody: "The Cyclades weeks in July and August go a year ahead; June and September, the best months in the water, are 15 to 25 percent below peak on most cards and hold longer. " + WHEN_2027,
    insiderTips: [
      "Choose the sea by the water you want: the Ionian and Dalmatia for sheltered, the Cyclades and the Balearics for open, the Riviera for the show.",
      "Greece's three grounds mean three different weeks on one rate card; a repeat charterer never has to repeat.",
      "September is the warmest water in the Mediterranean and the month the Greek owners keep for themselves.",
      "Ask any house for the all-in week on four lines before you compare seas; the base fee alone compares nothing.",
    ],
    faq: [
      { q: "Where are the best yacht destinations in the Mediterranean?", a: "Greece for the islands and its three cruising grounds, Croatia for the Dalmatian coast, Italy for Amalfi and Sardinia, the French Riviera for the superyacht summer, the Balearics for the water, Turkey for the Turquoise Coast. Greece takes roughly 30 percent of Mediterranean summer charter bookings." },
      { q: "Which Mediterranean destination is best for a first charter?", a: "Greece's Saronic from Athens: sheltered, two hours from the marina, Hydra and Spetses, with the crewed fleet based at the door; from about EUR 22,000 a week all in for eight." },
      { q: "Which is cheapest?", a: "This house holds rate cards for Greece only and will not quote the others; in Greece a fully crewed week starts at about EUR 22,000 all in per yacht, and the VAT on a weekly crewed charter is invoiced at 5.2 to 12 percent by the yacht's certification." },
      { q: "Which has the warmest water?", a: "The Aegean and the Ionian in September, at 25 to 26 degrees Celsius." },
      { q: "Greece or Croatia for families?", a: "Both are sheltered; the Ionian in Greece and the Dalmatian channels in Croatia are close in character. Greece adds the Saronic and the Cyclades for the second and third weeks." },
      { q: "How do I start a Greek week?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the month and the party; two or three real yachts with the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "The case for Greece, with the week in writing.",
  }),

  answerPage({
    slug: "which-are-the-7-ionian-islands",
    eyebrow: "The Eptanisa",
    h1: "Which Are the 7 Ionian Islands?",
    tagline: "Corfu, Paxos, Lefkada, Ithaca, Kefalonia, Zakynthos and Kythira: the Eptanisa, and which of them a crewed week from Corfu or Lefkada reaches.",
    quickAnswer: {
      question: "Which are the 7 Ionian islands?",
      answer:
        "The 7 Ionian islands are Corfu, Paxos, Lefkada, Ithaca, Kefalonia, Zakynthos and Kythira, and a crewed week among them starts from EUR 17,000. The seven Ionian islands, the Eptanisa, are Corfu, Paxos, Lefkada, Ithaca, Kefalonia, Zakynthos and Kythira, the last of which lies off the southern tip of the Peloponnese, far from the other six. A fully crewed yacht week from Corfu or Lefkada reaches five of them, Corfu, Paxos, Lefkada, Ithaca and Kefalonia, with Antipaxos, Meganisi, Kalamos and Kastos between, and costs from about EUR 22,000 all in, " + ENTRY_LINE + ". Zakynthos is a second week from Kefalonia; Kythira is a passage, not a stop. " + REACH,
    },
    keyFacts: [
      "The Eptanisa: Corfu (Kerkyra), Paxos (Paxoi), Lefkada (Lefkas), Ithaca (Ithaki), Kefalonia, Zakynthos (Zante) and Kythira; the smaller islands, Antipaxos, Meganisi, Kalamos, Kastos and Atokos, lie between them",
      "A week from Corfu: Corfu, Paxos, Antipaxos, the mainland coast at Parga and Sivota, Lefkada's west coast, Meganisi; five islands, no leg over three hours",
      "A week from Lefkada: the Inland Sea, Meganisi, Kalamos, Kastos, Atokos, Ithaca, Fiskardo on Kefalonia; nothing over two hours",
      "Zakynthos: the Shipwreck beach and the Blue Caves, a long day south of Kefalonia, best as part of a second week or a one-way from Lefkada",
      "Kythira: the seventh island in name, well over a hundred nautical miles south of Zakynthos, off Cape Malea; part of the Ionian by history, not by a week's cruising",
      "Fully crewed, weekly, from Corfu or Lefkada on any day of the week; no Meltemi, flat mornings, a breeze from two to six; one price per yacht, never by the head",
    ],
    seoTitle: "Which Are the 7 Ionian Islands? The Eptanisa, and a Week Among Them",
    seoDescription: "The seven Ionian islands named, Corfu, Paxos, Lefkada, Ithaca, Kefalonia, Zakynthos and Kythira, and which a crewed yacht week reaches.",
    touristType: ["Families", "Sailing parties", "First-time Ionian charterers"],
    whyTitle: "Seven islands, five in a week, and why",
    whyBody:
      "**The name is Venetian, the geography is not tidy.** The Eptanisa were the seven islands the Venetians held and the British governed, which is why Corfu has a cricket ground and Zakynthos had an opera house. Six of them run down the west coast of Greece from Corfu to Zakynthos; the seventh, Kythira, sits off the bottom of the Peloponnese because the republic that named them owned it too. Nobody sails to Kythira in an Ionian week. " +
      "**Five in a week is the honest count.** From Corfu, south: Paxos and Antipaxos, the mainland coast, Lefkada and Meganisi, and a long day to Fiskardo on Kefalonia if the party moves. From Lefkada, the Inland Sea and its small islands, Ithaca's Kioni and Vathi, Fiskardo, and back by Lefkada's west coast beaches. Zakynthos is a second week or a one-way south, and worth it for the Shipwreck beach seen from the water at eight in the morning. " +
      "**What this house writes.** The Ionian week from Corfu or Lefkada on two or three real yachts, the base, the APA at the low end for the type because the legs are short, the VAT at the yacht's rate, the gratuity range, within twenty-four hours.",
    bestFor: [
      "Families who want five green islands with an hour between them",
      "Sailing parties who want the afternoon breeze",
      "A first Ionian week choosing between Corfu and Lefkada as the start",
      "Two-week parties who want Zakynthos at the end",
    ],
    yachtFilter: IONIAN_FILTER,
    yachtsHeadline: "The crewed yachts that run the Ionian",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the Ionian weeks go for 2027",
    whenBody: "The Ionian runs from May to early October; the sailing catamarans that suit it are the most requested yachts for families and their July and August weeks go early. " + WHEN_2027,
    insiderTips: [
      "Start in Corfu for Paxos and Antipaxos; start in Lefkada for Ithaca and Kefalonia; the two weeks overlap at Meganisi.",
      "Antipaxos's Voutoumi at noon is the swim of the Ionian; Gaios on Paxos at eight is the evening.",
      "Fiskardo on Kefalonia is a long day from Corfu and an easy one from Lefkada.",
      "Zakynthos's Shipwreck beach from the water at eight in the morning, before the boats from Porto Vromi, is the one reason to add the week.",
    ],
    faq: [
      { q: "Which are the 7 Ionian islands?", a: "Corfu, Paxos, Lefkada, Ithaca, Kefalonia, Zakynthos and Kythira, the Eptanisa; Kythira lies off the southern Peloponnese, far from the other six." },
      { q: "How many of the Ionian islands can a yacht see in a week?", a: "Five: Corfu, Paxos, Lefkada, Ithaca and Kefalonia, with Antipaxos, Meganisi, Kalamos and Kastos between; Zakynthos is a second week, Kythira a passage." },
      { q: "Should a week start in Corfu or Lefkada?", a: "Corfu for Paxos, Antipaxos and the mainland coast; Lefkada for the Inland Sea, Ithaca and Kefalonia. Both board on any day you choose." },
      { q: "How much is an Ionian yacht charter?", a: "From about EUR 22,000 a week all in on a 15 metre crewed catamaran for eight, the same base as anywhere in Greece, with the APA at the low end for the type because the legs are short." },
      { q: "Is the Ionian windy?", a: "No; it has no Meltemi, flat mornings and a breeze from two to six that the sailing catamarans are built for." },
      { q: "How do I get an Ionian quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "Five of the seven, in one week, in writing.",
  }),

  answerPage({
    slug: "yacht-charter-greece-for-4-guests",
    eyebrow: "Two couples",
    h1: "How Much Is a Yacht Charter in Greece for 4 Guests?",
    tagline: "Four guests pay what eight would: the price is per yacht. The question is whether to take the entry catamaran with cabins to spare or a three-cabin motor yacht built for four.",
    quickAnswer: {
      question: "How much is a yacht charter in Greece for 4 guests?",
      answer:
        "A fully crewed yacht charter in Greece for 4 guests costs from about EUR 22,000 a week all in, the same as for 8. A crewed yacht is priced per yacht per week, whoever boards. A fully crewed yacht charter in Greece for four guests costs from about EUR 22,000 a week all in, the same as for eight, because a crewed yacht is priced per yacht per week whoever boards: " + ENTRY_LINE + ", with two cabins to spare for two couples. The yachts built for four to six, the 20 to 23 metre motor yachts with three cabins, run EUR 24,000 to 30,000 base, about EUR 33,000 to 45,000 all in with the APA at 30 to 40 percent on a motor yacht and Greek VAT from 5.2 percent; a 23 metre power catamaran with three cabins EUR 49,000 to 59,000 base. Two couples on the entry catamaran is the value; two couples on a Riva or an Azimut is the holiday. " + REACH,
    },
    keyFacts: [
      "Per yacht, never by the head: four guests pay the yacht's week, from EUR 17,000 base on a 15 metre crewed catamaran, and use two of her four cabins",
      "Built for four to six: the 20 to 23 metre motor yachts with three cabins, an Azimut 67 and a Dominator 78 among them, EUR 24,000 to 30,000 base, about EUR 33,000 to 45,000 all in; a Riva 72 with four cabins at EUR 21,000 base",
      "The three-cabin power catamaran: a Lagoon Seventy 8 for six with a crew of three at EUR 49,000 to 59,000 base, the catamaran built for two couples who want space",
      "Two couples on a 20 metre catamaran with a chef and a foredeck jacuzzi, EUR 31,500 to 48,000 base, is the honeymoon-for-four this desk writes most",
      "A crew of two or three with four guests is a quiet week: the captain and the cook-hostess on the catamarans, a deckhand added on the motor yachts",
      "Weekly, fully crewed, any day of the week from Athens, Corfu or Lefkada; the Saronic for two couples who want the bays, the Cyclades for two who want the islands",
    ],
    seoTitle: "Yacht Charter in Greece for 4 Guests: What Two Couples Pay",
    seoDescription: "What a crewed yacht charter in Greece costs for four guests: the same per-yacht price as for eight, from about EUR 22,000 a week all in.",
    touristType: ["Two couples", "Couples travelling with friends", "American couples"],
    whyTitle: "How two couples should read the list",
    whyBody:
      "**The price does not shrink with the party.** A crewed yacht is a house with a crew, priced for the week; four guests on the entry catamaran pay EUR 17,000 base and have two cabins empty, which is not waste but space: one cabin for the luggage, the foredeck for the afternoons, the saloon to yourselves. For two couples who want value, that is the answer and it is about EUR 22,000 all in. " +
      "**The yachts built for four.** The 20 to 23 metre motor yachts with three cabins, an Azimut 67, a Dominator 78, are two couples' yachts: a master and two doubles, a flybridge, a crew of three, 25 knots to Hydra, from EUR 24,000 base. The Riva 72 at EUR 21,000 base has four cabins and the Riva. The three-cabin Lagoon Seventy 8 is the catamaran built for six with the space of one for ten. " +
      "**What this house writes for four.** Usually the entry catamaran against a three-cabin motor yacht against a 20 metre catamaran with a chef, so the two couples can see what the extra EUR 10,000 buys, with the base, the APA at the type's rate, the VAT and the gratuity range on each, within twenty-four hours.",
    bestFor: [
      "Two couples who want value and the foredeck to themselves",
      "Two couples who want a three-cabin motor yacht and the flybridge",
      "An anniversary for four with a chef and a jacuzzi",
      "Parents and a grown child with a partner, in two doubles",
    ],
    yachtFilter: SMALL_PARTY,
    yachtsHeadline: "The yachts this house proposes for four",
    featuredHeading: "A selection",
    whenTitle: "When the small yachts go for 2027",
    whenBody: "The entry catamarans and the three-cabin motor yachts are the entry to the list and the most requested yachts on it; their July and August weeks go first. " + WHEN_2027,
    insiderTips: [
      "On the entry catamaran, take the two forward cabins and leave the aft ones for the luggage and the quiet.",
      "A three-cabin motor yacht's third cabin is sometimes a twin; two couples should ask for two doubles in writing.",
      "The APA for four is lower than for eight only in the food; the fuel and the berths are the yacht's.",
      "The gratuity is on the base, 10 to 15 percent, the same for four as for eight.",
    ],
    faq: [
      { q: "How much is a yacht charter in Greece for 4 guests?", a: "From about EUR 22,000 a week all in on a 15 metre crewed catamaran, the same per-yacht price as for eight; the 20 to 23 metre motor yachts with three cabins built for four to six run EUR 24,000 to 30,000 base, about EUR 33,000 to 45,000 all in." },
      { q: "Is a yacht charter cheaper for four than for eight?", a: "No; the price is per yacht per week whoever boards. Four guests on an eight-guest yacht pay the same and have the cabins to spare; the saving is in the food line of the APA." },
      { q: "Which yachts are built for four guests?", a: "The 20 to 23 metre motor yachts with three cabins, an Azimut 67 and a Dominator 78 among them, and the three-cabin Lagoon Seventy 8 power catamaran; the 15 metre catamarans carry four with two cabins to spare." },
      { q: "Do four guests get a smaller crew?", a: "The crew is the yacht's: a captain and a cook-hostess on the 15 metre catamarans, a deckhand added on the motor yachts and a chef from 20 metres." },
      { q: "Where should two couples go?", a: "The Saronic from Athens for the bays and the tavernas, Hydra and Spetses; the western Cyclades for the quiet islands; the Ionian from Lefkada for the sailing." },
      { q: "How do we start?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates; two or three real yachts for four with the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "Two couples, one yacht, in writing.",
  }),

  answerPage({
    slug: "yacht-charter-greece-for-6-guests",
    eyebrow: "Three couples",
    h1: "How Much Is a Yacht Charter in Greece for 6 Guests?",
    tagline: "Three couples is the brief this desk reads most often, and the list is built for it: three or four cabins, a crew of three, one price per yacht.",
    quickAnswer: {
      question: "How much is a yacht charter in Greece for 6 guests?",
      answer:
        "A fully crewed yacht charter in Greece for 6 guests costs from about EUR 22,000 a week all in. The entry is a 15 metre crewed catamaran at EUR 17,000 base, with APA and VAT on top. A fully crewed yacht charter in Greece for six guests costs from about EUR 22,000 a week all in, " + ENTRY_LINE + ", with a cabin to spare for three couples, and the price is per yacht whoever boards. The three-cabin motor yachts built for six, 20 to 23 metres, run EUR 24,000 to 30,000 base, about EUR 33,000 to 45,000 all in with the APA at 30 to 40 percent on a motor yacht; the four-cabin motor yachts of 24 to 27 metres, with a chef from 27, EUR 28,000 to 45,000 base; a 20 metre catamaran with a chef and a foredeck jacuzzi EUR 31,500 to 48,000 base, about EUR 40,000 to 68,000 all in with the APA at 20 to 30 percent on a catamaran. " + REACH,
    },
    keyFacts: [
      "Per yacht, never by the head: six guests pay the yacht's week, from EUR 17,000 base on a 15 metre crewed catamaran with four cabins, three for the couples and one to spare",
      "The three-cabin motor yachts built for six: 20 to 23 metres, an Azimut 67 and a Dominator 78 among them, EUR 24,000 to 30,000 base, a captain, a deckhand and a cook-hostess",
      "The four-cabin motor yachts of 24 to 27 metres, a Ferretti, a Sunseeker 75, a Pershing 90 with a chef, EUR 28,000 to 45,000 base, about EUR 39,000 to 68,000 all in with the APA at 30 to 40 percent on a motor yacht",
      "The 20 metre catamarans with a chef: Fountaine Pajot 67s and Lagoon Sixty 5s, four or five cabins, a foredeck jacuzzi, EUR 31,500 to 48,000 base, about EUR 40,000 to 68,000 all in with the APA at 20 to 30 percent on a catamaran",
      "Three couples want three doubles: on the four-cabin yachts the fourth is spare; on the three-cabin motor yachts the third is sometimes a twin, and the proposal should say",
      "Weekly, fully crewed, any day of the week from Athens, Corfu or Lefkada; up to twelve guests by law, so six is a quiet yacht",
    ],
    seoTitle: "Yacht Charter in Greece for 6 Guests: What Three Couples Pay",
    seoDescription: "What a crewed yacht charter in Greece costs for six guests: from about EUR 22,000 a week all in per yacht, and the yachts built for three couples.",
    touristType: ["Three couples", "Groups of friends", "American charterers"],
    whyTitle: "Why six is the easiest brief on the list",
    whyBody:
      "**Three couples fit almost everything.** The 15 metre catamarans carry four cabins, so three couples have a spare; the 20 to 23 metre motor yachts carry three, built for exactly this party; the 24 to 27 metre motor yachts and the 20 metre catamarans carry four, with a chef on every 20 metre catamaran and from 27 metres on the motor yachts, so three couples travel at ease. The question is not which yacht fits but which holiday: the entry catamaran at about EUR 22,000 all in, a three-cabin motor yacht at EUR 33,000 to 45,000, or a chef and a jacuzzi at EUR 40,000 to 68,000. " +
      "**Where the brief goes wrong.** Three couples want three doubles, and the third cabin on some three-cabin motor yachts is a twin with bunks, meant for children. A proposal that does not say which is which is not finished; this house's does. " +
      "**What this house writes for six.** Three yachts across those three tiers, so the party can see what each step buys, with the base, the APA at the type's rate estimated for the route, the VAT at the yacht's rate and the gratuity range on each, within twenty-four hours, and the week in the Saronic, the Cyclades or the Ionian drawn to the month.",
    bestFor: [
      "Three couples who want three doubles and a chef",
      "Friends in their fifties who want a motor yacht and the flybridge",
      "Three couples on a first charter in the Saronic",
      "An American party that wants the three tiers side by side in dollars",
    ],
    yachtFilter: '_type == "yacht" && sleeps >= 6 && sleeps <= 10',
    yachtsHeadline: "The yachts this house proposes for six",
    featuredHeading: "A selection",
    whenTitle: "When the yachts for six go for 2027",
    whenBody: "The four-cabin motor yachts and the 20 metre catamarans with a chef are the most requested yachts on the list for July and August. " + WHEN_2027,
    insiderTips: [
      "Ask for three doubles in writing; the third cabin on a three-cabin motor yacht is the one to check.",
      "On a four-cabin yacht the spare cabin is the dressing room; it is not wasted.",
      "A chef from 20 metres is the step that changes the week most for three couples who eat well.",
      "The gratuity is on the base, 10 to 15 percent, decided on the last day; six guests usually split it three ways.",
    ],
    faq: [
      { q: "How much is a yacht charter in Greece for 6 guests?", a: "From about EUR 22,000 a week all in on a 15 metre crewed catamaran with a cabin to spare; EUR 33,000 to 45,000 all in on a three-cabin motor yacht built for six; EUR 40,000 to 68,000 on a 20 metre catamaran or a 24 to 27 metre motor yacht with a chef. Per yacht, never by the head." },
      { q: "Which yachts are built for six guests?", a: "The 20 to 23 metre motor yachts with three cabins; and the four-cabin yachts, the 15 metre catamarans, the 24 to 27 metre motor yachts and the 20 metre catamarans with a chef, where three couples have a spare." },
      { q: "Will three couples each have a double cabin?", a: "On the four-cabin yachts, yes; on the three-cabin motor yachts the third is sometimes a twin, and this house says which in the proposal." },
      { q: "Does the price change with six rather than eight?", a: "No; it is per yacht per week. The food line of the APA is smaller for six; the fuel and the berths are the yacht's." },
      { q: "Where should three couples go?", a: "The Saronic for a first week, Hydra and Spetses; the Cyclades on a motor yacht for the islands; the Ionian on a catamaran for the sailing." },
      { q: "How do we start?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates; three yachts across the three tiers with the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "Three couples, three tiers, in writing.",
  }),

  answerPage({
    slug: "yacht-charter-greece-for-8-guests",
    eyebrow: "Four couples, or two families",
    h1: "How Much Is a Yacht Charter in Greece for 8 Guests?",
    tagline: "Eight is the number the Greek crewed fleet is built around: four cabins, one price, the entry catamaran at EUR 17,000 base and everything above it.",
    quickAnswer: {
      question: "How much is a yacht charter in Greece for 8 guests?",
      answer:
        "A fully crewed yacht charter in Greece for eight guests costs from about EUR 22,000 a week all in. " + ENTRY_LINE + ", four cabins for four couples or two families, one price per yacht. The 16 to 19 metre catamarans for eight to ten run EUR 18,900 to 34,500 base; the 20 metre catamarans with a chef and a foredeck jacuzzi EUR 31,500 to 48,000 base, about EUR 40,000 to 68,000 all in with the APA at 20 to 30 percent on a catamaran; the 24 to 27 metre motor yachts with four cabins, a chef from 27 metres, EUR 28,000 to 45,000 base, about EUR 39,000 to 68,000 all in with the APA at 30 to 40 percent on a motor yacht; the 24 metre Sunreef and Fountaine Pajot 80s EUR 56,000 to 90,000. " + REACH,
    },
    keyFacts: [
      "Eight is the fleet's number: four double cabins is the standard layout from the 15 metre catamarans to the 27 metre motor yachts, and eight guests share one price per yacht",
      "The entry week, worked for eight: EUR 17,000 base + APA at 20 to 25 percent on a sailing catamaran + VAT at 5.2 percent = about EUR 21,300 to 22,100 all in, before a gratuity of EUR 1,700 to 2,550",
      "The catamaran ladder for eight: 15 metres from EUR 17,000; 16 to 19 metres EUR 18,900 to 34,500; 20 metres with a chef EUR 31,500 to 48,000; 24 metres with a crew of four or five EUR 56,000 to 90,000",
      "The motor yacht ladder for eight: 20 metres from EUR 17,500; 24 metres with four cabins EUR 28,000 to 39,500; 27 metres with a chef EUR 35,900 to 45,000; 33 metres from EUR 49,000",
      "Four couples want four doubles; two families want two doubles and two twins; the layouts differ, and the proposal names them",
      "Weekly, fully crewed, any day of the week from Athens, Corfu or Lefkada; up to twelve guests by law",
    ],
    seoTitle: "Yacht Charter in Greece for 8 Guests: Four Cabins, One Price",
    seoDescription: "What a crewed yacht charter in Greece costs for eight guests: from about EUR 22,000 a week all in on the entry catamaran, one price per yacht.",
    touristType: ["Four couples", "Two families", "American charterers"],
    whyTitle: "Why eight is the number, and how to climb the ladder",
    whyBody:
      "**Four cabins is the Greek standard.** The crewed fleet was built for eight: the 15 metre Lagoons and Balis with four doubles and a crew of two, the 20 metre Fountaine Pajots with four or five and a chef, the 24 to 27 metre Ferrettis and Pershings with four and a crew of four. Eight guests fit almost every yacht on the list, and the question is the holiday, not the fit. " +
      "**The ladder, honestly.** The entry catamaran at about EUR 22,000 all in is a real week: four doubles, a captain and a cook-hostess, the Saronic or the western Cyclades. The 16 to 19 metre catamarans add a fifth cabin and a foredeck lounge. At 20 metres a chef and a jacuzzi come aboard and the week changes character, about EUR 40,000 to 68,000 all in. The 24 to 27 metre motor yachts bring the flybridge, the speed and a crew of four for the same money, with the APA at 30 to 40 percent on a motor yacht against 20 to 30 on a catamaran. The 24 metre catamarans with a crew of five are the top of the list for eight. " +
      "**What this house writes for eight.** Three yachts across the rungs the party is considering, with four doubles or two doubles and two twins as the party needs, the base, the APA at the type's rate, the VAT and the gratuity range on each, within twenty-four hours.",
    bestFor: [
      "Four couples who want four equal doubles",
      "Two families with two children each, in two doubles and two twins",
      "A party of friends climbing from the entry catamaran to the chef",
      "Americans who want the ladder in dollars",
    ],
    yachtFilter: '_type == "yacht" && sleeps >= 8 && sleeps <= 10',
    yachtsHeadline: "The yachts this house proposes for eight",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the four-cabin yachts go for 2027",
    whenBody: "The four-cabin catamarans and motor yachts are the most requested yachts in Greece and their July and August weeks go first; the entry catamarans for EUR 17,000 base are the first of all. " + WHEN_2027,
    insiderTips: [
      "Four couples: ask for four doubles in writing; on some four-cabin yachts the fourth is a twin.",
      "Two families: ask for two doubles and two twins, and for the twins next to each other.",
      "The APA for eight is the yacht's; the food line scales, the fuel and the berths do not.",
      "The gratuity is on the base, 10 to 15 percent; eight guests usually split it four ways.",
    ],
    faq: [
      { q: "How much is a yacht charter in Greece for 8 guests?", a: "From about EUR 22,000 a week all in on a 15 metre crewed catamaran with four cabins; EUR 40,000 to 68,000 all in on a 20 metre catamaran or a 24 to 27 metre motor yacht with a chef; the 24 metre catamarans EUR 56,000 to 90,000 base. Per yacht, never by the head." },
      { q: "Do eight guests pay more than six?", a: "No; the price is per yacht per week. Eight guests share the same figure six would pay, and the only line that grows is the food in the APA." },
      { q: "Which yachts carry eight?", a: "Almost every yacht on the list: the 15 metre catamarans with four doubles, the 20 metre catamarans with four or five cabins and a chef, the 24 to 27 metre motor yachts with four cabins, the 24 metre catamarans with four to six." },
      { q: "Four doubles or two doubles and two twins?", a: "Both layouts exist; four couples need the first, two families the second, and this house names the layout in the proposal." },
      { q: "Where should eight go?", a: "The Saronic from Athens for a first week; the western Cyclades on a catamaran; the Mykonos loop on a motor yacht; the Ionian from Lefkada for families." },
      { q: "How do we start?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and whether you are four couples or two families; three yachts with the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "Four cabins, one price, in writing.",
  }),

  answerPage({
    slug: "yacht-charter-greece-for-12-guests",
    eyebrow: "The legal maximum",
    h1: "How Much Is a Yacht Charter in Greece for 12 Guests?",
    tagline: "Twelve is the most a charter yacht in Greece may carry, and the yachts that do are a short list: six cabins, a chef, a crew of five to eight. What they cost, and why there is no thirteenth.",
    quickAnswer: {
      question: "How much is a yacht charter in Greece for 12 guests?",
      answer:
        "A fully crewed yacht charter in Greece for twelve guests, the legal maximum on a charter yacht, costs from about EUR 60,000 a week all in. The 30 metre Admiral 101 with six cabins at EUR 45,000 base, plus the APA at 30 to 40 percent on a motor yacht and Greek VAT from 5.2 percent, is the entry; the Fountaine Pajot 80 power catamaran with six cabins at EUR 70,000 to 90,000 base about EUR 88,000 to 128,000 all in with the APA at 20 to 30 percent on a catamaran; the 33 to 39 metre motor yachts with five or six cabins for twelve EUR 55,000 to 115,000 base; the 47 metre Picchiotti with six cabins EUR 120,000 to 140,000. Twelve guests share one price per yacht; a thirteenth cannot board, by law, on any charter yacht but the one 64 metre on the list certified for more. " + REACH,
    },
    keyFacts: [
      "Twelve is the law: a charter yacht in Greece, as across the Mediterranean, may carry twelve guests at most unless certified as a passenger ship; the twelve-passenger rule, not the broker, sets the limit",
      "The six-cabin yachts for twelve on this list: an Admiral 101 at EUR 45,000 base, a Tecnomar 116 at EUR 80,000, a Cantieri di Pisa 125 at EUR 85,000, a Picchiotti 156 at EUR 120,000, and a Fountaine Pajot 80 power catamaran at EUR 70,000 to 90,000",
      "The five-cabin yachts for twelve, with a cabin that sleeps three or a Pullman: a Ferretti 90 at EUR 54,000, a Bugari 112 at EUR 55,000, a Cantieri di Pisa 110 at EUR 72,000, a Maiora 126 at EUR 98,000, a Couach 164 at EUR 180,000",
      "All in on the EUR 45,000 entry: APA at 30 to 40 percent on a motor yacht (EUR 13,500 to 18,000) plus VAT at 5.2 to 12 percent (EUR 2,340 to 5,400) = EUR 61,000 to 68,000, before a gratuity of EUR 4,500 to 6,750; twelve guests share it",
      "A crew of five to eight: a chef, a stewardess or two, a captain, a mate and a deckhand; the week for twelve is a hotel with a tender",
      "More than twelve: the 64 metre on this list is certified for 49 and is the one answer; two yachts side by side is the other, and this house writes it",
    ],
    seoTitle: "Yacht Charter in Greece for 12 Guests: Six Cabins, the Legal Maximum",
    seoDescription: "What a crewed yacht charter in Greece costs for twelve guests, the legal maximum: from about EUR 60,000 a week all in on a six-cabin motor yacht.",
    touristType: ["Large families", "Six couples", "Milestone celebrations"],
    whyTitle: "Why twelve, and what the yachts for twelve are like",
    whyBody:
      "**The number is the law's, not ours.** A yacht carrying more than twelve passengers is a passenger ship under the international conventions, with the construction, the crewing and the certification that implies, and almost no charter yacht is built to it. So twelve is the ceiling on every yacht on this list but one, the 64 metre certified for 49, and a party of thirteen is either that yacht or two yachts cruising together, which this house writes and which is a better week than it sounds. " +
      "**Six cabins is the yacht for twelve.** The Admiral 101 at 30 metres is the entry, six cabins for twelve at EUR 45,000 base, which twelve guests share as one price for the week. Above it, the Tecnomar 116 and the Cantieri di Pisa 125 at 36 to 38 metres, the Fountaine Pajot Power 80 for a party that wants a catamaran, and the Picchiotti at 47 metres with a crew of ten. The five-cabin yachts carry twelve with a triple or a Pullman, which suits a family with children better than six couples. " +
      "**What this house writes for twelve.** The six-cabin yachts against the five-cabin ones, with who sleeps where, the base, the APA at the type's rate estimated for the route, the VAT at the yacht's rate and the gratuity range for a crew of five to eight, within twenty-four hours.",
    bestFor: [
      "Six couples who each want a double",
      "A large family with grandparents and grandchildren across six cabins",
      "A fiftieth or a sixtieth on the water for twelve",
      "A party of thirteen or more who need to hear about the two-yacht week",
    ],
    yachtFilter: SIX_CABIN,
    yachtsHeadline: "The yachts on the list that carry twelve",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the yachts for twelve go for 2027",
    whenBody: "There are few six-cabin yachts and every large family wants August; they are contracted a year ahead, and September is the open month. " + WHEN_2027,
    insiderTips: [
      "Ask for the cabin plan with the proposal; six doubles and five cabins with a triple are different weeks.",
      "A party of thirteen on two yachts cruising together is legal, common and often happier; ask for it.",
      "The gratuity for a crew of eight is 10 to 15 percent of the base; on a EUR 80,000 week it is EUR 8,000 to 12,000.",
      "The 64 metre certified for 49 is the one yacht in Greece for a party above twelve on one hull.",
    ],
    faq: [
      { q: "How much is a yacht charter in Greece for 12 guests?", a: "From about EUR 60,000 a week all in on a 30 metre motor yacht with six cabins at EUR 45,000 base; the Fountaine Pajot 80 power catamaran EUR 88,000 to 128,000 all in; the 33 to 39 metre yachts EUR 55,000 to 115,000 base; the 47 metre Picchiotti EUR 120,000 to 140,000. Per yacht, shared by twelve." },
      { q: "Can a charter yacht in Greece take more than 12 guests?", a: "Not unless certified as a passenger ship, which almost none are; the 64 metre on this list is certified for 49. For thirteen or more the usual answer is two yachts cruising together." },
      { q: "Which yachts have six cabins?", a: "On this list an Admiral 101, a Tecnomar 116, a Cantieri di Pisa 125, a Picchiotti 156 and a Fountaine Pajot Power 80; several five-cabin yachts carry twelve with a triple or a Pullman." },
      { q: "What crew comes with a yacht for 12?", a: "Five to eight: a captain, a mate, a deckhand, a chef and one or two stewardesses, rising to ten on the 47 metre." },
      { q: "Does the price change with twelve aboard?", a: "No; the price is per yacht and twelve guests share it. The entry six-cabin yacht is about EUR 61,000 to 68,000 all in for the week, however many of her berths are used." },
      { q: "How do we start?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; the six-cabin yachts open for your week with the all-in figure come back within twenty-four hours." },
    ],
    ctaTitle: "Six cabins for twelve, in writing.",
  }),

  answerPage({
    slug: "do-you-need-a-licence-to-charter-a-yacht-in-greece",
    eyebrow: "The question before the brochure",
    h1: "Do You Need a Licence to Charter a Yacht in Greece?",
    tagline: "For a crewed yacht, no: the captain holds it. For a bareboat, yes, and a second qualified person besides. The rule, and what it means for the week you want.",
    quickAnswer: {
      question: "Do you need a licence to charter a yacht in Greece?",
      answer:
        "No licence is needed for a crewed yacht in Greece: the captain holds it, and a crewed week starts from EUR 17,000 per yacht. You do not need a licence to charter a crewed yacht in Greece: the captain holds the licence and the responsibility, and the guests hold nothing but a passport. You do need one for a bareboat, a yacht you sail yourself, where Greek regulation requires the skipper to hold a recognised sailing certificate and a second competent crew member to be declared on the crew list. Every yacht this house writes is fully crewed and weekly, from about EUR 22,000 all in, " + ENTRY_LINE + ", with a captain and at least one more crew aboard. " + REACH,
    },
    keyFacts: [
      "Crewed charter: no licence of any kind is required of the guests; the captain is a licensed professional and the yacht's papers are the owner's",
      "Bareboat charter: the skipper must hold a recognised sailing certificate, an ICC, an RYA Day Skipper or a national equivalent, and a second competent crew member must be declared on the crew list; the port authority checks both on departure",
      "What the guests bring on a crewed yacht: passports for the crew list, which the captain files with the port authority before departure, and nothing else",
      "A sailor among the guests may usually take the helm on a crewed yacht in open water, at the captain's discretion; the responsibility and the licence stay the captain's",
      "George P. Biniaris, the broker of this house, is a licensed sailing skipper with a powerboat licence valid to 25 metres; the yachts he writes are run by their own professional captains",
      "Every charter from this house is fully crewed and weekly, from Athens, Corfu or Lefkada on any day you choose; one price per yacht, never by the head",
    ],
    seoTitle: "Do You Need a Licence to Charter a Yacht in Greece? Crewed vs Bareboat",
    seoDescription: "Whether you need a licence to charter a yacht in Greece: no for a crewed yacht, where the captain holds it; yes for a bareboat. What a crewed week costs.",
    touristType: ["First-time charterers", "American charterers", "Families"],
    whyTitle: "Why the licence question answers itself once you choose the week",
    whyBody:
      "**A crewed yacht asks nothing of you.** The captain is licensed, insured and responsible; the crew list is his paperwork; the guests are guests. An American family that has never set foot on a boat charters a 20 metre catamaran with a chef on the same terms as a family of sailors, and the week is the same holiday. That is the product this house writes, and the licence question does not arise. " +
      "**A bareboat asks a great deal.** Greek regulation requires the skipper of a bareboat to hold a recognised certificate, and a second person aboard to be competent and declared; the port police check the papers before the lines are cast off and the charter company checks them before the deposit. An American licence or an RYA certificate is accepted; experience without paper is not. It is the market for people who sail, and it is a different market from this one. " +
      "**The crewed week is the one this house writes.** From EUR 17,000 base for a 15 metre catamaran for eight, the holiday is yours and the work is the crew's: the captain holds the licence, the cook-hostess holds the galley, and a sailor among the guests may take the helm in open water when the captain says so.",
    bestFor: [
      "Families with no sailing experience who want a yacht anyway",
      "Americans who were told they need an ICC and want the truth",
      "Sailors deciding between a bareboat and a crewed week",
      "Anyone who wants to be a guest rather than a skipper",
    ],
    yachtFilter: ALL_FILTER,
    yachtsHeadline: "The fully crewed yachts this house represents",
    featuredHeading: "A selection, largest first",
    whenTitle: "When to book a crewed week for 2027",
    whenBody: "No licence, no course, no waiting: the only lead time is the yacht's calendar. " + WHEN_2027,
    insiderTips: [
      "Bring passports; the captain files the crew list with the port authority before departure and that is the whole of your paperwork.",
      "A sailor who wants to take the helm on a crewed yacht usually may, at the captain's discretion; ask.",
      "For a bareboat, an ICC or an RYA Day Skipper is the common currency; a US state boating card is not always accepted.",
      "A bareboat is a different market and not one this house brokers; every week it writes has a professional captain aboard.",
    ],
    faq: [
      { q: "Do you need a licence to charter a yacht in Greece?", a: "Not for a crewed yacht, where the licensed captain is responsible and the guests need only passports. For a bareboat, yes: a recognised sailing certificate for the skipper and a second competent crew member declared on the crew list." },
      { q: "What licence is needed for a bareboat in Greece?", a: "A recognised sailing certificate, an ICC, an RYA Day Skipper or a national equivalent, for the skipper, and a second competent person declared; the port authority checks both before departure." },
      { q: "Can I take the helm on a crewed yacht?", a: "Usually, at the captain's discretion and in open water; the responsibility stays his." },
      { q: "Does this house arrange bareboats?", a: "No; a bareboat is not something this house brokers. Every yacht it writes is fully crewed and weekly, with a professional captain and at least one more crew aboard." },
      { q: "What paperwork do guests need on a crewed yacht?", a: "Passports for the crew list, which the captain files with the port authority; nothing else." },
      { q: "How do I book a crewed week?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with their captains and the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "No licence, no course, a captain. In writing.",
  }),

  answerPage({
    slug: "how-much-is-a-yacht-charter-in-greece-in-us-dollars",
    eyebrow: "In dollars",
    h1: "How Much Is a Yacht Charter in Greece in US Dollars?",
    tagline: "The contracts are in euros. Here is the week in dollars at the day's rate, from the entry catamaran to the 120 foot motor yacht, with the date of the rate written down.",
    quickAnswer: {
      question: "How much is a yacht charter in Greece in US dollars?",
      answer:
        "A fully crewed yacht charter in Greece costs from about USD 24,800 a week all in, EUR 22,000 at the European Central Bank rate of 6 October 2026. The entry is a 15 metre crewed catamaran for 8 guests at EUR 17,000 base. A fully crewed yacht charter in Greece costs from about USD 24,800 a week all in " + USD_NOTE + ": the entry is a 15 metre crewed catamaran for eight at EUR 17,000 base, about USD 19,200, and about EUR 22,000 all in with the APA at 20 to 25 percent on a sailing catamaran and Greek VAT from 5.2 percent. A 20 metre crewed motor yacht is about USD 27,000 all in; a 20 metre catamaran with a chef about USD 45,000 to 51,000; a 27 metre motor yacht with a chef about USD 56,000; a 100 foot motor yacht USD 55,000 to 129,000; a 120 foot motor yacht USD 92,000 to 257,000. The contract and the invoice are in euros, and the dollar figure moves with the rate between the proposal and the payment; this house quotes both and names the day. " + REACH,
    },
    keyFacts: [
      "The rate used on this page: USD 1 = EUR 0.887, the European Central Bank reference rate of 6 October 2026; every dollar figure below is a euro figure divided by it",
      "The entry week: EUR 17,000 base, about USD 19,200; about EUR 22,000 all in, USD 24,800, for a 15 metre crewed catamaran for eight; one price per yacht, never by the head",
      "The ladder in dollars, all in: a 20 metre motor yacht about USD 27,000; a 20 metre catamaran with a chef USD 45,000 to 51,000; a 27 metre motor yacht about USD 56,000; a 24 metre catamaran with a crew of five USD 71,000 to 144,000; a 120 foot motor yacht USD 92,000 to 257,000",
      "How it is paid: in euros, by bank transfer, fifty percent on signing the MYBA agreement and the balance with the VAT and the APA forty-five days before boarding on this house's proposals; the dollar cost is whatever the rate is on each day",
      "George Yachts Brokerage House LLC is a United States company, registered in Wyoming, with its brokerage desk in Athens; the proposal shows euros and dollars side by side and names the rate used",
      "The gratuity of 10 to 15 percent of the base is customary and at your discretion, handed to the captain in cash on the last day, in euros or dollars",
    ],
    seoTitle: "Yacht Charter in Greece in US Dollars: The Week at Today's Rate",
    seoDescription: "What a crewed yacht charter in Greece costs in US dollars at the ECB rate of 6 October 2026: from about USD 24,800 a week all in on the entry catamaran.",
    touristType: ["American charterers", "American families", "First-time charterers"],
    whyTitle: "Why the contract is in euros, and how to think in dollars anyway",
    whyBody:
      "**The owners are paid in euros.** The crewed yachts of Greece belong to European owners and their rate cards are in euros; the MYBA agreement, the VAT invoice and the APA account are in euros; the captain buys diesel in euros. A dollar price is a translation, and an honest one says which day it was made. This page uses the European Central Bank reference rate of 6 October 2026 and says so; the proposal from this house uses the rate of the day it is written and says that too. " +
      "**What moves and what does not.** The euro figure is fixed by the contract. The dollar cost of the deposit is set on the day the wire goes; the dollar cost of the balance on the day it goes, forty-five days before boarding; the difference between the two is the exchange rate's, not the owner's or the broker's. A party that wants certainty buys euros when the proposal is accepted; a party that does not simply watches the rate. " +
      "**The United States company.** George Yachts Brokerage House LLC is registered in Wyoming, which means a United States counterparty and a United States address for the paperwork, with the brokerage desk in Athens and the broker on the quay. The proposal arrives with the euros and the dollars side by side, so the number you decide on is the number you understand.",
    bestFor: [
      "American families budgeting a first Greek week in dollars",
      "Parties comparing Greece against the Caribbean on the same currency",
      "Anyone who wants the deposit and the balance explained before the wire",
      "Americans who want a United States company behind the contract",
    ],
    yachtFilter: ALL_FILTER,
    yachtsHeadline: "The crewed yachts this house represents",
    featuredHeading: "A selection, largest first",
    whenTitle: "When to decide for 2027, in dollars",
    whenBody: "The rate moves; the yacht's calendar moves faster. " + WHEN_2027,
    insiderTips: [
      "Ask for the proposal in euros and dollars with the rate and its date; a dollar figure without a date is a guess.",
      "The deposit and the balance are wired on different days at different rates; budget the balance at a little above today's rate.",
      "The gratuity can be given in dollars; the crew will not mind the currency.",
      "Compare Greece against the Caribbean on the all-in week, not the base; the VAT and the APA differ by sea.",
    ],
    faq: [
      { q: "How much is a yacht charter in Greece in US dollars?", a: "From about USD 24,800 a week all in for a 15 metre crewed catamaran for eight " + USD_NOTE + "; about USD 27,000 for a 20 metre motor yacht; USD 45,000 to 51,000 for a 20 metre catamaran with a chef; USD 92,000 and up for a 120 foot motor yacht. Per yacht, never by the head." },
      { q: "Can I pay for a Greek yacht charter in dollars?", a: "The contract and the invoice are in euros and are paid by bank transfer; your bank converts the dollars on the day of each wire. This house quotes both currencies and names the rate." },
      { q: "When is the money due?", a: "Fifty percent on signing the MYBA agreement and the balance with the VAT and the APA forty-five days before boarding, on this house's proposals." },
      { q: "Is George Yachts an American company?", a: "George Yachts Brokerage House LLC is registered in Wyoming, United States, with its brokerage desk in Athens." },
      { q: "Does the exchange rate change the price?", a: "The euro price is fixed by the contract; the dollar cost of each payment is set by the rate on the day it is wired." },
      { q: "How do I get a quote in dollars?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the dates and the party; two or three real yachts with the all-in week in euros and dollars, and the rate named, come back within twenty-four hours." },
    ],
    ctaTitle: "The week in dollars, with the date on the rate.",
  }),

  answerPage({
    slug: "what-is-the-cheapest-month-to-charter-a-yacht-in-greece",
    eyebrow: "The calendar and the card",
    h1: "What Is the Cheapest Month to Charter a Yacht in Greece?",
    tagline: "May, June and September are 15 to 25 percent below the July and August rate on most cards, and two of them have the better weather. The month, the number, and the catch.",
    quickAnswer: {
      question: "What is the cheapest month to charter a yacht in Greece?",
      answer:
        "The cheapest months to charter a crewed yacht in Greece are May, June and September, 15 to 25 percent below the July and August peak. On the entry catamaran that is a week from EUR 17,000 base, about EUR 22,000 all in. September is the month to choose: the sea is at its warmest, the Meltemi is gone and the islands are quiet. May is the cheapest with the coolest water; June is the calm before the season. October weeks exist on request as the yachts come home. One price per yacht, never by the head. " + REACH,
    },
    keyFacts: [
      "The step-down: May, June and September run 15 to 25 percent below the July and August rate on most cards this house holds; July and August are the same peak rate on nearly all of them",
      "The entry catamaran in the cheap months: EUR 17,000 base becomes about EUR 12,750 to 14,450, and the all-in week about EUR 16,000 to 19,000 for eight guests",
      "September: the sea at 25 to 26 degrees, the warmest of the year; the Meltemi fades in the first week; the second half of the month carries the step-down on most cards; the owners' own month",
      "June: the calm before the Meltemi, 22 to 24 degrees in the water, long days, the islands open and not yet full; the first half is the quieter",
      "May: the cheapest, with the water at 19 to 21 degrees and the wildflowers on the islands; the Saronic and the Ionian are the May grounds; some crews are still fitting out in the first week",
      "The catch: the cheap months are the good months, and the five-cabin catamarans with a chef go for September nearly as early as for August; six to nine months ahead is the honest lead time",
    ],
    seoTitle: "Cheapest Month to Charter a Yacht in Greece: May, June, September",
    seoDescription: "The cheapest months to charter a crewed yacht in Greece, May, June and September at 15 to 25 percent below peak on most cards, and why September wins.",
    touristType: ["Couples without school dates", "Value-minded charterers", "Repeat charterers"],
    whyTitle: "Why the cheap months are the good months",
    whyBody:
      "**The rate cards follow the school calendar, not the sea.** July and August are peak because families can only travel then; the owners price it so. The sea does not know: it is warmest in September, calmest in June, and the islands in both are what they were before the crowds. A party without school dates who charters in July is paying a premium for weather that September has more of. " +
      "**The three months, honestly.** September is the month this house recommends to anyone who can take it: the warmest water, the Meltemi gone by the second week, Mykonos and Santorini with room, the crews at the top of their season, and the step-down on most cards from mid-month. June is the calm before: the water a few degrees cooler, the days longest, the Cyclades before the wind. May is the cheapest and the greenest, with the water at 19 to 21 degrees, the Saronic and the Ionian at their best and the Cyclades still cool; some crews are fitting out in the first week. October exists on request as the yachts come home and the weather turns; it is not a month to plan a first charter around. " +
      "**What this house writes for the cheap months.** The yacht's September or June rate from her own card, not a percentage guessed, the APA at the type's rate, the VAT, the gratuity range, and the honest note that the five-cabin catamarans with a chef go for September nearly as early as for August.",
    bestFor: [
      "Couples and friends without school dates",
      "Repeat charterers who have done August and want the better month",
      "Value-minded parties who want the entry week under EUR 20,000 all in",
      "Americans who can travel in September and want the warmest water in the Mediterranean",
    ],
    yachtFilter: ALL_FILTER,
    yachtsHeadline: "The crewed yachts this house represents",
    featuredHeading: "A selection, largest first",
    whenTitle: "When the cheap months go",
    whenBody: "September on the most requested yachts goes nearly as early as August; June and May hold longer and are decided three to six months ahead. " + WHEN_2027,
    insiderTips: [
      "Ask for the yacht's own September rate from her card; the 15 to 25 percent is most cards, not all.",
      "The second half of September carries the step-down on most cards; the first half is often at peak.",
      "May is for the Saronic and the Ionian; the Cyclades water is still cool.",
      "A September week on a five-cabin catamaran with a chef is decided in the winter, not the spring.",
    ],
    faq: [
      { q: "What is the cheapest month to charter a yacht in Greece?", a: "May, June and September, at 15 to 25 percent below the July and August rate on most cards; on the entry catamaran that is about EUR 16,000 to 19,000 all in for the week instead of about EUR 22,000. September has the best weather of the three." },
      { q: "Is September cheaper than August?", a: "On most cards the second half of September is 15 to 25 percent below the July and August rate; the first half is often at or near peak." },
      { q: "Is May too cold for a yacht charter in Greece?", a: "The water is 19 to 21 degrees, cool for swimming by Greek standards; the Saronic and the Ionian are the May grounds and the islands are green. June is the first warm month." },
      { q: "Can I charter in October?", a: "On request, as the yachts come home; the weather turns late in the month and some crews stand down. It is not the month for a first charter." },
      { q: "Do the cheap months book up?", a: "September on the five-cabin catamarans with a chef goes nearly as early as August; June and May hold longer." },
      { q: "How do I get a September quote?", a: "WhatsApp " + WHATSAPP_US + " or george@georgeyachts.com with the week and the party; two or three real yachts with their own September rate and the all-in week come back within twenty-four hours." },
    ],
    ctaTitle: "September, at the September rate, in writing.",
  }),
];
