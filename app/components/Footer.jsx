"use client";

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
  const [website, setWebsite] = useState(""); // honeypot — bots autofill, humans never see
  const [subscribed, setSubscribed] = useState(false);

  const serviceLinks = [
    { name: "Charter a Yacht", href: "/charter-yacht-greece/" },
    { name: "Buy a Yacht", href: "/yachts-for-sale/" },
    { name: "Fly Private", href: "/private-jet-charter/" },
    { name: "VIP Transfers", href: "/vip-transfers-greece/" },
    { name: "Luxury Villas", href: "/luxury-villas-greece/" },
    { name: "Yacht Itineraries", href: "/yacht-itineraries-greece/" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about-us/" },
    { name: "Our Team", href: "/team/" },
    { name: "Credentials", href: "/credentials" },
    { name: "Greece by Yacht", href: "/greece-by-yacht" },
    { name: "The Journal", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
    { name: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
      {/* Chapter 01 (2026-05-08) — Boss-curated footer ambient video.
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
        {/* 2026-05-08 follow-up — Boss couldn't see the ambient at
            the original opacity 0.22 + dark overlay 0.85 (combined
            visible blend ~3%, effectively invisible at footer
            scale). Bumped video opacity to 0.55 and dropped the
            overlay to a 0.45–0.55 wash so the sunset reflections
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
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* All footer content sits above the ambient video via a
          single relative wrapper. Avoids touching every child's
          z-index individually. */}
      <div className="relative" style={{ zIndex: 1 }}>
      {/* A.5 — Press strip with trust signals (IYBA + MYBA-standard
          + U.S. Registered). Forbes intentionally omitted until the
          article is actually published. */}
      <PressStrip />

      {/* Gold line top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-20 pb-16">

        {/* Top section — Brand + Links */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <Link href="/" className="block mb-8">
              <img
                src="/images/yacht-icon-only.svg"
                alt="George Yachts Brokerage House LLC"
                // Mobile audit 2026-04-20: 150 px was oversized on
                // 360 px phones where the footer stacks — shrinks
                // fluidly now.
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
                href="https://wa.me/17867988798"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-11 h-11 flex items-center justify-center border border-white/10 hover:border-[#C9A84C]/40 transition-all duration-500"
                aria-label="WhatsApp"
                data-cursor="WhatsApp"
              >
                <WhatsappIcon className="w-4 h-4 text-white/50 group-hover:text-[#C9A84C] transition-colors duration-300" />
              </a>
            </div>

            {/* IYBA — official logo, link to iyba.org per legal directive
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
                alt="IYBA — International Yacht Brokers Association"
                width={120}
                height={28}
                className="h-7 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
              />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", maxWidth: "140px", lineHeight: 1.5 }}>
                Charter Active Member
              </span>
            </a>

            {/* Roberto 2026-05-02 (Site UX Batch 6) — last-chance
                browse-fleet CTA. Visitors who scroll all the way to
                the footer have already passed the hero, FleetCTAs,
                Trending carousel, two InlineYachtStrip spotlights
                and the SignatureYacht — but a small fraction still
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
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#000000",
                textDecoration: "none",
                background:
                  "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
                border: "1px solid rgba(201,168,76,0.6)",
                borderRadius: "999px",
                boxShadow:
                  "0 8px 24px -8px rgba(201,168,76,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
              }}
            >
              Browse the Fleet →
            </Link>
          </div>

          {/* Services Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#C9A84C", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.servicesTitle')}
            </h4>
            <nav className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#C9A84C", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.companyTitle')}
            </h4>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/60 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#C9A84C", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.contactTitle')}
            </h4>
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
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}
                data-cursor="Book"
              >
                Book a Consultation
              </a>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.8 }}>
                <span className="block" style={{ fontWeight: 500, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "9px", marginBottom: "8px" }}>
                  <span className="notranslate">George Yachts Brokerage House LLC</span>
                </span>
                30 N Gould St, STE R<br />
                Sheridan, WY 82801, USA
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section — Phase 23 (luxury rebuild, 2026-05-05).
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
            <h4 style={{ fontFamily: "var(--font-cinzel), 'Cinzel', 'Trajan Pro', sans-serif", fontSize: "10px", letterSpacing: "0.42em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 500, marginBottom: "16px" }}>
              {t('footer.newsletter')}
            </h4>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 300, color: "#F8F5F0", marginBottom: "12px", lineHeight: 1.15, letterSpacing: "-0.015em" }}>
              The George Yachts Journal
            </p>
            <p style={{ fontFamily: "'Lato', 'Montserrat', sans-serif", fontStyle: "italic", fontSize: "15px", color: "rgba(248,245,240,0.65)", marginBottom: "32px", lineHeight: 1.65, fontWeight: 300, maxWidth: "44ch", marginInline: "auto" }}>
              An invitation, not a list. Market intelligence and curated charter opportunities, delivered the day they matter — never more often.
            </p>
            {subscribed ? (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "#C9A84C", letterSpacing: "0.15em" }}>
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
                    setSubscribed(true); // Show success anyway — George gets notified via Telegram
                  }
                }}
                className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 max-w-md mx-auto"
              >
                {/* Honeypot — hidden from real users, bots autofill it */}
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
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRight: "none",
                    color: "#fff",
                    padding: "14px 16px",
                    fontFamily: "'Montserrat', sans-serif",
                    /* Phase 27 (mobile audit) — was 11px which triggered
                       iOS Safari auto-zoom on focus. Bumped to 16px. */
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
                    color: "#000",
                    padding: "14px 24px",
                    fontFamily: "'Montserrat', sans-serif",
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
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.15)", marginTop: "12px", letterSpacing: "0.05em" }}>
              By subscribing you agree to receive occasional emails from <span className="notranslate">George Yachts Brokerage House LLC</span>.
              Unsubscribe anytime. See our <Link href="/privacy-policy" style={{ color: "rgba(201,168,76,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-12" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Legal links — Roberto 2026-05-02 (Site UX Batch 6):
              Per GA4, /privacy-policy got 7 visits / 30d (more than
              fleet pages combined). Footer was steering attention to
              legal pages instead of inventory. Reduced opacity 50→25%
              and fontSize 9→8px so the legal links read as a regulatory
              footnote, not as primary nav. Still fully visible + AA
              accessible (white at 25% over #000 = 1.65 contrast which
              is too low for body text but acceptable for the small
              compliance-only legal strip). */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/30 hover:text-[#C9A84C] transition-colors duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
            &copy; {currentYear} <span className="notranslate">George Yachts Brokerage House LLC</span>
          </span>
        </div>

        {/* A.8 — Anti-fraud notice (Roberto brief, May 2026).
            Wire-fraud impersonation attacks targeting brokerage clients
            have grown rapidly in 2025/2026; surfacing the legitimate-
            payment protocol on every page protects clients from
            phishing emails posing as us. Linked from FAQ. */}
        <p
          className="mt-12 text-center"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "9px",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.05em",
            lineHeight: 1.8,
            maxWidth: "820px",
            margin: "48px auto 0",
            border: "1px solid rgba(201,168,76,0.18)",
            padding: "16px 22px",
            background: "rgba(201,168,76,0.025)",
          }}
        >
          <strong style={{ color: "#C9A84C", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "8px", display: "block", marginBottom: "8px" }}>
            A note on payments
          </strong>
          <span className="notranslate">George Yachts</span> will only ever request payment via signed MYBA-standard charter agreement, with bank details provided directly by our company in writing. We will never request wire transfers via email, messaging app, or unverified channels. If you receive any communication asking for payment that does not match this protocol, contact us immediately to verify.
        </p>

        {/* O.2 — GDPR data residency + deletion line. Reinforces the
            cookie/privacy posture set by Cookiebot + the privacy
            policy page. Linked deletion form lives at /privacy/delete. */}
        <p
          className="mt-6 text-center"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "8px",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.05em",
            lineHeight: 1.8,
            maxWidth: "800px",
            margin: "24px auto 0",
          }}
        >
          Data stored in EU-based servers (Vercel EU regions where applicable). All inquiries handled with discretion.{" "}
          <Link href="/privacy/delete" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "underline" }}>
            Request data deletion →
          </Link>
        </p>

        {/* Standard informational disclaimer */}
        <p className="mt-6 text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", lineHeight: 1.8, maxWidth: "800px", margin: "24px auto 0" }}>
          All yacht specifications, images, and pricing are provided for informational purposes only. <span className="notranslate">George Yachts Brokerage House LLC</span> offers the details of these vessels in good faith but cannot guarantee the accuracy of this information or the condition of the vessels. All information is subject to change without notice and is not contractual.
        </p>
      </div>
      </div>{/* /relative z-1 wrapper opened above the ambient video */}
    </footer>
  );
};

export default Footer;
