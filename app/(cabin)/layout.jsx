// app/(cabin)/layout.jsx
// =============================================================
// Route-group layout for The Cabin · Filotimo.
//
// Wraps every page under /cabin/* with a scoped div that we use
// to silence the global site chrome (nav drawers, sticky CTAs,
// pop-ups) and apply iPhone-style polish.
//
// Approach: this layout sets a `data-cabin-mode` attribute on
// the wrapper. A targeted block in globals.css hides global
// components when this attribute is present in the ancestor
// chain. Less invasive than editing every global component.
// =============================================================

export const metadata = {
  title: "The Cabin · George Yachts",
  description:
    "Your private space at George Yachts — Filotimo · Φιλότιμο.",
  robots: { index: false, follow: false },     // never indexed
  manifest: "/cabin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "The Cabin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/cabin/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/cabin/icons/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export const viewport = {
  themeColor: "#0D1B2A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

import CabinBodyClass from "../components/cabin/CabinBodyClass";
// 2026-05-20 — Global readability override for the small uppercase
// tracked labels across the cabin. See cabin-tones.css for the why.
import "./cabin-tones.css";

export default function CabinRouteGroupLayout({ children }) {
  return (
    <div
      data-cabin-mode="true"
      style={{
        minHeight: "100dvh",
        background: "var(--gy-ivory, #F8F5F0)",
        color: "var(--gy-navy, #0D1B2A)",
        fontFamily: "var(--gy-font-body)",
        position: "relative",
        zIndex: 100,
      }}
    >
      <CabinBodyClass />
      {children}
    </div>
  );
}
