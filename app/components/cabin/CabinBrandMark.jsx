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

// 2026-05-22 — Trimmed back to just the logo.
// George's directive after seeing the first layout: the brand
// logo should breathe at the centre of the header, as large as
// is comfortable. "The Cabin · Filotimo" + a quiet brand
// tagline now live in the LEFT slot of the header (handled by
// CabinShell). The right slot keeps the vessel/date/principal
// chip. This component just renders the logo, big and centered.
//
// 2026-05-26 — Domingo bug-report (3 confirmations): clicking
// the logo on /cabin/brief/* did nothing, URL stayed put. Same
// silent router.push drop documented in /cabin/me/page.jsx
// (Next.js 15 App Router prod build coalescing router.push
// inside certain client trees). Switched from <Link> to a
// raw <a> with onClick → window.location.assign. Trades the
// SPA in-place navigation for a guaranteed full page-load.
// Acceptable trade because clicking the logo from a brief page
// is a "leave the form context" action — a fresh paint of
// /cabin is the user's intent anyway. The href stays so
// right-click / cmd-click "open in new tab" still works.
export default function CabinBrandMark({ href = "/cabin" }) {
  function onClick(e) {
    // Let modifier-clicks (cmd/ctrl/shift/middle-button) keep
    // their default browser semantics — open-in-new-tab etc.
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.assign(href);
    }
  }
  return (
    <a
      href={href}
      onClick={onClick}
      className="cabin-brandmark"
      aria-label="George Yachts · Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* 2026-05-23 — Audit pass: explicit width/height stops the
          layout shift (CLS) on slow networks. SVG intrinsic ratio
          is 4:3 so width:160 / height:120 matches the desktop
          tier. CSS height rules below override at narrower tiers
          (aspect-ratio preserved by width: auto). */}
      <img
        src="/images/gy-logo-real.svg"
        alt="George Yachts · Brokerage House"
        className="cabin-brandmark__logo"
        width="160"
        height="120"
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
          /* 2026-05-22 - George: "Μεγάλωσε το λογότυπο στη μέση,
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
          .cabin-brandmark__logo { height: 120px; }
        }
        /* 2026-05-23 - Eleanna round 4 (audit pass): the 120-140px
           mobile logo turned the sticky header into 30% of the
           viewport on every cabin page. Audit measured iPhone SE2
           with the old sizing → 53% of viewport was chrome before
           any content. New canonical sizes balance brand presence
           against content room:
             • Tablet (≤1024px)   - 120px
             • Phone (≤600px)     - 64px   (~16% of viewport on
                                    iPhone SE2; still distinctly
                                    visible, no longer crushes
                                    page content)
             • Tiny (≤360px)      - 56px   (Galaxy S base)
           Pairs with the tighter mobile header padding + dropped
           tagline in CabinShell.jsx for a header total of ~140px
           on phones instead of ~280-320px. */
        @media (max-width: 599.98px) {
          .cabin-brandmark__logo { height: 64px; }
        }
        @media (max-width: 359.98px) {
          .cabin-brandmark__logo { height: 56px; }
        }
      `}</style>
    </a>
  );
}
