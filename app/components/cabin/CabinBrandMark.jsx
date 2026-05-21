// app/components/cabin/CabinBrandMark.jsx
// =============================================================
// The George Yachts monogram + wordmark used in the cabin
// header. Inline SVG (same Trajan-derived G as app/icon.svg)
// so it renders crisp at every density, no extra HTTP request,
// no font-loading flash on the chrome.
//
// 2026-05-21 — George's pass-7 critique on the EFFIE STAR
// preview: the previous header was a tiny text-only eyebrow
// crammed under the title. "Multi-billion company feel, Vogue,
// για πλούσιους πελάτες." This component is the brand half of
// the new taller, breathier header.
//
// The wordmark renders on TWO lines so it can be paired with
// "Brokerage House" beneath the brand the way the marketing
// footer treats it. On the smallest phones the wordmark
// collapses to just the monogram (component handles its own
// breakpoints via CSS; layout never has to special-case mobile).
// =============================================================

import Link from "next/link";

export default function CabinBrandMark({ href = "/cabin" }) {
  return (
    <Link href={href} className="cabin-brandmark" aria-label="George Yachts · The Cabin · Home">
      <span className="cabin-brandmark__monogram" aria-hidden>
        <svg viewBox="0 0 64 64" width="40" height="40" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="cabin-brand-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7DA6F" />
              <stop offset="40%" stopColor="#E6C77A" />
              <stop offset="70%" stopColor="#C9A24D" />
              <stop offset="100%" stopColor="#A67C2E" />
            </linearGradient>
            <linearGradient id="cabin-brand-gold-subtle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6C77A" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#A67C2E" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="10" fill="#050505" />
          <rect x="3" y="3" width="58" height="58" rx="8" fill="none"
                stroke="url(#cabin-brand-gold-subtle)" strokeWidth="0.9" />
          <path
            d="M 32 12
               C 21 12, 14 19.5, 14 32
               C 14 44.5, 21 52, 32 52
               C 38 52, 43 50, 47 47
               L 47 33
               L 33 33
               L 33 38
               L 41 38
               L 41 44
               C 39 45.5, 36 46.5, 33 46.5
               C 25 46.5, 21 41, 21 32
               C 21 23, 25 17.5, 33 17.5
               C 38 17.5, 42 19.5, 45 23
               L 47 19
               C 43 14.5, 38 12, 32 12 Z"
            fill="url(#cabin-brand-gold)"
          />
          <line x1="28" y1="56" x2="36" y2="56" stroke="url(#cabin-brand-gold)"
                strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
        </svg>
      </span>
      <span className="cabin-brandmark__words">
        <span className="cabin-brandmark__wordmark notranslate">George Yachts</span>
        <span className="cabin-brandmark__strapline">Brokerage House</span>
      </span>

      <style>{`
        .cabin-brandmark {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
          /* Larger touch target across the whole brand area. */
          padding: 4px 0;
        }
        .cabin-brandmark__monogram {
          display: inline-flex;
          flex-shrink: 0;
        }
        .cabin-brandmark__monogram svg {
          display: block;
        }
        .cabin-brandmark__words {
          display: flex;
          flex-direction: column;
          line-height: 1.05;
          min-width: 0;
        }
        .cabin-brandmark__wordmark {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-size: 19px;
          letter-spacing: 0.5px;
          font-weight: 400;
          color: var(--gy-ivory, #F8F5F0);
          /* Roman caps feel for the brandmark itself. */
          text-transform: uppercase;
          letter-spacing: 2.4px;
        }
        .cabin-brandmark__strapline {
          font-family: var(--gy-font-ui, system-ui, sans-serif);
          font-size: 9.5px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
          color: var(--gy-gold, #C9A84C);
          font-weight: 500;
          margin-top: 4px;
        }
        @media (max-width: 479.98px) {
          .cabin-brandmark { gap: 10px; }
          .cabin-brandmark__monogram svg { width: 34px; height: 34px; }
          .cabin-brandmark__wordmark { font-size: 14px; letter-spacing: 1.8px; }
          .cabin-brandmark__strapline { font-size: 8.5px; letter-spacing: 2.2px; }
        }
      `}</style>
    </Link>
  );
}
