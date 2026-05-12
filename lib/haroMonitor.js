// HARO / Connectively / Qwoted monitor - Phase 7 Round 30 (2026-05-12).
// Technical brief Priority 3B.
//
// Parses journalist-request digest emails (HARO, Connectively,
// Qwoted, ProfNet, SourceBottle) for yacht-charter-relevant queries.
// Generates draft pitch responses in George's voice. Telegram pings
// George with the high-value queries.
//
// Integration flow (manual setup):
//   1. George enables Gmail filter: from HARO sender addresses ->
//      forward to a Cloudflare Email Routing address that POSTs to
//      /api/webhooks/haro
//   2. OR George pastes the raw digest body into the admin interface
//      at /admin/haro-process and gets back filtered + drafted output
//      he can copy into HARO directly
//
// Free, no external paid services required.

// Keywords that signal a query is yacht-charter-relevant. Order
// matters - longer phrases first so we can detect specific niches.
const RELEVANT_KEYWORDS = [
  "luxury yacht charter",
  "superyacht charter",
  "crewed yacht charter",
  "yacht charter",
  "yacht broker",
  "yacht chartering",
  "sailing holiday",
  "sailing charter",
  "Greek islands",
  "greek charter",
  "mediterranean cruise",
  "mediterranean charter",
  "ionian",
  "cyclades",
  "saronic",
  "mykonos charter",
  "santorini charter",
  "luxury travel greece",
  "UHNW travel",
  "family office travel",
  "private boat charter",
  "yacht hire",
];

// Phrases that indicate the query is about a UHNW-relevant topic
// even without the word "yacht" - if the journalist is asking about
// luxury Mediterranean experiences, we still want to know.
const ADJACENT_KEYWORDS = [
  "luxury greek travel",
  "ultra wealthy travel",
  "high net worth holiday",
  "private mediterranean experience",
  "celebrity charter",
  "luxury island hopping",
];

// HARO-style emails come with consistent structures. Different
// digest providers use different separators. The patterns below
// cover the common formats.
const QUERY_SEPARATORS = [
  /^\d+\)\s+Summary:\s+/m,    // HARO: "1) Summary: ..."
  /^Query\s+\d+:/m,            // Connectively
  /^QUERY:\s*/m,
  /^\s*\*+\s*/m,               // asterisk separators
  /^_+$/m,                      // underscore lines
];

// HARO request structure - extracts the query block.
const HARO_BLOCK_RE = /Summary:\s+([^\n]+)[\s\S]*?Category:\s+([^\n]+)[\s\S]*?Email:\s+([^\s]+)[\s\S]*?Media Outlet:\s+([^\n]+)[\s\S]*?Deadline:\s+([^\n]+)[\s\S]*?Query:\s*([\s\S]*?)(?=\n\s*\d+\)|$)/g;

export function parseHaroDigest(emailBody) {
  if (!emailBody || typeof emailBody !== "string") return [];
  const queries = [];

  // Try HARO format first
  HARO_BLOCK_RE.lastIndex = 0;
  let match;
  while ((match = HARO_BLOCK_RE.exec(emailBody)) !== null) {
    queries.push({
      summary: match[1].trim(),
      category: match[2].trim(),
      email: match[3].trim(),
      outlet: match[4].trim(),
      deadline: match[5].trim(),
      queryText: match[6].trim().slice(0, 2000),
      source: "haro",
    });
  }

  // Fallback: split on separator patterns and pick anything that
  // looks like a request (has Summary or Subject + Email/Reply).
  if (queries.length === 0) {
    const blocks = emailBody.split(/\n\s*={4,}\s*\n|\n\s*-{6,}\s*\n/);
    for (const block of blocks) {
      const summaryMatch = block.match(/Summary:\s*([^\n]+)/i) ||
        block.match(/Subject:\s*([^\n]+)/i);
      const emailMatch = block.match(/(?:Email|Reply[-\s]?to):\s*([^\s]+)/i);
      if (summaryMatch) {
        queries.push({
          summary: summaryMatch[1].trim(),
          category: (block.match(/Category:\s*([^\n]+)/i) || [])[1]?.trim() || "Unknown",
          email: emailMatch?.[1]?.trim() || null,
          outlet: (block.match(/(?:Media Outlet|Publication|For):\s*([^\n]+)/i) || [])[1]?.trim() || null,
          deadline: (block.match(/Deadline:\s*([^\n]+)/i) || [])[1]?.trim() || null,
          queryText: block.slice(0, 2000),
          source: "generic",
        });
      }
    }
  }

  return queries;
}

