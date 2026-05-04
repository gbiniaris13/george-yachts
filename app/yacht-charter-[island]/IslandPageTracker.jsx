"use client";
// N.1 — fires `island_page_visited` once per mount on the island
// landing pages so we can measure programmatic-SEO traffic in GA4
// without polluting page_view with a second copy.
import { useEffect } from "react";

export default function IslandPageTracker({ slug, name }) {
  useEffect(() => {
    try {
      window.gtag?.("event", "island_page_visited", { island_slug: slug, island_name: name });
    } catch {}
  }, [slug, name]);
  return null;
}
