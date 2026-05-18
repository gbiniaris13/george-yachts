import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import ItinerariesContent from "./ItinerariesContent";
import Image from "next/image";
import "@/styles/service-page.css";
import { pageMeta } from "@/lib/pageMeta";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
// 2026-05-14 — title trimmed 67→55 chars (Ahrefs flag).
export const metadata = pageMeta({
  title: "Signature Yacht Itineraries Greece | George Yachts",
  description:
    "3 signature Greek yacht charter itineraries personally sailed by George Biniaris. Cyclades Classic, Saronic Elegance, Ionian Dream. Day-by-day routes with insider tips.",
  path: "/yacht-itineraries-greece",
});

function PageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Greek Yacht Charter Itineraries by George Yachts",
    description: "3 signature yacht charter itineraries across Greek waters — Cyclades, Saronic Gulf, Ionian Islands.",
    numberOfItems: 3,
    itemListElement: [
      { "@type": "ListItem", position: 1, item: { "@type": "TouristTrip", name: "The Cyclades Classic — Athens to Mykonos & Beyond", touristType: "Luxury Yacht Charter" } },
      { "@type": "ListItem", position: 2, item: { "@type": "TouristTrip", name: "Saronic Elegance — The Athens Riviera Circuit", touristType: "Luxury Yacht Charter" } },
      { "@type": "ListItem", position: 3, item: { "@type": "TouristTrip", name: "The Ionian Dream — Corfu to Kefalonia", touristType: "Luxury Yacht Charter" } },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
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
          <h1 className="svc-hero__title">Signature Itineraries</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Every route personally sailed and refined &mdash; tested, trusted, and designed for the best possible week aboard.</p>
        </div>
      </section>

      <ItinerariesContent />

      <ContactFormSection />
      <Footer />
    </div>
  );
}
