import React from "react";

const VARIANTS = {
  primary: "bg-[var(--color-primary)] text-[var(--color-background)] hover:bg-[var(--color-secondary)]",
  secondary: "bg-[var(--color-secondary)] text-[var(--color-background)] hover:bg-[var(--color-primary)]",
  accent: "bg-[var(--color-accent)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]",
  outline: "border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)]",
};

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClass =
    "px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const variantClass = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
