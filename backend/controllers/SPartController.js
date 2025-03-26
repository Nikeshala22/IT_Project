import SPart from '../models/SPart.js';

// Get all spare parts
export const getAllParts = async (req, res) => {
  try {
    const parts = await SPart.find();
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single spare part by ID
export const getPartById = async (req, res) => {
  try {
    const part = await SPart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    res.status(200).json(part);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new spare part
export const createPart = async (req, res) => {
  try {
    const newPart = new SPart(req.body);
    const savedPart = await newPart.save();
    res.status(201).json(savedPart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a spare part
export const updatePart = async (req, res) => {
  try {
    const updatedPart = await SPart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedPart) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    
    res.status(200).json(updatedPart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a spare part
export const deletePart = async (req, res) => {
  try {
    const part = await SPart.findByIdAndDelete(req.params.id);
    
    if (!part) {
      return res.status(404).json({ message: 'Spare part not found' });
    }
    
    res.status(200).json({ message: 'Spare part deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
