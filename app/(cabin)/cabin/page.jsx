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
import { resolveVesselPhotoUrls } from "@/lib/cabin/vessel-photo-urls";
import CharterAtAGlance from "../../components/cabin/CharterAtAGlance";
import IntroParagraph from "../../components/cabin/IntroParagraph";
import InstallNudge from "../../components/cabin/InstallNudge";
import VoyageCarousel from "../../components/cabin/VoyageCarousel";
import GreekWordOfTheDay from "../../components/cabin/GreekWordOfTheDay";
import CabinIcon from "../../components/cabin/CabinIcon";
import VesselBrochureBlock from "../../components/cabin/VesselBrochureBlock";
import PreVoyageSteps from "../../components/cabin/PreVoyageSteps";
import GhostCredit from "../../components/cabin/GhostCredit";
import { titleCaseName, firstNameFromDisplayName, crewRoles, joinNouns, prettyDate } from "@/lib/cabin/format";

export const metadata = {
  // 2026-05-20 — Pass 4 round 5 (Tyler, Helen, Margaret): browser
  // tab read "Your Cabin · George Yachts · Your Cabin". The cabin
  // layout applies a "%s · Your Cabin" template; this page provided
  // its own title that already included "Your Cabin", so the
  // template re-appended. `absolute` bypasses the template.
  title: { absolute: "Your Cabin · George Yachts" },
};

// 2026-05-20 — MYBA contract extraction added a `contract_internal`
// JSONB column carrying owner, stakeholder, fees, payment schedule,
// bank account. NEVER expose to charterer surfaces.
//
// We could `select("*")` and rely on the JSX never rendering that
// field — but defense-in-depth: enumerate the columns we actually
// need so a future change can't accidentally surface internal data.
const CABIN_CLIENT_COLUMNS = [
  "id",
  "status",
  "concierge_mode_active",
  "vessel_name",
  "vessel_make_model",
  "vessel_length",
  "vessel_capacity",
  "homeport",
  "cruising_area",
  "port_embarkation",
  "port_disembarkation",
  "charter_period_from",
  "charter_period_to",
  "principal_charterer_name",
  "principal_charterer_email",
  "principal_charterer_mobile",
  "brief_completion_percent",
  "brief_submitted_at",
  "brief_locked_at",
  "vessel_brochure",
  "vessel_photos",
  "sample_menu",
  "crew_display",
  "inspiration_content",
  "created_at",
  "updated_at",
].join(", ");

