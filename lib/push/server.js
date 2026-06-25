// lib/push/server.js
// ============================================================
// Web Push — server-only helpers (subscriptions + sending).
//
// SERVER ONLY. Imports the SERVICE_ROLE Supabase client and the
// VAPID PRIVATE key. Never import from a client component.
//
// Storage: the `push_subscriptions` table in the existing
// george-yachts Supabase project (see lib/migrations/
// 2026-06-25-push-subscriptions.sql). Free, no new service.
//
// VAPID private key: env VAPID_PRIVATE_KEY (added in Vercel,
// mirroring the INDEXNOW_AUTH_TOKEN setup). Until it is set,
// sendPushToAll() throws on send but subscribe still works, so the
// feature degrades safely.
// ============================================================

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { VAPID_PUBLIC_KEY } from "./vapidPublicKey";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.CRM_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CRM_SUPABASE_SERVICE_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = "mailto:george@georgeyachts.com";

let _db = null;
export function getPushDb() {
  if (_db) return _db;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("[push] Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  _db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _db;
}

let _vapidReady = false;
function ensureVapid() {
  if (_vapidReady) return;
  if (!VAPID_PRIVATE_KEY) {
    throw new Error(
      "[push] VAPID_PRIVATE_KEY env var is not set (add it in Vercel)."
    );
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  _vapidReady = true;
}

// Persist (upsert) a browser subscription. Same endpoint → updated,
// never duplicated. Re-activates a previously-pruned endpoint.
export async function saveSubscription(sub, { userAgent, page } = {}) {
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    throw new Error("[push] malformed subscription");
  }
  const db = getPushDb();
  const { error } = await db.from("push_subscriptions").upsert(
    {
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      user_agent: userAgent || null,
      page: page || null,
      active: true,
    },
    { onConflict: "endpoint" }
  );
  if (error) throw error;
}

// Send a notification to every active subscription. Dead endpoints
// (404/410 from the push service) are flipped inactive, not deleted,
// so the table stays auditable. Returns { sent, pruned, failed }.
export async function sendPushToAll({ title, body, url, tag } = {}) {
  ensureVapid();
  const db = getPushDb();
  const { data: subs, error } = await db
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("active", true);
  if (error) throw error;

  const payload = JSON.stringify({
    title: title || "George Yachts",
    body: body || "",
    url: url || "https://georgeyachts.com",
    tag: tag || "gy-push",
  });

  let sent = 0;
  let pruned = 0;
  let failed = 0;
  const deadEndpoints = [];

  await Promise.all(
    (subs || []).map(async (s) => {
      const subscription = {
        endpoint: s.endpoint,
        keys: { p256dh: s.p256dh, auth: s.auth },
      };
      try {
        await webpush.sendNotification(subscription, payload);
        sent++;
      } catch (err) {
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          deadEndpoints.push(s.endpoint);
          pruned++;
        } else {
          failed++;
        }
      }
    })
  );

  if (deadEndpoints.length) {
    await db
      .from("push_subscriptions")
      .update({ active: false })
      .in("endpoint", deadEndpoints);
  }
  if (sent) {
    const now = new Date().toISOString();
    await db
      .from("push_subscriptions")
      .update({ last_sent_at: now })
      .eq("active", true);
  }

  return { sent, pruned, failed, total: subs?.length || 0 };
}
