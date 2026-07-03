import { WHATSAPP_DOWN, WHATSAPP_NUMBER } from "@/lib/whatsappStatus";
// Greek Yacht Charter 2027 Outlook - 2026-06-29.
//
// Original, fully-sourced market synthesis: a citation magnet built ONLY on
// third-party-verifiable facts (each carries its source), plus George Yachts'
// clearly-labelled house view. No fabrication: claims that could only be traced
// to our own blog, or that the public record contradicts (e.g. a "sharp 2026
// motor-yacht decline"), were deliberately left out. George's motor-recovery
// expectation runs strictly as attributed opinion, not as fact.

import Link from "next/link";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const revalidate = 86400;

export const metadata = {
  title: { absolute: "Greek Yacht Charter 2027 Outlook | Data + Sources" },
  description:
    "A sourced 2027 outlook for Greek yacht charter: Greece up 24% in 2025 and 40% of Eastern Med bookings, a 260M euro port programme, the catamaran fuel-economics shift, and where motor yachts go next. Every figure cited.",
  alternates: { canonical: "https://georgeyachts.com/greek-yacht-charter-2027-outlook" },
  openGraph: {
    title: "Greek Yacht Charter: The 2027 Outlook",
    description:
      "Greece up 24% in 2025, 40% of Eastern Med charter, a 260M euro port programme, and the catamaran-vs-motor fuel story. A fully-sourced outlook from George Yachts.",
    url: "https://georgeyachts.com/greek-yacht-charter-2027-outlook",
    type: "article",
  },
};

const SOURCES = {
  gtpPorts: { pub: "GTP Headlines", url: "https://news.gtp.gr/2026/03/12/greece-to-upgrade-30-island-ports-with-e260m-investment-to-boost-yachting-sector/" },
  gtpStrategy: { pub: "GTP Headlines", url: "https://news.gtp.gr/2026/02/27/greece-pushes-yachting-strategy-with-port-upgrades-and-digital-reform/" },
  gtpBoard: { pub: "GTP Headlines", url: "https://news.gtp.gr/2026/02/02/greek-yachting-association-elects-new-board-for-2026-2029-term/" },
  mys: { pub: "Mediterranean Yacht Show (Greek Yachting Association)", url: "https://www.mediterraneanyachtshow.gr/" },
  myba: { pub: "SuperYacht24, citing MYBA", url: "https://www.superyacht24.it/en/2026/04/27/da-myba-i-numeri-del-charter-di-yacht-italia-4-nel-2025-e-terza-destinazione-mondiale/" },
  nj: { pub: "Northrop & Johnson", url: "https://www.northropandjohnson.com/navigator-news/charter/2026-yacht-charter-market-trends-show-last-minute-booking-surge" },
  knightFrank: { pub: "Boat International, Knight Frank Wealth Report", url: "https://www.boatinternational.com/boat-pro/superyacht-insight/knight-frank-wealth-report-2026-superyacht-industry" },
  iyc: { pub: "IYC", url: "https://iyc.com/blog/review-of-2025-yacht-sales-charter-performance/" },
  boataround: { pub: "Boataround", url: "https://www.boataround.com/blog/boatarounds-2024-in-numbers-sailing-trends-and-customer-insights" },
  bookingMgr: { pub: "Booking Manager", url: "https://www.booking-manager.com/en/blog/state-of-the-yacht-charter-industry-2025.html" },
  traveler: { pub: "The Traveler", url: "https://www.thetraveler.org/greece-commands-global-yacht-charter-market-in-2025/" },
  mordor: { pub: "Mordor Intelligence", url: "https://www.mordorintelligence.com/industry-reports/catamaran-market" },
  gmh: { pub: "Global Maritime Hub", url: "https://globalmaritimehub.com/global-bunker-prices-surge-as-middle-east-tensions-shake-fuel-markets.html" },
  maersk: { pub: "Maersk", url: "https://www.maersk.com/news/articles/2025/04/01/mediterranean-sea-eca-regulation-updated-fossil-fuel-fee" },
  mabrian: { pub: "Mabrian", url: "https://mabrian.com/blog/conflict-in-the-middle-east-diverts-global-tourism-demand-towards-the-southern-mediterranean/" },
  nlr: { pub: "National Law Review", url: "https://natlawreview.com/press-releases/mediterranean-yacht-charter-demand-remains-strong-2026-despite-global" },
};

