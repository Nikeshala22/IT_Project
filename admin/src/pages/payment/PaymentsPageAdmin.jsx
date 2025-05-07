import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileInvoiceDollar, FaEye, FaTrash, FaSearch, FaFilePdf, FaFileCsv } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Correct import for autoTable
import 'jspdf-autotable'; // Ensure it's included for correct usage
import Papa from 'papaparse';

const PaymentsPageAdmin = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/payments');
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

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        await axios.delete(`http://localhost:4000/api/payments/${paymentId}`);
        fetchPayments();
      } catch (err) {
        setError('Failed to delete payment: ' + err.message);
        console.error('Error deleting payment:', err);
      }
    }
  };

  const openDetailsModal = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredPayments = payments.filter(payment => {
    const searchString = searchTerm.toLowerCase();
    return (
      payment._id.toLowerCase().includes(searchString) ||
      (payment.customerInfo?.name && payment.customerInfo.name.toLowerCase().includes(searchString)) ||
      (payment.paymentDetails?.method && payment.paymentDetails.method.toLowerCase().includes(searchString)) ||
      (payment.paymentDetails?.transactionId && payment.paymentDetails.transactionId.toLowerCase().includes(searchString))
    );
  });

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

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Payments Report', 14, 16);

    const tableColumn = ["Order ID", "Customer", "Payment Method", "Amount", "Status", "Date"];
    const tableRows = [];

    filteredPayments.forEach(payment => {
      const paymentData = [
        payment._id.substring(0, 8),
        payment.customerInfo?.name || 'N/A',
        getPaymentMethodDisplay(payment.paymentDetails?.method),
        `$${payment.totalAmount?.toFixed(2)}`,
        payment.paymentDetails?.status || 'N/A',
        formatDate(payment.paymentDetails?.timestamp || payment.createdAt)
      ];
      tableRows.push(paymentData);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 25 });

    doc.save('payments_report.pdf');
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvHeader = ["Order ID", "Customer", "Payment Method", "Amount", "Status", "Date"];
    const csvRows = filteredPayments.map(payment => [
      payment._id.substring(0,8),
      payment.customerInfo?.name,
      getPaymentMethodDisplay(payment.paymentDetails?.method),
      `$${payment.totalAmount?.toFixed(2)}`,
      payment.paymentDetails?.status,
      formatDate(payment.paymentDetails?.timestamp || payment.createdAt)
    ]);

    const csvContent = [
      csvHeader.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'payments_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const PaymentDetailsModal = () => {
    if (!selectedPayment) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button
            onClick={() => setShowDetailsModal(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Payment Details</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>Order ID:</strong> {selectedPayment._id}</p>
            <p><strong>Customer Name:</strong> {selectedPayment.customerInfo?.name || 'N/A'}</p>
            <p><strong>Amount:</strong> ${selectedPayment.totalAmount?.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {getPaymentMethodDisplay(selectedPayment.paymentDetails?.method)}</p>
            <p><strong>Status:</strong> {selectedPayment.paymentDetails?.status}</p>
            <p><strong>Transaction ID:</strong> {selectedPayment.paymentDetails?.transactionId || 'N/A'}</p>
            <p><strong>Timestamp:</strong> {formatDate(selectedPayment.paymentDetails?.timestamp || selectedPayment.createdAt)}</p>
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

          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
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

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                <FaFilePdf /> Export PDF
              </button>
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <FaFileCsv /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-purple-100">
              <tr>
                <th scope="col" className="px-6 py-3">Order ID</th>
                <th scope="col" className="px-6 py-3">Customer</th>
                <th scope="col" className="px-6 py-3">Method</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-6">Loading payments...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className="text-center py-6 text-red-500">{error}</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-6">No payments found.</td></tr>
              ) : (
                filteredPayments.map(payment => (
                  <tr key={payment._id} className="bg-white border-b hover:bg-purple-50">
                    <td className="px-6 py-4">{payment._id.substring(0,8)}</td>
                    <td className="px-6 py-4">{payment.customerInfo?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{getPaymentMethodDisplay(payment.paymentDetails?.method)}</td>
                    <td className="px-6 py-4">${payment.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.paymentDetails?.status)}`}>
                        {payment.paymentDetails?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button
                        onClick={() => openDetailsModal(payment)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && <PaymentDetailsModal />}
    </div>
  );
};

export default PaymentsPageAdmin;
