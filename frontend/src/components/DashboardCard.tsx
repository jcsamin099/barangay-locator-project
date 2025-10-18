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
    isOnline: boolean;
  };
}

const DashboardCard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token"); // get JWT
        const { data } = await axios.get("http://localhost:5000/api/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Loading dashboard data...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="mb-6 text-gray-600">Welcome to the Admin Dashboard!</p>

      {stats.currentUser && (
        <div className="mb-6 bg-gray-100 p-4 rounded-lg text-gray-700">
          <p>
            <strong>Logged in as:</strong> {stats.currentUser.name} (
            {stats.currentUser.role})
          </p>
          <p>Status: {stats.currentUser.isOnline ? "🟢 Online" : "🔴 Offline"}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-blue-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Total Residents</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalResidents}</p>
        </div>

        <div className="p-6 bg-green-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Total Admins</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalAdmins}</p>
        </div>

        <div className="p-6 bg-yellow-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Online Residents</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.onlineResidents}</p>
        </div>

        <div className="p-6 bg-purple-100 rounded-lg shadow text-center">
          <h3 className="text-gray-700 font-medium">Online Admins</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.onlineAdmins}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
