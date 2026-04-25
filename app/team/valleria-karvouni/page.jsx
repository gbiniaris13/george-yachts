import React from "react";
import ValleriaKarvouniClient from "./ValleriaKarvouniClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Valleria Karvouni - Logistics Coordinator | George Yachts",
  description:
    "Meet Valleria Karvouni, Administrative & Charter Logistics Coordinator at George Yachts. Valleria supports our administrative core with precision and discipline.",
  alternates: {
    canonical: "https://georgeyachts.com/team/valleria-karvouni",
  },
};

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
