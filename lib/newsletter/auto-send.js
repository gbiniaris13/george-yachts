// Full-auto newsletter orchestrator.
//
// One entry point per stream, called by the bridge (Tue) and wake (Thu)
// crons. End to end, with no human in the loop:
//
//   1. Cadence gate (research rhythm: 2/mo Jan–Mar, 1/mo otherwise).
//   2. In-flight guard — never start a new issue while the previous one
//      is still draining through the Resend daily cap.
//   3. Select content (new yacht > fresh fitting article > rotation yacht).
//   4. Compose the draft via the existing compose endpoint (full §13
//      validator + routing matrix), with the Telegram card suppressed.
//   5. If blocked by the validator or no content → email George, send
//      NOTHING. (This is what makes full-auto safe: only real Sanity
//      data ships, and anything the validator flags is held back.)
//   6. Send via Resend (suppression + dedup + daily-cap queue aware).
//   7. Email George a confirmation (NOT Telegram, per his instruction).
//
// SAFE ROLLOUT: unless AUTO_SEND_ENABLED=true, the orchestrator runs in
// DRY RUN — it composes the real draft and emails George a full preview,
// but sends nothing. Flip the env var in Vercel to go live.

import { shouldFireToday } from "./auto-cadence";
import {
  selectContentForStream,
  markYachtShown,
  markPostShown,
} from "./content-selector";
import { sendDraftAuto } from "./send-draft";
import { sendOpsEmail } from "./ops-email";
import { listInFlight } from "./quota";
import { buildNewsletterEmail } from "./email-template";
import { unsubscribeUrlFor } from "./resend";
import { kvGet } from "@/lib/kv";

const STREAM_LABEL = {
  bridge: "Bridge (clients)",
  wake: "Wake (travel agents)",
};

async function getLastSendAt(stream) {
  try {
    const v = await kvGet(`last_send_at:${stream}`);
    return v ? (typeof v === "string" ? v : String(v)) : null;
  } catch {
    return null;
  }
}

// Refuse to start a new issue while a previous one for the same stream
// is still being drained by the daily flush cron.
async function streamStillFlushing(stream) {
  const inflight = (await listInFlight()) ?? [];
  if (!Array.isArray(inflight) || inflight.length === 0) return null;
  for (const draftId of inflight) {
    try {
      const raw = await kvGet(`draft:${draftId}`);
      if (!raw) continue;
      const d = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (d?.stream !== stream) continue;
      if (d?.status === "sent" || d?.status === "aborted") continue;
      return { draftId, status: d.status, issue_number: d.issue_number ?? "?" };
    } catch {
      /* skip malformed */
    }
  }
  return null;
}

