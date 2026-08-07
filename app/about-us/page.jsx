import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import AboutContent from "./AboutContent";
import Image from "next/image";
import PageBreadcrumb from "@/app/components/PageBreadcrumb";
import PageFaq from "@/app/components/PageFaq";
import { ABOUT_FAQ } from "@/lib/houseFaq";
import "./about-us.css";

export const metadata = {
  title: { absolute: "About George Yachts | Boutique Brokerage in Greek Waters" },
  description:
    "George P. Biniaris - Managing Broker, IYBA Member. Boutique yacht brokerage in Greek waters. Personal broker relationship. 360° luxury services. Athens HQ.",
  alternates: {
    canonical: "https://georgeyachts.com/about-us",
  },
  openGraph: {
      type: "website",
    title: "About George Yachts | Boutique Yacht Brokerage",
    description: "Premier boutique yacht brokerage in Greek waters. Personal service, curated fleet, 360° luxury.",
    url: "https://georgeyachts.com/about-us",
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
      siteName: "George Yachts Brokerage House",
      locale: "en_US",
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
  "image": "https://georgeyachts.com/images/george-syros-quay.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/george-p-biniaris/",
    "https://www.instagram.com/georgeyachts/"
  ],
  // 2026-08-07 — this Person carried three generic topics and no evidence of
  // competence at all. The two credentials below are the ones an engine can do
  // something with, and both are stated exactly as the bio states them:
  // a skipper's licence, not a captain's ticket.
  "knowsAbout": [
    "Weekly crewed yacht charter in Greek waters",
    "Motor yacht charter",
    "Power catamaran charter",
    "Sailing catamaran charter",
    "MYBA Charter Contracts",
    "Greek charter VAT and APA practice",
    "Cyclades, Ionian, Saronic, Dodecanese and Sporades navigation",
    "Yacht crew selection and guest hospitality"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "license",
      "name": "Skipper's licence",
      "recognizedBy": { "@type": "Organization", "name": "Olympiacos SFP Sailing Academy" }
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "license",
      "name": "Powerboat licence"
    }
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "International Yacht Brokers Association",
    "alternateName": "IYBA",
    "url": "https://iyba.org"
  },
  "knowsLanguage": ["en", "el"],
  "nationality": { "@type": "Country", "name": "Greece" }
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--gy-font-ui)" }}>
      <PageBreadcrumb path="/about-us" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* ── HERO ── */}
      <section className="about-hero">
        <Image
          src="/images/about-hero-santorini.jpg"
          alt="Santorini Greece - George Yachts luxury yacht charter brokerage Greek islands"
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

      {/* 2026-08-07 — this page ran ~4,000 words with no structured question on
          it at all, so an engine asked "which broker should I use in Greece"
          had nothing here to lift. Copy and FAQPage schema both come from
          lib/houseFaq.js. */}
      <PageFaq
        faq={ABOUT_FAQ}
        eyebrow="Before you decide"
        heading="What people ask before they call"
      />

      {/* ── CONTACT ── */}
      <ContactFormSection />

      <Footer />
    </div>
  );
}
