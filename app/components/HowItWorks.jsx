"use client";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="1.2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
      title: "Share Your Vision",
      desc: "Tell us your dates, group size, and dream destination. We listen first — every charter starts with understanding what matters to you.",
    },
    {
      num: "02",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="1.2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l2 2" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      ),
      title: "Receive Your Curated Options",
      desc: "Within 24 hours, you receive a handpicked selection of yachts, itineraries, and insider recommendations — tailored exclusively to your group.",
    },
    {
      num: "03",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="1.2">
          <path d="M2 12c2-4 6-8 10-8s8 4 10 8c-2 4-6 8-10 8S4 16 2 12z" />
          <path d="M3 20L7 12M21 20L17 12" />
          <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
      ),
      title: "Step Aboard",
      desc: "We handle every detail — contracts, provisioning, captain briefing, concierge requests. You just arrive and sail.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, #DAA520 0%, transparent 70%)"
      }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#DAA520]/60 mb-4 font-light">
            Your Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-marcellus text-white/90 mb-6">
            How It Works
          </h2>
          <p className="text-white/40 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
            From your first message to stepping aboard — we handle everything.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center group">
              {/* Number */}
              <div className="text-5xl font-marcellus mb-6" style={{
                backgroundImage: "linear-gradient(180deg, #DAA520 0%, #8B6914 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: 0.3,
              }}>
                {step.num}
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-marcellus text-white/90 mb-4 tracking-wide">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>

              {/* Connector line (desktop only) */}
              {i < 2 && (
                <div className="hidden md:block absolute" style={{
                  /* Handled by gap */
                }} />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/charter-yacht-greece"
            className="inline-block px-10 py-4 text-xs tracking-[0.2em] uppercase font-medium border border-[#DAA520]/30 text-[#DAA520] hover:bg-[#DAA520]/10 transition-all duration-500 rounded-sm"
          >
            Start Planning Your Charter
          </a>
        </div>
      </div>
    </section>
  );
}
