import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Service | George Yachts",
  description:
    "Global Terms of Service & Brokerage Agreement for George Yachts Brokerage House LLC.",
  alternates: {
    canonical: "https://georgeyachts.com/terms-of-service",
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

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-20 px-6 md:px-12 border-b border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[#DAA520] text-xs font-bold tracking-[0.4em] uppercase mb-6">
            Legal Agreement
          </p>
          <h1 className="text-4xl md:text-6xl font-marcellus text-white mb-4 tracking-tight uppercase leading-tight">
            Global Terms of Service & Brokerage Agreement
          </h1>
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase mb-8">
            George Yachts Brokerage House LLC
          </p>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#DAA520] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section title="I. CORPORATE MANDATE & OPERATIONAL SCOPE">
          <p>
            By accessing the digital infrastructure and utilizing the
            professional services of GEORGE YACHTS BROKERAGE HOUSE LLC (the
            “Company,” “we,” or “our”), a limited liability entity registered in
            Wyoming, USA, you enter into a binding agreement governed by these
            Global Terms of Service. The Company operates exclusively as a
            premier yacht charter brokerage, acting as a strategic intermediary
            between discerning charterers and vessel ownership or management
            entities.
          </p>
        </Section>

        <Section title="II. LIMITATION OF BROKERAGE LIABILITY">
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

        <Section title="III. CHARTER AGREEMENTS & MYBA FRAMEWORK">
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

        <Section title="IV. FINANCIAL PROVISIONS: APA & VAT">
          <p>
            Charter pricing listed on the platform generally reflects the base
            charter fee. Clients and their representatives acknowledge that
            total fiscal obligations will invariably include the Advance
            Provisioning Allowance (APA)—typically ranging from 25% to 40% of
            the base charter fee to cover fuel, provisions, and operational
            logistics—as well as applicable Value Added Tax (VAT) dictated by
            the jurisdiction of the vessel’s embarkation and cruising itinerary.
          </p>
        </Section>

        <Section title="V. INTELLECTUAL PROPERTY & DIGITAL ASSETS">
          <p>
            The architectural design, proprietary branding, compiled market
            data, and aggregated digital content on georgeyachts.com are the
            exclusive intellectual property of the Company. Unauthorized
            scraping, reproduction, or commercial distribution of our fleet data
            and aesthetic assets is strictly prohibited and will be aggressively
            pursued under applicable corporate law.
          </p>
        </Section>

        <Section title="VI. JURISDICTIONAL GOVERNANCE & DISPUTE RESOLUTION">
          <p>
            These Terms shall be governed by, and construed strictly in
            accordance with, the corporate and commercial laws of the State of
            Wyoming, USA. Any legal action, fiduciary dispute, or proceeding
            arising from the use of our digital services or brokerage operations
            shall be instituted exclusively in the competent courts of Sheridan,
            Wyoming.
          </p>
        </Section>

        <Section title="VII. CORPORATE CONTACT & LEGAL CORRESPONDENCE">
          <p>
            For formal inquiries regarding our brokerage operations or these
            Terms, please contact our administrative office:
          </p>
          <div className="mt-6 text-white space-y-2 bg-white/5 border border-white/10 p-6">
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

export default TermsOfService;
