import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../assets/logo.png";

const navLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Products", to: "/admin/list-product" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Profile", to: "/admin/profile" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background shadow-md min-h-screen px-4 py-6">
        <img src={Logo} alt="BrandLogo" className="h-14 w-auto mb-8 mx-auto" />
        <nav className="flex flex-col space-y-4">
          {navLinks.map((nav) => (
            <Link
              key={nav.to}
              to={nav.to}
              className="block px-3 py-2 rounded hover:bg-[var(--color-primary)] hover:text-background transition"
            >
              {nav.label}
            </Link>
          ))}
          <Link
            to="/"
            className="block px-3 py-2 rounded hover:bg-[var(--color-secondary)] hover:text-background text-sm text-center mt-auto"
          >
            Logout
          </Link>
        </nav>
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
            {navLinks.map((nav) => (
              <Link
                key={nav.to}
                to={nav.to}
                className="px-3 py-3 rounded hover:bg-[var(--color-primary)] hover:text-background transition"
                onClick={() => setOpen(false)}
              >
                {nav.label}
              </Link>
            ))}
            <Link
              to="/"
              className="px-3 py-3 rounded hover:bg-[var(--color-secondary)] hover:text-background text-sm text-center"
              onClick={() => setOpen(false)}
            >
              Logout
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
