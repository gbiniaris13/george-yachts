import React, { useState, useRef } from "react";

const ContactFormSection = () => {
  const [status, setStatus] = useState("");
  const formRef = React.useRef(null);

  const handleVercelSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    // 1. Get form data (Native FormData object)
    const formData = new FormData(formRef.current);

    // 2. CONVERSION TO URL-ENCODED STRING (CRITICAL CHANGE)
    const payloadBody = new URLSearchParams(formData).toString();

    // 3. Submitting to the Next.js API Route (/api/contact)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        // IMPORTANT: Sending as URL-encoded form data
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payloadBody, // Sending the URL-encoded string
      });

      if (response.ok) {
        setStatus("Message sent successfully! We will be in touch shortly.");
        formRef.current.reset();
      } else {
        // Since we are sending simple data, we handle the error response carefully
        setStatus("Submission failed. Please check the logs.");
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
          src="/images/form_bg.jpg"
          alt="Luxury yacht background for contact form"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/images/form_bg.jpg")}
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* 2. Contact Form Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full p-4 md:p-8">
        {/* FORM CONTAINER: Transparent, no blur/shadow */}
        <div className="w-full max-w-lg bg-transparent p-6 sm:p-10 rounded-xl">
          <h2 className="text-4xl font-extrabold text-white mb-6 text-center">
            CONTACT
          </h2>

          <form
            ref={formRef}
            onSubmit={handleVercelSubmit}
            className="space-y-4"
          >
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

            <p className="text-xs text-white text-center">
              This site is protected by reCAPTCHA <br></br>and the Google
              Privacy Policy and Terms of Service apply.
            </p>

            {status && (
              <p className="text-center font-medium text-sm pt-2 text-white">
                {status}
              </p>
            )}

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
