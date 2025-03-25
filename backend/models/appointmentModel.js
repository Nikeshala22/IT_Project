import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  AID: { type: String, required: true, unique: true },
  Aname: { type: String, required: true },
  Aphone: { type: String, required: true },
  AregID: { type: String, required: true },
  Avtype: { type: String, required: true },
  Avnum: { type: String, required: true },
  service: { type: [String], required: true },
  comment: { type: String, required: false },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

// Use ES Module export
export default mongoose.model("Appointment", AppointmentSchema);
