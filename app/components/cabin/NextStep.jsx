// app/components/cabin/NextStep.jsx
// =============================================================
// 2026-05-24 — George friend test 4: "Πώς ανήγεις λογαριασμό
// σε μια τράπεζα και σου λέει βάλε το όνομά σου ... κάποως έτσι.
// Να τους πηγαίνει βήμα-βήμα."
//
// Wizard-style next-step banner at the TOP of /cabin home. For
// every member (principal + guest), inspects the cabin's state
// and shows ONE prominent "Do this next" card pointing at the
// first incomplete action for THIS member.
//
// Decision tree (top-down — first match wins):
//
//   IF guest (Brief 02, A4.2 + A5.3, 2026-05-26):
//     1. Crew list not done           → /cabin/me
//     2. Done                          → calm "you're set" state
//   (No brief / dining / beverages / life-aboard / confirm step
//    for guests anymore. Under the new single-responsibility
//    model the Main Charterer owns every decision; guests fill
//    ONLY their Crew List.)
//
//   IF principal:
//     1. Hasn't invited any guest      → /cabin/guests
//     2. Own crew list not done        → /cabin/me
//     3. Brief sections incomplete     → /cabin/brief
//     4. Own brief not confirmed       → /cabin/brief (confirm CTA)
//     5. Group still pending           → calm "waiting on N people"
//     6. Ready to ship                 → /cabin/brief/review (Send)
//
// Hidden when:
//   • brief_submitted_at is set (charter is shipped to George)
//
// Style: large boutique cream-and-gold card with a single
// prominent navy CTA. Sits ABOVE PreVoyageSteps so it's the
// first thing every member sees on cabin home. Brief 02 also
// suppresses the duplicate crew-list nag on PreVoyageSteps for
// guests so the prompt is shown exactly once.
// =============================================================

import Link from "next/link";

