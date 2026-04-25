import PartnersClient from "./PartnersClient";
import Footer from "@/app/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Partner With George Yachts | White-Label Yacht Charter for Travel Professionals",
  description:
    "Join George Yachts' partnership programme. White-label luxury yacht charter proposals, same-day turnaround, competitive commission. Greek waters exclusively.",
  alternates: {
    canonical: "https://georgeyachts.com/partners",
  },
  openGraph: {
    title: "Partner With George Yachts",
    description:
      "White-label yacht charter for travel professionals. Same-day proposals, MYBA contracts, full accountability.",
    url: "https://georgeyachts.com/partners",
    images: [{ url: "https://georgeyachts.com/images/yacht-1.jpeg", width: 1200, height: 630 }],
  },
};

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
