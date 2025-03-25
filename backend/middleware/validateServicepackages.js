import { body, validationResult } from "express-validator";


export const validateServicePackage = [
    body("name").notEmpty().withMessage("Service package name is required").trim(),
    body("description").notEmpty().withMessage("Description is required").trim(),
    body("includes")
        .isArray({ min: 1 })
        .withMessage("Includes must be an array with at least one item"),
    body("valueAdditions")
        .optional()
        .isArray()
        .withMessage("Value additions must be an array"),
    body("price")
        .isNumeric()
        .withMessage("Price must be a valid number")
        .toFloat(),
    body("images")
        .optional()
        .isString()
        .withMessage("Image URL must be a valid string"),

   
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
