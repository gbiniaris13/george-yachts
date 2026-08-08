/**
 * One way in to Search Console, with a working fallback.
 *
 * lib/seo-apis.js authenticates with a Google service account read from
 * GOOGLE_SERVICE_ACCOUNT_B64. That variable is not set, which means every
 * Search Console section of the weekly digest has been silently returning
 * null rather than failing loudly.
 *
 * The path that does work is the one used to pull GSC data by hand: George's
 * own Google account, via the OAuth refresh token already stored in the CRM
 * settings table for Gmail. The token is exchanged for a short-lived access
 * token on each call and never cached to disk.
 *
 * Service account first, because if it is ever configured it is the more
 * appropriate credential for a machine. Refresh token second, because today
 * it is the only one that answers.
 */

import crypto from "crypto";

export const GSC_SITE = "sc-domain:georgeyachts.com";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const SUPA_URL = process.env.CRM_SUPABASE_URL;
const SUPA_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function viaServiceAccount() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_B64;
  if (!raw) return null;
  let sa;
  try {
    sa = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  } catch {
    return null;
  }
  if (!sa.client_email || !sa.private_key) return null;

  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: sa.token_uri || TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${head}.${body}`);
  signer.end();
  const assertion = `${head}.${body}.${b64url(signer.sign(sa.private_key))}`;

  const res = await fetch(sa.token_uri || TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) return null;
  return (await res.json())?.access_token || null;
}

async function readRefreshToken() {
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

async function viaRefreshToken() {
  const refresh = await readRefreshToken();
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

export async function getGscAccessToken() {
  return (await viaServiceAccount()) || (await viaRefreshToken());
}
