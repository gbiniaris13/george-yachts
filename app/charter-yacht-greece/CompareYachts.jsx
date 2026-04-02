'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';

const GOLD = '#DAA520';
const DARK_BG = '#000000';
const CARD_BG = '#111111';
const BORDER = '#333333';
const TEXT_MUTED = '#999999';
const TEXT_LIGHT = '#E0E0E0';

const SPEC_KEYS = [
  { key: 'builder', label: 'Builder' },
  { key: 'length', label: 'Length' },
  { key: 'guests', label: 'Guests' },
  { key: 'cabins', label: 'Cabins' },
  { key: 'crew', label: 'Crew' },
  { key: 'cruiseSpeed', label: 'Cruise Speed' },
  { key: 'maxSpeed', label: 'Max Speed' },
  { key: 'weeklyRate', label: 'Weekly Rate' },
  { key: 'perPersonWeekLow', label: 'Low Season / Person / Week' },
  { key: 'perPersonWeekHigh', label: 'High Season / Person / Week' },
];

function parseNumeric(val) {
  if (val == null) return null;
  const s = String(val).replace(/[^0-9.]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function findBestValue(yachts, key) {
  const nums = yachts.map((y) => parseNumeric(y[key]));
  const valid = nums.filter((n) => n !== null);
  if (valid.length < 2) return null;
  // For price (weeklyRate), lower is not necessarily "better" in luxury context
  // For most specs, higher is better (guests, cabins, crew, speed, length)
  if (key === 'weeklyRate') return null; // Don't highlight price differences
  return Math.max(...valid);
}

export default function CompareYachts({ compareList = [], onRemove, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openModal = useCallback(() => {
    setAnimating(true);
    setIsOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimating(false));
    });
  }, []);

  const closeModal = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setAnimating(false);
    }, 400);
  }, []);

  // Precompute best values for highlighting
  const bestValues = useMemo(() => {
    const result = {};
    SPEC_KEYS.forEach(({ key }) => {
      result[key] = findBestValue(compareList, key);
    });
    return result;
  }, [compareList]);

  const count = compareList.length;

  if (count < 2 && !isOpen) return null;

  return (
    <>
      {/* Floating Compare Button */}
      {count >= 2 && !isOpen && (
        <button
          onClick={openModal}
          aria-label={`Compare ${count} yachts`}
          style={{
            position: 'fixed',
            bottom: isMobile ? 16 : 32,
            right: isMobile ? 16 : 32,
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: isMobile ? '14px 22px' : '16px 28px',
            backgroundColor: GOLD,
            color: '#000',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? 14 : 15,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 24px rgba(218, 165, 32, 0.4), 0 2px 8px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 32px rgba(218, 165, 32, 0.6), 0 4px 12px rgba(0,0,0,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(218, 165, 32, 0.4), 0 2px 8px rgba(0,0,0,0.5)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4" />
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          Compare ({count})
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Compare yachts"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            transform: animating && isOpen ? 'translateY(100%)' : animating && !isOpen ? 'translateY(100%)' : 'translateY(0)',
            opacity: animating ? 0 : 1,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '16px 20px' : '24px 40px',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              borderBottom: `1px solid ${BORDER}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: isMobile ? 22 : 32,
                  fontWeight: 400,
                  color: GOLD,
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                Compare Yachts
              </h2>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  color: TEXT_MUTED,
                  margin: '4px 0 0 0',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {count} yacht{count !== 1 ? 's' : ''} selected
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Clear All */}
              <button
                onClick={() => {
                  onClear?.();
                  closeModal();
                }}
                style={{
                  background: 'none',
                  border: `1px solid ${BORDER}`,
                  color: TEXT_MUTED,
                  padding: '8px 16px',
                  borderRadius: 4,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.color = GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.color = TEXT_MUTED;
                }}
              >
                Clear All
              </button>

              {/* Close Button */}
              <button
                onClick={closeModal}
                aria-label="Close comparison"
                style={{
                  background: 'none',
                  border: `1px solid ${BORDER}`,
                  color: TEXT_LIGHT,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.color = GOLD;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.color = TEXT_LIGHT;
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Smart Insights */}
          <CompareInsights compareList={compareList} isMobile={isMobile} />

          {/* Cards Container */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 20 : 24,
              padding: isMobile ? '24px 16px 40px' : '40px',
              justifyContent: 'center',
              alignItems: isMobile ? 'stretch' : 'flex-start',
              maxWidth: 1400,
              margin: '0 auto',
              width: '100%',
            }}
          >
            {compareList.map((yacht) => (
              <CompareCard
                key={yacht.slug}
                yacht={yacht}
                bestValues={bestValues}
                onRemove={onRemove}
                isMobile={isMobile}
                totalCards={count}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function CompareInsights({ compareList, isMobile }) {
  const insights = useMemo(() => {
    if (compareList.length < 2) return [];
    const result = [];

    // Helper: extract number from value string
    const num = (val) => {
      if (val == null) return null;
      const s = String(val).replace(/[^0-9.]/g, '');
      const n = parseFloat(s);
      return isNaN(n) ? null : n;
    };

    // --- Price insights ---
    const withPrice = compareList.filter(y => num(y.weeklyRate) > 0);
    if (withPrice.length >= 2) {
      const sorted = [...withPrice].sort((a, b) => num(a.weeklyRate) - num(b.weeklyRate));
      const cheapest = sorted[0];
      const priciest = sorted[sorted.length - 1];
      result.push({
        icon: '💰',
        text: `${cheapest.title} is the most affordable at ${cheapest.weeklyRate}/week`,
      });
      if (priciest.slug !== cheapest.slug) {
        result.push({
          icon: '👑',
          text: `${priciest.title} is the premium choice at ${priciest.weeklyRate}/week`,
        });
      }
    }

    // --- Size / Length ---
    const withLength = compareList.filter(y => num(y.length) > 0);
    if (withLength.length >= 2) {
      const sorted = [...withLength].sort((a, b) => num(b.length) - num(a.length));
      if (num(sorted[0].length) !== num(sorted[sorted.length - 1].length)) {
        result.push({
          icon: '📏',
          text: `${sorted[0].title} is the largest at ${sorted[0].length}`,
        });
      }
    }

    // --- Guest capacity ---
    const withGuests = compareList.filter(y => num(y.guests) > 0);
    if (withGuests.length >= 2) {
      const sorted = [...withGuests].sort((a, b) => num(b.guests) - num(a.guests));
      if (num(sorted[0].guests) !== num(sorted[sorted.length - 1].guests)) {
        result.push({
          icon: '👥',
          text: `${sorted[0].title} accommodates the most guests (${sorted[0].guests})`,
        });
      }
    }

    // --- Cabins ---
    const withCabins = compareList.filter(y => num(y.cabins) > 0);
    if (withCabins.length >= 2) {
      const sorted = [...withCabins].sort((a, b) => num(b.cabins) - num(a.cabins));
      if (num(sorted[0].cabins) !== num(sorted[sorted.length - 1].cabins)) {
        result.push({
          icon: '🛏️',
          text: `${sorted[0].title} offers the most cabins (${sorted[0].cabins})`,
        });
      }
    }

    // --- Crew ---
    const withCrew = compareList.filter(y => num(y.crew) > 0);
    if (withCrew.length >= 2) {
      const sorted = [...withCrew].sort((a, b) => num(b.crew) - num(a.crew));
      if (num(sorted[0].crew) !== num(sorted[sorted.length - 1].crew)) {
        result.push({
          icon: '⚓',
          text: `${sorted[0].title} has the largest crew (${sorted[0].crew} members)`,
        });
      }
    }

    // --- Per-person value ---
    const withPP = compareList.filter(y => num(y.perPersonWeekLow) > 0);
    if (withPP.length >= 2) {
      const sorted = [...withPP].sort((a, b) => num(a.perPersonWeekLow) - num(b.perPersonWeekLow));
      if (num(sorted[0].perPersonWeekLow) !== num(sorted[sorted.length - 1].perPersonWeekLow)) {
        result.push({
          icon: '✨',
          text: `Best value per person: ${sorted[0].title} at ${sorted[0].perPersonWeekLow}/person`,
        });
      }
    }

    return result;
  }, [compareList]);

  if (insights.length === 0) return null;

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        padding: isMobile ? '20px 16px 0' : '32px 40px 0',
      }}
    >
      <div
        style={{
          background: 'rgba(218, 165, 32, 0.06)',
          border: `1px solid rgba(218, 165, 32, 0.15)`,
          borderRadius: 10,
          padding: isMobile ? '16px 18px' : '20px 28px',
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: GOLD,
            margin: '0 0 14px',
          }}
        >
          Quick Insights
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {insights.map((insight, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{insight.icon}</span>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: isMobile ? 12 : 13,
                  color: TEXT_LIGHT,
                  lineHeight: 1.5,
                }}
              >
                {insight.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareCard({ yacht, bestValues, onRemove, isMobile, totalCards }) {
  const cardWidth = isMobile ? '100%' : totalCards === 2 ? '45%' : '31%';

  return (
    <div
      style={{
        width: cardWidth,
        maxWidth: isMobile ? '100%' : 420,
        backgroundColor: CARD_BG,
        borderRadius: 8,
        border: `1px solid ${BORDER}`,
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = GOLD;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER;
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isMobile ? 200 : 220,
          overflow: 'hidden',
          backgroundColor: '#1a1a1a',
        }}
      >
        {yacht.imageUrl ? (
          <Image
            src={yacht.imageUrl}
            alt={yacht.title || 'Yacht'}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: TEXT_MUTED,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
            }}
          >
            No Image Available
          </div>
        )}

        {/* Remove button overlay */}
        <button
          onClick={() => onRemove?.(yacht.slug)}
          aria-label={`Remove ${yacht.title} from comparison`}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            border: `1px solid ${BORDER}`,
            color: TEXT_LIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(200, 0, 0, 0.8)';
            e.currentTarget.style.borderColor = '#ff4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            e.currentTarget.style.borderColor = BORDER;
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Yacht Name */}
      <div
        style={{
          padding: '16px 20px 12px',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? 20 : 22,
            fontWeight: 500,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          {yacht.title || 'Unnamed Yacht'}
        </h3>
      </div>

      {/* Specs */}
      <div style={{ padding: '4px 0' }}>
        {SPEC_KEYS.map(({ key, label }) => {
          const value = yacht[key];
          if (value == null || value === '' || value === 'N/A') {
            return (
              <SpecRow key={key} label={label} value="--" highlighted={false} isMobile={isMobile} />
            );
          }

          const numVal = parseNumeric(value);
          const best = bestValues[key];
          const highlighted = best !== null && numVal !== null && numVal === best;

          return (
            <SpecRow
              key={key}
              label={label}
              value={String(value)}
              highlighted={highlighted}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </div>
  );
}

function SpecRow({ label, value, highlighted, isMobile }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '10px 20px' : '11px 20px',
        borderBottom: `1px solid rgba(51, 51, 51, 0.5)`,
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(218, 165, 32, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: isMobile ? 11 : 12,
          fontWeight: 500,
          color: TEXT_MUTED,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: isMobile ? 13 : 14,
          fontWeight: highlighted ? 700 : 500,
          color: highlighted ? GOLD : TEXT_LIGHT,
          textAlign: 'right',
          maxWidth: '55%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s ease',
        }}
      >
        {value}
        {highlighted && (
          <span style={{ marginLeft: 6, fontSize: 10, verticalAlign: 'middle' }}>
            &#9733;
          </span>
        )}
      </span>
    </div>
  );
}
