// app/components/PageBreadcrumb.jsx
// =============================================================
// Standalone-page breadcrumb emitter. The shared SEO components
// (SeoLanding, BestYachtsPage, BottomFunnelPage, etc.) already
// emit BreadcrumbSchema for the ~200 programmatic pages and the
// Sanity yacht / blog templates. This component fills in the
// remaining ~30 hand-coded marketing + utility pages so we have
// site-wide coverage.
//
// Usage:
//   <PageBreadcrumb path="/about-us" />
//   <PageBreadcrumb path="/tools/charter-cost-calculator" title="Cost Calculator" />
//
// The component looks up the path in BREADCRUMB_HIERARCHIES below
// for a hand-tuned trail. If the path isn't listed, we fall back
// to a generic Home > [path-segment] breakdown so a missing entry
// doesn't drop the breadcrumb entirely.
//
// Non-visual — pure JSON-LD output.
// =============================================================

import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

const BASE = "https://georgeyachts.com";

// Hand-tuned hierarchies for known standalone pages. Each entry is
// the list of intermediate items BETWEEN Home and the page itself.
// "Home" is prepended automatically, the page's own item is
// appended from the title + path. Categorised by purpose.
const BREADCRUMB_HIERARCHIES = {
  // ─── Marketing / company ─────────────────────────────────
  "/about-us": { title: "About George Yachts", trail: [] },
  "/credentials": { title: "Credentials", trail: [{ name: "About", url: `${BASE}/about-us` }] },
  "/press": { title: "Press", trail: [{ name: "About", url: `${BASE}/about-us` }] },
  "/team": { title: "Our Team", trail: [{ name: "About", url: `${BASE}/about-us` }] },
  "/ai-research": { title: "AI Research Hub", trail: [{ name: "About", url: `${BASE}/about-us` }] },
  "/charter-timeline": { title: "Charter Timeline", trail: [{ name: "How It Works", url: `${BASE}/how-it-works` }] },
  "/faq": { title: "Frequently Asked Questions", trail: [] },
  "/inquiry": { title: "Inquiry", trail: [] },
  "/newsletter": { title: "Newsletter", trail: [] },
  "/events": { title: "Events", trail: [{ name: "About", url: `${BASE}/about-us` }] },

  // ─── Tools & calculators ─────────────────────────────────
  "/cost-calculator": { title: "Cost Calculator", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/itinerary-builder": { title: "Itinerary Builder", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/island-quiz": { title: "Island Quiz", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/yacht-finder": { title: "Yacht Finder", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/yacht-size-visualizer": { title: "Yacht Size Visualizer", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/proposal-generator": { title: "Proposal Generator", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/pricing-calendar": { title: "Pricing Calendar", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },
  "/weather-greece": { title: "Greece Weather", trail: [{ name: "Tools", url: `${BASE}/tools/charter-cost-calculator` }] },

  // ─── Services ────────────────────────────────────────────
  "/private-jet-charter": { title: "Private Jet Charter", trail: [{ name: "Services", url: `${BASE}/about-us` }] },
  "/vip-transfers-greece": { title: "VIP Transfers Greece", trail: [{ name: "Services", url: `${BASE}/about-us` }] },
  "/luxury-villas-greece": { title: "Luxury Villas Greece", trail: [{ name: "Services", url: `${BASE}/about-us` }] },

  // ─── Editorial / content hubs ────────────────────────────
  "/blog": { title: "Journal", trail: [] },
  "/yacht-itineraries-greece": { title: "Yacht Itineraries Greece", trail: [{ name: "Journal", url: `${BASE}/blog` }] },
  "/greece-by-yacht": { title: "Greece by Yacht", trail: [{ name: "Journal", url: `${BASE}/blog` }] },

  // ─── Legal ───────────────────────────────────────────────
  "/cookie-policy": { title: "Cookie Policy", trail: [{ name: "Legal", url: `${BASE}/terms` }] },
  "/privacy-policy": { title: "Privacy Policy", trail: [{ name: "Legal", url: `${BASE}/terms` }] },
  "/terms": { title: "Terms", trail: [{ name: "Legal", url: `${BASE}/terms` }] },
  "/your-privacy-security": { title: "Your Privacy & Security", trail: [{ name: "Legal", url: `${BASE}/terms` }] },
};

// Generic fallback — derive a single-segment "Home > Title" trail
// from the raw path slug. Used when a path isn't in the hand-tuned
// map above.
function deriveFallback(path) {
  if (!path || path === "/") return null;
  const clean = path.replace(/^\/|\/$/g, "").replace(/-/g, " ");
  return { title: clean.replace(/\b\w/g, (c) => c.toUpperCase()), trail: [] };
}

export default function PageBreadcrumb({ path, title }) {
  const entry = BREADCRUMB_HIERARCHIES[path] || deriveFallback(path);
  if (!entry) return null;
  const pageUrl = `${BASE}${path}`;
  const pageTitle = title || entry.title;
  const items = [
    { name: "Home", url: `${BASE}/` },
    ...(entry.trail || []),
    { name: pageTitle, url: pageUrl },
  ];
  return <BreadcrumbSchema items={items} />;
}
