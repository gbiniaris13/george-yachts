// /api/indexnow — IndexNow protocol endpoint.
//
// 2026-05-08 (Phase 4, Boss SEO directive). IndexNow is the free
// instant-reindex standard supported by Bing, Yandex, Seznam, Naver
// and used as a signal by Google. One POST notifies all of them at
// once. Cuts indexing latency from days to minutes.
//
// Two modes:
//   1. GET  /api/indexnow              → ping homepage (smoke test)
//   2. POST /api/indexnow { urls: [] } → submit explicit URLs
//   3. POST /api/indexnow {} from Sanity webhook → ping all updated
//      Sanity content URLs (post + yacht detail).
//
// The verification key lives at /public/<key>.txt (public file) so
// IndexNow can confirm we own the domain when we submit URLs.
//
// Secured by INDEXNOW_AUTH_TOKEN env var to prevent spam-submissions
// from a malicious caller. Sanity webhook gets the same token in
// its custom-header config.

import { NextResponse } from "next/server";

const INDEXNOW_KEY = "4245afcd2cc6f34fbc8a0d131febf937";
const HOST = "georgeyachts.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
// IndexNow lets us submit to any participating endpoint and they
// federate to each other. api.indexnow.org is the canonical hub.
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

async function submit(urls) {
  const cleaned = (urls || [])
    .filter((u) => typeof u === "string" && u.startsWith(`https://${HOST}`))
    .slice(0, 10000); // IndexNow per-request cap

  if (cleaned.length === 0) {
    return { ok: false, error: "no-urls" };
  }

  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: cleaned,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    submitted: cleaned.length,
  };
}

export async function GET() {
  // Smoke-test: ping homepage. Useful from a manual curl to confirm
  // the integration before wiring the Sanity webhook.
  const result = await submit([`https://${HOST}/`]);
  return NextResponse.json(result);
}

export async function POST(request) {
  // Auth gate — only fire if the caller carries the shared secret.
  const auth = request.headers.get("x-indexnow-token");
  const expected = process.env.INDEXNOW_AUTH_TOKEN;
  if (expected && auth !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  // Direct mode — caller supplied URLs.
  if (Array.isArray(payload.urls) && payload.urls.length > 0) {
    const result = await submit(payload.urls);
    return NextResponse.json(result);
  }

  // Sanity webhook mode — payload contains `_type` + `slug.current`.
  // We map Sanity types to the relevant public URLs and ping IndexNow.
  // Configure the webhook in Sanity Studio → API → Webhooks with
  // header `x-indexnow-token: <INDEXNOW_AUTH_TOKEN>` and filter
  // `_type in ["post","yacht"]`.
  const urls = [];
  const slug = payload?.slug?.current || payload?.slug || null;
  const type = payload?._type || null;

  if (type === "post" && slug) {
    urls.push(`https://${HOST}/blog/${slug}`);
    urls.push(`https://${HOST}/blog`); // index page also gets fresh signal
    urls.push(`https://${HOST}/llms.txt`); // refresh AI manifest
    urls.push(`https://${HOST}/sitemap.xml`);
  } else if (type === "yacht" && slug) {
    urls.push(`https://${HOST}/yachts/${slug}`);
    urls.push(`https://${HOST}/charter-yacht-greece`);
    urls.push(`https://${HOST}/private-fleet`);
    urls.push(`https://${HOST}/explorer-fleet`);
    urls.push(`https://${HOST}/sitemap.xml`);
  } else {
    return NextResponse.json(
      { ok: false, error: "unknown-type-or-missing-slug", payload },
      { status: 400 },
    );
  }

  const result = await submit(urls);
  return NextResponse.json(result);
}
