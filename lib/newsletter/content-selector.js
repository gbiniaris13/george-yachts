// Full-auto content selector.
//
// Picks ONE piece of content for a stream's scheduled send, by priority:
//
//   1. NEW yacht  — recently added to Sanity, not yet shown to this
//      stream → "announcement" ("new in our Greek fleet").
//   2. FRESH article — published recently, not yet sent to this stream,
//      AI-classified as fitting this audience → "blog".
//   3. ROTATION yacht — next eligible yacht not yet shown to this stream
//      → "spotlight". When every yacht has been shown, the per-stream
//      rotation set resets and a new cycle begins (George's spec:
//      "once we've shown them all, a lot of time has passed — start over").
//
// Shown-tracking is PER STREAM, so the same yacht serves clients
// (story voice) on Tuesday and advisors (inventory voice) on Thursday
// without colliding. New yachts therefore reach BOTH audiences naturally,
// each on its own day.
//
// Items are marked shown only AFTER a successful send (see markYachtShown
// / markPostShown, called by the orchestrator), so a blocked or failed
// send never burns a yacht or article.

import { sanityClient } from "@/lib/sanity";
import { kvSismember, kvSadd, kvDel } from "@/lib/kv";
import { classifyArticleAudience } from "./article-classifier";
import { filterOutwardAllowed } from "@/lib/socialPolicy";
import { RETIRED_YACHT_SLUGS } from "@/lib/retiredYachts";
import { rateRange } from "@/lib/georgesPicks";

const NEW_YACHT_DAYS = 45; // a yacht is "new" for its first 45 days in Sanity
const FRESH_POST_DAYS = 21; // articles are eligible for ~3 weeks after publish
const FLEET_UPDATE_MIN = 3; // this many unshown new yachts → one grouped letter
const FLEET_UPDATE_MAX = 10; // and at most this many hulls per letter
// 2026-09-25, George: the clients this house wants pay EUR 35,000 to 80,000
// a week. The one yacht the client letter names is chosen from that band
// first; the advisor letter takes the fleet in name order.
const BRIDGE_BAND = { low: 35000, high: 80000 };
const RETIRED = new Set(RETIRED_YACHT_SLUGS.map((s) => String(s).toLowerCase()));

function shownYachtsKey(stream) {
  return `auto_shown_yachts:${stream}`;
}
function shownPostsKey(stream) {
  return `auto_shown_posts:${stream}`;
}

async function isShownYacht(stream, id) {
  try {
    const r = await kvSismember(shownYachtsKey(stream), id);
    return r === 1 || r === "1";
  } catch {
    return false;
  }
}
async function isShownPost(stream, slug) {
  try {
    const r = await kvSismember(shownPostsKey(stream), slug);
    return r === 1 || r === "1";
  } catch {
    return false;
  }
}

export async function markYachtShown(stream, id) {
  if (id) await kvSadd(shownYachtsKey(stream), id).catch(() => {});
}
export async function markPostShown(stream, slug) {
  if (slug) await kvSadd(shownPostsKey(stream), slug).catch(() => {});
}

