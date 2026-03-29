'use client';

import { useState } from 'react';

const GOLD = '#DAA520';

const STEPS = [
  {
    day: 'Day 1',
    title: 'First Conversation',
    icon: '💬',
    desc: 'You reach out — by WhatsApp, email, or our inquiry form. George responds personally within hours. No automated replies, no junior staff. Just a straightforward conversation about what you have in mind.',
    details: ['Share your dates, group size, and preferences', 'Discuss regions, yacht types, and budget range', 'Ask anything — no commitment at this stage'],
  },
  {
    day: '24 Hours',
    title: 'Your Proposal Arrives',
    icon: '📋',
    desc: 'Within 24 hours, you receive a curated proposal — not a mass-market list, but a handpicked selection of 3–5 yachts chosen specifically for your group, with pricing, photos, and George\'s personal notes on each.',
    details: ['Detailed yacht profiles with crew information', 'Transparent pricing: charter rate + APA + VAT breakdown', 'Suggested itinerary based on your dates and interests'],
  },
  {
    day: 'Week 1',
    title: 'Yacht Secured',
    icon: '✍️',
    desc: 'Once you choose your yacht, we prepare the MYBA charter agreement — the international gold standard. Everything is transparent: charter rate, APA estimate, VAT, payment schedule. No hidden clauses.',
    details: ['MYBA-standard charter agreement', 'Clear payment terms (typically 50% deposit, 50% balance)', 'APA explained line by line', 'Full cancellation terms laid out'],
  },
  {
    day: '60 Days Before',
    title: 'Preference Sheets',
    icon: '📝',
    desc: 'We send you preference sheets — detailed questionnaires about your tastes. Dietary requirements, favorite drinks, music preferences, pillow firmness, allergies, children\'s needs. The crew uses these to prepare everything to your standard.',
    details: ['Food & beverage preferences for every guest', 'Activity interests and fitness levels', 'Special occasions (birthdays, anniversaries)', 'Medical information and allergies', 'Children\'s ages and needs'],
  },
  {
    day: '30 Days Before',
    title: 'Provisioning Confirmed',
    icon: '🍷',
    desc: 'The captain and chef begin preparing based on your sheets. Provisioning orders are placed with local suppliers. Your itinerary is refined based on weather patterns and marina availability.',
    details: ['Fresh local produce sourced from island markets', 'Wine and spirits selected to your taste', 'Special equipment arranged (diving gear, baby equipment)', 'Marina reservations confirmed', 'Final itinerary draft shared with you'],
  },
  {
    day: '7 Days Before',
    title: 'Captain Briefing',
    icon: '⚓',
    desc: 'George personally briefs the captain on your preferences, itinerary wishes, and any special requests. The crew completes final preparations. Your yacht is cleaned, provisioned, and ready.',
    details: ['Captain reviews your complete profile', 'Crew assigns cabin configurations', 'Water toys tested and prepared', 'Final weather assessment for your route', 'Airport transfer confirmed'],
  },
  {
    day: 'Day 1',
    title: 'Welcome Aboard',
    icon: '🚢',
    desc: 'You arrive. The crew is waiting with cold towels and welcome drinks. Your cabin is prepared exactly as you requested. The lines are cast, and the Aegean opens before you. Everything else — forgotten.',
    details: ['Private transfer from airport to marina', 'Welcome cocktails and yacht tour', 'Captain presents the suggested itinerary', 'First swim — usually within the hour', 'Dinner under the stars, night one'],
  },
  {
    day: 'During Charter',
    title: 'George Is Always Available',
    icon: '📱',
    desc: 'Throughout your charter, George remains a WhatsApp message away. Restaurant reservations, last-minute requests, weather re-routing, birthday surprises — anything you need, handled quietly and immediately.',
    details: ['24/7 WhatsApp support from George personally', 'Restaurant reservations at short notice', 'Concierge services: spa, helicopter, guides', 'Weather-based itinerary adjustments', 'Any issue resolved within the hour'],
  },
];

export default function TimelineClient() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          Your Journey
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px' }}>
          Charter Experience Timeline
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', lineHeight: 1.8 }}>
          From first message to stepping aboard — every step, every detail, handled personally.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 120px' }}>
        {STEPS.map((step, i) => (
          <div
            key={i}
            onClick={() => setActiveStep(i)}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 40px 1fr',
              gap: 0,
              cursor: 'pointer',
              marginBottom: 0,
            }}
          >
            {/* Time label */}
            <div style={{
              textAlign: 'right',
              paddingRight: 20,
              paddingTop: 24,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 9,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: activeStep === i ? GOLD : 'rgba(255,255,255,0.2)',
              transition: 'color 0.3s ease',
            }}>
              {step.day}
            </div>

            {/* Line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: activeStep === i ? GOLD : 'transparent',
                border: `2px solid ${activeStep === i ? GOLD : '#333'}`,
                marginTop: 24,
                transition: 'all 0.3s ease',
                boxShadow: activeStep === i ? `0 0 12px ${GOLD}40` : 'none',
                zIndex: 1,
              }} />
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 1, flex: 1,
                  background: i < activeStep ? `${GOLD}40` : '#222',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>

            {/* Content card */}
            <div style={{
              padding: '20px 24px 40px',
              background: activeStep === i ? 'rgba(218,165,32,0.03)' : 'transparent',
              borderRadius: 12,
              borderLeft: activeStep === i ? `2px solid ${GOLD}30` : '2px solid transparent',
              transition: 'all 0.4s ease',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: activeStep === i ? 22 : 18,
                color: activeStep === i ? '#fff' : 'rgba(255,255,255,0.5)',
                fontWeight: 400,
                margin: '0 0 8px',
                transition: 'all 0.3s ease',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                color: activeStep === i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                lineHeight: 1.8,
                margin: '0 0 12px',
                transition: 'all 0.3s ease',
                maxHeight: activeStep === i ? '500px' : '0',
                overflow: 'hidden',
              }}>
                {step.desc}
              </p>

              {/* Details */}
              {activeStep === i && (
                <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'none' }}>
                  {step.details.map((d, j) => (
                    <li key={j} style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      lineHeight: 2,
                      position: 'relative',
                      paddingLeft: 16,
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: GOLD, fontSize: 8 }}>✦</span>
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .timeline-grid { grid-template-columns: 30px 1fr !important; }
        }
      `}</style>
    </div>
  );
}
