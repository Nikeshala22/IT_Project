// Instead of `const express = require('express');`
import express from 'express';
import { validateSparePart } from '../middleware/validateSpareParts.js';
import { addSparePart, deleteSparePart, getAllSpareParts, getSparePartById, updateSparePart } from '../controllers/admin/inventryController.js';
import upload from '../middleware/multer.js';
const inventoryRouter = express.Router();

// Define routes
inventoryRouter.get("/get-all-spareparts", getAllSpareParts);        
inventoryRouter.get("/view-sparepart/:id", getSparePartById);      
inventoryRouter.post("/add-spareparts",upload.single('image'),validateSparePart,addSparePart);  
inventoryRouter.patch("/update-spareparts/:id",upload.single('image'),validateSparePart, updateSparePart); 
inventoryRouter.delete("/delete-spareparts/:id", deleteSparePart);    

export default inventoryRouter;
