'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';

const GOLD = '#DAA520';
const DARK = '#000';

// Greek islands with coordinates (SVG viewport 0-1000 x 0-800)
// Positions mapped to approximate real geography
const ISLANDS = [
  // Cyclades
  { id: 'mykonos', name: 'Mykonos', region: 'Cyclades', x: 620, y: 420, lat: 37.4467, lng: 25.3289, desc: 'Nightlife, beaches, cosmopolitan dining' },
  { id: 'santorini', name: 'Santorini', region: 'Cyclades', x: 600, y: 520, lat: 36.3932, lng: 25.4615, desc: 'Caldera views, wine, volcanic beaches' },
  { id: 'paros', name: 'Paros', region: 'Cyclades', x: 580, y: 450, lat: 37.0856, lng: 25.1489, desc: 'Naoussa harbour, marble streets, balance' },
  { id: 'naxos', name: 'Naxos', region: 'Cyclades', x: 610, y: 460, lat: 37.1036, lng: 25.3762, desc: 'Portara, local cuisine, longest beaches' },
  { id: 'ios', name: 'Ios', region: 'Cyclades', x: 590, y: 490, lat: 36.7230, lng: 25.2818, desc: 'Young energy, Homer\'s tomb, Mylopotas beach' },
  { id: 'milos', name: 'Milos', region: 'Cyclades', x: 530, y: 510, lat: 36.7474, lng: 24.4269, desc: 'Volcanic shores, Sarakiniko, hidden caves' },
  { id: 'sifnos', name: 'Sifnos', region: 'Cyclades', x: 545, y: 470, lat: 36.9713, lng: 24.7136, desc: 'Greece\'s culinary island, pottery, trails' },
  { id: 'syros', name: 'Syros', region: 'Cyclades', x: 575, y: 400, lat: 37.4500, lng: 24.9000, desc: 'Ermoupoli, neoclassical capital of Cyclades' },
  { id: 'koufonisia', name: 'Koufonisia', region: 'Cyclades', x: 640, y: 475, lat: 36.9356, lng: 25.6000, desc: 'Caribbean-blue water, car-free, paradise' },
  { id: 'amorgos', name: 'Amorgos', region: 'Cyclades', x: 660, y: 480, lat: 36.8333, lng: 25.9000, desc: 'Monastery of Hozoviotissa, Big Blue film' },
  { id: 'tinos', name: 'Tinos', region: 'Cyclades', x: 600, y: 390, lat: 37.5500, lng: 25.1500, desc: 'Marble art villages, pilgrimage, gastronomy' },
  { id: 'serifos', name: 'Serifos', region: 'Cyclades', x: 530, y: 440, lat: 37.1500, lng: 24.5000, desc: 'Wild beauty, hilltop hora, empty beaches' },
  { id: 'kea', name: 'Kea', region: 'Cyclades', x: 495, y: 395, lat: 37.6300, lng: 24.3300, desc: 'Closest to Athens, Vourkari, quiet luxury' },

  // Saronic
  { id: 'aegina', name: 'Aegina', region: 'Saronic', x: 420, y: 405, lat: 37.7500, lng: 23.4300, desc: 'Pistachio island, Temple of Aphaia' },
  { id: 'hydra', name: 'Hydra', region: 'Saronic', x: 440, y: 440, lat: 37.3500, lng: 23.4700, desc: 'Car-free jewel, Leonard Cohen\'s island' },
  { id: 'spetses', name: 'Spetses', region: 'Saronic', x: 450, y: 460, lat: 37.2600, lng: 23.1500, desc: 'French Riviera of Greece, pine forests' },
  { id: 'poros', name: 'Poros', region: 'Saronic', x: 430, y: 430, lat: 37.5000, lng: 23.4600, desc: 'Clock tower, close to mainland, charming' },

  // Ionian
  { id: 'corfu', name: 'Corfu', region: 'Ionian', x: 180, y: 230, lat: 39.6243, lng: 19.9217, desc: 'Venetian old town, lush green, UNESCO' },
  { id: 'paxos', name: 'Paxos', region: 'Ionian', x: 175, y: 280, lat: 39.2000, lng: 20.1800, desc: 'Tiny gem, Lakka bay, olive groves' },
  { id: 'lefkada', name: 'Lefkada', region: 'Ionian', x: 195, y: 330, lat: 38.8300, lng: 20.7100, desc: 'Porto Katsiki, dramatic white cliffs' },
  { id: 'ithaca', name: 'Ithaca', region: 'Ionian', x: 210, y: 360, lat: 38.3700, lng: 20.7200, desc: 'Odysseus\' homeland, Kioni harbour' },
  { id: 'kefalonia', name: 'Kefalonia', region: 'Ionian', x: 200, y: 380, lat: 38.1800, lng: 20.4900, desc: 'Fiskardo, Myrtos beach, dramatic landscape' },
  { id: 'zakynthos', name: 'Zakynthos', region: 'Ionian', x: 210, y: 420, lat: 37.7870, lng: 20.8980, desc: 'Navagio shipwreck beach, turtles' },
  { id: 'meganisi', name: 'Meganisi', region: 'Ionian', x: 205, y: 345, lat: 38.6400, lng: 20.7800, desc: 'Secret island, 3 villages, crystal water' },

  // Sporades
  { id: 'skiathos', name: 'Skiathos', region: 'Sporades', x: 420, y: 250, lat: 39.1600, lng: 23.4900, desc: 'Koukounaries beach, pine forests' },
  { id: 'skopelos', name: 'Skopelos', region: 'Sporades', x: 445, y: 240, lat: 39.1200, lng: 23.7300, desc: 'Mamma Mia island, stone houses' },
  { id: 'alonissos', name: 'Alonissos', region: 'Sporades', x: 465, y: 230, lat: 39.1500, lng: 23.8700, desc: 'Marine Park, monk seals, pristine' },

  // Dodecanese
  { id: 'rhodes', name: 'Rhodes', region: 'Dodecanese', x: 780, y: 520, lat: 36.4344, lng: 28.2176, desc: 'Medieval old town, Lindos, Colossus' },
  { id: 'kos', name: 'Kos', region: 'Dodecanese', x: 730, y: 480, lat: 36.8930, lng: 26.9880, desc: 'Hippocrates\' birthplace, thermal springs' },
  { id: 'symi', name: 'Symi', region: 'Dodecanese', x: 760, y: 500, lat: 36.6170, lng: 27.8370, desc: 'Pastel harbour, sponge diving, Panormitis' },

  // Key mainland ports
  { id: 'athens', name: 'Athens', region: 'Mainland', x: 430, y: 380, lat: 37.9838, lng: 23.7275, desc: 'Lavrion & Alimos — main charter bases' },
  { id: 'nafplio', name: 'Nafplio', region: 'Mainland', x: 400, y: 430, lat: 37.5675, lng: 22.7958, desc: 'Greece\'s first capital, Palamidi fortress' },
  { id: 'porto-heli', name: 'Porto Heli', region: 'Mainland', x: 420, y: 455, lat: 37.3187, lng: 23.1456, desc: 'Greek Hamptons, Amanzoe resort' },
];

