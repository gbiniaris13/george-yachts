import React from "react";
import GeorgeKatrantzosClient from "./GeorgeKatrantzosClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "George Katrantzos - U.S. Advisor",
  description:
    "George Katrantzos, independent advisor to George Yachts on the U.S. luxury travel market, based in New York.",
  path: "/team/george-katrantzos",
  type: "profile",
});

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
