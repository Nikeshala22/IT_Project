import express from "express";
import {
    getAllAppointments,
    getAppointmentById,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    approveAppointment
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

// Route to get all appointments
appointmentRouter.get("/get-all-appointments", getAllAppointments);

// Route to get a single appointment by ID
appointmentRouter.get("/view-appointment/:id", getAppointmentById);

// Route to add a new appointment
appointmentRouter.post("/add-appointment", addAppointment);

// Route to update an appointment
appointmentRouter.patch("/update-appointment/:id", updateAppointment);

// Route to delete an appointment
appointmentRouter.delete("/delete-appointment/:id", deleteAppointment);

// Route to approve an appointment
appointmentRouter.patch("/approve-appointment/:id", approveAppointment);

export default appointmentRouter;