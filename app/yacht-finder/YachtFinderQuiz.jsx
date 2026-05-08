'use client';

// B.2 (Roberto master rebuild brief, May 2026) — Smart Match Quiz.
//
// Replaces the previous 5-question emoji-driven version. Brief
// strict-spec rewrite:
//   • Q1 — Personal warmth ("Hi — I'm George.") + group composition
//   • Q2 — Geographic vibe (region of Greece)
//   • Q3 — Style / rhythm
//   • Q4 — Investment range pills
//   • Q5 — Approximate dates (optional)
//   • Q6 — Contact (name / email / phone + WhatsApp/Telegram pref)
//
// On submit:
//   • POST /api/inquiry with full quiz state + matched yacht slugs
//   • Telegram fires to George (lib/telegram.js)
//   • Email auto-confirm via existing pipeline
//   • Result screen shows top 3 yacht matches (algorithm: filter by
//     region + budget + group size + style tags + idealFor)
//   • Each result has a 2-line reasoning ("Why this yacht for you")
//
// Identity rules: no "Founder/Owner", no years claims, no charter
// counts. Pull-quotes attribute "George P. Biniaris, Managing Broker".
// Result-screen line: "George will personally review your match and
// send a complete proposal within 24 hours."
//
// Acceptance criteria from brief:
//   • Quiz completion under 90 seconds for typical user
//   • Match algorithm yields 3 distinct yachts
//   • Telegram alert lands within 5s of submit
//   • SSR-safe (Q1 visible without JS)

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const GOLD = '#C9A84C';

const QUESTIONS = [
  {
    id: 'group',
    eyebrow: "Hi — I'm George.",
    intro: 'Before I match you with the right yacht, tell me one thing.',
    title: "Who's coming with you?",
    options: [
      { value: 'couple', label: 'My partner and I' },
      { value: 'family', label: 'Family with children' },
      { value: 'friends', label: 'A group of friends' },
      { value: 'corporate', label: 'A team or corporate event' },
      { value: 'multigen', label: 'Multi-generational (3 generations)' },
    ],
  },
  {
    id: 'region',
    eyebrow: 'Question 2 of 5',
    title: 'Which corner of Greece feels right?',
    options: [
      {
        value: 'cyclades',
        label: 'Cyclades',
        sub: 'Mykonos, Santorini, Paros — energetic, iconic',
      },
      {
        value: 'ionian',
        label: 'Ionian',
        sub: 'Corfu, Lefkada, Kefalonia — calm, family-friendly',
      },
      {
        value: 'saronic',
        label: 'Saronic',
        sub: 'Hydra, Spetses — short charters from Athens',
      },
      {
        value: 'sporades',
        label: 'Sporades',
        sub: 'Skiathos, Skopelos — quiet, pine-forested',
      },
      { value: 'any', label: 'I want George to recommend', sub: '' },
    ],
  },
  {
    id: 'rhythm',
    eyebrow: 'Question 3 of 5',
    title: "What's the rhythm you want?",
    options: [
      {
        value: 'quiet',
        label: 'Quiet luxury',
        sub: 'Chef dinners, hidden coves, no crowds',
      },
      {
        value: 'active',
        label: 'Active',
        sub: 'Water toys, beach clubs, snorkeling, sailing',
      },
      {
        value: 'social',
        label: 'Social',
        sub: 'Mykonos nightlife, Nammos, anchored beach parties',
      },
      { value: 'mix', label: 'A bit of everything', sub: '' },
    ],
  },
  {
    id: 'budget',
    eyebrow: 'Question 4 of 5',
    title: 'Investment range for the week',
    options: [
      {
        value: 'under-15',
        label: 'Under €15K',
        sub: 'Explorer Fleet — skippered cats',
      },
      { value: '15-40', label: '€15K – €40K', sub: 'Mid-tier crewed' },
      { value: '40-100', label: '€40K – €100K', sub: 'Premium crewed' },
      { value: 'over-100', label: '€100K+', sub: 'Superyachts' },
      { value: 'discuss', label: "I'd rather discuss with George", sub: '' },
    ],
  },
  {
    id: 'dates',
    eyebrow: 'Question 5 of 5 · Optional',
    title: 'Approximate dates',
    sub: 'Leave blank if your dates are still flexible.',
    custom: 'dates',
  },
];

