import PartnersClient from "./PartnersClient";
import Footer from "@/app/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

// 2026-05-14 — trimmed title from 84→58 chars (Ahrefs flagged >60).
// "White-label..." was redundant with the description.
export const metadata = pageMeta({
  title: "Partner With George Yachts | Travel-Pro Programme",
  description:
    "Join George Yachts' partnership programme. White-label luxury yacht charter proposals, same-day turnaround, competitive commission. Greek waters exclusively.",
  path: "/partners",
  image: "https://georgeyachts.com/images/yacht-1.jpeg",
});

export default function PartnersPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Partners", url: "https://georgeyachts.com/partners" },
        ]}
      />
      <PartnersClient />
      <Footer />
    </>
  );
}
