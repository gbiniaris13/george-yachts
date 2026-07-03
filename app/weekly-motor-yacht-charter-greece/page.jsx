import { WHATSAPP_DOWN, WHATSAPP_NUMBER } from "@/lib/whatsappStatus";
// Weekly Motor Yacht Charter Greece - the pillar/hub page.
//
// 2026-06-26. Wedge page for "weekly motor yacht charter Greece". Quick Answer
// in the first 30%, question-style H2s each opening with a 40-60 word answer,
// a sample 7-day route, and a hub-link cluster down to the rest of the motor
// network. Article + FAQPage + BreadcrumbList JSON-LD, dated freshness, and a
// discreet WhatsApp CTA. Content + cost figures come from lib/weeklyMotorPillar
// (which inherits numbers from the rate card, so nothing drifts).

import Link from "next/link";
import { pageMeta } from "@/lib/pageMeta";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LastUpdated from "@/app/components/seo/LastUpdated";
import {
  SLUG,
  TITLE,
  DESCRIPTION,
  DATE_PUBLISHED,
  DATA_MODIFIED,
  quickAnswer,
  sections,
  faqItems,
  HUB_LINKS,
} from "@/lib/weeklyMotorPillar";

const URL = `https://georgeyachts.com/${SLUG}`;
// 2026-07-03: while the company WhatsApp is under review, route to /inquiry
const WHATSAPP = WHATSAPP_DOWN ? "/inquiry" : `https://wa.me/${WHATSAPP_NUMBER}`;

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export const metadata = pageMeta({
  title: "Weekly Motor Yacht Charter Greece 2026",
  description: DESCRIPTION,
  path: `/${SLUG}`,
});

export default function WeeklyMotorPillarPage() {
  const qa = quickAnswer();
  const secs = sections();
  const faqs = faqItems();

  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Motor Yacht Charter Greece", url: "https://georgeyachts.com/motor-yacht-charter-greece" },
    { name: "Weekly Motor Yacht Charter", url: URL },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${URL}#article`,
    headline: "Weekly Motor Yacht Charter Greece: All-in Cost, What Is Included, and a Sample 7-Day Route",
    description: DESCRIPTION,
    url: URL,
    datePublished: DATE_PUBLISHED,
    dateModified: DATA_MODIFIED,
    inLanguage: "en",
    image: `https://georgeyachts.com/api/og?title=${encodeURIComponent("Weekly Motor Yacht Charter Greece")}&eyebrow=${encodeURIComponent("All-in weekly rates")}`,
    author: { "@type": "Person", "@id": "https://georgeyachts.com/about/george-p-biniaris#person", name: "George P. Biniaris" },
    publisher: { "@type": "Organization", "@id": "https://georgeyachts.com/#organization" },
    isPartOf: { "@type": "WebSite", "@id": "https://georgeyachts.com/#website" },
    about: { "@type": "Service", "@id": "https://georgeyachts.com/#service" },
    mainEntityOfPage: URL,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <BreadcrumbSchema items={breadcrumbs} />

      <article style={{ background: NAVY, minHeight: "100vh", color: CREAM }}>
        {/* HERO */}
        <header style={{ padding: "160px 24px 40px", borderBottom: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 18px" }}>
              The 7-night motor yacht week · Greece
            </p>
            <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 300, margin: "0 0 18px", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              Weekly Motor Yacht Charter Greece
            </h1>
            <LastUpdated date={DATA_MODIFIED} />
          </div>
        </header>

        {/* QUICK ANSWER - first 30% (AI-extraction zone) */}
        <section style={{ padding: "48px 24px 8px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <p
              className="gy-qa-text"
              style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(18px, 2.2vw, 23px)", fontWeight: 300, lineHeight: 1.5, color: CREAM, margin: "0 0 8px" }}
            >
              {qa}
            </p>
          </div>
        </section>

        {/* SECTIONS - question H2s with answers */}
        <section style={{ padding: "24px 24px 32px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            {secs.map((s, i) => (
              <div key={i} style={{ marginBottom: 44 }}>
                <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 300, color: CREAM, margin: "0 0 14px", lineHeight: 1.2 }}>
                  {s.q}
                </h2>
                <p className="gy-qa-text" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 16, lineHeight: 1.7, color: "rgba(248,245,240,0.85)", margin: "0 0 14px" }}>
                  {s.a}
                </p>

                {Array.isArray(s.route) && (
                  <ol style={{ listStyle: "none", padding: 0, margin: "8px 0 14px", display: "grid", gap: 12 }}>
                    {s.route.map((d, di) => (
                      <li key={di} style={{ borderLeft: `2px solid ${GOLD}`, padding: "4px 0 4px 18px" }}>
                        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD, fontWeight: 700, margin: "0 0 4px" }}>
                          {d.day} · {d.title}
                        </p>
                        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, lineHeight: 1.6, color: "rgba(248,245,240,0.78)", margin: 0 }}>{d.body}</p>
                      </li>
                    ))}
                  </ol>
                )}

                {s.link && (
                  <Link href={s.link.href} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, letterSpacing: "0.04em", color: GOLD, textDecoration: "none", borderBottom: `1px solid rgba(201,168,76,0.5)` }}>
                    {s.link.label} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* HUB LINKS - the motor cluster */}
        <section style={{ padding: "8px 24px 8px", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ maxWidth: 980, margin: "0 auto", paddingTop: 36 }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 20px" }}>
              Plan your motor week
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
              {HUB_LINKS.map((l, i) => (
                <Link key={i} href={l.href} style={{ textDecoration: "none", display: "block", border: "1px solid rgba(201,168,76,0.2)", padding: "18px 20px" }}>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 15, color: CREAM, margin: "0 0 6px", fontWeight: 500 }}>{l.label}</p>
                  <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, lineHeight: 1.45, color: "rgba(248,245,240,0.6)", margin: 0 }}>{l.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - inquiry + discreet WhatsApp */}
        <section style={{ padding: "64px 24px 88px", textAlign: "center", borderTop: "1px solid rgba(201,168,76,0.15)", marginTop: 40 }}>
          <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 300, color: CREAM, margin: "0 0 24px", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            Tell us your dates and your islands. George will shortlist the right motor yacht personally.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inquiry" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", background: GOLD, color: NAVY, textDecoration: "none" }}>
              Brief George directly
            </Link>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, padding: "14px 26px", border: `1px solid ${GOLD}`, color: GOLD, textDecoration: "none" }}>
              {WHATSAPP_DOWN ? "Message George Directly" : "Message on WhatsApp"}
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
