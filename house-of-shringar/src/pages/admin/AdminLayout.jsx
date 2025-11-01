// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-red-100 to-purple-200">
      <AdminNavbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
