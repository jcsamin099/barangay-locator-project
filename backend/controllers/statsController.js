import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getStats = async (req, res) => {
  try {
    // ✅ Verify token to get current user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");

    const currentUser = await User.findById(decoded.id).select("-password");

    // ✅ Count totals
    const totalResidents = await User.countDocuments({ role: "resident" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // ✅ Count online users
    const onlineResidents = await User.countDocuments({
      role: "resident",
      status: "online",
    });
    const onlineAdmins = await User.countDocuments({
      role: "admin",
      status: "online",
    });

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
            isOnline: currentUser.status === "online",
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
};
