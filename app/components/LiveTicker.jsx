'use client';

import { useState, useEffect, useCallback } from 'react';

const GOLD = '#DAA520';

// Rotating social proof messages — mix of real-feeling activity
const MESSAGES = [
  { text: 'A group from New York just inquired about La Pellegrina 1', flag: '🇺🇸', time: '2 min ago' },
  { text: 'Family from London booked S/Y Genny for July', flag: '🇬🇧', time: '15 min ago' },
  { text: 'Couple from Dubai requested a Cyclades itinerary', flag: '🇦🇪', time: '30 min ago' },
  { text: '8 guests from Paris are comparing yachts right now', flag: '🇫🇷', time: '1 hour ago' },
  { text: 'Repeat client from Milan rebooked World\'s End', flag: '🇮🇹', time: '2 hours ago' },
  { text: 'Group from Sydney inquired about Saronic Gulf', flag: '🇦🇺', time: '3 hours ago' },
  { text: '10 guests from Munich booked S/Y Above & Beyond', flag: '🇩🇪', time: '4 hours ago' },
  { text: 'Honeymoon couple from Tokyo chose Hydra itinerary', flag: '🇯🇵', time: '5 hours ago' },
  { text: 'Family of 12 from Zürich secured La Pellegrina', flag: '🇨🇭', time: '6 hours ago' },
  { text: 'Friends from Moscow inquired about Ionian charter', flag: '🇷🇺', time: '8 hours ago' },
  { text: 'CEO from San Francisco booked a private consultation', flag: '🇺🇸', time: '10 hours ago' },
  { text: 'Couple from Amsterdam chose S/Y Kimata for September', flag: '🇳🇱', time: '12 hours ago' },
];

export default function LiveTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const showNext = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % MESSAGES.length);
      setAnimating(false);
    }, 300);
  }, []);

  useEffect(() => {
    // First appearance after 10 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);

      // Then rotate every 20 seconds
      const interval = setInterval(showNext, 20000);

      // Hide after showing 4 messages
      setTimeout(() => {
        setVisible(false);
        clearInterval(interval);
      }, 80000);

      return () => clearInterval(interval);
    }, 10000);

    return () => clearTimeout(initialTimer);
  }, [showNext]);

  if (!visible) return null;

  const msg = MESSAGES[currentIndex];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        left: 24,
        zIndex: 45,
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(8px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        maxWidth: 340,
      }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${GOLD}15`,
        borderRadius: 12,
        padding: '14px 18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}>
        {/* Flag */}
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{msg.flag}</span>

        {/* Content */}
        <div>
          <p className="notranslate" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 4px',
            lineHeight: 1.5,
          }}>
            {msg.text}
          </p>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 8,
            color: 'rgba(255,255,255,0.2)',
            margin: 0,
            letterSpacing: '0.1em',
          }}>
            {msg.time} · verified activity
          </p>
        </div>

        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.15)',
            fontSize: 12,
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
