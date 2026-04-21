'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GOLD = '#DAA520';

// Yacht names for random selection
const YACHTS = [
  'M/Y La Pellegrina 1', 'S/CAT Genny', 'S/CAT Above & Beyond', "S/CAT World's End",
  'S/CAT Ad Astra', 'S/CAT Aloia', 'S/CAT Imladris', 'S/CAT Kimata',
  'P/CAT Crazy Horse', 'P/CAT Just Marie 2', 'P/CAT Alteya', 'P/CAT Alina', 'P/CAT SAMARA',
  'S/CAT Helidoni', 'S/CAT Odyssey', 'S/CAT Azul', 'S/CAT Sahana',
  'S/CAT Libra', 'S/Y Gigreca', 'S/Y Huayra', 'S/Y Nadamas',
  'M/Y Brooklyn', 'P/CAT Explorion', 'S/CAT Summer Star',
];

// Cities with flags — realistic charter client origins
const ORIGINS = [
  { city: 'London', flag: '🇬🇧' },
  { city: 'New York', flag: '🇺🇸' },
  { city: 'Dubai', flag: '🇦🇪' },
  { city: 'Paris', flag: '🇫🇷' },
  { city: 'Milan', flag: '🇮🇹' },
  { city: 'Munich', flag: '🇩🇪' },
  { city: 'Zürich', flag: '🇨🇭' },
  { city: 'Moscow', flag: '🇷🇺' },
  { city: 'Los Angeles', flag: '🇺🇸' },
  { city: 'Sydney', flag: '🇦🇺' },
  { city: 'Amsterdam', flag: '🇳🇱' },
  { city: 'Tokyo', flag: '🇯🇵' },
  { city: 'São Paulo', flag: '🇧🇷' },
  { city: 'Istanbul', flag: '🇹🇷' },
  { city: 'Singapore', flag: '🇸🇬' },
  { city: 'Stockholm', flag: '🇸🇪' },
  { city: 'Vienna', flag: '🇦🇹' },
  { city: 'Athens', flag: '🇬🇷' },
  { city: 'Miami', flag: '🇺🇸' },
  { city: 'Geneva', flag: '🇨🇭' },
  { city: 'Seoul', flag: '🇰🇷' },
  { city: 'Riyadh', flag: '🇸🇦' },
  { city: 'Toronto', flag: '🇨🇦' },
  { city: 'Brussels', flag: '🇧🇪' },
];

// Viewing actions (85%) vs inquiry actions (15%) — realistic ratio
const VIEWING_ACTIONS = [
  (origin, yacht) => `Someone from ${origin.city} is viewing ${yacht}`,
  (origin, yacht) => `A visitor from ${origin.city} is browsing ${yacht}`,
  (origin, yacht) => `${yacht} is being viewed from ${origin.city}`,
  (origin, yacht) => `Someone in ${origin.city} just opened ${yacht}`,
  (origin, yacht) => `Someone from ${origin.city} is exploring ${yacht}`,
  (origin, yacht) => `${yacht} is getting attention from ${origin.city}`,
  (origin, yacht) => `Someone from ${origin.city} is comparing yachts`,
  (origin, yacht) => `Someone from ${origin.city} is checking availability`,
  (origin, yacht) => `A visitor from ${origin.city} is reading about ${yacht}`,
  (origin, yacht) => `${yacht} was just opened from ${origin.city}`,
];

const BOOKING_ACTIONS = [
  (origin, yacht) => `Someone from ${origin.city} just requested a quote for ${yacht}`,
  (origin, yacht) => `Someone from ${origin.city} inquired about ${yacht}`,
  (origin) => `A visitor from ${origin.city} just sent an inquiry`,
];

function generateMessage() {
  const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
  const yacht = YACHTS[Math.floor(Math.random() * YACHTS.length)];
  const isBooking = Math.random() < 0.15; // 15% booking, 85% viewing

  let text;
  if (isBooking) {
    const action = BOOKING_ACTIONS[Math.floor(Math.random() * BOOKING_ACTIONS.length)];
    text = action(origin, yacht);
  } else {
    const action = VIEWING_ACTIONS[Math.floor(Math.random() * VIEWING_ACTIONS.length)];
    text = action(origin, yacht);
  }

  // Random time — mostly "just now" for viewing, longer for bookings
  const times = isBooking
    ? ['5 min ago', '12 min ago', '25 min ago', '1 hour ago']
    : ['just now', 'just now', '1 min ago', '2 min ago', '3 min ago'];
  const time = times[Math.floor(Math.random() * times.length)];

  return { text, flag: origin.flag, time, isBooking };
}

export default function LiveTicker() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);
  const countRef = useRef(0);

  const showMessage = useCallback(() => {
    const msg = generateMessage();
    setAnimating(true);
    setTimeout(() => {
      setMessage(msg);
      setAnimating(false);
      setVisible(true);
      countRef.current += 1;

      // Hide after 6 seconds
      setTimeout(() => {
        setAnimating(true);
        setTimeout(() => {
          setVisible(false);
          setAnimating(false);

          // Stop after 6 messages per session
          if (countRef.current >= 6) return;

          // Next message in 45-90 seconds (realistic interval)
          // George 2026-04-21: 45-90 s felt relentless stacked with
          // the other popups. Widened to 90-180 s so the ticker is
          // an occasional whisper, not a constant notification.
          const nextDelay = 90000 + Math.random() * 90000;
          timerRef.current = setTimeout(showMessage, nextDelay);
        }, 300);
      }, 6000);
    }, 300);
  }, []);

  useEffect(() => {
    // First message after 60-90s (was 15-25s). Visitor gets to
    // actually see the site before the first social-proof toast.
    const initialDelay = 60000 + Math.random() * 30000;
    timerRef.current = setTimeout(showMessage, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [showMessage]);

  if (!visible || !message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        left: 24,
        right: 24, // lets the card shrink on narrow phones instead of overflowing
        zIndex: 45,
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(8px)' : 'translateY(0)',
        transition: 'all 0.4s ease',
        maxWidth: 'min(340px, calc(100vw - 48px))',
      }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${message.isBooking ? `${GOLD}25` : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{message.flag}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="notranslate" style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            color: message.isBooking ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
            margin: '0 0 3px',
            lineHeight: 1.4,
          }}>
            {message.text}
          </p>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 8,
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            letterSpacing: '0.08em',
          }}>
            {message.time}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          aria-label="Dismiss notification"
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            cursor: 'pointer', padding: 8, flexShrink: 0,
            minWidth: 44, minHeight: 44,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
