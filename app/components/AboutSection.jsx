import React from "react";

const GOLD_HEX = "#7a6200";

const AboutSection = ({
  paragraphs = [
    "George Yachts is a boutique yacht brokerage based in Athens, crafting high-end motor-yacht charters across Greece and the Mediterranean. Yachts are our core. Around them, we deliver a seamless 360° layer of lifestyle services—private aviation (helicopters & jets), VIP ground transfers, luxury villa stays, and discreet real-estate advisory—so your trip feels effortless from touchdown to sunset.",
    "We work with a tight network of captains, owners, villa partners and licensed operators to secure the right yacht, crew and week—plus the right villa, flight and driver—on one timeline, with one point of contact. Clear pricing (APA/VAT), fast proposals, precise itineraries. Calm power, clear results.",
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
