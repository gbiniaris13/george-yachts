"use client";

// D3 — Smart Inquiry Form (Typeform-style, George Yachts edition).
//
// Single-question-per-screen flow. Each step auto-focuses the input,
// progresses on Enter or button click, and feeds a progress bar at
// the top. At the end we POST to /api/lead-gate so every finished
// inquiry shows up in Telegram + Gmail + newsletter:subscribers set.
//
// Questions were tuned for the info George needs to quote fast:
//   1.  Fleet preference   (Private / Explorer / Not sure)
//   2.  Region              (Cyclades / Ionian / Sporades / Saronic / Anywhere)
//   3.  Group size
//   4.  When                (rough dates / season)
//   5.  Duration            (days at sea)
//   6.  Budget band         (per-person or per-week)
//   7.  Style anchor        ("tell me the 3 words that describe this trip")
//   8.  Name
//   9.  Email
//  10.  Phone
//  11.  Anything else       (optional free-text)
//
// Visual pattern: black canvas, big serif question, gold accent number,
// minimal inputs, full-width inputs on mobile. prefers-reduced-motion
// gets an instant cross-fade; default is a 180ms slide-up.

import { useEffect, useRef, useState } from "react";

const GOLD = "#DAA520";

/* ─── Question set ─────────────────────────────────────────────── */
const STEPS = [
  {
    key: "fleet",
    label: "What kind of charter are you drawn to?",
    type: "choice",
    options: [
      { value: "private", label: "Private Fleet — full crew, absolute discretion" },
      { value: "explorer", label: "Explorer Fleet — more islands, lighter crew" },
      { value: "unsure", label: "I'm not sure yet — advise me" },
    ],
  },
  {
    key: "region",
    label: "Which waters call you?",
    type: "choice",
    options: [
      { value: "cyclades", label: "Cyclades — Mykonos, Santorini, Paros" },
      { value: "ionian", label: "Ionian — Corfu, Lefkada, Kefalonia" },
      { value: "sporades", label: "Sporades — Skiathos, Alonissos" },
      { value: "saronic", label: "Saronic Gulf — Hydra, Spetses" },
      { value: "mix", label: "A mix / I'd like a recommendation" },
    ],
  },
  {
    key: "guests",
    label: "How many guests on board?",
    type: "number",
    min: 2,
    max: 30,
    placeholder: "e.g. 6",
  },
  {
    key: "when",
    label: "Roughly when would you like to sail?",
    type: "choice",
    options: [
      { value: "may", label: "May" },
      { value: "june", label: "June" },
      { value: "july", label: "July" },
      { value: "august", label: "August" },
      { value: "september", label: "September" },
      { value: "october", label: "October" },
      { value: "flexible", label: "I'm flexible / other month" },
    ],
  },
  {
    key: "duration",
    label: "How many days at sea?",
    type: "choice",
    options: [
      { value: "weekend", label: "A weekend (2–3 days)" },
      { value: "week", label: "About a week" },
      { value: "two-weeks", label: "Two weeks" },
      { value: "longer", label: "Longer / open-ended" },
    ],
  },
  {
    key: "budget",
    label: "What's the comfortable weekly budget?",
    type: "choice",
    options: [
      { value: "under-30k", label: "Under €30,000 / week" },
      { value: "30-60k", label: "€30,000 – €60,000" },
      { value: "60-120k", label: "€60,000 – €120,000" },
      { value: "120k-plus", label: "€120,000+" },
      { value: "per-person", label: "I think per person (Explorer Fleet)" },
    ],
  },
  {
    key: "style",
    label: "Describe this trip in three words.",
    type: "text",
    placeholder: "e.g. quiet, romantic, remote",
  },
  {
    key: "name",
    label: "What's your name?",
    type: "text",
    placeholder: "First and last name",
    required: true,
  },
  {
    key: "email",
    label: "Where should George write back?",
    type: "email",
    placeholder: "you@example.com",
    required: true,
  },
  {
    key: "phone",
    label: "And a phone number we can reach you on?",
    type: "tel",
    placeholder: "+30 ...",
    required: true,
  },
  {
    key: "notes",
    label: "Anything else we should know?",
    type: "textarea",
    placeholder: "Optional — birthdays, dietary needs, destinations already shortlisted…",
  },
];

const TOTAL = STEPS.length;

