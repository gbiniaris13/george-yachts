"use client";

import React from "react";

const Filotimon = () => {
  return (
    <section className="relative w-full bg-[#000000] py-32 lg:py-48 overflow-hidden flex items-center justify-center">
      {/* 0. AMBIENT GRADIENT ORBS */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(218,165,32,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(218,165,32,0.03) 0%, transparent 70%)", filter: "blur(80px)" }} />

      {/* 1. TEXTURE: Cinematic Grain */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      {/* 2. THE BACKGROUND GIANT (Greek Watermark) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
        <h1 className="text-[18vw] font-marcellus font-bold text-white/2 tracking-widest leading-none uppercase blur-sm">
          ΦΙΛΟΤΙΜΟ
        </h1>
      </div>

      {/* 3. THE CONTENT */}
      <div className="relative z-10 max-w-5xl px-6 md:px-12 flex flex-col items-center text-center">
        {/* Crown Label */}
        <div className="mb-10">
          <span className="text-[#DAA520] text-[10px] tracking-[0.6em] uppercase font-bold opacity-80 border border-[#DAA520]/30 px-4 py-2">
            The Philosophy
          </span>
        </div>

        {/* Statement Headline */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-marcellus text-white leading-[1.05] tracking-tight mb-12">
          WHEN LUXURY MEETS <br className="hidden md:block" />
          TRUST AND{" "}
          <span
            className="italic font-light relative inline-block"
            style={{
              backgroundImage: "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            "FILOTIMO"
            <div className="absolute inset-0 blur-2xl bg-[#DAA520]/20 -z-10"></div>
          </span>
        </h2>

        {/* Gold Divider */}
        <div className="h-px w-32 bg-linear-to-r from-transparent via-[#DAA520] to-transparent mb-14 opacity-60"></div>

        {/* Etymology */}
        <div className="mb-12 max-w-2xl">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#DAA520]/50 mb-4 font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            φίλο (philo) = love &middot; τιμώ (timo) = honour
          </p>
          <p className="text-base md:text-lg text-white/40 leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            A word that exists only in the Greek language. Untranslatable in English, French, German, or any other tongue. First written by the poet Pindar in the 6th century BCE. Referenced by the Apostle Paul. Carried through 400 years of Ottoman rule. Still alive in every Greek who lives by it.
          </p>
        </div>

        {/* The Deep Definition — 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl w-full">
          <div className="text-center px-4">
            <div className="text-3xl mb-4 opacity-60">🫶</div>
            <h3 className="font-marcellus text-white/80 text-lg mb-3">Selfless Generosity</h3>
            <p className="text-white/30 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Acts of kindness without expectation of return. Taking care of others as if they were family — not because you must, but because you cannot imagine doing otherwise.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl mb-4 opacity-60">⚖️</div>
            <h3 className="font-marcellus text-white/80 text-lg mb-3">Deep Honour</h3>
            <p className="text-white/30 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Not the honour of titles or praise, but the quiet dignity of doing what is right when no one is watching. A standard you hold for yourself, not one imposed from outside.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl mb-4 opacity-60">🔥</div>
            <h3 className="font-marcellus text-white/80 text-lg mb-3">Accountable Pride</h3>
            <p className="text-white/30 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              If you lack filotimo, you embarrass not just yourself — but your family, your community, your name. It is the invisible thread that holds Greek society together.
            </p>
          </div>
        </div>

        {/* Gold line */}
        <div className="h-px w-24 bg-linear-to-r from-transparent via-[#DAA520] to-transparent mb-14 opacity-40"></div>

        {/* The Application — What it means for George Yachts */}
        <div className="max-w-3xl mb-16">
          <p className="text-lg md:text-2xl text-gray-400 font-marcellus leading-relaxed">
            At <span className="notranslate">George Yachts</span>, filotimo is not a marketing word.{" "}
            <span className="text-white">It is how we operate.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-16 text-left">
          <div className="border-l-2 border-[#DAA520]/20 pl-6 py-2">
            <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              It means telling a client that a yacht is wrong for them — even when it would be the easier sale.
            </p>
          </div>
          <div className="border-l-2 border-[#DAA520]/20 pl-6 py-2">
            <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              It means answering the phone at midnight because a guest has a question about their itinerary.
            </p>
          </div>
          <div className="border-l-2 border-[#DAA520]/20 pl-6 py-2">
            <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              It means protecting your investment with transparent contracts and honest pricing — no hidden fees, no surprises.
            </p>
          </div>
          <div className="border-l-2 border-[#DAA520]/20 pl-6 py-2">
            <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              It means treating your journey as if it were our own — because in the Greek way of thinking, it is.
            </p>
          </div>
        </div>

        {/* The Quote */}
        <div className="max-w-2xl mb-12 px-4">
          <blockquote className="text-lg md:text-xl text-white/60 font-marcellus leading-relaxed italic">
            "Filotimo to the Greeks is like breathing. A Greek is not a Greek without it."
          </blockquote>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#DAA520]/40 mt-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            — Thales of Miletus, 624–546 BCE
          </p>
        </div>

        {/* The Signature Mark */}
        <div className="mt-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="w-2 h-2 bg-[#DAA520] rotate-45 mx-auto"></div>
        </div>
      </div>

      <style jsx global>{`
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default Filotimon;
