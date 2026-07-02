// Guide layer under the fleet grid — ASK A Move 3c (2026-07-02).
//
// The fetched competitor category pages run 3,200-5,000 editorial
// words plus 10-20 FAQs under their listings (MEMO-4-competitors.md);
// this page ran a grid and a trust strip. This server component adds
// the guide: a LIVE per-tier price table computed from the same fleet
// data the grid renders (never a hardcoded figure), the Charter Index
// stat callouts, a sample Saturday-to-Saturday week, seasons,
// embarkation bases read from the fleet records, a 10-question FAQ
// with matching FAQPage JSON-LD, and two real initialed reviews.
//
// Every number on this surface is either computed from Sanity at
// render time or quoted from lib/charterIndex2026.js / lib data.

import Link from "next/link";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";
import { REVIEWS, initials } from "@/lib/reviewsData";
import { extractPriceRange, extractLowPrice, isPerPerson } from "@/lib/pricing";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

const eyebrowStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 9,
  letterSpacing: "0.42em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  margin: "0 0 14px",
};

const h2Style = {
  fontFamily: "var(--gy-font-editorial)",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 300,
  color: CREAM,
  margin: "0 0 18px",
  lineHeight: 1.15,
};

const bodyStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 16,
  lineHeight: 1.75,
  color: "rgba(248, 245, 240, 0.85)",
  margin: "0 0 16px",
};

const goldLink = {
  color: GOLD,
  textDecoration: "none",
  borderBottom: "1px solid rgba(201,168,76,0.5)",
};

const thStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: "1px solid rgba(201,168,76,0.35)",
  whiteSpace: "nowrap",
};

const tdStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 13.5,
  color: "rgba(248, 245, 240, 0.85)",
  padding: "11px 14px",
  borderBottom: "1px solid rgba(248,245,240,0.08)",
  verticalAlign: "top",
};

const fmt = (n) => `€${Number(n).toLocaleString("en-US")}`;

// The FAQ lives here so the visible HTML and the FAQPage JSON-LD can
// never drift apart. Answers quote on-site sources only.
function buildFaqs(tiers) {
  const priceAnswer = tiers.private
    ? `Live from today's fleet: the fully crewed Private Fleet runs ${fmt(tiers.private.low)} to ${fmt(tiers.private.high)} per yacht per week base rate${tiers.explorerPP ? `, and the skippered Explorer Fleet starts around ${fmt(tiers.explorerPP)} per person per week` : ""}. On top come APA (typically 25 to 40%) and Greek VAT.`
    : "The fully crewed Private Fleet is priced per yacht per week; the skippered Explorer Fleet is priced per person. Every yacht page lists its live rate, and George confirms the full figure in writing before you commit.";
  return [
    {
      q: "How much does a yacht charter in Greece cost in 2026?",
      a: priceAnswer,
    },
    {
      q: "What is included in the base charter rate?",
      a: "The yacht and her professional crew. The running costs of your week (fuel, provisioning, berthing) are funded by the APA, the Advance Provisioning Allowance, typically 25 to 40% of the base rate depending on yacht type, run as a transparent account and settled at the end of the charter.",
    },
    {
      q: "What VAT applies to a Greek yacht charter in 2026?",
      a: "13% for the standard commercial crewed charter longer than 48 hours, which is what a weekly charter is. Short, static or bareboat arrangements carry 24%. Figures of 12% or 6.5% still circulating online are obsolete.",
    },
    {
      q: "Is crew gratuity included?",
      a: "No. Gratuity is customary rather than contractual: charterers typically hand 15 to 20% of the base rate to the captain at the end of the week, and the captain distributes it among the crew. In practice it is part of the real cost of the charter, so budget for it from the start.",
    },
    {
      q: "How far ahead should I book?",
      a: "Typical lead time for peak July and August weeks is 6 to 12 months, and premium 40m-plus yachts often commit a year or more ahead. June and September usually hold availability closer in, at softer rates for the same yacht.",
    },
    {
      q: "What is the difference between the Private Fleet and the Explorer Fleet?",
      a: "The Private Fleet is fully crewed: captain, chef and service crew, priced per yacht per week. The Explorer Fleet is skippered sailing and catamaran chartering, priced per person, lighter in style and closer to the water. Same broker, same Greek waters, two different rhythms.",
    },
    {
      q: "Where do charters embark?",
      a: "Most of the fleet bases around Athens, with several Explorer catamarans based in Lefkada, Corfu and Santorini. Embarkation from other islands is arranged with a repositioning fee that George quotes up front, never as a surprise line at settlement.",
    },
    {
      q: "Can we charter with more than 12 guests?",
      a: "Greek commercial regulations cap most charter yachts at 12 guests under way. Larger groups are handled legally with the right vessel class or a two-yacht flotilla. George has written a complete guide on how groups of 14 and more do it.",
    },
    {
      q: "What contract will I sign?",
      a: "MYBA-standard charter contracts, the industry-standard form used across the professional Mediterranean fleet: your dates, the yacht, the rate, the APA mechanics and the cancellation terms in writing before any payment.",
    },
    {
      q: "How do I know I am booking through a legitimate broker?",
      a: "Ask the questions that expose the pretenders: association membership (George Yachts is an IYBA member), the contract form used, how client funds are held, and whether you can speak with the same named broker from enquiry to disembarkation. George has published the full checklist on the Journal.",
    },
  ];
}

