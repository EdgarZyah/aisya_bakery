import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/common/table";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";
import Modal from "../../components/common/modal";
import Pagination from "../../components/pagination";
import axiosClient, { BASE_URL_IMAGES } from "../../api/axiosClient";

const ListTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axiosClient.get("/testimonials", {
        headers: { "x-auth-token": token },
      });
      setTestimonials(response.data);
      setError(null);
    } catch (e) {
      setError(e.message);
      setModalTitle("Error");
      setModalMessage(e.message);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setTestimonialToDelete(id);
    setModalTitle("Konfirmasi Hapus");
    setModalMessage("Yakin ingin menghapus testimonial ini?");
    setIsConfirmModal(true);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axiosClient.delete(`/testimonials/${testimonialToDelete}`, {
        headers: { "x-auth-token": token },
      });
      setModalTitle("Berhasil");
      setModalMessage("Testimonial berhasil dihapus!");
      await fetchTestimonials();
    } catch (e) {
      setModalTitle("Error");
      setModalMessage(`Error: ${e.response?.data?.msg || e.message}`);
    } finally {
      setIsModalOpen(false);
      setIsConfirmModal(false);
      setTestimonialToDelete(null);
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
            src={`${BASE_URL_IMAGES}/${row.avatar}`}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          "Tidak ada"
        ),
    },
  ];

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const paginatedData = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        data={paginatedData}
        renderActions={(row) => (
          <>
            <Link
              to={`/admin/edit-testimonial/${row.id}`}
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
      <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsConfirmModal(false);
          setTestimonialToDelete(null);
        }}
        title={modalTitle}
      >
        <p>{modalMessage}</p>
        {isConfirmModal ? (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              OK
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ListTestimonial;
