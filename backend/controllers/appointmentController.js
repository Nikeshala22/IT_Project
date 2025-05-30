import Appointment from "../models/appointmentModel.js";

// Get all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get an appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new appointment
const addAppointment = async (req, res) => {
    try {
        const { AID, Aname, Aphone, AregID, Avtype, Avnum, service, comment, date, time } = req.body;

        const newAppointment = new Appointment({
            AID,
            Aname,
            Aphone,
            AregID,
            Avtype,
            Avnum,
            service: Array.isArray(service) ? service : [],
            comment,
            date,
            time,
            approved: false,
            deleted: false,
        });

        await newAppointment.save();
        res.status(201).json({ success: true, appointment: newAppointment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedData = {
            AID: req.body.AID,
            Aname: req.body.Aname,
            Aphone: req.body.Aphone,
            AregID: req.body.AregID,
            Avtype: req.body.Avtype,
            Avnum: req.body.Avnum,
            service: Array.isArray(req.body.service) ? req.body.service : [],
            comment: req.body.comment,
            date: req.body.date,
            time: req.body.time,
            approved: req.body.approved, // Allow updating approved status
            deleted: req.body.deleted,   // Allow updating deleted status
        };

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an appointment (mark as deleted)
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, { deleted: true }, { new: true });
        if (!updatedAppointment) return res.status(404).json({ message: "Appointment not found" });
        res.status(200).json({ message: "Appointment marked as deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve an appointment
const approveAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { approved } = req.body;

        const updatedAppointment = await Appointment.findByIdAndUpdate(id, { approved }, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment approved successfully", appointment: updatedAppointment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {
    getAllAppointments,
    getAppointmentById,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    approveAppointment
};