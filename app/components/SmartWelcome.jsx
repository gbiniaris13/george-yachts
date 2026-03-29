'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#DAA520';

// Time-based message keys (translated via t())
function getTimeMessageKeys() {
  const hour = new Date().getHours();
  const day = new Date().getDay();

  if (hour >= 22 || hour < 5) return { textKey: 'smartWelcome.lateNight', subKey: 'smartWelcome.lateNightSub', icon: '🌙' };
  if (hour >= 5 && hour < 9) return { textKey: 'smartWelcome.morning', subKey: 'smartWelcome.morningSub', icon: '🌅' };
  if (day === 5 && hour >= 14) return { textKey: 'smartWelcome.friday', subKey: 'smartWelcome.fridaySub', icon: '⛵' };
  if (day === 0 || day === 6) return { textKey: 'smartWelcome.weekend', subKey: 'smartWelcome.weekendSub', icon: '🏝️' };
  if (hour >= 12 && hour < 14) return { textKey: 'smartWelcome.lunch', subKey: 'smartWelcome.lunchSub', icon: '🍷' };
  if (hour >= 17 && hour < 22) return { textKey: 'smartWelcome.evening', subKey: 'smartWelcome.eveningSub', icon: '🌊' };
  return { textKey: 'smartWelcome.default', subKey: 'smartWelcome.defaultSub', icon: '⚓' };
}

// Get previously viewed yachts from localStorage
function getViewHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const history = JSON.parse(localStorage.getItem('gy-view-history') || '[]');
    return history.slice(0, 3); // Last 3 viewed
  } catch { return []; }
}

// Track yacht views
export function trackYachtView(name, slug) {
  if (typeof window === 'undefined') return;
  try {
    const history = JSON.parse(localStorage.getItem('gy-view-history') || '[]');
    // Remove if already exists, add to front
    const filtered = history.filter(h => h.slug !== slug);
    filtered.unshift({ name, slug, time: Date.now() });
    localStorage.setItem('gy-view-history', JSON.stringify(filtered.slice(0, 10)));
    // Track visit count
    const visits = parseInt(localStorage.getItem('gy-visit-count') || '0') + 1;
    localStorage.setItem('gy-visit-count', String(visits));
  } catch {}
}

export default function SmartWelcome() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Small delay for dramatic effect
    const timer = setTimeout(() => {
      const timeMsg = getTimeMessageKeys();
      const viewHistory = getViewHistory();
      const visitCount = parseInt(localStorage.getItem('gy-visit-count') || '0');
      const isReturning = visitCount > 1;

      // Build the welcome data
      const welcomeData = {
        ...timeMsg,
        isReturning,
        visitCount,
        viewHistory,
      };

      setData(welcomeData);
      setVisible(true);

      // Auto-hide after 8 seconds
      setTimeout(() => {
        setClosing(true);
        setTimeout(() => setVisible(false), 500);
      }, 8000);
    }, 2500); // Show after 2.5s

    // Track visit
    const visits = parseInt(localStorage.getItem('gy-visit-count') || '0') + 1;
    localStorage.setItem('gy-visit-count', String(visits));

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible || !data) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        bottom: 100, // Above mobile CTA bar
        left: '50%',
        transform: `translateX(-50%) translateY(${closing ? '20px' : '0'})`,
        zIndex: 55,
        opacity: closing ? 0 : 1,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        maxWidth: 440,
        width: '92%',
      }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${GOLD}20`,
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${GOLD}05`,
      }}>
        {/* Return visitor — show what they viewed */}
        {data.isReturning && data.viewHistory.length > 0 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>👋</span>
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#fff', margin: 0, fontWeight: 300 }}>
                  {t('smartWelcome.returnVisitor')}
                </p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0, letterSpacing: '0.1em' }}>
                  Visit #{data.visitCount}
                </p>
              </div>
            </div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px', lineHeight: 1.6 }}>
              {t('smartWelcome.lastTime')}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {data.viewHistory.map(yacht => (
                <Link
                  key={yacht.slug}
                  href={`/yachts/${yacht.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: '6px 14px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    border: `1px solid ${GOLD}30`,
                    color: GOLD,
                    borderRadius: 20,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {yacht.name}
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* First visit or no history — show time-based message */
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 32, flexShrink: 0 }}>{data.icon}</span>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#fff', margin: '0 0 4px', fontWeight: 300 }}>
                {t(data.textKey || data.text)}
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: `${GOLD}80`, margin: 0, lineHeight: 1.5 }}>
                {t(data.subKey || data.sub)}
              </p>
            </div>
          </div>
        )}

        {/* Dismiss hint */}
        <div style={{
          position: 'absolute', top: 8, right: 12,
          fontFamily: "'Montserrat', sans-serif", fontSize: 8,
          color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em',
        }}>
          tap to dismiss
        </div>
      </div>
    </div>
  );
}
