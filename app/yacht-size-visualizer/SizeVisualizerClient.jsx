'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#DAA520';

const YACHTS = [
  // Motor Yachts
  { name: 'M/Y La Pellegrina 1', slug: 'la-pellegrina-1', length: 50, beam: 9, type: 'Motor Yacht' },
  { name: 'M/Y Brooklyn', slug: 'brooklyn', length: 36, beam: 7.5, type: 'Motor Yacht' },
  { name: 'M/Y Shero', slug: 'shero', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Vista', slug: 'vista', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y M Five', slug: 'm-five', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y One', slug: 'one', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y N.ICE', slug: 'n-ice', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Mary', slug: 'mary', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Lady L', slug: 'lady-l', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Sea U', slug: 'sea-u', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Summer Fun', slug: 'summer-fun', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Pareaki II', slug: 'pareaki-ii', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Star Link', slug: 'star-link', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: "M/Y Can't Remember", slug: 'cant-remember', length: 20, beam: 5.5, type: 'Motor Yacht' },
  { name: 'M/Y Crazy Horse', slug: 'crazy-horse', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'M/Y Endless Beauty', slug: 'endless-beauty', length: 13, beam: 7, type: 'Power Cat' },
  // Power Catamarans
  { name: 'M/Y Alina', slug: 'alina', length: 24, beam: 12, type: 'Power Cat' },
  { name: 'M/Y Alteya', slug: 'alteya', length: 21, beam: 10, type: 'Power Cat' },
  { name: 'SAMARA', slug: 'samara', length: 24, beam: 12, type: 'Power Cat' },
  { name: 'M/Y Christal MiO 80', slug: 'christal-mio-80', length: 24, beam: 12, type: 'Power Cat' },
  { name: 'Alena', slug: 'alena', length: 20, beam: 10, type: 'Power Cat' },
  { name: 'ChristAl MiO', slug: 'christal-mio', length: 20, beam: 10, type: 'Power Cat' },
  { name: 'Majesty of Greece', slug: 'majesty-of-greece', length: 20, beam: 10, type: 'Power Cat' },
  { name: 'Explorion', slug: 'explorion', length: 16, beam: 8, type: 'Power Cat' },
  // Sailing Catamarans — Large (80ft)
  { name: 'S/Y Ad Astra', slug: 'ad-astra', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'S/Y Aloia', slug: 'aloia', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'S/Y Sol Madinina', slug: 'sol-madinina', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'S/Y Genny', slug: 'genny', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'S/Y Above & Beyond', slug: 'above-beyond', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'S/Y Imladris', slug: 'imladris', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'S/Y Serenissima III', slug: 'serenissima-iii', length: 24, beam: 12, type: 'Sailing Cat' },
  { name: 'Just Marie 2', slug: 'just-marie-2', length: 24, beam: 12, type: 'Sailing Cat' },
  // Sailing Catamarans — Medium (67ft)
  { name: 'S/Y Kimata', slug: 'kimata', length: 20, beam: 10, type: 'Sailing Cat' },
  { name: 'S/Y Serenissima', slug: 'serenissima', length: 20, beam: 10, type: 'Sailing Cat' },
  { name: 'S/Y Alexandra II', slug: 'alexandra-ii', length: 20, beam: 10, type: 'Sailing Cat' },
  { name: 'S/Y Pixie', slug: 'pixie', length: 20, beam: 10, type: 'Sailing Cat' },
  { name: "S/Y World's End", slug: 'worlds-end', length: 19, beam: 9.5, type: 'Sailing Cat' },
  // Sailing Catamarans — Small (46-55ft)
  { name: 'S/Y Azul', slug: 'azul', length: 17, beam: 8.5, type: 'Sailing Cat' },
  { name: 'S/Y Libra', slug: 'libra', length: 17, beam: 8.5, type: 'Sailing Cat' },
  { name: 'S/Y Sahana', slug: 'sahana', length: 16, beam: 8, type: 'Sailing Cat' },
  { name: 'S/Y Summer Star', slug: 'summer-star', length: 16, beam: 8, type: 'Sailing Cat' },
  { name: 'S/Y Helidoni', slug: 'helidoni', length: 14, beam: 7.7, type: 'Sailing Cat' },
  { name: 'S/Y Alegria', slug: 'alegria', length: 14, beam: 7.7, type: 'Sailing Cat' },
  { name: 'S/Y Odyssey', slug: 'odyssey', length: 14, beam: 7, type: 'Sailing Cat' },
  { name: 'S/Y My Star', slug: 'my-star', length: 14, beam: 7.7, type: 'Sailing Cat' },
  // Sailing Monohulls
  { name: 'S/Y Huayra', slug: 'huayra', length: 31, beam: 7, type: 'Monohull' },
  { name: 'S/Y Aizu', slug: 'aizu', length: 30, beam: 6.5, type: 'Monohull' },
  { name: 'S/Y Nadamas', slug: 'nadamas', length: 24, beam: 5.5, type: 'Monohull' },
  { name: 'S/Y Gigreca', slug: 'gigreca', length: 24, beam: 5.5, type: 'Monohull' },
  { name: 'S/Y Shooting Star', slug: 'shooting-star', length: 20, beam: 5, type: 'Monohull' },
  // Cruise Ship
  { name: 'Elysium', slug: 'elysium', length: 49, beam: 9, type: 'Cruise Ship' },
];

