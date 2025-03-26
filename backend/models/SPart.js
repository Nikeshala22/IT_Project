import mongoose from 'mongoose';

const SPartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  details: { type: String, required: true },
  image: { type: String, required: true }
});

const SPart = mongoose.model('SPart', SPartSchema);

export default SPart;
