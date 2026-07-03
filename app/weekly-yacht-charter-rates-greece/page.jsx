import { WHATSAPP_DOWN } from "@/lib/whatsappStatus";
// Weekly Yacht Charter Rates Greece - the all-in rate card.
//
// 2026-06-26. The "weekly motor rates" data weapon. A real, crawlable HTML
// <table> of all-in weekly cost by motor-yacht size band x season, computed
// live from lib/weeklyMotorRates.js (which derives from George Yachts' own
// rate model in lib/charterCostData.js). Front-loaded 40-60 word answer in the
// first 30% of the page, question-style headings, Dataset + FAQPage +
// BreadcrumbList JSON-LD, dated freshness. Distinct from the Greek Charter
// Index (type x region, net base) - this is what a charterer actually pays.

import Link from "next/link";
import { pageMeta } from "@/lib/pageMeta";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LastUpdated from "@/app/components/seo/LastUpdated";
import {
  TITLE,
  DESCRIPTION,
  DATA_MODIFIED,
  INTRO,
  buildMatrix,
  buildBreakdownTable,
  quickAnswer,
  methodology,
  statCallouts,
  faqItems,
} from "@/lib/weeklyMotorRates";

const SLUG = "weekly-yacht-charter-rates-greece";
const URL = `https://georgeyachts.com/${SLUG}`;

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const metadata = pageMeta({
  title: "Weekly Yacht Charter Rates Greece 2026",
  description: DESCRIPTION,
  path: `/${SLUG}`,
});

function DataTable({ table }) {
  if (!table || !Array.isArray(table.columns) || !table.columns.length) return null;
  return (
    <div style={{ overflowX: "auto", margin: "0 0 12px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--gy-font-ui)", fontSize: 14 }}>
        <thead>
          <tr>
            {table.columns.map((c, i) => (
              <th
                key={i}
                style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "12px 16px",
                  borderBottom: `1px solid ${GOLD}`,
                  color: GOLD,
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(table.rows || []).map((row, ri) => (
            <tr key={ri}>
              {(row.cells || []).map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    textAlign: ci === 0 ? "left" : "right",
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(248,245,240,0.1)",
                    color: ci === 0 ? CREAM : "rgba(248,245,240,0.85)",
                    fontWeight: ci === 0 ? 500 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.caption && (
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 12,
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            color: "rgba(248,245,240,0.55)",
            margin: "12px 0 0",
          }}
        >
          {table.caption}
        </p>
      )}
    </div>
  );
}

export default function WeeklyRatesPage() {
  const matrix = buildMatrix();
  const breakdown = buildBreakdownTable();
  const qa = quickAnswer();
  const stats = statCallouts();
  const faqs = faqItems();

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
    { name: "Weekly Charter Rates", url: URL },
  ];

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${URL}#dataset`,
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    dateModified: DATA_MODIFIED,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      "@id": "https://georgeyachts.com/#organization",
      name: "George Yachts Brokerage House",
      url: "https://georgeyachts.com",
    },
    publisher: { "@type": "Organization", "@id": "https://georgeyachts.com/#organization" },
    variableMeasured: ["All-in weekly charter cost", "Base charter fee", "APA", "VAT", "Crew gratuity", "Per-guest cost"],
    measurementTechnique: "George Yachts 2026 closing book and IYBA pricing surveys",
    spatialCoverage: { "@type": "Place", name: "Greece (Cyclades, Ionian, Saronic, Dodecanese)" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: DATA_MODIFIED,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".gy-qa-text"] },
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "160px 24px 40px", borderBottom: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
              Original rate data · Motor yachts · 2026
            </p>
            <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 300, margin: "0 0 18px", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              Weekly Yacht Charter Rates in Greece
            </h1>
            <LastUpdated date={DATA_MODIFIED} />
          </div>
        </header>

        {/* QUICK ANSWER + MATRIX - first 30% (AI-extraction zone) */}
        <section style={{ padding: "48px 24px 24px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p
              className="gy-qa-text"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(18px, 2.2vw, 23px)",
                fontWeight: 300,
                lineHeight: 1.5,
                color: CREAM,
                margin: "0 0 16px",
                maxWidth: 820,
              }}
            >
              {qa}
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.7, color: "rgba(248,245,240,0.82)", margin: "0 0 36px", maxWidth: 760 }}>
              {INTRO}
            </p>

            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 300, color: CREAM, margin: "0 0 18px" }}>
              What does a weekly motor yacht charter in Greece cost?
            </h2>
            <DataTable table={matrix} />
          </div>
        </section>

        {/* STAT CALLOUTS */}
        <section style={{ padding: "24px 24px 48px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${GOLD}`, padding: "8px 0 8px 20px" }}>
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 32, fontWeight: 300, color: GOLD, margin: "0 0 8px", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, lineHeight: 1.45, color: "rgba(248,245,240,0.75)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BREAKDOWN - what's inside the all-in */}
        <section style={{ padding: "16px 24px 48px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 300, color: CREAM, margin: "0 0 14px" }}>
              What is included in the all-in weekly rate?
            </h2>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.7, color: "rgba(248,245,240,0.82)", margin: "0 0 24px" }}>
              The base charter fee covers the yacht, its full crew and insurance. APA is a pre-paid provisioning fund for fuel, food and drink, berths and incidentals, reconciled against actual spend at the end of the week. VAT and a discretionary crew gratuity complete the figure.
            </p>
            <DataTable table={breakdown} />
          </div>
        </section>

        {/* METHODOLOGY */}
        <section style={{ padding: "32px 24px", background: "rgba(201,168,76,0.03)", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 14px" }}>Methodology and VAT basis</p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, lineHeight: 1.7, color: "rgba(248,245,240,0.75)", margin: 0 }}>{methodology()}</p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "56px 24px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: CREAM, margin: "0 0 28px" }}>Frequently asked questions</h2>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(248,245,240,0.1)", padding: "18px 0" }}>
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 18, color: CREAM, margin: "0 0 8px" }}>{f.question}</p>
                <p className="gy-qa-text" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.65, color: "rgba(248,245,240,0.78)", margin: 0 }}>{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED / INTERNAL LINKS */}
        <section style={{ padding: "32px 24px 8px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 16px" }}>Go deeper</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
              <li>
                <Link href="/weekly-motor-yacht-charter-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>Weekly motor yacht charter Greece</Link>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248,245,240,0.6)" }}> - the full guide to a 7-night motor week: cost, what is included, where to embark, a sample route.</span>
              </li>
              <li>
                <Link href="/motor-yacht-charter-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>Motor yacht charter Greece</Link>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248,245,240,0.6)" }}> - the fleet, builders and what a motor week is really like.</span>
              </li>
              <li>
                <Link href="/greek-charter-index-2026" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>Greek Charter Index 2026</Link>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248,245,240,0.6)" }}> - our market data on rates by yacht type and region.</span>
              </li>
              <li>
                <Link href="/charter-cost-estimator" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>Charter cost estimator</Link>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248,245,240,0.6)" }}> - run your own all-in figure for any size, season and length.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "56px 24px 80px", textAlign: "center" }}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inquiry" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
              Brief George directly
            </Link>
            <a href={WHATSAPP_DOWN ? "/inquiry" : "https://wa.me/17867988798?text=Hi%20George%2C%20I%20would%20like%20a%20weekly%20motor%20yacht%20charter%20quote%20for%20Greece."} target={WHATSAPP_DOWN ? undefined : "_blank"} rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600, padding: "14px 26px", border: `1px solid ${GOLD}`, color: GOLD, textDecoration: "none" }}>
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
