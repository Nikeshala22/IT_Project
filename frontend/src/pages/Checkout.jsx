import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingBag, FaCreditCard, FaArrowLeft } from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get cart items from session storage
  const getCartItems = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const cartTotal = parseFloat(sessionStorage.getItem('cartTotal')) || 0;
    return { cartItems, cartTotal };
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [name]: value
      }
    }));
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { cartItems, cartTotal } = getCartItems();
      
      // Transform cart items to match backend schema
      const orderItems = cartItems.map(item => ({
        partId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const orderData = {
        customerInfo: formData.customerInfo,
        items: orderItems,
        totalAmount: cartTotal
      };
      console.log(orderData);
      await axios.post('http://localhost:3000/api/orders', orderData);
      
      // Clear cart after successful order
      sessionStorage.removeItem('cartItems');
      sessionStorage.removeItem('cartTotal');
      
      // Navigate to success page or home
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <FaShoppingBag className="text-purple-600 text-2xl mr-3" />
          <h2 className="text-3xl font-bold text-purple-800">Checkout</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <FaShoppingBag className="text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-purple-800">Order Summary</h3>
            </div>
            <div className="space-y-4">
              {getCartItems().cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg border border-purple-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-900">{item.name}</h4>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-purple-700">Quantity: <span className="font-medium">{item.quantity}</span></p>
                      <p className="text-sm text-purple-700">Price: <span className="font-medium">${item.price.toFixed(2)}</span></p>
                      <p className="text-sm font-semibold text-green-700">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-purple-100">
              <h3 className="text-xl font-semibold text-purple-800 flex justify-between">
                <span>Total:</span>
                <span className="text-green-600">${getCartItems().cartTotal.toFixed(2)}</span>
              </h3>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <FaCreditCard className="text-purple-600 mr-2" />
              <h3 className="text-xl font-semibold text-purple-800">Customer Information</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.customerInfo.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.customerInfo.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Enter your email"
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
                  value={formData.customerInfo.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-purple-700 mb-2">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.customerInfo.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  placeholder="Enter your shipping address"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => navigate('/shoppingcart')}
                  className="sm:flex-1 px-4 py-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Cart
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="sm:flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;