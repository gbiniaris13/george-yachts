import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import DestinationContent from "../DestinationContent";
import DestinationHero from "@/app/components/DestinationHero";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { imageFor, videoForRegion } from "@/lib/destination-images";
import "@/styles/service-page.css";

export const metadata = {
  title: "Cyclades Yacht Charter | Mykonos, Santorini, Paros, Syros, Tinos | George Yachts",
  description: "Charter a luxury yacht across the Cyclades — Mykonos, Santorini, Paros, Naxos, Milos, Syros, Tinos, Andros, Folegandros, Amorgos, Sifnos and more. Curated crewed charters with George Yachts.",
  alternates: { canonical: "https://georgeyachts.com/destinations/cyclades" },
};

// Full Cycladic archipelago. George 2026-04-20: "siro kai tino den
// vlepw, vale ola ta nisia loipoun". Every inhabited Cycladic island
// now appears below with a description that a first-time visitor can
// orient from. Images auto-pick from the shared stock pool unless a
// per-island override is added later.
const CYCLADES_ISLANDS = [
  { name: "Mykonos", desc: "Cosmopolitan energy, beach clubs, Little Venice. The jetset hub of the Aegean." },
  { name: "Santorini", desc: "Volcanic caldera, the world's most famous sunsets, Oia & Fira cliffside dining." },
  { name: "Paros", desc: "Naoussa village, golden beaches, excellent windsurfing. The family favorite." },
  { name: "Antiparos", desc: "Bohemian, tranquil, crystal caves. A quiet celebrity retreat opposite Paros." },
  { name: "Naxos", desc: "Largest Cycladic island. Mountain villages, ancient Portara temple, long sand beaches." },
  { name: "Syros", desc: "Neoclassical Ermoupoli — the elegant Cycladic capital. Italianate opera house, marble squares." },
  { name: "Tinos", desc: "Dovecotes, marble villages, a pilgrimage church. Greece's most authentic gastronomy island." },
  { name: "Andros", desc: "Wooded, river-laced, hiker's paradise. Chora's shipowner mansions feel unlike any other Cycladic town." },
  { name: "Kea", desc: "Quiet, oak-forested, an hour from Athens. Ideal first overnight on a Cyclades charter." },
  { name: "Kythnos", desc: "Thermal springs, the sand-bridged Kolona beach, authentic villages no tour groups reach." },
  { name: "Serifos", desc: "Whitewashed amphitheatre over the sea, deserted coves, dramatic Chora on a rocky pyramid." },
  { name: "Sifnos", desc: "Pottery villages, the Aegean's best tavernas, bronze-age watchtowers linking Chora to Kastro." },
  { name: "Milos", desc: "70+ beaches, Kleftiko sea caves, lunar rock formations at Sarakiniko." },
  { name: "Kimolos", desc: "Milos's tiny neighbour. Honey-stone village, beaches you'll share with goats, raw volcanic beauty." },
  { name: "Folegandros", desc: "Dramatic cliff-top Chora, zero crowds, one of the Cyclades' most romantic overnight stops." },
  { name: "Sikinos", desc: "Farthest off the beaten track. Terraced vineyards, stone villages, silence at anchor." },
  { name: "Ios", desc: "Legendary by day, lively by night. Mylopotas bay, Homer's tomb, cinematic Chora sunsets." },
  { name: "Amorgos", desc: "Big Blue filming location. Hora perched 400m above the sea, Panagia Hozoviotissa monastery clinging to the cliff." },
  { name: "Anafi", desc: "Remote, silent, with Greece's second-largest monolith. A charter-only island — no airport, few ferries." },
  { name: "Koufonisia", desc: "Turquoise lagoons, car-free island life, the Cyclades' answer to the Caribbean." },
  { name: "Schinoussa", desc: "Koufonisia's tiny cousin. Long sand beaches, a single village, total tranquility." },
  { name: "Iraklia", desc: "Little Cyclades gem. Cave of Agios Ioannis, wild hiking, fewer than 150 residents." },
  { name: "Donousa", desc: "Easternmost Little Cyclade. Kendros beach, the Aegean's clearest water, no crowds, no noise." },
  { name: "Thirasia", desc: "Santorini's silent sister across the caldera. A glimpse of Santorini before tourism." },
].map((i) => ({ ...i, image: imageFor(i.name) }));

