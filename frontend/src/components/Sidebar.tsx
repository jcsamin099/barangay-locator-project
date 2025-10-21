// src/components/Sidebar.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Users, MapPin, LogOut, Shield } from "lucide-react";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Call backend to mark admin offline
      if (token) {
        await axios.post(
          "http://localhost:5000/api/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // 🧹 Clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 🔄 Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) =>
    location.pathname === path ? "bg-gray-700" : "";

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[#0f1e3a] text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
            "/admin/dashboard"
          )}`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {/* 🛡️ Admins Link */}
        <Link
          to="/admin/admins"
          className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
            "/admin/admins"
          )}`}
        >
          <Shield className="w-5 h-5" />
          <span>Admins</span>
        </Link>

        <Link
          to="/admin/residents"
          className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
            "/admin/residents"
          )}`}
        >
          <Users className="w-5 h-5" />
          <span>Residents</span>
        </Link>

        <Link
          to="/admin/barangays"
          className={`flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition ${isActive(
            "/admin/barangays"
          )}`}
        >
          <MapPin className="w-5 h-5" />
          <span>Barangays</span>
        </Link>
      </nav>

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
  );
};

export default Sidebar;
