import Footer from "@/components/Footer";
import ObfuscatedEmail from "@/app/components/ObfuscatedEmail";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for George Yachts Brokerage House LLC - website usage, charter brokerage engagement, and third-party platform integrations.",
  alternates: {
    canonical: "https://georgeyachts.com/terms",
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
      <PageBreadcrumb path="/terms" />
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Legal Agreement
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "32px" }}>
            George Yachts Brokerage House LLC
          </p>
          <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(218,165,32,0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section number={1} title="I. ACCEPTANCE OF TERMS">
          <p>
            By accessing or using the website georgeyachts.com (the "Site") or
            engaging with any service offered by GEORGE YACHTS BROKERAGE HOUSE
            LLC (the "Company", "we", "us"), you agree to be bound by these
            Terms of Service (the "Terms") and our Privacy Policy. If you do
            not accept these Terms in full, please discontinue use of the Site.
          </p>
        </Section>

        <Section number={2} title="II. CHARTER BROKERAGE SERVICES">
          <p>
            The Company operates as a yacht charter brokerage based in Athens,
            Greece, pursuant to the Mediterranean Yacht Brokers Association
            (MYBA) framework. Every charter facilitated through the Company is
            governed by a separate MYBA Charter Agreement executed between the
            client and the yacht owner or central agent. These Terms govern
            your use of the Site and ancillary digital interactions only; they
            do not constitute a charter agreement.
          </p>
          <p>
            All fleet details, pricing indications, and availability shown on
            the Site are informational. Binding commercial terms apply only
            once a MYBA Charter Agreement is countersigned.
          </p>
        </Section>

        <Section number={3} title="III. INTELLECTUAL PROPERTY">
          <p>
            All content on the Site - including photography, video, written
            editorial, yacht descriptions, itineraries, branding, and
            underlying code - is the property of the Company or used under
            license, and is protected by international copyright and
            trademark law. Reproduction, distribution, or commercial reuse
            without prior written consent is prohibited.
          </p>
        </Section>

        <Section number={4} title="IV. PERMITTED USE">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>Use the Site for any unlawful or fraudulent purpose;</li>
            <li>
              Attempt to reverse-engineer, scrape at volume, or otherwise
              interfere with the Site's operation or security;
            </li>
            <li>
              Submit enquiries with fraudulent intent or impersonate another
              individual, company, or legal entity;
            </li>
            <li>
              Submit content that is defamatory, infringing, or violates the
              privacy of any individual.
            </li>
          </ul>
        </Section>

        <Section number={5} title="V. THIRD-PARTY PLATFORM INTEGRATIONS">
          <p>
            The Company publishes original yacht-related content to its own
            verified social media profiles on Instagram (@georgeyachts) and
            TikTok (@george.yachts) through authorised content-posting APIs.
            Each post is subject to an internal editorial review before
            publication. No third-party data is collected through these
            integrations, and no content is posted on behalf of any party
            other than the Company itself.
          </p>
          <p>
            Use of those third-party platforms is additionally governed by the
            respective platforms' terms of service. The Company accepts no
            liability for content available through those platforms beyond
            the posts it controls directly.
          </p>
        </Section>

        <Section number={6} title="VI. DISCLAIMER OF WARRANTIES">
          <p>
            The Site is provided on an "as is" and "as available" basis. The
            Company makes reasonable efforts to ensure accuracy but does not
            warrant that the Site will be uninterrupted, error-free, or that
            all information is current at every moment. Fleet availability,
            pricing, and regulatory conditions (including Greek coastal
            licensing and TPP/VAT treatment) change frequently and are
            confirmed in writing as part of the charter engagement.
          </p>
        </Section>

        <Section number={7} title="VII. LIMITATION OF LIABILITY">
          <p>
            To the maximum extent permitted by applicable law, the Company's
            aggregate liability to any user arising out of or relating to
            the use of the Site shall not exceed the total fees paid by the
            user to the Company in the twelve (12) months preceding the
            event giving rise to the claim, or five hundred euro (€500),
            whichever is greater. This limitation shall not apply in cases
            of gross negligence, wilful misconduct, death, personal injury,
            fraud, or where excluded by mandatory applicable law. In no
            event shall the Company be liable for any indirect, incidental,
            or consequential damages, including lost profits or loss of
            opportunity, to the extent such exclusion is permitted by law.
          </p>
        </Section>

        <Section number={8} title="VIII. GOVERNING LAW AND JURISDICTION">
          <p>
            These Terms are governed by the laws of the Hellenic Republic
            (Greece) for matters concerning charter brokerage activity
            conducted in Greek waters, and by the laws of the State of
            Wyoming, United States, for matters concerning the internal
            affairs of the corporate entity. Any dispute arising from or
            related to these Terms shall be resolved exclusively before
            the competent courts of Athens, Greece. Nothing in this clause
            shall deprive consumers of the protection afforded by the
            mandatory provisions of the law of their habitual residence.
          </p>
        </Section>

        <Section number={9} title="IX. CHANGES">
          <p>
            The Company may revise these Terms from time to time. The
            updated Terms will be effective as of the date posted on the
            Site. Continued use of the Site after any revision constitutes
            acceptance of the updated Terms.
          </p>
        </Section>

        <Section number={10} title="X. CONTACT">
          <p>
            Questions regarding these Terms should be directed to:
          </p>
          <p>
            <strong className="text-white">George Yachts Brokerage House LLC</strong>
            <br />
            Athens, Greece
            <br />
            <ObfuscatedEmail user="legal" domain="georgeyachts.com" />
          </p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "32px" }}>
            Last updated: 22 April 2026 (v2 - legal review)
          </p>
        </Section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
