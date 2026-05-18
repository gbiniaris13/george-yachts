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
// ANTHROPIC_API_KEY is unset OR AI_FEATURES_ENABLED is not 'true'.
// Routes through lib/anthropic-client which enforces the
// €10/month cost cap — never hit the Anthropic REST endpoint
// directly from here, the guard test will fail the build.
import { anthropicMessage } from "./anthropic-client.js";
import { CostCapExceeded, AiFeaturesDisabled } from "./cost-cap.js";

export async function generateContentOutline(keyword) {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const data = await anthropicMessage({
      model: "claude-haiku-4-5",
      max_tokens: 1000,
      system:
        "You are a content strategist for George Yachts, a luxury crewed yacht charter broker in Athens, Greece. Create SEO-optimized content outlines for UHNW clients from US, UK, and GCC markets. Brand voice: authoritative, personal, no fluff. Always position George P. Biniaris as the expert. NEVER use em dashes - use hyphens instead.",
      messages: [
        {
          role: "user",
          content: `Create a content outline for a page targeting the keyword: "${keyword}". Include: H1, 3-5 H2 sections, key points per section, recommended schema type, and a "Quick Answer" block (Q&A format, 60 words max).`,
        },
      ],
    });
    return {
      outline: data?.content?.[0]?.text || "",
      model: "claude-haiku-4-5",
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    if (err instanceof CostCapExceeded || err instanceof AiFeaturesDisabled) {
      return { error: err.message, skipped: true };
    }
    return { error: err.message };
  }
}

// Phase 7 R37 - Google Search Console integration stub.
// Activates when both GSC_PROPERTY (e.g. "sc-domain:georgeyachts.com")
// and GOOGLE_SERVICE_ACCOUNT_JSON env vars are configured. Returns
// queries from GSC where impressions > 50/week and position > 15
// (opportunity zone: visible to Google, not yet ranking).
//
// Until env vars set: returns empty array, scan still runs on the
// manual backlog above. Once GSC OAuth is wired the cron auto-picks
// up the additional signals.
export async function fetchGscOpportunities() {
  const propertyId = process.env.GSC_PROPERTY;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!propertyId || !serviceAccountJson) {
    return { opportunities: [], skipped: "GSC env vars not configured" };
  }

  try {
    // Service-account JWT auth flow. Free.
    let parsed;
    try {
      parsed = JSON.parse(serviceAccountJson);
    } catch {
      return { opportunities: [], error: "GOOGLE_SERVICE_ACCOUNT_JSON not valid JSON" };
    }

    // Get OAuth token from Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: await buildGscJwt(parsed),
      }),
    });
    if (!tokenRes.ok) {
      return { opportunities: [], error: `GSC OAuth failed: ${tokenRes.status}` };
    }
    const { access_token: accessToken } = await tokenRes.json();

    // Pull GSC search analytics for last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const until = new Date().toISOString().slice(0, 10);
    const analyticsRes = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyId)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: since,
          endDate: until,
          dimensions: ["query"],
          rowLimit: 500,
        }),
      }
    );
    if (!analyticsRes.ok) {
      return { opportunities: [], error: `GSC analytics failed: ${analyticsRes.status}` };
    }
    const data = await analyticsRes.json();
    const rows = data.rows || [];
    const opportunities = rows
      .filter((r) => r.impressions > 50 && r.position > 15)
      .map((r) => ({
        keyword: r.keys[0],
        impressions: r.impressions,
        position: Math.round(r.position),
        clicks: r.clicks,
        ctr: r.ctr,
      }));
    return { opportunities, total: rows.length };
  } catch (err) {
    return { opportunities: [], error: err.message };
  }
}

// JWT builder for service-account auth. Pure JS, no jsonwebtoken
// dep needed (uses crypto.subtle from Node 18+).
async function buildGscJwt(serviceAccount) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const b64url = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const headerB64 = b64url(header);
  const claimB64 = b64url(claim);
  const unsignedToken = `${headerB64}.${claimB64}`;

  // Sign with service account private key (PEM format)
  const crypto = await import("node:crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);
  const signature = sign.sign(serviceAccount.private_key);
  const signatureB64 = signature
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${signatureB64}`;
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

  // Phase 7 R37 - GSC integration. Auto-detects new opportunities
  // from real Google Search Console data when env vars set.
  const gscData = await fetchGscOpportunities();
  if (gscData.opportunities && gscData.opportunities.length > 0) {
    summary.gscOpportunities = gscData.opportunities.slice(0, 20);
    // Cross-reference: any GSC opportunity that doesn't match an
    // existing page goes into the gaps list as high-priority.
    for (const o of gscData.opportunities) {
      const existing = findExistingPageForKeyword(o.keyword);
      if (!existing) {
        summary.gaps.push({
          keyword: o.keyword,
          intent: "research",
          priority: "high",
          source: "gsc",
          impressions: o.impressions,
          position: o.position,
        });
      }
    }
  } else if (gscData.skipped) {
    summary.gscStatus = gscData.skipped;
  } else if (gscData.error) {
    summary.gscStatus = `error: ${gscData.error}`;
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
