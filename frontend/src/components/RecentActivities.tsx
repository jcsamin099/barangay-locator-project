import React from "react";

const RecentActivities: React.FC = () => {
  const activities = [
    "🧾 User John registered as resident",
    "🏠 Barangay San Isidro added new report",
    "📊 Admin updated barangay statistics",
  ];

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activities</h2>
      <ul className="divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <li key={index} className="py-3 text-gray-600">{activity}</li>
        ))}
      </ul>
    </section>
  );
};

export default RecentActivities;
