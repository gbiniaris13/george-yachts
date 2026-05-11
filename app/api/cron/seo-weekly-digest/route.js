// /api/cron/seo-weekly-digest — weekly SEO digest to Boss via Telegram.
//
// Phase 6 (2026-05-08, Boss directive — automated SEO/AI visibility
// reporting). Fires every Monday at 06:00 UTC (= 09:00 EEST in
// summer / 08:00 EET in winter — Athens working hours both ways).
//
// V1 — fully self-contained data, no external API auth needed:
//   • Sanity posts + yachts (read via shared client)
//   • Sitemap URL count (HEAD/GET our own /sitemap.xml)
//   • Posts missing `quickAnswer` (action item for Boss)
//   • Last 7-day publication activity
//
// V2 (later, when Boss has 15 min): plug in Google Search Console
// API (clicks, impressions, top queries) + Bing Webmaster API
// (AI citation count) for full rankings visibility.
//
// Trigger:
//   • Vercel cron at the schedule in vercel.json
//   • Manual GET (with x-cron-secret header) for smoke testing
//
// Idempotency: no — fires once per week deliberately. Multiple
// firings the same week would double-send the digest. Vercel's
// cron is single-shot so that's a non-issue in production.

import { sanityClient } from "@/lib/sanity";
import { sendTelegram } from "@/lib/telegram";
import { fetchGscWeekly, fetchBingWeekly } from "@/lib/seo-apis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SITE_URL = "https://georgeyachts.com";

function fmt(n) {
  return new Intl.NumberFormat("en-US").format(n);
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function weekRange() {
  const now = new Date();
  const day = now.getUTCDay(); // 0 Sun, 1 Mon...
  const daysSinceMonday = (day + 6) % 7;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - daysSinceMonday);
  monday.setUTCHours(0, 0, 0, 0);
  const lastMonday = new Date(monday);
  lastMonday.setUTCDate(monday.getUTCDate() - 7);
  return {
    from: lastMonday.toISOString(),
    to: monday.toISOString(),
    fromLabel: lastMonday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    toLabel: new Date(monday.getTime() - 86_400_000).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric" },
    ),
  };
}

