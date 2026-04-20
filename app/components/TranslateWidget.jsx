'use client';

// Language selector — minimal flag-glyph button. Rendered twice:
//   1. Inside the top nav bar (desktop), small icon-only trigger
//      that sits on the far-right edge next to the social icons.
//      Activated via <TranslateWidget variant="inline" />.
//   2. Or, default variant="floating", a small pill pinned to
//      the bottom-left corner of the viewport — used as a
//      fallback / mobile lifeline.
//
// The dropdown panel itself is the same in both variants: black
// glass, gold hairline border, native flag + label per locale.

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function TranslateWidget({ variant = 'floating' }) {
  const { locale, setLocale, locales: availableLocales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const flags = { en: '🇺🇸', el: '🇬🇷', ar: '🇦🇪', ru: '🇷🇺', he: '🇮🇱' };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const currentFlag = flags[locale] || '🌐';
  const currentLabel = availableLocales.find(l => l.code === locale)?.label || 'English';

  // Wrapper classes per variant.
  // - inline: no positioning, drops naturally into the nav's flex row.
  // - floating: fixed bottom-left, small pill, always accessible.
  const wrapperClass =
    variant === 'inline'
      ? 'relative'
      : 'fixed z-[60] bottom-5 left-5 md:bottom-6 md:left-6';

  // Trigger button — icon-only for inline, compact pill for floating.
  const triggerStyle =
    variant === 'inline'
      ? {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer',
          transition: 'all 0.4s ease',
        }
      : {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '9px 14px',
          minHeight: '40px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(218,165,32,0.25)',
          cursor: 'pointer',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(218,165,32,0.75)',
          transition: 'all 0.3s ease',
        };

  return (
    <div ref={dropdownRef} className={wrapperClass}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        aria-label="Change language"
        style={triggerStyle}
        onMouseEnter={(e) => {
          if (variant === 'inline') {
            e.currentTarget.style.borderColor = 'rgba(218,165,32,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'inline') {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }
        }}
      >
        <span style={{ fontSize: variant === 'inline' ? '16px' : '14px', lineHeight: 1 }}>
          {currentFlag}
        </span>
        {variant === 'floating' && (
          <>
            <span className="hidden sm:inline">{currentLabel}</span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease',
              }}
            >
              <path d="M1 3l3 3 3-3" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            ...(variant === 'inline'
              ? { top: '100%', right: 0, marginTop: 10 }
              : { bottom: '100%', left: 0, marginBottom: 10 }),
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(218,165,32,0.2)',
            overflow: 'hidden',
            minWidth: 200,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgba(218,165,32,0.1)',
            fontFamily: "'Montserrat', sans-serif", fontSize: 8,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(218,165,32,0.4)',
          }}>
            Select Language
          </div>
          {availableLocales.map(lang => (
            <button
              key={lang.code}
              onClick={(e) => { e.stopPropagation(); setLocale(lang.code); setIsOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '11px 16px', fontFamily: "'Montserrat', sans-serif", fontSize: 11,
                color: locale === lang.code ? '#DAA520' : 'rgba(255,255,255,0.5)',
                background: locale === lang.code ? 'rgba(218,165,32,0.06)' : 'transparent',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{flags[lang.code] || '🌐'}</span>
              <span>{lang.label}</span>
              {locale === lang.code && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#DAA520' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
