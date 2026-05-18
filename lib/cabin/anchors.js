// lib/cabin/anchors.js
// =============================================================
// Memory Anchors — touch ⑤
//
// Two responsibilities:
//   1. scheduleAnchorSequence(cabinId)     — called once when a
//      charter completes; queues all the deterministic touchpoints
//      (+1d, +3d, +7d, +30d) plus three RANDOMIZED touchpoints
//      across the following 12 months ("month3_random_photo" etc.).
//
//   2. renderAnchorEmail(anchor, cabin)    — pure function that
//      turns an anchor row into { subject, html, preheader } for
//      the cron sender to ship via Resend.
//
// All scheduling is database-only — the cron at
// /api/cron/cabin-memory-anchors picks up due rows.
// =============================================================

import { getCabinDb, dbQuery } from "./supabase";
import { writeAudit, AUDIT_ACTIONS } from "./audit";

// -----------------------------------------------------------
// Schedule helpers
// -----------------------------------------------------------
function addDays(d, n) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}
function addMonths(d, n) {
  const x = new Date(d);
  x.setUTCMonth(x.getUTCMonth() + n);
  return x;
}
function randomBetween(d1, d2) {
  const a = d1.getTime();
  const b = d2.getTime();
  return new Date(a + Math.random() * (b - a));
}
// 07:00 in Athens time, approximated as 05:00 UTC year-round —
// good enough for an unobtrusive morning touchpoint.
function morningOf(d) {
  const x = new Date(d);
  x.setUTCHours(5, 0, 0, 0);
  return x;
}

// -----------------------------------------------------------
// Schedule the full sequence for a completed cabin. Idempotent
// via UPSERT on (cabin_id, recipient_email, anchor_kind).
// -----------------------------------------------------------
export async function scheduleAnchorSequence(cabinId) {
  const db = getCabinDb();

  const cabin = await dbQuery(
    db.from("cabins")
      .select("id, vessel_name, charter_period_to, principal_charterer_name, principal_charterer_email")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) throw new Error("[anchors] cabin not found: " + cabinId);
  if (!cabin.charter_period_to) {
    throw new Error("[anchors] cabin has no charter_period_to; refusing to schedule");
  }

  const members = await dbQuery(
    db.from("cabin_members")
      .select("email, display_name, consents")
      .eq("cabin_id", cabinId)
      .is("deleted_at", null)
  );

  const end = new Date(cabin.charter_period_to + "T00:00:00Z");
  if (Number.isNaN(end.getTime())) {
    throw new Error("[anchors] cabin.charter_period_to is not a valid YYYY-MM-DD: " + cabin.charter_period_to);
  }
  const nowMs = Date.now();

  // Build the schedule
  const plan = [
    { kind: "day1_album",        when: morningOf(addDays(end, 1)) },
    { kind: "day3_thanks",       when: morningOf(addDays(end, 3)) },
    { kind: "day7_feedback",     when: morningOf(addDays(end, 7)) },
    { kind: "day30_reminder",    when: morningOf(addDays(end, 30)) },
    { kind: "month3_random_photo", when: morningOf(randomBetween(addMonths(end, 2), addMonths(end, 4))) },
    { kind: "month6_random_photo", when: morningOf(randomBetween(addMonths(end, 5), addMonths(end, 7))) },
    { kind: "month11_reengagement", when: morningOf(addMonths(end, 11)) },
    { kind: "annual_anniversary",   when: morningOf(addMonths(end, 12)) },
  ];

  const rows = [];
  for (const m of members ?? []) {
    if (m.consents?.memory_anchors === false) continue;   // honor opt-out
    for (const p of plan) {
      // Skip anchors whose scheduled_for is already in the past —
      // happens when scheduling is (re)run after charter_period_to,
      // e.g. for an old voyage being marked completed today.
      if (p.when.getTime() <= nowMs) continue;
      rows.push({
        cabin_id: cabinId,
        recipient_email: m.email,
        scheduled_for: p.when.toISOString(),
        status: "scheduled",
        anchor_kind: p.kind,
        content_payload: {
          recipient_name: m.display_name || null,
          vessel_name: cabin.vessel_name,
        },
      });
    }
  }

  if (rows.length === 0) return { scheduled: 0 };

  // No native upsert on a multi-column natural key here (Supabase
  // would need a unique constraint), so we wipe and re-insert.
  await dbQuery(
    db.from("cabin_memory_anchors")
      .delete()
      .eq("cabin_id", cabinId)
      .eq("status", "scheduled")
  );
  await dbQuery(db.from("cabin_memory_anchors").insert(rows));

  await writeAudit({
    cabinId,
    actorEmail: "system",
    actorRole: "system",
    action: AUDIT_ACTIONS.MEMORY_ANCHOR_SCHEDULED,
    metadata: { count: rows.length },
  });

  return { scheduled: rows.length };
}

