import { body, validationResult } from "express-validator";

// Validation Rules
export const validateSparePart = [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("brand").notEmpty().withMessage("Brand is required").trim(),
    body("modelNumber").notEmpty().withMessage("Model number is required").trim(),
    body("dimensions.length").isNumeric().withMessage("Length must be a number").toFloat(),
    body("dimensions.width").isNumeric().withMessage("Width must be a number").toFloat(),
    body("dimensions.height").isNumeric().withMessage("Height must be a number").toFloat(),
    body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a positive integer"),
    body("price").isNumeric().withMessage("Price must be a number").toFloat(),
    body("color").notEmpty().withMessage("Color is required").trim(),

    // Middleware to check validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
