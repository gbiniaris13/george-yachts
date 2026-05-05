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

// D.5 fallback (Boss directive 2026-05-05) — many yachts already
// have a layout/floor-plan illustration in the regular gallery
// (alt text "layout plan", "Deck Layout", etc) but not yet in the
// structured deckPlans field. This renders that image as a clean
// "Deck layout" panel so visitors still see something useful.
// When Boss seeds the rich deckPlans field, the rich tabbed UI
// takes over and this fallback never fires.
function DeckLayoutFallback({ images, yachtName }) {
  const valid = (images || []).filter((i) => i && i.url);
  if (valid.length === 0) return null;
  return (
    <section className="yacht-deckplans reveal" style={{ background: '#0a0a0a', padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: 980, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#DAA520', fontWeight: 600, marginBottom: 14, textAlign: 'center' }}>
          Deck layout
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 'clamp(28px, 4vw, 40px)', color: '#fff', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.15 }}>
          Where you sleep, eat, and relax aboard <em style={{ color: '#DAA520', fontStyle: 'italic' }}>{yachtName}</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: valid.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {valid.slice(0, 4).map((img, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                background: '#0d1b2a',
                border: '1px solid rgba(218,165,32,0.3)',
              }}
            >
              <img
                src={`${img.url}?w=1400&fit=max&auto=format`}
                alt={img.alt || `${yachtName} deck layout`}
                loading="lazy"
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            textAlign: 'center',
            margin: '20px 0 0',
            fontStyle: 'italic',
          }}
        >
          Cabin-by-cabin photos included with your personalized proposal.
        </p>
      </div>
    </section>
  );
}

