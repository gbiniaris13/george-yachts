/**
 * George's standing rule: no long dashes, anywhere a person reads. An em dash
 * is the single most reliable tell that a machine wrote a sentence, and this
 * house sells the opposite impression.
 *
 * The site's own source was swept on 2026-08-07, but a large share of the
 * visible copy does not live in this repo: yacht subtitles, insider tips and
 * every image alt come from Sanity, where the author is George himself and
 * where we hold no write token. Cleaning the text as it arrives is the only
 * fix that also covers whatever he writes next month.
 *
 * The rules mirror the source sweep exactly, so nothing reads differently
 * depending on which side of the CMS it came from:
 *   a range between two values      "20m – 40m"          -> "20m - 40m"
 *   a label introducing its value   "Price range — €13k"  -> "Price range: €13k"
 *   a parenthetical pause           "the week — and the"  -> "the week, and the"
 *   a dash left at the end          "five questions —"    -> "five questions"
 *
 * A comma is used for the pause rather than a full stop because it can never
 * turn the second half into a sentence fragment.
 */

const DASH = /[—–]/;

export function humanDashes(input) {
  if (typeof input !== "string" || !DASH.test(input)) return input;
  let s = input;

  // A range: keep it tight, the way a person types it.
  s = s.replace(/(?<=[0-9A-Za-z€%])\s*[—–]\s*(?=[0-9A-Za-z€])/g, (m) =>
    m.trim() === m ? "-" : " - "
  );

  // A bold or plain label introducing what follows reads as a colon.
  s = s.replace(/(\*\*[^*\n]+\*\*)\s*[—–]\s+/g, "$1: ");

  // Nothing should dangle at the end of a line.
  s = s.replace(/\s*[—–]\s*$/g, "");

  // The parenthetical pause.
  s = s.replace(/(.)\s*[—–]\s+/g, (_, before) =>
    before + (",:;.!?".includes(before) ? " " : ", ")
  );

  // A dash opening the string.
  s = s.replace(/^\s*[—–]\s*/g, "");

  s = s.replace(/[—–]/g, "-");

  // Never stack punctuation on the way out.
  s = s.replace(/,\s*,/g, ",").replace(/,\s*([.!?;:])/g, "$1");

  return s;
}

/**
 * Walks whatever Sanity returns and cleans every string in it, leaving the
 * shape untouched. Portable Text blocks are plain objects, so their `text`
 * spans are cleaned by the same walk.
 */
export function humanDashesDeep(value, seen = new WeakSet()) {
  if (typeof value === "string") return humanDashes(value);
  if (Array.isArray(value)) return value.map((v) => humanDashesDeep(v, seen));
  if (value && typeof value === "object") {
    // Guard against the cyclic references Sanity references can produce.
    if (seen.has(value)) return value;
    seen.add(value);
    for (const k of Object.keys(value)) {
      // _id, _rev, slugs and URLs are identifiers, not prose. Rewriting a
      // dash inside one would break a link.
      if (k.startsWith("_") || k === "slug" || k === "url" || k === "href") continue;
      value[k] = humanDashesDeep(value[k], seen);
    }
    return value;
  }
  return value;
}
