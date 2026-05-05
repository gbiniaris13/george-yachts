// J.2 (Roberto brief, May 2026) — Partner-portal helpers.
//
// Free-tier auth: magic-link via Resend (already configured for the
// newsletter), sessions in Vercel KV (already configured), allow-list
// in env var PARTNER_PORTAL_ALLOWED_EMAILS (comma-separated). No
// passwords, no third-party auth provider, zero recurring cost.
//
// Session shape (KV):
//   key:  partner:session:<token>
//   val:  { email, partnerName, expires } as JSON, TTL 7 days
//   key:  partner:magic:<otp>
//   val:  { email, expires } as JSON, TTL 15 min

import crypto from "crypto";
import { kvGet, kvSet, kvDel } from "@/lib/kv";

const SESSION_TTL_SECONDS = 7 * 24 * 3600;
const OTP_TTL_SECONDS = 15 * 60;
export const SESSION_COOKIE = "gy_partner_session";

export function partnerAllowList() {
  const raw = process.env.PARTNER_PORTAL_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isPartnerAllowed(email) {
  const list = partnerAllowList();
  if (list.length === 0) return false;
  return list.includes(String(email).trim().toLowerCase());
}

export function partnerNameFor(email) {
  // Optional mapping via env: PARTNER_PORTAL_NAMES="email:Name|email:Name"
  const raw = process.env.PARTNER_PORTAL_NAMES || "";
  const map = {};
  raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [e, n] = pair.split(":").map((p) => p.trim());
      if (e && n) map[e.toLowerCase()] = n;
    });
  return map[String(email).trim().toLowerCase()] || "";
}

export function makeOtp() {
  return crypto.randomBytes(24).toString("base64url");
}

export function makeSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export async function createMagicLink(email) {
  const otp = makeOtp();
  const payload = JSON.stringify({
    email: String(email).trim().toLowerCase(),
    expires: Date.now() + OTP_TTL_SECONDS * 1000,
  });
  await kvSet(`partner:magic:${otp}`, payload, OTP_TTL_SECONDS);
  return otp;
}

export async function consumeMagicLink(otp) {
  if (!otp) return null;
  const raw = await kvGet(`partner:magic:${otp}`);
  if (!raw) return null;
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data?.expires || Date.now() > data.expires) {
      await kvDel(`partner:magic:${otp}`);
      return null;
    }
    await kvDel(`partner:magic:${otp}`);
    return data.email || null;
  } catch {
    return null;
  }
}

export async function createSession(email) {
  const token = makeSessionToken();
  const payload = JSON.stringify({
    email: String(email).trim().toLowerCase(),
    partnerName: partnerNameFor(email),
    expires: Date.now() + SESSION_TTL_SECONDS * 1000,
  });
  await kvSet(`partner:session:${token}`, payload, SESSION_TTL_SECONDS);
  return token;
}

export async function readSession(token) {
  if (!token) return null;
  const raw = await kvGet(`partner:session:${token}`);
  if (!raw) return null;
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data?.expires || Date.now() > data.expires) {
      await kvDel(`partner:session:${token}`);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function destroySession(token) {
  if (!token) return;
  try { await kvDel(`partner:session:${token}`); } catch {}
}
