import React, { useState } from "react";
import Table from "../../components/common/table";
import Modal from "../../components/common/modal";
import Receipt from "../../components/receipt";

const Order = () => {
  const [selected, setSelected] = useState(null);

  const transactions = [
    {
      orderId: "INV202309221234",
      date: "2025-09-22",
      buyerName: "Jane Doe",
      items: [
        { id: 1, name: "Roti Tawar Spesial", quantity: 2, price: 35000 },
        { id: 2, name: "Donat Coklat", quantity: 1, price: 25000 },
      ],
      subtotal: 95000,
      shippingCost: 10000,
      total: 105000,
      paymentMethod: "Transfer Bank",
      shippingAddress: "Jl. Merpati no 21, Jakarta",
      notes: "Tolong dikirim pagi hari",
      paymentProofUrl:
        "https://dummyimage.com/400x300/ced4da/212529.png&text=Bukti+Pembayaran",
    },
    {
      orderId: "INV202309210098",
      date: "2025-09-21",
      buyerName: "Jane Doe",
      items: [{ id: 3, name: "Kue Keju", quantity: 1, price: 40000 }],
      subtotal: 40000,
      shippingCost: 10000,
      total: 50000,
      paymentMethod: "E-Wallet",
      shippingAddress: "Jl. Merpati no 21, Jakarta",
      notes: "",
      paymentProofUrl: null,
    },
  ];

  const columns = [
    { header: "Tanggal", accessor: "date" },
    { header: "ID Pesanan", accessor: "orderId" },
    {
      header: "Total",
      accessor: "total",
      cell: (row) => "Rp " + row.total.toLocaleString("id-ID"),
    },
    { header: "Metode", accessor: "paymentMethod" },
  ];

  const handleDetail = (row) => {
    setSelected(row);
  };

  const handleClose = () => {
    setSelected(null);
  };

  return (
    <div className="p-6 min-h-screen bg-purewhite text-[var(--color-text)]">
      <h2 className="text-2xl font-semibold mb-4">Riwayat Transaksi</h2>

      <Table
        columns={columns}
        data={transactions}
        renderActions={(row) => (
          <button
            onClick={() => handleDetail(row)}
            className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-background)] rounded hover:bg-[var(--color-secondary)] transition"
          >
            Lihat Detail
          </button>
        )}
      />

      <Modal isOpen={!!selected} onClose={handleClose} title="Detail Pesanan">
        {selected && (
          <>
            <Receipt data={selected} />
            {selected.paymentProofUrl && (
              <div className="mt-4 flex justify-end">
                <a
                  href={selected.paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                >
                  Lihat Bukti Pembayaran
                </a>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default Order;
