// client/src/components/featuredProducts.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./productCard";
import Loader from "./common/loader";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/products?featured=true"; // <-- Diperbarui

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal memuat produk unggulan.");
      }
      const data = await response.json();
      setProducts(data);
    } catch (e) {
      console.error("Fetch Featured Products Error:", e);
      setError("Gagal memuat produk. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-3 text-center text-[var(--color-text)]">
          Tidak ada produk unggulan saat ini.
        </p>
      )}
    </div>
  );
};

export default FeaturedProducts;