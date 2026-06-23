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

const NEW_YACHT_DAYS = 45; // a yacht is "new" for its first 45 days in Sanity
const FRESH_POST_DAYS = 21; // articles are eligible for ~3 weeks after publish

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
  // Eligible = has slug + at least one image (so the email hero renders).
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current) && count(images) >= 1] | order(_createdAt desc){
        _id, "slug": slug.current, name, _createdAt
      }`,
    );
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
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
  // Stable, predictable cycle: name ascending.
  const byName = [...yachts].sort((a, b) =>
    String(a.name || "").localeCompare(String(b.name || "")),
  );
  for (const y of byName) {
    if (afterReset || !(await isShownYacht(stream, y._id))) return y;
  }
  return null;
}

/**
 * @returns {Promise<{ok:true, plan:object} | {ok:false, reason:string}>}
 *   plan = { content_type, yacht_slug?|post_slug?, label, mark:{type,id|slug} }
 */
export async function selectContentForStream(stream, now = new Date()) {
  const yachts = await fetchEligibleYachts();

  // 1. NEW yacht — created within the window, not yet shown to this stream.
  const newCutoff = now.getTime() - NEW_YACHT_DAYS * 86400000;
  for (const y of yachts) {
    const created = Date.parse(y._createdAt || "");
    if (Number.isNaN(created) || created < newCutoff) continue;
    if (!(await isShownYacht(stream, y._id))) {
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
