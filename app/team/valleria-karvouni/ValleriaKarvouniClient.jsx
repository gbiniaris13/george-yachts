"use client";

import React from "react";
import AdvisorProfile from "../AdvisorProfile";

export default function ValleriaKarvouniClient() {
  return (
    <AdvisorProfile
      name="Valleria Karvouni"
      eyebrow="Independent advisor to George Yachts"
      role="Charter logistics and documentation"
      imageUrl="/images/valeria.jpg"
      imageAlt="Portrait of Valleria Karvouni"
      paragraphs={[
        "With an accounting background and strong organisational discipline, Valleria is an independent advisor to George Yachts on charter logistics and documentation.",
        "From documentation to guest logistics, she brings precision, calm, and quiet strength, the kind of order luxury requires.",
      ]}
      instagramUrl="https://instagram.com/valeria_karv"
    />
  );
}
