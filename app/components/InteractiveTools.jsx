'use client';

import Link from 'next/link';

const GOLD = '#DAA520';

const tools = [
  {
    href: '/yacht-finder',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
    title: 'Find Your Yacht',
    desc: 'Answer 5 questions. Get matched with your perfect vessel.',
    cta: 'Start Quiz',
  },
  {
    href: '/itinerary-builder',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        <circle cx="8" cy="9" r="1.5" fill={GOLD} stroke="none" />
        <circle cx="15" cy="13" r="1.5" fill={GOLD} stroke="none" />
        <line x1="8" y1="9" x2="15" y2="13" strokeDasharray="3 2" />
      </svg>
    ),
    title: 'Build Your Itinerary',
    desc: 'Click islands on our interactive map. Design your dream route.',
    cta: 'Open Map',
  },
  {
    href: '/charter-yacht-greece',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2">
        <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4" />
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
        <line x1="12" y1="3" x2="12" y2="21" />
      </svg>
    ),
    title: 'Compare Yachts',
    desc: 'Select up to 3 yachts and see them side-by-side.',
    cta: 'Browse Fleet',
  },
];

export default function InteractiveTools() {
  return (
    <section style={{ padding: '80px 24px', background: '#000', borderTop: '1px solid rgba(218,165,32,0.06)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em',
            color: `${GOLD}80`, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Exclusive Tools
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: '#fff', fontWeight: 300, margin: 0,
          }}>
            Plan Your Charter Your Way
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
