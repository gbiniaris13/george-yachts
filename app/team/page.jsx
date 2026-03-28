import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import TeamContent from "./TeamContent";
import Image from "next/image";
import "./team.css";

export const metadata = {
  title: "Our Core Team | George Yachts | Boutique Yacht Brokerage Athens",
  description:
    "Meet the expert team behind George Yachts Brokerage House. Managing brokers, luxury travel liaisons, operations & finance, maritime compliance. Athens, Greece.",
  alternates: {
    canonical: "https://georgeyachts.com/team",
  },
};

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="team-hero">
        <Image
          src="https://cdn.sanity.io/images/ecqr94ey/production/bf9877a87748ca45db2d4d2462db5cb7439fe406-1024x768.jpg?w=1920&h=900&fit=crop&auto=format&q=85"
          alt="George Yachts Core Team - luxury yacht brokerage Athens Greece"
          fill
          priority
          className="team-hero__bg"
          sizes="100vw"
        />
        <div className="team-hero__gradient" />
        <div className="team-hero__content">
          <p className="team-hero__eyebrow">Bespoke Service, Managed with Precision</p>
          <h1 className="team-hero__title">Our Core Team</h1>
          <div className="team-hero__line" />
          <p className="team-hero__subtitle">&amp; Advisory Network</p>
        </div>
      </section>

      {/* ── TEAM CONTENT (Client Component) ── */}
      <TeamContent />

      {/* ── CONTACT ── */}
      <ContactFormSection />

      <Footer />
    </div>
  );
}
