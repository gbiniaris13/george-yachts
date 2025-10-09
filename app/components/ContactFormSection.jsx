import React, { useState, useRef } from "react"; // Added useRef

// IMPORTANT: Next.js standard for public ENV vars is NEXT_PUBLIC_...
// You must set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env.local and Vercel settings.
const RECAPTCHA_PUBLIC_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const ContactFormSection = () => {
  const [status, setStatus] = useState("");
  const formRef = React.useRef(null);

  // NOTE: This component is now configured for submission to a Vercel Serverless Function (API Route).
  const handleVercelSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    let recaptchaToken;

    // --- 1. Get reCAPTCHA Token ---
    try {
      if (!RECAPTCHA_PUBLIC_KEY) {
        throw new Error("RECAPTCHA_PUBLIC_KEY not configured.");
      }

      // We assume the global grecaptcha object is available from the script loaded in layout.js
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
        // Fallback if script hasn't loaded (usually during development)
        console.warn("reCAPTCHA script not found. Proceeding with mock token.");
        recaptchaToken = "mock_token";
      }
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
      setStatus("Submission failed: ReCAPTCHA error (Check console/script).");
      return;
    }

    // 2. Prepare Payload (including token)
    const formData = new FormData(formRef.current);
    const payload = {
      ...Object.fromEntries(formData),
      recaptchaToken: recaptchaToken, // Include the token for backend verification
    };

    // 3. Submitting to the Next.js API Route (/api/contact)
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
    <section className="relative w-full h-[700px] overflow-hidden">
      {/* 1. Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/form_bg.jpg" // IMPORTANT: Update this path to your actual image!
          alt="Luxury yacht background for contact form"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/images/form_bg.jpg")}
        />
        {/* Dark overlay for better form readability */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* 2. Contact Form Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 md:p-8">
        {/* FORM CONTAINER: Transparent, no blur/shadow */}
        <div className="w-full max-w-lg bg-transparent p-6 sm:p-10 rounded-xl">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            CONTACT
          </h2>

          {/* NEXT.JS API FORM SETUP: Added ref for data extraction */}
          <form
            ref={formRef}
            onSubmit={handleVercelSubmit}
            className="space-y-4"
          >
            {/* The name attribute is still required on all inputs for form data collection */}

            {/* Name Field (REQUIRED) */}
            <div>
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
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150"
              />
            </div>

            {/* Email Field (REQUIRED) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150"
              />
            </div>

            {/* Phone Field (REQUIRED) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 border border-white bg-transparent text-white placeholder-white rounded-full transition duration-150"
              />
            </div>

            {/* Message Field (REQUIRED) */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 sr-only"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your message or inquiry..."
                required
                rows="4"
                className="w-full px-4 py-3 border border-white bg-transparent text-white placeholder-white rounded-2xl transition duration-150 resize-none"
              ></textarea>
            </div>

            {/* ReCAPTCHA Note (Kept for compliance) */}
            <p className="text-xs text-white text-center">
              This site is protected by reCAPTCHA <br></br>and the Google
              Privacy Policy and Terms of Service apply.
            </p>

            {/* Status Message */}
            {status && (
              <p className="text-center font-medium text-sm pt-2 text-white">
                {status}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center cursor-pointer py-3 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-black hover:bg-white hover:text-[#02132d] transition duration-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2"
              disabled={status === "Submitting..."}
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