const COMPARISONS = [
  { name: 'Tennis Court', length: 23.77, icon: '🎾', color: '#2ECC71' },
  { name: 'Basketball Court', length: 28.65, icon: '🏀', color: '#E67E22' },
  { name: 'Olympic Pool', length: 50, icon: '🏊', color: '#3498DB' },
  { name: 'Boeing 737', length: 39.5, icon: '✈️', color: '#95A5A6' },
  { name: 'NYC Studio Apt', length: 6, icon: '🏠', color: '#9B59B6' },
  { name: 'London Bus', length: 11.23, icon: '🚌', color: '#E74C3C' },
  { name: 'Blue Whale', length: 30, icon: '🐋', color: '#2980B9' },
];

function fmt(n) { return n.toFixed(1); }

export default function SizeVisualizerClient() {
  const { t } = useI18n();
  const [selectedYacht, setSelectedYacht] = useState(YACHTS[6]); // Genny default

  const comparisons = useMemo(() => {
    return COMPARISONS.map(c => ({
      ...c,
      ratio: selectedYacht.length / c.length,
      display: selectedYacht.length >= c.length
        ? `${fmt(selectedYacht.length / c.length)}× longer`
        : `${Math.round((c.length / selectedYacht.length) * 100)}% of its length`,
    }));
  }, [selectedYacht]);

  const maxLen = 55; // max scale for the bars

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          {t('tools.label', 'Interactive Tool')}
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px' }}>
          {t('sizeViz.title', 'How Big Is Your Yacht?')}
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
          {t('sizeViz.subtitle', "Numbers on paper don't tell the story. See how each yacht compares to things you know.")}
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 120px' }}>
        {/* Yacht selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 48 }}>
          {YACHTS.map(y => (
            <button
              key={y.slug}
              onClick={() => setSelectedYacht(y)}
              style={{
                padding: '10px 16px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: '0.1em',
                border: `1px solid ${selectedYacht.slug === y.slug ? GOLD : '#333'}`,
                background: selectedYacht.slug === y.slug ? `${GOLD}15` : 'transparent',
                color: selectedYacht.slug === y.slug ? GOLD : 'rgba(255,255,255,0.4)',
                borderRadius: 20,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {y.name} · {y.length}m
            </button>
          ))}
        </div>

        {/* Selected yacht info */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: '#fff', fontWeight: 300, margin: '0 0 8px' }}>
            {selectedYacht.name}
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: `${GOLD}80`, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {selectedYacht.length}m length · {selectedYacht.beam}m beam · {selectedYacht.type}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
            Total deck area ≈ {Math.round(selectedYacht.length * selectedYacht.beam * 0.7)}m² ({Math.round(selectedYacht.length * selectedYacht.beam * 0.7 * 10.76)} sq ft)
          </p>
        </div>

        {/* Visual comparison bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Yacht bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 100, textAlign: 'right', fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: GOLD, fontWeight: 600 }}>
              {t('sizeViz.yourYacht', 'Your Yacht')}
            </div>
            <div style={{ flex: 1, position: 'relative', height: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${(selectedYacht.length / maxLen) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${GOLD}40, ${GOLD})`,
                borderRadius: 4,
                transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 12,
              }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#000', fontWeight: 700 }}>
                  {selectedYacht.length}m
                </span>
              </div>
            </div>
          </div>

          {/* Comparison bars */}
          {comparisons.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 100, textAlign: 'right', fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                {c.icon} {c.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: 28, background: 'rgba(255,255,255,0.02)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min((c.length / maxLen) * 100, 100)}%`,
                  height: '100%',
                  background: `${c.color}30`,
                  borderRadius: 4,
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 8,
                }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
                    {c.length}m
                  </span>
                </div>
              </div>
              <div style={{ width: 120, fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: c.ratio >= 1 ? GOLD : 'rgba(255,255,255,0.3)' }}>
                {c.display}
              </div>
            </div>
          ))}
        </div>

        {/* Fun facts */}
        <div style={{ marginTop: 48, padding: 24, background: 'rgba(218,165,32,0.03)', border: `1px solid ${GOLD}15`, borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#fff', fontStyle: 'italic', margin: '0 0 8px' }}>
            "{selectedYacht.name} is as long as {fmt(selectedYacht.length / 11.23)} London buses parked end to end"
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0, letterSpacing: '0.1em' }}>
            Or {Math.round(selectedYacht.length / 6)} NYC studio apartments laid in a row
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link
            href={`/yachts/${selectedYacht.slug}`}
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: `linear-gradient(90deg, #E6C77A, #C9A24D)`,
              color: '#000',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            {t('common.viewDetails', 'View')} {selectedYacht.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
