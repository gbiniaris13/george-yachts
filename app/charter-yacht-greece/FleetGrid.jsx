'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  'crazy-horse': { name: 'M/Y CRAZY HORSE', price: '\u20ac55,000 \u2013 \u20ac70,000', guests: 10, cabins: 5, crew: 6 },
  'alina': { name: 'M/Y ALINA', price: '\u20ac35,000 \u2013 \u20ac42,000', guests: 8, cabins: 4, crew: 4 },
  'samara': { name: 'M/Y SAMARA', price: '\u20ac30,000 \u2013 \u20ac38,000', guests: 8, cabins: 4, crew: 4 },
  'just-marie-2': { name: 'M/Y JUST MARIE 2', price: '\u20ac40,000 \u2013 \u20ac50,000', guests: 10, cabins: 5, crew: 5 },
  'christal-mio': { name: 'M/Y CHRISTAL MIO', price: '\u20ac55,000 \u2013 \u20ac65,000', guests: 12, cabins: 6, crew: 7 },
  'christal-mio-80': { name: 'M/Y CHRISTAL MIO 80', price: '\u20ac45,000 \u2013 \u20ac55,000', guests: 10, cabins: 4, crew: 5 },
  'alena': { name: 'M/Y ALENA', price: '\u20ac60,000 \u2013 \u20ac75,000', guests: 10, cabins: 5, crew: 6 },
  'majesty-of-greece': { name: 'M/Y MAJESTY OF GREECE', price: '\u20ac70,000 \u2013 \u20ac90,000', guests: 12, cabins: 6, crew: 8 },
  'endless-beauty': { name: 'P/C ENDLESS BEAUTY', price: '\u20ac14,000 \u2013 \u20ac17,500', guests: 6, cabins: 3, crew: 2, builder: 'Fountaine Pajot 44' },
  'genny': { name: 'S/Y GENNY', price: '\u20ac30,000 \u2013 \u20ac38,000', guests: 10, cabins: 5, crew: 4 },
  'summer-star': { name: 'S/Y SUMMER STAR', price: '\u20ac17,000 \u2013 \u20ac22,000', guests: 10, cabins: 4, crew: 2, builder: 'Lagoon 52' },
  'odyssey': { name: 'S/Y ODYSSEY', price: '\u20ac10,900 \u2013 \u20ac14,900', guests: 8, cabins: 3, crew: 2, builder: 'Nautitech 46 Fly' },
  'my-star': { name: 'S/Y MY STAR', price: '\u20ac12,000 \u2013 \u20ac15,000', guests: 8, cabins: 3, crew: 2, builder: 'Lagoon 46' },
  'helidoni': { name: 'S/Y HELIDONI', price: 'From \u20ac5,900', guests: 8, cabins: 3, crew: 2, builder: 'Fountaine Pajot Tanna 47' },
  'alegria': { name: 'S/Y ALEGRIA', price: 'From \u20ac10,900', guests: 8, cabins: 3, crew: 2, builder: 'Fountaine Pajot Saona 47' },
  'libra': { name: 'S/Y LIBRA', price: '\u20ac15,000 \u2013 \u20ac19,000', guests: 8, cabins: 4, crew: 2 },
  'worlds-end': { name: "S/Y WORLD'S END", price: '\u20ac18,000 \u2013 \u20ac24,000', guests: 8, cabins: 4, crew: 3 },
  'ad-astra': { name: 'S/Y AD ASTRA', price: '\u20ac32,000 \u2013 \u20ac40,000', guests: 10, cabins: 5, crew: 4, builder: 'Custom 80' },
  'azul': { name: 'S/Y AZUL', price: '\u20ac14,000 \u2013 \u20ac18,000', guests: 8, cabins: 4, crew: 2 },
  'serenissima': { name: 'S/Y SERENISSIMA', price: '\u20ac22,000 \u2013 \u20ac28,000', guests: 8, cabins: 4, crew: 3 },
  'serenissima-iii': { name: 'S/Y SERENISSIMA III', price: '\u20ac18,000 \u2013 \u20ac24,000', guests: 8, cabins: 4, crew: 3 },
  'above-beyond': { name: 'S/Y ABOVE & BEYOND', price: '\u20ac14,000 \u2013 \u20ac18,000', guests: 8, cabins: 4, crew: 2 },
  'kimata': { name: 'S/Y KIMATA', price: '\u20ac15,000 \u2013 \u20ac20,000', guests: 8, cabins: 4, crew: 2 },
  'pixie': { name: 'S/Y PIXIE', price: '\u20ac12,000 \u2013 \u20ac16,000', guests: 8, cabins: 3, crew: 2 },
  'nadamas': { name: 'S/Y NADAMAS', price: '\u20ac22,000 \u2013 \u20ac30,000', guests: 8, cabins: 4, crew: 3 },
  'huayra': { name: 'S/Y HUAYRA', price: '\u20ac35,000 \u2013 \u20ac45,000', guests: 8, cabins: 4, crew: 4 },
  'alexandra-ii': { name: 'S/Y ALEXANDRA II', price: '\u20ac20,000 \u2013 \u20ac26,000', guests: 8, cabins: 4, crew: 3 },
  'imladris': { name: 'S/Y IMLADRIS', price: '\u20ac18,000 \u2013 \u20ac24,000', guests: 8, cabins: 4, crew: 3 },
  'sahana': { name: 'S/Y SAHANA', price: '\u20ac16,000 \u2013 \u20ac20,000', guests: 8, cabins: 4, crew: 2 },
  'aloia': { name: 'S/Y ALOIA', price: '\u20ac14,000 \u2013 \u20ac18,000', guests: 6, cabins: 3, crew: 2 },
  'sol-madinina': { name: 'S/Y SOL MADININA', price: '\u20ac12,000 \u2013 \u20ac16,000', guests: 6, cabins: 3, crew: 2 },
  'explorion': { name: 'P/C EXPLORION', price: '\u20ac16,000 \u2013 \u20ac20,000', guests: 8, cabins: 4, crew: 2 },
  'alteya': { name: 'P/C ALTEYA', price: '\u20ac25,000 \u2013 \u20ac32,000', guests: 10, cabins: 5, crew: 3 },
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

