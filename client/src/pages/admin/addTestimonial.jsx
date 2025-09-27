import React, { useState } from "react";
import Button from "../../components/common/button";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/card";

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

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Nama harus diisi";
    if (!form.comment.trim()) err.comment = "Pesan testimonial harus diisi";
    if (form.comment.length > CHARACTER_LIMIT) err.comment = `Komentar tidak boleh melebihi ${CHARACTER_LIMIT} karakter`;
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

    if (!validate()) return;
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
      alert("Testimonial berhasil ditambahkan!");
      navigate("/admin/testimonials");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen">
      <Card className="max-w-2xl mx-auto">
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
              className="w-full p-3 border rounded"
              accept="image/*"
            />
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Simpan Testimonial
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddTestimonial;