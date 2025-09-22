import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";
import WhatsAppFloating from "./components/waFloating";

import Home from "./pages/home";
import Products from "./pages/products";
import Contact from "./pages/contact";
import Checkout from "./pages/checkout";
import NotFoundPage from "./pages/notFound";
import Login from "./pages/auth/loginForm";
import Signup from "./pages/auth/signupForm";

/* import ProtectedRoute from "./components/protectedRoute"; */
import Sidebar from "./components/layout/sidebar";

import Dashboard from "./pages/admin/dashboard";
import ListUser from "./pages/admin/listUser";
import ListProduct from "./pages/admin/listProduct";
import AddProduct from "./pages/admin/addProduct";
/* import EditProduct from "./pages/admin/editProduct"; */
import Order from "./pages/admin/order";
import Testimonials from "./pages/admin/testimonials";
import AddTestimonials from "./pages/admin/addTestimonials";

const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
    <Navbar />
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

const DashboardLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
    {/* Navbar untuk mobile */}
    <div className="md:hidden">
      <Sidebar />
    </div>

    <div className="flex flex-grow">
      {/* Sidebar hanya tampil di desktop */}
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>
      {/* Konten utama */}
      <main className="flex-grow overflow-auto">{children}</main>
    </div>

    {/* Navbar untuk desktop, jika dibutuhkan */}
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/products"
          element={
            <AppLayout>
              <Products />
            </AppLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <AppLayout>
              <Contact />
            </AppLayout>
          }
        />
        <Route
          path="*"
          element={
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <AppLayout>
              <Checkout />
            </AppLayout>
          }
        />
        {/* Routes without Navbar and Footer (Auth pages) */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/list-user"
          element={
            <DashboardLayout>
              <ListUser />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/list-product"
          element={
            <DashboardLayout>
              <ListProduct />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <DashboardLayout>
              <AddProduct />
            </DashboardLayout>
          }
        />
        {/*         <Route
          path="/edit-product/:id"
          element={
            <DashboardLayout>
              <EditProduct />
            </DashboardLayout>
          }
        /> */}{" "}
        <Route
          path="/admin/orders"
          element={
            <DashboardLayout>
              <Order />
            </DashboardLayout>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <DashboardLayout>
              <Testimonials />
            </DashboardLayout>
          }
        /><Route
          path="/admin/testimonials/add"
          element={
            <DashboardLayout>
              <AddTestimonials />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
