// routes/barangayRoutes.js
import express from "express";
import {
  createBarangay,
  getBarangays,
  getBarangayById,
  getBarangayByName,
  updateBarangay,
  deleteBarangay,
} from "../controllers/barangayController.js";

const router = express.Router();

// 🟢 Everyone can view barangays
router.get("/", getBarangays);
router.get("/name/:name", getBarangayByName); // ✅ must come before `/:id`
router.get("/:id", getBarangayById);

// 🔒 Admin-only routes
router.post("/", createBarangay);
router.put("/:id", updateBarangay);
router.delete("/:id", deleteBarangay);

export default router;
