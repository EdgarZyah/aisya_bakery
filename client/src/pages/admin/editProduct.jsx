import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";

const API_URL = "http://localhost:5000/api/products";
const CATEGORY_API_URL = "http://localhost:5000/api/categories";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isFeatured: false,
    imageUrl: null,
    oldImageUrl: "",
  });
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const catResponse = await fetch(CATEGORY_API_URL);
        if (!catResponse.ok) throw new Error("Gagal memuat kategori.");
        const catData = await catResponse.json();
        setCategories(catData);

        const productResponse = await fetch(`${API_URL}/${id}`, {
          headers: { "x-auth-token": token },
        });
        if (!productResponse.ok) {
          throw new Error("Gagal memuat produk.");
        }
        const data = await productResponse.json();
        setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId || "",
          isFeatured: data.isFeatured,
          imageUrl: null,
          oldImageUrl: data.imageUrl,
        });
      } catch (error) {
        setModalTitle("Error");
        setModalMessage(`Error: ${error.message}`);
        setIsModalOpen(true);
        // Redirect will happen after modal is closed
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

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

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalTitle === "Berhasil" || modalTitle === "Error") {
      navigate("/admin/list-product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("categoryId", form.categoryId);
    formData.append("isFeatured", String(form.isFeatured));
    if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl);
    }
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Gagal memperbarui produk.");
      }
      setModalTitle("Berhasil");
      setModalMessage("Produk berhasil diperbarui!");
      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--color-background)] text-[var(--color-text)] min-h-screen">
      <Card className="w-full mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Edit Produk</h2>
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
              className="p-3 border rounded"
              required
            />
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
              className="p-3 border rounded"
              rows="4"
              required
            />
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
                className="p-3 border rounded"
                required
              />
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
                className="p-3 border rounded"
                required
              />
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
              className="p-3 border rounded"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              className="p-3 border rounded"
              accept="image/*"
            />
          </div>
          {form.oldImageUrl && (
            <div className="mb-4">
              <p className="mb-2">Gambar Saat Ini:</p>
              <img
                src={`http://localhost:5000/${form.oldImageUrl}`}
                alt="Produk Saat Ini"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}

          <Button type="submit" variant="primary" className="mt-4" disabled={loading}>
            {loading ? <Loader /> : "Simpan Perubahan"}
          </Button>
        </form>
      </Card>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleModalClose}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditProduct;