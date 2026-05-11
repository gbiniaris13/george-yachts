"use client";

// K.1 (Roberto master rebuild brief, May 2026) —
// Favorites auto-prompt for email capture.
//
// Triggers a single non-blocking modal the moment the user has
// saved their 2nd yacht to favorites. The modal asks "Want me to
// save this shortlist for you?" — explicit value exchange, not a
// coy upsell.
//
// Frequency rules (anti-annoyance):
//   • First trigger: at favorites-count = 2.
//   • If user dismisses without submitting: re-trigger at count
//     = 3 only. After that, never again in this browser.
//   • If user submits: never again in this browser.
//   • State persists in localStorage so the gate respects past
//     decisions across sessions.
//
// Implementation:
//   • Mounted once globally inside WishlistProvider's children
//     (added to RootLayout). Reads useWishlist().items.length.
//   • Re-uses the existing ExpressInquiryModal — no new modal
//     surface. Source tag "favorites_auto_prompt" routes the
//     Telegram alert correctly.

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useWishlist } from "./WishlistProvider";

const ExpressInquiryModal = dynamic(() => import("./ExpressInquiryModal"), {
  ssr: false,
});

const STORAGE_KEY = "gy_fav_prompt_state";
// Possible values: "shown_2" | "shown_3" | "submitted" | undefined.

function readState() {
  if (typeof window === "undefined") return undefined;
  try {
    return localStorage.getItem(STORAGE_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function writeState(v) {
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {}
}

export default function FavoritesEmailPrompt() {
  const { items } = useWishlist();
  const [open, setOpen] = useState(false);
  const evaluatedRef = useRef(null);

  useEffect(() => {
    const count = items.length;
    if (count < 2) return;

    const state = readState();
    if (state === "submitted") return;

    // Re-evaluate per fresh count change. Skip if we've already
    // evaluated this exact count in this session — useEffect can
    // re-run from re-renders without an actual count change.
    if (evaluatedRef.current === count) return;
    evaluatedRef.current = count;

    if (count === 2 && state !== "shown_2") {
      setOpen(true);
      writeState("shown_2");
    } else if (count === 3 && state === "shown_2") {
      setOpen(true);
      writeState("shown_3");
    }
  }, [items.length]);

  // Build a shortlist payload for the modal so the Telegram
  // notification + email auto-reply already include the saved
  // yachts — George sees what they liked without prompting.
  const shortlist = items.map((y) => ({
    slug: y.slug,
    name: y.name,
    weeklyRatePrice: y.price,
  }));

  return (
    <ExpressInquiryModal
      open={open}
      onClose={() => setOpen(false)}
      shortlist={shortlist}
      source="favorites_auto_prompt"
      title="Save this shortlist for later"
      subtitle="I can also share these with George for a personalized proposal."
    />
  );
}
