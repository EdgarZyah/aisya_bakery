import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";

const ListProduct = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Roti Tawar", price: 35000 },
    { id: 2, name: "Donat Coklat", price: 25000 },
    { id: 3, name: "Kue Keju", price: 40000 },
  ]);

  const columns = [
    { header: "#", accessor: "index", cell: (row, idx) => idx + 1 },
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
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">List Produk</h2>
        <Link
          to="/admin/add-product"
          className="bg-[var(--color-primary)] text-[var(--color-background)] px-4 py-2 rounded hover:bg-[var(--color-secondary)] transition"
        >
          Tambah Produk
        </Link>
      </div>

      <Table
        columns={[
          {
            header: "#",
            accessor: "id",
            cell: (row, idx) => products.indexOf(row) + 1,
          },
          { header: "Nama Produk", accessor: "name" },
          {
            header: "Harga (Rp)",
            accessor: "price",
            cell: (row) => row.price.toLocaleString("id-ID"),
          },
        ]}
        data={products}
        renderActions={(row) => (
          <>
            <Link
              to={`/admin/edit-product/${row.id}`}
              className="text-blue-600 hover:underline mr-2"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(row.id)}
              className="text-red-600 hover:underline"
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
