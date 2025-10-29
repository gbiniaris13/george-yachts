import React from "react";
import { Instagram, Linkedin, Twitter } from "lucide-react"; // Using X/Twitter icon

// Inline SVG for the Greek Flag (Squared Corners)
const GreekFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="60"
    height="20"
    viewBox="0 0 27 18"
  >
    <path fill="#0D5EAF" d="M0 0h27v18H0z" />
    <path
      fill="none"
      strokeWidth="2"
      stroke="#FFF"
      d="M5 0v11M0 5h10m0-2h17M10 7h17M0 11h27M0 15h27"
    />
  </svg>
);

const MemberAboutSection = ({
  name,
  paragraphs = [], // Expect an array of strings
  ctaText,
  ctaUrl,
  instagramUrl,
  linkedinUrl,
  twitterUrl,
  bgColor = "bg-white",
  headingColor = "text-black",
  textColor = "text-gray-700",
  accentColor = "text-[#DAA520]",
}) => {
  return (
    <section className={`w-full ${bgColor} py-16 lg:py-20`}>
      {/* Centered content container */}
      <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
        {/* 1. Heading */}
        <h2
          className={`text-3xl md:text-4xl font-bold uppercase ${headingColor} mb-6`}
        >
          <span className={accentColor}>ABOUT </span>
          <span>{name}</span>
        </h2>

        {/* 2. Flag */}
        <GreekFlag />

        {/* 3. Paragraphs */}
        <div
          className={`space-y-6 text-lg md:text-2xl ${textColor} leading-relaxed mt-4`}
        >
          {paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>

        <p className="max-w-md space-y-4 text-base md:text-xl text-black uppercase font-bold leading-relaxed mt-12">
          lets connect on your favorite social media network
        </p>

        {/* 5. Social Icons */}
        <div className="flex items-center space-x-6 mt-12">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-black hover:text-black transition-colors duration-300 bg-[#DAA520] p-2.5 rounded-full`}
            >
              <Instagram className="w-8 h-8" />
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} hover:${accentColor} transition-colors duration-300`}
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} hover:${accentColor} transition-colors duration-300`}
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default MemberAboutSection;
