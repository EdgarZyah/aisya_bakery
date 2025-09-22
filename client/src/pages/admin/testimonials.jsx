import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: "Alice", message: "Pelayanan sangat memuaskan!", date: "2025-09-20" },
    { id: 2, name: "Bob", message: "Produk berkualitas dan cepat sampai.", date: "2025-09-19" },
    { id: 3, name: "Charlie", message: "Harga terjangkau dan ramah.", date: "2025-09-18" },
  ]);

  const columns = [
    { header: "#", accessor: "index", cell: (_, idx) => idx + 1 },
    { header: "Nama", accessor: "name" },
    { header: "Pesan", accessor: "message" },
    { header: "Tanggal", accessor: "date" },
  ];

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus testimonial ini?")) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Daftar Testimonial</h2>
        <Link
          to="/admin/testimonials/add"
          className="bg-[var(--color-primary)] text-[var(--color-background)] px-4 py-2 rounded hover:bg-[var(--color-secondary)] transition"
        >
          Tambah Testimonial
        </Link>
      </div>

      <Table
        columns={columns}
        data={testimonials}
        renderActions={(row) => (
          <>
            <Link
              to={`/admin/testimonials/edit/${row.id}`}
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

export default Testimonials;
