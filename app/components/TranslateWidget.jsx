'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#DAA520';

export default function TranslateWidget() {
  const { locale, setLocale, locales: availableLocales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const flags = { en: '🇺🇸', el: '🇬🇷', ar: '🇦🇪', ru: '🇷🇺' };

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

  return (
    <div ref={dropdownRef} className="fixed z-[60]" style={{ top: '20px', right: '20px' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '7px 14px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(218,165,32,0.2)',
          borderRadius: '24px',
          cursor: 'pointer',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(218,165,32,0.7)',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{ fontSize: '14px', lineHeight: 1 }}>{currentFlag}</span>
        <span className="hidden sm:inline">{currentLabel}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
          <path d="M1 3l3 3 3-3" />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(218,165,32,0.15)', borderRadius: 12,
          overflow: 'hidden', minWidth: 200,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
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
