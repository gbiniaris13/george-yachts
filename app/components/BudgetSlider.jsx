'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const GOLD = '#DAA520';

const YACHTS_BY_BUDGET = [
  { name: 'S/Y Helidoni', slug: 'helidoni', price: 5900, guests: 8, type: 'Sailing Cat', length: '14m' },
  { name: 'S/Y Alegria', slug: 'alegria', price: 10900, guests: 8, type: 'Sailing Cat', length: '14m' },
  { name: 'S/Y Odyssey', slug: 'odyssey', price: 10900, guests: 8, type: 'Sailing Cat', length: '14m' },
  { name: 'S/Y My Star', slug: 'my-star', price: 12000, guests: 8, type: 'Sailing Cat', length: '14m' },
  { name: 'S/Y Shooting Star', slug: 'shooting-star', price: 13000, guests: 6, type: 'Monohull', length: '20m' },
  { name: 'M/Y Endless Beauty', slug: 'endless-beauty', price: 14000, guests: 6, type: 'Power Cat', length: '13m' },
  { name: 'S/Y Summer Star', slug: 'summer-star', price: 17000, guests: 10, type: 'Sailing Cat', length: '16m' },
  { name: 'S/Y Libra', slug: 'libra', price: 18900, guests: 10, type: 'Sailing Cat', length: '17m' },
  { name: 'S/Y Sahana', slug: 'sahana', price: 19500, guests: 8, type: 'Sailing Cat', length: '16m' },
  { name: 'S/Y Azul', slug: 'azul', price: 20000, guests: 8, type: 'Sailing Cat', length: '17m' },
  { name: "S/Y World's End", slug: 'worlds-end', price: 20500, guests: 10, type: 'Sailing Cat', length: '19m' },
  { name: 'Explorion', slug: 'explorion', price: 21000, guests: 8, type: 'Power Cat', length: '16m' },
  { name: 'S/Y Gigreca', slug: 'gigreca', price: 24000, guests: 8, type: 'Monohull', length: '24m' },
  { name: 'S/Y Kimata', slug: 'kimata', price: 31500, guests: 8, type: 'Sailing Cat', length: '20m' },
  { name: 'Alena', slug: 'alena', price: 34000, guests: 8, type: 'Power Cat', length: '20m' },
  { name: 'S/Y Nadamas', slug: 'nadamas', price: 35000, guests: 8, type: 'Monohull', length: '24m' },
  { name: 'S/Y Huayra', slug: 'huayra', price: 44000, guests: 8, type: 'Monohull', length: '31m' },
  { name: 'Alteya', slug: 'alteya', price: 49000, guests: 8, type: 'Power Cat', length: '21m' },
  { name: 'Crazy Horse', slug: 'crazy-horse', price: 50000, guests: 10, type: 'Sailing Cat', length: '24m' },
  { name: 'S/Y Genny', slug: 'genny', price: 56000, guests: 10, type: 'Sailing Cat', length: '24m' },
  { name: 'S/Y Aloia', slug: 'aloia', price: 65000, guests: 10, type: 'Sailing Cat', length: '24m' },
  { name: 'SAMARA', slug: 'samara', price: 65000, guests: 8, type: 'Power Cat', length: '24m' },
  { name: 'Alina', slug: 'alina', price: 70000, guests: 10, type: 'Power Cat', length: '24m' },
  { name: 'M/Y Brooklyn', slug: 'brooklyn', price: 85000, guests: 10, type: 'Motor Yacht', length: '36m' },
  { name: 'M/Y La Pellegrina 1', slug: 'la-pellegrina-1', price: 180000, guests: 12, type: 'Motor Yacht', length: '50m' },
];

export default function BudgetSlider() {
  const [budget, setBudget] = useState(30000);

  const matchingYachts = useMemo(() => {
    return YACHTS_BY_BUDGET.filter(y => y.price <= budget).slice(-3);
  }, [budget]);

  const totalAvailable = useMemo(() => {
    return YACHTS_BY_BUDGET.filter(y => y.price <= budget).length;
  }, [budget]);

  return (
    <section style={{ padding: '80px 24px', background: '#000', borderTop: '1px solid rgba(218,165,32,0.06)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}80`, textTransform: 'uppercase', marginBottom: 12 }}>
            Explore by Budget
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 8px' }}>
            What Can You Charter?
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            Slide to see which yachts fit your weekly budget
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
            min="5000"
            max="200000"
            step="1000"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD} ${((budget - 5000) / 195000) * 100}%, #222 ${((budget - 5000) / 195000) * 100}%, #222 100%)`,
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>€5,000</span>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>€200,000</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
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
