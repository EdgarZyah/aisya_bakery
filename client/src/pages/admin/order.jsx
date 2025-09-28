import React, { useState, useEffect } from "react";
import Table from "../../components/common/table";
import Modal from "../../components/common/modal";
import Loader from "../../components/common/loader";
import Button from "../../components/common/button";
import { FaFileExcel } from 'react-icons/fa';
import Pagination from "../../components/pagination";

const API_URL = "http://localhost:5000/api/orders";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_URL, {
        headers: { "x-auth-token": token },
      });
      if (!response.ok) {
        throw new Error("Gagal memuat data pesanan.");
      }
      const data = await response.json();
      setOrders(data);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setMessageTitle("Error");
      setMessageContent(e.message);
      setIsMessageModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  
  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageTitle("");
    setMessageContent("");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Gagal memperbarui status pesanan.");
      }
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setMessageTitle("Berhasil");
      setMessageContent("Status pesanan berhasil diperbarui!");
      setIsMessageModalOpen(true);
    } catch (e) {
      setMessageTitle("Error");
      setMessageContent(`Error: ${e.message}`);
      setIsMessageModalOpen(true);
    }
  };

  const handleExport = (format) => {
    const token = localStorage.getItem("token");
    window.open(`${API_URL}/export/${format}?token=${token}`, "_blank");
  };

  const columns = [
    { header: "Tanggal", accessor: "createdAt", cell: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: "ID Pesanan", accessor: "id" },
    {
      header: "Nama Pembeli",
      accessor: "user.name",
      cell: (row) => row.user?.name || "Pengguna Tidak Terdaftar",
    },
    {
      header: "Total",
      accessor: "total",
      cell: (row) => `Rp ${row.total.toLocaleString("id-ID")}`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="p-1 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="processed">Diproses</option>
          <option value="shipped">Dikirim</option>
          <option value="delivered">Diterima</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      ),
    },
  ];
  
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedData = orders.slice(
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
    <div className="p-6 min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Riwayat Transaksi</h2>
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => handleExport('excel')} className="flex items-center gap-2">
            <FaFileExcel /> Unduh Excel
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        data={paginatedData}
        renderActions={(row) => (
          <button
            onClick={() => handleDetail(row)}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-background)] rounded hover:bg-[var(--color-secondary)] transition"
          >
            Lihat Detail
          </button>
        )}
      />
      <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Detail Pesanan">
        {selectedOrder && (
          <div className="space-y-4">
            <p><strong>ID Pesanan:</strong> {selectedOrder.id}</p>
            <p><strong>Nama Pembeli:</strong> {selectedOrder.user?.name || "Pengguna Tidak Terdaftar"}</p>
            <p><strong>Alamat:</strong> {selectedOrder.user?.address || "Tidak ada"}</p>
            <p><strong>No. Telepon:</strong> {selectedOrder.user?.phoneNumber || "Tidak ada"}</p>
            <p><strong>Tanggal:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            
            <h4 className="font-semibold text-lg">Item Pesanan:</h4>
            <ul className="list-disc list-inside">
              {selectedOrder.orderItems.map((item) => (
                <li key={item.id}>
                  {item.product.name} ({item.quantity}x) - Rp {item.product.price.toLocaleString("id-ID")}
                </li>
              ))}
            </ul>
            
            <div className="mt-4 font-bold text-lg">
              Total: Rp {selectedOrder.total.toLocaleString("id-ID")}
            </div>

            {selectedOrder.paymentProofUrl && (
              <div className="mt-4">
                <h4 className="font-semibold">Bukti Pembayaran:</h4>
                <a
                  href={`http://localhost:5000/${selectedOrder.paymentProofUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Lihat Bukti Pembayaran
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal} title={messageTitle}>
        <p>{messageContent}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleCloseMessageModal}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Order;