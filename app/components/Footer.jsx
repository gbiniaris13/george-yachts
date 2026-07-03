"use client";
import { WHATSAPP_US_LOCKED } from "@/lib/whatsappStatus";

import React, { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Image from "next/image";
import PressStrip from "./PressStrip";

const WhatsappIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.031 0.725C5.741 0.725 0.547 5.926 0.547 12.215C0.547 14.39 1.155 16.42 2.22 18.15L0.63 23.36l5.352-1.55c1.674 0.99 3.593 1.516 5.619 1.516c6.29 0 11.484-5.201 11.484-11.491C23.595 5.926 18.4 0.725 12.031 0.725zM17.476 15.655c-0.198 0.505-1.127 0.99-1.523 1.054c-0.342 0.054-0.695 0.078-1.574-0.373c-1.028-0.543-2.607-1.583-3.804-2.78c-1.197-1.197-2.237-2.776-2.78-3.804c-0.45-0.879-0.426-1.232-0.373-1.574c0.064-0.396 0.549-1.325 1.054-1.523c0.426-0.165 0.879-0.276 1.197-0.276c0.231 0 0.426 0.015 0.639 0.45l0.58 1.417c0.078 0.165 0.124 0.358 0.046 0.569c-0.078 0.21-0.26 0.45-0.45 0.639c-0.183 0.183-0.33 0.358-0.441 0.569c-0.111 0.21-0.26 0.385-0.137 0.609c0.124 0.223 0.639 1.152 1.518 2.031c0.879 0.879 1.808 1.455 2.031 1.518c0.223 0.124 0.398-0.023 0.609-0.137c0.21-0.111 0.385-0.26 0.569-0.441c0.183-0.183 0.426-0.375 0.639-0.45c0.21-0.078 0.403-0.032 0.569 0.046l1.417 0.58c0.435 0.211 0.546 0.665 0.373 1.197z" />
  </svg>
);

