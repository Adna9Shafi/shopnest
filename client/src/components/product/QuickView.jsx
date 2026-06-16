import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

export default function QuickView({ product, isOpen, onClose }) {
  const { add } = useCart();
  const { isInWishlist, toggle } = useWishlist();

  if (!product) return null;

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
          <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.isNew && <Badge type="new" text="NEW" />}
            {discount > 0 && <Badge type="sale" text={`-${discount}%`} />}
          </div>
          <h2 className="text-xl font-heading font-bold text-primary mb-2">{product.name}</h2>
          <Rating value={product.rating} count={product.numReviews} size="md" />
          <div className="flex items-center gap-2 mt-3 mb-4">
            <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.comparePrice && <span className="text-lg text-textMuted line-through">{formatPrice(product.comparePrice)}</span>}
          </div>
          <p className="text-sm text-textMuted leading-relaxed mb-4">{product.description}</p>
          {product.brand && <p className="text-sm mb-1"><span className="text-textMuted">Brand:</span> <span className="font-medium">{product.brand}</span></p>}
          <p className="text-sm mb-4"><span className="text-textMuted">Availability:</span> <span className={product.countInStock > 0 ? 'text-success font-medium' : 'text-danger font-medium'}>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
          <div className="flex gap-2">
            <Button onClick={() => { add(product); }} disabled={product.countInStock === 0}>
              Add to Cart
            </Button>
            <button onClick={() => toggle(product)} className={`p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors ${isInWishlist(product._id) ? 'text-danger border-danger' : ''}`}>
              ♥
            </button>
          </div>
          <Link to={`/product/${product._id}`} className="block text-center mt-3 text-sm text-secondary hover:underline" onClick={onClose}>View Full Details</Link>
        </div>
      </div>
    </Modal>
  );
}
