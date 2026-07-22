// /yacht-charter-greece-2027 — the Early-Bird 2027 funnel page
// (George 2026-07-21: "με ενδιαφέρει πάρα πολύ η εβδομαδιαία ναύλα" -
// serious weekly-charter requests from serious budgets, booked EARLY).
//
// The premise is entirely true and time-stamped: the first September
// 2027 charter is at signatures on George's desk as this page ships,
// and owners publish 2027 rate cards in autumn 2026. The offer is
// CHOICE, not discount: tell George the month, the group and the mood
// now, and he puts you at the front of the queue when the calendars
// open. No availability listings, no last-minute positioning - this
// page exists to collect serious weekly inquiries 6-12 months out.
//
// GEO formatting rules applied (MEMO-1-geo-citations.md): visible HTML
// table, self-contained 120-180 word sections under question headings,
// quotable first-person George lines, dated content. Every figure comes
// from lib/charterIndex2026.js (labelled as the 2026 reference) -
// nothing invented, no 2027 numbers before owners publish them.

import React from "react";
import Link from "next/link";
import { FLEET_COUNT } from "@/lib/fleetCount";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import BriefGeorgeBanner from "@/app/components/BriefGeorgeBanner";
import BrowseSeoCategories from "@/app/components/seo/BrowseSeoCategories";
import FirstAccessBand from "@/app/components/FirstAccessBand";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import LastUpdated from "@/app/components/seo/LastUpdated";

export const revalidate = 3600;

