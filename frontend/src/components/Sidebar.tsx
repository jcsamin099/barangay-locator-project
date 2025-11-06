// src/components/Sidebar.tsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MapPin,
  LogOut,
  Shield,
  UserCog,
  Menu,
  X,
} from "lucide-react";
import axiosInstance from "../api/axios"; // ✅ Use centralized axios

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await axiosInstance.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) =>
    location.pathname === path ? "bg-gray-700" : "";

  return (
    <>
      {/* 🔹 Hamburger Button (Mobile only, visible when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#0f1e3a] text-white rounded-md lg:hidden"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#0f1e3a] text-white flex flex-col transform transition-transform duration-300 z-40
        w-64 lg:w-72
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold truncate whitespace-nowrap">
            Admin Panel
          </h2>

          {/* X Button inside sidebar header (mobile only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-gray-300 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-3">
          <Link
            to="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
              "/admin/dashboard"
            )}`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/admins"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
              "/admin/admins"
            )}`}
          >
            <Shield className="w-5 h-5" />
            <span>Admins</span>
          </Link>

          <Link
            to="/admin/residents"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
              "/admin/residents"
            )}`}
          >
            <Users className="w-5 h-5" />
            <span>Residents</span>
          </Link>

          <Link
            to="/admin/barangays"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
              "/admin/barangays"
            )}`}
          >
            <MapPin className="w-5 h-5" />
            <span>Barangays</span>
          </Link>

          <Link
            to="/admin/account"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
              "/admin/account"
            )}`}
          >
            <UserCog className="w-5 h-5" />
            <span>Account</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
