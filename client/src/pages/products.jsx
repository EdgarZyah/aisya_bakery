import React, { useState } from "react";
import Hero from "../components/hero";
import SearchBar from "../components/searchBar";
import CategoryMenu from "../components/categoryMenu";
import ProductCard from "../components/productCard";
import Pagination from "../components/pagination";

const dummyProducts = [
  {
    id: 1,
    name: "BANANA CAKE SPESIAL",
    description: "Banana Cake Spesial",
    price: 35000,
    image: "https://via.placeholder.com/160x90?text=Banana+Cake",
  },
  {
    id: 2,
    name: "BANANA ROLL",
    description: "Banana Roll",
    price: 31000,
    image: "https://via.placeholder.com/160x90?text=Banana+Roll",
  },
  {
    id: 3,
    name: "BOLU KACANG",
    description: "Bolu Kacang",
    price: 48000,
    image: "https://via.placeholder.com/160x90?text=Bolu+Kacang",
  },  {
    id: 1,
    name: "BANANA CAKE SPESIAL",
    description: "Banana Cake Spesial",
    price: 35000,
    image: "https://via.placeholder.com/160x90?text=Banana+Cake",
  },
  {
    id: 2,
    name: "BANANA ROLL",
    description: "Banana Roll",
    price: 31000,
    image: "https://via.placeholder.com/160x90?text=Banana+Roll",
  },
  {
    id: 3,
    name: "BOLU KACANG",
    description: "Bolu Kacang",
    price: 48000,
    image: "https://via.placeholder.com/160x90?text=Bolu+Kacang",
  },  {
    id: 1,
    name: "BANANA CAKE SPESIAL",
    description: "Banana Cake Spesial",
    price: 35000,
    image: "https://via.placeholder.com/160x90?text=Banana+Cake",
  },
  {
    id: 2,
    name: "BANANA ROLL",
    description: "Banana Roll",
    price: 31000,
    image: "https://via.placeholder.com/160x90?text=Banana+Roll",
  },
  {
    id: 3,
    name: "BOLU KACANG",
    description: "Bolu Kacang",
    price: 48000,
    image: "https://via.placeholder.com/160x90?text=Bolu+Kacang",
  },  {
    id: 1,
    name: "BANANA CAKE SPESIAL",
    description: "Banana Cake Spesial",
    price: 35000,
    image: "https://via.placeholder.com/160x90?text=Banana+Cake",
  },
  {
    id: 2,
    name: "BANANA ROLL",
    description: "Banana Roll",
    price: 31000,
    image: "https://via.placeholder.com/160x90?text=Banana+Roll",
  },
  {
    id: 3,
    name: "BOLU KACANG",
    description: "Bolu Kacang",
    price: 48000,
    image: "https://via.placeholder.com/160x90?text=Bolu+Kacang",
  },
  
  // dst, sesuai data pada gambar.
];

const Products = () => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [page, setPage] = useState(1);

  // Pagination config
  const pageSize = 9;
  const filtered = dummyProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase().trim()) &&
      (selectedCat ? p.name.includes(selectedCat) : true)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="w-full mx-auto">
      <Hero
        title="Produk Roti & Kue Terbaik"
        subtitle="Berbagai pilihan roti dan kue segar dengan cita rasa istimewa."
        ctaText="Tambahkan ke Keranjang"
        onCtaClick={() => alert("Kernel Action")}
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
            selected={selectedCat}
            onSelect={(cat) => {
              setSelectedCat(cat);
              setPage(1);
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <div>
              Showing {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}{" "}
              results
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
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
