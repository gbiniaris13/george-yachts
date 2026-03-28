import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import { ServiceParallax, Reveal } from "@/components/ServiceParallax";
import Image from "next/image";
import "@/styles/service-page.css";

export const metadata = {
  title: "Private Jet & Helicopter Charter Greece | George Yachts Aviation",
  description:
    "Book private jets and helicopters in Greece with George Yachts. 24/7 bespoke aviation services for Athens, Greek islands, and the Mediterranean. Seamless yacht-to-jet coordination.",
  alternates: { canonical: "https://georgeyachts.com/private-jet-charter" },
  openGraph: {
    title: "Fly Private | Helicopters & Jets | George Yachts",
    description: "Private aviation for yacht charter clients. Helicopters, jets, island transfers. One point of contact.",
    url: "https://georgeyachts.com/private-jet-charter",
  },
};

function PageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Private Jet & Helicopter Charter Greece",
    provider: { "@type": "Organization", name: "George Yachts Brokerage House LLC", url: "https://georgeyachts.com" },
    description: "Private jet and helicopter charter services in Greece. Seamless coordination with yacht charters for luxury travel across the Greek islands.",
    areaServed: { "@type": "Place", name: "Greece & Mediterranean" },
    serviceType: "Private Aviation Charter",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const CHECK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function FlyPrivatePage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <ServiceParallax />

      <section className="svc-hero">
        <Image src="/images/george-aviation.jpg" alt="Private jet charter Greece - luxury aviation George Yachts" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Helicopters &amp; Jets</p>
          <h1 className="svc-hero__title">Fly Private</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Fully customized private aviation anywhere in Greece and the Mediterranean.</p>
        </div>
      </section>

      <section className="svc-intro">
        <Reveal className="svc-intro__inner">
          <p className="svc-intro__eyebrow">Seamless Aviation</p>
          <h2 className="svc-intro__title">How Does Private Aviation Work with George Yachts?</h2>
          <div className="svc-intro__line" />
          <p className="svc-intro__text">Skip the ferry queues and commercial flights. We coordinate private jets and helicopters that connect seamlessly with your yacht charter schedule &mdash; from international arrivals to island-hopping transfers.</p>
          <p className="svc-intro__text">Through our trusted aviation partners, we arrange everything from light helicopters for Mykonos transfers to long-range jets for international travel. One point of contact, zero hassle.</p>
          <p className="svc-intro__text svc-intro__highlight">Contact George Yachts to fully customize your aviation experience.</p>
        </Reveal>
      </section>

      <section className="svc-checklist">
        <Reveal className="svc-checklist__inner">
          <h2 className="svc-checklist__title">What Private Aviation Services Does George Yachts Offer?</h2>
          <div className="svc-checklist__grid">
            {["Helicopter transfers between islands and mainland","Private jet charter for domestic and international flights","Yacht-to-airport seamless coordination","VIP terminal access and meet & greet services","Multi-leg itinerary planning across Greece","24/7 availability for last-minute bookings"].map((item, i) => (
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
          <p className="svc-cta__eyebrow">Arrive in Style</p>
          <h2 className="svc-cta__title">Let&apos;s Arrange Your Flight</h2>
          <p className="svc-cta__text">Tell us your dates, route, and passenger count &mdash; we&apos;ll handle the rest.</p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" className="svc-cta__button">Book a Free Consultation</a>
        </Reveal>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
