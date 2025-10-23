import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../services/adminService";

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🔹 Fetch all admins
  const fetchAdmins = async () => {
    try {
      const data = await getAdmins(token);
      const adminUsers = data.filter((user) => user.role === "admin");
      setAdmins(adminUsers);
      setFilteredAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
      Swal.fire("Error", "Failed to load admins.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const filtered = admins.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchQuery, admins]);

  // ➕ Add Admin
  const handleAddAdmin = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Admin",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Full Name" />
        <input id="swal-email" class="swal2-input" placeholder="Email" />
        <input id="swal-password" type="password" class="swal2-input" placeholder="Password" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Admin",
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
        await addAdmin(token, formValues);
        Swal.fire("Added!", "New admin has been created.", "success");
        fetchAdmins();
      } catch (error) {
        console.error("Error adding admin:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to add admin.",
          "error"
        );
      }
    }
  };

  // ✏️ Edit Admin
  const handleEdit = async (admin) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Admin Info",
      html: `
        <input id="swal-name" class="swal2-input" value="${admin.name}" placeholder="Full Name" />
        <input id="swal-email" class="swal2-input" value="${admin.email}" placeholder="Email" />
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

        if (!name || !email) {
          Swal.showValidationMessage("Name and Email are required!");
          return false;
        }

        if (password && password !== confirm) {
          Swal.showValidationMessage("Passwords do not match!");
          return false;
        }

        return { name, email, password };
      },
    });

    if (formValues) {
      try {
        await updateAdmin(token, admin._id, formValues);
        Swal.fire("Updated!", "Admin info has been updated.", "success");
        fetchAdmins();
      } catch (error) {
        console.error("Error updating admin:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to update admin.",
          "error"
        );
      }
    }
  };

  // 🗑️ Delete Admin
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This admin account will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteAdmin(token, id);
        Swal.fire("Deleted!", "Admin has been deleted.", "success");
        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete admin.",
          "error"
        );
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">🧑‍💼 Admin Management</h2>
        <button
          onClick={handleAddAdmin}
          className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Admin
        </button>
      </div>

      {/* 🔍 Modern Styled Search Bar (same as ResidentsPage) */}
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
        <p>Loading admins...</p>
      ) : filteredAdmins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Role</th>
                <th className="border border-gray-200 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{admin.name}</td>
                  <td className="border border-gray-200 px-4 py-2">{admin.email}</td>
                  <td className="border border-gray-200 px-4 py-2 capitalize">
                    {admin.role}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-blue-500 cursor-pointer hover:text-blue-700 mx-2"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
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

export default AdminPage;
