"use client";

import React, { useState, useEffect, useRef } from "react";

const RECAPTCHA_PUBLIC_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/* ─── SVG Icons (inline, no dependencies) ─── */
const Icons = {
  anchor: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ),
  mapPin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  shield: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
};

/* ─── Scroll Reveal Hook ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ─── Field Component ─── */
function Field({ icon, delay, children }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <div className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#DAA520] transition-colors duration-500">
        {icon}
      </div>
      <div className="pl-8">
        {children}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
const ContactFormSection = () => {
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1);
  const formRef = React.useRef(null);

  const handleVercelSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    let recaptchaToken;

    try {
      if (!RECAPTCHA_PUBLIC_KEY) {
        throw new Error("RECAPTCHA_PUBLIC_KEY not configured.");
      }
      if (typeof grecaptcha !== "undefined" && grecaptcha.enterprise) {
        recaptchaToken = await grecaptcha.enterprise.execute(RECAPTCHA_PUBLIC_KEY, { action: "contact_form_submit" });
      } else if (typeof grecaptcha !== "undefined" && grecaptcha.execute) {
        recaptchaToken = await grecaptcha.execute(RECAPTCHA_PUBLIC_KEY, { action: "contact_form_submit" });
      } else {
        recaptchaToken = "mock_token";
      }
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
      setStatus("Submission failed: ReCAPTCHA error.");
      return;
    }

    const formData = new FormData(formRef.current);
    const payload = { ...Object.fromEntries(formData), recaptchaToken };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        formRef.current.reset();
        setStep(1);
      } else {
        const errorData = await response.json();
        setStatus(`Submission failed: ${errorData.message || "Server error."}`);
      }
    } catch (error) {
      setStatus("Network error. Please check your connection.");
    }
  };

  const inputBase =
    "w-full bg-transparent text-white border-b border-white/15 px-0 py-4 text-base focus:outline-none focus:border-[#DAA520] transition-all duration-500 placeholder:text-white/30 placeholder:font-light placeholder:text-sm rounded-none";

  const selectBase =
    "w-full bg-transparent text-white border-b border-white/15 px-0 py-4 text-base focus:outline-none focus:border-[#DAA520] transition-all duration-500 rounded-none appearance-none cursor-pointer";

  // Success state
  if (status === "success") {
    return (
      <section id="contact" className="relative w-full min-h-screen bg-black flex items-center justify-center py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1200] via-black to-black z-0" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-10" />

        <div className="relative z-30 text-center px-6 max-w-2xl mx-auto">
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full border border-[#DAA520]/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3
            className="text-4xl md:text-5xl font-marcellus mb-6"
            style={{
              backgroundImage: "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              color: "transparent", WebkitTextFillColor: "transparent",
            }}
          >
            Thank You
          </h3>
          <p className="text-white/60 text-lg font-light leading-relaxed mb-4">
            Your inquiry has been received. Our team will review your preferences and get back to you as soon as possible.
          </p>
          <p className="text-white/30 text-sm tracking-wider uppercase">
            George Yachts Brokerage House
          </p>
          <button
            onClick={() => setStatus("")}
            className="mt-12 text-[#DAA520] text-xs tracking-[0.2em] uppercase border-b border-[#DAA520]/30 pb-1 hover:border-[#DAA520] transition-all duration-300"
          >
            Submit Another Inquiry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative w-full bg-black py-28 md:py-36 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1200] via-black to-black z-0" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-10" />

      {/* Decorative gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#DAA520]/20 to-transparent z-20" />

      <div className="relative z-30 w-full max-w-5xl mx-auto px-6 md:px-12">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#DAA520]/70 mb-6 font-light">
            Exclusively Greek Waters
          </p>
          <h2
            className="text-5xl md:text-7xl font-marcellus tracking-tight"
            style={{
              backgroundImage: "linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              color: "transparent", WebkitTextFillColor: "transparent",
            }}
          >
            Begin Your Charter
          </h2>
          <p className="mt-6 text-white/40 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed">
            Share your vision and we&apos;ll curate the perfect yacht, crew, and itinerary for your Greek island experience.
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center gap-3 mb-16">
          {[
            { num: 1, label: "About You" },
            { num: 2, label: "Charter Details" },
            { num: 3, label: "Your Vision" },
          ].map((s) => (
            <React.Fragment key={s.num}>
              {s.num > 1 && (
                <div className={`w-12 h-px transition-colors duration-500 ${step >= s.num ? 'bg-[#DAA520]/40' : 'bg-white/10'}`} />
              )}
              <button
                type="button"
                onClick={() => setStep(s.num)}
                className="flex items-center gap-2 group"
              >
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 border
                  ${step === s.num
                    ? 'border-[#DAA520] text-[#DAA520] bg-[#DAA520]/10'
                    : step > s.num
                      ? 'border-[#DAA520]/40 text-[#DAA520]/60 bg-[#DAA520]/5'
                      : 'border-white/15 text-white/30'
                  }
                `}>
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className={`
                  text-[10px] tracking-[0.15em] uppercase hidden md:inline transition-colors duration-300
                  ${step === s.num ? 'text-white/70' : 'text-white/25'}
                `}>
                  {s.label}
                </span>
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* ── Form ── */}
        <form ref={formRef} onSubmit={handleVercelSubmit}>

          {/* STEP 1: About You */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <Field icon={Icons.user} delay={0}>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input type="text" id="name" name="name" required placeholder="Full Name *" className={inputBase} />
              </Field>

              <Field icon={Icons.globe} delay={0.05}>
                <label htmlFor="country" className="sr-only">Country</label>
                <input type="text" id="country" name="country" required placeholder="Country of Residence *" className={inputBase} />
              </Field>

              <Field icon={Icons.mail} delay={0.1}>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" id="email" name="email" required placeholder="Email Address *" className={inputBase} />
              </Field>

              <Field icon={Icons.phone} delay={0.15}>
                <label htmlFor="phone" className="sr-only">Phone</label>
                <input type="tel" id="phone" name="phone" required placeholder="Phone Number *" className={inputBase} />
              </Field>
            </div>

            <div className="flex justify-end mt-14">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="group flex items-center gap-3 text-[#DAA520] text-xs tracking-[0.2em] uppercase hover:gap-5 transition-all duration-500"
              >
                Continue
                <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </button>
            </div>
          </div>

          {/* STEP 2: Charter Details */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <Field icon={Icons.anchor} delay={0}>
                <label htmlFor="yacht_type" className="sr-only">Type of Yacht</label>
                <select id="yacht_type" name="yacht_type" required className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Type of Yacht *</option>
                  <option value="Motor Yacht" className="bg-black">Motor Yacht</option>
                  <option value="Sailing Catamaran" className="bg-black">Sailing Catamaran</option>
                  <option value="Power Catamaran" className="bg-black">Power Catamaran</option>
                  <option value="Sailing Monohull" className="bg-black">Sailing Monohull</option>
                  <option value="Not Sure - Advise Me" className="bg-black">Not Sure &mdash; Advise Me</option>
                </select>
              </Field>

              <Field icon={Icons.users} delay={0.05}>
                <label htmlFor="guests" className="sr-only">Guests</label>
                <select id="guests" name="guests" required className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Number of Guests *</option>
                  {[2,3,4,5,6,7,8,9,10,11,12].map(n => (
                    <option key={n} value={n} className="bg-black">{n} Guests</option>
                  ))}
                  <option value="12+" className="bg-black">12+ Guests</option>
                </select>
              </Field>

              <Field icon={Icons.wallet} delay={0.1}>
                <label htmlFor="budget" className="sr-only">Budget</label>
                <select id="budget" name="budget" required className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Weekly Budget (All-In) *</option>
                  <option value="Under €15,000" className="bg-black">Under &euro;15,000</option>
                  <option value="€15,000 – €30,000" className="bg-black">&euro;15,000 &ndash; &euro;30,000</option>
                  <option value="€30,000 – €50,000" className="bg-black">&euro;30,000 &ndash; &euro;50,000</option>
                  <option value="€50,000 – €100,000" className="bg-black">&euro;50,000 &ndash; &euro;100,000</option>
                  <option value="€100,000+" className="bg-black">&euro;100,000+</option>
                  <option value="Flexible" className="bg-black">Flexible &mdash; Advise Me</option>
                </select>
              </Field>

              <Field icon={Icons.calendar} delay={0.15}>
                <label htmlFor="check_in" className="sr-only">Check In</label>
                <input type="date" id="check_in" name="check_in" required className={`${inputBase} date-input`} placeholder="Check-in Date *" />
              </Field>

              <Field icon={Icons.calendar} delay={0.2}>
                <label htmlFor="check_out" className="sr-only">Check Out</label>
                <input type="date" id="check_out" name="check_out" required className={`${inputBase} date-input`} placeholder="Check-out Date *" />
              </Field>

              <Field icon={Icons.mapPin} delay={0.25}>
                <label htmlFor="embarkation" className="sr-only">Embarkation</label>
                <select id="embarkation" name="embarkation" className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Preferred Embarkation</option>
                  <option value="Athens (Lavrion/Alimos)" className="bg-black">Athens (Lavrion/Alimos)</option>
                  <option value="Mykonos" className="bg-black">Mykonos</option>
                  <option value="Santorini" className="bg-black">Santorini</option>
                  <option value="Corfu" className="bg-black">Corfu</option>
                  <option value="Lefkada" className="bg-black">Lefkada</option>
                  <option value="Rhodes" className="bg-black">Rhodes</option>
                  <option value="Kos" className="bg-black">Kos</option>
                  <option value="Flexible" className="bg-black">Flexible &mdash; Advise Me</option>
                </select>
              </Field>

              <Field icon={Icons.mapPin} delay={0.3}>
                <label htmlFor="disembarkation" className="sr-only">Disembarkation</label>
                <select id="disembarkation" name="disembarkation" className={selectBase} defaultValue="">
                  <option value="" disabled className="text-white/30">Preferred Disembarkation</option>
                  <option value="Same as Embarkation" className="bg-black">Same as Embarkation</option>
                  <option value="Athens (Lavrion/Alimos)" className="bg-black">Athens (Lavrion/Alimos)</option>
                  <option value="Mykonos" className="bg-black">Mykonos</option>
                  <option value="Santorini" className="bg-black">Santorini</option>
                  <option value="Corfu" className="bg-black">Corfu</option>
                  <option value="Lefkada" className="bg-black">Lefkada</option>
                  <option value="Flexible" className="bg-black">Flexible &mdash; Advise Me</option>
                </select>
              </Field>
            </div>

            <div className="flex justify-between mt-14">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white/60 transition-colors duration-300"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="group flex items-center gap-3 text-[#DAA520] text-xs tracking-[0.2em] uppercase hover:gap-5 transition-all duration-500"
              >
                Continue
                <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </button>
            </div>
          </div>

          {/* STEP 3: Your Vision */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <Field icon={Icons.message} delay={0}>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell us about your dream charter — special occasions, preferred islands, dining preferences, activities..."
                className={`${inputBase} resize-none`}
              />
            </Field>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 mb-8">
              <div className="flex items-center gap-2 text-white/25 text-[10px] tracking-[0.15em] uppercase">
                {Icons.shield}
                <span>Confidential</span>
              </div>
              <div className="flex items-center gap-2 text-white/25 text-[10px] tracking-[0.15em] uppercase">
                {Icons.shield}
                <span>No Obligation</span>
              </div>
              <div className="flex items-center gap-2 text-white/25 text-[10px] tracking-[0.15em] uppercase">
                {Icons.shield}
                <span>Priority Response</span>
              </div>
            </div>

            {/* reCAPTCHA notice */}
            <div className="text-[9px] text-white/25 uppercase tracking-widest text-center mb-8">
              Protected by reCAPTCHA · Google Privacy Policy and Terms of Service apply
            </div>

            {/* Status */}
            {status && status !== "success" && (
              <div className="text-[#DAA520] text-sm tracking-widest uppercase text-center mb-6 animate-pulse">
                {status}
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={status === "Submitting..."}
                className="group relative w-full max-w-md py-5 overflow-hidden transition-all duration-500"
                style={{
                  background: 'linear-gradient(90deg, #E6C77A 0%, #C9A24D 45%, #A67C2E 100%)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3 text-black font-bold text-sm tracking-[0.3em] uppercase">
                  {Icons.send}
                  Send Inquiry
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-white/30 text-xs tracking-[0.2em] uppercase hover:text-white/60 transition-colors duration-300"
              >
                &larr; Back to Details
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        input, textarea, button, select { border-radius: 0 !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #000000 inset;
          transition: background-color 5000s ease-in-out 0s;
        }
        select option { background: #000 !important; color: #fff !important; }
        select:invalid { color: rgba(255,255,255,0.3); }
        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(1) saturate(3) hue-rotate(15deg);
          cursor: pointer;
        }
      `}</style>
    </section>
  );
};

export default ContactFormSection;
