import React from "react";

const categories = [
  {
    label: "Aneka Slice", items: [],
  },
  {
    label: "Aneka Black Forest", items: [],
  },
  {
    label: "Aneka Bolu", items: [
      "Bolu Kukus", "Bolu Layer", "Bolu Putih", "Bolu Pandan", "Bolu Coklat", "Bolu Tart"
    ]
  },
  // dst. Tambah sub-menu sesuai kebutuhan.
];

const CategoryMenu = ({ selected, onSelect }) => (
  <aside className="bg-white p-4 rounded shadow w-full sm:w-56 mb-4 sm:mb-0">
    <div className="font-semibold mb-2">Kategori Produk</div>
    <ul>
      {categories.map((cat, idx) => (
        <li key={cat.label} className="mb-2">
          <button
            className={`text-left w-full hover:text-[var(--color-primary)] font-medium ${
              selected === cat.label ? "text-[var(--color-primary)]" : ""
            }`}
            onClick={() => onSelect(cat.label)}
          >
            {cat.label}
          </button>
          {cat.items.length > 0 && (
            <ul className="ml-4 text-sm text-gray-600">
              {cat.items.map(sub => (
                <li key={sub}>
                  <button
                    className="hover:text-[var(--color-secondary)]"
                    onClick={() => onSelect(sub)}
                  >{sub}</button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </aside>
);

export default CategoryMenu;
