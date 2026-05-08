"use client";

// Phase 27i.16 (2026-05-08) — cover-open transition wrapper.
//
// Drop-in replacement for next/link that uses the browser's
// native View Transitions API to morph the yacht-cover image
// between the listing card and the detail-page hero. Effect:
// click a yacht card → its photo expands and fills the viewport
// while the underlying route changes — like opening a magazine
// cover instead of a hard router cut.
//
// Implementation notes:
//   • View Transitions are Chromium ≥ 111 / Safari ≥ 18.2 native.
//     Firefox + older browsers fall through to a normal next/link
//     navigation — no breakage, just no flourish.
//   • Modifier-clicks (cmd / ctrl / shift) bypass the transition
//     so users can still open in a new tab.
//   • Pairing happens via CSS `view-transition-name` set on the
//     card image AND on the destination hero image. Same name on
//     both sides → the browser morphs them.
//   • The transition CSS (`::view-transition-old / -new`) lives in
//     globals.css under "yacht cover-open transition" and uses a
//     360 ms cubic-bezier so the morph reads as cinematic, not
//     snappy.

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ViewTransitionLink({
  href,
  onClick,
  children,
  prefetch,
  ...rest
}) {
  const router = useRouter();

  const handleClick = (e) => {
    // Always run the user-provided onClick (analytics, etc.) first.
    if (typeof onClick === "function") onClick(e);
    if (e.defaultPrevented) return;

    // Skip the VT path on modifier-click so "open in new tab" still
    // works the way the user expects.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    if (typeof document === "undefined") return;
    if (typeof document.startViewTransition !== "function") return;

    e.preventDefault();
    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link href={href} prefetch={prefetch} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
