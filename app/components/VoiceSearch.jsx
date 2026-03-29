'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

const GOLD = '#DAA520';

const YACHT_DB = [
  { name: 'S/Y Helidoni', slug: 'helidoni', price: 5900, guests: 8, type: 'sailing catamaran', length: 14, region: 'cyclades saronic ionian' },
  { name: 'S/Y Alegria', slug: 'alegria', price: 10900, guests: 8, type: 'sailing catamaran', length: 14, region: 'cyclades' },
  { name: 'S/Y Odyssey', slug: 'odyssey', price: 10900, guests: 8, type: 'sailing catamaran', length: 14, region: 'cyclades ionian' },
  { name: 'S/Y My Star', slug: 'my-star', price: 12000, guests: 8, type: 'sailing catamaran', length: 14, region: 'cyclades saronic' },
  { name: 'S/Y Shooting Star', slug: 'shooting-star', price: 13000, guests: 6, type: 'sailing monohull', length: 20, region: 'cyclades' },
  { name: 'M/Y Endless Beauty', slug: 'endless-beauty', price: 14000, guests: 6, type: 'power catamaran', length: 13, region: 'cyclades saronic' },
  { name: 'S/Y Summer Star', slug: 'summer-star', price: 17000, guests: 10, type: 'sailing catamaran', length: 16, region: 'cyclades sporades' },
  { name: 'S/Y Libra', slug: 'libra', price: 18900, guests: 10, type: 'sailing catamaran', length: 17, region: 'cyclades ionian' },
  { name: 'S/Y Sahana', slug: 'sahana', price: 19500, guests: 8, type: 'sailing catamaran', length: 16, region: 'cyclades saronic' },
  { name: 'S/Y Azul', slug: 'azul', price: 20000, guests: 8, type: 'sailing catamaran', length: 17, region: 'cyclades' },
  { name: "S/Y World's End", slug: 'worlds-end', price: 20500, guests: 10, type: 'sailing catamaran', length: 19, region: 'cyclades ionian saronic' },
  { name: 'Explorion', slug: 'explorion', price: 21000, guests: 8, type: 'power catamaran', length: 16, region: 'cyclades saronic' },
  { name: 'S/Y Gigreca', slug: 'gigreca', price: 24000, guests: 8, type: 'sailing monohull', length: 24, region: 'cyclades saronic' },
  { name: 'S/Y Kimata', slug: 'kimata', price: 31500, guests: 8, type: 'sailing catamaran', length: 20, region: 'cyclades ionian' },
  { name: 'S/Y Alexandra II', slug: 'alexandra-ii', price: 33500, guests: 8, type: 'sailing catamaran', length: 20, region: 'cyclades saronic' },
  { name: 'Alena', slug: 'alena', price: 34000, guests: 8, type: 'power catamaran', length: 20, region: 'cyclades' },
  { name: 'ChristAl MiO', slug: 'christal-mio', price: 34000, guests: 10, type: 'power catamaran', length: 20, region: 'cyclades saronic' },
  { name: 'S/Y Nadamas', slug: 'nadamas', price: 35000, guests: 8, type: 'sailing monohull', length: 24, region: 'cyclades' },
  { name: 'S/Y Huayra', slug: 'huayra', price: 44000, guests: 8, type: 'sailing monohull', length: 31, region: 'cyclades ionian' },
  { name: 'Alteya', slug: 'alteya', price: 49000, guests: 8, type: 'power catamaran', length: 21, region: 'cyclades' },
  { name: 'Crazy Horse', slug: 'crazy-horse', price: 50000, guests: 10, type: 'sailing catamaran', length: 24, region: 'cyclades ionian' },
  { name: 'S/Y Genny', slug: 'genny', price: 56000, guests: 10, type: 'sailing catamaran', length: 24, region: 'cyclades saronic' },
  { name: 'S/Y Above & Beyond', slug: 'above-beyond', price: 56000, guests: 8, type: 'sailing catamaran', length: 24, region: 'cyclades saronic' },
  { name: 'S/Y Aloia', slug: 'aloia', price: 65000, guests: 10, type: 'sailing catamaran', length: 24, region: 'cyclades ionian' },
  { name: 'S/Y Imladris', slug: 'imladris', price: 65000, guests: 8, type: 'sailing catamaran', length: 24, region: 'cyclades' },
  { name: 'SAMARA', slug: 'samara', price: 65000, guests: 8, type: 'power catamaran', length: 24, region: 'cyclades' },
  { name: 'Alina', slug: 'alina', price: 70000, guests: 10, type: 'power catamaran', length: 24, region: 'cyclades' },
  { name: 'M/Y Brooklyn', slug: 'brooklyn', price: 85000, guests: 10, type: 'motor yacht', length: 36, region: 'cyclades saronic' },
  { name: 'M/Y La Pellegrina 1', slug: 'la-pellegrina-1', price: 180000, guests: 12, type: 'motor yacht superyacht', length: 50, region: 'cyclades saronic ionian' },
];

