"use client";

import React, { useState } from "react";

const RECAPTCHA_PUBLIC_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const ContactFormSection = () => {
  const [status, setStatus] = useState("");
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
        recaptchaToken = await grecaptcha.enterprise.execute(
          RECAPTCHA_PUBLIC_KEY,
          { action: "contact_form_submit" }
        );
      } else if (typeof grecaptcha !== "undefined" && grecaptcha.execute) {
        recaptchaToken = await grecaptcha.execute(RECAPTCHA_PUBLIC_KEY, {
          action: "contact_form_submit",
        });
      } else {
        console.warn("reCAPTCHA script not found. Proceeding with mock token.");
        recaptchaToken = "mock_token";
      }
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
      setStatus("Submission failed: ReCAPTCHA error (Check console/script).");
      return;
    }

    const formData = new FormData(formRef.current);
    const payload = {
      ...Object.fromEntries(formData),
      recaptchaToken: recaptchaToken,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("Message sent successfully! We will be in touch shortly.");
        formRef.current.reset();
      } else {
        const errorData = await response.json();
        setStatus(`Submission failed: ${errorData.message || "Server error."}`);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      setStatus("Network error. Please check your connection.");
    }
  };

  // Sharp, border-only inputs
  const inputStyles =
    "w-full bg-white/[0.03] text-white border-b border-white/20 px-0 py-4 text-lg focus:outline-none focus:border-[#DAA520] focus:bg-white/[0.05] transition-all duration-500 placeholder:text-white/40 placeholder:font-light rounded-none";

  const labelStyles = "sr-only";

  return (
    // FIX: Hardcoded bg-black to ensure visibility, then added gradient on top
    <section className="relative w-full min-h-screen bg-black flex items-center justify-center py-24 overflow-hidden">
      {/* Gradient Overlay: Deep Gold/Brown at the bottom fading to Black */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2e2000] via-black to-black z-0"></div>

      {/* Texture: Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-10"></div>

      <div className="relative z-30 w-full max-w-6xl px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-marcellus text-white tracking-tighter mt-4">
            CONTACT
          </h2>
        </div>

        <form
          ref={formRef}
          onSubmit={handleVercelSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12"
        >
          {/* --- TIER 1: FULL WIDTH --- */}

          <div className="md:col-span-2 group">
            <label htmlFor="yacht_type" className={labelStyles}>
              Type of Yacht
            </label>
            <input
              type="text"
              id="yacht_type"
              name="yacht_type"
              required
              placeholder="Select Type of Yacht*"
              className={`${inputStyles} text-2xl md:text-3xl`}
            />
          </div>

          <div className="md:col-span-2 group">
            <label htmlFor="name" className={labelStyles}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Full Name*"
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-2 group">
            <label htmlFor="country" className={labelStyles}>
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              required
              placeholder="Country of Residence*"
              className={inputStyles}
            />
          </div>

          {/* --- TIER 2: THE DETAILS --- */}

          <div>
            <label htmlFor="email" className={labelStyles}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email Address*"
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelStyles}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Phone Number*"
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="guests" className={labelStyles}>
              Guests
            </label>
            <input
              type="text"
              id="guests"
              name="guests"
              required
              placeholder="Number of Guests*"
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="budget" className={labelStyles}>
              Budget
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              required
              placeholder="Budget / Week (Fees Included)*"
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="check_in" className={labelStyles}>
              Check In
            </label>
            <input
              type="text"
              id="check_in"
              name="check_in"
              required
              placeholder="Check-in Date*"
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="check_out" className={labelStyles}>
              Check Out
            </label>
            <input
              type="text"
              id="check_out"
              name="check_out"
              required
              placeholder="Check-out Date*"
              className={inputStyles}
            />
          </div>

          {/* Row 4 */}
          <div>
            <label htmlFor="embarkation" className="sr-only">
              Embarkation
            </label>
            <input
              type="text"
              id="embarkation"
              name="embarkation"
              placeholder="Embarkation"
              required
              className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
            />
          </div>
          <div>
            <label htmlFor="disembarkation" className="sr-only">
              Disembarkation
            </label>
            <input
              type="text"
              id="disembarkation"
              name="disembarkation"
              placeholder="Disembarkation"
              required
              className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
            />
          </div>

          {/* --- TIER 3: MESSAGE --- */}

          <div className="md:col-span-2 mt-8">
            <label htmlFor="message" className={labelStyles}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="4"
              placeholder="Tell us any specific preferences, special occasions, etc."
              className={`${inputStyles} resize-none`}
            ></textarea>
          </div>

          {/* --- FOOTER & TRIGGER --- */}

          <div className="md:col-span-2 flex flex-col items-center space-y-8 mt-12">
            <div className="text-[10px] text-white/40 uppercase tracking-widest text-center">
              This site is protected by reCAPTCHA{" "}
              <br className="hidden md:block" /> and the Google Privacy Policy
              and Terms of Service apply.
            </div>

            {status && (
              <div className="text-[#DAA520] font-mono text-sm tracking-widest uppercase animate-pulse">
                [{status}]
              </div>
            )}

            <button
              type="submit"
              disabled={status === "Submitting..."}
              className="group relative w-full py-6 bg-white hover:bg-[#DAA520] transition-colors duration-500 ease-out overflow-hidden"
            >
              <span className="relative z-10 text-black font-bold text-lg tracking-[0.3em] uppercase group-hover:text-white transition-colors duration-300">
                Send Inquiry
              </span>
              {/* Hover Reveal Effect */}
              <div className="absolute inset-0 bg-[#DAA520] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        input,
        textarea,
        button {
          border-radius: 0 !important;
        }
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
      `}</style>
    </section>
  );
};

export default ContactFormSection;
