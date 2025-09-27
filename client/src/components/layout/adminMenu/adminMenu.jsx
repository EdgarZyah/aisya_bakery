// aisya_bakery/client/src/components/layout/adminMenu.jsx
import React from "react";
import { FaTachometerAlt, FaUsers, FaBox, FaClipboardList, FaAddressBook, FaCertificate, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const adminMenu = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    label: "Manajemen",
    to: "/admin/management",
    icon: <FaBox />,
  },
  {
    label: "Pesanan",
    to: "/admin/orders",
    icon: <FaClipboardList />,
  },
  {
    label: "Pengguna",
    to: "/admin/list-user",
    icon: <FaUsers />,
  },
  {
    label: "Testimonial",
    to: "/admin/testimonials",
    icon: <FaCertificate />,
  },
];