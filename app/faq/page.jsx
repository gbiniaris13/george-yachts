import React from "react";
import FAQClient from "./FAQClient";

export const metadata = {
  title: "FAQ - Frequently Asked Questions | George Yachts",
  description:
    "Find answers to common questions about luxury yacht charters in Greece, including booking process, costs, APA, and itineraries.",
  alternates: {
    canonical: "https://georgeyachts.com/faq",
  },
};

const FAQPage = () => {
  return <FAQClient />;
};

export default FAQPage;
