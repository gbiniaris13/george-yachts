"use client";

// app/components/cabin/LoginForm.jsx
// Magic link request form. Submits to /api/cabin/auth/request-link.
// Always shows the same success copy regardless of whether the
// email is registered (no account enumeration).
//
// 2026-05-23 — Eleanna friend-test: her phone went to sleep, when
// she came back she was on /cabin/login and had to retype her
// email from scratch. Tiny but real friction. Now: we remember
// the last email used (localStorage, NEVER transmitted to the
// server unless they hit Send) so re-auth is a single tap on
// "SEND MY SIGN-IN LINK". Magic links are valid for 90 days so
// almost every "kicked out" customer just taps once.

import { useEffect, useState } from "react";

const REMEMBERED_EMAIL_KEY = "gy_cabin_last_email";

export default function LoginForm({ initialError }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(initialError ?? null);

  // Pre-fill from localStorage on mount (client-only — no SSR
  // mismatch since initial render returns empty).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (saved && saved.includes("@")) setEmail(saved);
    } catch { /* localStorage blocked — silently skip */ }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please use a valid email address.");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      await fetch("/api/cabin/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      // Remember on successful submit only — don't cache typos.
      try {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, trimmed);
      } catch { /* ignore */ }
      setStatus("sent");
    } catch {
      setError("Something went wrong on our side. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="cabin-login-form cabin-login-form--sent" role="status">
        <h2>Check your inbox.</h2>
        <p>
          If <strong>{email}</strong> is on a Cabin, a sign-in link is
          on its way. It is valid for 24 hours. If you do not see it,
          please check your spam folder, or reply to George directly at
          <span>&nbsp;george@georgeyachts.com</span>.
        </p>
        <button
          type="button"
          className="cabin-login-form__retry"
          onClick={() => {
            setStatus("idle");
            setEmail("");
            setError(null);
          }}
        >
          Send to a different email
        </button>

        <style>{styles}</style>
      </div>
    );
  }

  return (
    <form className="cabin-login-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="cabin-email" className="cabin-login-form__label">
        Your email
      </label>
      <input
        id="cabin-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="cabin-login-form__input"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="cabin-login-form__submit"
      >
        {status === "sending" ? "Sending…" : "Send my sign-in link"}
      </button>
      {error && <p className="cabin-login-form__error">{error}</p>}
      <p className="cabin-login-form__hint">
        No password is needed. We will send a single-use link to your
        inbox.
      </p>

      <style>{styles}</style>
    </form>
  );
}

const styles = `
  .cabin-login-form {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cabin-login-form__label {
    font-family: var(--gy-font-ui);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gy-gold, #C9A84C);
    font-weight: 500;
    margin-bottom: 6px;
  }
  .cabin-login-form__input {
    background: transparent;
    border: 0;
    border-bottom: 1px solid rgba(248, 245, 240, 0.4);
    padding: 10px 4px 12px 4px;
    color: var(--gy-ivory);
    font-family: var(--gy-font-editorial);
    font-size: 18px;
    outline: none;
    transition: border-color 0.18s ease;
    -webkit-appearance: none;
    appearance: none;
  }
  .cabin-login-form__input:focus { border-bottom-color: var(--gy-gold); }
  .cabin-login-form__submit {
    margin-top: 24px;
    background: transparent;
    color: var(--gy-ivory);
    border: 1px solid var(--gy-gold);
    padding: 14px 22px;
    font-family: var(--gy-font-ui);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.18s ease, color 0.18s ease;
  }
  .cabin-login-form__submit:hover:not(:disabled) {
    background: var(--gy-gold);
    color: var(--gy-navy);
  }
  .cabin-login-form__submit:disabled { opacity: 0.55; cursor: wait; }
  .cabin-login-form__error {
    color: #E0BA77;
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 13px;
    margin: 12px 0 0 0;
  }
  .cabin-login-form__hint {
    color: rgba(248, 245, 240, 0.4);
    font-family: var(--gy-font-editorial);
    font-style: italic;
    font-size: 12px;
    margin: 18px 0 0 0;
  }

  .cabin-login-form--sent {
    text-align: center;
    max-width: 480px;
    color: var(--gy-ivory);
  }
  .cabin-login-form--sent h2 {
    font-family: var(--gy-font-editorial);
    font-weight: 300;
    font-size: 32px;
    margin: 0 0 16px 0;
    color: var(--gy-gold);
  }
  .cabin-login-form--sent p {
    font-family: var(--gy-font-body);
    line-height: 1.8;
    font-size: 14px;
    color: rgba(248, 245, 240, 0.75);
    margin: 0;
  }
  .cabin-login-form--sent p span { color: var(--gy-gold); }
  .cabin-login-form__retry {
    margin-top: 28px;
    background: transparent;
    color: rgba(248, 245, 240, 0.65);
    border: 1px solid rgba(248, 245, 240, 0.3);
    padding: 10px 18px;
    font-family: var(--gy-font-ui);
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    cursor: pointer;
  }
`;
