import InventoryModel from "../../models/inventryModel.js";
import { v2 as cloudinary } from 'cloudinary';
import PdfPrinter from 'pdfmake';
import path from 'path';
import axios from 'axios';



//Get all spare parts
// Get all spare parts
const getAllSpareParts = async (req, res) => {
    try {
        const spareParts = await InventoryModel.find();
        res.status(200).json({
            success: true,
            spareParts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

//Get a single spare part by ID
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
        const { name, brand, modelNumber, quantity, price, color } = req.body;

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

        if (!imageUrl) {
            return res.status(404).json({ success: false, message: "image url is not obtained!" })
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


//Update a spare part
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

//Delete a spare part
const deleteSparePart = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSparePart = await InventoryModel.findByIdAndDelete(id);
        if (!deletedSparePart) return res.status(404).json({
            success: false,
            message: "Spare part not found"
        });

        res.status(200).json({
            success: true,
            message: "Spare part deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get total spare parts count
const getTotalSparePartsCount = async (req, res) => {
    try {
        const count = await InventoryModel.countDocuments();
        res.status(200).json({
            success: true,
            totalCount: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get total inventory value
const getTotalInventoryValue = async (req, res) => {
    try {
        const result = await InventoryModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            totalValue: result[0]?.totalValue || 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// 1. Setup fonts and printer
// 1. Use Helvetica font (no files needed)
const fonts = {
    Helvetica: {
      normal: 'Helvetica',
      bold: 'Helvetica-Bold',
      italics: 'Helvetica-Oblique',
      bolditalics: 'Helvetica-BoldOblique'
    }
  };
  const printer = new PdfPrinter(fonts);
  
  // 2. Helper for image to base64
  async function getBase64ImageFromUrl(imageUrl) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const mimeType = imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg';
      return `data:${mimeType};base64,${base64}`;
    } catch (err) {
        console.error('Image fetch failed:', imageUrl, err.message);
      return null;
    }
  }
  
  // 3. PDF export function
  const exportInventoryPDF = async (req, res) => {
    try {
      const spareParts = await InventoryModel.find().lean();
  
      const imageBase64Arr = await Promise.all(
        spareParts.map(async (part) => {
          if (part.image) {
            const base64 = await getBase64ImageFromUrl(part.image);
            if (base64) return { image: base64, width: 50, height: 50 };
          }
          return { text: 'No Image', style: 'imagePlaceholder', width: 50, height: 50 };
        })
      );
  
      const body = spareParts.map((part, idx) => [
        imageBase64Arr[idx],
        part.name,
        part.brand,
        part.modelNumber,
        part.quantity,
        `$${part.price.toFixed(2)}`,
        part.color,
        part.dimensions?.length || '',
        part.dimensions?.width || '',
        part.dimensions?.height || ''
      ]);
  
      const tableBody = [
        ['Image', 'Name', 'Brand', 'Model', 'Stock', 'Price', 'Color', 'Length', 'Width', 'Height'],
        ...body
      ];
  
      const docDefinition = {
        defaultStyle: { font: 'Helvetica' }, // <--- use Helvetica
        pageOrientation: 'landscape',
        content: [
          { text: 'Spare Parts Inventory Report', style: 'header' },
          { text: new Date().toLocaleDateString(), style: 'subheader' },
          {
            table: {
              headerRows: 1,
              widths: [60, '*', '*', '*', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
              body: tableBody
            }
          }
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          subheader: { fontSize: 12, margin: [0, 0, 0, 10] },
          imagePlaceholder: { color: '#999', italics: true, alignment: 'center' }
        }
      };
  
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory_report.pdf"');
  
      pdfDoc.pipe(res);
      pdfDoc.end();
  
    } catch (error) {
      console.error('PDF Export Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate PDF report'
      });
    }
  };
  
export {
    getAllSpareParts,
    getSparePartById,
    addSparePart,
    updateSparePart,
    deleteSparePart,
    getTotalInventoryValue,
    getTotalSparePartsCount,
    exportInventoryPDF,
}