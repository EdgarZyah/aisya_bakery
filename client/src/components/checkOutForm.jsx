const CheckoutForm = () => (
  <form className="max-w-lg mx-auto p-6 bg-white rounded shadow flex flex-col gap-4 text-[var(--color-text)]">
    <h2 className="text-xl font-bold mb-4">Checkout</h2>
    <input type="text" placeholder="Nama Lengkap" required className="p-2 border rounded" />
    <input type="text" placeholder="Alamat" required className="p-2 border rounded" />
    <input type="text" placeholder="Kota" required className="p-2 border rounded" />
    <input type="text" placeholder="Kode Pos" required className="p-2 border rounded" />
    <select className="p-2 border rounded" required>
      <option value="">Pilih Metode Pembayaran</option>
      <option value="credit_card">Kartu Kredit</option>
      <option value="bank_transfer">Transfer Bank</option>
      <option value="e_wallet">Dompet Digital</option>
    </select>
    <button type="submit" className="bg-[var(--color-primary)] text-[var(--color-background)] py-3 rounded hover:bg-[var(--color-secondary)] transition">
      Bayar Sekarang
    </button>
  </form>
);
