// src/App.jsx
import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

// User layout + pages
import UserLayout from "./pages/user/UserLayout";
import HomePage from "./pages/user/HomePage";
import ProductList from "./pages/user/ProductList";
import ProductDetails from "./pages/user/ProductDetails";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import UserOrders from "./pages/user/UserOrders";
import ProfilePage from "./pages/user/ProfilePage";
import AboutUs from "./pages/user/AboutUs";

// Admin layout + pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductDetails from "./pages/admin/AdminProductDetails";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProfile from "./pages/admin/AdminProfile";

import ProtectedRoute from "./components/ProtectedRoutes";
import WishlistPage from "./pages/user/WishlistPage";
import AdminCategories from "./pages/admin/AdminCategories";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* USER: layout keeps navbar persistent */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="products" element={<ProductList />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<UserOrders />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="wishlist" element={<WishlistPage />} />
      </Route>

      {/* ADMIN: protected */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminDashboard />} />
        <Route path="product/:id" element={<AdminProductDetails />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />}/>
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<h1 className="text-center mt-10">404 - Page Not Found</h1>} />
    </Routes>
  );
}
