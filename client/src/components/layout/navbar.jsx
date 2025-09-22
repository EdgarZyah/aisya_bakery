import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import CartDropdown from "../cartDropdown";
import Logo from "../../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Roti Tawar",
      quantity: 2,
      price: "Rp15.000",
      image: "https://via.placeholder.com/50x50?text=Roti+Tawar",
    },
    {
      id: 2,
      name: "Donat Coklat",
      quantity: 1,
      price: "Rp10.000",
      image: "https://via.placeholder.com/50x50?text=Donat",
    },
  ]);

  const cartRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout");
    setCartOpen(false);
  };

  return (
    <nav
      className="bg-[var(--color-background)] text-[var(--color-text)] shadow-md relative"
      aria-label="Primary Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-[var(--color-primary)]"
            >
              <img src={Logo} alt="BrandLogo" className="h-14 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            >
              Products
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartOpen(!cartOpen)}
                aria-label="Toggle cart dropdown"
                className="relative p-2 rounded hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              >
                <FiShoppingCart className="h-6 w-6 text-[var(--color-primary)]" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
              <CartDropdown
                items={cartItems}
                isOpen={cartOpen}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
                aria-expanded={menuOpen}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)] transition"
              >
                {menuOpen ? (
                  <FiX className="h-6 w-6 text-[var(--color-primary)]" />
                ) : (
                  <FiMenu className="h-6 w-6 text-[var(--color-primary)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[var(--color-background)]">
          <Link
            to="/"
            className="block px-4 py-2 text-base font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block px-4 py-2 text-base font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-base font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-base font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
