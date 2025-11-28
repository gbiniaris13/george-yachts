const Filotimon = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center justify-center text-center bg-black py-14">
      <h2
        className="md:text-[60px] text-[40px] font-bold text-white uppercase"
        style={{ fontFamily: "var(--font-marcellus)" }}
      >
        When luxury meets trust and{" "}
        <span className="italic text-[#7a6200]">"filotimo"</span>
      </h2>
      <p className="text-white italic px-4 py-4 text-lg max-w-7xl lg:text-2xl">
        In Greece, there is a word with no true translation in any other
        language: filotimo. It is more than “honour” or “doing the right thing”
        – it is a deep sense of responsibility, generosity and pride in taking
        care of others as if they were family. At George Yachts, filotimo means
        protecting your time, your privacy and your investment, and treating
        your journey as if it were our own.
      </p>
    </div>
  );
};

export default Filotimon;
