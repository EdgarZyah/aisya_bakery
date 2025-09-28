import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/common/card";
import Button from "../components/common/button";
import Loader from "../components/common/loader";
import Modal from "../components/common/modal";

const Checkout = ({ cartItems, onClearCart }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
    setModalTitle("Konfirmasi Pesanan");
    setModalMessage("Apakah Anda yakin ingin melanjutkan pembayaran?");
    setIsModalOpen(true);
  };

  const handleCancelConfirmModal = () => {
    setShowConfirmModal(false);
    setIsModalOpen(false);
  };

  const handleCheckout = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setModalTitle("Peringatan");
      setModalMessage("Anda harus login untuk melanjutkan checkout.");
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    const payload = {
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memproses pesanan.");
      }

      const checkoutItemsSnapshot = [...cartItems]; // Ambil snapshot item keranjang

      onClearCart();
      localStorage.removeItem("cartItems"); 

      // Redirect ke halaman sukses dengan state
      navigate("/checkout/success", { state: { orderData: data, checkoutItems: checkoutItemsSnapshot, user } });

    } catch (error) {
      console.error("Checkout Error:", error);
      setModalTitle("Checkout Gagal");
      setModalMessage(error.message);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-6 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Keranjang Belanja Kosong</h2>
        <p>Silakan tambahkan produk ke keranjang untuk melanjutkan.</p>
        <Link to="/products" className="text-[var(--color-primary)] hover:underline mt-4 inline-block">
          Jelajahi Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-[var(--color-text)]">Keranjang Belanja</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bagian Kiri: Daftar Item Keranjang */}
        <div className="md:w-3/4">
          <Card className="p-6">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={`http://localhost:5000/${item.image}`}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-[var(--color-text)]">
                        <h3>{item.name}</h3>
                        <p className="ml-4">
                          Rp {(item.price * item.quantity)?.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-primary)]">
                        Harga satuan: Rp {item.price?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                      <div className="text-gray-500">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Bagian Kanan: Ringkasan Harga dan Checkout */}
        <div className="md:w-1/4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-text)]">Ringkasan Keranjang</h2>
            <div className="flex justify-between text-lg font-semibold mb-2 text-[var(--color-text)]">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Biaya pengiriman dan pajak akan dihitung pada langkah selanjutnya.</p>
            <Button
              onClick={handleOpenConfirmModal}
              disabled={subtotal === 0 || loading}
              className="w-full"
            >
              {loading ? <Loader /> : "Lanjutkan Pembayaran"}
            </Button>
          </Card>
        </div>
      </div>
      
      {/* Modal untuk pesan error atau peringatan */}
      <Modal isOpen={isModalOpen && !showConfirmModal} onClose={handleModalClose} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleModalClose}>OK</Button>
        </div>
      </Modal>

      {/* Modal Konfirmasi Checkout */}
      <Modal isOpen={isModalOpen && showConfirmModal} onClose={handleCancelConfirmModal} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancelConfirmModal}>Batal</Button>
          <Button variant="primary" onClick={handleCheckout}>Ya</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Checkout;