import { body, validationResult } from 'express-validator';

// Valid time slots (matching client-side options)
const validTimeSlots = [
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];

// Valid service options (matching client-side options)
const validServices = [
  'Wash and Grooming',
  'Under carriage Degreasing',
  'Hybrid Services',
  'Lube Services',
  'Windscreen Treatments',
  'Wheel Alignment',
  'Exterior & Interior Detailing',
  'Inspection Reports',
  'Battery Services',
  'Mechanical Detailing',
  'Body Shop',
];

// Validation for creating appointments (POST)
export const validateAppointmentCreate = [
  body('AID').notEmpty().withMessage('Appointment ID is required').trim(),
  body('Aname')
    .notEmpty()
    .withMessage('Full name is required')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name must contain only letters and spaces')
    .trim(),
  body('Aphone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+94\d{9}$/)
    .withMessage('Phone number must be in format +94 followed by 9 digits (e.g., +94769400272)')
    .custom((value) => {
      const digits = value.slice(3); // Remove +94
      const firstDigit = digits[0];
      const secondDigit = digits[1];
      const validSecondDigits = ['0', '1', '2', '4', '5', '6', '7', '8'];
      if (firstDigit !== '7' || !validSecondDigits.includes(secondDigit)) {
        throw new Error('Phone number must start with +947 and have a valid second digit (0,1,2,4,5,6,7,8)');
      }
      return true;
    }),
  body('AregID').notEmpty().withMessage('Registration ID is required').trim(),
  body('Avtype')
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isIn([
      'Toyota',
      'Honda',
      'BMW',
      'Mercedes-Benz',
      'Audi',
      'Volkswagen',
      'Ford',
      'Hyundai',
      'Kia',
      'Nissan',
      'Porsche',
      'Tesla',
      'Chevrolet',
      'Mazda',
      'Subaru',
      'Lexus',
      'Jaguar',
      'Land Rover',
      'Volvo',
      'Mitsubishi',
      'Other',
    ])
    .withMessage('Invalid vehicle type')
    .trim(),
  body('Avnum')
    .notEmpty()
    .withMessage('Vehicle number is required')
    .matches(/^[A-Z]{2,3}\s\d{4}$/)
    .withMessage('Vehicle number must be 2-3 uppercase letters followed by a space and 4 digits (e.g., AB 1234 or ABC 1234)')
    .trim(),
  body('service')
    .isArray({ min: 1 })
    .withMessage('At least one service is required')
    .custom((services) => {
      if (!services.every((service) => validServices.includes(service))) {
        throw new Error('Invalid service selected');
      }
      return true;
    }),
  body('comment')
    .optional()
    .isString()
    .withMessage('Comment must be a valid string')
    .trim(),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format (Use YYYY-MM-DD)')
    .custom((value) => {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      if (selectedDate < tomorrow) {
        throw new Error('Date must be tomorrow or later');
      }
      return true;
    }),
  body('time')
    .notEmpty()
    .withMessage('Time is required')
    .isIn(validTimeSlots)
    .withMessage('Invalid time slot. Must be one of the predefined time slots (e.g., 8:00 AM - 9:00 AM)'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

// Validation for updating appointments (PATCH)
export const validateAppointmentUpdate = [
  body('AID')
    .optional()
    .notEmpty()
    .withMessage('Appointment ID cannot be empty if provided')
    .trim(),
  body('Aname')
    .optional()
    .notEmpty()
    .withMessage('Full name cannot be empty if provided')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name must contain only letters and spaces')
    .trim(),
  body('Aphone')
    .optional()
    .notEmpty()
    .withMessage('Phone number cannot be empty if provided')
    .matches(/^\+94\d{9}$/)
    .withMessage('Phone number must be in format +94 followed by 9 digits (e.g., +94769400272)')
    .custom((value) => {
      const digits = value.slice(3); // Remove +94
      const firstDigit = digits[0];
      const secondDigit = digits[1];
      const validSecondDigits = ['0', '1', '2', '4', '5', '6', '7', '8'];
      if (firstDigit !== '7' || !validSecondDigits.includes(secondDigit)) {
        throw new Error('Phone number must start with +947 and have a valid second digit (0,1,2,4,5,6,7,8)');
      }
      return true;
    }),
  body('AregID')
    .optional()
    .notEmpty()
    .withMessage('Registration ID cannot be empty if provided')
    .trim(),
  body('Avtype')
    .optional()
    .notEmpty()
    .withMessage('Vehicle type cannot be empty if provided')
    .isIn([
      'Toyota',
      'Honda',
      'BMW',
      'Mercedes-Benz',
      'Audi',
      'Volkswagen',
      'Ford',
      'Hyundai',
      'Kia',
      'Nissan',
      'Porsche',
      'Tesla',
      'Chevrolet',
      'Mazda',
      'Subaru',
      'Lexus',
      'Jaguar',
      'Land Rover',
      'Volvo',
      'Mitsubishi',
      'Other',
    ])
    .withMessage('Invalid vehicle type')
    .trim(),
  body('Avnum')
    .optional()
    .notEmpty()
    .withMessage('Vehicle number cannot be empty if provided')
    .matches(/^[A-Z]{2,3}\s\d{4}$/)
    .withMessage('Vehicle number must be 2-3 uppercase letters followed by a space and 4 digits (e.g., AB 1234 or ABC 1234)')
    .trim(),
  body('service')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Service must be an array with at least one item if provided')
    .custom((services) => {
      if (!services.every((service) => validServices.includes(service))) {
        throw new Error('Invalid service selected');
      }
      return true;
    }),
  body('comment')
    .optional()
    .isString()
    .withMessage('Comment must be a valid string')
    .trim(),
  body('date')
    .optional()
    .notEmpty()
    .withMessage('Date cannot be empty if provided')
    .isISO8601()
    .withMessage('Invalid date format (Use YYYY-MM-DD)')
    .custom((value) => {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      if (selectedDate < tomorrow) {
        throw new Error('Date must be tomorrow or later');
      }
      return true;
    }),
  body('time')
    .optional()
    .notEmpty()
    .withMessage('Time cannot be empty if provided')
    .isIn(validTimeSlots)
    .withMessage('Invalid time slot. Must be one of the predefined time slots (e.g., 8:00 AM - 9:00 AM)'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];