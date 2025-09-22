import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/button";
import Card from "../components/common/card";

const Checkout = () => {
  // Dummy data produk. Di implementasi nyata, data akan diambil dari API.
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bolu Coklat Moist",
      variant: "Ukuran Medium",
      price: 125000,
      image: "https://via.placeholder.com/300x180?text=Bolu+Coklat",
      quantity: 1,
    },
    {
      id: 2,
      name: "Roti Keju Ganda",
      variant: "Reguler",
      price: 45000,
      image: "https://via.placeholder.com/300x180?text=Roti+Keju",
      quantity: 2,
    },
  ]);

  const handleQty = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Hitung subtotal dan total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15000;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[var(--color-background)] flex justify-center items-center py-12 px-4 text-[var(--color-text)]">
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-5xl">
        {/* Detail Produk & Kuantitas (Kiri) */}
        <div className="flex-1">
          <Card>
            <h2 className="text-xl font-bold mb-6">Keranjang Belanja</h2>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <div className="text-gray-500 text-sm mb-1">
                    Variant - {item.variant}
                  </div>
                  <div className="font-bold text-[var(--color-primary)] text-lg">
                    Rp {item.price.toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleQty(item.id, -1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-100 disabled:opacity-50"
                    disabled={item.quantity === 1}
                  >
                    –
                  </button>
                  <span className="px-3 select-none font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQty(item.id, 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <Link
              to="/products"
              className="mt-6 inline-block font-semibold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition"
            >
              &larr; Lanjutkan Belanja
            </Link>
          </Card>
        </div>

        {/* Ringkasan Pesanan (Kanan) */}
        <div className="flex-1 max-w-xs">
          <Card>
            <h4 className="font-semibold text-lg mb-6">Ringkasan Pesanan</h4>
            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between mb-3 text-gray-500">
              <span>Biaya Pengiriman</span>
              <span>Rp {shipping.toLocaleString("id-ID")}</span>
            </div>
            <hr className="my-4 border-gray-300" />
            <div className="flex justify-between items-center text-xl font-bold mb-6">
              <span>Total</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <Button variant="primary" className="w-full py-3">
              Lanjutkan ke Pembayaran
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Checkout;