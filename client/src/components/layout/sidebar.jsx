import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Logo from "../../assets/logo.png";

const Sidebar = ({ menu }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    alert("Anda telah logout.");
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
            onClick={handleLogout}
            className="w-full block px-3 py-2 rounded hover:bg-red-500 hover:text-white text-sm text-center transition"
          >
            Logout
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
                handleLogout();
                setOpen(false);
              }}
              className="px-3 py-3 rounded hover:bg-red-500 hover:text-white text-sm text-center"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;