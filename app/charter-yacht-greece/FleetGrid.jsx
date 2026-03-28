'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Fallback data for yachts missing name/price/guests in Sanity
const YACHT_OVERRIDES = {
  'la-pellegrina-1': { name: 'M/Y LA PELLEGRINA 1', price: '€180,000 – €235,000', guests: 12, cabins: 5, crew: 9, builder: 'Couach 164', featured: true },
  'brooklyn': { name: 'M/Y BROOKLYN', price: '€85,000 – €105,000', guests: 10, cabins: 5, crew: 6, builder: 'Custom Built' },
  'ottawa': { name: 'M/Y OTTAWA', price: '€90,000 – €120,000', guests: 10, cabins: 5, crew: 7, builder: 'I-SEA Yachts' },
  'ariela': { name: 'M/Y ARIELA', price: '€95,000 – €125,000', guests: 10, cabins: 6, crew: 8, builder: 'CRN (Ferretti)' },
  'elysium': { name: 'Cruise Ship ELYSIUM', price: 'On Request', guests: 12, cabins: 6, crew: 14, builder: 'Custom', featured: true },
  'pareaki-ii': { name: 'M/Y PAREAKI II', price: '€80,000 – €100,000', guests: 10, cabins: 5, crew: 7 },
  'summer-fun': { name: 'M/Y SUMMER FUN', price: '€45,000 – €55,000', guests: 10, cabins: 4, crew: 5 },
  'one': { name: 'M/Y ONE', price: '€35,000 – €42,000', guests: 8, cabins: 4, crew: 4 },
  'cant-remember': { name: "M/Y CAN'T REMEMBER", price: '€55,000 – €70,000', guests: 10, cabins: 5, crew: 6 },
  'vista': { name: 'M/Y VISTA', price: '€30,000 – €38,000', guests: 8, cabins: 4, crew: 4 },
  'm-five': { name: 'M/Y M FIVE', price: '€22,000 – €28,000', guests: 8, cabins: 3, crew: 3 },
  'sea-u': { name: 'M/Y SEA U', price: '€20,000 – €25,000', guests: 8, cabins: 3, crew: 3 },
  'shero': { name: 'M/Y SHERO', price: '€28,000 – €35,000', guests: 8, cabins: 4, crew: 4 },
  'lady-l': { name: 'M/Y LADY L', price: '€17,500 – €20,000', guests: 8, cabins: 3, crew: 2, builder: 'Altamar 64' },
  'mary': { name: 'M/Y MARY', price: '€17,500 – €19,900', guests: 8, cabins: 3, crew: 2, builder: 'Ferretti 68' },
  'n-ice': { name: 'M/Y N.ICE', price: '€18,900 – €22,900', guests: 6, cabins: 3, crew: 2, builder: 'Omikron OT-60' },
  'star-link': { name: 'M/Y STAR LINK', price: '€35,000 – €45,000', guests: 8, cabins: 4, crew: 4 },
  'crazy-horse': { name: 'M/Y CRAZY HORSE', price: '€55,000 – €70,000', guests: 10, cabins: 5, crew: 6 },
  'alina': { name: 'M/Y ALINA', price: '€35,000 – €42,000', guests: 8, cabins: 4, crew: 4 },
  'samara': { name: 'M/Y SAMARA', price: '€30,000 – €38,000', guests: 8, cabins: 4, crew: 4 },
  'just-marie-2': { name: 'M/Y JUST MARIE 2', price: '€40,000 – €50,000', guests: 10, cabins: 5, crew: 5 },
  'christal-mio': { name: 'M/Y CHRISTAL MIO', price: '€55,000 – €65,000', guests: 12, cabins: 6, crew: 7 },
  'christal-mio-80': { name: 'M/Y CHRISTAL MIO 80', price: '€45,000 – €55,000', guests: 10, cabins: 4, crew: 5 },
  'alena': { name: 'M/Y ALENA', price: '€60,000 – €75,000', guests: 10, cabins: 5, crew: 6 },
  'majesty-of-greece': { name: 'M/Y MAJESTY OF GREECE', price: '€70,000 – €90,000', guests: 12, cabins: 6, crew: 8 },
  'endless-beauty': { name: 'P/C ENDLESS BEAUTY', price: '€14,000 – €17,500', guests: 6, cabins: 3, crew: 2, builder: 'Fountaine Pajot 44' },
  'genny': { name: 'S/Y GENNY', price: '€30,000 – €38,000', guests: 10, cabins: 5, crew: 4 },
  'summer-star': { name: 'S/Y SUMMER STAR', price: '€17,000 – €22,000', guests: 10, cabins: 4, crew: 2, builder: 'Lagoon 52' },
  'odyssey': { name: 'S/Y ODYSSEY', price: '€10,900 – €14,900', guests: 8, cabins: 3, crew: 2, builder: 'Nautitech 46 Fly' },
  'my-star': { name: 'S/Y MY STAR', price: '€12,000 – €15,000', guests: 8, cabins: 3, crew: 2, builder: 'Lagoon 46' },
  'helidoni': { name: 'S/Y HELIDONI', price: 'From €5,900', guests: 8, cabins: 3, crew: 2, builder: 'Fountaine Pajot Tanna 47' },
  'alegria': { name: 'S/Y ALEGRIA', price: 'From €10,900', guests: 8, cabins: 3, crew: 2, builder: 'Fountaine Pajot Saona 47' },
  'libra': { name: 'S/Y LIBRA', price: '€15,000 – €19,000', guests: 8, cabins: 4, crew: 2 },
  'worlds-end': { name: "S/Y WORLD'S END", price: '€18,000 – €24,000', guests: 8, cabins: 4, crew: 3 },
  'ad-astra': { name: 'S/Y AD ASTRA', price: '€32,000 – €40,000', guests: 10, cabins: 5, crew: 4, builder: 'Custom 80' },
  'azul': { name: 'S/Y AZUL', price: '€14,000 – €18,000', guests: 8, cabins: 4, crew: 2 },
  'serenissima': { name: 'S/Y SERENISSIMA', price: '€22,000 – €28,000', guests: 8, cabins: 4, crew: 3 },
  'serenissima-iii': { name: 'S/Y SERENISSIMA III', price: '€18,000 – €24,000', guests: 8, cabins: 4, crew: 3 },
  'above-beyond': { name: 'S/Y ABOVE & BEYOND', price: '€14,000 – €18,000', guests: 8, cabins: 4, crew: 2 },
  'kimata': { name: 'S/Y KIMATA', price: '€15,000 – €20,000', guests: 8, cabins: 4, crew: 2 },
  'pixie': { name: 'S/Y PIXIE', price: '€12,000 – €16,000', guests: 8, cabins: 3, crew: 2 },
  'nadamas': { name: 'S/Y NADAMAS', price: '€22,000 – €30,000', guests: 8, cabins: 4, crew: 3 },
  'huayra': { name: 'S/Y HUAYRA', price: '€35,000 – €45,000', guests: 8, cabins: 4, crew: 4 },
  'alexandra-ii': { name: 'S/Y ALEXANDRA II', price: '€20,000 – €26,000', guests: 8, cabins: 4, crew: 3 },
  'imladris': { name: 'S/Y IMLADRIS', price: '€18,000 – €24,000', guests: 8, cabins: 4, crew: 3 },
  'sahana': { name: 'S/Y SAHANA', price: '€16,000 – €20,000', guests: 8, cabins: 4, crew: 2 },
  'aloia': { name: 'S/Y ALOIA', price: '€14,000 – €18,000', guests: 6, cabins: 3, crew: 2 },
  'sol-madinina': { name: 'S/Y SOL MADININA', price: '€12,000 – €16,000', guests: 6, cabins: 3, crew: 2 },
  'explorion': { name: 'P/C EXPLORION', price: '€16,000 – €20,000', guests: 8, cabins: 4, crew: 2 },
  'alteya': { name: 'P/C ALTEYA', price: '€25,000 – €32,000', guests: 10, cabins: 5, crew: 3 },
  'shooting-star': { name: 'S/Y SHOOTING STAR', price: 'From €13,000', guests: 6, cabins: 3, crew: 2, builder: 'Gianetti 65' },
  'aizu': { name: 'S/Y AIZU', price: '€30,000 – €40,000', guests: 8, cabins: 4, crew: 4 },
  'gigreca': { name: 'S/Y GIGRECA', price: '€20,000 – €28,000', guests: 6, cabins: 3, crew: 3 },
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
  { id: 'medium', label: '20m – 40m' },
  { id: 'large', label: '40m+' },
];

