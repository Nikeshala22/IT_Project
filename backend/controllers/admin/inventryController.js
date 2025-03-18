import InventoryModel from "../../models/inventryModel.js";
import { v2 as cloudinary } from 'cloudinary'

// 🟢 Get all spare parts
const getAllSpareParts = async (req, res) => {
    try {
        const spareParts = await InventoryModel.find();
        res.status(200).json(spareParts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 🟢 Get a single spare part by ID
const getSparePartById = async (req, res) => {
    try {
        const { id } = req.params;
        const sparePart = await InventoryModel.findById(id);
        if (!sparePart) return res.status(404).json({ message: "Spare part not found" });
        res.status(200).json(sparePart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Add a new spare part (Validation applied in middleware)
const addSparePart = async (req, res) => {
    try {
        // Destructure required fields from the request body
        const { name, brand, modelNumber,quantity, price, color } = req.body;

        const dimensions = {
            length: parseFloat(req.body["dimensions.length"]),
            width: parseFloat(req.body["dimensions.width"]),
            height: parseFloat(req.body["dimensions.height"])
          };

        const imageFile = req.file;

        // Check if an image file is provided
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image is missing!" });
        }

        // Upload the image to Cloudinary
        let imageUrl = null;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(
                imageFile.path, { resource_type: "image" }
            );
            imageUrl = imageUpload.secure_url;
        }

        // Construct the data object for the inventory item
        const inventoryData = {
            name,
            brand,
            modelNumber,
            dimensions,
            quantity,
            price,
            color,
            image: imageUrl
        };

        // Create a new inventory item and save it
        const sparePart = new InventoryModel(inventoryData);
        await sparePart.save();
        res.status(201).json({ success: true, sparePart });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// 🟢 Update a spare part
const updateSparePart = async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ Parse & build the dimensions object (if provided as separate fields)
        //    If you're sending them like dimensions.length, dimensions.width, etc.
        const dimensions = {
            length: parseFloat(req.body["dimensions.length"]) || 0,
            width: parseFloat(req.body["dimensions.width"]) || 0,
            height: parseFloat(req.body["dimensions.height"]) || 0
        };

        // 2️⃣ Upload image to Cloudinary if file is provided
        let imageUrl;
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
            });
            imageUrl = imageUpload.secure_url;
        }

        // 3️⃣ Build updated data object
        //    We pull individual fields from req.body (so we don’t overwrite them with undefined).
        //    If an image was uploaded, we include its URL; otherwise we keep the old one.
        const updatedData = {
            name: req.body.name,
            brand: req.body.brand,
            modelNumber: req.body.modelNumber,
            dimensions,
            quantity: req.body.quantity,
            price: req.body.price,
            color: req.body.color,
            // If a new image was uploaded, set it; otherwise don't overwrite
            ...(imageUrl && { image: imageUrl })
        };

        // 4️⃣ Update the document in the DB
        const updatedSparePart = await InventoryModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedSparePart) {
            return res.status(404).json({ message: "Spare part not found" });
        }

        // 5️⃣ Respond with updated document
        res.status(200).json(updatedSparePart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 🟢 Delete a spare part
const deleteSparePart = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSparePart = await InventoryModel.findByIdAndDelete(id);
        if (!deletedSparePart) return res.status(404).json({ message: "Spare part not found" });
        res.status(200).json({ message: "Spare part deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
    getAllSpareParts ,
    getSparePartById,
    addSparePart,
    updateSparePart,
    deleteSparePart
}