async function fetchEligibleYachts() {
  // Eligible = has slug, at least one image (so the email hero renders), and
  // cleared to leave the website at all.
  //
  // 2026-09-08 — that last clause is why this function was changed. The
  // outward gate was wired into lib/newsletter/sanity-yachts.js, which is
  // what composes a body, and not into this file, which is what decides
  // what to write about. So the bridge went looking for the newest hulls,
  // found ten of the twenty-seven that are licensed for the website and
  // nothing else, and proposed a fleet update naming all ten. The letter
  // was held before a draft existed and nothing was sent, but it would
  // have been proposed again on every run, blocking the newsletter behind
  // a batch that can never go out.
  //
  // Filtering at the source is the fix: a yacht that may not leave the
  // site is not a candidate for anything, not a fleet update, not a single
  // announcement, not the rotation. The gate clears nobody when it cannot
  // read the policy, which is deliberate: a newsletter that skips a week is
  // recoverable and a breach of the permission is not.
  //
  // 2026-09-29: a retired yacht (lib/retiredYachts.js, 308 on the site)
  // is not a candidate either; Sanity still holds her document.
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current) && count(images) >= 1] | order(_createdAt desc){
        _id, "slug": slug.current, name, _createdAt, weeklyRatePrice
      }`,
    );
    if (!Array.isArray(rows)) return [];
    const live = rows.filter((y) => !RETIRED.has(String(y.slug).toLowerCase()));
    return await filterOutwardAllowed(live);
  } catch {
    return [];
  }
}

function inBridgeBand(y) {
  const r = rateRange(y.weeklyRatePrice);
  if (!r) return false;
  return r.high >= BRIDGE_BAND.low && r.low <= BRIDGE_BAND.high;
}

async function fetchRecentPosts(cutoffIso) {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current) && publishedAt > $cutoff] | order(publishedAt desc){
        "slug": slug.current, title, excerpt, publishedAt
      }`,
      { cutoff: cutoffIso },
    );
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

async function pickRotationYacht(stream, yachts, afterReset = false) {
  // Stable, predictable cycle: name ascending. The client letter walks
  // the EUR 35,000 to 80,000 band first and only then the rest.
  const byName = [...yachts].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || "")),
  );
  const ordered =
    stream === "bridge"
      ? [...byName.filter(inBridgeBand), ...byName.filter((y) => !inBridgeBand(y))]
      : byName;
  for (const y of ordered) {
    if (afterReset || !(await isShownYacht(stream, y._id))) return y;
  }
  return null;
}

/**
 * @returns {Promise<{ok:true, plan:object} | {ok:false, reason:string}>}
 *   plan = { content_type, yacht_slug?|post_slug?, label, mark:{type,id|slug} }
 */
/**
 * 2026-09-29, George: every scheduled issue is now ONE letter from the
 * desk. Its parts, each optional, each from real data:
 *   1. a note George approved for this issue (KV desk_note:<stream>, read
 *      by the orchestrator, not here)
 *   2. the new hulls (3 or more unshown, created within 45 days) OR one
 *      yacht (the newest unshown, else the rotation pick)
 *   3. the freshest unshown article that fits the audience, unless the
 *      letter already carries the fleet list (kept short on purpose)
 * A letter with neither a yacht nor an article is not sent.
 */
export async function selectLetterForStream(stream, now = new Date(), { singleOnly = false } = {}) {
  const yachts = await fetchEligibleYachts();
  const newCutoff = now.getTime() - NEW_YACHT_DAYS * 86400000;
  const fresh = [];
  for (const y of yachts) {
    const created = Date.parse(y._createdAt || "");
    if (Number.isNaN(created) || created < newCutoff) continue;
    if (!(await isShownYacht(stream, y._id))) fresh.push(y);
  }

  const plan = {
    content_type: "letter",
    yacht_slug: null,
    yacht_slugs: null,
    post_slug: null,
    yacht_is_new: false,
    label: "",
    mark: { yacht_ids: [], post_slug: null },
  };

  if (fresh.length >= FLEET_UPDATE_MIN && !singleOnly) {
    const batch = fresh.slice(0, FLEET_UPDATE_MAX);
    plan.yacht_slugs = batch.map((y) => y.slug);
    plan.mark.yacht_ids = batch.map((y) => y._id);
    plan.label = `letter · ${batch.length} new yachts (${batch.map((y) => y.name).join(", ")})`;
    return { ok: true, plan };
  }

  let yacht = fresh[0] ?? null;
  if (yacht) plan.yacht_is_new = true;
  if (!yacht) {
    yacht = await pickRotationYacht(stream, yachts);
    if (!yacht && yachts.length > 0) {
      await kvDel(shownYachtsKey(stream)).catch(() => {});
      yacht = await pickRotationYacht(stream, yachts, /* afterReset */ true);
    }
  }
  if (yacht) {
    plan.yacht_slug = yacht.slug;
    plan.mark.yacht_ids = [yacht._id];
  }

  const postCutoff = new Date(now.getTime() - FRESH_POST_DAYS * 86400000).toISOString();
  const posts = await fetchRecentPosts(postCutoff);
  for (const p of posts) {
    if (await isShownPost(stream, p.slug)) continue;
    const cls = await classifyArticleAudience(p);
    if (cls.audiences.includes(stream)) {
      plan.post_slug = p.slug;
      plan.mark.post_slug = p.slug;
      break;
    }
  }

  if (!plan.yacht_slug && !plan.post_slug) {
    return {
      ok: false,
      reason:
        "no eligible content (no cleared yacht with a photo, and no fitting fresh article)",
    };
  }
  plan.label = [
    yacht ? `${plan.yacht_is_new ? "new yacht" : "yacht"} · ${yacht.name}` : null,
    plan.post_slug ? `article · ${plan.post_slug}` : null,
  ]
    .filter(Boolean)
    .join(" + ");
  return { ok: true, plan };
}

