import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import HowItWorksContent from "./HowItWorksContent";

export const metadata = {
  title: "How It Works | Yacht Charter Process | George Yachts",
  description:
    "From first conversation to boarding day — 5 simple steps to charter a luxury yacht in Greece with George Yachts. MYBA contracts, transparent pricing, personal broker service.",
  alternates: {
    canonical: "https://georgeyachts.com/how-it-works",
  },
  openGraph: {
    title: "How It Works | George Yachts Charter Process",
    description: "5 steps from vision to voyage. Personal broker service, MYBA contracts, transparent pricing.",
    url: "https://georgeyachts.com/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Hero */}
      <div className="relative pt-44 pb-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(218,165,32,0.1)" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="w-16 h-px mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: "0.4em", color: "#DAA520", marginBottom: "24px", textTransform: "uppercase" }}>
            Your Charter Journey
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "24px" }}>
            How It Works
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", lineHeight: 1.9, color: "rgba(255,255,255,0.45)", maxWidth: "600px", margin: "0 auto" }}>
            From first conversation to boarding day — five steps, one point of contact, zero stress.
          </p>
          <div className="w-16 h-px mx-auto mt-10" style={{ background: "linear-gradient(90deg, transparent, #DAA520, transparent)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(218,165,32,0.04) 0%, transparent 70%)" }} />
      </div>

      <HowItWorksContent />

      <ContactFormSection />
      <Footer />
    </div>
  );
}
