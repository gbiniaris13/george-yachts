// Content pipeline bot - Phase 7 Round 32 (2026-05-12).
// Technical brief Priority 3D.
//
// Detects new keyword opportunities. The brief assumes GSC API
// access; the free path is to monitor (1) Google Search Console
// export when George provides one, and (2) the existing target
// keyword backlog from our own /lib/articleSeo + glossarySeo data.
//
// Output: Telegram alerts when a tracked keyword shows momentum,
// or when we detect a content gap (high-intent query with no
// matching page).
//
// Optional: when ANTHROPIC_API_KEY is set, generate a content outline
// for each detected gap.

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
import { ARTICLES } from "@/lib/articleSeo";
import { GLOSSARY_TERMS } from "@/lib/glossarySeo";
import { DESTINATION_COMPARISONS } from "@/lib/destinationComparisonSeo";

// Manually-curated backlog of keywords we should target but don't
// have dedicated pages for yet. Reviewed weekly by the cron.
const TARGET_KEYWORD_BACKLOG = [
  { keyword: "yacht charter Mykonos 8 guests", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Mykonos 12 guests", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Santorini couples", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Greece under 50000", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Greece under 100000", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Greece family with children", intent: "transactional", priority: "medium" },
  { keyword: "yacht charter Ionian 2 weeks", intent: "transactional", priority: "medium" },
  { keyword: "yacht charter Athens to Mykonos", intent: "transactional", priority: "medium" },
  { keyword: "yacht charter Greece corporate groups", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Greece honeymoon", intent: "transactional", priority: "high" },
  { keyword: "catamaran charter Greece family", intent: "transactional", priority: "medium" },
  { keyword: "superyacht charter Greece August", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Greece with stabilizers", intent: "research", priority: "medium" },
  { keyword: "last minute yacht charter Greece 2026", intent: "transactional", priority: "high" },
  { keyword: "yacht charter Greece American clients", intent: "research", priority: "medium" },
  { keyword: "yacht charter Greece UK clients", intent: "research", priority: "medium" },
  { keyword: "yacht charter Dodecanese Rhodes", intent: "transactional", priority: "medium" },
  { keyword: "yacht charter Sporades Skiathos", intent: "transactional", priority: "low" },
  { keyword: "crewed catamaran charter Cyclades", intent: "transactional", priority: "medium" },
  { keyword: "motor yacht charter Saronic Gulf", intent: "transactional", priority: "medium" },
];

// Determine if a keyword has an existing page that targets it.
// Simple keyword-matching against our data files.
export function findExistingPageForKeyword(keyword) {
  const normalized = keyword.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const tokens = normalized.split(" ").filter((t) => t.length > 2);

  const allPages = [
    ...ARTICLES.map((a) => ({ url: a.urlPath, title: a.h1, kind: "article" })),
    ...GLOSSARY_TERMS.map((t) => ({
      url: `/glossary/${t.slug}`,
      title: t.term,
      kind: "glossary",
    })),
    ...DESTINATION_COMPARISONS.map((c) => ({
      url: c.urlPath,
      title: c.h1,
      kind: "comparison",
    })),
  ];

  let best = null;
  let bestScore = 0;
  for (const p of allPages) {
    const haystack = (p.url + " " + p.title).toLowerCase();
    const score = tokens.filter((t) => haystack.includes(t)).length;
    if (score > bestScore) {
      bestScore = score;
      best = { ...p, score };
    }
  }
  // Need at least 60% token coverage to count as a match.
  if (best && bestScore / tokens.length >= 0.6) return best;
  return null;
}

// Generate a content outline via Claude API. Returns null when
// ANTHROPIC_API_KEY is unset.
export async function generateContentOutline(keyword) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
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
        max_tokens: 1000,
        system:
          "You are a content strategist for George Yachts, a luxury crewed yacht charter broker in Athens, Greece. Create SEO-optimized content outlines for UHNW clients from US, UK, and GCC markets. Brand voice: authoritative, personal, no fluff. Always position George P. Biniaris as the expert. NEVER use em dashes - use hyphens instead.",
        messages: [
          {
            role: "user",
            content: `Create a content outline for a page targeting the keyword: "${keyword}". Include: H1, 3-5 H2 sections, key points per section, recommended schema type, and a "Quick Answer" block (Q&A format, 60 words max).`,
          },
        ],
      }),
    });
    if (!res.ok) return { error: `Claude API HTTP ${res.status}` };
    const data = await res.json();
    return {
      outline: data?.content?.[0]?.text || "",
      model: "claude-3-5-haiku",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    return { error: err.message };
  }
}

// Run the weekly content opportunity check.
export async function runContentOpportunityScan() {
  const summary = {
    runAt: new Date().toISOString(),
    backlogSize: TARGET_KEYWORD_BACKLOG.length,
    gaps: [],
    covered: [],
  };
  for (const target of TARGET_KEYWORD_BACKLOG) {
    const existing = findExistingPageForKeyword(target.keyword);
    if (existing) {
      summary.covered.push({ ...target, existing });
    } else {
      summary.gaps.push(target);
    }
  }
  // Store snapshot
  try {
    await kv.set("content_pipeline:last_scan", summary, { ex: 60 * 60 * 24 * 14 });
  } catch {}
  return summary;
}

// Telegram digest.
export async function notifyContentOpportunities(summary) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  if (!summary.gaps || summary.gaps.length === 0) return;

  // Top 5 gaps by priority
  const order = { high: 0, medium: 1, low: 2 };
  const top = [...summary.gaps]
    .sort((a, b) => order[a.priority] - order[b.priority])
    .slice(0, 5);

  const lines = top.map((g, i) => `${i + 1}. _${g.priority}_  *${g.keyword}*`).join("\n");

  const message =
    `*Content Opportunity Scan*\n\n` +
    `Backlog: ${summary.backlogSize} target keywords\n` +
    `Covered: ${summary.covered.length}\n` +
    `Gaps: ${summary.gaps.length}\n\n` +
    `*Top priority gaps:*\n${lines}\n\n` +
    `Run /admin/content-pipeline to draft outlines.`;
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
