"use client";

// C2 — Destination hero with optional video background.
//
// George 2026-04-20: "Destination page upgrade... hero video per region".
// Drop-in hero component used by every /destinations/<region> page.
// Supports two modes:
//
//   1. Image hero (default) — what we already had. Grayscale parallax
//      Sanity/CDN image. Zero change to SEO.
//
//   2. Video hero — pass `videoUrl` and it replaces the background with
//      a muted, looping, auto-playing <video>. The image becomes the
//      poster so there's no flash before metadata loads and LCP stays
//      clean. If the browser blocks autoplay, the poster image still
//      covers the hero — no blank state.
//
// Accessibility:
//   • prefers-reduced-motion: reduce → video is skipped entirely,
//     the poster image is used. No looping motion for sensitive users.
//   • Always muted, loop, playsinline — required for iOS autoplay.
//
// To add a video later, drop a URL (public/videos/cyclades.mp4 or
// a Sanity-hosted mp4) into the destination page's props. No other
// edits needed.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function DestinationHero({
  imageUrl,
  imageAlt = "Destination yacht charter Greece",
  videoUrl = null,
  eyebrow = "Destination Guide",
  title,
  subtitle,
}) {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Respect reduced motion + only activate video when URL provided.
    if (!videoUrl) return;
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reduced) return;
    setShowVideo(true);
  }, [videoUrl]);

  // Parallax: drift the background media slowly on scroll. The existing
  // DestinationContent looks for `.svc-hero__bg` and translates it, so
  // we keep that class on whatever element is visible.
  return (
    <section className="svc-hero">
      {/* Always render the image — it's also the video poster */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          className="svc-hero__bg"
          sizes="100vw"
          style={{ opacity: showVideo ? 0 : 1, transition: "opacity 0.8s ease" }}
        />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className="svc-hero__bg"
          src={videoUrl}
          poster={imageUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}

      <div className="svc-hero__gradient" />
      <div className="svc-hero__content">
        {eyebrow ? <p className="svc-hero__eyebrow">{eyebrow}</p> : null}
        <h1 className="svc-hero__title">{title}</h1>
        <div className="svc-hero__line" />
        {subtitle ? <p className="svc-hero__subtitle">{subtitle}</p> : null}
      </div>
    </section>
  );
}
