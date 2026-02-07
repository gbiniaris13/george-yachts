import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy | George Yachts",
  description:
    "George Yachts Brokerage House LLC commitment to confidentiality, data protection, and digital privacy.",
};

// This Component is perfectly valid.
// It starts with a Capital Letter (Section) so React knows it's a component.
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

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-20 px-6 md:px-12 border-b border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[#DAA520] text-xs font-bold tracking-[0.4em] uppercase mb-6">
            Legal & Compliance
          </p>
          <h1 className="text-5xl md:text-7xl font-marcellus text-white mb-8 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            George Yachts Brokerage House LLC is committed to protecting your
            privacy. This document outlines how we collect, protect, and utilize
            your data to provide a bespoke luxury experience in accordance with
            Wyoming state and federal regulations.
          </p>
        </div>

        {/* Background Gradient Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#DAA520] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section title="1. Introduction">
          <p>
            George Yachts Brokerage House LLC ("we," "us," or "our") is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit our website. As a Wyoming-registered entity, we operate in
            accordance with applicable state and federal regulations to provide
            a bespoke luxury experience.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>
            We collect information that you voluntarily provide to us when you
            inquire about a charter, sign up for our newsletter, or contact us
            directly. This may include your name, email address, phone number,
            and specific preferences regarding your yacht charter requirements.
          </p>
          <p>
            Additionally, we may automatically collect certain information about
            your device and browsing patterns, including your IP address,
            browser type, and operating system, to enhance your digital
            experience.
          </p>
        </Section>

        <Section title="3. Use of Google Analytics & Ads">
          <p>
            We utilize <strong>Google Analytics</strong> to analyze traffic and
            user behavior on our website. This tool collects data such as
            session duration, pages visited, and demographic information. This
            data is anonymized and used solely to improve our platform's
            performance and user experience.
          </p>
          <p>
            We also engage in <strong>Google Ads</strong> services. These
            services may use data regarding your interactions with our website
            to present relevant opportunities to you across the digital
            landscape.
          </p>
        </Section>

        <Section title="4. Third-Party Data & CRM Tools">
          <p>
            To maintain high-quality communication with our prospective and
            existing clients, we utilize third-party software solutions,
            including <strong>Apollo.io</strong>. These tools assist us in
            managing client relationships, verifying contact details, and
            ensuring that our communications are relevant and timely.
          </p>
          <p>
            Data processed through these platforms is handled in strict
            compliance with applicable data protection regulations. We do not
            sell your personal data to unauthorized third parties.
          </p>
        </Section>

        <Section title="5. Data Security">
          <p>
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, please also remember that we cannot
            guarantee that the internet itself is 100% secure. Although we will
            do our best to protect your personal information, transmission of
            personal information to and from our services is at your own risk.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>
            Depending on your location, you may have certain rights regarding
            your personal information, including the right to access, correct,
            or delete the data we hold about you. If you wish to exercise any of
            these rights, please contact us using the details provided below.
          </p>
        </Section>

        <Section title="7. Contact Us">
          <p>
            If you have questions or comments about this policy, or if you wish
            to update, delete, or change any Personal Information we hold,
            please contact us at:
          </p>
          <div className="mt-6 text-white space-y-2">
            <div>
              <strong>Legal Entity:</strong> GEORGE YACHTS BROKERAGE HOUSE LLC
            </div>
            <div>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:george@georgeyachts.com"
                className="hover:text-[#DAA520] transition-colors"
              >
                george@georgeyachts.com
              </a>
            </div>
            <div>
              <strong>Registered Office Address:</strong> 30 N Gould St Ste R,
              Sheridan, WY 82801, USA
            </div>
            <div>
              <strong>Operational Scope:</strong> Mediterranean Operations
            </div>
          </div>
        </Section>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Last Updated: February 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
