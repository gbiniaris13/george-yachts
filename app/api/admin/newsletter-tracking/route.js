// Newsletter tracking switch — Resend domain open/click tracking.
//
// 2026-09-03 audit: every issue since April shows opened_total 0 while
// delivered events arrive fine, so the webhook works and the domain
// simply never had open/click tracking enabled. The API key lives only
// in Vercel, hence this server-side switch instead of a dashboard trip.
//
//   GET /api/admin/newsletter-tracking?key=CRON_SECRET            → status
//   GET /api/admin/newsletter-tracking?key=CRON_SECRET&enable=1   → enable both

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RESEND_API = "https://api.resend.com";

async function resend(path, init = {}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not configured");
  const res = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`resend ${path} ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  return body;
}

export async function GET(request) {
  const url = new URL(request.url);
  const auth =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("key");
  if (!process.env.CRON_SECRET || auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const enable = url.searchParams.get("enable") === "1";

  try {
    const list = await resend("/domains");
    const domains = Array.isArray(list?.data) ? list.data : [];
    const results = [];
    for (const d of domains) {
      let after = null;
      if (enable && (!d.open_tracking || !d.click_tracking)) {
        await resend(`/domains/${d.id}`, {
          method: "PATCH",
          body: JSON.stringify({ open_tracking: true, click_tracking: true }),
        });
        after = await resend(`/domains/${d.id}`);
      }
      results.push({
        name: d.name,
        status: d.status,
        open_tracking: after ? after.open_tracking : d.open_tracking,
        click_tracking: after ? after.click_tracking : d.click_tracking,
        changed: Boolean(after),
      });
    }
    return NextResponse.json({ ok: true, enabled_now: enable, domains: results });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }
}
