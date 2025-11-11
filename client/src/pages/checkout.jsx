import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Path import diperbarui tanpa ekstensi
import Card from "../components/common/card";
import Button from "../components/common/button";
import Loader from "../components/common/loader";
import Modal from "../components/common/modal";
import axiosClient, { BASE_URL_IMAGES } from "../api/axiosClient";
import { FiTrash2 } from "react-icons/fi"; 

// Opsi biaya pengiriman
const SHIPPING_OPTIONS = {
  0: { label: "Pilih Daerah Pengiriman...", cost: 0 },
  5000: { label: "Daerah Majenang", cost: 5000 },
  10000: { label: "Daerah Cilacap", cost: 10000 },
  15000: { label: "Luar Cilacap", cost: 15000 },
};


const Checkout = ({ cartItems, onClearCart, onUpdateCartItem, onRemoveCartItem }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const [shippingCost, setShippingCost] = useState(0);
  const [shippingLabel, setShippingLabel] = useState("");

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

  const totalPrice = subtotal + shippingCost;

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

  const handleRemoveItem = (itemId) => {
    setItemToDeleteId(itemId);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
      if (onRemoveCartItem && itemToDeleteId) {
          onRemoveCartItem(itemToDeleteId);
      }
      setIsDeleteModalOpen(false);
      setItemToDeleteId(null);
  };
  
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
    if (shippingCost === 0) {
      setModalTitle("Peringatan");
      setModalMessage("Silakan pilih daerah pengiriman terlebih dahulu.");
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

  const handleShippingChange = (e) => {
    const cost = Number(e.target.value);
    const label = SHIPPING_OPTIONS[cost].label;
    setShippingCost(cost);
    setShippingLabel(label);
  };


  const handleCheckout = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    // --- [MODIFIKASI PENTING] ---
    // Payload kini mengirim 'shippingCost' secara terpisah
    const payload = {
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      shippingCost: shippingCost, // Ongkir dikirim ke backend
    };
    // --- Akhir Modifikasi ---

    try {
      const response = await axiosClient.post("/orders/checkout", payload, {
        headers: {
          "x-auth-token": token
        }
      });
      
      // 'data' kini berisi total yang *sudah* dihitung backend
      const data = response.data; 

      // Workaround untuk OrderSuccessPage agar menampilkan rincian ongkir
      const shippingItem = {
        id: 'shipping_cost',
        name: `Biaya Pengiriman (${shippingLabel})`,
        price: shippingCost,
        quantity: 1,
        image: null 
      };
      
      const checkoutItemsSnapshot = [...cartItems, shippingItem];
      
      onClearCart();
      localStorage.removeItem("cartItems");
      
      // Kirim data order (dari backend) dan snapshot (untuk tampilan)
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
    <div className="p-4 sm:p-6 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-[var(--color-text)]">
        Keranjang Belanja
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Bagian Kiri: Daftar Item Keranjang */}
        <div className="w-full lg:w-3/4">
          <Card className="p-4 sm:p-6">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row py-4">
                  <div className="w-32 h-32 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mx-auto sm:mx-0">
                    <img
                      src={`${BASE_URL_IMAGES}/${item.image}`}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-base font-medium text-[var(--color-text)]">
                        <h3>{item.name}</h3>
                        <p className="mt-1 sm:mt-0 sm:ml-4">
                          Rp {(item.price * item.quantity)?.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-primary)]">
                        Harga satuan: Rp {item.price?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-1 sm:items-end sm:justify-between text-sm mt-4 sm:mt-2">
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
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center justify-center gap-1 text-xs mt-3 sm:mt-0"
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
        <div className="w-full lg:w-1/4">
          <Card className="p-6 lg:sticky lg:top-20">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-text)]">Ringkasan Keranjang</h2>

            {/* Dropdown Biaya Pengiriman */}
            <div className="mb-4">
              <label htmlFor="shipping" className="block text-sm font-medium text-gray-700 mb-1">
                Biaya Pengiriman
              </label>
              <select
                id="shipping"
                name="shipping"
                value={shippingCost} 
                onChange={handleShippingChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)]"
              >
                {Object.entries(SHIPPING_OPTIONS).map(([cost, { label }]) => (
                  <option key={cost} value={cost}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tampilan Rincian Harga */}
            <div className="space-y-1 mb-6 text-[var(--color-text)]">
              <div className="flex justify-between text-base">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Pengiriman</span>
                <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t mt-2">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <Button
              onClick={handleOpenConfirmModal}
              disabled={subtotal === 0 || loading || !user || shippingCost === 0}
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
            {user && shippingCost === 0 && cartItems.length > 0 && (
              <p className="mt-3 text-sm text-red-500 text-center">
                Pilih daerah pengiriman.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* ... (Semua Modal tetap sama) ... */}
      
      <Modal isOpen={isModalOpen && !showConfirmModal} onClose={handleModalClose} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleModalClose}>OK</Button>
        </div>
      </Modal>

      <Modal isOpen={isModalOpen && showConfirmModal} onClose={handleCancelConfirmModal} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancelConfirmModal}>Batal</Button>
          <Button variant="primary" onClick={handleCheckout} disabled={loading}>
            {loading ? "Memproses..." : "Ya"}
          </Button>
        </div>
      </Modal>

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