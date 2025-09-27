import React, { useState } from "react";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login berhasil!");
      navigate(data.user.role === 'admin' ? "/admin/dashboard" : "/user/dashboard");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(`Login gagal: ${error.message}`);
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
    </div>
  );
};

export default Login;