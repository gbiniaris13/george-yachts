import React from "react";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "George Yachts | Luxury Yacht Charter, Sales & Management | Greece",
  description:
    "Discover the elite world of luxury yachting with George Yachts. Specializing in bespoke yacht charters, sales, and management in Greece and the Mediterranean.",
  alternates: {
    canonical: "https://georgeyachts.com",
  },
};

const HomePage = () => {
  return <HomeClient />;
};

export default HomePage;
