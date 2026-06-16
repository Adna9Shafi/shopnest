const Order = require('../models/Order');

const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const created = await order.save();
  res.status(201).json(created);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    order.status = 'processing';
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    if (order.status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderToPaid, getAllOrders, updateOrderStatus };
