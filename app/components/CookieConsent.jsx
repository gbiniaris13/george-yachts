'use client';

import { useState, useEffect } from 'react';

const GOLD = '#DAA520';
const ACCEPT_DAYS = 180; // 6 months
const DECLINE_DAYS = 30;  // 1 month

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('gy_cookie_consent');
    if (consent) {
      try {
        const { expires } = JSON.parse(consent);
        if (Date.now() < expires) return; // Still valid
      } catch {}
    }
    // Show after 2 seconds
    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(false));
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gy_cookie_consent', JSON.stringify({
      choice: 'accepted',
      expires: Date.now() + ACCEPT_DAYS * 86400000,
    }));
    dismiss();
  };

  const handleDecline = () => {
    localStorage.setItem('gy_cookie_consent', JSON.stringify({
      choice: 'declined',
      expires: Date.now() + DECLINE_DAYS * 86400000,
    }));
    dismiss();
  };

  const dismiss = () => {
    setAnimating(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${animating ? '20px' : '0'})`,
        opacity: animating ? 0 : 1,
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 9997,
        width: 'calc(100% - 48px)',
        maxWidth: 520,
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(218, 165, 32, 0.12)',
          borderRadius: 12,
          padding: '24px 28px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Title */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: GOLD,
            margin: '0 0 10px',
          }}
        >
          Your Privacy
        </p>

        {/* Text */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.5)',
            lineHeight: 1.7,
            margin: '0 0 20px',
          }}
        >
          We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. By accepting, you consent to our use of cookies.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleAccept}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: `linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)`,
              border: 'none',
              borderRadius: 6,
              color: '#000',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            style={{
              flex: 1,
              padding: '12px 20px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 6,
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Decline
          </button>
        </div>

        {/* Privacy link */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 8,
            color: 'rgba(255, 255, 255, 0.15)',
            margin: '12px 0 0',
            textAlign: 'center',
            letterSpacing: '0.08em',
          }}
        >
          View our{' '}
          <a
            href="/privacy-policy"
            style={{ color: 'rgba(218, 165, 32, 0.35)', textDecoration: 'none' }}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