function parseLengthMeters(lengthStr) {
  if (!lengthStr) return 0;
  const match = String(lengthStr).match(/([\d.]+)\s*m/i);
  if (match) return parseFloat(match[1]);
  const numMatch = String(lengthStr).match(/([\d.]+)/);
  return numMatch ? parseFloat(numMatch[1]) : 0;
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

function YachtCard({ yacht, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
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

  return (
    <div
      className="fleet-card"
      style={{ '--stagger': `${Math.min(index * 0.06, 0.6)}s` }}
    >
      {/* Image */}
      <Link href={`/yachts/${slug}`} className="fleet-card__image-link">
        <div className="fleet-card__image-wrap">
          {/* Skeleton loader */}
          {!imgLoaded && imageUrl && (
            <div className="fleet-card__skeleton" />
          )}
          {imageUrl ? (
            <Image
              src={`${imageUrl}?w=600&h=400&fit=crop&auto=format`}
              alt={`${name} - luxury yacht charter Greece`}
              width={600}
              height={400}
              loading={index < 6 ? 'eager' : 'lazy'}
              className={`fleet-card__img ${imgLoaded ? 'fleet-card__img--loaded' : ''}`}
              onLoad={() => setImgLoaded(true)}
            />
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
              Flagship
            </div>
          )}
          {/* Overlay gradient */}
          <div className="fleet-card__overlay" />
          {/* Name on image */}
          <div className="fleet-card__name-area">
            <h3 className="fleet-card__name">{name}</h3>
            {builder && <p className="fleet-card__builder">{builder}</p>}
          </div>
        </div>
      </Link>

      {/* Info section */}
      <div className="fleet-card__info">
        {/* Specs row */}
        <div className="fleet-card__specs">
          <div className="fleet-card__spec">
            <span className="fleet-card__spec-label">Length</span>
            <span className="fleet-card__spec-value">{lengthShort}</span>
          </div>
          <div className="fleet-card__spec">
            <span className="fleet-card__spec-label">Guests</span>
            <span className="fleet-card__spec-value">{guests}</span>
          </div>
          <div className="fleet-card__spec">
            <span className="fleet-card__spec-label">Cabins</span>
            <span className="fleet-card__spec-value">{cabins}</span>
          </div>
        </div>

        <div className="fleet-card__divider" />

        {/* Price + buttons */}
        <div className="fleet-card__bottom">
          <div>
            <div className="fleet-card__price-label">Weekly Charter</div>
            <div className="fleet-card__price">{price}</div>
          </div>
          <div className="fleet-card__buttons">
            <Link href={`/yachts/${slug}`} className="fleet-card__btn fleet-card__btn--details">
              <span>Details</span>
            </Link>
            <a
              href="https://calendly.com/george-georgeyachts/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="fleet-card__btn fleet-card__btn--inquire"
            >
              <span>Inquire</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FleetGrid({ yachts }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lengthRange, setLengthRange] = useState('all');
  const [guestFilter, setGuestFilter] = useState('all');
  const [cabinFilter, setCabinFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const gridRef = useScrollReveal();
  useHeroParallax();

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
      return { ...y, lengthM, guestsNum: Number(guests) || 0, cabinsNum: Number(cabs) || 0, priceNum, isFlagship };
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
  }, [yachts, activeCategory, lengthRange, guestFilter, cabinFilter, priceRange, sortBy]);

  const activeCatLabel = categories.find((c) => c.id === activeCategory)?.label || '';

  const resetFilters = useCallback(() => {
    setActiveCategory('all');
    setLengthRange('all');
    setGuestFilter('all');
    setCabinFilter('all');
    setPriceRange('all');
    setSortBy('recommended');
  }, []);

  return (
    <>
      {/* FILTER BAR — Glass-morphism */}
      <div className="fleet-filters">
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
            <span className="fleet-filters__label">Length</span>
            <select value={lengthRange} onChange={(e) => setLengthRange(e.target.value)} className="fleet-filters__select">
              {LENGTH_RANGES.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <span className="fleet-filters__label">Guests</span>
            <select value={guestFilter} onChange={(e) => setGuestFilter(e.target.value)} className="fleet-filters__select">
              {GUEST_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <span className="fleet-filters__label">Cabins</span>
            <select value={cabinFilter} onChange={(e) => setCabinFilter(e.target.value)} className="fleet-filters__select">
              {CABIN_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <span className="fleet-filters__label">Price</span>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="fleet-filters__select">
              {PRICE_RANGES.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="fleet-filters__select-group">
            <span className="fleet-filters__label">Sort</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="fleet-filters__select">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
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

      {/* YACHT GRID */}
      <div className="fleet-grid" ref={gridRef}>
        {filtered.map((yacht, i) => (
          <YachtCard key={yacht._id || yacht.slug} yacht={yacht} index={i} />
        ))}
      </div>

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
