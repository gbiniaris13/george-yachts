'use client';

import { useI18n } from '@/lib/i18n/I18nProvider';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const GOLD = '#DAA520';

const QUESTIONS = [
  {
    id: 'group',
    title: 'Who\'s Coming Along?',
    subtitle: 'Tell us about your group',
    options: [
      { value: 'couple', label: 'Just Us Two', emoji: '💑', desc: '2 guests — intimate escape' },
      { value: 'small', label: 'Small Group', emoji: '👨‍👩‍👧‍👦', desc: '3–6 guests — family or friends' },
      { value: 'medium', label: 'Medium Group', emoji: '🎉', desc: '7–8 guests — perfect party size' },
      { value: 'large', label: 'Large Group', emoji: '🛥️', desc: '9–12 guests — go big' },
    ],
  },
  {
    id: 'budget',
    title: 'What\'s Your Investment?',
    subtitle: 'Weekly charter rate range',
    options: [
      { value: 'entry', label: 'Smart Luxury', emoji: '✨', desc: 'Under €20,000/week' },
      { value: 'mid', label: 'Premium', emoji: '💎', desc: '€20,000 – €50,000/week' },
      { value: 'high', label: 'Ultra-Premium', emoji: '👑', desc: '€50,000 – €100,000/week' },
      { value: 'top', label: 'No Limits', emoji: '🏆', desc: '€100,000+/week' },
    ],
  },
  {
    id: 'style',
    title: 'What Calls To You?',
    subtitle: 'Choose your charter style',
    options: [
      { value: 'sailing', label: 'Wind & Sail', emoji: '⛵', desc: 'Feel the breeze, hear the water' },
      { value: 'motor', label: 'Speed & Power', emoji: '🚤', desc: 'Get there fast, arrive in style' },
      { value: 'catamaran', label: 'Space & Stability', emoji: '🛳️', desc: 'Wide decks, smooth sailing' },
      { value: 'any', label: 'Surprise Me', emoji: '🌊', desc: 'Best match regardless of type' },
    ],
  },
  {
    id: 'priority',
    title: 'What Matters Most?',
    subtitle: 'Pick your top priority',
    options: [
      { value: 'cuisine', label: 'Exceptional Food', emoji: '🍽️', desc: 'Award-winning chefs, gourmet dining' },
      { value: 'watersports', label: 'Water Sports', emoji: '🏄', desc: 'Jet skis, diving, toys galore' },
      { value: 'relaxation', label: 'Pure Relaxation', emoji: '🧘', desc: 'Slow days, sunset cocktails' },
      { value: 'exploring', label: 'Island Exploring', emoji: '🏝️', desc: 'Hidden coves, village dinners' },
    ],
  },
  {
    id: 'vibe',
    title: 'Set The Mood',
    subtitle: 'What\'s the occasion?',
    options: [
      { value: 'romantic', label: 'Romance', emoji: '🥂', desc: 'Anniversary, honeymoon, couples' },
      { value: 'family', label: 'Family Time', emoji: '👨‍👩‍👧', desc: 'Kids, multi-gen, memory-making' },
      { value: 'friends', label: 'Friends Trip', emoji: '🎊', desc: 'Celebration, reunion, adventure' },
      { value: 'first-time', label: 'First Charter', emoji: '🌟', desc: 'Never done this before — guide me' },
    ],
  },
];

