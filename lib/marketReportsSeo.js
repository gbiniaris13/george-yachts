// Quarterly / periodic Greek charter market reports.
//
// 2026-09-06 rewrite. The three reports below were originally shipped
// (2026-05-12) with modelled figures that the house could not stand
// behind: growth percentages, average rates, fill rates, revenue
// tables. George's instruction was to rewrite them without invented
// numbers, keep every URL, and tell the truth. So every figure that
// remains on these pages now comes from one of three places, and each
// one says which:
//
//   1. The George Yachts Greek Charter Index 2026 (lib/charterIndex2026.js):
//      the current rate cards of the fifty-eight fully crewed yachts we
//      represent, plus the lead-time and budgeting rules we quote from.
//   2. The Helm, this desk's own enquiry log, which has recorded every
//      charter request since 30 May 2026. Counts quoted are real counts
//      from that log on the date the report was revised.
//   3. Third-party publications, linked inline where a figure is theirs.
//
// Anything that is a reading of the market rather than a figure is
// written as a broker's reading and labelled as such.
//
// Data contract (unchanged, consumed by app/components/seo/MarketReport.jsx,
// app/sitemap.js, app/llms.txt, lib/markdown-serializers.js,
// lib/seoInternalLinks.js and app/market-reports):
//   slug, period, urlPath, eyebrow, h1, tagline, publishedAt,
//   reportType ("retrospective" | "snapshot" | "forecast"),
//   executiveSummary, keyFindings[], sections[{title, body, dataTable?}],
//   methodology, faq[{q, a}], seoTitle, seoDescription, canonical.
//
// Body strings are rendered as HTML: **bold** is supported, inline
// <a> tags are supported, and every sentence that starts with a capital
// after a full stop becomes its own paragraph.

import { FLEET_COUNT, CATAMARAN_COUNT, FLEET_COMPOSITION } from "@/lib/fleetCount";

const GOLD = "#DAA110";
// Fleet composition, written once in lib/fleetCount.js and never by hand here.
const FLEET_SENTENCE = `${CATAMARAN_COUNT} of the ${FLEET_COUNT} yachts we represent are catamarans, ${FLEET_COMPOSITION.sailingCat} sailing and ${FLEET_COMPOSITION.powerCat} power, against ${FLEET_COMPOSITION.motor} motor yachts`;
const src = (label, url) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:${GOLD};text-decoration:none">${label}</a>`;

const SRC = {
  gtpPorts: src(
    "GTP Headlines",
    "https://news.gtp.gr/2026/03/12/greece-to-upgrade-30-island-ports-with-e260m-investment-to-boost-yachting-sector/"
  ),
  gtpStrategy: src(
    "GTP Headlines",
    "https://news.gtp.gr/2026/02/27/greece-pushes-yachting-strategy-with-port-upgrades-and-digital-reform/"
  ),
  mys: src("Mediterranean Yacht Show", "https://www.mediterraneanyachtshow.gr/"),
  myba: src(
    "SuperYacht24, citing MYBA",
    "https://www.superyacht24.it/en/2026/04/27/da-myba-i-numeri-del-charter-di-yacht-italia-4-nel-2025-e-terza-destinazione-mondiale/"
  ),
  nj: src(
    "Northrop & Johnson",
    "https://www.northropandjohnson.com/navigator-news/charter/2026-yacht-charter-market-trends-show-last-minute-booking-surge"
  ),
  bookingMgr: src(
    "Booking Manager",
    "https://www.booking-manager.com/en/blog/state-of-the-yacht-charter-industry-2025.html"
  ),
  boataround: src(
    "Boataround",
    "https://www.boataround.com/blog/boatarounds-2024-in-numbers-sailing-trends-and-customer-insights"
  ),
  traveler: src(
    "The Traveler",
    "https://www.thetraveler.org/greece-commands-global-yacht-charter-market-in-2025/"
  ),
  gmh: src(
    "Global Maritime Hub",
    "https://globalmaritimehub.com/global-bunker-prices-surge-as-middle-east-tensions-shake-fuel-markets.html"
  ),
  mabrian: src(
    "Mabrian",
    "https://mabrian.com/blog/conflict-in-the-middle-east-diverts-global-tourism-demand-towards-the-southern-mediterranean/"
  ),
  nlr: src(
    "National Law Review",
    "https://natlawreview.com/press-releases/mediterranean-yacht-charter-demand-remains-strong-2026-despite-global"
  ),
  index: `<a href="/greek-yacht-charter-price-index-2026" style="color:${GOLD};text-decoration:none">Greek Charter Index 2026</a>`,
};

