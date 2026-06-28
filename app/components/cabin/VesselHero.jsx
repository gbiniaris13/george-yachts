// app/components/cabin/VesselHero.jsx
// =============================================================
// The "you walk into your yacht" moment.
//
// 2026-05-21 — George's directive on the EFFIE STAR preview:
//   "Με το που μπαίνει ο πελάτης, να βλέπει πίσω το σκάφος
//    που έχει ναυλώσει. Δεν θέλω να γίνει stretch — να φαίνεται
//    ωραίο. Multi-billion εταιρεία, Vogue feel, για high
//    πελάτες."
//
// Renders the lead photo from cabins.vessel_photos as a
// full-bleed hero band at the top of /cabin. The vessel name +
// make/model + charter dates overlay the lower-left in calm
// editorial type. The image is OBJECT-FIT: cover so it fills
// the band without distortion (no stretch) regardless of aspect
// ratio. A subtle navy gradient overlays the bottom 40% so the
// type stays readable on any photo.
//
// Renders nothing if vessel_photos is empty — the rest of the
// home page then has its own welcome / first-step blocks; no
// awkward placeholder. The teaser block below the welcome step
// surfaces 2-3 facts + small photo squares as a separate "if
// you want to know more" affordance.
// =============================================================

export default function VesselHero({ photos, vesselName, makeModel, dates }) {
  // Defensive — array may be missing or malformed. We pick the
  // first object with a usable url; never break if alts are
  // present but the primary isn't.
  const hero = Array.isArray(photos)
    ? photos.find((p) => p && typeof p?.url === "string" && p.url.trim().length > 0)
    : null;
  if (!hero) return null;

  return (
    <section className="cabin-vessel-hero" aria-label={`${vesselName || "Your yacht"} hero photo`}>
      <div className="cabin-vessel-hero__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.url}
          alt={hero.caption || `${vesselName || "Your yacht"} at anchor`}
          className="cabin-vessel-hero__img"
          loading="eager"
          decoding="async"
        />
        <div className="cabin-vessel-hero__overlay" aria-hidden />
        <div className="cabin-vessel-hero__caption">
          <div className="cabin-vessel-hero__eyebrow">Your yacht</div>
          <h2 className="cabin-vessel-hero__name notranslate">
            {vesselName || ""}
            {makeModel ? <span className="cabin-vessel-hero__model"> · {makeModel}</span> : null}
          </h2>
          {dates ? (
            <div className="cabin-vessel-hero__dates">{dates}</div>
          ) : null}
        </div>
      </div>

      <style>{`
        .cabin-vessel-hero {
          /* Full-bleed: ignore the page's inner padding so the
             photo runs edge-to-edge of the viewport. */
          margin-left: calc(50% - 50vw);
          margin-right: calc(50% - 50vw);
          margin-top: -28px;
          margin-bottom: 12px;
        }
        @media (min-width: 768px) {
          .cabin-vessel-hero {
            margin-top: -48px;
          }
        }
        .cabin-vessel-hero__frame {
          position: relative;
          width: 100%;
          /* Cinematic 21:9 on desktop, 4:3 on phones - the
             yacht's broadside is the shot we want to land. */
          aspect-ratio: 21 / 9;
          max-height: 56vh;
          overflow: hidden;
          background: #050505;
        }
        @media (max-width: 767.98px) {
          .cabin-vessel-hero__frame {
            aspect-ratio: 4 / 3;
            max-height: 44vh;
          }
        }
        .cabin-vessel-hero__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 40%;
          display: block;
          /* Subtle warm tint so all yachts read on-brand even if
             the photo is shot under harsh midday light. */
          filter: saturate(1.02) contrast(1.02);
        }
        .cabin-vessel-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(13, 27, 42, 0) 0%,
            rgba(13, 27, 42, 0) 45%,
            rgba(13, 27, 42, 0.55) 80%,
            rgba(13, 27, 42, 0.78) 100%
          );
          pointer-events: none;
        }
        .cabin-vessel-hero__caption {
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 24px;
          color: var(--gy-ivory, #F8F5F0);
          z-index: 1;
        }
        @media (max-width: 479.98px) {
          .cabin-vessel-hero__caption {
            left: 18px;
            right: 18px;
            bottom: 18px;
          }
        }
        .cabin-vessel-hero__eyebrow {
          font-family: var(--gy-font-ui, system-ui, sans-serif);
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gy-gold, #C9A84C);
          font-weight: 500;
          margin-bottom: 8px;
        }
        .cabin-vessel-hero__name {
          font-family: var(--gy-font-editorial, Georgia, serif);
          font-weight: 300;
          font-size: 36px;
          line-height: 1.05;
          letter-spacing: -0.6px;
          margin: 0;
          color: var(--gy-ivory, #F8F5F0);
        }
        @media (min-width: 768px) {
          .cabin-vessel-hero__name { font-size: 52px; }
        }
        @media (max-width: 479.98px) {
          .cabin-vessel-hero__name { font-size: 28px; }
        }
        .cabin-vessel-hero__model {
          font-style: italic;
          color: rgba(248, 245, 240, 0.78);
          font-size: 0.62em;
          letter-spacing: 0;
        }
        .cabin-vessel-hero__dates {
          font-family: var(--gy-font-ui, system-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 2.4px;
          text-transform: uppercase;
          color: rgba(248, 245, 240, 0.78);
          margin-top: 12px;
        }
      `}</style>
    </section>
  );
}
