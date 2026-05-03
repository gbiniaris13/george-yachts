'use client';

// HotLeadIGPopup — Shows on premium pages after 30 seconds.
// Captures Instagram handle + optional email + interest dropdown.
// POSTs to the GY Command webhook which logs CRM + sends Telegram +
// schedules a personalized ManyChat DM.
//
// Triggers ONLY on:
//   - /fleet/50m-plus
//   - /fleet/luxury
//   - /charter-yacht-greece       (fleet page)
//   - /yachts/<slug>              (any yacht detail page)
//
// Auto-dismisses after 1 submission per browser (localStorage) and
// skips entirely if the regular LeadCapturePopup already captured
// someone in this session.

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  canShow,
  markActive,
  markInactive,
  markCaptured,
} from '@/lib/popup-coordinator';

const GOLD = '#DAA520';
const HOT_LEAD_IG_KEY = 'gy-hot-lead-ig-captured';
const LEAD_CAPTURED_KEY = 'gy-lead-captured';
// George 2026-04-21: 30 s was stacking with the WhatsApp bubble + any
// exit-intent fire → felt like a siege. Pushed to 2 min so this
// only surfaces to genuinely engaged visitors on premium pages.
const TRIGGER_DELAY_MS = 120_000;
const VISITOR_ID_KEY = 'gy-visitor-id';

function isPremiumPath(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith('/yachts/')) return true;
  if (pathname === '/yachts') return true;
  if (pathname === '/fleet/50m-plus') return true;
  if (pathname === '/fleet/luxury') return true;
  if (pathname === '/charter-yacht-greece') return true;
  return false;
}

function getVisitorId() {
  try {
    return localStorage.getItem(VISITOR_ID_KEY) ?? null;
  } catch {
    return null;
  }
}

export default function HotLeadIGPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [igHandle, setIgHandle] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('summer_charter');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [closing, setClosing] = useState(false);

  // Arm the timer when the visitor lands on a premium path.
  useEffect(() => {
    if (!isPremiumPath(pathname)) return;

    // Don't show if already captured (this device, any session)
    try {
      if (localStorage.getItem(HOT_LEAD_IG_KEY)) return;
      if (localStorage.getItem(LEAD_CAPTURED_KEY)) return;
    } catch {}

    const timer = setTimeout(() => {
      // Coordinator gate: skip if another popup is open or the
      // session has already shown one within the cooldown window.
      if (!canShow()) return;
      markActive();
      setIsOpen(true);
    }, TRIGGER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
      markInactive();
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const handle = igHandle.trim().replace(/^@+/, '');
    if (!handle) return;
    setSubmitting(true);

    const pagesViewed = [pathname];
    try {
      const session = JSON.parse(sessionStorage.getItem('gy-tracker-session') || 'null');
      if (session?.pages) pagesViewed.push(...session.pages);
    } catch {}

    const payload = {
      igHandle: handle,
      email: email.trim() || undefined,
      interest,
      pagesViewed: Array.from(new Set(pagesViewed)),
      name: name.trim() || undefined,
      visitorId: getVisitorId(),
    };

    try {
      // POST straight to the GY Command webhook. CORS is open on that
      // endpoint because it's designed to be called from the public
      // website.
      await fetch(
        'https://gy-command-george-biniaris-projects.vercel.app/api/webhooks/hot-lead',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }
      );

      // Also fire the regular /api/track event so the VisitorTracker
      // flow sees a lead_captured and the existing Telegram / CRM hooks
      // stay in sync.
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_captured',
          leadData: {
            name: name.trim() || `@${handle}`,
            email: email.trim(),
            phone: '',
            ig_handle: handle,
            interest,
          },
          yachtsViewed: [],
          timeOnSite: 0,
          isTest: false,
        }),
      });

      localStorage.setItem(
        HOT_LEAD_IG_KEY,
        JSON.stringify({ handle, date: new Date().toISOString() })
      );
      markCaptured();
      setSubmitted(true);
    } catch (err) {
      console.error('HotLeadIGPopup submit error:', err);
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
        zIndex: 10001,
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
          maxWidth: 440,
          width: '92%',
          position: 'relative',
          transform: closing ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 60px ${GOLD}08`,
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 8, right: 8,
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: 20,
            cursor: 'pointer', padding: 12,
            minWidth: 44, minHeight: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u2693'}</div>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, color: '#fff', margin: '0 0 12px',
              fontWeight: 400,
            }}>
              Catch you on Instagram.
            </h3>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7, margin: 0,
            }}>
              Check your DMs — George will reach out personally from @georgeyachts.
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10, color: GOLD, letterSpacing: '0.3em',
                textTransform: 'uppercase', marginBottom: 10,
              }}>
                Skip the forms
              </div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24, color: '#fff', margin: '0 0 10px',
                fontWeight: 400, lineHeight: 1.25,
              }}>
                Talk to George personally
              </h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12, color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.6, margin: 0,
              }}>
                Drop your Instagram — I&apos;ll send you a direct message today.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name (optional)"
                style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                placeholder="@yourinstagram"
                required
                style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${GOLD}40`,
                  borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff',
                  fontSize: 14, outline: 'none',
                  fontFamily: 'inherit',
                }}
              >
                <option value="summer_charter">Summer charter in Greece</option>
                <option value="specific_yacht">Specific yacht inquiry</option>
                <option value="browsing">Just browsing</option>
              </select>
              <button
                type="submit"
                disabled={submitting || !igHandle.trim()}
                style={{
                  marginTop: 6,
                  padding: '14px',
                  background: submitting ? 'rgba(218,165,32,0.3)' : GOLD,
                  color: '#0a0a0a',
                  border: 'none', borderRadius: 10,
                  fontSize: 12, fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600, letterSpacing: '0.15em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  opacity: submitting || !igHandle.trim() ? 0.5 : 1,
                }}
              >
                {submitting ? 'Sending…' : 'Get a DM from George'}
              </button>
              <p style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                textAlign: 'center',
                margin: '4px 0 0',
                fontFamily: "'Montserrat', sans-serif",
              }}>
                No spam. One DM. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
