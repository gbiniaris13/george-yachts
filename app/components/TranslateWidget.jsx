'use client';

import { useState, useRef, useEffect } from 'react';

const GOLD = '#DAA520';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

// Use Google Translate via URL redirect method (no widget, no crash)
function translatePage(langCode) {
  if (langCode === 'en') {
    // If currently on translated page, go back to original
    if (window.location.hostname.includes('translate.goog')) {
      const originalUrl = new URL(window.location.href).searchParams.get('_x_tr_pto');
      window.location.href = 'https://georgeyachts.com';
    }
    return;
  }

  // Use Google Translate page translation (no widget needed)
  const currentUrl = window.location.href;
  const baseUrl = currentUrl.replace(/https?:\/\//, '').replace(/\/$/, '');
  window.open(
    `https://georgeyachts-com.translate.goog/${window.location.pathname}?_x_tr_sl=en&_x_tr_tl=${langCode}&_x_tr_hl=${langCode}&_x_tr_pto=wapp`,
    '_self'
  );
}

export default function TranslateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Detect if we're on a translated page
    if (typeof window !== 'undefined' && window.location.hostname.includes('translate.goog')) {
      const url = new URL(window.location.href);
      const lang = url.searchParams.get('_x_tr_tl');
      if (lang) setCurrentLang(lang);
    }

    // Saved language preference
    const saved = localStorage.getItem('gy-lang');
    if (saved) setCurrentLang(saved);

    // Click outside
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSelect = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('gy-lang', langCode);
    setIsOpen(false);
    translatePage(langCode);
  };

  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

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
        <span style={{ fontSize: '14px', lineHeight: 1 }}>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.label}</span>
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
          overflow: 'hidden', minWidth: 200, maxHeight: '70vh', overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgba(218,165,32,0.1)',
            fontFamily: "'Montserrat', sans-serif", fontSize: 8,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(218,165,32,0.4)',
          }}>
            Select Language
          </div>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={(e) => { e.stopPropagation(); handleSelect(lang.code); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '11px 16px', fontFamily: "'Montserrat', sans-serif", fontSize: 11,
                color: currentLang === lang.code ? '#DAA520' : 'rgba(255,255,255,0.5)',
                background: currentLang === lang.code ? 'rgba(218,165,32,0.06)' : 'transparent',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{lang.flag}</span>
              <span>{lang.label}</span>
              {currentLang === lang.code && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#DAA520' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
