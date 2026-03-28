import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import DestinationContent from "../DestinationContent";
import "@/styles/service-page.css";

export const metadata = {
  title: "Ionian Islands Yacht Charter | Corfu, Lefkada, Kefalonia | George Yachts",
  description: "Charter a luxury yacht in the Ionian islands — Corfu, Lefkada, Kefalonia, Zakynthos, Ithaca, Paxos. Calm waters, emerald bays, family-friendly sailing with George Yachts.",
  alternates: { canonical: "https://georgeyachts.com/destinations/ionian" },
};

const data = {
  region: "Ionian Islands",
  introTitle: "Why Charter a Yacht in the Ionian?",
  introText: [
    "The Ionian Sea is Greece's gentler side — lush green islands, sheltered turquoise bays, and calm waters that make it ideal for families and first-time charterers. The Venetian architecture of Corfu, the dramatic cliffs of Zakynthos, and the hidden coves of Paxos create a sailing experience unlike anywhere in the Mediterranean.",
    "With shorter distances between islands and consistently calm conditions, the Ionian is perfect for relaxed island-hopping. Your crew will guide you to secret swimming spots, waterfront tavernas serving the freshest seafood, and anchorages where you'll be the only yacht in sight.",
  ],
  islandsTitle: "Which Ionian Islands Should You Visit?",
  islands: [
    { name: "Corfu", desc: "Venetian old town (UNESCO), lush hillsides, luxury resorts. Gateway to the Ionian." },
    { name: "Paxos", desc: "Tiny, car-free, crystal caves and blue grottos. The most exclusive Ionian island." },
    { name: "Lefkada", desc: "Connected by bridge to mainland. Porto Katsiki — one of Greece's most stunning beaches." },
    { name: "Kefalonia", desc: "Largest Ionian island. Myrtos Beach, Melissani Cave, Captain Corelli's island." },
    { name: "Ithaca", desc: "Odysseus' legendary homeland. Unspoiled, authentic, deeply romantic." },
    { name: "Zakynthos", desc: "Navagio Shipwreck Beach, loggerhead turtle nesting grounds, vibrant nightlife." },
  ],
  itineraryTitle: "7-Day Ionian Yacht Charter Itinerary",
  itinerary: [
    { day: 1, title: "Lefkada \u2192 Meganisi", desc: "Board in Lefkada marina. Short cruise to Meganisi's secluded Vathi bay." },
    { day: 2, title: "Meganisi \u2192 Kefalonia", desc: "Morning swim. Cruise to Fiskardo — the Ionian's most charming harbor village." },
    { day: 3, title: "Kefalonia \u2192 Ithaca", desc: "Visit Melissani Cave. Afternoon sail to Ithaca, dinner in Kioni." },
    { day: 4, title: "Ithaca \u2192 Zakynthos", desc: "Morning in Vathi. Cruise south to Zakynthos for Navagio Beach at sunset." },
    { day: 5, title: "Zakynthos \u2192 Kefalonia", desc: "Turtle spotting in Laganas Bay. Afternoon at Myrtos Beach — the Ionian's crown jewel." },
    { day: 6, title: "Kefalonia \u2192 Paxos", desc: "Cruise north to Paxos. Explore blue caves by tender. Evening in Gaios village." },
    { day: 7, title: "Paxos \u2192 Corfu", desc: "Morning in Antipaxos lagoons. Return to Corfu. Old Town walk before disembarkation." },
  ],
};

function PageSchema() {
  const schema = { "@context": "https://schema.org", "@type": "TouristDestination", name: "Ionian Islands Yacht Charter", description: "Luxury yacht charter in the Ionian — Corfu, Lefkada, Kefalonia, Zakynthos", touristType: "Luxury Yacht Charter", geo: { "@type": "GeoCoordinates", latitude: 38.7, longitude: 20.7 }, containedInPlace: { "@type": "Country", name: "Greece" } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function IonianPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <PageSchema />
      <section className="svc-hero">
        <Image src="https://cdn.sanity.io/images/ecqr94ey/production/0a7391a08ebd3746b26123b159fb94fb15353852-1280x853.jpg?w=1920&h=900&fit=crop&auto=format" alt="Ionian islands yacht charter Greece - Corfu Lefkada Kefalonia" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Destination Guide</p>
          <h1 className="svc-hero__title">The Ionian</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Corfu &middot; Lefkada &middot; Kefalonia &middot; Zakynthos &middot; Ithaca &middot; Paxos</p>
        </div>
      </section>
      <DestinationContent data={data} />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
