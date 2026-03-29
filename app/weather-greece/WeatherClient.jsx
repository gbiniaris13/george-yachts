'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';
import { useState } from 'react';

const GOLD = '#DAA520';

const MONTHS = [
  { month: 'April', temp: 19, sea: 17, wind: 'Light', meltemi: false, crowds: 'Low', pricing: 'Low Season', rating: 3, desc: 'Spring awakening. Wildflowers cover the islands. Cool evenings, warm days. Perfect for hiking and exploring without crowds. Some restaurants still opening.' },
  { month: 'May', temp: 24, sea: 19, wind: 'Light–Moderate', meltemi: false, crowds: 'Low–Medium', pricing: 'Low Season', rating: 4, desc: 'The sweet spot for many. Warm enough to swim, empty enough to feel exclusive. Locals consider this the most beautiful month. Best rates of the warm season.' },
  { month: 'June', temp: 28, sea: 22, wind: 'Moderate', meltemi: false, crowds: 'Medium', pricing: 'Mid Season', rating: 5, desc: 'Early summer perfection. Long golden days, warm sea, everything open. No Meltemi yet. This is when experienced charterers book — before the peak rush.' },
  { month: 'July', temp: 32, sea: 25, wind: 'Strong', meltemi: true, crowds: 'High', pricing: 'High Season', rating: 4, desc: 'Peak summer. The Meltemi arrives — strong northerly winds in the Cyclades (15–25 knots). Exciting sailing but challenging for newcomers. Ionian stays calmer. Busy everywhere.' },
  { month: 'August', temp: 33, sea: 26, wind: 'Strong', meltemi: true, crowds: 'Very High', pricing: 'Peak Season', rating: 3, desc: 'The busiest month. Meltemi at its strongest. Marinas crowded, restaurants full, premium pricing. But the energy is unmatched — if you thrive on buzz, this is your month.' },
  { month: 'September', temp: 28, sea: 24, wind: 'Moderate', meltemi: false, crowds: 'Medium', pricing: 'Mid Season', rating: 5, desc: 'The insider\'s choice. Meltemi fades, sea is at its warmest, crowds thin out, prices drop. Many brokers consider this the single best month for Greek charter.' },
  { month: 'October', temp: 23, sea: 22, wind: 'Light–Moderate', meltemi: false, crowds: 'Low', pricing: 'Low Season', rating: 4, desc: 'Indian summer. Still warm enough for swimming. Harvest season — wine, olives, figs. The light turns golden. Some establishments begin closing late month.' },
];

const REGIONS = [
  { name: 'Cyclades', wind: 'Strong Meltemi Jul–Aug (15–30 kn)', best: 'Jun, Sep', note: 'The Meltemi makes July–August challenging for sailing beginners. Experienced sailors love it. Sheltered bays exist but require local knowledge.', icon: '🏛️' },
  { name: 'Ionian', wind: 'Gentle (5–15 kn year-round)', best: 'May–Oct', note: 'The calmest sailing ground in Greece. Protected waters, gentle thermal winds. Perfect for first-time charterers and families with children.', icon: '🌿' },
  { name: 'Saronic', wind: 'Light–Moderate (5–15 kn)', best: 'May–Oct', note: 'Close to Athens, sheltered by the Peloponnese. Short passages between islands. Ideal for weekend charters and short trips.', icon: '⚓' },
  { name: 'Sporades', wind: 'Moderate (8–18 kn)', best: 'Jun–Sep', note: 'More wind than the Ionian, less than the Cyclades. Marine park area with pristine waters. Best for nature lovers and divers.', icon: '🐬' },
  { name: 'Dodecanese', wind: 'Moderate–Strong (10–25 kn)', best: 'May–Jun, Sep–Oct', note: 'Similar wind patterns to Cyclades but slightly less intense. Rhodes and Kos as hubs. Turkey coast proximity adds options.', icon: '🏰' },
];

export default function WeatherClient() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[2]); // June default

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          Seasonal Intelligence
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px' }}>
          When to Charter in Greece
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          Wind, weather, crowds, and pricing — month by month. Know exactly when to go.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Month selector */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
          {MONTHS.map(m => (
            <button
              key={m.month}
              onClick={() => setSelectedMonth(m)}
              style={{
                padding: '12px 16px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: '0.1em',
                border: `1px solid ${selectedMonth.month === m.month ? GOLD : '#333'}`,
                background: selectedMonth.month === m.month ? `${GOLD}15` : 'transparent',
                color: selectedMonth.month === m.month ? GOLD : 'rgba(255,255,255,0.4)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {m.month.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Selected month detail */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(218,165,32,0.12)', borderRadius: 16, padding: 32, marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#fff', fontWeight: 300, margin: 0 }}>
              {selectedMonth.month}
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ fontSize: 16, opacity: s <= selectedMonth.rating ? 1 : 0.2 }}>⭐</span>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Air Temp', value: `${selectedMonth.temp}°C`, sub: `${Math.round(selectedMonth.temp * 9 / 5 + 32)}°F` },
              { label: 'Sea Temp', value: `${selectedMonth.sea}°C`, sub: `${Math.round(selectedMonth.sea * 9 / 5 + 32)}°F` },
              { label: 'Wind', value: selectedMonth.wind, sub: selectedMonth.meltemi ? '⚠️ Meltemi' : '✓ Calm' },
              { label: 'Crowds', value: selectedMonth.crowds },
              { label: 'Pricing', value: selectedMonth.pricing },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: stat.label === 'Wind' && selectedMonth.meltemi ? '#E74C3C' : '#fff' }}>{stat.value}</div>
                {stat.sub && <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: stat.sub.includes('Meltemi') ? '#E74C3C' : 'rgba(255,255,255,0.2)', marginTop: 2 }}>{stat.sub}</div>}
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, margin: 0 }}>
            {selectedMonth.desc}
          </p>
        </div>

        {/* Region wind guide */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#fff', fontWeight: 300, textAlign: 'center', marginBottom: 32 }}>
          Wind by Region
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
          {REGIONS.map((r, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#fff', fontWeight: 400, margin: 0 }}>{r.name}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>Typical Wind</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{r.wind}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>Best Months</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: GOLD }}>{r.best}</div>
                </div>
              </div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: 0 }}>
                {r.note}
              </p>
            </div>
          ))}
        </div>

        {/* George's tip */}
        <div style={{ background: 'rgba(218,165,32,0.05)', borderLeft: `3px solid ${GOLD}`, borderRadius: '0 12px 12px 0', padding: 24 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>George's Tip</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: '0 0 8px', fontStyle: 'italic' }}>
            "If I had to choose one month to charter in Greece, it would be June or September. June gives you long days and warm seas before the Meltemi arrives. September gives you the warmest water of the year after the crowds have gone. Both offer mid-season pricing — significantly less than July and August."
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: `${GOLD}80`, margin: 0 }}>
            — George P. Biniaris, Managing Broker
          </p>
        </div>
      </div>
    </div>
  );
}
