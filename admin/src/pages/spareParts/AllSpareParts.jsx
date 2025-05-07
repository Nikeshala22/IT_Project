import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryContext } from '../../context/adminSparePartsContext/InventoryContext';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const AllSpareParts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { getAllSpareParts, spareParts } = useContext(InventoryContext);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        await getAllSpareParts();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch parts');
      } finally {
        setLoading(false);
      }
    };
    fetchSpareParts();
  }, []);

  const filteredParts = spareParts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Spare Parts Inventory</h2>
        <p className="text-gray-500 mt-1">{filteredParts.length} parts available</p>
      </div>

      {/* Search bar with icon */}
      <div className="mb-6 relative w-full md:w-1/2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by part name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map(part => (
          <div
            key={part._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100"
          >
            <div className="flex items-center justify-center mb-4">
              <img
                src={part.image || assets.upload_area}
                alt={part.name}
                className="h-40 w-40 object-contain rounded-lg"
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{part.name}</h3>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Brand:</span>
                <span className="text-sm font-medium text-gray-700">{part.brand}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Model:</span>
                <span className="text-sm font-medium text-gray-700">{part.modelNumber}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Stock:</span>
                <span
                  className={`text-sm font-medium ${
                    part.quantity < 5 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {part.quantity} units
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price:</span>
                <span className="text-sm font-medium text-blue-600">
                  ${part.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Dimensions:</span>
                <span className="text-sm font-medium text-gray-700">
                  {part.dimensions.length}x
                  {part.dimensions.width}x
                  {part.dimensions.height} cm
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: part.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {part.color.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredParts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No spare parts found in inventory</p>
        </div>
      )}
    </div>
  );
};

export default AllSpareParts;
