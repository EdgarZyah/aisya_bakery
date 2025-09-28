import React, { useState } from "react";
import Button from "../../components/common/button";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";

const API_URL = "http://localhost:5000/api/testimonials";

const AddTestimonial = () => {
  const navigate = useNavigate();
  const CHARACTER_LIMIT = 300;

  const [form, setForm] = useState({
    name: "",
    comment: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Nama harus diisi";
    if (!form.comment.trim()) err.comment = "Pesan testimonial harus diisi";
    if (form.comment.length > CHARACTER_LIMIT) err.comment = `Komentar tidak boleh melebihi ${CHARACTER_LIMIT} karakter`;

    // Validasi tipe file
    if (form.avatar && !['image/jpeg', 'image/png'].includes(form.avatar.type)) {
      err.avatar = "Hanya file JPG, JPEG, dan PNG yang diizinkan.";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setModalTitle("Peringatan");
      setModalMessage("Mohon lengkapi semua kolom yang wajib diisi dan periksa kembali tipe file.");
      setIsModalOpen(true);
      return;
    }
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("comment", form.comment);
    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

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
        throw new Error(errorData.msg || "Gagal menambahkan testimonial.");
      }
      setModalTitle("Berhasil");
      setModalMessage("Testimonial berhasil ditambahkan!");
      setIsModalOpen(true);
      setTimeout(() => navigate("/admin/testimonials"), 1500);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-background text-text min-h-screen">
      <Card className="w-full mx-auto h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Tambah Testimonial Baru</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan nama pelanggan"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="comment" className="block font-medium mb-1">
              Pesan Testimonial
            </label>
            <textarea
              id="comment"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="4"
              maxLength={CHARACTER_LIMIT}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.comment ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Tulis testimoni"
              required
            />
            <p className="text-right text-sm text-gray-500 mt-1">
              {form.comment.length}/{CHARACTER_LIMIT}
            </p>
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
          </div>

          <div>
            <label htmlFor="avatar" className="block font-medium mb-1">
              Avatar (Opsional)
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleChange}
              className={`w-full p-3 border rounded ${
                errors.avatar ? "border-red-500" : ""
              }`}
              accept=".jpg,.jpeg,.png"
            />
            {errors.avatar && (
              <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
            )}
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Simpan Testimonial
          </Button>
        </form>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddTestimonial;