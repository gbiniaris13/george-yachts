'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';
import { useState } from 'react';

const GOLD = '#DAA520';

const ISLANDS = {
  mykonos: { name: 'Mykonos', emoji: '🎉', tagline: 'The Cosmopolitan Soul', desc: 'You thrive on energy, style, and being where the world gathers. Mykonos matches your love for vibrant nightlife, world-class dining, and beautiful people. You want your yacht anchored at Psarou Bay, cocktails flowing, and Little Venice glowing at sunset.', region: 'Cyclades', bestFor: 'Beach clubs, nightlife, celebrity spotting, cosmopolitan dining', yacht: "S/Y Genny or M/Y La Pellegrina 1" },
  hydra: { name: 'Hydra', emoji: '🎨', tagline: 'The Artistic Minimalist', desc: "You appreciate beauty in simplicity. No cars, no noise, no pretension — just stone mansions, donkey paths, and the sound of the sea. Hydra is Leonard Cohen's island, and it suits those who find luxury in what's absent rather than what's added.", region: 'Saronic', bestFor: 'Art, tranquility, walking, authentic Greek character', yacht: "S/Y Gigreca or S/Y Nadamas" },
  santorini: { name: 'Santorini', emoji: '🌅', tagline: 'The Romantic Dreamer', desc: "You believe in magic hours — that moment when the caldera turns gold and the world holds its breath. Santorini is where proposals happen, where wine tastes better at altitude, and where the volcanic landscape makes everything feel cinematic.", region: 'Cyclades', bestFor: 'Sunsets, wine tasting, caldera views, romance', yacht: "S/Y Above & Beyond or S/Y Ad Astra" },
  paxos: { name: 'Paxos', emoji: '🌿', tagline: 'The Gentle Escapist', desc: "You don't need a crowd to feel alive. A horseshoe bay surrounded by olive groves, turquoise water so clear it barely looks real, and a taverna where the owner knows your name by day two. Paxos is for those who understand that the best-kept secrets are the quietest ones.", region: 'Ionian', bestFor: 'Privacy, nature, slow pace, hidden coves', yacht: "S/Y Kimata or S/Y Serenissima" },
  milos: { name: 'Milos', emoji: '🌊', tagline: 'The Explorer', desc: "You want to discover what others haven't found yet. Volcanic shores sculpted by wind and time, sea caves that glow turquoise from within, and beaches with names you can't pronounce. Milos rewards the curious — those willing to sail a little further for something extraordinary.", region: 'Cyclades', bestFor: 'Geology, unique beaches, photography, off-the-beaten-path', yacht: "S/Y World's End or S/Y Odyssey" },
  skopelos: { name: 'Skopelos', emoji: '🎬', tagline: 'The Joyful Storyteller', desc: "You see life as a movie — and you want it to look like one. Skopelos is the Mamma Mia island, where bougainvillea spills over stone walls, chapels sit on clifftops, and every meal feels like a celebration. You bring energy, laughter, and a talent for making memories.", region: 'Sporades', bestFor: 'Families, nature, Mamma Mia locations, cheese pies', yacht: "S/Y Summer Star or S/Y Libra" },
  kefalonia: { name: 'Kefalonia', emoji: '⛰️', tagline: 'The Connoisseur', desc: "You appreciate depth — in wine, in conversation, in landscape. Kefalonia delivers on all counts: dramatic mountains plunging into wine-dark seas, Fiskardo's Venetian elegance, and Captain Tassia's legendary cooking. This is the island for those who know what quality looks like.", region: 'Ionian', bestFor: 'Wine, fine dining, dramatic scenery, sophistication', yacht: "S/Y Crazy Horse or S/Y Huayra" },
  koufonisia: { name: 'Koufonisia', emoji: '🏝️', tagline: 'The Free Spirit', desc: "You believe the best things are the simplest: bare feet on white sand, swimming in water that belongs in a dream, and a sky full of stars that makes you forget your phone exists. Koufonisia is tiny, car-free, and achingly beautiful — the Greek Caribbean, without trying to be anything else.", region: 'Cyclades', bestFor: 'Beaches, simplicity, barefoot luxury, stargazing', yacht: "S/Y Helidoni or S/Y Alegria" },
};