const SECTIONS = [
  {
    heading: "Greece is gaining, not slipping",
    facts: [
      { t: "Greece recorded a 24% increase in yachting demand in 2025 and captured 40% of all charter bookings in the Eastern Mediterranean.", s: "gtpPorts" },
      { t: "The Greek government allocated 260 million euros across 30 island ports (180 million from the NSRF Transport 2021-2027 programme, 80 million from the Recovery and Resilience Fund) to upgrade yachting infrastructure through 2027.", s: "gtpPorts" },
      { t: "Yachting contributes an estimated 5 to 6 billion euros a year to the Greek economy, roughly 2.5% of GDP, according to the Piraeus Chamber of Commerce and Industry.", s: "gtpStrategy" },
      { t: "Greece ranks 2nd globally in recreational vessel traffic and 3rd in the Mediterranean for superyachts over 24 metres.", s: "gtpStrategy" },
      { t: "The Greek Yachting Association elected a new 2026-2029 board in early 2026, with Ioannis Kourounis as President and Spiros Galanakis as Vice President.", s: "gtpBoard" },
      { t: "The 11th Mediterranean Yacht Show drew 106 yachts, 485 brokers, 39 exhibitors and 24 countries to Nafplio on 2 to 6 May 2026.", s: "mys" },
    ],
  },
  {
    heading: "The charter market in 2025 to 2026",
    facts: [
      { t: "Global crewed yacht charter bookings grew 12% in 2025.", s: "myba" },
      { t: "The Mediterranean generates 76% of global charter activity, and the 20 to 40 metre segment accounts for nearly 70% of all bookings.", s: "myba" },
      { t: "The global yacht charter market is expected to grow from about 9.30 billion US dollars in 2025 to 9.80 billion in 2026.", s: "nj" },
      { t: "Average booking lead time fell from 118 days in 2025 to 83 days in 2026, down almost 30% year on year.", s: "nj" },
      { t: "Median charter length rose from seven days in June 2025 to eight in June 2026, and eight to ten day charters are now the largest category at 42.9% of activity.", s: "nj" },
      { t: "Knight Frank's Wealth Report names the superyacht industry an area of resilience in 2026, with total superyacht sales value up 70% to 8.5 billion US dollars in 2025, second only to 2021.", s: "knightFrank" },
      { t: "Mediterranean crewed charter demand held strong into 2026, described as stable and comparable to or exceeding 2025.", s: "nlr" },
    ],
  },
  {
    heading: "Catamarans vs motor yachts: where the demand sits",
    facts: [
      { t: "The Lagoon 42 was the most-booked charter model of 2025 on Boataround, the first time a catamaran topped that platform's ranking, with bookings up more than 60% year on year.", s: "boataround" },
      { t: "Catamarans are about 26% of the global charter fleet and 30% of all booked weeks, yet motor yachts still accounted for 57.52% of the 2025 charter revenue pool.", s: "bookingMgr" },
      { t: "In 2025, peak-season occupancy of monohulls was higher than catamarans for the first time in several years, a shift within the sail segment rather than a motor-versus-sail move.", s: "bookingMgr" },
      { t: "Greece had 904 catamarans out of 3,030 charter vessels in 2025 (about 30% of the fleet), with luxury catamarans among the fastest-growing segments.", s: "traveler" },
      { t: "The global catamaran market was worth 4.7 billion US dollars in 2024 and is projected to grow at a 7.4% annual rate through 2034.", s: "mordor" },
    ],
  },
  {
    heading: "The 2026 fuel and geopolitical backdrop",
    facts: [
      { t: "Marine VLSFO climbed past 650 US dollars per metric ton in March 2026 amid tensions following the 28 February 2026 Iran-Israel military operations.", s: "gmh" },
      { t: "The Mediterranean Emission Control Area took effect on 1 May 2025, capping marine-fuel sulphur content at 0.10% by mass.", s: "maersk" },
      { t: "After early-2026 Middle East tensions, travel intent toward the Gulf states fell while Southern Mediterranean destinations absorbed the shift.", s: "mabrian" },
    ],
  },
];

