import React, { useState } from "react";
import Button from "../../components/common/button";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    // Login logic here
    alert(`Login dengan email : ${form.email}`);
    navigate("/dashboard");
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
