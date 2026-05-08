'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
// Phase 27i.16 (2026-05-08) — cover-open transition. Wraps the
// card image link in a View Transitions API navigation so the
// photo morphs into the detail-page hero on click.
import ViewTransitionLink from '../components/ViewTransitionLink';
// CompareYachts is a heavy modal only rendered after the visitor
// actually ticks the compare checkbox on two yachts. Lazy-loaded to
// keep the /charter-yacht-greece first-load bundle ~12 KB smaller.
const CompareYachts = dynamic(() => import('./CompareYachts'), { ssr: false });
// C.8 (Roberto master rebuild brief, May 2026) — Express inquiry
// modal lifted to the FleetGrid level so a single modal serves
// every card. Lazy-loaded so the listing page first-paint stays
// light; loads on first card click.
const ExpressInquiryModal = dynamic(() => import('../components/ExpressInquiryModal'), { ssr: false });
import { useWishlist } from '../components/WishlistProvider';
import { useI18n } from '@/lib/i18n/I18nProvider';

// Fallback data for yachts missing data in Sanity
const YACHT_OVERRIDES = {
  'la-pellegrina-1': { name: 'M/Y LA PELLEGRINA 1', price: '\u20ac180,000 \u2013 \u20ac235,000', guests: 12, cabins: 5, crew: 9, builder: 'Couach 164', flagship: true },
  'brooklyn': { name: 'M/Y BROOKLYN', price: '\u20ac85,000 \u2013 \u20ac105,000', guests: 10, cabins: 5, crew: 6, builder: 'Custom Built' },
  'ottawa': { name: 'M/Y OTTAWA', price: '\u20ac90,000 \u2013 \u20ac120,000', guests: 10, cabins: 5, crew: 7, builder: 'I-SEA Yachts' },
  'ariela': { name: 'M/Y ARIELA', price: '\u20ac95,000 \u2013 \u20ac125,000', guests: 10, cabins: 6, crew: 8, builder: 'CRN (Ferretti)' },
  'elysium': { name: 'Cruise Ship ELYSIUM', price: 'On Request', guests: 49, cabins: 6, crew: 14, builder: 'Custom' },
  'pareaki-ii': { name: 'M/Y PAREAKI II', price: '\u20ac80,000 \u2013 \u20ac100,000', guests: 10, cabins: 5, crew: 7 },
  'summer-fun': { name: 'M/Y SUMMER FUN', price: '\u20ac45,000 \u2013 \u20ac55,000', guests: 10, cabins: 4, crew: 5 },
  'one': { name: 'M/Y ONE', price: '\u20ac35,000 \u2013 \u20ac42,000', guests: 8, cabins: 4, crew: 4 },
  'cant-remember': { name: "M/Y CAN'T REMEMBER", price: '\u20ac55,000 \u2013 \u20ac70,000', guests: 10, cabins: 5, crew: 6 },
  'vista': { name: 'M/Y VISTA', price: '\u20ac30,000 \u2013 \u20ac38,000', guests: 8, cabins: 4, crew: 4 },
  'm-five': { name: 'M/Y M FIVE', price: '\u20ac22,000 \u2013 \u20ac28,000', guests: 8, cabins: 3, crew: 3 },
  'sea-u': { name: 'M/Y SEA U', price: '\u20ac20,000 \u2013 \u20ac25,000', guests: 8, cabins: 3, crew: 3 },
  'shero': { name: 'M/Y SHERO', price: '\u20ac28,000 \u2013 \u20ac35,000', guests: 8, cabins: 4, crew: 4 },
  'lady-l': { name: 'M/Y LADY L', price: '\u20ac17,500 \u2013 \u20ac20,000', guests: 8, cabins: 3, crew: 2, builder: 'Altamar 64' },
  'mary': { name: 'M/Y MARY', price: '\u20ac17,500 \u2013 \u20ac19,900', guests: 8, cabins: 3, crew: 2, builder: 'Ferretti 68' },
  'n-ice': { name: 'M/Y N.ICE', price: '\u20ac18,900 \u2013 \u20ac22,900', guests: 6, cabins: 3, crew: 2, builder: 'Omikron OT-60' },
  'star-link': { name: 'M/Y STAR LINK', price: '\u20ac35,000 \u2013 \u20ac45,000', guests: 8, cabins: 4, crew: 4 },
  'crazy-horse': { name: 'P/CAT CRAZY HORSE', price: '\u20ac55,000 \u2013 \u20ac70,000', guests: 10, cabins: 5, crew: 6 },
  'alina': { name: 'P/CAT ALINA', price: '\u20ac35,000 \u2013 \u20ac42,000', guests: 8, cabins: 4, crew: 4 },
  'samara': { name: 'P/CAT SAMARA', price: '\u20ac30,000 \u2013 \u20ac38,000', guests: 8, cabins: 4, crew: 4 },
  'just-marie-2': { name: 'P/CAT JUST MARIE 2', price: '\u20ac40,000 \u2013 \u20ac50,000', guests: 10, cabins: 5, crew: 5 },
  'christal-mio': { name: 'P/CAT CHRISTAL MIO', price: '\u20ac55,000 \u2013 \u20ac65,000', guests: 12, cabins: 6, crew: 7 },
  'christal-mio-80': { name: 'P/CAT CHRISTAL MIO 80', price: '\u20ac45,000 \u2013 \u20ac55,000', guests: 10, cabins: 4, crew: 5 },
  'alena': { name: 'P/CAT ALENA', price: '\u20ac60,000 \u2013 \u20ac75,000', guests: 10, cabins: 5, crew: 6 },
  'majesty-of-greece': { name: 'P/CAT MAJESTY OF GREECE', price: '\u20ac70,000 \u2013 \u20ac90,000', guests: 12, cabins: 6, crew: 8 },
  'endless-beauty': { name: 'P/CAT ENDLESS BEAUTY', price: '\u20ac14,000 \u2013 \u20ac17,500', guests: 6, cabins: 3, crew: 2, builder: 'Fountaine Pajot 44' },
  'genny': { name: 'S/CAT GENNY', price: '\u20ac30,000 \u2013 \u20ac38,000', guests: 10, cabins: 5, crew: 4 },
  'summer-star': { name: 'S/CAT SUMMER STAR', price: '\u20ac17,000 \u2013 \u20ac22,000', guests: 10, cabins: 4, crew: 2, builder: 'Lagoon 52' },
  'odyssey': { name: 'S/CAT ODYSSEY', price: '\u20ac10,900 \u2013 \u20ac14,900', guests: 8, cabins: 3, crew: 2, builder: 'Nautitech 46 Fly' },
  'my-star': { name: 'S/CAT MY STAR', price: '\u20ac12,000 \u2013 \u20ac15,000', guests: 8, cabins: 3, crew: 2, builder: 'Lagoon 46' },
  'helidoni': { name: 'S/CAT HELIDONI', price: 'From \u20ac5,900', guests: 8, cabins: 3, crew: 2, builder: 'Fountaine Pajot Tanna 47' },
  'alegria': { name: 'S/CAT ALEGRIA', price: 'From \u20ac10,900', guests: 8, cabins: 3, crew: 2, builder: 'Fountaine Pajot Saona 47' },
  'libra': { name: 'S/CAT LIBRA', price: '\u20ac15,000 \u2013 \u20ac19,000', guests: 8, cabins: 4, crew: 2 },
  'worlds-end': { name: "S/CAT WORLD'S END", price: '\u20ac18,000 \u2013 \u20ac24,000', guests: 8, cabins: 4, crew: 3 },
  'ad-astra': { name: 'S/CAT AD ASTRA', price: '\u20ac32,000 \u2013 \u20ac40,000', guests: 10, cabins: 5, crew: 4, builder: 'Custom 80' },
  'azul': { name: 'S/CAT AZUL', price: '\u20ac14,000 \u2013 \u20ac18,000', guests: 8, cabins: 4, crew: 2 },
  'serenissima': { name: 'S/CAT SERENISSIMA', price: '\u20ac22,000 \u2013 \u20ac28,000', guests: 8, cabins: 4, crew: 3 },
  'serenissima-iii': { name: 'S/CAT SERENISSIMA III', price: '\u20ac18,000 \u2013 \u20ac24,000', guests: 8, cabins: 4, crew: 3 },
  'above-beyond': { name: 'S/CAT ABOVE & BEYOND', price: '\u20ac14,000 \u2013 \u20ac18,000', guests: 8, cabins: 4, crew: 2 },
  'kimata': { name: 'S/CAT KIMATA', price: '\u20ac15,000 \u2013 \u20ac20,000', guests: 8, cabins: 4, crew: 2 },
  'pixie': { name: 'S/CAT PIXIE', price: '\u20ac12,000 \u2013 \u20ac16,000', guests: 8, cabins: 3, crew: 2 },
  'nadamas': { name: 'S/Y NADAMAS', price: '\u20ac22,000 \u2013 \u20ac30,000', guests: 8, cabins: 4, crew: 3 },
  'huayra': { name: 'S/Y HUAYRA', price: '\u20ac35,000 \u2013 \u20ac45,000', guests: 8, cabins: 4, crew: 4 },
  'alexandra-ii': { name: 'S/CAT ALEXANDRA II', price: '\u20ac20,000 \u2013 \u20ac26,000', guests: 8, cabins: 4, crew: 3 },
  'imladris': { name: 'S/CAT IMLADRIS', price: '\u20ac18,000 \u2013 \u20ac24,000', guests: 8, cabins: 4, crew: 3 },
  'sahana': { name: 'S/CAT SAHANA', price: '\u20ac16,000 \u2013 \u20ac20,000', guests: 8, cabins: 4, crew: 2 },
  'aloia': { name: 'S/CAT ALOIA', price: '\u20ac14,000 \u2013 \u20ac18,000', guests: 6, cabins: 3, crew: 2 },
  'sol-madinina': { name: 'S/CAT SOL MADININA', price: '\u20ac12,000 \u2013 \u20ac16,000', guests: 6, cabins: 3, crew: 2 },
  'explorion': { name: 'P/CAT EXPLORION', price: '\u20ac16,000 \u2013 \u20ac20,000', guests: 8, cabins: 4, crew: 2 },
  'alteya': { name: 'P/CAT ALTEYA', price: '\u20ac25,000 \u2013 \u20ac32,000', guests: 10, cabins: 5, crew: 3 },
  'shooting-star': { name: 'S/Y SHOOTING STAR', price: 'From \u20ac13,000', guests: 6, cabins: 3, crew: 2, builder: 'Gianetti 65' },
  'aizu': { name: 'S/Y AIZU', price: '\u20ac30,000 \u2013 \u20ac40,000', guests: 8, cabins: 4, crew: 4 },
  'gigreca': { name: 'S/Y GIGRECA', price: '\u20ac20,000 \u2013 \u20ac28,000', guests: 6, cabins: 3, crew: 3 },
};

