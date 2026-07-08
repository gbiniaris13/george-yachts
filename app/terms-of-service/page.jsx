import Footer from "@/components/Footer";
import ObfuscatedEmail from "@/app/components/ObfuscatedEmail";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "Terms of Service",
  description:
    "Terms governing use of georgeyachts.com - George Yachts acts as a yacht charter broker and intermediary; the Site is for inquiries only.",
  path: "/terms-of-service",
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
        <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: "14px", lineHeight: 2.2, color: "rgba(248,245,240,0.6)", letterSpacing: "0.02em" }} className="space-y-4">
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
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#C9A84C", marginBottom: "24px", textTransform: "uppercase" }}>
            Legal Agreement
          </p>
          <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#F8F5F0", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Terms of Service
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
        <Section number={1} title="About us and these Terms">
          <p>
            This website, georgeyachts.com (the "Site"), is operated by George
            Yachts Brokerage House LLC ("George Yachts", "we", "us"), a limited
            liability company registered in Wyoming, USA, operating from
            Charilaou Trikoupi 190A, Kifisia 145 64, Athens, Greece. These Terms
            govern your use of the Site. By using the Site you agree to them. If
            you do not agree, please do not use the Site.
          </p>
        </Section>

        <Section number={2} title="What George Yachts is - and is not">
          <p>
            George Yachts is a luxury crewed yacht charter broker and
            intermediary, and a member of the International Yacht Brokers
            Association (IYBA). We arrange charters by introducing clients to
            third-party yacht owners and central agents.
          </p>
          <p>
            We are <strong className="text-white">not</strong> the owner,
            operator, manager, master, or crew of any yacht; we are not a party
            to any charter contract between you and a yacht owner; and we are not
            the provider of the charter services themselves. We act solely as an
            intermediary that facilitates introductions and inquiries.
          </p>
        </Section>

        <Section number={3} title="No transactions on this Site - inquiries only">
          <p>
            No bookings, reservations, payments, or binding charter commitments
            are made through this Site. The Site lets you submit inquiries,
            subscribe to a newsletter, and request a consultation. Any charter is
            the subject of a separate written charter agreement (typically a
            MYBA-standard Charter Agreement) negotiated and signed offline, to
            which George Yachts is not a contracting party. Yacht details,
            availability, indicative pricing, and itineraries shown on the Site
            are supplied by third parties, are for general information only, may
            change without notice, and do not constitute an offer.
          </p>
        </Section>

        <Section number={4} title="Relationship to the charter agreement">
          <p>
            Where you proceed to charter a yacht, your rights and obligations
            regarding that charter are governed by the separate Charter Agreement
            and not by these Terms. The MYBA-standard Charter Agreement is
            typically governed by English law with arbitration in London. These
            Site Terms govern only your use of the Site and your dealings with us
            as your broker; for the charter itself, the Charter Agreement
            prevails.
          </p>
        </Section>

        <Section number={5} title="Disclaimers">
          <p>
            To the fullest extent permitted by applicable law, we give no
            warranty or representation as to: the availability, condition,
            seaworthiness, safety, specifications, pricing, or suitability of any
            third-party yacht; the accuracy or completeness of third-party
            content; or the performance of any yacht owner, operator, crew, or
            central agent. Availability and pricing are controlled by third
            parties and may change or be withdrawn at any time. Nothing here
            limits any liability that cannot lawfully be excluded.
          </p>
        </Section>

        <Section number={6} title="Limitation of liability">
          <p>As an intermediary, and to the fullest extent permitted by applicable law:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li>We are not liable for the acts, omissions, defaults, or insolvency of any yacht owner, operator, crew, central agent, or other third party.</li>
            <li>We are not liable for any loss arising from your charter, the condition or operation of any yacht, or any third-party services.</li>
            <li>We exclude liability for indirect or consequential loss to the extent the law allows.</li>
          </ul>
          <p className="mt-4">
            Nothing in these Terms excludes or limits liability for death or
            personal injury caused by negligence, for fraud, or for any liability
            that cannot be excluded under applicable mandatory law - including the
            mandatory consumer-protection rules referenced in Section 11.
          </p>
        </Section>

        <Section number={7} title="Acceptable use">
          <p>
            You agree not to: use the Site unlawfully; submit false, misleading,
            or another person's data without authority; introduce malware;
            scrape, harvest, or copy content other than for personal,
            non-commercial reference; attempt unauthorized access; or use the
            Site to infringe any third party's rights. We may suspend or restrict
            access for breach.
          </p>
        </Section>

        <Section number={8} title="Intellectual property">
          <p>
            All content on the Site - including the "George Yachts" name and
            branding, text, photographs, video, design, and layout - is owned by
            or licensed to George Yachts and protected by intellectual-property
            laws. You may not reproduce, distribute, or create derivative works
            without our prior written consent. Yacht imagery and brochures may
            belong to third parties and are used under licence.
          </p>
        </Section>

        <Section number={9} title="Privacy and cookies">
          <p>
            Our handling of personal data is described in our{" "}
            <a href="/privacy-policy" className="text-[#C9A84C] hover:underline">Privacy Policy</a>{" "}
            and{" "}
            <a href="/cookie-policy" className="text-[#C9A84C] hover:underline">Cookie Policy</a>,
            which form part of these Terms.
          </p>
        </Section>

        <Section number={10} title="Third-party links">
          <p>
            The Site may link to third-party sites and tools (for example,
            Calendly). We are not responsible for their content or practices.
          </p>
        </Section>

        <Section number={11} title="Governing law and dispute resolution">
          <p>
            These Terms, and any non-contractual obligations arising from them,
            are governed by the laws of Greece, and the courts of Athens, Greece
            have jurisdiction.
          </p>
          <p className="mt-4">
            <strong className="text-white">Consumer protection.</strong> If you
            are a consumer habitually resident in the EU or the UK, this
            governing-law choice does not deprive you of the protection of the
            mandatory provisions of the law of your country of residence that
            cannot be derogated from by agreement, and you may bring proceedings
            in the courts of your home country where the law so provides. Nothing
            in these Terms affects your mandatory statutory rights as a consumer.
          </p>
        </Section>

        <Section number={12} title="Changes; severability; contact">
          <p>
            We may update these Terms; continued use after changes constitutes
            acceptance. If any provision is held unenforceable, the remainder
            continues in effect. These Terms, with the Privacy Policy and Cookie
            Policy, are the entire agreement regarding your use of the Site.
          </p>
          <div className="mt-6 text-white space-y-2" style={{ background: "rgba(201,168,76,0.03)", border: "1px solid rgba(201,168,76,0.15)", padding: "32px" }}>
            <div><strong>George Yachts Brokerage House LLC</strong></div>
            <div>Charilaou Trikoupi 190A, Kifisia 145 64, Athens, Greece</div>
            <div>+30 697 038 0999</div>
            <div>
              <ObfuscatedEmail className="hover:text-[#C9A84C] transition-colors" />
            </div>
          </div>
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

export default TermsOfService;
