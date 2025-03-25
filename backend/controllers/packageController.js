import ServicePackage from "../models/servicepackagesModel.js";
import { v2 as cloudinary } from "cloudinary";


const getAllServicePackages = async (req, res) => {
    try {
        const servicePackages = await ServicePackage.find();
        res.status(200).json(servicePackages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getServicePackageById = async (req, res) => {
    try {
        const { id } = req.params;
        const servicePackage = await ServicePackage.findById(id);
        if (!servicePackage) return res.status(404).json({ message: "Service package not found" });
        res.status(200).json(servicePackage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addServicePackage = async (req, res) => {
    try {
        const { name, description, includes, valueAdditions, price } = req.body;
        const imageFile = req.file;

        
        let imageUrl = null;
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        
        const includesArray = Array.isArray(includes) ? includes : [];
        const valueAdditionsArray = Array.isArray(valueAdditions) ? valueAdditions : [];

        
        const servicePackage = new ServicePackage({
            name,
            description,
            includes: includesArray,
            valueAdditions: valueAdditionsArray,
            price,
            images: imageUrl
        });

        await servicePackage.save();
        res.status(201).json({ success: true, servicePackage });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateServicePackage = async (req, res) => {
    try {
        const { id } = req.params;

        
        let imageUrl;
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        
        const includesArray = Array.isArray(req.body.includes) ? req.body.includes : [];
        const valueAdditionsArray = Array.isArray(req.body.valueAdditions) ? req.body.valueAdditions : [];

        
        const updatedData = {
            name: req.body.name,
            description: req.body.description,
            includes: includesArray,
            valueAdditions: valueAdditionsArray,
            price: req.body.price,
            ...(imageUrl && { images: imageUrl }) 
        };

        
        const updatedServicePackage = await ServicePackage.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedServicePackage) {
            return res.status(404).json({ message: "Service package not found" });
        }

        res.status(200).json(updatedServicePackage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteServicePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedServicePackage = await ServicePackage.findByIdAndDelete(id);
        if (!deletedServicePackage) return res.status(404).json({ message: "Service package not found" });
        res.status(200).json({ message: "Service package deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getAllServicePackages,
    getServicePackageById,
    addServicePackage,
    updateServicePackage,
    deleteServicePackage
};