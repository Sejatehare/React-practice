import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ role = "user" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const config = {
    admin: {
      title: "Admin Panel",
      containerStyle:
        "bg-gradient-to-r from-slate-900 to-slate-800 shadow-xl",
      navItems: [
        { name: "Products", to: "/admin" },
        { name: "Orders", to: "/admin/orders" },
        { name: "Profile", to: "/admin/profile" },
      ],
      navClass: (path) =>
        `px-3 py-1 rounded transition ${
          pathname === path
            ? "bg-indigo-600 text-white"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }`,
      showCart: false,
    },

    user: {
      title: "HOUSE OF SHRINGAR",
      containerStyle:
        "bg-gradient-to-r from-red-900 via-red-700 to-pink-900 shadow-lg",
      navItems: [
        { name: "Home", to: "/user/home" },
        { name: "Products", to: "/user/products" },
        { name: "Orders", to: "/user/orders" },
        { name: "Profile", to: "/user/profile" },
        { name: "About", to: "/user/about" },
      ],
      navClass: (path) => {
        const active = pathname === path;
        return `relative text-sm font-medium transition-all duration-300 ${
          active
            ? "text-white after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-white"
            : "text-white/80 hover:text-white"
        }`;
      },
      showCart: true,
    },
  };

  const current = config[role];

  return (
    <nav className={`sticky top-0 z-50 ${current.containerStyle}`}>
      <div className="w-full px-6 py-3 flex justify-between items-center">
        
        {/* Title */}
        {role === "user" ? (
          <Link
            to="/user/home"
            className="text-white text-xl font-extrabold tracking-wide"
          >
            {current.title}
          </Link>
        ) : (
          <div className="text-lg font-bold tracking-wide text-white">
            {current.title}
          </div>
        )}

        {/* Nav Items */}
        <div className="flex gap-4 items-center">
          <div className={`${role === "user" ? "hidden md:flex gap-6" : "flex gap-4"}`}>
            {current.navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={current.navClass(item.to)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Cart (only user) */}
          {current.showCart && (
            <button
              onClick={() => navigate("/user/cart")}
              className="bg-black/20 text-white font-semibold px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition"
            >
              Cart
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={
              role === "admin"
                ? "ml-2 bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-white transition"
                : "bg-black/20 text-white px-4 py-1.5 rounded-md hover:bg-black/30 transition"
            }
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}