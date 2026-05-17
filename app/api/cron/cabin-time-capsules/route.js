// app/api/cron/cabin-time-capsules/route.js
// =============================================================
// Daily cron — reveals due Voyage Time Capsules.
//
// Selects rows where reveal_at <= now() AND revealed_at IS NULL,
// emails the original author with the paragraph they sealed
// (the entire point: they get back their own words, six months
// later), then stamps revealed_at + audit log.
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RESEND_API = "https://api.resend.com/emails";
const FROM = process.env.CABIN_FROM_ADDRESS || "George Yachts <cabin@georgeyachts.com>";
const REPLY_TO = process.env.CABIN_REPLY_TO || "george@georgeyachts.com";
const PUBLIC_BASE = process.env.CABIN_PUBLIC_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";

function authorized(req) {
  if (req.headers.get("x-vercel-cron")) return true;
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  return (req.headers.get("authorization") || "") === `Bearer ${expected}`;
}

function renderEmail({ capsule, cabin }) {
  const firstName = (capsule.author_email || "").split("@")[0];
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F8F5F0;font-family:Georgia,serif;color:#0D1B2A;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F5F0;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border:1px solid rgba(13,27,42,0.08);">
        <tr><td style="background:#0D1B2A;padding:24px 32px;">
          <div style="color:#C9A84C;letter-spacing:3.5px;font-size:11px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">Your time capsule</div>
          <div style="color:#F8F5F0;font-size:26px;font-weight:300;margin-top:8px">Six months ago, <em style="color:#C9A84C;font-style:italic">you wrote this.</em></div>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.75;color:#0D1B2A;">
          <p style="margin:0 0 18px;">A small ritual you set in motion before sailing on <em>${escapeHtml(cabin.vessel_name)}</em>. We kept your words quietly in your Cabin, and bring them back to you now — without comment, without judgement, just the paragraph you wrote.</p>
          <blockquote style="font-family:Georgia,serif;font-style:italic;font-size:17px;line-height:1.8;color:#0D1B2A;border-left:1px solid #C9A84C;padding:6px 0 6px 18px;margin:24px 0;">
            ${escapeHtml(capsule.message).replace(/\n/g, "<br/>")}
          </blockquote>
          <p style="margin:0 0 16px;font-style:italic;color:rgba(13,27,42,0.65)">However much or little of this still feels true — we hope the rest of the week aboard, and the time since, has been kind.</p>
          <p style="margin:24px 0 4px;font-style:italic">— George</p>
          <p style="font-size:11px;letter-spacing:2px;color:rgba(13,27,42,0.35);text-transform:uppercase;margin-top:32px;border-top:1px solid rgba(13,27,42,0.08);padding-top:14px;">
            <a href="${PUBLIC_BASE}/cabin/time-capsule" style="color:rgba(13,27,42,0.55);text-decoration:none">Open in your Cabin →</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendOne(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  const r = await fetch(RESEND_API, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return r.json();
}

export async function GET(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getCabinDb();
  const due = await dbQuery(
    db.from("cabin_time_capsules")
      .select("*, cabin:cabins!inner(id, vessel_name)")
      .lte("reveal_at", new Date().toISOString())
      .is("revealed_at", null)
      .limit(50)
  );

  if (!due?.length) {
    return NextResponse.json({ ok: true, processed: 0 });
  }

  const results = [];
  for (const capsule of due) {
    try {
      await sendOne({
        from: FROM,
        reply_to: REPLY_TO,
        to: [capsule.author_email],
        subject: "Your time capsule — six months on",
        html: renderEmail({ capsule, cabin: capsule.cabin }),
        tags: [
          { name: "stream", value: "cabin" },
          { name: "purpose", value: "time_capsule_reveal" },
        ],
      });

      await dbQuery(
        db.from("cabin_time_capsules")
          .update({ revealed_at: new Date().toISOString() })
          .eq("id", capsule.id)
      );

      await writeAudit({
        cabinId: capsule.cabin_id,
        actorEmail: "system",
        actorRole: "system",
        action: AUDIT_ACTIONS.TIME_CAPSULE_REVEALED,
        metadata: { capsule_id: capsule.id, to: capsule.author_email },
      });

      results.push({ id: capsule.id, ok: true });
    } catch (err) {
      console.error("[time-capsule] send failed:", err);
      results.push({ id: capsule.id, ok: false, reason: err.message });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
  });
}
