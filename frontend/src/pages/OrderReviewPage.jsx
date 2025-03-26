import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaArrowLeft, FaArrowRight, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';

const OrderReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have order data from the location state (passed from checkout)
    if (location.state && location.state.orderData && location.state.orderId) {
      setOrderData(location.state.orderData);
      setOrderId(location.state.orderId);
      setCustomerInfo(location.state.orderData.customerInfo);
      setLoading(false);
    } else {
      // If no state is passed, show error and redirect back to checkout
      setError('Order data not found. Please complete the checkout process first.');
      setTimeout(() => {
        navigate('/checkout');
      }, 3000); // Redirect after 3 seconds
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateCustomerInfo = async () => {
    try {
      // Update the order on the backend
      await axios.put(`http://localhost:3000/api/orders/${orderId}`, {
        customerInfo
      });

      // Update local state
      setOrderData(prev => ({
        ...prev,
        customerInfo
      }));

      setEditMode(false);
      setError(null);
    } catch (err) {
      setError('Failed to update customer information: ' + err.message);
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { 
      state: { 
        orderId,
        orderData
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          {error ? (
            <div className="bg-red-50 border border-red-100 text-red-700 px-8 py-6 rounded-lg mb-4 max-w-md">
              <p className="font-medium text-lg mb-2">Error</p>
              <p>{error}</p>
              <p className="mt-4 text-sm">Redirecting to checkout page...</p>
            </div>
          ) : (
            <div className="flex items-center text-purple-600">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
              <span className="text-lg">Loading order details...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <FaCheckCircle className="text-purple-600 text-2xl mr-3" />
          <h1 className="text-3xl font-bold text-purple-800">Review Your Order</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-purple-800">Order #{orderId?.substring(0, 8)}</h2>
            {!editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit Details
              </button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-purple-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-purple-700 mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setEditMode(false);
                    setCustomerInfo(orderData.customerInfo);
                  }}
                  className="flex-1 px-4 py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateCustomerInfo}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-purple-800 mb-2">Customer Information</h3>
                <div className="space-y-2 text-purple-700">
                  <p><span className="font-medium">Name:</span> {customerInfo.name}</p>
                  <p><span className="font-medium">Email:</span> {customerInfo.email}</p>
                  <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
                  <p><span className="font-medium">Address:</span> {customerInfo.address}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-purple-800 mb-2">Order Summary</h3>
                <div className="space-y-2 text-purple-700">
                  <p><span className="font-medium">Items:</span> {orderData.items.length}</p>
                  <p><span className="font-medium">Order Status:</span> {orderData.status}</p>
                  <p className="text-lg font-bold text-green-600">Total: ${orderData.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100 mb-8">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Order Items</h2>
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center border-b border-purple-100 pb-4">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mr-4">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900">{item.name || `Item #${index + 1}`}</h4>
                  <div className="flex justify-between text-sm">
                    <p className="text-purple-700">Quantity: {item.quantity}</p>
                    <p className="font-medium text-green-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-purple-100">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-purple-800">Total Amount:</span>
              <span className="text-green-600">${orderData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="sm:flex-1 px-4 py-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Checkout
          </button>
          <button 
            onClick={handleProceedToPayment}
            className="sm:flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all font-medium inline-flex items-center justify-center"
          >
            Proceed to Payment
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewPage; 