'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '../components/WishlistProvider';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#DAA520';

const inputStyle = {
  padding: '12px 16px',
  background: '#000',
  border: '1px solid #333',
  borderRadius: 4,
  color: '#fff',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 13,
  outline: 'none',
};

export default function FavoritesContent() {
  const { t } = useI18n();
  const { items, toggle, clear } = useWishlist();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // D1 (George 2026-04-20): "Save to favorites + email capture".
  // Extended the form with a phone field so the lead we log to
  // /api/lead-gate actually matches the richness we gate elsewhere
  // (Instant Proposal / Partners). Also persists to the newsletter
  // set via lead-gate → kvSadd, so saved-favorites visitors start
  // receiving the weekly Journal even if they never hit WhatsApp.
  const [phone, setPhone] = useState('');
  const [subscribe, setSubscribe] = useState(true);
  const [copyStatus, setCopyStatus] = useState('idle'); // idle | copied
  const [error, setError] = useState('');

  const handleSendToGeorge = async () => {
    setError('');
    if (!name.trim() || !email.includes('@') || items.length === 0) {
      setError('Please add your name and a valid email.');
      return;
    }
    setSending(true);

    // Fire to lead-gate FIRST so George gets the contact details even
    // if the visitor closes the WhatsApp tab before sending the
    // message. Non-blocking — WhatsApp still opens if the API is down.
    try {
      await fetch('/api/lead-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'favorites',
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          meta: {
            favorites_count: items.length,
            favorites: items.map((y) => ({
              name: y.name,
              slug: y.slug,
              price: y.price || null,
            })),
            wants_newsletter: subscribe,
          },
        }),
      });
    } catch {
      /* non-blocking */
    }

    // Build WhatsApp message with favorites
    const yachtList = items
      .map((y) => `• ${y.name} (${y.price || 'Price on request'})`)
      .join('\n');
    const msg = `Hello George, I'm ${name} (${email}). I've saved these yachts from your website and would like to discuss:\n\n${yachtList}\n\nPlease send me a proposal.`;
    const waUrl = `https://wa.me/17867988798?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank');

    setSending(false);
    setSent(true);
  };

  // D1: shareable favorites URL. Encodes the list of slugs into the
  // /favorites URL so a visitor can email/whatsapp their picks to a
  // travel companion and they see the same list when they click.
  const buildShareUrl = () => {
    if (typeof window === 'undefined' || items.length === 0) return '';
    const slugs = items
      .map((y) => y.slug)
      .filter(Boolean)
      .join(',');
    return `${window.location.origin}/favorites?yachts=${encodeURIComponent(slugs)}`;
  };

  const handleCopyShare = async () => {
    const url = buildShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2200);
    } catch {
      /* ignore — older browsers */
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.3 }}>♡</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px 0' }}>
          {t('favorites.empty', 'No Favorites Yet')}
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 400, marginBottom: 32 }}>
          {t('favorites.emptyDesc', 'Browse our fleet and tap the heart icon on any yacht that catches your eye. Your favorites will appear here.')}
        </p>
        <Link
          href="/charter-yacht-greece"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#000',
            background: `linear-gradient(90deg, ${GOLD}, #8B6914)`,
            textDecoration: 'none',
            borderRadius: 4,
          }}
        >
          {t('favorites.browse', 'Browse Fleet')}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', padding: '80px 24px 120px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
            {t('favorites.label', 'Your Selection')}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 12px 0' }}>
            {items.length} {t('favorites.saved', 'Favorites Saved')}
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            {t('favorites.reviewDesc', 'Review your selection and send them to George for a personalized proposal.')}
          </p>
        </div>

        {/* Favorites list */}
        <div style={{ display: 'grid', gap: 12, marginBottom: 48 }}>
          {items.map((yacht, i) => (
            <div
              key={yacht.slug}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                background: '#111',
                border: '1px solid #222',
                borderRadius: 8,
                opacity: 0,
                animation: `fadeInUp 0.4s ease ${i * 0.08}s forwards`,
              }}
            >
              <div>
                <Link
                  href={`/yachts/${yacht.slug}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#fff', textDecoration: 'none' }}
                >
                  {yacht.name}
                </Link>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  {yacht.builder && `${yacht.builder} · `}{yacht.guests && `${yacht.guests} guests · `}{yacht.price || ''}
                </div>
              </div>
              <button
                onClick={() => toggle(yacht)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4444',
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: 8,
                  opacity: 0.6,
                  transition: 'opacity 0.2s',
                }}
                aria-label={`Remove ${yacht.name} from favorites`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Send to George section */}
        {!sent ? (
          <div style={{ background: '#111', border: `1px solid ${GOLD}20`, borderRadius: 8, padding: 32, textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#fff', fontWeight: 300, margin: '0 0 8px 0' }}>
              {t('favorites.sendToGeorge', 'Send to George')}
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
              {t('favorites.sendDesc', 'Share your favorites and receive a personalized proposal within 24 hours.')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              <input
                type="text"
                placeholder={t('favorites.yourName', 'Your name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder={t('favorites.yourEmail', 'Your email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ maxWidth: 520, margin: '0 auto 14px' }}>
              <input
                type="tel"
                placeholder={t('favorites.yourPhone', 'Your phone (with country code)')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                color: 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                marginBottom: 20,
              }}
            >
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
                style={{ accentColor: GOLD }}
              />
              {t(
                'favorites.subscribeCta',
                'Also send me the monthly Yachts Journal (curated picks & fresh availability)'
              )}
            </label>

            {error && (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#ff9b9b', marginBottom: 14 }}>
                {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleSendToGeorge}
                disabled={!name || !email || sending}
                style={{
                  padding: '14px 40px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: (!name || !email) ? '#666' : '#000',
                  background: (!name || !email) ? '#333' : `linear-gradient(90deg, ${GOLD}, #8B6914)`,
                  border: 'none',
                  borderRadius: 4,
                  cursor: (!name || !email) ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {sending ? t('favorites.openingWhatsApp', 'Opening WhatsApp...') : t('favorites.sendViaWhatsApp', 'Send via WhatsApp')}
              </button>

              <button
                onClick={handleCopyShare}
                style={{
                  padding: '14px 28px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: copyStatus === 'copied' ? '#000' : `${GOLD}cc`,
                  background: copyStatus === 'copied' ? GOLD : 'transparent',
                  border: `1px solid ${GOLD}60`,
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {copyStatus === 'copied' ? t('favorites.linkCopied', 'Link copied ✓') : t('favorites.copyShare', 'Copy share link')}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#111', border: `1px solid ${GOLD}40`, borderRadius: 8, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: GOLD, fontWeight: 300, margin: '0 0 12px 0' }}>
              {t('favorites.sentToGeorge', 'Sent to George')}
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              {t('favorites.sentDesc', 'George will personally review your selection and respond within 24 hours.')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={clear}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.25)',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            {t('favorites.clearAll', 'Clear all favorites')}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
