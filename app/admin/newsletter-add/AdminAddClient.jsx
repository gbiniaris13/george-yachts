"use client";

import { useEffect, useState } from "react";

const STREAMS = [
  { key: "bridge", label: "The Bridge — UHNW client" },
  { key: "wake", label: "The Wake — travel advisors" },
  { key: "compass", label: "The Compass — broker peers" },
  { key: "greece", label: "Από την Ελλάδα — Greek personal" },
];

export default function AdminAddClient() {
  const [secret, setSecret] = useState("");
  const [stream, setStream] = useState("bridge");
  const [raw, setRaw] = useState("");
  const [sendWelcome, setSendWelcome] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Persist the secret per-session so reloads don't ask again.
  useEffect(() => {
    const s = sessionStorage.getItem("nl_admin_secret");
    if (s) setSecret(s);
  }, []);
  useEffect(() => {
    if (secret) sessionStorage.setItem("nl_admin_secret", secret);
  }, [secret]);

  function tokenise(text) {
    return Array.from(
      new Set(
        String(text || "")
          .split(/[,\s;\n\r]+/)
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s && s.includes("@")),
      ),
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const emails = tokenise(raw);
    if (emails.length === 0) {
      setError("Paste at least one email.");
      return;
    }
    if (!secret) {
      setError("Admin key required.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/newsletter-add-subscribers?key=${encodeURIComponent(secret)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stream,
            emails,
            source: "admin_ui",
            send_welcome: sendWelcome,
          }),
        },
      );
      const j = await res.json();
      if (!res.ok) {
        setError(j?.error || `request failed (${res.status})`);
      } else {
        setResult(j);
        if (j.added > 0) setRaw("");
      }
    } catch (e) {
      setError(e?.message || "network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8F5F0",
        color: "#0D1B2A",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: "0.45em",
            color: "#C9A84C",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          George Yachts · admin
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: 40,
            margin: "12px 0 6px 0",
          }}
        >
          Add subscribers
        </h1>
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 1,
            background: "#C9A84C",
            margin: "12px 0 28px 0",
          }}
        />

        <form onSubmit={submit}>
          <label
            style={{
              display: "block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(13,27,42,0.6)",
              marginBottom: 6,
            }}
          >
            Admin key
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="NEWSLETTER_UNSUB_SECRET or CRON_SECRET"
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 14,
              fontFamily: "Menlo, ui-monospace, monospace",
              background: "#fff",
              border: "1px solid rgba(13,27,42,0.2)",
              borderRadius: 2,
              outline: "none",
              marginBottom: 22,
            }}
          />

          <label
            style={{
              display: "block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(13,27,42,0.6)",
              marginBottom: 6,
            }}
          >
            Stream
          </label>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 14,
              fontFamily: "Georgia, serif",
              background: "#fff",
              border: "1px solid rgba(13,27,42,0.2)",
              borderRadius: 2,
              marginBottom: 22,
            }}
          >
            {STREAMS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(13,27,42,0.6)",
              marginBottom: 6,
            }}
          >
            Emails (one per line, commas, or spaces — anything goes)
          </label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            placeholder={"hitesh@example.com\nfounder@partner.io\nmaria@ihg.com\nor paste a comma-separated dump…"}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 14,
              fontFamily: "Menlo, ui-monospace, monospace",
              lineHeight: 1.6,
              background: "#fff",
              border: "1px solid rgba(13,27,42,0.2)",
              borderRadius: 2,
              outline: "none",
              marginBottom: 14,
              resize: "vertical",
            }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "Georgia, serif",
              fontSize: 14,
              color: "rgba(13,27,42,0.78)",
              marginBottom: 22,
            }}
          >
            <input
              type="checkbox"
              checked={sendWelcome}
              onChange={(e) => setSendWelcome(e.target.checked)}
              style={{ accentColor: "#C9A84C" }}
            />
            Send Issue #1 immediately to each newly-added Bridge
            subscriber (auto-welcome)
          </label>

          <button
            type="submit"
            disabled={busy || !secret || !raw.trim()}
            style={{
              padding: "14px 22px",
              background:
                "linear-gradient(135deg, #E6C77A 0%, #C9A24D 50%, #A67C2E 100%)",
              color: "#0D1B2A",
              border: "1px solid rgba(218,165,32,0.6)",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 600,
              cursor: busy ? "default" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "Adding…" : `Add to ${stream}`}
          </button>
        </form>

        {error && (
          <p
            style={{
              marginTop: 24,
              padding: "12px 16px",
              border: "1px solid rgba(220,30,30,0.3)",
              background: "rgba(220,30,30,0.05)",
              fontFamily: "Georgia, serif",
              fontSize: 14,
              color: "#A22",
            }}
          >
            {error}
          </p>
        )}

        {result && (
          <div
            style={{
              marginTop: 24,
              padding: "20px",
              border: "1px solid rgba(13,27,42,0.15)",
              background: "rgba(255,255,255,0.6)",
              fontFamily: "Georgia, serif",
            }}
          >
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: 10,
              }}
            >
              Result
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.7 }}>
              <strong>{result.added}</strong> added · {" "}
              <strong>{result.already_on_list}</strong> already on list
              {" "}· received <strong>{result.received}</strong>
              {result.suppressed?.length ? (
                <>
                  {" "}· <span style={{ color: "#A22" }}>{result.suppressed.length} suppressed (skipped)</span>
                </>
              ) : null}
              {result.rejected?.length ? (
                <>
                  {" "}· <span style={{ color: "#A22" }}>{result.rejected.length} rejected</span>
                </>
              ) : null}
              {result.welcome_sends ? (
                <>
                  <br />
                  <strong>{result.welcome_sends}</strong> welcome emails fired.
                </>
              ) : null}
            </div>

            {result.rejected?.length > 0 && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ cursor: "pointer", fontSize: 13 }}>
                  Show rejected
                </summary>
                <ul style={{ marginTop: 8, fontSize: 13 }}>
                  {result.rejected.map((r) => (
                    <li key={r.email}>
                      <code>{r.email}</code> — {r.reason}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <p
          style={{
            marginTop: 36,
            fontSize: 12,
            color: "rgba(13,27,42,0.5)",
            lineHeight: 1.7,
          }}
        >
          Auto-dedups, drops obvious junk (test.invalid, malformed
          syntax), refuses to re-add anyone on the suppression list.
          Telegram pings George with a masked summary on every batch.
        </p>
      </div>
    </main>
  );
}
