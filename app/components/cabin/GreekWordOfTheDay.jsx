// app/components/cabin/GreekWordOfTheDay.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 4 (Sarah):
//   "Greek phrases page — 'Filotimo: doing the right thing
//    because of who you are' — I thought 'my kids should read
//    this'. Surface a single Greek word of the day on the Cabin
//    home — don't bury it two clicks deep."
//
// Picks one of N phrases by day-of-year so the word is fresh
// each day but stable across a session and across devices on
// the same day.
//
// Server-rendered (no client JS). Static once per day per
// browser cache hit.
// =============================================================

const PHRASES = [
  { gr: "Καλημέρα",       en: "Kaliméra",       gloss: "Good morning - literally 'good day'" },
  { gr: "Καλησπέρα",      en: "Kalispéra",      gloss: "Good evening - used from late afternoon" },
  { gr: "Ευχαριστώ",      en: "Efharistó",      gloss: "Thank you - formal or warm" },
  { gr: "Παρακαλώ",       en: "Parakaló",       gloss: "Please / you're welcome / 'how can I help?'" },
  { gr: "Γεια μας",       en: "Yiá mas",        gloss: "Cheers - literally 'to our health'" },
  { gr: "Στην υγειά σας", en: "Stin iyiá sas",  gloss: "To your health - the formal toast" },
  { gr: "Ωραίο",          en: "Oréo",           gloss: "Beautiful · lovely · just right" },
  { gr: "Νόστιμο",        en: "Nóstimo",        gloss: "Delicious - say it after the first bite" },
  { gr: "Σιγά σιγά",      en: "Sigá sigá",      gloss: "Slowly, slowly - a way of life on the islands" },
  { gr: "Φιλότιμο",       en: "Filotimo · fee-LO-tee-mo", gloss: "Doing the right thing because of who you are" },
  { gr: "Καλό ταξίδι",    en: "Kaló taxídi",    gloss: "Have a good journey - what we wish you" },
  { gr: "Αντίο",          en: "Adío",           gloss: "Goodbye - and 'until again'" },
];

function pickForToday() {
  // Day-of-year, UTC. Stable per day.
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start;
  const doy = Math.floor(diff / (24 * 3600 * 1000));
  return PHRASES[doy % PHRASES.length];
}

export default function GreekWordOfTheDay() {
  const p = pickForToday();
  return (
    <aside className="gwotd">
      <div className="gwotd__eyebrow">A Greek word for today</div>
      <div className="gwotd__row">
        <span className="gwotd__gr">{p.gr}</span>
        <span className="gwotd__en">{p.en}</span>
      </div>
      <p className="gwotd__gloss">
        <em>{p.gloss}</em>
      </p>

      <style>{`
        .gwotd {
          background: rgba(201, 168, 76, 0.06);
          border-left: 2px solid var(--gy-gold);
          padding: 16px 20px;
        }
        .gwotd__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.88);
          font-weight: 600;
        }
        .gwotd__row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 14px;
          margin: 8px 0 4px 0;
        }
        .gwotd__gr {
          font-family: var(--gy-font-editorial);
          font-size: 26px;
          font-weight: 300;
          color: var(--gy-navy);
        }
        .gwotd__en {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 15px;
          color: var(--gy-gold);
        }
        .gwotd__gloss {
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(13, 27, 42, 0.65);
          margin: 0;
          line-height: 1.6;
        }
      `}</style>
    </aside>
  );
}
