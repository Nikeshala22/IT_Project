import { Schema, model } from "mongoose";

const InventorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    modelNumber: {  // Changed to camelCase
        type: String,
        required: true,
        trim: true
    },
    dimensions: { // Grouping dimensions into an object
        length: { type: Number, required: true, min: 0 },
        width: { type: Number, required: true, min: 0 },
        height: { type: Number, required: true, min: 0 }
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number, // Changed to Number
        required: true,
        min: 0
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    image: { 
        type:String,
    }
}, { timestamps: true });

const InventoryModel = model("Inventory", InventorySchema);

export default InventoryModel;
