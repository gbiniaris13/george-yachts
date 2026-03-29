'use client';

import { useEffect, useState } from 'react';

export default function TranslateWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Add Google Translate script
    if (loaded) return;

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,el,ar,ru,zh-CN,fr,de,it,es,pt,ja,ko,tr,nl,pl',
          layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    setLoaded(true);

    return () => {
      // Cleanup
      delete window.googleTranslateElementInit;
    };
  }, [loaded]);

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      {/* Custom styled button */}
      <button
        onClick={() => {
          // Find and click the Google Translate select
          const select = document.querySelector('.goog-te-combo');
          if (select) {
            setIsOpen(!isOpen);
            if (!isOpen) select.focus();
          }
        }}
        className="fixed z-50 flex items-center gap-2 transition-all duration-300"
        style={{
          top: '24px',
          right: '24px',
          padding: '8px 14px',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(218,165,32,0.2)',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '9px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(218,165,32,0.7)',
        }}
        aria-label="Translate this page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
        <span>Translate</span>
      </button>

      {/* Override Google Translate styles to match our design */}
      <style jsx global>{`
        /* Hide Google Translate bar at top */
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }

        /* Style the dropdown when visible */
        .goog-te-combo {
          position: fixed !important;
          top: 60px !important;
          right: 24px !important;
          z-index: 9999 !important;
          background: rgba(0,0,0,0.95) !important;
          color: #DAA520 !important;
          border: 1px solid rgba(218,165,32,0.3) !important;
          border-radius: 8px !important;
          padding: 10px 16px !important;
          font-family: 'Montserrat', sans-serif !important;
          font-size: 12px !important;
          letter-spacing: 0.05em !important;
          outline: none !important;
          cursor: pointer !important;
          min-width: 180px !important;
          backdrop-filter: blur(16px) !important;
        }

        .goog-te-combo option {
          background: #111 !important;
          color: #fff !important;
          padding: 8px !important;
        }

        /* Hide Google Translate credit */
        .goog-te-gadget > span { display: none !important; }
        .goog-te-gadget { color: transparent !important; font-size: 0 !important; }

        /* Hide the "Powered by Google" text */
        .goog-logo-link { display: none !important; }
        .goog-te-gadget .goog-te-combo { margin: 0 !important; }

        /* Fix body shift from Google Translate */
        .skiptranslate { display: none !important; }
        body { top: 0 !important; position: static !important; }
      `}</style>
    </>
  );
}
