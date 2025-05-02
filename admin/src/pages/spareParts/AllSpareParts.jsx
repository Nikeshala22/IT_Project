import React, { useState, useEffect, useContext } from 'react'
import { InventoryContext } from '../../context/adminSparePartsContext/InventoryContext'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import axios from 'axios'

const AllSpareParts = () => {

  const [loading, setLoading] = useState(true)
  const { getAllSpareParts ,spareParts } = useContext(InventoryContext)

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        await getAllSpareParts() // Now updates context state directly
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch parts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSpareParts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Spare Parts Inventory</h2>
        <p className="text-gray-500 mt-1">
          {spareParts.length} parts available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spareParts.map((part) => (
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
              <h3 className="text-lg font-semibold text-gray-800">
                {part.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Brand:</span>
                <span className="text-sm font-medium text-gray-700">
                  {part.brand}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Model:</span>
                <span className="text-sm font-medium text-gray-700">
                  {part.modelNumber}
                </span>
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
                  {part.dimensions.length}x{part.dimensions.width}x
                  {part.dimensions.height} cm
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: part.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {part.color.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {spareParts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No spare parts found in inventory</p>
        </div>
      )}
    </div>
  )
}

export default AllSpareParts