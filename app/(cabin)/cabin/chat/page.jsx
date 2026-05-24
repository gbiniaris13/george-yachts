// /cabin/chat — Direct WhatsApp channel to George.
//
// 2026-05-20 — Friend-test pass 4 (George):
//   "Βγάλε τελείως το internal chat που έχει η Καμπίνα. Άσε μόνο
//    το 'Need George right now' WhatsApp deep link — αλλά κάντο
//    πιο όμορφο σε user experience. Το άλλο chat από κάτω είναι
//    άχρηστο."
//
// Server-rendered. Reads the active cabin for the pre-filled
// WhatsApp message so George sees "Hello, it's me from M/Y NOOR
// for 24–31 May" as the opening line — not a generic ping.
//
// The internal chat infrastructure (chat_messages table, polling,
// chime, server pings) stays in the codebase for the operator
// surface (CRM /dashboard/cabins/:id/chat). Only the charterer-
// facing /cabin/chat page is replaced. Direct messages, if anyone
// sends them via the existing API, still arrive at the CRM.

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { titleCaseName, prettyDate, firstNameFromDisplayName } from "@/lib/cabin/format";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

export const metadata = {
  title: "Chat with George",
};

// George's WhatsApp business number. If this ever changes, update
// here only — every magic-link email + chat surface reads from
// this single source.
const GEORGE_WHATSAPP_NUMBER = "17867988798"; // E.164 without +

