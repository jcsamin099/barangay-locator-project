import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const ResidentsPage = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch all residents
  const fetchResidents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/users/admin/residents",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResidents(data);
    } catch (error) {
      console.error("Error fetching residents:", error);
      Swal.fire("Error", "Failed to load residents.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add resident
  const handleAddResident = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Resident",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Full Name" />' +
        '<input id="swal-input2" class="swal2-input" placeholder="Email" />' +
        '<input id="swal-input3" type="password" class="swal2-input" placeholder="Password" />',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Resident",
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value.trim();
        const email = document.getElementById("swal-input2").value.trim();
        const password = document.getElementById("swal-input3").value.trim();

        if (!name || !email || !password) {
          Swal.showValidationMessage("All fields are required!");
          return false;
        }

        return { name, email, password };
      },
    });

    if (formValues) {
      try {
        await axios.post(
          "http://localhost:5000/api/users/register",
          {
            name: formValues.name,
            email: formValues.email,
            password: formValues.password,
            role: "resident",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

  // Edit resident
  const handleEdit = async (resident) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Resident Info",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${resident.name}" />` +
        `<input id="swal-input2" class="swal2-input" placeholder="Email" value="${resident.email}" />`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value.trim();
        const email = document.getElementById("swal-input2").value.trim();
        if (!name || !email) {
          Swal.showValidationMessage("All fields are required!");
          return false;
        }
        return { name, email };
      },
    });

    if (formValues) {
      try {
        await axios.put(
          `http://localhost:5000/api/users/admin/residents/${resident._id}`,
          formValues,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  // Delete resident
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
        await axios.delete(
          `http://localhost:5000/api/users/admin/residents/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        Swal.fire("Deleted!", "Resident account has been deleted.", "success");
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Resident
        </button>
      </div>

      {loading ? (
        <p>Loading residents...</p>
      ) : residents.length === 0 ? (
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
              {residents.map((resident) => (
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
                      className="text-blue-500 hover:text-blue-700 mx-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(resident._id)}
                      className="text-red-500 hover:text-red-700 mx-2"
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
