// Competitor intelligence - Phase 7 Round 31 (2026-05-12).
// Technical brief Priority 3C.
//
// Weekly competitor monitoring via sitemap diff. The Ahrefs MCP is
// a Claude-side tool, not available in Vercel runtime - we ship a
// free, server-side approach that fetches each competitor's
// sitemap.xml, compares against the previous snapshot stored in
// Vercel KV, and pings George via Telegram about new pages.
//
// For deeper backlink intel (which requires Ahrefs API), George
// runs the Ahrefs MCP queries manually in Claude when needed.
//
// FREE only. No subscriptions, no API keys required.

// Phase 7 R36 hotfix: use existing lib/kv REST wrapper (no @vercel/kv dep).
import { kvGet, kvSet } from "@/lib/kv";

const kv = {
  get: async (key) => {
    const raw = await kvGet(key);
    if (raw == null) return null;
    if (typeof raw === "object") return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  },
  set: async (key, value, opts) => {
    const ttl = opts?.ex || opts?.EX || null;
    return kvSet(key, typeof value === "string" ? value : JSON.stringify(value), ttl);
  },
};

export const COMPETITORS = [
  { domain: "sailaway.gr", label: "Sailaway" },
  { domain: "vernicos.com", label: "Vernicos" },
  { domain: "istion.com", label: "Istion" },
  { domain: "atalantaseascape.com", label: "Atalanta Seascape" },
  { domain: "greekcharters.com", label: "Greek Charters" },
  { domain: "theluxurycharters.com", label: "The Luxury Charters" },
];

// Fetch and parse a sitemap.xml URL. Recurses into sitemap index
// files (some competitors split into multiple sitemaps). Returns
// an array of URL strings, capped at 1000 to keep KV writes light.
export async function fetchSitemapUrls(domain) {
  const candidates = [
    `https://${domain}/sitemap.xml`,
    `https://www.${domain}/sitemap.xml`,
    `https://${domain}/sitemap_index.xml`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; GeorgeYachtsCompetitorMonitor/1.0)",
        },
        // 8-second timeout per fetch
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      return await parseSitemapXml(xml, domain);
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function parseSitemapXml(xml, domain) {
  // Detect sitemap-index (contains <sitemap> elements pointing to
  // child sitemaps).
  if (/<sitemapindex\b/i.test(xml)) {
    const childUrls = [];
    const childRe = /<sitemap>\s*<loc>([^<]+)<\/loc>/g;
    let m;
    while ((m = childRe.exec(xml)) !== null && childUrls.length < 12) {
      childUrls.push(m[1].trim());
    }
    const allUrls = [];
    for (const cu of childUrls) {
      try {
        const r = await fetch(cu, {
          signal: AbortSignal.timeout(6000),
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; GeorgeYachtsCompetitorMonitor/1.0)",
          },
        });
        if (r.ok) {
          const childXml = await r.text();
          const urls = extractUrlsFromUrlset(childXml);
          allUrls.push(...urls);
          if (allUrls.length > 1000) break;
        }
      } catch {
        // skip child sitemap on error
      }
    }
    return allUrls.slice(0, 1000);
  }
  // Regular urlset
  return extractUrlsFromUrlset(xml).slice(0, 1000);
}

function extractUrlsFromUrlset(xml) {
  const urls = [];
  const re = /<url>\s*<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

// Compute snapshot diff: new URLs vs previous, removed URLs, total.
export function diffSnapshots(previous, current) {
  const prevSet = new Set(previous || []);
  const currSet = new Set(current || []);
  const newUrls = current.filter((u) => !prevSet.has(u));
  const removedUrls = (previous || []).filter((u) => !currSet.has(u));
  return {
    newUrls,
    removedUrls,
    totalPrev: prevSet.size,
    totalCurr: currSet.size,
    netChange: currSet.size - prevSet.size,
  };
}

// Run the weekly competitor check for all 6 competitors.
export async function runCompetitorCheck() {
  const summary = {
    runAt: new Date().toISOString(),
    competitors: [],
    totalNewPages: 0,
  };

  for (const comp of COMPETITORS) {
    try {
      const urls = await fetchSitemapUrls(comp.domain);
      if (!urls) {
        summary.competitors.push({
          ...comp,
          error: "sitemap not reachable",
        });
        continue;
      }
      const previousKey = `competitor:snapshot:${comp.domain}`;
      let previous = [];
      try {
        previous = (await kv.get(previousKey)) || [];
      } catch {}
      const diff = diffSnapshots(previous, urls);
      summary.totalNewPages += diff.newUrls.length;
      summary.competitors.push({
        ...comp,
        ...diff,
        sampleNew: diff.newUrls.slice(0, 5),
      });
      // Store current snapshot for next week's diff.
      try {
        await kv.set(previousKey, urls, { ex: 60 * 60 * 24 * 60 }); // 60-day TTL
      } catch {}
    } catch (err) {
      summary.competitors.push({
        ...comp,
        error: err.message,
      });
    }
    // Polite delay between competitor fetches
    await new Promise((r) => setTimeout(r, 800));
  }

  return summary;
}

// Telegram digest for the weekly run.
export async function notifyCompetitorDigest(summary) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = summary.competitors.map((c) => {
    if (c.error) {
      return `❌ *${c.label}* (${c.domain})\n   ${c.error}`;
    }
    const sign = c.netChange >= 0 ? "+" : "";
    const newLine = c.newUrls.length > 0
      ? `\n   📄 New: ${c.newUrls.length}` +
        c.sampleNew.slice(0, 3).map((u) => `\n     - ${u.replace(/^https?:\/\/[^/]+/, "")}`).join("")
      : "";
    return `📊 *${c.label}*\n   Sitemap: ${c.totalCurr} URLs (${sign}${c.netChange})${newLine}`;
  });

  const message =
    `*Competitor Weekly Digest*\n` +
    `${new Date(summary.runAt).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })}\n\n` +
    `Total new pages this week: *${summary.totalNewPages}*\n\n` +
    lines.join("\n\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("[competitor-intel] Telegram notify failed:", err?.message);
  }
}
