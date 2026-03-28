"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

// Parallax
function useParallax() {
  useEffect(() => {
    const img = document.querySelector(".svc-hero__bg");
    if (!img) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { const y = window.scrollY; if (y < window.innerHeight) img.style.transform = `translateY(${y * 0.3}px)`; ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

const itineraries = [
  {
    id: "cyclades",
    title: "The Cyclades Classic",
    subtitle: "Athens to Mykonos & Beyond",
    duration: "7 Days / 6 Nights",
    embarkation: "Athens (Lavrion Marina)",
    season: "June \u2013 September",
    idealFor: "First-time charterers, couples, families",
    days: [
      { day: 1, title: "Athens \u2192 Kea (Tzia)", nm: "25 NM", desc: "The closest Cycladic island to Athens. Arrive at Vourkari bay for a quiet first evening. Swim at Koundouros beach. Dinner at a waterfront taverna \u2014 grilled octopus, local wine, the slow pace beginning." },
      { day: 2, title: "Kea \u2192 Syros", nm: "35 NM", desc: "The \u201ccapital\u201d of the Cyclades. Ermoupoli\u2019s neoclassical architecture feels more Italian than Greek. Explore the town, visit the Apollon Theater (a miniature La Scala), dine at the harbour under fairy lights." },
      { day: 3, title: "Syros \u2192 Mykonos", nm: "20 NM", desc: "Arrive at the island of the winds. Anchor at Ornos or Psarou Bay. Little Venice for sunset cocktails. Dinner at Nammos or Kiki\u2019s Taverna (arrive early \u2014 no reservations). The nightlife starts after midnight." },
      { day: 4, title: "Mykonos \u2192 Paros", nm: "18 NM", desc: "Cross to Paros \u2014 the Cyclades\u2019 best-kept balance of beauty and authenticity. Naoussa harbour for lunch. Explore the Old Town\u2019s narrow marble streets. Sunset from the hilltop church, dinner at Mario." },
      { day: 5, title: "Paros \u2192 Antiparos \u2192 Koufonisia", nm: "30 NM", desc: "Morning stop at Antiparos \u2014 the cave of stalactites, lunch at Captain Pipinos. Then sail to Koufonisia \u2014 crystal-clear turquoise water, white sand, zero cars. Anchor overnight." },
      { day: 6, title: "Koufonisia \u2192 Naxos", nm: "15 NM", desc: "The largest Cycladic island. Visit the Portara (Temple of Apollo). Long sandy beaches. The best local cuisine in the Cyclades \u2014 Naxos cheese, potatoes, fresh fish. Dinner in the Old Town." },
      { day: 7, title: "Naxos \u2192 Kea \u2192 Athens", nm: "60 NM", desc: "Final cruise back via Kea. Farewell breakfast aboard. Arrive Lavrion by afternoon." },
    ],
    highlights: "Mykonos nightlife, Koufonisia beaches, Syros architecture, Naxos cuisine",
    yachts: [
      { name: "M/Y Can\u2019t Remember", slug: "cant-remember" },
      { name: "S/Y World\u2019s End", slug: "worlds-end" },
      { name: "M/Y Vista", slug: "vista" },
    ],
  },
  {
    id: "saronic",
    title: "Saronic Elegance",
    subtitle: "The Athens Riviera Circuit",
    duration: "7 Days / 6 Nights",
    embarkation: "Athens (Alimos Marina)",
    season: "May \u2013 October",
    idealFor: "Couples, history lovers, first-time charterers",
    days: [
      { day: 1, title: "Athens \u2192 Aegina", nm: "17 NM", desc: "Sail from Alimos to Aegina \u2014 the pistachio island. Visit the Temple of Aphaia (one of the best-preserved Greek temples). Walk the harbour, try the local pistachio ice cream. Easy first day." },
      { day: 2, title: "Aegina \u2192 Hydra", nm: "20 NM", desc: "The jewel of the Saronic. No cars, no motorbikes \u2014 only donkeys and water taxis. Swim at Vlychos beach. Sundowners at the harbour. Dinner at Omilos or Sunset." },
      { day: 3, title: "Hydra \u2192 Dokos", nm: "5 NM", desc: "The uninhabited island between Hydra and the Peloponnese. Anchor in the bay \u2014 crystal water, absolute silence, just you and the sea. Lunch aboard, afternoon swimming, stargazing at night." },
      { day: 4, title: "Dokos \u2192 Spetses", nm: "12 NM", desc: "Pine-covered island with elegant mansions. Horse-drawn carriages around the port. Dinner at On The Verandah or Liotrivi. Walk the coastal path at sunset." },
      { day: 5, title: "Spetses \u2192 Porto Heli", nm: "8 NM", desc: "Cross to the Peloponnese coast. Porto Heli is the Greek Hamptons \u2014 luxury villas, Amanzoe resort nearby. Lunch at Aman Beach Club, swim at Hinitsa Bay." },
      { day: 6, title: "Porto Heli \u2192 Nafplio", nm: "25 NM", desc: "Greece\u2019s first capital. The most romantic town in the Peloponnese. Palamidi Fortress (999 steps). Bourtzi castle in the harbour. Old Town dinner \u2014 some of the best food in Greece." },
      { day: 7, title: "Nafplio \u2192 Poros \u2192 Athens", nm: "35 NM", desc: "Stop at Poros \u2014 the island so close to the mainland you could swim. Clock tower views. Then final cruise to Athens. Farewell lunch aboard." },
    ],
    highlights: "Hydra\u2019s car-free charm, Nafplio\u2019s romance, Dokos isolation, Porto Heli luxury",
    yachts: [
      { name: "M/Y Shero", slug: "shero" },
      { name: "M/Y M Five", slug: "m-five" },
      { name: "M/Y Vista", slug: "vista" },
      { name: "S/Y Sahana", slug: "sahana" },
    ],
  },
  {
    id: "ionian",
    title: "The Ionian Dream",
    subtitle: "Corfu to Kefalonia",
    duration: "7 Days / 6 Nights",
    embarkation: "Corfu (Gouvia Marina)",
    season: "May \u2013 October",
    idealFor: "Families with children, sailing enthusiasts, nature lovers",
    days: [
      { day: 1, title: "Corfu \u2192 Paxos", nm: "30 NM", desc: "Sail south to the tiny island of Paxos. Anchor at Lakka \u2014 a horseshoe bay surrounded by olive groves. Swim in turquoise water, dine at the harbour. The Ionian pace begins." },
      { day: 2, title: "Paxos \u2192 Antipaxos \u2192 Parga", nm: "15 NM", desc: "Morning at Antipaxos \u2014 Voutoumi beach (Caribbean-blue water, white pebbles). Then cross to Parga on the mainland \u2014 a Venetian fortress town cascading down to the sea." },
      { day: 3, title: "Parga \u2192 Lefkada (Sivota Bay)", nm: "25 NM", desc: "Sail to Lefkada\u2019s east coast. Sivota Bay is one of the most protected anchorages in Greece \u2014 perfect for a lazy day. Swim, paddleboard, explore by tender." },
      { day: 4, title: "Lefkada \u2192 Meganisi", nm: "8 NM", desc: "The secret island. Tiny Meganisi has 3 villages, zero tourist buses, and some of the clearest water in Greece. Anchor in Atherinos Bay. Lunch at Tropicana in Vathy." },
      { day: 5, title: "Meganisi \u2192 Ithaca", nm: "15 NM", desc: "Odysseus\u2019 homeland. Anchor in Kioni \u2014 a postcard-perfect fishing village. Walk the hillside path to ancient ruins. Dinner in the harbour \u2014 the kind of meal you remember for years." },
      { day: 6, title: "Ithaca \u2192 Kefalonia (Fiskardo)", nm: "10 NM", desc: "The crown jewel. Fiskardo is the only Kefalonian village that survived the 1953 earthquake. Venetian architecture, pastel-coloured houses. Dinner at Tassia \u2014 legendary cooking." },
      { day: 7, title: "Kefalonia \u2192 Corfu", nm: "65 NM", desc: "Long final passage back to Corfu (or arrange one-way disembarkation). Farewell breakfast aboard." },
    ],
    highlights: "Antipaxos beaches, Meganisi serenity, Fiskardo elegance, Parga fortress views",
    yachts: [
      { name: "S/Y Kimata", slug: "kimata" },
      { name: "S/Y Alexandra II", slug: "alexandra-ii" },
      { name: "S/Y Huayra", slug: "huayra" },
      { name: "S/Y Serenissima", slug: "serenissima" },
    ],
  },
  {
    id: "sporades",
    title: "The Sporades Escape",
    subtitle: "Greece\u2019s Green Islands",
    duration: "7 Days / 6 Nights",
    embarkation: "Skiathos (Skiathos Port)",
    season: "June \u2013 September",
    idealFor: "Nature lovers, families, Mamma Mia fans, divers",
    days: [
      { day: 1, title: "Skiathos", nm: "0 NM", desc: "Board and explore. Koukounaries beach \u2014 voted among Europe\u2019s best. Lalaria beach accessible only by boat (your yacht is the ticket). Dinner in the Old Port." },
      { day: 2, title: "Skiathos \u2192 Skopelos", nm: "12 NM", desc: "The Mamma Mia island. Visit Agios Ioannis chapel (the wedding scene location). Skopelos Town is all stone houses and bougainvillea. Fresh almonds, plums, and the best cheese pies in Greece." },
      { day: 3, title: "Skopelos \u2192 Alonissos", nm: "15 NM", desc: "Entrance to the National Marine Park \u2014 the largest protected marine area in Europe. Spot monk seals, dolphins, and rare seabirds. Anchor at Kokkinokastro \u2014 red cliffs, red sand, crystal water." },
      { day: 4, title: "Alonissos \u2192 Kyra Panagia", nm: "12 NM", desc: "The uninhabited island inside the Marine Park. An ancient monastery, wild goats, absolute isolation. Anchor in the protected bay. Dive, snorkel, swim. One of the most pristine spots in the Mediterranean." },
      { day: 5, title: "Kyra Panagia \u2192 Peristera", nm: "8 NM", desc: "The island with the underwater archaeological site \u2014 a 5th century BC shipwreck you can dive or snorkel over. Then back to Alonissos for evening." },
      { day: 6, title: "Alonissos \u2192 Skopelos (Panormos Bay)", nm: "18 NM", desc: "Return to Skopelos\u2019s quieter west coast. Panormos Bay \u2014 pine trees to the waterline, a handful of tavernas, perfect sunset. Last evening dinner under the stars." },
      { day: 7, title: "Skopelos \u2192 Skiathos", nm: "12 NM", desc: "Final morning cruise. Farewell breakfast. Disembark by noon." },
    ],
    highlights: "Marine Park wildlife, Mamma Mia locations, underwater archaeology, pristine nature",
    yachts: [
      { name: "S/Y World\u2019s End", slug: "worlds-end" },
      { name: "S/Y Libra", slug: "libra" },
      { name: "P/C Alteya", slug: "alteya" },
      { name: "S/Y Summer Star", slug: "summer-star" },
    ],
  },
];

function ItineraryCard({ itin, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Reveal delay={index * 0.1}>
      <div style={{ background: "#050505", border: "1px solid rgba(218,165,32,0.06)", marginBottom: "32px" }}>
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ width: "100%", padding: "36px 32px", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}
        >
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#DAA520", fontWeight: 600, marginBottom: "12px" }}>
              {itin.duration} &middot; {itin.season}
            </p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>
              {itin.title}
            </h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
              {itin.subtitle} &middot; From {itin.embarkation}
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "8px" }}>
              Ideal for: {itin.idealFor}
            </p>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={expanded ? "#DAA520" : "rgba(255,255,255,0.3)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.4s ease, stroke 0.3s ease", flexShrink: 0, marginTop: "8px" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Expandable Content */}
        <div style={{ maxHeight: expanded ? "3000px" : "0", overflow: "hidden", transition: "max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div style={{ padding: "0 32px 36px", borderTop: "1px solid rgba(218,165,32,0.06)" }}>
            {/* Day by day */}
            <div style={{ paddingTop: "28px" }}>
              {itin.days.map((day) => (
                <div key={day.day} style={{ display: "flex", gap: "20px", padding: "20px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ minWidth: "70px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", fontWeight: 300, color: "#DAA520" }}>Day {day.day}</span>
                    <span style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", marginTop: "4px" }}>{day.nm}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 500, color: "#fff", marginBottom: "6px" }}>{day.title}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300 }}>{day.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(218,165,32,0.06)" }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#DAA520", marginBottom: "8px" }}>Highlights</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 300 }}>{itin.highlights}</p>
            </div>

            {/* Recommended Yachts */}
            <div style={{ marginTop: "20px" }}>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#DAA520", marginBottom: "10px" }}>Recommended Yachts</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {itin.yachts.map((yacht) => (
                  <Link
                    key={yacht.slug}
                    href={`/yachts/${yacht.slug}`}
                    style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.4)", padding: "6px 14px", border: "1px solid rgba(218,165,32,0.15)", textDecoration: "none", letterSpacing: "0.05em", transition: "all 0.3s ease" }}
                  >
                    {yacht.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function ItinerariesContent() {
  useParallax();

  return (
    <>
      {/* Intro */}
      <section style={{ padding: "100px 24px", background: "#000" }}>
        <Reveal>
          <div style={{ maxWidth: "750px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "24px" }}>Curated by George</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 300, color: "#fff", lineHeight: 1.35, margin: "0 0 32px" }}>
              Why Trust These Itineraries?
            </h2>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, #E6C77A, #A67C2E)", margin: "0 auto 32px" }} />
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.9, fontWeight: 300 }}>
              Every route below has been personally sailed and refined by George Biniaris &mdash; drawing on deep local knowledge of Greek waters. These are not generic suggestions. They are tested, trusted, and designed to deliver the best possible week aboard.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Itineraries */}
      <section style={{ padding: "0 24px 80px", background: "#000", maxWidth: "900px", margin: "0 auto" }}>
        {itineraries.map((itin, i) => (
          <ItineraryCard key={itin.id} itin={itin} index={i} />
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", background: "#000", textAlign: "center", borderTop: "1px solid rgba(218,165,32,0.08)" }}>
        <Reveal>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", marginBottom: "16px" }}>Your Itinerary, Your Way</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", margin: "0 0 16px" }}>
            Let&apos;s Design Your Perfect Week
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontWeight: 300, maxWidth: "550px", margin: "0 auto 40px" }}>
            These routes are starting points. Every charter is personally tailored by George &mdash; your preferences, your pace, your islands. Tell us your dream and we&apos;ll design your perfect week in Greek waters.
          </p>
          <a href="#contact" style={{ display: "inline-block", background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)", color: "#000", padding: "16px 48px", fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>
            Start Planning
          </a>
        </Reveal>
      </section>
    </>
  );
}
