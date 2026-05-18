// lib/cabin/share-tokens.js
// =============================================================
// Tokenised public share links for the Charter preference sheet.
//
// George sends the sheet to the operating team (captain, chef,
// management company, yacht's owner) via /api/cabins/:id/send-
// preference-sheet on gy-command. That endpoint mints a token,
// stores it in KV, and emails the recipient a URL like
//
//   https://georgeyachts.com/cabin/share/<token>
//
// The page at /cabin/share/[token] is whitelisted in middleware
// (no session cookie required) and renders the same brand-styled
// preference sheet that George sees in the CRM — but read-only.
//
// Tokens live in KV at `cabin:share:<token>` with a JSON value:
//   { cabin_id, created_at, expires_at, created_by, sent_to[] }
// TTL defaults to 365 days, long enough that a captain printing
// the sheet a month ahead can still re-open it during the charter.
// =============================================================

import crypto from "crypto";
import { kvGet, kvSet, kvDel } from "@/lib/kv";

const DEFAULT_TTL_SECONDS = 365 * 24 * 3600;

function randomToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export async function createShareToken({
  cabinId,
  createdByEmail,
  sentTo = [],
  ttlSeconds = DEFAULT_TTL_SECONDS,
}) {
  if (!cabinId) throw new Error("[share-tokens] cabinId required");
  const token = randomToken();
  const payload = {
    cabin_id: cabinId,
    created_at: Date.now(),
    expires_at: Date.now() + ttlSeconds * 1000,
    created_by: createdByEmail || null,
    sent_to: Array.isArray(sentTo) ? sentTo : [],
  };
  await kvSet(`cabin:share:${token}`, JSON.stringify(payload), ttlSeconds);
  return { token, ...payload };
}

export async function readShareToken(token) {
  if (!token || typeof token !== "string") return null;
  const raw = await kvGet(`cabin:share:${token}`);
  if (!raw) return null;
  let payload;
  try {
    payload = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!payload?.cabin_id) return null;
  if (payload.expires_at && payload.expires_at < Date.now()) {
    await kvDel(`cabin:share:${token}`);
    return null;
  }
  return payload;
}

export async function revokeShareToken(token) {
  if (!token) return;
  await kvDel(`cabin:share:${token}`);
}
