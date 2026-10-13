import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import "./advisor.css";

/**
 * 13/10/2026 (George): one profile layout for the Managing Broker and every
 * independent advisor. The house has no employees: the eyebrow says what each
 * person is to George Yachts, never a staff title.
 */
export default function AdvisorProfile({
  name,
  eyebrow,
  role,
  imageUrl,
  imageAlt,
  label = "About",
  paragraphs = [],
  instagramUrl,
  extraLinks = [],
  closeTitle = "Planning a week in Greek waters?",
  closeText = "Every charter is arranged by George P. Biniaris, the Managing Broker, from the first call to the last day on board.",
}) {
  return (
    <div className="adv">
      <header className="adv-hero">
        <div className="adv-hero__grid">
          <div>
            <p className="adv-eyebrow">{eyebrow}</p>
            <h1 className="adv-name notranslate">{name}</h1>
            <span className="adv-rule" aria-hidden="true" />
            <p className="adv-role">{role}</p>
          </div>
          <div className="adv-portrait">
            <img src={imageUrl} alt={imageAlt || `Portrait of ${name}`} loading="eager" decoding="async" />
          </div>
        </div>
      </header>

      <section className="adv-body">
        <div className="adv-body__inner">
          <p className="adv-body__label">{label}</p>
          {paragraphs.map((p, i) =>
            typeof p === "object" && p && p.quote ? (
              <p key={i} className="adv-para adv-quote">{p.quote}</p>
            ) : (
              <p key={i} className="adv-para">{p}</p>
            )
          )}
          <div className="adv-meta">
            <Link href="/team">The Broker &amp; Advisors</Link>
            {extraLinks.map((l) => (
              <a key={l.href} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener" } : {})}>{l.label}</a>
            ))}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
            )}
          </div>
        </div>
      </section>

      <section className="adv-close">
        <div className="adv-close__inner">
          <p className="adv-close__title">{closeTitle}</p>
          <p className="adv-close__text">{closeText}</p>
          <Link href="/contact" className="adv-close__btn">Write to George</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
