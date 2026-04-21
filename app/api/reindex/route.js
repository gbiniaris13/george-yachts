import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const SITE_URL = "https://georgeyachts.com";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Verify Sanity HMAC webhook signature.
 * Sanity sends: sanity-webhook-signature: t=TIMESTAMP,v1=SIGNATURE
 * We compute: HMAC-SHA256(secret, "TIMESTAMP.BODY") and compare.
 */
function verifySanitySignature(rawBody, signatureHeader) {
  if (!signatureHeader || !SANITY_WEBHOOK_SECRET) return false;

  try {
    const parts = {};
    for (const pair of signatureHeader.split(",")) {
      const [key, val] = pair.split("=", 2);
      parts[key.trim()] = val;
    }

    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;

    const payloadToSign = `${timestamp}.${rawBody}`;
    const computed = crypto
      .createHmac("sha256", SANITY_WEBHOOK_SECRET)
      .update(payloadToSign)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(signature, "hex")
    );
  } catch (err) {
    console.error("[reindex] Signature verification error:", err);
    return false;
  }
}

/**
 * Sanity Webhook → Full auto-SEO pipeline.
 *
 * Sanity sends a POST with:
 *   { _type: "post", slug: "my-article", operation: "create" | "update" | "delete" }
 *
 * We then:
 *   1. Revalidate affected Next.js pages (instant cache bust)
 *   2. Ping Google's sitemap endpoint
 *   3. Submit the specific URL to IndexNow (Bing, Yandex, Naver + Google)
 *   4. Ping Bing sitemap endpoint
 */
export async function POST(request) {
  try {
    const rawBody = await request.text();

    // ── Verify webhook signature (HMAC) or shared secret fallback ──
    const signatureHeader = request.headers.get("sanity-webhook-signature");
    const legacySecret = request.headers.get("x-sanity-webhook-secret");

    if (signatureHeader) {
      // Sanity HMAC signature verification (preferred)
      if (!verifySanitySignature(rawBody, signatureHeader)) {
        console.error("[reindex] HMAC signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else if (SANITY_WEBHOOK_SECRET && legacySecret !== SANITY_WEBHOOK_SECRET) {
      // Fallback: shared secret header (for backward compatibility)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
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

    // ── 0. Revalidate Next.js cache (instant page updates) ──
    const pathsToRevalidate = getRevalidationPaths(_type, slug);
    const tagsToRevalidate = getRevalidationTags(_type);

    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path);
      } catch (err) {
        console.error(`[reindex] Failed to revalidate path ${path}:`, err);
      }
    }
    for (const tag of tagsToRevalidate) {
      try {
        revalidateTag(tag);
      } catch (err) {
        console.error(`[reindex] Failed to revalidate tag ${tag}:`, err);
      }
    }
    results.actions.push({
      service: "next-revalidate",
      status: "ok",
      paths: pathsToRevalidate,
      tags: tagsToRevalidate,
    });

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
        const urlsToPing = [url, `${SITE_URL}/blog`];
        const indexNowResponse = await fetch(
          "https://api.indexnow.org/indexnow",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              host: "georgeyachts.com",
              key: INDEXNOW_KEY,
              keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
              urlList: urlsToPing,
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
 * Determine which Next.js paths to revalidate based on content type
 */
function getRevalidationPaths(type, slug) {
  const paths = ["/"];  // Always revalidate homepage

  if (type === "post") {
    paths.push(`/blog/${slug}`, "/blog", "/llms.txt");
  } else if (type === "yacht") {
    paths.push(`/yachts/${slug}`, "/private-fleet", "/explorer-fleet");
  } else if (type === "itinerary") {
    paths.push(`/yacht-itineraries-greece/${slug}`, "/yacht-itineraries-greece");
  } else if (type === "teamMember") {
    paths.push(`/team/${slug}`, "/team");
  }

  return paths;
}

/**
 * Determine which Next.js cache tags to revalidate
 */
function getRevalidationTags(type) {
  if (type === "post") return ["posts"];
  if (type === "yacht") return ["yachts"];
  return [];
}

/**
 * Map Sanity document types to their public URLs
 */
function buildUrl(type, slug) {
  const routes = {
    post: `/blog/${slug}`,
    yacht: `/yachts/${slug}`,
    // destination route retired 2026-04-21 — if Sanity still
    // sends destination docs they'll just no-op (path = null)
    itinerary: `/yacht-itineraries-greece/${slug}`,
    teamMember: `/team/${slug}`,
  };

  const path = routes[type];
  if (!path) return null;
  return `${SITE_URL}${path}`;
}

/**
 * GET — Health check / manual trigger (no auth required)
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

  // Manual trigger — run revalidation + pings directly (bypasses auth)
  const url = buildUrl(type, slug);
  if (!url) {
    return NextResponse.json({ error: `Unknown content type: ${type}` }, { status: 400 });
  }

  const results = { url, operation: "manual", actions: [] };

  // Revalidate Next.js cache
  const pathsToRevalidate = getRevalidationPaths(type, slug);
  const tagsToRevalidate = getRevalidationTags(type);

  for (const path of pathsToRevalidate) {
    try { revalidatePath(path); } catch (err) {
      console.error(`[reindex] Failed to revalidate path ${path}:`, err);
    }
  }
  for (const tag of tagsToRevalidate) {
    try { revalidateTag(tag); } catch (err) {
      console.error(`[reindex] Failed to revalidate tag ${tag}:`, err);
    }
  }
  results.actions.push({
    service: "next-revalidate",
    status: "ok",
    paths: pathsToRevalidate,
    tags: tagsToRevalidate,
  });

  // Ping IndexNow
  if (INDEXNOW_KEY) {
    try {
      const indexNowResponse = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "georgeyachts.com",
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: [url],
        }),
      });
      results.actions.push({
        service: "indexnow",
        status: indexNowResponse.ok ? "ok" : "error",
        httpStatus: indexNowResponse.status,
      });
    } catch (err) {
      results.actions.push({ service: "indexnow", status: "error", message: err.message });
    }
  }

  console.log("[reindex] manual:", JSON.stringify(results));
  return NextResponse.json(results, { status: 200 });
}
