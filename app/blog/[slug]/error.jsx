"use client";

// 2026-05-07 — defensive error boundary for /blog/[slug]. Belt-and-
// braces with the root-cause fix (Server-Component-safe Link usage in
// RichTextComponents + BlogPostFooter): if any future change re-
// introduces a render error, the user gets a graceful fallback
// instead of a hard 500 from Vercel.

import { useEffect } from "react";
import Link from "next/link";

export default function BlogSlugError({ error, reset }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[blog/[slug] error boundary]", error);
    }
  }, [error]);

  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center px-6"
      style={{ fontFamily: "var(--gy-font-editorial)" }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 10,
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          color: "#C9A84C",
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        The Journal · George Yachts
      </p>
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 300,
          color: "#F8F5F0",
          textAlign: "center",
          marginBottom: 14,
          lineHeight: 1.1,
        }}
      >
        This article is briefly unavailable.
      </h1>
      <p
        style={{
          color: "rgba(248,245,240,0.66)",
          fontSize: 16,
          maxWidth: 560,
          textAlign: "center",
          margin: "0 0 36px",
          lineHeight: 1.6,
        }}
      >
        We&rsquo;re aware and working on it. In the meantime, browse the rest of
        the journal or speak with George directly.
      </p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 22px",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "#0D1B2A",
            background: "#C9A84C",
            border: 0,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/blog"
          style={{
            padding: "10px 22px",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "#C9A84C",
            border: "1px solid #C9A84C",
            textDecoration: "none",
          }}
        >
          The Journal
        </Link>
      </div>
    </div>
  );
}
