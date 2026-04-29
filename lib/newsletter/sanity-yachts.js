// Sanity yacht fetcher — newsletter helpers.
//
// Pulls just enough of a yacht's public profile to compose a §8.1
// announcement or §8.2 offer body. We deliberately DO NOT pull
// pricing into this module — Brief §13.4 forbids prices in any
// newsletter body, and the body assembler only ever sees what this
// module returns. Keeping `weeklyRatePrice` out at the source level
// is defence-in-depth: even if the validator is misconfigured, the
// data simply isn't there to inject.
//
// Shape returned by getYachtForNewsletter():
//   {
//     ok: true,
//     yacht: {
//       _id, slug, name, subtitle, length, builder,
//       sleeps, cabins, crew, cruisingRegion,
//       description,                   // long-form, can be truncated
//       georgeInsiderTip,              // §8.1 "Where she'll cruise" + §8 voice
//       hero_image_url,                // Sanity CDN, optimized for email
//       page_url                       // public site link
//     }
//   }
//   { ok: false, error }
//
// Brief §11.3 hero policy:
//   Prefer the FIRST image with `newsletter-eligible` tag (alt or
//   metadata-driven). Falls back to images[0]. Always served at
//   1600px wide / q=85 / fit=max so the Resend payload stays under
//   the 800KB sweet spot.

import { sanityClient } from "@/lib/sanity";

const HERO_TRANSFORM = "?w=1600&q=85&fit=max&auto=format";

function pickHero(images) {
  if (!Array.isArray(images) || images.length === 0) return null;
  // Brief §11.3 — prefer alt-tagged eligible photo (e.g. "newsletter-eligible: helm shot at golden hour")
  const eligible = images.find(
    (i) =>
      i?.alt &&
      typeof i.alt === "string" &&
      /newsletter[-\s]?eligible/i.test(i.alt),
  );
  const chosen = eligible ?? images[0];
  if (!chosen?.url) return null;
  return `${chosen.url}${HERO_TRANSFORM}`;
}

// Update 2 §5.3 — Voice/Composer fields appended below the structural
// ones. All optional; empty values produce silent emission per
// George's directive "empty field = silent emission, not placeholder".
const YACHT_PROJECTION = `{
  _id,
  "slug": slug.current,
  name,
  subtitle,
  description,
  georgeInsiderTip,
  length,
  yearBuiltRefit,
  builder,
  sleeps,
  cabins,
  crew,
  cruisingRegion,
  fleetTier,
  idealFor,
  "images": images[]{
    "url": asset->url,
    "alt": alt
  },
  captain_name,
  captain_on_board_since,
  captain_credentials_short,
  chef_name,
  chef_specialty_one_line,
  seasons_active_count,
  positioning_one_liner,
  guest_consent_obtained,
  notable_guest_quote,
  voice_notes
}`;

/**
 * Fetch a single yacht by slug, ready to feed into §8 templates.
 * Filters out price/booking specifics by projection.
 */
export async function getYachtForNewsletter(slug) {
  if (!slug || typeof slug !== "string") {
    return { ok: false, error: "slug required" };
  }
  try {
    const y = await sanityClient.fetch(
      `*[_type == "yacht" && slug.current == $slug][0]${YACHT_PROJECTION}`,
      { slug: slug.trim() },
    );
    if (!y) return { ok: false, error: `yacht not found: ${slug}` };
    return {
      ok: true,
      yacht: {
        _id: y._id,
        slug: y.slug,
        name: y.name,
        subtitle: y.subtitle ?? null,
        length: y.length ?? null,
        builder: y.builder ?? null,
        yearBuiltRefit: y.yearBuiltRefit ?? null,
        sleeps: y.sleeps ?? null,
        cabins: y.cabins ?? null,
        crew: y.crew ?? null,
        cruisingRegion: y.cruisingRegion ?? "Greek waters",
        fleetTier: y.fleetTier ?? null,
        idealFor: y.idealFor ?? null,
        description: y.description ?? null,
        georgeInsiderTip: y.georgeInsiderTip ?? null,
        hero_image_url: pickHero(y.images),
        page_url: `https://georgeyachts.com/yachts/${y.slug}`,

        // Update 2 §5.3 — voice/composer fields. Pass through as-is;
        // body-assembler is the single place that decides if/when to
        // emit them per George's caveats (default OFF, consent gates,
        // anti-content guidance).
        captain_name: y.captain_name ?? null,
        captain_on_board_since: y.captain_on_board_since ?? null,
        captain_credentials_short: y.captain_credentials_short ?? null,
        chef_name: y.chef_name ?? null,
        chef_specialty_one_line: y.chef_specialty_one_line ?? null,
        seasons_active_count: y.seasons_active_count ?? null,
        positioning_one_liner: y.positioning_one_liner ?? null,
        guest_consent_obtained: y.guest_consent_obtained === true,
        notable_guest_quote: y.notable_guest_quote ?? null,
        voice_notes: y.voice_notes ?? null,
      },
    };
  } catch (err) {
    return { ok: false, error: `sanity fetch failed: ${err?.message || err}` };
  }
}

/**
 * List yachts for the composer dropdown — name + slug only.
 * Sorted by name asc.
 */
export async function listYachtsForComposer() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)] | order(name asc){
        "slug": slug.current,
        name,
        subtitle,
        length,
        cruisingRegion,
        fleetTier,
        // Surface flags for the Composer UI:
        //   has_voice_notes — show the warning panel
        //   has_captain_credentials — enable the "Include credentials" checkbox
        "has_voice_notes": defined(voice_notes) && voice_notes != "",
        "has_captain_credentials": defined(captain_credentials_short) && captain_credentials_short != "",
        voice_notes
      }`,
    );
    return { ok: true, yachts: rows ?? [] };
  } catch (err) {
    return { ok: false, error: `sanity fetch failed: ${err?.message || err}`, yachts: [] };
  }
}

/**
 * Fetch a blog post for §8.4 blog-recap template.
 */
export async function getPostForNewsletter(slug) {
  if (!slug) return { ok: false, error: "slug required" };
  try {
    const p = await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        "imageUrl": mainImage.asset->url,
        "imageAlt": mainImage.alt,
        publishedAt,
        author
      }`,
      { slug: slug.trim() },
    );
    if (!p) return { ok: false, error: `post not found: ${slug}` };
    return {
      ok: true,
      post: {
        title: p.title,
        excerpt: p.excerpt ?? null,
        author: p.author ?? "George P. Biniaris",
        publishedAt: p.publishedAt ?? null,
        hero_image_url: p.imageUrl
          ? `${p.imageUrl}${HERO_TRANSFORM}`
          : null,
        page_url: `https://georgeyachts.com/blog/${slug.trim()}`,
      },
    };
  } catch (err) {
    return { ok: false, error: `sanity fetch failed: ${err?.message || err}` };
  }
}

/**
 * Truncate a long description to ~N words, on a sentence boundary.
 * Used by the body assembler to slim a Sanity description into a
 * 60-90 word newsletter paragraph without cutting mid-sentence.
 */
export function truncateAtSentence(text, maxWords = 60) {
  if (!text || typeof text !== "string") return "";
  const clean = text.replace(/\s+/g, " ").trim();
  const words = clean.split(" ");
  if (words.length <= maxWords) return clean;
  const cut = words.slice(0, maxWords).join(" ");
  // Walk back to last sentence terminator.
  const lastEnd = Math.max(
    cut.lastIndexOf("."),
    cut.lastIndexOf("!"),
    cut.lastIndexOf("?"),
  );
  if (lastEnd > 0) return cut.slice(0, lastEnd + 1);
  return cut + "…";
}
