const ProductDetail = ({ product }) => (
  <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-8 text-[var(--color-text)]">
    <img src={product.image} alt={product.name} className="w-full md:w-1/2 rounded" />
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="mb-4">{product.description}</p>
      <div className="text-[var(--color-primary)] font-semibold text-xl mb-6">{product.price}</div>
      <button className="bg-[var(--color-primary)] text-[var(--color-background)] py-3 px-6 rounded hover:bg-[var(--color-secondary)] transition">
        Tambah ke Keranjang
      </button>
    </div>
  </div>
);
