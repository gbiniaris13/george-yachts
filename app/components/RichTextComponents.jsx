import React from "react";
import Link from "next/link";
import { urlFor } from "../../lib/sanity";

const INTERNAL_HOSTS = ["georgeyachts.com", "www.georgeyachts.com"];

const OWN_PROPERTIES = [
  "calendly.com/george-georgeyachts",
  "wa.me/17867988798",
  "linkedin.com/in/georgebiniaris",
  "instagram.com/georgeyachts",
];

const TRUSTED_AUTHORITIES = [
  "myba-association.com",
  "iyba.org",
  "ynanp.gr",
  "knightfrank.com",
  "schema.org",
  "google.com",
  "wikipedia.org",
];

function classifyLink(href) {
  try {
    const url = new URL(href, "https://georgeyachts.com");
    const host = url.hostname.toLowerCase();
    const fullUrl = url.href.toLowerCase();

    const isInternal = INTERNAL_HOSTS.some(
      (h) => host === h || host.endsWith("." + h)
    );
    const isOwnProperty = OWN_PROPERTIES.some((p) => fullUrl.includes(p));
    const isTrustedAuthority = TRUSTED_AUTHORITIES.some(
      (a) => host === a || host.endsWith("." + a)
    );

    return { isInternal, isOwnProperty, isTrustedAuthority };
  } catch {
    return { isInternal: true, isOwnProperty: false, isTrustedAuthority: false };
  }
}

const linkStyle =
  "text-[#DAA520] hover:text-white border-b border-[#DAA520]/30 hover:border-white transition-colors duration-300";

export const RichTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="relative w-full h-[50vh] md:h-[70vh] my-16 border border-white/10">
          <img
            src={urlFor(value).width(1200).format('webp').quality(75).url()}
            alt={value.alt || "Editorial Image"}
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    },
    table: ({ value }) => {
      const { rows = [], headerRow = true, caption } = value;
      if (!rows.length) return null;

      const headerData = headerRow ? rows[0] : null;
      const bodyRows = headerRow ? rows.slice(1) : rows;

      const cellStyle = (isHeader) => ({
        padding: "12px 16px",
        textAlign: "left",
        color: isHeader ? "#F8F5F0" : "#1a1a1a",
        fontFamily: isHeader
          ? "var(--font-montserrat), Montserrat, sans-serif"
          : "Lato, var(--font-sans), sans-serif",
        fontWeight: isHeader ? 600 : 300,
        fontSize: "0.95rem",
        lineHeight: 1.6,
        borderBottom: isHeader ? "2px solid #C9A84C" : "1px solid #e5e5e5",
      });

      return (
        <div className="my-12">
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderLeft: "3px solid #C9A84C",
                minWidth: "480px",
              }}
            >
              {headerData && (
                <thead>
                  <tr style={{ backgroundColor: "#000000" }}>
                    {(headerData.cells || []).map((cell, i) => (
                      <th key={i} style={cellStyle(true)}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, bodyIdx) => (
                  <tr
                    key={bodyIdx}
                    style={{
                      backgroundColor: bodyIdx % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    }}
                  >
                    {(row.cells || []).map((cell, i) => (
                      <td key={i} style={cellStyle(false)}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {caption && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.4)",
                fontStyle: "italic",
                fontFamily: "var(--font-sans), sans-serif",
              }}
            >
              {caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="text-white/70 font-sans font-light text-base md:text-lg leading-loose mb-8">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl text-white font-marcellus mt-16 mb-6 uppercase tracking-wide">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl text-[#DAA520] font-marcellus mt-12 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#DAA520] pl-6 md:pl-8 my-12 py-2">
        <p className="text-2xl md:text-3xl text-white italic font-marcellus leading-relaxed opacity-90">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const { isInternal, isOwnProperty, isTrustedAuthority } = classifyLink(href);

      // Internal link — Next.js Link for SPA navigation + prefetching
      if (isInternal) {
        const path = href.replace(/^https?:\/\/(www\.)?georgeyachts\.com/, "") || "/";
        return (
          <Link href={path} className={linkStyle}>
            {children}
          </Link>
        );
      }

      // Own property (Calendly, WhatsApp, LinkedIn, Instagram) — dofollow, new tab
      if (isOwnProperty) {
        return (
          <a href={href} target="_blank" rel="noopener" className={linkStyle}>
            {children}
          </a>
        );
      }

      // Trusted authority (MYBA, IYBA, Greek gov) — dofollow for E-E-A-T, new tab
      if (isTrustedAuthority) {
        return (
          <a href={href} target="_blank" rel="noopener" className={linkStyle}>
            {children}
          </a>
        );
      }

      // All other external — nofollow + noopener, new tab
      return (
        <a href={href} target="_blank" rel="nofollow noopener" className={linkStyle}>
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="text-white font-semibold tracking-wide">
        {children}
      </strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 md:pl-8 space-y-4 text-white/70 font-sans font-light text-base md:text-lg mb-8">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 md:pl-8 space-y-4 text-white/70 font-sans font-light text-base md:text-lg mb-8">
        {children}
      </ol>
    ),
  },
};
