"use client";

import { useState } from "react";

export default function NewsletterSignupClient({ streams }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [selected, setSelected] = useState({ bridge: true });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const toggle = (key) =>
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));

  async function submit(e) {
    e.preventDefault();
    setError(null);

    const lists = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (lists.length === 0) {
      setError("Pick at least one journal to subscribe to.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("A valid email helps us send you anything at all.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lists, website }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.message || `Something failed (${res.status}). Try again.`);
        return;
      }
      setDone(true);
    } catch {
      setError("Network glitch. Try again, or email george@georgeyachts.com.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section
        style={{
          maxWidth: 620,
          margin: "0 auto",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
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
          You&rsquo;re on
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: 32,
            margin: "16px 0 12px 0",
            color: "#0D1B2A",
          }}
        >
          Welcome aboard.
        </h2>
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 1,
            background: "#C9A84C",
            margin: "12px auto 24px auto",
          }}
        />
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            lineHeight: 1.75,
            color: "rgba(13,27,42,0.78)",
            maxWidth: 520,
            margin: "0 auto 20px auto",
          }}
        >
          A welcome note is on its way to your inbox. The first proper issue
          will follow soon &mdash; quietly, no fuss. Reply any time; that goes
          to George directly.
        </p>
        <a
          href="https://georgeyachts.com/charter-yacht-greece"
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "12px 26px",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#0D1B2A",
            textDecoration: "none",
            border: "1px solid rgba(13,27,42,0.4)",
          }}
        >
          Browse the fleet
        </a>
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "48px 24px",
      }}
    >
      <form onSubmit={submit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {streams.map((s) => {
            const isOn = !!selected[s.key];
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => toggle(s.key)}
                aria-pressed={isOn}
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "20px 22px",
                  background: isOn ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.55)",
                  border: isOn
                    ? "1px solid #C9A84C"
                    : "1px solid rgba(13,27,42,0.12)",
                  borderRadius: 4,
                  position: "relative",
                  transition: "all 200ms ease",
                  fontFamily: "Georgia, serif",
                  color: "#0D1B2A",
                }}
              >
                {s.recommended && !isOn && (
                  <span
                    style={{
                      position: "absolute",
                      top: -10,
                      left: 18,
                      background: "#0D1B2A",
                      color: "#C9A84C",
                      padding: "3px 10px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                    }}
                  >
                    Most read
                  </span>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 4,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 400,
                      fontSize: 22,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {s.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 2,
                      border: "1px solid #C9A84C",
                      background: isOn ? "#C9A84C" : "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {isOn ? "✓" : ""}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#C9A84C",
                  }}
                >
                  {s.audience}
                </p>
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "rgba(13,27,42,0.82)",
                  }}
                >
                  {s.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(13,27,42,0.5)",
                  }}
                >
                  <span>{s.cadence}</span>
                  <span>{s.voice}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Honeypot — invisible to humans, bots fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{
            position: "absolute",
            left: -9999,
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          <label
            htmlFor="email"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(13,27,42,0.6)",
            }}
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            style={{
              padding: "14px 16px",
              fontSize: 16,
              fontFamily: "Georgia, serif",
              background: "#fff",
              color: "#0D1B2A",
              border: "1px solid rgba(13,27,42,0.2)",
              borderRadius: 2,
              outline: "none",
            }}
          />
          {error && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#A22",
                fontFamily: "Georgia, serif",
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
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
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.7 : 1,
              boxShadow:
                "0 10px 30px -10px rgba(218,165,32,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            {submitting ? "Subscribing…" : "Subscribe"}
          </button>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 11,
              lineHeight: 1.7,
              fontFamily: "'Montserrat', sans-serif",
              color: "rgba(13,27,42,0.5)",
              textAlign: "center",
            }}
          >
            By subscribing you agree to receive the journals you ticked above.
            Unsubscribe with one click any time. We never share your address.
          </p>
        </div>
      </form>
    </section>
  );
}
