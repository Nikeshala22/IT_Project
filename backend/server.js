import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './config/mongoDb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './router/userRouter.js';
import appointmentRouter from './router/appointmentRouter.js';
import inventoryRouter from './router/inventryRouter.js';
import servicePackageRouter from './router/servicepackageRouter.js';
import authRouter from './router/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect Database & Cloudinary
(async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log('✅ Database and Cloudinary connected');
  } catch (err) {
    console.error('❌ Failed to connect services', err);
    process.exit(1); // Stop server if connection fails
  }
})();

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Add PATCH
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Log CORS configuration for debugging (fixed origin)
app.use((req, res, next) => {
  console.log('CORS Headers Set:', {
    'Access-Control-Allow-Origin': 'http://localhost:5174',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/service', servicePackageRouter);

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '🚀 API working fine' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started on PORT: ${PORT}`);
});