function matchYachts(answers, fleet) {
  if (!Array.isArray(fleet) || fleet.length === 0) return [];

  const scored = fleet.map((y) => {
    let score = 0;

    // Group → guest count
    const g = answers.group;
    if (g === 'couple' && y.guests <= 4) score += 20;
    else if (g === 'couple' && y.guests <= 6) score += 12;
    if (g === 'family' && y.guests >= 6 && y.guests <= 10) score += 18;
    if (g === 'friends' && y.guests >= 8) score += 18;
    if (g === 'corporate' && y.guests >= 10) score += 18;
    if (g === 'multigen' && y.guests >= 10) score += 16;

    // Budget bucket
    const b = answers.budget;
    if (b === 'under-15' && y.price < 15000) score += 25;
    if (b === '15-40' && y.price >= 15000 && y.price <= 40000) score += 25;
    if (b === '40-100' && y.price > 40000 && y.price <= 100000) score += 25;
    if (b === 'over-100' && y.price > 100000) score += 25;
    // Adjacent partial credit
    if (b === '15-40' && y.price >= 12000 && y.price < 15000) score += 8;
    if (b === '40-100' && y.price >= 30000 && y.price < 40000) score += 8;
    if (b === 'discuss') score += 5;

    // Rhythm → tag matching
    const r = answers.rhythm;
    if (r === 'quiet' && (y.tags.includes('relaxation') || y.tags.includes('cuisine'))) score += 10;
    if (r === 'active' && (y.tags.includes('watersports') || y.tags.includes('adventure'))) score += 10;
    if (r === 'social' && y.tags.includes('design')) score += 6;
    if (r === 'social' && y.guests >= 8) score += 4;

    // Region — best-effort: yachts often base in regions but the
    // schema doesn't always tag them. We give partial credit for
    // "any" so the algorithm doesn't fail when the visitor defers
    // to George.
    if (answers.region === 'any') score += 3;

    return { ...y, score };
  });

  scored.sort((a, b) => b.score - a.score || b.price - a.price);
  // Take top 3, but try to ensure variety — different yacht slugs
  // (which is implicit via fleet uniqueness).
  return scored.slice(0, 3);
}

function buildReasoning(yacht, answers) {
  const bits = [];
  if (answers.group === 'family' && yacht.guests >= 8) {
    bits.push(`Sleeps ${yacht.guests}, ideal for a family of your size`);
  } else if (answers.group === 'couple' && yacht.guests <= 6) {
    bits.push('Quietly sized for two — no wasted space');
  } else if (answers.group === 'friends' && yacht.guests >= 8) {
    bits.push(`Sleeps ${yacht.guests} comfortably — your group, your yacht`);
  } else if (yacht.guests) {
    bits.push(`Sleeps ${yacht.guests}`);
  }
  if (answers.rhythm === 'quiet') bits.push('crew tuned to discreet, slow-day cruising');
  else if (answers.rhythm === 'active' && yacht.tags.includes('watersports')) bits.push('full water toys onboard');
  else if (answers.rhythm === 'social') bits.push('proven fit for the Mykonos circuit');
  if (yacht.builder) bits.push(`${yacht.builder}`);
  return bits.slice(0, 2).join(' · ');
}

export default function YachtFinderQuiz({ fleet = [] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    channel: 'email',
    website: '', // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const sectionRef = useRef(null);

  const totalSteps = QUESTIONS.length + 1; // questions + contact
  const isContact = step === QUESTIONS.length;
  const matches = useMemo(() => matchYachts(answers, fleet), [answers, fleet]);

  // Smooth scroll to top of card on step change
  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, done]);

  // N.1 — quiz_started fires once on first Q1 mount; quiz_step_view
  // fires on every step change so abandonment can be measured per Q.
  useEffect(() => {
    if (step === 0 && !done) {
      try {
        window.gtag?.('event', 'quiz_started', { source: 'smart_match_quiz' });
      } catch {}
    }
    try {
      window.gtag?.('event', 'quiz_step_view', { step: step + 1 });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, done]);

  // N.1 — quiz_abandoned_qN fires when the visitor leaves the page mid-quiz.
  // Skip when done=true (they completed). Use sendBeacon-friendly gtag event.
  useEffect(() => {
    const onLeave = () => {
      if (done) return;
      if (step === 0) return; // didn't engage past Q1 view
      try {
        window.gtag?.('event', `quiz_abandoned_q${step + 1}`, { step: step + 1 });
        window.gtag?.('event', 'quiz_abandoned', { step: step + 1 });
      } catch {}
    };
    window.addEventListener('beforeunload', onLeave);
    window.addEventListener('pagehide', onLeave);
    return () => {
      window.removeEventListener('beforeunload', onLeave);
      window.removeEventListener('pagehide', onLeave);
    };
  }, [step, done]);

  const handleAnswer = (qid, value) => {
    setAnswers((p) => ({ ...p, [qid]: value }));
    setStep((s) => s + 1);
  };

  const handleSkip = () => setStep((s) => s + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!contact.name.trim() || !contact.email.includes('@')) {
      setError("Please add your name and a valid email so George can reach you.");
      return;
    }
    setSubmitting(true);
    setError('');

    let recaptchaToken = '';
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (siteKey && typeof window !== 'undefined' && window.grecaptcha?.enterprise) {
      try {
        recaptchaToken = await window.grecaptcha.enterprise.execute(siteKey, {
          action: 'smart_match_quiz',
        });
      } catch {}
    }

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          dates: answers.dates || '',
          message: `Smart Match Quiz: ${JSON.stringify(answers)}`,
          shortlist: matches.map((y) => ({
            slug: y.slug,
            name: y.name,
            weeklyRatePrice: `€${y.price.toLocaleString()}`,
          })),
          source: 'smart_match_quiz',
          preferredChannel: contact.channel,
          recaptchaToken,
          website: contact.website,
        }),
      });
      if (!res.ok) {
        setError('Something went wrong. Please try again or message George on WhatsApp.');
        setSubmitting(false);
        return;
      }
      try {
        window.gtag?.('event', 'quiz_completed', { matches: matches.length });
      } catch {}
      setDone(true);
    } catch {
      setError('Network error — please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#000', color: '#F8F5F0', minHeight: '100vh', paddingBottom: 80 }}>
      <section
        ref={sectionRef}
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '80px 24px 0',
        }}
      >
        {/* Progress */}
        {!done && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 2,
                  background: i <= step ? GOLD : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.4s ease',
                }}
              />
            ))}
          </div>
        )}

        {!done && !isContact && (
          <QuestionStep
            q={QUESTIONS[step]}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            onBack={step > 0 ? () => setStep(step - 1) : null}
            value={answers[QUESTIONS[step]?.id]}
            setValue={(v) => setAnswers((p) => ({ ...p, [QUESTIONS[step].id]: v }))}
          />
        )}

        {!done && isContact && (
          <ContactStep
            contact={contact}
            setContact={setContact}
            onBack={() => setStep(step - 1)}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
            matchCount={matches.length}
          />
        )}

        {done && <ResultScreen matches={matches} answers={answers} />}
      </section>
    </div>
  );
}

