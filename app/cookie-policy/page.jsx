import Footer from "@/components/Footer";
import ObfuscatedEmail from "@/app/components/ObfuscatedEmail";

export const metadata = {
  title: "Cookie Policy | George Yachts",
  description:
    "Global Digital Tracking & Cookie Disclosure for George Yachts Brokerage House LLC.",
  alternates: {
    canonical: "https://georgeyachts.com/cookie-policy",
  },
};

const Section = ({ number, title, children }) => (
  <div className="mb-20 group" style={{ opacity: 1 }}>
    <div className="flex items-start gap-6">
      {number && (
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "48px", fontWeight: 300, lineHeight: 1, color: "rgba(218,165,32,0.15)" }}>
          {String(number).padStart(2, "0")}
        </span>
      )}
      <div className="flex-1">
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 400, color: "#fff", letterSpacing: "0.05em", marginBottom: "24px" }}>
          {title}
        </h2>
        <div className="w-12 h-px mb-8" style={{ background: "linear-gradient(90deg, #DAA520, transparent)" }} />
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", lineHeight: 2.2, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }} className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Digital Transparency
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Global Digital Tracking & Cookie Disclosure
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "32px" }}>
            George Yachts Brokerage House LLC
          </p>
          <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(218,165,32,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section number={1} title="I. JURISDICTIONAL FRAMEWORK & CORPORATE MANDATE">
          <p>
            GEORGE YACHTS BROKERAGE HOUSE LLC, a Wyoming Limited Liability
            Company (the "Company"), operates a premier digital brokerage
            platform designed for High-Net-Worth Individuals (HNWIs). In
            alignment with global privacy imperatives, including the General
            Data Protection Regulation (GDPR), the California Consumer Privacy
            Act (CCPA/CPRA), and the statutory requirements of the State of
            Wyoming, this disclosure articulates our methodologies regarding
            digital identifiers and tracking telemetry.
          </p>
        </Section>

        <Section number={2} title="II. TECHNICAL TAXONOMY OF TRACKING TECHNOLOGIES">
          <p>
            The Company utilizes an integrated stack of Tracking Technologies to
            maintain operational excellence:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
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

        <Section number={3} title="III. OPERATIONAL CLASSIFICATION">
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

        <Section number={4} title="IV. CONSENT ARCHITECTURE (THE COOKIEBOT PROTOCOL)">
          <p>
            The Company has deployed the Cookiebot Consent Management Platform
            (CMP), a gold-standard regulatory solution. This interface provides
            users with granular, real-time control over their data footprint.
            You hold the statutory right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
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

        <Section number={5} title="V. DATA TRANSFERS & SOVEREIGNTY">
          <p>
            As a Wyoming-domiciled entity, data captured via our platform is
            processed within the United States. We maintain rigorous data
            processing agreements (DPAs) with our third-party providers to
            ensure that all transfers meet or exceed international adequacy
            standards.
          </p>
        </Section>

        <Section number={6} title="VI. COMPLIANCE & GOVERNANCE CONTACT">
          <p>
            For inquiries regarding our privacy posture or the exercise of your
            data subject rights (DSRs), please direct all formal correspondence
            to:
          </p>
          <div className="mt-6 text-white space-y-2" style={{ background: "rgba(218,165,32,0.03)", border: "1px solid rgba(218,165,32,0.15)", padding: "32px" }}>
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
              <ObfuscatedEmail className="hover:text-[#DAA520] transition-colors" />
            </div>
            <div>
              <strong>Attention:</strong> Data Protection Officer (DPO)
            </div>
          </div>
        </Section>

        <div className="mt-32 pt-16 text-center" style={{ borderTop: "1px solid rgba(218,165,32,0.1)" }}>
          <div className="w-8 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            Last Updated: February 2026
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
