import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets";
import { InventoryContext } from "../../context/adminSparePartsContext/InventoryContext";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddSparePart = () => {
  const navigate = useNavigate();
  const [partImg, setPartImg] = useState(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('#000000');
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });

  const { addSparePart } = useContext(InventoryContext);

  const handleDimensionChange = (dimension, value) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!partImg) return toast.error("Image Not Selected!");

      const formData = new FormData();
      formData.append('image', partImg);
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('modelNumber', modelNumber);
      formData.append('quantity', Number(quantity));
      formData.append('price', Number(price));
      formData.append('color', color);
      formData.append('dimensions.length', dimensions.length);
      formData.append('dimensions.width', dimensions.width);
      formData.append('dimensions.height', dimensions.height);

      const result = await addSparePart(formData);
      if (result?.success) {
        toast.success("Spare part added!");
        setPartImg(null);
        setName('');
        setBrand('');
        setModelNumber('');
        setQuantity('');
        setPrice('');
        setColor('#000000');
        setDimensions({ length: '', width: '', height: '' });
      }
    } catch (error) {
      toast.error(error.message || "Error adding part");
      console.error(error);
    }
  };

  return (
    <div className="w-full m-5">
      {/* Add Spare Part Form */}
      <form onSubmit={onSubmitHandler} className=" bg-white px-8 py-8 border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <label
            htmlFor="part-img"
            className={`cursor-pointer group relative ${!partImg ? 'p-2 border-2 border-dashed rounded-lg hover:border-blue-600' : ''}`}
          >
            <img
              src={partImg ? URL.createObjectURL(partImg) : assets.upload_area}
              alt="Part preview"
              className={`w-32 h-32 object-contain ${!partImg ? 'opacity-50 group-hover:opacity-70' : ''}`}
            />
            {!partImg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-medium text-gray-500">Click to upload</span>
                <span className="text-xs text-gray-400">PNG, JPG up to 2MB</span>
              </div>
            )}
          </label>
          <input
            onChange={(e) => setPartImg(e.target.files[0])}
            type="file"
            id="part-img"
            className="hidden"
            accept="image/png, image/jpeg"
          />
          {partImg && (
            <button
              type="button"
              onClick={() => setPartImg(null)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove Image
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
              <input
                value={name}
                onChange={(e) => /^[a-zA-Z\s]*$/.test(e.target.value) && setName(e.target.value)}
                type="text"
                placeholder="Enter part name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                value={brand}
                onChange={(e) => /^[a-zA-Z\s]*$/.test(e.target.value) && setBrand(e.target.value)}
                type="text"
                placeholder="Enter brand name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Number *</label>
              <input
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                type="number"
                placeholder="Enter model number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition-all"
                required
              />
            </div>
            <fieldset className="border border-gray-200 p-4 rounded-lg">
              <legend className="text-sm font-medium text-gray-700 px-2">Dimensions (cm) *</legend>
              <div className="grid grid-cols-3 gap-4">
                {['length','width','height'].map(dimension => (
                  <div key={dimension}>
                    <label className="block text-xs text-gray-500 mb-1 capitalize">{dimension}</label>
                    <input
                      value={dimensions[dimension]}
                      onChange={(e) => handleDimensionChange(dimension, e.target.value)}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition-all"
                      required
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                placeholder="Enter quantity"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition-all"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                step="0.01"
                placeholder="Enter price"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 transition-all"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                  required
                />
                <span className="text-sm text-gray-500">Selected: {color.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:ring-2 focus:ring-blue-600 transition-colors shadow-sm"
          >
            Add Spare Part
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSparePart;
