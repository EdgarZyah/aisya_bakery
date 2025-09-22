import React from "react";

const BannerSection = ({ text }) => {
  return (
    <div className="bg-[var(--color-accent)] text-[var(--color-secondary)] py-4 px-8 rounded my-8 text-center font-semibold">
      {text}
    </div>
  );
};

export default BannerSection;
