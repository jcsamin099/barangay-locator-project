import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import barangayRoutes from "./routes/barangayRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS Configuration — allow frontend & local dev
app.use(
  cors({
    origin: [
      "https://barangay-locator-bjab.vercel.app", // ✅ your deployed frontend
      "http://localhost:5173", // ✅ local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ Serve uploaded files (if any)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/barangays", barangayRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stats", statsRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🌍 Barangay Locator API is running successfully!");
});

// ✅ Error Handler (keep this last)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
