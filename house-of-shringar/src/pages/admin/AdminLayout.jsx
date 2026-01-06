// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 via-gray-100 to-red-50">
      <AdminNavbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
