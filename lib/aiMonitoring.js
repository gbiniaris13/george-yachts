// AI Citation Monitoring - Phase 7 Round 29 (2026-05-12).
// Technical brief Priority 3A.
//
// Tracks whether George Yachts appears in AI engine responses for
// target queries. Stores results in Vercel KV. Alerts via Telegram
// when a query drops George out of the result set.
//
// FREE-tier-only design:
// - Brave Search API (free 2k/month, no card) - works without API
//   key for HTML-mode scraping at modest volume
// - DuckDuckGo HTML (free, no auth) - for organic baseline
// - Optional Perplexity API check (when PERPLEXITY_API_KEY is set)
// - Optional Anthropic Claude check (when ANTHROPIC_API_KEY is set)
//
// Storage model:
//   ai_monitor:queries          Set of monitored query strings
//   ai_monitor:result:<key>     JSON snapshot of last check
//   ai_monitor:history:<query>  List of recent checks (capped at 90)

import { kv } from "@vercel/kv";

// 8 target queries from the brief, plus 4 supplementary ones George
// should rank for. Order matters for the daily check rotation since
// we'll only check 4 per day to stay within free-tier limits.
export const MONITORED_QUERIES = [
  "best yacht charter broker Greece",
  "luxury crewed yacht charter Greek islands",
  "yacht charter Mykonos recommendation",
  "Greek yacht charter cost 2026",
  "APA yacht charter Greece",
  "Ionian yacht charter broker",
  "yacht charter vs Croatia Greece",
  "how much does yacht charter Greece cost",
  // Supplementary - lower priority
  "MYBA contract yacht charter explained",
  "Greek yacht charter Mediterranean comparison",
  "Greek superyacht charter 2026",
  "Greek yacht charter pricing guide",
];

const TARGET_DOMAIN = "georgeyachts.com";
const TARGET_BRAND = "George Yachts";

// Detects if the response mentions George Yachts. Returns
// { mentioned, mentionType, snippet }
export function detectMention(text) {
  if (!text || typeof text !== "string") return { mentioned: false };
  const lower = text.toLowerCase();
  if (lower.includes(TARGET_DOMAIN)) {
    const idx = lower.indexOf(TARGET_DOMAIN);
    return {
      mentioned: true,
      mentionType: "domain",
      snippet: text.slice(Math.max(0, idx - 80), idx + 80),
    };
  }
  if (lower.includes(TARGET_BRAND.toLowerCase()) || lower.includes("george biniaris")) {
    const idx = Math.max(
      lower.indexOf(TARGET_BRAND.toLowerCase()),
      lower.indexOf("george biniaris")
    );
    return {
      mentioned: true,
      mentionType: "brand",
      snippet: text.slice(Math.max(0, idx - 80), idx + 80),
    };
  }
  return { mentioned: false };
}

