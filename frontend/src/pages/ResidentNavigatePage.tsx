import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import MapModal from "../components/MapModal";

const ResidentNavigatePage = () => {
  const [barangays, setBarangays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarangay, setSelectedBarangay] = useState<any | null>(null);

  // 🔹 Fetch barangays
  const fetchBarangays = async () => {
    try {
      const { data } = await api.get("/barangays");
      setBarangays(data);
    } catch (err) {
      console.error("Error fetching barangays:", err);
      Swal.fire("Error", "Failed to load barangays.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangays();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          🗺️ Locate Barangays
        </h2>
      </div>

      {/* Barangay List */}
      {loading ? (
        <p>Loading barangays...</p>
      ) : barangays.length === 0 ? (
        <p>No barangays found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barangays.map((b) => (
            <div
              key={b._id}
              className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {b.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {b.municipality}, {b.province || ""}
              </p>

              <div className="flex justify-between items-center">
                {b.embedLink ? (
                  <button
                    onClick={() => setSelectedBarangay(b)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
                  >
                    View Map
                  </button>
                ) : (
                  <span className="text-gray-400 italic text-sm">
                    No map available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🗺️ Map Modal */}
      {selectedBarangay && (
        <MapModal
          embedLink={selectedBarangay.embedLink}
          latitude={selectedBarangay.latitude}
          longitude={selectedBarangay.longitude}
          name={selectedBarangay.name}
          onClose={() => setSelectedBarangay(null)}
        />
      )}
    </div>
  );
};

export default ResidentNavigatePage;
