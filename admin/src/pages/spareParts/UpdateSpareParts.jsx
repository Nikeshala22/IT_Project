import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import { InventoryContext } from "../../context/adminSparePartsContext/InventoryContext";
import { toast } from 'react-toastify'
import { assets } from "../../assets/assets";

const UpdateSparePart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { spareParts, updateSparePart } = useContext(InventoryContext);
  const [part, setPart] = useState(null);
  const [partImg, setPartImg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    modelNumber: '',
    quantity: '',
    price: '',
    color: '#000000',
    dimensions: { length: '', width: '', height: '' }
  });

  useEffect(() => {
    const existingPart = spareParts.find(p => p._id === id);
    if (existingPart) {
      setPart(existingPart);
      setFormData({
        name: existingPart.name,
        brand: existingPart.brand,
        modelNumber: existingPart.modelNumber,
        quantity: existingPart.quantity,
        price: existingPart.price,
        color: existingPart.color,
        dimensions: { 
          length: existingPart.dimensions.length,
          width: existingPart.dimensions.width,
          height: existingPart.dimensions.height
        }
      });
    }
  }, [id, spareParts]);

  const handleDimensionChange = (dimension, value) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      if (partImg) formPayload.append('image', partImg);
      formPayload.append('name', formData.name);
      formPayload.append('brand', formData.brand);
      formPayload.append('modelNumber', formData.modelNumber);
      formPayload.append('quantity', formData.quantity);
      formPayload.append('price', formData.price);
      formPayload.append('color', formData.color);
      formPayload.append('dimensions.length', formData.dimensions.length);
      formPayload.append('dimensions.width', formData.dimensions.width);
      formPayload.append('dimensions.height', formData.dimensions.height);

      await updateSparePart(id, formPayload);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!part) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full m-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Spare Part</h2>
      </div>

      <div className="bg-white px-8 py-8 border rounded-lg w-full max-w-4xl shadow-sm">
        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="part-img" className="cursor-pointer group relative">
            <img 
              src={partImg ? URL.createObjectURL(partImg) : part.image || assets.upload_area} 
              className="w-32 h-32 object-contain rounded-lg border-2 border-dashed border-gray-200 p-1"
              alt="Part preview" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input 
              type="file" 
              id="part-img" 
              onChange={(e) => setPartImg(e.target.files[0])} 
              className="hidden" 
              accept="image/*"
            />
          </label>
          <div>
            <p className="text-sm text-gray-500">Click image to update</p>
            {partImg && (
              <button
                type="button"
                onClick={() => setPartImg(null)}
                className="text-red-600 text-sm mt-2 hover:text-red-700"
              >
                Remove New Image
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Name *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Number *</label>
              <input
                value={formData.modelNumber}
                onChange={(e) => setFormData({...formData, modelNumber: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <fieldset className="border border-gray-200 p-4 rounded-lg">
              <legend className="text-sm font-medium text-gray-700 px-2">Dimensions (cm) *</legend>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Length</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Width</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Height</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">
                  {formData.color.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Update Part
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateSparePart;