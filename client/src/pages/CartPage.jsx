import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/formatPrice';
import { FiShoppingBag, FiTrash2, FiMinus, FiPlus, FiHeart, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const PROMO_CODES = { SAVE10: 0.1, NEWUSER: 0.15, FREESHIP: { type: 'freeship' } };

export default function CartPage() {
  const { items, total, updateQty, remove, clear } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const shipping = total >= 50 ? 0 : 9.99;
  const tax = total * 0.085;
  const discount = promoApplied && promoApplied !== 'FREESHIP' ? total * PROMO_CODES[promoApplied] : 0;
  const finalShipping = promoApplied === 'FREESHIP' ? 0 : shipping;
  const grandTotal = total - discount + finalShipping + tax;

  const handleApplyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setPromoApplied(code);
      setPromoError('');
      toast.success(`Promo "${code}" applied!`);
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(null);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoInput('');
    toast.success('Promo code removed');
  };

  const handleMoveToWishlist = (item) => {
    if (!isInWishlist(item._id)) toggle(item);
    remove(item._id);
    toast.success('Moved to wishlist');
  };

  return (
    <>
      <Helmet><title>Shopping Cart — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-heading font-bold">Shopping Cart ({items.length})</h1>
          {items.length > 0 && (
            <button onClick={() => { clear(); toast.success('Cart cleared'); }} className="text-sm text-textMuted hover:text-danger transition-colors">Clear Cart</button>
          )}
        </div>
        {items.length === 0 ? (
          <EmptyState icon={FiShoppingBag} title="Your cart is empty" description="Browse our collection and add items you love" actionLabel="Continue Shopping" onAction={() => window.location.href = '/shop'} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="card p-4">
                  <div className="flex gap-4">
                    <Link to={`/product/${item._id}`} className="shrink-0">
                      <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/product/${item._id}`} className="text-sm font-medium hover:text-secondary transition-colors line-clamp-2">{item.name}</Link>
                          <p className="text-xs text-textMuted mt-0.5">{item.category}</p>
                        </div>
                        <p className="text-base font-bold text-primary shrink-0">{formatPrice(item.price * item.qty)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border rounded-lg">
                            <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1} className="p-1.5 hover:bg-gray-50 transition-colors disabled:opacity-30"><FiMinus size={14} /></button>
                            <span className="px-3 font-medium text-sm min-w-[30px] text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item._id, item.qty + 1)} className="p-1.5 hover:bg-gray-50 transition-colors"><FiPlus size={14} /></button>
                          </div>
                          <span className="text-sm text-textMuted">{formatPrice(item.price)} each</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleMoveToWishlist(item)} className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isInWishlist(item._id) ? 'text-danger' : 'text-textMuted'}`} title="Move to wishlist"><FiHeart size={15} /></button>
                          <button onClick={() => { remove(item._id); toast.success('Item removed'); }} className="p-2 rounded-lg hover:bg-gray-100 text-textMuted hover:text-danger transition-colors" title="Remove"><FiTrash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-textMuted hover:text-primary transition-colors"><FiArrowLeft size={14} /> Continue Shopping</Link>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="card p-6 sticky top-24">
                <h3 className="font-heading font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-textMuted">Subtotal</span><span>{formatPrice(total)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-success"><span>Discount ({promoApplied})</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between"><span className="text-textMuted">Shipping</span><span>{finalShipping === 0 ? 'FREE' : formatPrice(finalShipping)}</span></div>
                  {total < 50 && promoApplied !== 'FREESHIP' && <p className="text-xs text-accent">Add {formatPrice(50 - total)} more for free shipping</p>}
                  <div className="flex justify-between"><span className="text-textMuted">Tax (8.5%)</span><span>{formatPrice(tax)}</span></div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold text-primary text-base"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
                </div>
                <Link to="/checkout" className="block mt-5"><Button variant="accent" className="w-full" size="lg">Proceed to Checkout</Button></Link>

                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-textMuted mb-2">Promo Code</p>
                  <div className="flex gap-2">
                    <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="Enter code" className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" disabled={!!promoApplied} onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()} />
                    {promoApplied ? (
                      <button onClick={handleRemovePromo} className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-gray-50"><FiX size={16} /></button>
                    ) : (
                      <button onClick={handleApplyPromo} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Apply</button>
                    )}
                  </div>
                  {promoError && <p className="text-xs text-danger mt-1">{promoError}</p>}
                  {promoApplied && <p className="text-xs text-success mt-1 flex items-center gap-1"><FiCheck size={12} /> Code applied!</p>}
                  <p className="text-xs text-textMuted mt-2">Try: SAVE10, NEWUSER, FREESHIP</p>
                </div>
              </div>

              <div className="card p-4 space-y-3 text-center">
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1">🔒 Secure Checkout</span>
                  <span className="flex items-center gap-1">🚚 Free Returns</span>
                  <span className="flex items-center gap-1">⭐ 5-Star Service</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-xl text-textMuted">
                  <span className="text-xs font-bold">Visa</span>
                  <span className="text-xs font-bold">MC</span>
                  <span className="text-xs font-bold">PayPal</span>
                  <span className="text-xs font-bold">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
