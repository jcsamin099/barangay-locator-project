import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

// ✅ GET all residents
router.get("/residents", async (req, res) => {
  try {
    const residents = await User.find({ role: "resident" }).select("-password");
    res.json(residents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET total counts
router.get("/stats", async (req, res) => {
  try {
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const onlineResidents = await User.countDocuments({ role: "resident", online: true });
    const onlineAdmins = await User.countDocuments({ role: "admin", online: true });

    res.status(200).json({
      totalResidents,
      totalAdmins,
      onlineResidents,
      onlineAdmins,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;
