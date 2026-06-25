import Footer from "@/components/Footer";
import ObfuscatedEmail from "@/app/components/ObfuscatedEmail";
import { pageMeta } from "@/lib/pageMeta";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = pageMeta({
  title: "Cookie Policy",
  description:
    "How georgeyachts.com uses cookies and similar technologies, and how to control them — analytics and session tools load only with your consent.",
  path: "/cookie-policy",
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

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBreadcrumb path="/cookie-policy" />
      {/* --- HERO SECTION --- */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#C9A84C", marginBottom: "24px", textTransform: "uppercase" }}>
            Digital Transparency
          </p>
          <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#F8F5F0", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "16px" }}>
            Cookie Policy
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
        <Section number={1} title="About cookies">
          <p>
            Cookies and similar technologies (pixels, local storage) store or
            access information on your device. Under Greek Law 3471/2006
            (implementing the EU ePrivacy Directive) and the GDPR, we set
            non-essential cookies only with your prior consent. Strictly
            necessary cookies do not require consent.
          </p>
        </Section>

        <Section number={2} title="How we ask for consent">
          <p>
            When you first visit georgeyachts.com, a cookie banner lets you
            accept or reject non-essential cookies, or set preferences by
            category. In line with Hellenic Data Protection Authority guidance:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li>Non-essential cookies are not set before you consent.</li>
            <li>You can accept or reject with equal ease and equal prominence — no pre-ticked boxes, and continued browsing is not treated as consent.</li>
            <li>You can change or withdraw your choice at any time via the "Cookie settings" link in the footer.</li>
            <li>There is no "cookie wall": you can use the Site even if you reject non-essential cookies.</li>
          </ul>
        </Section>

        <Section number={3} title="Strictly necessary — no consent required">
          <ul className="list-disc pl-5 space-y-2 mt-2" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li><strong className="text-white">Cloudflare</strong> — network security, bot mitigation, and reliable delivery of the Site.</li>
            <li><strong className="text-white">Session and consent storage</strong> — remembers your cookie choices and keeps the Site working.</li>
            <li><strong className="text-white">Google reCAPTCHA</strong> — protects our forms from spam and abuse; loaded for security on a legitimate-interest basis.</li>
          </ul>
        </Section>

        <Section number={4} title="Functional — loaded on request">
          <ul className="list-disc pl-5 space-y-2 mt-2" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li><strong className="text-white">Calendly</strong> — loaded only when you open the scheduling tool to book a consultation.</li>
          </ul>
        </Section>

        <Section number={5} title="Analytics & session analysis — consent required">
          <ul className="list-disc pl-5 space-y-2 mt-2" style={{ color: "rgba(248, 245, 240,0.5)" }}>
            <li>
              <strong className="text-white">Google Analytics 4</strong> —
              aggregate website analytics (pages, sources, performance). Loaded
              only after you consent.
            </li>
            <li>
              <strong className="text-white">Microsoft Clarity</strong> —
              heatmaps and session analysis. This is the most privacy-sensitive
              tool we use; we load it only after you consent, and we disclose it
              here for full transparency.
            </li>
          </ul>
        </Section>

        <Section number={6} title="Managing cookies">
          <p>
            Use the footer "Cookie settings" link at any time, or your browser
            settings, to block or delete cookies. Disabling strictly necessary
            cookies may impair how the Site works.
          </p>
        </Section>

        <Section number={7} title="Contact">
          <p>
            Questions about this policy:{" "}
            <ObfuscatedEmail className="text-[#C9A84C] hover:underline" />. You may
            also contact the Hellenic Data Protection Authority (1-3 Kifissias
            Avenue, 115 23 Athens; +30 210 6475600; contact@dpa.gr). See also our{" "}
            <a href="/privacy-policy" className="text-[#C9A84C] hover:underline">Privacy Policy</a>.
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

export default CookiePolicy;
