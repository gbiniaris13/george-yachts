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
import YachtCinematicTour from './YachtCinematicTour';
import WhatsAppEnquiry from '@/app/components/WhatsAppEnquiry';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';
import PriceBlock from '@/app/components/PriceBlock';
// Chapter 03 (2026-05-08) — region-aware default sample itinerary
// so every yacht detail page shows the "Sample 7-Day Route"
// section, not just yachts whose Sanity record carries a hand-
// curated itinerary.
import { resolveSampleItinerary } from '@/lib/sample-itineraries';
// Chapter 03 (2026-05-08) — feature icons. Replaces the generic
// ✓ checkmark on every feature with a context-matched glyph
// (wifi → WifiIcon, BBQ → FlameIcon, etc.). Falls back to the
// gold checkmark for keywords we don't recognise.
import {
  Wifi, Flame, Snowflake, Droplet, Anchor, Sun, Music, Tv,
  Utensils, Wind, Sailboat, Waves, Sparkles, Lightbulb, ShowerHead,
  Bath, Bed, Compass, Refrigerator, ChefHat, GlassWater, Check,
} from 'lucide-react';

// Keyword-to-icon map. Matches case-insensitively against the
// feature string. First hit wins, so order specific keywords
// before generic ones (e.g. "watermaker" before "water").
const FEATURE_ICON_MAP = [
  [/wi[- ]?fi|wireless/i, Wifi],
  [/bbq|barbecue|grill/i, Flame],
  [/air[- ]?cond|a\.?c\.?\b|climate/i, Snowflake],
  [/watermaker|desalin/i, Droplet],
  [/stabili[sz]er|seakeeper|gyro/i, Waves],
  [/anchor|mooring/i, Anchor],
  [/sundeck|sunpad|sunbath|jacuzzi|pool/i, Sun],
  [/sound[- ]?system|stereo|speaker|audio/i, Music],
  [/tv|television|cinema|screen/i, Tv],
  [/dining|table service|formal meal/i, Utensils],
  [/water[- ]?toy|paddle|kayak|sup\b/i, Sailboat],
  [/sail|rigging|spinnaker/i, Sailboat],
  [/light(ing)?|led|chandelier/i, Lightbulb],
  [/shower|rain head/i, ShowerHead],
  [/bath|tub|spa/i, Bath],
  [/cabin|stateroom|bedroom|berth/i, Bed],
  [/compass|navigation|chart plotter|gps/i, Compass],
  [/fridge|freezer|refriger/i, Refrigerator],
  [/chef|cook|galley|kitchen/i, ChefHat],
  [/wine|champagne|bar|cellar/i, GlassWater],
  [/wind|breeze/i, Wind],
  [/sparkle|polish|premium/i, Sparkles],
];

