import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/button";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});

  // Validasi sederhana
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nama produk wajib diisi";
    if (!form.price.trim() || isNaN(form.price))
      newErrors.price = "Harga produk wajib berupa angka";
    if (!form.description.trim()) newErrors.description = "Deskripsi wajib diisi";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "URL gambar wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Kirim data produk ke backend atau simpan sesuai logika aplikasi
    alert(`Produk ${form.name} dengan harga Rp${form.price} berhasil ditambahkan`);

    // Reset form jika perlu
    setForm({
      name: "",
      price: "",
      description: "",
      imageUrl: "",
    });

    navigate("/dashboard/list-product");
  };

  return (
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen max-w-2xl mx-auto rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Tambah Produk Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Nama Produk
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan nama produk"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block font-medium mb-1">
            Harga Produk (Rp)
          </label>
          <input
            id="price"
            name="price"
            type="text"
            value={form.price}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan harga produk"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Deskripsi Produk
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan deskripsi produk"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block font-medium mb-1">
            URL Gambar Produk
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={form.imageUrl}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.imageUrl ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Masukkan URL gambar produk"
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        <Button type="submit" variant="primary" className="mt-4">
          Simpan Produk
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
