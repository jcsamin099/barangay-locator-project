import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios"; // ✅ use your centralized axios instance

interface Stats {
  totalResidents: number;
  totalAdmins: number;
  onlineResidents: number;
  onlineAdmins: number;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string; // ✅ from backend
  };
}

const DashboardCard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axiosInstance.get("/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600">Loading dashboard data...</p>
    );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-center sm:text-left">
        Dashboard
      </h2>
      <p className="mb-6 text-gray-600 text-sm sm:text-base text-center sm:text-left">
        Welcome to the Admin Dashboard!
      </p>

      {stats?.currentUser && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg text-gray-700 text-sm sm:text-base">
          <p>
            <strong>Logged in as:</strong> {stats.currentUser.name} (
            {stats.currentUser.role})
          </p>
          <p className="flex items-center gap-2 mt-1">
            <span>Status:</span>
            {stats.currentUser.status === "online" ? (
              <span className="flex items-center text-green-600 font-semibold">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                Online
              </span>
            ) : (
              <span className="flex items-center text-red-600 font-semibold">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                Offline
              </span>
            )}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-blue-100 rounded-lg shadow text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-gray-700 font-medium text-sm sm:text-base">
            Total Residents
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats?.totalResidents ?? 0}
          </p>
        </div>

        <div className="p-4 sm:p-6 bg-green-100 rounded-lg shadow text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-gray-700 font-medium text-sm sm:text-base">
            Total Admins
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats?.totalAdmins ?? 0}
          </p>
        </div>

        <div className="p-4 sm:p-6 bg-yellow-100 rounded-lg shadow text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-gray-700 font-medium text-sm sm:text-base">
            Online Residents
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats?.onlineResidents ?? 0}
          </p>
        </div>

        <div className="p-4 sm:p-6 bg-purple-100 rounded-lg shadow text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-gray-700 font-medium text-sm sm:text-base">
            Online Admins
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {stats?.onlineAdmins ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