export default async function ChatPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/cabin/login");

  const cabinId = pickActiveCabinId(session);
  let cabin = null;
  // 2026-05-24 — Angeliki pass: WhatsApp prefill was reading
  // cabin.principal_charterer_name for EVERY user, so every
  // guest's WhatsApp opened "Hello George, it's Patricia from
  // M/Y NOOR" — Angeliki, Christos, Vasilis all looked like
  // Patricia (the principal) to George. Now we resolve the
  // current member's display_name via cabin_members and fall
  // back to the principal name + email username only if the
  // member row can't be loaded.
  let currentMemberDisplayName = null;
  if (cabinId) {
    const db = getCabinDb();
    cabin = await dbQuery(
      db
        .from("cabins")
        .select("vessel_name, charter_period_from, charter_period_to, principal_charterer_name")
        .eq("id", cabinId)
        .maybeSingle()
    );
    const membership = resolveMembership(session, cabinId);
    if (membership?.member_id) {
      const memberRow = await dbQuery(
        db
          .from("cabin_members")
          .select("display_name")
          .eq("id", membership.member_id)
          .maybeSingle(),
      );
      currentMemberDisplayName = memberRow?.display_name ?? null;
    }
  }

  // 2026-05-21 — Use honorific-stripping helper so the WhatsApp
  // prefill "it's <FirstName> from <vessel>" reads correctly on
  // cabins whose name still carries the MYBA-style "Ms." prefix.
  // 2026-05-24 — Angeliki pass: prefer the current member's
  // display_name; only fall back to the principal/email if we
  // genuinely couldn't resolve one.
  const firstName = titleCaseName(
    firstNameFromDisplayName(currentMemberDisplayName) ||
      firstNameFromDisplayName(cabin?.principal_charterer_name) ||
      session.email.split("@")[0],
  );
  const vessel = cabin?.vessel_name || "the charter";
  const dates = cabin?.charter_period_from && cabin?.charter_period_to
    ? `${prettyDate(cabin.charter_period_from)} – ${prettyDate(cabin.charter_period_to)}`
    : "";

  const prefill = `Hello George, it's ${firstName} from ${vessel}${
    dates ? ` (${dates})` : ""
  }. `;

  const waLink = `https://wa.me/${GEORGE_WHATSAPP_NUMBER}?text=${encodeURIComponent(prefill)}`;

  return (
    <article>
      <SectionTitle
        kicker="Always within reach"
        title="A direct line"
        italic="to George."
      />
      <IntroParagraph>
        I’m one tap away on WhatsApp — for the small questions before
        you sail, the celebrations during the week, and the things
        that don’t fit anywhere else. I read every message personally.
      </IntroParagraph>

      <section className="chat-card">
        <div className="chat-card__head">
          {/* 2026-05-23 — George: "Εδώ στο A Direct Line with George
              έχει ένα κυκλάκι και λέει GB τα αρχικά μου. Θα μπορούσαμε
              να το κάνουμε λίγο πιο όμορφο όπως είναι η υπογραφή του
              mail μου." Replaced the GB monogram with his real
              headshot + an IYBA verification badge bottom-right.
              Same dual-circle treatment as the broker industry
              norm — face says "this is a human", IYBA badge says
              "credentialled" without taking up extra real estate. */}
          <span className="chat-card__avatar" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/george.jpg"
              alt=""
              className="chat-card__avatar-photo"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/iyba-official.png"
              alt=""
              className="chat-card__avatar-badge"
            />
          </span>
          <div>
            <div className="chat-card__name">George P. Biniaris</div>
            <div className="chat-card__role">Managing Broker · George Yachts</div>
          </div>
          {/* 2026-05-20 — Pass 6 (Domingo / Tyler):
              the green "Online" dot was a fake-presence claim — it
              animated whether or not George was actually awake.
              Replaced with an honest cadence label sourced from the
              same notes block below. No animation, no false trust
              signal. */}
          <div className="chat-card__status">
            <span>Usually replies in hours</span>
          </div>
        </div>

        <p className="chat-card__lede">
          Tap below to open WhatsApp with our chat ready. I’ll see your
          first message arrive with your vessel and dates already
          attached — so I’ll know it’s you, even mid-week at sea.
        </p>

        <a
          className="chat-card__cta"
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="chat-card__cta-icon" aria-hidden>
            <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
              <path d="M19.11 17.42c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.74.91-.91 1.1-.17.19-.34.21-.62.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.19-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.11-.23-.55-.46-.48-.64-.49-.16-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36s-1 .98-1 2.39 1.02 2.77 1.16 2.96c.14.19 2 3.06 4.84 4.29.68.29 1.2.47 1.61.6.68.22 1.29.18 1.78.11.54-.08 1.66-.68 1.9-1.33.24-.65.24-1.21.17-1.33-.07-.12-.26-.19-.54-.33z"/>
              <path d="M16 4a12 12 0 0 0-10.32 18.13L4 28l5.96-1.56A12 12 0 1 0 16 4zm0 22a10 10 0 0 1-5.1-1.4l-.36-.21-3.54.93.94-3.45-.24-.36A10 10 0 1 1 16 26z"/>
            </svg>
          </span>
          <span className="chat-card__cta-label">
            <strong>Open WhatsApp</strong>
            <em>Instant — on George’s phone</em>
          </span>
          {/* 2026-05-20 — Pass 6: ASCII "→" rendered as a thin
              broken arrow in WhatsApp green on iOS Safari.
              2026-05-21 — Pass 7 (Tyler, David): the SVG chevron
              I substituted in Pass 6 read as a different idiom from
              the rest of the Cabin, which uses the U+203A single
              angle quotation mark ("›") on every CTA ("Invite your
              group ›", "Manage your group ›", "Continue the brief
              ›"). Reverted to the same glyph for consistency. The
              U+203A character renders cleanly in the WhatsApp
              green at this weight on iOS Safari (it's typographic,
              not ASCII). */}
          <span className="chat-card__cta-arrow" aria-hidden>›</span>
        </a>

        <ul className="chat-card__notes">
          <li>
            <span className="chat-card__note-glyph" aria-hidden>✦</span>
            <span>
              <strong>Before sailing</strong> — replies usually within a
              few hours, sometimes faster.
            </span>
          </li>
          <li>
            <span className="chat-card__note-glyph" aria-hidden>⚓</span>
            <span>
              <strong>During your voyage</strong> — within the hour,
              quicker if it’s urgent. The captain has my number too.
            </span>
          </li>
          <li>
            <span className="chat-card__note-glyph" aria-hidden>✉</span>
            <span>
              <strong>After your voyage</strong> — I’m here. Re-charters,
              referrals, the time capsule arriving in six months — all
              of it goes through this same channel.
            </span>
          </li>
        </ul>
      </section>

      <p className="chat-fallback">
        <em>
          Not on WhatsApp? Reply to any email I’ve sent you, or write
          to{" "}
          <Link href="mailto:george@georgeyachts.com">
            george@georgeyachts.com
          </Link>
          {" "}— I read both with the same care.
        </em>
      </p>

      <style>{`
        .chat-card {
          background: #ffffff;
          border: 1px solid rgba(13, 27, 42, 0.08);
          padding: 26px 26px 22px 26px;
          margin-top: 28px;
        }
        /* 2026-05-23 — Audit pass: column was 56px but the avatar
           is 64px → overflow at every viewport. Also added mobile
           rule below to drop the "Usually replies in hours" status
           to a second line under the name on phones (was colliding
           with the role text at 360-412px). */
        .chat-card__head {
          display: grid;
          grid-template-columns: 64px 1fr auto;
          align-items: center;
          gap: 16px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(13, 27, 42, 0.08);
        }
        @media (max-width: 599.98px) {
          .chat-card__head {
            grid-template-columns: 64px 1fr;
            row-gap: 8px;
          }
          .chat-card__status {
            grid-column: 1 / -1;
            justify-self: start;
          }
        }
        .chat-card__avatar {
          width: 64px;
          height: 64px;
          position: relative;
          display: inline-block;
          flex-shrink: 0;
        }
        .chat-card__avatar-photo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center top;
          border: 2px solid var(--gy-gold);
          box-shadow: 0 4px 12px rgba(13, 27, 42, 0.12);
          background: #fff;
          display: block;
        }
        .chat-card__avatar-badge {
          position: absolute;
          right: -4px;
          bottom: -2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #ffffff;
          padding: 3px;
          object-fit: contain;
          border: 1.5px solid var(--gy-gold);
          box-shadow: 0 2px 6px rgba(13, 27, 42, 0.15);
        }
        .chat-card__name {
          font-family: var(--gy-font-editorial);
          font-size: 18px;
          font-weight: 400;
          color: var(--gy-navy);
        }
        .chat-card__role {
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
          margin-top: 2px;
        }
        .chat-card__status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--gy-font-ui);
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(13, 27, 42, 0.55);
        }
        /* .chat-card__dot + chat-pulse keyframes removed in Pass 6 —
           see the comment above on the .chat-card__status block.
           Honest cadence label only, no animated presence dot. */

        .chat-card__lede {
          font-family: var(--gy-font-editorial);
          font-size: 15px;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.75);
          margin: 22px 0 24px 0;
        }

        .chat-card__cta {
          display: grid;
          grid-template-columns: 40px 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 18px 22px;
          background: #25D366; /* WhatsApp green */
          color: #ffffff;
          text-decoration: none;
          border: 1px solid #1FB053;
          transition: background 160ms ease, transform 120ms ease;
        }
        .chat-card__cta:hover { background: #20c25c; }
        .chat-card__cta:active { transform: scale(0.99); }
        .chat-card__cta-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          color: #ffffff;
        }
        .chat-card__cta-label strong {
          display: block;
          font-family: var(--gy-font-ui);
          font-size: 13px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .chat-card__cta-label em {
          display: block;
          font-style: italic;
          font-family: var(--gy-font-editorial);
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.92);
          margin-top: 2px;
        }
        .chat-card__cta-arrow {
          font-family: var(--gy-font-editorial);
          font-size: 22px;
          color: #ffffff;
          padding-left: 8px;
        }

        .chat-card__notes {
          list-style: none;
          padding: 0;
          margin: 24px 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .chat-card__notes li {
          display: grid;
          grid-template-columns: 24px 1fr;
          gap: 12px;
          align-items: flex-start;
        }
        .chat-card__note-glyph {
          font-size: 16px;
          line-height: 1.4;
          color: var(--gy-gold);
          text-align: center;
        }
        .chat-card__notes strong {
          font-family: var(--gy-font-editorial);
          font-weight: 500;
          color: var(--gy-navy);
          margin-right: 4px;
        }
        .chat-card__notes li > span:last-child {
          font-family: var(--gy-font-editorial);
          font-size: 14.5px;
          line-height: 1.65;
          color: rgba(13, 27, 42, 0.75);
        }

        .chat-fallback {
          font-family: var(--gy-font-editorial);
          font-style: italic;
          font-size: 13px;
          color: rgba(13, 27, 42, 0.55);
          margin: 22px 0 0 0;
          text-align: center;
        }
        .chat-fallback a {
          color: var(--gy-gold);
          text-decoration: none;
          border-bottom: 1px solid currentColor;
        }
      `}</style>
    </article>
  );
}
