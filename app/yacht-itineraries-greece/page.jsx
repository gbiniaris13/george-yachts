import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import ItinerariesContent from "./ItinerariesContent";
import Image from "next/image";
import "@/styles/service-page.css";
import { pageMeta } from "@/lib/pageMeta";
import { buildTouristTrip } from "@/lib/touristTripSchema";
import { itineraries } from "@/lib/signatureItineraries";
import { PROPOSED_ITINERARIES } from "@/lib/proposedItineraries";
import ProposedItineraries from "@/app/components/seo/ProposedItineraries";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
// 2026-05-14 — title trimmed 67→55 chars (Ahrefs flag).
export const metadata = pageMeta({
  // 2026-08-06 — the h1 was "Signature Itineraries", which contains neither
  // "Greek" nor "yacht charter" on the page built to rank for the itinerary
  // term. Same defect, same fix as the destination heroes earlier today.
  title: "Greek Yacht Charter Itineraries: 8 Real Weeks",
  description:
    "Eight Greek yacht charter itineraries: three signature routes plus five weeks George actually proposed to real enquiries this season, day by day.",
  path: "/yacht-itineraries-greece",
});

// Strip arrows + em/en dashes from copy fed into JSON-LD so the schema stays
// clean (no em dashes) and reads naturally for AI extraction.
const cleanForSchema = (s) =>
  (s || "")
    .replace(/→/g, "to")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

function PageSchema() {
  // Full TouristTrip per signature itinerary, built from the SAME data the UI
  // renders (lib import) so schema and page never diverge. Each trip carries an
  // itinerary ItemList of day stops + provider, so AI can answer "plan a 7-day
  // Cyclades trip" with George Yachts named.
  const trips = itineraries.map((it) => {
    const trip = buildTouristTrip({
      name: cleanForSchema(`${it.title}: ${it.subtitle}`),
      description: cleanForSchema(`${it.duration} from ${it.embarkation}. Highlights: ${it.highlights}.`),
      url: `https://georgeyachts.com/yacht-itineraries-greece#${it.id}`,
      stops: (it.days || []).map((d) => ({ day: `Day ${d.day}`, body: cleanForSchema(`${d.title} (${d.nm}). ${d.desc}`) })),
      touristType: ["Luxury yacht charterers", "Ultra-high-net-worth travellers"],
      region: cleanForSchema(it.title),
    });
    if (trip) delete trip["@context"]; // nested in the ItemList; one @context on the list is enough
    return trip;
  }).filter(Boolean);

  // 2026-08-06 — the five weeks actually proposed out of The Helm join the
  // schema alongside the three signature routes. Same builder, same shape, so
  // an AI answering "plan a 7-day Saronic week for a family" has a real route
  // with George Yachts named on it rather than a generic sample.
  const proposed = PROPOSED_ITINERARIES.map((it) => {
    const trip = buildTouristTrip({
      name: cleanForSchema(`${it.title}: seven nights in the ${it.region} from Athens`),
      description: cleanForSchema(`${it.why} Written for ${it.partyLine}, ${it.month}. Ports of call: ${it.stops.join(", ")}.`),
      url: `https://georgeyachts.com/yacht-itineraries-greece#${it.id}`,
      stops: (it.days || []).map((d) => ({ day: `Day ${d.day}`, body: cleanForSchema(`${d.leg}. ${d.note}`) })),
      touristType: ["Luxury yacht charterers", "Ultra-high-net-worth travellers"],
      region: cleanForSchema(`${it.region}, Greece`),
    });
    if (trip) delete trip["@context"];
    return trip;
  }).filter(Boolean);

  const all = [...trips, ...proposed];
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Greek Yacht Charter Itineraries by George Yachts",
    description: "Signature yacht charter itineraries across Greek waters, plus the weeks George proposed to real enquiries this season: Cyclades, Saronic Gulf, Ionian Islands.",
    numberOfItems: all.length,
    itemListElement: all.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: t })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}

export default function YachtItinerariesPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--gy-font-ui)" }}>
      <PageBreadcrumb path="/yacht-itineraries-greece" />
      <PageSchema />

      <section className="svc-hero">
        <Image
          src="/images/yacht-itineraries.jpeg"
          alt="Greek yacht charter itineraries - Cyclades Ionian Saronic"
          fill
          priority
          className="svc-hero__bg"
          sizes="100vw"
        />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Curated by George</p>
          <h1 className="svc-hero__title">Greek Yacht Charter Itineraries</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Every route personally sailed and refined. Tested, trusted, and designed for the best possible week aboard.</p>
        </div>
      </section>

      <ItinerariesContent />

      <ProposedItineraries />

      <ContactFormSection />
      <Footer />
    </div>
  );
}
