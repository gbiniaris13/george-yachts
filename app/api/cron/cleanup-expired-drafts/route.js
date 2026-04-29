// Daily 23:00 UTC — drop newsletter drafts that have aged out.
//
// Brief §9.5: drafts auto-expire after 24h to prevent stale sends.
// We can't TTL keys in Upstash without `EXPIRE` (which we'd need to set
// at write time). Belt-and-braces: this cron walks every `draft:<id>`
// hash, parses the JSON, and DELs anything past `expires_at`.
//
// Auth: Bearer CRON_SECRET (Vercel cron triggers send the header
// automatically when the env var is set on the project).

import { NextResponse } from "next/server";
import { kvGet, kvDel } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function exec(commands) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  const data = await res.json().catch(() => ({}));
  return data?.result;
}

async function scanKeys(pattern) {
  // Upstash Redis SCAN — returns [cursor, keys[]]. Walk until cursor is 0.
  const out = [];
  let cursor = "0";
  for (let i = 0; i < 50; i += 1) {
    const r = await exec(["SCAN", cursor, "MATCH", pattern, "COUNT", "200"]);
    if (!Array.isArray(r) || r.length < 2) break;
    cursor = String(r[0]);
    out.push(...(r[1] ?? []));
    if (cursor === "0") break;
  }
  return out;
}

export async function GET(request) {
  // Auth — Vercel injects the CRON_SECRET header on scheduled invocations.
  // For manual hits, also accept ?key=<CRON_SECRET>.
  const authHeader = request.headers.get("authorization");
  const provided =
    authHeader?.replace(/^Bearer\s+/i, "") ||
    new URL(request.url).searchParams.get("key");
  if (provided !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const keys = await scanKeys("draft:*");
  let deleted = 0;
  let kept = 0;
  let unparseable = 0;
  const now = Date.now();
  for (const key of keys) {
    const raw = await kvGet(key);
    if (!raw) continue;
    let parsed;
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      unparseable += 1;
      continue;
    }
    const expiresAt = parsed?.expires_at
      ? new Date(parsed.expires_at).getTime()
      : null;
    if (!expiresAt || Number.isNaN(expiresAt)) {
      // Defensive — drafts without expires_at are stale by convention.
      await kvDel(key).catch(() => {});
      deleted += 1;
      continue;
    }
    if (expiresAt < now) {
      await kvDel(key).catch(() => {});
      deleted += 1;
    } else {
      kept += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    scanned: keys.length,
    deleted,
    kept,
    unparseable,
    at: new Date().toISOString(),
  });
}
