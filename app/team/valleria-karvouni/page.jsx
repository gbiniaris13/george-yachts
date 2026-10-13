import React from "react";
import ValleriaKarvouniClient from "./ValleriaKarvouniClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "Valleria Karvouni - Logistics Advisor",
  description:
    "Valleria Karvouni, independent advisor to George Yachts on charter logistics and documentation.",
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
