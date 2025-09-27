import React, { useState } from "react";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Password dan konfirmasi password harus sama");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(`Akun berhasil dibuat dengan email: ${form.email}`);
      navigate("/user/dashboard"); // Arahkan ke dashboard pengguna
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert(`Registrasi gagal: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 border rounded shadow-sm bg-[var(--color-background)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] text-center">
        Daftar Akun Baru
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama Lengkap"
          required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Alamat Lengkap"
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Nomor Telepon"
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
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Konfirmasi Password"
          required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <Button type="submit" variant="primary">
          Signup
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-[var(--color-primary)] hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
};

export default Signup;