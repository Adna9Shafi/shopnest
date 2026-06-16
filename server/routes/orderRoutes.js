const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderToPaid, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, isAdmin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;
