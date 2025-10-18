import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getAllResidents,
  updateResident,
  deleteResident,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧑‍💻 Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// 👤 User management
router.put("/update/:id", protect, updateUser);
router.get("/", protect, getAllUsers);
router.get("/:id", protect, getUserById);
router.delete("/:id", protect, adminOnly, deleteUser);

// 🏘️ Residents (Admin only)
router.get("/admin/residents", protect, adminOnly, getAllResidents);
router.put("/admin/residents/:id", protect, adminOnly, updateResident);
router.delete("/admin/residents/:id", protect, adminOnly, deleteResident);

export default router;