const CANONICAL = "https://georgeyachts.com/yacht-charter-greece-2027";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const metadata = {
  title: `Yacht Charter Greece 2027: The Priority Window`,
  description: `Planning a 2027 crewed yacht charter in Greece? Owners publish 2027 rate cards in autumn 2026 and the best weeks go first. How the priority window works, the 2026 reference rates, and how to reserve first look.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: "Yacht Charter Greece 2027 | George Yachts",
    description:
      "The 2027 Greek charter season opens in autumn 2026. Priority access to the curated Private Fleet, arranged personally by George P. Biniaris.",
    url: CANONICAL,
    images: [
      `/api/og?title=${encodeURIComponent("Yacht Charter Greece 2027")}&eyebrow=${encodeURIComponent("The Priority Window")}`,
    ],
  },
};

// The FAQ copy lives in one place so the visible HTML and the
// FAQPage JSON-LD can never drift apart.
const FAQS = [
  {
    q: "When should I book a yacht charter in Greece for summer 2027?",
    a: "The practical answer is autumn 2026. Owners settle their 2027 rate cards in the autumn, repeat clients get the first look even earlier, and the most requested yachts see their late-July and August 2027 weeks spoken for months before the season. Booking early is not primarily about price; it is about choice: the right yacht, the right layout, the right crew, the right week. The first 2027 contracts are already being signed as of July 2026.",
  },
  {
    q: "Are 2027 charter rates published yet?",
    a: "Mostly not. Owners publish 2027 rate cards in the autumn of 2026, which is exactly why the priority window matters: whoever has already told their broker the month, the group and the budget gets the first proposals the day the cards appear. Until then, the George Yachts Greek Charter Index 2026 is the honest reference for what each yacht class costs per week, and 2027 figures typically land in the same neighbourhood adjusted by each owner individually.",
  },
  {
    q: "How does the 2027 priority list work?",
    a: "You write to George with three things: the month you are considering, the size and shape of your group, and the mood of the week you want. He watches the calendars of the curated fleet as owners open 2027, and when the yachts that fit your brief publish their weeks, you hear about it before the season opens to the general market. No commitment is taken from you at that stage; the point is that you choose while the calendar is still full.",
  },
  {
    q: "Which 2027 weeks go first in Greece?",
    a: "Late July and August go first, always: they combine European school holidays with the warmest sea. The first half of September follows closely, prized by couples and adult groups for warm water without the crowds. June is the sweet spot for value and daylight. If your dates are tied to school calendars, those weeks are precisely the ones to reserve early, because they are the ones everyone else's school calendar points at too.",
  },
  {
    q: "How much does a crewed yacht charter in Greece cost per week?",
    a: "Using the 2026 Index as the reference: a crewed sailing catamaran for up to 12 guests runs roughly EUR 15,000 to 40,000 per week net base in peak season; crewed motor yachts of 24 to 34 metres around EUR 30,000 to 100,000; 35 to 49 metres about EUR 100,000 to 350,000; and 50-metre-plus superyachts from EUR 250,000 upward. On top of the base fee sit VAT at the yacht's certified rate and the APA for running expenses.",
  },
  {
    q: "Can I hold a 2027 week without committing?",
    a: "Formally holding a week requires a contract and a deposit, and serious owners will not block peak weeks on a conversation. What the priority list gives you instead is speed: when your shortlist opens, you see it first and can move first. In a market where the best weeks are decided months out, first look is usually the whole game.",
  },
  {
    q: "Do you charter outside Greece?",
    a: "No. George Yachts works Greek waters exclusively: the Cyclades, the Ionian, the Saronic Gulf, the Dodecanese and the Sporades. That focus is the reason the fleet is curated rather than listed, and the reason the advice is first-hand.",
  },
];

function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Yacht Charter Greece 2027 - Priority Booking",
    serviceType: "Crewed yacht charter, 2027 season priority access",
    provider: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts",
    },
    areaServed: { "@type": "Country", name: "Greece" },
    url: CANONICAL,
    description:
      "Priority access to the 2027 Greek charter season: curated crewed yachts, first look as owners open their 2027 calendars in autumn 2026.",
  };
}

const eyebrowStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  margin: "0 0 14px",
};

const h2Style = {
  fontFamily: "var(--gy-font-editorial)",
  fontSize: "clamp(26px, 3.5vw, 40px)",
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

const thStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  textAlign: "left",
  padding: "12px 14px",
  borderBottom: `1px solid rgba(201,168,76,0.35)`,
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

const goldLink = {
  color: GOLD,
  textDecoration: "none",
  borderBottom: `1px solid rgba(201,168,76,0.5)`,
};

const stepNumStyle = {
  fontFamily: "var(--gy-font-editorial)",
  fontSize: 44,
  fontWeight: 300,
  color: GOLD,
  lineHeight: 1,
  margin: "0 0 12px",
};

export default function Charter2027Page() {
  const index = CHARTER_INDEX_2026;

  return (
    <div style={{ minHeight: "100vh", background: NAVY, color: CREAM, fontFamily: "var(--gy-font-ui)" }}>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Yacht Charter Greece 2027", url: CANONICAL },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }} />

      {/* HERO - text-first editorial */}
      <header style={{ padding: "140px 24px 64px", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={eyebrowStyle}>The 2027 Season · Priority Window</p>
          <h1
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(40px, 6.5vw, 82px)",
              fontWeight: 300,
              lineHeight: 1.05,
              margin: "0 0 26px",
              color: CREAM,
            }}
          >
            Yacht Charter Greece 2027
          </h1>
          <p style={{ ...bodyStyle, fontSize: 18, maxWidth: 720 }}>
            As I write this, the first September 2027 charter is at signatures on my desk: fourteen months
            out. That is not an anomaly; that is how the best weeks of a Greek season have always been
            decided. The 2027 calendars open in the autumn of 2026, and the people who have already told
            me their month, their group and their mood will see them first.
          </p>
          <LastUpdated date="2026-07-21" />
        </div>
      </header>

      <QuickAnswerBlock
        question="When does the 2027 Greek charter season open for booking?"
        answer={`Effectively in autumn 2026, when owners settle their 2027 rate cards; repeat clients see the calendars even earlier, and the first 2027 contracts are already being signed as of July 2026. The most requested yachts have their late-July and August 2027 weeks spoken for months before the season. Early booking buys choice, not discounts: the right yacht, layout, crew and week. Reference pricing: crewed catamarans roughly EUR 15,000-40,000 per week net; motor yachts 24-34m EUR 30,000-100,000 (2026 Index).`}
      />

      {/* WHY AUTUMN DECIDES THE SUMMER */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={eyebrowStyle}>How the calendar really works</p>
          <h2 style={h2Style}>Why autumn 2026 decides summer 2027</h2>
          <p style={bodyStyle}>
            A charter season has a quiet season of its own, and it happens in the autumn before. That is
            when owners look at how their year went, settle next season&apos;s rate cards, and open the
            calendar. The first calls go to the people who chartered the yacht before. The second go to
            the brokers who kept their clients close all year. By the time the general market starts
            searching in spring, the specific weeks everyone wants, late July and August on the most
            loved yachts, are already conversations, contracts or gone.
          </p>
          <p style={bodyStyle}>
            This is why I treat autumn as the most important working season of my year. My clients do not
            get discounts for being early; serious owners rarely need to discount weeks that will sell
            anyway. What they get is the thing money cannot buy back in June:{" "}
            <Link href="/blog/yacht-charter-greece-september-2026" style={goldLink}>
              first choice
            </Link>
            . The yacht they actually want, in the week their family can actually travel.
          </p>
          <p style={bodyStyle}>
            If 2027 is on your horizon at all, the useful move costs nothing: tell me the month, the group
            and the mood now, and let the calendar come to you when it opens.
          </p>
        </div>
      </section>

      {/* THE PRIORITY LIST - 3 steps */}
      <section style={{ padding: "72px 24px", background: "rgba(201,168,76,0.04)", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ ...h2Style, textAlign: "center" }}>The 2027 priority list, in three steps</h2>
          <p style={{ ...bodyStyle, textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            No commitment, no deposit, no obligation. Just the information that lets me work for you
            before the market wakes up.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            <div>
              <p style={stepNumStyle}>1</p>
              <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 22, fontWeight: 400, color: CREAM, margin: "0 0 10px" }}>
                Write to me
              </h3>
              <p style={{ ...bodyStyle, fontSize: 15 }}>
                The month you are considering, who is coming, and the mood of the week: quiet coves or
                lively harbours, sail or motor, family or friends. Five minutes of your time.
              </p>
            </div>
            <div>
              <p style={stepNumStyle}>2</p>
              <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 22, fontWeight: 400, color: CREAM, margin: "0 0 10px" }}>
                I watch the calendars
              </h3>
              <p style={{ ...bodyStyle, fontSize: 15 }}>
                Through the autumn I follow the curated fleet, {FLEET_COUNT} crewed yachts I know
                first-hand, as owners publish their 2027 rate cards and open their weeks.
              </p>
            </div>
            <div>
              <p style={stepNumStyle}>3</p>
              <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 22, fontWeight: 400, color: CREAM, margin: "0 0 10px" }}>
                You choose first
              </h3>
              <p style={{ ...bodyStyle, fontSize: 15 }}>
                When the yachts that fit your brief open, you get a personal proposal before the season
                reaches the open market. You decide with the calendar still full.
              </p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link
              href="/inquiry"
              style={{
                display: "inline-block",
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "16px 32px",
                background: GOLD,
                color: NAVY,
                textDecoration: "none",
              }}
            >
              Join the 2027 priority list
            </Link>
          </div>
        </div>
      </section>

      {/* WHICH WEEKS GO FIRST */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={eyebrowStyle}>The 2027 calendar, honestly</p>
          <h2 style={h2Style}>Which 2027 weeks go first, and who they suit</h2>
          <p style={bodyStyle}>
            <strong>Late July and August</strong> go first, every year: European school holidays meet the
            warmest sea, and the demand is structural. If your dates are tied to a school calendar, these
            are exactly the weeks to reserve early, because everyone else&apos;s school calendar points at
            them too. The{" "}
            <Link href="/best-time-charter-yacht-greece-month-by-month-2026" style={goldLink}>
              month-by-month guide
            </Link>{" "}
            walks the whole year.
          </p>
          <p style={bodyStyle}>
            <strong>Early September</strong> follows closely, and I will argue it is the finest water of
            the season: the sea at its warmest, the Meltemi fading, the crowds gone. It is the month
            couples and adult groups fight over quietly; I have made{" "}
            <Link href="/blog/yacht-charter-greece-september-2026" style={goldLink}>
              the full case for September
            </Link>{" "}
            elsewhere, and the first September 2027 contract on my desk suggests the argument is landing.
          </p>
          <p style={bodyStyle}>
            <strong>June</strong> is the connoisseur&apos;s value: long daylight, warm air, rates a step
            below peak. <strong>May and early October</strong> reward flexibility most of all. And for
            American families planning around US school breaks, Memorial Day week and the last two weeks
            of June are the practical sweet spot: summer conditions before the European rush peaks.
          </p>
        </div>
      </section>

      {/* REFERENCE RATES - real Index data, honestly labelled */}
      <section style={{ padding: "72px 24px", background: "rgba(201,168,76,0.04)", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ ...h2Style, textAlign: "center" }}>What a 2027 week is likely to cost</h2>
          <p style={{ ...bodyStyle, textAlign: "center", maxWidth: 720, margin: "0 auto 12px" }}>
            Owners publish 2027 rate cards in autumn 2026. Until then, the honest reference is the{" "}
            <Link href="/greek-charter-index-2026" style={goldLink}>
              George Yachts Greek Charter Index 2026
            </Link>
            : weekly net base fees, excluding VAT at the yacht&apos;s certified rate and{" "}
            <Link href="/glossary/apa" style={goldLink}>
              APA
            </Link>
            .
          </p>
          <p style={{ ...bodyStyle, fontSize: 13, textAlign: "center", color: "rgba(248,245,240,0.6)", margin: "0 auto 36px" }}>
            2026 peak-season reference. 2027 figures are set by each owner individually.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr>
                  {index.summaryTable.columns.map((c, i) => (
                    <th key={i} style={thStyle}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {index.summaryTable.rows.map((r, i) => (
                  <tr key={i}>
                    {r.cells.map((cell, j) => (
                      <td key={j} className="gy-tnum" style={{ ...tdStyle, whiteSpace: j === 0 ? "normal" : "nowrap" }}>
                        {j === 0 ? cell : cell === "-" ? "-" : `€ ${cell}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...bodyStyle, fontSize: 14, marginTop: 20, textAlign: "center" }}>
            Start from the fleet itself:{" "}
            <Link href="/crewed-catamaran-charter-greece" style={goldLink}>
              crewed catamarans
            </Link>
            ,{" "}
            <Link href="/power-catamaran-charter-greece" style={goldLink}>
              power catamarans
            </Link>
            ,{" "}
            <Link href="/best-5-cabin-catamarans-greece" style={goldLink}>
              five-cabin family yachts
            </Link>{" "}
            or the full{" "}
            <Link href="/crewed-yacht-charter-greece" style={goldLink}>
              crewed charter guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* WHO THIS IS FOR / NOT FOR - the honest section */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={eyebrowStyle}>The honest paragraph</p>
          <h2 style={h2Style}>Who the priority window is for, and who it is not</h2>
          <p style={bodyStyle}>
            It is for families and groups who already know roughly when they can travel in 2027 and want
            the pick of the fleet for a full week: the{" "}
            <Link href="/blog/is-catamaran-best-yacht-charter-greece-2026" style={goldLink}>
              catamaran families
            </Link>
            , the milestone birthdays, the{" "}
            <Link href="/honeymoon-yacht-charter-greece" style={goldLink}>
              honeymoons
            </Link>{" "}
            with fixed dates, the three-generation reunions that need five cabins and cannot improvise. If
            that is you, early is simply the intelligent move.
          </p>
          <p style={bodyStyle}>
            It is not for everyone. If your dates will not firm up until spring, or you enjoy the sport of
            a spontaneous week, you lose nothing by waiting, and I will tell you so. Greece is generous;
            there is always a good boat somewhere. What there is not, later, is the particular boat you
            wanted in the particular week you needed. First-timers weighing the whole idea should start
            with{" "}
            <Link href="/blog/is-greek-yacht-charter-right-for-us-seasickness-safety-2026" style={goldLink}>
              every first-timer worry, answered honestly
            </Link>{" "}
            or the{" "}
            <Link href="/blog/the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece" style={goldLink}>
              complete first-timer&apos;s guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ - visible HTML matching the FAQPage schema */}
      <section style={{ padding: "72px 24px", background: "rgba(201,168,76,0.04)", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={{ ...h2Style, textAlign: "center" }}>2027 charter FAQ</h2>
          <div style={{ marginTop: 40 }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ borderBottom: "1px solid rgba(248,245,240,0.1)", padding: "18px 0" }}>
                <summary
                  style={{
                    fontFamily: "var(--gy-font-editorial)",
                    fontSize: 19,
                    fontWeight: 400,
                    color: CREAM,
                    cursor: "pointer",
                    listStyle: "none",
                  }}
                >
                  {f.q}
                </summary>
                <p style={{ ...bodyStyle, fontSize: 15, marginTop: 12 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BriefGeorgeBanner />
      <FirstAccessBand />
      <BrowseSeoCategories />

      {/* TRUST STRIP */}
      <section style={{ padding: "56px 24px 84px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.06)" }}>
        <p style={{ ...eyebrowStyle, marginBottom: 18 }}>Trusted Brokerage</p>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, letterSpacing: "0.14em", color: "rgba(248,245,240,0.78)", margin: "0 0 30px" }}>
          IYBA Member · MYBA-Standard Contracts · Featured in Forbes, May 2026 · Greek Waters Exclusively
        </p>
        <Link
          href="/inquiry"
          style={{
            display: "inline-block",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "16px 32px",
            background: GOLD,
            color: NAVY,
            textDecoration: "none",
          }}
        >
          Join the 2027 priority list
        </Link>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.6)", marginTop: 18 }}>
          George replies personally within 24 hours.
        </p>
      </section>

      <Footer />
    </div>
  );
}