// Index band table, reused by every report. Figures are the lowest
// and highest weekly net base fee on a rate card in each band, per
// yacht per week, before VAT and APA. Source: lib/charterIndex2026.js.
const INDEX_BANDS = {
  headers: ["Yacht type and size", "Guests", "Weekly net base (EUR)", "Yachts on the Index"],
  rows: [
    ["Sailing catamaran, 12 to 16m", "8 to 10", "10,900 to 22,000", "5"],
    ["Sailing catamaran, 16 to 19m", "8 to 10", "18,900 to 27,500", "4"],
    ["Sailing catamaran, 20 to 22m", "8 to 10", "31,500 to 43,500", "7"],
    ["Sailing catamaran, 23 to 24m", "8 to 10", "56,000 to 90,000", "7"],
    ["Power catamaran, 13 to 17m", "6 to 8", "14,000 to 28,000", "2"],
    ["Power catamaran, 20 to 22m", "8 to 10", "34,000 to 69,000", "7"],
    ["Power catamaran, 23 to 24m", "6 to 12", "49,000 to 90,000", "5"],
    ["Motor yacht, 18 to 20m", "6 to 8", "17,500 to 22,900", "3"],
    ["Motor yacht, 22 to 24m", "6 to 8", "21,000 to 33,000", "2"],
    ["Motor yacht, 26 to 31m", "7 to 12", "40,000 to 65,000", "5"],
    ["Motor yacht, 35 to 40m", "10 to 12", "60,000 to 120,000", "5"],
    ["Superyacht, 50m and above", "12 to 49", "162,500 to 235,000", "2"],
    ["Sailing monohull, 24 to 31m", "8", "24,000 to 49,000", "4"],
  ],
};

const LEAD_TIME_TABLE = {
  headers: ["Season", "Lead time we recommend", "Pricing against peak"],
  rows: [
    ["July to August (peak)", "6 to 12 months; premium 40m-plus yachts a year or more ahead", "Peak rate card"],
    ["June to early July", "4 to 6 months for most yachts", "At or just under peak"],
    ["May, late September to October (shoulder)", "3 to 4 months", "15 to 25% below peak"],
  ],
};

