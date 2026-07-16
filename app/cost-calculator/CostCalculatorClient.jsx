'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';
import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';

// N.1 — debounced GA4 event when calculator inputs change. Fires
// at most once per 800ms so we don't flood with every slider tick.
function gtagEventDebounced(name, payload, delay = 800) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  const key = `__gy_debounce_${name}`;
  if (window[key]) clearTimeout(window[key]);
  window[key] = setTimeout(() => {
    try { window.gtag('event', name, payload || {}); } catch {}
  }, delay);
}

const GOLD = '#C9A84C';

const SEASONS = [
  { id: 'low', label: 'Low Season', months: 'Apr-May, Oct', desc: 'Quieter waters, cooler weather, best rates' },
  { id: 'mid', label: 'Mid Season', months: 'Jun, Sep', desc: 'Warm weather, moderate crowds' },
  { id: 'high', label: 'High Season', months: 'Jul-Aug', desc: 'Peak summer, busiest, premium rates' },
];

const TRANSFER_OPTIONS = [
  { id: 'none', label: 'No transfers needed', cost: 0 },
  { id: 'taxi', label: 'Private taxi (airport → marina)', cost: 80 },
  { id: 'sedan', label: 'Luxury sedan transfer', cost: 200 },
  { id: 'helicopter', label: 'Helicopter transfer', cost: 3500 },
];

function fmt(n) {
  return '€' + Math.round(n).toLocaleString('en-US');
}

