import Barangay from "../models/barangayModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🔐 Middleware to verify admin
const verifyAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    return user;
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ CREATE (Admin only)
export const createBarangay = async (req, res) => {
  const user = await verifyAdmin(req, res);
  if (!user) return;

  try {
    const { name, municipality, province, latitude, longitude } = req.body;

    const existingBarangay = await Barangay.findOne({ name });
    if (existingBarangay) {
      return res.status(400).json({ message: "Barangay already exists" });
    }

    const barangay = new Barangay({
      name,
      municipality,
      province,
      latitude,
      longitude,
    });

    const createdBarangay = await barangay.save();
    res.status(201).json(createdBarangay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ READ ALL (Everyone)
export const getBarangays = async (req, res) => {
  try {
    const barangays = await Barangay.find();
    res.json(barangays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ ONE by ID (Everyone)
export const getBarangayById = async (req, res) => {
  try {
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }
    res.json(barangay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ ONE by NAME (Everyone)
export const getBarangayByName = async (req, res) => {
  try {
    const barangay = await Barangay.findOne({ name: req.params.name });
    if (!barangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }
    res.json(barangay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE (Admin only)
export const updateBarangay = async (req, res) => {
  const user = await verifyAdmin(req, res);
  if (!user) return;

  try {
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }

    barangay.name = req.body.name || barangay.name;
    barangay.municipality = req.body.municipality || barangay.municipality;
    barangay.province = req.body.province || barangay.province;
    barangay.latitude = req.body.latitude || barangay.latitude;
    barangay.longitude = req.body.longitude || barangay.longitude;

    const updatedBarangay = await barangay.save();
    res.json(updatedBarangay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ DELETE (Admin only)
export const deleteBarangay = async (req, res) => {
  const user = await verifyAdmin(req, res);
  if (!user) return;

  try {
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay) {
      return res.status(404).json({ message: "Barangay not found" });
    }

    await barangay.deleteOne();
    res.json({ message: "Barangay deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
