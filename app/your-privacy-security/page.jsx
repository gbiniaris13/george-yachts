import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How We Protect Your Information | George Yachts",
  description:
    "Learn how George Yachts Brokerage House protects your personal data, documents, and privacy with bank-grade encryption and strict confidentiality protocols.",
  alternates: {
    canonical: "https://georgeyachts.com/your-privacy-security",
  },
};

const Card = ({ icon, title, description }) => (
  <div className="p-8 md:p-10" style={{ background: "rgba(218,165,32,0.03)", border: "1px solid rgba(218,165,32,0.1)" }}>
    <div className="text-[#DAA520] mb-6">{icon}</div>
    <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", fontWeight: 400, color: "#fff", marginBottom: "16px" }}>
      {title}
    </h3>
    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", lineHeight: 2, color: "rgba(255,255,255,0.5)" }}>
      {description}
    </p>
  </div>
);

export default function YourPrivacySecurity() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-[#DAA520]/20 mb-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Your Trust Matters
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "24px" }}>
            How We Protect Your Information
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", lineHeight: 1.9, color: "rgba(255,255,255,0.45)", maxWidth: "600px", margin: "0 auto" }}>
            When you trust us with your charter plans, passport details, or personal preferences, we take that responsibility seriously. Here&apos;s exactly how we keep your information safe.
          </p>
          <div className="w-16 h-px mx-auto mt-10" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(218,165,32,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 py-24">

        {/* Intro */}
        <div className="text-center mb-20">
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", lineHeight: 2.2, color: "rgba(255,255,255,0.5)", maxWidth: "700px", margin: "0 auto" }}>
            We understand that chartering a yacht involves sharing sensitive information — from travel dates and preferences to passport copies and financial details. Unlike a generic booking platform, we handle every piece of data with the discretion you&apos;d expect from a private brokerage.
          </p>
        </div>

        {/* Security Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          <Card
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            title="Bank-Grade Encryption"
            description="Every form submission, email, and file transfer is protected with 256-bit TLS encryption — the same standard used by major banks and financial institutions. Your data cannot be intercepted in transit."
          />
          <Card
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="13" x2="17" y2="13"/></svg>}
            title="Strictly Need-to-Know"
            description="Your personal details are shared only with the specific yacht crew and charter operator relevant to your booking. We never share your information with other clients, marketing partners, or third parties for promotional purposes."
          />
          <Card
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            title="Document Security"
            description="Passport copies and KYC documents required for charter agreements are stored in encrypted cloud storage with access controls. Documents are automatically deleted after your charter season concludes, unless retention is legally required."
          />
          <Card
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
            title="GDPR & CCPA Compliant"
            description="Whether you're based in Europe, the US, or anywhere else, your data rights are fully respected. You can request access to, correction of, or deletion of your personal data at any time — no questions asked."
          />
          <Card
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            title="No Tracking Without Consent"
            description="We use minimal analytics to improve our website experience. We don't track your browsing across other sites, sell your data, or build advertising profiles. You can opt out of analytics entirely through your browser settings."
          />
          <Card
            icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            title="Private Communications"
            description="All client communications — whether by email, WhatsApp, or phone — are treated as strictly confidential. We never discuss your charter plans, budget, or personal details with anyone outside your booking."
          />
        </div>

        {/* Personal Promise */}
        <div className="py-16 px-8 md:px-16 text-center mb-24" style={{ background: "rgba(218,165,32,0.03)", borderLeft: "3px solid rgba(218,165,32,0.3)" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", fontStyle: "italic", lineHeight: 1.8, marginBottom: "24px" }}>
            &ldquo;In yacht brokerage, discretion isn&apos;t a feature — it&apos;s the foundation. Our clients trust us with their most personal moments, and we honour that trust with absolute confidentiality.&rdquo;
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: "#DAA520", textTransform: "uppercase" }}>
            — George P. Biniaris, Managing Broker
          </p>
        </div>

        {/* Your Rights */}
        <div className="mb-24">
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", fontWeight: 300, color: "#fff", textAlign: "center", marginBottom: "40px" }}>
            Your Rights — In Plain Language
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            {[
              { right: "See your data", desc: "Ask us what information we hold about you. We'll provide a clear summary within 48 hours." },
              { right: "Fix your data", desc: "If anything is incorrect — wrong email, outdated phone number — tell us and we'll update it immediately." },
              { right: "Delete your data", desc: "Want us to erase everything? Just ask. We'll remove your records from all our systems permanently." },
              { right: "Stop marketing", desc: "Unsubscribe from any email with one click. No waiting periods, no hoops to jump through." },
              { right: "Take your data", desc: "Request a copy of your data in a standard format to take with you. It's yours." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "28px", fontWeight: 300, color: "rgba(218,165,32,0.2)", lineHeight: 1, minWidth: "30px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 600, color: "#fff", letterSpacing: "0.05em", marginBottom: "6px" }}>
                    {item.right}
                  </h4>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", lineHeight: 1.8, color: "rgba(255,255,255,0.45)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.5rem", fontWeight: 300, color: "#fff", marginBottom: "16px" }}>
            Questions About Your Data?
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
            Reach out anytime. We&apos;re happy to explain anything in more detail.
          </p>
          <a
            href="mailto:george@georgeyachts.com"
            style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", letterSpacing: "0.15em", color: "#DAA520", textDecoration: "none", borderBottom: "1px solid rgba(218,165,32,0.3)", paddingBottom: "4px" }}
          >
            george@georgeyachts.com
          </a>
          <div className="mt-12">
            <Link
              href="/privacy-policy"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", textDecoration: "none" }}
            >
              Read our full legal Privacy Policy →
            </Link>
          </div>
        </div>

        <div className="mt-32 pt-16 text-center" style={{ borderTop: "1px solid rgba(218,165,32,0.1)" }}>
          <div className="w-8 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            Last Updated: March 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
