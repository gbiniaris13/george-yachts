import React from "react";
import Marquee from "react-fast-marquee";

const Disruptors = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center bg-white py-14">
      <Marquee
        speed={160}
        gradient={true}
        gradientColor="#FFFFFF"
        gradientWidth={150}
      >
        <span
          className="text-[120px] font-bold text-transparent mx-12"
          style={{ WebkitTextStroke: "1px black" }}
        >
          WHERE LUXURY MEETS TRUST AND FILOTIMON
        </span>
        <span
          className="text-[120px] font-bold text-transparent mx-12"
          style={{ WebkitTextStroke: "1px black" }}
        >
          WHERE LUXURY MEETS TRUST AND FILOTIMON
        </span>
        <span
          className="text-[120px] font-bold text-transparent mx-12"
          style={{
            WebkitTextStroke: "1px black",
          }}
        >
          WHERE LUXURY MEETS TRUST AND FILOTIMON
        </span>
      </Marquee>
    </div>
  );
};

export default Disruptors;
