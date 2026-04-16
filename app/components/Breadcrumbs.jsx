import React from "react";
import Link from "next/link";

export default function Breadcrumbs({ items }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="px-8 md:px-20 py-4 text-[9px] tracking-[0.4em] uppercase"
    >
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2 text-white/20">/</span>}
          {item.url ? (
            <Link
              href={item.url}
              className="text-white/40 hover:text-[#DAA520] transition-colors duration-300"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-white/60">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