export default function FleetGuideSections({ yachts }) {
  // Live per-tier pricing computed from the SAME data the grid renders.
  const priv = (yachts || []).filter(
    (y) => (y.fleetTier === "private" || y.fleetTier === "both") && !isPerPerson(y)
  );
  const privRanges = priv.map((y) => extractPriceRange(y.weeklyRatePrice)).filter((r) => r.low);
  const explorerPP = (yachts || [])
    .filter((y) => y.fleetTier === "explorer" && isPerPerson(y))
    .map((y) => extractLowPrice(y.weeklyRatePrice))
    .filter(Boolean);
  const explorerYacht = (yachts || [])
    .filter((y) => y.fleetTier === "explorer" && !isPerPerson(y))
    .map((y) => extractLowPrice(y.weeklyRatePrice))
    .filter(Boolean);

  const tiers = {
    private: privRanges.length
      ? { low: Math.min(...privRanges.map((r) => r.low)), high: Math.max(...privRanges.map((r) => r.high)) }
      : null,
    explorerPP: explorerPP.length ? Math.min(...explorerPP) : null,
    explorerYacht: explorerYacht.length ? Math.min(...explorerYacht) : null,
  };

  const faqs = buildFaqs(tiers);
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const guideReviews = [REVIEWS[2], REVIEWS[1]].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />

      {/* COST 2026 — live table */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, textAlign: "center" }}>Rates · 2026</p>
          <h2 style={{ ...h2Style, textAlign: "center" }}>How much a Greek charter costs in 2026</h2>
          <p style={{ ...bodyStyle, maxWidth: 720, margin: "0 auto 32px", textAlign: "center" }}>
            The figures below are computed live from the fleet on this page,
            not copied from a brochure. Base rate covers the yacht and her
            crew; VAT and APA come on top, both quoted in writing.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <caption style={{ captionSide: "bottom", fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "rgba(248,245,240,0.5)", padding: "12px 0 0", textAlign: "left" }}>
                Live weekly base rates from the George Yachts fleet as rendered on this page, EUR, excluding VAT and APA.
              </caption>
              <thead>
                <tr>
                  <th style={thStyle}>Fleet</th>
                  <th style={thStyle}>Priced</th>
                  <th style={thStyle}>Weekly base rate</th>
                </tr>
              </thead>
              <tbody>
                {tiers.private && (
                  <tr>
                    <td style={tdStyle}>Private Fleet, full crew</td>
                    <td style={tdStyle}>per yacht</td>
                    <td style={tdStyle}>{fmt(tiers.private.low)} to {fmt(tiers.private.high)}</td>
                  </tr>
                )}
                {tiers.explorerPP && (
                  <tr>
                    <td style={tdStyle}>Explorer Fleet, skippered</td>
                    <td style={tdStyle}>per person</td>
                    <td style={tdStyle}>from {fmt(tiers.explorerPP)}</td>
                  </tr>
                )}
                {tiers.explorerYacht && (
                  <tr>
                    <td style={tdStyle}>Explorer Fleet, whole yacht</td>
                    <td style={tdStyle}>per yacht</td>
                    <td style={tdStyle}>from {fmt(tiers.explorerYacht)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p style={{ ...bodyStyle, maxWidth: 720, margin: "28px auto 0" }}>
            Two lines complete the true cost: <strong style={{ color: CREAM }}>13% VAT</strong> on
            the standard weekly crewed charter (short or bareboat arrangements
            carry 24%,{" "}
            <Link href="/greek-yacht-charter-vat-explained-2026" style={goldLink}>the 2026 VAT rules explained</Link>)
            and the{" "}
            <Link href="/advance-provisioning-allowance-apa-greek-yacht-charter-explained" style={goldLink}>APA</Link>{" "}
            of 25 to 40% for fuel, provisioning and berthing.{" "}
            <Link href="/whats-included-in-greek-yacht-charter-complete-2026-guide" style={goldLink}>What is included, in full</Link>, and the{" "}
            <Link href="/greek-charter-index-2026" style={goldLink}>Greek Charter Index 2026</Link>{" "}
            holds the market rates by yacht type and region.
          </p>

          {/* Stat callouts from the Index */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "rgba(201,168,76,0.15)", marginTop: 40 }}>
            {CHARTER_INDEX_2026.statCallouts.map((s) => (
              <div key={s.label} style={{ background: NAVY, padding: "26px 24px" }}>
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 21, color: GOLD, fontWeight: 400, margin: "0 0 8px", lineHeight: 1.2 }}>{s.value}</p>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12.5, lineHeight: 1.55, color: "rgba(248,245,240,0.72)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE WEEK */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrowStyle}>One Week, Well Spent</p>
          <h2 style={h2Style}>A sample Saturday-to-Saturday, Athens to the Cyclades</h2>
          <p style={bodyStyle}>
            Every week George plans is built around your party, but the shape
            of a classic first charter looks like this. Embark at the Athens
            marinas on Saturday afternoon and slip across to the Saronic for
            the first night at anchor,{" "}
            <Link href="/yacht-charter-poros-anchorages" style={goldLink}>Poros</Link>{" "}
            if you want a gentle start,{" "}
            <Link href="/yacht-charter-hydra" style={goldLink}>Hydra</Link>{" "}
            if you want the amphitheatre harbour at dusk. Sunday belongs to
            Hydra's car-free lanes and a long swim off{" "}
            <Link href="/yacht-charter-dokos-anchorages" style={goldLink}>Dokos</Link>.
          </p>
          <p style={bodyStyle}>
            Monday your captain reads the Meltemi and crosses into the western
            Cyclades:{" "}
            <Link href="/yacht-charter-sifnos" style={goldLink}>Sifnos</Link>{" "}
            for the food, the island George has been sending guests to for
            years before the food press caught up, then{" "}
            <Link href="/yacht-charter-milos" style={goldLink}>Milos</Link>{" "}
            for the lunar coastline at Kleftiko. Midweek runs to{" "}
            <Link href="/yacht-charter-paros" style={goldLink}>Paros</Link>{" "}
            and the shallow{" "}
            <Link href="/yacht-charter-antiparos-anchorages" style={goldLink}>Antiparos channel</Link>,
            and Friday closes at{" "}
            <Link href="/yacht-charter-mykonos" style={goldLink}>Mykonos</Link>{" "}
            or a quiet bay opposite on{" "}
            <Link href="/yacht-charter-rhenia-anchorages" style={goldLink}>Rhenia</Link>,
            depending on which version of the evening you want. Saturday
            morning, coffee on deck, disembark. The return leg is the
            captain's business, shaped to the forecast.{" "}
            <Link href="/yacht-itineraries-greece" style={goldLink}>More routes, region by region</Link>.
          </p>
          <blockquote
            style={{
              margin: "28px 0 0",
              padding: "0 0 0 22px",
              borderLeft: `1px solid ${GOLD}`,
              fontFamily: "var(--gy-font-editorial)",
              fontSize: 18,
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "rgba(248, 245, 240, 0.92)",
            }}
          >
            &ldquo;The itinerary is a sketch, never a contract. The best day of
            most charters is the one where the captain says: forget the plan,
            the wind just gave us somewhere better.&rdquo;
            <footer style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: GOLD, marginTop: 12, fontStyle: "normal" }}>
              George P. Biniaris
            </footer>
          </blockquote>
        </div>
      </section>

      {/* SEASONS + EMBARKATION */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={eyebrowStyle}>The Season</p>
          <h2 style={h2Style}>When to go, and where you step aboard</h2>
          <p style={bodyStyle}>
            The Greek season runs <strong style={{ color: CREAM }}>May through October</strong>.
            July and August are peak: the marquee weeks, the highest rates,
            and the Meltemi at its firmest, strongest from mid-July to
            mid-August, which is when motor yachts and catamarans earn their
            keep. <strong style={{ color: CREAM }}>June and September</strong> are
            the connoisseur's months: calmer wind, warm sea, softer rates for
            the same yacht. Mykonos and Santorini lead 2026 demand, with Milos
            the fastest-rising island, per the{" "}
            <Link href="/greek-charter-index-2026" style={goldLink}>Charter Index</Link>.
          </p>
          <p style={bodyStyle}>
            Most of the fleet bases around Athens, which is why the Saronic
            and the western Cyclades open a week so efficiently. Several
            Explorer Fleet catamarans base in Lefkada, Corfu and Santorini
            for Ionian and southern-Cyclades starts. Any other embarkation is
            possible with repositioning, quoted up front. If your dates are
            fixed to school-holiday August, decide 6 to 12 months out; the
            named flagships commit earliest.
          </p>
        </div>
      </section>

      {/* REVIEWS */}
      {guideReviews.length > 0 && (
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <p style={{ ...eyebrowStyle, textAlign: "center" }}>From the Guest Book</p>
            <h2 style={{ ...h2Style, textAlign: "center" }}>Weeks that were kept</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 36 }}>
              {guideReviews.map((r) => (
                <figure key={r.id} style={{ margin: 0, border: "1px solid rgba(201,168,76,0.2)", padding: "28px 30px", background: "rgba(248,245,240,0.02)" }}>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.28em", color: GOLD, margin: "0 0 14px" }} aria-label={`${r.rating} out of 5 stars`}>
                    {"★".repeat(r.rating)}
                  </p>
                  <blockquote style={{ margin: 0, fontFamily: "var(--gy-font-editorial)", fontSize: 15.5, fontStyle: "italic", lineHeight: 1.65, color: "rgba(248,245,240,0.88)" }}>
                    &ldquo;{r.body.length > 300 ? r.body.slice(0, r.body.lastIndexOf(" ", 300)) + " ..." : r.body}&rdquo;
                  </blockquote>
                  <figcaption style={{ marginTop: 16, fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(248,245,240,0.6)" }}>
                    {initials(r.author)} · {new Date(r.date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                    {r.verified ? " · Verified charter" : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p style={{ textAlign: "center", marginTop: 28 }}>
              <Link href="/reviews" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, color: GOLD, textDecoration: "none", paddingBottom: 4, borderBottom: `1px solid ${GOLD}` }}>
                All Charter Reviews →
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section
        style={{
          background: "rgba(201,168,76,0.025)",
          borderTop: "1px solid rgba(201,168,76,0.15)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{ ...eyebrowStyle, textAlign: "center" }}>Questions, Answered Straight</p>
          <h2 style={{ ...h2Style, textAlign: "center" }}>Chartering in Greece, 2026</h2>
          <div style={{ marginTop: 36 }}>
            {faqs.map((f) => (
              <details key={f.q} style={{ borderBottom: "1px solid rgba(248,245,240,0.1)", padding: "18px 4px" }}>
                <summary style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 18, fontWeight: 400, color: CREAM, cursor: "pointer", lineHeight: 1.4 }}>
                  {f.q}
                </summary>
                <p style={{ ...bodyStyle, margin: "14px 0 4px", fontSize: 15 }}>{f.a}</p>
              </details>
            ))}
          </div>
          <p style={{ ...bodyStyle, marginTop: 24, fontSize: 14, textAlign: "center" }}>
            Deeper answers:{" "}
            <Link href="/crewed-yacht-charter-greece" style={goldLink}>the crewed charter guide</Link>,{" "}
            <Link href="/greek-yacht-charter-2026-complete-pricing-guide" style={goldLink}>the complete pricing guide</Link>, and{" "}
            <Link href="/blog/how-to-choose-yacht-charter-broker-greece-2026" style={goldLink}>how to choose a broker</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