export async function runAutoSend(stream, { now = new Date(), force = false } = {}) {
  const label = STREAM_LABEL[stream] ?? stream;
  // LIVE by default (George approved go-live 2026-06-23). Kill switch:
  // set AUTO_SEND_ENABLED=false (or 0/off/no) in Vercel to pause back to
  // preview-only dry-run. Unset or "true" = sends for real.
  const flag = String(process.env.AUTO_SEND_ENABLED ?? "true").trim().toLowerCase();
  const liveEnabled = !(flag === "false" || flag === "0" || flag === "off" || flag === "no");

  // 1. Cadence gate
  const lastSent = await getLastSendAt(stream);
  const gate = shouldFireToday(now, lastSent);
  if (!gate.fire && !force) {
    return { ok: true, action: "skipped", stream, gate };
  }

  // 2. In-flight guard
  const flushing = await streamStillFlushing(stream);
  if (flushing && !force) {
    await sendOpsEmail({
      subject: `Auto-newsletter deferred - previous ${label} issue still sending`,
      lines: [
        `The ${label} newsletter was due, but issue #${flushing.issue_number} is still`,
        `draining through the Resend daily cap (status: ${flushing.status}).`,
        ``,
        `No new issue started. It will resume automatically and the next`,
        `scheduled run will check again.`,
      ],
    });
    return { ok: true, action: "deferred_in_flight", stream, flushing };
  }

  // 3. Select content
  const sel = await selectContentForStream(stream, now);
  if (!sel.ok) {
    await sendOpsEmail({
      subject: `Auto-newsletter - nothing to send (${label})`,
      lines: [
        `The ${label} newsletter was due (${gate.cadence}) but no content was available.`,
        `Reason: ${sel.reason}`,
        ``,
        `Add a yacht (with at least one photo) in Sanity, or publish a fitting article.`,
      ],
    });
    return { ok: true, action: "no_content", stream, reason: sel.reason };
  }
  const { plan } = sel;

  // 4. Compose the draft (reuses the full validator + routing; Telegram
  //    card suppressed because this path notifies by email).
  const proxySecret =
    process.env.NEWSLETTER_PROXY_SECRET ||
    process.env.NEWSLETTER_UNSUB_SECRET ||
    process.env.CRON_SECRET;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyachts.com";
  const composeUrl = `${base}/api/admin/newsletter-compose?key=${encodeURIComponent(
    proxySecret,
  )}`;
  const composeBody = {
    content_type: plan.content_type,
    audience: [stream],
    suppress_telegram: true,
    ...(plan.yacht_slug ? { yacht_slug: plan.yacht_slug } : {}),
    ...(plan.post_slug ? { post_slug: plan.post_slug } : {}),
  };

  let compose;
  try {
    const r = await fetch(composeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(composeBody),
      cache: "no-store",
    });
    compose = await r.json();
  } catch (err) {
    await sendOpsEmail({
      subject: `Auto-newsletter - compose failed (${label})`,
      lines: [`Content: ${plan.label}`, `Error: ${String(err?.message || err)}`],
    });
    return {
      ok: false,
      action: "compose_failed",
      stream,
      error: String(err?.message || err),
    };
  }

  const draftResult = compose?.results?.[0];
  const draftId = draftResult?.draft_id;
  if (!draftId || draftResult?.status === "blocked") {
    await sendOpsEmail({
      subject: `Auto-newsletter - HELD BACK by validator (${label})`,
      lines: [
        `Content: ${plan.label}`,
        `Status: ${draftResult?.status || "no draft created"}`,
        `Violations: ${
          (draftResult?.violations || []).map((v) => v.rule).join("; ") || "-"
        }`,
        ``,
        `Nothing was sent. The item will be retried on the next scheduled run.`,
      ],
    });
    return { ok: false, action: "blocked", stream, draftResult };
  }

  // 5. DRY RUN unless explicitly enabled — email George the EXACT rendered
  //    newsletter (true-fidelity HTML, the same builder Resend ships), so
  //    his review matches what subscribers receive. Nothing goes out.
  if (!liveEnabled) {
    const draftRaw = await kvGet(`draft:${draftId}`);
    const d = draftRaw
      ? typeof draftRaw === "string"
        ? JSON.parse(draftRaw)
        : draftRaw
      : {};
    const built = buildNewsletterEmail({
      stream,
      subject: d.subject,
      preheader: d.preheader,
      body_text: d.body_text,
      hero_image_url: d.hero_image_url,
      unsubscribe_url: unsubscribeUrlFor("george@georgeyachts.com", {
        list: stream,
      }),
    });
    await sendOpsEmail({
      subject: `[DRY RUN · not sent] ${d.subject || "Auto-newsletter"} - ${label} → ${draftResult.audience_size ?? "?"} subscribers`,
      html: built.html,
      lines: [
        `DRY RUN - this exact email would go to ${draftResult.audience_size ?? "?"} ${label} subscribers (${gate.cadence} cadence, last send ${gate.days_since_last ?? "never"}d ago). Nothing was sent.`,
        `Sending is PAUSED (AUTO_SEND_ENABLED is set falsy). Remove it / set it true in Vercel to resume live sends.`,
        ``,
        built.text || d.body_text || "",
      ],
    });
    return { ok: true, action: "dry_run", stream, draftId, content: plan.label };
  }

  // 6. Live send
  const send = await sendDraftAuto(draftId);

  // 7. Mark content shown only after a real (started) send.
  if (send.ok) {
    if (plan.mark?.type === "yacht") await markYachtShown(stream, plan.mark.id);
    else if (plan.mark?.type === "post")
      await markPostShown(stream, plan.mark.slug);
  }

  // 8. Email confirmation.
  const lines = [
    `Stream: ${label}`,
    `Content: ${plan.label}  [${plan.content_type}]`,
    `Status: ${send.status || (send.ok ? "sent" : "error")}`,
    `Delivered: ${send.sent ?? 0} / ${send.recipients ?? 0}`,
    `Suppressed / already-received: ${send.suppressed ?? 0}`,
    `Failed: ${send.failed ?? 0}`,
  ];
  if (send.queued) {
    lines.push(
      `Queued for tomorrow's 00:30 UTC flush (Resend daily cap): ${send.queued}`,
    );
  }
  if (send.failures?.length) {
    lines.push("", ...send.failures.map((f) => `• ${f.email}: ${f.error}`));
  }
  await sendOpsEmail({
    subject: send.ok
      ? `Auto-newsletter sent - ${label} (${send.sent ?? 0} delivered)`
      : `Auto-newsletter ERROR - ${label}`,
    lines,
  });

  return { ok: send.ok, action: "sent", stream, draftId, send };
}
