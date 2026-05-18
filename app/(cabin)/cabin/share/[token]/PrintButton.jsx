"use client";

// Tiny client island for the read-only preference-sheet share view.
// Server components can't carry onClick, so the print trigger lives
// here. Style mirrors the CRM PrintButton so the two views look
// identical side-by-side.

export default function PrintButton({ label = "Print / save as PDF" }) {
  return (
    <button
      type="button"
      onClick={() => globalThis.print()}
      style={{
        background: "#C9A84C",
        color: "#0D1B2A",
        padding: "8px 16px",
        border: 0,
        fontSize: 10,
        letterSpacing: 2,
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}
