import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import Rating from '../components/ui/Rating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ReviewCard from '../components/product/ReviewCard';
import ProductCarousel from '../components/product/ProductCarousel';
import { FiMinus, FiPlus, FiHeart, FiShoppingCart, FiShare2, FiCheck, FiStar } from 'react-icons/fi';
import { FaTwitter, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setLoading(true);
    productService.getById(id).then((res) => {
      setProduct(res.data);
      setCurrentImg(0);
      setQty(1);
      setLoading(false);
      return productService.getAll({ category: res.data.category, limit: 5 });
    }).then((res) => {
      if (res?.data?.products) setRelated(res.data.products.filter((p) => p._id !== id));
    }).catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const loadReviews = useCallback(() => {
    setReviewsLoading(true);
    productService.getReviews(id).then((res) => setReviews(res.data)).catch(() => {}).finally(() => setReviewsLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab === 'reviews') loadReviews();
  }, [activeTab, loadReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.rating) return toast.error('Please select a rating');
    if (!reviewForm.comment.trim()) return toast.error('Please write a comment');
    setSubmittingReview(true);
    try {
      await productService.createReview(id, { rating: reviewForm.rating, comment: reviewForm.comment });
      toast.success('Review submitted!');
      setReviewForm({ rating: 0, comment: '' });
      loadReviews();
      const updated = await productService.getById(id);
      setProduct(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return <div className="container-custom py-20"><Spinner size="lg" /></div>;
  if (!product) return <div className="container-custom py-20 text-center text-textMuted">Product not found</div>;

  const discount = product.comparePrice ? Math.round((1 - product.price / product.comparePrice) * 100) : product.discount || 0;
  const savings = product.comparePrice ? product.comparePrice - product.price : 0;
  const highlights = product.richDescription ? product.richDescription.split('\n').filter(Boolean) : product.description ? product.description.split('. ').filter(Boolean).slice(0, 4) : [];

  return (
    <>
      <Helmet><title>{product.name} — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <nav className="flex items-center gap-2 text-sm text-textMuted mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link><span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category}</Link><span>/</span>
          <span className="text-primary truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-3 lg:col-span-2">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-3 cursor-crosshair group" onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)} onMouseMove={handleMouseMove}>
              <img src={product.images?.[currentImg] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}} />
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && <Badge type="new" text="NEW" />}
                {product.isFeatured && !product.isNew && <Badge type="hot" text="HOT" />}
                {discount > 0 && <Badge type="sale" text={`-${discount}%`} />}
              </div>
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setCurrentImg(i)} className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === currentImg ? 'border-secondary' : 'border-transparent hover:border-border'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <Rating value={product.rating} count={product.numReviews} size="md" />
              <button onClick={() => setActiveTab('reviews')} className="text-sm text-secondary hover:underline">{product.numReviews > 0 ? `See ${product.numReviews} reviews` : 'Write a Review'}</button>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl md:text-4xl font-bold text-primary">{formatPrice(product.price)}</span>
              {product.comparePrice && <span className="text-xl text-textMuted line-through">{formatPrice(product.comparePrice)}</span>}
            </div>
            {savings > 0 && (
              <p className="text-sm text-success font-medium mb-3 flex items-center gap-1">
                <FiCheck size={14} /> You save {formatPrice(savings)} ({discount}% off)
              </p>
            )}

            <div className="mb-5">
              {product.countInStock > 5 ? (
                <p className="text-sm text-success font-medium flex items-center gap-1"><FiCheck size={14} /> In Stock ({product.countInStock} available)</p>
              ) : product.countInStock > 0 ? (
                <p className="text-sm text-accent font-medium">Only {product.countInStock} left!</p>
              ) : (
                <p className="text-sm text-danger font-medium">Out of Stock</p>
              )}
            </div>

            <hr className="border-border mb-5" />

            <ul className="space-y-2 mb-5">
              {highlights.slice(0, 5).map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-textMuted">
                  <FiCheck size={16} className="text-success shrink-0 mt-0.5" />
                  <span>{point.replace(/^[•\-–—]\s*/, '')}</span>
                </li>
              ))}
            </ul>

            <hr className="border-border mb-5" />

            {product.countInStock > 0 && (
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50 transition-colors"><FiMinus size={16} /></button>
                  <span className="px-4 font-medium min-w-[40px] text-center text-base">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} className="p-3 hover:bg-gray-50 transition-colors"><FiPlus size={16} /></button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Button size="lg" className="flex-1" onClick={() => { add(product, qty); }} disabled={product.countInStock === 0}>
                <FiShoppingCart size={18} /> Add to Cart — {formatPrice(product.price * qty)}
              </Button>
              <button onClick={() => toggle(product)} className={`p-3.5 rounded-lg border transition-colors flex items-center justify-center gap-2 ${isInWishlist(product._id) ? 'border-danger text-danger bg-danger/5' : 'border-border hover:bg-gray-50 text-textMuted'}`}>
                <FiHeart size={20} /> <span className="text-sm hidden sm:inline">Wishlist</span>
              </button>
              {product.countInStock > 0 && (
                <Button variant="accent" size="lg" className="sm:flex-1" onClick={() => { add(product, qty); navigate('/checkout'); }}>
                  Buy Now
                </Button>
              )}
            </div>

            <hr className="border-border mb-5" />

            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm text-textMuted">Share:</span>
              <button onClick={handleCopyLink} className="p-2 rounded-lg hover:bg-gray-100 text-textMuted transition-colors" title="Copy link"><FiShare2 size={16} /></button>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} at ShopNest!`)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-textMuted transition-colors"><FaTwitter size={16} /></a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} at ShopNest! ${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-gray-100 text-textMuted transition-colors"><FaWhatsapp size={16} /></a>
            </div>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link key={tag} to={`/shop?search=${encodeURIComponent(tag)}`} className="text-xs bg-gray-100 text-textMuted px-3 py-1.5 rounded-full hover:bg-secondary/10 hover:text-secondary transition-colors">{tag}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="border-b border-border mb-6">
            <div className="flex gap-6 -mb-px">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-secondary text-secondary' : 'border-transparent text-textMuted hover:text-primary'}`}>
                  {tab}{tab === 'reviews' ? ` (${reviews.length || product.numReviews})` : ''}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none text-textMuted">
              <p className="leading-relaxed whitespace-pre-line">{product.richDescription || product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-lg">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border"><td className="py-3 font-medium text-textMuted w-40">Brand</td><td className="py-3">{product.brand || 'N/A'}</td></tr>
                  <tr className="border-b border-border"><td className="py-3 font-medium text-textMuted">Category</td><td className="py-3">{product.category}</td></tr>
                  <tr className="border-b border-border"><td className="py-3 font-medium text-textMuted">Weight</td><td className="py-3">N/A</td></tr>
                  <tr className="border-b border-border"><td className="py-3 font-medium text-textMuted">Dimensions</td><td className="py-3">N/A</td></tr>
                  <tr className="border-b border-border"><td className="py-3 font-medium text-textMuted">Condition</td><td className="py-3">New</td></tr>
                  <tr className="border-b border-border"><td className="py-3 font-medium text-textMuted">SKU</td><td className="py-3 font-mono text-xs">#{product._id?.slice(-8).toUpperCase()}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviewsLoading ? (
                <div className="py-8 text-center"><Spinner /></div>
              ) : reviews.length === 0 ? (
                <p className="text-textMuted text-sm mb-6">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {reviews.map((review) => <ReviewCard key={review._id} review={review} />)}
                </div>
              )}

              <div className="card p-6 max-w-lg">
                {isAuthenticated ? (
                  <>
                    <h4 className="font-heading font-semibold mb-4">Write a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-textMuted mb-2">Your Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className={`text-2xl transition-colors ${star <= reviewForm.rating ? 'text-accent' : 'text-gray-300 hover:text-accent/50'}`}>
                              <FiStar fill={star <= reviewForm.rating ? 'currentColor' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-textMuted mb-1">Comment</label>
                        <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm resize-none" placeholder="Share your thoughts about this product..." />
                      </div>
                      <Button type="submit" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-textMuted text-sm mb-3">Please log in to write a review</p>
                    <Link to={`/login?redirect=/product/${id}`}><Button variant="outline" size="sm">Login</Button></Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="pt-8 border-t border-border">
            <ProductCarousel title="Related Products" products={related} />
          </div>
        )}
      </div>
    </>
  );
}
