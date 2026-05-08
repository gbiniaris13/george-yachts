"use client";

// Phase 5 / H1 (Boss luxury rebuild brief, 2026-05-05) —
// Live AI itinerary preview component.
//
// CRITICAL: this is a TEXTURE TOOL, not a proposal generator. It
// shows the visitor what the prose of a typical Greek week reads
// like. The actual proposal always comes from a human broker via
// /inquiry. The component's CTA at the end of the streamed preview
// links straight to the /inquiry brief flow.
//
// UX:
//   • Four compact dropdowns (When / Who / Where) + one one-word
//     vibe input.
//   • Click "Generate preview" → streaming GET to /api/itinerary-preview
//     → tokens type out into the preview panel character-by-character.
//   • Final italic line is rendered specially (gold, slightly larger).
//   • Below the preview: "This is a sample. Your actual week is
//     written by George" + "Brief George →" CTA.
//
// Free-tier compliance: rate-limited via the route handler. Falls
// back to a static editorial preview when AI keys aren't configured
// — guests still see the wow effect.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const WHEN_OPTIONS = [
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "early July", label: "Early July" },
  { value: "late July / August", label: "Late July / August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
];

const WHO_OPTIONS = [
  { value: "two adults", label: "Two adults" },
  { value: "a family of four (two children)", label: "Family of four (children)" },
  { value: "a family of six", label: "Family of six" },
  { value: "a group of close friends", label: "A group of close friends" },
  { value: "a corporate retreat of eight", label: "Corporate retreat" },
  { value: "an extended multigenerational family", label: "Multi-generational family" },
];

const WHERE_OPTIONS = [
  { value: "Cyclades — Mykonos, Folegandros, Milos, Sifnos", label: "Cyclades" },
  { value: "Saronic — Hydra, Spetses, Aegina", label: "Saronic" },
  { value: "Sporades — Skiathos, Skopelos, Alonissos", label: "Sporades" },
  { value: "Dodecanese — Symi, Lipsi, Patmos", label: "Dodecanese" },
  { value: "Ionian — Lefkada, Kefalonia, Ithaca", label: "Ionian" },
  { value: "a mix of Cyclades and Saronic", label: "Cyclades + Saronic" },
];

