// models/Barangay.js
import mongoose from "mongoose";

const barangaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    embedLink: {
      type: String,
      default: "", // 🆕 to store Google Maps embed iframe or URL
    },
  },
  { timestamps: true }
);

const Barangay = mongoose.model("Barangay", barangaySchema);

export default Barangay;
