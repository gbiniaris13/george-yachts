import React from "react";
import ChrisDaskalopoulosClient from "./ChrisDaskalopoulosClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Chris Daskalopoulos - Marine Insurance & ISO Advisor | George Yachts",
  description:
    "Meet Chris Daskalopoulos, Marine Insurance & ISO Maritime Compliance Advisor for George Yachts, ensuring safety protocols and international best practices.",
  alternates: {
    canonical: "https://georgeyachts.com/team/chris-daskalopoulos",
  },
};

const personSchema = generatePersonSchema("chris-daskalopoulos");

const ChrisDaskalopoulosPage = () => {
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
          { name: "Chris Daskalopoulos", url: "https://georgeyachts.com/team/chris-daskalopoulos" },
        ]}
      />
      <ChrisDaskalopoulosClient />
    </>
  );
};

export default ChrisDaskalopoulosPage;
