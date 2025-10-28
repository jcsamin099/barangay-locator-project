import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Add from "../assets/Add.png";
import Edit from "../assets/Edit.png";
import Remove from "../assets/Remove.png";
import api from "../api/axios";
import MapModal from "../components/MapModal"; // ✅ Modal with Get Directions

const BarangaysPage = () => {
  const [barangays, setBarangays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarangay, setSelectedBarangay] = useState<any | null>(null);
  const token = localStorage.getItem("token");

  // 🔹 Fetch all barangays
  const fetchBarangays = async () => {
    try {
      const { data } = await api.get("/barangays", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // 🧠 Helper: Extract `src` URL from iframe input
  const extractEmbedLink = (input: string): string => {
    const match = input.match(/src="([^"]+)"/);
    if (match && match[1]) return match[1];
    return input.trim(); // if user already pasted just the URL
  };

  // ➕ Add Barangay
  const handleAddBarangay = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Barangay Location",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Barangay Name" />
        <input id="swal-municipality" class="swal2-input" placeholder="Municipality" />
        <input id="swal-province" class="swal2-input" placeholder="Province" />
        <input id="swal-lat" class="swal2-input" placeholder="Latitude (optional)" />
        <input id="swal-lon" class="swal2-input" placeholder="Longitude (optional)" />
        <textarea id="swal-map" class="swal2-textarea" placeholder="Paste Google Map iframe or embed URL"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Barangay",
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement).value.trim();
        const municipality = (document.getElementById("swal-municipality") as HTMLInputElement).value.trim();
        const province = (document.getElementById("swal-province") as HTMLInputElement).value.trim();
        const latitude = (document.getElementById("swal-lat") as HTMLInputElement).value.trim();
        const longitude = (document.getElementById("swal-lon") as HTMLInputElement).value.trim();
        const mapInput = (document.getElementById("swal-map") as HTMLTextAreaElement).value.trim();

        if (!name || !municipality || !province || !mapInput) {
          Swal.showValidationMessage("All fields are required except coordinates!");
          return false;
        }

        const embedLink = extractEmbedLink(mapInput);
        return { name, municipality, province, latitude, longitude, embedLink };
      },
    });

    if (formValues) {
      try {
        await api.post("/barangays", formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Success", "Barangay added successfully!", "success");
        fetchBarangays();
      } catch (error) {
        console.error("Add barangay error:", error);
        Swal.fire("Error", "Failed to add barangay.", "error");
      }
    }
  };

  // ✏️ Edit Barangay
  const handleEdit = async (barangay: any) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Barangay",
      html: `
        <input id="swal-name" class="swal2-input" value="${barangay.name}" placeholder="Barangay Name" />
        <input id="swal-municipality" class="swal2-input" value="${barangay.municipality}" placeholder="Municipality" />
        <input id="swal-province" class="swal2-input" value="${barangay.province || ""}" placeholder="Province" />
        <input id="swal-lat" class="swal2-input" value="${barangay.latitude || ""}" placeholder="Latitude" />
        <input id="swal-lon" class="swal2-input" value="${barangay.longitude || ""}" placeholder="Longitude" />
        <textarea id="swal-map" class="swal2-textarea" placeholder="Paste new iframe or embed URL (optional)">${barangay.embedLink || ""}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement).value.trim();
        const municipality = (document.getElementById("swal-municipality") as HTMLInputElement).value.trim();
        const province = (document.getElementById("swal-province") as HTMLInputElement).value.trim();
        const latitude = (document.getElementById("swal-lat") as HTMLInputElement).value.trim();
        const longitude = (document.getElementById("swal-lon") as HTMLInputElement).value.trim();
        const mapInput = (document.getElementById("swal-map") as HTMLTextAreaElement).value.trim();

        if (!name || !municipality) {
          Swal.showValidationMessage("Name and municipality are required!");
          return false;
        }

        const embedLink = mapInput ? extractEmbedLink(mapInput) : barangay.embedLink;
        return { name, municipality, province, latitude, longitude, embedLink };
      },
    });

    if (formValues) {
      try {
        await api.put(`/barangays/${barangay._id}`, formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Updated!", "Barangay updated successfully.", "success");
        fetchBarangays();
      } catch (error) {
        console.error("Edit error:", error);
        Swal.fire("Error", "Failed to update barangay.", "error");
      }
    }
  };

  // 🗑️ Delete Barangay
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This barangay will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/barangays/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "Barangay removed successfully.", "success");
        fetchBarangays();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete barangay.", "error");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📍 Barangay Locations</h2>
        <button
          onClick={handleAddBarangay}
          className="flex items-center gap-2 bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <img src={Add} alt="Add icon" className="h-8 w-8" />
          Add Barangay
        </button>
      </div>

      {loading ? (
        <p>Loading barangays...</p>
      ) : barangays.length === 0 ? (
        <p>No barangays found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Barangay</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Municipality</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Province</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Map</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {barangays.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{b.name}</td>
                  <td className="border border-gray-200 px-4 py-2">{b.municipality}</td>
                  <td className="border border-gray-200 px-4 py-2">{b.province || "-"}</td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {b.embedLink ? (
                      <button
                        onClick={() => setSelectedBarangay(b)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        View Map
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">No map</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleEdit(b)}
                        className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full p-2 transition"
                        title="Edit Barangay"
                      >
                        <img src={Edit} alt="Edit icon" className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-full p-2 transition"
                        title="Delete Barangay"
                      >
                        <img src={Remove} alt="Delete icon" className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default BarangaysPage;
