import mongoose from "mongoose";

const barangaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  municipality: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
}, { timestamps: true });

const Barangay = mongoose.model("Barangay", barangaySchema);

export default Barangay;
