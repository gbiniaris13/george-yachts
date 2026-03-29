import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | George Yachts",
  description:
    "Master Privacy & Data Protection Policy for George Yachts Brokerage House LLC.",
  alternates: {
    canonical: "https://georgeyachts.com/privacy-policy",
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

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Data Protection
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Master Privacy & Data Protection Policy
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
        <Section number={1} title="I. EXECUTIVE PRIVACY STATEMENT & FIDUCIARY DUTY">
          <p>
            GEORGE YACHTS BROKERAGE HOUSE LLC (the "Company") operates at the
            highest echelon of the international maritime brokerage industry. We
            strictly recognize that our discerning global clientele requires
            absolute discretion and unparalleled digital security. This Master
            Policy delineates our rigorous, institutional-grade protocols for
            the collection, cryptographic encryption, and professional
            processing of personally identifiable information (PII) and
            sensitive financial documentation.
          </p>
        </Section>

        <Section number={2} title="II. GLOBAL REGULATORY COMPLIANCE">
          <p>
            As a Wyoming-domiciled limited liability company facilitating
            bespoke charter operations across the Mediterranean and
            internationally, our data infrastructure is engineered to comply
            with the most stringent global privacy frameworks. This encompasses:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>
              <strong className="text-white">
                The General Data Protection Regulation (GDPR)
              </strong>{" "}
              for our European clientele.
            </li>
            <li>
              <strong className="text-white">
                The California Consumer Privacy Act (CCPA/CPRA)
              </strong>{" "}
              for our US-based network.
            </li>
            <li>
              <strong className="text-white">The Statutory Mandates</strong> of
              the State of Wyoming, USA.
            </li>
          </ul>
        </Section>

        <Section number={3} title="III. TAXONOMY OF PROCESSED DATA">
          <p>
            To deliver a seamless, high-end advisory service, we classify and
            process data under strict confidentiality protocols:
          </p>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Inquiry & CRM Coordinates
              </h3>
              <p>
                Contact details, preferred cruising itineraries (e.g., Ionian,
                Cyclades, Saronic), and vessel preferences voluntarily submitted
                via our encrypted digital portals.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Highly Confidential Client Data (KYC/AML)
              </h3>
              <p>
                During the advanced stages of formal charter execution,
                international maritime law and financial regulatory bodies
                mandate the collection of precise documentation. This includes
                passport copies, official identification, and financial
                coordinates strictly for Know Your Customer (KYC) and Anti-Money
                Laundering (AML) compliance.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                Digital Telemetry
              </h3>
              <p>
                Aggregated diagnostic data (IP addresses, session behavior)
                utilized solely to optimize the user experience and
                architectural performance of our platform.
              </p>
            </div>
          </div>
        </Section>

        <Section number={4} title="IV. STRATEGIC THIRD-PARTY ARCHITECTURE">
          <p>
            We integrate elite, enterprise-grade systems to manage our
            proprietary advisory database and bespoke marketing initiatives.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>
              <strong className="text-white">Analytics & Engagement:</strong> We
              utilize Google Analytics and Google Ads to ensure our digital
              presence precisely meets the expectations of our market,
              delivering relevant opportunities across the digital landscape.
            </li>
            <li>
              <strong className="text-white">CRM & Lead Intelligence:</strong>{" "}
              We deploy professional-grade solutions, including HubSpot and
              Apollo.io, to securely manage client relationships and verify
              global network accuracy.
            </li>
          </ul>
          <div className="mt-4 p-4 border border-[#DAA520]/20 bg-[#DAA520]/5">
            <p>
              <strong className="text-[#DAA520]">
                Non-Monetization Guarantee:
              </strong>{" "}
              These third-party environments are bound by rigorous Data
              Processing Agreements (DPAs). We explicitly declare that the
              Company does not, and will never, monetize, lease, or broker your
              personal or financial data to unauthorized external entities.
            </p>
          </div>
        </Section>

        <Section number={5} title="V. CRYPTOGRAPHIC SECURITY & DATA RETENTION">
          <p>
            Client data is fortified utilizing industry-standard cryptographic
            protocols and secure server environments. Highly Confidential Client
            Data (such as KYC documentation) is retained strictly for the
            duration necessitated by international maritime law, tax compliance,
            and financial auditing standards, after which it is systematically
            and securely expunged from our active infrastructure.
          </p>
        </Section>

        <Section number={6} title="VI. DATA SUBJECT RIGHTS (DSRs) & SOVEREIGNTY">
          <p>
            In accordance with overarching international laws, our clients
            retain ultimate sovereignty over their digital footprint. You
            possess the statutory right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>
              <strong className="text-white">
                Request a comprehensive audit
              </strong>{" "}
              of your data currently held by the Company.
            </li>
            <li>
              <strong className="text-white">
                Demand the rectification or immediate erasure
              </strong>{" "}
              ("Right to be Forgotten") of your records, subject to overriding
              legal retention mandates.
            </li>
            <li>
              <strong className="text-white">Opt-out</strong> of any strategic
              marketing communications or digital tracking.
            </li>
          </ul>
        </Section>

        <Section number={7} title="VII. CORPORATE COMPLIANCE CONTACT">
          <p>
            For the execution of Data Subject Rights, formal inquiries
            concerning our privacy posture, or to update your records, please
            direct correspondence to our Compliance Office:
          </p>
          <div className="mt-6 text-white space-y-2" style={{ background: "rgba(218,165,32,0.03)", border: "1px solid rgba(218,165,32,0.15)", padding: "32px" }}>
            <div>
              <strong>Legal Entity:</strong> GEORGE YACHTS BROKERAGE HOUSE LLC
            </div>
            <div>
              <strong>Registered Office Address:</strong> 30 N Gould St, STE R,
              Sheridan, WY 82801, USA
            </div>
            <div>
              <strong>Operational Scope:</strong> Mediterranean Operations
            </div>
            <div>
              <strong>Primary Contact:</strong>{" "}
              <a
                href="mailto:george@georgeyachts.com"
                className="hover:text-[#DAA520] transition-colors"
              >
                george@georgeyachts.com
              </a>
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

export default PrivacyPolicy;