const data = {
  region: "Cyclades",
  introTitle: "Why Charter a Yacht in the Cyclades?",
  introText: [
    "The Cyclades are the iconic heart of Greek sailing — whitewashed villages cascading down volcanic cliffs, crystal-clear Aegean waters, and a nightlife scene that draws the global elite. From the cosmopolitan energy of Mykonos to the romantic sunsets of Santorini, from the untouched beauty of Milos to the bohemian charm of Paros — and beyond, to Syros, Tinos, Andros, Amorgos and the Little Cyclades.",
    "A crewed yacht charter is the ultimate way to experience the Cyclades. No ferry queues, no hotel check-ins — just island-hopping at your own pace with a dedicated crew, private chef, and your broker's insider knowledge of every anchorage, beach club, and hidden taverna.",
  ],
  islandsTitle: "Every Cycladic Island Worth Your Time",
  islands: CYCLADES_ISLANDS,
  itineraryTitle: "7-Day Cyclades Yacht Charter Itinerary",
  itinerary: [
    { day: 1, title: "Athens \u2192 Kea", desc: "Board in Athens marina. Cruise to Kea for a quiet first evening in Vourkari bay." },
    { day: 2, title: "Kea \u2192 Mykonos", desc: "Morning sail to Mykonos. Afternoon at Psarou beach club. Evening in Little Venice." },
    { day: 3, title: "Mykonos \u2192 Paros", desc: "Explore Naoussa village. Lunch at a waterfront taverna. Swim at Kolymbithres beach." },
    { day: 4, title: "Paros \u2192 Antiparos \u2192 Koufonisia", desc: "Morning cave visit in Antiparos. Afternoon sail to Koufonisia's turquoise lagoons." },
    { day: 5, title: "Koufonisia \u2192 Naxos", desc: "Beach morning in Koufonisia. Afternoon in Naxos town, visit the Portara temple." },
    { day: 6, title: "Naxos \u2192 Santorini", desc: "Early cruise to Santorini. Anchor in the caldera. Sunset dinner in Oia." },
    { day: 7, title: "Santorini \u2192 Athens", desc: "Morning swim at Red Beach. Return cruise to Athens marina. Disembarkation." },
  ],
};

function PageSchema() {
  const schema = { "@context": "https://schema.org", "@type": "TouristDestination", name: "Cyclades Islands Yacht Charter", description: "Luxury yacht charter across the full Cycladic archipelago — Mykonos, Santorini, Paros, Naxos, Milos, Syros, Tinos and more.", touristType: "Luxury Yacht Charter", geo: { "@type": "GeoCoordinates", latitude: 37.4, longitude: 25.4 }, containedInPlace: { "@type": "Country", name: "Greece" } };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function CycladesPage() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://georgeyachts.com/" },
        { name: "Destinations", url: "https://georgeyachts.com/destinations" },
        { name: "Cyclades", url: "https://georgeyachts.com/destinations/cyclades" },
      ]} />
      <PageSchema />
      <DestinationHero
        imageUrl="https://cdn.sanity.io/images/ecqr94ey/production/72a5bc25ad09c9b4d0a872fdd36469d3d231ad0a-5472x3648.jpg?w=1920&h=900&fit=crop&auto=format"
        imageAlt="Cyclades yacht charter Greece - Mykonos Santorini sailing"
        videoUrl={videoForRegion("cyclades")}
        title="The Cyclades"
        subtitle="Mykonos · Santorini · Paros · Naxos · Milos · Syros · Tinos · Amorgos"
      />
      <DestinationContent data={data} />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
