import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";
// Perbaikan: Impor BASE_URL_IMAGES dari axiosClient
import axiosClient, { BASE_URL_IMAGES } from "../../api/axiosClient";

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const catResponse = await axiosClient.get("/categories");
        setCategories(catResponse.data);

        const productResponse = await axiosClient.get(`/products/${id}`, {
          headers: { "x-auth-token": token },
        });
        const data = productResponse.data;
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const validate = () => {
    const err = {};
    if (
      form.imageUrl &&
      !["image/jpeg", "image/png"].includes(form.imageUrl.type)
    ) {
      err.imageUrl = "Hanya file JPG, JPEG, dan PNG yang diizinkan.";
    }
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalTitle === "Berhasil" || modalTitle === "Error") {
      navigate("/admin/list-product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setModalTitle("Peringatan");
      setModalMessage("Mohon periksa kembali tipe file yang diunggah.");
      setIsModalOpen(true);
      return;
    }
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
      await axiosClient.put(`/products/${id}`, formData, {
        headers: {
          "x-auth-token": token,
        },
      });
      setModalTitle("Berhasil");
      setModalMessage("Produk berhasil diperbarui!");
      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(`Error: ${error.response?.data?.msg || error.message}`);
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
    <div className="bg-background text-text min-h-screen">
      <Card className="w-full mx-auto h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Edit Produk</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nama Produk */}
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
          {/* Deskripsi */}
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
          {/* Harga dan Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Harga */}
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
            {/* Stok */}
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
          {/* Kategori */}
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
          {/* Produk Unggulan */}
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
          {/* Upload Gambar */}
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
                errors.imageUrl ? "border-red-500" : ""
              }`}
              accept=".jpg,.jpeg,.png"
            />
            {/* Tampilan gambar saat ini jika ada */}
            {form.oldImageUrl && (
              <div className="mb-4">
                <p className="mb-2">Gambar Saat Ini:</p>
                <img
                  // Perbaikan: Gunakan BASE_URL_IMAGES untuk URL gambar yang dinamis
                  src={`${BASE_URL_IMAGES}/${form.oldImageUrl}`}
                  alt="Produk Saat Ini"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          {/* Tombol Simpan */}
          <Button
            type="submit"
            variant="primary"
            className="mt-4"
            disabled={loading}
          >
            {loading ? <Loader /> : "Simpan Perubahan"}
          </Button>
        </form>
      </Card>
      {/* Modal konfirmasi */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleModalClose}>
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditProduct;