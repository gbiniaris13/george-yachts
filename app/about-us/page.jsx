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

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="about-hero">
        <Image
          src="/images/about-us-section.jpg"
          alt="George Yachts Brokerage House - luxury yacht brokerage Greece"
          fill
          priority
          className="about-hero__bg"
          sizes="100vw"
        />
        <div className="about-hero__gradient" />
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">Est. Athens, Greece</p>
          <h1 className="about-hero__title">George Yachts</h1>
          <div className="about-hero__line" />
          <p className="about-hero__subtitle">Boutique Yacht Brokerage House</p>
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