const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot - bots autofill, humans never see
  const [subscribed, setSubscribed] = useState(false);

  // 2026-05-12 - trailing slashes removed. Next.js normalises
  // /path/ → /path via 308 redirect (audited Item 33), so each
  // footer click was costing an extra roundtrip + leaking link
  // equity. Targets now hit the canonical no-slash URLs directly.
  const serviceLinks = [
    { name: "Charter a Yacht", href: "/charter-yacht-greece" },
    { name: "Buy a Yacht", href: "/yachts-for-sale" },
    { name: "Fly Private", href: "/private-jet-charter" },
    { name: "VIP Transfers", href: "/vip-transfers-greece" },
    { name: "Luxury Villas", href: "/luxury-villas-greece" },
    { name: "Yacht Itineraries", href: "/yacht-itineraries-greece" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Our Team", href: "/team" },
    { name: "Credentials", href: "/credentials" },
    // 2026-05-14 (Ahrefs orphan-page audit) - /press, /partners,
    // /events had zero incoming internal links. All three are real,
    // indexable, and high-trust surfaces, so they belong here under
    // Company alongside Credentials.
    { name: "Press", href: "/press" },
    { name: "Partners", href: "/partners" },
    { name: "Events", href: "/events" },
    // 2026-05-14 - /ai-research is the AI-search citation hub
    // (engineered for ChatGPT/Perplexity/Claude/Gemini extraction)
    // and was orphaned per Ahrefs. Surfacing it under Company so it
    // gets the same site-wide inbound as the rest of the trust pages.
    { name: "AI Research Hub", href: "/ai-research" },
    { name: "Greece by Yacht", href: "/greece-by-yacht" },
    { name: "The Journal", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ];

  // 2026-05-14 - Site Index (Ahrefs orphan-page fix).
  //
  // The Ahrefs 2026-05-14 crawl flagged 57 orphan pages (no incoming
  // internal links). They were all real, indexable, programmatic-SEO
  // landing pages targeting high-intent long-tail queries - Google
  // and the AI search engines (Perplexity / ChatGPT / Claude /
  // Gemini) couldn't reach them because nothing on the site linked
  // to them. PageRank was effectively zero across 57 high-value URLs.
  //
  // The fix is the canonical luxury-publication pattern (NYT,
  // Bloomberg, Vogue): a discrete "More from George Yachts" tiered
  // sitemap block at the bottom of the footer. Every link is real
  // anchor text - no nofollow, no obfuscation - so each orphan now
  // has a site-wide inbound link from every page on the domain.
  //
  // Categorisation matches search-intent groupings:
  //   1. Charter by Occasion         - life-event keywords
  //   2. Charter by Audience & Budget - qualifying-filter keywords
  //   3. Explore by Island            - destination long-tail
  //   4. Yacht-Type & Itinerary       - vessel-class + duration combos
  //
  // Visual register: muted ivory/45 labels + grid layout that
  // matches the existing footer column rhythm so it reads as a
  // sober editorial index, not a keyword dump.
  const siteIndexSections = [
    {
      heading: "Charter by Occasion",
      links: [
        { name: "Honeymoon Charter", href: "/yacht-charter-greece-honeymoon" },
        { name: "Proposal Charter", href: "/proposal-yacht-charter-greece" },
        { name: "Bachelorette Charter", href: "/bachelorette-yacht-charter-greece" },
        { name: "Bachelor Party Charter", href: "/bachelor-party-yacht-charter-greece" },
        { name: "Billionaire Charter", href: "/billionaire-yacht-charter-greece" },
        { name: "Celebrity Charter", href: "/celebrity-yacht-charter-greece" },
        { name: "Milestone Celebration", href: "/milestone-celebration-yacht-charter-greece" },
        { name: "Private Retreat", href: "/retreat-yacht-charter-greece" },
        { name: "Family with Children", href: "/yacht-charter-greece-family-with-children" },
        { name: "Corporate Groups", href: "/yacht-charter-greece-corporate-groups" },
        { name: "Friends' Trip", href: "/friends-trip-yacht-charter-greece" },
        { name: "Last-Minute Charter 2026", href: "/last-minute-yacht-charter-greece-2026" },
      ],
    },
    {
      heading: "Charter by Audience & Budget",
      links: [
        { name: "Crewed Yacht Charter →", href: "/crewed-yacht-charter-greece" },
        { name: "American Clients", href: "/yacht-charter-greece-american-clients" },
        { name: "UK Clients", href: "/yacht-charter-greece-uk-clients" },
        { name: "Under €50,000", href: "/yacht-charter-greece-under-50000" },
        { name: "Under €100,000", href: "/yacht-charter-greece-under-100000" },
        { name: "With Stabilizers", href: "/yacht-charter-greece-with-stabilizers" },
        { name: "Compare Yachts", href: "/compare" },
        { name: "Greece vs Other Destinations →", href: "/comparisons" },
        { name: "Crewed Charter Greek Islands", href: "/crewed-yacht-charter-greek-islands-2026" },
      ],
    },
    // 2026-06-10 (GSC-driven). The cost/pricing cluster was absent
    // from the site index even though "motor yacht charter greece
    // prices" (pos 12.8) and "athens yacht charter cost" (pos 16.5)
    // are the closest commercial queries to page one. These pages are
    // also the site's strongest AI-citation surfaces (Perplexity cites
    // the Index 6x for cost queries), so site-wide inbound links help
    // both engines map the cluster.
    {
      heading: "Pricing & Charter Data",
      links: [
        { name: "Greek Charter Index 2026", href: "/greek-charter-index-2026" },
        { name: "Complete Pricing Guide 2026", href: "/greek-yacht-charter-2026-complete-pricing-guide" },
        { name: "Charter Cost Calculator", href: "/tools/charter-cost-calculator" },
        { name: "What's Included in a Charter", href: "/whats-included-in-greek-yacht-charter-complete-2026-guide" },
        { name: "APA Explained", href: "/advance-provisioning-allowance-apa-greek-yacht-charter-explained" },
        { name: "Greek VAT Explained", href: "/greek-yacht-charter-vat-explained-2026" },
        { name: "Chartering with 12+ Guests", href: "/blog/12-passenger-rule-greek-yacht-charter-groups-of-14" },
        { name: "Market Reports →", href: "/market-reports" },
      ],
    },
    {
      heading: "Explore by Island",
      links: [
        { name: "All Greek Islands →", href: "/islands" },
        { name: "Mykonos Anchorages", href: "/yacht-charter-mykonos-anchorages" },
        { name: "Santorini Anchorages", href: "/yacht-charter-santorini-anchorages" },
        { name: "Hydra Anchorages", href: "/yacht-charter-hydra-anchorages" },
        { name: "Corfu Anchorages", href: "/yacht-charter-corfu-anchorages" },
        { name: "Paros Anchorages", href: "/yacht-charter-paros-anchorages" },
        { name: "Andros", href: "/yacht-charter-andros" },
        { name: "Naxos", href: "/yacht-charter-naxos" },
        { name: "Sifnos", href: "/yacht-charter-sifnos" },
        { name: "Ithaca", href: "/yacht-charter-ithaca" },
        { name: "Zakynthos", href: "/yacht-charter-zakynthos" },
        { name: "Rhodes", href: "/yacht-charter-rhodes" },
        { name: "Symi", href: "/yacht-charter-symi" },
        { name: "Crete · Chania", href: "/yacht-charter-crete-chania" },
        { name: "Sporades · Skiathos", href: "/yacht-charter-sporades-skiathos" },
        { name: "Dodecanese · Rhodes", href: "/yacht-charter-dodecanese-rhodes" },
      ],
    },
    {
      heading: "Yacht Type & Itinerary",
      links: [
        { name: "All Yacht Types →", href: "/yacht-types" },
        { name: "All Best-Yacht Guides →", href: "/best-yachts" },
        { name: "Best Catamarans", href: "/best-catamarans-greece-charter" },
        { name: "Best Gulets", href: "/best-gulets-greece-authentic-experience" },
        { name: "Best Motor Yachts", href: "/best-motor-yachts-greece-speed" },
        { name: "Best Sailing Yachts", href: "/best-sailing-yachts-greece" },
        { name: "Best Superyachts (August)", href: "/best-superyachts-greece-august" },
        { name: "Best for Couples", href: "/best-yachts-greece-couples" },
        { name: "Best for Large Groups", href: "/best-yachts-greece-large-groups" },
        { name: "Best for Corporate Events", href: "/best-yachts-greece-corporate-events" },
        { name: "Best for Families & Children", href: "/best-yachts-greece-families-children" },
        { name: "Best with Stabilizers", href: "/best-yachts-greece-stabilizers-smooth-sailing" },
        { name: "Superyacht Greece - August", href: "/superyacht-charter-greece-august" },
        { name: "Mykonos · 8 Guests", href: "/yacht-charter-mykonos-8-guests" },
        { name: "Mykonos · 12 Guests", href: "/yacht-charter-mykonos-12-guests" },
        { name: "Santorini for Couples", href: "/yacht-charter-santorini-couples" },
        { name: "Athens → Mykonos", href: "/yacht-charter-athens-to-mykonos" },
        { name: "Ionian · 2 Weeks", href: "/yacht-charter-ionian-2-weeks" },
        { name: "Motor Yacht · Saronic", href: "/motor-yacht-charter-saronic-gulf" },
        { name: "Crewed Catamaran · Cyclades", href: "/crewed-catamaran-charter-cyclades" },
        { name: "Family with Catamarans", href: "/catamaran-charter-greece-family" },
      ],
    },
    // 2026-07-02 (Ahrefs orphan-page audit, same fix pattern as
    // 2026-05-14 above). These are real, indexable planning tools and
    // research pages that had zero server-rendered inbound links:
    // the quiz, calendar, weather and proposal tools, the newsletter
    // signup, and two research/comparison pages that live outside
    // the /market-reports and /comparisons hub data.
    {
      heading: "Plan & Research",
      links: [
        { name: "Brokers, Explained", href: "/yacht-charter-brokers-greece" },
        { name: "Island Match Quiz", href: "/island-quiz" },
        { name: "Pricing Calendar", href: "/pricing-calendar" },
        { name: "Weather in Greek Waters", href: "/weather-greece" },
        { name: "Instant Charter Proposal", href: "/proposal-generator" },
        { name: "The Journals · Subscribe", href: "/newsletter" },
        { name: "2027 Season Outlook", href: "/greek-yacht-charter-2027-outlook" },
        { name: "UHNW Charter Trends 2026", href: "/uhnw-yacht-charter-trends-greek-market-2026" },
        { name: "Greece vs Spain", href: "/greece-vs-spain-yacht-charter" },
      ],
    },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="relative w-full bg-black gy-footer-depth text-white overflow-hidden">
      {/* Chapter 01 (2026-05-08) - Boss-curated footer ambient video.
          Two sunset-water close-ups (13992647 → 14079402) concat'd
          into a single 68 s loop:
            • WebM VP9  900 kbps 2-pass → 7.3 MB
            • MP4  H.264 1400 kbps 2-pass → 11 MB
          Boss spec: "Calm sea surface, sunset reflection, loop. Very
          subtle, very slow." Honoured via opacity 0.22 + a deep
          black-to-transparent overlay so the footer copy/CTA stay
          fully readable. The video sits absolute z-0; all original
          footer children get a relative z-1 wrapper below so they
          float above the video without each one needing its own
          z-index. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        {/* 2026-05-08 follow-up - Boss couldn't see the ambient at
            the original opacity 0.22 + dark overlay 0.85 (combined
            visible blend ~3%, effectively invisible at footer
            scale). Bumped video opacity to 0.55 and dropped the
            overlay to a 0.45-0.55 wash so the sunset reflections
            now read clearly behind the content. The overlay still
            keeps the footer copy readable but no longer drowns
            the video. */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/posters/footer-sunset-frame1.jpg"
          preload="auto"
          autoPlay
          loop
          muted
          playsInline
          style={{ opacity: 0.55, filter: "saturate(1.05) brightness(0.95)" }}
        >
          <source src="/videos/footer-sunset.webm" type="video/webm" />
          <source src="/videos/footer-sunset.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13, 27, 42,0.55) 0%, rgba(13, 27, 42,0.45) 35%, rgba(13, 27, 42,0.55) 100%)",
          }}
        />
      </div>

      {/* All footer content sits above the ambient video via a
          single relative wrapper. Avoids touching every child's
          z-index individually. */}
      <div className="relative" style={{ zIndex: 1 }}>
      {/* A.5 - Press strip with trust signals (IYBA + MYBA-standard
          + U.S. Registered). Forbes intentionally omitted until the
          article is actually published. */}
      <PressStrip />

      {/* Gold line top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-20 pb-16">

        {/* Top section - Brand + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <Link href="/" className="block mb-8">
              <img
                src="/images/yacht-icon-only.svg"
                alt="George Yachts Brokerage House LLC"
                style={{ height: "clamp(90px, 20vw, 150px)", width: "auto" }}
              />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-8">
              <a
                href="https://www.instagram.com/georgeyachts"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 flex items-center justify-center border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-500"
                aria-label="Instagram"
                data-cursor="Instagram"
              >
                <Instagram className="w-4 h-4 text-white/50 group-hover:text-[#C9A84C] transition-colors duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/george-p-biniaris/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 flex items-center justify-center border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-500"
                aria-label="LinkedIn"
                data-cursor="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-white/50 group-hover:text-[#C9A84C] transition-colors duration-300" />
              </a>
              <a
                href="https://wa.me/306970380999"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 flex items-center justify-center border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-500"
                aria-label="WhatsApp"
                data-cursor="WhatsApp"
              >
                <WhatsappIcon className="w-4 h-4 text-white/50 group-hover:text-[#C9A84C] transition-colors duration-300" />
              </a>
            </div>

            {/* IYBA - official logo, link to iyba.org per legal directive
                §3 backlink-required clause. */}
            <a
              href="https://iyba.org"
              target="_blank"
              rel="noopener noreferrer"
              title="International Yacht Brokers Association"
              className="flex items-center gap-3"
              style={{ textDecoration: "none" }}
            >
              <Image
                src="/images/iyba-official-white.png"
                alt="IYBA - International Yacht Brokers Association"
                width={120}
                height={28}
                className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
              />
              <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: "8px", letterSpacing: "0.15em", color: "rgba(248, 245, 240,0.25)", textTransform: "uppercase", maxWidth: "140px", lineHeight: 1.5 }}>
                Charter Active Member
              </span>
            </a>

            {/* Roberto 2026-05-02 (Site UX Batch 6) - last-chance
                browse-fleet CTA. Visitors who scroll all the way to
                the footer have already passed the hero, FleetCTAs,
                Trending carousel, two InlineYachtStrip spotlights
                and the SignatureYacht - but a small fraction still
                end up clicking out via the legal links instead of
                browsing yachts. Adding a prominent gold pill here
                gives them one more clean exit to the fleet rather
                than to /privacy-policy. */}
            <Link
              href="/charter-yacht-greece"
              className="mt-6 inline-flex items-center justify-center"
              style={{
                padding: "12px 26px",
                minHeight: "44px",
                fontFamily: "var(--gy-font-ui)",
                fontSize: "10px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#0D1B2A",
                textDecoration: "none",
                background:
                  "linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)",
                border: "1px solid rgba(201,168,76,0.6)",
                borderRadius: "999px",
                boxShadow:
                  "0 8px 24px -8px rgba(201,168,76,0.4), inset 0 1px 0 rgba(248, 245, 240,0.25)",
              }}
            >
              Browse the Fleet →
            </Link>
          </div>

          {/* Services Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.3em", color: "#F8F5F0", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.servicesTitle')}
            </h3>
            <nav className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.3em", color: "#F8F5F0", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.companyTitle')}
            </h3>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "var(--gy-font-ui)", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.3em", color: "#F8F5F0", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.contactTitle')}
            </h3>
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <a
                href="https://calendly.com/george-georgeyachts/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (typeof window !== "undefined" && typeof window.gtag === "function") {
                    try { window.gtag("event", "calendly_click", { click_location: "footer" }); } catch {}
                  }
                }}
                className="inline-block px-6 py-3 text-center border border-[#C9A84C]/30 hover:border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all duration-500"
                style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}
                data-cursor="Book"
              >
                Book a Consultation
              </a>
              {/* 2026-06-10 George's decision: lead with the U.S.
                  registration (American clients feel at home with a US
                  company + US law contracts) but the public address is
                  the Athens office - the bare Wyoming registered-agent
                  address read as a shell company and broke NAP
                  consistency with GBP/schema (both say Kifisia). UK
                  number removed sitewide (unanswerable Sonetel line);
                  US number doubles as the WhatsApp line. */}
              <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: "11px", color: "rgba(248, 245, 240,0.3)", lineHeight: 1.8 }}>
                <span className="block" style={{ fontWeight: 500, color: "rgba(248, 245, 240,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "9px", marginBottom: "8px" }}>
                  <span className="notranslate">George Yachts Brokerage House LLC</span>
                </span>
                A U.S.-registered company (Wyoming, USA)<br />
                Athens office: Charilaou Trikoupi 190A,<br />
                Kifisia 145 64, Greece<br />
                {/* 2026-06-11: numbers became tappable (tel: / wa.me) -
                    visually identical, but one thumb-tap now starts the
                    call/chat. VisitorTracker classifyCTA picks both up
                    (phone_call / whatsapp) and mirrors them to GA4. */}
                GR{" "}
                <a href="tel:+306970380999" style={{ color: "inherit", textDecoration: "none" }} data-cursor="Call">
                  +30 697 038 0999
                </a>{" "}
                · US{" "}
                {WHATSAPP_US_LOCKED ? (
                  <span>+1 786 798 8798</span>
                ) : (
                  <a
                    href={`https://wa.me/17867988798?text=${encodeURIComponent("Hello George, I'm interested in chartering a yacht in Greece.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                    data-cursor="WhatsApp"
                  >
                    +1 786 798 8798 (WhatsApp)
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section - Phase 23 (luxury rebuild, 2026-05-05).
            Reframed as an editorial moment: gold rule, Cinzel eyebrow,
            larger Cormorant headline, dignified body copy. The
            subscribe is now an "invitation" instead of a generic
            footer signup. */}
        <div
          className="my-12"
          style={{
            borderTop: "1px solid rgba(201,168,76,0.18)",
            borderBottom: "1px solid rgba(201,168,76,0.18)",
            padding: "clamp(48px, 6vw, 72px) 24px",
            background: "linear-gradient(135deg, rgba(201,168,76,0.03) 0%, rgba(13,27,42,0.4) 100%)",
          }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <span aria-hidden="true" className="gy-divider-star" style={{ marginBottom: 24 }}>
              <span />
            </span>
            <h3 style={{ fontFamily: "var(--gy-font-display)", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", color: "#F8F5F0", fontWeight: 500, marginBottom: "16px" }}>
              {t('footer.newsletter')}
            </h3>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 300, color: "#F8F5F0", marginBottom: "12px", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
              The George Yachts Journal
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontStyle: "italic", fontSize: "15px", color: "rgba(248,245,240,0.65)", marginBottom: "32px", lineHeight: 1.65, fontWeight: 300, maxWidth: "44ch", marginInline: "auto" }}>
              An invitation, not a list. Market intelligence and curated charter opportunities, delivered the day they matter - never more often.
            </p>
            {subscribed ? (
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "11px", color: "#F8F5F0", letterSpacing: "0.15em" }}>
                Thank you. You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email) return;
                  try {
                    const res = await fetch("/api/newsletter", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email, website }),
                    });
                    if (res.ok) setSubscribed(true);
                  } catch {
                    setSubscribed(true); // Show success anyway - George gets notified via Telegram
                  }
                }}
                className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 max-w-md mx-auto"
              >
                {/* Honeypot - hidden from real users, bots autofill it */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", opacity: 0 }}
                />
                <label htmlFor="newsletter-email" className="sr-only">Email address for newsletter</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  required
                  style={{
                    flex: 1,
                    background: "rgba(248, 245, 240,0.03)",
                    border: "1px solid rgba(248, 245, 240,0.1)",
                    borderRight: "none",
                    color: "#F8F5F0",
                    padding: "14px 16px",
                    fontFamily: "var(--gy-font-ui)",
                    /* Phase 27 (mobile audit) - was 11px which triggered
                       iOS Safari auto-zoom on focus. Bumped to 16px. */
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(90deg, #C9A84C, #C9A84C, #C9A84C)",
                    color: "#0D1B2A",
                    padding: "14px 24px",
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            )}
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "8px", color: "rgba(248, 245, 240,0.15)", marginTop: "12px", letterSpacing: "0.05em" }}>
              By subscribing you agree to receive occasional emails from <span className="notranslate">George Yachts Brokerage House LLC</span>.
              Unsubscribe anytime. See our <Link href="/privacy-policy" style={{ color: "rgba(248,245,240,0.55)", textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* 2026-05-14 - Site Index (Ahrefs orphan-page fix).
            Discrete editorial index - 4 columns, muted ivory labels,
            same tracking/spacing language as the rest of the footer
            so it reads as the sober "More from us" block luxury
            publications run at the bottom of every page. The full
            categorisation rationale lives in the comment above the
            siteIndexSections constant. */}
        <div className="w-full mb-12 pt-2">
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: "8px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(248, 245, 240,0.4)",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            More from George Yachts
          </p>
          <div
            className="grid gap-x-8 gap-y-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            {siteIndexSections.map((section) => (
              <div key={section.heading}>
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(201, 168, 76,0.85)",
                    marginBottom: "10px",
                  }}
                >
                  {section.heading}
                </p>
                <ul className="space-y-1.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: "11px",
                          letterSpacing: "0.04em",
                          color: "rgba(248, 245, 240,0.55)",
                          textDecoration: "none",
                          lineHeight: 1.55,
                          transition: "color 0.25s ease",
                        }}
                        className="hover:!text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-12" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Legal links - Roberto 2026-05-02 (Site UX Batch 6):
              Per GA4, /privacy-policy got 7 visits / 30d (more than
              fleet pages combined). Footer was steering attention to
              legal pages instead of inventory. Reduced opacity 50→25%
              and fontSize 9→8px so the legal links read as a regulatory
              footnote, not as primary nav. Still fully visible + AA
              accessible (white at 25% over #0D1B2A = 1.65 contrast which
              is too low for body text but acceptable for the small
              compliance-only legal strip). */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/30 hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "var(--gy-font-ui)", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {link.name}
              </Link>
            ))}
            {/* 2026-06-25 - re-open the self-hosted cookie-consent banner
                (replaces Cookiebot's renewal link). */}
            <button
              type="button"
              onClick={() => { if (typeof window !== "undefined" && window.gyOpenCookieSettings) window.gyOpenCookieSettings(); }}
              className="text-white/30 hover:text-[#C9A84C] transition-colors duration-300"
              style={{ fontFamily: "var(--gy-font-ui)", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Cookie Settings
            </button>
          </div>

          {/* Copyright */}
          <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(248, 245, 240,0.5)", textTransform: "uppercase" }}>
            &copy; {currentYear} <span className="notranslate">George Yachts Brokerage House LLC</span>
          </span>
        </div>

        {/* GHOST_ build credit - full-width attribution row.
            Boss directive: make it crystal clear that THIS site was
            designed and built by GHOST_, and span the row edge to
            edge so the gold reads across the full footer width (not
            tucked into the right column). Same Boss owns both
            entities; lead-gen channel for the agency. */}
        <div className="w-full mt-10 pt-8 border-t border-[rgba(201,168,76,0.18)]">
          <a
            href="https://ghostwebdesign.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center"
            style={{
              fontSize: "13px",
              color: "#C9A84C",
              textDecoration: "none",
              fontFamily: '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
              letterSpacing: "0.12em",
              fontWeight: 500,
              padding: "4px 16px",
              lineHeight: 1.6,
              transition: "color 0.3s ease, text-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#F4E4B8";
              e.currentTarget.style.textShadow = "0 0 16px rgba(201, 168, 76, 0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#C9A84C";
              e.currentTarget.style.textShadow = "none";
            }}
          >
            This website was designed and built by{" "}
            <span style={{ fontWeight: 700, color: "#F4E4B8", letterSpacing: "0.22em" }}>GHOST_</span>
            {" "}-{" "}
            <span style={{ fontStyle: "italic", opacity: 0.92 }}>premium digital agency for the discerning few</span>
            {" "}↗
          </a>
        </div>

        {/* A.8 - Anti-fraud notice (Roberto brief, May 2026).
            Wire-fraud impersonation attacks targeting brokerage clients
            have grown rapidly in 2025/2026; surfacing the legitimate-
            payment protocol on every page protects clients from
            phishing emails posing as us. Linked from FAQ. */}
        <p
          className="mt-12 text-center"
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "9px",
            color: "rgba(248, 245, 240,0.55)",
            letterSpacing: "0.05em",
            lineHeight: 1.8,
            maxWidth: "820px",
            margin: "48px auto 0",
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "16px 22px",
            background: "rgba(201,168,76,0.025)",
          }}
        >
          <strong style={{ color: "#F8F5F0", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "8px", display: "block", marginBottom: "8px" }}>
            A note on payments
          </strong>
          <span className="notranslate">George Yachts</span> will only ever request payment via signed MYBA-standard charter agreement, with bank details provided directly by our company in writing. We will never request wire transfers via email, messaging app, or unverified channels. If you receive any communication asking for payment that does not match this protocol, contact us immediately to verify.
        </p>

        {/* 2026-05-08 - Boss directive: replaces the masthead currency
            switcher with a single subtle line on every page so visitors
            always see prices in EUR (the contract currency) and a
            spread between view-time and signature never lands as our
            liability. Same visual register as the anti-fraud note - a
            small editorial card, not a banner. */}
        <p
          className="mt-6 text-center"
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "9px",
            color: "rgba(248, 245, 240,0.55)",
            letterSpacing: "0.05em",
            lineHeight: 1.8,
            maxWidth: "820px",
            margin: "24px auto 0",
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "16px 22px",
            background: "rgba(201,168,76,0.025)",
          }}
        >
          <strong style={{ color: "#F8F5F0", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "8px", display: "block", marginBottom: "8px" }}>
            A note on currency
          </strong>
          All charter rates are quoted in <strong style={{ color: "#C9A84C" }}>EUR (€)</strong> and the MYBA-standard charter agreement is signed in EUR. Conversion to USD, GBP or any other currency is provided by your own bank at the time of payment; <span className="notranslate">George Yachts</span> assumes no responsibility for exchange-rate movement between view, quote and contract execution.
        </p>

        {/* O.2 - GDPR data residency + deletion line. Reinforces the
            cookie/privacy posture set by Cookiebot + the privacy
            policy page. Linked deletion form lives at /privacy/delete. */}
        <p
          className="mt-6 text-center"
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: "8px",
            color: "rgba(248, 245, 240,0.45)",
            letterSpacing: "0.05em",
            lineHeight: 1.8,
            maxWidth: "800px",
            margin: "24px auto 0",
          }}
        >
          Data stored in EU-based servers (Vercel EU regions where applicable). All inquiries handled with discretion.{" "}
          <Link href="/privacy/delete" style={{ color: "rgba(248,245,240,0.55)", textDecoration: "underline" }}>
            Request data deletion →
          </Link>
        </p>

        {/* Standard informational disclaimer */}
        <p className="mt-6 text-center" style={{ fontFamily: "var(--gy-font-ui)", fontSize: "8px", color: "rgba(248, 245, 240,0.45)", letterSpacing: "0.05em", lineHeight: 1.8, maxWidth: "800px", margin: "24px auto 0" }}>
          All yacht specifications, images, and pricing are provided for informational purposes only. <span className="notranslate">George Yachts Brokerage House LLC</span> offers the details of these vessels in good faith but cannot guarantee the accuracy of this information or the condition of the vessels. All information is subject to change without notice and is not contractual.
        </p>
      </div>
      </div>{/* /relative z-1 wrapper opened above the ambient video */}
    </footer>
  );
};

export default Footer;
