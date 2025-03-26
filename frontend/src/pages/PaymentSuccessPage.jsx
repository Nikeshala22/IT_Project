import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaFileAlt } from 'react-icons/fa';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, transactionId } = location.state || {};

  useEffect(() => {
    // If no order info, redirect to home
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 md:p-10 border border-purple-100 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <FaCheckCircle className="text-4xl text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Payment Successful!</h1>
        <p className="text-purple-600 mb-6 text-lg">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-8 text-left">
          <div className="space-y-2">
            <p className="text-purple-700">
              <span className="font-medium">Order ID:</span> {orderId}
            </p>
            {transactionId && (
              <p className="text-purple-700">
                <span className="font-medium">Transaction ID:</span> {transactionId}
              </p>
            )}
            <p className="text-purple-700">
              <span className="font-medium">Date:</span> {new Date().toLocaleString()}
            </p>
            <p className="text-green-700 font-medium">
              Your order has been confirmed and will be processed shortly.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Return to Home
          </button>
          <button 
            onClick={() => navigate('/orders')}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all font-medium inline-flex items-center justify-center"
          >
            <FaFileAlt className="mr-2" />
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 