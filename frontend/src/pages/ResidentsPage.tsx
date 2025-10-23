import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getResidents,
  addResident,
  updateResident,
  deleteResident,
} from "../services/residentService";

const ResidentsPage = () => {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🔹 Fetch all residents
  const fetchResidents = async () => {
    try {
      const data = await getResidents(token);
      const residentUsers = data.filter((res) => res.role === "resident");
      setResidents(residentUsers);
      setFilteredResidents(residentUsers);
    } catch (error) {
      console.error("Error fetching residents:", error);
      Swal.fire("Error", "Failed to load residents.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  // 🔍 Search Filter
  useEffect(() => {
    const filtered = residents.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResidents(filtered);
  }, [searchQuery, residents]);

  // ➕ Add Resident
  const handleAddResident = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Resident",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Full Name" />
        <input id="swal-email" class="swal2-input" placeholder="Email" />
        <input id="swal-password" type="password" class="swal2-input" placeholder="Password" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Resident",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const password = document.getElementById("swal-password").value.trim();

        if (!name || !email || !password) {
          Swal.showValidationMessage("All fields are required!");
          return false;
        }

        return { name, email, password };
      },
    });

    if (formValues) {
      try {
        await addResident(token, formValues);
        Swal.fire("Added!", "New resident has been created.", "success");
        fetchResidents();
      } catch (error) {
        console.error("Error adding resident:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to add resident.",
          "error"
        );
      }
    }
  };

  // ✏️ Edit Resident (name, email, password)
  const handleEdit = async (resident) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Resident Info",
      html: `
        <input id="swal-name" class="swal2-input" value="${resident.name}" placeholder="Full Name" />
        <input id="swal-email" class="swal2-input" value="${resident.email}" placeholder="Email" />
        <input id="swal-password" type="password" class="swal2-input" placeholder="New Password (optional)" />
        <input id="swal-confirm" type="password" class="swal2-input" placeholder="Confirm New Password" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const password = document.getElementById("swal-password").value.trim();
        const confirm = document.getElementById("swal-confirm").value.trim();

        if (password && password !== confirm) {
          Swal.showValidationMessage("Passwords do not match!");
          return false;
        }

        return {
          name: name || resident.name,
          email: email || resident.email,
          password: password || "",
        };
      },
    });

    if (formValues) {
      try {
        await updateResident(token, resident._id, formValues);
        Swal.fire("Updated!", "Resident info has been updated.", "success");
        fetchResidents();
      } catch (error) {
        console.error("Error updating resident:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to update resident.",
          "error"
        );
      }
    }
  };

  // 🗑️ Delete Resident
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This resident account will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteResident(token, id);
        Swal.fire("Deleted!", "Resident has been deleted.", "success");
        fetchResidents();
      } catch (error) {
        console.error("Error deleting resident:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete resident.",
          "error"
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          🏘️ Residents Management
        </h2>
        <button
          onClick={handleAddResident}
          className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Resident
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p>Loading residents...</p>
      ) : filteredResidents.length === 0 ? (
        <p>No residents found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-200 px-4 py-2 text-left">
                  Role
                </th>
                <th className="border border-gray-200 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((resident) => (
                <tr key={resident._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">
                    {resident.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {resident.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 capitalize">
                    {resident.role}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(resident)}
                      className="text-blue-500 cursor-pointer hover:text-blue-700 mx-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(resident._id)}
                      className="text-red-500 cursor-pointer hover:text-red-700 mx-2"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResidentsPage;
