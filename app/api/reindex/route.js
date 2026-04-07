import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SITE_URL = "https://georgeyachts.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Sanity Webhook → Auto-notify Google & Bing when content is published.
 *
 * Sanity sends a POST with:
 *   { _type: "post", slug: "my-article", operation: "create" | "update" | "delete" }
 *
 * We then:
 *   1. Ping Google's sitemap endpoint (instant re-crawl trigger)
 *   2. Submit the specific URL to IndexNow (Bing, Yandex, Naver + Google)
 */
export async function POST(request) {
  try {
    // ── Verify webhook secret ──
    const secret = request.headers.get("x-sanity-webhook-secret");
    if (SANITY_WEBHOOK_SECRET && secret !== SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { _type, slug, operation } = body;

    if (!_type || !slug) {
      return NextResponse.json(
        { error: "Missing _type or slug" },
        { status: 400 }
      );
    }

    // ── Build the full URL based on content type ──
    const url = buildUrl(_type, slug);
    if (!url) {
      return NextResponse.json(
        { error: `Unknown content type: ${_type}` },
        { status: 400 }
      );
    }

    const results = { url, operation: operation || "update", actions: [] };

    // ── 1. Ping Google Sitemap ──
    try {
      const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(
        `${SITE_URL}/sitemap.xml`
      )}`;
      await fetch(googlePing, { method: "GET" });
      results.actions.push({ service: "google-ping", status: "ok" });
    } catch (err) {
      results.actions.push({
        service: "google-ping",
        status: "error",
        message: err.message,
      });
    }

    // ── 2. Submit to IndexNow ──
    if (INDEXNOW_KEY) {
      try {
        const indexNowResponse = await fetch(
          "https://api.indexnow.org/indexnow",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              host: "georgeyachts.com",
              key: INDEXNOW_KEY,
              keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
              urlList: [url],
            }),
          }
        );
        results.actions.push({
          service: "indexnow",
          status: indexNowResponse.ok ? "ok" : "error",
          httpStatus: indexNowResponse.status,
        });
      } catch (err) {
        results.actions.push({
          service: "indexnow",
          status: "error",
          message: err.message,
        });
      }
    } else {
      results.actions.push({
        service: "indexnow",
        status: "skipped",
        message: "INDEXNOW_KEY not configured",
      });
    }

    // ── 3. Ping Bing Sitemap ──
    try {
      const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(
        `${SITE_URL}/sitemap.xml`
      )}`;
      await fetch(bingPing, { method: "GET" });
      results.actions.push({ service: "bing-ping", status: "ok" });
    } catch (err) {
      results.actions.push({
        service: "bing-ping",
        status: "error",
        message: err.message,
      });
    }

    console.log("[reindex]", JSON.stringify(results));
    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error("[reindex] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Map Sanity document types to their public URLs
 */
function buildUrl(type, slug) {
  const routes = {
    post: `/blog/${slug}`,
    yacht: `/yachts/${slug}`,
    destination: `/destinations/${slug}`,
    itinerary: `/yacht-itineraries-greece/${slug}`,
    teamMember: `/team/${slug}`,
  };

  const path = routes[type];
  if (!path) return null;
  return `${SITE_URL}${path}`;
}

/**
 * GET — Health check / manual trigger
 * Usage: /api/reindex?type=post&slug=my-article
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  if (!type || !slug) {
    return NextResponse.json({
      status: "ready",
      message:
        "Reindex webhook is active. POST from Sanity or GET with ?type=post&slug=my-article",
      supportedTypes: ["post", "yacht", "destination", "itinerary", "teamMember"],
    });
  }

  // Manual trigger — create a fake request body and call POST logic
  const fakeRequest = new Request(request.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _type: type, slug, operation: "manual" }),
  });

  return POST(fakeRequest);
}