// Calculate nautical miles between two points
function calcNM(lat1, lng1, lat2, lng2) {
  const R = 3440.065; // Earth radius in NM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const REGION_COLORS = {
  Cyclades: '#DAA520',
  Saronic: '#8B6914',
  Ionian: '#4A90D9',
  Sporades: '#2ECC71',
  Dodecanese: '#E67E22',
  Mainland: '#95A5A6',
};

export default function ItineraryBuilderClient() {
  // Athens as default starting point
  const athensIsland = ISLANDS.find((i) => i.id === 'athens');
  const corfu = ISLANDS.find((i) => i.id === 'corfu');
  const skiathos = ISLANDS.find((i) => i.id === 'skiathos');
  const [selected, setSelected] = useState(athensIsland ? [athensIsland] : []);
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [activeRegion, setActiveRegion] = useState('all');
  const svgRef = useRef(null);

  const toggleIsland = useCallback((island) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.id === island.id);
      if (exists) return prev.filter((s) => s.id !== island.id);
      return [...prev, island];
    });
  }, []);

  // Calculate route stats
  const routeStats = useMemo(() => {
    if (selected.length < 2) return { totalNM: 0, legs: [], hours: 0 };
    let totalNM = 0;
    const legs = [];
    for (let i = 0; i < selected.length - 1; i++) {
      const from = selected[i];
      const to = selected[i + 1];
      const nm = calcNM(from.lat, from.lng, to.lat, to.lng);
      totalNM += nm;
      legs.push({ from: from.name, to: to.name, nm: Math.round(nm) });
    }
    return { totalNM: Math.round(totalNM), legs, hours: Math.round(totalNM / 8) };
  }, [selected]);

  const filteredIslands = activeRegion === 'all' ? ISLANDS : ISLANDS.filter((i) => i.region === activeRegion);
  const regions = ['all', ...new Set(ISLANDS.map((i) => i.region))];

  const handleSendToGeorge = () => {
    const route = selected.map((s) => s.name).join(' → ');
    const msg = `Hello George, I've designed a Greek island itinerary on your website:\n\n${route}\n\nTotal: ${routeStats.totalNM} NM (~${routeStats.hours} sailing hours)\n\nCan you suggest the best yacht for this route?`;
    window.open(`https://wa.me/17867988798?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: DARK }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          Interactive Route Planner
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 12px 0' }}>
          Build Your Dream Itinerary
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 500, margin: '0 auto' }}>
          Click islands on the map to create your route. We'll calculate distances and sailing time.
        </p>
      </div>

      {/* Starting port selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '0 24px 16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          Start from:
        </span>
        {[
          { island: athensIsland, label: 'Athens' },
          { island: corfu, label: 'Corfu' },
          { island: skiathos, label: 'Skiathos' },
        ].map(({ island, label }) => (
          <button
            key={label}
            onClick={() => {
              if (island) setSelected([island]);
            }}
            style={{
              padding: '6px 16px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: `1px solid ${selected[0]?.id === island?.id ? GOLD : '#333'}`,
              background: selected[0]?.id === island?.id ? `${GOLD}15` : 'transparent',
              color: selected[0]?.id === island?.id ? GOLD : 'rgba(255,255,255,0.4)',
              borderRadius: 20,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Region filters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 24px 24px', flexWrap: 'wrap' }}>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            style={{
              padding: '8px 16px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: `1px solid ${activeRegion === r ? GOLD : '#333'}`,
              background: activeRegion === r ? `${GOLD}15` : 'transparent',
              color: activeRegion === r ? GOLD : 'rgba(255,255,255,0.4)',
              borderRadius: 20,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {r === 'all' ? 'All Regions' : r}
          </button>
        ))}
      </div>

      {/* Main content: Map + Route panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}
        className="itinerary-layout"
      >
        {/* MAP */}
        <div style={{ position: 'relative', background: '#0a0a1a', border: '1px solid #222', borderRadius: 12, overflow: 'hidden', aspectRatio: '5/4' }}>
          <svg ref={svgRef} viewBox="100 180 750 420" style={{ width: '100%', height: '100%' }}>
            {/* Sea background gradient */}
            <defs>
              <radialGradient id="seaGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0d1b3a" />
                <stop offset="100%" stopColor="#050a15" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="100" y="180" width="750" height="420" fill="url(#seaGlow)" />

            {/* Route lines */}
            {selected.length > 1 && selected.map((island, i) => {
              if (i === 0) return null;
              const prev = selected[i - 1];
              return (
                <line
                  key={`line-${i}`}
                  x1={prev.x} y1={prev.y}
                  x2={island.x} y2={island.y}
                  stroke={GOLD}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  style={{ animation: `drawLine 0.5s ease ${i * 0.1}s both` }}
                />
              );
            })}

            {/* Route direction arrows */}
            {selected.length > 1 && selected.map((island, i) => {
              if (i === 0) return null;
              const prev = selected[i - 1];
              const midX = (prev.x + island.x) / 2;
              const midY = (prev.y + island.y) / 2;
              const nm = calcNM(prev.lat, prev.lng, island.lat, island.lng);
              return (
                <text
                  key={`nm-${i}`}
                  x={midX} y={midY - 8}
                  textAnchor="middle"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 9,
                    fill: GOLD,
                    opacity: 0.7,
                  }}
                >
                  {Math.round(nm)} NM
                </text>
              );
            })}

            {/* Island dots */}
            {filteredIslands.map((island) => {
              const isSelected = selected.some((s) => s.id === island.id);
              const isHovered = hoveredIsland?.id === island.id;
              const orderNum = selected.findIndex((s) => s.id === island.id) + 1;

              return (
                <g key={island.id} style={{ cursor: 'pointer' }}
                  onClick={() => toggleIsland(island)}
                  onMouseEnter={() => setHoveredIsland(island)}
                  onMouseLeave={() => setHoveredIsland(null)}
                >
                  {/* Outer glow */}
                  {(isSelected || isHovered) && (
                    <circle cx={island.x} cy={island.y} r={isSelected ? 18 : 14}
                      fill="none" stroke={GOLD} strokeWidth="1" opacity="0.3"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Main dot */}
                  <circle cx={island.x} cy={island.y}
                    r={isSelected ? 10 : isHovered ? 8 : 5}
                    fill={isSelected ? GOLD : isHovered ? `${GOLD}80` : REGION_COLORS[island.region] || '#666'}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth={isSelected ? 1.5 : 0}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Order number */}
                  {isSelected && orderNum > 0 && (
                    <text x={island.x} y={island.y + 4}
                      textAnchor="middle"
                      style={{ fontFamily: "'Montserrat'", fontSize: 9, fontWeight: 700, fill: '#000', pointerEvents: 'none' }}
                    >
                      {orderNum}
                    </text>
                  )}

                  {/* Label */}
                  <text x={island.x} y={island.y - (isSelected ? 16 : 10)}
                    textAnchor="middle"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: isSelected ? 10 : 8,
                      fontWeight: isSelected ? 600 : 400,
                      fill: isSelected ? '#fff' : isHovered ? '#fff' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s ease',
                      pointerEvents: 'none',
                    }}
                  >
                    {island.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover tooltip */}
          {hoveredIsland && (
            <div style={{
              position: 'absolute', bottom: 16, left: 16, right: 16,
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${GOLD}30`,
              borderRadius: 8,
              pointerEvents: 'none',
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 18, color: '#fff', marginBottom: 4 }}>
                {hoveredIsland.name}
              </div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 10, color: `${GOLD}99`, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                {hoveredIsland.region}
              </div>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {hoveredIsland.desc}
              </div>
            </div>
          )}
        </div>

        {/* ROUTE PANEL */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#fff', margin: '0 0 4px 0' }}>
            Your Route
          </h3>
          <p style={{ fontFamily: "'Montserrat'", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            {selected.length === 0 ? 'Click islands to begin' : `${selected.length} stop${selected.length !== 1 ? 's' : ''} selected`}
          </p>

          {/* Selected islands list */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 20 }}>
            {selected.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.3 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🏝️</div>
                <p style={{ fontFamily: "'Montserrat'", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  Tap islands on the map to build your itinerary
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.map((island, i) => (
                  <div key={island.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', background: '#1a1a1a', borderRadius: 6,
                    border: '1px solid #2a2a2a',
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${GOLD}, #8B6914)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Montserrat'", fontSize: 10, fontWeight: 700, color: '#000',
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Montserrat'", fontSize: 13, fontWeight: 600, color: '#fff' }}>
                        {island.name}
                      </div>
                      <div style={{ fontFamily: "'Montserrat'", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                        {island.region}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleIsland(island)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 16, padding: 4 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          {selected.length >= 2 && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20,
              padding: '16px', background: `${GOLD}08`, borderRadius: 8, border: `1px solid ${GOLD}15`,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Total Distance
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 24, color: GOLD, fontWeight: 600 }}>
                  {routeStats.totalNM} NM
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Montserrat'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Sailing Time
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 24, color: GOLD, fontWeight: 600 }}>
                  ~{routeStats.hours}h
                </div>
              </div>
            </div>
          )}

          {/* Legs breakdown */}
          {routeStats.legs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Montserrat'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                Legs
              </div>
              {routeStats.legs.map((leg, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: '1px solid #1a1a1a',
                  fontFamily: "'Montserrat'", fontSize: 11,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{leg.from} → {leg.to}</span>
                  <span style={{ color: GOLD, fontWeight: 600 }}>{leg.nm} NM</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selected.length >= 2 && (
              <button
                onClick={handleSendToGeorge}
                style={{
                  width: '100%', padding: '14px 0',
                  fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#000', background: `linear-gradient(90deg, ${GOLD}, #8B6914)`,
                  border: 'none', borderRadius: 4, cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Send Route to George
              </button>
            )}
            {selected.length > 0 && (
              <button
                onClick={() => setSelected(athensIsland ? [athensIsland] : [])}
                style={{
                  width: '100%', padding: '12px 0',
                  fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                  color: 'rgba(255,255,255,0.3)', background: 'none',
                  border: '1px solid #222', borderRadius: 4, cursor: 'pointer',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}
              >
                Clear Route
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .itinerary-layout {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 100; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
