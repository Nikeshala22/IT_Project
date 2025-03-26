import express from 'express';
import { 
  getAllParts, 
  getPartById, 
  createPart, 
  updatePart, 
  deletePart 
} from '../controllers/SPartController.js';

const router = express.Router();

// GET all spare parts
router.get('/', getAllParts);

// GET a single spare part by ID
router.get('/:id', getPartById);

// POST a new spare part
router.post('/', createPart);

// PUT/UPDATE a spare part
router.put('/:id', updatePart);

// DELETE a spare part
router.delete('/:id', deletePart);

export default router;
