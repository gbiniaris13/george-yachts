'use client';

import Link from 'next/link';
import { useI18n } from "@/lib/i18n/I18nProvider";

const GOLD = '#DAA520';

const toolIcons = [
  (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      <circle cx="8" cy="9" r="1.5" fill={GOLD} stroke="none" />
      <circle cx="15" cy="13" r="1.5" fill={GOLD} stroke="none" />
      <line x1="8" y1="9" x2="15" y2="13" strokeDasharray="3 2" />
    </svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <path d="M12 15h4M12 12h2" />
    </svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
      <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4" />
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
];

export default function InteractiveTools() {
  const { t } = useI18n();

  const tools = [
    { href: '/yacht-finder', icon: toolIcons[0], title: t('tools.findYacht'), desc: t('tools.findYachtDesc'), cta: t('tools.findYachtCta') },
    { href: '/itinerary-builder', icon: toolIcons[1], title: t('tools.buildItinerary'), desc: t('tools.buildItineraryDesc'), cta: t('tools.buildItineraryCta') },
    { href: '/cost-calculator', icon: toolIcons[2], title: t('tools.costCalc'), desc: t('tools.costCalcDesc'), cta: t('tools.costCalcCta') },
    { href: '/island-quiz', icon: toolIcons[3], title: t('tools.islandQuiz'), desc: t('tools.islandQuizDesc'), cta: t('tools.islandQuizCta') },
    { href: '/charter-yacht-greece', icon: toolIcons[4], title: t('tools.compare'), desc: t('tools.compareDesc'), cta: t('tools.compareCta') },
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#000', borderTop: '1px solid rgba(218,165,32,0.06)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em',
            color: `${GOLD}80`, textTransform: 'uppercase', marginBottom: 12,
          }}>
            {t('tools.label')}
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: '#fff', fontWeight: 300, margin: 0,
          }}>
            {t('tools.title')}
          </h2>
        </div>

        {/* Tools grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                display: 'block',
                padding: '32px 28px',
                background: '#111',
                border: '1px solid #222',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${GOLD}40`;
                e.currentTarget.style.background = '#141414';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#222';
                e.currentTarget.style.background = '#111';
              }}
            >
              <div style={{ marginBottom: 20, opacity: 0.8 }}>{tool.icon}</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
                color: '#fff', margin: '0 0 8px 0', fontWeight: 400,
              }}>
                {tool.title}
              </h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 12,
                color: 'rgba(255,255,255,0.35)', margin: '0 0 20px 0', lineHeight: 1.6,
              }}>
                {tool.desc}
              </p>
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: GOLD, fontWeight: 600,
              }}>
                {tool.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
