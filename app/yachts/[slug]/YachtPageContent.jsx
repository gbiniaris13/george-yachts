'use client';

// Yacht detail page — rebuilt May 2026 per Roberto brief.
//
// New section order (top → bottom):
//   1. Breadcrumb trail (A.6)
//   2. Hero photo
//   3. SPECS STRIP (length · guests · cabins · year · builder · region)
//   4. PRICE BLOCK with unit badge + APA/VAT note (D.1)
//   5. Sticky inquire CTA appears after 200px scroll (D.2)
//   6. PHOTO GALLERY (D.3)
//   7. KEY FEATURES + WATER TOYS (existing)
//   8. GEORGE'S INSIDE INFO (anchored ABOVE editorial copy now)
//   9. EDITORIAL DESCRIPTION (the long-form moves to closing chapter)
//  10. CTA SECTION (existing — WhatsApp + Express modal trigger)
//  11. Back link
//
// The express inquiry modal (D.4) opens from the sticky CTA + the
// new "Request a personal proposal" primary CTA. Telegram fires
// immediately on submit.

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import Lightbox from './Lightbox';
import WhatsAppEnquiry from '@/app/components/WhatsAppEnquiry';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';
import PriceBlock from '@/app/components/PriceBlock';
import ExpressInquiryModal from '@/app/components/ExpressInquiryModal';
import { isPerPerson } from '@/lib/pricing';

