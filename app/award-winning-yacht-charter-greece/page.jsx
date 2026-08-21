// Award-winning yacht charter in Greece.
//
// 2026-08-20 (design pass, job 16, on George's instruction).
//
// Why a page and not just the homepage band: the six awarded yachts have the
// best click-through in the fleet and almost no impressions to spend it on,
// while the cheapest catamaran takes most of the clicks the fleet earns
// because it happens to rank for its own name. A band on the homepage cannot
// rank for anything. A page can, and it gives the six something they do not
// otherwise have, which is a relevant page linking to them by name.
//
// What it is allowed to compete for: "award winning yacht charter greece" and
// the chef-and-crew phrasings around it. NOT "crewed yacht charter greece",
// which /crewed-yacht-charter-greece already owns, and not the type or size
// terms belonging to the nine category pages. Fighting our own pages is the
// mistake the crewed cluster already made once.
//
// Everything factual here is sourced. The two shows were read off the
// organisers' own sites on 2026-08-20: mediterraneanyachtshow.gr calls MEDYS
// "the world's largest crewed yacht charter show" and holds it at Nafplio;
// eastmedyachtshow.gr gives Piraeus as the venue. The awards themselves come
// from lib/yachtAwards.js, where each one carries the agent page it was read
// on, and scripts/checkAwardClaims.mjs fails the build if one ever does not.

import React from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import BriefGeorgeBanner from "@/app/components/BriefGeorgeBanner";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import { YACHT_AWARDS, awardsFor, awardLine, headlineAward } from "@/lib/yachtAwards";

const CANONICAL = "https://georgeyachts.com/award-winning-yacht-charter-greece";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";
const GOLD = "#C9A84C";

const SLUGS = Object.keys(YACHT_AWARDS).filter((s) => awardsFor(s).length > 0);
const TOTAL = SLUGS.reduce((n, s) => n + awardsFor(s).length, 0);

export const metadata = {
  title: "Award-Winning Yacht Charter Greece",
  description: `${SLUGS.length} yachts in our Greek fleet have placed at the Mediterranean and East Med yacht shows: ${TOTAL} awards for chefs, crew and tablescaping. Named, dated, sourced.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    title: "Award-Winning Yacht Charter Greece | George Yachts",
    description: `The ${SLUGS.length} yachts in George's Greek fleet whose crews have been judged against the rest and placed. Every award named, dated and sourced.`,
    url: CANONICAL,
    images: [
      `/api/og?title=${encodeURIComponent("Award-Winning Yacht Charter Greece")}&eyebrow=${encodeURIComponent("Judged at the Greek charter shows")}`,
    ],
    siteName: "George Yachts Brokerage House",
    locale: "en_US",
  },
};

const FLEET_QUERY = `*[_type == "yacht" && slug.current in $slugs]{
  "slug": slug.current, name, subtitle, length, sleeps, cabins, weeklyRatePrice,
  "imageUrl": images[0].asset->url
}`;

const eyebrow = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 11,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: GOLD,
  margin: "0 0 20px",
};

const h2 = {
  fontFamily: "var(--gy-font-display)",
  fontWeight: 250,
  fontSize: "clamp(26px, 3.6vw, 42px)",
  letterSpacing: "0.03em",
  lineHeight: 1.15,
  margin: "0 0 20px",
  color: CREAM,
};

const body = {
  fontFamily: "var(--gy-font-body)",
  fontSize: 17,
  lineHeight: 1.8,
  color: "rgba(248,245,240,0.72)",
  margin: "0 0 18px",
  maxWidth: 680,
};

const QUESTION = "Which yachts in Greece have won awards, and what did they win?";

