import React, { useState, useEffect } from "react";
import Button from "../../components/common/button";
import Table from "../../components/common/table";
import Loader from "../../components/common/loader";
import Card from "../../components/common/card";

const API_URL = "http://localhost:5000/api/categories";

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal memuat kategori.");
      }
      const data = await response.json();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    if (!newCategoryName.trim()) {
      alert("Nama kategori tidak boleh kosong.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Gagal menambahkan kategori.");
      }

      setNewCategoryName("");
      fetchCategories();
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Yakin ingin menghapus kategori ini? Produk yang terkait akan menjadi 'Uncategorized'.")) {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { "x-auth-token": token },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Gagal menghapus kategori.");
        }

        fetchCategories();
      } catch (e) {
        alert(`Error: ${e.message}`);
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Nama Kategori", accessor: "name" },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Kelola Kategori Produk</h2>

      <Card className="mb-6">
        <h3 className="text-xl font-medium mb-4">Tambah Kategori Baru</h3>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nama Kategori"
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Menambahkan..." : "Tambah"}
          </Button>
        </form>
      </Card>

      <Table
        columns={columns}
        data={categories}
        renderActions={(row) => (
          <button
            onClick={() => handleDeleteCategory(row.id)}
            className="text-red-600 hover:underline"
          >
            Hapus
          </button>
        )}
      />
    </div>
  );
};

export default ListCategory;