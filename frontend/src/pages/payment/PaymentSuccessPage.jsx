import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaFileDownload, FaPrint } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef();
  const { orderId, transactionId } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    const opt = {
      margin:       0.5,
      filename:     `receipt_${orderId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8 flex items-center justify-center print:bg-white">
      <div ref={receiptRef} className="bg-white rounded-xl shadow-md p-8 md:p-10 border border-purple-100 max-w-lg w-full text-center print:shadow-none print:border-none">
        
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4">
            <FaCheckCircle className="text-4xl text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-purple-800 mb-2">Payment Successful!</h1>
        <p className="text-purple-600 mb-6 text-lg">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {/* Receipt Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-8 text-left border border-purple-100">
          <h2 className="text-lg font-semibold text-purple-800 mb-3">Receipt</h2>
          <div className="space-y-2 text-purple-700 text-sm">
            <p><span className="font-medium">Order ID:</span> {orderId}</p>
            {transactionId && (
              <p><span className="font-medium">Transaction ID:</span> {transactionId}</p>
            )}
            <p><span className="font-medium">Date:</span> {new Date().toLocaleString()}</p>
            <p className="text-green-700 font-medium">Your order has been confirmed and will be processed shortly.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-3 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium inline-flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Home
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium inline-flex items-center justify-center"
          >
            <FaPrint className="mr-2" />
            Print
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center justify-center"
          >
            <FaFileDownload className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
