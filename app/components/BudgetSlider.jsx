'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#DAA520';

export default function BudgetSlider({ yachts = [] }) {
  const { t } = useI18n();

  const minPrice = useMemo(() => yachts.length ? yachts[0].price : 5000, [yachts]);
  const maxPrice = useMemo(() => yachts.length ? yachts[yachts.length - 1].price : 200000, [yachts]);

  const [budget, setBudget] = useState(() => {
    if (!yachts.length) return 30000;
    return Math.min(30000, maxPrice);
  });

  const matchingYachts = useMemo(() => {
    return yachts.filter(y => y.price <= budget).slice(-3);
  }, [budget, yachts]);

  const totalAvailable = useMemo(() => {
    return yachts.filter(y => y.price <= budget).length;
  }, [budget, yachts]);

  if (!yachts.length) return null;

  const sliderMin = Math.floor(minPrice / 1000) * 1000;
  const sliderMax = Math.ceil(maxPrice / 1000) * 1000;
  const range = sliderMax - sliderMin || 1;

  return (
    <section style={{ padding: '80px 24px', background: '#000', borderTop: '1px solid rgba(218,165,32,0.06)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}80`, textTransform: 'uppercase', marginBottom: 12 }}>
            {t('budget.label')}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 8px' }}>
            {t('budget.title')}
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            {t('budget.subtitle')}
          </p>
        </div>

        {/* Budget display */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: GOLD, fontWeight: 300 }}>
            €{budget.toLocaleString()}
          </div>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
            per week · charter rate
          </div>
        </div>

        {/* Slider */}
        <div style={{ padding: '0 12px', marginBottom: 32 }}>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step="1000"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD} ${((budget - sliderMin) / range) * 100}%, #222 ${((budget - sliderMin) / range) * 100}%, #222 100%)`,
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>€{sliderMin.toLocaleString()}</span>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>€{sliderMax.toLocaleString()}</span>
          </div>
        </div>

        {/* Results count */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ color: GOLD, fontWeight: 600 }}>{totalAvailable}</span> {totalAvailable === 1 ? 'yacht' : 'yachts'} available at this budget
          </span>
        </div>

        {/* Top 3 matching yachts */}
        {matchingYachts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 12 }}>
            {matchingYachts.map(yacht => (
              <Link
                key={yacht.slug}
                href={`/yachts/${yacht.slug}`}
                style={{
                  display: 'block',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(218,165,32,0.1)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <h3 className="notranslate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#fff', margin: '0 0 6px', fontWeight: 400 }}>
                  {yacht.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: '0 0 8px', letterSpacing: '0.1em' }}>
                  {yacht.type} · {yacht.length} · {yacht.guests} guests
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: GOLD, margin: 0, fontWeight: 500 }}>
                  €{yacht.price.toLocaleString()}/week
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)', fontFamily: "'Montserrat', sans-serif", fontSize: 12 }}>
            Slide right to discover yachts in your budget range
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link
            href="/charter-yacht-greece"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: `${GOLD}80`,
              textDecoration: 'none',
              borderBottom: `1px solid ${GOLD}30`,
              paddingBottom: 2,
            }}
          >
            View all {totalAvailable} yachts →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${GOLD};
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 12px rgba(218,165,32,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${GOLD};
          cursor: pointer;
          border: none;
        }
      `}</style>
    </section>
  );
}
