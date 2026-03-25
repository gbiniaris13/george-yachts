import { sanityClient } from "@/lib/sanity";

const BASE_URL = "https://georgeyachts.com";

const staticRoutes = [
    "",
    "/about-us",
    "/blog",
    "/charter-yacht-greece",
    "/cookie-policy",
    "/faq",
    "/luxury-villas-greece",
    "/privacy-policy",
    "/private-jet-charter",
    "/team",
    "/team/chris-daskalopoulos",
    "/team/elleana-karvouni",
    "/team/george-biniaris",
    "/team/george-katrantzos",
    "/team/manos-kourmoulakis",
    "/team/nemesis",
    "/team/valleria-karvouni",
    "/vip-transfers-greece",
    "/yacht-itineraries-greece",
    "/yachts-for-sale",
  ];

export default async function sitemap() {
    const staticEntries = staticRoutes.map((route) => ({
          url: `${BASE_URL}${route}`,
          lastModified: new Date().toISOString(),
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
          console.error("Sitemap: failed to fetch blog posts from Sanity", error);
    }

  return [...staticEntries, ...blogEntries];
}
