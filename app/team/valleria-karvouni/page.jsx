import React from "react";
import ValleriaKarvouniClient from "./ValleriaKarvouniClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "Valleria Karvouni - Charter Logistics",
  description:
    "Meet Valleria Karvouni, Administrative & Charter Logistics Coordinator at George Yachts. Valleria supports our administrative core with precision and discipline.",
  path: "/team/valleria-karvouni",
  type: "profile",
});

const personSchema = generatePersonSchema("valleria-karvouni");

const ValleriaKarvouniPage = () => {
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
          { name: "Valleria Karvouni", url: "https://georgeyachts.com/team/valleria-karvouni" },
        ]}
      />
      <ValleriaKarvouniClient />
    </>
  );
};

export default ValleriaKarvouniPage;