function QuestionStep({ q, onAnswer, onSkip, onBack, value, setValue }) {
  if (!q) return null;
  return (
    <div>
      {q.eyebrow && (
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: '0.42em',
            textTransform: 'uppercase',
            color: GOLD,
            fontWeight: 600,
            margin: '0 0 14px',
          }}
        >
          {q.eyebrow}
        </p>
      )}
      {q.intro && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 18,
            color: 'rgba(248,245,240,0.78)',
            margin: '0 0 18px',
            lineHeight: 1.5,
          }}
        >
          {q.intro}
        </p>
      )}
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(28px, 4.4vw, 44px)',
          fontWeight: 300,
          color: '#fff',
          margin: '0 0 36px',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
        }}
      >
        {q.title}
      </h1>
      {q.sub && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 16,
            color: 'rgba(248,245,240,0.65)',
            margin: '-24px 0 28px',
          }}
        >
          {q.sub}
        </p>
      )}

      {q.custom === 'dates' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 5–12 July 2026, or July 2026"
            aria-label="Approximate dates"
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff',
              padding: '16px 18px',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 14,
              outline: 'none',
              borderRadius: 0,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
          />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onAnswer(q.id, value || '')}
              style={primaryBtnStyle}
              data-cursor="Continue"
            >
              Continue →
            </button>
            <button type="button" onClick={onSkip} style={ghostBtnStyle}>
              Skip
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAnswer(q.id, opt.value)}
              data-cursor="Select"
              style={{
                textAlign: 'left',
                padding: '18px 22px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 18,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                e.currentTarget.style.borderColor = GOLD;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
            >
              <div style={{ fontWeight: 400 }}>{opt.label}</div>
              {opt.sub && (
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontStyle: 'normal',
                    fontSize: 11,
                    color: 'rgba(248,245,240,0.55)',
                    letterSpacing: '0.04em',
                    marginTop: 4,
                  }}
                >
                  {opt.sub}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            marginTop: 24,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

function ContactStep({ contact, setContact, onBack, onSubmit, submitting, error, matchCount }) {
  return (
    <form onSubmit={onSubmit}>
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: GOLD,
          fontWeight: 600,
          margin: '0 0 14px',
        }}
      >
        Last step
      </p>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(28px, 4.4vw, 44px)',
          fontWeight: 300,
          color: '#fff',
          margin: '0 0 14px',
          lineHeight: 1.2,
        }}
      >
        Where shall I send your three yacht matches?
      </h2>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 16,
          color: 'rgba(248,245,240,0.7)',
          margin: '0 0 32px',
          lineHeight: 1.5,
        }}
      >
        I&rsquo;ve picked {matchCount || 'a small set of'} yachts that fit. I&rsquo;ll personally
        review them and send you a complete proposal within 24 hours.
      </p>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        value={contact.website}
        onChange={(e) => setContact({ ...contact, website: e.target.value })}
        style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
      />

      <Field
        label="Name"
        value={contact.name}
        onChange={(v) => setContact({ ...contact, name: v })}
        required
      />
      <Field
        label="Email"
        type="email"
        value={contact.email}
        onChange={(v) => setContact({ ...contact, email: v })}
        required
      />
      <Field
        label="Phone (optional)"
        type="tel"
        value={contact.phone}
        onChange={(v) => setContact({ ...contact, phone: v })}
      />

      <div style={{ marginTop: 24 }}>
        <span
          style={{
            display: 'block',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.65)',
            marginBottom: 10,
          }}
        >
          Where should George reply?
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['email', 'whatsapp', 'telegram', 'sms'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContact({ ...contact, channel: c })}
              style={{
                padding: '9px 14px',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                border: `1px solid ${contact.channel === c ? GOLD : 'rgba(255,255,255,0.2)'}`,
                background: contact.channel === c ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: contact.channel === c ? GOLD : 'rgba(255,255,255,0.75)',
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" style={{ color: '#e57373', fontSize: 12, marginTop: 16 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="submit" disabled={submitting} style={primaryBtnStyle}>
          {submitting ? 'Sending…' : 'Send to George'}
        </button>
        <button type="button" onClick={onBack} style={ghostBtnStyle}>
          ← Back
        </button>
      </div>

      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 9,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(248,245,240,0.5)',
          marginTop: 18,
        }}
      >
        George personally reviews every submission. Reply within 24 hours.
      </p>
    </form>
  );
}

