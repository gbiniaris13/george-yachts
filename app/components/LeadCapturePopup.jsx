'use client';

// LeadCapturePopup — Shows when visitor is a "hot lead"
// Triggered by VisitorTracker when: 3+ yachts viewed, same yacht 3x, or 5+ min on site
// Captures: name, email, phone → sends to Telegram + stores for CRM/Newsletter

import { useState, useEffect, useRef } from 'react';

const GOLD = '#DAA520';
const LEAD_CAPTURED_KEY = 'gy-lead-captured';

export default function LeadCapturePopup({ isOpen, onClose, hotLeadData }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);
  const formRef = useRef(null);

  // Don't show if already captured in this browser
  useEffect(() => {
    if (localStorage.getItem(LEAD_CAPTURED_KEY)) {
      onClose?.();
    }
  }, [onClose]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) return;
    setSubmitting(true);

    try {
      // Send to tracking API
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_captured',
          leadData: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          yachtsViewed: hotLeadData?.yachtsViewed || [],
          timeOnSite: hotLeadData?.timeOnSite || 0,
          isTest: false,
        }),
      });

      // Mark as captured locally
      localStorage.setItem(LEAD_CAPTURED_KEY, JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date: new Date().toISOString(),
      }));

      setSubmitted(true);
    } catch (err) {
      console.error('Lead capture error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #0a0a0a, #1a1a1a)',
          border: `1px solid ${GOLD}30`,
          borderRadius: 20,
          padding: '36px 32px',
          maxWidth: 420,
          width: '92%',
          position: 'relative',
          transform: closing ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px ${GOLD}08`,
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 20,
            cursor: 'pointer', padding: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u2693'}</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, color: '#fff', margin: '0 0 12px',
              fontWeight: 400,
            }}>
              Thank You!
            </h3>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7, margin: '0 0 20px',
            }}>
              Our yacht specialist will contact you within 24 hours with personalized recommendations and exclusive pricing.
            </p>
            <div style={{
              background: `${GOLD}15`,
              border: `1px solid ${GOLD}30`,
              borderRadius: 12, padding: '14px 18px',
            }}>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11, color: GOLD, margin: 0,
                letterSpacing: '0.05em',
              }}>
                {'\u{1F381}'} Your 10% early booking benefit has been activated
              </p>
            </div>
          </div>
        ) : (
          /* Form state */
          <>
            {/* Decorative top accent */}
            <div style={{
              width: 40, height: 2, background: GOLD,
              margin: '0 auto 24px', borderRadius: 1, opacity: 0.6,
            }} />

            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, color: '#fff', margin: '0 0 8px',
              fontWeight: 400, textAlign: 'center', lineHeight: 1.3,
            }}>
              Unlock Exclusive Pricing
            </h3>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12, color: 'rgba(255,255,255,0.5)',
              textAlign: 'center', margin: '0 0 24px',
              lineHeight: 1.6, letterSpacing: '0.02em',
            }}>
              You seem interested in our yachts. Leave your details and receive:
            </p>

            {/* Benefits list */}
            <div style={{ margin: '0 0 24px', padding: '0 8px' }}>
              {[
                { icon: '\u{1F3F7}\uFE0F', text: '10% early booking discount' },
                { icon: '\u{1F4CB}', text: 'Personalized yacht recommendations' },
                { icon: '\u{1F30A}', text: 'Priority availability updates' },
                { icon: '\u{1F4DE}', text: 'Direct line to our yacht specialist' },
              ].map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 8,
                }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{b.icon}</span>
                  <span style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 12, color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '0.02em',
                  }}>
                    {b.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={submitting || !name.trim() || (!email.trim() && !phone.trim())}
                style={{
                  marginTop: 4,
                  padding: '14px 24px',
                  background: submitting ? `${GOLD}60` : GOLD,
                  color: '#000',
                  border: 'none',
                  borderRadius: 10,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  cursor: submitting ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase',
                }}
              >
                {submitting ? 'Sending...' : 'Get My Exclusive Offer'}
              </button>
            </form>

            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 9, color: 'rgba(255,255,255,0.25)',
              textAlign: 'center', margin: '16px 0 0',
              letterSpacing: '0.05em', lineHeight: 1.5,
            }}>
              We respect your privacy. No spam, just yachts.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '13px 16px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  color: '#fff',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 13,
  outline: 'none',
  transition: 'border-color 0.3s ease',
  letterSpacing: '0.02em',
};
