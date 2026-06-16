import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { FiCheckCircle, FiShoppingBag } from 'react-icons/fi';

export default function OrderSuccessPage() {
  const { id } = useParams();

  useEffect(() => {
    const loadConfetti = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        const duration = 3000;
        const end = Date.now() + duration;
        const frame = () => {
          confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#6366F1', '#F59E0B', '#10B981'] });
          confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#6366F1', '#F59E0B', '#10B981'] });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      } catch {}
    };
    loadConfetti();
  }, []);

  return (
    <>
      <Helmet><title>Order Placed — ShopNest</title></Helmet>
      <div className="container-custom py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={48} className="text-success" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Thank you for your order!</h1>
          <p className="text-textMuted mb-2">Your order has been placed successfully.</p>
          <p className="text-sm font-mono bg-gray-100 inline-block px-4 py-2 rounded-lg mb-6">
            Order #: <span className="font-semibold">{id}</span>
          </p>
          <p className="text-sm text-textMuted mb-8 flex items-center justify-center gap-1">
            🚚 Estimated delivery: <span className="font-medium">5-7 business days</span>
          </p>
          <div className="flex justify-center gap-3">
            <Link to={`/orders/${id}`}><Button size="lg"><FiShoppingBag size={16} /> View Order Details</Button></Link>
            <Link to="/shop"><Button variant="outline" size="lg">Continue Shopping</Button></Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
