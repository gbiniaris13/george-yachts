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
  // 2026-05-22 — Crew-list readiness includes the PRINCIPAL too.
  // crewListTotal = all non-opted-out members (principal + guests).
  // crewListReady = those who completed the five port-authority
  // essentials. The Send-to-George lock checks the same set, so
  // Step 02 has to surface the principal's own status — they were
  // invisible before, and a head charterer who hadn't filled
  // /cabin/me would hit a confusing "Send disabled" with no
  // visible reason.
  crewListTotal = 0,
  crewListReady = 0,
  // 2026-05-22 — Whether the brief has been formally sent to
  // George (cabins.brief_submitted_at IS NOT NULL). Filling all
  // sections to 100% is NOT the same as locking the brief — the
  // principal still has to press Send-to-George. The step-03
  // card distinguishes the two states.
  briefSubmitted = false,
}) {
  if (isPrincipal) {
    // Three quiet pieces for the head charterer:
    //   01 Invite your group   (cabin_members rows)
    //   02 Crew list           (per-member port-authority essentials)
    //   03 Charter Brief       (the preference brief itself)
    const step1 = deriveInviteStep({ invitedCount, completedCount });
    const step2 = deriveCrewListStep({
      crewListTotal,
      crewListReady,
      invitedCount,
      myDetailsComplete,
    });
    const step3 = deriveBriefStep({ briefPercent, briefSubmitted });
    return (
      <PreVoyageShell
        title="Three quiet pieces,"
        lede="Settle these in order, and your week begins to take shape. The captain has the harbour paperwork it needs. The chef stocks the galley. Then your brief writes the story."
        steps={[step1, step2, step3]}
      />
    );
  }

  // Guest view — their /cabin/me IS their crew-list entry. We
  // reframe the lone step in port-authority language so they
  // understand WHY DOB, gender, ID and mobile are not optional.
  const onlyStep = deriveGuestCrewListStep({ myDetailsComplete });
  return (
    <PreVoyageShell
      title="One quiet piece,"
      lede="Once your crew-list line is in, the harbour authorities have everything they need for you. The rest of The Cabin is here for you to explore at your pace."
      steps={[onlyStep]}
    />
  );
}

