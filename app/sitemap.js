import { sanityClient } from "@/lib/sanity";

// REMOVED the trailing slash here for cleaner concatenation
const BASE_URL = "https://georgeyachts.com";

async function getDynamicRoutes() {
  const query = `*[_type in ["yacht", "saleYacht", "jet", "villa", "transfer"]]{
    _id,
    _type,
    _updatedAt
  }`;
  const data = await sanityClient.fetch(query);

  return data.map((item) => {
    let route = "";
    switch (item._type) {
      case "yacht":
        route = `/charter-yacht-greece/${item._id}`;
        break;
      case "saleYacht":
        route = `/yachts-for-sale/${item._id}`;
        break;
      case "jet":
        route = `/private-jet-charter/${item._id}`;
        break;
      case "villa":
        route = `/luxury-villas-greece/${item._id}`;
        break;
      case "transfer":
        route = `/vip-transfers-greece/${item._id}`;
        break;
      default:
        route = `/${item._id}`;
    }

    return {
      // Clean URL: https://georgeyachts.com/route/id
      url: `${BASE_URL}${route}`,
      lastModified: new Date(item._updatedAt).toISOString(),
    };
  });
}

export default async function sitemap() {
  const staticRoutes = [
    "", // This represents the homepage: https://georgeyachts.com
    "/about-us",
    "/charter-yacht-greece",
    "/luxury-villas-greece",
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
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const dynamicRoutes = await getDynamicRoutes();

  return [...staticRoutes, ...dynamicRoutes];
}
