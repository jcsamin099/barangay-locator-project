import express from "express";
import {
  getAllUsers,
  getUserById,
  getUserByIdMe, // ✅ added new controller
  deleteUser,
  updateUser,
  updateOwnProfile, // 👈 added
} from "../controllers/userController.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import {
  getAllResidents,
  getAllAdmins,
  updateResident,
  deleteResident,
} from "../controllers/residentController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ protect routes
import upload from "../middleware/uploadMiddleware.js"; // ✅ new for image upload

const router = express.Router();

// 🔑 Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// 🏘 Residents and Admins
router.get("/role/residents", getAllResidents);
router.get("/role/admins", getAllAdmins);
router.put("/residents/:id", updateResident);
router.delete("/residents/:id", deleteResident);

// 👤 Admin self routes
router.get("/me", verifyToken, getUserByIdMe); // ✅ fetch own profile
router.put("/me", verifyToken, upload.single("image"), updateOwnProfile); // ✅ update own profile

// 👥 Users (Admin can manage others)
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", upload.single("image"), updateUser);
router.delete("/:id", deleteUser);

export default router;
