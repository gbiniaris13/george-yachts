import React from "react";
import ElleanaKarvouniClient from "./ElleanaKarvouniClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "Elleana Karvouni — Operations & Finance",
  description:
    "Meet Elleana Karvouni, Head of Business Operations & Finance at George Yachts, ensuring every transaction meets the highest standards of clarity and trust.",
  path: "/team/elleana-karvouni",
  type: "profile",
});

const personSchema = generatePersonSchema("elleana-karvouni");

const ElleanaKarvouniPage = () => {
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
          { name: "Elleana Karvouni", url: "https://georgeyachts.com/team/elleana-karvouni" },
        ]}
      />
      <ElleanaKarvouniClient />
    </>
  );
};

export default ElleanaKarvouniPage;
