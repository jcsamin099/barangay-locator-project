import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // ✅ Function to fetch stats from backend
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load stats:", error);
      setLoading(false);
    }
  };

  // ✅ Run on mount + every 1 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 1000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="mb-6 text-gray-600">Welcome to the Admin Dashboard!</p>

      {stats?.currentUser && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg text-gray-700">
          <p>
            <strong>Logged in as:</strong> {stats.currentUser.name} (
            {stats.currentUser.role})
          </p>
          <p className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-blue-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Total Residents</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalResidents ?? 0}
          </p>
        </div>

        <div className="p-6 bg-green-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Total Admins</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalAdmins ?? 0}
          </p>
        </div>

        <div className="p-6 bg-yellow-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Online Residents</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.onlineResidents ?? 0}
          </p>
        </div>

        <div className="p-6 bg-purple-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Online Admins</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.onlineAdmins ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
