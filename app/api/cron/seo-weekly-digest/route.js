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
import { fetchAiVisibility } from "@/lib/ai-visibility";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SITE_URL = "https://georgeyachts.com";

// Visitor analytics live in the CRM Supabase (same DB the site's
// /api/track writes every session to). Read-only here.
const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

// Bucket an already-classified referrer label into a channel group.
function sourceGroup(label) {
  const s = (label || "").toLowerCase();
  if (/chatgpt|openai|perplexity|claude|gemini|copilot|you\.com|phind/.test(s)) return "ai";
  if (/google|bing|duckduckgo|ecosia|yahoo|brave|search/.test(s)) return "search";
  if (/linkedin|instagram|facebook|twitter|x\.com|tiktok|youtube|reddit|threads/.test(s)) return "social";
  if (!label || s.includes("direct") || s.includes("bookmark")) return "direct";
  if (s.includes("georgeyachts")) return "internal";
  return "referral";
}

// Pull the last 7 days of visitor sessions and aggregate by source so
// the digest can show WHERE real visitors came from and WHAT they did
// on-site (yacht views, CTA taps, hot leads). First-party data — no
// external API, no auth beyond the CRM key we already hold.
// George (2026-07-03): "θέλω να ξέρω από πού μπήκανε και τι πατάνε."
async function fetchTrafficSources() {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/sessions?select=referrer,cta_clicks,yachts_viewed,is_hot_lead,lead_captured&started_at=gte.${since}&limit=8000`,
      {
        headers: {
          apikey: CRM_SUPABASE_KEY,
          Authorization: `Bearer ${CRM_SUPABASE_KEY}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows)) return null;
    const per = {};
    const groups = { ai: 0, search: 0, social: 0, direct: 0, referral: 0, internal: 0 };
    let totalVisits = 0, totalHot = 0, totalLeads = 0;
    for (const r of rows) {
      const label = r.referrer || "Direct / Bookmark";
      const g = sourceGroup(label);
      groups[g] = (groups[g] || 0) + 1;
      totalVisits++;
      if (r.is_hot_lead) totalHot++;
      if (r.lead_captured) totalLeads++;
      const p = (per[label] = per[label] || { visits: 0, yachtViews: 0, cta: 0, hot: 0, leads: 0 });
      p.visits++;
      p.yachtViews += Array.isArray(r.yachts_viewed) ? r.yachts_viewed.length : 0;
      p.cta += r.cta_clicks || 0;
      if (r.is_hot_lead) p.hot++;
      if (r.lead_captured) p.leads++;
    }
    return { totalVisits, totalHot, totalLeads, groups, per };
  } catch {
    return null;
  }
}

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
    trafficData,
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
    fetchTrafficSources().catch(() => null),
  ]);

  // 2026-05-11 — AI visibility check via Gemini free tier
  // (replaces Otterly AI €150/mo). Runs after the parallel block
  // because it self-rate-limits to 1.5s between queries to stay
  // within Gemini's 60 RPM free cap. Total runtime ~25 seconds
  // for 12 queries which is acceptable in a weekly cron.
  const aiVisibility = await fetchAiVisibility().catch(() => null);

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

  // ── Traffic sources: where visitors came from & what they did ───
  // George (2026-07-03): "θέλω να ξέρω από πού μπήκανε και τι πατάνε."
  // First-party session analytics, split by channel with the AI block
  // always shown so the AI-referral channel stays visible even at zero.
  if (trafficData && trafficData.totalVisits > 0) {
    const t = trafficData;
    const pick = (labels) =>
      labels.map((l) => [l, t.per[l]]).filter(([, v]) => v && v.visits > 0);
    const engStr = (v) =>
      [v.yachtViews ? `${v.yachtViews} yacht views` : null, v.cta ? `${v.cta} CTA` : null, v.hot ? `${v.hot} hot` : null]
        .filter(Boolean)
        .join(", ");

    lines.push("🌐 *Where visitors came from* — last 7 days");
    lines.push(
      `• ${fmt(t.totalVisits)} visits · ${t.totalHot} hot lead${t.totalHot === 1 ? "" : "s"}${t.totalLeads ? ` · ${t.totalLeads} captured` : ""}`,
    );

    // AI assistants — the channel George most wants to watch.
    const ai = pick(["ChatGPT", "Gemini", "Perplexity", "Claude", "Copilot"]);
    lines.push(`🤖 AI assistants: ${fmt(t.groups.ai || 0)} visit${(t.groups.ai || 0) === 1 ? "" : "s"}`);
    if (ai.length) {
      for (const [l, v] of ai) {
        const e = engStr(v);
        lines.push(`   — ${l}: ${v.visits}${e ? ` (${e})` : ""}`);
      }
    } else {
      lines.push("   — none tracked this week (a share hides in Direct, see note)");
    }

    // Search
    const search = pick(["Google Search", "Bing", "DuckDuckGo", "Ecosia"]);
    if (search.length) {
      lines.push(`🔍 Search: ${fmt(t.groups.search || 0)} visits`);
      for (const [l, v] of search.slice(0, 3)) {
        const e = engStr(v);
        lines.push(`   — ${l}: ${v.visits}${e ? ` (${e})` : ""}`);
      }
    }

    // Social
    const social = pick(["LinkedIn", "Instagram", "Facebook", "Twitter/X", "TikTok", "YouTube", "Reddit"]);
    if (social.length) {
      lines.push(
        `🔗 Social: ${social.slice(0, 5).map(([l, v]) => `${l} ${v.visits}`).join(" · ")}`,
      );
    }

    // Direct / bookmark
    const direct = t.per["Direct / Bookmark"];
    if (direct) {
      const e = engStr(direct);
      lines.push(`📌 Direct / bookmark: ${direct.visits}${e ? ` (${e})` : ""}`);
    }

    lines.push(
      "_Note: ChatGPT and some in-app browsers strip the referrer, so the AI number is a floor — a share of Direct is really AI-driven._",
    );
    lines.push("");
  }

  // ── AI Visibility (Gemini free-tier sampling, V3) ───────────────
  // Free replacement for Otterly AI / Frase / similar paid trackers.
  // Sends 10 representative yacht-charter queries to Gemini and
  // counts how often "georgeyachts.com" or our brand name appears
  // in the AI's answer. Shows direction-of-travel week over week.
  if (aiVisibility && aiVisibility.ok) {
    const s = aiVisibility.summary;
    const pct = Math.round(s.mentionRate * 100);
    lines.push("🤖 *AI Visibility* (Gemini sample, 10 queries)");
    lines.push(
      `• Mentioned in ${s.mentionedIn}/${s.totalQueries} answers (${pct}%)`,
    );
    lines.push(
      `• Competitor mentions: ${s.competitorMentions} across all answers`,
    );
    // Surface up to 2 queries where we did get mentioned (good news)
    const wins = (aiVisibility.perQuery || []).filter((p) => p.mentions).slice(0, 2);
    for (const w of wins) {
      const qShort = w.q.slice(0, 60);
      lines.push(`   ✅ "${qShort}"`);
    }
    lines.push("");
  } else if (aiVisibility && aiVisibility.reason === "no_api_key") {
    // Don't shout when the key isn't set; just note quietly.
    lines.push(
      "_🤖 AI visibility tracker idle — set GOOGLE_GEMINI_API_KEY to enable._",
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