export default function CostCalculatorClient({ yachts: YACHT_DATA = [] }) {
  const { t } = useI18n();
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [season, setSeason] = useState('mid');
  const [guestCount, setGuestCount] = useState(8);
  const [transfer, setTransfer] = useState('none');
  const [weeks, setWeeks] = useState(1);

  // N.1 — fire cost_calculator_used (debounced) on every input change
  // once a yacht has been selected (otherwise nothing meaningful to log).
  useEffect(() => {
    if (!selectedYacht) return;
    gtagEventDebounced('cost_calculator_used', {
      yacht_slug: selectedYacht,
      season,
      guests: guestCount,
      transfer,
      weeks,
    });
  }, [selectedYacht, season, guestCount, transfer, weeks]);

  const breakdown = useMemo(() => {
    if (!selectedYacht) return null;
    const yacht = YACHT_DATA.find(y => y.slug === selectedYacht);
    if (!yacht) return null;

    const actualGuests = Math.min(guestCount, yacht.guests);
    const seasonMultiplier = season === 'low' ? 0 : season === 'mid' ? 0.5 : 1;
    const charterRate = yacht.low + (yacht.high - yacht.low) * seasonMultiplier;
    const weeklyCharter = charterRate * weeks;
    // VAT estimated at the statutory 13% ceiling (real invoices run
    // 5.2-12% by certification). Statutory: 13% reduced on commercial crewed
    // charters over 48 hours (every weekly charter), applied ONLY to the
    // charter rate, not APA. (24% applies to charters under 48h, static,
    // or bareboat.) Per Law 5073/2023 + AADE Circular E.2006/2026.
    const vat = weeklyCharter * 0.13;
    // APA 30% is provisioning advance (fuel, food, marina fees) — not taxed
    const apa = weeklyCharter * 0.30;
    // Charter total = charter + VAT + APA
    const charterTotal = weeklyCharter + vat + apa;
    const perPersonWeek = Math.round(charterTotal / actualGuests / weeks);
    // Transfer is SEPARATE — per person, not included in charter total
    const transferCostPP = TRANSFER_OPTIONS.find(t => t.id === transfer)?.cost || 0;
    const totalTransfer = transferCostPP * actualGuests;

    return {
      yacht,
      charterRate: weeklyCharter,
      vat,
      apa,
      charterTotal,
      transferCostPP,
      totalTransfer,
      grandTotal: charterTotal + totalTransfer,
      perPersonWeek,
      guests: actualGuests,
      weeks,
    };
  }, [selectedYacht, season, guestCount, transfer, weeks]);

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontFamily: "var(--gy-font-ui)",
    fontSize: 13,
    background: 'rgba(248, 245, 240,0.03)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: 8,
    color: '#F8F5F0',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontFamily: "var(--gy-font-ui)",
    fontSize: 9,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'rgba(248, 245, 240,0.35)',
    marginBottom: 8,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1B2A' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          {t('calculator.tagline', 'Complete Transparency')}
        </p>
        <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 'clamp(56px, 10vw, 130px)', color: '#F8F5F0', fontWeight: 300, margin: '0 0 18px', letterSpacing: '-0.035em', lineHeight: 0.95, textShadow: '0 6px 32px rgba(13, 27, 42,0.55)' }}>
          {t('calculator.title', 'Charter Cost Calculator')}
        </h1>
        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: 'rgba(248, 245, 240,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          {t('calculator.subtitle', 'See exactly what your yacht charter will cost. No hidden fees. No surprises. Complete breakdown including APA, VAT, and transfers.')}
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 120px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="calc-layout">
        {/* LEFT — Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Yacht Selection */}
          <div>
            <label style={labelStyle}>{t('calculator.selectYacht', 'Select Your Yacht')}</label>
            <select
              value={selectedYacht || ''}
              onChange={(e) => {
                setSelectedYacht(e.target.value || null);
                const y = YACHT_DATA.find(yd => yd.slug === e.target.value);
                if (y) setGuestCount(Math.min(guestCount, y.guests));
              }}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="" style={{ background: '#0D1B2A' }}>{t('calculator.chooseYacht', 'Choose a yacht...')}</option>
              {YACHT_DATA.map(y => (
                <option key={y.slug} value={y.slug} style={{ background: '#0D1B2A' }}>
                  {y.name} - {fmt(y.low)}{y.high !== y.low ? ` to ${fmt(y.high)}` : ''}/week - up to {y.guests} guests
                </option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label style={labelStyle}>{t('calculator.season', 'Season')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {SEASONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSeason(s.id)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: `1px solid ${season === s.id ? GOLD : '#9CA3AF'}`,
                    background: season === s.id ? `${GOLD}15` : 'transparent',
                    color: season === s.id ? GOLD : 'rgba(248, 245, 240,0.4)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div>{t(`calculator.season${s.id.charAt(0).toUpperCase() + s.id.slice(1)}`, s.label)}</div>
                  <div style={{ fontSize: 8, opacity: 0.6, marginTop: 4 }}>{s.months}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div>
            <label style={labelStyle}>{t('calculator.numberOfGuests', 'Number of Guests')}: {guestCount}</label>
            <input
              type="range"
              min="2"
              max={selectedYacht ? YACHT_DATA.find(y => y.slug === selectedYacht)?.guests || 12 : 12}
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: GOLD }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(248, 245, 240,0.2)', fontFamily: "var(--gy-font-ui)", marginTop: 4 }}>
              <span>2</span>
              <span>{selectedYacht ? YACHT_DATA.find(y => y.slug === selectedYacht)?.guests || 12 : 12}</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label style={labelStyle}>{t('calculator.duration', 'Duration')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map(w => (
                <button
                  key={w}
                  onClick={() => setWeeks(w)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 11,
                    border: `1px solid ${weeks === w ? GOLD : '#9CA3AF'}`,
                    background: weeks === w ? `${GOLD}15` : 'transparent',
                    color: weeks === w ? GOLD : 'rgba(248, 245, 240,0.4)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {w} {w === 1 ? t('calculator.week', 'Week') : t('calculator.weeks', 'Weeks')}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer */}
          <div>
            <label style={labelStyle}>{t('calculator.airportTransfer', 'Airport Transfer')}</label>
            <select
              value={transfer}
              onChange={(e) => setTransfer(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {TRANSFER_OPTIONS.map(t => (
                <option key={t.id} value={t.id} style={{ background: '#0D1B2A' }}>
                  {t.label} {t.cost > 0 ? `(${fmt(t.cost)}/person)` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT — Breakdown */}
        <div>
          {breakdown ? (
            <div style={{
              background: 'rgba(248, 245, 240,0.02)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: 16,
              padding: 32,
              position: 'sticky',
              top: 120,
            }}>
              <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 24, color: '#F8F5F0', fontWeight: 300, marginBottom: 8 }}>
                {breakdown.yacht.name}
              </h3>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, color: 'rgba(248, 245, 240,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 32 }}>
                {breakdown.guests} {t('calculator.guestsLabel', 'guests')} · {weeks} {weeks === 1 ? t('calculator.week', 'Week').toLowerCase() : t('calculator.weeks', 'Weeks').toLowerCase()} · {t(`calculator.season${season.charAt(0).toUpperCase() + season.slice(1)}`, SEASONS.find(s => s.id === season)?.label)}
              </p>

              {/* Line items — Charter costs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                {[
                  { label: `${t('calculator.charterRate', 'Charter Rate')} (${breakdown.weeks}w)`, value: breakdown.charterRate, note: t('calculator.charterRateNote', 'Base weekly rate × duration') },
                  { label: `${t('calculator.vat', 'VAT')} (est. max 13%)`, value: breakdown.vat, note: t('calculator.vatNote', 'Estimated at the statutory ceiling - most yachts invoice 5.2-12% by certification') },
                  { label: `${t('calculator.apa', 'APA')} (30%)`, value: breakdown.apa, note: t('calculator.apaNote', 'Advance Provisioning Allowance - fuel, food, marina fees (not taxed)') },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid rgba(248, 245, 240,0.05)' }}>
                    <div>
                      <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: 'rgba(248,245,240,0.66)' }}>{item.label}</div>
                      <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, color: 'rgba(248, 245, 240,0.2)', marginTop: 2 }}>{item.note}</div>
                    </div>
                    <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: '#F8F5F0', fontWeight: 500 }}>
                      {fmt(item.value)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charter Total — ALL IN */}
              <div style={{
                background: `${GOLD}10`,
                border: `1px solid ${GOLD}30`,
                borderRadius: 12,
                padding: 24,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${GOLD}99`, marginBottom: 8 }}>
                  {t('calculator.charterTotal', 'Charter Total (All-In)')}
                </div>
                <div style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 36, color: GOLD, fontWeight: 400 }}>
                  {fmt(breakdown.charterTotal)}
                </div>
                <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, color: 'rgba(248, 245, 240,0.25)', marginTop: 4, letterSpacing: '0.1em' }}>
                  {t('calculator.charterTotalNote', 'Charter + VAT + APA · Final price · No hidden fees')}
                </div>
              </div>

              {/* Per person per week */}
              <div style={{ textAlign: 'center', padding: 20, background: 'rgba(248, 245, 240,0.02)', borderRadius: 8, marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(248, 245, 240,0.3)', marginBottom: 6 }}>{t('calculator.perPersonWeek', 'Per Person / Week (All-In)')}</div>
                <div style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 28, color: '#F8F5F0' }}>{fmt(breakdown.perPersonWeek)}</div>
                <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 8, color: 'rgba(248, 245, 240,0.2)', marginTop: 4 }}>
                  {breakdown.guests} {t('calculator.guestsLabel', 'guests')} · {breakdown.weeks} {breakdown.weeks === 1 ? t('calculator.week', 'Week').toLowerCase() : t('calculator.weeks', 'Weeks').toLowerCase()} · {t('calculator.inclApaVat', 'incl. APA & VAT')}
                </div>
              </div>

              {/* Transfer — SEPARATE section */}
              {breakdown.totalTransfer > 0 && (
                <div style={{ padding: 16, background: 'rgba(248, 245, 240,0.02)', border: '1px solid rgba(248, 245, 240,0.05)', borderRadius: 8, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, color: 'rgba(248, 245, 240,0.5)' }}>{t('calculator.airportTransfer', 'Airport Transfer')}</div>
                    <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: '#F8F5F0', fontWeight: 500 }}>{fmt(breakdown.totalTransfer)}</div>
                  </div>
                  <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, color: 'rgba(248, 245, 240,0.2)' }}>
                    {fmt(breakdown.transferCostPP)}/{t('calculator.person', 'person')} × {breakdown.guests} {t('calculator.guestsLabel', 'guests')} - {t('calculator.separateFromCharter', 'separate from charter cost')}
                  </div>
                </div>
              )}

              {/* Grand total with transfer */}
              {breakdown.totalTransfer > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', marginBottom: 24, borderTop: '1px solid rgba(248, 245, 240,0.05)' }}>
                  <div style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, color: 'rgba(248, 245, 240,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('calculator.totalInclTransfer', 'Total incl. Transfer')}</div>
                  <div style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 22, color: '#F8F5F0' }}>{fmt(breakdown.grandTotal)}</div>
                </div>
              )}

              {/* Disclaimer */}
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, color: 'rgba(248, 245, 240,0.2)', lineHeight: 1.8, marginBottom: 24 }}>
                * {t('calculator.disclaimer', 'Estimates based on standard rates. Actual APA may vary by itinerary. VAT is estimated at the statutory 13% ceiling for weekly crewed charters; most yachts are invoiced below it (5.2-12% by certification), so the true total is usually lower. Final pricing confirmed in your charter agreement.')}
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* N.1 / brief E.3 — primary CTA links to Smart Match Quiz */}
                <Link
                  href={`/yacht-finder?from=cost-calculator&yacht=${encodeURIComponent(breakdown.yacht.slug)}`}
                  onClick={() => {
                    try {
                      window.gtag?.('event', 'cost_calculator_cta_clicked', {
                        target: 'yacht_finder',
                        yacht_slug: breakdown.yacht.slug,
                        guests: breakdown.guests,
                        season,
                      });
                    } catch {}
                  }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px',
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    background: `linear-gradient(90deg, #C9A84C, #C9A84C, #C9A84C)`,
                    color: '#0D1B2A',
                    borderRadius: 6,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get exact pricing →
                </Link>
                <a
                  href={`https://api.whatsapp.com/send/?phone=17867988798&text=${encodeURIComponent(`Hi George, I used the cost calculator for ${breakdown.yacht.name}:\n\n${breakdown.guests} guests, ${breakdown.weeks} week(s), ${SEASONS.find(s => s.id === season)?.label}\nCharter all-in: ${fmt(breakdown.charterTotal)} (${fmt(breakdown.perPersonWeek)}/person/week)\nIncludes charter + VAT (est. max 13%) + APA 30%\n\nCan we discuss availability?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    try {
                      window.gtag?.('event', 'whatsapp_button_clicked', {
                        click_location: 'cost_calculator',
                        yacht_slug: breakdown.yacht.slug,
                      });
                    } catch {}
                  }}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    background: 'transparent',
                    color: 'rgba(248, 245, 240,0.85)',
                    border: '1px solid rgba(248, 245, 240,0.25)',
                    borderRadius: 6,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('calculator.discussEstimate', 'Or discuss with George on WhatsApp')}
                </a>
                <Link
                  href={`/yachts/${breakdown.yacht.slug}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    fontFamily: "var(--gy-font-ui)",
                    fontSize: 10,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    border: `1px solid ${GOLD}30`,
                    color: `${GOLD}99`,
                    borderRadius: 6,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('calculator.viewDetails', 'View Details')} - {breakdown.yacht.name}
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(248, 245, 240,0.02)',
              border: '1px solid rgba(248, 245, 240,0.05)',
              borderRadius: 16,
              padding: 60,
              textAlign: 'center',
              position: 'sticky',
              top: 120,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>⚓</div>
              <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 20, color: 'rgba(248, 245, 240,0.3)', marginBottom: 8 }}>
                {t('calculator.selectToBegin', 'Select a yacht to begin')}
              </p>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, color: 'rgba(248, 245, 240,0.15)', lineHeight: 1.8 }}>
                {t('calculator.selectToBeginDesc', 'Choose your yacht, season, and group size to see a complete cost breakdown.')}
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .calc-layout {
            grid-template-columns: 1fr !important;
          }
        }
        input[type="range"] {
          height: 4px;
          border-radius: 2px;
          background: #9CA3AF;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${GOLD};
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
