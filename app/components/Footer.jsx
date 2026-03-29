"use client";

import React, { useState } from "react";
import { Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import Image from "next/image";

const WhatsappIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.031 0.725C5.741 0.725 0.547 5.926 0.547 12.215C0.547 14.39 1.155 16.42 2.22 18.15L0.63 23.36l5.352-1.55c1.674 0.99 3.593 1.516 5.619 1.516c6.29 0 11.484-5.201 11.484-11.491C23.595 5.926 18.4 0.725 12.031 0.725zM17.476 15.655c-0.198 0.505-1.127 0.99-1.523 1.054c-0.342 0.054-0.695 0.078-1.574-0.373c-1.028-0.543-2.607-1.583-3.804-2.78c-1.197-1.197-2.237-2.776-2.78-3.804c-0.45-0.879-0.426-1.232-0.373-1.574c0.064-0.396 0.549-1.325 1.054-1.523c0.426-0.165 0.879-0.276 1.197-0.276c0.231 0 0.426 0.015 0.639 0.45l0.58 1.417c0.078 0.165 0.124 0.358 0.046 0.569c-0.078 0.21-0.26 0.45-0.45 0.639c-0.183 0.183-0.33 0.358-0.441 0.569c-0.111 0.21-0.26 0.385-0.137 0.609c0.124 0.223 0.639 1.152 1.518 2.031c0.879 0.879 1.808 1.455 2.031 1.518c0.223 0.124 0.398-0.023 0.609-0.137c0.21-0.111 0.385-0.26 0.569-0.441c0.183-0.183 0.426-0.375 0.639-0.45c0.21-0.078 0.403-0.032 0.569 0.046l1.417 0.58c0.435 0.211 0.546 0.665 0.373 1.197z" />
  </svg>
);

const Footer = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
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
    { name: "The Journal", href: "/blog" },
    { name: "FAQ", href: "/faq" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Cookie Policy", href: "/cookie-policy" },
  ];

  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
      {/* Gold line top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DAA520]/20 to-transparent" />

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
                style={{ height: "150px", width: "auto" }}
              />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-8">
              <a
                href="https://www.instagram.com/georgeyachts"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#DAA520]/40 transition-all duration-500"
                aria-label="Instagram"
                data-cursor="Instagram"
              >
                <Instagram className="w-4 h-4 text-white/50 group-hover:text-[#DAA520] transition-colors duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/george-p-biniaris/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#DAA520]/40 transition-all duration-500"
                aria-label="LinkedIn"
                data-cursor="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-white/50 group-hover:text-[#DAA520] transition-colors duration-300" />
              </a>
              <a
                href="https://wa.me/17867988798"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-10 h-10 flex items-center justify-center border border-white/10 hover:border-[#DAA520]/40 transition-all duration-500"
                aria-label="WhatsApp"
                data-cursor="WhatsApp"
              >
                <WhatsappIcon className="w-4 h-4 text-white/50 group-hover:text-[#DAA520] transition-colors duration-300" />
              </a>
            </div>

            {/* IYBA */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/iyba.png"
                alt="IYBA Member - International Yacht Brokers Association"
                width={80}
                height={24}
                className="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity duration-500"
              />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", maxWidth: "140px", lineHeight: 1.5 }}>
                IYBA Member Broker
              </span>
            </div>
          </div>

          {/* Services Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#DAA520", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.servicesTitle')}
            </h4>
            <nav className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/35 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#DAA520", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.companyTitle')}
            </h4>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/35 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", letterSpacing: "0.05em" }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col items-center lg:items-start">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#DAA520", textTransform: "uppercase", fontWeight: 600, marginBottom: "24px" }}>
              {t('footer.contactTitle')}
            </h4>
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <a
                href="https://calendly.com/george-georgeyachts/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-center border border-[#DAA520]/30 hover:border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520]/5 transition-all duration-500"
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

        {/* Newsletter Section */}
        <div className="border-t border-b border-white/[0.04] py-12 my-8">
          <div className="max-w-xl mx-auto text-center">
            <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#DAA520", fontWeight: 600, marginBottom: "12px" }}>
              {t('footer.newsletter')}
            </h4>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "22px", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>
              The George Yachts Journal
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "28px", lineHeight: 1.7 }}>
              Market insights, new yacht arrivals, and curated charter opportunities — delivered discreetly.
            </p>
            {subscribed ? (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "#DAA520", letterSpacing: "0.15em" }}>
                Thank you. You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                className="flex items-stretch max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRight: "none",
                    color: "#fff",
                    padding: "14px 16px",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "11px",
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
              Unsubscribe anytime. See our <Link href="/privacy-policy" style={{ color: "rgba(218,165,32,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-12" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Legal links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/20 hover:text-[#DAA520] transition-colors duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
            &copy; {currentYear} <span className="notranslate">George Yachts Brokerage House LLC</span>
          </span>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "8px", color: "rgba(255,255,255,0.12)", letterSpacing: "0.05em", lineHeight: 1.8, maxWidth: "800px", margin: "40px auto 0" }}>
          All yacht specifications, images, and pricing are provided for informational purposes only. <span className="notranslate">George Yachts Brokerage House LLC</span> offers the details of these vessels in good faith but cannot guarantee the accuracy of this information or the condition of the vessels. All information is subject to change without notice and is not contractual.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
