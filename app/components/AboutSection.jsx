import React from "react";

const GOLD_HEX = "#DAA520";
const services = "YACHT MANAGEMENT | YACHT SALES | YACHT CHARTER ";
const serviceParts = services.split("|").map((s) => s.trim());

// 1. Added 'paragraphs' prop with a default value
const AboutSection = ({
  paragraphs = [
    "George Yachts represents a new chapter in Mediterranean yachting: a boutique brokerage with an international mindset and a clean aesthetic. We specialize in crewed motor yacht and luxury crewed catamaran charters, sales, and management, delivered with transparent processes and genuinely personal communication.",
    "From the first message to the final bow line, we choreograph every detail—itineraries, provisioning, transfers, concierge—for an experience that feels calm, precise, and authentically luxurious.",
    "We’re based in Athens, active across the Mediterranean, and trusted by families and private brokers from the U.S., U.K., and the Middle East. Here, luxury is measured in flawless execution—and trust.",
  ],
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Services List (From Before) --- */}
        <h2 className="text-2xl md:text-3xl font-normal text-center text-[#02132d] mb-8">
          {serviceParts.map((part, index) => (
            <React.Fragment key={index}>
              <span style={{ color: GOLD_HEX }}>{part}</span>
              {index < serviceParts.length - 1 && <span> | </span>}
              {index === 2 && <br />}
            </React.Fragment>
          ))}
        </h2>

        {/* --- 2. NEW "ABOUT" HEADING --- */}
        <h2 className="text-4xl font-bold text-center text-[#02132d] my-12">
          <span style={{ color: GOLD_HEX }}>ABOUT</span>
          <br></br> GEORGE YACHTS
        </h2>

        {/* --- 3. NEW PARAGRAPHS --- */}
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
