export default function sitemap() {
  const BASE_URL = "https://georgeyachts.com";

  // This is the absolute truth of your project structure based on your app directory.
  // No dynamic IDs, no ghost pages, no 404s.
  const routes = [
    "", // Homepage: https://georgeyachts.com
    "/about-us",
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

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));
}
