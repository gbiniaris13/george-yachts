"use client";

// Adds `cabin-mode` class to <body> on mount, removes on unmount.
// Necessary because LiveTicker, WhatsAppButton, and a few other
// public-site chrome components use inline styles or Tailwind
// `fixed` classes that aren't selectable via a single CSS rule.
// The body class lets us hide them with one definitive selector.

import { useEffect } from "react";

export default function CabinBodyClass() {
  useEffect(() => {
    document.body.classList.add("cabin-mode");
    return () => {
      document.body.classList.remove("cabin-mode");
    };
  }, []);
  return null;
}