async function countSitemapUrls() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`, {
      cache: "no-store",
      headers: { "User-Agent": "george-yachts-seo-digest/1.0" },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const matches = xml.match(/<url>/g);
    return matches ? matches.length : null;
  } catch {
    return null;
  }
}

export async function GET(request) {
  // Manual smoke-test gate. Vercel cron sends a special user-agent
  // header — accept that OR a matching CRON_SECRET in x-cron-secret.
  const ua = request.headers.get("user-agent") || "";
  const sig = request.headers.get("x-vercel-signature");
  const customSecret = request.headers.get("x-cron-secret");
  const isVercelCron = ua.startsWith("vercel-cron/") || !!sig;
  const isManualAuthed =
    customSecret && customSecret === process.env.CRON_SECRET;

  if (!isVercelCron && !isManualAuthed) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const { from, to, fromLabel, toLabel } = weekRange();

  // ── Pull from Sanity + GSC + Bing in parallel ────────────────────
  const [
    totalPosts,
    newPostsThisWeek,
    postsMissingQA,
    totalYachts,
    newYachtsThisWeek,
    recentPosts,
    sitemapCount,
    gscData,
    bingData,
  ] = await Promise.all([
    sanityClient
      .fetch(
        `count(*[_type == "post" && defined(slug.current) && defined(publishedAt)])`,
      )
      .catch(() => null),
    sanityClient
      .fetch(
        `count(*[_type == "post" && defined(slug.current) && publishedAt >= $from && publishedAt < $to])`,
        { from, to },
      )
      .catch(() => null),
    sanityClient
      .fetch(
        `count(*[_type == "post" && defined(slug.current) && !defined(quickAnswer)])`,
      )
      .catch(() => null),
    sanityClient
      .fetch(`count(*[_type == "yacht" && defined(slug.current)])`)
      .catch(() => null),
    sanityClient
      .fetch(
        `count(*[_type == "yacht" && defined(slug.current) && _createdAt >= $from && _createdAt < $to])`,
        { from, to },
      )
      .catch(() => null),
    sanityClient
      .fetch(
        `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...5]{
          title, "slug": slug.current, publishedAt, "hasQuickAnswer": defined(quickAnswer)
        }`,
      )
      .catch(() => []),
    countSitemapUrls(),
    fetchGscWeekly().catch(() => null),
    fetchBingWeekly().catch(() => null),
  ]);

  // ── Build Telegram message ───────────────────────────────────────
  const lines = [];
  lines.push("📊 *SEO Weekly Digest* — George Yachts");
  lines.push(`Week of ${fromLabel}–${toLabel}, ${new Date().getFullYear()}`);
  lines.push("");

  lines.push("📝 *Content*");
  lines.push(
    `• ${newPostsThisWeek ?? 0} new posts this week / ${totalPosts ?? "—"} total`,
  );
  lines.push(
    `• ${newYachtsThisWeek ?? 0} new yachts this week / ${totalYachts ?? "—"} total`,
  );
  if (sitemapCount != null) {
    lines.push(`• Sitemap URLs live: ${fmt(sitemapCount)}`);
  }
  lines.push("");

  // ── AI Quick Answer coverage ─────────────────────────────────────
  if (typeof postsMissingQA === "number" && typeof totalPosts === "number") {
    const covered = totalPosts - postsMissingQA;
    const pct = totalPosts > 0 ? Math.round((covered / totalPosts) * 100) : 100;
    lines.push("🤖 *AI Search Coverage*");
    lines.push(
      `• Quick Answer blocks: ${covered}/${totalPosts} posts (${pct}%)`,
    );
    if (postsMissingQA > 0) {
      lines.push(
        `• ⚠️ ${postsMissingQA} post(s) need a Quick Answer — write in Sanity Studio`,
      );
    } else {
      lines.push("• ✅ Every post has a Quick Answer");
    }
    lines.push("");
  }

  // ── Recent posts list ────────────────────────────────────────────
  if (Array.isArray(recentPosts) && recentPosts.length > 0) {
    lines.push("📰 *Most recent posts*");
    for (const p of recentPosts.slice(0, 5)) {
      const qa = p.hasQuickAnswer ? "✅" : "⚠️";
      const titleEsc = String(p.title || "Untitled")
        .replace(/[*_`[\]()]/g, "")
        .slice(0, 70);
      lines.push(`${qa} _${fmtDate(p.publishedAt)}_ — ${titleEsc}`);
    }
    lines.push("");
  }

  // ── Google Search Console (V2) ──────────────────────────────────
  if (gscData) {
    lines.push("🔍 *Google Search* — last 7 days");
    lines.push(
      `• ${fmt(gscData.clicks)} clicks · ${fmt(gscData.impressions)} impressions`,
    );
    lines.push(
      `• Avg position: ${gscData.avgPosition.toFixed(1)} · CTR: ${(gscData.ctr * 100).toFixed(2)}%`,
    );
    if (gscData.topQueries.length > 0) {
      lines.push("• Top queries:");
      for (const q of gscData.topQueries.slice(0, 3)) {
        const qEsc = String(q.query).replace(/[*_`[\]]/g, "").slice(0, 50);
        lines.push(`   — "${qEsc}" · ${q.clicks} clicks · pos ${q.position.toFixed(1)}`);
      }
    }
    if (gscData.topPages.length > 0) {
      const top = gscData.topPages[0];
      lines.push(`• Top page: ${top.page} (${top.clicks} clicks)`);
    }
    lines.push("");
  }

  // ── Bing AI / Search (V2) ───────────────────────────────────────
  if (bingData) {
    lines.push("🤖 *Bing* — last 7 days (feeds ChatGPT)");
    lines.push(
      `• ${fmt(bingData.clicks)} clicks · ${fmt(bingData.impressions)} impressions`,
    );
    lines.push("");
  }

  lines.push("🔗 *Live dashboards*");
  lines.push("• [Search Console](https://search.google.com/search-console?resource_id=sc-domain:georgeyachts.com)");
  lines.push("• [Bing Webmaster](https://www.bing.com/webmasters)");
  lines.push("• [Sanity Studio](https://the-george-yachts-brokerage.sanity.studio)");
  if (!gscData || !bingData) {
    lines.push("");
    const missing = [];
    if (!gscData) missing.push("GSC");
    if (!bingData) missing.push("Bing");
    // Could be (a) env var not set, or (b) API returned null/error
    // (e.g. site not yet propagated, account mismatch, rate-limit).
    // Phrasing kept neutral so the digest doesn't lie about config.
    lines.push(
      `_⚙️ ${missing.join(" + ")} data unavailable this run — usually clears within 24–48h of initial verification._`,
    );
  }

  const message = lines.join("\n");

  // ── Send via Telegram ────────────────────────────────────────────
  let telegramResult = "skipped";
  try {
    await sendTelegram(message);
    telegramResult = "sent";
  } catch (err) {
    telegramResult = `failed: ${err?.message || "unknown"}`;
  }

  return NextResponse.json({
    ok: telegramResult === "sent",
    telegramResult,
    metrics: {
      totalPosts,
      newPostsThisWeek,
      postsMissingQA,
      totalYachts,
      newYachtsThisWeek,
      sitemapCount,
      window: { from, to },
    },
  });
}
