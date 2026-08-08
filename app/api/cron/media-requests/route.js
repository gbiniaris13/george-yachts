// /api/cron/media-requests - the daily read of the journalist-request inboxes.
//
// 2026-08-08. Backlinks are the ceiling on this site: Bing Webmaster Tools
// reports ONE referring domain in total. Eight cold pitches to editors went
// out in July, one per day, properly written. Three weeks later they had
// produced nothing, and one polite decline.
//
// Then the actual problem turned up. George is signed up to HARO, Qwoted and
// Source of Sources, and 201 of their emails arrived in ninety days: three
// HARO editions a day, Qwoted daily, SOS daily. Every one of them is filtered
// straight into a label, which means nobody reads any of them. A Qwoted
// request from The Maritime Executive expired unanswered the day before this
// was written.
//
// That is the difference that matters. A cold pitch asks a stranger for a
// favour. A journalist request is someone who has already decided they need a
// source and is asking for one. The second converts many times better, and we
// have been throwing them away three times a day.
//
// This reads the last day of those emails, scores every request block against
// the yacht-charter filter that already exists in lib/haroMonitor.js, and
// sends George one email with the ones worth answering and a draft for each.
// It never replies to anything itself: the pitch has to come from him.

import { NextResponse } from "next/server";
import { getGmailAccessToken, searchMessages, getMessage } from "@/lib/gmailRead";
import { isYachtRelevant, generateHaroDraft } from "@/lib/haroMonitor";
import { emailGeorge, telegramGeorgeFull } from "@/lib/notifyGeorge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SENDERS = [
  "haro@helpareporter.com",
  "peter@sourceofsources.com",
  "notifications@qwoted.com",
  "support@qwoted.com",
  "noreply@connectively.us",
  "noreply@sourcebottle.com",
];

// A request block is worth showing at this score or above. The filter in
// haroMonitor gives 3 per core yacht keyword, 1 per adjacent one and 5 for a
// premium outlet, so 3 is one solid hit and 4+ is a real match.
const MIN_SCORE = 4;

// Blocks shorter than this are navigation furniture, not requests.
const MIN_BLOCK_CHARS = 80;
const MAX_BLOCK_CHARS = 1400;

/**
 * Split a digest into candidate request blocks. HARO, Qwoted and SOS all
 * format differently, so rather than three brittle parsers this takes the
 * common shape: requests are separated by blank lines and each is a paragraph
 * or two. Scoring then does the real work.
 */
function toBlocks(text) {
  return text
    .split(/\n\s*\n+/)
    .map((b) => b.replace(/[ \t]+/g, " ").trim())
    .filter((b) => b.length >= MIN_BLOCK_CHARS && b.length <= MAX_BLOCK_CHARS)
    .filter((b) => !/^(unsubscribe|view (this )?in browser|privacy policy|manage (your )?preferences)/i.test(b));
}

// A deadline in the text is the single most useful thing to surface, because
// a request George sees after it closes is worse than not seeing it at all.
function findDeadline(block) {
  const m = block.match(
    /\b(deadline|respond by|closes?|expires?|submit before)\b[^.\n]{0,60}/i
  );
  return m ? m[0].replace(/\s+/g, " ").trim() : null;
}

