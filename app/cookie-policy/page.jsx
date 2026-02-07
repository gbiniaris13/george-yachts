import Footer from "../components/Footer"; // Kept your requested path

export const metadata = {
  title: "Cookie Policy | George Yachts",
  description:
    "Transparency regarding our use of digital tracking technologies.",
};

// This is a Helper Component (Capitalized!)
const Section = ({ title, children }) => (
  <div className="mb-16 border-l border-[#DAA520]/30 pl-8">
    <h2 className="text-2xl font-marcellus text-white mb-6 tracking-wide">
      {title}
    </h2>
    <div className="text-white/60 font-sans text-sm leading-8 tracking-wide space-y-4">
      {children}
    </div>
  </div>
);

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-20 px-6 md:px-12 border-b border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[#DAA520] text-xs font-bold tracking-[0.4em] uppercase mb-6">
            Digital Transparency
          </p>
          <h1 className="text-5xl md:text-7xl font-marcellus text-white mb-8 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            We use advanced digital technologies to ensure your experience on
            George Yachts is seamless, personalized, and secure.
          </p>
        </div>

        {/* Luxury Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#DAA520] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section title="1. What Are Cookies?">
          <p>
            Cookies are small text files stored on your device (computer,
            tablet, or mobile) when you visit our website. They allow us to
            recognize your device, remember your preferences, and provide a
            tailored digital experience.
          </p>
          <p>
            Under the General Data Protection Regulation (GDPR), we
            differentiate between cookies that are strictly necessary for the
            technical operation of the site and those used for analytics or
            marketing purposes.
          </p>
        </Section>

        <Section title="2. Strictly Necessary Cookies">
          <p>
            These cookies are essential for the website to function properly.
            Without them, critical features—such as navigating between pages,
            securing forms, or loading high-resolution imagery—would not work.
          </p>
          <p>
            <em>
              Note: These cookies do not store personally identifiable
              information and do not require user consent under GDPR.
            </em>
          </p>
        </Section>

        <Section title="3. Analytics & Performance (Google)">
          <p>
            We use <strong>Google Analytics</strong> to understand how our
            discerning clientele interacts with our website. This helps us
            identify which yachts are most popular, how users navigate our
            fleet, and where we can improve user experience.
          </p>
          <p>
            The data collected is aggregated and anonymized. It includes metrics
            such as session duration, bounce rates, and device types.
          </p>
        </Section>

        <Section title="4. Marketing & CRM Technologies">
          <p>
            To provide a bespoke service, we utilize specific third-party tools
            that may set cookies or use similar tracking technologies:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
            <li>
              <strong className="text-white">Google Ads:</strong> Used to
              deliver relevant advertisements to you on other platforms based on
              your interest in our fleet.
            </li>
            <li>
              <strong className="text-white">Apollo.io:</strong> We use this
              sales intelligence software to maintain accurate client records
              and ensure our communications are reaching the correct
              individuals. Apollo may use tracking technologies to verify
              engagement with our emails or website.
            </li>
          </ul>
        </Section>

        <Section title="5. Managing Your Preferences">
          <p>
            You have the right to accept or reject cookies. Most web browsers
            automatically accept cookies, but you can usually modify your
            browser setting to decline cookies if you prefer.
          </p>
          <p>
            Additionally, upon your first visit to George Yachts, you will be
            presented with a Cookie Consent Banner allowing you to opt-in or
            opt-out of non-essential cookies. You may withdraw this consent at
            any time.
          </p>
        </Section>

        <Section title="6. Updates to This Policy">
          <p>
            We may update our Cookie Policy from time to time to reflect changes
            in technology or legislation. Any changes will be posted on this
            page with an updated revision date.
          </p>
        </Section>

        <Section title="7. Contact & Compliance">
          <p>
            If you have any questions regarding our use of cookies or wish to
            exercise your data rights, please contact our Data Protection
            Officer at:
          </p>
          <p className="mt-4 text-white">
            <strong>Email:</strong> info@georgeyachts.com
            <br />
            <strong>Address:</strong> Athens, Greece
          </p>
        </Section>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Last Updated: February 2026
          </p>
        </div>
      </div>

      {/* --- ADDED FOOTER HERE --- */}
      <Footer />
    </div>
  );
};

export default CookiePolicy;
