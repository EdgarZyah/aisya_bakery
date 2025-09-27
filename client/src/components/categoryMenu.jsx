// aisya_bakery/client/src/components/categoryMenu.jsx
import React from "react";

const CategoryMenu = ({ selected, onSelect, categories }) => (
  <aside className="bg-white p-4 rounded shadow w-full sm:w-56 mb-4 sm:mb-0">
    <div className="font-semibold mb-2">Kategori Produk</div>
    <ul>
      {categories.map((cat) => (
        <li key={cat.id} className="mb-2">
          <button
            className={`text-left w-full hover:text-[var(--color-primary)] font-medium ${
              selected === cat.id ? "text-[var(--color-primary)]" : ""
            }`}
            onClick={() => onSelect(cat.id)}
          >
            {cat.name}
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

export default CategoryMenu;