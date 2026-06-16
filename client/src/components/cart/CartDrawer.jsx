import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyState from '../ui/EmptyState';

export default function CartDrawer() {
  const { items, total, isOpen, close, clear } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={close} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FiShoppingBag size={18} />
                <span className="font-heading font-semibold">Cart ({items.length})</span>
              </div>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState icon={FiShoppingBag} title="Your cart is empty" description="Looks like you haven't added anything yet" actionLabel="Shop Now" onAction={() => { close(); window.location.href = '/shop'; }} />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {items.map((item) => <CartItem key={item._id} item={item} />)}
                </div>
                <div className="border-t border-border p-4 space-y-4">
                  <CartSummary total={total} />
                  <div className="flex gap-2">
                    <button onClick={clear} className="flex-1 py-2.5 text-sm text-textMuted hover:text-danger transition-colors">Clear</button>
                    <Link to="/checkout" onClick={close} className="flex-1 bg-accent text-white text-center py-2.5 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                      Checkout
                    </Link>
                  </div>
                  <Link to="/cart" onClick={close} className="block text-center text-sm text-textMuted hover:text-primary transition-colors">View Full Cart</Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
