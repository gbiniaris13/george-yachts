import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import { ServiceParallax, Reveal } from "@/components/ServiceParallax";
import Image from "next/image";
import "@/styles/service-page.css";

export const metadata = {
  title: "Luxury Villas Greece | Mykonos, Santorini, Paros | George Yachts",
  description:
    "Luxury villas in Mykonos, Paros, Santorini, Athens Riviera. Curated privately through our partner network. Beachfront estates, chef service, yacht+villa packages. George Yachts.",
  alternates: { canonical: "https://georgeyachts.com/luxury-villas-greece" },
  openGraph: {
    title: "Luxury Villas Greece | Curated Collection | George Yachts",
    description: "Handpicked luxury villas across Greece. Beachfront estates, private compounds, staff included.",
    url: "https://georgeyachts.com/luxury-villas-greece",
  },
};

function PageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Luxury Villa Rentals Greece",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House LLC", url: "https://georgeyachts.com" },
    description: "Curated luxury villa rentals in Mykonos, Paros, Santorini, Athens Riviera. Chef, concierge, yacht+villa packages.",
    areaServed: { "@type": "Place", name: "Greece" },
    serviceType: "Luxury Villa Rental",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const CHECK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function LuxuryVillasPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <ServiceParallax />

      <section className="svc-hero">
        <Image src="/images/villas-real-estate.jpeg" alt="Luxury villas Greece Mykonos Santorini - George Yachts" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Greece &amp; The Mediterranean</p>
          <h1 className="svc-hero__title">Luxury Villas</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Private villas, seafront homes &amp; investment opportunities across Greece.</p>
        </div>
      </section>

      <section className="svc-intro">
        <Reveal className="svc-intro__inner">
          <p className="svc-intro__eyebrow">Curated Collection</p>
          <h2 className="svc-intro__title">How Does Villa Sourcing Work with George Yachts?</h2>
          <div className="svc-intro__line" />
          <p className="svc-intro__text">We don&apos;t publish a public villa inventory &mdash; we curate options based on your dates, destination, group size, and preferred style. Through our partner network, we source handpicked villas in Mykonos, Paros, Antiparos, Santorini, the Athens Riviera and beyond.</p>
          <p className="svc-intro__text">Expect discreet handling, fast turnaround, and clear recommendations &mdash; not endless links. Whether you need a beachfront retreat, a private estate with staff, or a villa perfectly paired with your yacht itinerary, we&apos;ll tailor options that match your standard.</p>
          <p className="svc-intro__text svc-intro__highlight">Share your requirements and we&apos;ll return with a shortlist of suitable villas and availability.</p>
        </Reveal>
      </section>

      <section className="svc-checklist">
        <Reveal className="svc-checklist__inner">
          <h2 className="svc-checklist__title">What Villa Services Does George Yachts Arrange?</h2>
          <div className="svc-checklist__grid">
            {["Handpicked villas (beachfront, private estates, gated compounds)","Chef, housekeeping, butler service & concierge support","Security, chauffeurs, VIP arrivals & local coordination","Villa + yacht itinerary planning (one point of contact)","Last-minute sourcing & discreet bookings","Family-friendly & event-ready options (upon request)"].map((item, i) => (
              <Reveal key={i} className="svc-checklist__item" delay={i * 0.06}>
                <span className="svc-checklist__check">{CHECK}</span>
                <span className="svc-checklist__text">{item}</span>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="svc-cta">
        <Reveal>
          <p className="svc-cta__eyebrow">Your Private Retreat</p>
          <h2 className="svc-cta__title">Let&apos;s Find Your Villa</h2>
          <p className="svc-cta__text">Tell us your dates, destination, and style &mdash; we&apos;ll curate the perfect shortlist.</p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" className="svc-cta__button">Book a Free Consultation</a>
        </Reveal>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
