import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/common/card";
import Button from "../components/common/button";
import Loader from "../components/common/loader";
import Receipt from "../components/receipt";

const Checkout = ({ cartItems, onClearCart }) => {
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login untuk melanjutkan checkout.");
      navigate("/login");
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

      setOrderData(data);
      setOrderComplete(true);
      onClearCart();
      
      // Clear cart items from localStorage as well if you're using it to persist the cart
      localStorage.removeItem("cartItems"); 

      alert("Pesanan berhasil dibuat!");
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="flex justify-center items-center min-h-screen p-6">
        <Receipt orderData={orderData} />
      </div>
    );
  }

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
    <div className="p-6">
      <Card className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Ringkasan Pesanan</h3>
          <ul className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} ({item.quantity}x)
                </span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-4 font-bold text-lg flex justify-between">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full"
          >
            {loading ? <Loader /> : "Lanjutkan Pembayaran"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;