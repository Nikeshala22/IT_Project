import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersByStatus
} from '../controllers/order/orderController.js';
import { protect } from '../middleware/authUserFront.js';
import Order from '../models/Order.js';

const orderRouter = express.Router();

// Create a new order
orderRouter.post('/',protect, createOrder);

// Get all orders
orderRouter.get('/', getAllOrders);

// Get order by ID
orderRouter.get('/:id', getOrderById);

// Update order status
orderRouter.patch('/:id/status', updateOrderStatus);

// Update order details
orderRouter.put('/:id',protect, async (req, res) => {
  try {
    const { customerInfo } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { customerInfo } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// Delete order by ID
orderRouter.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      order: deletedOrder
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

// Get orders by status
orderRouter.get('/status/:status', getOrdersByStatus);

export default orderRouter;
