'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

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

export default function TranslateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [ready, setReady] = useState(false);
  const dropdownRef = useRef(null);
  const initRef = useRef(false);

  // Initialize Google Translate
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Create the hidden element
    let el = document.getElementById('google_translate_element');
    if (!el) {
      el = document.createElement('div');
      el.id = 'google_translate_element';
      el.style.position = 'absolute';
      el.style.top = '-9999px';
      el.style.left = '-9999px';
      document.body.appendChild(el);
    }

    // Define the callback
    window.googleTranslateElementInit = function() {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: LANGUAGES.map(l => l.code).join(','),
            autoDisplay: false,
          },
          'google_translate_element'
        );
        setReady(true);
      } catch(e) {
        console.log('Google Translate init error:', e);
      }
    };

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => console.log('Google Translate script failed to load');
    document.head.appendChild(script);

    // Check current language from cookie
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    // Click outside handler
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const doTranslate = useCallback((langCode) => {
    if (langCode === 'en') {
      // Reset to English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.georgeyachts.com';
      setCurrentLang('en');
      setIsOpen(false);
      window.location.reload();
      return;
    }

    // Set cookie
    const expires = new Date(Date.now() + 30 * 86400000).toUTCString();
    document.cookie = `googtrans=/en/${langCode};expires=${expires};path=/`;

    // Try select method first
    const trySelect = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
        setCurrentLang(langCode);
        setIsOpen(false);
        return true;
      }
      return false;
    };

    if (!trySelect()) {
      // Select not ready, try again after delay, then reload
      setTimeout(() => {
        if (!trySelect()) {
          setCurrentLang(langCode);
          setIsOpen(false);
          window.location.reload();
        }
      }, 1000);
    }
  }, []);

  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <div ref={dropdownRef} className="fixed z-[60]" style={{ top: '20px', right: '20px' }}>
      {/* Toggle button */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
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

      {/* Dropdown */}
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
            {ready ? 'Select Language' : 'Loading...'}
          </div>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={(e) => { e.stopPropagation(); doTranslate(lang.code); }}
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

      {/* Hide Google Translate UI */}
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; position: static !important; }
        .skiptranslate { display: none !important; }
        .goog-te-gadget { font-size: 0 !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
        font > font { background: none !important; }
      `}</style>
    </div>
  );
}