export default function ItineraryPreview() {
  const [form, setForm] = useState({
    when: WHEN_OPTIONS[1].value,
    who: WHO_OPTIONS[0].value,
    where: WHERE_OPTIONS[0].value,
    vibe: "quiet, scenic, unhurried",
  });
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const onGenerate = async () => {
    if (streaming) {
      // Abort current stream.
      abortRef.current?.abort();
      setStreaming(false);
      return;
    }
    setOutput("");
    setError("");
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/itinerary-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      if (!res.ok) {
        if (res.status === 429) {
          setError(
            "We've sent a lot of previews this hour — write George directly for your own."
          );
        } else {
          setError("Preview unavailable right now. Brief George directly.");
        }
        setStreaming(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          try {
            const parsed = JSON.parse(payload);
            if (parsed?.delta) {
              setOutput((prev) => prev + parsed.delta);
            }
            if (parsed?.done) {
              setStreaming(false);
            }
          } catch {}
        }
      }
    } catch (e) {
      if (e?.name !== "AbortError") {
        setError("Connection lost — brief George directly.");
      }
    } finally {
      setStreaming(false);
    }
  };

  // Cleanup if unmounted mid-stream.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Split the output into the closing italic line vs the rest, so we
  // can render the broker-signature line in a distinct gold treatment.
  const closingLineMatch = output.match(/(\*[^*]+broker[^*]+rest[^*]*\*)/i);
  const body = closingLineMatch
    ? output.slice(0, closingLineMatch.index).trim()
    : output;
  const closing = closingLineMatch?.[0]?.replace(/\*/g, "").trim();

  return (
    <section
      aria-label="AI itinerary preview"
      style={{
        background: "linear-gradient(180deg, #0D1B2A 0%, #0D1B2A 100%)",
        padding: "clamp(72px, 10vw, 140px) clamp(24px, 5vw, 64px)",
        borderTop: "1px solid rgba(201,168,76,0.12)",
        borderBottom: "1px solid rgba(201,168,76,0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p className="gy-eyebrow" style={{ color: "#C9A84C", marginBottom: 14 }}>
          Live preview · Texture only
        </p>
        <h2
          className="gy-display-md"
          style={{ margin: "10px 0 18px", maxWidth: "20ch" }}
        >
          What a week here actually reads&nbsp;like.
        </h2>
        <p
          className="gy-lede"
          style={{
            color: "rgba(248,245,240,0.75)",
            marginBottom: 40,
            maxWidth: "62ch",
          }}
        >
          A 60-second taste of the prose a broker drafts for guests like you.
          This is a sample. The real proposal — three yachts, real availability,
          real prices — comes from George within twenty-four hours of your brief.
        </p>

        {/* The form — compact horizontal row on desktop, stacked on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <SelectField label="When" value={form.when} options={WHEN_OPTIONS} onChange={onChange("when")} />
          <SelectField label="Who" value={form.who} options={WHO_OPTIONS} onChange={onChange("who")} />
          <SelectField label="Where" value={form.where} options={WHERE_OPTIONS} onChange={onChange("where")} />
          <TextField
            label="Vibe"
            value={form.vibe}
            onChange={onChange("vibe")}
            placeholder="quiet, scenic, unhurried"
          />
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onGenerate}
            data-cursor={streaming ? "Stop" : "Generate"}
            className="gy-shimmer-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 32px",
              minHeight: 52,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: streaming ? "#F8F5F0" : "#0D1B2A",
              background: streaming
                ? "rgba(0,0,0,0.7)"
                : "linear-gradient(135deg, #C9A84C 0%, #C9A84C 100%)",
              border: streaming ? "1px solid #C9A84C" : "1px solid #C9A84C",
              boxShadow: streaming
                ? "none"
                : "0 12px 32px rgba(201,168,76,0.22)",
              cursor: "pointer",
              transition: "all 0.32s ease",
            }}
          >
            <span>{streaming ? "Stop preview" : "Generate preview"}</span>
            <span aria-hidden="true">{streaming ? "■" : "→"}</span>
          </button>
          {error && (
            <span
              style={{
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 13,
                color: "rgba(255,180,180,0.85)",
                fontStyle: "italic",
              }}
            >
              {error}
            </span>
          )}
        </div>

        {/* The streamed preview panel */}
        {(output || streaming) && (
          <div
            style={{
              marginTop: 36,
              padding: "clamp(28px, 4vw, 48px)",
              background: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(201,168,76,0.32)",
              boxShadow: "0 24px 56px rgba(0,0,0,0.45)",
              minHeight: 280,
              position: "relative",
              animation: "gy-fade-in 0.4s ease",
            }}
          >
            <p
              className="gy-eyebrow-sm"
              style={{ color: "rgba(201,168,76,0.65)", marginBottom: 16 }}
            >
              {streaming ? "George is dictating…" : "Sample preview"}
            </p>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(16px, 1.5vw, 19px)",
                lineHeight: 1.7,
                color: "rgba(248,245,240,0.92)",
                fontWeight: 300,
                whiteSpace: "pre-wrap",
                letterSpacing: "0.005em",
              }}
            >
              {body || (streaming && <span style={{ opacity: 0.5 }}>…</span>)}
              {streaming && (
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: "1em",
                    background: "#C9A84C",
                    marginLeft: 4,
                    verticalAlign: "text-bottom",
                    animation: "gy-cursor-blink 0.9s ease-in-out infinite",
                  }}
                />
              )}
            </div>
            {closing && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 1.7vw, 22px)",
                  color: "#C9A84C",
                  margin: "32px 0 0",
                  paddingTop: 24,
                  borderTop: "1px solid rgba(201,168,76,0.35)",
                  fontWeight: 300,
                  letterSpacing: "0.005em",
                }}
              >
                {closing}
              </p>
            )}

            {!streaming && output && (
              <div
                style={{
                  marginTop: 32,
                  paddingTop: 20,
                  borderTop: "1px solid rgba(248,245,240,0.08)",
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  href="/inquiry"
                  className="gy-link-editorial"
                  data-cursor="Brief"
                >
                  Brief George for the real proposal →
                </Link>
                <button
                  type="button"
                  onClick={() => setOutput("")}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "rgba(248,245,240,0.45)",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Try another
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes gy-cursor-blink {
          0%, 50%  { opacity: 1; }
          51%, 100%{ opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        className="gy-eyebrow-sm"
        style={{ color: "rgba(248,245,240,0.55)", letterSpacing: "0.32em" }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        style={{
          padding: "12px 14px",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(201,168,76,0.25)",
          color: "#F8F5F0",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 13,
          letterSpacing: "0.02em",
          cursor: "pointer",
          appearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5' fill='%23C9A84C'><polygon points='0,0 8,0 4,5'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          backgroundSize: "8px 5px",
          paddingRight: 36,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#0D1B2A", color: "#F8F5F0" }}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        className="gy-eyebrow-sm"
        style={{ color: "rgba(248,245,240,0.55)", letterSpacing: "0.32em" }}
      >
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={80}
        style={{
          padding: "12px 14px",
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(201,168,76,0.25)",
          color: "#F8F5F0",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 16,
          letterSpacing: "0.02em",
        }}
      />
    </label>
  );
}
