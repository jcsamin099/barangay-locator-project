import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔑 Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret_key", {
    expiresIn: "30d",
  });
};

//  Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "resident",
      status: "offline",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // ✅ Set user online
    user.status = "online";
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🚪 Logout User (set offline)
export const logoutUser = async (req, res) => {
  try {
    const { id } = req.body; // expects userId
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = "offline";
    await user.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update User Info
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👥 Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Get User by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete User (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏘️ Get All Residents (Admin only)
export const getAllResidents = async (req, res) => {
  try {
    const residents = await User.find({ role: "resident" }).select("-password");
    res.status(200).json(residents);
  } catch (error) {
    console.error("Error fetching residents:", error);
    res.status(500).json({ message: "Error fetching residents" });
  }
};

// 👨‍💼 Get All Admins (Admin only)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

// 🧾 Update Resident Info (Admin only)
export const updateResident = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

    try {
      const resident = await User.findById(id);
      if (!resident)
        return res.status(404).json({ message: "Resident not found" });

      resident.name = name || resident.name;
      resident.email = email || resident.email;

      const updatedResident = await resident.save();
      res.json({
        message: "Resident updated successfully",
        resident: updatedResident,
      });
    } catch (error) {
      console.error("Error updating resident:", error);
      res.status(500).json({ message: "Error updating resident" });
    }
};

// ❌ Delete Resident (Admin only)
export const deleteResident = async (req, res) => {
  const { id } = req.params;

  try {
    const resident = await User.findById(id);
    if (!resident)
      return res.status(404).json({ message: "Resident not found" });

    await resident.deleteOne();
    res.json({ message: "Resident deleted successfully" });
  } catch (error) {
    console.error("Error deleting resident:", error);
    res.status(500).json({ message: "Error deleting resident" });
  }
};
