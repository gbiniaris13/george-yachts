#!/usr/bin/env node
/**
 * Every video on the site, checked before it can ship.
 *
 * ── Why a guard and not a convention ─────────────────────────────────────
 *
 * On 7 September a partner's office sign went out on Instagram because a
 * photograph nobody had looked at was sitting in a yacht's gallery. The
 * answer to that was not "look harder next time", it was a guard that fails
 * the build. A video is the same problem with thirty times more frames and
 * a player that carries its host's branding on top.
 *
 * ── What it enforces ─────────────────────────────────────────────────────
 *
 * 1. CLEARED. `video.checked` holds the date a human watched the whole
 *    thing and confirmed there is no watermark, no phone number burnt into
 *    the footage and no other company on screen. Without it the page
 *    renders nothing, so an unchecked video is not an error, it is just
 *    invisible. It is reported so nobody loses track of work in progress.
 *
 * 2. THE PLAYER CAN BE SILENCED. Vimeo can hide the account name with
 *    title=0&byline=0&portrait=0. YouTube cannot: modestbranding was
 *    deprecated on 15 August 2023 and Google's player documentation states
 *    the channel avatar and video title always display before playback, on
 *    pause and at the end. So a YouTube video needs `channelCleared`, which
 *    records that the channel behind it is not a charter company.
 *
 * 3. NO PARTNER NAME ANYWHERE IN THE RECORD. The title, the URL and the
 *    thumbnail all reach a crawler through VideoObject markup, which makes
 *    them exactly as public as body copy.
 *
 * 4. THE FIELDS GOOGLE REQUIRES. A VideoObject without a thumbnail or an
 *    upload date does not earn a video result, so the markup would be
 *    weight with no return. Missing ones are reported, not fatal.
 *
 * Run: node scripts/checkVideoSources.mjs
 */

const PROJECT = "ecqr94ey";
const DATASET = "production";

// The same list the copy guard uses, kept deliberately separate: this one
// also has to catch a name that appears only inside a video title or a
// thumbnail URL, where prose rules do not apply.
const FORBIDDEN = [
  "istion", "fx yachting", "fxyachting", "fyly", "iyc", "mygreekcharter",
  "my greek charter", "fraser", "burgess", "northrop", "edmiston", "valef",
  "boataround", "sailogy", "clickandboat", "click&boat", "dream yacht",
  "sail ionian", "12knots", "thethoms", "kavas", "boatbookings",
  "charterworld", "yachtcharterfleet", "yotters", "getboat",
];

const QUERY = `*[_type == "yacht" && defined(video)]{
  "slug": slug.current, name, video
}`;

async function main() {
  const url =
    `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`;

  let rows = [];
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Sanity responded ${res.status}`);
    rows = (await res.json()).result || [];
  } catch (err) {
    // A network failure must not turn into a green build. It is reported
    // as a problem so nobody reads silence as approval.
    console.error(`Video guard: could not read the fleet (${err.message}).`);
    process.exit(1);
  }

  const fatal = [];
  const notes = [];

  for (const y of rows) {
    const v = y.video || {};
    const where = `${y.slug}`;
    const blob = [v.url, v.title, v.thumbnail, v.provider].filter(Boolean).join(" ").toLowerCase();

    const named = FORBIDDEN.find((n) => blob.includes(n));
    if (named) {
      fatal.push(
        `${where}: the video record contains "${named}". Title, URL and thumbnail all reach ` +
          `a crawler through VideoObject markup, so they are as public as body copy.`,
      );
    }

    if (!v.checked) {
      notes.push(`${where}: not cleared yet, so the page renders no video. Watch it, then set the date.`);
      continue; // nothing below matters until somebody has watched it
    }

    if (!v.url && !v.videoId) {
      fatal.push(`${where}: marked cleared on ${v.checked} but carries no player URL.`);
    }

    if (v.provider === "youtube" && !v.channelCleared) {
      fatal.push(
        `${where}: YouTube cannot hide the channel name on its player (modestbranding was ` +
          `deprecated 2023-08-15), so the channel shows to every guest. Set channelCleared ` +
          `once you have confirmed the channel is not a charter company, or move the video to Vimeo.`,
      );
    }

    if (v.provider === "vimeo" && !v.hash && !/[?&]h=/.test(v.url || "")) {
      notes.push(
        `${where}: Vimeo link carries no ?h= hash. Fine if the video is public, but an ` +
          `unlisted one will refuse to play off-site without it.`,
      );
    }

    for (const [field, why] of [
      ["thumbnail", "Google requires thumbnailUrl for a video result"],
      ["uploadDate", "Google requires uploadDate"],
      ["durationSeconds", "duration is what puts the length badge on the result"],
    ]) {
      if (!v[field]) notes.push(`${where}: no ${field}. ${why}.`);
    }
  }

  const cleared = rows.filter((y) => y.video?.checked).length;

  if (fatal.length) {
    console.error(`Video guard: ${fatal.length} problem(s).\n`);
    for (const f of fatal) console.error(`  • ${f}`);
    if (notes.length) {
      console.error(`\n  ${notes.length} note(s) as well:`);
      for (const n of notes) console.error(`    · ${n}`);
    }
    process.exit(1);
  }

  console.log(
    `Video guard: clean. ${cleared} cleared video(s) across ${rows.length} yacht record(s).`,
  );
  for (const n of notes) console.log(`  · ${n}`);
}

main();
