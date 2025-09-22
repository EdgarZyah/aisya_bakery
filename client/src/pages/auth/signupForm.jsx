import React, { useState } from "react";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Password dan konfirmasi password harus sama");
      return;
    }
    // Signup logic here
    alert(`Akun dibuat dengan email: ${form.email}`);
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 border rounded shadow-sm bg-[var(--color-background)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)] text-center">
        Daftar Akun Baru
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
