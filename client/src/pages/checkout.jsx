import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/common/card";
import Button from "../components/common/button";
import Loader from "../components/common/loader";
import Modal from "../components/common/modal";
import axiosClient, { BASE_URL_IMAGES } from "../api/axiosClient";
import { FiTrash2 } from "react-icons/fi"; // Import ikon hapus

const Checkout = ({ cartItems, onClearCart, onUpdateCartItem, onRemoveCartItem }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // State baru untuk modal konfirmasi penghapusan
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length > 0) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setModalTitle("Perlu Login");
        setModalMessage("Anda harus login untuk melanjutkan checkout.");
        setIsModalOpen(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    }
  }, [cartItems, navigate]);


  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleUpdateQuantity = (itemId, change) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;
    
    let newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    
    if (onUpdateCartItem) {
      onUpdateCartItem(itemId, newQuantity);
    }
  };

  // Fungsi baru: Membuka modal konfirmasi hapus
  const handleRemoveItem = (itemId) => {
    setItemToDeleteId(itemId);
    setIsDeleteModalOpen(true);
  };
  
  // Fungsi baru: Melanjutkan proses hapus setelah konfirmasi
  const handleConfirmDelete = () => {
      if (onRemoveCartItem && itemToDeleteId) {
          onRemoveCartItem(itemToDeleteId);
      }
      setIsDeleteModalOpen(false);
      setItemToDeleteId(null);
  };
  
  // Fungsi baru: Membatalkan proses hapus
  const handleCancelDelete = () => {
      setIsDeleteModalOpen(false);
      setItemToDeleteId(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOpenConfirmModal = () => {
    if (!localStorage.getItem("token")) {
      setModalTitle("Perlu Login");
      setModalMessage("Anda harus login untuk melanjutkan checkout.");
      setIsModalOpen(true);
      return;
    }
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
      setLoading(false);
      navigate("/login");
      return;
    }

    const payload = {
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      totalPrice: subtotal,
    };

    try {
      const response = await axiosClient.post("/orders/checkout", payload, {
        headers: {
          "x-auth-token": token
        }
      });
      const data = response.data;
      const checkoutItemsSnapshot = [...cartItems];
      onClearCart();
      localStorage.removeItem("cartItems");
      navigate("/checkout/success", { state: { orderData: data, checkoutItems: checkoutItemsSnapshot, user } });
    } catch (error) {
      console.error("Checkout Error:", error);
      setModalTitle("Checkout Gagal");
      setModalMessage(error.response?.data?.message || error.message || "Gagal memproses pesanan.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };


  if (cartItems.length === 0 && !loading) {
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

  if (loading && cartItems.length === 0) {
     return <div className="flex justify-center items-center h-screen"><Loader /></div>;
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
                      src={`${BASE_URL_IMAGES}/${item.image}`}
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
                      {/* Kontrol Kuantitas */}
                      <div className="flex items-center space-x-2">
                        <label className="text-gray-500">Qty:</label>
                        <button
                          type="button"
                          onClick={() => onUpdateCartItem(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onUpdateCartItem(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      {/* Tombol Hapus */}
                      <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex items-center gap-1 text-xs"
                      >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Hapus</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bagian Kanan: Ringkasan Harga dan Checkout */}
        <div className="md:w-1/4">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-text)]">Ringkasan Keranjang</h2>
            <div className="flex justify-between text-lg font-semibold mb-2 text-[var(--color-text)]">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Biaya pengiriman dan pajak akan dihitung pada langkah selanjutnya.</p>
            <Button
              onClick={handleOpenConfirmModal}
              disabled={subtotal === 0 || loading || !user}
              className="w-full"
              variant="primary"
            >
              {loading ? <Loader /> : "Lanjutkan Pembayaran"}
            </Button>
            {!user && (
                <p className="mt-3 text-sm text-red-500 text-center">
                    Anda perlu login untuk checkout.
                </p>
            )}
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
          <Button variant="primary" onClick={handleCheckout} disabled={loading}>
            {loading ? "Memproses..." : "Ya"}
          </Button>
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus Item */}
      <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} title="Konfirmasi Hapus">
          <p>Apakah Anda yakin ingin menghapus item ini dari keranjang?</p>
          <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelDelete}>Batal</Button>
              <Button variant="danger" onClick={handleConfirmDelete}>Hapus</Button>
          </div>
      </Modal>
    </div>
  );
};


export default Checkout;