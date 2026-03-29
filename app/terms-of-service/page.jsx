import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | George Yachts",
  description:
    "Global Terms of Service & Brokerage Agreement for George Yachts Brokerage House LLC.",
  alternates: {
    canonical: "https://georgeyachts.com/terms-of-service",
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

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Legal Agreement
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Global Terms of Service & Brokerage Agreement
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
        <Section number={1} title="I. CORPORATE MANDATE & OPERATIONAL SCOPE">
          <p>
            By accessing the digital infrastructure and utilizing the
            professional services of GEORGE YACHTS BROKERAGE HOUSE LLC (the
            "Company," "we," or "our"), a limited liability entity registered in
            Wyoming, USA, you enter into a binding agreement governed by these
            Global Terms of Service. The Company operates exclusively as a
            premier yacht charter brokerage, acting as a strategic intermediary
            between discerning charterers and vessel ownership or management
            entities.
          </p>
        </Section>

        <Section number={2} title="II. LIMITATION OF BROKERAGE LIABILITY">
          <p>
            The Company does not own, physically manage, or operate the vessels
            showcased on our digital platform. All vessel specifications,
            high-resolution imagery, itineraries, and pricing structures are
            provided in good faith for informational and guidance purposes only.
            The Company disclaims all absolute warranties regarding the exact
            technical condition or real-time availability of the vessels. Final
            specifications must be strictly verified prior to the execution of a
            formal Charter Agreement.
          </p>
        </Section>

        <Section number={3} title="III. CHARTER AGREEMENTS & MYBA FRAMEWORK">
          <p>
            All luxury charters facilitated by the Company are subject to
            formal, legally binding contracts. We predominantly utilize
            industry-standard MYBA (Worldwide Yachting Association) frameworks
            or equivalent prevailing legal documentation. The digital inquiry
            and consultation process does not constitute a finalized charter
            agreement until all contractual addendums are signed by the
            respective parties and the initial financial disbursements have
            cleared.
          </p>
        </Section>

        <Section number={4} title="IV. FINANCIAL PROVISIONS: APA & VAT">
          <p>
            Charter pricing listed on the platform generally reflects the base
            charter fee. Clients and their representatives acknowledge that
            total fiscal obligations will invariably include the Advance
            Provisioning Allowance (APA)—typically ranging from 25% to 40% of
            the base charter fee to cover fuel, provisions, and operational
            logistics—as well as applicable Value Added Tax (VAT) dictated by
            the jurisdiction of the vessel's embarkation and cruising itinerary.
          </p>
        </Section>

        <Section number={5} title="V. INTELLECTUAL PROPERTY & DIGITAL ASSETS">
          <p>
            The architectural design, proprietary branding, compiled market
            data, and aggregated digital content on georgeyachts.com are the
            exclusive intellectual property of the Company. Unauthorized
            scraping, reproduction, or commercial distribution of our fleet data
            and aesthetic assets is strictly prohibited and will be aggressively
            pursued under applicable corporate law.
          </p>
        </Section>

        <Section number={6} title="VI. JURISDICTIONAL GOVERNANCE & DISPUTE RESOLUTION">
          <p>
            These Terms shall be governed by, and construed strictly in
            accordance with, the corporate and commercial laws of the State of
            Wyoming, USA. Any legal action, fiduciary dispute, or proceeding
            arising from the use of our digital services or brokerage operations
            shall be instituted exclusively in the competent courts of Sheridan,
            Wyoming.
          </p>
        </Section>

        <Section number={7} title="VII. CORPORATE CONTACT & LEGAL CORRESPONDENCE">
          <p>
            For formal inquiries regarding our brokerage operations or these
            Terms, please contact our administrative office:
          </p>
          <div className="mt-6 text-white space-y-2" style={{ background: "rgba(218,165,32,0.03)", border: "1px solid rgba(218,165,32,0.15)", padding: "32px" }}>
            <div>
              <strong>Legal Entity:</strong> GEORGE YACHTS BROKERAGE HOUSE LLC
            </div>
            <div>
              <strong>Registered Office:</strong> 30 N Gould St, STE R,
              Sheridan, WY 82801, USA
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

export default TermsOfService;
