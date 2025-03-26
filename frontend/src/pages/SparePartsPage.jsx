import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";
import { FaSearch, FaBox, FaExclamationCircle } from "react-icons/fa";

const SparePartsPage = ({ isAdmin }) => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/parts');
        setParts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch spare parts. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchParts();
  }, []);
  
  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-purple-800">Spare Parts Catalog</h1>
              <p className="mt-1 text-purple-600">Find genuine parts for your equipment</p>
            </div>
            {isAdmin && (
              <Link 
                to="/admin/parts"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
              >
                <IoIosAddCircle className="mr-2 text-xl" />
                Manage Parts
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto md:mx-0">
            <FaSearch className="absolute left-3 top-3.5 text-purple-400" />
            <input
              type="text"
              placeholder="Search by part name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
        </div>

        {/* Parts Table */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] text-purple-600">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
            <span className="text-lg">Loading inventory...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <div className="mb-4">
              <FaExclamationCircle className="mx-auto text-3xl text-red-500 mb-2" />
              <h3 className="text-xl font-semibold text-red-700">Loading Error</h3>
            </div>
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="bg-white border border-purple-100 rounded-xl p-8 max-w-2xl mx-auto text-center shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No parts found</h3>
            <p className="text-purple-600">Try different search terms or check back later for new arrivals.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-100">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {filteredParts.map((part) => (
                    <tr key={part._id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={part.image || 'https://via.placeholder.com/300'}
                            alt={part.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-purple-900">{part.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                          {part.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate">{part.details}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-mono">{part.sku || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-700">${part.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/addtocart/${part._id}`)}
                          className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SparePartsPage;