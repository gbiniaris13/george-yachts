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
//   2.  Region              (Cyclades / Ionian / Saronic / Anywhere)
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

const GOLD = "#C9A84C";

/* ─── Question set ─────────────────────────────────────────────── */
// Phase 24 (luxury rebuild, 2026-05-05) — Boss spec: SIX brief fields
// only, plus contact. The earlier 13-step funnel had grown over time
// to capture every conversion micro-signal; for the Forbes-launch
// audience that's overkill — UHNW guests brief in six lines, not
// thirteen. Removed: fleet (broker asks), yacht_of_interest (broker
// asks if visitor came from a yacht page), duration (broker infers
// from "when"). Kept the six Boss-confirmed fields:
//   1. When · 2. Who · 3. Where · 4. What excites · 5. Budget · 6. Special
const STEPS = [
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
    key: "guests",
    label: "How many guests on board?",
    type: "number",
    min: 2,
    max: 30,
    placeholder: "e.g. 6",
  },
  {
    key: "region",
    label: "Which waters call you?",
    type: "choice",
    options: [
      { value: "cyclades", label: "Cyclades — Mykonos, Santorini, Paros" },
      { value: "ionian", label: "Ionian — Corfu, Lefkada, Kefalonia" },
      { value: "saronic", label: "Saronic Gulf — Hydra, Spetses" },
      { value: "mix", label: "A mix / I'd like a recommendation" },
    ],
  },
  {
    key: "style",
    label: "Describe this charter in three words.",
    type: "text",
    placeholder: "e.g. quiet, scenic, unhurried",
  },
  {
    key: "budget",
    label: "What's the comfortable weekly budget?",
    type: "choice",
    options: [
      { value: "under-30k",  label: "Under €30,000 / week" },
      { value: "30-60k",     label: "€30,000 – €60,000" },
      { value: "60-120k",    label: "€60,000 – €120,000" },
      { value: "120k-plus",  label: "€120,000+" },
      { value: "per-person", label: "I think per person (Explorer Fleet)" },
      { value: "discuss",    label: "I'd rather discuss with George" },
    ],
  },
  {
    key: "occasion",
    label: "Is there a special occasion?",
    type: "choice",
    options: [
      { value: "none",        label: "Just a wonderful week" },
      { value: "anniversary", label: "Anniversary" },
      { value: "birthday",    label: "Birthday" },
      { value: "honeymoon",   label: "Honeymoon" },
      { value: "family",      label: "Family reunion" },
      { value: "corporate",   label: "Corporate / private group" },
      { value: "other",       label: "Other — we'll tell George" },
    ],
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
  // Roberto 2026-05-02 — yacht options for the new "yacht_of_interest"
  // step. Populated once on mount from /api/fleet so the visitor
  // sees real yacht names (forces inventory exposure even when they
  // skipped the fleet page on the way here).
  const [yachtOptions, setYachtOptions] = useState([]);

  useEffect(() => {
    let active = true;
    fetch("/api/fleet")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active) return;
        const list = Array.isArray(d?.yachts) ? d.yachts : [];
        setYachtOptions(
          list.map((y) => ({ value: y.slug || y.name, label: y.name })),
        );
        // Roberto 2026-05-02 — Pre-select a yacht when the visitor
        // arrived via the yacht detail page's "Submit an Inquiry"
        // button (URL shape: /inquiry?yacht=<slug>). Falls through
        // silently if the slug doesn't match anything in the fleet
        // (e.g. yacht just removed from Sanity).
        try {
          const sp = new URLSearchParams(window.location.search);
          const preselect = sp.get("yacht");
          if (preselect && list.some((y) => (y.slug || y.name) === preselect)) {
            setAnswers((a) => ({ ...a, yacht_of_interest: preselect }));
          }
        } catch {
          /* SSR or no URL — ignore */
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
            // Roberto 2026-05-02 — UX Batch 5
            yacht_of_interest: answers.yacht_of_interest || null,
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
    // Phase 6 / H3 (luxury rebuild) — generative editorial cover with
    // the visitor's name + chosen region. Server-rendered via /api/cover
    // (Next.js ImageResponse) so it costs nothing per visit and gets
    // cached at the edge for 24h.
    const regionMap = {
      cyclades: "Cyclades",
      ionian: "Ionian",
      saronic: "Saronic",
      mix: "Greek Waters",
    };
    const friendlyRegion = regionMap[answers.region] || "Greek Waters";
    const coverParams = new URLSearchParams({
      name: answers.name || "",
      destination: friendlyRegion,
      ...(answers.yacht_of_interest && answers.yacht_of_interest !== "flexible"
        ? { yacht: answers.yacht_of_interest }
        : {}),
    }).toString();
    const coverUrl = `/api/cover?${coverParams}`;

    return (
      <div style={wrap}>
        <div style={{ ...card, textAlign: "center" }}>
          <p style={eyebrow}>Inquiry received</p>
          <h1 style={{ ...question, marginBottom: 18 }}>Thank you.</h1>
          <p style={subtext}>
            George reads every brief personally. You'll hear back within 24 hours — usually much sooner.
          </p>

          {/* Generative editorial cover */}
          <figure
            style={{
              margin: "40px auto 0",
              maxWidth: 720,
              border: "1px solid rgba(201,168,76,0.32)",
              boxShadow: "0 24px 56px rgba(13, 27, 42,0.45)",
              background: "#0D1B2A",
              animation: "gy-cover-reveal 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* Using a plain <img> so the response loads instantly without
                Next/Image's loader pipeline — this is a one-shot render. */}
            <img
              src={coverUrl}
              alt={`Editorial cover for ${answers.name || "your"} ${friendlyRegion} brief`}
              style={{ display: "block", width: "100%", height: "auto" }}
              width={1200}
              height={630}
            />
            <figcaption
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
                padding: "14px 0",
              }}
            >
              Drafted just now · save it, share it, or wait for George
            </figcaption>
          </figure>

          <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
            <a href={coverUrl} download="george-yachts-cover.png" style={ctaPrimary}>
              Save the cover
            </a>
            <a
              href="https://wa.me/17867988798?text=Hi%20George%20%E2%80%94%20I%20just%20submitted%20an%20inquiry%20on%20the%20site."
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...ctaPrimary, background: "transparent", border: "1px solid rgba(201,168,76,0.55)", color: "#C9A84C" }}
            >
              Message on WhatsApp now
            </a>
          </div>

          <style jsx global>{`
            @keyframes gy-cover-reveal {
              0%   { opacity: 0; transform: translateY(16px) scale(0.97); }
              100% { opacity: 1; transform: translateY(0)    scale(1);    }
            }
          `}</style>
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
                        : "rgba(201,168,76,0.22)",
                    color:
                      answers[step.key] === opt.value ? GOLD : "#F8F5F0",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step.type === "yacht-choice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Native select — single tap on mobile, opens system
                  picker. We append a "flexible" sentinel so the step
                  never feels like a hard gate.
                  2026-05-12 — aria-label added so screen readers
                  announce the question for each field; without it the
                  unlabeled <select> reads as just 'combo box'. */}
              <select
                aria-label={step.label}
                value={answers[step.key] || ""}
                onChange={(e) => setValue(e.target.value)}
                style={{
                  ...textInput,
                  appearance: "none",
                  WebkitAppearance: "none",
                  background:
                    "linear-gradient(135deg, rgba(248, 245, 240,0.04), rgba(248, 245, 240,0.02))",
                  paddingRight: 36,
                  cursor: "pointer",
                }}
              >
                <option value="" disabled>
                  Pick one or "I'm flexible" below
                </option>
                <option value="flexible">
                  I'm flexible — show me what fits
                </option>
                {yachtOptions.length === 0 ? (
                  <option value="" disabled>
                    Loading the fleet…
                  </option>
                ) : (
                  yachtOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
              <p
                style={{
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 11,
                  letterSpacing: "0.05em",
                  color: "rgba(248, 245, 240,0.45)",
                  margin: "4px 2px 0",
                }}
              >
                {yachtOptions.length > 0
                  ? `${yachtOptions.length} yachts in our 2026 fleet — pick the one you've been thinking about, or stay flexible.`
                  : "Loading the fleet…"}
              </p>
            </div>
          )}

          {(step.type === "text" || step.type === "email" || step.type === "tel") && (
            <input
              ref={inputRef}
              type={step.type}
              aria-label={step.label}
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
              aria-label={step.label}
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
              aria-label={step.label}
              value={answers[step.key] || ""}
              onChange={(e) => setValue(e.target.value)}
              placeholder={step.placeholder}
              rows={4}
              style={{ ...textInput, resize: "vertical", minHeight: 120 }}
            />
          )}
        </div>

        {error && (
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "#ff9b9b", marginTop: 14 }}>
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
// Phase 27 (Forbes-launch eve, 2026-05-05) — 140px top padding wasted
// the entire above-the-fold on iPhone SE (375×667) — visitor saw ONLY
// black before the form even started. Use clamp so desktop keeps its
// breathing room while mobile lands the question card immediately.
const wrap = {
  minHeight: "100vh",
  background: "#0D1B2A",
  padding: "clamp(80px, 12vw, 140px) 24px 80px",
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
  background: "rgba(201,168,76,0.08)",
  zIndex: 39,
};
const progressFill = {
  height: "100%",
  background: `linear-gradient(90deg, ${GOLD}, #C9A84C)`,
  transition: "width 0.35s cubic-bezier(0.2,0.8,0.2,1)",
};
const card = {
  width: "100%",
  maxWidth: 640,
  padding: "36px 28px 30px",
  background: "#0D1B2A",
  border: "1px solid rgba(201,168,76,0.16)",
  animation: "fade-in 0.25s ease both",
};
const eyebrow = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 9,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  color: `${GOLD}cc`,
  marginBottom: 16,
  fontWeight: 600,
};
const question = {
  fontFamily: "var(--gy-font-editorial)",
  fontSize: "clamp(24px, 3.4vw, 36px)",
  fontWeight: 300,
  color: "#F8F5F0",
  lineHeight: 1.2,
  margin: 0,
  letterSpacing: "0.005em",
};
const subtext = {
  fontFamily: "var(--gy-font-editorial)",
  fontSize: 17,
  lineHeight: 1.6,
  color: "rgba(248, 245, 240,0.65)",
  fontWeight: 300,
  margin: 0,
};
// Phase 27 — fontSize MUST be ≥16px on inputs to prevent iOS Safari
// from auto-zooming when the field is focused. The previous Cormorant
// 18px worked numerically but Cormorant's x-height is small enough
// that iOS sometimes mis-measured and zoomed anyway. Switched to
// Montserrat 16px which is iOS-safe AND keeps the input legible
// without the keyboard pushing the form off-screen.
const textInput = {
  width: "100%",
  padding: "14px 16px",
  background: "#0D1B2A",
  border: "1px solid rgba(201,168,76,0.25)",
  color: "#F8F5F0",
  fontFamily: "var(--gy-font-ui)",
  fontSize: 16,
  fontWeight: 400,
  outline: "none",
  letterSpacing: "0.01em",
};
const choiceBtn = {
  padding: "14px 18px",
  background: "rgba(13, 27, 42, 0.5)",
  border: "1px solid rgba(201,168,76,0.22)",
  color: "#F8F5F0",
  fontFamily: "var(--gy-font-ui)",
  fontSize: 13,
  letterSpacing: "0.03em",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.25s ease",
};
const navBtn = {
  background: "none",
  border: "none",
  color: "rgba(248, 245, 240,0.5)",
  fontFamily: "var(--gy-font-ui)",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
};
const ctaPrimary = {
  display: "inline-block",
  padding: "14px 34px",
  background: `linear-gradient(90deg, #C9A84C, #C9A84C, #C9A84C)`,
  color: "#0D1B2A",
  fontFamily: "var(--gy-font-ui)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
};
