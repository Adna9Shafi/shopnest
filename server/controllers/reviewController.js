const Review = require('../models/Review');
const Product = require('../models/Product');

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
  if (alreadyReviewed) {
    return res.status(400).json({ message: 'Product already reviewed' });
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

  product.rating = Math.round(avgRating * 10) / 10;
  product.numReviews = numReviews;
  await product.save();

  res.status(201).json(review);
};

const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
};

module.exports = { createReview, getProductReviews };
