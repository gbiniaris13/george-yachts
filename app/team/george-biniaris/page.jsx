import React from "react";
import GeorgeBiniarisClient from "./GeorgeBiniarisClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "George P. Biniaris - Managing Broker | George Yachts",
  description:
    "Meet George P. Biniaris, Managing Broker of George Yachts Brokerage House. IYBA member specializing in crewed yacht charters across Greek waters.",
  alternates: {
    canonical: "https://georgeyachts.com/team/george-biniaris",
  },
};

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
