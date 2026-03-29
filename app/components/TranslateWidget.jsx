'use client';

import { useEffect, useState, useRef } from 'react';

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
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (loaded) return;

    // Google Translate init with AUTO-DETECT
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: LANGUAGES.map(l => l.code).join(','),
          autoDisplay: false,
          // This enables auto-translation based on browser language
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );

      // Auto-detect browser language and translate
      setTimeout(() => {
        const browserLang = navigator.language?.split('-')[0] || 'en';
        const supported = LANGUAGES.find(l => l.code === browserLang || l.code.startsWith(browserLang));
        if (supported && supported.code !== 'en') {
          triggerTranslation(supported.code);
          setCurrentLang(supported.code);
        }
      }, 1500);
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    setLoaded(true);

    // Close dropdown on click outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loaded]);

  const triggerTranslation = (langCode) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      setCurrentLang(langCode);
      setIsOpen(false);
    }
  };

  const resetToEnglish = () => {
    // Remove Google Translate cookie to reset
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.georgeyachts.com';
    window.location.reload();
  };

  const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ display: 'none', position: 'absolute', visibility: 'hidden' }} />

      {/* Custom language switcher */}
      <div ref={dropdownRef} className="fixed z-[60]" style={{ top: '20px', right: '20px' }}>
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 transition-all duration-300 hover:border-[rgba(218,165,32,0.5)]"
          style={{
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
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              background: 'rgba(0,0,0,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(218,165,32,0.15)',
              borderRadius: 12,
              overflow: 'hidden',
              minWidth: 200,
              maxHeight: '70vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(218,165,32,0.1)',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 8,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(218,165,32,0.4)',
            }}>
              Select Language
            </div>

            {/* Language options */}
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  if (lang.code === 'en') {
                    resetToEnglish();
                  } else {
                    triggerTranslation(lang.code);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '11px 16px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  color: currentLang === lang.code ? '#DAA520' : 'rgba(255,255,255,0.5)',
                  background: currentLang === lang.code ? 'rgba(218,165,32,0.06)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (currentLang !== lang.code) e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { if (currentLang !== lang.code) e.target.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16, lineHeight: 1 }}>{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang === lang.code && (
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: '#DAA520' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Override Google Translate styles */}
      <style jsx global>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; position: static !important; }
        .skiptranslate { display: none !important; }
        .goog-te-gadget { display: none !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background: none !important; box-shadow: none !important; }
        font[style] > font { background: none !important; }
      `}</style>
    </>
  );
}