// D.5 — Interactive deck plans. Tabs across decks; each tab shows the
// deck illustration with absolute-positioned hotspot pins. Click a pin
// to open a modal showing the cabin photo + name. Stays out of the way
// (placed between gallery and features); skipped when empty.
function DeckPlansSection({ decks, yachtName }) {
  const valid = (decks || []).filter((d) => d && d.imageUrl);
  const [activeIdx, setActiveIdx] = useState(0);
  const [openHotspot, setOpenHotspot] = useState(null);

  useEffect(() => {
    if (!openHotspot) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenHotspot(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openHotspot]);

  if (valid.length === 0) return null;
  const active = valid[activeIdx] || valid[0];

  return (
    <section className="yacht-deckplans reveal" style={{ background: '#0a0a0a', padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 9,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: '#DAA520',
            fontWeight: 600,
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          Interactive Deck Plans
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#fff',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.15,
          }}
        >
          Where you sleep, eat, and relax aboard <em style={{ color: '#DAA520', fontStyle: 'italic' }}>{yachtName}</em>
        </h2>

        {valid.length > 1 && (
          <div
            role="tablist"
            aria-label="Deck plans"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 24,
            }}
          >
            {valid.map((d, i) => {
              const selected = i === activeIdx;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    padding: '10px 18px',
                    background: selected ? 'rgba(218,165,32,0.18)' : 'transparent',
                    color: selected ? '#DAA520' : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${selected ? '#DAA520' : 'rgba(255,255,255,0.18)'}`,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  {d.deck || `Deck ${i + 1}`}
                </button>
              );
            })}
          </div>
        )}

        <div
          style={{
            position: 'relative',
            width: '100%',
            border: '1px solid rgba(218,165,32,0.3)',
            background: '#0d1b2a',
          }}
        >
          <img
            src={`${active.imageUrl}?w=1600&fit=max&auto=format`}
            alt={`${active.deck || 'Deck'} plan of ${yachtName}`}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
          {(active.hotspots || [])
            .filter((h) => typeof h?.x === 'number' && typeof h?.y === 'number')
            .map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpenHotspot(h)}
                aria-label={`Open photo of ${h.cabinName || 'cabin'}`}
                style={{
                  position: 'absolute',
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#DAA520',
                  border: '3px solid #fff',
                  boxShadow: '0 0 0 6px rgba(218,165,32,0.25)',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0a0a0a',
                  animation: 'd5HotspotPulse 2.4s ease-in-out infinite',
                }}
                className="d5-hotspot"
              >
                {i + 1}
              </button>
            ))}
        </div>

        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            textAlign: 'center',
            margin: '20px 0 0',
            fontStyle: 'italic',
          }}
        >
          Click any gold pin to see a photo of that cabin or area.
        </p>
      </div>

      {openHotspot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openHotspot.cabinName || 'Cabin photo'}
          onClick={() => setOpenHotspot(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 920,
              width: '100%',
              background: '#0a0a0a',
              border: '1px solid rgba(218,165,32,0.4)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpenHotspot(null)}
              aria-label="Close cabin photo"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                background: 'rgba(0,0,0,0.6)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
                zIndex: 2,
              }}
            >
              ✕
            </button>
            {openHotspot.photoUrl ? (
              <img
                src={`${openHotspot.photoUrl}?w=1600&fit=max&auto=format`}
                alt={openHotspot.cabinName || 'Cabin'}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
            ) : (
              <div
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 14,
                }}
              >
                Photo coming soon.
              </div>
            )}
            {openHotspot.cabinName && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: '#fff',
                  margin: 0,
                  padding: '14px 18px',
                  borderTop: '1px solid rgba(218,165,32,0.3)',
                  background: '#0a0a0a',
                }}
              >
                {openHotspot.cabinName}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// D.6 — Matterport 3D tour. Click-to-load: the heavy Matterport bundle
// only ships when the visitor explicitly opts in via the CTA. Saves
// ~1-2MB initial weight on every yacht page that has a tour configured.
function MatterportSection({ url, yachtName }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="yacht-matterport reveal" style={{ background: '#0a0a0a', padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 9,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: '#DAA520',
            fontWeight: 600,
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          Walk the yacht in 3D
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#fff',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.15,
          }}
        >
          Step aboard <em style={{ color: '#DAA520', fontStyle: 'italic' }}>{yachtName}</em> from anywhere
        </h2>

        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open the 360° interactive 3D tour of ${yachtName}`}
            style={{
              display: 'block',
              width: '100%',
              minHeight: 320,
              cursor: 'pointer',
              border: '1px solid rgba(218,165,32,0.45)',
              background:
                'linear-gradient(135deg, rgba(218,165,32,0.08) 0%, rgba(13,27,42,0.85) 100%)',
              padding: '64px 24px',
              transition: 'border-color 0.3s ease, background 0.3s ease',
            }}
            className="d6-matterport-trigger"
          >
            <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  border: '1px solid rgba(218,165,32,0.6)',
                  marginBottom: 18,
                  fontSize: 26,
                  color: '#DAA520',
                }}
              >
                ▶
              </span>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: '#fff',
                  margin: '0 0 12px',
                }}
              >
                Take a 3D Tour →
              </p>
              <p
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.65)',
                  margin: 0,
                }}
              >
                A full 360° walkthrough of every cabin, salon, and deck — powered by Matterport. Loads on click to keep the page fast.
              </p>
            </div>
          </button>
        ) : (
          <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
            <iframe
              src={url}
              title={`3D Matterport tour of ${yachtName}`}
              loading="lazy"
              allow="xr-spatial-tracking; fullscreen"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: '1px solid rgba(218,165,32,0.35)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

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

        {/* D.5 — INTERACTIVE DECK PLANS (rich) when populated, else
            simpler layout-image fallback drawn from existing gallery
            images whose alt text flags them as a deck layout (per
            Boss directive 2026-05-05). */}
        {Array.isArray(yacht.deckPlans) && yacht.deckPlans.length > 0 ? (
          <DeckPlansSection decks={yacht.deckPlans} yachtName={yacht.name} />
        ) : (
          Array.isArray(yacht.layoutImages) && yacht.layoutImages.length > 0 && (
            <DeckLayoutFallback images={yacht.layoutImages} yachtName={yacht.name} />
          )
        )}

        {/* D.6 — MATTERPORT 3D TOUR (lazy / click-to-load) */}
        {yacht.matterportEmbedUrl && (
          <MatterportSection url={yacht.matterportEmbedUrl} yachtName={yacht.name} />
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

        {/* D.8 (Roberto brief, May 2026) — Crew profiles section
            REMOVED per Boss directive 2026-05-05. Yacht owners can
            change crew without notifying us; if we surface specific
            people on the public yacht page we expose ourselves to
            client disappointment when an introduced captain or chef
            isn't actually onboard. The legacy free-text crew field
            in the specs row stays — that's count-of-roles, no individuals,
            which is safe to publish. */}

        {/* D.7 — SAMPLE 7-DAY ROUTE */}
        {yacht.sampleItinerary && Array.isArray(yacht.sampleItinerary.days) && yacht.sampleItinerary.days.length > 0 && (
          <section className="yacht-itinerary reveal" style={{ background: '#0a0a0a', padding: '64px 24px' }}>
            <div className="container" style={{ maxWidth: 880, margin: '0 auto' }}>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 9,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#DAA520',
                  fontWeight: 600,
                  marginBottom: 14,
                  textAlign: 'center',
                }}
              >
                A Sample 7-Day Route
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  color: '#fff',
                  textAlign: 'center',
                  margin: '0 0 8px',
                  lineHeight: 1.15,
                }}
              >
                What a week aboard <em style={{ color: '#DAA520', fontStyle: 'italic' }}>{yacht.name}</em> can look like
              </h2>
              {yacht.sampleItinerary.totalDistance && (
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.55)',
                    textAlign: 'center',
                    margin: '0 0 36px',
                  }}
                >
                  Total: {yacht.sampleItinerary.totalDistance}
                </p>
              )}

              {/* D.7 — Stylized route SVG. Generic per-yacht: N dots
                  (one per day) connected by a flowing gold line. Works
                  for any itinerary length, no per-yacht coordinates
                  needed. Aria-hidden because the timeline below is the
                  authoritative content. */}
              <svg
                viewBox={`0 0 ${Math.max(yacht.sampleItinerary.days.length * 90, 540)} 80`}
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: 720,
                  height: 'auto',
                  margin: '8px auto 0',
                }}
              >
                {(() => {
                  const n = yacht.sampleItinerary.days.length;
                  const w = Math.max(n * 90, 540);
                  const padX = 30;
                  const innerW = w - padX * 2;
                  const stepX = n > 1 ? innerW / (n - 1) : 0;
                  const cy = 40;
                  const points = Array.from({ length: n }, (_, i) => ({
                    x: padX + i * stepX,
                    y: cy + (i % 2 === 0 ? -10 : 10),
                  }));
                  const pathD = points
                    .map((p, i) => {
                      if (i === 0) return `M ${p.x} ${p.y}`;
                      const prev = points[i - 1];
                      const cx1 = prev.x + stepX / 2;
                      const cx2 = p.x - stepX / 2;
                      return `C ${cx1} ${prev.y} ${cx2} ${p.y} ${p.x} ${p.y}`;
                    })
                    .join(' ');
                  return (
                    <>
                      <path d={pathD} stroke="#DAA520" strokeWidth="1.2" fill="none" opacity="0.7" />
                      {points.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="5" fill="#0a0a0a" stroke="#DAA520" strokeWidth="1.5" />
                          <text
                            x={p.x}
                            y={p.y + (i % 2 === 0 ? -14 : 22)}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.55)"
                            fontFamily="'Montserrat', sans-serif"
                            fontSize="9"
                            letterSpacing="0.18em"
                          >
                            D{yacht.sampleItinerary.days[i].day || i + 1}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              <ol
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '40px 0 0',
                  borderLeft: '1px solid rgba(218,165,32,0.3)',
                }}
              >
                {yacht.sampleItinerary.days.map((leg, i) => (
                  <li
                    key={i}
                    style={{
                      position: 'relative',
                      padding: '0 0 36px 28px',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: -7,
                        top: 6,
                        width: 13,
                        height: 13,
                        borderRadius: '50%',
                        background: '#0a0a0a',
                        border: '2px solid #DAA520',
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 9,
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: '#DAA520',
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      Day {leg.day}
                      {leg.distance && (
                        <span style={{ marginLeft: 12, color: 'rgba(255,255,255,0.55)' }}>
                          · {leg.distance}
                        </span>
                      )}
                    </div>
                    {(leg.from || leg.to) && (
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontWeight: 400,
                          fontSize: 22,
                          color: '#fff',
                          margin: '0 0 8px',
                          lineHeight: 1.25,
                        }}
                      >
                        {leg.from}
                        {leg.from && leg.to && (
                          <span style={{ color: '#DAA520', margin: '0 10px', fontWeight: 300 }}>→</span>
                        )}
                        {leg.to}
                      </h3>
                    )}
                    {leg.narrative && (
                      <p
                        style={{
                          fontFamily: "'Lato', 'Montserrat', sans-serif",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: 'rgba(255,255,255,0.72)',
                          margin: 0,
                          maxWidth: 640,
                        }}
                      >
                        {leg.narrative}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.55)',
                  textAlign: 'center',
                  margin: '32px 0 24px',
                  fontStyle: 'italic',
                }}
              >
                Indicative only — every charter is shaped around your group, the wind, and the season.
              </p>

              {/* D.7 brief — CTA below the timeline */}
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Link
                  href="/itinerary-builder"
                  style={{
                    display: 'inline-block',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: '#DAA520',
                    fontWeight: 600,
                    padding: '14px 28px',
                    border: '1px solid rgba(218,165,32,0.55)',
                    textDecoration: 'none',
                    transition: 'background 0.3s ease, border-color 0.3s ease',
                  }}
                  className="d7-build-cta"
                >
                  Build a fully custom itinerary →
                </Link>
              </div>
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
