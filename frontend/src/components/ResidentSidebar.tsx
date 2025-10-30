import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Navigation, UserCog, Menu, X } from "lucide-react";

const ResidentSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const userName = localStorage.getItem("userName") || "Resident";

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* 🔹 Hamburger Button (Mobile only) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#0f1e3a] text-white rounded-md lg:hidden shadow-md"
        >
          <Menu size={22} />
        </button>
      )}

      {/* 🔹 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#0f1e3a] text-white flex flex-col items-center transform transition-transform duration-300 z-40
        w-64 lg:w-72 border-r border-gray-800 shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between w-full">
          <h2 className="text-xl font-bold tracking-wide text-gray-100">
            Resident Panel
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-300 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-10 mb-6 text-center px-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md mb-4"
          />
          <p className="text-lg font-semibold text-white">{userName}</p>
          <p className="text-sm text-gray-400 mt-1">🕒 {time}</p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Buttons Section */}
        <div className="w-full px-6 space-y-3 mb-8">
          <button
            onClick={() => {
              navigate("/resident-main");
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition justify-center bg-[#1f3a68] hover:bg-[#2a4a85] font-medium"
          >
            <Navigation size={18} />
            <span>Navigate</span>
          </button>

          <button
            onClick={() => {
              navigate("/resident-account");
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition justify-center bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium"
          >
            <UserCog size={18} />
            <span>Manage Account</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition justify-center bg-red-600 hover:bg-red-700 font-medium text-white"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ResidentSidebar;