function iconForFeature(text = '') {
  for (const [regex, Icon] of FEATURE_ICON_MAP) {
    if (regex.test(text)) return Icon;
  }
  return Check;
}
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
    <section className="yacht-deckplans reveal" style={{ background: '#0D1B2A', padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: 980, margin: '0 auto' }}>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600, marginBottom: 14, textAlign: 'center' }}>
          Deck layout
        </p>
        <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontWeight: 300, fontSize: 'clamp(28px, 4vw, 40px)', color: '#F8F5F0', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.15 }}>
          Where you sleep, eat, and relax aboard <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>{yachtName}</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: valid.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {valid.slice(0, 4).map((img, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                background: '#0D1B2A',
                border: '1px solid rgba(201,168,76,0.3)',
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
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: 'rgba(248, 245, 240,0.55)',
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
    <section className="yacht-deckplans reveal" style={{ background: '#0D1B2A', padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            fontWeight: 600,
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          Interactive Deck Plans
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontWeight: 300,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#F8F5F0',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.15,
          }}
        >
          Where you sleep, eat, and relax aboard <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>{yachtName}</em>
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
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    padding: '10px 18px',
                    background: selected ? 'rgba(201,168,76,0.18)' : 'transparent',
                    color: selected ? '#C9A84C' : 'rgba(248, 245, 240,0.6)',
                    border: `1px solid ${selected ? '#C9A84C' : 'rgba(248, 245, 240,0.18)'}`,
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
            border: '1px solid rgba(201,168,76,0.3)',
            background: '#0D1B2A',
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
                  background: '#C9A84C',
                  border: '3px solid #F8F5F0',
                  boxShadow: '0 0 0 6px rgba(201,168,76,0.25)',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#0D1B2A',
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
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            color: 'rgba(248, 245, 240,0.55)',
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
            background: 'rgba(13, 27, 42, 0.85)',
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
              background: '#0D1B2A',
              border: '1px solid rgba(201,168,76,0.4)',
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
                background: 'rgba(13, 27, 42, 0.6)',
                color: '#F8F5F0',
                border: '1px solid rgba(248, 245, 240,0.3)',
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
                  color: 'rgba(248, 245, 240,0.6)',
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 14,
                }}
              >
                Photo coming soon.
              </div>
            )}
            {openHotspot.cabinName && (
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: '#F8F5F0',
                  margin: 0,
                  padding: '14px 18px',
                  borderTop: '1px solid rgba(201,168,76,0.3)',
                  background: '#0D1B2A',
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
    <section className="yacht-matterport reveal" style={{ background: '#0D1B2A', padding: '64px 24px' }}>
      <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: '#C9A84C',
            fontWeight: 600,
            marginBottom: 14,
            textAlign: 'center',
          }}
        >
          Walk the yacht in 3D
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontWeight: 300,
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: '#F8F5F0',
            textAlign: 'center',
            margin: '0 0 28px',
            lineHeight: 1.15,
          }}
        >
          Step aboard <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>{yachtName}</em> from anywhere
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
              border: '1px solid rgba(201,168,76,0.45)',
              background:
                'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(13,27,42,0.85) 100%)',
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
                  border: '1px solid rgba(201,168,76,0.6)',
                  marginBottom: 18,
                  fontSize: 26,
                  color: '#C9A84C',
                }}
              >
                ▶
              </span>
              <p
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: '#F8F5F0',
                  margin: '0 0 12px',
                }}
              >
                Take a 3D Tour →
              </p>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: 'rgba(248, 245, 240,0.65)',
                  margin: 0,
                }}
              >
                A full 360° walkthrough of every cabin, salon, and deck - powered by Matterport. Loads on click to keep the page fast.
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
                border: '1px solid rgba(201,168,76,0.35)',
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// Chapter 06 (mobile, 2026-05-08) — sticky bottom-bar "Inquire" CTA
// for mobile yacht pages. Hides whenever any input / textarea on the
// page is focused so the bar doesn't cover the field the visitor is
// typing into. Pure focus-tracking via the document's focusin /
// focusout events (works for any inquiry form anywhere on the page,
// no per-form wiring required).
function MobileInquireBar({ onClick }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const onFocusIn = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        setHidden(true);
      }
    };
    const onFocusOut = () => {
      // Defer one tick — if the next focus is also on a form field
      // we keep the bar hidden (focus moves between inputs without a
      // gap). If nothing else takes focus the bar reappears.
      setTimeout(() => {
        const a = document.activeElement;
        const t = a?.tagName;
        if (t !== "INPUT" && t !== "TEXTAREA" && t !== "SELECT") {
          setHidden(false);
        }
      }, 0);
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);
  return (
    <div className={`gy-yacht-mobile-cta ${hidden ? "gy-yacht-mobile-cta--hidden" : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className="gy-yacht-mobile-cta__btn"
        data-cursor="Inquire"
      >
        Inquire →
      </button>
    </div>
  );
}

export default function YachtPageContent({ yacht, heroImage, description }) {
  const { t } = useI18n();
  const [modalOpen, setModalOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  // Chapter 03 (2026-05-08) — resolve a sample itinerary for this
  // yacht. Sanity-curated route wins; otherwise fall back to a
  // region-appropriate Boss-approved 7-day default. Guaranteed to
  // return an object with .days[] for any yacht — the section will
  // always render below.
  const sampleItinerary = resolveSampleItinerary(yacht);

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
            <div className="yacht-hero__image-container gy-ken-burns">
              {/* Phase 2 / C1 (luxury rebuild) — Ken Burns parallax. CSS-only
                  cinematic zoom/pan reveal applied to the yacht hero image so
                  every detail page opens like a film, not a catalog page. */}
              <Image
                src={heroImage.url}
                alt={heroImage.alt || `${yacht.name} ${yacht.subtitle} - luxury yacht charter Greece`}
                fill
                priority
                className="yacht-hero__image"
                sizes="100vw"
                style={{ viewTransitionName: `yacht-cover-${yacht.slug}` }}
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

        {/* Phase 27i.10 (2026-05-07) — Diamond Journey scroll-driven
            cinematic tour. Disabled 2026-05-11 per Boss directive:
            the 300vh pinned section read as an unbroken navy gap on
            many yachts (scroll progress hard to trigger on trackpads
            + the cross-fade swap registered as "broken" UX). Gallery
            below provides the same photo access without consuming
            3 viewport heights of scroll. Component file retained in
            case we revive a shorter version later — DO NOT delete. */}
        {/* {Array.isArray(yacht.images) && yacht.images.length >= 2 && (
          <YachtCinematicTour
            images={yacht.images}
            yachtName={yacht.name}
          />
        )} */}

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
              {yacht.crew && <CrewSpec label={t('common.crew', 'Crew')} value={yacht.crew} />}
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
          <section className="yacht-pricing reveal" style={{ background: '#0D1B2A', padding: '48px 24px' }}>
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
                    background: 'linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)',
                    color: '#0D1B2A',
                    border: '1px solid rgba(201,168,76,0.6)',
                    fontFamily: "var(--gy-font-ui)",
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
                  href={`https://wa.me/306970380999?text=${encodeURIComponent(`Hi George - could you share availability and rates for ${yacht.name}?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="WhatsApp"
                  style={{
                    padding: '14px 32px',
                    background: 'transparent',
                    color: '#F8F5F0',
                    border: '1px solid rgba(248, 245, 240,0.3)',
                    fontFamily: "var(--gy-font-ui)",
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

        {/* D.3 — PHOTO GALLERY (rebuilt 2026-05-11 as editorial
            carousel + fullscreen lightbox). Now receives ALL images
            (was .slice(1) — that skipped the hero). The hero photo
            is the strongest shot we have; including it as the first
            carousel slide reinforces the impression rather than
            wasting it. The carousel renders ONE photo at a time
            (Robb Report spread), so duplication of the hero across
            the top-of-page hero section + first slide is editorial-
            correct, not visual repetition. */}
        {yacht.images && yacht.images.length > 0 && (
          <section className="yacht-gallery">
            <div className="container">
              <h2 className="yacht-gallery__title">{t('yacht.galleryTitle', 'What Does')} {yacht.name} {t('yacht.lookLike', 'Look Like Inside and Out')}?</h2>
              <Lightbox
                images={yacht.images}
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
                {yacht.features.map((feature, index) => {
                  const Icon = iconForFeature(feature);
                  return (
                    <li key={index} className="yacht-features__item">
                      <span className="yacht-features__check" aria-hidden="true">
                        <Icon width={16} height={16} strokeWidth={1.6} />
                      </span>
                      {feature}
                    </li>
                  );
                })}
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
                  - <span itemProp="author">George P. Biniaris</span>, {t('yacht.managingBroker', 'Managing Broker')} &amp; <a href="https://iyba.org" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>IYBA {t('yacht.member', 'Member')}</a>
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
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 9,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
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
        {sampleItinerary && Array.isArray(sampleItinerary.days) && sampleItinerary.days.length > 0 && (
          <section className="yacht-itinerary reveal" style={{ background: '#0D1B2A', padding: '64px 24px' }}>
            <div className="container" style={{ maxWidth: 880, margin: '0 auto' }}>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 9,
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  fontWeight: 600,
                  marginBottom: 14,
                  textAlign: 'center',
                }}
              >
                A Sample 7-Day Route
              </p>
              <h2
                style={{
                  fontFamily: "var(--gy-font-editorial)",
                  fontWeight: 300,
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  color: '#F8F5F0',
                  textAlign: 'center',
                  margin: '0 0 8px',
                  lineHeight: 1.15,
                }}
              >
                What a week aboard <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>{yacht.name}</em> can look like
              </h2>
              {sampleItinerary.totalDistance && (
                <p
                  style={{
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(248, 245, 240,0.55)',
                    textAlign: 'center',
                    margin: '0 0 36px',
                  }}
                >
                  Total: {sampleItinerary.totalDistance}
                </p>
              )}

              {/* D.7 — Stylized route SVG. Generic per-yacht: N dots
                  (one per day) connected by a flowing gold line. Works
                  for any itinerary length, no per-yacht coordinates
                  needed. Aria-hidden because the timeline below is the
                  authoritative content. */}
              <svg
                viewBox={`0 0 ${Math.max(sampleItinerary.days.length * 90, 540)} 80`}
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
                  const n = sampleItinerary.days.length;
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
                      <path d={pathD} stroke="#C9A84C" strokeWidth="1.2" fill="none" opacity="0.7" />
                      {points.map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r="5" fill="#0D1B2A" stroke="#C9A84C" strokeWidth="1.5" />
                          <text
                            x={p.x}
                            y={p.y + (i % 2 === 0 ? -14 : 22)}
                            textAnchor="middle"
                            fill="rgba(248, 245, 240,0.55)"
                            fontFamily="'Montserrat', sans-serif"
                            fontSize="9"
                            letterSpacing="0.18em"
                          >
                            D{sampleItinerary.days[i].day || i + 1}
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
                  borderLeft: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                {sampleItinerary.days.map((leg, i) => (
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
                        background: '#0D1B2A',
                        border: '2px solid #C9A84C',
                      }}
                    />
                    <div
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 9,
                        letterSpacing: '0.32em',
                        textTransform: 'uppercase',
                        color: '#C9A84C',
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      Day {leg.day}
                      {leg.distance && (
                        <span style={{ marginLeft: 12, color: 'rgba(248, 245, 240,0.55)' }}>
                          · {leg.distance}
                        </span>
                      )}
                    </div>
                    {(leg.from || leg.to) && (
                      <h3
                        style={{
                          fontFamily: "var(--gy-font-editorial)",
                          fontWeight: 400,
                          fontSize: 22,
                          color: '#F8F5F0',
                          margin: '0 0 8px',
                          lineHeight: 1.25,
                        }}
                      >
                        {leg.from}
                        {leg.from && leg.to && (
                          <span style={{ color: '#C9A84C', margin: '0 10px', fontWeight: 300 }}>→</span>
                        )}
                        {leg.to}
                      </h3>
                    )}
                    {leg.narrative && (
                      <p
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 14,
                          lineHeight: 1.65,
                          color: 'rgba(248, 245, 240,0.72)',
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
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  color: 'rgba(248, 245, 240,0.55)',
                  textAlign: 'center',
                  margin: '32px 0 24px',
                  fontStyle: 'italic',
                }}
              >
                Indicative only - every charter is shaped around your group, the wind, and the season.
              </p>

              {/* D.7 brief — CTA below the timeline */}
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <Link
                  href="/itinerary-builder"
                  style={{
                    display: 'inline-block',
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 11,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    fontWeight: 600,
                    padding: '14px 28px',
                    border: '1px solid rgba(201,168,76,0.55)',
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
            <h2
              className="text-4xl md:text-5xl text-white text-center mb-4 uppercase tracking-wide"
              style={{ fontFamily: "var(--gy-font-editorial)" }}
            >
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
                href={`https://wa.me/306970380999?text=${encodeURIComponent(`Hi, I'm interested in chartering ${yacht.name} - could you share availability and rates?`)}`}
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

      {/* Chapter 06 (mobile, 2026-05-08) — full-width "Inquire" bottom
          bar, mobile-only via the .gy-yacht-mobile-cta media query in
          globals.css. The bar hides whenever an input/textarea is
          focused so it doesn't fight with form fields the visitor is
          actively typing into (Boss spec: "εξαφανίζεται αν ο χρήστης
          scroll-άρει πάνω σε ενεργό form section"). */}
      <MobileInquireBar onClick={openModal} />

      {/* D.2 — Top sticky mini-bar (desktop), continues below */}

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
            background: 'rgba(13, 27, 42,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(201,168,76,0.25)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            fontFamily: "var(--gy-font-ui)",
            transform: 'translateY(0)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="gy-yacht-stickybar__title" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span
              style={{
                fontFamily: "var(--gy-font-editorial)",
                fontSize: 18,
                color: '#F8F5F0',
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
                className="gy-yacht-stickybar__price"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
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
            className="gy-yacht-stickybar__cta"
            style={{
              flex: '0 0 auto',
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #C9A84C 0%, #C9A84C 50%, #C9A84C 100%)',
              color: '#0D1B2A',
              border: '1px solid rgba(201,168,76,0.6)',
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
          {/* Phase 27 (Forbes-launch eve, 2026-05-05) — at 375px the sticky
              bar's 18px Cormorant yacht name + 9px gold price line truncated
              to 1–2 chars on the left while the gold "Request proposal" CTA
              took the right half. Defeats the whole purpose of the bar.
              At <=480px: shrink the CTA to icon-only "→ INQUIRE" and tighten
              the title block so the yacht name actually reads. */}
          <style jsx>{`
            @media (max-width: 480px) {
              :global(.gy-yacht-stickybar__cta) {
                padding: 8px 14px !important;
                font-size: 9px !important;
                letter-spacing: 0.18em !important;
              }
              :global(.gy-yacht-stickybar__title span:first-child) {
                font-size: 15px !important;
              }
              :global(.gy-yacht-stickybar__price) {
                font-size: 8px !important;
                letter-spacing: 0.18em !important;
              }
            }
          `}</style>
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

// Phase 27 (Forbes-launch eve, 2026-05-05) — "5 — Captain, Chef, Chief
// Stewardess, 2 Deckhand" reads as a CSV from a spreadsheet. Boss flagged
// it as πρόχειρο ("for the audience we serve, this looks careless").
// Format the raw Sanity crew string into a count + role list with the
// roles arranged as small caps and the headcount lifted as a number,
// matching the existing Length / Guests / Cabins typography rhythm.
function formatCrewString(raw) {
  if (!raw) return { count: null, roles: [] };
  const str = String(raw).trim();
  // Match an optional leading total ("5", "5 —", "5 -", "5:", "5 crew —")
  const lead = str.match(/^\s*(\d+)\s*(?:crew\s*)?[—\-:·•]\s*(.*)$/i);
  let countNum = null;
  let rest = str;
  if (lead) {
    countNum = parseInt(lead[1], 10);
    rest = lead[2].trim();
  } else {
    const onlyNum = str.match(/^\s*(\d+)\s*$/);
    if (onlyNum) {
      return { count: parseInt(onlyNum[1], 10), roles: [] };
    }
  }
  // Split roles by comma / "and" / "&" / "/" / "+" — keep order.
  const roles = rest
    .split(/\s*(?:,|\band\b|&|\/|\+)\s*/i)
    .map((r) => r.trim())
    .filter(Boolean)
    .map((role) => {
      // Pluralise where needed: "2 Deckhand" → "2 Deckhands"
      const m = role.match(/^(\d+)\s+(.+)$/);
      if (m) {
        const [, n, name] = m;
        const cleaned = name.replace(/s$/i, "");
        return `${n} ${cleaned}${parseInt(n, 10) > 1 ? "s" : ""}`;
      }
      return role;
    });
  return { count: countNum, roles };
}

function CrewSpec({ label, value }) {
  const { count, roles } = formatCrewString(value);
  if (!count && roles.length === 0) {
    return <Spec label={label} value={value} />;
  }
  return (
    <div className="yacht-specs__item">
      <span className="yacht-specs__label">{label}</span>
      <span className="yacht-specs__value">
        {count != null ? count : null}
        {count != null && roles.length > 0 ? (
          <span className="yacht-specs__crew-roles" aria-hidden="true">
            <span className="yacht-specs__crew-rule" />
            {roles.join(" · ")}
          </span>
        ) : roles.length > 0 ? (
          roles.join(" · ")
        ) : null}
      </span>
    </div>
  );
}
