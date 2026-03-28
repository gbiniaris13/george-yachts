import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import { ServiceParallax, Reveal } from "@/components/ServiceParallax";
import Image from "next/image";
import "@/styles/service-page.css";

export const metadata = {
  title: "VIP Transfers Athens & Greek Islands | Luxury Chauffeur | George Yachts",
  description:
    "Luxury VIP transfers in Athens, Mykonos, Santorini, and across Greece. Professional chauffeurs, premium vehicles. Airport to marina, seamless coordination with yacht charters.",
  alternates: { canonical: "https://georgeyachts.com/vip-transfers-greece" },
  openGraph: {
    title: "VIP Transfers Greece | Luxury Chauffeur Services | George Yachts",
    description: "Premium chauffeur services coordinated with your yacht charter. Athens, Mykonos, Santorini.",
    url: "https://georgeyachts.com/vip-transfers-greece",
  },
};

function PageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "VIP Transfers Greece",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House LLC", url: "https://georgeyachts.com" },
    description: "Luxury VIP chauffeur transfers in Athens, Mykonos, Santorini and across Greece. Airport, hotel, marina coordination.",
    areaServed: { "@type": "Place", name: "Greece" },
    serviceType: "VIP Ground Transportation",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const CHECK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function VipTransfersPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <ServiceParallax />

      <section className="svc-hero">
        <Image src="/images/vip-transfers.jpeg" alt="VIP luxury chauffeur transfers Athens Greece - George Yachts" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Seamless &amp; Luxurious</p>
          <h1 className="svc-hero__title">VIP Transfers</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Your journey, curated from start to finish. Arrive in style with luxury vehicles and professional chauffeurs.</p>
        </div>
      </section>

      <section className="svc-intro">
        <Reveal className="svc-intro__inner">
          <p className="svc-intro__eyebrow">Premium Ground Transport</p>
          <h2 className="svc-intro__title">How Do VIP Transfers Work with George Yachts?</h2>
          <div className="svc-intro__line" />
          <p className="svc-intro__text">Premium chauffeur services in Athens and across the Greek islands, coordinated around your itinerary.</p>
          <p className="svc-intro__text">We arrange discreet transportation with vetted professional drivers and high-standard vehicles. Airport arrivals, marina transfers, day schedules, multi-stop routing. One point of contact, clean execution.</p>
        </Reveal>
      </section>

      <section className="svc-checklist">
        <Reveal className="svc-checklist__inner">
          <h2 className="svc-checklist__title">What VIP Transfer Services Are Available?</h2>
          <div className="svc-checklist__grid">
            {["Chauffeured transfers: airport, hotel, marina, intercity","Driver on standby (full-day or multi-day)","Multi-vehicle coordination for groups and events","Meet & greet and luggage handling (upon request)","Route planning aligned with yacht and flight schedules"].map((item, i) => (
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
          <p className="svc-cta__eyebrow">Effortless Arrivals</p>
          <h2 className="svc-cta__title">Let&apos;s Arrange Your Transfer</h2>
          <p className="svc-cta__text">Share your schedule and we&apos;ll coordinate everything &mdash; airport to marina and beyond.</p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" className="svc-cta__button">Book a Free Consultation</a>
        </Reveal>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
