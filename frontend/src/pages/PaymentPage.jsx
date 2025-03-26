import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaPaypal, FaTruck, FaArrowLeft, FaLock, FaCheck } from 'react-icons/fa';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    // Check if we have order data from the location state
    if (location.state && location.state.orderId && location.state.orderData) {
      setOrderId(location.state.orderId);
      setOrderData(location.state.orderData);
      setLoading(false);
    } else {
      // If no state is passed, redirect back to checkout
      navigate('/checkout');
    }
  }, [location, navigate]);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const validateCardDetails = () => {
    if (paymentMethod !== 'credit_card') return true;

    if (!cardDetails.cardNumber || cardDetails.cardNumber.length < 16) {
      setError('Please enter a valid card number');
      return false;
    }

    if (!cardDetails.cardholderName) {
      setError('Please enter the cardholder name');
      return false;
    }

    if (!cardDetails.expiryDate) {
      setError('Please enter the expiry date');
      return false;
    }

    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }

    return true;
  };

  const handleProcessPayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (!validateCardDetails()) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Process payment
      const response = await axios.post('http://localhost:3000/api/payments/process', {
        orderId,
        paymentMethod,
        paymentDetails: paymentMethod === 'credit_card' ? {
          // In production, this would be securely tokenized, not sent as plain text
          cardNumber: cardDetails.cardNumber.slice(-4), // Only send last 4 digits for demo
          cardholderName: cardDetails.cardholderName,
          expiryDate: cardDetails.expiryDate
        } : {}
      });

      if (response.data.success) {
        setSuccess(true);
        // Clear card details for security
        setCardDetails({
          cardNumber: '',
          cardholderName: '',
          expiryDate: '',
          cvv: ''
        });
        
        // Wait 2 seconds then navigate to success page
        setTimeout(() => {
          navigate('/payment-success', { 
            state: { 
              orderId,
              transactionId: response.data.order.paymentDetails.transactionId 
            } 
          });
        }, 2000);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center text-purple-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
          <span className="text-lg">Loading payment options...</span>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-md border border-purple-100 max-w-md">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <FaCheck className="text-4xl text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Payment Successful!</h2>
          <p className="text-purple-600 mb-6">Your payment has been processed successfully. Redirecting to confirmation page...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <FaCreditCard className="text-purple-600 text-2xl mr-3" />
          <h1 className="text-3xl font-bold text-purple-800">Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-800 mb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-700">Order ID:</span>
                <span className="font-medium text-purple-900">{orderId.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-700">Total Items:</span>
                <span className="font-medium text-purple-900">{orderData.items.length}</span>
              </div>
              <div className="flex justify-between items-center border-t border-purple-100 pt-4 mt-4">
                <span className="text-lg font-medium text-purple-800">Total Amount:</span>
                <span className="text-xl font-bold text-green-600">${orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-800 mb-6">Payment Method</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex-1 border ${paymentMethod === 'credit_card' ? 'border-purple-500 bg-purple-50' : 'border-purple-200'} rounded-lg p-4 cursor-pointer hover:bg-purple-50 transition-colors`}
                  onClick={() => handlePaymentMethodSelect('credit_card')}
                >
                  <div className="flex items-center gap-3">
                    <FaCreditCard className="text-purple-600 text-xl" />
                    <span className="font-medium text-purple-800">Credit Card</span>
                  </div>
                </div>
                
                <div
                  className={`flex-1 border ${paymentMethod === 'paypal' ? 'border-purple-500 bg-purple-50' : 'border-purple-200'} rounded-lg p-4 cursor-pointer hover:bg-purple-50 transition-colors`}
                  onClick={() => handlePaymentMethodSelect('paypal')}
                >
                  <div className="flex items-center gap-3">
                    <FaPaypal className="text-purple-600 text-xl" />
                    <span className="font-medium text-purple-800">PayPal</span>
                  </div>
                </div>
              </div>
              
              <div
                className={`border ${paymentMethod === 'cash_on_delivery' ? 'border-purple-500 bg-purple-50' : 'border-purple-200'} rounded-lg p-4 cursor-pointer hover:bg-purple-50 transition-colors`}
                onClick={() => handlePaymentMethodSelect('cash_on_delivery')}
              >
                <div className="flex items-center gap-3">
                  <FaTruck className="text-purple-600 text-xl" />
                  <span className="font-medium text-purple-800">Cash on Delivery</span>
                </div>
              </div>
              
              {paymentMethod === 'credit_card' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-purple-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      maxLength="16"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-purple-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      placeholder="John Doe"
                      value={cardDetails.cardholderName}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-purple-700 mb-2">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardDetails.expiryDate}
                        onChange={handleCardInputChange}
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-purple-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        maxLength="3"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-purple-600 mt-2">
                    <FaLock className="mr-2" />
                    <span>Your payment information is secure</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mt-4">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  onClick={() => navigate('/order-review', { state: { orderId, orderData } })}
                  className="sm:flex-1 px-4 py-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center justify-center"
                  disabled={processing}
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Review
                </button>
                <button 
                  onClick={handleProcessPayment}
                  disabled={!paymentMethod || processing}
                  className="sm:flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 