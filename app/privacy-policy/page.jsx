import Footer from "@/components/Footer";
import ObfuscatedEmail from "@/app/components/ObfuscatedEmail";
import { pageMeta } from "@/lib/pageMeta";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How George Yachts Brokerage House LLC collects, uses, and protects your personal data - GDPR, Greek law, UK GDPR, and CCPA rights.",
  path: "/privacy-policy",
});

const Section = ({ number, title, children }) => (
  <div className="mb-20 group" style={{ opacity: 1 }}>
    <div className="flex items-start gap-6">
      {number && (
        <span style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "48px", fontWeight: 300, lineHeight: 1, color: "rgba(201,168,76,0.15)" }}>
          {String(number).padStart(2, "0")}
        </span>
      )}
      <div className="flex-1">
        <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "1.5rem", fontWeight: 400, color: "#F8F5F0", letterSpacing: "0.05em", marginBottom: "24px" }}>
          {title}
        </h2>
        <div className="w-12 h-px mb-8" style={{ background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
        <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: "14px", lineHeight: 2.2, color: "rgba(248, 245, 240,0.55)", letterSpacing: "0.02em" }} className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBreadcrumb path="/privacy-policy" />
      {/* --- HERO SECTION --- */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#C9A84C", marginBottom: "24px", textTransform: "uppercase" }}>
            Data Protection
          </p>
          <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#F8F5F0", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(248, 245, 240,0.35)", textTransform: "uppercase", marginBottom: "32px" }}>
            George Yachts Brokerage House LLC
          </p>
          <div className="w-16 h-px mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section number={1} title="Who we are">
          <p>
            George Yachts Brokerage House LLC ("George Yachts", "we", "us") is
            the data controller for personal data collected through
            georgeyachts.com (the "Site"). We are a limited liability company
            registered in Wyoming, USA, operating from our office at Charilaou
            Trikoupi 190A, Kifisia 145 64, Athens, Greece.
          </p>
          <p>
            George Yachts is a luxury crewed yacht charter broker and
            intermediary. We arrange charters between clients and third-party
            yacht owners and central agents; we do not own or operate the
            yachts, and we do not take payments or process bookings on this
            Site. The Site generates inquiries only. Any charter is contracted
            separately, offline, under a MYBA-standard Charter Agreement.
          </p>
          <p>
            Because we operate from an establishment in Greece, our processing
            is governed by the EU General Data Protection Regulation (GDPR),
            Greek Law 4624/2019, and Greek Law 3471/2006 (ePrivacy). Visitors in
            the United Kingdom are additionally protected by the UK GDPR.
          </p>
        </Section>

        <Section number={2} title="The personal data we collect">
          <p>We deliberately collect minimal data:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li>
              <strong className="text-white">Inquiry form:</strong> your name,
              email, phone number, number of guests, indicative budget, and the
              content of your message.
            </li>
            <li>
              <strong className="text-white">Newsletter signup:</strong> your
              email address (and which journal you subscribed to).
            </li>
            <li>
              <strong className="text-white">Consultation booking (Calendly):</strong>{" "}
              name, email, and scheduling details.
            </li>
            <li>
              <strong className="text-white">Automatically:</strong> IP address,
              device/browser information, and usage data - for non-essential
              analytics, only with your consent (see our{" "}
              <a href="/cookie-policy" className="text-[#C9A84C] hover:underline">Cookie Policy</a>).
            </li>
          </ul>
          <p className="mt-4">
            We do not intentionally collect special categories of data (GDPR
            Art. 9). Please do not include health, political, or other sensitive
            information in free-text fields. Where a charter proceeds, any
            identity or compliance documentation is handled offline by the
            relevant central agent or owner under the charter agreement, not
            collected through this Site.
          </p>
        </Section>

        <Section number={3} title="Why we process your data, and our legal bases">
          <ul className="list-disc pl-5 space-y-3 mt-2" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li>
              <strong className="text-white">To respond to your inquiry</strong>{" "}
              and take steps at your request before a charter is arranged -
              GDPR Art. 6(1)(b) (pre-contractual steps).
            </li>
            <li>
              <strong className="text-white">To send our newsletter</strong> -
              Art. 6(1)(a) (consent); withdraw anytime via the unsubscribe link.
            </li>
            <li>
              <strong className="text-white">Analytics</strong> (Google
              Analytics 4, Microsoft Clarity) - Art. 6(1)(a) (consent), loaded
              only after you opt in.
            </li>
            <li>
              <strong className="text-white">Site security</strong> (Google
              reCAPTCHA, Cloudflare) and prompt internal lead notification to
              our broker (Telegram) - Art. 6(1)(f) (legitimate interests),
              limited to what is necessary and never used to profile you for
              advertising.
            </li>
            <li>
              <strong className="text-white">Legal, tax, and anti-money-laundering compliance</strong>{" "}
              - Art. 6(1)(c); and to establish or defend legal claims -
              Art. 6(1)(f).
            </li>
          </ul>
          <p className="mt-4">
            We do not carry out automated decision-making or profiling that
            produces legal effects.
          </p>
        </Section>

        <Section number={4} title="Service providers and international transfers">
          <p>
            We share data only with vetted providers acting on our instructions
            under GDPR Art. 28 terms. Some are in, or transfer data to, the
            United States; those transfers rely on the EU-US Data Privacy
            Framework where the provider is certified, or on the European
            Commission's Standard Contractual Clauses otherwise.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li><strong className="text-white">Vercel</strong> - website hosting</li>
            <li><strong className="text-white">Sanity</strong> - content management</li>
            <li><strong className="text-white">Resend</strong> - transactional and newsletter email delivery</li>
            <li><strong className="text-white">Google Analytics 4</strong> - website analytics (consent-gated)</li>
            <li><strong className="text-white">Microsoft Clarity</strong> - heatmaps and session analytics (consent-gated)</li>
            <li><strong className="text-white">Google reCAPTCHA</strong> - spam and bot protection</li>
            <li><strong className="text-white">Calendly</strong> - consultation scheduling</li>
            <li><strong className="text-white">Cloudflare</strong> - network and security</li>
            <li><strong className="text-white">Telegram / WhatsApp</strong> - internal notification and client communication you initiate</li>
          </ul>
          <div className="mt-4 p-4 border border-[#C9A84C]/20 bg-[#C9A84C]/5">
            <p>
              <strong className="text-[#C9A84C]">We do not sell your data.</strong>{" "}
              We do not, and will never, sell, rent, or trade your personal data,
              and we do not share it for cross-context behavioral advertising.
            </p>
          </div>
        </Section>

        <Section number={5} title="How long we keep your data">
          <ul className="list-disc pl-5 space-y-2 mt-2" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li>Inquiries where no charter proceeds: up to <strong className="text-white">24 months</strong> from last contact.</li>
            <li>Where a charter is arranged: for the duration of the relationship plus the period required to meet tax and legal obligations.</li>
            <li>Newsletter email: until you unsubscribe; inactive subscribers are pruned after 24 months.</li>
            <li>Analytics (GA4): 14 months. Microsoft Clarity recordings: 30 days.</li>
            <li>Server and security logs: up to 12 months.</li>
          </ul>
        </Section>

        <Section number={6} title="Your rights">
          <p>
            Under the GDPR (Arts. 15-22) you have the right to access,
            rectification, erasure ("right to be forgotten"), restriction, data
            portability, and to object to processing based on legitimate
            interests. Where processing is based on consent, you may withdraw it
            at any time without affecting prior processing.
          </p>
          <p className="mt-4">
            To request erasure you may use our dedicated page at{" "}
            <a href="/privacy/delete" className="text-[#C9A84C] hover:underline">georgeyachts.com/privacy/delete</a>{" "}
            or email{" "}
            <ObfuscatedEmail className="text-[#C9A84C] hover:underline" />. We
            respond within one month.
          </p>
          <p className="mt-4">
            <strong className="text-white">California residents:</strong> while
            we believe we fall below the CCPA's thresholds, we honor your rights
            to know, delete, and correct your information, and to opt out of any
            sale or sharing. As stated above, we do not sell or share your
            personal information, and we do not discriminate against you for
            exercising these rights.
          </p>
        </Section>

        <Section number={7} title="Cookies">
          <p>
            We use cookies and similar technologies as described in our{" "}
            <a href="/cookie-policy" className="text-[#C9A84C] hover:underline">Cookie Policy</a>.
            Non-essential cookies (analytics, session analysis) are set only
            after you give consent via our cookie banner, which you can change
            at any time.
          </p>
        </Section>

        <Section number={8} title="Children">
          <p>
            The Site and our services are not directed to children, and we do
            not knowingly collect data from anyone under 16. If you believe a
            child has provided data, contact us and we will delete it.
          </p>
        </Section>

        <Section number={9} title="Security">
          <p>
            We apply appropriate technical and organizational measures to the
            risk, including TLS/HTTPS encryption in transit, access controls,
            data minimization, and data-processing terms with our providers. No
            method of transmission is perfectly secure, but we work to protect
            your data and review our measures regularly.
          </p>
        </Section>

        <Section number={10} title="Complaints and contact">
          <p>
            For any privacy question or to exercise a right, contact us at{" "}
            <ObfuscatedEmail className="text-[#C9A84C] hover:underline" /> or
            +30 697 038 0999.
          </p>
          <p className="mt-4">
            You have the right (GDPR Art. 77) to lodge a complaint with a
            supervisory authority, in particular the{" "}
            <strong className="text-white">Hellenic Data Protection Authority</strong>{" "}
            (1-3 Kifissias Avenue, 115 23 Athens; +30 210 6475600;
            contact@dpa.gr; www.dpa.gr/en). UK residents may alternatively
            complain to the UK Information Commissioner's Office (ico.org.uk).
          </p>
          <div className="mt-6 text-white space-y-2" style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.15)", padding: "32px" }}>
            <div><strong>Data controller:</strong> George Yachts Brokerage House LLC</div>
            <div><strong>Registered:</strong> Wyoming, USA</div>
            <div><strong>Operating office:</strong> Charilaou Trikoupi 190A, Kifisia 145 64, Athens, Greece</div>
            <div>
              <strong>Contact:</strong>{" "}
              <ObfuscatedEmail className="hover:text-[#C9A84C] transition-colors" />
            </div>
          </div>
        </Section>

        <Section number={11} title="Changes to this Policy">
          <p>
            We may update this Policy. The "Last updated" date below will change
            and material changes will be highlighted on the Site.
          </p>
        </Section>

        <div className="mt-32 pt-16 text-center" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="w-8 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(248, 245, 240,0.2)", textTransform: "uppercase" }}>
            Last Updated: June 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
