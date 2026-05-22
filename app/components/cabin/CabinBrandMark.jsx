// app/components/cabin/CabinBrandMark.jsx
// =============================================================
// George Yachts brand mark in the cabin header.
//
// 2026-05-22 — Two corrections from George after the first
// logo-swap attempt:
//
//   1. The asset I used (/images/logo-full-light.svg) was a
//      simplified abstract version I'd composed earlier — gold
//      curve + flat ivory blob + wordmark. George's actual
//      logo is the elaborate gold-and-silver yacht-wave-and-
//      hull illustration with the refined serif wordmark. He
//      pointed me to the real SVG on his Desktop — that's now
//      copied to /public/images/gy-logo-real.svg and rendered
//      here.
//
//   2. The old header carried a small italic "The Cabin ·
//      Filotimo" strapline below the wordmark — George liked
//      it ("μου άρεσε αυτό, το είχες κάνει πιο πριν") and
//      asked for it back. Restored beneath the logo, centred,
//      gold italic.
//
// The brand mark sits in the centre of the header (grid 1fr
// column flex-centres its child — see CabinShell). The right
// column carries the vessel/date/principal chip, the left
// the optional back arrow.
// =============================================================

import Link from "next/link";

// 2026-05-22 — Trimmed back to just the logo.
// George's directive after seeing the first layout: the brand
// logo should breathe at the centre of the header, as large as
// is comfortable. "The Cabin · Filotimo" + a quiet brand
// tagline now live in the LEFT slot of the header (handled by
// CabinShell). The right slot keeps the vessel/date/principal
// chip. This component just renders the logo, big and centered.
export default function CabinBrandMark({ href = "/cabin" }) {
  return (
    <Link
      href={href}
      className="cabin-brandmark"
      aria-label="George Yachts · Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/gy-logo-real.svg"
        alt="George Yachts · Brokerage House"
        className="cabin-brandmark__logo"
      />

      <style>{`
        .cabin-brandmark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: inherit;
          padding: 4px 0;
        }
        .cabin-brandmark__logo {
          display: block;
          /* 2026-05-22 — George: "Μεγάλωσε το λογότυπο στη μέση,
             μας παίρνει κι άλλο. Νομίζω μπορεί να γίνει και
             διπλό." Doubled the desktop height; the others
             step down proportionally so the brand mark stays
             prominent on every viewport. */
          height: 200px;
          width: auto;
          transition: filter 220ms ease;
        }
        .cabin-brandmark:hover .cabin-brandmark__logo,
        .cabin-brandmark:focus-visible .cabin-brandmark__logo {
          filter: drop-shadow(0 0 22px rgba(201, 168, 76, 0.4));
        }
        @media (max-width: 1023.98px) {
          .cabin-brandmark__logo { height: 150px; }
        }
        @media (max-width: 767.98px) {
          .cabin-brandmark__logo { height: 115px; }
        }
        @media (max-width: 479.98px) {
          .cabin-brandmark__logo { height: 80px; }
        }
      `}</style>
    </Link>
  );
}
