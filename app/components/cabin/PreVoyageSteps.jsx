// app/components/cabin/PreVoyageSteps.jsx
// =============================================================
// 2026-05-22 — George's brief after the EFFIE STAR preview:
//
//   "Ο πελάτης πρέπει να καταλαβαίνει κατευθείαν […] το πιο
//    σημαντικό της καμπίνας είναι ότι πρέπει πρωτίστως να
//    καλεστούν όλοι του crew για να είναι μέσα στην καμπίνα και
//    δευτερευόντως να ξεκινήσουν την preference list που είναι
//    το brief. Αυτό όμως θέλω κατά κάποιο τρόπο να τους το
//    κάνουμε ότι είναι υποχρεωτικό χωρίς να τους πιέζουμε,
//    χωρίς να χρησιμοποιούμε λέξεις πιεστικές — μια διαδικασία
//    πριν το ταξίδι […] στο design και τη φιλοσοφία κειμένων
//    που παραπέμπει σε luxury boutique yacht brokerage."
//
// Lifts the previously separate "Your First Step" and "Your
// Second Step" blocks into a single unified section that sits
// at the very top of /cabin home, right after the welcome.
// Together they read as a calm two-step pre-voyage checklist
// — onboarding, not pressure.
//
// Editorial treatment:
//   • Section eyebrow: "BEFORE YOU SAIL"
//   • Italic title: "Two quiet pieces, in order."
//   • Lede: explains the WHY warmly (chef, captain, the week
//     shaping around these inputs) without ever using the
//     word "must" or "required".
//   • Two numbered cards in serif "01 / 02" magazine style.
//   • Each card carries a status line that quietly reflects
//     completion state (0 invited → 3 of 7 joined → all aboard;
//     not started → 40% so far → brief delivered).
//
// Role-aware:
//   • Principal sees both 01 (Invite group) + 02 (Brief).
//   • Guest sees only 01 (Share my details), no brief — the
//     brief is for the host. Layout collapses cleanly.
// =============================================================

import Link from "next/link";

export default function PreVoyageSteps({
  isPrincipal,
  invitedCount,
  completedCount,
  myDetailsComplete,
  briefPercent,
}) {
  // Step 1 — Invite group (principal) OR Share details (guest)
  const step1 = isPrincipal
    ? deriveInviteStep({ invitedCount, completedCount })
    : deriveShareDetailsStep({ myDetailsComplete });

  // Step 2 — Charter brief (principal only)
  const step2 = isPrincipal
    ? deriveBriefStep({ briefPercent })
    : null;

  return (
    <section className="cabin-pre-voyage" aria-label="Before you sail">
      <header className="cabin-pre-voyage__intro">
        <div className="cabin-pre-voyage__eyebrow">Before you sail</div>
        <h2 className="cabin-pre-voyage__title">
          {step2 ? "Two quiet pieces," : "One quiet piece,"}{" "}
          <em>in order.</em>
        </h2>
        <p className="cabin-pre-voyage__lede">
          {step2
            ? "Settle these two, and your week begins to take shape. The chef stocks the galley around them. The captain plans coves around them. The rest of The Cabin is here for you to explore at your pace."
            : "Once this is with us, the captain and the chef have what they need to look after you well. The rest of The Cabin is here for you to explore at your pace."}
        </p>
      </header>

      <StepCard step={step1} ordinal={1} totalSteps={step2 ? 2 : 1} />
      {step2 && (
        <StepCard step={step2} ordinal={2} totalSteps={2} />
      )}

      <style>{`
        .cabin-pre-voyage {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 24px;
        }
        .cabin-pre-voyage__intro {
          padding: 4px 4px 6px;
        }
        .cabin-pre-voyage__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #1f2937;
          font-weight: 600;
        }
        .cabin-pre-voyage__title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 30px;
          line-height: 1.15;
          margin: 10px 0 14px 0;
          color: var(--gy-navy);
          letter-spacing: -0.3px;
        }
        .cabin-pre-voyage__title em {
          font-style: italic;
          color: var(--gy-gold);
        }
        @media (min-width: 640px) {
          .cabin-pre-voyage__title { font-size: 38px; }
        }
        .cabin-pre-voyage__lede {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(13, 27, 42, 0.7);
          margin: 0;
          max-width: 60ch;
        }
      `}</style>
    </section>
  );
}

