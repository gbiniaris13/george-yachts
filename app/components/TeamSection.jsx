import React from "react";
import { Instagram } from "lucide-react";

// Define the dimensions for the cards
const CARD_DIMENSIONS = { width: "372px", height: "400px" };
const IMAGE_PLACEHOLDER_URL =
  "https://placehold.co/372x400/02132d/2fd5c3?text=TEAM";
const GOLD_HEX = "#DAA520";

// --- Team Data ---
// Creating members for the grid
const teamMembers = [
  {
    name: "George P. Biniaris",
    title: "Founder & CEO",
    imageUrl: "/images/george.jpg",
    instagram: "george_p.biniaris",
  },
  {
    name: "George Katrantzos",
    title: "U.S. Partner & Sales Director, George Yachts",
    imageUrl: "/images/george-katrantzos.jpg",
    instagram: "helllo.gk",
  },
  {
    name: "Elleanna Karvouni",
    title: "Head of Business Operations & Finance",
    imageUrl: "/images/elleanna.jpg",
    instagram: "eleanna_karvoun",
  },
  {
    name: "Chris Daskalopoulos",
    title: "Marine Insurance & ISO Maritime Compliance Advisor",
    imageUrl: "/images/chris.jpg",
    instagram: "dask15",
  },

  {
    name: "Valleria Karvouni",
    title: "Administrative & Charter Logistics Coordinator",
    imageUrl: "/images/valeria.jpg",
    instagram: "valeria_karv",
  },
  {
    name: "Captain Emmanouil “Manos” Kourmoulakis",
    title: "Aviation & Private Travel Advisor",
    imageUrl: "/images/manos.jpg",
    instagram: "", // Placeholder for missing Instagram
  },
  {
    name: "Nemesis",
    title: "Director of Internal Justice & Loyalty Enforcement",
    imageUrl: "/images/nemesis.jpg",
    instagram: "", // Placeholder for missing Instagram
  },
];

// Component for a single team card
const TeamCard = ({ member }) => {
  // Only render Instagram link if the handle exists
  const hasInstagram = member.instagram && member.instagram.length > 0;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-center text-white"
      style={CARD_DIMENSIONS}
    >
      {/* Background Image */}
      <img
        src={member.imageUrl}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => (e.target.src = IMAGE_PLACEHOLDER_URL)}
      />
      {/* Overlay Gradient (for text contrast) */}
      <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition duration-300"></div>

      {/* Content Container (Aligned Top-Left) */}
      <div className="relative z-10 p-6 flex flex-col h-full justify-end">
        {/* Text Block */}
        <div className="text-start mb-6">
          <h3 className="text-xl font-extrabold mb-1 drop-shadow-md">
            {member.name}
          </h3>
          {/* Title uses the gold color */}
          <p
            className="text-sm font-bold"
            style={{ color: GOLD_HEX, marginBottom: "1rem" }}
          >
            {member.title}
          </p>

          {/* Instagram Link (Conditional Render) */}
          {hasInstagram && (
            <a
              href={`https://instagram.com/${member.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-gray-200 hover:text-white transition duration-200 cursor-pointer mb-6"
            >
              <Instagram className="w-4 h-4 mr-1.5" />@{member.instagram}
            </a>
          )}
        </div>

        {/* Full Rounded Button */}
        <button className="w-full py-2 border border-white text-sm font-semibold rounded-full bg-transparent hover:bg-white hover:text-[#02132d] transition duration-300 active:scale-[0.98] cursor-pointer">
          Learn More
        </button>
      </div>
    </div>
  );
};

const TeamSection = () => {
  // Split service list into parts for coloring
  const services =
    "YACHT MANAGEMENT | YACHT SALES | YACHT CHARTER | CHARTER MANAGEMENT | CREW PLACEMENT";
  const serviceParts = services.split("|").map((s) => s.trim());

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Services List (Colored) - NOW FIRST IN ORDER */}
        <h2 className="text-2xl md:text-3xl font-normal text-center text-[#02132d] mb-8">
          {serviceParts.map((part, index) => (
            <React.Fragment key={index}>
              {/* Color the service text in gold */}
              <span style={{ color: GOLD_HEX }}>{part}</span>
              {/* Keep the "|" separator in the base dark color */}
              {index < serviceParts.length - 1 && <span> | </span>}

              {/* FIX: Add <br> after the third item (YACHT CHARTER) */}
              {index === 2 && <br />}
            </React.Fragment>
          ))}
        </h2>

        {/* 2. OUR TEAM Header (Text Hierarchy) - NOW SECOND IN ORDER */}
        <h2 className="text-4xl font-extrabold text-center text-[#02132d] my-12">
          OUR <span style={{ color: GOLD_HEX }}>TEAM</span>
        </h2>

        {/* Grid Container */}
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
