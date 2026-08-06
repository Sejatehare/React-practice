import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ role = "user" }) {
  // 🔥 role-based config
  const config = {
    admin: {
      bg: "bg-gradient-to-r from-red-50 via-gray-100 to-red-50",
      mainClass: "p-6",
    },
    user: {
      bg: "bg-gradient-to-r from-red-50 via-red-100 to-red-50",
      mainClass: "",
    },
  };

  const current = config[role];

  return (
    <div className={`min-h-screen ${current.bg}`}>
      <Navbar role={role} />
      <main className={current.mainClass}>
        <Outlet />
      </main>
    </div>
  );
}