// -------------------------------------------------------------
// StepCard — numbered magazine-style card, one per step.
// -------------------------------------------------------------
function StepCard({ step, ordinal, totalSteps }) {
  const numberStr = String(ordinal).padStart(2, "0");
  const ordinalLabel =
    totalSteps === 1
      ? "The first step"
      : ordinal === 1
        ? "First of two"
        : "Second of two";

  return (
    <article className={`cabin-pv-step ${step.done ? "is-done" : ""}`}>
      <div className="cabin-pv-step__number" aria-hidden>
        {numberStr}
      </div>
      <div className="cabin-pv-step__body">
        <div className="cabin-pv-step__ordinal">{ordinalLabel}</div>
        <h3 className="cabin-pv-step__title">{step.title}</h3>
        <p className="cabin-pv-step__body-text">{step.body}</p>

        {step.progressPercent != null && step.progressPercent > 0 && (
          <div
            className="cabin-pv-step__progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={step.progressPercent}
            aria-label={`${step.progressPercent}% complete`}
          >
            <div
              className="cabin-pv-step__progress-fill"
              style={{ width: `${Math.min(100, step.progressPercent)}%` }}
            />
          </div>
        )}

        <div className="cabin-pv-step__footer">
          <span className="cabin-pv-step__status">
            {step.done && (
              <span className="cabin-pv-step__check" aria-hidden>
                ✓
              </span>
            )}
            {step.status}
          </span>
          <Link href={step.ctaHref} className="cabin-pv-step__cta">
            {step.cta}
            <span aria-hidden> ›</span>
          </Link>
        </div>
      </div>

      <style>{`
        .cabin-pv-step {
          display: grid;
          grid-template-columns: 96px 1fr;
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.10);
          border-left: 3px solid var(--gy-gold);
          padding: 28px 28px 26px 24px;
          gap: 22px;
        }
        .cabin-pv-step.is-done {
          border-left-color: rgba(13, 27, 42, 0.25);
          background: rgba(13, 27, 42, 0.02);
        }
        @media (max-width: 540px) {
          .cabin-pv-step {
            grid-template-columns: 1fr;
            padding: 22px 22px 22px 20px;
            gap: 10px;
          }
        }
        .cabin-pv-step__number {
          font-family: var(--gy-font-editorial);
          font-size: 64px;
          font-weight: 300;
          line-height: 1;
          color: var(--gy-gold);
          letter-spacing: -1px;
        }
        .cabin-pv-step.is-done .cabin-pv-step__number {
          color: rgba(13, 27, 42, 0.3);
        }
        @media (max-width: 540px) {
          .cabin-pv-step__number {
            font-size: 38px;
          }
        }
        .cabin-pv-step__body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }
        .cabin-pv-step__ordinal {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          font-weight: 600;
        }
        .cabin-pv-step__title {
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 22px;
          line-height: 1.25;
          margin: 0;
          color: var(--gy-navy);
          letter-spacing: -0.2px;
        }
        @media (min-width: 640px) {
          .cabin-pv-step__title { font-size: 26px; }
        }
        .cabin-pv-step__body-text {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.7);
          margin: 4px 0 0 0;
        }
        .cabin-pv-step__progress {
          height: 3px;
          background: rgba(13, 27, 42, 0.08);
          margin: 6px 0 2px;
          overflow: hidden;
        }
        .cabin-pv-step__progress-fill {
          height: 100%;
          background: var(--gy-gold);
          transition: width 320ms ease;
        }
        .cabin-pv-step__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .cabin-pv-step__status {
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.6);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .cabin-pv-step.is-done .cabin-pv-step__status {
          color: rgba(13, 27, 42, 0.45);
        }
        .cabin-pv-step__check {
          display: inline-flex;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gy-gold);
          color: var(--gy-navy);
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        .cabin-pv-step__cta {
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 2.8px;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--gy-ivory);
          background: var(--gy-navy);
          padding: 11px 18px 12px;
          text-decoration: none;
          border: 1px solid var(--gy-gold);
          transition: background 160ms ease, color 160ms ease;
          white-space: nowrap;
        }
        .cabin-pv-step__cta:hover,
        .cabin-pv-step__cta:focus-visible {
          background: var(--gy-gold);
          color: var(--gy-navy);
          outline: none;
        }
        .cabin-pv-step.is-done .cabin-pv-step__cta {
          background: transparent;
          color: var(--gy-navy);
          border-color: rgba(13, 27, 42, 0.2);
        }
      `}</style>
    </article>
  );
}

