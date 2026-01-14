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

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/form_bg.jpg"
          alt="Luxury yacht background for contact form"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/images/form_bg.jpg")}
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full p-4 md:p-12 lg:p-20">
        <div className="w-full max-w-5xl bg-transparent p-6 sm:p-10 rounded-xl">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-12 text-center tracking-tight">
            CONTACT
          </h2>

          <form
            ref={formRef}
            onSubmit={handleVercelSubmit}
            // GRID SYSTEM: 1 column mobile, 2 columns desktop (strict uniformity)
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* --- TIER 1: FULL WIDTH HEADERS (Span 2 cols on desktop) --- */}

            {/* Type of Yacht */}
            <div className="md:col-span-2">
              <label htmlFor="yacht_type" className="sr-only">
                Type of Yacht
              </label>
              <input
                type="text"
                id="yacht_type"
                name="yacht_type"
                placeholder="Select Type of Yacht*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>

            {/* Full Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>

            {/* Country */}
            <div className="md:col-span-2">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="Country of Residence*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>

            {/* --- TIER 2: UNIFORM 2-COLUMN GRID (8 Fields) --- */}

            {/* Row 1 */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label htmlFor="guests" className="sr-only">
                Number of Guests
              </label>
              <input
                type="text"
                id="guests"
                name="guests"
                placeholder="Number of Guests*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>
            <div>
              <label htmlFor="budget" className="sr-only">
                Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                placeholder="Budget / Week (Fees Included)*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>

            {/* Row 3 */}
            <div>
              <label htmlFor="check_in" className="sr-only">
                Check-in Date
              </label>
              <input
                type="text"
                id="check_in"
                name="check_in"
                placeholder="Check-in Date*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>
            <div>
              <label htmlFor="check_out" className="sr-only">
                Check-out Date
              </label>
              <input
                type="text"
                id="check_out"
                name="check_out"
                placeholder="Check-out Date*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
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
                placeholder="Embarkation Athens (Yachts Home Base)*"
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
                placeholder="Disembarkation Mykonos (Yachts Home Base)*"
                required
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150 focus:bg-white/10 outline-none"
              />
            </div>

            {/* --- MESSAGE & SUBMIT (Span 2 cols) --- */}

            <div className="md:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us any specific preferences, special occasions, etc."
                required
                rows="4"
                className="w-full px-6 py-4 border border-white bg-transparent text-white placeholder-white rounded-2xl transition duration-150 resize-none focus:bg-white/10 outline-none"
              ></textarea>
            </div>

            <div className="md:col-span-2 space-y-4">
              <p className="text-xs text-white/60 text-center">
                This site is protected by reCAPTCHA{" "}
                <br className="hidden md:block" />
                and the Google Privacy Policy and Terms of Service apply.
              </p>

              {status && (
                <p className="text-center font-medium text-sm pt-2 text-white">
                  {status}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex justify-center cursor-pointer py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-medium text-white bg-black hover:bg-white hover:text-[#02132d] transition-all duration-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase tracking-widest"
                disabled={status === "Submitting..."}
              >
                Send Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