function matchYachts(answers) {
  const scored = FLEET.map((yacht) => {
    let score = 0;

    // Group size matching
    const g = answers.group;
    if (g === 'couple' && yacht.guests <= 6) score += 10;
    if (g === 'couple' && yacht.guests <= 4) score += 5;
    if (g === 'small' && yacht.guests >= 6 && yacht.guests <= 8) score += 10;
    if (g === 'medium' && yacht.guests >= 8) score += 10;
    if (g === 'large' && yacht.guests >= 10) score += 15;

    // Budget matching
    const b = answers.budget;
    if (b === 'entry' && yacht.price < 20000) score += 15;
    if (b === 'mid' && yacht.price >= 20000 && yacht.price <= 50000) score += 15;
    if (b === 'high' && yacht.price > 50000 && yacht.price <= 100000) score += 15;
    if (b === 'top' && yacht.price > 100000) score += 15;
    // Partial matches
    if (b === 'mid' && yacht.price >= 15000 && yacht.price < 20000) score += 5;
    if (b === 'high' && yacht.price >= 40000 && yacht.price <= 50000) score += 5;

    // Style matching
    const s = answers.style;
    if (s === 'sailing' && (yacht.type === 'sailing-cat' || yacht.type === 'sailing-mono')) score += 10;
    if (s === 'motor' && (yacht.type === 'motor' || yacht.type === 'power-cat')) score += 10;
    if (s === 'catamaran' && (yacht.type === 'sailing-cat' || yacht.type === 'power-cat')) score += 10;
    if (s === 'any') score += 5;

    // Priority matching via tags
    const p = answers.priority;
    if (p === 'cuisine' && yacht.tags.includes('cuisine')) score += 12;
    if (p === 'watersports' && yacht.tags.includes('watersports')) score += 12;
    if (p === 'relaxation' && yacht.tags.includes('relaxation')) score += 12;
    if (p === 'exploring' && (yacht.tags.includes('adventure') || yacht.tags.includes('exploring'))) score += 12;

    // Vibe matching
    const v = answers.vibe;
    if (v === 'romantic' && yacht.tags.includes('romance')) score += 10;
    if (v === 'romantic' && yacht.guests <= 6) score += 5;
    if (v === 'family' && yacht.tags.includes('families')) score += 10;
    if (v === 'family' && yacht.tags.includes('children')) score += 5;
    if (v === 'friends' && yacht.guests >= 8) score += 8;
    if (v === 'friends' && yacht.tags.includes('watersports')) score += 5;
    if (v === 'first-time' && yacht.tags.includes('first-time')) score += 12;
    if (v === 'first-time' && yacht.tags.includes('value')) score += 5;

    // Bonus for flagships and award-winners
    if (yacht.tags.includes('awards')) score += 3;
    if (yacht.slug === 'la-pellegrina-1' && b === 'top') score += 10;

    const totalAllIn = Math.round(yacht.price * 1.42); // charter + APA 30% + VAT 12%
    const ppw = Math.round(totalAllIn / yacht.guests); // per person per week

    return { ...yacht, score, ppw, totalAllIn };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

export default function YachtFinderQuiz({ fleet: FLEET = [] }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const currentQ = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const results = useMemo(() => {
    if (!showResults) return [];
    return matchYachts(answers);
  }, [showResults, answers]);

  const handleSelect = (value) => {
    setSelectedOption(value);
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
        setSelectedOption(null);
      } else {
        setShowResults(true);
      }
    }, 400);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
    setSelectedOption(null);
  };

  // RESULTS VIEW
  if (showResults) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', padding: '80px 24px 120px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
              {t('finder.yourMatch', 'Your Perfect Match')}
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px 0' }}>
              {t('finder.weFoundYachts', 'We Found Your Yachts')}
            </h1>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto' }}>
              {t('finder.resultsDesc', 'Based on your preferences, these three vessels are your ideal match in Greek waters.')}
            </p>
          </div>

          {/* Results Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {results.map((yacht, i) => (
              <div
                key={yacht.slug}
                style={{
                  background: '#111',
                  border: i === 0 ? `1px solid ${GOLD}40` : '1px solid #222',
                  borderRadius: 8,
                  overflow: 'hidden',
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease ${i * 0.15}s forwards`,
                }}
              >
                {/* Match badge */}
                {i === 0 && (
                  <div style={{
                    background: `linear-gradient(90deg, ${GOLD}, #8B6914)`,
                    padding: '8px 0',
                    textAlign: 'center',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: '#000',
                    textTransform: 'uppercase',
                  }}>
                    ★ {t('finder.bestMatch', 'Best Match')}
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#fff', margin: '0 0 8px 0' }}>
                    {yacht.name}
                  </h3>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', margin: '0 0 20px 0' }}>
                    {yacht.builder} · {yacht.length}
                  </p>

                  {/* Specs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                    <div style={{ textAlign: 'center', padding: '12px 0', borderBottom: '1px solid #222' }}>
                      <div style={{ fontFamily: "'Montserrat'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{t('common.guests', 'Guests')}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, color: '#fff' }}>{yacht.guests}</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px 0', borderBottom: '1px solid #222' }}>
                      <div style={{ fontFamily: "'Montserrat'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{t('common.cabins', 'Cabins')}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 20, color: '#fff' }}>{yacht.cabins}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'center', padding: '16px 0', background: 'rgba(218,165,32,0.05)', borderRadius: 4, marginBottom: 20 }}>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>{t('finder.totalAllIn', 'Total All-In (incl. APA & VAT)')}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond'", fontSize: 24, color: GOLD, fontWeight: 600 }}>
                      €{yacht.totalAllIn.toLocaleString()}/week
                    </div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                      €{yacht.ppw.toLocaleString()}/person/week
                    </div>
                    <div style={{ fontFamily: "'Montserrat'", fontSize: 8, color: 'rgba(255,255,255,0.15)', marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      charter + 30% APA + 12% VAT
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/yachts/${yacht.slug}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '14px 0',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#000',
                      background: `linear-gradient(90deg, ${GOLD}, #8B6914)`,
                      textDecoration: 'none',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {t('common.viewDetails', 'View Details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              onClick={handleRestart}
              style={{
                background: 'none',
                border: `1px solid ${GOLD}30`,
                color: GOLD,
                padding: '14px 32px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 4,
                marginRight: 16,
                transition: 'all 0.3s ease',
              }}
            >
              {t('finder.startOver', 'Start Over')}
            </button>
            <a
              href="https://calendly.com/george-georgeyachts/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== "undefined" && typeof window.gtag === "function") {
                  try { window.gtag("event", "calendly_click", { click_location: "yacht_finder_result" }); } catch {}
                }
              }}
              style={{
                display: 'inline-block',
                background: 'none',
                border: `1px solid rgba(255,255,255,0.15)`,
                color: 'rgba(255,255,255,0.6)',
                padding: '14px 32px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: 4,
                transition: 'all 0.3s ease',
              }}
            >
              {t('finder.talkToGeorge', 'Talk to George Instead')}
            </a>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // QUIZ VIEW
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '160px 24px' }}>
      <div style={{ maxWidth: 600, width: '100%' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Montserrat'", fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
              {t('finder.questionOf', 'Question')} {step + 1} {t('quiz.of', 'of')} {QUESTIONS.length}
            </span>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat'", fontSize: 11, cursor: 'pointer', letterSpacing: '0.1em' }}
              >
                ← {t('common.back', 'Back')}
              </button>
            )}
          </div>
          <div style={{ height: 2, background: '#222', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${GOLD}, #8B6914)`, transition: 'width 0.5s ease', borderRadius: 1 }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff', fontWeight: 300, margin: '0 0 12px 0' }}>
            {t(`finder.step${step + 1}Title`, currentQ.title)}
          </h2>
          <p style={{ fontFamily: "'Montserrat'", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            {t(`finder.step${step + 1}Subtitle`, currentQ.subtitle)}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gap: 12 }}>
          {currentQ.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                width: '100%',
                padding: '20px 24px',
                background: selectedOption === opt.value ? `${GOLD}15` : '#111',
                border: selectedOption === opt.value ? `1px solid ${GOLD}60` : '1px solid #222',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.emoji}</span>
              <div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                  {t(`finder.step${step + 1}Option${currentQ.options.indexOf(opt) + 1}`, opt.label)}
                </div>
                <div style={{ fontFamily: "'Montserrat'", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  {t(`finder.step${step + 1}Desc${currentQ.options.indexOf(opt) + 1}`, opt.desc)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
