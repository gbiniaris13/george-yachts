"use client";

import React from "react";

// --- DATA (UNCHANGED) ---
const features = [
  {
    title: "WE TURN DREAMS | INTO DESTINATIONS",
    paragraph:
      "At George Yachts, every charter begins with a vision — yours. We create tailor-made experiences across the Mediterranean, combining performance yachts, exclusive itineraries, and a modern sense of luxury. From the Aegean’s hidden coves to the Ionian’s calm horizons, we turn every journey into a story worth remembering. Yachting isn’t just what we do — it’s how we live.",
    imageSrc: "/images/yacht-1.jpeg",
  },
  {
    title: "BOUTIQUE SERVICE | GLOBAL STANDARDS",
    paragraph:
      "Based in Athens and operating across the Mediterranean, George Yachts brings a new generation of professionalism to luxury yachting. We specialize in crewed motor yacht charters, sales, and charter management — delivering seamless service and clear communication every step of the way. Whether you’re chartering, buying, or trusting us with your yacht’s representation, expect nothing less than precision, discretion, and genuine passion for the sea.",
    imageSrc: "/images/yacht-2.jpeg",
  },
  {
    title: "BEYOND THE SEA | AND THE HORIZON",
    paragraph:
      "Our service doesn’t end when you step off the yacht. Through our network of trusted partners, we arrange every special request — from private jets to curated transfers and reservations. George Yachts is not just about travel, but about lifestyle — tailored for those who value effortless elegance and true exclusivity.",
    imageSrc: "/images/yacht-3.jpeg",
  },
  {
    title: "FUTURE OF YACHTING | MODERN ELEGANCE",
    paragraph:
      "George Yachts represents a fresh chapter in Mediterranean yachting — a boutique company with international mindset and modern drive. We blend experience, aesthetics, and digital precision to redefine what it means to charter with confidence. With every client, every yacht, every detail — we bring the art of yachting to life, with calm sophistication and contemporary edge.",
    imageSrc: "/images/yacht-4.jpeg",
  },
];

const MonolithSlide = ({ item, index, total }) => {
  const [titleMain, titleSub] = item.title.split("|").map((s) => s.trim());

  // Logic to alternate the position of the Glass HUD (Left vs Right)
  const isRight = index % 2 !== 0;

  return (
    // THE STICKY CONTAINER
    <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src={item.imageSrc}
          alt={item.title}
          className="w-full h-full object-cover scale-105"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/1920x1080/050505/ffffff?text=George+Yachts")
          }
        />
        {/* Expensive "Vignette" Overlay to focus eyes on center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>
        {/* Dark tint to ensure text pop */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* 2. THE GLASS HUD (The Text) */}
      <div
        className={`relative z-20 w-full max-w-[1400px] px-6 md:px-12 flex ${
          isRight ? "justify-end" : "justify-start"
        }`}
      >
        <div className="w-full md:w-[500px] lg:w-[600px] backdrop-blur-3xl bg-black/40 border border-white/10 p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] group hover:bg-black/50 transition-colors duration-700">
          {/* Top Decorative Line */}
          <div className="w-full h-px bg-linear-to-r from-transparent via-[#DAA520] to-transparent mb-10 opacity-50"></div>

          {/* Index Counter */}
          <span className="block text-[#DAA520] font-mono text-xs tracking-[0.3em] mb-4">
            0{index + 1} / 0{total}
          </span>

          {/* Typography */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-marcellus text-white leading-[0.9] tracking-tight mb-8">
            <span className="block opacity-90">{titleMain}</span>
            <span
              className="block italic font-light mt-2"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              {titleSub}
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-300 font-light leading-loose tracking-wide font-sans text-justify opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            {item.paragraph}
          </p>

          {/* Bottom Decorative Element */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-12 bg-white/30"></div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
              Discover
            </span>
          </div>
        </div>
      </div>

      {/* 3. PROGRESS BAR (Left Side) */}
      <div className="absolute left-0 top-0 bottom-0 w-1 z-30 hidden md:block">
        <div
          className="w-full bg-[#DAA520]"
          style={{ height: `${((index + 1) / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const TwoColumnLayout = () => {
  return (
    <section className="relative w-full bg-[#020617]">
      {/* This is the "Deck Container".
        Each child is Sticky. As you scroll, they naturally stack on top of each other.
      */}
      {features.map((item, index) => (
        <MonolithSlide
          key={index}
          item={item}
          index={index}
          total={features.length}
        />
      ))}

      <style jsx global>{`
        /* Force squares everywhere. No rounding allowed in this dojo. */
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default TwoColumnLayout;
