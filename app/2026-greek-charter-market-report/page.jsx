// Original research page — /2026-greek-charter-market-report
//
// 2026-05-11 Phase 7 Round 3 SEO execution. Section 8 Gap 5.
//
// 2026-09-06 rewrite. The May edition carried headline figures the
// house could not stand behind (a growth rate, a fleet count, source
// market shares, a rate change, a lead time in months) presented as
// observations from a booking record and an IYBA network that did
// not exist as data. George's instruction: rewrite without invented
// numbers, keep the page, tell the truth. Every figure below now
// comes from one of three named sources: the Greek Charter Index 2026
// (the current rate cards of the fifty-eight fully crewed yachts we
// represent), this desk's own enquiry log (every request since 30 May
// 2026, read on 6 September 2026), or a linked third-party publication.
// Readings of the market are written as a broker's reading and say so.

import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";
import Footer from "@/app/components/Footer";
import { FLEET_COUNT, CATAMARAN_COUNT, FLEET_COMPOSITION } from "@/lib/fleetCount";

const GOLD = "#DAA110";
const NAVY = "#0D1B2A";

export const revalidate = 86400;

// 2026-05-14 — title trimmed 73→55 chars (Ahrefs flag).
export const metadata = pageMeta({
  title: "2026 Greek Charter Market Report",
  description:
    "The 2026 Greek yacht charter market from a working Athens desk: rate cards by yacht class, fleet mix, who is asking, when they book. Sourced, no estimates.",
  path: "/2026-greek-charter-market-report",
  type: "article",
});

const SOURCES = {
  gtpPorts: {
    pub: "GTP Headlines",
    url: "https://news.gtp.gr/2026/03/12/greece-to-upgrade-30-island-ports-with-e260m-investment-to-boost-yachting-sector/",
  },
  myba: {
    pub: "SuperYacht24, citing MYBA",
    url: "https://www.superyacht24.it/en/2026/04/27/da-myba-i-numeri-del-charter-di-yacht-italia-4-nel-2025-e-terza-destinazione-mondiale/",
  },
  // 2026-09-07 (George): no other charter house is named on the site, not
  // even as a source. The figures stay, attributed to the report, unlinked.
  nj: {
    pub: "a global brokerage house's 2026 charter market report",
    url: "",
  },
  bookingMgr: {
    pub: "Booking Manager",
    url: "https://www.booking-manager.com/en/blog/state-of-the-yacht-charter-industry-2025.html",
  },
  traveler: {
    pub: "The Traveler",
    url: "https://www.thetraveler.org/greece-commands-global-yacht-charter-market-in-2025/",
  },
  gmh: {
    pub: "Global Maritime Hub",
    url: "https://globalmaritimehub.com/global-bunker-prices-surge-as-middle-east-tensions-shake-fuel-markets.html",
  },
};

function Src({ id }) {
  const s = SOURCES[id];
  if (!s.url) {
    return <span style={{ color: GOLD, whiteSpace: "nowrap" }}>({s.pub})</span>;
  }
  return (
    <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: GOLD, textDecoration: "none", whiteSpace: "nowrap" }}>
      ({s.pub})
    </a>
  );
}

function ArticleJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "https://georgeyachts.com/2026-greek-charter-market-report#article",
    headline: "2026 Greek Yacht Charter Market Report",
    description:
      "The 2026 Greek yacht charter market from a working Athens desk: rate cards by yacht class, fleet composition, who is asking and when they book. Sourced figures only.",
    datePublished: "2026-05-11",
    dateModified: "2026-09-06",
    author: {
      "@type": "Person",
      name: "George P. Biniaris",
      jobTitle: "Founder and Managing Broker",
      worksFor: {
        "@type": "Organization",
        name: "George Yachts Brokerage House LLC",
        url: "https://georgeyachts.com",
      },
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House LLC",
      url: "https://georgeyachts.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://georgeyachts.com/2026-greek-charter-market-report",
    },
    about: [
      { "@type": "Thing", name: "Greek yacht charter" },
      { "@type": "Thing", name: "Yacht charter market analysis" },
      { "@type": "Place", name: "Greece" },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

function Section({ eyebrow, h2, children }) {
  return (
    <section style={{ padding: "56px 24px", borderBottom: "1px solid rgba(218, 161, 16, 0.12)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
            margin: "0 0 14px",
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 300,
            color: "#F8F5F0",
            margin: "0 0 24px",
            lineHeight: 1.2,
          }}
        >
          {h2}
        </h2>
        <div
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 16,
            lineHeight: 1.78,
            color: "rgba(248,245,240,0.88)",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, label, note }) {
  return (
    <div
      style={{
        border: "1px solid rgba(218, 161, 16, 0.25)",
        padding: "24px 26px",
        background: "rgba(248, 245, 240, 0.02)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-display)",
          fontSize: 42,
          fontWeight: 200,
          color: "#F8F5F0",
          margin: "0 0 8px",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {stat}
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 13,
          lineHeight: 1.55,
          color: "rgba(248, 245, 240, 0.72)",
          margin: 0,
        }}
      >
        {note}
      </p>
    </div>
  );
}

const Strong = ({ children }) => <strong style={{ color: "#F8F5F0" }}>{children}</strong>;

export default function MarketReportPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "2026 Charter Market Report", url: "https://georgeyachts.com/2026-greek-charter-market-report" },
  ];

  return (
    <>
      <ArticleJsonLd />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh" }}>
        {/* HERO */}
        <header
          style={{
            padding: "120px 24px 64px",
            borderBottom: "1px solid rgba(218, 161, 16, 0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 18px",
              }}
            >
              Original research · George Yachts
            </p>
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(40px, 7vw, 90px)",
                fontWeight: 300,
                margin: "0 0 18px",
                lineHeight: 1,
                letterSpacing: "-0.025em",
              }}
            >
              2026 Greek Charter Market Report
            </h1>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.4vw, 22px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(248,245,240,0.85)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              What is actually happening in the Greek yacht charter market in 2026,
              from the desk of a working Athens broker. Sourced figures, no estimates.
            </p>
          </div>
        </header>

        {/* QUICK ANSWER (front-loaded for AI citation) */}
        <section style={{ padding: "48px 24px", background: "rgba(218, 161, 16, 0.025)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 14px",
              }}
            >
              Executive summary
            </p>
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 20,
                fontWeight: 300,
                color: "#F8F5F0",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Greece entered 2026 on a documented rise, with a 24% increase in yachting
              demand in 2025 and 40% of Eastern Mediterranean charter bookings, and the
              state rebuilding thirty island ports through 2027. On the rate cards a
              fully crewed week runs from EUR 10,900 for a 14 metre sailing catamaran to
              EUR 235,000 above 50 metres, per yacht per week before VAT and APA. The
              client who reaches this desk asks for a seven-night week departing Athens,
              books the peak a year ahead, and increasingly asks for a catamaran. Where
              this report offers a reading rather than a figure, it says so.
            </p>
          </div>
        </section>

        {/* HEADLINE STATS */}
        <section style={{ padding: "56px 24px", borderBottom: "1px solid rgba(218, 161, 16, 0.12)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: GOLD,
                fontWeight: 600,
                margin: "0 0 30px",
                textAlign: "center",
              }}
            >
              Headline numbers, each with its source
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
              <StatCard
                stat="+24%"
                label="Greek yachting demand, 2025"
                note="Rise in yachting demand recorded in Greece in 2025, with 40% of all Eastern Mediterranean charter bookings. Source: GTP Headlines."
              />
              <StatCard
                stat="EUR 10,900"
                label="The crewed floor"
                note="Lowest weekly net base fee for a fully crewed yacht on our rate cards: a 14 metre sailing catamaran for eight guests. Greek Charter Index 2026."
              />
              <StatCard
                stat="58"
                label="Crewed rate cards"
                note="Fully crewed yachts whose current rate cards the Greek Charter Index 2026 is compiled from, plus seven smaller crewed yachts quoted separately."
              />
              <StatCard
                stat="6 to 12 mo"
                label="Peak lead time"
                note="Booking lead time we recommend for July and August weeks; premium yachts above 40 metres a year or more ahead. Greek Charter Index 2026."
              />
              <StatCard
                stat="7 nights"
                label="The week clients ask for"
                note="31 of the 57 dated enquiries this desk logged between 30 May and 6 September 2026 asked for exactly seven nights."
              />
              <StatCard
                stat={`${CATAMARAN_COUNT} of ${FLEET_COUNT}`}
                label="Catamarans in our fleet"
                note={`Of the ${FLEET_COUNT} yachts we represent, ${FLEET_COMPOSITION.sailingCat} are sailing catamarans and ${FLEET_COMPOSITION.powerCat} power catamarans, against ${FLEET_COMPOSITION.motor} motor yachts.`}
              />
            </div>
          </div>
        </section>

        {/* SOURCE MARKETS */}
        <Section eyebrow="Who is asking" h2="Where the 2026 enquiries come from">
          <p>
            <Strong>The majority of the clients who reach this house are American.</Strong>{" "}
            Gulf, British and Israeli clients follow. We do not publish a percentage
            split, because the log that would support one only began on 30 May 2026
            and one desk's mix is not the Greek market's. What the log does show is how
            the client arrives: 64 of the 68 enquiries in the window came directly from
            the client, and four through a travel advisor.
          </p>
          <p>
            <Strong>The wider record points the same way.</Strong> The Mediterranean
            generated 76% of global charter activity in 2025 and global crewed bookings
            grew 12% <Src id="myba" />. After the Middle East events of late February
            2026, travel intent shifted toward the Southern Mediterranean, and Greece
            was on the receiving end of that shift.
          </p>
          <p>
            <Strong>How the American client phrases the number</Strong> is itself a
            finding. Where a budget was stated in an enquiry it was most often phrased
            all-in, not as a base fee, which is why every rate on this site is quoted
            per yacht per week with the VAT, APA and gratuity rules beside it.
          </p>
        </Section>

        {/* FLEET COMPOSITION */}
        <Section eyebrow="Fleet" h2="What the crewed fleet looks like">
          <p>
            Greece had <Strong>904 catamarans among 3,030 charter vessels in 2025</Strong>,
            about 30% of the fleet, with luxury catamarans among the fastest growing
            segments <Src id="traveler" />. Across the global charter market, catamarans
            were about 26% of the fleet and 30% of all booked weeks, while motor yachts
            still took 57.52% of charter revenue <Src id="bookingMgr" />.
          </p>
          <p>
            <Strong>The yachts we represent mirror the shift.</Strong> Of {FLEET_COUNT},{" "}
            {CATAMARAN_COUNT} are catamarans, {FLEET_COMPOSITION.sailingCat} sailing and{" "}
            {FLEET_COMPOSITION.powerCat} power, against {FLEET_COMPOSITION.motor} motor
            yachts. The Greek Charter Index 2026 is compiled from the 58 that are
            fully crewed, meaning two or more crew, with seven smaller crewed yachts
            quoted separately.
          </p>
          <p>
            <Strong>What goes first, every year:</Strong> the late July and August weeks
            on the most requested yachts, then the five and six cabin catamarans, then
            the premium motor yachts above 40 metres. We do not publish a sell-through
            date or a fill percentage, because we hold our own quotations and the
            owners' replies, not the calendars of the Greek fleet.
          </p>
        </Section>

        {/* PRICING */}
        <Section eyebrow="Pricing" h2="Where 2026 rates sit, by yacht class">
          <p>
            A crewed yacht's base rate attaches to the vessel, not to the cruising
            ground: an owner publishes one Greece-wide rate card per boat. The bands
            below are the lowest and highest weekly net base fee on a rate card in each
            class, per yacht per week before VAT and APA, from the{" "}
            <Link href="/greek-charter-index-2026" style={{ color: GOLD }}>
              Greek Charter Index 2026
            </Link>
            . No cell is an average or an estimate.
          </p>
          <div style={{ overflowX: "auto", margin: "24px 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
              <thead>
                <tr>
                  {["Yacht type and size", "Weekly net base (EUR)", "Yachts"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", borderBottom: `1px solid ${GOLD}`, color: GOLD, fontWeight: 600, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sailing catamaran, 12 to 16m", "10,900 to 22,000", "5"],
                  ["Sailing catamaran, 16 to 19m", "18,900 to 27,500", "4"],
                  ["Sailing catamaran, 20 to 22m", "31,500 to 43,500", "7"],
                  ["Sailing catamaran, 23 to 24m", "56,000 to 90,000", "7"],
                  ["Power catamaran, 13 to 17m", "14,000 to 28,000", "2"],
                  ["Power catamaran, 20 to 22m", "34,000 to 69,000", "7"],
                  ["Power catamaran, 23 to 24m", "49,000 to 90,000", "5"],
                  ["Motor yacht, 18 to 20m", "17,500 to 22,900", "3"],
                  ["Motor yacht, 22 to 24m", "21,000 to 33,000", "2"],
                  ["Motor yacht, 26 to 31m", "40,000 to 65,000", "5"],
                  ["Motor yacht, 35 to 40m", "60,000 to 120,000", "5"],
                  ["Superyacht, 50m and above", "162,500 to 235,000", "2"],
                  ["Sailing monohull, 24 to 31m", "24,000 to 49,000", "4"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((c, i) => (
                      <td key={i} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(248,245,240,0.08)", color: i === 0 ? "#F8F5F0" : "rgba(248,245,240,0.85)" }}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <Strong>On top of the base:</Strong> Greek VAT on a weekly crewed charter is
            invoiced at 5.2, 6.5, 7.8 or 12% depending on the yacht's certification,
            with 13% the statutory ceiling. APA runs 20 to 30% of the base for sailing
            yachts and catamarans and 30 to 40% for motor yachts, where fuel weighs
            heaviest, and marine VLSFO passed 650 US dollars a tonne in March 2026{" "}
            <Src id="gmh" />. A crew gratuity of 10 to 15% of the base is customary.
            Shoulder weeks, May and late September to October, price 15 to 25% below
            peak on the same rate card.
          </p>
        </Section>

        {/* DESTINATIONS */}
        <Section eyebrow="Destinations" h2="Where the 2026 enquiries want to go">
          <p>
            <Strong>Athens is the departure.</Strong> On this desk's log the most common
            request by a wide margin is an Athens to Athens week, with the Cyclades and
            Mykonos named next, and the Ionian and the Saronic behind them. Every charter
            we closed between June and September 2026 departs Athens.
          </p>
          <p>
            <Strong>The Cyclades carry the deepest demand and the Meltemi</Strong>, which
            favours larger, faster, more powerful yachts, so the boats that end up there
            sit higher in the rate table. On our own most-requested list Mykonos and
            Santorini still lead, Milos is the fastest rising, and Paros is the
            sophisticated alternative that younger clients ask for.
          </p>
          <p>
            <Strong>The Ionian and the Saronic are the best value in practice</Strong>:
            calmer water, close to Athens, little or no repositioning cost, and ideal
            conditions for a catamaran. The rate card does not change by region, so the
            saving shows up in the delivery line and in what is still available. Our
            weekly programmes run in the Saronic, the Cyclades and the Ionian from
            Athens; other Greek waters we quote on request.
          </p>
        </Section>

        {/* SEASON */}
        <Section eyebrow="Season patterns" h2="When 2026 clients book, and for when">
          <p>
            Across the wider market, average booking lead time fell from 118 days in
            2025 to 83 days in 2026, and median charter length rose from seven nights to
            eight <Src id="nj" />. We believe both figures and also that the average is
            easy to misread: it is dominated by shoulder and last-minute weeks, while
            the peak July and August weeks on the most requested Greek yachts still move
            six to twelve months ahead.
          </p>
          <p>
            <Strong>This desk's own log says the same thing from the other side.</Strong>{" "}
            Of the 57 dated enquiries received between 30 May and 6 September 2026, 26
            were already for 2027 or later, and the 2027 months most asked for were June
            and September, ahead of July and August. August was the busiest month for
            new enquiries, with 25 of the 68. Three of the four charters we closed in
            the window are for 2027 dates, confirmed a year ahead.
          </p>
          <p>
            <Strong>The shoulder is where the thoughtful client goes.</Strong> May and
            late September to October price 15 to 25% below peak, need three to four
            months of lead time rather than a year, and sit outside the Meltemi. That is
            a rule from our rate cards, not a forecast.
          </p>
        </Section>

        {/* METHODOLOGY */}
        <Section eyebrow="Methodology" h2="How this report was built">
          <p>
            This report was rewritten on 6 September 2026 to remove estimates that
            appeared in the May edition. Three sources remain, and each figure names
            its own.{" "}
            <Strong>The Greek Charter Index 2026</Strong> compiles the current rate cards
            of the 58 fully crewed yachts we represent; each band is the lowest and
            highest figure on a rate card, observed rather than modelled.{" "}
            <Strong>This desk's enquiry log</Strong> has recorded every charter request
            since 30 May 2026 and was read on 6 September 2026; its counts describe one
            brokerage house and are not a market share of anything.{" "}
            <Strong>Third-party publications</Strong> are linked where their figures
            appear: GTP Headlines, SuperYacht24 citing MYBA, a global brokerage
            house&rsquo;s market report, Booking Manager, The Traveler and Global Maritime Hub.
          </p>
          <p>
            We do not hold industry-wide booking data and do not claim to. Where the
            text offers a reading of the market rather than a figure, it is a broker's
            reading and is written as one.
          </p>
          <p>
            <Strong>For journalists and analysts</Strong>: we are happy to provide the
            rate cards behind any band, the enquiry counts behind any sentence, and
            on-record commentary. Contact{" "}
            <a href="mailto:george@georgeyachts.com" style={{ color: GOLD }}>george@georgeyachts.com</a>.
          </p>
        </Section>

        {/* CTA */}
        <section style={{ padding: "84px 24px", background: "rgba(218, 161, 16, 0.025)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(28px, 4vw, 40px)",
                fontWeight: 300,
                color: "#F8F5F0",
                margin: "0 0 32px",
                lineHeight: 1.2,
              }}
            >
              Plan your 2027 charter.
            </h2>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/yacht-finder"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "14px 26px",
                  background: "linear-gradient(135deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)",
                  color: NAVY,
                  border: "1px solid rgba(218, 161, 16, 0.6)",
                  textDecoration: "none",
                }}
              >
                Find a yacht
              </Link>
              <Link
                href="/#contact"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "14px 26px",
                  background: "transparent",
                  color: "rgba(248, 245, 240, 0.85)",
                  border: "1px solid rgba(248, 245, 240, 0.3)",
                  textDecoration: "none",
                }}
              >
                Speak with George
              </Link>
            </div>
          </div>
        </section>
      </article>
      {/* 2026-08-06 (job 9), sitewide footer. Measured before this change:
          397 of 474 public pages rendered no <footer> at all. */}
      <Footer />
    </>
  );
}
