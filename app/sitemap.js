import { sanityClient } from "@/lib/sanity";

const BASE_URL = "https://georgeyachts.com";

const staticRoutes = [
  // Core pages
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/charter-yacht-greece", priority: 0.95, changeFrequency: "daily" },
  { path: "/private-fleet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/explorer-fleet", priority: 0.9, changeFrequency: "weekly" },
  { path: "/how-it-works", priority: 0.85, changeFrequency: "monthly" },
  { path: "/charter-timeline", priority: 0.8, changeFrequency: "monthly" },

  // Interactive tools
  { path: "/yacht-finder", priority: 0.85, changeFrequency: "weekly" },
  { path: "/cost-calculator", priority: 0.85, changeFrequency: "monthly" },
  { path: "/itinerary-builder", priority: 0.85, changeFrequency: "monthly" },
  { path: "/island-quiz", priority: 0.8, changeFrequency: "monthly" },
  { path: "/yacht-size-visualizer", priority: 0.8, changeFrequency: "monthly" },
  { path: "/proposal-generator", priority: 0.7, changeFrequency: "monthly" },

  // Content
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/yacht-itineraries-greece", priority: 0.8, changeFrequency: "monthly" },

  // Destinations
  { path: "/destinations", priority: 0.85, changeFrequency: "monthly" },
  { path: "/destinations/cyclades", priority: 0.85, changeFrequency: "monthly" },
  { path: "/destinations/ionian", priority: 0.85, changeFrequency: "monthly" },
  { path: "/destinations/saronic", priority: 0.85, changeFrequency: "monthly" },
  { path: "/destinations/sporades", priority: 0.85, changeFrequency: "monthly" },

  // Services
  { path: "/yachts-for-sale", priority: 0.8, changeFrequency: "weekly" },
  { path: "/private-jet-charter", priority: 0.75, changeFrequency: "monthly" },
  { path: "/vip-transfers-greece", priority: 0.75, changeFrequency: "monthly" },
  { path: "/luxury-villas-greece", priority: 0.75, changeFrequency: "monthly" },

  // Company
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/team", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.85, changeFrequency: "monthly" },
  { path: "/events", priority: 0.7, changeFrequency: "monthly" },

  // Team members
  { path: "/team/george-biniaris", priority: 0.6, changeFrequency: "monthly" },
  { path: "/team/george-katrantzos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/elleana-karvouni", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/chris-daskalopoulos", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/valleria-karvouni", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/manos-kourmoulakis", priority: 0.5, changeFrequency: "monthly" },
  { path: "/team/nemesis", priority: 0.3, changeFrequency: "monthly" },

  // Legal
  { path: "/terms-of-service", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/your-privacy-security", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap() {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let blogEntries = [];
  try {
    const posts = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
    blogEntries = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt || new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch blog posts", error);
  }

  let yachtEntries = [];
  try {
    const yachts = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
    );
    yachtEntries = yachts.map((yacht) => ({
      url: `${BASE_URL}/yachts/${yacht.slug}`,
      lastModified: yacht._updatedAt || new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch yachts", error);
  }

  return [...staticEntries, ...blogEntries, ...yachtEntries];
}
