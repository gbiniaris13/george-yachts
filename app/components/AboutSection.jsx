import React from "react";

const GOLD_HEX = "#7a6200";

const AboutSection = ({
  paragraphs = [
    "George Yachts is a premier boutique brokerage house specializing in high-end motor-yacht charters across Greece and the Mediterranean.",
    "We bridge international operational standards with deep local expertise to craft bespoke maritime experiences. Yachts are our core. Around them, we deliver a seamless 360° layer of lifestyle services—private aviation (helicopters & jets), VIP ground transfers, luxury villa stays, and discreet real-estate advisory—ensuring your journey is effortless from touchdown to sunset.",
    "We leverage a global network of captains, owners, and licensed operators to secure the perfect vessel and crew, alongside the right villa and flight—all through a single, professional point of contact.",
    "Our Commitment: Clear pricing (APA/VAT), fast proposals, and precise itineraries. Calm power, clear results.",
  ],
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-[#02132d] mb-12">
          <span style={{ color: GOLD_HEX }}>ABOUT</span>
          <br></br> GEORGE YACHTS
        </h2>

        <div className="max-w-3xl mx-auto text-center text-gray-700 space-y-6 text-lg md:text-2xl leading-relaxed">
          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
