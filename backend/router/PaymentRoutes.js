import express from 'express';
import { processPayment, getPaymentStatus, getAllPayments, deletePayment } from '../controllers/payment/PaymentController.js';

const paymentRouter = express.Router();

paymentRouter.get('/', getAllPayments);
paymentRouter.post('/process', processPayment);
paymentRouter.get('/:orderId', getPaymentStatus);
paymentRouter.delete('/:orderId', deletePayment);

export default paymentRouter;