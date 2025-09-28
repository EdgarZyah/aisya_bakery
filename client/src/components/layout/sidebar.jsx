import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Logo from "../../assets/logo.png";
import Modal from "../common/modal";
import Button from "../common/button";

const Sidebar = ({ menu }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  
  const handleLogoutClick = () => {
    setModalTitle("Konfirmasi Logout");
    setModalMessage("Apakah Anda yakin ingin logout?");
    setIsConfirmLogoutOpen(true);
    setIsModalOpen(true);
  };
  
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsConfirmLogoutOpen(false);
    setModalTitle("Informasi");
    setModalMessage("Anda telah logout.");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (!isConfirmLogoutOpen) { // Only navigate after the success message modal closes
      navigate("/login");
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background shadow-md min-h-screen px-4 py-6">
        <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">
          <img
            src={Logo}
            alt="BrandLogo"
            className="h-20 w-auto mb-8 mx-auto"
          />
        </Link>
        <nav className="flex flex-col space-y-4 flex-1">
          {menu.map((nav) => (
            <Link
              key={nav.to}
              to={nav.to}
              className={`block px-3 py-2 rounded transition ${
                location.pathname === nav.to
                  ? "bg-[var(--color-primary)] text-background"
                  : "hover:bg-[var(--color-primary)] hover:text-background"
              }`}
            >
              <div className="flex items-center space-x-2">
                {nav.icon}
                <span>{nav.label}</span>
              </div>
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogoutClick}
            className="w-full block px-3 py-2 rounded hover:bg-red-500 hover:text-white text-sm text-center transition"
          >
            <div className="flex items-center space-x-2">
              <FiLogOut />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-background shadow-md px-4 py-3 flex items-center justify-between relative z-50">
        <img src={Logo} alt="BrandLogo" className="h-10 w-auto" />
        <button
          className="text-2xl"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Overlay dropdown nav mobile - full width + fixed at the top */}
      {open && (
        <div className="fixed top-0 left-0 w-full bg-background shadow-lg border-b z-40">
          <nav className="flex flex-col pt-20 pb-4 px-6">
            {menu.map((nav) => (
              <Link
                key={nav.to}
                to={nav.to}
                className="px-3 py-3 rounded hover:bg-[var(--color-primary)] hover:text-background transition"
                onClick={() => setOpen(false)}
              >
                {nav.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogoutClick();
                setOpen(false);
              }}
              className="px-3 py-3 rounded hover:bg-red-500 hover:text-white text-sm text-center"
            >
              Logout
            </button>
          </nav>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
        <p>{modalMessage}</p>
        {isConfirmLogoutOpen ? (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleConfirmLogout}>Logout</Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={handleModalClose}>OK</Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Sidebar;