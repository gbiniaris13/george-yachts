// app/components/cabin/CabinBrandMark.jsx
// =============================================================
// The George Yachts logo as it appears at the top of every cabin
// page.
//
// 2026-05-22 — George's directive after the EFFIE STAR preview:
//   "Πάνω πάνω, δίπλα στο George Y. υπάρχει ένα λογότυπο, ένα
//    μικρό λογότυπο μαύρο με ένα χρυσό G. Εγώ θέλω να μου βάλει
//    στο λογότυπο που υπάρχει και στο site μου, αυτό με το σκάφος
//    χρυσό ασημή που είναι. […] Θα ήθελα αυτό το λογότυπο να
//    μπει στην μέση του The Cabin, όπως είναι και στο site,
//    κεντραρισμένο στη μέση."
//
// Previous version was a custom inline-SVG monogram (a small G
// in a black tile) plus the wordmark "GEORGE YACHTS" /
// "Brokerage House" set in HTML — a stand-in I built for the
// pass-7 header. George wants the real brand mark used across
// the marketing site: gold-silver yacht wave + serif wordmark +
// gold divider + spaced caps strapline, all as one composed
// SVG.
//
// The asset already lives at /public/images/logo-full-light.svg
// (1.6KB, pure vector, ivory wordmark designed for dark
// backgrounds — perfect for the navy header). We render it via
// <img> rather than inline so the SVG file is cached separately
// from the HTML / JS bundles and any future revision is a
// one-asset swap with no code change.
//
// preserveAspectRatio="xMidYMid meet" inside the SVG keeps the
// logo composed correctly at any rendered size — we just set a
// height and let the width respond.
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
        src="/images/logo-full-light.svg"
        alt="George Yachts · Brokerage House"
        className="cabin-brandmark__logo"
        width={240}
        height={96}
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
          height: 72px;
          width: auto;
          /* Calm hover affordance — gentle warm-tone lift,
             without animating opacity which would dim the gold. */
          transition: filter 220ms ease;
        }
        .cabin-brandmark:hover .cabin-brandmark__logo,
        .cabin-brandmark:focus-visible .cabin-brandmark__logo {
          filter: drop-shadow(0 0 18px rgba(201, 168, 76, 0.35));
        }
        @media (max-width: 767.98px) {
          .cabin-brandmark__logo {
            height: 56px;
          }
        }
        @media (max-width: 479.98px) {
          .cabin-brandmark__logo {
            height: 48px;
          }
        }
      `}</style>
    </Link>
  );
}
