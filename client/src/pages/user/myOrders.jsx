import React, { useState, useEffect } from 'react';
import Card from '../../components/common/card';
import Table from '../../components/common/table';
import Loader from '../../components/common/loader';
import Modal from '../../components/common/modal';
import Button from '../../components/common/button';
import Input from '../../components/common/input';
import Pagination from '../../components/pagination';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/orders/user-orders', {
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) {
        throw new Error('Gagal memuat pesanan');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      setMessageTitle("Error");
      setMessageContent(`Error: ${err.message}`);
      setIsMessageModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setPaymentProof(null);
  };
  
  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageTitle("");
    setMessageContent("");
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessageTitle("Peringatan");
        setMessageContent("Hanya file JPG, JPEG, PNG, dan PDF yang diizinkan.");
        setIsMessageModalOpen(true);
        setPaymentProof(null);
        e.target.value = null; // Reset input file
        return;
      }
    }
    setPaymentProof(file);
  };

  const handleUploadPaymentProof = async () => {
    if (!paymentProof) {
      setMessageTitle("Peringatan");
      setMessageContent("Pilih file terlebih dahulu.");
      setIsMessageModalOpen(true);
      return;
    }
    setUploading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("paymentProof", paymentProof);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/upload-payment-proof/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengunggah bukti pembayaran.");
      }
      setMessageTitle("Berhasil");
      setMessageContent("Bukti pembayaran berhasil diunggah!");
      setIsMessageModalOpen(true);
      handleCloseModal();
      fetchOrders();
    } catch (e) {
      setMessageTitle("Error");
      setMessageContent(`Error: ${e.message}`);
      setIsMessageModalOpen(true);
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    { header: "ID Pesanan", accessor: "id" },
    { header: "Tanggal", accessor: "createdAt", cell: (row) => new Date(row.createdAt).toLocaleDateString() },
    { header: "Total", accessor: "total", cell: (row) => `Rp ${row.total.toLocaleString('id-ID')}` },
    { header: "Status", accessor: "status" },
  ];

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedData = orders.slice(
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
    <div className="p-6">
      <Card>
        <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan Saya</h2>
        {orders.length === 0 ? (
          <p className="text-center">Anda belum memiliki pesanan.</p>
        ) : (
          <>
            <Table
              columns={columns}
              data={paginatedData}
              renderActions={(row) => (
                <button
                  onClick={() => handleOpenModal(row)}
                  className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-background)] rounded hover:bg-[var(--color-secondary)] transition"
                >
                  Detail
                </button>
              )}
            />
            <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
          </>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={`Detail Pesanan #${selectedOrder?.id}`}>
        {selectedOrder && (
          <div>
            <p className="mb-2"><strong>Status:</strong> {selectedOrder.status}</p>
            <p className="mb-4"><strong>Total:</strong> Rp {selectedOrder.total.toLocaleString('id-ID')}</p>
            <h4 className="font-semibold mb-2">Item Pesanan:</h4>
            <ul className="list-disc list-inside mb-4">
              {selectedOrder.orderItems.map(item => (
                <li key={item.id}>
                  {item.product.name} ({item.quantity}x) - Rp {item.product.price.toLocaleString('id-ID')}
                </li>
              ))}
            </ul>
            
            {selectedOrder.status === 'pending' && !selectedOrder.paymentProofUrl && (
              <div className="mt-4 p-4 border rounded">
                <h4 className="font-semibold mb-2">Unggah Bukti Pembayaran</h4>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  label="Pilih file bukti pembayaran"
                />
                <Button onClick={handleUploadPaymentProof} disabled={uploading}>
                  {uploading ? "Mengunggah..." : "Unggah"}
                </Button>
              </div>
            )}
            
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

export default MyOrdersPage;