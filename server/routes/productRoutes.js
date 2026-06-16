const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { createReview, getProductReviews } = require('../controllers/reviewController');

router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.post('/:id/reviews', protect, createReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
