import React from "react";

const Input = React.forwardRef(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="mb-1 font-medium text-[var(--color-text)]" htmlFor={props.id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={`p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
});

export default Input;
