import React from "react";
import { sanityClient } from "@/lib/sanity";
import Footer from "@/components/Footer";
import FleetGrid from "./FleetGrid";
import BriefGeorgeBanner from "@/app/components/BriefGeorgeBanner";
// next/image import removed 2026-05-08 — fleet hero now uses a
// <video> tag (Boss-curated catamaran concat) instead of next/image
// for the background, and no other Image instances live in this file.
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import BrowseSeoCategories from "@/app/components/seo/BrowseSeoCategories";
import "./fleet-page.css";

// ISR - revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Charter Yacht Greece — 63 Curated Yachts | George Yachts",
  description:
    "Curated fleet of 63 yachts in Greek waters — Private Fleet (full crew) + Explorer Fleet (skippered). Motor, sailing, catamaran. Cyclades, Ionian, Saronic.",
  alternates: {
    canonical: "https://georgeyachts.com/charter-yacht-greece",
  },
  openGraph: {
    title: "Charter Fleet | George Yachts Brokerage House",
    description:
      "66 curated yachts for charter in Greek waters. From 14m sailing catamarans to 64m superyachts.",
    url: "https://georgeyachts.com/charter-yacht-greece",
    images: [
      "https://cdn.sanity.io/images/ecqr94ey/production/5a1d2f46e69d3e21c61aa3950deb11085e725b9d-1024x768.jpg",
    ],
  },
};

// Fetch fresh data from Sanity. C.4 (Roberto master rebuild brief)
// pulls up to 4 image URLs per yacht so cards can cycle 2-3 photos
// on hover without an extra fetch. fleetTier + priceModel feed the
// PriceBlock unit-badge logic (Section 0.7).
const FLEET_QUERY = `*[_type == "yacht" && defined(slug.current)] {
  _id,
  "slug": slug.current,
  name,
  category,
  subtitle,
  length,
  sleeps,
  cabins,
  crew,
  builder,
  weeklyRatePrice,
  cruisingRegion,
  fleetTier,
  priceModel,
  // C.6 (Roberto master rebuild brief) — UHNW filter fields
  yearRefit,
  waterToys,
  toys,
  masterCabinDeck,
  maxCruisingSpeed,
  "imageUrl": images[0].asset->url,
  "imageAlt": images[0].alt,
  "hoverImages": images[1...4].asset->url
}`;

// Schema for SEO
function generateFleetSchema(yachts) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "George Yachts Charter Fleet Greece",
    description:
      "Curated fleet of 66 luxury yachts for charter in Greek waters",
    numberOfItems: yachts.length,
    itemListElement: yachts.slice(0, 20).map((yacht, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: yacht.name || yacht.slug,
        url: `https://georgeyachts.com/yachts/${yacht.slug}`,
        image: yacht.imageUrl,
        category: "Luxury Yacht Charter",
        brand: {
          "@type": "Brand",
          name: "George Yachts",
        },
      },
    })),
  };
}

