const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    richDescription: { type: String },
    images: [{ type: String }],
    brand: { type: String },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    category: { type: String, required: true },
    tags: [{ type: String }],
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (!this.isModified('name') && this.slug) return next();
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

productSchema.index({ name: 'text', category: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
