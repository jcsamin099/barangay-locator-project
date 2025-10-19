import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  getAllResidents,
  getAllAdmins, // 👈 added this
  updateResident,
  deleteResident,
} from "../controllers/userController.js";

const router = express.Router();

// 🧍 Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); // 👈 new endpoint

// 👥 Users
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// 🏘 Residents
router.get("/role/residents", getAllResidents);
router.put("/residents/:id", updateResident);
router.delete("/residents/:id", deleteResident);

// 👨‍💼 Admins
router.get("/role/admins", getAllAdmins); // 👈 new route

export default router;
