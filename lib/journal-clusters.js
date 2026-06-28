// F.4 (Roberto brief, May 2026) — Topic-cluster definitions for the
// /journal/[cluster] landing pages.
//
// Each cluster groups 3-5 articles + a yacht filter that selects 3+
// matching yachts at render time. The cluster pages boost SEO topical
// authority and give blog readers a path to dig deeper.
//
// Article slugs are exact post.slug values from Sanity. Yacht selectors
// are GROQ filters applied to the live fleet (so the cluster pages
// stay in sync as inventory changes).

export const JOURNAL_CLUSTERS = [
  {
    slug: "cyclades-charters",
    title: "Cyclades Charters",
    eyebrow: "The Aegean Heartland",
    intro:
      "The Cyclades - Mykonos, Santorini, Paros, Naxos, Folegandros - are why most charter clients come to Greece in the first place. Here's everything you'll want to know before you sail them.",
    articles: [
      "the-7-day-cyclades-itinerary-what-your-captain-won-t-tell-you-until-you-re-onboard",
      "hushpitality-greek-yacht-charter-quiet-luxury-2026",
      "12-passenger-rule-greek-yacht-charter-groups-of-14",
      "airport-hell-2026-skip-terminal-yacht-charter-greece",
    ],
    yachtFilter: 'cruisingRegion match "*Cyclades*" || cruisingRegion match "*Greece*"',
    cta: {
      headline: "Build a Cyclades charter that's actually yours",
      sub: "Tell George what week you're thinking about and how big your group is - he'll come back with two yachts that fit and one alternative he thinks you haven't considered.",
    },
  },
  {
    slug: "saronic-charters",
    title: "Saronic Gulf Charters",
    eyebrow: "Athens to Hydra in 5 Days",
    intro:
      "The Saronic Gulf is the case for not flying connecting flights. You land at Athens, you're aboard within 45 minutes, and the first swim is happening before you finish unpacking. Here's how the closest cruising ground to Athens works.",
    articles: [
      "the-saronic-gulf-the-5-day-crewed-charter-that-starts-where-you-land",
      "12-passenger-rule-greek-yacht-charter-groups-of-14",
      "what-happens-crewed-yacht-charter-greece-hour-by-hour",
    ],
    yachtFilter: 'cruisingRegion match "*Saronic*" || cruisingRegion match "*Greece*"',
    cta: {
      headline: "5 days, 4 islands, 0 connecting flights",
      sub: "George's Saronic clients usually book one weekend on a whim and another for September. If you're flying into Athens already, the math is hard to argue with.",
    },
  },
  {
    slug: "family-yachting",
    title: "Family Yachting in Greece",
    eyebrow: "For Families of 6 to 14",
    intro:
      "Multi-generational charters are where most of the questions get interesting - yacht size, cabin layout, the 12-passenger rule, the trade-off between a 5-star hotel and a private week at sea. Here's the family-specific reading list.",
    articles: [
      "yacht-charter-vs-5-star-hotel-greece-family-2026",
      "12-passenger-rule-greek-yacht-charter-groups-of-14",
      "the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece",
      "what-happens-crewed-yacht-charter-greece-hour-by-hour",
    ],
    yachtFilter: 'sleeps in ["8","9","10","11","12"]',
    cta: {
      headline: "A yacht that sleeps your whole family",
      sub: "Tell George the ages of the kids, the size of the group, and which week of summer you're holding - he'll match you to three yachts where everyone gets the right cabin.",
    },
  },
  {
    slug: "first-time-charterers",
    title: "First-Time Charter Guide",
    eyebrow: "Everything Before You Book",
    intro:
      "If you've never booked a crewed yacht before, the entire vocabulary is new - APA, MYBA contracts, gulet vs. catamaran, the booking-to-boarding sequence. Start here.",
    articles: [
      "the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece",
      "yacht-charter-booking-process-greece-what-happens-after-you-book",
      "what-happens-crewed-yacht-charter-greece-hour-by-hour",
      "the-eur50-000-mistake-what-goes-wrong-when-you-book-a-yacht-charter-without-a-broker",
      "motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece",
    ],
    yachtFilter: 'fleetTier == "private"',
    cta: {
      headline: "Talk to George before you book anywhere",
      sub: "First charters tend to come with one or two assumptions that turn out to be wrong. A 30-minute call usually saves enough money to pay for the call ten times over.",
    },
  },
  {
    slug: "yacht-charter-pricing",
    title: "Costs & Pricing",
    eyebrow: "Real Numbers, No Spin",
    intro:
      "What does a week in Greece actually cost - yacht fee, APA, VAT, tip, fuel, food? When does August beat September? When does September beat August? These articles answer with numbers, not adjectives.",
    articles: [
      "how-much-does-yacht-charter-greece-cost-complete-breakdown",
      "yacht-charter-vs-5-star-hotel-greece-family-2026",
      "august-or-september-greek-yacht-charter-shoulder-season-2026",
      "the-eur50-000-mistake-what-goes-wrong-when-you-book-a-yacht-charter-without-a-broker",
    ],
    yachtFilter: '_type == "yacht"',
    cta: {
      headline: "Get exact pricing for your week",
      sub: "These ranges are honest but generic. The exact figure depends on your dates, your group, and which yacht. George turns those three inputs into one number - usually within the day.",
    },
  },
  {
    slug: "geopolitics-and-2026",
    title: "Geopolitics & The 2026 Season",
    eyebrow: "Why Greece Is Filling Up Faster",
    intro:
      "The 2026 charter season has been reshaped by airport collapse, the Strait of Hormuz, oil shocks, and the Dubai-to-Aegean exodus. George's reading on what these events mean for charter availability and pricing.",
    articles: [
      "world-on-fire-yacht-charter-greece-2026",
      "airport-hell-2026-skip-terminal-yacht-charter-greece",
      "dubai-exodus-yacht-charter-greece-2026",
      "oil-spike-smart-money-yacht-charter-greece",
      "the-ripple-effect-how-geopolitical-shifts-are-reshaping-the-2026-mediterranean-yacht-charter",
      "last-cabin-standing-book-crewed-yacht-greece-summer-2026",
    ],
    yachtFilter: 'fleetTier == "private"',
    cta: {
      headline: "Lock down a yacht before peak weeks vanish",
      sub: "If you're reading these articles you already understand the demand picture. Tell George your ideal week and the upper end of your group; he'll come back with what's still bookable.",
    },
  },
  {
    slug: "choosing-a-yacht",
    title: "Choosing a Yacht",
    eyebrow: "Cat, Sail, Motor, or Gulet?",
    intro:
      "The single most consequential decision after deciding to charter at all: which kind of yacht. The trade-offs aren't just about speed and stability - they're about how each platform changes the rhythm of your week.",
    articles: [
      "motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece",
      "the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece",
      "what-happens-crewed-yacht-charter-greece-hour-by-hour",
    ],
    yachtFilter: '_type == "yacht"',
    cta: {
      headline: "Don't pick a category - pick the right yacht",
      sub: "Most clients walk into the conversation thinking they want a catamaran. Half of them leave with a motor yacht and are happier for it. Tell George what matters to you; he'll tell you what kind of platform actually delivers it.",
    },
  },
];

export function getClusterBySlug(slug) {
  return JOURNAL_CLUSTERS.find((c) => c.slug === slug) || null;
}