const CATEGORY_LABELS = {
  'motor-yachts': 'Motor Yacht',
  'sailing-catamarans': 'Sailing Catamaran',
  'power-catamarans': 'Power Catamaran',
  'sailing-monohulls': 'Sailing Monohull',
};

const LENGTH_RANGES = [
  { id: 'all', label: 'Any Length' },
  { id: 'small', label: 'Under 20m' },
  { id: 'medium', label: '20m \u2013 40m' },
  { id: 'large', label: '40m+' },
];

const GUEST_OPTIONS = [
  { id: 'all', label: 'Any Guests' },
  { id: '6', label: 'Up to 6' },
  { id: '8', label: 'Up to 8' },
  { id: '10', label: 'Up to 10' },
  { id: '12', label: 'Up to 12' },
];

const CABIN_OPTIONS = [
  { id: 'all', label: 'Any Cabins' },
  { id: '3', label: '3 Cabins' },
  { id: '4', label: '4 Cabins' },
  { id: '5', label: '5 Cabins' },
  { id: '6', label: '6+ Cabins' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'Any Price' },
  { id: 'under20', label: 'Under \u20ac20K' },
  { id: '20to50', label: '\u20ac20K \u2013 \u20ac50K' },
  { id: '50to100', label: '\u20ac50K \u2013 \u20ac100K' },
  { id: 'over100', label: '\u20ac100K+' },
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'length-desc', label: 'Length: Largest First' },
  { id: 'length-asc', label: 'Length: Smallest First' },
  { id: 'guests', label: 'Most Guests' },
];

