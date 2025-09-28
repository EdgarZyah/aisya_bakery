import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/button";
import Loader from "../../components/common/loader";
import Card from "../../components/common/card";
import Modal from "../../components/common/modal";

const API_URL = "http://localhost:5000/api/testimonials";

const EditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const CHARACTER_LIMIT = 300;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    comment: "",
    avatar: null,
    oldAvatar: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchTestimonial = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          headers: { "x-auth-token": token },
        });
        if (!response.ok) {
          throw new Error("Gagal memuat testimonial.");
        }
        const data = await response.json();
        setForm({
          name: data.name,
          comment: data.comment,
          avatar: null,
          oldAvatar: data.avatar,
        });
      } catch (error) {
        setModalTitle("Error");
        setModalMessage(`Error: ${error.message}`);
        setIsModalOpen(true);
        setTimeout(() => navigate("/admin/testimonials"), 1500);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonial();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (modalTitle === "Berhasil") {
      navigate("/admin/testimonials");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validasi di sisi client sebelum kirim ke backend
    if (form.comment.length > CHARACTER_LIMIT) {
      setModalTitle("Peringatan");
      setModalMessage(`Komentar tidak boleh melebihi ${CHARACTER_LIMIT} karakter`);
      setIsModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("comment", form.comment);
    if (form.avatar) {
      formData.append("avatar", form.avatar);
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
        throw new Error(errorData.msg || "Gagal memperbarui testimonial.");
      }
      setModalTitle("Berhasil");
      setModalMessage("Testimonial berhasil diperbarui!");
      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
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
    <div className="p-6 bg-purewhite text-[var(--color-text)] min-h-screen">
      <Card className="w-full mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Edit Testimonial</h2>
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
              className="w-full p-3 border rounded"
              required
            />
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
              className="w-full p-3 border rounded"
              required
            />
            <p className="text-right text-sm text-gray-500 mt-1">
              {form.comment.length}/{CHARACTER_LIMIT}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="avatar" className="block font-medium mb-1">
                Ganti Avatar (Opsional)
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
            {form.oldAvatar && (
              <div className="flex-shrink-0">
                <img
                  src={`http://localhost:5000/${form.oldAvatar}`}
                  alt="Avatar Lama"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <Button type="submit" variant="primary" className="mt-4">
            Simpan Perubahan
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

export default EditTestimonial;