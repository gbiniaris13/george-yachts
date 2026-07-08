// app/(cabin)/cabin/login/page.jsx
// =============================================================
// /cabin/login — magic link request page.
//
// Server component for the outer shell; the form itself is a
// small client component so we can show submit feedback without
// a full route trip.
// =============================================================

import LoginForm from "../../../components/cabin/LoginForm";

export const metadata = {
  title: "Open your Cabin · George Yachts",
};

export default async function CabinLoginPage({ searchParams }) {
  // Next.js 15: searchParams is a Promise — must be awaited.
  const sp = (await searchParams) ?? {};
  const errorCode = typeof sp.e === "string" ? sp.e : null;

  let errorMessage = null;
  if (errorCode === "expired") {
    errorMessage =
      "That sign-in link has expired. We can send you a fresh one — it takes a moment.";
  } else if (errorCode === "unknown") {
    errorMessage =
      "We could not match this email to a Cabin. If you received an invitation from George, please reply to that email so we can sort it.";
  } else if (errorCode === "missing") {
    errorMessage =
      "That link looked incomplete. Please request a new one below.";
  }

  return (
    <div className="cabin-login">
      <header className="cabin-login__brand">
        <div className="cabin-login__eyebrow">George Yachts</div>
        <h1 className="cabin-login__title">
          The Cabin <em>· Filotimo</em>
        </h1>
        <div className="cabin-login__rule" aria-hidden />
        <p className="cabin-login__intro">
          Your private space at George Yachts. Enter the email you
          received your charter correspondence on, and we will send
          you a fresh sign-in link.
        </p>
      </header>

      <LoginForm initialError={errorMessage} />

      <footer className="cabin-login__footer">
        <p>
          Filotimo · Φιλότιμο — <span>doing the right thing because of who we are.</span>
        </p>
      </footer>

      <style>{`
        .cabin-login {
          min-height: 100dvh;
          background: var(--gy-navy, #0D1B2A);
          color: var(--gy-ivory, #F8F5F0);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px 22px 56px 22px;
          padding-top: calc(48px + env(safe-area-inset-top, 0));
          padding-bottom: calc(56px + env(safe-area-inset-bottom, 0));
          gap: 36px;
        }
        .cabin-login__brand {
          text-align: center;
          max-width: 420px;
        }
        .cabin-login__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 4px;
          color: var(--gy-gold, #C9A84C);
          text-transform: uppercase;
          font-weight: 500;
        }
        .cabin-login__title {
          margin: 14px 0 0 0;
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 44px;
          line-height: 1.05;
          letter-spacing: -0.5px;
        }
        .cabin-login__title em {
          color: var(--gy-gold);
          font-style: italic;
        }
        .cabin-login__rule {
          width: 72px;
          height: 1px;
          background: var(--gy-gold);
          opacity: 0.7;
          margin: 22px auto 22px;
        }
        .cabin-login__intro {
          font-family: var(--gy-font-body);
          font-size: 14px;
          line-height: 1.75;
          color: rgba(248,245,240,0.78);
          margin: 0;
        }
        .cabin-login__footer {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 12px;
          color: rgba(248, 245, 240, 0.4);
          text-align: center;
        }
        .cabin-login__footer span { color: rgba(248,245,240,0.6); }
      `}</style>
    </div>
  );
}
