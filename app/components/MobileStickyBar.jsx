"use client";

export default function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        backgroundColor: "rgba(2, 6, 23, 0.97)",
        borderTop: "1px solid rgba(218, 165, 32, 0.15)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="px-4 py-3">
        <a
          href="https://calendly.com/george-georgeyachts/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 text-xs tracking-[0.2em] uppercase font-semibold rounded-sm transition-all duration-300 active:scale-[0.98]"
          style={{
            backgroundColor: "#DAA520",
            color: "#020617",
          }}
        >
          Book a Free Consultation
        </a>
      </div>
    </div>
  );
}