// C.6 (Roberto master rebuild brief) — UHNW filter expansion.
const REFIT_OPTIONS = [
  { id: 'all', label: 'Any year' },
  { id: '2020', label: '2020 or newer' },
  { id: '2022', label: '2022 or newer' },
  { id: '2024', label: '2024 or newer' },
  { id: '2025', label: '2025+' },
];

const TOY_OPTIONS = [
  { id: 'jet_ski', label: 'Jet Ski' },
  { id: 'seabob', label: 'SeaBob' },
  { id: 'efoil', label: 'e-Foil' },
  { id: 'wakeboard', label: 'Wakeboard' },
  { id: 'paddleboard', label: 'Paddleboard' },
  { id: 'inflatable_slide', label: 'Inflatable Slide' },
  { id: 'diving_equipment', label: 'Diving Gear' },
];

const MASTER_DECK_OPTIONS = [
  { id: 'all', label: 'Any deck' },
  { id: 'main', label: 'Main deck' },
  { id: 'upper', label: 'Upper deck' },
  { id: 'lower', label: 'Lower deck' },
];

const SPEED_OPTIONS = [
  { id: 'all', label: 'Any speed' },
  { id: 'sail', label: 'Sailing-paced (≤10 kn)' },
  { id: 'to15', label: 'Up to 15 kn' },
  { id: '15to25', label: '15–25 kn' },
  { id: 'over25', label: '25 kn+' },
];

function parseLengthMeters(lengthStr) {
  if (!lengthStr) return 0;
  const match = String(lengthStr).match(/([\d.]+)\s*m/i);
  if (match) return parseFloat(match[1]);
  const numMatch = String(lengthStr).match(/([\d.]+)/);
  return numMatch ? parseFloat(numMatch[1]) : 0;
}

// Phase 27 (Forbes-launch eve, 2026-05-05) — yacht "sleeps" / "cabins"
// fields in Sanity sometimes arrive as strings ("8", "Up to 10", "8-10
// guests"). Number(x) on those non-numeric forms yields NaN → 0, which
// silently kicks the yacht out of every guest-cap filter. Extract the
// first integer in the value so the filter actually has something to
// compare against.
function parseGuestCount(raw) {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return raw;
  const m = String(raw).match(/(\d+)/g);
  if (!m || m.length === 0) return 0;
  // For ranges like "8-10" prefer the higher number (sleeping capacity).
  return Math.max(...m.map((n) => parseInt(n, 10)).filter(Number.isFinite));
}

// Parse price string to number for sorting (extracts first number)
function parsePriceNum(priceStr) {
  if (!priceStr || priceStr === 'On Request') return Infinity;
  const cleaned = priceStr.replace(/[^\d]/g, ' ').trim();
  const nums = cleaned.split(/\s+/).filter(Boolean);
  if (nums.length === 0) return Infinity;
  return parseInt(nums[0], 10) || Infinity;
}

