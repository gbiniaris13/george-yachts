"use client";

import React from "react";
import AdvisorProfile from "../AdvisorProfile";

export default function GeorgeBiniarisClient() {
  return (
    <AdvisorProfile
      name="George P. Biniaris"
      eyebrow="Managing Broker, George Yachts"
      role="Weekly, fully crewed yacht charters in Greek waters"
      imageUrl="/images/george-syros-quay.jpg"
      imageAlt="George P. Biniaris on the quay in Syros"
      paragraphs={[
        "Managing Broker of George Yachts, an IYBA Charter Active Member, George arranges weekly, fully crewed yacht charters in Greek waters: the Cyclades, the Ionian and the Saronic.",
        "With a background in luxury hospitality, leadership and client relations, he approaches every charter with discretion, precision and an understanding of what private clients expect.",
        "Families and private brokers from the U.S., the U.K. and the Middle East work with him directly, from the first call to the last day on board.",
        { quote: "\u201cSmooth seas and sharp suits.\u201d" },
      ]}
      extraLinks={[{ href: "/about/george-p-biniaris", label: "Full biography" }]}
      instagramUrl="https://instagram.com/george_p.biniaris"
      closeText="Tell George who is coming, how many and when, and he will answer personally."
    />
  );
}
