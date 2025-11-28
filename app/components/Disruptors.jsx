import React from "react";
import Marquee from "react-fast-marquee";

const Disruptors = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center bg-white py-14">
      <Marquee
        speed={30}
        gradient={true}
        gradientColor="#FFFFFF"
        gradientWidth={150}
      >
        <span
          className="md:text-[60px] text-[40px] font-bold text-[#7a6200] mx-8 uppercase"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Boutique yacht brokerage & 360° luxury concierge for luxury yacht
          charters in Greece
        </span>
        <span
          className="md:text-[60px] text-[40px] font-bold text-[#7a6200] mx-8 uppercase"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Boutique yacht brokerage & 360° luxury concierge for luxury yacht
          charters in Greece
        </span>
        <span
          className="md:text-[60px] text-[40px] font-bold text-[#7a6200] mx-8 uppercase"
          style={{ fontFamily: "var(--font-marcellus)" }}
        >
          Boutique yacht brokerage & 360° luxury concierge for luxury yacht
          charters in Greece
        </span>
      </Marquee>
    </div>
  );
};

export default Disruptors;
