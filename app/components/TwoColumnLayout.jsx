import React from "react";
import { Instagram } from "lucide-react"; // Kept from original

// --- START: Data (No changes) ---
const features = [
  // Row 1 (Index 0): Content Left, Image Right (bg-black)
  {
    title: "WE TURN DREAMS | INTO DESTINATIONS",
    paragraph:
      "At George Yachts, every charter begins with a vision — yours. We create tailor-made experiences across the Mediterranean, combining performance yachts, exclusive itineraries, and a modern sense of luxury. From the Aegean’s hidden coves to the Ionian’s calm horizons, we turn every journey into a story worth remembering. Yachting isn’t just what we do — it’s how we live.",
    imageSrc: "/images/yacht-1.jpeg",
    color: "bg-black",
    color1: "text-white",
    color2: "text-[#DAA520]",
  },
  // Row 2 (Index 1): Image Left, Content Right (bg-white)
  {
    title: "BOUTIQUE SERVICE | GLOBAL STANDARDS",
    paragraph:
      "Based in Athens and operating across the Mediterranean, George Yachts brings a new generation of professionalism to luxury yachting. We specialize in crewed motor yacht charters, sales, and charter management — delivering seamless service and clear communication every step of the way. Whether you’re chartering, buying, or trusting us with your yacht’s representation, expect nothing less than precision, discretion, and genuine passion for the sea.",
    imageSrc: "/images/yacht-2.jpeg",
    color: "bg-white",
    color1: "text-[#000]",
    color2: "text-[#DAA520]",
  },
  // Row 3 (Index 2): Content Left, Image Right (bg-black)
  {
    title: "BEYOND THE SEA | AND THE HORIZON",
    paragraph:
      "Our service doesn’t end when you step off the yacht. Through our network of trusted partners, we arrange every special request — from private jets and luxury villas to curated transfers and reservations. George Yachts is not just about travel, but about lifestyle — tailored for those who value effortless elegance and true exclusivity.",
    imageSrc: "/images/yacht-3.jpeg",
    color: "bg-black",
    color1: "text-white",
    color2: "text-[#DAA520]",
  },
  // Row 4 (Index 3): ADDED - Image Left, Content Right (bg-white)
  {
    title: "FUTURE OF YACHTING | MODERN ELEGANCE",
    paragraph:
      "George Yachts represents a fresh chapter in Mediterranean yachting — a boutique company with international mindset and modern drive. We blend experience, aesthetics, and digital precision to redefine what it means to charter with confidence. With every client, every yacht, every detail — we bring the art of yachting to life, with calm sophistication and contemporary edge.",
    imageSrc: "/images/yacht-4.jpeg",
    color: "bg-white",
    color1: "text-[#000]",
    color2: "text-[#DAA520]",
  },
];
// --- END: Data ---

const LayoutRow = ({ item, index }) => {
  const isContentFirst = index % 2 === 0;
  const [titlePart1, titlePart2] = item.title
    .split("|")
    .map((s) => (s ? s.trim() : ""));

  // This is the shared Text Block
  const content = (
    <div className="mx-auto">
      <h2
        className={`md:text-[80px] text-start text-3xl font-extrabold ${item.color1}`}
        style={{ fontFamily: "var(--font-marcellus)" }}
      >
        <span>{titlePart1}</span>
        <br />
        <span className={`${item.color2} font-normal`}>{titlePart2}</span>
      </h2>
      <p
        className={`mt-4 text-xl md:text-4xl text-start max-w-[600px]`}
        style={{ fontFamily: "var(--font-marcellus)" }}
      >
        {item.paragraph}
      </p>
    </div>
  );

  // This is the shared Image Block
  const image = (
    <img
      src={item.imageSrc}
      alt={item.title}
      className="w-full h-full object-cover shadow-xl"
      onError={(e) =>
        (e.target.src =
          "https://placehold.co/600x400/0d1a2f/ffffff?text=Image+Error")
      }
    />
  );

  return (
    // 1. Parent container is relative and has the calculated desktop height
    <div className={`relative w-full ${item.color} md:h-dvh`}>
      {/* --- Mobile Layout (Simple Stack) --- */}
      <div className="md:hidden">
        <div className="w-full h-[60vh]">{image}</div>
        <div
          className={`flex flex-col justify-center text-center ${item.color1} py-16 px-4`}
        >
          {content}
        </div>
      </div>

      {/* --- Desktop Layout (Absolute Positioned) --- */}
      <div className="hidden md:block h-full w-full">
        {/* Image Block (Absolute) */}
        <div
          className={`absolute top-0 h-full w-1/2 ${
            isContentFirst ? "right-0" : "left-0"
          }`}
        >
          {image}
        </div>

        {/* Content Block (Absolute) */}
        {/* This block is a flex container to center the text */}
        <div
          className={`absolute top-0 h-full w-1/2 ${
            isContentFirst ? "left-0" : "right-0"
          } flex justify-center items-center p-10 ${item.color1}`}
        >
          {content}
        </div>
      </div>
    </div>
  );
};

const TwoColumnLayout = () => (
  <section className="w-full mx-auto">
    {features.map((item, index) => (
      <LayoutRow key={index} item={item} index={index} />
    ))}
  </section>
);

export default TwoColumnLayout;
