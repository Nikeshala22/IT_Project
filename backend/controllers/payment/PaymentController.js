import Order from "../../models/Order.js";


const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Simple payment simulation
    // In a real application, this would integrate with a payment gateway
    const paymentSuccessful = simulatePaymentProcessing(paymentMethod, paymentDetails, order.totalAmount);

    if (paymentSuccessful) {
      // Update order status
      order.status = 'processing';
      order.paymentDetails = {
        method: paymentMethod,
        transactionId: generateTransactionId(),
        status: 'completed',
        timestamp: new Date()
      };

      await order.save();

      return res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        order: {
          id: order._id,
          status: order.status,
          paymentDetails: order.paymentDetails
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment processing failed'
      });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment processing',
      error: error.message
    });
  }
};


const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({
      orderId: order._id,
      status: order.status,
      paymentDetails: order.paymentDetails || { status: 'pending' }
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const getAllPayments = async (req, res) => {
  try {
    // Only fetch orders that have payment details
    const orders = await Order.find({
      'paymentDetails.status': { $exists: true }
    })
    .populate('items.partId', 'name price image')
    .sort({ 'paymentDetails.timestamp': -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


const deletePayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Remove the paymentDetails and update status
    order.paymentDetails = undefined;
    order.status = 'pending'; // Reset status to pending
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper functions
const simulatePaymentProcessing = (paymentMethod, details, amount) => {
  // In a real application, this would be an actual payment gateway integration
  console.log(`Processing ${amount} payment via ${paymentMethod}`);
  
  // For demo purposes, always return success except for specific test cases
  if (details?.testFailure) {
    return false;
  }
  
  return true;
};

const generateTransactionId = () => {
  return 'TRANS_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

export {
  processPayment,
  getPaymentStatus,
  getAllPayments,
  deletePayment
}; 