import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// 🛑 ADD TEMPORARY LOGGING HERE 🛑
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
// console.log("SANITY_PROJECT_ID:", projectId);
// console.log("SANITY_DATASET:", dataset);
// 🛑 END TEMPORARY LOGGING 🛑

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-11-09";
const useCdn = process.env.NODE_ENV === "production";

// Sanity Client Initialization
export const sanityClient = createClient({
  projectId, // Must be a string (not undefined)
  dataset, // Must be a string (not undefined)
  apiVersion,
  useCdn,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}
