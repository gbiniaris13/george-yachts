/**
 * Read-only Gmail access for george@georgeyachts.com.
 *
 * Written 2026-08-08 for the media-request digest. The site already borrows
 * this account's OAuth refresh token for Search Console (see lib/gscAuth.js);
 * this adds the Gmail read scope on the same credential rather than inventing
 * a second one.
 *
 * Nothing here sends, deletes, labels or modifies anything. It lists and reads.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SUPA_URL = process.env.CRM_SUPABASE_URL;
const SUPA_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

async function refreshToken() {
  if (!SUPA_URL || !SUPA_KEY) return null;
  try {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/settings?key=eq.gmail_refresh_token&select=value`,
      {
        headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    const v = rows?.[0]?.value;
    return typeof v === "string" ? v.replace(/^"|"$/g, "") : null;
  } catch {
    return null;
  }
}

export async function getGmailAccessToken() {
  const refresh = await refreshToken();
  const id = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!refresh || !id || !secret) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: id,
      client_secret: secret,
      refresh_token: refresh,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  return (await res.json())?.access_token || null;
}

const API = "https://gmail.googleapis.com/gmail/v1/users/me";

/** Message ids matching a Gmail search query. */
export async function searchMessages(token, query, max = 25) {
  const url = `${API}/messages?q=${encodeURIComponent(query)}&maxResults=${max}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.messages || []).map((m) => m.id);
}

function decode(b64) {
  if (!b64) return "";
  try {
    return Buffer.from(b64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return "";
  }
}

/** Walk a Gmail payload and return the best plain-text body we can find. */
function extractText(payload) {
  if (!payload) return "";
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decode(payload.body.data);
  }
  if (Array.isArray(payload.parts)) {
    // Prefer text/plain anywhere in the tree; fall back to stripped HTML.
    for (const p of payload.parts) {
      const t = extractText(p);
      if (t) return t;
    }
    for (const p of payload.parts) {
      if (p.mimeType === "text/html" && p.body?.data) {
        return decode(p.body.data)
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<[^>]+>/g, "\n")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/\n{3,}/g, "\n\n");
      }
    }
  }
  if (payload.body?.data) return decode(payload.body.data);
  return "";
}

/** Subject, sender, date and plain-text body for one message. */
export async function getMessage(token, id) {
  const res = await fetch(`${API}/messages/${id}?format=full`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const m = await res.json();
  const headers = Object.fromEntries(
    (m.payload?.headers || []).map((h) => [h.name.toLowerCase(), h.value])
  );
  return {
    id,
    subject: headers.subject || "",
    from: headers.from || "",
    date: headers.date || "",
    body: extractText(m.payload),
  };
}