export default async function AwardWinningPage() {
  let rows = [];
  try {
    rows = await sanityClient.fetch(FLEET_QUERY, { slugs: SLUGS });
  } catch (error) {
    console.error("award page fleet fetch failed:", error);
  }
  const bySlug = new Map(rows.map((r) => [r.slug, r]));

  const winners = SLUGS.map((slug) => ({
    slug,
    yacht: bySlug.get(slug),
    awards: awardsFor(slug),
    headline: headlineAward(slug),
  }))
    .filter((w) => w.yacht)
    .sort((a, b) => b.awards.length - a.awards.length);

  const answer =
    `${winners.length} yachts in George's Greek fleet have placed at the two Greek crewed charter shows, ` +
    `${TOTAL} awards between them. The Mediterranean Yacht Show at Nafplio, which its organisers call the ` +
    `world's largest crewed yacht charter show, and the East Med Yacht Show at Piraeus. Most are won by ` +
    `crews rather than hulls: chef competitions, tablescaping, designer water. ` +
    winners
      .slice(0, 3)
      .map((w) => `${w.yacht.name} (${w.awards.length})`)
      .join(", ") +
    ` lead the fleet.`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Award-winning charter yachts in Greece",
    numberOfItems: winners.length,
    itemListElement: winners.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: w.yacht.name,
        url: `https://georgeyachts.com/yachts/${w.slug}`,
        award: w.awards.map(awardLine),
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: QUESTION,
        acceptedAnswer: { "@type": "Answer", text: answer },
      },
      {
        "@type": "Question",
        name: "Do the awards belong to the yacht or to the crew?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Almost all of them belong to the crew. Chef competitions, tablescaping and designer water are judged on the people, not the hull, so the award sails when they do. George confirms who is aboard for your dates before anything is signed.",
        },
      },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: NAVY, color: CREAM, fontFamily: "var(--gy-font-ui)" }}>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Award-Winning Yacht Charter Greece", url: CANONICAL },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* padding-top comes from .gy-hero-lead. The three sides are longhand
          because a `padding` shorthand here is an inline style and would beat
          the stylesheet, which is how a masthead once ended up sitting on an
          h1 on this site. */}
      <header
        className="gy-hero-lead"
        style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 56, borderBottom: "1px solid rgba(201,168,76,0.15)" }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={eyebrow}>Judged at the Greek charter shows</p>
          <h1
            style={{
              fontFamily: "var(--gy-font-display)",
              fontSize: "clamp(38px, 6vw, 76px)",
              fontWeight: 250,
              letterSpacing: "0.03em",
              margin: "0 0 24px",
              lineHeight: 1.05,
            }}
          >
            Award-Winning Yacht Charter in Greece
          </h1>
          <p style={{ ...body, fontSize: 19, color: "rgba(248,245,240,0.8)" }}>
            {winners.length} of the yachts George represents have been judged
            against the rest of the Greek charter fleet and placed. {TOTAL}{" "}
            awards between them. Every one below is named, dated, and traceable
            to the page it was read on.
          </p>
        </div>
      </header>

      <section style={{ padding: "56px 24px 8px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <QuickAnswerBlock question={QUESTION} answer={answer} />
        </div>
      </section>

      {/* The list. Same restraint as the homepage band: no badges, no laurels,
          no counters spinning up. A client at this level has seen enough
          invented trust marks to discount the entire genre on sight. */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={h2}>The {winners.length} yachts, and what each one won</h2>
          <ol style={{ listStyle: "none", margin: "32px 0 0", padding: 0 }}>
            {winners.map((w) => (
              <li
                key={w.slug}
                style={{ borderTop: "1px solid rgba(201,168,76,0.14)", padding: "26px 0" }}
              >
                <Link
                  href={`/yachts/${w.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--gy-font-display)",
                      fontWeight: 300,
                      fontSize: "clamp(21px, 2.4vw, 28px)",
                      letterSpacing: "0.02em",
                      color: CREAM,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {w.yacht.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--gy-font-body)",
                      fontSize: 15,
                      color: "rgba(248,245,240,0.55)",
                    }}
                  >
                    {[w.yacht.length, w.yacht.sleeps ? `${w.yacht.sleeps} guests` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </Link>
                <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0 }}>
                  {w.awards.map((a, i) => (
                    <li
                      key={i}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "62px 1fr",
                        gap: "2px 16px",
                        alignItems: "baseline",
                        padding: "9px 0",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--gy-font-display)",
                          fontSize: 17,
                          color: GOLD,
                          letterSpacing: "0.04em",
                        }}
                      >
                        {a.year}
                      </span>
                      <span style={{ fontFamily: "var(--gy-font-body)", fontSize: 16, lineHeight: 1.5 }}>
                        {a.award}
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 11,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "rgba(248,245,240,0.45)",
                            marginTop: 3,
                          }}
                        >
                          {a.organiser}
                          {a.chef ? ` · Chef ${a.chef}` : ""}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ padding: "clamp(48px, 6vw, 80px) 24px", borderTop: "1px solid rgba(201,168,76,0.14)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={h2}>What these two shows are</h2>
          <p style={body}>
            The <strong style={{ color: CREAM, fontWeight: 400 }}>Mediterranean Yacht Show</strong> is
            held at Nafplio, and its organisers describe it as the world&rsquo;s
            largest crewed yacht charter show. The{" "}
            <strong style={{ color: CREAM, fontWeight: 400 }}>East Med Yacht Show</strong> is held at
            Piraeus. Both are trade shows: brokers walk the quay, board the
            yachts, and eat what the galleys send out.
          </p>
          <p style={body}>
            The competitions run alongside. Chefs cook against each other out of
            galleys the size of a domestic kitchen, crews are judged on service,
            and there are categories for tablescaping and for designer water.
            That is what a placing here means. It is not a trophy a yard collected
            at a boat show, and it is not a rating anybody paid for.
          </p>
        </div>
      </section>

      <section style={{ padding: "clamp(48px, 6vw, 80px) 24px", borderTop: "1px solid rgba(201,168,76,0.14)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={h2}>What we do not call an award</h2>
          <p style={body}>
            Three yachts in this fleet carry the words &ldquo;award-winning&rdquo; on
            their central agent&rsquo;s page. In each case the award belongs to
            Fountaine Pajot, the builder, and not to that hull. They are not on
            this page and they never will be, because a client who checks would
            find the same thing we did.
          </p>
          <p style={body}>
            Four more are held back. One records a chef prize from 2021 while the
            agent now names a different chef. One has a win with no year and no
            category. One may belong to a different hull of the same length and
            the same name. One has never been written down anywhere we could
            check. Any of them may be true. None of them is ours to print yet.
          </p>
          <p style={{ ...body, color: "rgba(248,245,240,0.55)", fontSize: 15 }}>
            An award on this page names what was won, who ran it, and the year.
            Anything missing one of the three does not appear, and a script
            checks that before the site can be built.
          </p>
        </div>
      </section>

      <BriefGeorgeBanner />
      <Footer />
    </div>
  );
}
