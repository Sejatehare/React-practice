// src/pages/user/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 via-violet-100 to-purple-200">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