export const MARKET_REPORTS = [
  // ─────────────────────────────────────────────────────────────
  // Q1 2026 RETROSPECTIVE
  // ─────────────────────────────────────────────────────────────
  {
    slug: "q1-2026-greek-yacht-charter-market-retrospective",
    period: "Q1 2026",
    urlPath: "/q1-2026-greek-yacht-charter-market-retrospective",
    eyebrow: "Quarterly research",
    h1: "Q1 2026 Greek Yacht Charter Market Retrospective",
    tagline:
      "What January to March 2026 told a working Athens broker about the season ahead: the public record, the rate cards, and the reading from this desk.",
    publishedAt: "2026-04-08",
    reportType: "retrospective",
    executiveSummary:
      "The first quarter of 2026 opened on a strong public record for Greece (a 24% rise in yachting demand in 2025 and 40% of Eastern Mediterranean charter bookings, per GTP Headlines), a Mediterranean that carries three quarters of world charter activity, and a fuel and geopolitical shock at the end of February that moved marine diesel and travel intent at the same time. On this desk the quarter behaved the way the rate cards say it should: the crewed catamarans and the five and six cabin boats were the first to lose their July and August weeks, and the shoulder months stayed open.",
    keyFindings: [
      `Greece entered 2026 on a documented rise: a **24% increase in yachting demand in 2025** and **40% of all Eastern Mediterranean charter bookings** (${SRC.gtpPorts}).`,
      `The Mediterranean generated **76% of global charter activity** in 2025 and global crewed bookings grew **12%**, with the 20 to 40 metre segment close to 70% of bookings (${SRC.myba}).`,
      `The Greek state committed **260 million euros to 30 island ports** through 2027, so the harbours a 2027 charter meets are being rebuilt now (${SRC.gtpPorts}).`,
      `The quarter's shock came on 28 February: marine VLSFO passed **650 US dollars a tonne** in March (${SRC.gmh}), and travel intent shifted from the Gulf toward the Southern Mediterranean (${SRC.mabrian}).`,
      `On the ${SRC.index}, the first crewed weeks to go each year are the **five and six cabin catamarans** and the peak July and August slots on the most requested yachts; that is what the desk saw again in Q1.`,
      "The crewed floor on our rate cards stayed at **EUR 10,900 a week** for a 14 metre sailing catamaran, and the shoulder months held **15 to 25% below peak**.",
    ],
    sections: [
      {
        title: "The public record Greece started 2026 with",
        body:
          `Two independent sources framed the quarter. ${SRC.gtpPorts} reported that Greece recorded a 24% increase in yachting demand in 2025 and captured 40% of all charter bookings in the Eastern Mediterranean, and that the government allocated 260 million euros across 30 island ports to upgrade yachting infrastructure through 2027. ${SRC.myba} put global crewed charter bookings up 12% in 2025, the Mediterranean at 76% of global charter activity, and the 20 to 40 metre segment at nearly 70% of all bookings. Those are the figures we would quote to a client who asked whether Greece was gaining or slipping. It was gaining, and the state was spending on the harbours.`,
      },
      {
        title: "What the rate cards said in January",
        body:
          `The crewed market in Greece prices by yacht, not by region: an owner publishes one Greece-wide rate card per boat, and the same yacht carries that card to the Cyclades, the Ionian or the Saronic. The table below is the band structure we quoted from through the quarter, taken from the current rate cards of the fifty-eight fully crewed yachts on the ${SRC.index}. Nothing in it is an average or a model; each cell is the lowest and highest figure that appears on a rate card in that band. The floor for a fully crewed week is EUR 10,900 for a 14 metre sailing catamaran, and the two yachts above 50 metres run from EUR 162,500 to EUR 235,000.`,
        dataTable: INDEX_BANDS,
      },
      {
        title: "Which weeks went first",
        body:
          "Every year the same three things disappear in the first quarter, and 2026 was no exception on this desk. First, the late July and August weeks on the most requested yachts. Second, the five and six cabin catamarans, because there are fewer of them than any brochure suggests. Third, the premium motor yachts above 40 metres, which serious clients confirm a year or more ahead. The shoulder months, May and late September to October, stayed comfortably open through March, and they price 15 to 25% below peak on the same rate card. We do not publish a fill percentage, because we do not hold the industry's calendars, only our own quotations and the owners' replies.",
        dataTable: LEAD_TIME_TABLE,
      },
      {
        title: "The 28 February shock",
        body:
          `The quarter's one genuine surprise arrived in its last days. After the Iran and Israel military operations of 28 February, marine VLSFO climbed past 650 US dollars per metric ton in March (${SRC.gmh}). For a crewed charter that lands in the APA, the Advance Provisioning Allowance, which on the yachts we represent runs 20 to 30% of the base for sailing yachts and catamarans and 30 to 40% for motor yachts, where fuel weighs heaviest. At the same time ${SRC.mabrian} recorded travel intent falling toward the Gulf states and shifting to the Southern Mediterranean, and ${SRC.nlr} described Mediterranean crewed charter demand into 2026 as stable and comparable to or exceeding 2025. Read together: the destination gained, the fuel line got heavier, and the catamaran, which burns a fraction of a motor yacht's diesel, became the easier all-in conversation.`,
      },
      {
        title: "The reading from this desk (opinion, not data)",
        body:
          "Our own read of the quarter is a broker's judgement and should be weighed as one. We believe the catamaran's share of the Greek crewed market kept growing through Q1, for the reason above and because the family and multi-generational client wants cabins and deck space more than speed. We believe the motor segment felt the fuel spike more than the headline demand figures show. And we believe that the American client, who is the majority of the enquiries on this desk, books earlier than the European client and is the reason the peak weeks go in winter. None of those three sentences is a measurement. They are what we would tell you across a table.",
      },
    ],
    methodology:
      "This retrospective was rewritten on 6 September 2026 to remove modelled figures that appeared in the April edition. Every number that remains is either taken from the George Yachts Greek Charter Index 2026, which compiles the current rate cards of the fifty-eight fully crewed yachts we represent, or from a third-party publication linked where the figure appears. Availability and demand statements are the observation of one Athens desk, not a survey of the Greek fleet, and the section marked opinion is exactly that. We do not hold industry-wide booking data and do not claim to.",
    faq: [
      {
        q: "Was Greek yacht charter growing at the start of 2026?",
        a: "By the public record, yes. GTP Headlines reported a 24% rise in yachting demand in Greece in 2025 and a 40% share of Eastern Mediterranean charter bookings, and MYBA figures cited by SuperYacht24 put global crewed bookings up 12% in 2025 with the Mediterranean at 76% of world activity. We do not publish our own growth percentage.",
      },
      {
        q: "Which yachts sold out first for summer 2026?",
        a: "On this desk, in the usual order: the peak July and August weeks on the most requested yachts, then the five and six cabin crewed catamarans, then the premium motor yachts above 40 metres, which are confirmed a year or more ahead. Shoulder months stayed open through March.",
      },
      {
        q: "What did a crewed week cost in the first quarter of 2026?",
        a: "On the Greek Charter Index 2026, a fully crewed sailing catamaran ran from EUR 10,900 a week net base at 14 metres to EUR 90,000 at 24 metres, a power catamaran from EUR 14,000 to EUR 90,000, a motor yacht from EUR 17,500 at 18 metres to EUR 120,000 at 40 metres, and the two yachts above 50 metres from EUR 162,500 to EUR 235,000, per yacht per week before VAT and APA.",
      },
      {
        q: "How did the February 2026 Middle East events affect Greek charter?",
        a: "Two documented effects. Marine fuel rose, with VLSFO above 650 US dollars a tonne in March 2026 per Global Maritime Hub, which lands in the APA of a motor yacht charter. And travel intent shifted from the Gulf toward the Southern Mediterranean, per Mabrian. Mediterranean crewed demand was described as stable to stronger into 2026 by the National Law Review.",
      },
    ],
    seoTitle: "Q1 2026 Greek Yacht Charter Market Retrospective",
    seoDescription:
      "What January to March 2026 told a working Athens broker: Greece's documented rise, the rate cards, which weeks went first, and the fuel shock. Sourced.",
    canonical: "https://georgeyachts.com/q1-2026-greek-yacht-charter-market-retrospective",
  },

  // ─────────────────────────────────────────────────────────────
  // MID-YEAR 2026 SNAPSHOT
  // ─────────────────────────────────────────────────────────────
  {
    slug: "mid-year-2026-greek-yacht-charter-market-check",
    period: "Mid-year 2026",
    urlPath: "/mid-year-2026-greek-yacht-charter-market-check",
    eyebrow: "Mid-year snapshot",
    h1: "Mid-Year 2026 Greek Yacht Charter Market Check",
    tagline:
      "The state of the Greek crewed charter market at the turn of the season: what the show floor said, what the rate cards say, and what this desk's own enquiry log shows.",
    publishedAt: "2026-05-12",
    reportType: "snapshot",
    executiveSummary:
      "At mid-year the Greek crewed market looked like this from an Athens desk: the Mediterranean Yacht Show in Nafplio drew 106 yachts and 485 brokers in early May, the crewed rate cards held their structure with the floor at EUR 10,900 a week, and the enquiries reaching us were overwhelmingly for a full seven-night week departing Athens. Booking lead times across the wider market shortened, per Northrop & Johnson, while the peak weeks on the best Greek yachts still moved a year ahead. The catamaran remained the hull most families asked for.",
    keyFindings: [
      `The 11th Mediterranean Yacht Show drew **106 yachts, 485 brokers, 39 exhibitors and 24 countries** to Nafplio on 2 to 6 May 2026 (${SRC.mys}).`,
      `Across the wider market, average booking lead time fell from **118 days in 2025 to 83 days in 2026**, and median charter length rose from **seven nights to eight** (${SRC.nj}).`,
      `Catamarans were about **26% of the global charter fleet and 30% of booked weeks** in 2025, while motor yachts still took **57.52% of charter revenue** (${SRC.bookingMgr}); Greece had **904 catamarans among 3,030 charter vessels** (${SRC.traveler}).`,
      "On this desk's own log, the seven-night week is the request: **31 of the 57 dated enquiries** received since 30 May 2026 asked for exactly seven nights, and the most common departure is Athens.",
      `The crewed rate cards on the ${SRC.index} kept their shape: **EUR 10,900 a week** at the floor, **EUR 235,000** at the top, and shoulder weeks **15 to 25% below peak**.`,
      `Of the yachts we represent, **${CATAMARAN_COUNT} of ${FLEET_COUNT} are catamarans**, ${FLEET_COMPOSITION.sailingCat} sailing and ${FLEET_COMPOSITION.powerCat} power, against ${FLEET_COMPOSITION.motor} motor yachts.`,
    ],
    sections: [
      {
        title: "The show floor in May",
        body:
          `The Mediterranean Yacht Show, organised by the Greek Yachting Association in Nafplio, is where the Greek crewed fleet is inspected by the brokers who sell it. The 11th edition on 2 to 6 May 2026 drew 106 yachts, 485 brokers, 39 exhibitors and 24 countries (${SRC.mys}). We walk it every year for the same reason: the rate card tells you the price, and only the deck tells you the crew. The Greek Yachting Association had elected a new 2026 to 2029 board in February, and the state's 260 million euro port programme across 30 islands was already under way (${SRC.gtpPorts}). The mood was of a destination gaining, not slipping.`,
      },
      {
        title: "Lead times: the average is not the peak",
        body:
          `${SRC.nj} reported that average booking lead time across the charter market fell from 118 days in 2025 to 83 days in 2026, down almost 30% year on year, and that median charter length rose from seven nights to eight, with eight to ten night charters now the largest category at 42.9% of activity. We believe the falling average is real and also easy to misread. It is dominated by shoulder and last-minute weeks. The prime July and August weeks on the most requested Greek yachts move on a different clock: on the ${SRC.index} we recommend six to twelve months for peak, and a year or more for premium yachts above 40 metres. Both things are true at once.`,
        dataTable: LEAD_TIME_TABLE,
      },
      {
        title: "What this desk's own log shows",
        body:
          "Since 30 May 2026 every charter enquiry that reaches this house has been logged in the same system, and the counts below are taken from it on 6 September 2026. Sixty-eight requests were logged in that window. Of the 57 that carried dates, 31 asked for exactly seven nights, and no other length came close. The most common departure named was Athens, with the Cyclades and Mykonos next and the Ionian and the Saronic behind them. Sixty-four of the 68 came directly from the client and four through a travel advisor. Where a budget was stated, it was most often phrased all-in rather than as a base fee, which tells us how the American client thinks about the number. These are counts from one desk, not a market share of anything.",
        dataTable: {
          headers: ["Requested length (nights)", "Enquiries"],
          rows: [
            ["7", "31"],
            ["Under 7", "13"],
            ["8 to 16", "7"],
            ["About a month", "5"],
            ["Undated or unusable dates", "12"],
          ],
        },
      },
      {
        title: "Catamaran and motor: what the data says and what we see",
        body:
          `${SRC.bookingMgr} put catamarans at about 26% of the global charter fleet and 30% of all booked weeks in 2025, with motor yachts still 57.52% of the revenue pool and monohull peak-season occupancy ahead of catamarans for the first time in years. ${SRC.traveler} counted 904 catamarans among 3,030 charter vessels in Greece in 2025, and ${SRC.boataround} named the Lagoon 42 the most booked charter model of 2025, the first time a catamaran topped that ranking. Our own fleet mirrors the shift: ${FLEET_SENTENCE}. The reading from this desk, offered as opinion, is that the family client chooses cabins and deck space, the motor client chooses speed and pays the fuel, and in a year of elevated diesel the first conversation is easier than the second.`,
      },
      {
        title: "Where the rate cards stood at mid-year",
        body:
          `The bands below are the current rate cards of the fifty-eight fully crewed yachts on the ${SRC.index}, per yacht per week before VAT and APA. Greek VAT on a weekly crewed charter is invoiced at 5.2, 6.5, 7.8 or 12% depending on the yacht's certification, with 13% the statutory ceiling. APA runs 20 to 30% of the base for sailing yachts and catamarans and 30 to 40% for motor yachts, and a crew gratuity of 10 to 15% of the base is customary. A EUR 20,000 base catamaran week lands around EUR 25,000 to 28,500 all-in before gratuity.`,
        dataTable: INDEX_BANDS,
      },
    ],
    methodology:
      "This snapshot was rewritten on 6 September 2026 to remove modelled figures that appeared in the May edition. Third-party figures are linked where they appear. Rate figures come from the George Yachts Greek Charter Index 2026, compiled from the current rate cards of the fifty-eight fully crewed yachts we represent. Enquiry counts come from this desk's own request log, which has recorded every charter enquiry since 30 May 2026, and were read on 6 September 2026; they describe one brokerage house, not the Greek market. Fleet composition is counted from the yachts we currently represent. Sentences marked as opinion are a broker's reading and nothing more.",
    faq: [
      {
        q: "What is the state of the Greek yacht charter market in mid-2026?",
        a: "Gaining, by the public record: Greece rose 24% in yachting demand in 2025 per GTP Headlines, the Mediterranean Yacht Show drew 106 yachts and 485 brokers in May 2026, and Mediterranean crewed demand was described as stable to stronger into 2026. On this desk the rate cards held their structure, with a fully crewed week from EUR 10,900, and the seven-night Athens departure was the request most clients made.",
      },
      {
        q: "Are booking lead times getting shorter?",
        a: "Across the wider market, yes: Northrop & Johnson reported the average falling from 118 days in 2025 to 83 in 2026. The peak July and August weeks on the most requested Greek yachts are the exception and still move six to twelve months ahead, and a year or more for premium yachts above 40 metres.",
      },
      {
        q: "How long a charter do most clients ask for?",
        a: "Seven nights. Of the 57 dated enquiries this desk logged between 30 May and 6 September 2026, 31 asked for exactly seven nights. Northrop & Johnson reports the market-wide median rising from seven nights to eight.",
      },
      {
        q: "Is the catamaran taking over Greek charter?",
        a: `It is taking share. Booking Manager put catamarans at 30% of booked weeks in 2025 while motor yachts still held 57.52% of revenue, and The Traveler counted 904 catamarans among 3,030 Greek charter vessels. Of the ${FLEET_COUNT} yachts we represent, ${CATAMARAN_COUNT} are catamarans.`,
      },
    ],
    seoTitle: "Mid-Year 2026 Greek Yacht Charter Market Check",
    seoDescription:
      "Greek crewed charter at mid-2026 from an Athens desk: the Nafplio show, lead times, the seven-night Athens week, catamaran share and the rate cards. Sourced.",
    canonical: "https://georgeyachts.com/mid-year-2026-greek-yacht-charter-market-check",
  },

  // ─────────────────────────────────────────────────────────────
  // 2026 PEAK-SEASON FORECAST (with a September postscript)
  // ─────────────────────────────────────────────────────────────
  {
    slug: "2026-peak-season-forecast-greek-yacht-charter",
    period: "Peak season 2026",
    urlPath: "/2026-peak-season-forecast-greek-yacht-charter",
    eyebrow: "Forecast",
    h1: "2026 Peak-Season Forecast: Greek Yacht Charter",
    tagline:
      "What a working Athens broker expected of July and August 2026, written in May, with a September postscript on how the season actually ran on this desk.",
    publishedAt: "2026-05-12",
    reportType: "forecast",
    executiveSummary:
      "Our May 2026 expectation for the Greek peak season was simple and has held: the most requested crewed yachts would be spoken for on their July and August weeks well before summer, the shoulder months would stay open at 15 to 25% below peak, and the catamaran would be the hull families asked for in a year of expensive diesel. The September postscript adds what this desk's own log shows: August was the busiest enquiry month of the season, and by then the requests arriving were already for 2027.",
    keyFindings: [
      `Peak weeks on the most requested yachts move **6 to 12 months ahead**, and premium yachts above 40 metres a year or more, so the July and August 2026 decision was made in winter (${SRC.index}).`,
      "Shoulder weeks, May and late September to October, price **15 to 25% below peak** on the same rate card and stayed open through the season.",
      `Marine VLSFO above **650 US dollars a tonne** in March 2026 (${SRC.gmh}) made the APA, 30 to 40% of the base on a motor yacht, the number to watch for the motor client.`,
      `Documented tailwinds: a Mediterranean at **76% of global charter** (${SRC.myba}), a 2026 travel shift toward the Southern Mediterranean (${SRC.mabrian}), and demand described as stable to stronger into 2026 (${SRC.nlr}).`,
      "September postscript: on this desk's log, **25 of the 68 enquiries** received since 30 May arrived in August, the busiest month, and **26 of the 57 dated requests** were already for 2027 or later.",
      "September postscript: every charter this desk closed in the window departs Athens, and three of the four are for 2027 dates, booked a year ahead.",
    ],
    sections: [
      {
        title: "What we expected in May, and why",
        body:
          `We did not forecast a utilisation percentage or an average rate, because we do not hold the calendars of the Greek fleet and would have been guessing. What we did expect, from the ${SRC.index} and from the way the previous seasons ran, was this. The late July and August weeks on the most requested yachts would be spoken for before summer, because they always are, and the five and six cabin catamarans would go first. The shoulder months would stay open and price 15 to 25% below peak on the same card. The motor client would feel the fuel line in the APA after the March spike (${SRC.gmh}). And the destination itself would gain, on the strength of the 2025 record (${SRC.gtpPorts}) and the shift of Mediterranean travel intent south after February (${SRC.mabrian}).`,
        dataTable: LEAD_TIME_TABLE,
      },
      {
        title: "The rate cards the season was quoted from",
        body:
          `Peak pricing in Greece is the rate card itself: an owner quotes one Greece-wide weekly fee per yacht, and the shoulder discount is taken off that. The bands below are the current cards of the fifty-eight fully crewed yachts on the ${SRC.index}, per yacht per week before VAT and APA. VAT is invoiced at 5.2, 6.5, 7.8 or 12% by certification, APA runs 20 to 30% of the base on sailing yachts and catamarans and 30 to 40% on motor yachts, and a 10 to 15% crew gratuity on the base is customary.`,
        dataTable: INDEX_BANDS,
      },
      {
        title: "The Meltemi and the itinerary",
        body:
          "The July and August Meltemi is the one peak-season fact no forecast changes. It blows hardest through the central Cyclades in the afternoons and it favours larger, faster, more powerful yachts, which is why the boats that end up there sit higher in the table. For a family on a catamaran in August we plan the week around it: the Saronic and the Argolic in the lee of the Peloponnese, or a Cyclades loop that runs with the wind rather than into it. The Ionian is sheltered from it entirely, and that is why the Ionian is the structurally rising cruising ground for families. None of this is a prediction. It is the weather, and the itinerary is how you answer it.",
      },
      {
        title: "September postscript: how the season ran on this desk",
        body:
          "Written on 6 September 2026 from this desk's own enquiry log, which has recorded every request since 30 May. Sixty-eight enquiries arrived in the window: one on 30 May itself, 13 in June, 20 in July, 25 in August and 9 in the first days of September. August, the month most people are on the water, was the busiest month for asking about the next one. Of the 57 requests that carried dates, 26 were for 2027 or later, and the 2027 months most asked for were June and September, with July and August behind them. Every charter we closed in the window departs Athens, and three of the four are for 2027 dates, confirmed a year ahead. The seven-night week was the request in 31 of the 57. That is the whole of what we can measure, and it is consistent with what we expected: the peak decision is made a year out, and the shoulder is where the thoughtful client goes.",
        dataTable: {
          headers: ["Travel dates requested", "Enquiries (dated)"],
          rows: [
            ["June to October 2026", "31"],
            ["May to September 2027", "25"],
            ["2028", "1"],
          ],
        },
      },
      {
        title: "What this means for July and August 2027",
        body:
          `The 2027 season effectively opens in the autumn of 2026, when owners settle next year's rate cards, and the first calendars open earlier still for repeat clients. The advantage of moving now is not primarily price, it is choice. The 260 million euro port programme runs through 2027, so a 2027 charter meets upgraded harbours across 30 islands that a 2025 charter did not (${SRC.gtpPorts}). Our forward view, offered as a broker's opinion and not as data, is that as Middle East tensions ease the motor segment in Greece firms up, and that the catamaran keeps its share regardless, because the family client is not choosing it for the fuel bill alone.`,
      },
    ],
    methodology:
      "This forecast was rewritten on 6 September 2026 to remove modelled figures that appeared in the May edition, including a utilisation rate and average peak rates that the house had no data to support. What remains is the expectation we actually held in May, stated without invented precision, plus a postscript of real counts from this desk's enquiry log, which has recorded every charter request since 30 May 2026 and was read on 6 September 2026. Rate figures are from the George Yachts Greek Charter Index 2026, compiled from the current rate cards of the fifty-eight fully crewed yachts we represent. Third-party figures are linked where they appear. The desk's counts describe one brokerage house and are not a market share of anything.",
    faq: [
      {
        q: "How full was the Greek charter fleet in July and August 2026?",
        a: "We do not know, and we no longer publish a figure. We do not hold the calendars of the Greek fleet. What we can say is that on this desk the peak weeks on the most requested yachts were spoken for before summer, as they are every year, and the shoulder months stayed open at 15 to 25% below peak.",
      },
      {
        q: "What did a peak-season crewed week cost in Greece in 2026?",
        a: "The rate card, per yacht per week before VAT and APA: a fully crewed sailing catamaran from EUR 10,900 at 14 metres to EUR 90,000 at 24 metres, a power catamaran from EUR 14,000 to EUR 90,000, a motor yacht from EUR 17,500 at 18 metres to EUR 120,000 at 40 metres, and the two yachts above 50 metres from EUR 162,500 to EUR 235,000, on the Greek Charter Index 2026.",
      },
      {
        q: "When should I book July or August 2027 in Greece?",
        a: "Now, through the autumn and winter of 2026. Peak weeks on the most requested yachts move six to twelve months ahead and premium yachts above 40 metres a year or more. On this desk, three of the four charters closed between June and September 2026 were for 2027 dates.",
      },
      {
        q: "What could change the outlook for 2027?",
        a: "Marine fuel, which passed 650 US dollars a tonne in March 2026 and lands in the APA of every motor yacht charter, and the wider Middle East situation that moved it. The documented tailwinds are the Greek port programme through 2027, a Mediterranean at 76% of world charter, and the 2026 shift of travel intent toward the Southern Mediterranean.",
      },
    ],
    seoTitle: "2026 Greek Yacht Charter Peak-Season Forecast",
    seoDescription:
      "What an Athens broker expected of July and August 2026, and how it ran: lead times, shoulder pricing, the Meltemi, fuel, and real enquiry counts from this desk.",
    canonical: "https://georgeyachts.com/2026-peak-season-forecast-greek-yacht-charter",
  },
];

export function getMarketReportBySlug(slug) {
  return MARKET_REPORTS.find((r) => r.slug === slug) || null;
}
