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

// Everyone
router.get("/", getBarangays);
router.get("/:id", getBarangayById);
router.get("/name/:name", getBarangayByName);

// Admin only
router.post("/", createBarangay);
router.put("/:id", updateBarangay);
router.delete("/:id", deleteBarangay);

export default router;