// Parallax effect for hero image
function useHeroParallax() {
  useEffect(() => {
    const heroImg = document.querySelector('.fleet-hero__bg');
    if (!heroImg) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = window.innerHeight * 0.7;
          if (scrollY < heroHeight) {
            heroImg.style.transform = `translateY(${scrollY * 0.35}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// Intersection Observer hook for staggered scroll animations
function useScrollReveal() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Sort entries by their position in the grid for proper stagger order
        const sortedEntries = [...entries].sort((a, b) => {
          const aRect = a.boundingClientRect;
          const bRect = b.boundingClientRect;
          return aRect.top - bRect.top || aRect.left - bRect.left;
        });

        let visibleIndex = 0;
        sortedEntries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger delay: 50ms between each card
            const delay = visibleIndex * 50;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('fleet-card--visible');
            observer.unobserve(entry.target);
            visibleIndex++;
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    const cards = grid.querySelectorAll('.fleet-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  });

  return gridRef;
}

function YachtCard({ yacht, index, isComparing, onToggleCompare, compareCount, t, onInquireClick }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { toggle: toggleWishlist, has: hasWishlist } = useWishlist();
  const slug = yacht.slug;
  const override = YACHT_OVERRIDES[slug] || {};
  const name = yacht.name || override.name || slug?.replace(/-/g, ' ').toUpperCase() || 'Yacht';
  const price = yacht.weeklyRatePrice || override.price || 'On Request';
  const guests = yacht.sleeps || override.guests || '\u2013';
  const cabins = yacht.cabins || override.cabins || '\u2013';
  const builder = yacht.subtitle || override.builder || yacht.builder || '';
  const isFlagship = slug === 'la-pellegrina-1';
  const imageUrl = yacht.imageUrl;
  const lengthShort = yacht.length ? yacht.length.split('/')[0].trim() : '\u2013';

  // Calculate per-person per-week cost with APA (30%) + VAT (12%) included
  const perPersonWeekly = useMemo(() => {
    const priceStr = yacht.weeklyRatePrice || override.price || '';
    const guestCount = parseInt(guests) || 0;
    if (!priceStr || guestCount === 0 || priceStr === 'On Request') return null;
    // Extract all numbers from price string
    const numbers = [];
    const regex = /€?([\d,.]+)/g;
    const cleanStr = priceStr.replace(/[^\d.,€\-–]/g, ' ');
    let m;
    while ((m = regex.exec(cleanStr)) !== null) {
      const num = parseFloat(m[1].replace(/,/g, '').replace(/\./g, ''));
      if (!isNaN(num) && num > 100) numbers.push(num);
    }
    if (numbers.length === 0) return null;
    const lowBase = numbers[0];
    const highBase = numbers.length > 1 ? numbers[numbers.length - 1] : lowBase;
    // Add APA (30%) + VAT (12%) = total multiplier 1.456
    const multiplier = 1.42; // 30% APA + 12% VAT on charter
    const lowTotal = Math.round((lowBase * multiplier) / guestCount);
    const highTotal = Math.round((highBase * multiplier) / guestCount);
    if (lowTotal <= 0) return null;
    return { low: `€${lowTotal.toLocaleString()}`, high: `€${highTotal.toLocaleString()}` };
  }, [yacht.weeklyRatePrice, override.price, guests]);

  return (
    <div
      className="fleet-card"
      // A.14 (Roberto brief): max stagger 50ms × min(index, 6) = 300ms
      // total. Was 600ms × index, capping at 600ms — too long when
      // user scrolls quickly through the grid.
      style={{ '--stagger': `${Math.min(index * 0.05, 0.3)}s` }}
    >
      {/* Image — ViewTransitionLink so click on the cover triggers a
          native View Transitions API morph from card thumbnail to the
          detail-page hero. Pairing happens via `view-transition-name`
          set on the <Image> element below + the same name on the
          yacht-hero__image element on the detail page. */}
      <ViewTransitionLink
        href={`/yachts/${slug}`}
        className="fleet-card__image-link"
        data-cursor-magnetic="VIEW"
        onClick={() => {
          // N.1 — fleet_card_clicked
          try {
            window.gtag?.('event', 'fleet_card_clicked', {
              yacht_slug: slug,
              yacht_name: name,
              position: index + 1,
            });
          } catch {}
        }}
      >
        <div className="fleet-card__image-wrap">
          {/* Skeleton loader */}
          {!imgLoaded && imageUrl && (
            <div className="fleet-card__skeleton" />
          )}
          {imageUrl ? (
            <>
              <Image
                src={`${imageUrl}?w=600&h=400&fit=crop&auto=format`}
                alt={yacht.imageAlt || `${name} — charter yacht in Greece`}
                width={600}
                height={400}
                loading={index < 6 ? 'eager' : 'lazy'}
                className={`fleet-card__img ${imgLoaded ? 'fleet-card__img--loaded' : ''}`}
                onLoad={() => setImgLoaded(true)}
                style={{ viewTransitionName: `yacht-cover-${slug}` }}
              />
              {/* C.4 (Roberto master rebuild) — hover preview cycle.
                  Up to 3 additional photos overlay the hero on hover,
                  fading 0→1→0 at 1.2s offsets via the gy-card-cycle
                  CSS animation. Pure CSS — no JS state, no extra
                  network on cards that aren't hovered. Mobile: tap
                  highlight triggers same animation via :focus-within. */}
              {Array.isArray(yacht.hoverImages) &&
                yacht.hoverImages.filter(Boolean).slice(0, 3).map((u, k) => (
                  <Image
                    key={u}
                    src={`${u}?w=600&h=400&fit=crop&auto=format`}
                    alt=""
                    aria-hidden="true"
                    width={600}
                    height={400}
                    loading="lazy"
                    className={`fleet-card__img-hover gy-card-cycle gy-card-cycle--${k}`}
                  />
                ))}
            </>
          ) : (
            <div className="fleet-card__placeholder">
              <span>No Image</span>
            </div>
          )}
          {/* Category badge */}
          <div className="fleet-card__badge fleet-card__badge--category">
            {CATEGORY_LABELS[yacht.category] || yacht.category || 'Yacht'}
          </div>
          {/* Flagship badge - ONLY La Pellegrina */}
          {isFlagship && (
            <div className="fleet-card__badge fleet-card__badge--featured">
              {t('fleet.flagship', 'Flagship')}
            </div>
          )}
          {/* Wishlist heart button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist({ slug, name, price, guests, builder }); }}
            aria-label={hasWishlist(slug) ? 'Remove from favorites' : 'Add to favorites'}
            className="fleet-card__heart"
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 5,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(13, 27, 42, 0.5)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.3s ease',
              backdropFilter: 'blur(4px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={hasWishlist(slug) ? '#C9A84C' : 'none'}
              stroke={hasWishlist(slug) ? '#C9A84C' : 'rgba(248, 245, 240,0.6)'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          {/* Wishlist heart — end */}
          {/* Overlay gradient */}
          <div className="fleet-card__overlay" />
          {/* Name on image */}
          <div className="fleet-card__name-area">
            <h3 className="fleet-card__name notranslate">{name}</h3>
            {builder && <p className="fleet-card__builder notranslate">{builder}</p>}
          </div>
        </div>
      </ViewTransitionLink>

      {/* Info section */}
      <div className="fleet-card__info">
        {/* Specs row */}
        <div className="fleet-card__specs">
          <div className="fleet-card__spec">
            <span className="fleet-card__spec-label">{t('common.length', 'Length')}</span>
            <span className="fleet-card__spec-value">{lengthShort}</span>
          </div>
          <div className="fleet-card__spec">
            <span className="fleet-card__spec-label">{t('common.guests', 'Guests')}</span>
            <span className="fleet-card__spec-value">{guests}</span>
          </div>
          <div className="fleet-card__spec">
            <span className="fleet-card__spec-label">{t('common.cabins', 'Cabins')}</span>
            <span className="fleet-card__spec-value">{cabins}</span>
          </div>
        </div>

        <div className="fleet-card__divider" />

        {/* Price + buttons */}
        <div className="fleet-card__bottom">
          <div style={{ width: '100%' }}>
            <div className="fleet-card__price-label">{t('fleet.weeklyCharter', 'Weekly Charter')}</div>
            <div className="fleet-card__price">{price}</div>
            {perPersonWeekly && (
              <div className="fleet-card__per-person">
                <span className="fleet-card__per-person-label">{t('fleet.totalPerPerson', 'Total per person/week')}</span>
                {perPersonWeekly.low === perPersonWeekly.high
                  ? perPersonWeekly.low
                  : `${perPersonWeekly.low} – ${perPersonWeekly.high}`
                }
                <span className="fleet-card__per-person-note">{t('fleet.inclApaVat', 'incl. APA & VAT')}</span>
              </div>
            )}
          </div>
          <div className="fleet-card__buttons">
            <Link href={`/yachts/${slug}`} className="fleet-card__btn fleet-card__btn--details">
              <span>{t('fleet.details', 'Details')}</span>
            </Link>
            {/* C.8 (Roberto master rebuild brief): "Inquire" now opens
                the express inquiry modal (3 fields + channel picker)
                instead of jumping straight to WhatsApp. WhatsApp stays
                available — it's the channel selector inside the modal,
                or the secondary link below. */}
            <button
              type="button"
              onClick={() => onInquireClick?.({ slug, name, weeklyRatePrice: price })}
              className="fleet-card__btn fleet-card__btn--inquire"
              data-cursor="Inquire"
              style={{ cursor: 'pointer' }}
            >
              <span>{t('fleet.inquire', 'Inquire')}</span>
            </button>
          </div>
          {/* Secondary direct WhatsApp link for visitors who only want
              the messaging-app channel (skips the modal entirely). */}
          <a
            href={`https://wa.me/17867988798?text=${encodeURIComponent(`Hi, I'm interested in chartering ${name} — could you share availability and rates?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="WhatsApp"
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 6,
              fontSize: 9,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(248, 245, 240,0.45)',
              textDecoration: 'none',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
            }}
          >
            or message George directly →
          </a>
          {/* Compare toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
            disabled={!isComparing && compareCount >= 3}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "6px",
              background: isComparing ? "rgba(201,168,76,0.15)" : "transparent",
              border: isComparing ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(248, 245, 240,0.08)",
              color: isComparing ? "#C9A84C" : "rgba(248, 245, 240,0.3)",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "'Montserrat', sans-serif",
              cursor: !isComparing && compareCount >= 3 ? "not-allowed" : "pointer",
              opacity: !isComparing && compareCount >= 3 ? 0.3 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {isComparing ? "✓ Added to Compare" : compareCount >= 3 ? "Max 3 Yachts" : "+ Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FleetGrid({ yachts }) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lengthRange, setLengthRange] = useState('all');
  const [guestFilter, setGuestFilter] = useState('all');
  const [cabinFilter, setCabinFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  // C.6 — UHNW advanced filters
  const [refitFilter, setRefitFilter] = useState('all');
  const [toysFilter, setToysFilter] = useState([]); // multi-select array of toy ids
  const [masterDeckFilter, setMasterDeckFilter] = useState('all');
  const [speedFilter, setSpeedFilter] = useState('all');
  const [compareList, setCompareList] = useState([]);
  // C.8 — One inquiry modal at the FleetGrid level. Cards push their
  // yacht context up via `onInquireClick`; the modal reads the value
  // and pre-fills the form. Closing clears the value.
  const [inquiryYacht, setInquiryYacht] = useState(null);
  const gridRef = useScrollReveal();
  useHeroParallax();

  const toggleCompare = useCallback((yacht) => {
    setCompareList((prev) => {
      const exists = prev.find((y) => y.slug === yacht.slug);
      if (exists) return prev.filter((y) => y.slug !== yacht.slug);
      if (prev.length >= 3) return prev; // max 3
      const override = YACHT_OVERRIDES[yacht.slug] || {};
      const name = yacht.name || override.name || yacht.slug?.replace(/-/g, ' ').toUpperCase();
      const price = yacht.weeklyRatePrice || override.price || 'On Request';
      const guestCount = yacht.sleeps || override.guests || '–';
      const cabinCount = yacht.cabins || override.cabins || '–';
      const crewInfo = yacht.crew || override.crew || '–';
      // Per person per week with APA + VAT
      let ppwLow = null;
      let ppwHigh = null;
      const gn = parseInt(guestCount) || 0;
      if (gn > 0 && price !== 'On Request') {
        const nums = [];
        const rx = /€?([\d,.]+)/g;
        const cs = price.replace(/[^\d.,€\-–]/g, ' ');
        let mx;
        while ((mx = rx.exec(cs)) !== null) {
          const n = parseFloat(mx[1].replace(/,/g, '').replace(/\./g, ''));
          if (!isNaN(n) && n > 100) nums.push(n);
        }
        if (nums.length > 0) {
          const mult = 1.42;
          ppwLow = `€${Math.round((nums[0] * mult) / gn).toLocaleString()}`;
          ppwHigh = nums.length > 1 ? `€${Math.round((nums[nums.length - 1] * mult) / gn).toLocaleString()}` : ppwLow;
        }
      }
      return [...prev, {
        title: name,
        slug: yacht.slug,
        builder: yacht.subtitle || override.builder || yacht.builder || '–',
        length: yacht.length || '–',
        guests: guestCount,
        cabins: cabinCount,
        crew: crewInfo,
        cruiseSpeed: yacht.cruiseSpeed || '–',
        maxSpeed: yacht.maxSpeed || '–',
        weeklyRate: price,
        perPersonWeekLow: ppwLow,
        perPersonWeekHigh: ppwHigh,
        imageUrl: yacht.imageUrl,
      }];
    });
  }, []);

  // Compute categories with counts
  const categories = useMemo(() => {
    const counts = {};
    yachts.forEach((y) => {
      const cat = y.category || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const cats = [{ id: 'all', label: 'All Fleet', count: yachts.length }];
    if (counts['motor-yachts']) cats.push({ id: 'motor-yachts', label: 'Motor Yachts', count: counts['motor-yachts'] });
    if (counts['sailing-catamarans']) cats.push({ id: 'sailing-catamarans', label: 'Sailing Catamarans', count: counts['sailing-catamarans'] });
    if (counts['power-catamarans']) cats.push({ id: 'power-catamarans', label: 'Power Catamarans', count: counts['power-catamarans'] });
    if (counts['sailing-monohulls']) cats.push({ id: 'sailing-monohulls', label: 'Sailing Monohulls', count: counts['sailing-monohulls'] });
    return cats;
  }, [yachts]);

  // Enrich, filter, sort
  const filtered = useMemo(() => {
    let result = yachts.map((y) => {
      const slug = y.slug;
      const override = YACHT_OVERRIDES[slug] || {};
      const lengthM = parseLengthMeters(y.length);
      const guests = y.sleeps || override.guests || 0;
      const cabs = y.cabins || override.cabins || 0;
      const priceStr = y.weeklyRatePrice || override.price || 'On Request';
      const priceNum = parsePriceNum(priceStr);
      const isFlagship = slug === 'la-pellegrina-1';
      return { ...y, lengthM, guestsNum: parseGuestCount(guests), cabinsNum: parseGuestCount(cabs), priceNum, isFlagship };
    });

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((y) => y.category === activeCategory);
    }
    // Length filter
    if (lengthRange === 'small') result = result.filter((y) => y.lengthM > 0 && y.lengthM < 20);
    if (lengthRange === 'medium') result = result.filter((y) => y.lengthM >= 20 && y.lengthM <= 40);
    if (lengthRange === 'large') result = result.filter((y) => y.lengthM > 40);
    // Guest filter
    if (guestFilter !== 'all') result = result.filter((y) => y.guestsNum > 0 && y.guestsNum <= parseInt(guestFilter));
    // Cabin filter
    if (cabinFilter !== 'all') {
      const c = parseInt(cabinFilter);
      if (c === 6) {
        result = result.filter((y) => y.cabinsNum >= 6);
      } else {
        result = result.filter((y) => y.cabinsNum === c);
      }
    }
    // Price range filter
    if (priceRange === 'under20') result = result.filter((y) => y.priceNum < 20000);
    if (priceRange === '20to50') result = result.filter((y) => y.priceNum >= 20000 && y.priceNum <= 50000);
    if (priceRange === '50to100') result = result.filter((y) => y.priceNum >= 50000 && y.priceNum <= 100000);
    if (priceRange === 'over100') result = result.filter((y) => y.priceNum > 100000);

    // C.6 — Year of refit
    if (refitFilter !== 'all') {
      const minYear = parseInt(refitFilter, 10);
      result = result.filter((y) => typeof y.yearRefit === 'number' && y.yearRefit >= minYear);
    }
    // C.6 — Water toys (AND across selected — yacht must offer ALL chosen).
    // Phase 27 (Forbes-launch eve, 2026-05-05): the previous fallback
    // only handled `y.toys` as a STRING — but in Sanity it's actually
    // a string ARRAY (yacht detail page maps over yacht.toys). Result:
    // every chip returned 0 yachts. Now we coerce both shapes to a
    // single lowercase haystack and substring-match against the
    // synonyms list, so the filter works regardless of how each
    // yacht stores its toys (structured array, free-text string, or
    // free-text array).
    if (toysFilter.length > 0) {
      const TOY_TEXT_SYNONYMS = {
        jet_ski: ["jet ski", "jetski", "jet-ski", "waverunner"],
        seabob: ["seabob", "sea bob", "sea-bob"],
        efoil: ["efoil", "e-foil", "e foil", "hydrofoil"],
        wakeboard: ["wakeboard", "wake board", "waterski", "water ski"],
        paddleboard: ["paddleboard", "paddle board", "sup", "stand-up paddle", "stand up paddle"],
        inflatable_slide: ["inflatable slide", "slide", "water slide", "inflatable"],
        diving_equipment: ["diving", "scuba", "snorkel", "snorkelling", "snorkeling", "dive gear", "diving equipment", "diving gear"],
      };
      const toHaystack = (raw) => {
        if (!raw) return "";
        if (Array.isArray(raw)) return raw.join(" ").toLowerCase();
        if (typeof raw === "string") return raw.toLowerCase();
        return "";
      };
      result = result.filter((y) => {
        const structuredSet = new Set(Array.isArray(y.waterToys) ? y.waterToys : []);
        const legacyText = toHaystack(y.toys);
        return toysFilter.every((tid) => {
          if (structuredSet.has(tid)) return true;
          const synonyms = TOY_TEXT_SYNONYMS[tid] || [tid.replace(/_/g, " ")];
          return synonyms.some((s) => legacyText.includes(s));
        });
      });
    }
    // C.6 — Master cabin deck
    if (masterDeckFilter !== 'all') {
      result = result.filter((y) => y.masterCabinDeck === masterDeckFilter);
    }
    // C.6 — Cruising speed (knots)
    if (speedFilter !== 'all') {
      result = result.filter((y) => {
        const s = typeof y.maxCruisingSpeed === 'number' ? y.maxCruisingSpeed : null;
        if (s === null) return false;
        if (speedFilter === 'sail') return s <= 10;
        if (speedFilter === 'to15') return s > 0 && s <= 15;
        if (speedFilter === '15to25') return s > 15 && s <= 25;
        if (speedFilter === 'over25') return s > 25;
        return true;
      });
    }

    // Sort
    if (sortBy === 'recommended') {
      // Flagship first, then price ascending
      result.sort((a, b) => {
        if (a.isFlagship && !b.isFlagship) return -1;
        if (!a.isFlagship && b.isFlagship) return 1;
        return a.priceNum - b.priceNum;
      });
    }
    if (sortBy === 'price-asc') result.sort((a, b) => a.priceNum - b.priceNum);
    if (sortBy === 'price-desc') result.sort((a, b) => {
      if (a.priceNum === Infinity && b.priceNum === Infinity) return 0;
      if (a.priceNum === Infinity) return 1;
      if (b.priceNum === Infinity) return -1;
      return b.priceNum - a.priceNum;
    });
    if (sortBy === 'length-desc') result.sort((a, b) => b.lengthM - a.lengthM);
    if (sortBy === 'length-asc') result.sort((a, b) => a.lengthM - b.lengthM);
    if (sortBy === 'guests') result.sort((a, b) => b.guestsNum - a.guestsNum);

    return result;
  }, [yachts, activeCategory, lengthRange, guestFilter, cabinFilter, priceRange, sortBy, refitFilter, toysFilter, masterDeckFilter, speedFilter]);

  const activeCatLabel = categories.find((c) => c.id === activeCategory)?.label || '';

  const resetFilters = useCallback(() => {
    setActiveCategory('all');
    setLengthRange('all');
    setGuestFilter('all');
    setCabinFilter('all');
    setPriceRange('all');
    setSortBy('recommended');
    // C.6 — also reset the UHNW filters
    setRefitFilter('all');
    setToysFilter([]);
    setMasterDeckFilter('all');
    setSpeedFilter('all');
  }, []);

  // C.5 — collapse the filter bar into compact mode once the
  // visitor scrolls past the hero. IntersectionObserver on a tiny
  // sentinel element above the bar; when it leaves the viewport,
  // the bar is sticky → add the .fleet-filters--compact class.
  const sentinelRef = useRef(null);
  const filterBarRef = useRef(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const bar = filterBarRef.current;
    if (!sentinel || !bar) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.classList.remove('fleet-filters--compact');
        } else {
          bar.classList.add('fleet-filters--compact');
        }
      },
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // C.7 — Saved view chips. One-click presets that snap the
  // filters to common UHNW shopping intents. Each preset writes
  // a stable URL query so visitors can bookmark/share.
  const PRESETS = [
    {
      id: 'family-cat',
      label: 'Family-friendly catamaran · 8–10 guests',
      apply: () => {
        setActiveCategory('sailing-catamarans');
        setGuestFilter('10');
        setLengthRange('all');
        setCabinFilter('all');
        setPriceRange('all');
      },
    },
    {
      id: 'couple',
      label: "Couple's escape · ≤6 guests · sailing yacht",
      apply: () => {
        setActiveCategory('sailing-monohulls');
        setGuestFilter('6');
        setLengthRange('all');
        setCabinFilter('all');
        setPriceRange('all');
      },
    },
    {
      // Phase 27 (Forbes-launch, 2026-05-05) — preset previously
      // wrote priceRange:'under-25' which has NO matching branch in
      // the price filter (valid IDs are under20 / 20to50 / 50to100 /
      // over100). Result: chip silently did nothing on price, but
      // the misleading "≤€25K" label set wrong expectations. Snap to
      // the real Under-€20K bucket so the chip semantically matches
      // the filter behaviour.
      id: 'group-of-10',
      label: 'Group of 10 · under €20K/week',
      apply: () => {
        setActiveCategory('all');
        setGuestFilter('10');
        setPriceRange('under20');
        setLengthRange('all');
        setCabinFilter('all');
      },
    },
    {
      // Phase 27 — label said "35m+" but applied lengthRange:'large'
      // which is "40m+" (LENGTH_RANGES has small <20m / medium 20–40m
      // / large >40m). Yachts at 35–40m were silently excluded.
      // Aligned label to the bucket so the chip never lies.
      id: 'superyacht',
      label: 'Superyacht · 12 guests · 40m+',
      apply: () => {
        setActiveCategory('motor-yachts');
        setGuestFilter('12');
        setLengthRange('large');
        setCabinFilter('all');
        setPriceRange('all');
      },
    },
  ];

  return (
    <>
      {/* C.5 — sentinel for sticky-collapse trigger */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

      {/* C.7 — Saved view preset chips. One-click filters for the
          shopping intents UHNW visitors actually have. */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '24px 24px 8px',
          background: 'rgba(13, 27, 42, 0.85)',
        }}
      >
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              preset.apply();
              try {
                window.gtag?.('event', 'fleet_preset_applied', {
                  preset: preset.id,
                });
              } catch {}
            }}
            data-cursor="Filter"
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: 'rgba(248,245,240,0.85)',
              border: '1px solid rgba(201,168,76,0.45)',
              borderRadius: '999px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
              e.currentTarget.style.color = '#C9A84C';
              e.currentTarget.style.borderColor = '#C9A84C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(248,245,240,0.85)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)';
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* FILTER BAR — Glass-morphism */}
      <div ref={filterBarRef} className="fleet-filters">
        {/* Category tabs */}
        <div className="fleet-filters__tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`fleet-filters__tab ${activeCategory === cat.id ? 'fleet-filters__tab--active' : ''}`}
            >
              {cat.label}
              <span className="fleet-filters__tab-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Sub-filters */}
        <div className="fleet-filters__row">
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-length" className="fleet-filters__label">{t('common.length', 'Length')}</label>
            <select id="filter-length" value={lengthRange} onChange={(e) => setLengthRange(e.target.value)} className="fleet-filters__select">
              {LENGTH_RANGES.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-guests" className="fleet-filters__label">{t('common.guests', 'Guests')}</label>
            <select id="filter-guests" value={guestFilter} onChange={(e) => setGuestFilter(e.target.value)} className="fleet-filters__select">
              {GUEST_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-cabins" className="fleet-filters__label">{t('common.cabins', 'Cabins')}</label>
            <select id="filter-cabins" value={cabinFilter} onChange={(e) => setCabinFilter(e.target.value)} className="fleet-filters__select">
              {CABIN_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-price" className="fleet-filters__label">{t('fleet.price', 'Price')}</label>
            <select id="filter-price" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="fleet-filters__select">
              {PRICE_RANGES.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-sort" className="fleet-filters__label">{t('fleet.sort', 'Sort')}</label>
            <select id="filter-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="fleet-filters__select">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* C.6 — UHNW advanced filters: refit year, master deck, cruising speed (toys below as chips) */}
        <div className="fleet-filters__row fleet-filters__row--advanced">
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-refit" className="fleet-filters__label">Refit year</label>
            <select id="filter-refit" value={refitFilter} onChange={(e) => setRefitFilter(e.target.value)} className="fleet-filters__select">
              {REFIT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-master-deck" className="fleet-filters__label">Master cabin</label>
            <select id="filter-master-deck" value={masterDeckFilter} onChange={(e) => setMasterDeckFilter(e.target.value)} className="fleet-filters__select">
              {MASTER_DECK_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <label htmlFor="filter-speed" className="fleet-filters__label">Cruising speed</label>
            <select id="filter-speed" value={speedFilter} onChange={(e) => setSpeedFilter(e.target.value)} className="fleet-filters__select">
              {SPEED_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* C.6 — Water toys multi-select chip row */}
        <div className="fleet-filters__toys" role="group" aria-label="Water toys">
          <span className="fleet-filters__label fleet-filters__label--inline">Toys:</span>
          {TOY_OPTIONS.map((opt) => {
            const active = toysFilter.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setToysFilter((prev) => (
                    prev.includes(opt.id) ? prev.filter((x) => x !== opt.id) : [...prev, opt.id]
                  ));
                }}
                className={`fleet-filters__toy-chip ${active ? 'fleet-filters__toy-chip--active' : ''}`}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="fleet-results">
        <div className="fleet-results__count">
          Showing <span className="fleet-results__highlight">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'yacht' : 'yachts'}
          {activeCategory !== 'all' && ` in ${activeCatLabel}`}
        </div>
        <div className="fleet-results__note">Prices per week &middot; Plus VAT &amp; APA</div>
      </div>

      {/* Live count — George 2026-04-20 C1: visible feedback so the
          filters feel responsive, not guesswork. */}
      <div className="fleet-count" aria-live="polite">
        <span className="fleet-count__n">{filtered.length}</span>
        <span className="fleet-count__label">
          {filtered.length === 1 ? 'yacht' : 'yachts'} matching
        </span>
        {(activeCategory !== 'all' || lengthRange !== 'all' || guestFilter !== 'all' || cabinFilter !== 'all' || priceRange !== 'all' || sortBy !== 'recommended') && (
          <button
            onClick={resetFilters}
            className="fleet-count__reset"
            aria-label="Reset all filters"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* YACHT GRID — keyed on filter signature so cards re-stagger
          gracefully whenever filters/sort change. */}
      <div
        className="fleet-grid"
        ref={gridRef}
        key={`${activeCategory}|${lengthRange}|${guestFilter}|${cabinFilter}|${priceRange}|${sortBy}`}
      >
        {filtered.map((yacht, i) => (
          <YachtCard
            key={yacht._id || yacht.slug}
            yacht={yacht}
            index={i}
            isComparing={compareList.some((c) => c.slug === yacht.slug)}
            onToggleCompare={() => toggleCompare(yacht)}
            compareCount={compareList.length}
            t={t}
            onInquireClick={setInquiryYacht}
          />
        ))}
      </div>

      {/* COMPARE YACHTS */}
      <CompareYachts
        compareList={compareList}
        onRemove={(slug) => setCompareList((prev) => prev.filter((y) => y.slug !== slug))}
        onClear={() => setCompareList([])}
      />

      {/* C.8 — Express inquiry modal (one instance, pre-filled with the
          yacht context the user clicked on). */}
      <ExpressInquiryModal
        open={!!inquiryYacht}
        onClose={() => setInquiryYacht(null)}
        yachtSlug={inquiryYacht?.slug}
        yachtName={inquiryYacht?.name}
        source="fleet_card_express"
      />

      {/* EMPTY STATE — Elegant */}
      {filtered.length === 0 && (
        <div className="fleet-empty">
          <div className="fleet-empty__icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="23" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              <path d="M16 28C16 28 19 24 24 24C29 24 32 28 32 28" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" transform="rotate(180 24 26)"/>
              <circle cx="18" cy="20" r="1.5" fill="rgba(201,168,76,0.4)"/>
              <circle cx="30" cy="20" r="1.5" fill="rgba(201,168,76,0.4)"/>
            </svg>
          </div>
          <p className="fleet-empty__text">No yachts match your filters</p>
          <p className="fleet-empty__subtext">Try adjusting your criteria or reset all filters</p>
          <button onClick={resetFilters} className="fleet-empty__reset">
            Reset All Filters
          </button>
        </div>
      )}
    </>
  );
}
