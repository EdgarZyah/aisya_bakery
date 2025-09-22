import React, { useState } from "react";
import Button from "../../components/common/button";
import { useNavigate } from "react-router-dom";

const AddTestimonials = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    message: "",
    date: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Nama harus diisi";
    if (!form.message.trim()) err.message = "Pesan testimonial harus diisi";
    if (!form.date.trim()) err.date = "Tanggal harus diisi";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    alert(`Testimonial dari ${form.name} berhasil disimpan!`);

    // Logic simpan ke backend atau state global

    // Reset form
    setForm({ name: "", message: "", date: "" });

    // Redirect atau close
    navigate("/admin/testimonials");
  };

  return (
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen mx-auto rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Tambah Testimonial Baru</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">Nama</label>
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
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block font-medium mb-1">Pesan Testimonial</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Tulis testimoni"
            required
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block font-medium mb-1">Tanggal</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <Button type="submit" variant="primary" className="mt-4">
          Simpan Testimonial
        </Button>
      </form>
    </div>
  );
};

export default AddTestimonials;
