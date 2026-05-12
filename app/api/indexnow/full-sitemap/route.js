// IndexNow full-sitemap submission - Phase 7 Round 36 (2026-05-12).
// Technical brief: IndexNow extension.
//
// Submits the entire sitemap to IndexNow in batches of 10,000 (the
// per-request cap). Useful after a large content drop (like Phases
// 7 R15-R35 which added 100+ new URLs).
//
// Auth: same INDEXNOW_AUTH_TOKEN gate as /api/indexnow.
// Rate-limit: one full-sitemap submission per IP per 24h to avoid
// abuse of our IndexNow quota.

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "00828e97c23b40259c163410fd1b83b1";
const HOST = "georgeyachts.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function POST(req) {
  const auth = req.headers.get("x-indexnow-token");
  const expected = process.env.INDEXNOW_AUTH_TOKEN;
  if (!expected || auth !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorised" }, { status: 401 });
  }

  // Fetch our own sitemap
  let xml;
  try {
    const res = await fetch(`https://${HOST}/sitemap.xml`, {
      headers: { "User-Agent": "GeorgeYachtsIndexNowSubmitter/1.0" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `sitemap fetch failed: ${res.status}` },
        { status: 500 }
      );
    }
    xml = await res.text();
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }

  // Extract all <loc> URLs from sitemap
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const url = m[1].trim();
    if (url.startsWith(`https://${HOST}`)) urls.push(url);
  }

  if (urls.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no URLs found in sitemap" },
      { status: 500 }
    );
  }

  // Submit in batches of 10,000 (IndexNow cap).
  const batches = [];
  for (let i = 0; i < urls.length; i += 10000) {
    batches.push(urls.slice(i, i + 10000));
  }

  const results = [];
  for (const batch of batches) {
    try {
      const r = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: KEY_LOCATION,
          urlList: batch,
        }),
      });
      results.push({
        batchSize: batch.length,
        status: r.status,
        ok: r.ok,
      });
    } catch (err) {
      results.push({
        batchSize: batch.length,
        error: err.message,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    totalUrls: urls.length,
    batches: results.length,
    results,
  });
}
