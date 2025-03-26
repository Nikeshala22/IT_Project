import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { FaFileInvoiceDollar, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentsPageAdmin = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch all orders with payment details
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/payments');
      setPayments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payments: ' + err.message);
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle payment deletion
  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await axios.delete(`http://localhost:3000/api/payments/${paymentId}`);
        fetchPayments(); // Refresh the payments list
      } catch (err) {
        setError('Failed to delete payment: ' + err.message);
        console.error('Error deleting payment:', err);
      }
    }
  };

  // Open payment details modal
  const openDetailsModal = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => {
    const searchString = searchTerm.toLowerCase();
    return (
      payment._id.toLowerCase().includes(searchString) ||
      (payment.customerInfo?.name && payment.customerInfo.name.toLowerCase().includes(searchString)) ||
      (payment.paymentDetails?.method && payment.paymentDetails.method.toLowerCase().includes(searchString)) ||
      (payment.paymentDetails?.transactionId && payment.paymentDetails.transactionId.toLowerCase().includes(searchString))
    );
  });

  // Get payment status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment method display name
  const getPaymentMethodDisplay = (method) => {
    switch(method) {
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      case 'paypal':
        return 'PayPal';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      default:
        return method || 'Unknown';
    }
  };

  // Payment Details Modal
  const PaymentDetailsModal = () => {
    if (!selectedPayment) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl border border-purple-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Payment Details</h2>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Payment Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Order ID:</span> {selectedPayment._id}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Transaction ID:</span> {selectedPayment.paymentDetails?.transactionId || 'N/A'}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Payment Method:</span> {getPaymentMethodDisplay(selectedPayment.paymentDetails?.method)}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Amount:</span> ${selectedPayment.totalAmount?.toFixed(2)}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.paymentDetails?.status)}`}>
                    {selectedPayment.paymentDetails?.status || 'Unknown'}
                  </span>
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Date:</span> {formatDate(selectedPayment.paymentDetails?.timestamp)}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Customer Information</h3>
              <div className="space-y-2">
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Name:</span> {selectedPayment.customerInfo?.name}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Email:</span> {selectedPayment.customerInfo?.email}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Phone:</span> {selectedPayment.customerInfo?.phone}
                </p>
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Address:</span> {selectedPayment.customerInfo?.address}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Order Items</h3>
            <div className="overflow-x-auto -mx-4">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {selectedPayment.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-purple-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-purple-700">
                        {item.partId?.name || `Item #${index + 1}`}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-purple-700">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-purple-700">
                        ${item.price?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-700">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="flex items-center mb-8">
        <FaFileInvoiceDollar className="text-purple-600 text-2xl mr-3" />
        <h1 className="text-3xl font-bold text-purple-800">Payments Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-purple-800">All Payments</h2>
          
          {/* Search box */}
          <div className="relative max-w-md w-full">
            <FaSearch className="absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] text-purple-600">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
            <span className="text-lg">Loading payments...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
            {error}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No payments found</h3>
            <p className="text-purple-600">No payment records match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {filteredPayments.map(payment => (
                  <tr key={payment._id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                      {payment._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                      {payment.customerInfo?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                      {getPaymentMethodDisplay(payment.paymentDetails?.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                      ${payment.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.paymentDetails?.status)}`}>
                        {payment.paymentDetails?.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                      {formatDate(payment.paymentDetails?.timestamp || payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openDetailsModal(payment)}
                          className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(payment._id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Payment"
                        >
                          <FaTrash size={16} />
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
      
      {/* Payment Details Modal */}
      {showDetailsModal && <PaymentDetailsModal />}
    </div>
  );
};

export default PaymentsPageAdmin; 