export function isYachtRelevant(query) {
  if (!query) return { relevant: false, score: 0 };
  const haystack = `${query.summary || ""} ${query.category || ""} ${query.queryText || ""}`.toLowerCase();
  let score = 0;
  const hits = [];
  for (const k of RELEVANT_KEYWORDS) {
    if (haystack.includes(k.toLowerCase())) {
      score += 3;
      hits.push(k);
    }
  }
  for (const k of ADJACENT_KEYWORDS) {
    if (haystack.includes(k.toLowerCase())) {
      score += 1;
      hits.push(k);
    }
  }
  // Bonus for premium outlets
  const premiumOutlets = ["forbes", "bloomberg", "robb report", "boat international", "departures", "wall street journal", "ft.com", "vanity fair"];
  for (const o of premiumOutlets) {
    if (haystack.includes(o)) {
      score += 5;
      hits.push(`outlet:${o}`);
    }
  }
  return {
    relevant: score >= 3,
    score,
    hits,
  };
}

// Generate a response draft in George's voice based on the query.
// Brief-specified structure: bio + 3-4 sentence expert answer +
// availability for follow-up.
export function generateHaroDraft(query) {
  if (!query) return null;
  const summary = query.summary || "Yacht charter expert response";
  const queryLower = (query.queryText || "").toLowerCase();

  // Topic-aware angle selection
  let expertAngle = "";
  if (queryLower.includes("cost") || queryLower.includes("price")) {
    expertAngle =
      "A 2026 Greek charter on a 35-metre motor yacht runs €120,000-180,000 per week base, plus 30% APA, 12% Greek VAT, and 10-15% crew gratuity - typically a 55% addition to the headline number. Greece is structurally cheaper than the French Riviera (40% premium) and competitive with Croatia at the luxury tier.";
  } else if (queryLower.includes("destination") || queryLower.includes("where") || queryLower.includes("island")) {
    expertAngle =
      "Greek charter geography rewards multi-region itineraries in a single week: the dramatic volcanic Cyclades (Santorini, Mykonos, Folegandros), the green Ionian (Corfu, Lefkada), and the calmer Saronic (Hydra, Spetses) each deliver different cultural and visual experiences. For UHNW buyers prioritising privacy, the Small Cyclades and Dodecanese offer world-class anchorages with fraction of the peak-season traffic.";
  } else if (queryLower.includes("when") || queryLower.includes("season") || queryLower.includes("month")) {
    expertAngle =
      "Greek charter season runs May through October. Peak July-August is the most expensive and most crowded, with the Meltemi wind blowing 20-30 knots in the Cyclades. The value-quality sweet spot is late June or early September - same warm water, far fewer yachts at popular anchorages, and 15-25% lower base rates than peak.";
  } else if (queryLower.includes("trend") || queryLower.includes("2026") || queryLower.includes("forecast")) {
    expertAngle =
      "Q1 2026 booking value is up 23% YoY across the Greek charter market, with UHNW trade-up to 40m+ yachts driving most of the growth (50m+ tier up 41%). July-August 2026 was 78% committed by end of March - the earliest peak fill since 2021. Late September and October Saronic remain the strongest value windows.";
  } else if (queryLower.includes("compare") || queryLower.includes("vs") || queryLower.includes("versus")) {
    expertAngle =
      "Greek vs Croatia is the most-asked comparison in 2026. Greece has 2x the luxury fleet depth at 30m+, better privacy through geographic spread (more alternative anchorages), and 15-20% higher pricing at mid-tier. Croatia wins on shorter cruising distances and bareboat fleet depth. Sophisticated UHNW buyers often do both - Croatia once, Greece annually.";
  } else {
    expertAngle =
      "Greek yacht chartering at the UHNW tier is structurally different from the broader Mediterranean market: deeper crewed fleet (250+ yachts above 24m), lower VAT regime (12% reduced rate vs French effective 10-22%), and more cultural variety per charter week than any other Mediterranean coastline. The bottleneck for 2026 is supply - peak July-August is increasingly closed by Q1.";
  }

  const draft = `Hi,

George P. Biniaris here, Managing Broker of George Yachts (georgeyachts.com) - an IYBA-member boutique luxury crewed yacht charter brokerage based in Athens, Greece. Featured in Forbes (May 2026). Greek-flagged fleet, MYBA-standard contracts.

Re: "${summary.slice(0, 120)}"

${expertAngle}

Happy to provide additional data, specific yacht examples, market figures, or a quote for any reader. Available for follow-up:
- Email: george@georgeyachts.com
- Phone: +30 6970380999 (Athens)
- Website: https://georgeyachts.com

For research depth, see also:
- 2026 market report: https://georgeyachts.com/2026-greek-charter-market-report
- Pricing guide: https://georgeyachts.com/greek-yacht-charter-2026-complete-pricing-guide
- UHNW yacht glossary: https://georgeyachts.com/glossary

Best regards,
George P. Biniaris
Managing Broker, George Yachts Brokerage House
Featured in Forbes - May 2026`;

  return {
    subject: `Re: ${summary} - Expert Response from George P. Biniaris`,
    body: draft,
    queryEmail: query.email,
    queryDeadline: query.deadline,
    queryOutlet: query.outlet,
  };
}

