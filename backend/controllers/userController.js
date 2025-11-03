import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

/* 🔧 Helper: safely delete old images */
const deleteImageIfExists = (imagePath) => {
  try {
    if (imagePath && fs.existsSync(path.resolve(`.${imagePath}`))) {
      fs.unlinkSync(path.resolve(`.${imagePath}`));
      console.log("🗑 Deleted old image:", imagePath);
    }
  } catch (err) {
    console.warn("⚠️ Failed to delete image:", err.message);
  }
};

/* ✏️ UPDATE ANY USER (Admin use) */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🧱 Update text fields
    if (name?.trim()) user.name = name.trim();
    if (email?.trim()) user.email = email.trim();
    if (password?.trim()) user.password = await bcrypt.hash(password, 10);

    // 🖼 Handle uploaded image
    if (req.file) {
      deleteImageIfExists(user.image);

      const normalizedPath = req.file.path.replace(/\\/g, "/");
      user.image = normalizedPath.startsWith("/uploads/")
        ? normalizedPath
        : `/${normalizedPath}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        image: updatedUser.image ? `${BASE_URL}${updatedUser.image}` : null,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("❌ Update User Error:", error.message);
    res.status(500).json({ message: "Error updating user" });
  }
};

/* 👤 UPDATE OWN PROFILE (Resident/Admin self-edit) */
export const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✏️ Update text fields
    if (name?.trim()) user.name = name.trim();
    if (email?.trim()) user.email = email.trim();
    if (password?.trim()) user.password = await bcrypt.hash(password, 10);

    // 🖼 Handle uploaded image
    if (req.file) {
      deleteImageIfExists(user.image);
      const normalizedPath = req.file.path.replace(/\\/g, "/");
      user.image = normalizedPath.startsWith("/uploads/")
        ? normalizedPath
        : `/${normalizedPath}`;
    }

    const updatedUser = await user.save();

    // ✅ Return updated user info for instant frontend update
    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        image: updatedUser.image ? `${BASE_URL}${updatedUser.image}` : null,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("❌ Update Own Profile Error:", error.message);
    res.status(500).json({ message: "Error updating profile" });
  }
};

/* 👤 GET CURRENT USER (/api/users/me) */
export const getUserByIdMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      image: user.image ? `${BASE_URL}${user.image}` : null,
    });
  } catch (error) {
    console.error("❌ Get Current User Error:", error.message);
    res.status(500).json({ message: "Error fetching current user" });
  }
};

/* 👥 GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const usersWithImages = users.map((u) => ({
      ...u._doc,
      image: u.image ? `${BASE_URL}${u.image}` : null,
    }));
    res.status(200).json(usersWithImages);
  } catch (error) {
    console.error("❌ Get Users Error:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};

/* 👤 GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      ...user._doc,
      image: user.image ? `${BASE_URL}${user.image}` : null,
    });
  } catch (error) {
    console.error("❌ Get User By ID Error:", error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
};

/* 🗑️ DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    deleteImageIfExists(user.image);
    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete User Error:", error.message);
    res.status(500).json({ message: "Error deleting user" });
  }
};
