const Product = require('../models/Product');
const Review = require('../models/Review');

const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }
  if (req.query.rating) {
    filter.rating = { $gte: parseFloat(req.query.rating) };
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { category: { $regex: req.query.search, $options: 'i' } },
      { tags: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.isFeatured) {
    filter.isFeatured = req.query.isFeatured === 'true';
  }

  let sort = {};
  switch (req.query.sort) {
    case 'price_asc': sort = { price: 1 }; break;
    case 'price_desc': sort = { price: -1 }; break;
    case 'newest': sort = { createdAt: -1 }; break;
    case 'popular': sort = { rating: -1, numReviews: -1 }; break;
    default: sort = { createdAt: -1 };
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    countInStock: req.body.countInStock || 0,
    images: req.body.images || [],
    tags: req.body.tags || [],
    isFeatured: req.body.isFeatured || false,
    isNew: req.body.isNew || false,
    discount: req.body.discount || 0,
    comparePrice: req.body.comparePrice,
    richDescription: req.body.richDescription,
  });
  const created = await product.save();
  res.status(201).json(created);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.richDescription = req.body.richDescription || product.richDescription;
    product.images = req.body.images || product.images;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price ?? product.price;
    product.comparePrice = req.body.comparePrice ?? product.comparePrice;
    product.category = req.body.category || product.category;
    product.tags = req.body.tags || product.tags;
    product.countInStock = req.body.countInStock ?? product.countInStock;
    product.isFeatured = req.body.isFeatured ?? product.isFeatured;
    product.isNew = req.body.isNew ?? product.isNew;
    product.discount = req.body.discount ?? product.discount;
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Review.deleteMany({ product: product._id });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const getFeaturedProducts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const products = await Product.find({ isFeatured: true }).limit(limit);
  res.json(products);
};

const searchProducts = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([]);
  }
  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ],
  }).limit(20);
  res.json(products);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
};