function FaqJsonLd() {
  const faq = [
    { q: "Is Greek yacht charter growing into 2027?", a: "The verifiable record points up, not down. Greece recorded a 24% rise in yachting demand in 2025 and took 40% of Eastern Mediterranean charter bookings, and the state is investing 260 million euros in island ports through 2027. Mediterranean crewed charter demand held strong into 2026." },
    { q: "Are catamarans cheaper to run than motor yachts?", a: "Directionally yes: a sailing catamaran burns far less fuel than a comparable motor yacht, so fuel is a smaller share of the catamaran's running cost. We do not publish a precise litre or percentage split, because the figures vary widely by yacht and route and we could not independently verify a single industry standard. What is documented is that the Lagoon 42 was the most-booked charter model of 2025 on Boataround, the first catamaran to top that platform's ranking." },
    { q: "Did motor-yacht charter demand collapse in 2026?", a: "Not according to the public record. Motor yachts were still 57.52% of the 2025 charter revenue pool and monohull peak occupancy actually overtook catamarans that year. Catamarans gained share by volume, but motor yachts remained the revenue core. Our own forward view on a 2027 motor recovery is stated as opinion below." },
    { q: "What could push the 2027 Greek charter market?", a: "Documented tailwinds include a 260 million euro Greek port programme through 2027, a Mediterranean that is 76% of world charter, falling booking lead times, and a 2026 travel shift toward the Southern Mediterranean. The main watch-item is marine fuel, which spiked above 650 US dollars per ton in March 2026." },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function ArticleJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Greek Yacht Charter: The 2027 Outlook",
    description:
      "A fully-sourced 2027 outlook for Greek yacht charter, covering Greek market growth, the catamaran fuel-economics shift, and the motor-yacht question.",
    datePublished: "2026-06-29",
    dateModified: "2026-06-29",
    author: { "@type": "Person", "@id": "https://georgeyachts.com/about/george-p-biniaris#person", name: "George P. Biniaris" },
    publisher: { "@type": "Organization", "@id": "https://georgeyachts.com/#organization" },
    mainEntityOfPage: "https://georgeyachts.com/greek-yacht-charter-2027-outlook",
    image: "https://georgeyachts.com/opengraph-image",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function Outlook2027Page() {
  const sourceList = Object.values(SOURCES);
  return (
    <>
      <ArticleJsonLd />
      <FaqJsonLd />
      <article style={{ background: NAVY, color: CREAM, minHeight: "100vh" }}>
        {/* HERO */}
        <section style={{ padding: "96px 24px 48px", maxWidth: 880, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 22px" }}>Market Outlook</p>
          <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(40px, 6vw, 78px)", fontWeight: 300, lineHeight: 1.04, letterSpacing: "-0.02em", margin: "0 0 26px" }}>
            Greek Yacht Charter: The 2027 Outlook
          </h1>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 17, lineHeight: 1.7, color: "rgba(248,245,240,0.8)", fontWeight: 300, maxWidth: "62ch" }}>
            A market read built only on figures we can source. Every number below carries its citation. Where the public record is clear we state it as fact; where it is our own forward judgement we say so plainly. We do not publish what we cannot stand behind.
          </p>
        </section>

        {/* FACT SECTIONS */}
        {SECTIONS.map((sec, si) => (
          <section key={si} style={{ padding: "40px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
            <div style={{ maxWidth: 880, margin: "0 auto" }}>
              <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: CREAM, margin: "0 0 28px" }}>{sec.heading}</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {sec.facts.map((f, fi) => (
                  <li key={fi} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.65, color: "rgba(248,245,240,0.85)", fontWeight: 300, paddingLeft: 18, borderLeft: `2px solid ${GOLD}` }}>
                    {f.t}{" "}
                    <a href={SOURCES[f.s].url} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: "none", fontSize: 13, whiteSpace: "nowrap" }}>
                      ({SOURCES[f.s].pub})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}

        {/* HOUSE VIEW - explicitly opinion */}
        <section style={{ padding: "48px 24px", borderTop: "1px solid rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.04)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>George Yachts house view (opinion, not fact)</p>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(20px, 3vw, 27px)", fontWeight: 300, lineHeight: 1.4, color: CREAM, margin: "0 0 18px" }}>
              Independent data show the wider Greek and Mediterranean market holding firm or growing through 2025 and 2026, with motor yachts still the revenue core; what shifted was shorter booking lead times, a softer average spend, and a reshuffle within the sail segment. Our own read from the desk is that the Greek motor segment felt the high 2026 fuel costs more than the headline numbers show, and we expect that as Middle East tensions ease through 2027, motor-yacht charter demand in Greece firms up.
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.6)", fontWeight: 300, margin: 0 }}>
              This paragraph is George Yachts' forward-looking opinion, offered as a broker's read of the market, not an established fact. The public record above shows Greek yachting growing overall in 2025 and motor yachts still leading charter revenue; our motor-segment and recovery view is a judgement, and we will revise it as the data does.
            </p>
          </div>
        </section>

        {/* SOURCES */}
        <section style={{ padding: "40px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 16px" }}>Sources</p>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {sourceList.map((s, i) => (
                <li key={i} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: "rgba(248,245,240,0.6)", fontWeight: 300 }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(248,245,240,0.75)", textDecoration: "none" }}>{s.pub}</a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CITE THIS */}
        <section style={{ padding: "32px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>Cite this outlook</p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.75)", margin: 0 }}>
              George Yachts Brokerage House. (2026). <em>Greek Yacht Charter: The 2027 Outlook</em>. https://georgeyachts.com/greek-yacht-charter-2027-outlook
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "64px 24px 88px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inquiry" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
              Brief George directly
            </Link>
            <a href={WHATSAPP_DOWN ? "/inquiry" : `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20George%2C%20I%20read%20your%202027%20Greek%20charter%20outlook%20and%20would%20like%20to%20talk%20about%20a%20motor%20yacht%20for%20next%20season.`} target={WHATSAPP_DOWN ? undefined : "_blank"} rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, padding: "14px 26px", border: `1px solid ${GOLD}`, color: GOLD, textDecoration: "none" }}>
              {WHATSAPP_DOWN ? "Message George Directly" : "Message on WhatsApp"}
            </a>
          </div>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.04em", color: "rgba(248,245,240,0.5)", margin: "22px 0 0" }}>
            A personal reply from George, usually within a few hours.
          </p>
        </section>
      </article>
    </>
  );
}