const QUESTIONS = [
  {
    q: "Your ideal evening starts with...",
    options: [
      { text: "A rooftop cocktail watching the sun set over the sea", islands: ['santorini', 'mykonos'] },
      { text: "A long walk through quiet streets, ending at a waterfront taverna", islands: ['hydra', 'paxos'] },
      { text: "Anchoring in a hidden bay, dinner under the stars on deck", islands: ['koufonisia', 'milos'] },
      { text: "A table at the best restaurant in town, local wine flowing", islands: ['kefalonia', 'skopelos'] },
    ],
  },
  {
    q: "When you travel, you're drawn to...",
    options: [
      { text: "Energy, style, and being where things are happening", islands: ['mykonos', 'santorini'] },
      { text: "Silence, space, and the absence of crowds", islands: ['paxos', 'koufonisia'] },
      { text: "History, culture, and places with stories to tell", islands: ['hydra', 'kefalonia'] },
      { text: "Raw beauty — landscapes that stop you in your tracks", islands: ['milos', 'skopelos'] },
    ],
  },
  {
    q: "Your perfect beach is...",
    options: [
      { text: "Organised with sunbeds, a bar, and beautiful people nearby", islands: ['mykonos', 'santorini'] },
      { text: "Completely empty — just you and the water", islands: ['koufonisia', 'paxos'] },
      { text: "A pebble cove with a taverna serving fresh fish", islands: ['hydra', 'skopelos'] },
      { text: "A volcanic shore that looks like another planet", islands: ['milos', 'kefalonia'] },
    ],
  },
  {
    q: "The best meal is...",
    options: [
      { text: "Chef's table at a Michelin-level restaurant", islands: ['mykonos', 'kefalonia'] },
      { text: "Slow-cooked fish bought from a local fisherman that morning", islands: ['paxos', 'hydra'] },
      { text: "A picnic on deck with fresh bread, cheese, and wine", islands: ['koufonisia', 'milos'] },
      { text: "A long family-style feast where everyone shares everything", islands: ['skopelos', 'santorini'] },
    ],
  },
  {
    q: "If you could only bring one thing on the yacht...",
    options: [
      { text: "My camera — I need to capture everything", islands: ['santorini', 'milos'] },
      { text: "A great book — I want to disappear into it on deck", islands: ['paxos', 'hydra'] },
      { text: "My playlist — music makes every moment better", islands: ['mykonos', 'skopelos'] },
      { text: "Nothing — the sea is enough", islands: ['koufonisia', 'kefalonia'] },
    ],
  },
];

export default function IslandQuizClient() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  const handleAnswer = (islands) => {
    const newScores = { ...scores };
    islands.forEach(id => {
      newScores[id] = (newScores[id] || 0) + 1;
    });
    setScores(newScores);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Find winner
      const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
      setResult(ISLANDS[sorted[0][0]]);
    }
  };

  const restart = () => {
    setStep(0);
    setScores({});
    setResult(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 24px 80px' }}>
      {!result ? (
        <>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: 40, height: 3, borderRadius: 2,
                background: i <= step ? GOLD : 'rgba(255,255,255,0.1)',
                transition: 'background 0.5s ease',
              }} />
            ))}
          </div>

          {/* Question */}
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${GOLD}80`, marginBottom: 16 }}>
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#fff', fontWeight: 300, textAlign: 'center', marginBottom: 48, maxWidth: 600 }}>
            {QUESTIONS[step].q}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 500 }}>
            {QUESTIONS[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.islands)}
                style={{
                  padding: '20px 24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(218,165,32,0.1)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.3s ease',
                  lineHeight: 1.6,
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = `${GOLD}50`;
                  e.target.style.background = `${GOLD}08`;
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(218,165,32,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.03)';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </>
      ) : (
        /* RESULT */
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>{result.emoji}</div>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: `${GOLD}80`, marginBottom: 12 }}>
            You are...
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: 300, marginBottom: 8 }}>
            {result.name}
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: GOLD, fontStyle: 'italic', marginBottom: 32 }}>
            {result.tagline}
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 2, marginBottom: 32 }}>
            {result.desc}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(218,165,32,0.15)', borderRadius: 12, padding: 24, marginBottom: 32, textAlign: 'left' }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Region</span>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#fff', margin: '4px 0 0' }}>{result.region}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Best For</span>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: '#fff', margin: '4px 0 0' }}>{result.bestFor}</p>
            </div>
            <div>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Recommended Yacht</span>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: GOLD, margin: '4px 0 0' }}>{result.yacht}</p>
            </div>
          </div>

          {/* Share + CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I just took the George Yachts island quiz and I'm ${result.name}! 🏝️ "${result.tagline}" — Take the quiz: https://georgeyachts.com/island-quiz`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
                background: `linear-gradient(90deg, #E6C77A, #C9A24D)`,
                color: '#000',
                borderRadius: 8,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Share Your Result
            </a>
            <a
              href="/charter-yacht-greece"
              style={{
                padding: '12px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: `1px solid ${GOLD}30`,
                color: `${GOLD}99`,
                borderRadius: 8,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Browse Yachts for {result.name}
            </a>
            <button
              onClick={restart}
              style={{
                padding: '12px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
