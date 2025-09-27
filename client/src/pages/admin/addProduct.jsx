// aisya_bakery/client/src/pages/admin/addProduct.jsx
import React, { useState, useEffect } from "react";
import Button from "../../components/common/button";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/card";
import Loader from "../../components/common/loader";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isFeatured: false,
    imageUrl: null,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORY_API_URL);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        console.error("Fetch categories error:", e);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Nama produk harus diisi";
    if (!form.description.trim()) err.description = "Deskripsi harus diisi";
    if (!form.price || isNaN(form.price) || form.price <= 0) err.price = "Harga harus angka positif";
    if (!form.stock || isNaN(form.stock) || form.stock < 0) err.stock = "Stok harus angka non-negatif";
    if (!form.categoryId) err.categoryId = "Kategori harus dipilih";
    if (!form.imageUrl) err.imageUrl = "Gambar produk harus diunggah";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (name === "imageUrl") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("categoryId", form.categoryId); // Perbaikan: Mengirim categoryId
    formData.append("isFeatured", String(form.isFeatured)); // Perbaikan: Mengubah boolean menjadi string
    formData.append("imageUrl", form.imageUrl);
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Gagal menambahkan produk.");
      }
      alert("Produk berhasil ditambahkan!");
      navigate("/admin/list-product"); // Perbaikan: Rute yang benar
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <Card className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Tambah Produk Baru</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium">
              Nama Produk
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`p-3 border rounded ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-medium">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`p-3 border rounded ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              rows="4"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="font-medium">
                Harga
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={`p-3 border rounded ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="stock" className="font-medium">
                Stok
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className={`p-3 border rounded ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.stock && (
                <p className="text-red-500 text-sm">{errors.stock}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="categoryId" className="font-medium">
              Kategori
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className={`p-3 border rounded ${
                errors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm">{errors.categoryId}</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-[var(--color-primary)] bg-gray-100 border-gray-300 rounded focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="isFeatured" className="font-medium text-sm">
              Tandai sebagai Produk Unggulan
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="imageUrl" className="font-medium">
              Gambar Produk
            </label>
            <input
              type="file"
              id="imageUrl"
              name="imageUrl"
              onChange={handleChange}
              className={`p-3 border rounded ${
                errors.imageUrl ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm">{errors.imageUrl}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="mt-4" disabled={loading}>
            {loading ? <Loader /> : "Tambah Produk"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;