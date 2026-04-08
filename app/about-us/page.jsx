import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import AboutContent from "./AboutContent";
import Image from "next/image";
import "./about-us.css";

export const metadata = {
  title: "About George Yachts | Boutique Yacht Brokerage | Greek Waters",
  description:
    "George Yachts Brokerage House — a boutique yacht brokerage specializing exclusively in Greek waters. IYBA member, 360° luxury services, personal broker relationship. Founded by George P. Biniaris.",
  alternates: {
    canonical: "https://georgeyachts.com/about-us",
  },
  openGraph: {
    title: "About George Yachts | Boutique Yacht Brokerage",
    description: "Premier boutique yacht brokerage in Greek waters. Personal service, curated fleet, 360° luxury.",
    url: "https://georgeyachts.com/about-us",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "George P. Biniaris",
  "jobTitle": "Managing Broker",
  "worksFor": {
    "@type": "Organization",
    "name": "George Yachts Brokerage House LLC",
    "url": "https://georgeyachts.com"
  },
  "url": "https://georgeyachts.com/about-us",
  "image": "https://georgeyachts.com/images/george.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/george-p-biniaris/",
    "https://www.instagram.com/georgeyachts/"
  ],
  "knowsAbout": ["Luxury Yacht Charter", "Greek Waters Navigation", "MYBA Charter Contracts"]
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* ── HERO ── */}
      <section className="about-hero">
        <Image
          src="/images/about-hero-santorini.jpg"
          alt="Santorini Greece — George Yachts luxury yacht charter brokerage Greek islands"
          fill
          priority
          className="about-hero__bg"
          sizes="100vw"
        />
        <div className="about-hero__gradient" />
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">Established in the U.S. &middot; Operating from Athens</p>
          <h1 className="about-hero__title">About George Yachts</h1>
          <div className="about-hero__line" />
          <p className="about-hero__subtitle">Boutique Brokerage &middot; Personal Service &middot; Greek Waters Exclusively</p>
        </div>
      </section>

      {/* ── CLIENT COMPONENT WITH ANIMATIONS ── */}
      <AboutContent />

      {/* ── CONTACT ── */}
      <ContactFormSection />

      <Footer />
    </div>
  );
}
