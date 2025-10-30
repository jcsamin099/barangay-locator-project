import React from "react";
import ResidentSidebar from "../components/ResidentSidebar";

const ResidentMainPage = () => {
  const userName = localStorage.getItem("userName") || "Resident";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <ResidentSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10 transition-all duration-300 lg:ml-64 lg:ml-72">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">
          Hello, {userName}!
        </h1>
        <p className="text-gray-700">
          Welcome to your resident dashboard. From here, you can navigate to
          nearby barangays, manage your account, or log out.
        </p>
      </main>
    </div>
  );
};

export default ResidentMainPage;
