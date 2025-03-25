import { body, validationResult } from "express-validator";

export const validateAppointment = [
    body("AID").notEmpty().withMessage("Appointment ID is required").trim(),
    body("Aname").notEmpty().withMessage("Appointment name is required").trim(),
    body("Aphone")
        .notEmpty().withMessage("Phone number is required")
        .isMobilePhone().withMessage("Invalid phone number"),
    body("AregID").notEmpty().withMessage("Registration ID is required").trim(),
    body("Avtype").notEmpty().withMessage("Vehicle type is required").trim(),
    body("Avnum").notEmpty().withMessage("Vehicle number is required").trim(),
    body("service")
        .isArray({ min: 1 }).withMessage("Service must be an array with at least one item"),
    body("comment")
        .optional()
        .isString().withMessage("Comment must be a valid string"),
    body("date")
        .notEmpty().withMessage("Date is required")
        .isISO8601().withMessage("Invalid date format (Use YYYY-MM-DD)"),
    body("time")
        .notEmpty().withMessage("Time is required")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Invalid time format (Use HH:MM)"),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
