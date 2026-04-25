import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import HowItWorksContent from "./HowItWorksContent";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

// HowTo schema for the 5-step charter journey. AI agents (especially
// ChatGPT, Perplexity, Bing Chat) prefer HowTo over plain prose for
// procedural queries like "how to charter a yacht in Greece" — they
// cite each step verbatim and the SERP shows step-by-step rich result
// cards. Steps mirror the on-page content authored by the brokers.
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Charter a Crewed Yacht in Greece",
  description:
    "Five steps from first conversation to boarding day — the broker-led process for chartering a luxury yacht in Greek waters with George Yachts.",
  totalTime: "P14D",
  estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "13000" },
  supply: [
    { "@type": "HowToSupply", name: "Passport" },
    { "@type": "HowToSupply", name: "Charter party preference (sailing yacht / motor yacht / catamaran)" },
    { "@type": "HowToSupply", name: "Indicative dates and party size" },
  ],
  tool: [{ "@type": "HowToTool", name: "MYBA Charter Agreement (provided by George Yachts)" }],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Initial conversation",
      text: "Reach a working broker by phone, WhatsApp, or Calendly. Share dates, party size, region preference (Cyclades, Ionian, Saronic, Sporades), and budget band. The broker filters the curated fleet to 3–5 best-fit yachts within 24 hours.",
      url: "https://georgeyachts.com/how-it-works#step-1",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Yacht shortlist + comparison",
      text: "Review yacht detail pages with photos, specs, and weekly rates. Use the side-by-side /compare page to evaluate 2–4 candidates head-to-head. The broker provides honest pros/cons including known yacht quirks not in marketing materials.",
      url: "https://georgeyachts.com/how-it-works#step-2",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "MYBA contract + APA",
      text: "Once a yacht is selected, the MYBA Charter Agreement is drafted. A 50% deposit secures the booking; the balance is due 30 days before charter start. APA (Advance Provisioning Allowance, typically 25–35% of charter fee) is paid separately to cover fuel, food, and dockage.",
      url: "https://georgeyachts.com/how-it-works#step-3",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Pre-charter planning",
      text: "Captain consultation 2–4 weeks pre-departure: itinerary refinement, dietary preferences, special requests (jet skis, water toys, chef preferences, child seats, accessibility needs). The broker mediates all communication so the client deals with one point of contact, not the crew directly.",
      url: "https://georgeyachts.com/how-it-works#step-4",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Boarding and charter",
      text: "Arrival at the chosen embarkation port (Athens, Lefkada, Corfu, Mykonos). Captain greets the party, safety briefing, and the charter begins. The broker remains on call throughout the charter for any issue. Post-charter, APA is reconciled with receipts and the unused balance is refunded.",
      url: "https://georgeyachts.com/how-it-works#step-5",
    },
  ],
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "How It Works", url: "https://georgeyachts.com/how-it-works" },
        ]}
      />

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
