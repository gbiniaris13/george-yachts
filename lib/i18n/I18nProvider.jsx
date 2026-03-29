'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

import en from './locales/en.json';
import el from './locales/el.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';

const locales = { en, el, ar, ru };

const I18nContext = createContext({ locale: 'en', t: (key) => key, setLocale: () => {} });

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    // Check localStorage for saved language
    const saved = typeof window !== 'undefined' && localStorage.getItem('gy-locale');
    if (saved && locales[saved]) {
      setLocaleState(saved);
      document.documentElement.lang = locales[saved].meta.lang;
      document.documentElement.dir = locales[saved].meta.dir;
    }
  }, []);

  const setLocale = useCallback((newLocale) => {
    if (!locales[newLocale]) return;
    setLocaleState(newLocale);
    localStorage.setItem('gy-locale', newLocale);
    document.documentElement.lang = locales[newLocale].meta.lang;
    document.documentElement.dir = locales[newLocale].meta.dir;
  }, []);

  // Get nested translation by dot-path: t('nav.charter')
  const t = useCallback((key, fallback) => {
    const keys = key.split('.');
    let value = locales[locale];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let enValue = locales.en;
        for (const ek of keys) {
          if (enValue && typeof enValue === 'object' && ek in enValue) {
            enValue = enValue[ek];
          } else {
            return fallback || key;
          }
        }
        return typeof enValue === 'string' ? enValue : (fallback || key);
      }
    }
    return typeof value === 'string' ? value : (fallback || key);
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, locales: Object.keys(locales).map(k => ({ code: k, label: locales[k].meta.label, dir: locales[k].meta.dir })) }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageSwitcher() {
  const { locale, setLocale, locales: availableLocales } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const flags = { en: '🇺🇸', el: '🇬🇷', ar: '🇦🇪', ru: '🇷🇺' };

  return (
    <div className="relative" style={{ zIndex: 60 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 transition-all duration-300"
        style={{
          padding: '7px 12px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(218,165,32,0.2)',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(218,165,32,0.7)',
        }}
      >
        <span style={{ fontSize: '14px' }}>{flags[locale] || '🌐'}</span>
        <span>{availableLocales.find(l => l.code === locale)?.label || 'EN'}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
          <path d="M1 3l3 3 3-3" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(218,165,32,0.2)',
            borderRadius: 12,
            overflow: 'hidden',
            minWidth: 160,
          }}
        >
          {availableLocales.map(l => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setIsOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 16px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                color: locale === l.code ? '#DAA520' : 'rgba(255,255,255,0.5)',
                background: locale === l.code ? 'rgba(218,165,32,0.08)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 16 }}>{flags[l.code] || '🌐'}</span>
              <span>{l.label}</span>
              {locale === l.code && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#DAA520' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
