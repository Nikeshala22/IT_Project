// Instead of `const express = require('express');`
import express from 'express';
import { validateSparePart } from '../middleware/validateSpareParts.js';
import { addSparePart, deleteSparePart, getAllSpareParts, getSparePartById, updateSparePart } from '../controllers/admin/inventryController.js';
import upload from '../middleware/multer.js';
const router = express.Router();

// Define routes
router.get("/get-all-spareparts",upload.single('image'), getAllSpareParts);         // 🟢 View all spare parts
router.get("/view-all-spareparts/:id", getSparePartById);      // 🟢 View single spare part
router.post("/add-spareparts", validateSparePart, addSparePart);  // 🟢 Add a new spare part with validation
router.put("/update-spareparts/:id", validateSparePart, updateSparePart); // 🟢 Update spare part with validation
router.delete("/delete-spareparts/:id", deleteSparePart);    // 🟢 Delete spare part

export default router;
