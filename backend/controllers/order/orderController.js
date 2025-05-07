import Order from "../../models/Order.js"
import InventoryModel from "../../models/inventryModel.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    // If the request comes from a regular user, only return their orders
    if (req.user ) {
      const orders = await Order.find({ userId: req.user._id })
        .populate('items.partId', 'name price image')
        .sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // If admin or no user authentication, return all orders
    const orders = await Order.find()
      .populate('items.partId', 'name price image')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.partId', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { customerInfo, items, totalAmount } = req.body;

    // Validate required fields
    if (!customerInfo || !items || !totalAmount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'All customer information is required' });

    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    // Validate that all parts exist
    for (const item of items) {
      const part = await InventoryModel.findById(item.partId);
      if (!part) {
        return res.status(404).json({ message: `Part with ID ${item.partId} not found` });
      }
    } const newOrder = new Order({
      userId: req.user?._id, // Add userId if user is authenticated
      customerInfo,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const orders = await Order.find({ status })
      .populate('items.partId', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
