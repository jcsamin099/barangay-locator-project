import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = express.Router();

/**
 * 📊 GET /api/stats
 * Returns total residents/admins, online users, and current logged-in user info
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    // 🧮 Count users by role
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // 🟢 Count online users
    const onlineResidents = await User.countDocuments({
      role: "resident",
      status: "online",
    });
    const onlineAdmins = await User.countDocuments({
      role: "admin",
      status: "online",
    });

    // 👤 Current user data (from token)
    const currentUser = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      status: req.user.status,
    };

    res.status(200).json({
      totalResidents,
      totalAdmins,
      onlineResidents,
      onlineAdmins,
      currentUser,
    });
  } catch (error) {
    console.error("Stats Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;
