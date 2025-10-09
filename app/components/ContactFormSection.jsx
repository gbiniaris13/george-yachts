import React, { useState } from "react";

const ContactFormSection = () => {
  // State is now only used for clearing the form and showing success message
  const [status, setStatus] = useState("");

  // NOTE: Netlify Forms will capture this submission and handle the email forwarding.
  // The 'handleSubmit' logic is now handled automatically by the browser/Netlify.
  // We keep a basic client-side check for the success redirect.
  const handleNetlifySubmit = (e) => {
    // Prevent default form submission to handle Netlify's requirements
    e.preventDefault();
    setStatus("Submitting...");

    // Netlify requires a standard URL-encoded body
    const form = e.target;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((response) => {
        if (response.ok) {
          // Netlify often redirects to a success page; setting client-side state is secondary
          setStatus("Message sent successfully! Thank you.");
          form.reset(); // Clear form inputs
          // Optionally, redirect the user to a Netlify success page here
        } else {
          setStatus("Submission failed. Please try again.");
        }
      })
      .catch((error) =>
        setStatus("Network error. Please check your connection.")
      );
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
          <h2 className="text-4xl font-extrabold text-white mb-6 text-center">
            CONTACT
          </h2>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleNetlifySubmit}
            className="space-y-4"
          >
            <input type="hidden" name="form-name" value="contact" />
            <div hidden>
              <label>
                Don't fill this out: <input name="bot-field" />
              </label>
            </div>

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
                name="name" // KEEP name ATTRIBUTE
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
                name="email" // KEEP name ATTRIBUTE
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
                name="phone" // KEEP name ATTRIBUTE
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
                name="message" // KEEP name ATTRIBUTE
                placeholder="Your message or inquiry..."
                required
                rows="4"
                className="w-full px-4 py-3 border border-white bg-transparent text-white placeholder-white rounded-2xl transition duration-150 resize-none"
              ></textarea>
            </div>

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
