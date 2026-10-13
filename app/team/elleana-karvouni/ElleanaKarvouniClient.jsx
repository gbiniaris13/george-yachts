"use client";

import React from "react";
import AdvisorProfile from "../AdvisorProfile";

export default function ElleanaKarvouniClient() {
  return (
    <AdvisorProfile
      name="Elleana Karvouni"
      eyebrow="Independent advisor to George Yachts"
      role="Business operations and finance"
      imageUrl="/images/elleanna.jpg"
      imageAlt="Portrait of Elleana Karvouni"
      paragraphs={[
        "Senior HR and finance executive with deep expertise in corporate coordination, documentation, and client accounting.",
        "Elleanna is an independent advisor to George Yachts on business operations and finance, with an eye for clarity and discretion in every contract and payment schedule.",
      ]}
      instagramUrl="https://instagram.com/eleanna_karvoun"
    />
  );
}
