import React from "react";
import { sanityClient } from "@/lib/sanity";
import Footer from "@/components/Footer";
import FleetGrid from "./FleetGrid";
import Image from "next/image";
import "./fleet-page.css";

// ISR - revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Luxury Yacht Charter Fleet Greece | 50+ Yachts | George Yachts",
  description:
    "Browse our curated fleet of 50+ luxury charter yachts in Greek waters. Motor yachts, sailing catamarans, and monohulls. Cyclades, Ionian, Saronic, Sporades. IYBA member broker.",
  alternates: {
    canonical: "https://georgeyachts.com/charter-yacht-greece",
  },
  openGraph: {
    title: "Charter Fleet | George Yachts Brokerage House",
    description:
      "50+ curated luxury yachts for charter in Greek waters. From 14m sailing catamarans to 64m superyachts.",
    url: "https://georgeyachts.com/charter-yacht-greece",
    images: [
      "https://cdn.sanity.io/images/ecqr94ey/production/5a1d2f46e69d3e21c61aa3950deb11085e725b9d-1024x768.jpg",
    ],
  },
};

// Fetch fresh data from Sanity - 1 image per yacht
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
  "imageUrl": images[0].asset->url
}`;

// Schema for SEO
function generateFleetSchema(yachts) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "George Yachts Charter Fleet Greece",
    description:
      "Curated fleet of 50+ luxury yachts for charter in Greek waters",
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
        background: "#000000",
        color: "#fff",
        fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* HERO — Grayscale + Staggered Animation */}
      <section className="fleet-hero">
        <Image
          src="https://cdn.sanity.io/images/ecqr94ey/production/5a1d2f46e69d3e21c61aa3950deb11085e725b9d-1024x768.jpg?w=1920&h=900&fit=crop&auto=format"
          alt="George Yachts Charter Fleet Greece - luxury yachts in Greek waters"
          fill
          priority
          className="fleet-hero__bg"
          sizes="100vw"
        />
        <div className="fleet-hero__gradient" />
        <div className="fleet-hero__content">
          <div className="fleet-hero__eyebrow">Exclusively Greek Waters</div>
          <h1 className="fleet-hero__title">Charter Fleet</h1>
          <div className="fleet-hero__line" />
          <p className="fleet-hero__desc">
            {yachts.length} curated vessels &mdash; from intimate sailing catamarans
            to 64-meter superyachts. Cyclades &middot; Ionian &middot; Saronic &middot; Sporades.
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
      <FleetGrid yachts={yachts} />

      {/* TRUST / CTA SECTION */}
      <section className="fleet-trust">
        <div className="fleet-trust__eyebrow">Trusted Brokerage</div>
        <div className="fleet-trust__badges">
          <span>IYBA Member</span>
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

      <Footer />
    </div>
  );
}
