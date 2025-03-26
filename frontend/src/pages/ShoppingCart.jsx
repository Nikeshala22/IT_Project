import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    const cartTotal = parseFloat(sessionStorage.getItem('cartTotal')) || 0;
    setOrders(cartItems);
    setTotal(cartTotal);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const payOrder = async () => {
    try {
      // Transform cart items to match backend schema
      const orderItems = orders.map(item => ({
        part: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      // Create order object matching backend schema
      const orderData = {
        customer: {
          name: '', // This will be filled in the checkout form
          email: '',
          phone: '',
          address: ''
        },
        items: orderItems,
        totalAmount: total,
        status: 'pending'
      };

      // Store order data in session storage for checkout
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      
      // Navigate to checkout page
      navigate('/checkout');
    } catch (error) {
      console.error('Error preparing order:', error);
      alert('Failed to prepare order. Please try again.');
    }
  };

  const removeItem = (itemId) => {
    const updatedOrders = orders.filter(order => order.id !== itemId);
    
    // Recalculate total
    const newTotal = updatedOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update state and sessionStorage
    setOrders(updatedOrders);
    setTotal(newTotal);
    sessionStorage.setItem('cartItems', JSON.stringify(updatedOrders));
    sessionStorage.setItem('cartTotal', newTotal.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <div className="flex items-center">
              <FaShoppingCart className="text-purple-600 text-2xl mr-3" />
              <h2 className="text-2xl font-bold text-purple-800">Shopping Cart</h2>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Parts
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-6xl mb-4 text-purple-300 flex justify-center">
                <FaShoppingCart />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Your cart is empty</h3>
              <p className="text-purple-600 mb-6">Add some spare parts to your cart to get started</p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
              >
                Browse Parts
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Part</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-purple-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {order.image && (
                              <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mr-3">
                                <img src={order.image} alt={order.name} className="h-full w-full object-cover" />
                              </div>
                            )}
                            <div className="text-sm font-medium text-purple-900">{order.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                          ${order.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                          ${(order.price * order.quantity).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => removeItem(order.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 pt-6 border-t border-purple-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-purple-800">Total:</span>
                  <span className="text-2xl font-bold text-purple-900">${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={payOrder}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