export async function selectContentForStream(stream, now = new Date()) {
  const yachts = await fetchEligibleYachts();

  // 1. NEW yachts — created within the window, not yet shown to this
  //    stream. Three or more → one fleet-update letter (2026-09-03,
  //    George: the fleet grew by 23 hulls in three weeks and one
  //    announcement a month could not keep up). Fewer → the classic
  //    single announcement.
  const newCutoff = now.getTime() - NEW_YACHT_DAYS * 86400000;
  const fresh = [];
  for (const y of yachts) {
    const created = Date.parse(y._createdAt || "");
    if (Number.isNaN(created) || created < newCutoff) continue;
    if (!(await isShownYacht(stream, y._id))) fresh.push(y);
  }
  if (fresh.length >= FLEET_UPDATE_MIN) {
    const batch = fresh.slice(0, FLEET_UPDATE_MAX);
    return {
      ok: true,
      plan: {
        content_type: "fleet_update",
        yacht_slugs: batch.map((y) => y.slug),
        label: `fleet update · ${batch.length} new yachts (${batch.map((y) => y.name).join(", ")})`,
        mark: { type: "yachts", ids: batch.map((y) => y._id) },
      },
    };
  }
  if (fresh.length > 0) {
    const y = fresh[0];
    return {
      ok: true,
      plan: {
        content_type: "announcement",
        yacht_slug: y.slug,
        label: `new yacht · ${y.name}`,
        mark: { type: "yacht", id: y._id },
      },
    };
  }

  // 2. FRESH article that fits this stream (AI-classified).
  const postCutoff = new Date(
    now.getTime() - FRESH_POST_DAYS * 86400000,
  ).toISOString();
  const posts = await fetchRecentPosts(postCutoff);
  for (const p of posts) {
    if (await isShownPost(stream, p.slug)) continue;
    const cls = await classifyArticleAudience(p);
    if (cls.audiences.includes(stream)) {
      return {
        ok: true,
        plan: {
          content_type: "blog",
          post_slug: p.slug,
          label: `article · ${p.title}`,
          mark: { type: "post", slug: p.slug },
        },
      };
    }
  }

  // 3. ROTATION yacht — next unshown; reset the cycle when exhausted.
  let rotation = await pickRotationYacht(stream, yachts);
  if (!rotation && yachts.length > 0) {
    await kvDel(shownYachtsKey(stream)).catch(() => {});
    rotation = await pickRotationYacht(stream, yachts, /* afterReset */ true);
  }
  if (rotation) {
    return {
      ok: true,
      plan: {
        content_type: "spotlight",
        yacht_slug: rotation.slug,
        label: `spotlight · ${rotation.name}`,
        mark: { type: "yacht", id: rotation._id },
      },
    };
  }

  return {
    ok: false,
    reason:
      "no eligible content (no yachts with a photo in Sanity, and no fitting fresh article)",
  };
}
