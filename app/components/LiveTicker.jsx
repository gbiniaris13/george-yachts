'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GOLD = '#DAA520';

// Yacht names for random selection
const YACHTS = [
  'La Pellegrina 1', 'S/Y Genny', 'S/Y Above & Beyond', "S/Y World's End",
  'S/Y Ad Astra', 'S/Y Aloia', 'S/Y Imladris', 'S/Y Kimata',
  'Crazy Horse', 'Just Marie 2', 'Alteya', 'Alina', 'SAMARA',
  'S/Y Helidoni', 'S/Y Odyssey', 'S/Y Azul', 'S/Y Sahana',
  'S/Y Libra', 'S/Y Gigreca', 'S/Y Huayra', 'S/Y Nadamas',
  'M/Y Brooklyn', 'Explorion', 'S/Y Summer Star',
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

// Viewing actions (80%) vs booking actions (20%) — realistic ratio
const VIEWING_ACTIONS = [
  (origin, yacht) => `Someone from ${origin.city} is viewing ${yacht}`,
  (origin, yacht) => `A visitor from ${origin.city} is browsing ${yacht}`,
  (origin, yacht) => `${yacht} is being viewed from ${origin.city}`,
  (origin, yacht) => `Someone in ${origin.city} just opened ${yacht}`,
  (origin, yacht) => `A couple from ${origin.city} is exploring ${yacht}`,
  (origin, yacht) => `${yacht} is getting attention from ${origin.city}`,
  (origin, yacht) => `A group from ${origin.city} is comparing yachts`,
  (origin, yacht) => `Someone from ${origin.city} is checking availability`,
  (origin, yacht) => `A visitor from ${origin.city} is reading about ${yacht}`,
  (origin, yacht) => `${yacht} was just saved to favorites from ${origin.city}`,
];

const BOOKING_ACTIONS = [
  (origin, yacht) => `A group from ${origin.city} just requested a quote for ${yacht}`,
  (origin, yacht) => `Someone from ${origin.city} booked a consultation about ${yacht}`,
  (origin) => `A family from ${origin.city} just sent an inquiry`,
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
          const nextDelay = 45000 + Math.random() * 45000;
          timerRef.current = setTimeout(showMessage, nextDelay);
        }, 300);
      }, 6000);
    }, 300);
  }, []);

  useEffect(() => {
    // First message after 15-25 seconds
    const initialDelay = 15000 + Math.random() * 10000;
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
        zIndex: 45,
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(8px)' : 'translateY(0)',
        transition: 'all 0.4s ease',
        maxWidth: 340,
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
            color: 'rgba(255,255,255,0.15)',
            margin: 0,
            letterSpacing: '0.08em',
          }}>
            {message.time}
          </p>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setVisible(false); }}
          style={{
            background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.12)', fontSize: 10,
            cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