export default async function CharterFleetPage() {
  let yachts = [];
  try {
    yachts = await sanityClient.fetch(FLEET_QUERY);
  } catch (error) {
    console.error("Failed to fetch yachts:", error);
  }

  const jsonLdSchema = generateFleetSchema(yachts);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D1B2A",
        color: "#F8F5F0",
        fontFamily: "var(--gy-font-ui)",
      }}
    >
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Charter Yachts Greece", url: "https://georgeyachts.com/charter-yacht-greece" },
        ]}
      />
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* HERO — Chapter 01 (2026-05-08): Boss-curated catamaran video
          replaces the static Sanity image. Two clips concatenated:
          14413577 (top-down catamaran on emerald shallows, 17 s) →
          19714235 (catamaran with lone swimmer near reef, 59 s).
          Total 76 s loop. Encoded WebM 1300 kbps / MP4 1900 kbps
          2-pass → 12 MB WebM (Chrome/Firefox/Edge primary) +
          17 MB MP4 (Safari fallback). Different feel from the
          homepage hero (motor yacht) — fleet header now leads with
          sailing-cat texture so the visitor immediately reads
          "we cover both sides of the brokerage". */}
      <section className="fleet-hero">
        {/* 2026-05-08 (Chapter 01 follow-up) — poster + preload fix.
            Boss reported the Pellegrina Sanity image flashing at
            page load before the catamaran video kicked in. Two
            changes:
              (a) poster now points to a frame extracted directly
                  from fleet-catamarans.mp4 at t=0 — so even if the
                  poster shows for 100 ms while the video buffers,
                  it's the SAME image as frame 1 of the video.
                  Swap is invisible.
              (b) preload="auto" tells the browser to begin
                  downloading the video bytes as soon as the page
                  loads, instead of waiting for the play() call.
                  Trade-off: 12 MB starts downloading immediately
                  on this route — acceptable here because the fleet
                  page is intent-driven (visitor typed it / clicked
                  through) and bandwidth is rarely the constraint
                  for the UHNW visitor. */}
        <video
          className="fleet-hero__bg"
          poster="/images/posters/fleet-catamarans-frame1.jpg"
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          aria-label="George Yachts Charter Fleet Greece — catamarans in Greek waters"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source src="/videos/fleet-catamarans.webm" type="video/webm" />
          <source src="/videos/fleet-catamarans.mp4" type="video/mp4" />
        </video>
        <div className="fleet-hero__gradient" />
        <div className="fleet-hero__content">
          <div className="fleet-hero__eyebrow">Exclusively Greek Waters</div>
          <h1 className="fleet-hero__title">Charter Fleet</h1>
          <div className="fleet-hero__line" />
          <p className="fleet-hero__desc">
            {yachts.length} curated vessels &mdash; from intimate sailing catamarans
            to 64-meter superyachts. Cyclades &middot; Ionian &middot; Saronic.
          </p>
        </div>
        {/* Scroll indicator */}
        <div className="fleet-hero__scroll">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 8L10 14L16 8" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* FLEET GRID (Client Component) */}
      {/* Phase 2 / B1 (luxury rebuild) — Brief George banner sitting
          alongside filters. Boutique alternative path for guests who
          don't want to filter through 60+ yachts. */}
      <BriefGeorgeBanner />
      <FleetGrid yachts={yachts} />

      {/* Phase 7 (2026-05-11) — SEO internal-link block. Pushes
          authority from the fleet page (high traffic, ranking well)
          to the 22 new yacht-type / use-case / long-tail landing
          pages built per the SEO strategy doc. */}
      <BrowseSeoCategories />

      {/* TRUST / CTA SECTION */}
      <section className="fleet-trust">
        <div className="fleet-trust__eyebrow">Trusted Brokerage</div>
        <div className="fleet-trust__badges">
          <a href="https://iyba.org" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>IYBA Member</a>
          <span className="fleet-trust__dot">&middot;</span>
          <span>MYBA Contracts</span>
          <span className="fleet-trust__dot">&middot;</span>
          <span>Greek Waters Exclusively</span>
          <span className="fleet-trust__dot">&middot;</span>
          <span>Personal Service</span>
        </div>
        <div>
          <a
            href="https://calendly.com/george-georgeyachts/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="fleet-trust__cta"
          >
            Book a Free Consultation
          </a>
        </div>
        <p className="fleet-trust__note">
          Can&apos;t find what you&apos;re looking for? We have access to 200+
          additional vessels.
        </p>
      </section>

      {/* FROM THE JOURNAL — Cross-linking */}
      <section style={{ padding: "80px 24px", background: "#0D1B2A", borderTop: "1px solid rgba(201,168,76,0.06)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: "12px" }}>Expert Insights</p>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 300, color: "#F8F5F0" }}>From The Journal</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1px", background: "rgba(201,168,76,0.04)" }}>
            {[
              { title: "The First-Timer\u2019s Complete Guide to Crewed Yacht Charter in Greece", slug: "the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece" },
              { title: "The \u20ac50,000 Mistake: What Goes Wrong Without a Broker", slug: "the-eur50-000-mistake-what-goes-wrong-when-you-book-a-yacht-charter-without-a-broker" },
              { title: "Airport Hell, 2026: Why Americans Skip the Terminal", slug: "airport-hell-2026-skip-terminal-yacht-charter-greece" },
            ].map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ background: "#0D1B2A", padding: "28px 24px", textDecoration: "none", display: "block", transition: "background 0.3s ease" }}
              >
                <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "17px", fontWeight: 400, color: "#F8F5F0", lineHeight: 1.4, margin: "0 0 12px" }}>{post.title}</p>
                <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C" }}>Read Article &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
