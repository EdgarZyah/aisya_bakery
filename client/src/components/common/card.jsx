import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded shadow-md p-6 text-[var(--color-text)] ${className}`}
      role="region"
    >
      {children}
    </div>
  );
};

export default Card;
