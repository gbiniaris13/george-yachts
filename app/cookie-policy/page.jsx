import Footer from "../components/Footer";

export const metadata = {
  title: "Cookie Policy | George Yachts",
  description:
    "Global Digital Tracking & Cookie Disclosure for George Yachts Brokerage House LLC.",
  alternates: {
    canonical: "https://georgeyachts.com/cookie-policy",
  },
};

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
          <h1 className="text-4xl md:text-6xl font-marcellus text-white mb-4 tracking-tight uppercase leading-tight">
            Global Digital Tracking & Cookie Disclosure
          </h1>
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase mb-8">
            George Yachts Brokerage House LLC
          </p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#DAA520] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section title="I. JURISDICTIONAL FRAMEWORK & CORPORATE MANDATE">
          <p>
            GEORGE YACHTS BROKERAGE HOUSE LLC, a Wyoming Limited Liability
            Company (the “Company”), operates a premier digital brokerage
            platform designed for High-Net-Worth Individuals (HNWIs). In
            alignment with global privacy imperatives, including the General
            Data Protection Regulation (GDPR), the California Consumer Privacy
            Act (CCPA/CPRA), and the statutory requirements of the State of
            Wyoming, this disclosure articulates our methodologies regarding
            digital identifiers and tracking telemetry.
          </p>
        </Section>

        <Section title="II. TECHNICAL TAXONOMY OF TRACKING TECHNOLOGIES">
          <p>
            The Company utilizes an integrated stack of Tracking Technologies to
            maintain operational excellence:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
            <li>
              <strong className="text-white">
                HTTP Cookies & Local Storage:
              </strong>{" "}
              Sophisticated data packets facilitating state management and
              secure user authentication.
            </li>
            <li>
              <strong className="text-white">Web Beacons & Pixel Tags:</strong>{" "}
              Transparent graphic identifiers utilized to audit the efficacy of
              our bespoke marketing campaigns and high-fidelity content
              delivery.
            </li>
            <li>
              <strong className="text-white">
                Cryptographic Session Identifiers:
              </strong>{" "}
              Secure tokens ensuring that client interactions with our fleet
              remain encrypted and private.
            </li>
          </ul>
        </Section>

        <Section title="III. OPERATIONAL CLASSIFICATION">
          <p>
            To ensure total transparency, we categorize our digital assets as
            follows:
          </p>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Strictly Necessary & Systemic
              </h3>
              <p>
                These technologies are indispensable for the structural
                integrity of georgeyachts.com. They govern SSL/TLS handshakes,
                load balancing, and the rendering of high-resolution maritime
                imagery.
              </p>
              <p className="text-xs text-[#DAA520] mt-1 uppercase tracking-widest">
                (Legal Basis: Essential for the provision of requested digital
                services).
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Advanced Behavioral Analytics
              </h3>
              <p>
                Utilizing industry-standard diagnostic tools (e.g., Google
                Analytics), we aggregate anonymized telemetry to optimize fleet
                navigation and user-experience (UX) flows.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Cross-Platform Functional Personalization
              </h3>
              <p>
                These cookies preserve the "user state," remembering specific
                yacht preferences, geographical interest (Ionian, Cyclades,
                Saronic), and language settings to ensure a frictionless
                transition between sessions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Institutional CRM & Lead Intelligence
              </h3>
              <p>
                In coordination with professional-grade systems (HubSpot,
                Apollo.io, and Google Ads), these identifiers synchronize
                visitor engagement with our proprietary advisory database. This
                ensures that our communications are precise, relevant, and meet
                the exacting standards of our global network.
              </p>
            </div>
          </div>
        </Section>

        <Section title="IV. CONSENT ARCHITECTURE (THE COOKIEBOT PROTOCOL)">
          <p>
            The Company has deployed the Cookiebot Consent Management Platform
            (CMP), a gold-standard regulatory solution. This interface provides
            users with granular, real-time control over their data footprint.
            You hold the statutory right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
            <li>
              <strong className="text-white">Affirmative Opt-In:</strong> Active
              consent for the full bespoke experience.
            </li>
            <li>
              <strong className="text-white">Granular Selection:</strong>{" "}
              Targeted consent for specific categories.
            </li>
            <li>
              <strong className="text-white">The Right to Erasure:</strong>{" "}
              Independent management of your digital trail via browser-level
              clearing or our manual compliance portal.
            </li>
          </ul>
        </Section>

        <Section title="V. DATA TRANSFERS & SOVEREIGNTY">
          <p>
            As a Wyoming-domiciled entity, data captured via our platform is
            processed within the United States. We maintain rigorous data
            processing agreements (DPAs) with our third-party providers to
            ensure that all transfers meet or exceed international adequacy
            standards.
          </p>
        </Section>

        <Section title="VI. COMPLIANCE & GOVERNANCE CONTACT">
          <p>
            For inquiries regarding our privacy posture or the exercise of your
            data subject rights (DSRs), please direct all formal correspondence
            to:
          </p>
          <div className="mt-6 text-white space-y-2 bg-white/5 border border-white/10 p-6">
            <div>
              <strong>Compliance Office</strong>
            </div>
            <div>
              <strong>Entity:</strong> GEORGE YACHTS BROKERAGE HOUSE LLC
            </div>
            <div>
              <strong>Registered Office:</strong> 30 N Gould St, STE R,
              Sheridan, WY 82801, USA
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
              <strong>Attention:</strong> Data Protection Officer (DPO)
            </div>
          </div>
        </Section>

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

export default CookiePolicy;
