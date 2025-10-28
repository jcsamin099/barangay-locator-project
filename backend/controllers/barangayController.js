// controllers/barangayController.js
import Barangay from "../models/barangayModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 🔐 Verify admin with proper error throwing
const verifyAdmin = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, no token");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Access denied: Admins only");

  console.log(`✅ Admin verified: ${user.name}`);
  return user;
};

// ✅ CREATE
export const createBarangay = async (req, res) => {
  console.log("📥 Create request:", req.body);

  try {
    await verifyAdmin(req);

    const { name, municipality, province, latitude, longitude, embedLink } = req.body;

    if (!name || !municipality || !province) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingBarangay = await Barangay.findOne({ name });
    if (existingBarangay) {
      return res.status(400).json({ message: "Barangay already exists" });
    }

    const barangay = new Barangay({
      name,
      municipality,
      province,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      embedLink,
    });

    const createdBarangay = await barangay.save();
    console.log("✅ Barangay created:", createdBarangay.name);
    res.status(201).json(createdBarangay);
  } catch (error) {
    console.error("🔥 Error creating barangay:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ✅ READ ALL
export const getBarangays = async (req, res) => {
  try {
    const barangays = await Barangay.find();
    res.json(barangays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ READ ONE by ID
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

// ✅ READ ONE by NAME
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

// ✅ UPDATE
export const updateBarangay = async (req, res) => {
  try {
    await verifyAdmin(req);
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay) return res.status(404).json({ message: "Barangay not found" });

    const { name, municipality, province, latitude, longitude, embedLink } = req.body;

    barangay.name = name || barangay.name;
    barangay.municipality = municipality || barangay.municipality;
    barangay.province = province || barangay.province;
    barangay.latitude = latitude ? Number(latitude) : barangay.latitude;
    barangay.longitude = longitude ? Number(longitude) : barangay.longitude;
    barangay.embedLink = embedLink || barangay.embedLink;

    const updated = await barangay.save();
    console.log("✅ Barangay updated:", updated.name);
    res.json(updated);
  } catch (error) {
    console.error("🔥 Error updating barangay:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ✅ DELETE
export const deleteBarangay = async (req, res) => {
  try {
    await verifyAdmin(req);
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay) return res.status(404).json({ message: "Barangay not found" });

    await barangay.deleteOne();
    console.log("🗑️ Barangay deleted:", barangay.name);
    res.json({ message: "Barangay deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting barangay:", error.message);
    res.status(500).json({ message: error.message });
  }
};
