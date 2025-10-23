import express from "express";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get dashboard statistics
router.get("/", protect, async (req, res) => {
  try {
    // Get totals
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Get online counts
    const onlineResidents = await User.countDocuments({
      role: "resident",
      status: "online",
    });
    const onlineAdmins = await User.countDocuments({
      role: "admin",
      status: "online",
    });

    // Make sure the current user stays online
    const currentUser = await User.findById(req.user._id);
    if (currentUser) {
      if (currentUser.status !== "online") {
        currentUser.status = "online";
        await currentUser.save();
      }
    }

    res.json({
      totalResidents,
      totalAdmins,
      onlineResidents,
      onlineAdmins,
      currentUser: currentUser
        ? {
            id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            status: currentUser.status,
          }
        : null,
    });
  } catch (error) {
    console.error("Stats Error:", error.message);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;
