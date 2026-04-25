import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import { ServiceParallax, Reveal } from "@/components/ServiceParallax";
import Image from "next/image";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import "@/styles/service-page.css";

export const metadata = {
  title: "Buy a Yacht in Greece | Off-Market Listings | George Yachts Brokerage",
  description:
    "Looking to buy a yacht in Greece or the Mediterranean? George Yachts sources off-market and partner listings based on your exact specifications. IYBA member broker, discreet acquisition advisory.",
  alternates: { canonical: "https://georgeyachts.com/yachts-for-sale" },
  openGraph: {
    title: "Buy a Yacht | Off-Market & Partner Listings | George Yachts",
    description: "Discreet yacht acquisition advisory. Off-market opportunities, pricing guidance, surveys, and closing coordination.",
    url: "https://georgeyachts.com/yachts-for-sale",
  },
};

function PageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Yacht Acquisition Advisory",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House LLC", url: "https://georgeyachts.com" },
    description: "Discreet yacht acquisition advisory — off-market listings, pricing guidance, surveys, and closing coordination in Greek and Mediterranean waters.",
    areaServed: { "@type": "Place", name: "Greece & Mediterranean" },
    serviceType: "Yacht Brokerage & Acquisition",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const CHECK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function BuyYachtPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Yachts for Sale", url: "https://georgeyachts.com/yachts-for-sale" },
        ]}
      />
      <ServiceParallax />

      <section className="svc-hero">
        <Image src="/images/buy-a-yacht.jpeg" alt="Buy a luxury yacht in Greece - George Yachts acquisition advisory" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Acquisition &amp; Advisory</p>
          <h1 className="svc-hero__title">Buy a Yacht</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Off-market opportunities &amp; partner listings &mdash; tell us your specs and we&apos;ll source options.</p>
        </div>
      </section>

      <section className="svc-intro">
        <Reveal className="svc-intro__inner">
          <p className="svc-intro__eyebrow">Discreet Sourcing</p>
          <h2 className="svc-intro__title">How Does Buying a Yacht Through George Yachts Work?</h2>
          <div className="svc-intro__line" />
          <p className="svc-intro__text">We keep yacht sourcing discreet &mdash; many of the best opportunities are off-market or shared privately through trusted broker networks.</p>
          <p className="svc-intro__text">If you&apos;re exploring a purchase, we can present curated options based on your length range, preferred brands, usage profile, and timeline. From the first shortlist to negotiation support, surveys, and closing coordination, we help you move with clarity and confidence.</p>
          <p className="svc-intro__text svc-intro__highlight">Share your target specifications and we&apos;ll return with relevant options and market guidance, without noise or wasted time.</p>
        </Reveal>
      </section>

      <section className="svc-checklist">
        <Reveal className="svc-checklist__inner">
          <h2 className="svc-checklist__title">What Can George Yachts Arrange for Yacht Buyers?</h2>
          <div className="svc-checklist__grid">
            {["Curated shortlist based on your exact specifications","Access to partner networks & off-market opportunities","Pricing guidance, negotiation support & offer strategy","Surveys, sea trials & technical due diligence coordination","Ownership structure, flag & VAT guidance via trusted partners","Crew, management & operational setup (if required)"].map((item, i) => (
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
          <p className="svc-cta__eyebrow">Ready to Explore?</p>
          <h2 className="svc-cta__title">Let&apos;s Find Your Yacht</h2>
          <p className="svc-cta__text">Share your vision &mdash; budget, length, brand preference &mdash; and we&apos;ll return with curated options.</p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" className="svc-cta__button">Book a Free Consultation</a>
        </Reveal>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
