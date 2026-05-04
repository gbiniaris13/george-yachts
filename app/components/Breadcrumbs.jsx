import React from "react";
import Link from "next/link";

// A.6 + A.13 (Roberto brief): breadcrumb contrast bumped — separators
// /20 → /45, links /40 → /65, current page /60 → /85 — so Google
// + 50+ visitors can actually read the trail. Gold separator angle
// "›" replaces the slash for a more luxe feel that matches the
// brand register.
export default function Breadcrumbs({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="px-8 md:px-20 py-4 text-[10px] tracking-[0.32em] uppercase"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && (
            <span
              className="mx-2 text-[#DAA520]/55"
              aria-hidden="true"
            >
              ›
            </span>
          )}
          {item.url ? (
            <Link
              href={item.url}
              className="text-white/65 hover:text-[#DAA520] transition-colors duration-300"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-white/85" aria-current="page">
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
