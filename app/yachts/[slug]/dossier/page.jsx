// The Private Dossier — ASK B section 5.2 (2026-07-02).
//
// UHNW decisions are made by committee: spouse, PA, family office.
// This page is the artefact that gets forwarded: the yacht's
// particulars, the real numbers with the math shown, and George's
// note, on a single quiet page built to print (cmd+P → PDF).
//
// noindex by design: it is a private hand-over document, not a
// landing page, and it must never compete with /yachts/[slug].
// Reached via the DossierRequest email gate on the yacht page.

import { sanityClient } from "@/lib/sanity";
import { notFound } from "next/navigation";
import { extractPriceRange } from "@/lib/pricing";
import { FLEET_COUNT } from "@/lib/fleetCount";

export const revalidate = 3600;

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const INK = "#23282E";
const VELLUM = "#F4EFE6";

const QUERY = `*[_type == "yacht" && slug.current == $slug][0]{
  name, subtitle, builder, length, yearBuiltRefit, sleeps, cabins, crew,
  maxSpeed, cruiseSpeed, weeklyRatePrice, cruisingRegion, priceModel,
  georgeInsiderTip, idealFor, toys,
  "imageUrl": images[0].asset->url
}`;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let yacht = null;
  try {
    yacht = await sanityClient.fetch(QUERY, { slug });
  } catch {}
  return {
    title: yacht ? `${yacht.name} - Private Dossier` : "Private Dossier",
    robots: { index: false, follow: false },
    alternates: { canonical: `https://georgeyachts.com/yachts/${slug}` },
  };
}

const label = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 9,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  margin: "0 0 6px",
};

const value = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 14.5,
  lineHeight: 1.5,
  color: INK,
  margin: 0,
};

