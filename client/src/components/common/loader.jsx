import React from "react";

const Loader = ({ size = 8, className = "" }) => {
  return (
    <div
      className={`border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin ${className}`}
      style={{ width: size * 8, height: size * 8 }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Loader;
