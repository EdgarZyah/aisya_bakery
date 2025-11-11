import React, { useState, useEffect } from "react";
import Table from "../../components/common/table";
import Loader from "../../components/common/loader";
import SearchBar from "../../components/searchBar";
import Button from "../../components/common/button";
import Modal from "../../components/common/modal";
import Pagination from "../../components/pagination";
import { FaFileExcel } from "react-icons/fa";
import axiosClient, { BASE_URL_IMAGES } from "../../api/axiosClient";

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
      const response = await axiosClient.get("/orders", {
        headers: { "x-auth-token": token },
      });
      setOrders(response.data);
      setError(null);
    } catch (e) {
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
      await axiosClient.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setMessageTitle("Berhasil");
      setMessageContent("Status pesanan berhasil diperbarui!");
      setIsMessageModalOpen(true);
    } catch (e) {
      setMessageTitle("Error");
      setMessageContent(`Error: ${e.response?.data?.msg || e.message}`);
      setIsMessageModalOpen(true);
    }
  };

  const handleExport = (format) => {
    const token = localStorage.getItem("token");
    window.open(`${axiosClient.defaults.baseURL}/orders/export/${format}?token=${token}`, "_blank");
  };

  const columns = [
    {
      header: "Tanggal",
      accessor: "createdAt",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
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
          // [MODIFIKASI] Styling dropdown status agar lebih jelas
          className={`p-2 border rounded-md text-sm ${
            row.status === "pending" ? "bg-yellow-100 border-yellow-300" :
            row.status === "processed" ? "bg-blue-100 border-blue-300" :
            row.status === "shipped" ? "bg-indigo-100 border-indigo-300" :
            row.status === "delivered" ? "bg-green-100 border-green-300" :
            row.status === "cancelled" ? "bg-red-100 border-red-300" :
            "bg-gray-100 border-gray-300"
          }`}
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
          <Button
            variant="primary"
            onClick={() => handleExport("excel")}
            className="flex items-center gap-2"
          >
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
      
      {/* --- [MODIFIKASI] Tampilan Modal Detail --- */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Detail Pesanan #${selectedOrder?.id}`}>
        {selectedOrder && (
          // Kalkulasi rincian biaya di dalam IIFE
          (() => {
            const subtotal = selectedOrder.orderItems.reduce((acc, item) => {
              const price = item.product?.price || 0;
              return acc + (price * item.quantity);
            }, 0);
            
            const shippingCost = selectedOrder.total - subtotal;

            return (
              <div className="space-y-4">
                
                <h4 className="font-semibold text-lg">Informasi Pelanggan:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Nama:</strong> {selectedOrder.user?.name || "Pengguna Tidak Terdaftar"}</p>
                  <p><strong>Alamat:</strong> {selectedOrder.user?.address || "Tidak ada"}</p>
                  <p><strong>No. Telepon:</strong> {selectedOrder.user?.phoneNumber || "Tidak ada"}</p>
                </div>

                <hr />

                <h4 className="font-semibold text-lg">Informasi Pesanan:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>ID Pesanan:</strong> {selectedOrder.id}</p>
                  <p><strong>Tanggal:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                </div>

                <hr />

                <h4 className="font-semibold text-lg">Item Pesanan:</h4>
                <ul className="list-disc list-inside text-sm">
                  {selectedOrder.orderItems.map((item) => (
                    <li key={item.id}>
                      {item.product.name} ({item.quantity}x) - @ Rp{" "}
                      {(item.product.price || 0).toLocaleString("id-ID")}
                    </li>
                  ))}
                </ul>

                <hr />

                {/* [BARU] Rincian Biaya */}
                <h4 className="font-semibold text-lg">Rincian Biaya:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal (Item):</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biaya Pengiriman:</span>
                    {/* Pastikan ongkir tidak negatif jika ada diskon */}
                    <span>Rp {Math.max(0, shippingCost).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-2 text-[var(--color-primary)]">
                    <span>Total Pesanan:</span>
                    <span>Rp {selectedOrder.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {selectedOrder.paymentProofUrl && (
                  <>
                    <hr />
                    <div className="mt-4">
                      <h4 className="font-semibold text-lg">Bukti Pembayaran:</h4>
                      <a
                        href={`${BASE_URL_IMAGES}/${selectedOrder.paymentProofUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Lihat Bukti Pembayaran
                      </a>
                    </div>
                  </>
                )}
              </div>
            );
          })() // Akhir IIFE
        )}
      </Modal>

      <Modal
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        title={messageTitle}
      >
        <p>{messageContent}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleCloseMessageModal}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Order;