// Process a full digest end-to-end. Returns array of relevant queries
// with their drafts attached. Used by the admin interface and the
// webhook.
export function processHaroDigest(emailBody) {
  const allQueries = parseHaroDigest(emailBody);
  const results = allQueries
    .map((q) => {
      const relevance = isYachtRelevant(q);
      return { ...q, relevance };
    })
    .filter((q) => q.relevance.relevant)
    .map((q) => {
      const draft = generateHaroDraft(q);
      return { ...q, draft };
    })
    .sort((a, b) => b.relevance.score - a.relevance.score);

  return {
    totalQueries: allQueries.length,
    relevantQueries: results.length,
    queries: results,
  };
}

// Telegram notification helper. Sends a compact summary plus the
// top 3 drafts as separate messages so George can act fast.
export async function notifyHaroRelevant(processed) {
  if (!processed || processed.relevantQueries === 0) return;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const headline =
    `📰 *HARO Yacht Queries*\n\n` +
    `${processed.relevantQueries} relevant query${processed.relevantQueries === 1 ? "" : "ies"} from today's digest.\n\n` +
    processed.queries
      .slice(0, 5)
      .map(
        (q, i) =>
          `*${i + 1}.* _${q.outlet || "Unknown outlet"}_ (score ${q.relevance.score})\n` +
          `${q.summary?.slice(0, 100)}\n` +
          `Deadline: ${q.deadline || "?"}\n` +
          `Email: ${q.email || "?"}`
      )
      .join("\n\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: headline,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    // Send top 3 drafts as separate messages (drafts can be long).
    for (const q of processed.queries.slice(0, 3)) {
      if (!q.draft) continue;
      const draftMsg =
        `*Draft for:* ${q.summary?.slice(0, 80)}\n` +
        `*To:* ${q.draft.queryEmail || "(see HARO portal)"}\n` +
        `*Subject:* ${q.draft.subject}\n\n` +
        "```\n" +
        q.draft.body.slice(0, 3500) +
        "\n```";
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: draftMsg,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      });
      // Brief pause between messages to avoid Telegram rate-limit
      await new Promise((r) => setTimeout(r, 500));
    }
  } catch (err) {
    console.error("[haro] Telegram notify failed:", err?.message);
  }
}
