import Footer from "@/components/Footer";
import ObfuscatedEmail from "@/app/components/ObfuscatedEmail";

export const metadata = {
  title: "Privacy Policy | George Yachts",
  description:
    "Privacy Policy for George Yachts Brokerage House LLC — data handling, GDPR / CCPA compliance, and third-party platform integrations.",
  alternates: {
    canonical: "https://georgeyachts.com/privacy",
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
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Data Protection
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "32px" }}>
            George Yachts Brokerage House LLC
          </p>
          <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(218,165,32,0.04) 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section number={1} title="I. WHO WE ARE">
          <p>
            GEORGE YACHTS BROKERAGE HOUSE LLC (the "Company", "we", "us") is
            a Wyoming Limited Liability Company operating a yacht charter
            brokerage out of Athens, Greece. This Privacy Policy explains
            what personal data we collect when you interact with
            georgeyachts.com or engage with our services, how we use it,
            and your rights.
          </p>
          <p>
            We are committed to handling your data in compliance with the
            General Data Protection Regulation (GDPR), Greek Law
            4624/2019, and other applicable data protection laws of the
            user's jurisdiction.
          </p>
        </Section>

        <Section number={2} title="II. WHAT WE COLLECT">
          <p>
            <strong className="text-white">Information you give us.</strong>{" "}
            When you submit an enquiry, subscribe to our newsletter, book a
            consultation, or correspond with our team, we collect the
            information you choose to provide — typically name, email,
            phone number, country, charter preferences, and any context you
            include in your message.
          </p>
          <p>
            <strong className="text-white">Information collected automatically.</strong>{" "}
            Like most websites, we log IP address, browser type, device
            identifiers, pages viewed, referrer URL, and timestamp. Details
            on cookies and tracking technologies are in our separate{" "}
            <a href="/cookie-policy" style={{ color: "#DAA520" }}>Cookie Policy</a>.
          </p>
          <p>
            <strong className="text-white">Information we do not collect.</strong>{" "}
            We do not collect or store payment card data on our servers. All
            charter payments are handled through bonded escrow under the
            MYBA Charter Agreement.
          </p>
        </Section>

        <Section number={3} title="III. HOW WE USE YOUR DATA">
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>To respond to your charter enquiry or consultation request;</li>
            <li>
              To prepare tailored yacht proposals and itineraries on your
              behalf;
            </li>
            <li>To send you our newsletter or editorial updates (only if you opted in);</li>
            <li>To improve the performance, safety, and content of the Site;</li>
            <li>
              To comply with legal obligations (tax, anti-money-laundering,
              yacht registration authorities, maritime regulators).
            </li>
          </ul>
        </Section>

        <Section number={4} title="IV. THIRD-PARTY PLATFORM INTEGRATIONS">
          <p>
            The Company publishes original yacht-related content to its own
            verified social media accounts on Instagram (@georgeyachts) and
            TikTok (@george.yachts) through authorised content-posting
            APIs. These integrations are strictly outbound: we publish our
            own content to our own accounts after manual editorial review.
          </p>
          <p>
            We do <em>not</em> collect, store, or process any data belonging
            to end users of those platforms through this integration. No
            third-party social accounts are accessed. OAuth tokens
            authorising the Company's own account are stored encrypted at
            rest and used solely for the purpose of publishing the
            Company's content.
          </p>
        </Section>

        <Section number={5} title="V. LEGAL BASIS (GDPR ART. 6)">
          <p>We process personal data on the following bases:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>
              <strong className="text-white">Contract.</strong> Where
              processing is necessary to prepare or execute a charter
              agreement you have requested.
            </li>
            <li>
              <strong className="text-white">Consent.</strong> For marketing
              communications and non-essential cookies — withdrawable at
              any time.
            </li>
            <li>
              <strong className="text-white">Legitimate interest.</strong>{" "}
              For basic analytics, security, and fraud prevention; balanced
              against your rights and expectations.
            </li>
            <li>
              <strong className="text-white">Legal obligation.</strong>{" "}
              Where we must retain records under tax, maritime, or
              corporate law.
            </li>
          </ul>
        </Section>

        <Section number={6} title="VI. DATA SHARING">
          <p>
            We share personal data only with vetted processors acting on our
            instructions (CRM, email, hosting, analytics) under written
            data-processing agreements, and with yacht owners or central
            agents strictly to the extent required to prepare and execute a
            charter you have requested. We never sell personal data.
          </p>
          <p>
            In the unusual event of a legally binding request from a
            competent authority, we will respond with the minimum data
            required and will notify you unless legally prohibited from
            doing so.
          </p>
        </Section>

        <Section number={7} title="VII. INTERNATIONAL TRANSFERS">
          <p>
            Some of our processors are located outside the European
            Economic Area. Where that is the case, we rely on the European
            Commission's Standard Contractual Clauses (SCCs) or on
            adequacy decisions, and ensure an equivalent level of
            protection.
          </p>
        </Section>

        <Section number={8} title="VIII. RETENTION">
          <p>
            We retain personal data only as long as necessary for the
            purposes for which it was collected, or as required by
            applicable law. Charter enquiry records are typically retained
            for seven (7) years in accordance with Greek commercial and tax
            obligations; marketing consents until withdrawn.
          </p>
        </Section>

        <Section number={9} title="IX. YOUR RIGHTS">
          <p>Subject to applicable law, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
            <li>Access the personal data we hold about you;</li>
            <li>Request correction or deletion;</li>
            <li>Restrict or object to certain processing;</li>
            <li>Withdraw consent (without affecting the lawfulness of prior processing);</li>
            <li>Request portability of data you supplied to us;</li>
            <li>Lodge a complaint with the Greek Data Protection Authority (HDPA) or the supervisory authority of your habitual residence.</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@georgeyachts.com" style={{ color: "#DAA520" }}>
              privacy@georgeyachts.com
            </a>
            . We respond within thirty (30) days.
          </p>
        </Section>

        <Section number={10} title="X. SECURITY">
          <p>
            We maintain reasonable technical and organisational measures —
            HTTPS everywhere, encryption at rest for sensitive tokens,
            least-privilege access controls, audit logging, and regular
            review of our processors. No system is perfectly secure; if a
            breach occurs affecting your personal data, we will notify you
            and the competent authority within the timelines mandated by
            GDPR.
          </p>
        </Section>

        <Section number={11} title="XI. CHANGES TO THIS POLICY">
          <p>
            We may update this Privacy Policy as our practices evolve or
            as required by law. The updated version will take effect as of
            the date posted. Material changes will be highlighted on the
            Site.
          </p>
        </Section>

        <Section number={12} title="XII. CONTACT">
          <p>
            <strong className="text-white">George Yachts Brokerage House LLC</strong>
            <br />
            Athens, Greece
            <br />
            Data enquiries:{" "}
            <a href="mailto:privacy@georgeyachts.com" style={{ color: "#DAA520" }}>
              privacy@georgeyachts.com
            </a>
          </p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "32px" }}>
            Last updated: 22 April 2026 (v2 — legal review)
          </p>
        </Section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
