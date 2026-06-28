import React from "react";
import GeorgeBiniarisClient from "./GeorgeBiniarisClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "George P. Biniaris - Managing Broker",
  description:
    "Meet George P. Biniaris, Managing Broker of George Yachts Brokerage House. IYBA member specializing in crewed yacht charters across Greek waters.",
  path: "/team/george-biniaris",
  type: "profile",
});

const personSchema = generatePersonSchema("george-biniaris");

const GeorgeBiniarisPage = () => {
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
          { name: "George P. Biniaris", url: "https://georgeyachts.com/team/george-biniaris" },
        ]}
      />
      <GeorgeBiniarisClient />
    </>
  );
};

export default GeorgeBiniarisPage;