// Checker: DuckDuckGo HTML search (free, no auth, no rate limit).
// Returns the top results' snippets concatenated for mention scan.
export async function checkDuckDuckGo(query) {
  try {
    const res = await fetch(
      `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; GeorgeYachtsMonitor/1.0; +https://georgeyachts.com)",
        },
      }
    );
    if (!res.ok) {
      return { engine: "duckduckgo", error: `HTTP ${res.status}` };
    }
    const html = await res.text();
    // Extract result snippets - DDG uses class="result__snippet"
    const snippets = [];
    const re = /<a class="result__snippet"[^>]*>(.*?)<\/a>/gs;
    let m;
    while ((m = re.exec(html)) !== null && snippets.length < 10) {
      const text = m[1].replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ");
      snippets.push(text);
    }
    const combined = snippets.join(" | ");
    const mention = detectMention(combined);
    // Position: rank within snippets where domain appears (1-indexed)
    let position = null;
    if (mention.mentioned) {
      const idx = snippets.findIndex((s) =>
        s.toLowerCase().includes(TARGET_DOMAIN) ||
        s.toLowerCase().includes(TARGET_BRAND.toLowerCase())
      );
      if (idx >= 0) position = idx + 1;
    }
    return {
      engine: "duckduckgo",
      query,
      mentioned: mention.mentioned,
      mentionType: mention.mentionType,
      position,
      snippet: mention.snippet,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return { engine: "duckduckgo", query, error: err.message };
  }
}

// Checker: Perplexity API (free tier 5/min). Only runs if env key set.
export async function checkPerplexity(query) {
  if (!process.env.PERPLEXITY_API_KEY) {
    return { engine: "perplexity", query, skipped: "no API key" };
  }
  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [{ role: "user", content: query }],
        temperature: 0.1,
        return_citations: true,
      }),
    });
    if (!res.ok) {
      return { engine: "perplexity", query, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const citations = data?.citations || [];
    const mention = detectMention(text + " " + citations.join(" "));
    return {
      engine: "perplexity",
      query,
      mentioned: mention.mentioned,
      mentionType: mention.mentionType,
      snippet: mention.snippet,
      citations,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return { engine: "perplexity", query, error: err.message };
  }
}

// Checker: Anthropic Claude (when ANTHROPIC_API_KEY available).
export async function checkClaude(query) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { engine: "claude", query, skipped: "no API key" };
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Answer briefly: ${query}. Mention any specific companies, brokers, or websites you would recommend.`,
          },
        ],
      }),
    });
    if (!res.ok) {
      return { engine: "claude", query, error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    const text = data?.content?.[0]?.text || "";
    const mention = detectMention(text);
    return {
      engine: "claude",
      query,
      mentioned: mention.mentioned,
      mentionType: mention.mentionType,
      snippet: mention.snippet,
      response: text.slice(0, 400),
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return { engine: "claude", query, error: err.message };
  }
}

// Run all available checkers for one query.
export async function checkQuery(query) {
  const results = await Promise.allSettled([
    checkDuckDuckGo(query),
    checkPerplexity(query),
    checkClaude(query),
  ]);
  return results.map((r) =>
    r.status === "fulfilled" ? r.value : { engine: "unknown", error: r.reason?.message }
  );
}

// Run all queries (or a subset) and store results.
export async function runDailyCheck(opts = {}) {
  const queries = opts.queries || MONITORED_QUERIES.slice(0, 4); // rotate 4/day
  const summary = {
    runAt: new Date().toISOString(),
    queries: queries.length,
    results: [],
    droppedFromCitations: [], // queries that lost a previous mention
  };

  for (const query of queries) {
    const checks = await checkQuery(query);
    const key = `ai_monitor:result:${slugifyKey(query)}`;
    // Compare with previous run to detect "drop" events
    let previous = null;
    try {
      previous = (await kv.get(key)) || null;
    } catch {}

    const stored = {
      query,
      timestamp: summary.runAt,
      checks,
      anyMention: checks.some((c) => c.mentioned),
    };

    // Detect drops: any engine that previously mentioned but now does not.
    if (previous && previous.checks) {
      for (const prev of previous.checks) {
        const curr = checks.find((c) => c.engine === prev.engine);
        if (prev.mentioned && curr && !curr.mentioned && !curr.error) {
          summary.droppedFromCitations.push({
            query,
            engine: prev.engine,
            previousSnippet: prev.snippet,
          });
        }
      }
    }

    try {
      await kv.set(key, stored, { ex: 60 * 60 * 24 * 90 }); // 90-day TTL
      // Append to history list
      await kv.lpush(`ai_monitor:history:${slugifyKey(query)}`, JSON.stringify(stored));
      await kv.ltrim(`ai_monitor:history:${slugifyKey(query)}`, 0, 89);
    } catch (err) {
      console.error("[ai-monitor] KV write failed:", err?.message);
    }

    summary.results.push(stored);
    // Brief pause to be polite to free-tier limits
    await new Promise((r) => setTimeout(r, 500));
  }

  return summary;
}

function slugifyKey(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Alert helper: Telegram ping when a query drops mentions.
export async function alertDrops(drops) {
  if (!Array.isArray(drops) || drops.length === 0) return;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const lines = drops.map(
    (d) =>
      `🚨 *Dropped*: "${d.query}" on _${d.engine}_\nPrev snippet: ${d.previousSnippet?.slice(0, 120) || "(none)"}`
  );
  const message = `*AI Citation Monitor*\n\n${lines.join("\n\n")}\n\nDashboard: https://georgeyachts.com/admin/ai-monitoring`;
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
  } catch {}
}

export async function getMonitoringScoreboard() {
  const scoreboard = [];
  for (const query of MONITORED_QUERIES) {
    const key = `ai_monitor:result:${slugifyKey(query)}`;
    try {
      const data = await kv.get(key);
      if (data) {
        scoreboard.push(data);
      } else {
        scoreboard.push({ query, checks: [], anyMention: null, notChecked: true });
      }
    } catch {
      scoreboard.push({ query, error: "KV read failed" });
    }
  }
  return scoreboard;
}
