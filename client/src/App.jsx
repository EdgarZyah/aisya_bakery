import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import WhatsAppFloating from "./components/waFloating";
import ProtectedRoute from "./components/protectedRoute";
import Sidebar from "./components/layout/sidebar"; // Impor sidebar yang direfaktor
import { adminMenu } from "./components/layout/adminMenu/adminMenu"; // Impor menu admin
import { userMenu } from "./components/layout/userMenu/userMenu"; // Impor menu user
import OrderSuccessPage from "./pages/orderSuccessPage"; // Import halaman baru

import Home from "./pages/home";
import Products from "./pages/products";
import Contact from "./pages/contact";
import Checkout from "./pages/checkout";
import NotFoundPage from "./pages/notFound";
import ProductPage from "./pages/productPage";

import Login from "./pages/auth/loginForm";
import Signup from "./pages/auth/signupForm";

import Dashboard from "./pages/admin/dashboard";
import ManagementPage from "./pages/admin/management";
import ListProduct from "./pages/admin/listProduct";
import AddProduct from "./pages/admin/addProduct";
import EditProduct from "./pages/admin/editProduct";
import Order from "./pages/admin/order";
import ListUser from "./pages/admin/listUser";
import ListTestimonial from "./pages/admin/listTestimonial";
import AddTestimonials from "./pages/admin/addTestimonial";
import EditTestimonial from "./pages/admin/editTestimonial";
import ListCategory from "./pages/admin/listCategory";

import UserDashboard from "./pages/user/dashboard";
import MyOrdersPage from "./pages/user/myOrders";
import UserProfilePage from "./pages/user/profile";

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prevItems, item];
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  
  const handleClearCart = () => {
    setCartItems([]);
  };

  const AppLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Navbar cartItems={cartItems} onRemoveItem={handleRemoveItem} />
      <main className="flex-grow">{children}</main>
      <WhatsAppFloating />
      <Footer />
    </div>
  );

  const AuthLayout = ({ children }) => (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <main className="flex-grow">{children}</main>
    </div>
  );

  const DashboardLayout = ({ children, menu }) => (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="md:hidden">
        <Sidebar menu={menu} />
      </div>
      <div className="flex flex-grow">
        <aside className="hidden md:flex">
          <Sidebar menu={menu} />
        </aside>
        <main className="flex-grow overflow-auto">{children}</main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout><Home onAddToCart={handleAddToCart} /></AppLayout>} />
        <Route path="/products" element={<AppLayout><Products onAddToCart={handleAddToCart} /></AppLayout>} />
        <Route path="/products/:id" element={<AppLayout><ProductPage onAddToCart={handleAddToCart} /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
        <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />

        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
        
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/dashboard" element={<DashboardLayout menu={userMenu}><UserDashboard /></DashboardLayout>} />
          <Route path="/user/orders" element={<DashboardLayout menu={userMenu}><MyOrdersPage /></DashboardLayout>} />
          <Route path="/user/profile" element={<DashboardLayout menu={userMenu}><UserProfilePage /></DashboardLayout>} />
          <Route path="/checkout" element={<AppLayout><Checkout cartItems={cartItems} onClearCart={handleClearCart} /></AppLayout>} />
          <Route path="/checkout/success" element={<AppLayout><OrderSuccessPage /></AppLayout>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<DashboardLayout menu={adminMenu}><Dashboard /></DashboardLayout>} />
          <Route path="/admin/management" element={<DashboardLayout menu={adminMenu}><ManagementPage /></DashboardLayout>} />
          <Route path="/admin/list-product" element={<DashboardLayout menu={adminMenu}><ListProduct /></DashboardLayout>} />
          <Route path="/admin/add-product" element={<DashboardLayout menu={adminMenu}><AddProduct /></DashboardLayout>} />
          <Route path="/admin/edit-product/:id" element={<DashboardLayout menu={adminMenu}><EditProduct /></DashboardLayout>} />
          <Route path="/admin/orders" element={<DashboardLayout menu={adminMenu}><Order /></DashboardLayout>} />
          <Route path="/admin/list-user" element={<DashboardLayout menu={adminMenu}><ListUser /></DashboardLayout>} />
          <Route path="/admin/testimonials" element={<DashboardLayout menu={adminMenu}><ListTestimonial /></DashboardLayout>} />
          <Route path="/admin/add-testimonial" element={<DashboardLayout menu={adminMenu}><AddTestimonials /></DashboardLayout>} />
          <Route path="/admin/edit-testimonial/:id" element={<DashboardLayout menu={adminMenu}><EditTestimonial /></DashboardLayout>} />
          <Route path="/admin/categories" element={<DashboardLayout menu={adminMenu}><ListCategory /></DashboardLayout>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;