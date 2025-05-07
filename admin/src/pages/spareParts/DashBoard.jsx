import React, { useState, useEffect, useContext } from 'react';
import { InventoryContext } from '../../context/adminSparePartsContext/InventoryContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const DashBoard = () => {
  const {
    spareParts,
    deleteSparePart,
    getTotalCount,
    getTotalValue,
    getAllSpareParts,
    backendUrl
  } = useContext(InventoryContext);
  const [stats, setStats] = useState({ totalCount: 0, totalValue: 0 });
  const [loading, setLoading] = useState(true);

  // PDF Export Handler
  // DashBoard.jsx - Update the export handler
  const handleExportPDF = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/inventory/export-pdf`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });
  
      if (!response.ok) {
        throw new Error('PDF export failed');
      }
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'inventory-report.pdf');
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Data Loading Effect
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getAllSpareParts(),
          getTotalCount(),
          getTotalValue()
        ]);

        setStats({
          totalCount: await getTotalCount(),
          totalValue: await getTotalValue()
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section with Navigation Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export as PDF
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Parts</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <img src={assets.package_icon} className="w-6 h-6" alt="Package" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Inventory Value</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <img src={assets.dollar} className="w-6 h-6" alt="Dollar" />
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {spareParts.map((part) => (
              <tr key={part._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={part.image || assets.upload_area}
                      className="w-10 h-10 object-contain rounded mr-4"
                      alt={part.name}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{part.name}</p>
                      <p className="text-sm text-gray-500">{part.modelNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{part.brand}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${part.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {part.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">${part.price.toFixed(2)}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    to={`/update-spare-part/${part._id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      const success = await deleteSparePart(part._id);
                      if (success) {
                        const count = await getTotalCount();
                        const value = await getTotalValue();
                        setStats({ totalCount: count, totalValue: value });
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {spareParts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No spare parts found in inventory</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;