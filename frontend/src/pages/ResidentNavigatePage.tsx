import React from "react";
import ResidentSidebar from "../components/ResidentSidebar";
import { MapPin } from "lucide-react";

const ResidentNavigatePage = () => {
  const userName = localStorage.getItem("userName") || "Resident";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ResidentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 transition-all duration-300 lg:ml-64 lg:ml-72">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="text-blue-600 w-7 h-7" />
          <h1 className="text-3xl font-bold text-blue-700">Navigate</h1>
        </div>

        {/* Greeting */}
        <p className="text-gray-700 mb-8">
          Hi {userName}, use this page to explore nearby barangays, get directions, or view locations on the map.
        </p>

        {/* Placeholder Map Section */}
        <div className="bg-white rounded-lg shadow p-6 text-center border border-gray-200">
          <p className="text-gray-500 italic">
            🗺️ Map feature coming soon — you’ll be able to see nearby barangays here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResidentNavigatePage;
