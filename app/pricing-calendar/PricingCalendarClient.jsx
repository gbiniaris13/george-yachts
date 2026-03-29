'use client';

import { useState } from 'react';

const GOLD = '#DAA520';

// Pricing tiers by week (approximate for Greek charter market)
// 1=low, 2=mid-low, 3=mid, 4=mid-high, 5=peak
const WEEKS_2026 = [
  // April
  { week: 'Apr 4–10', tier: 1, label: 'Low', month: 'April' },
  { week: 'Apr 11–17', tier: 1, label: 'Low', month: 'April' },
  { week: 'Apr 18–24', tier: 1, label: 'Low', month: 'April' },
  { week: 'Apr 25–May 1', tier: 1, label: 'Low', month: 'April' },
  // May
  { week: 'May 2–8', tier: 1, label: 'Low', month: 'May' },
  { week: 'May 9–15', tier: 2, label: 'Value', month: 'May' },
  { week: 'May 16–22', tier: 2, label: 'Value', month: 'May' },
  { week: 'May 23–29', tier: 2, label: 'Value', month: 'May' },
  // June
  { week: 'Jun 6–12', tier: 3, label: 'Mid', month: 'June' },
  { week: 'Jun 13–19', tier: 3, label: 'Mid', month: 'June' },
  { week: 'Jun 20–26', tier: 3, label: 'Mid', month: 'June' },
  { week: 'Jun 27–Jul 3', tier: 4, label: 'High', month: 'June' },
  // July
  { week: 'Jul 4–10', tier: 4, label: 'High', month: 'July' },
  { week: 'Jul 11–17', tier: 5, label: 'Peak', month: 'July' },
  { week: 'Jul 18–24', tier: 5, label: 'Peak', month: 'July' },
  { week: 'Jul 25–31', tier: 5, label: 'Peak', month: 'July' },
  // August
  { week: 'Aug 1–7', tier: 5, label: 'Peak', month: 'August' },
  { week: 'Aug 8–14', tier: 5, label: 'Peak', month: 'August' },
  { week: 'Aug 15–21', tier: 5, label: 'Peak', month: 'August' },
  { week: 'Aug 22–28', tier: 4, label: 'High', month: 'August' },
  // September
  { week: 'Sep 5–11', tier: 3, label: 'Mid', month: 'September' },
  { week: 'Sep 12–18', tier: 3, label: 'Mid', month: 'September' },
  { week: 'Sep 19–25', tier: 2, label: 'Value', month: 'September' },
  { week: 'Sep 26–Oct 2', tier: 2, label: 'Value', month: 'September' },
  // October
  { week: 'Oct 3–9', tier: 1, label: 'Low', month: 'October' },
  { week: 'Oct 10–16', tier: 1, label: 'Low', month: 'October' },
  { week: 'Oct 17–23', tier: 1, label: 'Low', month: 'October' },
  { week: 'Oct 24–30', tier: 1, label: 'Low', month: 'October' },
];

const TIER_COLORS = {
  1: { bg: '#0D4D2B', text: '#2ECC71', label: 'Best Value', desc: 'Lowest rates, quiet islands, perfect weather starting', multiplier: '1×' },
  2: { bg: '#2D5A1E', text: '#82E06C', label: 'Great Value', desc: 'Warm weather, few crowds, excellent rates', multiplier: '1.2×' },
  3: { bg: '#5A5A1E', text: '#E6C77A', label: 'Mid Season', desc: 'Perfect conditions, moderate demand', multiplier: '1.5×' },
  4: { bg: '#5A3A1E', text: '#E6A23C', label: 'High Season', desc: 'Peak summer, busy islands, premium rates', multiplier: '1.8×' },
  5: { bg: '#5A1E1E', text: '#E74C3C', label: 'Peak Season', desc: 'Highest demand, book 6+ months ahead', multiplier: '2×' },
};

export default function PricingCalendarClient() {
  const [hoveredWeek, setHoveredWeek] = useState(null);

  const months = [...new Set(WEEKS_2026.map(w => w.month))];

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          Smart Planning
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px' }}>
          When Is the Best Time to Charter?
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          Green = best value. Red = peak pricing. Choose your week wisely.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
          {Object.entries(TIER_COLORS).map(([tier, info]) => (
            <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: info.bg, border: `1px solid ${info.text}30` }} />
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                {info.label}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {months.map(month => (
          <div key={month} style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#fff', fontWeight: 300, marginBottom: 12, paddingLeft: 4 }}>
              {month}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {WEEKS_2026.filter(w => w.month === month).map((w, i) => {
                const tier = TIER_COLORS[w.tier];
                const isHovered = hoveredWeek === w.week;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredWeek(w.week)}
                    onMouseLeave={() => setHoveredWeek(null)}
                    style={{
                      background: tier.bg,
                      border: `1px solid ${isHovered ? tier.text : `${tier.text}20`}`,
                      borderRadius: 10,
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#fff', marginBottom: 6, fontWeight: 500 }}>
                      {w.week}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: tier.text, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                        {tier.label}
                      </span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                        {tier.multiplier} rate
                      </span>
                    </div>
                    {isHovered && (
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)', margin: '8px 0 0', lineHeight: 1.5 }}>
                        {tier.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* George's tip */}
        <div style={{ marginTop: 40, borderLeft: `3px solid ${GOLD}`, paddingLeft: 24, paddingTop: 8, paddingBottom: 8 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>George's Tip</p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: '0 0 4px', fontStyle: 'italic' }}>
            "The sweet spots are late May, early June, and September. You get perfect weather, warm sea, empty islands — and save 30-50% compared to July and August. If your dates are flexible, these weeks deliver the best experience at the best price."
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: `${GOLD}60`, margin: 0 }}>
            — George P. Biniaris, Managing Broker
          </p>
        </div>
      </div>
    </div>
  );
}
