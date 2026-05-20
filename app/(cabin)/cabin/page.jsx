// app/(cabin)/cabin/page.jsx
// =============================================================
// /cabin — home page.
//
// 2026-05-20 — Phase 2 (invite-first architecture). Friend-test
// pass 2 surfaced two truths:
//
//   1. A principal charterer cannot, and will not, fill in DOBs,
//      passport numbers, allergies and swimming ability for 6–12
//      other adults they don't have those details for. The
//      Cabin's first ask should be: invite your group. Their
//      first reply is their own /cabin/me.
//
//   2. A guest who lands here for the first time should NOT be
//      thrown into the principal's onboarding (the Filotimo
//      welcome was full-name + DOB + hometown — too forensic
//      for a guest). They get a calmer flow: see who invited
//      them, share their own details, browse the cabin.
//
// This page now branches by role and by completeness state.
// =============================================================

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { buildAtAGlance } from "@/lib/cabin/prefill";
import { getCircleMember, nextTierGoal, TIERS } from "@/lib/cabin/filotimo";
import CharterAtAGlance from "../../components/cabin/CharterAtAGlance";
import IntroParagraph from "../../components/cabin/IntroParagraph";
import InstallNudge from "../../components/cabin/InstallNudge";
import VoyageCarousel from "../../components/cabin/VoyageCarousel";
import { titleCaseName } from "@/lib/cabin/format";

export const metadata = {
  title: "Your Cabin · George Yachts",
};

async function loadCabin(cabinId) {
  const db = getCabinDb();
  return dbQuery(
    db
      .from("cabins")
      .select("*")
      .eq("id", cabinId)
      .maybeSingle()
  );
}

