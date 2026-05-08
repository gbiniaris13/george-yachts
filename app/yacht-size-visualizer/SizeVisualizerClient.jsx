'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#C9A84C';

const COMPARISONS = [
  { name: 'Tennis Court', key: 'tennisCourt', length: 23.77, icon: '🎾', color: '#2ECC71' },
  { name: 'Basketball Court', key: 'basketballCourt', length: 28.65, icon: '🏀', color: '#E67E22' },
  { name: 'Olympic Pool', key: 'olympicPool', length: 50, icon: '🏊', color: '#3498DB' },
  { name: 'Boeing 737', key: 'boeing737', length: 39.5, icon: '✈️', color: '#9CA3AF' },
  { name: 'NYC Studio Apt', key: 'nycStudio', length: 6, icon: '🏠', color: '#9B59B6' },
  { name: 'London Bus', key: 'londonBus', length: 11.23, icon: '🚌', color: '#E74C3C' },
  { name: 'Blue Whale', key: 'blueWhale', length: 30, icon: '🐋', color: '#2980B9' },
];

function fmt(n) { return n.toFixed(1); }

export default function SizeVisualizerClient({ yachts: YACHTS = [] }) {
  const { t } = useI18n();
  const [selectedYacht, setSelectedYacht] = useState(YACHTS[6]); // Genny default

  const comparisons = useMemo(() => {
    return COMPARISONS.map(c => ({
      ...c,
      ratio: selectedYacht.length / c.length,
      display: selectedYacht.length >= c.length
        ? `${fmt(selectedYacht.length / c.length)}× ${t('sizeViz.longer', 'longer')}`
        : `${Math.round((c.length / selectedYacht.length) * 100)}% ${t('sizeViz.ofItsLength', 'of its length')}`,
    }));
  }, [selectedYacht, t]);

  const maxLen = 55; // max scale for the bars

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          {t('tools.label', 'Interactive Tool')}
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(56px, 10vw, 130px)', color: '#F8F5F0', fontWeight: 300, margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 0.95, textShadow: '0 6px 32px rgba(0,0,0,0.55)' }}>
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
                border: `1px solid ${selectedYacht.slug === y.slug ? GOLD : '#9CA3AF'}`,
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
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: '#F8F5F0', fontWeight: 300, margin: '0 0 8px' }}>
            {selectedYacht.name}
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: `${GOLD}80`, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {selectedYacht.length}m {t('sizeViz.length', 'length')} · {selectedYacht.beam}m {t('sizeViz.beam', 'beam')} · {selectedYacht.type}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
            {t('sizeViz.deckArea', 'Total deck area')} ≈ {Math.round(selectedYacht.length * selectedYacht.beam * 0.7)}m² ({Math.round(selectedYacht.length * selectedYacht.beam * 0.7 * 10.76)} sq ft)
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
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#0D1B2A', fontWeight: 700 }}>
                  {selectedYacht.length}m
                </span>
              </div>
            </div>
          </div>

          {/* Comparison bars */}
          {comparisons.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 100, textAlign: 'right', fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                {c.icon} {t(`sizeViz.${c.key}`, c.name)}
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
        <div style={{ marginTop: 48, padding: 24, background: 'rgba(201,168,76,0.03)', border: `1px solid ${GOLD}15`, borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#F8F5F0', fontStyle: 'italic', margin: '0 0 8px' }}>
            "{selectedYacht.name} {t('sizeViz.asLongAs', 'is as long as')} {fmt(selectedYacht.length / 11.23)} {t('sizeViz.londonBusesEndToEnd', 'London buses parked end to end')}"
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0, letterSpacing: '0.1em' }}>
            {t('sizeViz.or', 'Or')} {Math.round(selectedYacht.length / 6)} {t('sizeViz.nycStudiosInRow', 'NYC studio apartments laid in a row')}
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
              background: `linear-gradient(90deg, #C9A84C, #C9A84C)`,
              color: '#0D1B2A',
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
