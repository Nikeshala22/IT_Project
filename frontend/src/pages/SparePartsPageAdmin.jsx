import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { GrEdit } from "react-icons/gr";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever, MdClose } from "react-icons/md";
import { FaBox, FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const SparePartsPage = () => {
  const navigate = useNavigate();
  // State for modals and form data
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState({});
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    details: '',
    category: '',
    sku: '',
    image: ''
  });

  const fetchParts = async () => {
    await axios.get('http://localhost:3000/api/parts')
      .then(response => {
        setParts(response.data)
        setLoading(false)
      })
      .catch(error => setError(error));
  };

  useEffect(() => {
    fetchParts();
  }, []);
  
  // Handle part deletion
  const handleDelete = (partId) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      deletePart(partId);
    }
  };

  const deletePart = async (partId) => {
    await axios.delete(`http://localhost:3000/api/parts/${partId}`)
      .then(response => {
        fetchParts();
      })
      .catch(error => setError(error));
  };

  // Handle edit modal open
  const handleEdit = async (_id) => {
    axios.get(`http://localhost:3000/api/parts/${_id}`)
    .then(part => {
      setSelectedPart(part.data);
      setFormData({
        name: part.data.name,
        price: part.data.price, 
        details: part.data.details,
        category: part.data.category || '',
        sku: part.data.sku || '',
        image: part.data.image
      });
      setShowEditModal(true);
    })
    .catch(error => setError(error));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add new part
  const handleAdd = async () => {
    axios.post('http://localhost:3000/api/parts', formData)
    .then(response => {
      alert('Part added successfully');
      setShowAddModal(false);
      setFormData({ name: '', price: '', details: '', category: '', sku: '', image: '' });
      fetchParts();
    })
  };

  // Handle update part
  const handleUpdate = async () => {
    axios.put(`http://localhost:3000/api/parts/${selectedPart._id}`, formData)
    .then(response => {
      alert('Part updated successfully');
      setShowEditModal(false);
      setFormData({ name: '', price: '', details: '', category: '', sku: '', image: '' });
      fetchParts();
    })
  };

  // Filter parts based on search term
  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.details && part.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (part.category && part.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Modal components
  const AddModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Add New Part</h2>
          <button 
            onClick={() => setShowAddModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Part Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter part name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              placeholder="Stock Keeping Unit"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Details</label>
            <textarea
              name="details"
              placeholder="Enter part details"
              value={formData.details}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div className="pt-4">
            <button 
              onClick={handleAdd}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
            >
              Add Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-800">Edit Part</h2>
          <button 
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Part Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter part name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              placeholder="Stock Keeping Unit"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Details</label>
            <textarea
              name="details"
              placeholder="Enter part details"
              value={formData.details}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div className="pt-4">
            <button 
              onClick={handleUpdate}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
            >
              Update Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="flex items-center mb-8">
        <FaBox className="text-purple-600 text-2xl mr-3" />
        <h1 className="text-3xl font-bold text-purple-800">Spare Parts Management</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 flex items-center border border-purple-100">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <FaBox className="text-2xl text-purple-500" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-purple-800">{parts.length}</h3>
              <p className="text-purple-600">Total Parts</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
        <div className="p-6 border-b border-purple-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
          >
            <IoIosAddCircle className="mr-2 text-xl" />
            <span>Add New Part</span>
          </button>
          
          <div className="relative max-w-md w-full">
            <FaSearch className="absolute left-3 top-3 text-purple-400" />
            <input 
              type="text" 
              placeholder="Search parts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] text-purple-600 p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
            <span className="text-lg">Loading parts...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 m-6 rounded-xl">
            Error loading parts: {error.message}
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-12 px-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No parts found</h3>
            <p className="text-purple-600 mb-6">Add your first spare part to get started</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
            >
              <IoIosAddCircle className="mr-2 text-xl" />
              <span>Add New Part</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-100">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {filteredParts.map(part => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-mono">{part.sku || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-700">${part.price?.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">{part.details}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(part._id)}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit Part"
                        >
                          <GrEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(part._id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Part"
                        >
                          <MdDeleteForever size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showAddModal && <AddModal />}
      {showEditModal && <EditModal />}
    </div>
  );
};

export default SparePartsPage;