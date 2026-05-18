// lib/cabin/auth.js
// =============================================================
// THE CABIN — magic-link authentication.
//
// Pattern mirrors lib/partner-portal.js: short-lived OTP token
// in KV → swapped for a long-lived session token in KV → set as
// httpOnly cookie. No passwords, no third-party auth provider.
//
// Key differences from partner-portal:
//   • Allow-list is dynamic — anyone present as a cabin_members
//     row gets a magic link (single source of truth = the DB).
//   • Session value carries cabin_id + role so authorization is
//     a single cookie read, no extra DB round-trip on hot paths.
// =============================================================

import crypto from "crypto";
import { cookies } from "next/headers";
import { kvGet, kvSet, kvDel } from "@/lib/kv";
import { getCabinDb, dbQuery } from "./supabase";

const SESSION_TTL_SECONDS = 30 * 24 * 3600;   // 30 days
const OTP_TTL_SECONDS = 24 * 3600;            // 24 hours per the spec

export const SESSION_COOKIE = "gy_cabin_session";

// -----------------------------------------------------------
// Token generation
// -----------------------------------------------------------
function randomToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString("base64url");
}

// -----------------------------------------------------------
// Membership lookup — replaces the partner-portal allow-list
// -----------------------------------------------------------
export async function findMembershipsForEmail(email) {
  const db = getCabinDb();
  const data = await dbQuery(
    db
      .from("cabin_members")
      .select(
        `
        id,
        role,
        email,
        display_name,
        cabin_id,
        assists_member_id,
        cabin:cabins!inner (
          id,
          status,
          vessel_name,
          principal_charterer_name,
          charter_period_from,
          charter_period_to
        )
      `
      )
      .ilike("email", email.trim())
      .is("deleted_at", null)
  );
  return data ?? [];
}

// -----------------------------------------------------------
// Create OTP — write into KV, return the link path
// -----------------------------------------------------------
export async function createMagicLinkOtp(email) {
  const otp = randomToken();
  const payload = {
    email: email.trim().toLowerCase(),
    expires: Date.now() + OTP_TTL_SECONDS * 1000,
  };
  await kvSet(`cabin:otp:${otp}`, JSON.stringify(payload), OTP_TTL_SECONDS);
  return otp;
}

// -----------------------------------------------------------
// Verify OTP — return the payload or null if missing/expired
// -----------------------------------------------------------
export async function consumeMagicLinkOtp(otp) {
  if (!otp || typeof otp !== "string") return null;
  const raw = await kvGet(`cabin:otp:${otp}`);
  if (!raw) return null;
  await kvDel(`cabin:otp:${otp}`); // single-use

  let payload;
  try {
    payload = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!payload?.email || !payload.expires || payload.expires < Date.now()) {
    return null;
  }
  return payload;
}

// -----------------------------------------------------------
// Session lifecycle
// -----------------------------------------------------------
export async function createSession({ email, memberships }) {
  // memberships: array of { cabin_id, role, member_id, assists_member_id }
  const token = randomToken(32);
  const value = {
    email,
    memberships: memberships.map((m) => ({
      cabin_id: m.cabin_id,
      role: m.role,
      member_id: m.id,
      assists_member_id: m.assists_member_id ?? null,
    })),
    issued_at: Date.now(),
    expires: Date.now() + SESSION_TTL_SECONDS * 1000,
  };

  await kvSet(`cabin:session:${token}`, JSON.stringify(value), SESSION_TTL_SECONDS);
  return { token, session: value };
}

export async function readSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const raw = await kvGet(`cabin:session:${token}`);
  if (!raw) return null;

  let session;
  try {
    session = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!session?.expires || session.expires < Date.now()) {
    await kvDel(`cabin:session:${token}`);
    return null;
  }
  return { token, ...session };
}

export async function destroySession(token) {
  if (!token) return;
  await kvDel(`cabin:session:${token}`);
}

// -----------------------------------------------------------
// Cookie helpers — for use in route handlers
// -----------------------------------------------------------
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

// -----------------------------------------------------------
// Pick the "active" cabin for a session.
//
// Most clients will only have one cabin. Those who have multiple
// (returning Filotimo Circle members) can switch — we default to
// the most recent.
// -----------------------------------------------------------
export function pickActiveCabinId(session, override) {
  if (!session?.memberships?.length) return null;
  if (override && session.memberships.find((m) => m.cabin_id === override)) {
    return override;
  }
  return session.memberships[0].cabin_id;
}

// Resolve the role + member_id for a given cabin in the session.
// Use this anywhere we need to authorize an action — NEVER read
// session.memberships[0].role directly, because a user can hold
// multiple memberships at different roles across cabins.
export function resolveMembership(session, cabinId) {
  if (!session?.memberships?.length || !cabinId) return null;
  return session.memberships.find((m) => m.cabin_id === cabinId) || null;
}
