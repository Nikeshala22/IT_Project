import express from 'express';
import {isAuthenticated, register, login, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/authUser.js';

// Create an instance of the Express Router
const authRouter = express.Router();

// Define your routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

// Export the router as the default export
export default authRouter;