function PreVoyageShell({ title, lede, steps }) {
  return (
    <section className="cabin-pre-voyage" aria-label="Before you sail">
      <header className="cabin-pre-voyage__intro">
        <div className="cabin-pre-voyage__eyebrow">Before you sail</div>
        <h2 className="cabin-pre-voyage__title">
          {title} <em>in order.</em>
        </h2>
        <p className="cabin-pre-voyage__lede">{lede}</p>
      </header>

      {steps.map((s, i) => (
        <StepCard
          key={i}
          step={s}
          ordinal={i + 1}
          totalSteps={steps.length}
        />
      ))}

      {/* 2026-05-22 — Boutique deadline footnote. Seven days from
          the invite arriving (NOT seven days before the voyage —
          George's correction). Mirrored in the magic-link email
          so the message lands twice: first when the email arrives,
          again as a quiet reminder once the recipient steps inside. */}
      <p className="cabin-pre-voyage__deadline">
        We invite you to bring these to a quiet close within seven
        days of your invitation arriving — so the chef can stock,
        the cellar can be set, and every harbour quietly noted.
      </p>

      <style>{`
        .cabin-pre-voyage {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 24px;
        }
        .cabin-pre-voyage__deadline {
          margin: 6px 0 0 0;
          padding: 8px 0 8px 16px;
          border-left: 2px solid rgba(201, 168, 76, 0.55);
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.72);
          max-width: 60ch;
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
  // 2026-05-22 — Generalised n-of-m label. Previous version
  // hard-coded "First of two / Second of two" and broke once the
  // principal flow grew to 3 steps (the third card surfaced as
  // "Second of two" — meaningless).
  const WORD = ["", "one", "two", "three", "four", "five"];
  const totalWord = WORD[totalSteps] || String(totalSteps);
  const positionWord =
    ordinal === 1
      ? "First"
      : ordinal === 2
        ? "Second"
        : ordinal === 3
          ? "Third"
          : `#${ordinal}`;
  const ordinalLabel =
    totalSteps === 1 ? "The first step" : `${positionWord} of ${totalWord}`;

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

function deriveGuestCrewListStep({ myDetailsComplete }) {
  if (myDetailsComplete) {
    return {
      title: "Your crew-list line is in — thank you.",
      body:
        "The captain has what the marinas ask for. You can revisit your details anytime; share allergies or anything else for the chef whenever it feels right.",
      status: "Crew list ready",
      cta: "Edit my details",
      ctaHref: "/cabin/me",
      done: true,
    };
  }
  return {
    title: "Add your line to the crew list.",
    body:
      "Five quiet fields — date of birth, gender, nationality, ID or passport number, and mobile. The harbour authorities ask for these for every person aboard. Two minutes, and you're done.",
    status: "Not yet shared",
    cta: "Open my crew-list line",
    ctaHref: "/cabin/me",
    done: false,
  };
}

// 2026-05-22 — Principal's view of the GROUP's crew-list state.
// Drives the Step 02 card on /cabin home. Counts INCLUDE the
// principal — the Send-to-George gate requires every non-opted-out
// member (incl. principal) to have completed crew-list essentials,
// so the card has to surface the principal's own status.
//
// CTA priority:
//   1. If the principal's OWN line isn't in, link them to /cabin/me
//      first ("Add your own line"). This is the most common gap.
//   2. If they're in but guests aren't, link to /cabin/guests
//      ("See who's pending").
//   3. If everyone's in (or no guests yet + principal done),
//      surface a calm "review the crew list" CTA.
function deriveCrewListStep({
  crewListTotal,
  crewListReady,
  invitedCount,
  myDetailsComplete,
}) {
  // Edge: no group invited yet AND principal's own line not done.
  if (invitedCount === 0 && !myDetailsComplete) {
    return {
      title: "Add your own line to the crew list.",
      body:
        "Five quiet fields — date of birth, gender, nationality, ID or passport, mobile. Your own first, then your guests as you invite them.",
      status: "Not yet shared",
      cta: "Open my crew-list line",
      ctaHref: "/cabin/me",
      done: false,
    };
  }
  // Edge: no group invited yet, but principal's line is in.
  if (invitedCount === 0 && myDetailsComplete) {
    return {
      title: "Your line is in — invite your group when you're ready.",
      body:
        "Each guest will be asked for the same five fields. The brief locks only when everyone is in (or has formally stepped aside).",
      status: "Yours is in · 1 of 1",
      cta: "Invite your group",
      ctaHref: "/cabin/guests",
      done: true,
    };
  }

  const allDone =
    crewListReady >= crewListTotal && crewListTotal > 0;
  if (allDone) {
    return {
      title: "Your whole group's crew list is in.",
      body:
        "Every line — yours and every guest's — is with us. The captain has the harbour paperwork. Whenever you're ready, the brief can be locked.",
      status: `All ${crewListTotal} aboard`,
      cta: "Review the crew list",
      ctaHref: "/cabin/guests",
      done: true,
    };
  }
  // Mid-state: some still pending. Surface principal's own status
  // first if they're the one missing.
  if (!myDetailsComplete) {
    return {
      title: `Start with your own line — ${crewListReady} of ${crewListTotal} are in.`,
      body:
        "Your guests will follow once you've shown them the way. Five quiet fields — date of birth, gender, nationality, ID or passport, mobile.",
      status: `${crewListReady} of ${crewListTotal} ready`,
      cta: "Add my line",
      ctaHref: "/cabin/me",
      done: false,
      progressPercent:
        crewListTotal > 0
          ? Math.round((crewListReady / crewListTotal) * 100)
          : 0,
    };
  }
  return {
    title: `${crewListReady} of ${crewListTotal} crew-list lines are in.`,
    body:
      "Your line is in. The rest can fill their five fields whenever it suits them; you can resend a quiet reminder from your group page. The brief stays editable until everyone's in.",
    status: `${crewListReady} of ${crewListTotal} ready`,
    cta: "See who's pending",
    ctaHref: "/cabin/guests",
    done: false,
    progressPercent:
      crewListTotal > 0
        ? Math.round((crewListReady / crewListTotal) * 100)
        : 0,
  };
}

function deriveBriefStep({ briefPercent, briefSubmitted }) {
  const pct = Number.isFinite(briefPercent) ? briefPercent : 0;
  // 2026-05-22 — Distinguish "100% filled but not yet sent" from
  // "submitted". Both used to show "Brief delivered" which was a
  // lie if Send-to-George hadn't been pressed.
  if (briefSubmitted) {
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
  if (pct >= 100) {
    return {
      title: "Your brief is ready to send.",
      body:
        "Every section is filled. When your group's crew list is in too, you can send the whole thing to George from the review screen.",
      status: "Ready to review & send",
      cta: "Review & send",
      ctaHref: "/cabin/brief/review",
      done: false,
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
