const features = [
  // Row 1 (Index 0): Content Left, Image Right (bg-gray-50) -> RIGHT ALIGNMENT
  {
    // Title format: "FIRST PART | SECOND PART"
    title: "WE TURN DREAMS | INTO DESTINATIONS",
    paragraph:
      "At George Yachts, every charter begins with a vision — yours. We create tailor-made experiences across the Mediterranean, combining performance yachts, exclusive itineraries, and a modern sense of luxury. From the Aegean’s hidden coves to the Ionian’s calm horizons, we turn every journey into a story worth remembering. Yachting isn’t just what we do — it’s how we live.",
    imageSrc: "/images/yacht-1.jpeg",
    color: "bg-gray-50",
    // NEW: Colors for the split title
    color1: "text-[#000]", // Dark Blue for the first part
    color2: "text-[#DAA520]", // Gold for the second part
  },
  // Row 2 (Index 1): Image Left, Content Right (bg-white) -> DEFAULT LEFT ALIGNMENT
  {
    title: "BOUTIQUE SERVICE | GLOBAL STANDARDS",
    paragraph:
      "Based in Athens and operating across the Mediterranean, George Yachts brings a new generation of professionalism to luxury yachting. We specialize in crewed motor yacht charters, sales, and charter management — delivering seamless service and clear communication every step of the way. Whether you’re chartering, buying, or trusting us with your yacht’s representation, expect nothing less than precision, discretion, and genuine passion for the sea.",
    imageSrc: "/images/yacht-2.jpeg",
    color: "bg-white",
    // NEW: Colors for the split title
    color1: "text-[#000]", // Dark Blue for the first part
    color2: "text-[#DAA520]", // Gold for the second part
  },
  // Row 3 (Index 2): Content Left, Image Right (bg-gray-50) -> RIGHT ALIGNMENT
  {
    title: "BEYOND THE SEA | AND THE HORIZON", // Added a second part for demonstration
    paragraph:
      "Our service doesn’t end when you step off the yacht. Through our network of trusted partners, we arrange every special request — from private jets and luxury villas to curated transfers and reservations. George Yachts is not just about travel, but about lifestyle — tailored for those who value effortless elegance and true exclusivity.",
    imageSrc: "/images/yacht-3.jpeg",
    color: "bg-gray-50",
    // NEW: Colors for the split title
    color1: "text-[#000]", // Dark Blue for the first part
    color2: "text-[#DAA520]", // Gold for the second part
  },
  // Row 4 (Index 3): ADDED - Image Left, Content Right (bg-white) -> DEFAULT LEFT ALIGNMENT
  {
    title: "FUTURE OF YACHTING | MODERN ELEGANCE",
    paragraph:
      "George Yachts represents a fresh chapter in Mediterranean yachting — a boutique company with international mindset and modern drive. We blend experience, aesthetics, and digital precision to redefine what it means to charter with confidence. With every client, every yacht, every detail — we bring the art of yachting to life, with calm sophistication and contemporary edge.",
    imageSrc: "/images/yacht-4.jpeg",
    color: "bg-white",
    // NEW: Colors for the split title
    color1: "text-[#000]", // Dark Blue for the first part
    color2: "text-[#DAA520]", // Gold for the second part
  },
];

// Reusable component to render a single feature row
const LayoutRow = ({ item, index }) => {
  // Determine layout order: Content on left for rows 0 and 2 (even index)
  // Image on left for rows 1 and 3 (odd index)
  const isContentFirst = index % 2 === 0;

  // NEW LOGIC: Only apply right alignment for index 0 and 2 (first and third row).
  const isRightAligned = index === 0 || index === 2;

  // Split the title at the '|' character
  const [titlePart1, titlePart2] = item.title
    .split("|")
    .map((s) => (s ? s.trim() : ""));

  // Determine the margin utility needed for the fixed-width paragraph
  // to align to the right side of the column when text is right-aligned.
  const paragraphMargin = isRightAligned
    ? isContentFirst
      ? "md:ml-auto"
      : "md:mr-auto"
    : "";

  const contentBlock = (
    // Apply text alignment based on isRightAligned state for MD: and above
    // The container needs to be the one controlling the alignment and flow.
    <div
      className={`flex flex-col justify-center p-0 order-2 md:order-none text-left ${
        isRightAligned ? "md:text-right" : "md:text-left"
      }`}
    >
      <h2 className="md:text-5xl text-3xl font-extrabold text-[#02132d]">
        {/* FIRST PART: Uses the color1 class (retains font-bold from h2) */}
        <span className={item.color1}>{titlePart1}</span>
        <br />
        {/* SECOND PART: Uses the color2 class AND a lighter font weight */}
        <span className={`${item.color2} font-normal`}>{titlePart2}</span>
      </h2>
      {/* Paragraph now uses the calculated margin to stick to the appropriate side */}
      <p
        className={`mt-4 text-gray-700 text-xl max-w-[400px] ${paragraphMargin}`}
      >
        {item.paragraph}
      </p>
    </div>
  );

  const imageBlock = (
    // Mobile order: Image always first (on top). Desktop order: Varies.
    <div className="w-full order-1 md:order-none">
      <img
        src={item.imageSrc}
        alt={item.title}
        className="w-full h-auto object-cover rounded-lg shadow-xl"
        onError={(e) =>
          (e.target.src =
            "https://placehold.co/600x400/0d1a2f/ffffff?text=Image+Error")
        }
      />
    </div>
  );

  return (
    <div
      // The row uses alternating background colors for visual separation
      className={`w-full ${item.color} py-16 px-4 md:px-10`}
    >
      <div className="max-w-[1530px] mx-auto">
        <div
          // Main grid structure: 1 column on mobile, 2 columns on medium screens and up
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
        >
          {/* Render blocks based on required desktop order */}
          {isContentFirst ? contentBlock : imageBlock}
          {isContentFirst ? imageBlock : contentBlock}
        </div>
      </div>
    </div>
  );
};

// Main Component
const TwoColumnLayout = () => (
  <section className="w-full mx-auto">
    {features.map((item, index) => (
      <LayoutRow key={index} item={item} index={index} />
    ))}
  </section>
);

export default TwoColumnLayout;
