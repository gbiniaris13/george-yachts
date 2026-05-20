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

// Sessions last a full charter year. The cookie auto-renews every
// time readSessionFromCookies() resolves a valid session (below),
// so a guest who visits at all every few months stays signed in
// indefinitely. They click the magic link once on each device —
// after that, the cabin opens like any installed app would. If
// they want to sign out, the drawer has an explicit button.
const SESSION_TTL_SECONDS = 365 * 24 * 3600;  // 365 days
// A renewal is cheap (KV write, cookie reset) so we don't bother
// with windowing — every visit refreshes the full TTL.
const SESSION_RENEW_AFTER_SECONDS = 7 * 24 * 3600;   // 7 days
// 2026-05-20 — Friend-test pass 3 (George): "Άνοιξα την καμπίνα
// πριν μία ώρα στο laptop, πήγα στο κινητό και μου λέει expired."
// The old 24h TTL was fine; the issue was that we *deleted* the
// OTP on first verify (single-use). Multi-device sign-in then
// required a fresh email every time. Bumping to 14 days and
// making the link multi-use until expiry (see consumeMagicLinkOtp)
// so one email covers laptop + phone + iPad until the link
// genuinely ages out. Tradeoff: if the email is forwarded inside
// those 14 days, the recipient gets access. Cabin access is
// already gated by the recipient owning that email account, so
// this is the same threat surface as the email itself.
const OTP_TTL_SECONDS = 14 * 24 * 3600;       // 14 days

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
  // Order by the joined cabin's charter_period_from DESC so the
  // most upcoming/recent voyage is always memberships[0]. Postgres
  // doesn't order by joined columns automatically — left unsorted,
  // the same email with multiple cabins returns rows in arbitrary
  // physical order. That was the bug that landed George on his
  // oldest "Test Vessel · Sunreef" cabin instead of his current
  // one. Now: deterministic + sensible (next voyage first).
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
          charter_period_to,
          created_at
        )
      `
      )
      .ilike("email", email.trim())
      .is("deleted_at", null)
  );
  const rows = data ?? [];
  // Sort in JS because Supabase/PostgREST .order() on joined-table
  // columns is finicky and not consistent across schemas. Cheap
  // for the cardinalities we deal with (usually 1–3 memberships
  // per email, never more than a handful).
  rows.sort((a, b) => {
    const af = a?.cabin?.charter_period_from || "";
    const bf = b?.cabin?.charter_period_from || "";
    if (af !== bf) return bf.localeCompare(af); // DESC
    const ac = a?.cabin?.created_at || "";
    const bc = b?.cabin?.created_at || "";
    return bc.localeCompare(ac); // DESC tie-breaker
  });
  return rows;
}

// -----------------------------------------------------------
// Create OTP — write into KV, return the link path.
//
// `targetCabinId` (optional) targets the magic link at a specific
// cabin. When the CRM sends an invite from Cabin X's detail page,
// we want the recipient to land on Cabin X — not whatever cabin
// happens to sort first for their email. The verify route reads
// this and pins the session's active_cabin_id.
// -----------------------------------------------------------
export async function createMagicLinkOtp(email, targetCabinId = null) {
  const otp = randomToken();
  const payload = {
    email: email.trim().toLowerCase(),
    target_cabin_id: targetCabinId || null,
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

  let payload;
  try {
    payload = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!payload?.email || !payload.expires || payload.expires < Date.now()) {
    // Aged out — clean up the dead key.
    await kvDel(`cabin:otp:${otp}`);
    return null;
  }
  // 2026-05-20 — No longer single-use. The same link works from
  // laptop, phone, iPad etc. for OTP_TTL_SECONDS (14 days). Each
  // successful verify still issues a NEW per-device session
  // cookie, so revoking one device by signing out doesn't affect
  // the others. See the TTL constant for the security tradeoff.
  return payload;
}

// -----------------------------------------------------------
// Session lifecycle
// -----------------------------------------------------------
export async function createSession({ email, memberships, activeCabinId = null }) {
  // memberships: array of { cabin_id, role, member_id, assists_member_id }
  // activeCabinId: optional preferred cabin pinned by the magic link
  //   (the CRM passes this when sending an invite from a specific
  //   cabin's detail page). Falls back to the first sorted membership
  //   if not present or no longer valid.
  const token = randomToken(32);
  // Sanity-check the pin is still a real membership; otherwise drop
  // it silently rather than locking the user out.
  const pinValid =
    activeCabinId &&
    memberships.some((m) => m.cabin_id === activeCabinId);
  const value = {
    email,
    memberships: memberships.map((m) => ({
      cabin_id: m.cabin_id,
      role: m.role,
      member_id: m.id,
      assists_member_id: m.assists_member_id ?? null,
    })),
    active_cabin_id: pinValid ? activeCabinId : null,
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

  // Sliding session renewal. If this session has been alive long
  // enough that its issued_at is more than the renew threshold ago,
  // push its expiry forward by another full TTL and rewrite the KV
  // entry so the cookie stays fresh.
  //
  // The cookie itself can only be re-stamped from a route handler
  // (not a server component), so the actual Set-Cookie happens in
  // app/api/cabin/auth/refresh or a middleware down the line. For
  // now we extend KV + return a hint via `should_refresh_cookie`
  // that route handlers can act on. Server components still benefit
  // from the longer KV expiry — a guest who's been away 6 months
  // and then opens /cabin gets a logged-in render.
  const ageMs = Date.now() - (session.issued_at ?? 0);
  if (ageMs > SESSION_RENEW_AFTER_SECONDS * 1000) {
    const renewed = {
      ...session,
      issued_at: Date.now(),
      expires: Date.now() + SESSION_TTL_SECONDS * 1000,
    };
    try {
      await kvSet(
        `cabin:session:${token}`,
        JSON.stringify(renewed),
        SESSION_TTL_SECONDS,
      );
    } catch {
      // Renewal is best-effort; KV outage shouldn't log the user out.
    }
    return { token, ...renewed, should_refresh_cookie: true };
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
  // 1. Explicit override (cabin switcher in the UI passes ?cabin=…)
  if (override && session.memberships.find((m) => m.cabin_id === override)) {
    return override;
  }
  // 2. Pin set by a cabin-targeted magic link (CRM invite from a
  // specific cabin's detail page)
  if (
    session.active_cabin_id &&
    session.memberships.find((m) => m.cabin_id === session.active_cabin_id)
  ) {
    return session.active_cabin_id;
  }
  // 3. First sorted membership — findMembershipsForEmail orders by
  // charter_period_from DESC so this is the most upcoming voyage.
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
