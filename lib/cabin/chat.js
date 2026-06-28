// lib/cabin/chat.js
// =============================================================
// Helpers for the private chat between charterer and George.
// =============================================================

import { getCabinDb, dbQuery } from "./supabase";
import { sendChatNotificationEmail } from "./email";
import { writeAudit, AUDIT_ACTIONS } from "./audit";

const MAX_BODY = 8000;
const NOTIFY_THROTTLE_MIN = 30;

// Match control chars (NUL .. \x1F minus tab/newline/CR, plus DEL).
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export function sanitizeBody(s) {
  if (typeof s !== "string") return "";
  return s.replace(CONTROL_RE, "").replace(/[ \t]+/g, " ").trim().slice(0, MAX_BODY);
}

export async function postMessage({ cabinId, senderEmail, senderRole, body }) {
  const clean = sanitizeBody(body);
  if (!clean) throw new Error("[chat] empty body");
  const db = getCabinDb();
  const row = await dbQuery(
    db.from("cabin_chat_messages")
      .insert({
        cabin_id: cabinId,
        sender_email: senderEmail.toLowerCase(),
        sender_role: senderRole,
        body: clean,
        read_at_charterer: senderRole === "charterer" ? new Date().toISOString() : null,
        read_at_admin:     senderRole === "admin"     ? new Date().toISOString() : null,
      })
      .select()
      .single()
  );
  return row;
}

export async function listMessages({ cabinId, since = null, limit = 200 }) {
  const db = getCabinDb();
  let q = db.from("cabin_chat_messages")
    .select("*")
    .eq("cabin_id", cabinId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (since) q = q.gt("created_at", since);
  return dbQuery(q);
}

export async function markRead({ cabinId, readerRole }) {
  const db = getCabinDb();
  const field = readerRole === "charterer" ? "read_at_charterer" : "read_at_admin";
  await dbQuery(
    db.from("cabin_chat_messages")
      .update({ [field]: new Date().toISOString() })
      .eq("cabin_id", cabinId)
      .is(field, null)
  );
}

async function lastChatNotificationAt(cabinId) {
  const db = getCabinDb();
  const data = await dbQuery(
    db.from("cabin_audit_log")
      .select("created_at")
      .eq("cabin_id", cabinId)
      .eq("action", AUDIT_ACTIONS.CHAT_NOTIFICATION_SENT)
      .order("created_at", { ascending: false })
      .limit(1)
  );
  return data?.[0]?.created_at ?? null;
}

async function recordNotificationSent(cabinId, kind) {
  // Route via writeAudit so the Mitnick "audit must succeed or the
  // action fails" guarantee holds. Throws on insert error.
  await writeAudit({
    cabinId,
    actorEmail: "system",
    actorRole: "system",
    action: AUDIT_ACTIONS.CHAT_NOTIFICATION_SENT,
    metadata: { kind },
  });
}

export async function maybeNotifyOnNewMessage({ cabinId, senderRole }) {
  if (senderRole !== "admin") {
    // 2026-06-01 — Brief 06 cabin-closeout (S4). Was `void …` (fire-and-
    // forget) → the "new Cabin message" Telegram ping to George was
    // dropped on Vercel serverless freeze. AWAIT it (the caller now
    // awaits maybeNotifyOnNewMessage too); guarded so a notify failure
    // can't bubble. The chat message itself is already persisted, so a
    // missed ping is recoverable — George sees it in the cabin chat.
    try {
      await notifyGeorgeViaTelegram(cabinId);
    } catch (e) {
      console.error("[chat] telegram notify error:", e?.message || e);
    }
    return;
  }

  const lastAt = await lastChatNotificationAt(cabinId);
  if (lastAt) {
    const ageMin = (Date.now() - new Date(lastAt).getTime()) / 60000;
    if (ageMin < NOTIFY_THROTTLE_MIN) return;
  }

  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, principal_charterer_email, principal_charterer_name")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) return;

  const member = await dbQuery(
    db.from("cabin_members")
      .select("consents")
      .eq("cabin_id", cabinId)
      .eq("role", "principal_charterer")
      .is("deleted_at", null)
      .maybeSingle()
  );
  if (member?.consents?.essential_charter_emails === false) return;

  try {
    await sendChatNotificationEmail({
      to: cabin.principal_charterer_email,
      displayName: cabin.principal_charterer_name,
      vesselName: cabin.vessel_name,
    });
    await recordNotificationSent(cabinId, "admin_to_charterer");
  } catch (e) {
    console.error("[chat] email notify error:", e.message);
  }
}

async function notifyGeorgeViaTelegram(cabinId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;

  const db = getCabinDb();
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, principal_charterer_name")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) return;

  const text =
    "New Cabin message\n" +
    `From: ${cabin.principal_charterer_name}\n` +
    `Re: ${cabin.vessel_name}\n` +
    `Reply: ${process.env.GY_COMMAND_URL || "https://command.georgeyachts.com"}/dashboard/cabins/${cabinId}/chat`;

  // Dev fallback: with no Telegram secret set, surface the alert
  // in the server console so George can see it during local testing.
  if (!token || !chat) {
    console.log("\n" + "═".repeat(60));
    console.log("📨 CABIN CHAT - new message (Telegram not configured):");
    console.log(text);
    console.log("═".repeat(60) + "\n");
    return;
  }

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!r.ok) {
    console.error("[chat] telegram returned", r.status, await r.text().catch(() => ""));
  }
}

export async function unreadCounts(cabinId) {
  const db = getCabinDb();
  const data = await dbQuery(
    db.from("cabin_chat_messages")
      .select("read_at_charterer, read_at_admin")
      .eq("cabin_id", cabinId)
  );
  return (data ?? []).reduce(
    (acc, m) => ({
      charterer_unread: acc.charterer_unread + (m.read_at_charterer ? 0 : 1),
      admin_unread:     acc.admin_unread     + (m.read_at_admin ? 0 : 1),
    }),
    { charterer_unread: 0, admin_unread: 0 }
  );
}
