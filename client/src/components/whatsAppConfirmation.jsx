import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import Button from "./common/button";

const WhatsAppConfirmation = ({ orderId, total, items, userName, userPhone }) => {
  const productList = items
    .map((item) => `• ${item.name} (${item.quantity}x)`)
    .join("\n");

  const message = `Halo Admin Aisya Bakery,\n\nSaya ingin memesan:\n${productList}\n\n Total: Rp ${total.toLocaleString("id-ID")}\nID Pesanan: #${orderId}\n\nAtas nama: *${userName}*\nNo. HP: ${userPhone || "Tidak tersedia"}\n\nMohon konfirmasi ketersediaan dan proses pesanan saya ya`;

  // Nomor admin (ganti sesuai kebutuhan)
  const adminNumber = "6289688841511";
  const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="w-full">
      <Button
        variant="primary"
        className="w-full flex items-center justify-center gap-2"
      >
        <FaWhatsapp className="text-lg" /> Konfirmasi Pesanan via WhatsApp
      </Button>
    </a>
  );
};

export default WhatsAppConfirmation;
