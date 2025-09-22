import React from "react";

const Pagination = ({ page, totalPages, onChange }) => (
  <div className="flex justify-center space-x-2 my-6">
    <button
      disabled={page === 1}
      onClick={() => onChange(page - 1)}
      className="px-2 py-1 border rounded disabled:opacity-50"
    >&lt;</button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        className={`px-3 py-1 border rounded ${
          page === i + 1 ? "bg-[var(--color-primary)] text-white" : ""
        }`}
        onClick={() => onChange(i + 1)}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={page === totalPages}
      onClick={() => onChange(page + 1)}
      className="px-2 py-1 border rounded disabled:opacity-50"
    >&gt;</button>
  </div>
);

export default Pagination;