export default async function CabinHomePage() {
  // Middleware only checks cookie presence; KV may have evicted
  // the session even though the cookie persists, so guard here.
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");

  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return (
      <div style={{ padding: 24 }}>
        <p>No cabin found for this account.</p>
      </div>
    );
  }

  const membership = resolveMembership(session, cabinId);
  const role = membership?.role ?? "guest";
  const isPrincipal =
    role === "principal_charterer" || role === "designated_assistant";

  // 2026-05-20 — Friend-test pass 3 + 4 (George):
  //   Gate required minimum is display_name + mobile + DOB for EVERY
  //   member (principal + guest + DA). Hometown is OPTIONAL in the
  //   form (collapsed behind "Add a couple of optional touches"), so
  //   it MUST NOT be part of the gate — pass 4 caught a redirect
  //   loop where the principal saved name/DOB/mobile, the gate
  //   demanded hometown they hadn't filled, they got bounced back
  //   to /cabin/welcome, hometown is collapsed/optional, save again,
  //   loop. Eventually 503 from Chrome timing out.
  //
  // Now: the gate only checks the THREE truly required fields the
  // form actually enforces. Hometown is a soft Filotimo nice-to-have,
  // captured opportunistically.
  const db2 = getCabinDb();
  let memberRow = null;
  let circleRow = null;
  if (membership?.member_id) {
    [memberRow, circleRow] = await Promise.all([
      dbQuery(
        db2
          .from("cabin_members")
          .select("display_name, mobile")
          .eq("id", membership.member_id)
          .maybeSingle()
      ),
      dbQuery(
        db2
          .from("filotimo_circle_members")
          .select("display_name, date_of_birth")
          .ilike("email", session.email)
          .is("deleted_at", null)
          .maybeSingle()
      ),
    ]);
  }
  const hasName = Boolean(memberRow?.display_name || circleRow?.display_name);
  const hasMobile = Boolean(memberRow?.mobile);
  const hasDOB = Boolean(circleRow?.date_of_birth);
  const onboardingIncomplete = !hasName || !hasMobile || !hasDOB;
  if (onboardingIncomplete) {
    redirect("/cabin/welcome");
  }

  const cabin = await loadCabin(cabinId);
  if (!cabin) {
    return (
      <div style={{ padding: 24 }}>
        <p>
          Your Cabin could not be loaded right now. Please refresh, or sign in
          again.
        </p>
      </div>
    );
  }
  const summary = buildAtAGlance(cabin);
  const circle = await getCircleMember(session.email);
  const goal = nextTierGoal(circle);

  // Group stats (principal view) + my-details status (guest view)
  const allMembers = await dbQuery(
    db2
      .from("cabin_members")
      .select("id, role, email, display_name, invite_sent_at, last_login_at, personal_details_completed_at")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null)
  );
  const members = allMembers ?? [];

  // Count of people the principal has INVITED (excluding self).
  const guestRows = members.filter(
    (m) => m.role !== "principal_charterer" && m.role !== "designated_assistant"
  );
  const invitedCount = guestRows.length;
  const completedCount = guestRows.filter(
    (m) => m.personal_details_completed_at
  ).length;

  const myRow = members.find((m) => m.id === membership?.member_id) ?? null;
  const myDetailsComplete = Boolean(myRow?.personal_details_completed_at);

  const principalRow = members.find((m) => m.role === "principal_charterer");

  // 2026-05-20 — Friend-test pass 3 (George): the greeting read
  // "Welcome, george." because the source string was lowercased
  // at data entry. titleCaseName on display fixes the symptom
  // without rewriting historical data.
  const rawFirstName =
    membership?.display_name?.split(" ")[0] ||
    myRow?.display_name?.split(" ")[0] ||
    cabin?.principal_charterer_name?.split(" ")[0] ||
    "friend";
  const firstName = titleCaseName(rawFirstName);

  const percent = cabin.brief_completion_percent ?? 0;

  return (
    <div className="cabin-home">
      <header className="cabin-home__welcome">
        <div className="cabin-home__eyebrow">Welcome aboard, in spirit</div>
        <h1 className="cabin-home__greeting">
          Welcome, <em>{firstName}.</em>
        </h1>
        <div className="cabin-home__rule" aria-hidden />
        {isPrincipal ? (
          <IntroParagraph>
            This is your private Cabin — your quiet corner of George
            Yachts. The first thing we’d like to ask of you is small:
            invite the people sailing with you. Each one gets their own
            quiet sign-in to share a few details about themselves —
            allergies, swimming, what they’d like the chef to know.
            You don’t need to fill that in for them.
          </IntroParagraph>
        ) : (
          <IntroParagraph>
            {principalRow?.display_name
              ? `${principalRow.display_name.split(" ")[0]} invited you `
              : "You’ve been invited "}
            to {cabin.vessel_name || "this charter"} for{" "}
            {summary?.dates || "the coming week"}. We just need a few quiet
            details from you so the chef and captain can look after you well.
            You can do this in two minutes.
          </IntroParagraph>
        )}
      </header>

      {/* ============================================================
          PRIMARY CTA — different for principal vs guest.
          ============================================================ */}
      {isPrincipal ? (
        <section className="cabin-home__primary">
          <div className="cabin-home__section-label">Your first step</div>
          <h2 className="cabin-home__primary-title">
            {invitedCount === 0
              ? "Invite the people sailing with you."
              : completedCount < invitedCount
                ? `${completedCount} of ${invitedCount} have shared their details.`
                : "Your whole group is aboard — beautifully done."}
          </h2>
          <p className="cabin-home__primary-blurb">
            {invitedCount === 0
              ? "Paste their email addresses — we’ll send each guest their own private sign-in to your Cabin."
              : completedCount < invitedCount
                ? "We’ll quietly nudge anyone who hasn’t yet. You can also resend invites from the group page."
                : "Browse the rest of your Cabin at your pace below."}
          </p>
          <Link href="/cabin/guests" className="cabin-home__cta">
            {invitedCount === 0
              ? "Invite your group →"
              : "Manage your group →"}
          </Link>
        </section>
      ) : (
        <section className="cabin-home__primary">
          <div className="cabin-home__section-label">Your first step</div>
          <h2 className="cabin-home__primary-title">
            {myDetailsComplete
              ? "Thank you — the captain has what he needs."
              : "Share a few quiet details about you."}
          </h2>
          <p className="cabin-home__primary-blurb">
            {myDetailsComplete
              ? "You can edit any of it from your details page below, anytime."
              : "DOB, any allergies, swimming comfort — that’s really all we ask. Two minutes."}
          </p>
          <Link href="/cabin/me" className="cabin-home__cta">
            {myDetailsComplete ? "Edit my details →" : "Share my details →"}
          </Link>
        </section>
      )}

      {/* 2026-05-20 — Friend-test pass 3 (George): "Δεν είδα κουμπί
          να βάλω την Καμπίνα στο κινητό." Install nudge moved here
          (was at the bottom of the page) so it's above-the-fold on
          mobile — visible without scrolling. The component
          dismisses itself silently on desktop and on already-
          installed PWAs. */}
      <InstallNudge />

      <CharterAtAGlance summary={summary} cabin={cabin} />

      {/* ============================================================
          THE BRIEF — secondary card. The principal can come back
          to it whenever they like; it no longer dominates the page.
          Guests don't see the brief CTA — they don't fill it.
          ============================================================ */}
      {isPrincipal && (
        <section className="cabin-home__progress">
          <div className="cabin-home__section-label">The Charter Brief</div>
          <h3 className="cabin-home__progress-title">
            {percent > 0
              ? `${percent}% of the brief is filled in.`
              : "The brief is yours to write — at your pace."}
          </h3>
          <p className="cabin-home__progress-blurb">
            Itinerary preferences, dining instincts, little touches that
            make a week feel like yours. Half an hour across as many sittings
            as you want.
          </p>
          <div className="cabin-home__progress-bar" aria-hidden>
            <div
              className="cabin-home__progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
          <Link href="/cabin/brief" className="cabin-home__cta cabin-home__cta--ghost">
            {percent > 0 ? "Continue the brief" : "Start the brief"}
          </Link>
        </section>
      )}

      {/* ============================================================
          THE CABIN MAP — icon grid (2026-05-20 friend-test pass 3).
          Replaces the small discoveries list AND the hamburger menu.
          George: "Κανένας πελάτης δεν θα κάτσει να ανοίξει hamburger.
          Βγάλε τα όλα στην κεντρική σελίδα σαν εικονίδια με απλά
          λόγια κάτω από το καθένα."

          Tiles are role-aware:
            - principal/assistant → "Your Group" (links to /cabin/guests)
            - guest                → "My Details" (links to /cabin/me)
          Brief tile is hidden for guests (they don't fill the brief).
          ============================================================ */}
      <section className="cabin-home__map">
        <div className="cabin-home__section-label">Your Cabin, at a glance</div>
        <div className="cabin-home__grid">
          {isPrincipal && (
            <Link href="/cabin/brief" className="cabin-home__tile">
              <span className="cabin-home__tile-glyph" aria-hidden>✎</span>
              <strong>The Brief</strong>
              <em>Tell us about your week — pace, food, what to celebrate.</em>
            </Link>
          )}
          <Link href="/cabin/chat" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>✺</span>
            <strong>Chat with George</strong>
            <em>Message us anytime. George answers personally.</em>
          </Link>
          {isPrincipal ? (
            <Link href="/cabin/guests" className="cabin-home__tile">
              <span className="cabin-home__tile-glyph" aria-hidden>◇</span>
              <strong>Your Group</strong>
              <em>Invite the people sailing with you. See who has joined.</em>
            </Link>
          ) : (
            <Link href="/cabin/me" className="cabin-home__tile">
              <span className="cabin-home__tile-glyph" aria-hidden>◇</span>
              <strong>My Details</strong>
              <em>Share a few details — DOB, allergies, swimming.</em>
            </Link>
          )}
          <Link href="/cabin/crew" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>⚓</span>
            <strong>Crew</strong>
            <em>Meet the captain, chef and hostess of your voyage.</em>
          </Link>
          <Link href="/cabin/menu" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>✿</span>
            <strong>Sample Menu</strong>
            <em>A taste of what your chef proposes for the week.</em>
          </Link>
          <Link href="/cabin/vessel" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>⛵</span>
            <strong>Your Vessel</strong>
            <em>Photos and details of the yacht you’re sailing on.</em>
          </Link>
          <Link href="/cabin/mood-board" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>❖</span>
            <strong>Mood Board</strong>
            <em>Save photos that capture the vibe you want.</em>
          </Link>
          <Link href="/cabin/before-you-sail" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>⊿</span>
            <strong>Before You Sail</strong>
            <em>Weather, Greek phrases, a quiet packing list.</em>
          </Link>
          <Link href="/cabin/voyage-album" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>▣</span>
            <strong>Voyage Album</strong>
            <em>Your photos from the week. Yours forever.</em>
          </Link>
          <Link href="/cabin/time-capsule" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>✉</span>
            <strong>Time Capsule</strong>
            <em>Write a note we’ll send you in six months.</em>
          </Link>
          <Link href="/cabin/filotimo-circle" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>◐</span>
            <strong>Filotimo Circle</strong>
            <em>Your place in our quiet loyalty circle.</em>
          </Link>
          <Link href="/cabin/your-data" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>▢</span>
            <strong>Your Data</strong>
            <em>Everything we hold for you. Edit or delete any time.</em>
          </Link>
          <Link href="/cabin/install" className="cabin-home__tile">
            <span className="cabin-home__tile-glyph" aria-hidden>⤓</span>
            <strong>Add to phone</strong>
            <em>One tap to come back next time — no more sign-in emails.</em>
          </Link>
        </div>
      </section>

      {/* 2026-05-20 — Friend-test pass 4 (George): "Κάτω από το
          grid θέλω σε καρουζέλ τις τελευταίες φωτογραφίες των
          ταξιδιών." Quietly renders nothing if no photos yet. */}
      <VoyageCarousel />

      {circle && (
        <aside className="cabin-home__circle">
          <div className="cabin-home__section-label">Filotimo Circle</div>
          <p>
            You are a <strong>{TIERS[circle.tier].label}</strong> of the
            Circle{circle.joined_at ? `, since ${new Date(circle.joined_at).getFullYear()}` : ""}.
            {goal?.kind === "voyages" &&
              goal.voyages_to_go > 0 &&
              ` ${goal.voyages_to_go} more voyage${
                goal.voyages_to_go > 1 ? "s" : ""
              } and you become a ${TIERS[goal.next_tier].label}.`}
            {goal?.kind === "max" && " You are at the heart of the Circle."}
          </p>
        </aside>
      )}

      {/* 2026-05-20 — Friend-test pass 3: hamburger menu removed
          entirely (see CabinShell.jsx). Sign-out moved here as a
          small, calm footer link — visible but not noisy. */}
      <footer className="cabin-home__footer">
        <form action="/api/cabin/auth/logout" method="post">
          <button type="submit" className="cabin-home__signout">
            Sign out
          </button>
        </form>
      </footer>

      <style>{`
        .cabin-home { display: flex; flex-direction: column; gap: 48px; }
        .cabin-home__welcome { text-align: left; }
        .cabin-home__eyebrow {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
        }
        .cabin-home__greeting {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 36px;
          line-height: 1.1;
          margin: 12px 0 0 0;
          letter-spacing: -0.4px;
        }
        @media (min-width: 768px) {
          .cabin-home__greeting { font-size: 48px; }
        }
        .cabin-home__greeting em {
          font-style: italic;
          color: var(--gy-gold);
        }
        .cabin-home__rule {
          width: 64px;
          height: 1px;
          background: var(--gy-gold);
          margin: 20px 0;
          opacity: 0.7;
        }

        .cabin-home__section-label {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold);
          font-weight: 500;
          margin-bottom: 12px;
        }

        .cabin-home__primary {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 26px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cabin-home__primary-title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 26px;
          line-height: 1.2;
          margin: 0;
          color: var(--gy-navy);
        }
        @media (min-width: 768px) {
          .cabin-home__primary-title { font-size: 30px; }
        }
        .cabin-home__primary-blurb {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.7);
          margin: 0;
        }

        .cabin-home__progress {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 24px 22px 22px 22px;
        }
        .cabin-home__progress-title {
          font-family: var(--gy-font-editorial);
          font-weight: 300;
          font-size: 22px;
          margin: 0 0 6px 0;
          color: var(--gy-navy);
        }
        .cabin-home__progress-blurb {
          font-family: var(--gy-font-editorial);
          font-size: 14px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.6);
          margin: 0 0 16px 0;
        }
        .cabin-home__progress-bar {
          width: 100%;
          height: 2px;
          background: rgba(13, 27, 42, 0.12);
          overflow: hidden;
        }
        .cabin-home__progress-fill {
          height: 100%;
          background: var(--gy-gold);
          transition: width 240ms ease;
        }

        .cabin-home__cta {
          display: inline-block;
          align-self: flex-start;
          background: var(--gy-navy);
          color: var(--gy-ivory);
          padding: 14px 24px;
          font-family: var(--gy-font-ui);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid var(--gy-gold);
          transition: background 180ms ease;
          margin-top: 4px;
        }
        .cabin-home__cta:hover { background: #142233; }
        .cabin-home__cta--ghost {
          background: transparent;
          color: var(--gy-navy);
          margin-top: 18px;
        }
        .cabin-home__cta--ghost:hover {
          background: rgba(201, 168, 76, 0.08);
        }

        /* ── Icon grid (Cabin map) ─────────────────────────────── */
        .cabin-home__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: rgba(13, 27, 42, 0.08);
          border: 1px solid rgba(13, 27, 42, 0.08);
        }
        @media (min-width: 640px) {
          .cabin-home__grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .cabin-home__grid { grid-template-columns: repeat(4, 1fr); }
        }
        .cabin-home__tile {
          background: #ffffff;
          padding: 22px 18px 20px 18px;
          color: var(--gy-navy);
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 130px;
          transition: background 160ms ease, transform 160ms ease;
        }
        .cabin-home__tile:hover {
          background: rgba(201, 168, 76, 0.06);
        }
        .cabin-home__tile:active {
          transform: scale(0.985);
        }
        .cabin-home__tile-glyph {
          color: var(--gy-gold);
          font-size: 28px;
          line-height: 1;
        }
        .cabin-home__tile strong {
          font-family: var(--gy-font-editorial);
          font-weight: 400;
          font-size: 16.5px;
          letter-spacing: -0.1px;
          line-height: 1.25;
        }
        .cabin-home__tile em {
          font-style: italic;
          font-family: var(--gy-font-editorial);
          color: rgba(13, 27, 42, 0.62);
          font-size: 13px;
          line-height: 1.5;
        }

        /* ── Sign-out footer ────────────────────────────────────── */
        .cabin-home__footer {
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid rgba(13, 27, 42, 0.08);
          display: flex;
          justify-content: center;
        }
        .cabin-home__signout {
          background: transparent;
          border: 0;
          color: rgba(13, 27, 42, 0.45);
          font-family: var(--gy-font-ui);
          font-size: 10.5px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 10px 18px;
        }
        .cabin-home__signout:hover {
          color: var(--gy-navy);
        }

        .cabin-home__circle {
          border-top: 1px solid rgba(13, 27, 42, 0.12);
          padding-top: 28px;
        }
        .cabin-home__circle p {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(13, 27, 42, 0.75);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
