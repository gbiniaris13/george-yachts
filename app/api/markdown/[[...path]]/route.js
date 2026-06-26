// /api/markdown/[[...path]] — internal endpoint that serves a
// Markdown representation of any published page on the site. Reached
// from the public URL pattern /:path*/index.md via the rewrite in
// next.config.mjs. Bots that scan for the de-facto Markdown
// convention (/about-us/index.md, /yachts/m-y-genny/index.md, …)
// get clean prose with zero HTML chrome.
//
// Why catch-all instead of `?path=...`: Next.js 15's rewrite engine
// silently dropped captured params when the substitution sat inside
// a query value with a leading literal (`?path=/:path*` gave us an
// empty `path` query at runtime, every mirror returning the
// homepage). Moving the capture into the URL pathname
// (`/api/markdown/:path*`) and reading it back from the catch-all
// params works reliably across both dev and prod.
//
// Cache: 1 hour matches the lowest revalidate window across the
// site. Sanity-backed paths (yachts, blog) get fresh data at
// most an hour stale; static / programmatic paths are pure code
// so revalidation just bumps the CDN entry.

import { NextResponse } from "next/server";
import { pathToMarkdown } from "@/lib/markdown-serializers";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(_req, { params }) {
  // Next.js 15 — params is async. Catch both shapes defensively so
  // the route survives a future "always sync params" reversal too.
  const resolved = (await params) || {};
  const segments = Array.isArray(resolved.path) ? resolved.path : [];
  const rawPath = segments.length ? `/${segments.join("/")}` : "/";

  let markdown;
  try {
    markdown = await pathToMarkdown(rawPath);
  } catch (err) {
    console.error("[api/markdown] serialiser threw:", err);
    return new NextResponse("# Internal error\n\nMarkdown generation failed.\n", {
      status: 500,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  if (!markdown) {
    return new NextResponse(
      "# Not found\n\nNo Markdown representation for this path.\n",
      {
        status: 404,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
      },
    );
  }

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // 2026-06-26 — Markdown mirrors exist for AI consumers, not search
      // indexes. noindex keeps them fully crawlable (AI bots can still
      // fetch via the /:path*/index.md rewrite) while stopping the
      // plain-text twin from competing with the canonical HTML page for
      // indexing (duplicate-content hygiene). X-Robots-Tag affects search
      // indexing only, not AI fetching.
      "X-Robots-Tag": "noindex",
      // Tell the CDN it can cache for an hour (matches revalidate).
      // SWR for a day so a stale read is served while we refresh.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
