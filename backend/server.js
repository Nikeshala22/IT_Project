import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongoDb.js';
import connectCloudinary from './config/cloudinary.js';
import inventoryRouter from './router/inventryRouter.js';
import authRouter from './router/authRoutes.js';
import userRouter from './router/userRouter.js';
import appointmentRouter from './router/appointmentRouter.js';
import servicePackageRouter from './router/servicepackageRouter.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// CORS configuration: Allow all origins dynamically
const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // Allow requests with no origin (e.g. mobile apps or curl)
    if (!incomingOrigin) return callback(null, true);
    // Reflect the request origin
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// JSON headers
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8');
  next();
});

// API routes
app.use('/api/inventory', inventoryRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/appointment', appointmentRouter);
app.use('/api/service', servicePackageRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// // Serve static React build for production
// app.use(express.static(join(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname, '../client/build/index.html'));
// });

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