async function loadCabin(cabinId) {
  const db = getCabinDb();
  return dbQuery(
    db
      .from("cabins")
      .select(CABIN_CLIENT_COLUMNS)
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
      .select("id, role, email, display_name, invite_sent_at, last_login_at, personal_details_completed_at, brief_participation_opt_out_at")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null)
  );
  const members = allMembers ?? [];

  // Count of people the principal has INVITED (excluding self).
  // Drives Step 01 "Invite the people sailing with you."
  const guestRows = members.filter(
    (m) => m.role !== "principal_charterer" && m.role !== "designated_assistant"
  );
  const invitedCount = guestRows.length;
  const completedCount = guestRows.filter(
    (m) => m.personal_details_completed_at
  ).length;

  // 2026-05-22 — Crew-list totals INCLUDE the principal. Step 02
  // ("X of Y crew-list lines are in") needs to surface the
  // principal's own readiness, since the Send-to-George gate
  // requires them too. Opt-out guests are excluded from the
  // denominator — if Trish marked herself opt-out, she doesn't
  // hold up the lock.
  const crewListRows = members.filter(
    (m) => !m.brief_participation_opt_out_at,
  );
  const crewListTotal = crewListRows.length;
  const crewListReady = crewListRows.filter(
    (m) => m.personal_details_completed_at,
  ).length;

  const myRow = members.find((m) => m.id === membership?.member_id) ?? null;
  const myDetailsComplete = Boolean(myRow?.personal_details_completed_at);

  const principalRow = members.find((m) => m.role === "principal_charterer");

  // 2026-05-20 — Friend-test pass 3 (George): the greeting read
  // "Welcome, george." because the source string was lowercased
  // at data entry. titleCaseName on display fixes the symptom
  // without rewriting historical data.
  //
  // 2026-05-21 — Pass 7 follow-up (preview-as-customer surfaced
  // the EFFIE STAR fixture): display_name was "Ms. Tricia Stevens"
  // (MYBA-style) and split(" ")[0] yielded "Ms." → "Welcome, Ms..".
  // firstNameFromDisplayName skips leading honorifics so the next
  // real token wins. Belt-and-braces: passport extraction now
  // also patches cabin_members.display_name to the signature form
  // ("Patricia R. Stevens"), so new cabins shouldn't hit the
  // honorific path at all — this defends old fixtures.
  const rawFirstName =
    firstNameFromDisplayName(membership?.display_name) ||
    firstNameFromDisplayName(myRow?.display_name) ||
    firstNameFromDisplayName(cabin?.principal_charterer_name) ||
    "friend";
  const firstName = titleCaseName(rawFirstName);

  const percent = cabin.brief_completion_percent ?? 0;

  // 2026-05-21 — Pass 7: extracted to lib/cabin/format so this
  // page, /cabin/brief and /cabin/brief/guests share one canonical
  // noun list. crewRoles() returns ["captain","chef","hostess"] /
  // ["captain","chef"] / ["crew"] (graceful fallback).
  const crewNouns = joinNouns(crewRoles(cabin?.crew_display));
  const crewTileBlurb = crewNouns === "crew"
    ? "Meet the small team caring for you this week."
    : `Meet the ${crewNouns} of your voyage.`;

  // 2026-05-21 — Hero band caption uses the friendly date range.
  // We deliberately keep this distinct from "Charter at a Glance"
  // dates (which carries full year for legal clarity); the hero
  // is editorial and wants the punchier "27 Jun — 4 Jul 2026".
  const heroDates =
    cabin.charter_period_from && cabin.charter_period_to
      ? `${prettyDate(cabin.charter_period_from)} — ${prettyDate(cabin.charter_period_to)}`
      : null;

  // 2026-05-22 — Resolve vessel photos for rendering. Each entry
  // in cabin.vessel_photos is either {url} (operator pasted) or
  // {path} (auto-extracted from the brochure PDF and uploaded to
  // the private cabin-photos bucket). Resolver signs storage
  // paths and returns a uniform {url, caption, credit, page}
  // array the components can render without caring which shape
  // they came from. Passed to VesselBrochureBlock.
  const resolvedVesselPhotos = await resolveVesselPhotoUrls(cabin.vessel_photos);

  return (
    <div className="cabin-home">
      {/* 2026-05-22 — VesselHero removed.
          George's read on the EFFIE STAR preview after the photos
          landed: the band cropped a horizontal sailing-yacht shot
          to "only the mast visible" because the band's fixed
          aspect-ratio + object-fit:cover. Different yachts have
          different photo aspect-ratios, so no single object-position
          fits them all without per-cabin art direction.
          The same hero photo lives properly framed inside the
          VesselBrochureBlock just below — keeping it once, in the
          place where it has editorial context (kicker + name +
          builder + year + summary) reads better than the same
          shot appearing twice, once cropped wrong.
          Identity still arrives on entry via the navy header
          chip on the right ("EFFIE STAR · 27 Jun – 4 Jul ·
          PATRICIA R. STEVENS"). */}

      <header className="cabin-home__welcome">
        {/* 2026-05-20 — Pass 6 (Domingo, Margaret):
            "'Welcome aboard, in spirit' over 'Welcome, George' reads
            like two competing greetings — and the 'in spirit' hedge
            sits awkwardly with people who paid €50k for a real
            voyage. The eyebrow is now a calm contextualizer, not a
            second welcome. */}
        <div className="cabin-home__eyebrow">Your private Cabin</div>
        <h1 className="cabin-home__greeting">
          Welcome on board, <em>{firstName}.</em>
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
              ? `${firstNameFromDisplayName(principalRow.display_name) || "Your host"} invited you `
              : "You’ve been invited "}
            to {cabin.vessel_name || "this charter"} for{" "}
            {summary?.dates || "the coming week"}. We just need a few quiet
            details from you so the chef and captain can look after you well.
            You can do this in two minutes.
          </IntroParagraph>
        )}
      </header>

      {/* ============================================================
          PRE-VOYAGE STEPS — 2026-05-22 (George):
          The cabin's two onboarding inputs (invite group · brief)
          are now unified into a single magazine-style block at
          the top of the page, then the vessel reveals beneath.
          Renders role-aware: principal sees Step 01 + 02; guest
          sees only Step 01 (their own /me details). Pressureless
          luxury framing, status indicators on each card.
          ============================================================ */}
      <PreVoyageSteps
        isPrincipal={isPrincipal}
        invitedCount={invitedCount}
        completedCount={completedCount}
        crewListTotal={crewListTotal}
        crewListReady={crewListReady}
        myDetailsComplete={myDetailsComplete}
        briefPercent={percent}
        briefSubmitted={Boolean(cabin?.brief_submitted_at)}
      />

      {/* 2026-05-22 — George rejected the small teaser:
          "λέμε αυτό το κείμενο στον πελάτη και δεν του δείχνουμε
          τίποτα. 'See the full vessel' τι σημαίνει? Η μπροσούρα
          που σου έχω ανεβάσει σαν PDF πρέπει να είναι εκεί μέσα.
          Όλη."
          Replaced VesselTeaser with VesselBrochureBlock — the
          FULL brochure rendered inline: hero + intro paragraph
          + key features + photo gallery + specs + accommodation
          + amenities + tender & toys + spaces aboard. No more
          click-through to a separate /cabin/vessel page; the
          brochure IS the chapter. */}
      <VesselBrochureBlock cabin={cabin} photos={resolvedVesselPhotos} />

      {/* 2026-05-22 — Step 02 (Charter Brief) folded into the
          PreVoyageSteps block above. */}

      {/* 2026-05-20 — Friend-test pass 3 (George): "Δεν είδα κουμπί
          να βάλω την Καμπίνα στο κινητό." Install nudge moved here
          (was at the bottom of the page) so it's above-the-fold on
          mobile — visible without scrolling. The component
          dismisses itself silently on desktop and on already-
          installed PWAs. */}
      <InstallNudge />

      <CharterAtAGlance summary={summary} cabin={cabin} />

      {/* 2026-05-20 — Friend-test pass 4 (Sarah):
          "Surface a single Greek word of the day on the Cabin home —
           don't bury it two clicks deep in Before You Sail."
          Picks one of 10 phrases deterministically by day of year
          so guests see something fresh per visit but no random
          jitter mid-session. */}
      <GreekWordOfTheDay />

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
              <CabinIcon name="brief" className="cabin-home__tile-glyph" />
              <strong>The Brief</strong>
              <em>Tell us about your week — pace, food, what to celebrate.</em>
            </Link>
          )}
          <Link href="/cabin/chat" className="cabin-home__tile">
            <CabinIcon name="chat" className="cabin-home__tile-glyph" />
            <strong>Chat with George</strong>
            <em>Message us anytime. George answers personally.</em>
          </Link>
          {isPrincipal ? (
            <>
              <Link href="/cabin/guests" className="cabin-home__tile">
                <CabinIcon name="group" className="cabin-home__tile-glyph" />
                <strong>Your Group</strong>
                <em>Invite the people sailing with you. See who has joined.</em>
              </Link>
              {/* 2026-05-22 — Principal needs their own /cabin/me
                  surface too. The brief lock now requires every
                  member (incl. principal) to have a complete Crew
                  List, but the principal previously had no direct
                  tile to their own details page from /cabin home. */}
              <Link href="/cabin/me" className="cabin-home__tile">
                <CabinIcon name="data" className="cabin-home__tile-glyph" />
                <strong>My Crew List Line</strong>
                <em>Your own DOB, gender, nationality, ID/passport, mobile — the harbour-authority essentials.</em>
              </Link>
            </>
          ) : (
            <Link href="/cabin/me" className="cabin-home__tile">
              <CabinIcon name="group" className="cabin-home__tile-glyph" />
              <strong>My Crew List Line</strong>
              <em>Your DOB, gender, nationality, ID/passport, mobile — five quiet fields for the marinas.</em>
            </Link>
          )}
          {/* 2026-05-21 — Pass 7 prep (Domingo): the original tile
              copy hard-coded "captain, chef and hostess" but smaller
              vessels often sail with captain + chef only, or
              captain + chef + deckhand. Promising a hostess we
              don't have is the kind of small lie that erodes the
              filotimo voice. The blurb is now generated from the
              actual crew_display roles. */}
          <Link href="/cabin/crew" className="cabin-home__tile">
            <CabinIcon name="crew" className="cabin-home__tile-glyph" />
            <strong>Crew</strong>
            <em>{crewTileBlurb}</em>
          </Link>
          <Link href="/cabin/menu" className="cabin-home__tile">
            <CabinIcon name="menu" className="cabin-home__tile-glyph" />
            <strong>Sample Menu</strong>
            <em>A taste of what your chef proposes for the week.</em>
          </Link>
          {/* 2026-05-22 — Removed the "Your Vessel" tile from
              the home grid. The full vessel brochure is now
              rendered INLINE above (VesselBrochureBlock). Keeping
              a tile that goes to a near-duplicate page just
              creates two competing entries for the same content.
              The standalone /cabin/vessel route still exists for
              direct deep-linking + print views. */}
          <Link href="/cabin/mood-board" className="cabin-home__tile">
            <CabinIcon name="mood" className="cabin-home__tile-glyph" />
            <strong>Mood Board</strong>
            <em>Save photos that capture the vibe you want.</em>
          </Link>
          <Link href="/cabin/before-you-sail" className="cabin-home__tile">
            <CabinIcon name="before" className="cabin-home__tile-glyph" />
            <strong>Before You Sail</strong>
            <em>Weather, Greek phrases, a quiet packing list.</em>
          </Link>
          <Link href="/cabin/voyage-album" className="cabin-home__tile">
            <CabinIcon name="album" className="cabin-home__tile-glyph" />
            <strong>Voyage Album</strong>
            <em>Your photos from the week — download any time, zip on request.</em>
          </Link>
          <Link href="/cabin/time-capsule" className="cabin-home__tile">
            <CabinIcon name="capsule" className="cabin-home__tile-glyph" />
            <strong>Time Capsule</strong>
            <em>Write a note we’ll send you in six months.</em>
          </Link>
          <Link href="/cabin/filotimo-circle" className="cabin-home__tile">
            <CabinIcon name="circle" className="cabin-home__tile-glyph" />
            <strong>Filotimo Circle</strong>
            <em>Your place in our quiet loyalty circle.</em>
          </Link>
          <Link href="/cabin/install" className="cabin-home__tile">
            <CabinIcon name="install" className="cabin-home__tile-glyph" />
            <strong>Add to phone</strong>
            <em>One tap to come back next time — no more sign-in emails.</em>
          </Link>
        </div>
      </section>

      {/* 2026-05-20 — Friend-test pass 4 (George): "Κάτω από το
          grid θέλω σε καρουζέλ τις τελευταίες φωτογραφίες των
          ταξιδιών." Quietly renders nothing if no photos yet. */}
      <VoyageCarousel />

      {/* 2026-05-20 — Pass 4 rounds 4+5 (David, Tyler, Helen):
          "'You are a Friend of the Circle, since 2026' BEFORE the
           charter has even started — reads as pre-bestowed loyalty.
           The whole point of filotimo is that it's earned."
          Hide the tier badge entirely until the user has at least
          one completed voyage. Pre-voyage, we show a calm "on the
          threshold" line that doesn't claim a relationship that
          hasn't happened yet. */}
      {circle && (
        <aside className="cabin-home__circle">
          <div className="cabin-home__section-label">Filotimo Circle</div>
          {(circle.voyages_count ?? 0) === 0 ? (
            <p>
              You&apos;re at the start of our quiet circle. The Circle
              isn&apos;t earned in advance — it&apos;s built across
              voyages, one at a time. We&apos;ll write to you about it
              once you&apos;re home.
            </p>
          ) : (
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
          )}
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

      {/* 2026-05-21 — Pass 7 (George): the same GHOST_ build credit
          the marketing site footer carries. Quiet, low on the page,
          luxury-tech monospace gold. Same agency owns both surfaces
          — the credit on the cabin signs the platform without
          shouting over the customer's own page. */}
      <GhostCredit />

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
        /* 2026-05-21 — Pass 7: a Second Step variant of the
           primary card. Gold left rim subtly signals "this card
           is the one you'll come back to most" without screaming
           with a full gold fill. Same internal layout. */
        .cabin-home__primary--second {
          border-left: 3px solid var(--gy-gold);
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
        /* 2026-05-20 — Pass 6 (Domingo, Tyler): the principal grid
           had 13 tiles, leaving one lonely tile in column 1 of the
           bottom row with 3 empty cells beside it on the 4-col
           desktop layout (and analogous gaps at the other
           breakpoints). When the last tile is the sole occupant of
           its row, span it across the remaining cells so the grid
           always reads as intentional and never has visible empty
           white cells.

           Each rule is scoped by media query so the nth-child
           calculation matches the active column count.
        */
        @media (max-width: 639.98px) {
          .cabin-home__tile:last-child:nth-child(odd) {
            grid-column: 1 / -1;
          }
        }
        @media (min-width: 640px) and (max-width: 1023.98px) {
          .cabin-home__tile:last-child:nth-child(3n+1) {
            grid-column: 1 / -1;
          }
        }
        @media (min-width: 1024px) {
          .cabin-home__tile:last-child:nth-child(4n+1) {
            grid-column: 1 / -1;
          }
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
          width: 28px;
          height: 28px;
          display: block;
          /* Now an inline SVG (CabinIcon) rather than a Unicode
             glyph — one consistent hand across the entire grid. */
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
