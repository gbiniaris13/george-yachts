import React from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import TeamContent from "./TeamContent";
import Image from "next/image";
import "./team.css";
import { pageMeta } from "@/lib/pageMeta";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
// 2026-05-14 — title trimmed from 67→48 chars (Ahrefs flag).
export const metadata = pageMeta({
  title: "The Managing Broker and Advisors",
  description:
    "George P. Biniaris, Managing Broker of George Yachts, and the independent advisors he calls on for U.S. travel, aviation, logistics, finance and insurance.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--gy-font-ui)" }}>
      <PageBreadcrumb path="/team" />

      {/* ── HERO ── */}
      <section className="team-hero">
        <Image
          src="https://cdn.sanity.io/images/ecqr94ey/production/bf9877a87748ca45db2d4d2462db5cb7439fe406-1024x768.jpg?w=1920&h=900&fit=crop&auto=format&q=85"
          alt="George Yachts, the Managing Broker and advisors, Athens"
          fill
          priority
          className="team-hero__bg"
          sizes="100vw"
        />
        <div className="team-hero__gradient" />
        <div className="team-hero__content">
          <p className="team-hero__eyebrow">Bespoke Service, Managed with Precision</p>
          <h1 className="team-hero__title">The Managing Broker</h1>
          <div className="team-hero__line" />
          <p className="team-hero__subtitle">&amp; Advisors</p>
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
