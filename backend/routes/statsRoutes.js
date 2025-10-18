import express from "express";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @desc    Get dashboard stats
 * @route   GET /api/stats
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    // Count total users by role
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Count online users by role
    const onlineResidents = await User.countDocuments({
      role: "resident",
      isOnline: true,
    });
    const onlineAdmins = await User.countDocuments({
      role: "admin",
      isOnline: true,
    });

    // Include current logged-in user details
    const currentUser = req.user
      ? {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          isOnline: req.user.isOnline,
        }
      : null;

    // Send stats as JSON
    res.json({
      totalResidents,
      totalAdmins,
      onlineResidents,
      onlineAdmins,
      currentUser,
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ message: "Server error fetching stats" });
  }
});

export default router;