function ResultScreen({ matches, answers }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 10,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: GOLD,
          fontWeight: 600,
          margin: '0 0 14px',
        }}
      >
        George&rsquo;s selection
      </p>
      <h2
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(30px, 4.5vw, 48px)',
          fontWeight: 300,
          color: '#fff',
          margin: '0 0 18px',
          lineHeight: 1.2,
        }}
      >
        Three yachts I picked for you
      </h2>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 16,
          color: 'rgba(248,245,240,0.78)',
          margin: '0 0 36px',
          lineHeight: 1.6,
        }}
      >
        These are the closest matches in our fleet. I&rsquo;ll personally review your
        answers and send a complete proposal within 24 hours.
      </p>

      {matches.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
          I couldn&rsquo;t find an exact match in our active fleet — but that&rsquo;s
          why I do this work personally. Watch for an email from me shortly.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 16 }}>
          {matches.map((y) => (
            <li
              key={y.slug}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {y.img && (
                <Image
                  src={`${y.img}?w=240&h=180&fit=crop&auto=format`}
                  alt={y.name}
                  width={140}
                  height={105}
                  style={{ objectFit: 'cover', flex: '0 0 auto' }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 22,
                    color: '#fff',
                    margin: '0 0 4px',
                    fontWeight: 400,
                  }}
                >
                  {y.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    color: 'rgba(248,245,240,0.65)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: '0 0 8px',
                  }}
                >
                  {y.length} · {y.guests} guests · €{y.price.toLocaleString()}/week
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: 'italic',
                    fontSize: 14,
                    color: 'rgba(248,245,240,0.75)',
                    margin: '0 0 12px',
                    lineHeight: 1.5,
                  }}
                >
                  {buildReasoning(y, answers)}
                </p>
                <Link
                  href={`/yachts/${y.slug}`}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: GOLD,
                    fontWeight: 600,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${GOLD}`,
                    paddingBottom: 2,
                  }}
                >
                  View this yacht →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          marginTop: 36,
          padding: 24,
          background: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.3)',
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 16,
            color: 'rgba(248,245,240,0.85)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          George will personally review your match and send a complete proposal within 24 hours.
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <label style={{ display: 'block', marginTop: 18 }}>
      <span
        style={{
          display: 'block',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 9,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(248,245,240,0.65)',
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: GOLD }}> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={type === 'email' ? 'email' : 'off'}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.25)',
          color: '#fff',
          padding: '10px 0',
          fontSize: 14,
          fontFamily: "'Montserrat', sans-serif",
          outline: 'none',
          transition: 'border-color 0.3s ease',
          borderRadius: 0,
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = GOLD)}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)')}
      />
    </label>
  );
}

const primaryBtnStyle = {
  padding: '14px 30px',
  background: 'linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)',
  color: '#000000',
  border: '1px solid rgba(201,168,76,0.6)',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 11,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  fontWeight: 700,
  cursor: 'pointer',
};

const ghostBtnStyle = {
  padding: '14px 24px',
  background: 'transparent',
  color: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(255,255,255,0.25)',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 11,
  letterSpacing: '0.32em',
  textTransform: 'uppercase',
  fontWeight: 600,
  cursor: 'pointer',
};
