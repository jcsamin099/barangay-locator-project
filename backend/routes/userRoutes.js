import express from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
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

const router = express.Router();

// 🔑 Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// 🏘 Residents and Admins (place these BEFORE the dynamic /:id routes)
router.get("/role/residents", getAllResidents);
router.get("/role/admins", getAllAdmins);
router.put("/residents/:id", updateResident);
router.delete("/residents/:id", deleteResident);

// 👥 Users
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
