// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import connectDB from './config/mongoDb.js';
import connectCloudinary from './config/cloudinary.js';
import inventoryRouter from './router/inventryRouter.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

//connect everything
connectDB();
connectCloudinary();

//middleware
app.use(cors());
app.use(express.json());
// Add this middleware before your routes
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
});


app.use('/api/inventory', inventoryRouter);




// Add error handling middleware before static files
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Then serve static files and catch-all
app.use(express.static(join(__dirname, '../client/build')));
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
