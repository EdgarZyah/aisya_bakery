// aisya_bakery/client/src/pages/products.jsx
import React, { useState, useEffect } from "react";
import Hero from "../components/hero";
import SearchBar from "../components/searchBar";
import CategoryMenu from "../components/categoryMenu";
import ProductCard from "../components/productCard";
import Pagination from "../components/pagination";
import Loader from "../components/common/loader";

import axiosClient from "../api/axiosClient"; // import axiosClient

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const [page, setPage] = useState(1);
  const pageSize = 9;

  // Fetch categories + products dengan axiosClient
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch kategori
        const catResponse = await axiosClient.get("/categories");
        setCategories([{ id: "all", name: "Semua" }, ...catResponse.data]);

        // Fetch produk (dengan filter search & kategori)
        const params = {};
        if (search) params.search = search;
        if (selectedCat !== "all") params.categoryId = selectedCat;

        const productResponse = await axiosClient.get("/products", { params });
        setProducts(productResponse.data);
      } catch (e) {
        console.error(e);
        setError("Terjadi kesalahan saat memuat produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, selectedCat]);

  // Pagination
  const totalPages = Math.ceil(products.length / pageSize);
  const paginated = products.slice((page - 1) * pageSize, page * pageSize);

  // State: Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  // State: Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <main className="w-full mx-auto">
      {/* Hero Section */}
      <Hero
        title="Produk Roti & Kue Terbaik"
        subtitle="Nikmati pilihan roti dan kue segar dengan cita rasa istimewa setiap hari."
      />

      {/* Konten */}
      <div className="flex flex-col sm:flex-row gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Sidebar kiri */}
        <aside className="sm:w-64 space-y-6">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          />

          <CategoryMenu
            categories={categories}
            selected={selectedCat}
            onSelect={(catId) => {
              setSelectedCat(catId);
              setPage(1);
            }}
          />
        </aside>

        {/* Konten produk */}
        <section className="flex-1 space-y-11">
          {/* Info jumlah produk */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Menampilkan{" "}
              <strong>
                {(page - 1) * pageSize + 1} -{" "}
                {Math.min(page * pageSize, products.length)}
              </strong>{" "}
              dari <strong>{products.length}</strong> produk
            </span>
          </div>

          {/* Grid produk */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Tidak ada produk ditemukan.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </section>
      </div>
    </main>
  );
};

export default Products;
