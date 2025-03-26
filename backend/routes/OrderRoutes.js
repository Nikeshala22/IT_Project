import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { customerInfo, items, totalAmount } = req.body;
    
    // Validate required fields
    if (!customerInfo || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'Missing customer information' });
    }
    
    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    // Create new order
    const newOrder = new Order({
      customerInfo,
      items,
      totalAmount,
      status: 'pending',
      orderDate: new Date()
    });
    
    // Save order to database
    const savedOrder = await newOrder.save();
    
    // Return success response with created order
    res.status(201).json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

export default router;
