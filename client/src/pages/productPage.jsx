import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/button";
import Loader from "../components/common/loader";
import NotFoundPage from "./notFound";
import Modal from "../components/common/modal";
import axiosClient, { BASE_URL_IMAGES } from "../api/axiosClient";
import { FiX } from "react-icons/fi";

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // ... (fungsi handleAddToCart tetap sama)
     if (onAddToCart && product) {
       const itemToAdd = {
         id: product.id,
         name: product.name,
         price: product.price,
         image: product.imageUrl,
         quantity: quantity,
       };
       onAddToCart(itemToAdd);
       setModalTitle("Berhasil Ditambahkan");
       setModalMessage(`${itemToAdd.name} (${itemToAdd.quantity}) berhasil ditambahkan ke keranjang.`);
       setIsModalOpen(true);
     }
  };

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (error || !product) {
    return <NotFoundPage />;
  }

  const imageUrl = `${BASE_URL_IMAGES}/${product.imageUrl}`;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 text-[var(--color-text)]">
      {/* Image Section */}
      <div className="md:w-1/2">
        {/* === PERUBAHAN DI SINI === */}
        <div
          className="border-4 border-[var(--color-accent)] rounded-lg shadow-md overflow-hidden cursor-pointer aspect-square" // Tambahkan aspect-square
          onClick={openImageModal}
        >
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" // Ubah h-auto menjadi h-full
          />
        </div>
         {/* === AKHIR PERUBAHAN === */}
      </div>

      {/* Product Details Section (tetap sama) */}
      <div className="md:w-1/2 flex flex-col justify-center">
         {/* ... (Detail produk lainnya tetap sama) ... */}
         <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
         <p className="text-lg mb-6 leading-relaxed">{product.description}</p>
         <div className="text-2xl font-bold text-[var(--color-primary)] mb-6">
           Rp {product.price.toLocaleString("id-ID")}
         </div>
         <div className="flex items-center space-x-4 mb-8">
           <label htmlFor="quantity" className="font-semibold">Jumlah:</label>
           <div className="flex items-center border rounded-lg overflow-hidden">
             <button
               onClick={() => setQuantity(Math.max(1, quantity - 1))}
               className="px-4 py-2 hover:bg-gray-100"
             >
               -
             </button>
             <span className="px-4 py-2 border-l border-r">{quantity}</span>
             <button
               onClick={() => setQuantity(quantity + 1)}
               className="px-4 py-2 hover:bg-gray-100"
             >
               +
             </button>
           </div>
         </div>
         <Button variant="primary" onClick={handleAddToCart}>
           Tambah ke Keranjang
         </Button>
      </div>

      {/* Add to Cart Confirmation Modal (tetap sama) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
         {/* ... (Konten modal tetap sama) ... */}
         <p>{modalMessage}</p>
         <div className="mt-4 flex justify-end">
           <Button variant="primary" onClick={() => setIsModalOpen(false)}>OK</Button>
         </div>
      </Modal>

      {/* Full Screen Image Modal (tetap sama) */}
      {isImageModalOpen && (
         <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
          onClick={closeImageModal} // Close on background click
        >
          {/* ... (Konten modal gambar tetap sama) ... */}
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking image */}
            <img
              src={imageUrl}
              alt={product.name}
              className="block max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 text-2xl hover:bg-black/75"
              aria-label="Tutup gambar"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;