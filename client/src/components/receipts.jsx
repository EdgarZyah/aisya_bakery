import React from "react";

const Receipt = ({ data }) => {
  const {
    orderId,
    date,
    buyerName,
    items,
    subtotal,
    shippingCost,
    total,
    paymentMethod,
    shippingAddress,
    notes,
  } = data;

  return (
    <div className="max-w-md mx-auto text-[var(--color-text)] font-sans">
      <header className="mb-6 border-b border-gray-300 pb-3">
        <h3 className="text-xl font-bold">Kuitansi Transaksi</h3>
        <div className="text-sm text-gray-600">ID Pesanan: {orderId}</div>
        <div className="text-sm text-gray-600">Tanggal: {date}</div>
      </header>

      <section className="mb-6">
        <h4 className="font-semibold mb-2">Data Pembeli</h4>
        <p>
          <span className="font-medium">Nama:</span> {buyerName}
        </p>
        <p>
          <span className="font-medium">Alamat Pengiriman:</span>{" "}
          {shippingAddress}
        </p>
        {notes && (
          <p>
            <span className="font-medium">Catatan:</span> {notes}
          </p>
        )}
      </section>

      <section className="mb-6">
        <h4 className="font-semibold mb-2">Detail Pesanan</h4>
        <div className="border rounded shadow-sm divide-y divide-gray-300 max-h-20 overflow-y-auto">
          {items.map(({ id, name, quantity, price }) => (
            <div key={id} className="flex justify-between px-4 py-3">
              <div className="flex-grow">
                <div className="font-medium">{name}</div>
                <div className="text-sm text-gray-600">Qty: {quantity}</div>
              </div>
              <div className="font-medium">
                Rp {(price * quantity).toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 text-right font-semibold">
        <div className="flex justify-between px-4">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between px-4">
          <span>Biaya Pengiriman</span>
          <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between px-4 text-lg font-bold">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </section>

      <section>
        <h4 className="font-semibold mb-2">Metode Pembayaran</h4>
        <p>{paymentMethod}</p>
      </section>
    </div>
  );
};

export default Receipt;