export default function InquiryClient() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  const step = STEPS[idx];
  const progress = ((idx + 1) / TOTAL) * 100;

  // Auto-focus the input whenever we advance.
  useEffect(() => {
    if (!step) return;
    const t = setTimeout(() => inputRef.current?.focus?.(), 120);
    return () => clearTimeout(t);
  }, [idx, step]);

  const setValue = (v) => {
    setAnswers((a) => ({ ...a, [step.key]: v }));
    setError("");
  };

  const advance = () => {
    const v = answers[step.key];
    if (step.required && (!v || !String(v).trim())) {
      setError("This one is required to send the inquiry.");
      return;
    }
    if (step.type === "email" && v && !String(v).includes("@")) {
      setError("That doesn't look like a valid email.");
      return;
    }
    if (step.type === "tel" && v && String(v).replace(/\D/g, "").length < 7) {
      setError("Please include the country code.");
      return;
    }
    if (idx < TOTAL - 1) {
      setIdx(idx + 1);
    } else {
      submit();
    }
  };

  const back = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      await fetch("/api/lead-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "inquiry",
          name: (answers.name || "").trim(),
          email: (answers.email || "").trim(),
          phone: (answers.phone || "").trim(),
          meta: {
            fleet: answers.fleet || null,
            region: answers.region || null,
            guests: answers.guests || null,
            when: answers.when || null,
            duration: answers.duration || null,
            budget: answers.budget || null,
            style: answers.style || null,
            notes: answers.notes || null,
          },
        }),
      });
      setDone(true);
      // GA4 conversion event — primary funnel completion. Tracks
      // region, fleet tier, party size, budget band so we can analyze
      // conversion rate by traffic segment.
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        try {
          window.gtag("event", "inquiry_submit", {
            charter_region: answers.region || null,
            fleet_tier: answers.fleet || null,
            party_size: answers.guests || null,
            budget_band: answers.budget || null,
            charter_when: answers.when || null,
            duration: answers.duration || null,
          });
        } catch {}
      }
    } catch {
      setError("Network hiccup. Please try again — if it keeps failing, WhatsApp george@georgeyachts.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && (step.type === "text" || step.type === "email" || step.type === "tel" || step.type === "number")) {
      e.preventDefault();
      advance();
    }
  };

  /* ─── Render ───────────────────────────────────────────────── */
  if (done) {
    return (
      <div style={wrap}>
        <div style={{ ...card, textAlign: "center" }}>
          <p style={eyebrow}>Inquiry received</p>
          <h1 style={{ ...question, marginBottom: 18 }}>Thank you.</h1>
          <p style={subtext}>
            George reads every inquiry personally. You'll hear back within 24 hours — usually much sooner.
          </p>
          <div style={{ marginTop: 36 }}>
            <a
              href="https://wa.me/17867988798?text=Hi%20George%20%E2%80%94%20I%20just%20submitted%20an%20inquiry%20on%20the%20site."
              target="_blank"
              rel="noopener noreferrer"
              style={ctaPrimary}
            >
              Or message on WhatsApp now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      {/* Progress */}
      <div style={progressTrack}>
        <div style={{ ...progressFill, width: `${progress}%` }} />
      </div>

      <div style={card}>
        <p style={eyebrow}>
          Question {idx + 1} / {TOTAL}
        </p>
        <h1 style={question}>{step.label}</h1>

        {/* Input per type */}
        <div style={{ marginTop: 28 }}>
          {step.type === "choice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {step.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setValue(opt.value);
                    // Small pause to show the selection, then advance
                    setTimeout(() => {
                      if (idx < TOTAL - 1) setIdx(idx + 1);
                      else submit();
                    }, 180);
                  }}
                  style={{
                    ...choiceBtn,
                    borderColor:
                      answers[step.key] === opt.value
                        ? GOLD
                        : "rgba(218,165,32,0.22)",
                    color:
                      answers[step.key] === opt.value ? GOLD : "#fff",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {(step.type === "text" || step.type === "email" || step.type === "tel") && (
            <input
              ref={inputRef}
              type={step.type}
              value={answers[step.key] || ""}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={step.placeholder}
              style={textInput}
            />
          )}

          {step.type === "number" && (
            <input
              ref={inputRef}
              type="number"
              min={step.min}
              max={step.max}
              value={answers[step.key] || ""}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={step.placeholder}
              style={textInput}
            />
          )}

          {step.type === "textarea" && (
            <textarea
              ref={inputRef}
              value={answers[step.key] || ""}
              onChange={(e) => setValue(e.target.value)}
              placeholder={step.placeholder}
              rows={4}
              style={{ ...textInput, resize: "vertical", minHeight: 120 }}
            />
          )}
        </div>

        {error && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: "#ff9b9b", marginTop: 14 }}>
            {error}
          </p>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 34, alignItems: "center" }}>
          <button
            onClick={back}
            disabled={idx === 0}
            style={{ ...navBtn, opacity: idx === 0 ? 0.25 : 1, cursor: idx === 0 ? "default" : "pointer" }}
          >
            ← Back
          </button>

          {step.type !== "choice" && (
            <button onClick={advance} disabled={submitting} style={ctaPrimary}>
              {idx === TOTAL - 1 ? (submitting ? "Sending…" : "Send inquiry") : "Continue →"}
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}

/* ─── Inline styles — avoids a fight with global Tailwind ─────── */
const wrap = {
  minHeight: "100vh",
  background: "#000",
  padding: "140px 24px 80px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const progressTrack = {
  position: "fixed",
  top: "72px",
  left: 0,
  right: 0,
  height: 2,
  background: "rgba(218,165,32,0.08)",
  zIndex: 39,
};
const progressFill = {
  height: "100%",
  background: `linear-gradient(90deg, ${GOLD}, #8B6914)`,
  transition: "width 0.35s cubic-bezier(0.2,0.8,0.2,1)",
};
const card = {
  width: "100%",
  maxWidth: 640,
  padding: "36px 28px 30px",
  background: "#050505",
  border: "1px solid rgba(218,165,32,0.16)",
  animation: "fade-in 0.25s ease both",
};
const eyebrow = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 9,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  color: `${GOLD}cc`,
  marginBottom: 16,
  fontWeight: 600,
};
const question = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "clamp(24px, 3.4vw, 36px)",
  fontWeight: 300,
  color: "#fff",
  lineHeight: 1.2,
  margin: 0,
  letterSpacing: "0.005em",
};
const subtext = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 17,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.65)",
  fontWeight: 300,
  margin: 0,
};
const textInput = {
  width: "100%",
  padding: "14px 16px",
  background: "#000",
  border: "1px solid rgba(218,165,32,0.25)",
  color: "#fff",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 18,
  fontWeight: 300,
  outline: "none",
  letterSpacing: "0.01em",
};
const choiceBtn = {
  padding: "14px 18px",
  background: "rgba(0,0,0,0.5)",
  border: "1px solid rgba(218,165,32,0.22)",
  color: "#fff",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 13,
  letterSpacing: "0.03em",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.25s ease",
};
const navBtn = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.5)",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
};
const ctaPrimary = {
  display: "inline-block",
  padding: "14px 34px",
  background: `linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)`,
  color: "#000",
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
};
