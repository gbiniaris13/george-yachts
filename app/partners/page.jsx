import PartnersClient from "./PartnersClient";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Partner With George Yachts | White-Label Charter for Travel Professionals",
  description:
    "Earn commissions on luxury yacht charters in Greece. Same-day proposals, MYBA contracts, full white-label service. You stay the hero.",
  openGraph: {
    title: "Partner With George Yachts",
    description:
      "White-label yacht charter for travel professionals. Same-day proposals, MYBA contracts, full accountability.",
    url: "https://georgeyachts.com/partners",
  },
};

export default function PartnersPage() {
  return (
    <>
      <PartnersClient />
      <Footer />
    </>
  );
}
