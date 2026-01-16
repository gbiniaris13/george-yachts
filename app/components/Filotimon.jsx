"use client";

import React from "react";

const Filotimon = () => {
  return (
    <section className="relative w-full bg-[#0a0a0a] py-32 lg:py-48 overflow-hidden flex items-center justify-center">
      {/* 1. TEXTURE: Cinematic Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

      {/* 2. THE BACKGROUND GIANT (Greek Watermark) */}
      {/* This sits huge in the background to give 'weight' to the section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
        <h1 className="text-[18vw] font-marcellus font-bold text-white/2 tracking-widest leading-none uppercase blur-sm">
          ΦΙΛΟΤΙΜΟ
        </h1>
      </div>

      {/* 3. THE CONTENT MONOLITH */}
      <div className="relative z-10 max-w-6xl px-6 md:px-12 flex flex-col items-center text-center">
        {/* The "Crown" Label */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="text-[#DAA520] text-[10px] tracking-[0.6em] uppercase font-bold opacity-80 border border-[#DAA520]/30 px-4 py-2">
            The Philosophy
          </span>
        </div>

        {/* The Statement Headline */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-marcellus text-white leading-[1.05] tracking-tight mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          WHEN LUXURY MEETS <br className="hidden md:block" />
          TRUST AND{" "}
          <span
            className="italic font-light relative inline-block"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            "FILOTIMO"
            {/* Subtle glow effect behind the gold word */}
            <div className="absolute inset-0 blur-2xl bg-[#DAA520]/20 -z-10"></div>
          </span>
        </h2>

        {/* The Gold Divider Line */}
        <div className="h-px w-32 bg-linear-to-r from-transparent via-[#DAA520] to-transparent mb-14 opacity-60"></div>

        {/* The Definition Paragraph */}
        <p className="text-lg md:text-2xl text-gray-400 font-marcellus leading-relaxed max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          In Greece, there is a word with no true translation in any other
          language: <span className="text-white">filotimo</span>. It is more
          than “honour” or “doing the right thing” – it is a deep sense of{" "}
          <span className="text-white border-b border-[#DAA520]/40 pb-0.5 transition-colors hover:border-[#DAA520]">
            responsibility
          </span>
          ,{" "}
          <span className="text-white border-b border-[#DAA520]/40 pb-0.5 transition-colors hover:border-[#DAA520]">
            generosity
          </span>{" "}
          and{" "}
          <span className="text-white border-b border-[#DAA520]/40 pb-0.5 transition-colors hover:border-[#DAA520]">
            pride
          </span>{" "}
          in taking care of others as if they were family.
          <br />
          <br />
          At George Yachts, filotimo means protecting your time, your privacy
          and your investment, and treating your journey as if it were our own.
        </p>

        {/* The Signature Mark */}
        <div className="mt-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
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
