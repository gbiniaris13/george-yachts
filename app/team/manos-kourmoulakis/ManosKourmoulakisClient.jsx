"use client";

import React from "react";
import AdvisorProfile from "../AdvisorProfile";

export default function ManosKourmoulakisClient() {
  return (
    <AdvisorProfile
      name={"Cpt. Emmanouil \u201cManos\u201d Kourmoulakis"}
      eyebrow="Independent advisor to George Yachts"
      role="Aviation and private travel"
      imageUrl="/images/manos-new.jpg"
      imageAlt="Portrait of Captain Manos Kourmoulakis"
      paragraphs={[
        "Former Olympic Airways captain with decades of aviation precision.",
        "Captain Kourmoulakis is an independent advisor to George Yachts on private aviation, from jet coordination to the timing between the airport and the yacht.",
      ]}
    />
  );
}
