import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";

const ListProduct = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Roti Tawar Gandum", price: 27000 },
    { id: 2, name: "Croissant Mentega", price: 35000 },
    { id: 3, name: "Kue Brownies Coklat", price: 40000 },
    { id: 4, name: "Donat Coklat", price: 25000 },
  ]);

  const columns = [
    { header: "No", accessor: "index", cell: (_, idx) => idx + 1 },
    { header: "Nama Produk", accessor: "name" },
    {
      header: "Harga (Rp)",
      accessor: "price",
      cell: (row) => row.price.toLocaleString("id-ID"),
    },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-purewhite text-[var(--color-text)]">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Daftar Produk Bakery</h2>
        <Link
          to="/admin/add-product"
          className="bg-[var(--color-primary)] text-[var(--color-background)] px-4 py-2 rounded hover:bg-[var(--color-secondary)] transition"
        >
          Tambah Produk
        </Link>
      </div>

      <Table
        columns={columns}
        data={products}
        renderActions={(row) => (
          <>
            <Link
              to={`/admin/edit-product/${row.id}`}
              className="text-blue-600 hover:underline mr-3"
            >
              Edit
            </Link>
            <button
              className="text-red-600 hover:underline"
              onClick={() => handleDelete(row.id)}
            >
              Hapus
            </button>
          </>
        )}
      />
    </div>
  );
};

export default ListProduct;
