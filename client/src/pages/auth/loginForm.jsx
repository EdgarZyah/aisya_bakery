import React, { useState } from "react";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/common/modal";
import axiosClient from "../../api/axiosClient";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setModalTitle("Berhasil");
      setModalMessage("Login berhasil!");
      setRedirectTo(data.user.role === 'admin' ? "/admin/dashboard" : "/user/dashboard");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Login Error:", error.message);
      setModalTitle("Login Gagal");
      setModalMessage(
        `Login gagal: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`
      );
      setRedirectTo(null);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 border rounded shadow-sm bg-[var(--color-background)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] text-center">
        Masuk Akun
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <Button type="submit" variant="primary">
          Login
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        Belum punya akun?{" "}
        <Link to="/signup" className="text-[var(--color-primary)] hover:underline">
          Daftar di sini
        </Link>
      </p>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalTitle}>
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" onClick={handleModalClose}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
