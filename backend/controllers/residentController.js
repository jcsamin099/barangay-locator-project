import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// 🏘️ GET ALL RESIDENTS
export const getAllResidents = async (req, res) => {
  try {
    const residents = await User.find({ role: "resident" }).select("-password");
    res.status(200).json(residents);
  } catch (error) {
    console.error("Get Residents Error:", error.message);
    res.status(500).json({ message: "Error fetching residents" });
  }
};

// 👨‍💼 GET ALL ADMINS
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Get Admins Error:", error.message);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// 🧾 UPDATE RESIDENT (Admin only)
export const updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const resident = await User.findById(id);
    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    if (name && name.trim() !== "") resident.name = name.trim();
    if (email && email.trim() !== "") resident.email = email.trim();
    if (password && password.trim() !== "")
      resident.password = await bcrypt.hash(password, 10);

    const updatedResident = await resident.save();

    res.status(200).json({
      message: "Resident updated successfully",
      resident: {
        _id: updatedResident._id,
        name: updatedResident.name,
        email: updatedResident.email,
        role: updatedResident.role,
      },
    });
  } catch (error) {
    console.error("Update Resident Error:", error.message);
    res.status(500).json({ message: "Error updating resident" });
  }
};

// ❌ DELETE RESIDENT
export const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;
    const resident = await User.findById(id);
    if (!resident)
      return res.status(404).json({ message: "Resident not found" });

    await resident.deleteOne();
    res.status(200).json({ message: "Resident deleted successfully" });
  } catch (error) {
    console.error("Delete Resident Error:", error.message);
    res.status(500).json({ message: "Error deleting resident" });
  }
};