export default async function DossierPage({ params }) {
  const { slug } = await params;
  let yacht = null;
  try {
    yacht = await sanityClient.fetch(QUERY, { slug });
  } catch {}
  if (!yacht) notFound();

  const { low, high } = extractPriceRange(yacht.weeklyRatePrice);
  const guests = parseInt(yacht.sleeps) || null;
  const perGuestLow = low && guests ? Math.round(low / guests) : null;
  const perGuestHigh = high && guests ? Math.round(high / guests) : null;
  const fmt = (n) => `€${Number(n).toLocaleString("en-US")}`;

  const specs = [
    ["Builder", yacht.builder],
    ["Length", yacht.length],
    ["Year / Refit", yacht.yearBuiltRefit],
    ["Guests", yacht.sleeps],
    ["Cabins", yacht.cabins],
    ["Crew", yacht.crew],
    ["Cruising speed", yacht.cruiseSpeed],
    ["Region", yacht.cruisingRegion],
  ].filter(([, v]) => v);

  return (
    <div
      style={{
        background: VELLUM,
        minHeight: "100vh",
        color: INK,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "56px 32px 72px" }}>
        {/* Letterhead */}
        <header style={{ borderBottom: `1px solid ${GOLD}`, paddingBottom: 22, marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontFamily: "var(--gy-font-display)", fontSize: 19, letterSpacing: "0.18em", textTransform: "uppercase", color: NAVY, margin: 0, fontWeight: 400 }}>
            George Yachts
          </p>
          <p style={{ ...label, margin: 0 }}>Private Dossier · Prepared for your party</p>
        </header>

        {/* Identity */}
        <p style={label}>{yacht.subtitle || "Crewed charter yacht"}</p>
        <h1 style={{ fontFamily: "var(--gy-font-display)", fontSize: "clamp(34px, 6vw, 52px)", fontWeight: 300, color: NAVY, margin: "0 0 10px", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          {yacht.name}
        </h1>
        {yacht.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${yacht.imageUrl}?w=1200&h=675&fit=crop&auto=format&q=80`}
            alt={yacht.name}
            style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", margin: "18px 0 32px", border: "1px solid rgba(13,27,42,0.15)" }}
          />
        )}

        {/* Particulars */}
        <section style={{ marginBottom: 36 }}>
          <p style={{ ...label, marginBottom: 14 }}>The Particulars</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "16px 24px" }}>
            {specs.map(([k, v]) => (
              <div key={k}>
                <p style={{ ...label, fontSize: 8, color: "rgba(13,27,42,0.55)" }}>{k}</p>
                <p style={value}>{v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The numbers, shown honestly */}
        <section style={{ marginBottom: 36, border: "1px solid rgba(13,27,42,0.18)", padding: "24px 26px" }}>
          <p style={{ ...label, marginBottom: 14 }}>The Numbers, In Full</p>
          <table className="gy-tnum" style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)" }}>Weekly base rate (yacht + crew)</td>
                <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)", textAlign: "right", fontWeight: 600 }}>{yacht.weeklyRatePrice || "on request"}</td>
              </tr>
              {perGuestLow && (
                <tr>
                  <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)" }}>Per guest, at {guests} guests</td>
                  <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)", textAlign: "right" }}>
                    {fmt(perGuestLow)}{perGuestHigh && perGuestHigh !== perGuestLow ? ` to ${fmt(perGuestHigh)}` : ""} / week
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)" }}>APA (fuel, provisioning, berthing - transparent account)</td>
                <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)", textAlign: "right" }}>typically 25-40% of base</td>
              </tr>
              <tr>
                <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)" }}>Greek VAT (standard weekly crewed charter)</td>
                <td style={{ ...value, padding: "8px 0", borderBottom: "1px solid rgba(13,27,42,0.1)", textAlign: "right" }}>13%</td>
              </tr>
              <tr>
                <td style={{ ...value, padding: "8px 0" }}>Crew gratuity (customary, at your discretion)</td>
                <td style={{ ...value, padding: "8px 0", textAlign: "right" }}>15-20% of base</td>
              </tr>
            </tbody>
          </table>
          <p style={{ ...value, fontSize: 12, color: "rgba(13,27,42,0.6)", marginTop: 12 }}>
            George confirms the exact all-in figure for your dates in writing
            before any commitment. No line appears later.
          </p>
        </section>

        {/* George's note */}
        {yacht.georgeInsiderTip && (
          <section style={{ marginBottom: 36 }}>
            <p style={label}>A Note From George</p>
            <blockquote style={{ margin: 0, padding: "0 0 0 20px", borderLeft: `2px solid ${GOLD}`, fontFamily: "var(--gy-font-editorial)", fontSize: 17, fontStyle: "italic", lineHeight: 1.6, color: NAVY }}>
              {yacht.georgeInsiderTip}
            </blockquote>
          </section>
        )}

        {/* Ideal for */}
        {yacht.idealFor && (
          <section style={{ marginBottom: 36 }}>
            <p style={label}>She Suits</p>
            <p style={value}>{Array.isArray(yacht.idealFor) ? yacht.idealFor.join(" · ") : yacht.idealFor}</p>
          </section>
        )}

        {/* Contact block */}
        <footer style={{ borderTop: `1px solid ${GOLD}`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ ...value, fontWeight: 600, color: NAVY }}>George P. Biniaris</p>
            <p style={{ ...value, fontSize: 12.5 }}>Founder and Managing Broker · IYBA Member · MYBA-standard contracts</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ ...value, fontSize: 12.5 }}>george@georgeyachts.com</p>
            <p style={{ ...value, fontSize: 12.5 }}>georgeyachts.com/yachts/{slug}</p>
          </div>
        </footer>

        {/* Screen-only actions (hidden in print) */}
        <div className="gy-print-hide" style={{ marginTop: 36, textAlign: "center" }}>
          <p style={{ ...value, fontSize: 12.5, color: "rgba(13,27,42,0.6)" }}>
            To keep or forward this dossier: print it, or save as PDF (Cmd/Ctrl + P).
          </p>
        </div>
      </article>

      <style>{`
        @media print {
          .gy-print-hide { display: none !important; }
          nav, footer.gy-footer-depth, [class*="Forbes"], #CybotCookiebotDialog { display: none !important; }
          @page { margin: 14mm; }
        }
      `}</style>
    </div>
  );
}
