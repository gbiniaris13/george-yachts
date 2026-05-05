"use client";

// Q.1 (Roberto brief, May 2026) — Smart Proposal Generator.
//
// Multi-yacht checkbox UI (up to 5), sticky bottom action bar, form
// modal (name + email + dates + notes), POST /api/proposal-generate
// which returns a PDF data URL + sends the same PDF to the user's
// email with George BCC'd. Telegram fires server-side.
//
// Replaces the previous single-yacht hot-lead flow. The lead-gate is
// folded into the form modal — submitting the form is itself the
// gate signal.

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { sanityCardImg } from "@/lib/sanity-image";
import { priceUnitBadge, isPerPerson } from "@/lib/pricing";

const MAX_YACHTS = 5;
const GOLD = "#DAA520";

function gtagEvent(name, payload) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, payload || {});
    }
  } catch {}
}

export default function ProposalClient({ yachts = [] }) {
  const { t } = useI18n();
  const [picked, setPicked] = useState([]); // array of slugs in selection order
  const [region, setRegion] = useState("all");
  const [tier, setTier] = useState("all");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dates, setDates] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { dataUrl, filename, emailSent }

  const regions = useMemo(() => {
    const set = new Set();
    yachts.forEach((y) => {
      if (y.cruisingRegion) {
        // Bucket loose names into the canonical 4
        const r = String(y.cruisingRegion).toLowerCase();
        if (r.includes("cyclad")) set.add("Cyclades");
        else if (r.includes("ionian")) set.add("Ionian");
        else if (r.includes("saronic")) set.add("Saronic");
        else if (r.includes("dodecan")) set.add("Dodecanese");
        else if (r.includes("sporad")) set.add("Sporades");
      }
    });
    return ["all", ...Array.from(set).sort()];
  }, [yachts]);

  const filtered = useMemo(() => {
    return yachts.filter((y) => {
      if (tier !== "all" && y.fleetTier !== tier) return false;
      if (region !== "all") {
        const r = String(y.cruisingRegion || "").toLowerCase();
        if (region === "Cyclades" && !r.includes("cyclad")) return false;
        if (region === "Ionian" && !r.includes("ionian")) return false;
        if (region === "Saronic" && !r.includes("saronic")) return false;
        if (region === "Dodecanese" && !r.includes("dodecan")) return false;
        if (region === "Sporades" && !r.includes("sporad")) return false;
      }
      return true;
    });
  }, [yachts, region, tier]);

  function togglePick(slug) {
    setPicked((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_YACHTS) return prev;
      gtagEvent("proposal_yacht_picked", { yacht_slug: slug, count: prev.length + 1 });
      return [...prev, slug];
    });
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, submitting]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError("");
    if (!name.trim() || !email.includes("@")) {
      setError("Please enter your name and a valid email.");
      return;
    }
    if (picked.length === 0) {
      setError("Pick at least one yacht.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposal-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          dates: dates.trim(),
          notes: notes.trim(),
          yachtSlugs: picked,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Something went wrong. Please write to George at /inquiry.");
        setSubmitting(false);
        return;
      }
      setResult({
        dataUrl: json.dataUrl,
        filename: json.filename,
        emailSent: !!json.emailSent,
      });
      gtagEvent("proposal_generated", {
        yacht_count: picked.length,
        email_sent: !!json.emailSent,
      });
      setSubmitting(false);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  // ─── RENDER ───
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", paddingBottom: 120 }}>
      {/* HEADER */}
      <header style={{ padding: "120px 24px 40px", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: 9,
          letterSpacing: "0.42em", textTransform: "uppercase",
          color: GOLD, fontWeight: 600, margin: "0 0 18px",
        }}>
          Smart Proposal Generator
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 300,
          color: "#F8F5F0", margin: "0 0 18px",
          lineHeight: 0.98, letterSpacing: "-0.03em",
          textShadow: "0 6px 32px rgba(0,0,0,0.55)",
        }}>
          Pick up to 5 yachts. Get a magazine-grade PDF in your inbox.
        </h1>
        <p style={{
          fontFamily: "'Lato', 'Montserrat', sans-serif", fontSize: 16,
          lineHeight: 1.7, color: "rgba(255,255,255,0.7)",
          maxWidth: 640, margin: "0 auto",
        }}>
          Each page in the proposal is a real yacht from the live fleet — hero photo, specs, price, and
          George&rsquo;s insider note. Submit and you&rsquo;ll receive the PDF by email plus a written
          quote within the day.
        </p>
      </header>

      {/* FILTERS */}
      <div style={{
        display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
        padding: "0 24px 24px", maxWidth: 1100, margin: "0 auto",
      }}>
        <FilterGroup
          label="Region"
          options={regions.map((r) => ({ value: r, label: r === "all" ? "All regions" : r }))}
          value={region} onChange={setRegion}
        />
        <FilterGroup
          label="Fleet"
          options={[
            { value: "all", label: "Both fleets" },
            { value: "private", label: "Private (per yacht/wk)" },
            { value: "explorer", label: "Explorer (per person/wk)" },
          ]}
          value={tier} onChange={setTier}
        />
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16, padding: "8px 24px 40px",
        maxWidth: 1280, margin: "0 auto",
      }}>
        {filtered.map((y) => {
          const checked = picked.includes(y.slug);
          const disabled = !checked && picked.length >= MAX_YACHTS;
          return (
            <div
              key={y.slug}
              role="button"
              tabIndex={0}
              aria-pressed={checked}
              aria-disabled={disabled}
              onClick={() => !disabled && togglePick(y.slug)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !disabled) {
                  e.preventDefault();
                  togglePick(y.slug);
                }
              }}
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${checked ? GOLD : "rgba(255,255,255,0.08)"}`,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
                transition: "border-color 0.25s ease, opacity 0.25s ease",
                outline: "none",
              }}
              className="proposal-card"
            >
              <div style={{
                width: "100%", aspectRatio: "4 / 3",
                background: y.imageUrl
                  ? `#0a0a0a url(${sanityCardImg(y.imageUrl, 600)}) center/cover no-repeat`
                  : "#0a0a0a",
              }} aria-hidden={!y.imageUrl} />
              <div style={{ padding: "14px 16px 16px" }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 18, fontWeight: 400, color: "#fff", margin: "0 0 4px",
                }}>
                  {y.name}
                </p>
                {(y.length || y.sleeps) && (
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.55)", margin: "0 0 6px",
                  }}>
                    {[y.length, y.sleeps && `${y.sleeps} guests`].filter(Boolean).join(" · ")}
                  </p>
                )}
                {y.weeklyRatePrice && (
                  <p style={{
                    fontFamily: "'Montserrat', sans-serif", fontSize: 11,
                    color: GOLD, fontWeight: 600, margin: 0,
                  }}>
                    <span style={{ fontSize: 8, letterSpacing: "0.3em", color: isPerPerson(y) ? "rgba(255,255,255,0.6)" : GOLD, marginRight: 6 }}>
                      {priceUnitBadge(y)}
                    </span>
                    {y.weeklyRatePrice}
                  </p>
                )}
              </div>
              {/* checkmark */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute", top: 10, right: 10,
                  width: 28, height: 28, borderRadius: "50%",
                  background: checked ? GOLD : "rgba(0,0,0,0.55)",
                  border: `1px solid ${checked ? GOLD : "rgba(255,255,255,0.4)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: checked ? "#000000" : "transparent",
                  fontWeight: 700, fontSize: 14,
                  transition: "all 0.2s ease",
                }}
              >
                ✓
              </span>
            </div>
          );
        })}
      </div>

      {/* STICKY BOTTOM BAR */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.6), #000)",
        borderTop: `1px solid ${GOLD}55`,
        padding: "16px 24px",
        display: "flex", justifyContent: "center", gap: 12,
        alignItems: "center", flexWrap: "wrap",
        zIndex: 50,
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif", fontSize: 11,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
        }}>
          {picked.length === 0
            ? "Pick up to 5 yachts to start"
            : `${picked.length} of ${MAX_YACHTS} selected`}
        </span>
        <button
          type="button"
          disabled={picked.length === 0}
          onClick={() => {
            setOpen(true);
            gtagEvent("proposal_form_opened", { count: picked.length });
          }}
          style={{
            fontFamily: "'Montserrat', sans-serif", fontSize: 11,
            letterSpacing: "0.28em", textTransform: "uppercase",
            fontWeight: 700, padding: "12px 22px",
            background: picked.length === 0
              ? "rgba(218,165,32,0.25)"
              : `linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)`,
            color: picked.length === 0 ? "rgba(0,0,0,0.45)" : "#000000",
            border: "none",
            cursor: picked.length === 0 ? "default" : "pointer",
          }}
        >
          {picked.length === 0
            ? "Generate proposal →"
            : `Generate proposal (${picked.length}) →`}
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <div
          role="dialog" aria-modal="true" aria-label="Generate proposal"
          onClick={() => !submitting && setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 480, width: "100%", background: "#0a0a0a",
              border: `1px solid ${GOLD}66`, padding: "28px 28px 24px",
            }}
          >
            {!result ? (
              <>
                <p style={{
                  fontFamily: "'Montserrat', sans-serif", fontSize: 9,
                  letterSpacing: "0.42em", textTransform: "uppercase",
                  color: GOLD, fontWeight: 600, margin: "0 0 12px",
                }}>
                  Last step
                </p>
                <h3 style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 24, fontWeight: 400, color: "#fff",
                  margin: "0 0 6px", lineHeight: 1.2,
                }}>
                  Where should we send the PDF?
                </h3>
                <p style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif", fontSize: 13,
                  lineHeight: 1.6, color: "rgba(255,255,255,0.7)", margin: "0 0 18px",
                }}>
                  We&apos;ll generate the proposal, email it to you, and George will write back within the day with availability.
                </p>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input
                    type="text" placeholder="Your name" required
                    value={name} onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="email" placeholder="Your email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="text" placeholder="Dates (optional, e.g. 12–19 July)"
                    value={dates} onChange={(e) => setDates(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    placeholder="Anything George should know? (group size, vibe, special requests)"
                    value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                    style={{ ...inputStyle, fontFamily: "'Lato', 'Montserrat', sans-serif", resize: "vertical" }}
                  />
                  {error && (
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif", fontSize: 12,
                      color: "#ff8a8a", margin: 0,
                    }}>
                      {error}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button
                      type="submit" disabled={submitting}
                      style={{
                        flex: 1, padding: "12px 0",
                        fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "#000000",
                        background: submitting
                          ? `${GOLD}66`
                          : `linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)`,
                        border: "none", cursor: submitting ? "default" : "pointer",
                      }}
                    >
                      {submitting ? "Generating PDF…" : `Generate proposal (${picked.length})`}
                    </button>
                    <button
                      type="button" onClick={() => setOpen(false)} disabled={submitting}
                      style={{
                        padding: "12px 16px",
                        fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                        color: "rgba(255,255,255,0.5)",
                        background: "none",
                        border: "1px solid rgba(255,255,255,0.18)",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 30, fontWeight: 400, color: "#fff", margin: "0 0 10px",
                }}>
                  Done.
                </p>
                <p style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif", fontSize: 14,
                  lineHeight: 1.6, color: "rgba(255,255,255,0.78)", margin: "0 0 22px",
                }}>
                  {result.emailSent
                    ? `The PDF is on its way to ${email}. George will reach out within the day.`
                    : `Your PDF is ready below. (Email delivery wasn't available right now — George has been notified separately.)`}
                </p>
                <a
                  href={result.dataUrl} download={result.filename}
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                    fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase",
                    color: "#000000",
                    background: `linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)`,
                    textDecoration: "none",
                  }}
                >
                  Download PDF
                </a>
                <p style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null); setOpen(false);
                      setName(""); setEmail(""); setDates(""); setNotes("");
                      setPicked([]);
                    }}
                    style={{
                      fontFamily: "'Montserrat', sans-serif", fontSize: 9,
                      letterSpacing: "0.32em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      background: "none", border: "none", cursor: "pointer",
                    }}
                  >
                    Start a new proposal
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  fontFamily: "'Montserrat', sans-serif", fontSize: 13,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff", outline: "none",
};

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p style={{
        fontFamily: "'Montserrat', sans-serif", fontSize: 9,
        letterSpacing: "0.32em", textTransform: "uppercase",
        color: "rgba(255,255,255,0.5)", margin: "0 0 8px", textAlign: "center",
      }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value} type="button"
              onClick={() => onChange(o.value)}
              style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 10,
                letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
                padding: "8px 12px",
                background: active ? "rgba(218,165,32,0.16)" : "transparent",
                color: active ? GOLD : "rgba(255,255,255,0.55)",
                border: `1px solid ${active ? GOLD : "rgba(255,255,255,0.15)"}`,
                cursor: "pointer",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
