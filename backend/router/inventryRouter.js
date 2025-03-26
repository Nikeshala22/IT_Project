// Instead of `const express = require('express');`
import express from 'express';
import { validateSparePart } from '../middleware/validateSpareParts.js';
import { addSparePart, deleteSparePart, getAllSpareParts, getSparePartById, updateSparePart } from '../controllers/admin/inventryController.js';
import upload from '../middleware/multer.js';
const inventoryRouter = express.Router();

// Define routes
inventoryRouter.get("/get-all-spareparts", getAllSpareParts);         // 🟢 View all spare parts
inventoryRouter.get("/view-sparepart/:id", getSparePartById);      // 🟢 View single spare part
inventoryRouter.post("/add-spareparts",upload.single('image'),validateSparePart,addSparePart);  // 🟢 Add a new spare part with validation
inventoryRouter.patch("/update-spareparts/:id",upload.single('image'),validateSparePart, updateSparePart); // 🟢 Update spare part with validation
inventoryRouter.delete("/delete-spareparts/:id", deleteSparePart);    // 🟢 Delete spare part

export default inventoryRouter;
