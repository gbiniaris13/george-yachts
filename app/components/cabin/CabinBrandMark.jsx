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

export default function CabinBrandMark({ href = "/cabin" }) {
  return (
    <Link
      href={href}
      className="cabin-brandmark"
      aria-label="George Yachts · The Cabin · Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/gy-logo-real.svg"
        alt="George Yachts · Brokerage House"
        className="cabin-brandmark__logo"
      />
      <span className="cabin-brandmark__strapline">
        The Cabin <em>· Filotimo</em>
      </span>

      <style>{`
        .cabin-brandmark {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          color: inherit;
          padding: 2px 0;
        }
        .cabin-brandmark__logo {
          display: block;
          height: 84px;
          width: auto;
          /* Calm hover affordance — gentle warm-tone lift,
             without animating opacity which would dim the gold. */
          transition: filter 220ms ease;
        }
        .cabin-brandmark:hover .cabin-brandmark__logo,
        .cabin-brandmark:focus-visible .cabin-brandmark__logo {
          filter: drop-shadow(0 0 16px rgba(201, 168, 76, 0.32));
        }
        .cabin-brandmark__strapline {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 12.5px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.78);
          font-weight: 400;
        }
        .cabin-brandmark__strapline em {
          font-style: italic;
          color: var(--gy-gold, #C9A84C);
          letter-spacing: 0.06em;
          text-transform: none;
          margin-left: 2px;
          font-size: 13.5px;
        }
        @media (max-width: 767.98px) {
          .cabin-brandmark__logo { height: 64px; }
          .cabin-brandmark__strapline {
            font-size: 10.5px;
            letter-spacing: 0.28em;
          }
          .cabin-brandmark__strapline em { font-size: 11.5px; }
        }
        @media (max-width: 479.98px) {
          .cabin-brandmark { gap: 4px; }
          .cabin-brandmark__logo { height: 52px; }
          .cabin-brandmark__strapline {
            font-size: 9.5px;
            letter-spacing: 0.24em;
          }
          .cabin-brandmark__strapline em { font-size: 10.5px; }
        }
      `}</style>
    </Link>
  );
}