const GUEST_OPTIONS = [
  { id: 'all', label: 'Any Guests' },
  { id: '6', label: 'Up to 6' },
  { id: '8', label: 'Up to 8' },
  { id: '10', label: 'Up to 10' },
  { id: '12', label: 'Up to 12' },
];

function parseLengthMeters(lengthStr) {
  if (!lengthStr) return 0;
  const match = String(lengthStr).match(/([\d.]+)\s*m/i);
  if (match) return parseFloat(match[1]);
  const numMatch = String(lengthStr).match(/([\d.]+)/);
  return numMatch ? parseFloat(numMatch[1]) : 0;
}

function YachtCard({ yacht, index }) {
  const slug = yacht.slug;
  const override = YACHT_OVERRIDES[slug] || {};
  const name = yacht.name || override.name || slug?.replace(/-/g, ' ').toUpperCase() || 'Yacht';
  const price = yacht.weeklyRatePrice || override.price || 'On Request';
  const guests = yacht.sleeps || override.guests || '–';
  const cabins = yacht.cabins || override.cabins || '–';
  const builder = yacht.subtitle || override.builder || yacht.builder || '';
  const isFeatured = override.featured || false;
  const imageUrl = yacht.imageUrl;
  const lengthShort = yacht.length ? yacht.length.split('/')[0].trim() : '–';

  return (
    <div
      className="fleet-card"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.6)}s` }}
    >
      {/* Image */}
      <Link href={`/yachts/${slug}`} className="fleet-card__image-link">
        <div className="fleet-card__image-wrap">
          {imageUrl ? (
            <Image
              src={`${imageUrl}?w=600&h=400&fit=crop&auto=format`}
              alt={`${name} - luxury yacht charter Greece`}
              width={600}
              height={400}
              loading={index < 6 ? 'eager' : 'lazy'}
              className="fleet-card__img"
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
          {/* Featured badge */}
          {isFeatured && (
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
              Details
            </Link>
            <a
              href="https://calendly.com/george-georgeyachts/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="fleet-card__btn fleet-card__btn--inquire"
            >
              Inquire
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
  const [sortBy, setSortBy] = useState('featured');

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

  // Enrich and filter
  const filtered = useMemo(() => {
    let result = yachts.map((y) => {
      const slug = y.slug;
      const override = YACHT_OVERRIDES[slug] || {};
      const lengthM = parseLengthMeters(y.length);
      const guests = y.sleeps || override.guests || 0;
      return { ...y, lengthM, guestsNum: Number(guests) || 0, featured: override.featured || false };
    });

    if (activeCategory !== 'all') {
      result = result.filter((y) => y.category === activeCategory);
    }
    if (lengthRange === 'small') result = result.filter((y) => y.lengthM < 20);
    if (lengthRange === 'medium') result = result.filter((y) => y.lengthM >= 20 && y.lengthM <= 40);
    if (lengthRange === 'large') result = result.filter((y) => y.lengthM > 40);
    if (guestFilter !== 'all') result = result.filter((y) => y.guestsNum <= parseInt(guestFilter));

    if (sortBy === 'featured') result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.lengthM - a.lengthM);
    if (sortBy === 'length-desc') result.sort((a, b) => b.lengthM - a.lengthM);
    if (sortBy === 'length-asc') result.sort((a, b) => a.lengthM - b.lengthM);
    if (sortBy === 'guests') result.sort((a, b) => b.guestsNum - a.guestsNum);

    return result;
  }, [yachts, activeCategory, lengthRange, guestFilter, sortBy]);

  const activeCatLabel = categories.find((c) => c.id === activeCategory)?.label || '';

  return (
    <>
      {/* FILTER BAR */}
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
            <span className="fleet-filters__label">Sort</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="fleet-filters__select">
              <option value="featured">Featured</option>
              <option value="length-desc">Largest First</option>
              <option value="length-asc">Smallest First</option>
              <option value="guests">Most Guests</option>
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
        <div className="fleet-results__note">Prices per week · Plus VAT &amp; APA</div>
      </div>

      {/* YACHT GRID */}
      <div className="fleet-grid">
        {filtered.map((yacht, i) => (
          <YachtCard key={yacht._id || yacht.slug} yacht={yacht} index={i} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="fleet-empty">
          <p className="fleet-empty__text">No yachts match your filters</p>
          <button
            onClick={() => { setActiveCategory('all'); setLengthRange('all'); setGuestFilter('all'); }}
            className="fleet-empty__reset"
          >
            Reset Filters
          </button>
        </div>
      )}
    </>
  );
}
