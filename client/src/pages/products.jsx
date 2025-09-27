// aisya_bakery/client/src/pages/products.jsx
import React, { useState, useEffect } from "react";
import Hero from "../components/hero";
import SearchBar from "../components/searchBar";
import CategoryMenu from "../components/categoryMenu";
import ProductCard from "../components/productCard";
import Pagination from "../components/pagination";
import Loader from "../components/common/loader";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories first
        const catResponse = await fetch(CATEGORY_API_URL);
        const catData = await catResponse.json();
        setCategories([{ id: "all", name: "all" }, ...catData]);

        // Fetch products with filters
        const url = new URL(API_URL);
        if (search) {
          url.searchParams.append("search", search);
        }
        if (selectedCat !== "all") {
          url.searchParams.append("categoryId", selectedCat);
        }

        const productResponse = await fetch(url.toString());
        if (!productResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productData = await productResponse.json();
        setProducts(productData);
      } catch (e) {
        console.error(e);
        setError("Gagal memuat data produk.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, selectedCat]);

  const totalPages = Math.ceil(products.length / pageSize);
  const paginated = products.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 my-10">{error}</div>;
  }

  return (
    <main className="w-full mx-auto">
      <Hero
        title="Produk Roti & Kue Terbaik"
        subtitle="Berbagai pilihan roti dan kue segar dengan cita rasa istimewa."
      />
      <div className="flex flex-col sm:flex-row gap-6 max-w-7xl mx-auto py-6">
        <div className="sm:w-64">
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
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <div>
              Showing {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, products.length)} of {products.length}{" "}
              results
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </main>
  );
};

export default Products;