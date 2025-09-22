import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/button";

const fakeDB = [
  { id: "1", name: "Roti Tawar", price: 35000 },
  { id: "2", name: "Donat Coklat", price: 25000 },
  { id: "3", name: "Kue Keju", price: 40000 },
]; // Simulasi database

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "" });

  useEffect(() => {
    // Ambil data produk dari fakeDB berdasar id
    const found = fakeDB.find((item) => item.id === id);
    if (found) {
      setForm({ name: found.name, price: found.price.toString() });
    } else {
      alert("Produk tidak ditemukan");
      navigate("/dashboard/products");
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price.trim() || isNaN(form.price)) {
      alert("Isi data produk dengan benar");
      return;
    }

    alert(`Produk ${form.name} dengan harga Rp${form.price} berhasil diubah!`);
    // Simulasi update, redirect ke list produk
    navigate("/dashboard/products");
  };

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Edit Produk</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Nama Produk"
          value={form.name}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <input
          type="text"
          name="price"
          placeholder="Harga Produk (Jumlah dalam Rupiah)"
          value={form.price}
          onChange={handleChange}
          required
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <Button type="submit" variant="primary">
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
};

export default EditProduct;
