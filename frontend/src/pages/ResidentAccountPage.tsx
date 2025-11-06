import React, { useState, useEffect } from "react";
import axios from "../api/axios"; // ✅ use centralized axios instance
import Swal from "sweetalert2";
import { Camera, Save } from "lucide-react";

const ResidentAccountPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch current resident info
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsername(data.name || "");

      if (data.image) {
        const fullImageUrl = data.image.startsWith("http")
          ? data.image
          : `${import.meta.env.VITE_BACKEND_URL}${data.image}`;
        setImagePreview(fullImageUrl);
      }
    } catch (error) {
      console.error("Error loading resident profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle save/update
  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", username);
    if (password) formData.append("password", password);
    if (imageFile) formData.append("image", imageFile);

    try {
      await axios.put("/users/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Success", "Your account has been updated!", "success");
      setPassword("");
      setConfirmPassword("");
      setImageFile(null);
      await fetchProfile();
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Failed to update account", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🧑‍💻 Resident Account Settings
      </h2>

      <div className="flex flex-col items-center mb-6">
        {/* Profile Image */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-400 shadow-md">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-100 text-5xl text-green-400">
                +
              </div>
            )}
          </div>

          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
            <Camera className="text-white w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Click the photo to update your profile image
        </p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Username
          </label>
          <input
            type="text"
            placeholder="Edit your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 transition"
          }`}
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ResidentAccountPage;
