"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import YachtSwiper from "./YachtSwiper";

const CATEGORIES = [
  { label: "All Fleet", value: "all" },
  { label: "Sailing Monohulls", value: "sailing-monohulls" },
  { label: "Sailing Catamarans", value: "sailing-catamarans" },
  { label: "Power Catamarans", value: "power-catamarans" },
  { label: "Motor Yachts", value: "motor-yachts" },
];

// Inner component to safely use search params
const YachtListContent = ({ initialYachts }) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const typeFilter = searchParams.get("type");
    if (typeFilter) {
      // 1. Pre-select the tab from the URL
      setActiveTab(typeFilter);

      // 2. Adjust Height: Scroll to the container with an offset for the sticky header
      const fleetElement = document.getElementById("fleet-anchor");
      if (fleetElement) {
        const yOffset = -80; // Pixel-perfect offset for the sticky nav
        const y =
          fleetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [searchParams]);

  const filteredYachts = useMemo(() => {
    if (activeTab === "all") return initialYachts;
    return initialYachts.filter((yacht) => yacht.category === activeTab);
  }, [activeTab, initialYachts]);

  return (
    <section id="fleet-anchor" className="relative py-20 bg-transparent">
      {/* INDUSTRY KILLING FILTER: Floating Monolith Design */}
      <div className="relative lg:sticky lg:top-24 z-40 flex justify-center px-4 mb-24">
        <div className="flex flex-wrap justify-center gap-0 bg-white/40 backdrop-blur-2xl border border-black/3 shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveTab(cat.value)}
              className={`relative px-8 py-5 font-marcellus cursor-pointer text-[11px] tracking-[0.4em] uppercase transition-all duration-700 ${
                activeTab === cat.value
                  ? "text-black"
                  : "text-black/40 hover:text-black hover:bg-black/3"
              }`}
            >
              {cat.label}
              {activeTab === cat.value && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DAA520] animate-in fade-in zoom-in duration-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto">
        {filteredYachts.length > 0 ? (
          <div className="space-y-32">
            {filteredYachts.map((yacht) => (
              <div
                key={yacht._id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
              >
                <YachtSwiper yachtData={yacht} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-black/10 mx-4">
            <p className="font-marcellus text-black/30 tracking-[0.3em] uppercase text-sm">
              No vessels currently available in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// Main Export with Suspense Boundary for SearchParams
const YachtListClient = (props) => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
      <YachtListContent {...props} />
      <style jsx global>{`
        button,
        div,
        img,
        section {
          border-radius: 0 !important;
        }
      `}</style>
    </Suspense>
  );
};

export default YachtListClient;
