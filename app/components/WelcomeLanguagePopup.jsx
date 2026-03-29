'use client';

import { useState, useEffect } from 'react';

const GOLD = '#DAA520';

// Map browser languages to our supported languages + welcome messages
const LANGUAGE_MAP = {
  el: {
    flag: '🇬🇷',
    country: 'Greece',
    countryLocal: 'Ελλάδα',
    label: 'Ελληνικά',
    welcome: 'Καλώς ήρθατε',
    message: 'Βλέπουμε ότι μας επισκέπτεστε από την Ελλάδα. Θα σας δείξουμε το site στα Ελληνικά.',
    keepButton: 'Συνέχεια στα Ελληνικά',
    switchButton: 'View in English',
    code: 'el',
  },
  ar: {
    flag: '🇦🇪',
    country: 'UAE',
    countryLocal: 'الإمارات',
    label: 'العربية',
    welcome: 'أهلاً وسهلاً',
    message: 'نرى أنك تزورنا من الإمارات. سنعرض لك الموقع باللغة العربية.',
    keepButton: 'الاستمرار بالعربية',
    switchButton: 'View in English',
    code: 'ar',
  },
  ru: {
    flag: '🇷🇺',
    country: 'Russia',
    countryLocal: 'Россия',
    label: 'Русский',
    welcome: 'Добро пожаловать',
    message: 'Мы видим, что вы из России. Мы покажем вам сайт на русском языке.',
    keepButton: 'Продолжить на русском',
    switchButton: 'View in English',
    code: 'ru',
  },
  zh: {
    flag: '🇨🇳',
    country: 'China',
    countryLocal: '中国',
    label: '中文',
    welcome: '欢迎',
    message: '我们注意到您来自中国。我们将为您显示中文网站。',
    keepButton: '继续使用中文',
    switchButton: 'View in English',
    code: 'zh-CN',
  },
  fr: {
    flag: '🇫🇷',
    country: 'France',
    countryLocal: 'France',
    label: 'Français',
    welcome: 'Bienvenue',
    message: 'Nous voyons que vous nous visitez depuis la France. Nous afficherons le site en français.',
    keepButton: 'Continuer en français',
    switchButton: 'View in English',
    code: 'fr',
  },
  de: {
    flag: '🇩🇪',
    country: 'Germany',
    countryLocal: 'Deutschland',
    label: 'Deutsch',
    welcome: 'Willkommen',
    message: 'Wir sehen, dass Sie uns aus Deutschland besuchen. Wir zeigen Ihnen die Seite auf Deutsch.',
    keepButton: 'Weiter auf Deutsch',
    switchButton: 'View in English',
    code: 'de',
  },
  it: {
    flag: '🇮🇹',
    country: 'Italy',
    countryLocal: 'Italia',
    label: 'Italiano',
    welcome: 'Benvenuto',
    message: 'Vediamo che ci visiti dall\'Italia. Ti mostreremo il sito in italiano.',
    keepButton: 'Continua in italiano',
    switchButton: 'View in English',
    code: 'it',
  },
  es: {
    flag: '🇪🇸',
    country: 'Spain',
    countryLocal: 'España',
    label: 'Español',
    welcome: 'Bienvenido',
    message: 'Vemos que nos visitas desde España. Te mostraremos el sitio en español.',
    keepButton: 'Continuar en español',
    switchButton: 'View in English',
    code: 'es',
  },
  pt: {
    flag: '🇧🇷',
    country: 'Brazil',
    countryLocal: 'Brasil',
    label: 'Português',
    welcome: 'Bem-vindo',
    message: 'Vemos que você nos visita do Brasil. Mostraremos o site em português.',
    keepButton: 'Continuar em português',
    switchButton: 'View in English',
    code: 'pt',
  },
  ja: {
    flag: '🇯🇵',
    country: 'Japan',
    countryLocal: '日本',
    label: '日本語',
    welcome: 'ようこそ',
    message: '日本からのアクセスを確認しました。日本語でサイトを表示します。',
    keepButton: '日本語で続ける',
    switchButton: 'View in English',
    code: 'ja',
  },
  ko: {
    flag: '🇰🇷',
    country: 'South Korea',
    countryLocal: '한국',
    label: '한국어',
    welcome: '환영합니다',
    message: '한국에서 방문하신 것을 확인했습니다. 한국어로 사이트를 표시합니다.',
    keepButton: '한국어로 계속',
    switchButton: 'View in English',
    code: 'ko',
  },
  tr: {
    flag: '🇹🇷',
    country: 'Turkey',
    countryLocal: 'Türkiye',
    label: 'Türkçe',
    welcome: 'Hoş geldiniz',
    message: 'Türkiye\'den ziyaret ettiğinizi görüyoruz. Siteyi Türkçe olarak göstereceğiz.',
    keepButton: 'Türkçe devam et',
    switchButton: 'View in English',
    code: 'tr',
  },
};

