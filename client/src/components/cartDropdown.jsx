import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./common/button";

const CartDropdown = ({ items, onRemoveItem, onCheckout, isOpen }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect ukuran layar saat ini
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint md
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Jika mobile dan dropdown ingin ditampilkan, redirect ke halaman checkout
  useEffect(() => {
    if (isMobile && isOpen) {
      navigate("/checkout", { state: { cartItems: items } });
    }
  }, [isMobile, isOpen, navigate, items]);

  if (!isOpen || isMobile) return null;

  // Perbaiki: Total dihitung langsung dari angka
  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-[var(--color-background)] rounded-md shadow-lg border border-gray-200 z-50">
      <div className="p-4 max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-center text-[var(--color-text)]">Keranjang kosong</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{item.name}</p>
                  <p className="text-xs text-[var(--color-primary)]">
                    {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800 text-sm font-bold"
                aria-label={`Hapus ${item.name} dari keranjang`}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t border-gray-300 p-4">
          <div className="flex justify-between font-bold text-[var(--color-primary)] mb-3">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
          <Button variant="primary" className="w-full" onClick={onCheckout}>
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;