// Update 3 §1 + §4 — Bridge auto-cron content selection.
//
// The cron runs every Thursday 06:00 UTC. Inside, it decides whether
// to fire based on cadence + last_send_at, then scans for content
// sources and surfaces a Telegram MENU (not a draft). The menu is
// the human-in-the-loop checkpoint: George taps which content path
// to compose. The system never autonomously creates a Bridge draft.
//
// Content sources, in priority order:
//   1. Recent blog post (Sanity, publishedAt within last 7 days)
//   2. Yacht eligible for highlight (not in featured set, has voice
//      fields populated, has at least one image)
//   3. Always-available "Write /story" link to the CRM Composer
//   4. Always-available "Skip this week"
//
// Voice eligibility for yacht highlight = at least one of the Update 2
// §5.3 fields is populated. We deliberately don't insist all voice
// fields are present — partial coverage still gives a richer body
// than none, and the assembler degrades gracefully.

import { kvSismember, kvSadd, kvGet, kvSet } from "@/lib/kv";
import { sanityClient } from "@/lib/sanity";
import { getCurrentSeason } from "./season";

export const FEATURED_YACHTS_KEY = "featured_yachts:bridge";
export const LAST_SEND_KEY_PREFIX = "last_send_at:";
export const BRIDGE_AUTO_PROCESSED_PREFIX = "auto_bridge_processed:";

/**
 * Bridge cadence per Update 1 §4.1. The cron always runs every
 * Thursday but its `shouldFire` decision changes by season.
 *
 *   Nov–Jun  (consideration → decision)  → weekly
 *   Jul–Aug  (high season)                → biweekly
 *   Sep–Oct  (shoulder)                   → biweekly
 */
function bridgeCadenceFor(phase) {
  if (
    phase === "deep_winter" ||
    phase === "spring_lift" ||
    phase === "season_open"
  ) {
    return "weekly";
  }
  return "biweekly";
}

/**
 * Decide whether today's Thursday firing should produce a menu, based
 * on the time elapsed since last send and the seasonal cadence.
 *
 * Returns: { fire, cadence, days_since_last, threshold, reason }
 */
export function shouldFireBridgeToday(lastSentAtIso, now = new Date()) {
  const season = getCurrentSeason(now);
  const cadence = bridgeCadenceFor(season.phase);
  const threshold = cadence === "weekly" ? 6 : 13;
  if (!lastSentAtIso) {
    return { fire: true, cadence, threshold, reason: "never sent" };
  }
  const lastMs = Date.parse(lastSentAtIso);
  if (Number.isNaN(lastMs)) {
    return {
      fire: true,
      cadence,
      threshold,
      reason: "bad last_send_at; firing safely",
    };
  }
  const days = (now.getTime() - lastMs) / (24 * 3600 * 1000);
  return {
    fire: days >= threshold,
    cadence,
    days_since_last: Number(days.toFixed(1)),
    threshold,
  };
}

/**
 * Find the most recent Sanity blog post published within the lookback
 * window. Returns the slug + title or null. Uses publishedAt — drafts
 * that haven't been published won't show up.
 */
export async function recentBlogPostForBridge(lookbackDays = 7, now = new Date()) {
  const cutoff = new Date(now.getTime() - lookbackDays * 24 * 3600 * 1000)
    .toISOString();
  try {
    const post = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current) && publishedAt > $cutoff] | order(publishedAt desc)[0]{
        "slug": slug.current,
        title,
        publishedAt
      }`,
      { cutoff },
    );
    return post ?? null;
  } catch {
    return null;
  }
}

/**
 * Find a yacht eligible for highlight: not previously featured in any
 * Bridge issue, has at least one image, and has at least one Update 2
 * voice field populated. Walks the candidate list in name order and
 * returns the first qualifying record.
 */
export async function eligibleYachtForBridge() {
  let candidates;
  try {
    candidates = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current) && count(images) >= 1 &&
         (defined(positioning_one_liner) || defined(idealFor) || defined(captain_name) || defined(seasons_active_count))]
        | order(name asc){
          _id, name, "slug": slug.current, subtitle, length, cruisingRegion
        }[0...80]`,
    );
  } catch {
    return null;
  }
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  for (const c of candidates) {
    let featured;
    try {
      featured = await kvSismember(FEATURED_YACHTS_KEY, c._id);
    } catch {
      featured = 0;
    }
    if (featured !== 1 && featured !== "1") return c;
  }
  return null; // every eligible yacht already used
}

/**
 * Add a yacht to the "already featured" set so subsequent Bridge
 * crons don't re-surface it. Called AFTER the menu pick generates
 * a draft (not when George just looks at the menu).
 */
export async function markYachtAsFeatured(yachtId) {
  if (!yachtId) return;
  await kvSadd(FEATURED_YACHTS_KEY, yachtId).catch(() => {});
}

/**
 * Read last_send_at:<stream> — set by the /approve handler after a
 * successful send loop completes. ISO string or null.
 */
export async function getLastSendAt(stream) {
  try {
    const v = await kvGet(`${LAST_SEND_KEY_PREFIX}${stream}`);
    if (!v) return null;
    return typeof v === "string" ? v : String(v);
  } catch {
    return null;
  }
}

/**
 * Generate a stable per-fire ID = the Thursday's UTC date in YYYY-MM-DD.
 * Used to namespace HMAC tokens on menu buttons + the
 * auto_bridge_processed:<fire_id> idempotency flag.
 */
export function bridgeFireIdForDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/**
 * Idempotency check — returns the action that was already processed
 * for this fire_id (or null if not yet handled).
 */
export async function getProcessedAction(fireId) {
  if (!fireId) return null;
  try {
    const v = await kvGet(`${BRIDGE_AUTO_PROCESSED_PREFIX}${fireId}`);
    if (!v) return null;
    return typeof v === "string" ? v : String(v);
  } catch {
    return null;
  }
}

export async function markProcessed(fireId, action) {
  if (!fireId) return;
  await kvSet(
    `${BRIDGE_AUTO_PROCESSED_PREFIX}${fireId}`,
    String(action),
    14 * 24 * 3600, // 14d TTL — long enough to handle late taps
  ).catch(() => {});
}