export default function NextStep({
  isPrincipal,
  briefSubmittedAt,
  // Guest-side signals
  myDetailsComplete,
  myBriefConfirmedAt,
  // Principal-side signals
  invitedCount,
  crewListReady,
  crewListTotal,
  briefSectionsAllComplete,
  groupFullyReady,
  pendingCrewListMembers,
  pendingBriefConfirmMembers,
}) {
  // Charter already shipped — nothing to do.
  if (briefSubmittedAt) return null;

  let step = null;

  if (!isPrincipal) {
    // ─────────────── GUEST PATH (Brief 02, A4.2 + A5.3) ───────────
    // Guests fill ONLY their Crew List under the new model. They do
    // NOT add brief picks, do NOT confirm anything, do NOT touch
    // dining/beverages/life-aboard. So there's exactly one prompt
    // followed by a calm done state.
    if (!myDetailsComplete) {
      step = {
        tone: "active",
        eyebrow: "Your part — one short form",
        title: "Share your crew-list line.",
        copy: "Six quiet fields — date of birth, gender, nationality, passport or ID, mobile, and a few details about yourself. The harbour authorities need them for every person aboard. Two minutes.",
        ctaLabel: "Open your details →",
        ctaHref: "/cabin/me",
      };
    } else {
      step = {
        tone: "done",
        eyebrow: "That's everything we need from you",
        title: "Your details are in — thank you.",
        copy: "The Main Charterer is taking care of the rest of the arrangements (itinerary, food, the cellar). Your allergies and details have already been passed to the crew exactly as you entered them. Enjoy your Cabin in the meantime — the berth map, your crew, the album are all below.",
        ctaLabel: null,
        ctaHref: null,
      };
    }
  } else {
    // ─────────────── PRINCIPAL PATH ───────────────
    if (invitedCount === 0) {
      step = {
        tone: "active",
        eyebrow: "Step 1 — start with your group",
        title: "Invite the people sailing with you.",
        copy: "Each person gets a quiet sign-in to share their own crew-list essentials and brief picks. You don't fill it in for them — they each take two minutes.",
        ctaLabel: "Invite your group →",
        ctaHref: "/cabin/guests",
      };
    } else if (!myDetailsComplete) {
      step = {
        tone: "active",
        eyebrow: "Step 2 — your crew-list line",
        title: "Share your own crew-list essentials.",
        copy: "Date of birth, gender, nationality, passport or ID, mobile. The harbour authorities need them from every person aboard — including you.",
        ctaLabel: "Open your details →",
        ctaHref: "/cabin/me",
      };
    } else if (!briefSectionsAllComplete) {
      step = {
        tone: "active",
        eyebrow: "Step 3 — fill the brief together",
        title: "Open the shared brief.",
        copy: "Arrival, itinerary, health, food, drinks — every section. Your group can add their picks alongside yours; together you shape the week the chef and hostess will design.",
        ctaLabel: "Open the brief →",
        ctaHref: "/cabin/brief",
      };
    } else if (!myBriefConfirmedAt) {
      step = {
        tone: "active",
        eyebrow: "Step 4 — confirm your brief",
        title: "Mark your brief picks as confirmed.",
        copy: "Every section's filled. Scroll to the bottom of the brief and press Confirm so the readiness bar moves to green.",
        ctaLabel: "Open the brief →",
        ctaHref: "/cabin/brief",
      };
    } else if (!groupFullyReady) {
      // Waiting on others
      const pcCount = pendingCrewListMembers?.length || 0;
      const bcCount = pendingBriefConfirmMembers?.length || 0;
      step = {
        tone: "waiting",
        eyebrow: "Waiting on your group",
        title:
          pcCount + bcCount === 1
            ? "One last person to finish."
            : `${pcCount + bcCount} of your group still to finish.`,
        copy:
          pcCount + bcCount === 1
            ? "Almost there. You can nudge them from Your Group, or let them get to it in their own time."
            : "Each person needs their crew-list line in AND their brief picks confirmed. Nudge them from Your Group, or wait — the readiness bar below shows you exactly who.",
        ctaLabel: "Open Your Group →",
        ctaHref: "/cabin/guests",
      };
    } else {
      step = {
        tone: "ready",
        eyebrow: "Ready to send",
        title: "Your brief is ready for George.",
        copy: "Every crew list is in. Every brief section is filled. Every voice has confirmed. Read it through one last time — then send it to George.",
        ctaLabel: "Review & send to George →",
        ctaHref: "/cabin/brief/review",
      };
    }
  }

  return (
    <section
      className={`ns ns--${step.tone}`}
      aria-label="What to do next"
    >
      <div className="ns__eyebrow">{step.eyebrow}</div>
      <h2 className="ns__title">{step.title}</h2>
      <p className="ns__copy">{step.copy}</p>
      {step.ctaLabel && step.ctaHref && (
        <Link href={step.ctaHref} className="ns__cta">
          {step.ctaLabel}
        </Link>
      )}

      <style>{`
        .ns {
          margin: 0 0 28px 0;
          padding: 24px 26px 22px;
          background: #FCFAF4;
          border: 1px solid rgba(201, 168, 76, 0.32);
          border-left: 3px solid var(--gy-gold, #C9A84C);
          border-radius: 4px;
        }
        .ns--ready {
          background: #F5FAF5;
          border-color: rgba(76, 138, 88, 0.55);
          border-left-color: #4C8A58;
        }
        .ns--done {
          background: #F5FAF5;
          border-color: rgba(76, 138, 88, 0.32);
          border-left-color: #4C8A58;
        }
        .ns--waiting {
          background: rgba(13, 27, 42, 0.03);
          border-color: rgba(13, 27, 42, 0.18);
          border-left-color: rgba(13, 27, 42, 0.45);
        }
        .ns__eyebrow {
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: var(--gy-gold, #C9A84C);
          font-weight: 700;
          margin-bottom: 10px;
        }
        .ns--ready .ns__eyebrow,
        .ns--done .ns__eyebrow { color: #2D5C36; }
        .ns--waiting .ns__eyebrow { color: rgba(13, 27, 42, 0.6); }
        .ns__title {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-weight: 300;
          font-size: 26px;
          line-height: 1.2;
          margin: 0 0 12px 0;
          color: #0D1B2A;
          letter-spacing: -0.1px;
        }
        @media (min-width: 600px) {
          .ns__title { font-size: 30px; }
        }
        .ns__copy {
          margin: 0 0 18px 0;
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 14.5px;
          color: #0D1B2A;
          line-height: 1.6;
        }
        .ns__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 15px 28px;
          background: var(--gy-navy, #0D1B2A);
          color: var(--gy-ivory, #F8F5F0);
          border: 1px solid var(--gy-gold, #C9A84C);
          border-radius: 3px;
          font-family: var(--gy-font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 700;
          text-decoration: none;
          transition: background 160ms ease;
        }
        .ns__cta:hover { background: #142233; }
        .ns--ready .ns__cta {
          background: #2D5C36;
          border-color: #4C8A58;
        }
        .ns--ready .ns__cta:hover { background: #1F4426; }
      `}</style>
    </section>
  );
}
