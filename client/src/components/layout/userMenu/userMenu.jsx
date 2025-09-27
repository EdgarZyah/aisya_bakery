// aisya_bakery/client/src/components/layout/userMenu.jsx
import React from "react";
import { FaTachometerAlt, FaShoppingCart, FaUser } from "react-icons/fa";

export const userMenu = [
  {
    label: "Dashboard",
    to: "/user/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    label: "Pesanan Saya",
    to: "/user/orders",
    icon: <FaShoppingCart />,
  },
  {
    label: "Profil",
    to: "/user/profile",
    icon: <FaUser />,
  },
];