"use client";

import React from "react";
import AdvisorProfile from "../AdvisorProfile";

export default function ChrisDaskalopoulosClient() {
  return (
    <AdvisorProfile
      name="Chris Daskalopoulos"
      eyebrow="Independent advisor to George Yachts"
      role="Marine insurance and ISO-based compliance"
      imageUrl="/images/chris.jpg"
      imageAlt="Portrait of Chris Daskalopoulos"
      paragraphs={[
        "Licensed skipper and marine insurance consultant with hands-on experience across the Aegean and Ionian seas.",
        <>
          Chris is with{" "}
          <a className="adv-inline" href="https://wattrate.gr/" target="_blank" rel="noopener">Wattrate</a>
          , an independent ISO, climate law and ESG advisory in Greece. George Yachts calls on him as an outside advisor on marine insurance and standards-based compliance questions.
        </>,
      ]}
      extraLinks={[{ href: "https://wattrate.gr/", label: "Wattrate", external: true }]}
      instagramUrl="https://instagram.com/dask15"
    />
  );
}
