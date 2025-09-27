import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";

const API_URL = "http://localhost:5000/api/testimonials";

const ListTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Gagal memuat testimonial");
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus testimonial ini?")) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Gagal menghapus testimonial.");
        }
        alert("Testimonial berhasil dihapus!");
        fetchTestimonials();
      } catch (e) {
        alert(`Error: ${e.message}`);
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Nama", accessor: "name" },
    { header: "Komentar", accessor: "comment" },
    {
      header: "Avatar",
      accessor: "avatar",
      cell: (row) =>
        row.avatar ? (
          <img
            src={`http://localhost:5000/${row.avatar}`}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          "Tidak ada"
        ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Daftar Testimonial</h2>
        <Link to="/admin/add-testimonial">
          <Button variant="primary">Tambah Testimonial</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        data={testimonials}
        renderActions={(row) => (
          <>
            <Link
              to={`/admin/edit-testimonial/${row.id}`}
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

export default ListTestimonial;