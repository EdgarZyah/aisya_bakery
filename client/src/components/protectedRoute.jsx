import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // 1. Cek apakah pengguna sudah login
  if (!token || !user) {
    alert("Anda harus login untuk melanjutkan.");
    return <Navigate to="/login" replace />;
  }

  // 2. Cek apakah peran pengguna diizinkan
  if (allowedRoles && allowedRoles.includes(user.role)) {
    // Pengguna memiliki peran yang diizinkan, lanjutkan ke rute tujuan
    return <Outlet />;
  } else {
    // Pengguna tidak memiliki peran yang diizinkan
    alert("Akses ditolak. Anda tidak memiliki izin untuk halaman ini.");
    // Arahkan admin ke dashboard admin dan user ke home
    return user.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;