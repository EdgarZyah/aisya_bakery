import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Modal from "./common/modal";
import Button from "./common/button";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("");

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // 1. Cek apakah pengguna sudah login
  if (!token || !user) {
    if (!isModalOpen) {
      setModalTitle("Akses Ditolak");
      setModalMessage("Anda harus login untuk melanjutkan.");
      setRedirectTo("/login");
      setIsModalOpen(true);
    }
    return <Modal isOpen={isModalOpen} onClose={() => {}} title={modalTitle}>
      <p>{modalMessage}</p>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" onClick={() => window.location.href = redirectTo}>OK</Button>
      </div>
    </Modal>;
  }

  // 2. Cek apakah peran pengguna diizinkan
  if (allowedRoles && allowedRoles.includes(user.role)) {
    // Pengguna memiliki peran yang diizinkan, lanjutkan ke rute tujuan
    return <Outlet />;
  } else {
    // Pengguna tidak memiliki peran yang diizinkan
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/';
    if (!isModalOpen) {
      setModalTitle("Akses Ditolak");
      setModalMessage("Akses ditolak. Anda tidak memiliki izin untuk halaman ini.");
      setRedirectTo(redirectPath);
      setIsModalOpen(true);
    }
    return <Modal isOpen={isModalOpen} onClose={() => {}} title={modalTitle}>
      <p>{modalMessage}</p>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" onClick={() => window.location.href = redirectTo}>OK</Button>
      </div>
    </Modal>;
  }
};

export default ProtectedRoute;