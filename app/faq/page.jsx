import React from "react";
import FAQClient from "./FAQClient";
import JsonLd from "../components/JsonLd";
import { faqSchema } from "@/lib/faqSchema";
import { pageMeta } from "@/lib/pageMeta";

// 2026-05-14 — migrated to pageMeta() so og:url, twitter card, and
// canonical stay in lockstep. Ahrefs flagged this page as inheriting
// the homepage OG (title/description/url all wrong).
export const metadata = pageMeta({
  title: "Yacht Charter FAQ | George Yachts",
  description:
    "Answers to the questions UHNW guests ask before booking a crewed yacht charter in Greece — booking process, APA, MYBA contracts, costs, itineraries.",
  path: "/faq",
});

const FAQPage = () => {
  return (
    <>
      <JsonLd data={faqSchema} />
      <FAQClient />
    </>
  );
};

export default FAQPage;
