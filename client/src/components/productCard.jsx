// aisya_bakery/client/src/components/productCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "./common/button";

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="block">
    <div className="bg-white rounded shadow p-4 flex flex-col transition-transform duration-300 hover:scale-105">
      <img
        src={`http://localhost:5000/${product.imageUrl}`}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-3"
      />
      <div className="font-semibold text-[var(--color-secondary)] mb-1">
        {product.name}
      </div>
      <div className="text-sm text-gray-500 mb-1">
        {product.category?.name || "Uncategorized"}
      </div>
      <div className="mt-auto font-bold text-[var(--color-primary)]">
        IDR {product.price.toLocaleString("id-ID")}
      </div>
    </div>
  </Link>
);

export default ProductCard;