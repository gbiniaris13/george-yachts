import React from "react";
import ManosKourmoulakisClient from "./ManosKourmoulakisClient";
import { generatePersonSchema } from "@/lib/teamSchema";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "Cpt. Manos Kourmoulakis — Aviation Advisor",
  description:
    "Meet Cpt. Manos Kourmoulakis, Aviation & Private Travel Advisor for George Yachts. A former Olympic Airways captain advising on jet coordination and client logistics.",
  path: "/team/manos-kourmoulakis",
  type: "profile",
});

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
