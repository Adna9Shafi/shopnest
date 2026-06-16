import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import QuickView from './QuickView';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : product.discount;

  const getBadge = () => {
    if (discount > 0) return { type: 'sale', text: `-${discount}%` };
    if (product.isNew) return { type: 'new', text: 'NEW' };
    if (product.isFeatured) return { type: 'hot', text: 'HOT' };
    return null;
  };

  const badge = getBadge();

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group card overflow-hidden hover:shadow-card-hover transition-all duration-200">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
          <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} loading="lazy" className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImgLoaded(true)} />
          {badge && <div className="absolute top-3 left-3"><Badge type={badge.type} text={badge.text} /></div>}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={(e) => { e.preventDefault(); setShowQuickView(true); }} className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors" title="Quick view">
              <FiEye size={16} />
            </button>
            <button onClick={(e) => { e.preventDefault(); toggle(product); }} className={`p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors ${isInWishlist(product._id) ? 'text-danger' : ''}`} title="Wishlist">
              <FiHeart size={16} />
            </button>
          </div>
        </div>
        <Link to={`/product/${product._id}`} className="block p-4">
          <h3 className="text-sm font-medium text-primary line-clamp-2 mb-1 group-hover:text-secondary transition-colors">{product.name}</h3>
          <Rating value={product.rating} count={product.numReviews} />
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
            {product.comparePrice && <span className="text-sm text-textMuted line-through">{formatPrice(product.comparePrice)}</span>}
          </div>
        </Link>
        <div className="px-4 pb-4">
          <button onClick={() => add(product)} className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
            <FiShoppingCart size={15} /> Add to Cart
          </button>
        </div>
      </motion.div>
      <QuickView product={product} isOpen={showQuickView} onClose={() => setShowQuickView(false)} />
    </>
  );
}
