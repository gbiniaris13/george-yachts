import React from "react";
import ManosKourmoulakisClient from "./ManosKourmoulakisClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Cpt. Manos Kourmoulakis - Aviation Advisor | George Yachts",
  description:
    "Meet Cpt. Manos Kourmoulakis, Aviation & Private Travel Advisor for George Yachts. A former Olympic Airways captain advising on jet coordination and client logistics.",
  alternates: {
    canonical: "https://georgeyachts.com/team/manos-kourmoulakis",
  },
};

const personSchema = generatePersonSchema("manos-kourmoulakis");

const ManosKourmoulakisPage = () => {
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
          { name: "Cpt. Manos Kourmoulakis", url: "https://georgeyachts.com/team/manos-kourmoulakis" },
        ]}
      />
      <ManosKourmoulakisClient />
    </>
  );
};

export default ManosKourmoulakisPage;