export default function WelcomeLanguagePopup() {
  const [langData, setLangData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed
    if (typeof window === 'undefined') return;
    // Always show — every visit, every time

    // Detect browser language
    const browserLang = navigator.language?.split('-')[0] || 'en';

    // For non-English browsers, show personalized welcome
    const data = LANGUAGE_MAP[browserLang];
    if (data) {
      setTimeout(() => {
        setLangData(data);
        setVisible(true);
      }, 1500);
      return;
    }

    // For English browsers (or unsupported languages), show language chooser
    setTimeout(() => {
      setLangData({
        flag: '🌍',
        country: '',
        countryLocal: '',
        label: '',
        welcome: 'Welcome',
        message: 'This site is available in 15 languages. Would you like to view it in a different language?',
        keepButton: '🌐 Choose a Language',
        switchButton: 'Continue in English',
        code: null, // Will open translate dropdown instead
      });
      setVisible(true);
    }, 2000);
  }, []);

  const handleAcceptLanguage = () => {
    setClosing(true);

    if (!langData.code) {
      // English browser — clicked "Choose a Language" — scroll to top and let them use the dropdown
      setTimeout(() => {
        setVisible(false);
        // Click the translate dropdown button
        const btn = document.querySelector('[aria-label="Translate this page"], .fixed.z-\\[60\\] button');
        if (btn) btn.click();
      }, 400);
      return;
    }

    // Non-English browser — translate directly
    const d = new Date();
    d.setTime(d.getTime() + 30 * 86400000);
    document.cookie = `googtrans=/en/${langData.code};expires=${d.toUTCString()};path=/`;
    setTimeout(() => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langData.code;
        select.dispatchEvent(new Event('change'));
        setVisible(false);
      } else {
        setVisible(false);
        window.location.reload();
      }
    }, 500);
  };

  const handleStayEnglish = () => {
    // Close popup (will show again next visit)
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible || !langData) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: closing ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.7)',
        backdropFilter: closing ? 'blur(0px)' : 'blur(8px)',
        transition: 'all 0.5s ease',
      }}
      onClick={handleStayEnglish}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, #0a0a0a 0%, #111 100%)',
          border: `1px solid ${GOLD}25`,
          borderRadius: 20,
          padding: '48px 40px',
          maxWidth: 440,
          width: '90%',
          textAlign: 'center',
          opacity: closing ? 0 : 1,
          transform: closing ? 'scale(0.95) translateY(20px)' : 'scale(1) translateY(0)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 40px ${GOLD}08`,
        }}
      >
        {/* Flag */}
        <div style={{ fontSize: 56, marginBottom: 20, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
          {langData.flag}
        </div>

        {/* Welcome text in their language */}
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          color: '#fff',
          fontWeight: 300,
          marginBottom: 8,
        }}>
          {langData.welcome}
        </h2>

        {/* Gold line */}
        <div style={{
          width: 40,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          margin: '16px auto',
        }} />

        {/* Message in their language */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.8,
          marginBottom: 32,
          maxWidth: 320,
          margin: '0 auto 32px',
        }}>
          {langData.message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Accept translation — primary */}
          <button
            onClick={handleAcceptLanguage}
            style={{
              width: '100%',
              padding: '16px 24px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              background: `linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)`,
              color: '#000',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {langData.flag} {langData.keepButton}
          </button>

          {/* Stay in English — secondary */}
          <button
            onClick={handleStayEnglish}
            style={{
              width: '100%',
              padding: '14px 24px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: 'transparent',
              color: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            🇺🇸 {langData.switchButton}
          </button>
        </div>

        {/* Subtle branding */}
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 8,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(218,165,32,0.2)',
          marginTop: 24,
        }}>
          <span className="notranslate">George Yachts Brokerage House</span>
        </p>
      </div>
    </div>
  );
}
