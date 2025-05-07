import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCreditCard, FaPaypal, FaTruck, FaArrowLeft, FaLock, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../context/authContext/authContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
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

  const handleCardNumberInputChange = (e) => {
    let value = e.target.value;

    // Allow only numbers by removing any non-numeric characters
    value = value.replace(/\D/g, "");

    // Ensure max length is 16 digits
    if (value.length > 16) return;

    setCardDetails({ ...cardDetails, cardNumber: value });
  };

  const handleCardHolderInputChange = (e) => {
    let { name, value } = e.target;

    // If input is for cardholder name, allow only letters and spaces
    if (name === "cardholderName") {
      value = value.replace(/[^A-Za-z\s]/g, ""); // Remove numbers & special characters
    }

    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleCVVChange = (e) => {
    let value = e.target.value;

    // Allow only numeric input
    value = value.replace(/\D/g, ""); // Removes any non-numeric characters

    // Ensure max length of 4 digits (some cards use 4-digit CVV)
    if (value.length > 4) return;

    setCardDetails({ ...cardDetails, cvv: value });
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

    if (!/^\d+$/.test(cardDetails.cardNumber)) {
      setError('Card number should contain only numbers');
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

    // Validate expiry date format (MM/YY)
    const [expiryMonth, expiryYear] = cardDetails.expiryDate.split('/');
    if (expiryMonth < 1 || expiryMonth > 12 || expiryYear.length !== 2) {
      setError('Invalid expiry date format. Please enter in MM/YY format');
      return false;
    }

    const expiryDate = new Date(`20${expiryYear}-${expiryMonth}-01`);
    const currentDate = new Date();
    currentDate.setDate(1); // Set the current date to the first of the month for comparison

    if (expiryDate < currentDate) {
      setError('Expiry date cannot be in the past');
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
      // Get auth token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required. Please log in to continue.');
      }

      // Process payment
      const response = await axios.post(
        'http://localhost:4000/api/payments/process',
        {
          orderId,
          paymentMethod,
          paymentDetails: paymentMethod === 'credit_card' ? {
            // In production, this would be securely tokenized, not sent as plain text
            cardNumber: cardDetails.cardNumber.slice(-4), // Only send last 4 digits for demo
            cardholderName: cardDetails.cardholderName,
            expiryDate: cardDetails.expiryDate
          } : {}
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

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
      console.error('Payment error:', err);

      if (err.message === 'Authentication required. Please log in to continue.') {
        setError('You need to be logged in to process payment. Please log in and try again.');
        setTimeout(() => {
          navigate('/user/login', { state: { returnTo: '/payment' } });
        }, 3000);
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate('/user/login', { state: { returnTo: '/payment' } });
        }, 3000);
      } else {
        setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
      }
      console.log(err);
      
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
            <h2 className="text-xl font-semibold text-purple-800 mb-6">Select Payment Method</h2>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit-card"
                  name="payment-method"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => handlePaymentMethodSelect('credit_card')}
                  className="mr-2"
                />
                <FaCreditCard className="text-xl text-purple-600" />
                <label htmlFor="credit-card" className="ml-2 text-lg font-medium text-purple-700">Credit Card</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="payment-method"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => handlePaymentMethodSelect('paypal')}
                  className="mr-2"
                />
                <FaPaypal className="text-xl text-blue-600" />
                <label htmlFor="paypal" className="ml-2 text-lg font-medium text-purple-700">PayPal</label>
              </div>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-purple-700">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberInputChange}
                    maxLength="16"
                    placeholder="Enter card number"
                    className="mt-2 p-3 w-full rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardholderName" className="block text-sm font-medium text-purple-700">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={cardDetails.cardholderName}
                      onChange={handleCardHolderInputChange}
                      placeholder="Enter your name"
                      className="mt-2 p-3 w-full rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-purple-700">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="mt-2 p-3 w-full rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-purple-700">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCVVChange}
                    maxLength="4"
                    placeholder="Enter CVV"
                    className="mt-2 p-3 w-full rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

            <div className="mt-8">
              <button
                onClick={handleProcessPayment}
                disabled={processing}
                className="w-full p-3 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
