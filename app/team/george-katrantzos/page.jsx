import React from "react";
import GeorgeKatrantzosClient from "./GeorgeKatrantzosClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "George Katrantzos - U.S. Partner | George Yachts",
  description:
    "Meet George Katrantzos, U.S. Partner & Sales Director for George Yachts. Bridging Greek luxury with the sophistication of the U.S. market.",
  alternates: {
    canonical: "https://georgeyachts.com/team/george-katrantzos",
  },
};

const personSchema = generatePersonSchema("george-katrantzos");

const GeorgeKatrantzosPage = () => {
  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://georgeyachts.com" },
          { name: "Team", url: "https://georgeyachts.com/team" },
          { name: "George Katrantzos", url: "https://georgeyachts.com/team/george-katrantzos" },
        ]}
      />
      <GeorgeKatrantzosClient />
    </>
  );
};

export default GeorgeKatrantzosPage;