function parseQuery(text) {
  const lower = text.toLowerCase();
  const filters = { maxPrice: null, minGuests: null, type: null, region: null };

  // Price parsing
  const priceMatch = lower.match(/(?:under|below|less than|budget|max|up to)\s*(?:€|euro|eur)?\s*([\d,.]+)\s*(?:k|thousand|€|euro)?/);
  if (priceMatch) {
    let price = parseFloat(priceMatch[1].replace(/,/g, ''));
    if (price < 1000) price *= 1000; // "40" → 40000
    filters.maxPrice = price;
  }
  // Also try: "30 thousand", "50k"
  const kMatch = lower.match(/([\d,.]+)\s*(?:k|thousand)/);
  if (!filters.maxPrice && kMatch) {
    filters.maxPrice = parseFloat(kMatch[1].replace(/,/g, '')) * 1000;
  }

  // Guest parsing
  const guestMatch = lower.match(/(\d+)\s*(?:people|person|guest|pax|of us|passengers)/);
  if (guestMatch) filters.minGuests = parseInt(guestMatch[1]);
  // "for 8", "for ten"
  const forMatch = lower.match(/for\s*(\d+)/);
  if (!filters.minGuests && forMatch) filters.minGuests = parseInt(forMatch[1]);

  // Type parsing
  if (lower.includes('catamaran') || lower.includes('cat')) filters.type = 'catamaran';
  if (lower.includes('monohull') || lower.includes('sailing yacht')) filters.type = 'monohull';
  if (lower.includes('motor') || lower.includes('power')) filters.type = 'motor';
  if (lower.includes('superyacht') || lower.includes('super yacht')) filters.type = 'superyacht';

  // Region parsing
  if (lower.includes('cyclad') || lower.includes('mykonos') || lower.includes('santorini')) filters.region = 'cyclades';
  if (lower.includes('ionian') || lower.includes('corfu') || lower.includes('kefalonia')) filters.region = 'ionian';
  if (lower.includes('saronic') || lower.includes('hydra') || lower.includes('spetses')) filters.region = 'saronic';
  if (lower.includes('sporad') || lower.includes('skiathos') || lower.includes('skopelos')) filters.region = 'sporades';

  return filters;
}

function searchYachts(filters) {
  let results = [...YACHT_DB];

  if (filters.maxPrice) results = results.filter(y => y.price <= filters.maxPrice);
  if (filters.minGuests) results = results.filter(y => y.guests >= filters.minGuests);
  if (filters.type) results = results.filter(y => y.type.includes(filters.type));
  if (filters.region) results = results.filter(y => y.region.includes(filters.region));

  return results.slice(0, 5);
}

export default function VoiceSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice not available on this device. Use the text box below instead.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResults(null);
      setError(null);
    };

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);

      if (event.results[0].isFinal) {
        const filters = parseQuery(text);
        const matches = searchYachts(filters);
        setResults({ filters, matches, query: text });
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else {
        setError('Could not understand. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50"
        style={{
          bottom: '88px',
          left: '24px',
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${GOLD}20`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
        aria-label="Voice search for yachts"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div style={{ maxWidth: 500, width: '92%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>

        {/* Close button */}
        <button
          onClick={() => { setIsOpen(false); stopListening(); setTranscript(''); setResults(null); }}
          style={{ position: 'absolute', top: 24, right: 24, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}
        >
          ✕
        </button>

        {/* Microphone visualization */}
        <div style={{ marginBottom: 32 }}>
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: isListening
                ? `radial-gradient(circle, ${GOLD}30 0%, transparent 70%)`
                : 'rgba(255,255,255,0.03)',
              border: `2px solid ${isListening ? GOLD : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: isListening ? 'voicePulse 1.5s ease-in-out infinite' : 'none',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isListening ? GOLD : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
        </div>

        {/* Status text */}
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#fff', fontWeight: 300, marginBottom: 8 }}>
          {isListening ? 'Listening...' : results ? 'Here\'s what I found' : 'Search by Voice or Text'}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 24, lineHeight: 1.6 }}>
          {isListening
            ? 'Try: "I want a yacht for 8 people under 40 thousand in the Cyclades"'
            : !results
              ? 'Tap the mic or type your request below'
              : ''}
        </p>

        {/* Text input fallback (works on ALL devices including iOS) */}
        {!isListening && !results && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const text = e.target.elements.query.value.trim();
              if (text) {
                setTranscript(text);
                const filters = parseQuery(text);
                const matches = searchYachts(filters);
                setResults({ filters, matches, query: text });
              }
            }}
            style={{ marginBottom: 24, display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto 24px' }}
          >
            <input
              name="query"
              type="text"
              placeholder="e.g. yacht for 8 people under 40k in Cyclades"
              style={{
                flex: 1,
                padding: '14px 16px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${GOLD}20`,
                borderRadius: 10,
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 20px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                background: `linear-gradient(90deg, #E6C77A, #C9A24D)`,
                color: '#000',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
          </form>
        )}

        {/* Transcript */}
        {transcript && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${GOLD}15`,
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 24,
          }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: `${GOLD}60`, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
              You said:
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#fff', fontWeight: 300, margin: 0, fontStyle: 'italic' }}>
              "{transcript}"
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#E74C3C', marginBottom: 24 }}>
            {error}
          </p>
        )}

        {/* Results */}
        {results && (
          <div>
            {results.matches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {results.matches.map(yacht => (
                  <Link
                    key={yacht.slug}
                    href={`/yachts/${yacht.slug}`}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${GOLD}15`,
                      borderRadius: 10,
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <h4 className="notranslate" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#fff', margin: '0 0 4px', fontWeight: 400 }}>
                        {yacht.name}
                      </h4>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '0.08em' }}>
                        {yacht.length}m · {yacht.guests} guests · {yacht.type}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: GOLD, margin: 0, fontWeight: 500 }}>
                        €{yacht.price.toLocaleString()}
                      </p>
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                        /week
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                No exact matches found. Try adjusting your criteria.
              </p>
            )}

            {/* Try again */}
            <button
              onClick={() => { setResults(null); setTranscript(''); startListening(); }}
              style={{
                marginTop: 20,
                padding: '12px 28px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: `1px solid ${GOLD}30`,
                color: `${GOLD}80`,
                background: 'transparent',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              🎤 Search Again
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes voicePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(218,165,32,0.3); }
          50% { box-shadow: 0 0 0 20px rgba(218,165,32,0); }
        }
      `}</style>
    </div>
  );
}
