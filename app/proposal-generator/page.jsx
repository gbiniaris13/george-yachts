import { sanityClient as client } from "@/lib/sanity";
import ProposalClient from "./ProposalClient";

export const metadata = {
  title: "Instant Charter Proposal | George Yachts",
  description: "Generate a personalized yacht charter proposal in seconds. Select your yacht, dates, and preferences — receive a complete breakdown instantly.",
};

export const revalidate = 3600;

async function getYachts() {
  return client.fetch(`*[_type == "yacht" && defined(slug.current)] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    subtitle,
    builder,
    length,
    sleeps,
    cabins,
    crew,
    weeklyRatePrice,
    cruisingRegion,
    idealFor,
    features,
    toys,
    georgeInsiderTip,
    "imageUrl": images[0].asset->url
  }`);
}

export default async function ProposalPage() {
  const yachts = await getYachts();
  return <ProposalClient yachts={yachts} />;
}