// -------------------------------------------------------------
// Per-step state derivation. Returns { title, body, status, cta,
// ctaHref, done, progressPercent? }
// -------------------------------------------------------------
function deriveInviteStep({ invitedCount, completedCount }) {
  if (invitedCount === 0) {
    return {
      title: "Invite the people sailing with you.",
      body:
        "Paste their email addresses — each guest gets their own quiet sign-in to share allergies, swimming, anything the captain and chef should know. Five minutes from each, on their own time.",
      status: "0 invited",
      cta: "Invite your group",
      ctaHref: "/cabin/guests",
      done: false,
    };
  }
  const allDone = completedCount >= invitedCount && invitedCount > 0;
  if (allDone) {
    return {
      title: "Your whole group is aboard — beautifully done.",
      body:
        "Every guest has shared their details. The captain and the chef have what they need to look after each of you personally.",
      status: `All ${invitedCount} aboard`,
      cta: "Manage your group",
      ctaHref: "/cabin/guests",
      done: true,
    };
  }
  return {
    title: `${completedCount} of ${invitedCount} have shared their details.`,
    body:
      "We quietly nudge anyone who hasn't yet. You can resend invites anytime from the group page.",
    status: `${completedCount} of ${invitedCount} ready`,
    cta: "Manage your group",
    ctaHref: "/cabin/guests",
    done: false,
  };
}

function deriveShareDetailsStep({ myDetailsComplete }) {
  if (myDetailsComplete) {
    return {
      title: "Thank you — the captain has what he needs.",
      body:
        "You can edit any of it from your details page below, anytime — and browse the rest of your Cabin at your pace.",
      status: "Your details are in",
      cta: "Edit my details",
      ctaHref: "/cabin/me",
      done: true,
    };
  }
  return {
    title: "Share a few quiet details about you.",
    body:
      "Date of birth, any allergies, swimming comfort — that's really all we ask. Two minutes, and the chef and captain can look after you personally.",
    status: "Not yet shared",
    cta: "Share my details",
    ctaHref: "/cabin/me",
    done: false,
  };
}

function deriveBriefStep({ briefPercent }) {
  const pct = Number.isFinite(briefPercent) ? briefPercent : 0;
  if (pct >= 100) {
    return {
      title: "Your brief is with us — thank you.",
      body:
        "The captain, the chef, the hostess and George have all read it. You can revisit any section anytime — last-minute additions are always welcome.",
      status: "Brief delivered",
      cta: "Revisit the brief",
      ctaHref: "/cabin/brief",
      done: true,
      progressPercent: 100,
    };
  }
  if (pct > 0) {
    return {
      title: `${pct}% of the brief is yours so far.`,
      body:
        "Take your time across as many sittings as you want. The captain and the chef read every line — it shapes how the boat is stocked, which coves we choose, the small touches that turn a week into yours.",
      status: `${pct}% so far`,
      cta: "Continue the brief",
      ctaHref: "/cabin/brief",
      done: false,
      progressPercent: pct,
    };
  }
  return {
    title: "Tell us about your week — in your own words.",
    body:
      "This is the heart of preparing your charter. The captain and the chef read it. Your hostess reads it. I read it. It shapes how the boat is stocked, which coves we choose, the small touches that turn a week into yours. Half an hour, across as many sittings as you want.",
    status: "Not started",
    cta: "Start the brief",
    ctaHref: "/cabin/brief",
    done: false,
  };
}
