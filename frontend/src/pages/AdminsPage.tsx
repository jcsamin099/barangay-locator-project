import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Add from "../assets/Add.png";
import Edit from "../assets/Edit.png";
import Remove from "../assets/Remove.png";
import {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../services/adminService";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      const adminUsers = data.filter((user: Admin) => user.role === "admin");
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
  }, []);

  useEffect(() => {
    const filtered = admins.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [searchQuery, admins]);

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
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          .value.trim();
        const email = (document.getElementById("swal-email") as HTMLInputElement)
          .value.trim();
        const password = (
          document.getElementById("swal-password") as HTMLInputElement
        ).value.trim();

        if (!name || !email || !password) {
          Swal.showValidationMessage("All fields are required!");
          return false;
        }

        return { name, email, password };
      },
    });

    if (formValues) {
      try {
        await addAdmin(formValues);
        Swal.fire("Added!", "New admin has been created.", "success");
        fetchAdmins();
      } catch (error: any) {
        console.error("Error adding admin:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to add admin.",
          "error"
        );
      }
    }
  };

  const handleEdit = async (admin: Admin) => {
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
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          .value.trim();
        const email = (document.getElementById("swal-email") as HTMLInputElement)
          .value.trim();
        const password = (
          document.getElementById("swal-password") as HTMLInputElement
        ).value.trim();
        const confirm = (
          document.getElementById("swal-confirm") as HTMLInputElement
        ).value.trim();

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
        await updateAdmin(admin._id, formValues);
        Swal.fire("Updated!", "Admin info has been updated.", "success");
        fetchAdmins();
      } catch (error: any) {
        console.error("Error updating admin:", error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to update admin.",
          "error"
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
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
        await deleteAdmin(id);
        Swal.fire("Deleted!", "Admin has been deleted.", "success");
        fetchAdmins();
      } catch (error: any) {
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
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md">
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
          🧑‍💼 Admin Management
        </h2>

        <button
          onClick={handleAddAdmin}
          className="flex items-center justify-center sm:justify-start gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm sm:text-base hover:bg-blue-700 transition w-full sm:w-auto"
        >
          <img src={Add} alt="Add icon" className="h-6 w-6 sm:h-8 sm:w-8" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* 🔍 Search Bar */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 📋 Table */}
      {loading ? (
        <p>Loading admins...</p>
      ) : filteredAdmins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 text-sm sm:text-base">
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
              {filteredAdmins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 break-words max-w-[150px] sm:max-w-none">
                    {admin.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 break-words max-w-[180px] sm:max-w-none">
                    {admin.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 capitalize text-center sm:text-left">
                    {admin.role}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-full p-2 transition"
                        title="Edit Admin"
                      >
                        <img
                          src={Edit}
                          alt="Edit icon"
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      </button>

                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-full p-2 transition"
                        title="Delete Admin"
                      >
                        <img
                          src={Remove}
                          alt="Delete icon"
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                      </button>
                    </div>
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
