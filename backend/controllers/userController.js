import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

/* ✏️ UPDATE USER (Admin can update any user) */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name && name.trim() !== "") user.name = name.trim();
    if (email && email.trim() !== "") user.email = email.trim();
    if (password && password.trim() !== "")
      user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    res.status(500).json({ message: "Error updating user" });
  }
};

/* 👤 UPDATE OWN PROFILE (Admin self-account update) */
export const updateOwnProfile = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ safer (ensure compatibility)
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name && name.trim() !== "") user.name = name.trim();
    if (email && email.trim() !== "") user.email = email.trim();
    if (password && password.trim() !== "")
      user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Own Profile Error:", error.message);
    res.status(500).json({ message: "Error updating profile" });
  }
};

/* 👥 GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({ message: "Error fetching users" });
  }
};

/* 👤 GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error.message);
    res.status(500).json({ message: "Error fetching user" });
  }
};

/* 🗑️ DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Error deleting user" });
  }
};
