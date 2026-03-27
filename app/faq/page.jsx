import React from "react";
import FAQClient from "./FAQClient";
import JsonLd from "../components/JsonLd";
import { faqSchema } from "@/lib/faqSchema";

export const metadata = {
  title: "FAQ - Frequently Asked Questions | George Yachts",
  description:
    "Find answers to common questions about luxury yacht charters in Greece, including booking process, costs, APA, and itineraries.",
  alternates: {
    canonical: "https://georgeyachts.com/faq",
  },
};

const FAQPage = () => {
  return (
    <>
      <JsonLd data={faqSchema} />
      <FAQClient />
    </>
  );
};

export default FAQPage;
