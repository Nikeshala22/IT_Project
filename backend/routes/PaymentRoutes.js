import express from 'express';
import { processPayment, getPaymentStatus, getAllPayments, deletePayment } from '../controllers/PaymentController.js';

const router = express.Router();

/**
 * @route GET /api/payments
 * @desc Get all payments
 * @access Private (Admin only)
 */
router.get('/', getAllPayments);

/**
 * @route POST /api/payments/process
 * @desc Process payment for an order
 * @access Public
 */
router.post('/process', processPayment);

/**
 * @route GET /api/payments/:orderId
 * @desc Get payment status for an order
 * @access Public
 */
router.get('/:orderId', getPaymentStatus);

/**
 * @route DELETE /api/payments/:orderId
 * @desc Delete a payment record
 * @access Private (Admin only)
 */
router.delete('/:orderId', deletePayment);

export default router; 