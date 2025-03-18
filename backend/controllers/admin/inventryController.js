import InventoryModel from "../../models/inventryModel";

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

        const { name , brand , modelNumber , dimensions , quantity , price, color} = req.body;

        const imageFile = req.file;

        if(!imageFile){
            return res.status(400).json({success:false,message:"Image is missing!"});
        }

        let imageUrl = null;
        if (imageFile) {
          const imageUpload = await cloudinary.uploader.upload(
            imageFile.path, {
            resource_type: "image",
          });
          imageUrl = imageUpload.secure_url;
        }

        const inventoryData = {

            name,
            brand,
            modelNumber,
            dimensions,
            quantity,
            price,
            color,
            image:imageUrl
        }


        const sparePart = new InventoryModel(inventoryData);
        await sparePart.save();
        res.status(201).json({success:true,sparePart});

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 🟢 Update a spare part
const updateSparePart = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSparePart = await InventoryModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedSparePart) return res.status(404).json({ message: "Spare part not found" });
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