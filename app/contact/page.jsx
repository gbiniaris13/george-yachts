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
  title: { absolute: "Contact George Yachts | Athens Office, Phone, WhatsApp" },
  description:
    "Reach George Yachts Brokerage House - Athens HQ at Charilaou Trikoupi 190A, Kifisia 14564. Phone, WhatsApp, email, Calendly. IYBA member broker for Greek waters yacht charter.",
  alternates: { canonical: "https://georgeyachts.com/contact" },
  openGraph: {
      images: [{ url: "https://georgeyachts.com/opengraph-image", width: 1200, height: 630 }],
    title: "Contact George Yachts | Athens HQ",
    description:
      "Athens-based luxury yacht charter brokerage. Direct phone, WhatsApp, Calendly. IYBA member.",
    url: "https://georgeyachts.com/contact",
    type: "website",
  },
};

const ATHENS_ADDRESS = {
  street: "Charilaou Trikoupi 190A",
  locality: "Kifisia",
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
    "Contact George Yachts Brokerage House - Athens HQ, three regional phone lines, WhatsApp, email, Calendly.",
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
    // 2026-06-10: geo aligned to the Google Business Profile pin
    // (38.0876, 23.8084) and hours to 24/7, matching
    // lib/organizationSchema.js exactly so the two schemas never
    // disagree in Google's eyes.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 38.0876,
      longitude: 23.8084,
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
      opens: "00:00",
      closes: "23:59",
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
    "Charilaou Trikoupi 190A, Kifisia 14564, Athens, Greece",
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
        {/* 2026-07-14 — top padding raised from py-24 (96px): the fixed
            nav's centered wordmark (clamp 120-180px tall + Forbes bar)
            overlaid the centered masthead, logo colliding with the H1.
            Clamp keeps clearance across breakpoints without a mobile gap. */}
        <section
          className="max-w-6xl mx-auto px-6 pb-24"
          style={{ paddingTop: "clamp(180px, 18vw, 240px)" }}
        >
          {/* Phase 27g (Forbes-launch day) — masthead upgraded to brand
              standard. Cinzel + .gy-luxe-enter via inline style + gold
              rules + italic Cormorant lede, matching homepage hero +
              region pages. */}
          <header className="mb-16" style={{ textAlign: "center" }}>
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: "min(280px, 30vw)",
                height: 1,
                margin: "0 auto 24px",
                background:
                  "linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)",
              }}
            />
            <p
              className="gy-gold-glow"
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
                margin: "0 0 22px",
              }}
            >
              Get in touch · Direct broker line
            </p>
            <h1
              className="gy-luxe-enter"
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: "clamp(34px, 6.5vw, 84px)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "0.04em",
                margin: "0 0 28px",
              }}
            >
              Speak to a working broker
            </h1>
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: 60,
                height: 1,
                margin: "0 auto 28px",
                background: "rgba(201,168,76,0.55)",
              }}
            />
            <p
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.7vw, 22px)",
                lineHeight: 1.7,
                color: "rgba(248,245,240,0.85)",
                fontWeight: 300,
                margin: "0 auto",
                maxWidth: "62ch",
              }}
            >
              George Yachts is a boutique IYBA-member brokerage based in
              Athens. Every inquiry lands in front of a working broker
              who knows the Greek waters firsthand. Pick the channel
              that suits you - we answer all of them personally.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact details */}
            <div className="space-y-10">
              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#C9A84C]">
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
                  happen by phone, WhatsApp, or video - we cover Greek
                  waters end to end without you needing to fly to Athens.
                </p>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#C9A84C]">
                  Direct lines
                </h2>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <span className="text-white/50 mr-3">Athens</span>
                    <a
                      href="tel:+306970380999"
                      className="hover:text-[#C9A84C] transition"
                    >
                      +30 6970 380 999
                    </a>
                  </li>
                  <li>
                    <span className="text-white/50 mr-3">Miami</span>
                    <a
                      href="tel:+17867988798"
                      className="hover:text-[#C9A84C] transition"
                    >
                      +1 786 798 8798
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#C9A84C]">
                  Digital channels
                </h2>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <a
                      href="https://wa.me/17867988798"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#C9A84C] transition"
                    >
                      WhatsApp · +1 786 798 8798
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:george@georgeyachts.com"
                      className="hover:text-[#C9A84C] transition"
                    >
                      george@georgeyachts.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://calendly.com/george-georgeyachts/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#C9A84C] transition"
                    >
                      Book a 30-min call · Calendly
                    </a>
                  </li>
                  <li>
                    <a
                      href="/inquiry"
                      className="hover:text-[#C9A84C] transition"
                    >
                      Start a charter inquiry →
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#C9A84C]">
                  Hours
                </h2>
                <p className="text-white/80">
                  Around the clock, seven days a week
                </p>
                <p className="mt-2 text-sm text-white/50">
                  A broker answers on the Athens and Miami lines at any
                  hour. Hot inquiries within 60 minutes, everything else
                  within 4 hours.
                </p>
              </div>

              <div>
                <h2 className="font-cormorant text-3xl mb-4 text-[#C9A84C]">
                  Credentials
                </h2>
                <ul className="space-y-2 text-sm text-white/85">
                  <li>· <a href="https://iyba.org" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>IYBA Member Broker</a> (International Yacht Brokers Association)</li>
                  <li>· MYBA-standard charter contracts</li>
                  <li>· Managing Broker: George P. Biniaris</li>
                  <li>· Operating from Athens, Greece</li>
                </ul>
              </div>
            </div>

            {/* Map embed */}
            <div className="space-y-6">
              <div className="aspect-square w-full rounded-lg overflow-hidden border border-white/10">
                <iframe
                  title="George Yachts Athens HQ - Charilaou Trikoupi 190A, Kifisia"
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
                href="https://www.google.com/maps/search/?api=1&query=Charilaou+Trikoupi+190A+Kifisia+14564"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-[#C9A84C] hover:underline"
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
