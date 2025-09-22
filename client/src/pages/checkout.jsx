import React, { useState } from "react";
import Button from "../components/common/button";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const product = {
  id: 1,
  name: "Stewardess Bundle by OtaPic",
  variant: "Stewardess Bundle",
  price: 399000,
  image: "https://www.shutterstock.com/image-photo/fresh-baked-bread-flour-wheat-600nw-2409821173.jpg",
};

const Checkout = () => {
  const [qty, setQty] = useState(1);

  const handleQty = (delta) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const subtotal = product.price * qty;

  return (
    <main className="min-h-screen bg-white flex justify-center items-start my-auto">
      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-5xl">
        {/* Produk (Kiri) */}
        <div className="flex-1 flex flex-col gap-8">
          <button
            className="self-end text-gray-400 hover:text-red-500 text-3xl sm:text-4xl mb-2"
            aria-label="Close checkout"
          >
            <FiX />
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 rounded object-cover flex-shrink-0"
            />
            <div className="flex-grow">
              <h3 className="font-semibold text-base sm:text-lg">{product.name}</h3>
              <div className="text-gray-500 text-sm mb-1">Variant - {product.variant}</div>
              <div className="font-medium text-base sm:text-lg">
                Rp{subtotal.toLocaleString("id-ID")},00
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <button
                onClick={() => handleQty(-1)}
                className="w-8 h-8 rounded border flex items-center justify-center text-xl bg-gray-50 hover:bg-gray-200 disabled:opacity-50"
                disabled={qty === 1}
              >
                –
              </button>
              <span className="px-3 select-none font-semibold">{qty}</span>
              <button
                onClick={() => handleQty(1)}
                className="w-8 h-8 rounded border flex items-center justify-center text-xl bg-gray-50 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
          <Link
            to="/products"
            className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
          >
            Continue Shopping &rarr;
          </Link>
        </div>

        {/* Ringkasan Pesanan (Kanan) */}
        <div className="flex-1 max-w-lg bg-gray-50 rounded-xl shadow p-8 text-sm sm:text-base">
          <h4 className="font-semibold text-lg mb-6">Order Summary</h4>
          <div className="flex justify-between mb-3">
            <span>
              Subtotal ({qty} Item{qty > 1 ? "s" : ""})
            </span>
            <span>Rp{subtotal.toLocaleString("id-ID")},00</span>
          </div>
          <div className="flex justify-between mb-3 text-gray-500">
            <span>Shipping</span>
            <span>Calculated at next step</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between items-center text-xl font-bold mb-6">
            <span>Total</span>
            <span>Rp{subtotal.toLocaleString("id-ID")},00</span>
          </div>
          <Button variant="primary" className="w-full py-3 rounded-lg">
            Continue
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