// -----------------------------------------------------------
// Anchor email templates — all share the brand HTML wrapper.
// Returns { subject, html, preheader }.
// -----------------------------------------------------------
const COPY = {
  day1_album: {
    subject: ({ vessel }) => `Your week aboard ${vessel}, in pictures`,
    preheader: () => "The album from your voyage is waiting in your Cabin.",
    body: ({ first }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>Your week is over and what a week it was. The photos are now gathered into a private album in your Cabin — you can scroll through them, download what you love, and share them as you wish.</p>
      <p style="margin-top:24px"><a href="{{LINK}}" class="cabin-cta">Open my album</a></p>
      <p style="margin-top:28px;font-style:italic">With warmth,</p>
      <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:20px">George P. Biniaris</p>
    `,
  },
  day3_thanks: {
    subject: () => "A small thank you, from George",
    preheader: () => "It was a pleasure to be part of your week.",
    body: ({ first }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>It was a pleasure to look after you. The crew speak warmly of your group, and the captain has already asked when you might be back.</p>
      <p>I do not write to you with a question. Just to say <em>thank you</em>. Your Cabin remains open — every photo, every word from your Charter Brief, every quiet detail — for as long as you want to keep it.</p>
      <p style="margin-top:28px;font-style:italic">With warmth,</p>
      <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:20px">George P. Biniaris</p>
    `,
  },
  day7_feedback: {
    subject: () => "How was your week, in your own words?",
    preheader: () => "Three small questions, in your own time.",
    body: ({ first }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>If you have a quiet moment in the coming days, I would love your honest reflection on three small things:</p>
      <ol style="padding-left:18px;line-height:1.9">
        <li>What was your favourite moment of the week?</li>
        <li>Anything we could have done better?</li>
        <li>Anyone in your life who would love a week like yours?</li>
      </ol>
      <p>Reply to this email in any length you like, or none at all. Either is fine.</p>
      <p style="margin-top:28px;font-style:italic">With gratitude,</p>
      <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:20px">George</p>
    `,
  },
  day30_reminder: {
    subject: ({ vessel }) => `Don't forget your photos from ${vessel}`,
    preheader: () => "They are yours, forever.",
    body: ({ first }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>A gentle reminder: the album from your voyage is still in your Cabin. If you have not yet downloaded the full-resolution photos, this is a good moment.</p>
      <p style="margin-top:24px"><a href="{{LINK}}" class="cabin-cta">Open my album</a></p>
      <p style="margin-top:28px;font-style:italic">— George</p>
    `,
  },
  month3_random_photo: {
    subject: () => "A small memory, from Greece",
    preheader: () => "Three months on — a photograph that stayed with us.",
    body: ({ first, vessel }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>Three months ago today, you were aboard <em>${vessel}</em>. Here is a photograph that stayed with us — no reason, no agenda. Just a small remembering.</p>
      <p style="margin-top:24px"><a href="{{LINK}}" class="cabin-cta">See it in my Cabin</a></p>
      <p style="margin-top:28px;font-style:italic">— George</p>
    `,
  },
  month6_random_photo: {
    subject: () => "Half a year, half a world away",
    preheader: () => "A small reminder from the Aegean.",
    body: ({ first }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>Six months since you sailed with us. The sea here is quiet now, and we were thinking of you.</p>
      <p style="margin-top:24px"><a href="{{LINK}}" class="cabin-cta">Open my Cabin</a></p>
      <p style="margin-top:28px;font-style:italic">— George</p>
    `,
  },
  month11_reengagement: {
    subject: () => "Another summer comes",
    preheader: () => "A year since you sailed with us.",
    body: ({ first, vessel }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>Almost a year has passed since you boarded <em>${vessel}</em>. If you are quietly thinking about Greek waters again, you do not need to say anything — your Cabin remembers your preferences, your group, your favourite coves. A single reply to this email is all it takes for us to start.</p>
      <p style="margin-top:28px;font-style:italic">With warmth,</p>
      <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:20px">George</p>
    `,
  },
  annual_anniversary: {
    subject: ({ vessel }) => `One year since ${vessel}`,
    preheader: () => "An anniversary of a quiet kind.",
    body: ({ first, vessel }) => `
      <p>${first ? "Dear " + first + "," : "Dear guest,"}</p>
      <p>Exactly a year ago today, your charter aboard <em>${vessel}</em> was beginning. We hope this finds you well — and the photographs from that week still pleasing you.</p>
      <p style="margin-top:24px"><a href="{{LINK}}" class="cabin-cta">Open my Cabin</a></p>
      <p style="margin-top:28px;font-style:italic">— George</p>
    `,
  },
};

export function renderAnchorEmail(anchor, cabin, link) {
  const tpl = COPY[anchor.anchor_kind];
  if (!tpl) return null;

  const ctx = {
    first: (anchor.content_payload?.recipient_name || "").split(" ")[0],
    vessel: anchor.content_payload?.vessel_name || cabin?.vessel_name || "your charter",
  };

  const bodyHtml = tpl.body(ctx).replaceAll("{{LINK}}", link);
  const subject = tpl.subject(ctx);
  const preheader = tpl.preheader(ctx);

  return { subject, preheader, html: wrap({ preheader, body: bodyHtml }) };
}

// -----------------------------------------------------------
// Re-uses the wrapper from email.js — but keeping a local copy
// so this module has no import cycle on email.js.
// -----------------------------------------------------------
function wrap({ preheader, body }) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F8F5F0;font-family:Georgia,serif;color:#0D1B2A;">
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F5F0;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border:1px solid rgba(13,27,42,0.08);">
          <tr><td style="background:#0D1B2A;padding:24px 32px;">
            <div style="font-family:'Helvetica Neue',Arial,sans-serif;color:#C9A84C;letter-spacing:3.5px;font-size:11px;text-transform:uppercase">George Yachts</div>
            <div style="font-family:Georgia,serif;color:#F8F5F0;font-size:24px;line-height:1.1;margin-top:8px;font-weight:300">The Cabin <em style="color:#C9A84C;font-style:italic">· Filotimo</em></div>
          </td></tr>
          <tr><td style="padding:8px 32px 28px;font-size:15px;line-height:1.75;color:#0D1B2A">
            ${body}
            <style>
              .cabin-cta {
                display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;
                font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:2.5px;font-size:12px;
                padding:14px 28px;border:1px solid #C9A84C;text-transform:uppercase;
              }
            </style>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
