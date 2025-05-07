import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GrEdit } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const OrdersPageAdmin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order deletion
  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
        fetchOrders();
      } catch (err) {
        setError('Failed to delete order: ' + err.message);
        console.error('Error deleting order:', err);
      }
    }
  };

  // Open status update modal
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    try {
      await axios.patch(`http://localhost:4000/api/orders/${selectedOrder._id}/status`, {
        status: newStatus
      });
      setShowStatusModal(false);
      fetchOrders();
    } catch (err) {
      setError('Failed to update order status: ' + err.message);
      console.error('Error updating order status:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Download orders as CSV
  const downloadCSV = () => {
    const csvRows = [
      ['Order ID', 'Customer', 'Date', 'Total Amount', 'Status'],
      ...orders.map(order => [
        order._id,
        order.customerInfo?.name,
        formatDate(order.createdAt || order.orderDate),
        `$${order.totalAmount}`,
        order.status
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const customerName = order.customerInfo?.name?.toLowerCase() || '';
    const orderId = order._id.toLowerCase();
    const query = searchQuery.toLowerCase();
    return customerName.includes(query) || orderId.includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Orders Management</h1>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={downloadCSV} 
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
        >
          <IoMdDownload size={18} />
          Download CSV
        </button>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by Customer Name or Order ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px] text-purple-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
          <span className="text-lg">Loading orders...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-purple-600 italic">
                      No matching orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                        {order.customerInfo?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                        {formatDate(order.createdAt || order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                        ${order.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openStatusModal(order)}
                            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Update Status"
                          >
                            <GrEdit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(order._id)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Order"
                          >
                            <MdDeleteForever size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Update Order Status</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full mb-4 p-2 border border-purple-300 rounded"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPageAdmin;
