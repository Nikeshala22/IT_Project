import mongoose from 'mongoose';

const ServicePackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    includes: {
        type: [String], 
        required: true
    },
    valueAdditions: {
        type: [String], 
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    images: { 
        type: String,
    }
});

const ServicePackage = mongoose.model("ServicePackage", ServicePackageSchema);

export default ServicePackage;
