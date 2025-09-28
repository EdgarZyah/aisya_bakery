import React, { useState, useEffect } from "react";
import Button from "../../components/common/button";
import Table from "../../components/common/table";
import Loader from "../../components/common/loader";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";
import Pagination from "../../components/pagination";

const API_URL = "http://localhost:5000/api/categories";

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      setModalTitle("Error");
      setModalMessage(e.message);
      setIsModalOpen(true);
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
      setModalTitle("Peringatan");
      setModalMessage("Nama kategori tidak boleh kosong.");
      setIsModalOpen(true);
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
      setModalTitle("Berhasil");
      setModalMessage("Kategori berhasil ditambahkan.");
      setIsModalOpen(true);
    } catch (e) {
      setModalTitle("Error");
      setModalMessage(`Error: ${e.message}`);
      setIsModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setModalTitle("Konfirmasi Hapus");
    setModalMessage("Yakin ingin menghapus kategori ini? Produk yang terkait akan menjadi 'Uncategorized'.");
    setIsConfirmModal(true);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${categoryToDelete}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Gagal menghapus kategori.");
      }

      fetchCategories();
      setModalTitle("Berhasil");
      setModalMessage("Kategori berhasil dihapus!");
    } catch (e) {
      setModalTitle("Error");
      setModalMessage(`Error: ${e.message}`);
    } finally {
      setIsModalOpen(false);
      setIsConfirmModal(false);
      setCategoryToDelete(null);
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Nama Kategori", accessor: "name" },
  ];
  
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        data={paginatedData}
        renderActions={(row) => (
          <button
            onClick={() => handleDeleteClick(row.id)}
            className="text-red-600 hover:underline"
          >
            Hapus
          </button>
        )}
      />
      <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setIsConfirmModal(false);
          setCategoryToDelete(null);
        }} 
        title={modalTitle}
      >
        <p>{modalMessage}</p>
        {isConfirmModal ? (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleConfirmDelete}>Hapus</Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>OK</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListCategory;