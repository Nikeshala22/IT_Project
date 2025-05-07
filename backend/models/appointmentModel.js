import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  AID: { type: String, required: true },
  Aname: { type: String, required: true },
  Aphone: { type: String, required: true },
  AregID: { type: String, required: true },
  Avtype: { type: String, required: true },
  Avnum: { type: String, required: true },
  service: [{ type: String }],
  comment: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  approved: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;