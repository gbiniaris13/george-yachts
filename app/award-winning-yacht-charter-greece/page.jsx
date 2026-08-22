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
// organisers' own sites: mediterraneanyachtshow.gr calls MEDYS "the world's
// largest crewed yacht charter show" and holds it at Nafplio; EMMYS, the East
// Med Multihull & Yacht Charter Show, is held at POROS (the original note
// here said Piraeus, which belongs to a different, older show with a similar
// name; the registry's place-names, with sources, are the truth). They come
// from lib/yachtAwards.js, where each one carries the agent page it was read
// on, and scripts/checkAwardClaims.mjs fails the build if one ever does not.

import React from "react";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import BriefGeorgeBanner from "@/app/components/BriefGeorgeBanner";
import QuickAnswerBlock from "@/app/components/QuickAnswerBlock";
import { YACHT_AWARDS, SHOWS, TIERS, HONOURS, honoursFor, awardsFor, awardLine, headlineAward } from "@/lib/yachtAwards";
import { yachtOfferSchema } from "@/lib/pricing";

const CANONICAL = "https://georgeyachts.com/award-winning-yacht-charter-greece";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";
const GOLD = "#DAA110";

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
    rows = await sanityClient.fetch(FLEET_QUERY, {
      // The honours-only yachts (Just Marie 2) are not in YACHT_AWARDS, but
      // their names still have to come from Sanity rather than be typed here.
      slugs: [...new Set([...SLUGS, ...Object.keys(HONOURS)])],
    });
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
    `${TOTAL} awards between them. The ${SHOWS.MEDYS.full} at ${SHOWS.MEDYS.place}, which its organisers call the ` +
    `world's largest crewed yacht charter show, and the ${SHOWS.EMMYS.full} at ${SHOWS.EMMYS.place}. Most are won by ` +
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
        // 2026-08-21 — a Product node with neither an image nor an offer is
        // not eligible for anything Google shows, so the strongest page on
        // the site was describing sixteen yachts and asking for nothing back.
        // Both fields already travel in FLEET_QUERY; they were simply not
        // being handed on.
        ...(w.yacht.imageUrl ? { image: w.yacht.imageUrl } : {}),
        ...(w.yacht.length ? { size: w.yacht.length } : {}),
        // yachtOfferSchema is the shared builder, so the one price model this
        // house has (per yacht, per week, crewed) is stated identically here
        // and on the yacht page. Yachts on request return null and are simply
        // listed without an offer rather than given an invented figure.
        ...(yachtOfferSchema(w.yacht, `https://georgeyachts.com/yachts/${w.slug}`)
          ? { offers: yachtOfferSchema(w.yacht, `https://georgeyachts.com/yachts/${w.slug}`) }
          : {}),
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
        style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 56, borderBottom: "1px solid rgba(218, 161, 16,0.15)" }}
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
                style={{ borderTop: "1px solid rgba(218, 161, 16,0.14)", padding: "26px 0" }}
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

      <section style={{ padding: "clamp(48px, 6vw, 80px) 24px", borderTop: "1px solid rgba(218, 161, 16,0.14)" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <h2 style={h2}>What these two shows are</h2>
          {/* 2026-08-22 — rewritten from the SHOWS registry. The old copy
              placed EMMYS at Piraeus; the registry, the homepage and the
              llms.txt all say Poros, from the show's own reporting, and a
              page about being precise cannot itself be wrong about a
              place-name. Everything numeric below is a constant with a
              source and a checked date in lib/yachtAwards.js, so this page
              can never drift from the homepage again. This section also
              absorbed the homepage's three-panel explainer when the band
              there was cut down to a rail: the depth lives here now. */}
          <p style={body}>
            The <strong style={{ color: CREAM, fontWeight: 400 }}>{SHOWS.EMMYS.full}</strong>{" "}
            is held at {SHOWS.EMMYS.place}: its {SHOWS.EMMYS.edition} edition
            tied up {SHOWS.EMMYS.yachts} crewed yachts in front of{" "}
            {SHOWS.EMMYS.brokers} brokers from {SHOWS.EMMYS.countries}{" "}
            countries. The{" "}
            <strong style={{ color: CREAM, fontWeight: 400 }}>{SHOWS.MEDYS.full}</strong>{" "}
            is held at {SHOWS.MEDYS.place}, {SHOWS.MEDYS.yachts} crewed yachts
            at its {SHOWS.MEDYS.edition} edition, and its organisers describe
            it as the world&rsquo;s largest crewed yacht charter show. Neither
            sells a public ticket. The people scoring are the people who place
            the charters.
          </p>
          <p style={body}>
            The competitions run alongside, and crews compete, not hulls. The
            chef cooks a themed menu and is marked on presentation, technical
            execution, creativity and balance; the interior team dresses a
            table to the year&rsquo;s theme; a third contest is built from
            local produce; and one award goes to the crew that does the whole
            week well, which is the one every charter guest actually feels.
            None of it is a trophy a yard collected at a boat show, and none
            of it is a rating anybody paid for.
          </p>
          <p style={body}>
            Every yacht is judged against her own kind. Emerald is{" "}
            {TIERS.Emerald}; Diamond is {TIERS.Diamond}. A 16 metre catamaran
            is never marked against a 24 metre one, so a first place is a
            first place inside a real field, and a third against forty other
            galleys is not a consolation.
          </p>
        </div>
      </section>

      {/* The one distinction that is not a competition. It moved here from
          the homepage band with the rest of the archive; George asked for it
          by name when it first went up: "βεβαίως να το βάλουμε, είναι πολύ
          τιμητικό για αυτόν". */}
      {honoursFor("just-marie-2").length > 0 && (
        <section style={{ padding: "clamp(48px, 6vw, 80px) 24px", borderTop: "1px solid rgba(218, 161, 16,0.14)" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 style={h2}>And one distinction that is not a competition</h2>
            {honoursFor("just-marie-2").map((h, i) => (
              <p style={body} key={i}>
                <strong style={{ color: CREAM, fontWeight: 400 }}>
                  {bySlug.get("just-marie-2")?.name || "Just Marie 2"}
                </strong>{" "}
                carries a {h.award} from the {h.organiser}, {h.year}.{" "}
                {h.note} It is counted apart from the placings above because
                it was not won in a galley, and it is the only line on this
                page that has nothing to do with cooking.
              </p>
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: "clamp(48px, 6vw, 80px) 24px", borderTop: "1px solid rgba(218, 161, 16,0.14)" }}>
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
