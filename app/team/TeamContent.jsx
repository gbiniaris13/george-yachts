"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Scroll Reveal ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function RevealSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Team Data ─── */
const teamMembers = [
  {
    name: "George P. Biniaris",
    title: "Managing Broker",
    imageUrl: "/images/george.jpg",
    instagram: "george_p.biniaris",
    profileUrl: "/team/george-biniaris",
    lead: true,
  },
  {
    name: "George Katrantzos",
    title: "Luxury Travel Liaison & Strategic Associate (U.S.)",
    imageUrl: "/images/george-katrantzos.jpg",
    instagram: "helllo.gk",
    profileUrl: "/team/george-katrantzos",
  },
  {
    name: "Elleanna Karvouni",
    title: "Head of Business Operations & Finance",
    imageUrl: "/images/elleanna.jpg",
    instagram: "eleanna_karvoun",
    profileUrl: "/team/elleana-karvouni",
  },
  {
    name: "Chris Daskalopoulos",
    title: "Marine Insurance & ISO Maritime Compliance Advisor",
    imageUrl: "/images/chris.jpg",
    instagram: "dask15",
    profileUrl: "/team/chris-daskalopoulos",
  },
  {
    name: "Valleria Karvouni",
    title: "Administrative & Charter Logistics Coordinator",
    imageUrl: "/images/valeria.jpg",
    instagram: "valeria_karv",
    profileUrl: "/team/valleria-karvouni",
  },
  {
    name: 'Captain Emmanouil "Manos" Kourmoulakis',
    title: "Aviation & Private Travel Advisor",
    imageUrl: "/images/manos-new.jpg",
    instagram: "",
    profileUrl: "/team/manos-kourmoulakis",
  },
  {
    name: "Nemesis",
    title: "Director of Internal Justice & Loyalty Enforcement",
    imageUrl: "/images/nemesis.jpg",
    instagram: "",
    profileUrl: "/team/nemesis",
  },
];

/* ─── Team Card ─── */
function TeamCard({ member, index }) {
  const [ref, visible] = useReveal(0.1);
  const hasInstagram = member.instagram && member.instagram.length > 0;

  return (
    <div
      ref={ref}
      className={`team-card ${member.lead ? "team-card--lead" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
    >
      <Link href={member.profileUrl} className="team-card__link">
        <div className="team-card__image-wrap">
          <Image
            src={member.imageUrl}
            alt={`${member.name} - ${member.title} at George Yachts`}
            fill
            className="team-card__img"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="team-card__overlay" />

          {/* Info overlay */}
          <div className="team-card__info">
            <h3 className="team-card__name">{member.name}</h3>
            <p className="team-card__title">{member.title}</p>

            {hasInstagram && (
              <span className="team-card__instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @{member.instagram}
              </span>
            )}

            <span className="team-card__view">View Profile &rarr;</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function TeamContent() {
  // Parallax
  useEffect(() => {
    const heroImg = document.querySelector(".team-hero__bg");
    if (!heroImg) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ═══════ INTRO ═══════ */}
      <section className="team-intro">
        <RevealSection className="team-intro__inner">
          <p className="team-intro__eyebrow">Yacht Management &middot; Yacht Sales &middot; Yacht Charter</p>
          <h2 className="team-intro__title">
            Meet the People<br />Behind Your Voyage
          </h2>
          <div className="team-intro__line" />
          <p className="team-intro__text">
            Every member of our team shares one commitment &mdash; delivering an
            experience that exceeds expectations. No call centers. No automated
            responses. Real people, real expertise, real relationships.
          </p>
        </RevealSection>
      </section>

      {/* ═══════ TEAM GRID ═══════ */}
      <section className="team-grid-section">
        <div className="team-grid">
          {teamMembers.map((member, i) => (
            <TeamCard key={i} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════ VALUES ═══════ */}
      <section className="team-values">
        <RevealSection className="text-center">
          <p className="team-values__eyebrow">Our Values</p>
        </RevealSection>
        <div className="team-values__grid">
          {[
            { title: "Discretion", desc: "Your privacy is paramount. Every interaction is handled with absolute confidentiality." },
            { title: "Transparency", desc: "Clear pricing, MYBA contracts, no hidden fees. You know exactly what you're paying for." },
            { title: "Expertise", desc: "Deep local knowledge of every cove, every captain, and every sunset in Greek waters." },
            { title: "Personal Touch", desc: "You work directly with our team. One point of contact from first call to disembarkation." },
          ].map((value, i) => (
            <RevealSection key={i} className="team-values__card" delay={i * 0.1}>
              <h3 className="team-values__card-title">{value.title}</h3>
              <p className="team-values__card-desc">{value.desc}</p>
            </RevealSection>
          ))}
        </div>
      </section>
    </>
  );
}
