// /contact — dedicated contact + NAP page for local SEO.
//
// Why this page exists: queries like "george yachts contact",
// "george yachts athens", "yacht charter broker athens" need a
// canonical destination with: visible address, phone, hours, map
// embed, schema. Without this, the local pack ranking is a fraction
// of what's possible — and AI agents (Perplexity, ChatGPT) have no
// single page to cite when someone asks "how do I reach George Yachts".
//
// Schema emitted: ContactPage + nested Place + LocalBusiness +
// BreadcrumbList. Plays well alongside the Organization schema in
// root layout (no duplication — different @type).

import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Contact George Yachts | Athens Office, Phone, WhatsApp",
  description:
    "Reach George Yachts Brokerage House — Athens HQ at Charilaou Trikoupi 190A, Nea Kifisia 14564. Phone, WhatsApp, email, Calendly. IYBA member broker for Greek waters yacht charter.",
  alternates: { canonical: "https://georgeyachts.com/contact" },
  openGraph: {
    title: "Contact George Yachts | Athens HQ",
    description:
      "Athens-based luxury yacht charter brokerage. Direct phone, WhatsApp, Calendly. IYBA member.",
    url: "https://georgeyachts.com/contact",
    type: "website",
  },
};

const ATHENS_ADDRESS = {
  street: "Charilaou Trikoupi 190A",
  locality: "Nea Kifisia",
  region: "Attica",
  postalCode: "14564",
  country: "Greece",
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact George Yachts",
  url: "https://georgeyachts.com/contact",
  description:
    "Contact George Yachts Brokerage House — Athens HQ, three regional phone lines, WhatsApp, email, Calendly.",
  mainEntity: {
    "@type": "LocalBusiness",
    "@id": "https://georgeyachts.com/#organization",
    name: "George Yachts Brokerage House",
    image: "https://georgeyachts.com/images/yacht-icon-only.svg",
    telephone: "+30 6970380999",
    email: "george@georgeyachts.com",
    url: "https://georgeyachts.com",
    priceRange: "€€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: ATHENS_ADDRESS.street,
      addressLocality: ATHENS_ADDRESS.locality,
      addressRegion: ATHENS_ADDRESS.region,
      postalCode: ATHENS_ADDRESS.postalCode,
      addressCountry: "GR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.0833,
      longitude: 23.8167,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+30-697-038-0999",
        contactType: "sales",
        areaServed: "GR",
        availableLanguage: ["English", "Greek"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+44-203-769-2707",
        contactType: "sales",
        areaServed: "GB",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: "+1-786-798-8798",
        contactType: "sales",
        areaServed: "US",
        availableLanguage: "English",
      },
    ],
  },
};

export default function ContactPage() {
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    "Charilaou Trikoupi 190A, Nea Kifisia 14564, Athens, Greece",
  )}&output=embed`;

  return (
    <>
      <JsonLd data={contactSchema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Contact", url: "https://georgeyachts.com/contact" },
        ]}
      />

      <main className="bg-black text-white min-h-screen">
        <section className="max-w-6xl mx-auto px-6 py-24">
          <header className="mb-16">
            <p className="text-[#DAA520] text-sm tracking-[0.3em] uppercase mb-4">
              Get in touch
            </p>
            <h1 className="font-cormorant text-5xl md:text-6xl font-light leading-tight">
              Speak to a working broker — not a call center
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
              George Yachts is a boutique IYBA-member brokerage based in
              Athens. Every inquiry lands in front of a working broker who
              knows the Greek waters firsthand. Pick the channel that suits
              you — we answer all of them personally.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact details */}
            <div className="space-y-10">
              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#DAA520]">
                  Athens HQ
                </h2>
                <address className="not-italic text-white/80 leading-relaxed">
                  George Yachts Brokerage House
                  <br />
                  {ATHENS_ADDRESS.street}
                  <br />
                  {ATHENS_ADDRESS.locality} {ATHENS_ADDRESS.postalCode}
                  <br />
                  {ATHENS_ADDRESS.country}
                </address>
                <p className="mt-3 text-sm text-white/50">
                  Visits by appointment only. Most charter consultations
                  happen by phone, WhatsApp, or video — we cover Greek
                  waters end to end without you needing to fly to Athens.
                </p>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#DAA520]">
                  Direct lines
                </h2>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <span className="text-white/50 mr-3">Athens</span>
                    <a
                      href="tel:+306970380999"
                      className="hover:text-[#DAA520] transition"
                    >
                      +30 6970 380 999
                    </a>
                  </li>
                  <li>
                    <span className="text-white/50 mr-3">London</span>
                    <a
                      href="tel:+442037692707"
                      className="hover:text-[#DAA520] transition"
                    >
                      +44 20 3769 2707
                    </a>
                  </li>
                  <li>
                    <span className="text-white/50 mr-3">Miami</span>
                    <a
                      href="tel:+17867988798"
                      className="hover:text-[#DAA520] transition"
                    >
                      +1 786 798 8798
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#DAA520]">
                  Digital channels
                </h2>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <a
                      href="https://wa.me/17867988798"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#DAA520] transition"
                    >
                      WhatsApp · +1 786 798 8798
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:george@georgeyachts.com"
                      className="hover:text-[#DAA520] transition"
                    >
                      george@georgeyachts.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://calendly.com/george-georgeyachts/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#DAA520] transition"
                    >
                      Book a 30-min call · Calendly
                    </a>
                  </li>
                  <li>
                    <a
                      href="/inquiry"
                      className="hover:text-[#DAA520] transition"
                    >
                      Start a charter inquiry →
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#DAA520]">
                  Hours
                </h2>
                <p className="text-white/80">
                  Daily 09:00 – 21:00 Athens time (EET / EEST)
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Hot inquiries answered within 60 minutes during business
                  hours, within 4 hours otherwise.
                </p>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#DAA520]">
                  Credentials
                </h2>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>· IYBA member broker (International Yacht Brokers Association)</li>
                  <li>· MYBA Charter Agreement standard</li>
                  <li>· Managing Broker: George P. Biniaris</li>
                  <li>· Founded 2025 in Athens, Greece</li>
                </ul>
              </div>
            </div>

            {/* Map embed */}
            <div className="space-y-6">
              <div className="aspect-square w-full rounded-lg overflow-hidden border border-white/10">
                <iframe
                  title="George Yachts Athens HQ — Charilaou Trikoupi 190A, Nea Kifisia"
                  src={mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Charilaou+Trikoupi+190A+Nea+Kifisia+14564"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-[#DAA520] hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
