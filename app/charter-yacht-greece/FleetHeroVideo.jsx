"use client";

// 2026-10-28, the fleet page stops sending an 18 MB film to every phone.
//
// The fleet hero was a plain <video preload="auto" autoPlay> in the server
// page, which is an instruction to every browser to start downloading
// /videos/fleet-catamarans.mp4 (18.1 MB, the largest file on the site)
// the moment the page is parsed, on a phone as much as on a desk. The
// audit of 27 October measured this route at 44/100 on mobile, and it is
// the page nearly every request has passed through.
//
// Same decision the home hero makes (app/components/VideoSection.jsx,
// 2026-08-21): the element renders exactly as before, byte for byte in
// the markup except for the two attributes, and the effect below decides
// per device. A coarse pointer, a narrow screen or a Save-Data hint means
// the poster is the final answer and no connection is opened. A desk gets
// preload="auto" and play() one tick after hydration, which is the same
// film a few milliseconds later.
//
// Neither autoPlay nor preload="auto" is rendered: a browser begins the
// fetch from the parsed attribute, before any effect could take it back.
//
// Nothing visible changes and the content hash (scripts/freshness.mjs
// reads text only) does not move.

import { useEffect, useRef } from "react";

export default function FleetHeroVideo() {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const nav = typeof navigator !== "undefined" ? navigator : {};
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const frugal =
      (conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || ""))) ||
      false;
    const handheld =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 1024px)").matches;
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (handheld || frugal || stillness) return;
    video.preload = "auto";
    video.muted = true;
    const playPromise = video.play?.();
    if (playPromise && typeof playPromise.catch === "function") {
      // Autoplay denied: the poster stays, nothing to undo.
      playPromise.catch(() => {});
    }
  }, []);

  return (
    <video
      ref={ref}
      className="fleet-hero__bg"
      poster="/images/posters/fleet-catamarans-frame1.jpg"
      preload="none"
      loop
      muted
      playsInline
      aria-label="George Yachts Charter Fleet Greece - catamarans in Greek waters"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    >
      <source src="/videos/fleet-catamarans.webm" type="video/webm" />
      <source src="/videos/fleet-catamarans.mp4" type="video/mp4" />
    </video>
  );
}
