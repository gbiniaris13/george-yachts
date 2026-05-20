// app/components/cabin/CabinIcon.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 4 (Tyler, Margaret, Helen):
//   "The icon grid mixes 13 different Unicode glyphs from
//    different design eras (✎ ✺ ◇ ⚓ ✿ ⛵ ❖ ⊿ ▣ ✉ ◐ ▢ ⤓). ⚓
//    renders as iOS color emoji while the rest are mono. ▣ and ▢
//    are nearly identical squares. Pick one icon family or
//    commission illustrations."
//
// One consistent line-icon set in pure SVG. Same stroke weight,
// same viewport (24px), same hand. No external dependency, no
// font file, no color emoji that varies per OS.
//
// Usage:  <CabinIcon name="brief" />
// =============================================================

const ICONS = {
  // The Charter Brief — a quill
  brief: (
    <>
      <path d="M5 19l3-1 9-9-2-2-9 9-1 3z" />
      <path d="M14 6l2 2" />
      <path d="M5 19l-1 2 2-1" />
    </>
  ),
  // Chat with George — speech bubble
  chat: (
    <>
      <path d="M4 5h16v11H8l-4 3z" />
    </>
  ),
  // Group / My details — interlinked rings
  group: (
    <>
      <circle cx="9" cy="11" r="3.5" />
      <circle cx="15" cy="13" r="3.5" />
    </>
  ),
  // Crew — anchor
  crew: (
    <>
      <circle cx="12" cy="6" r="2" />
      <path d="M12 8v12" />
      <path d="M7 15c0 3 2 5 5 5s5-2 5-5" />
      <path d="M9 11h6" />
    </>
  ),
  // Sample Menu — fork + knife
  menu: (
    <>
      <path d="M7 4v8a2 2 0 002 2v6" />
      <path d="M9 4v6" />
      <path d="M15 4v16" />
      <path d="M14 4c-1 0-1 3 0 4 1 0 1-4 0-4z" />
    </>
  ),
  // Vessel — boat profile
  vessel: (
    <>
      <path d="M12 4v9" />
      <path d="M7 11h10" />
      <path d="M4 16h16l-2 3H6l-2-3z" />
    </>
  ),
  // Mood Board — diamond pinned
  mood: (
    <>
      <path d="M12 3l8 9-8 9-8-9 8-9z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  // Before You Sail — compass
  before: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 5l2 5-2 7-2-7 2-5z" />
    </>
  ),
  // Voyage Album — stacked frames
  album: (
    <>
      <rect x="5" y="6" width="11" height="11" />
      <rect x="8" y="9" width="11" height="11" />
    </>
  ),
  // Time Capsule — envelope
  capsule: (
    <>
      <rect x="4" y="6" width="16" height="13" />
      <path d="M4 6l8 6 8-6" />
    </>
  ),
  // Filotimo Circle — concentric rings
  circle: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  // Your Data — locked square
  data: (
    <>
      <rect x="5" y="10" width="14" height="9" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </>
  ),
  // Add to Phone — download arrow into device
  install: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M12 8v6" />
      <path d="M9 12l3 3 3-3" />
    </>
  ),
};

export default function CabinIcon({ name, size = 26, className = "" }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {path}
    </svg>
  );
}
