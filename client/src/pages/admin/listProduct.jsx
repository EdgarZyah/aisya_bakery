import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";
import Modal from "../../components/common/modal";

const API_URL = "http://localhost:5000/api/products";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (e) {
      console.error("Failed to fetch products:", e);
      setError("Gagal memuat data produk.");
      setModalTitle("Error");
      setModalMessage("Gagal memuat data produk.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setModalTitle("Konfirmasi Hapus");
    setModalMessage("Yakin ingin menghapus produk ini?");
    setIsConfirmModal(true);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${productToDelete}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Gagal menghapus produk.");
      }
      setModalTitle("Berhasil");
      setModalMessage("Produk berhasil dihapus!");
      fetchProducts();
    } catch (e) {
      setModalTitle("Error");
      setModalMessage(`Error: ${e.message}`);
    } finally {
      setIsModalOpen(false);
      setIsConfirmModal(false);
      setProductToDelete(null);
    }
  };

  const columns = [
    { header: "#", accessor: "index", cell: (row, idx) => idx + 1 },
    { header: "Nama Produk", accessor: "name" },
    {
      header: "Kategori",
      accessor: "category.name",
      cell: (row) => row.category ? row.category.name : "Uncategorized"
    },
    {
      header: "Harga (Rp)",
      accessor: "price",
      cell: (row) => `Rp ${row.price.toLocaleString("id-ID")}`,
    },
    { header: "Featured", accessor: "isFeatured", cell: (row) => (row.isFeatured ? "Ya" : "Tidak") },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">List Produk</h2>
        <Link to="/admin/add-product">
          <Button variant="primary">Tambah Produk</Button>
        </Link>
      </div>
      <Table
        columns={columns}
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
              onClick={() => handleDeleteClick(row.id)}
              className="text-red-600 hover:underline"
            >
              Hapus
            </button>
          </>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsConfirmModal(false);
          setProductToDelete(null);
        }}
        title={modalTitle}
      >
        <p>{modalMessage}</p>
        {isConfirmModal && (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleConfirmDelete}>Hapus</Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListProduct;