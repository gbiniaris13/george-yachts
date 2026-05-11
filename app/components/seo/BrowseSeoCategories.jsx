// Internal-linking block surfaced on the fleet page (and anywhere
// else we want to push SEO authority to the 22 new programmatic
// landing pages). Three-column compact list — yacht type, occasion,
// long-tail — each a short ladder of 6 to 8 internal links.
//
// 2026-05-11 (Phase 7 SEO strategy doc) — internal linking is a
// first-order ranking factor. Surfacing the new SEO pages from the
// fleet page (which itself ranks well) passes authority through.

import Link from "next/link";

const GOLD = "#C9A84C";

const TYPE_LINKS = [
  { label: "Motor yacht charter", href: "/motor-yacht-charter-greece" },
  { label: "Sailing yacht charter", href: "/sailing-yacht-charter-greece" },
  { label: "Catamaran charter", href: "/catamaran-charter-greece" },
  { label: "Sailing catamaran charter", href: "/sailing-catamaran-charter-greece" },
  { label: "Crewed catamaran charter", href: "/crewed-catamaran-charter-greece" },
  { label: "Superyacht charter", href: "/superyacht-charter-greece" },
  { label: "Megayacht charter", href: "/mega-yacht-charter-greece" },
  { label: "Gulet charter", href: "/gulet-charter-greece" },
];

const OCCASION_LINKS = [
  { label: "Honeymoon charters", href: "/honeymoon-yacht-charter-greece" },
  { label: "Family charters", href: "/family-yacht-charter-greece" },
  { label: "Corporate charters", href: "/corporate-yacht-charter-greece" },
  { label: "Wedding charters", href: "/wedding-yacht-charter-greece" },
  { label: "Birthday charters", href: "/birthday-yacht-charter-greece" },
  { label: "Anniversary charters", href: "/anniversary-yacht-charter-greece" },
  { label: "Group charters", href: "/group-yacht-charter-greece" },
  { label: "Photoshoot charters", href: "/photoshoot-yacht-charter-greece" },
];

const SPECIALIST_LINKS = [
  { label: "2026 season guide", href: "/private-yacht-charter-greece-2026" },
  { label: "With private chef", href: "/luxury-yacht-charter-greece-with-private-chef" },
  { label: "All-inclusive contracts", href: "/all-inclusive-yacht-charter-greece" },
  { label: "Tenders, toys, e-foils", href: "/yacht-charter-greece-with-tender-and-toys" },
  { label: "Multi-yacht flotillas", href: "/multi-yacht-charter-greece-large-group" },
  { label: "Off-market exclusives", href: "/exclusive-yacht-charter-greece" },
];

function Column({ heading, items }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 600,
          margin: "0 0 18px",
        }}
      >
        {heading}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 14,
                color: "rgba(248, 245, 240, 0.82)",
                textDecoration: "none",
                borderBottom: "1px solid transparent",
                transition: "color 0.3s ease, border-color 0.3s ease",
                paddingBottom: 2,
              }}
              className="gy-seo-cat-link"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BrowseSeoCategories() {
  return (
    <section
      aria-label="Browse charter options"
      style={{
        background: "#0D1B2A",
        borderTop: "1px solid rgba(201,168,76,0.18)",
        borderBottom: "1px solid rgba(201,168,76,0.18)",
        padding: "72px 24px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
            margin: "0 0 14px",
            textAlign: "center",
          }}
        >
          Find the right charter
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 300,
            color: "#F8F5F0",
            margin: "0 0 48px",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Browse the fleet by what you actually need
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 40,
          }}
        >
          <Column heading="By yacht type" items={TYPE_LINKS} />
          <Column heading="By occasion" items={OCCASION_LINKS} />
          <Column heading="Specialist briefs" items={SPECIALIST_LINKS} />
        </div>
      </div>
      <style>{`
        .gy-seo-cat-link:hover {
          color: #F8F5F0 !important;
          border-bottom-color: ${GOLD} !important;
        }
      `}</style>
    </section>
  );
}
