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
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { titleCaseName, prettyDate } from "@/lib/cabin/format";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";
import IntroParagraph from "../../../components/cabin/IntroParagraph";

export const metadata = {
  title: "Chat with George · Your Cabin",
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
  if (cabinId) {
    const db = getCabinDb();
    cabin = await dbQuery(
      db
        .from("cabins")
        .select("vessel_name, charter_period_from, charter_period_to, principal_charterer_name")
        .eq("id", cabinId)
        .maybeSingle()
    );
  }

  const firstName = titleCaseName(
    (cabin?.principal_charterer_name || session.email.split("@")[0])
      .split(" ")[0]
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
          <span className="chat-card__avatar" aria-hidden>
            {/* Brand monogram as the avatar — pure SVG, no asset
                round-trip. Replaceable with a real headshot later. */}
            <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden>
              <circle cx="32" cy="32" r="32" fill="#0D1B2A" />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontStyle="italic"
                fontSize="22"
                fill="#C9A84C"
              >
                GB
              </text>
            </svg>
          </span>
          <div>
            <div className="chat-card__name">George P. Biniaris</div>
            <div className="chat-card__role">Managing Broker · George Yachts</div>
          </div>
          <div className="chat-card__status">
            <span className="chat-card__dot" aria-hidden /> Online
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
          <span className="chat-card__cta-arrow" aria-hidden>→</span>
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
        .chat-card__head {
          display: grid;
          grid-template-columns: 56px 1fr auto;
          align-items: center;
          gap: 16px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(13, 27, 42, 0.08);
        }
        .chat-card__avatar {
          width: 56px;
          height: 56px;
          display: inline-block;
          border-radius: 50%;
          overflow: hidden;
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
        .chat-card__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2f7d3a;
          box-shadow: 0 0 0 3px rgba(47, 125, 58, 0.18);
          animation: chat-pulse 2.4s ease-in-out infinite;
        }
        @keyframes chat-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(47, 125, 58, 0.18); }
          50%      { box-shadow: 0 0 0 6px rgba(47, 125, 58, 0.10); }
        }

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
