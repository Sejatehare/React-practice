import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/user/home" },
    { name: "Products", to: "/user/products" },
    { name: "Orders", to: "/user/orders" },
    { name: "Profile", to: "/user/profile" },
    { name: "About", to: "/user/about" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-red-900 via-red-700 to-pink-900 shadow-lg">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        
        <Link
          to="/user/home"
          className="text-white text-xl font-extrabold tracking-wide"
        >
          HOUSE OF SHRINGAR
        </Link>

        <div className="hidden md:flex gap-6">
          {navItems.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "text-white after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-white"
                      : "text-white/80 hover:text-white"
                  }`}
              >
                {n.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/user/cart")}
            className="bg-black/20 text-white font-semibold px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition"
          >
            Cart
          </button>

          <button
            onClick={handleLogout}
            className="bg-black/20 text-white px-4 py-1.5 rounded-md hover:bg-black/30 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
