// app/api/cabin/admin/voyage-bundle/route.js
// =============================================================
// Admin-triggered "Voyage Bundle" email — George clicks a button
// in gy-command after the charter ends. We generate a single
// beautiful Resend email with:
//   • A warm "Until next time" paragraph from George
//   • Charter details (vessel, dates, ports)
//   • Sealed time capsule reveal date
//   • Links to the Voyage Album with all photos & videos
//   • Links to the Charter Brief copy
// We do NOT generate a real PDF here — the Cabin pages already
// render beautifully and the email links straight back to them.
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { signCabinPhotoUrl } from "@/lib/cabin/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API = "https://api.resend.com/emails";
const FROM = process.env.CABIN_FROM_ADDRESS || "George Yachts <cabin@georgeyachts.com>";
const REPLY_TO = process.env.CABIN_REPLY_TO || "george@georgeyachts.com";
const PUBLIC = process.env.CABIN_PUBLIC_URL || "https://georgeyachts.com";

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  return (req.headers.get("x-cabin-admin-secret") || "") === expected;
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}

async function buildBundleHtml(cabin, photos, capsule) {
  // Show up to 6 photo previews in the email; the rest live in the
  // Cabin. Inline a small grid; signed URLs valid 30 days so the
  // recipient can re-open the email next month.
  const previewItems = await Promise.all(
    photos.slice(0, 6).map(async (p) => ({
      url: await signCabinPhotoUrl(p.storage_path, 60 * 60 * 24 * 30),
      caption: p.caption,
    }))
  );

  const grid = previewItems
    .map(
      (p) => `
      <td style="padding:4px;width:33.33%;vertical-align:top;">
        <img src="${esc(p.url)}" alt="" style="width:100%;display:block;border:1px solid rgba(13,27,42,0.08)" />
        ${p.caption ? `<div style="font-family:Georgia,serif;font-style:italic;font-size:11px;color:rgba(13,27,42,0.55);padding:4px 2px 0;">${esc(p.caption)}</div>` : ""}
      </td>`
    )
    .join("");

  const rows = [];
  for (let i = 0; i < previewItems.length; i += 3) {
    rows.push(`<tr>${previewItems.slice(i, i + 3).map(() => "").join("")}${grid.split("</td>").slice(i, i + 3).map((s) => s + "</td>").join("")}</tr>`);
  }

  // The simpler grid construction (3 columns)
  const rowsClean = (() => {
    const out = [];
    for (let i = 0; i < previewItems.length; i += 3) {
      const cells = previewItems.slice(i, i + 3).map((p) => `
        <td style="padding:4px;width:33.33%;vertical-align:top;">
          <img src="${esc(p.url)}" alt="" style="width:100%;display:block;border:1px solid rgba(13,27,42,0.08)" />
          ${p.caption ? `<div style="font-family:Georgia,serif;font-style:italic;font-size:11px;color:rgba(13,27,42,0.55);padding:4px 2px 0;">${esc(p.caption)}</div>` : ""}
        </td>`).join("");
      out.push(`<tr>${cells}</tr>`);
    }
    return out.join("");
  })();

  const dateRange = `${fmtDate(cabin.charter_period_from)} – ${fmtDate(cabin.charter_period_to)}`;
  const totalCount = photos.length;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F8F5F0;font-family:Georgia,serif;color:#0D1B2A;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F8F5F0;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#FFFFFF;border:1px solid rgba(13,27,42,0.08);">
        <tr><td style="background:#0D1B2A;padding:28px 32px;">
          <div style="color:#C9A84C;letter-spacing:3.5px;font-size:11px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif">Your voyage, kept</div>
          <div style="color:#F8F5F0;font-size:28px;font-weight:300;margin-top:8px">A small <em style="color:#C9A84C;font-style:italic">album</em> from your week.</div>
        </td></tr>
        <tr><td style="padding:32px;font-size:15px;line-height:1.75;">
          <p style="margin:0 0 16px;">Dear ${esc(cabin.principal_charterer_name).split(" ")[0]},</p>
          <p style="margin:0 0 16px;">Your week aboard <em>${esc(cabin.vessel_name)}</em> (${dateRange}) is now part of our quiet archive. Here is a small bundle to remember it by — every photograph and video your group uploaded lives in your Cabin, and will stay there for as long as you’d like to come back.</p>

          ${
            previewItems.length
              ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;">
                  ${rowsClean}
                </table>
                <p style="margin:0 0 16px;font-style:italic;color:rgba(13,27,42,0.6);font-size:13px">
                  ${totalCount > 6 ? `+ ${totalCount - 6} more in your Cabin.` : `That’s all ${totalCount} of them.`}
                </p>`
              : `<p style="font-style:italic;color:rgba(13,27,42,0.6)">Your group didn’t upload photographs this time — no worries. The Cabin stays open for you to add any later.</p>`
          }

          <p style="margin:0 0 16px;">
            <a href="${PUBLIC}/cabin/voyage-album" style="display:inline-block;background:#0D1B2A;color:#F8F5F0;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:2.5px;font-size:11px;font-weight:500;padding:13px 26px;border:1px solid #C9A84C;text-transform:uppercase;">Open the voyage album</a>
          </p>

          ${
            capsule
              ? `<p style="margin:24px 0 8px;font-style:italic;font-family:Georgia,serif;border-left:1px solid #C9A84C;padding-left:14px;color:rgba(13,27,42,0.7);font-size:13.5px">
                  A reminder: you sealed a time capsule on ${fmtDate(capsule.sealed_at?.slice(0,10))}. We’ll quietly bring it back to you on <strong>${fmtDate(capsule.reveal_at?.slice(0,10))}</strong>, in your own words.
                </p>`
              : ""
          }

          <p style="margin:24px 0 4px;font-style:italic">— George</p>
          <p style="font-size:11px;letter-spacing:2px;color:rgba(13,27,42,0.45);text-transform:uppercase;margin-top:24px;border-top:1px solid rgba(13,27,42,0.08);padding-top:14px;">George Yachts · Filotimo · Φιλότιμο</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const cabinId = body?.cabin_id;
  const onlyTo = body?.only_to; // optional, single email
  if (!cabinId) return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "resend-not-configured" }, { status: 500 });
  }

  const db = getCabinDb();

  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, principal_charterer_name, charter_period_from, charter_period_to")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) return NextResponse.json({ ok: false, error: "cabin-not-found" }, { status: 404 });

  const [photos, members, capsule] = await Promise.all([
    dbQuery(
      db.from("cabin_voyage_photos")
        .select("storage_path, caption, created_at")
        .eq("cabin_id", cabinId)
        .is("redacted_at", null)
        .order("created_at", { ascending: true })
        .limit(500)
    ),
    dbQuery(
      db.from("cabin_members")
        .select("email, display_name, consents")
        .eq("cabin_id", cabinId)
        .is("deleted_at", null)
    ),
    dbQuery(
      db.from("cabin_time_capsules")
        .select("sealed_at, reveal_at")
        .eq("cabin_id", cabinId)
        .limit(1)
        .maybeSingle()
    ),
  ]);

  const html = await buildBundleHtml(cabin, photos ?? [], capsule);

  // Recipients: every cabin member who hasn't opted out of essential
  // charter emails. Optionally restrict to a single address (preview
  // mode for George).
  const recipients = (members ?? [])
    .filter((m) => m.consents?.essential_charter_emails !== false)
    .map((m) => m.email.toLowerCase());
  const to = onlyTo ? [String(onlyTo).toLowerCase()] : recipients;
  if (!to.length) {
    return NextResponse.json({ ok: false, error: "no-recipients" }, { status: 400 });
  }

  // One email per recipient so unsubscribe is per-person.
  const results = [];
  for (const recipient of to) {
    try {
      const r = await fetch(RESEND_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          reply_to: REPLY_TO,
          to: [recipient],
          subject: `A small album from your week aboard ${cabin.vessel_name}`,
          html,
          tags: [
            { name: "stream", value: "cabin" },
            { name: "purpose", value: "voyage_bundle" },
          ],
        }),
      });
      const j = await r.json();
      results.push({ email: recipient, ok: r.ok, id: j?.id });
    } catch (e) {
      results.push({ email: recipient, ok: false, error: e.message });
    }
  }

  await writeAudit({
    cabinId,
    actorEmail: "admin",
    actorRole: "admin",
    action: AUDIT_ACTIONS.VOYAGE_BUNDLE_SENT,
    metadata: {
      recipients: to.length,
      sent: results.filter((r) => r.ok).length,
      photo_count: photos?.length ?? 0,
    },
  });

  return NextResponse.json({ ok: true, sent: results.filter((r) => r.ok).length, total: to.length, results });
}
