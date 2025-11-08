import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FiShoppingCart, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import CartDropdown from "../cartDropdown";
import Logo from "../../assets/logo.png";
import Modal from "../common/modal";
import Button from "../common/button";

const Navbar = ({ cartItems, onRemoveItem }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

  const cartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  // ... (useEffect hooks and handlers remain the same) ...
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);


  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
    setCartOpen(false);
  };

  const handleLogoutClick = () => {
    setModalTitle("Konfirmasi Logout");
    setModalMessage("Apakah Anda yakin ingin logout?");
    setIsConfirmLogoutOpen(true);
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsConfirmLogoutOpen(false);
    setModalTitle("Informasi");
    setModalMessage("Anda telah logout.");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (!isConfirmLogoutOpen && modalTitle === "Informasi") {
      navigate("/");
    }
  };

  const closeMobileMenu = () => setMenuOpen(false);

  // Common class for nav links
  const navLinkClass = "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)] transition";
  // Kelas dasar untuk link mobile
  const mobileNavLinkBaseClass = "block w-full text-left px-4 py-3 text-base font-medium transition rounded";
  // Kelas hover untuk link mobile (sama seperti desktop)
  const mobileNavLinkHoverClass = "hover:bg-[var(--color-accent)] hover:text-[var(--color-secondary)]";
  // Kelas active untuk link mobile (sama seperti desktop)
  const mobileNavLinkActiveClass = "text-[var(--color-secondary)] font-semibold";


  return (
    <>
      <nav
        className="bg-[var(--color-background)] text-[var(--color-text)] shadow-md sticky top-0 z-40"
        aria-label="Primary Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-[var(--color-primary)] flex items-center"
              >
                <img src={Logo} alt="Aisya Bakery Logo" className="h-12 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:space-x-4 lg:space-x-6 items-center">
              <Link to="/" className={`${navLinkClass} ${location.pathname === '/' ? mobileNavLinkActiveClass : ''}`}>Home</Link>
              <Link to="/products" className={`${navLinkClass} ${location.pathname === '/products' ? mobileNavLinkActiveClass : ''}`}>Products</Link>
              <Link to="/contact" className={`${navLinkClass} ${location.pathname === '/contact' ? mobileNavLinkActiveClass : ''}`}>Contact</Link>
              {user && (
                <Link
                  to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                  className={`${navLinkClass} bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right Side Icons/Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* ... (Cart, Login/Logout, Mobile Menu Button tetap sama) ... */}
               <div className="relative" ref={cartRef}>
                 <button
                   onClick={() => setCartOpen(!cartOpen)}
                   aria-label="Toggle cart dropdown"
                   className="relative p-2 rounded-full hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition"
                 >
                   <FiShoppingCart className="h-6 w-6 text-[var(--color-primary)]" />
                   {cartItems.length > 0 && (
                     <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                       {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                     </span>
                   )}
                 </button>
                 <CartDropdown
                   items={cartItems}
                   isOpen={cartOpen}
                   onRemoveItem={onRemoveItem}
                   onCheckout={handleCheckout}
                 />
               </div>
               {user ? (
                 <button
                   onClick={handleLogoutClick}
                   aria-label="Logout"
                   className="p-2 rounded-full text-[var(--color-primary)] hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                 >
                   <FiLogOut className="h-6 w-6" />
                 </button>
               ) : (
                 <Link
                   to="/login"
                   className="hidden sm:inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition"
                 >
                   Login
                 </Link>
               )}
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
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-x-0 top-16 z-30 bg-[var(--color-background)] shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {/* Terapkan kelas secara kondisional */}
          <Link to="/" className={`${mobileNavLinkBaseClass} ${mobileNavLinkHoverClass} ${location.pathname === '/' ? mobileNavLinkActiveClass : ''}`} onClick={closeMobileMenu}>Home</Link>
          <Link to="/products" className={`${mobileNavLinkBaseClass} ${mobileNavLinkHoverClass} ${location.pathname === '/products' ? mobileNavLinkActiveClass : ''}`} onClick={closeMobileMenu}>Products</Link>
          <Link to="/contact" className={`${mobileNavLinkBaseClass} ${mobileNavLinkHoverClass} ${location.pathname === '/contact' ? mobileNavLinkActiveClass : ''}`} onClick={closeMobileMenu}>Contact</Link>
          {user && (
            <Link
              to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
              // Style khusus dashboard (jika berbeda) atau gunakan logika active biasa jika sama
              className={`${mobileNavLinkBaseClass} bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]`} // Ini sudah konsisten dengan desktop
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
          )}
          <hr className="border-[var(--color-accent)] my-2"/>
          {user ? (
            <button
              onClick={() => {
                handleLogoutClick();
                closeMobileMenu();
              }}
               // Gunakan base class, hover class merah spesifik
              className={`${mobileNavLinkBaseClass} text-red-600 hover:bg-red-500 hover:text-white`}
            >
               <div className="flex items-center space-x-2">
                 <FiLogOut />
                 <span>Logout</span>
               </div>
            </button>
          ) : (
            // Gunakan base class dan hover class standar
            <Link
              to="/login"
              className={`${mobileNavLinkBaseClass} ${mobileNavLinkHoverClass}`}
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {/* ... (Modal tetap sama) ... */}
       <Modal isOpen={isModalOpen} onClose={handleModalClose} title={modalTitle}>
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

export default Navbar;