import React from "react";

const ProductCard = ({ product }) => (
  <div className="bg-white rounded shadow p-4 flex flex-col">
    {product.isNew && (
      <span className="absolute top-3 left-3 text-xs bg-green-500 text-white px-2 py-1 rounded">
        NEW
      </span>
    )}
    <img
      src={product.image}
      alt={product.name}
      className="h-32 w-full object-cover rounded mb-3"
    />
    <div className="font-semibold text-[var(--color-secondary)] mb-1">{product.name}</div>
    <div className="text-sm mb-1">{product.description}</div>
    <div className="mt-auto font-bold text-[var(--color-primary)]">
      IDR {product.price.toLocaleString("id-ID")}
    </div>
  </div>
);

export default ProductCard;
