import React, { useState, useEffect } from "react";
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

  // ... (useEffect hooks and handlers remain the same) ...
   useEffect(() => {
     if (open) {
       document.body.style.overflow = 'hidden';
     } else {
       document.body.style.overflow = 'unset';
     }
     return () => {
       document.body.style.overflow = 'unset';
     };
   }, [open]);

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
     if (!isConfirmLogoutOpen && modalTitle === "Informasi") {
       navigate("/login");
     }
   };

   const closeMobileMenu = () => setOpen(false);


  // Kelas hover dan active dari desktop sidebar
  const desktopLinkHoverClass = "hover:bg-[var(--color-primary)] hover:text-background";
  const desktopLinkActiveClass = "bg-[var(--color-primary)] text-background";

  // Kelas dasar untuk link mobile
  const mobileNavLinkBaseClass = "block w-full text-left px-4 py-3 text-base font-medium transition rounded";


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background shadow-md min-h-screen px-4 py-6">
        <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">
          <img src={Logo} alt="BrandLogo" className="h-20 w-auto mb-8 mx-auto" />
        </Link>
        <nav className="flex flex-col space-y-4 flex-1">
          {menu.map((nav) => (
            <Link
              key={nav.to}
              to={nav.to}
              className={`block px-3 py-2 rounded transition ${
                location.pathname === nav.to
                  ? desktopLinkActiveClass // Gunakan variabel active class
                  : desktopLinkHoverClass // Gunakan variabel hover class
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
            className="w-full block px-3 py-2 rounded hover:bg-red-500 hover:text-white text-sm text-center transition" // Hover logout desktop
          >
            <div className="flex items-center space-x-2">
              <FiLogOut />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Navbar Header */}
      <nav className="md:hidden bg-background shadow-md px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 h-16">
        <Link to="/" className="flex items-center">
           <img src={Logo} alt="BrandLogo" className="h-12 w-auto" />
        </Link>
        <button
          className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)] transition"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX className="h-6 w-6 text-[var(--color-primary)]"/> : <FiMenu className="h-6 w-6 text-[var(--color-primary)]"/>}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
         className={`fixed inset-x-0 top-16 z-30 bg-[var(--color-background)] shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
           open ? 'translate-y-0' : '-translate-y-full'
         }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
           {menu.map((nav) => (
             <Link
               key={nav.to}
               to={nav.to}
                // Terapkan kelas dasar, hover, dan active secara kondisional
               className={`${mobileNavLinkBaseClass} ${
                 location.pathname === nav.to
                   ? desktopLinkActiveClass // Pakai active desktop
                   : desktopLinkHoverClass // Pakai hover desktop
               }`}
               onClick={closeMobileMenu}
             >
                <div className="flex items-center space-x-2">
                  {nav.icon}
                  <span>{nav.label}</span>
                </div>
             </Link>
           ))}
           <hr className="border-[var(--color-accent)] my-2"/>
           <button
             onClick={() => {
               handleLogoutClick();
               closeMobileMenu();
             }}
             // === PERUBAHAN DI SINI ===
             // Samakan hover logout mobile dengan desktop
             className={`${mobileNavLinkBaseClass} text-red-600 hover:bg-red-500 hover:text-white`}
             // === AKHIR PERUBAHAN ===
           >
             <div className="flex items-center space-x-2">
               <FiLogOut />
               <span>Logout</span>
             </div>
           </button>
         </nav>
      </div>

      {/* Logout Modal */}
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

export default Sidebar;