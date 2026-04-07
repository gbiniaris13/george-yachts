import React from "react";
import { urlFor } from "../../lib/sanity";

export const RichTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="relative w-full h-[50vh] md:h-[70vh] my-16 border border-white/10">
          <img
            src={urlFor(value).url()}
            alt={value.alt || "Editorial Image"}
            className="object-cover w-full h-full"
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
                  <tr style={{ backgroundColor: "#0D1B2A" }}>
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
    // Normal paragraphs
    normal: ({ children }) => (
      <p className="text-white/70 font-sans font-light text-base md:text-lg leading-loose mb-8">
        {children}
      </p>
    ),
    // H2 Headings
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl text-white font-marcellus mt-16 mb-6 uppercase tracking-wide">
        {children}
      </h2>
    ),
    // H3 Headings
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl text-[#DAA520] font-marcellus mt-12 mb-4">
        {children}
      </h3>
    ),
    // Blockquotes (styled luxuriously with a gold border)
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#DAA520] pl-6 md:pl-8 my-12 py-2">
        <p className="text-2xl md:text-3xl text-white italic font-marcellus leading-relaxed opacity-90">
          {children}
        </p>
      </blockquote>
    ),
  },
  marks: {
    // Links inside text
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-[#DAA520] hover:text-white border-b border-[#DAA520]/30 hover:border-white transition-colors duration-300"
        >
          {children}
        </a>
      );
    },
    // Bold text
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
