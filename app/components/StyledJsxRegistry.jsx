"use client";

// 2026-09-18 — styled-jsx needs a registry in the App Router, or its CSS
// never reaches the server HTML. Measured on the live site: 56 components
// carry <style jsx>, and not one of their rules was in the response. Every
// page painted first without them and again after hydration, when the
// client injected the styles; the hero re-laid out at that moment and
// Chrome recorded the largest contentful paint there (8 to 10 s on a
// throttled phone), while the closed mobile menu, still unstyled, was
// counted as the largest paint on the text pages. This is the pattern
// from the Next.js documentation: collect the styles during the server
// render and insert them into the streamed HTML.
import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { StyleRegistry, createStyleRegistry } from "styled-jsx";

export default function StyledJsxRegistry({ children }) {
  const [registry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}
