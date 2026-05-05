// J.2 — Logout. POST clears KV session + cookie.

import { destroySession, SESSION_COOKIE } from "@/lib/partner-portal";

export const runtime = "nodejs";

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  const token = m?.[1] || "";
  await destroySession(token);
  const headers = new Headers();
  headers.append("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
  return Response.json({ ok: true }, { headers });
}
