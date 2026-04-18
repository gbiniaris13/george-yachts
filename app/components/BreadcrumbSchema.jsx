/**
 * BreadcrumbSchema.jsx - Renders JSON-LD BreadcrumbList for SEO.
 *
 * Usage:
 *   <BreadcrumbSchema items={[
 *     { name: "Home", url: "https://georgeyachts.com/" },
 *     { name: "Yachts", url: "https://georgeyachts.com/charter-yacht-greece" },
 *     { name: "Serenissima", url: "https://georgeyachts.com/yachts/serenissima" },
 *   ]} />
 *
 * Non-visual — pure structured data for Google + AI search engines.
 */

export default function BreadcrumbSchema({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
