"use client";

// 2026-05-21 — Pass 7 batch 9 (Domingo's third pass on the same item):
//
//   The Charter at a Glance group-headers and row-keys kept computing
//   to rgb(248, 245, 240) (ivory) in Domingo's automation environment
//   despite three layers of fix:
//     1. cabin-tones.css `[data-cabin-mode] .cabin-at-a-glance__group-label
//        { color: rgba(13,27,42,.85) !important }`
//     2. component-inline <style> block with `color: #1f2937 !important`
//     3. JSX `style={{ color: "#1f2937", fontWeight: 600 }}` attribute
//
//   I grepped every CSS chunk served from production for any rule that
//   could paint this class ivory — there is none. The cascade cannot
//   explain his measurement. Likely cause is a runtime CSS injection
//   from the testing automation context that the inspector doesn't
//   surface. Cannot reproduce, cannot diagnose blind.
//
//   This component takes the only path that survives every cascade
//   scenario: it writes the color directly to the element's
//   `element.style` via DOM API with `'important'` priority on the
//   second `setProperty` argument. The resulting rendered DOM has
//   literally `style="color: rgb(31, 41, 55) !important"` on the
//   element. That beats every external CSS rule, every inheritance,
//   every author-stylesheet !important, every styled-jsx block. The
//   only thing that can override is a USER stylesheet at the
//   OS/browser level — which is not in play here.
//
//   Use this for cabin labels that have to be guaranteed-dark
//   regardless of what runs above us in the stylesheet stack.
import { useEffect, useRef } from "react";

export default function ForceDarkLabel({
  as: Tag = "div",
  className,
  children,
  // Default to the dark slate the rest of the cabin uses.
  color = "#1f2937",
  weight = 600,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty("color", color, "important");
      ref.current.style.setProperty("font-weight", String(weight), "important");
    }
  }, [color, weight]);

  // Fall-through inline style (without !important) for server-side
  // first paint, before useEffect runs on the client. Avoids a
  // visible flash of cream text on slow networks.
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ color, fontWeight: weight }}
    >
      {children}
    </Tag>
  );
}
