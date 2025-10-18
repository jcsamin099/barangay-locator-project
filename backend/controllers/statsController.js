import User from "../models/userModel.js";

// ✅ This controller will return total + online counts
export const getStats = async (req, res) => {
  try {
    // Count all residents and admins
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Count all currently online users
    const onlineResidents = await User.countDocuments({ role: "resident", online: true });
    const onlineAdmins = await User.countDocuments({ role: "admin", online: true });

    // Send response to frontend
    res.json({
      totalResidents,
      totalAdmins,
      onlineResidents,
      onlineAdmins,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
};
