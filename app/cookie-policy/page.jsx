import Footer from "../components/Footer";

export const metadata = {
  title: "Cookie Policy | George Yachts",
  description:
    "Cookie & Digital Tracking Policy for George Yachts Brokerage House LLC.",
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
          <h1 className="text-5xl md:text-7xl font-marcellus text-white mb-4 tracking-tight">
            Cookie & Digital Tracking Policy
          </h1>
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase mb-8">
            George Yachts Brokerage House LLC
          </p>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            We utilize advanced digital technologies to ensure your experience
            on George Yachts is secure, personalized, and compliant with the
            highest standards of data integrity.
          </p>
        </div>

        {/* Luxury Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#DAA520] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section title="1. Executive Statement on Privacy & Transparency">
          <p>
            GEORGE YACHTS BROKERAGE HOUSE LLC (referred to as "the Company,"
            "we," "us," or "our"), a limited liability company registered in
            Wyoming, USA, is committed to the highest standards of data
            integrity and digital transparency. This Policy provides a granular
            disclosure of how we utilize cookies, web beacons, pixel tags, and
            similar tracking technologies ("Tracking Technologies") to provide a
            bespoke digital experience for our global clientele.
          </p>
        </Section>

        <Section title="2. Definitions & Scope of Technology">
          <p>
            "Cookies" are sophisticated data files placed on your device that
            enable our systems to recognize your browser and capture specific
            information. To ensure a secure and personalized environment, we
            utilize:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
            <li>
              <strong className="text-white">First-Party Cookies:</strong>{" "}
              Managed directly by our domain to ensure core functionality.
            </li>
            <li>
              <strong className="text-white">Third-Party Cookies:</strong>{" "}
              Managed by industry-leading partners (e.g., HubSpot, Google) for
              advanced analytics and client relationship management.
            </li>
            <li>
              <strong className="text-white">
                Persistent vs. Session Cookies:
              </strong>{" "}
              We utilize session-based tracking (expiring upon browser closure)
              and persistent tracking (stored to recognize returning HNWIs and
              their preferences).
            </li>
          </ul>
        </Section>

        <Section title="3. Detailed Categorization of Tracking Technologies">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                A. Essential & Strictly Necessary (Non-Consensual)
              </h3>
              <p>
                These are technically mandatory for the structural integrity of
                the website. They facilitate secure encrypted connections (SSL),
                load balancing, and high-fidelity media rendering.
              </p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
                Legal Basis: Necessary for the performance of the service.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                B. Analytical & Performance Optimization
              </h3>
              <p>
                We employ advanced diagnostic tools, including Google Analytics,
                to monitor platform health and user interaction patterns. This
                data is processed to optimize the presentation of our fleet and
                ensure our digital infrastructure meets the expectations of a
                discerning audience.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                C. Functional & Personalization Preferences
              </h3>
              <p>
                These technologies remember your specific interactions, such as
                preferred yacht categories, regional interests (Ionian,
                Cyclades, Saronic), and communication preferences, ensuring a
                seamless transition between visits.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold tracking-wider mb-2">
                D. Strategic Marketing & CRM Integration
              </h3>
              <p>
                In alignment with our bespoke service model, we utilize
                professional-grade systems:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
                <li>
                  <strong className="text-white">
                    CRM Tracking (HubSpot):
                  </strong>{" "}
                  To synchronize your digital journey with our advisory
                  services, ensuring that your inquiries are managed with
                  absolute precision.
                </li>
                <li>
                  <strong className="text-white">
                    Lead Intelligence (Apollo.io):
                  </strong>{" "}
                  To verify professional data and maintain the accuracy of our
                  global network.
                </li>
                <li>
                  <strong className="text-white">
                    Targeted Outreach (Google Ads):
                  </strong>{" "}
                  To deliver relevant opportunities to our users across the
                  digital ecosystem based on demonstrated interest in our
                  brokerage services.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <Section title="4. International Data Transfers & Regulatory Compliance">
          <p>
            As a Wyoming-based entity, data collected via cookies may be
            transferred to, and processed in, the United States and other
            jurisdictions. We implement rigorous safeguards to ensure that such
            transfers comply with:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
            <li>
              <strong className="text-white">
                GDPR (General Data Protection Regulation):
              </strong>{" "}
              For our European clientele.
            </li>
            <li>
              <strong className="text-white">
                CCPA/CPRA (California Consumer Privacy Act):
              </strong>{" "}
              For our US-based clients.
            </li>
            <li>
              <strong className="text-white">
                Wyoming Statutory Requirements:
              </strong>{" "}
              Ensuring full compliance with our primary jurisdiction.
            </li>
          </ul>
        </Section>

        <Section title='5. Consent Management & The "Cookiebot" Protocol'>
          <p>
            The Company utilizes the Cookiebot consent management platform (CMP)
            to provide you with granular control over your privacy. Upon your
            first engagement with our platform, you are granted the statutory
            right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-white/50">
            <li>
              <strong className="text-white">Grant Affirmative Consent</strong>{" "}
              to all categories.
            </li>
            <li>
              <strong className="text-white">Selectively Opt-In</strong> to
              specific technologies.
            </li>
            <li>
              <strong className="text-white">
                Exercise the Right to Decline
              </strong>{" "}
              non-essential tracking.
            </li>
          </ul>
        </Section>

        <Section title="6. Modification of Browser Settings">
          <p>
            Independent of our internal controls, users may configure their
            browser environments (Chrome, Safari, Edge, etc.) to block or delete
            cookies. Note that disabling tracking may degrade the functionality
            of certain high-end features of the George Yachts digital platform.
          </p>
        </Section>

        <Section title="7. Legal Contact & Governance">
          <p>
            For formal inquiries regarding our digital tracking protocols or to
            exercise your rights under global data protection laws, please
            contact our Legal Compliance Department:
          </p>
          <div className="mt-6 text-white space-y-2">
            <div>
              <strong>Legal Entity:</strong> GEORGE YACHTS BROKERAGE HOUSE LLC
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
            <div>
              <strong>Attention:</strong> Data Protection Officer (DPO)
            </div>
            <div>
              <strong>Registered Office:</strong> 30 N Gould St, STE R,
              Sheridan, WY 82801, USA
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

export default CookiePolicy;
