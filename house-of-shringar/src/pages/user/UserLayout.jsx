// src/pages/user/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 via-red-100 to-red-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