function findOutlet(block, subject) {
  // Qwoted and SOS put the outlet in the subject; HARO puts it in the block.
  const fromSubject = subject.match(/^(?:\[SOS\]\s*)?([A-Z][\w .&'|-]{2,40}?):/);
  if (fromSubject) return fromSubject[1].trim();
  const m = block.match(/\b(?:for|from|at)\s+([A-Z][\w .&'-]{2,35}(?:Magazine|Times|Post|Journal|Report|Insider|Today|Digest|News|Review|Executive))/);
  return m ? m[1].trim() : null;
}

export async function GET(req) {
  const secret = req.headers.get("x-cron-secret");
  const isVercelCron = req.headers.get("user-agent")?.includes("vercel-cron");
  if (!isVercelCron && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = await getGmailAccessToken();
  if (!token) {
    await telegramGeorgeFull(
      "⚠️ Media-request digest could not reach Gmail (no access token). Today's journalist requests were not read."
    );
    return NextResponse.json({ ok: false, reason: "no-gmail-token" });
  }

  const from = SENDERS.map((s) => `from:${s}`).join(" OR ");
  const ids = await searchMessages(token, `(${from}) newer_than:1d`, 25);
  if (ids.length === 0) {
    return NextResponse.json({ ok: true, scanned: 0, matched: 0 });
  }

  const seen = new Set();
  const matches = [];

  for (const id of ids) {
    const msg = await getMessage(token, id);
    if (!msg?.body) continue;

    for (const block of toBlocks(msg.body)) {
      const verdict = isYachtRelevant({ queryText: block, summary: msg.subject });
      if (verdict.score < MIN_SCORE) continue;

      // The same request appears in the morning and afternoon editions.
      const key = block.slice(0, 90).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      matches.push({
        source: msg.from.replace(/.*<|>.*/g, "") || msg.from,
        subject: msg.subject,
        outlet: findOutlet(block, msg.subject),
        deadline: findDeadline(block),
        score: verdict.score,
        hits: verdict.hits.slice(0, 5),
        block,
        draft: generateHaroDraft({ queryText: block, summary: msg.subject })?.body || null,
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  const top = matches.slice(0, 8);

  if (top.length === 0) {
    // Silence is the right answer on a day with nothing. George does not need
    // to be told that yachting did not come up.
    return NextResponse.json({ ok: true, scanned: ids.length, matched: 0 });
  }

  const cards = top
    .map(
      (m) => `
      <div style="border:1px solid #e8e4dc;border-left:3px solid #C9A84C;padding:16px 18px;margin:0 0 18px">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#C9A84C">
          ${m.outlet ? m.outlet : m.source}${m.deadline ? ` &middot; ${m.deadline}` : ""}
        </p>
        <p style="margin:0 0 10px;font-size:15px;line-height:1.65;color:#0D1B2A">${m.block.replace(/</g, "&lt;")}</p>
        ${m.draft ? `<details><summary style="cursor:pointer;font-size:12px;color:#C9A84C">Draft answer</summary><p style="margin:10px 0 0;font-size:13px;line-height:1.7;color:#444;white-space:pre-wrap">${m.draft.replace(/</g, "&lt;")}</p></details>` : ""}
      </div>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:680px;color:#0D1B2A">
      <p style="font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#C9A84C;margin:0 0 8px">Journalists asking today</p>
      <h1 style="font-size:23px;font-weight:400;margin:0 0 14px">
        ${top.length} request${top.length === 1 ? "" : "s"} worth answering
      </h1>
      <p style="font-size:14px;line-height:1.7;color:#555;margin:0 0 22px">
        Read from ${ids.length} HARO, Qwoted and Source of Sources emails in the last 24 hours.
        These are the ones that mention yachting, charter or luxury travel. A journalist who
        asks is already looking for a source, which is why these convert where a cold pitch does not.
        Answer from your own account, in your own words; the drafts are only a starting point.
      </p>
      ${cards}
      <p style="font-size:12px;line-height:1.7;color:#888;margin:22px 0 0">
        Nothing here was sent on your behalf. Deadlines are quoted from the request itself where one was stated.
      </p>
    </div>`;

  await emailGeorge({
    subject:
      top.length === 1
        ? `1 journalist request worth answering${top[0].outlet ? `: ${top[0].outlet}` : ""}`
        : `${top.length} journalist requests worth answering today`,
    html,
  });

  return NextResponse.json({
    ok: true,
    scanned: ids.length,
    matched: matches.length,
    sent: top.length,
    outlets: top.map((m) => m.outlet || m.source),
  });
}