export default function YachtPageContent({ yacht, heroImage, description }) {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  // GA4 yacht_view event — fires once per yacht detail mount.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
    try {
      window.gtag('event', 'yacht_view', {
        yacht_name: yacht?.name,
        yacht_slug: yacht?.slug?.current,
        cruising_region: yacht?.cruisingRegion,
        weekly_rate: yacht?.weeklyRatePrice,
        builder: yacht?.builder,
        sleeps: yacht?.sleeps,
      });
    } catch {}
  }, [yacht?.name, yacht?.slug?.current]);

  // D.2 — Sticky inquire bar: appear after 200px scroll, hide when
  // approaching the in-page CTA section so the two don't fight.
  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const yachtType =
    yacht?.fleetTier === 'explorer' ? 'Explorer Fleet'
    : (yacht?.subtitle || yacht?.builder || 'Charter Fleet');

  const breadcrumbItems = [
    { name: 'Home', url: 'https://georgeyachts.com/' },
    { name: 'Charter Fleet', url: 'https://georgeyachts.com/charter-yacht-greece' },
    { name: yacht?.name || 'Yacht', url: undefined },
  ];

  const openModal = () => setModalOpen(true);

  return (
    <>
      <ScrollReveal />
      <BreadcrumbSchema items={breadcrumbItems} />

      <article className="yacht-page">
        {/* HERO SECTION */}
        <section className="yacht-hero">
          {heroImage && (
            <div className="yacht-hero__image-container">
              <Image
                src={heroImage.url}
                alt={heroImage.alt || `${yacht.name} ${yacht.subtitle} — luxury yacht charter Greece`}
                fill
                priority
                className="yacht-hero__image"
                sizes="100vw"
              />
              <div className="yacht-hero__overlay" />
            </div>
          )}
          <div className="yacht-hero__content">
            <h1 className="yacht-hero__title">{yacht.name}</h1>
            <p className="yacht-hero__subtitle">
              {yacht.subtitle} · {yacht.length} · {yacht.sleeps} {t('common.guests', 'guests')}
            </p>
          </div>
        </section>

        {/* A.6 — Breadcrumb (sits below hero) */}
        <Breadcrumbs items={breadcrumbItems.map(b => ({ name: b.name, url: b.url ? new URL(b.url).pathname : undefined }))} />

        {/* D.1 — SPECS STRIP — pulled up here so the buyer sees the
            decision-grade information before the editorial. */}
        <section className="yacht-specs reveal">
          <div className="container">
            <h2 className="yacht-specs__title">{t('yacht.specsTitle', 'What Are the Specifications of')} {yacht.name}?</h2>
            <div className="yacht-specs__grid">
              {yacht.length && <Spec label={t('common.length', 'Length')} value={yacht.length} />}
              {yacht.builder && <Spec label={t('common.builder', 'Builder')} value={yacht.builder} />}
              {yacht.yearBuiltRefit && <Spec label={t('common.year', 'Year')} value={yacht.yearBuiltRefit} />}
              {yacht.sleeps && <Spec label={t('common.guests', 'Guests')} value={yacht.sleeps} />}
              {yacht.cabins && <Spec label={t('common.cabins', 'Cabins')} value={yacht.cabins} />}
              {yacht.crew && <Spec label={t('common.crew', 'Crew')} value={yacht.crew} />}
              {yacht.cruiseSpeed && <Spec label={t('common.cruiseSpeed', 'Cruise Speed')} value={yacht.cruiseSpeed} />}
              {yacht.maxSpeed && <Spec label={t('common.maxSpeed', 'Max Speed')} value={yacht.maxSpeed} />}
            </div>
          </div>
        </section>

        {/* D.1 — PRICE BLOCK — uses the unit-aware PriceBlock helper.
            Sits immediately after specs so the buyer's price question
            is answered up-front (per Camper / Burgess / Fraser
            convention). 0.7 — every price has a unit badge. */}
        {yacht.weeklyRatePrice && (
          <section className="yacht-pricing reveal" style={{ background: '#0a0a0a', padding: '48px 24px' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <h2 className="yacht-pricing__title" style={{ marginBottom: 0 }}>
                {t('yacht.pricingTitle', 'What Is the Weekly Charter Rate for')} {yacht.name}?
              </h2>
              <PriceBlock yacht={yacht} size="lg" showApaNote className="yacht-price-block" />
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={openModal}
                  data-cursor="Inquire"
                  style={{
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)',
                    color: '#0a1a2f',
                    border: '1px solid rgba(218,165,32,0.6)',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Request a personal proposal →
                </button>
                <a
                  href={`https://wa.me/17867988798?text=${encodeURIComponent(`Hi George — could you share availability and rates for ${yacht.name}?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="WhatsApp"
                  style={{
                    padding: '14px 32px',
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '11px',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  WhatsApp George
                </a>
              </div>
            </div>
          </section>
        )}

        {/* D.3 — PHOTO GALLERY pulled up so visitors see the yacht
            within the first 1500px of scroll, not 5000px. */}
        {yacht.images && yacht.images.length > 1 && (
          <section className="yacht-gallery">
            <div className="container">
              <h2 className="yacht-gallery__title">{t('yacht.galleryTitle', 'What Does')} {yacht.name} {t('yacht.lookLike', 'Look Like Inside and Out')}?</h2>
              <Lightbox
                images={yacht.images.slice(1)}
                yachtName={yacht.name}
              />
            </div>
          </section>
        )}

        {/* KEY FEATURES */}
        {yacht.features && yacht.features.length > 0 && (
          <section className="yacht-features reveal">
            <div className="container">
              <h2 className="yacht-features__title">{t('yacht.featuresTitle', 'What Features Make')} {yacht.name} {t('yacht.standOut', 'Stand Out')}?</h2>
              <ul className="yacht-features__list">
                {yacht.features.map((feature, index) => (
                  <li key={index} className="yacht-features__item">
                    <span className="yacht-features__check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* WATER TOYS */}
        {yacht.toys && yacht.toys.length > 0 && (
          <section className="yacht-toys reveal">
            <div className="container">
              <h2 className="yacht-toys__title">{t('yacht.toysTitle', 'What Water Toys Are Available on')} {yacht.name}?</h2>
              <ul className="yacht-toys__list">
                {yacht.toys.map((toy, index) => (
                  <li key={index} className="yacht-toys__item">{toy}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* IDEAL FOR */}
        {yacht.idealFor && (
          <section className="yacht-ideal reveal">
            <div className="container">
              <h2 className="yacht-ideal__title">{t('yacht.idealTitle', 'Who Is')} {yacht.name} {t('yacht.idealFor', 'Ideal For')}?</h2>
              <p className="yacht-ideal__text">{yacht.idealFor}</p>
            </div>
          </section>
        )}

        {/* GEORGE'S INSIDE INFO — anchored above editorial copy so
            the highest-value differentiator (insider tip) hits
            visitors before the long-form. */}
        {yacht.georgeInsiderTip && (
          <section className="yacht-insider reveal">
            <div className="container">
              <div className="yacht-insider__card">
                <div className="yacht-insider__header">
                  <span className="yacht-insider__icon">💬</span>
                  <h2 className="yacht-insider__title">{t('yacht.insiderTitle', "George's Inside Info")}</h2>
                </div>
                <blockquote className="yacht-insider__quote" cite="https://georgeyachts.com/team/george-biniaris">
                  &ldquo;{yacht.georgeInsiderTip}&rdquo;
                </blockquote>
                <p className="yacht-insider__signature">
                  — <span itemProp="author">George P. Biniaris</span>, {t('yacht.managingBroker', 'Managing Broker')} &amp; IYBA {t('yacht.member', 'Member')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* EDITORIAL STORY — moved to closing chapter so the page is
            usable for buyers who want decisions, but still complete
            for SEO + AI citations. */}
        {description && (
          <section className="yacht-story reveal">
            <div className="container">
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#DAA520',
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                The Yacht in Detail
              </p>
              <PortableText value={description} />
            </div>
          </section>
        )}

        {/* CTA SECTION */}
        <section className="yacht-cta reveal">
          <div className="container">
            <div className="gold-line mb-12" />
            <span className="label-text block text-center mb-4">
              {t('yacht.beginJourney', 'Begin Your Journey')}
            </span>
            <h2 className="text-4xl md:text-5xl font-marcellus text-white text-center mb-4 uppercase tracking-wide">
              {t('yacht.experience', 'Experience')}{' '}
              <span className="gradient-gold italic font-light">{yacht.name}</span>
            </h2>
            <p className="text-white/75 text-center max-w-2xl mx-auto mb-12">
              {t('yacht.ctaText', 'Ready to explore the Greek islands aboard this magnificent vessel? Choose how you\'d like to connect.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                type="button"
                onClick={openModal}
                className="btn-primary"
                style={{ cursor: 'pointer' }}
              >
                Request a personal proposal
              </button>
              <a
                href={`https://wa.me/17867988798?text=${encodeURIComponent(`Hi, I'm interested in chartering ${yacht.name} — could you share availability and rates?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {t('yacht.whatsappInquiry', 'Inquire on WhatsApp')}
              </a>
            </div>
            <p className="text-center text-white/60 text-xs mt-8 tracking-widest uppercase">
              {t('yacht.servicePromise', 'Personal service · No obligation · Response within 24 hours')}
            </p>
          </div>
        </section>

        {/* BACK LINK */}
        <section className="yacht-back">
          <div className="container">
            <Link href="/charter-yacht-greece" className="yacht-back__link">
              ← {t('yacht.viewAllYachts', 'View All Charter Yachts')}
            </Link>
          </div>
        </section>
      </article>

      {/* D.2 — Sticky Inquire bar (appears after scrolling past the
          hero). Always reachable; click opens the express modal.
          Uses the global --gy-top-offset CSS variable so when the
          Forbes feature bar is present, this bar stacks below it
          instead of being hidden underneath. */}
      {stickyVisible && (
        <div
          aria-label={`Sticky inquire bar for ${yacht.name}`}
          style={{
            position: 'fixed',
            top: 'var(--gy-top-offset, 0px)',
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(218,165,32,0.25)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            fontFamily: "'Montserrat', sans-serif",
            transform: 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18,
                color: '#fff',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {yacht.name}
            </span>
            {yacht.weeklyRatePrice && (
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#DAA520',
                  fontWeight: 600,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {isPerPerson(yacht) ? 'Per person · ' : 'Per yacht · '}{yacht.weeklyRatePrice}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={openModal}
            data-cursor="Inquire"
            style={{
              flex: '0 0 auto',
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)',
              color: '#0a1a2f',
              border: '1px solid rgba(218,165,32,0.6)',
              fontSize: 10,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Request proposal →
          </button>
        </div>
      )}

      {/* D.4 — Express inquiry modal */}
      <ExpressInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        yachtSlug={yacht?.slug?.current || yacht?.slug}
        yachtName={yacht.name}
        source="yacht_detail_express"
      />

      {/* Sticky WhatsApp Enquiry */}
      <WhatsAppEnquiry yachtName={yacht.name} />
    </>
  );
}

function Spec({ label, value }) {
  return (
    <div className="yacht-specs__item">
      <span className="yacht-specs__label">{label}</span>
      <span className="yacht-specs__value">{value}</span>
    </div>
  );
}
