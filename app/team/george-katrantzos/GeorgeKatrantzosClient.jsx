"use client";

import React from "react";
import AdvisorProfile from "../AdvisorProfile";

export default function GeorgeKatrantzosClient() {
  return (
    <AdvisorProfile
      name="George Katrantzos"
      eyebrow="Independent advisor to George Yachts"
      role="The U.S. luxury travel market, from New York"
      imageUrl="/images/george-katrantzos.jpg"
      imageAlt="Portrait of George Katrantzos"
      paragraphs={[
        "Born and raised in Athens, Greece, GK developed an early passion for Mediterranean culture and hospitality. He attended the American Community Schools of Athens before relocating to New York in 2004 to pursue his studies in Hospitality Management at the New York City College of Technology.",
        "Now based in New York, GK is an independent advisor to George Yachts on the U.S. luxury travel market. With over two decades in hospitality and travel, he connects North American luxury travel advisors with the house and advises on what American clients expect from a week in Greek waters.",
      ]}
      instagramUrl="https://instagram.com/helllo.gk"
    />
  );
}
