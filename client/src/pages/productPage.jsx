import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/common/button";
import Loader from "../components/common/loader";
import NotFoundPage from "./notFound";

const API_URL = "http://localhost:5000/api/products";

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
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
    if (onAddToCart && product) {
      const itemToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: quantity,
      };
      onAddToCart(itemToAdd);
      alert(`${itemToAdd.name} (${itemToAdd.quantity}) berhasil ditambahkan ke keranjang.`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (error || !product) {
    return <NotFoundPage />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 text-[var(--color-text)]">
      <div className="md:w-1/2">
        <img
          src={`http://localhost:5000/${product.imageUrl}`}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-center">
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
    </div>
  );
};

export default ProductPage;