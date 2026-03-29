'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '../components/WishlistProvider';

const GOLD = '#DAA520';

export default function FavoritesContent() {
  const { items, toggle, clear } = useWishlist();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSendToGeorge = async () => {
    if (!name || !email || items.length === 0) return;
    setSending(true);

    // Build WhatsApp message with favorites
    const yachtList = items.map((y) => `• ${y.name} (${y.price || 'Price on request'})`).join('\n');
    const msg = `Hello George, I'm ${name} (${email}). I've saved these yachts from your website and would like to discuss:\n\n${yachtList}\n\nPlease send me a proposal.`;
    const waUrl = `https://wa.me/17867988798?text=${encodeURIComponent(msg)}`;

    // Also create mailto fallback
    const subject = `Charter Inquiry — ${items.length} Favorite Yachts`;
    const body = `Dear George,\n\nI've been browsing your fleet and saved the following yachts:\n\n${yachtList}\n\nI'd love to discuss availability and options.\n\nBest regards,\n${name}\n${email}`;
    const mailUrl = `mailto:george@georgeyachts.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    setSending(false);
    setSent(true);
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 24, opacity: 0.3 }}>♡</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px 0' }}>
          No Favorites Yet
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 400, marginBottom: 32 }}>
          Browse our fleet and tap the heart icon on any yacht that catches your eye. Your favorites will appear here.
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
          Browse Fleet
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
            Your Selection
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 12px 0' }}>
            {items.length} Favorite{items.length !== 1 ? 's' : ''} Saved
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            Review your selection and send them to George for a personalized proposal.
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
              Send to George
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
              Share your favorites and receive a personalized proposal within 24 hours.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: '12px 16px',
                  background: '#000',
                  border: '1px solid #333',
                  borderRadius: 4,
                  color: '#fff',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '12px 16px',
                  background: '#000',
                  border: '1px solid #333',
                  borderRadius: 4,
                  color: '#fff',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  outline: 'none',
                }}
              />
            </div>

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
              {sending ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
            </button>
          </div>
        ) : (
          <div style={{ background: '#111', border: `1px solid ${GOLD}40`, borderRadius: 8, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: GOLD, fontWeight: 300, margin: '0 0 12px 0' }}>
              Sent to George
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              George will personally review your selection and respond within 24 hours.
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
            Clear all favorites
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
